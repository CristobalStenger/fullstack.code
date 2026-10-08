import { describe, expect, it } from 'vitest';
import { usuariosIniciales } from '../data/usuariosIniciales.js';
import {
  authReducer,
  buscarCredenciales,
  crearEstadoAuth,
  esAdministrador,
  puedeVerPanel,
} from './authReducer.js';

const iniciar = (sesion = null) => crearEstadoAuth(usuariosIniciales.map((u) => ({ ...u })), sesion);

const nuevo = {
  run: '111111111',
  nombre: 'Lucía',
  apellidos: 'Pérez',
  correo: 'lucia@gmail.com',
  clave: 'clave1',
  clave2: 'clave1',
  fechaNacimiento: '',
  tipo: 'Vendedor',
  region: 'Región de Coquimbo',
  comuna: 'La Serena',
  direccion: 'Calle 1',
  terminos: true,
};

describe('sesión y roles', () => {
  it('busca credenciales sin distinguir mayúsculas en el correo', () => {
    expect(buscarCredenciales(usuariosIniciales, ' ADMIN@duoc.cl ', 'admin123')?.tipo).toBe('Administrador');
    expect(buscarCredenciales(usuariosIniciales, 'admin@duoc.cl', 'otra')).toBeNull();
  });

  it('inicia sesión sin guardar la clave y la cierra', () => {
    const conSesion = authReducer(iniciar(), { type: 'INGRESAR', correo: 'cliente@gmail.com', clave: 'cliente123' });
    expect(conSesion.sesion).toMatchObject({ nombre: 'Pedro', tipo: 'Cliente' });
    expect(conSesion.sesion).not.toHaveProperty('clave');
    expect(authReducer(conSesion, { type: 'SALIR' }).sesion).toBeNull();
    expect(authReducer(iniciar(), { type: 'INGRESAR', correo: 'x@gmail.com', clave: '1234' }).sesion).toBeNull();
  });

  it('distingue los permisos de cada rol', () => {
    expect(puedeVerPanel({ tipo: 'Vendedor' })).toBe(true);
    expect(puedeVerPanel({ tipo: 'Cliente' })).toBe(false);
    expect(esAdministrador({ tipo: 'Vendedor' })).toBe(false);
    expect(puedeVerPanel(null)).toBe(false);
  });
});

describe('CRUD de usuarios', () => {
  it('registra clientes nuevos aunque pidan otro rol', () => {
    const estado = authReducer(iniciar(), { type: 'REGISTRAR', datos: { ...nuevo, tipo: 'Administrador' } });
    expect(estado.usuarios).toHaveLength(4);
    expect(estado.usuarios[3].tipo).toBe('Cliente');
  });

  it('rechaza registros inválidos o repetidos', () => {
    expect(authReducer(iniciar(), { type: 'REGISTRAR', datos: { ...nuevo, terminos: false } }).usuarios).toHaveLength(3);
    expect(authReducer(iniciar(), { type: 'REGISTRAR', datos: { ...nuevo, correo: 'admin@duoc.cl' } }).aviso.tipo).toBe('danger');
  });

  it('el administrador crea y edita usuarios con su rol', () => {
    const creado = authReducer(iniciar(), { type: 'GUARDAR_USUARIO', runOriginal: null, datos: nuevo });
    expect(creado.usuarios[3].tipo).toBe('Vendedor');
    const editado = authReducer(creado, { type: 'GUARDAR_USUARIO', runOriginal: '111111111', datos: { ...nuevo, nombre: 'Lucía Andrea' } });
    expect(editado.usuarios[3].nombre).toBe('Lucía Andrea');
    expect(editado.usuarios).toHaveLength(4);
    expect(authReducer(iniciar(), { type: 'GUARDAR_USUARIO', runOriginal: '999', datos: nuevo }).aviso.tipo).toBe('warning');
    expect(authReducer(iniciar(), { type: 'GUARDAR_USUARIO', runOriginal: null, datos: { ...nuevo, tipo: '' } }).aviso.tipo).toBe('danger');
  });

  it('actualiza la sesión cuando el usuario edita su propio perfil', () => {
    const admin = usuariosIniciales[0];
    const sesion = { run: admin.run, nombre: admin.nombre, tipo: admin.tipo };
    const estado = authReducer(iniciar(sesion), {
      type: 'GUARDAR_USUARIO',
      runOriginal: admin.run,
      datos: { ...admin, nombre: 'Administradora' },
    });
    expect(estado.sesion.nombre).toBe('Administradora');
  });

  it('elimina usuarios, pero nunca la cuenta en uso', () => {
    const sesion = { run: '190110222', tipo: 'Administrador' };
    expect(authReducer(iniciar(sesion), { type: 'ELIMINAR_USUARIO', run: '21456789K' }).usuarios).toHaveLength(2);
    const propia = authReducer(iniciar(sesion), { type: 'ELIMINAR_USUARIO', run: '190110222' });
    expect(propia.usuarios).toHaveLength(3);
    expect(propia.aviso.tipo).toBe('danger');
    expect(authReducer(iniciar(), { type: 'ELIMINAR_USUARIO', run: 'nadie' }).aviso.tipo).toBe('warning');
  });

  it('cierra avisos e ignora acciones desconocidas', () => {
    const conAviso = authReducer(iniciar(), { type: 'SALIR' });
    expect(authReducer(conAviso, { type: 'CERRAR_AVISO' }).aviso).toBeNull();
    expect(authReducer(conAviso, { type: 'OTRA' })).toBe(conAviso);
  });
});
