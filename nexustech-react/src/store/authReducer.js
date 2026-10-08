// ============================================================
// NexusTech - Reducer de usuarios y sesión
// Estado: { usuarios, sesion, aviso }
// Roles: Administrador (todo), Vendedor (solo lectura en el
// panel) y Cliente (solo la tienda), como en la entrega 1.
// ============================================================

import { actualizar, crear, eliminar, obtener } from '../services/crud.js';
import { crearSesion } from '../services/persistencia.js';
import { convertirUsuario, sinErrores, validarUsuario } from '../utils/validaciones.js';

export const ROLES_PANEL = ['Administrador', 'Vendedor'];

export const puedeVerPanel = (sesion) => ROLES_PANEL.includes(sesion?.tipo);
export const esAdministrador = (sesion) => sesion?.tipo === 'Administrador';

export function crearEstadoAuth(usuarios = [], sesion = null) {
  return { usuarios, sesion, aviso: null };
}

export function buscarCredenciales(usuarios, correo, clave) {
  const buscado = String(correo).trim().toLowerCase();
  return usuarios.find((u) => u.correo.toLowerCase() === buscado && u.clave === clave) ?? null;
}

function conAviso(estado, texto, tipo = 'success') {
  return { ...estado, aviso: { texto, tipo, id: (estado.aviso?.id ?? 0) + 1 } };
}

function registrar(estado, { datos }) {
  const errores = validarUsuario(datos, estado.usuarios, null, {
    confirmarClave: true,
    conTerminos: true,
  });
  if (!sinErrores(errores)) return conAviso(estado, 'Revisa los datos del registro.', 'danger');
  const usuario = { ...convertirUsuario(datos), tipo: 'Cliente' };
  return conAviso(
    { ...estado, usuarios: crear(estado.usuarios, usuario) },
    'Cuenta creada correctamente. Ya puedes iniciar sesión.',
  );
}

function guardarUsuario(estado, { runOriginal = null, datos }) {
  const errores = validarUsuario(datos, estado.usuarios, runOriginal, { conTipo: true });
  if (!sinErrores(errores)) return conAviso(estado, 'Revisa los datos del usuario.', 'danger');
  if (runOriginal !== null && !obtener(estado.usuarios, runOriginal, 'run'))
    return conAviso(estado, 'El usuario ya no existe.', 'warning');

  const usuario = convertirUsuario(datos);
  const usuarios =
    runOriginal === null
      ? crear(estado.usuarios, usuario)
      : actualizar(estado.usuarios, runOriginal, usuario, 'run');
  // Si el usuario editó su propia cuenta se actualiza la sesión abierta
  const sesion =
    runOriginal !== null && estado.sesion?.run === runOriginal ? crearSesion(usuario) : estado.sesion;

  return conAviso(
    { ...estado, usuarios, sesion },
    runOriginal === null ? `Usuario "${usuario.nombre}" creado.` : `Usuario "${usuario.nombre}" actualizado.`,
  );
}

function eliminarUsuario(estado, { run }) {
  const usuario = obtener(estado.usuarios, run, 'run');
  if (!usuario) return conAviso(estado, 'El usuario ya no existe.', 'warning');
  if (estado.sesion?.run === run)
    return conAviso(estado, 'No puedes eliminar tu propia cuenta mientras la estás usando.', 'danger');
  return conAviso(
    { ...estado, usuarios: eliminar(estado.usuarios, run, 'run') },
    `Usuario "${usuario.nombre}" eliminado.`,
    'info',
  );
}

export function authReducer(estado, accion) {
  switch (accion.type) {
    case 'INGRESAR': {
      const usuario = buscarCredenciales(estado.usuarios, accion.correo, accion.clave);
      if (!usuario) return conAviso(estado, 'Correo o contraseña incorrectos.', 'danger');
      return conAviso(
        { ...estado, sesion: crearSesion(usuario) },
        `Hola de nuevo, ${usuario.nombre}.`,
      );
    }
    case 'SALIR':
      return conAviso({ ...estado, sesion: null }, 'Sesión cerrada. ¡Hasta pronto!', 'info');
    case 'REGISTRAR':
      return registrar(estado, accion);
    case 'GUARDAR_USUARIO':
      return guardarUsuario(estado, accion);
    case 'ELIMINAR_USUARIO':
      return eliminarUsuario(estado, accion);
    case 'CERRAR_AVISO':
      return { ...estado, aviso: null };
    default:
      return estado;
  }
}
