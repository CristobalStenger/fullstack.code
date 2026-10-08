import { describe, expect, it, vi } from 'vitest';
import { productosIniciales } from '../data/productosIniciales.js';
import { usuariosIniciales } from '../data/usuariosIniciales.js';
import { CLAVES, guardarJSON, leerJSON } from './storage.js';
import {
  cargarSesion,
  cargarTienda,
  cargarUsuarios,
  crearSesion,
  guardarAutenticacion,
  guardarMensaje,
  guardarTienda,
} from './persistencia.js';

describe('almacenamiento seguro', () => {
  it('lee la alternativa si la clave no existe o el JSON está corrupto', () => {
    expect(leerJSON('NO_EXISTE', 'x')).toBe('x');
    localStorage.setItem('ROTO', '{invalido');
    expect(leerJSON('ROTO', [])).toEqual([]);
  });

  it('guarda, borra con null e informa si el navegador rechaza la escritura', () => {
    expect(guardarJSON('CLAVE', { a: 1 })).toBe(true);
    expect(leerJSON('CLAVE')).toEqual({ a: 1 });
    expect(guardarJSON('CLAVE', null)).toBe(true);
    expect(localStorage.getItem('CLAVE')).toBeNull();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Sin espacio');
    });
    expect(guardarJSON('CLAVE', 1)).toBe(false);
  });
});

describe('persistencia de la tienda', () => {
  it('parte con los datos iniciales y recupera lo guardado', () => {
    const inicial = cargarTienda();
    expect(inicial.productos).toHaveLength(40);
    expect(inicial.categorias).toHaveLength(4);
    expect(inicial.ordenes.length).toBeGreaterThan(0);
    expect(guardarTienda({ ...inicial, carrito: [{ id: 1, cantidad: 2 }], cupon: { codigo: 'FELIZ18', descuento: 10 } })).toBe(true);
    const recuperada = cargarTienda();
    expect(recuperada.carrito).toEqual([{ id: 1, cantidad: 2 }]);
    expect(recuperada.cupon).toEqual({ codigo: 'FELIZ18', descuento: 10 });
  });

  it('se recupera de JSON corrupto y de estructuras inválidas', () => {
    localStorage.setItem(CLAVES.productos, '{invalido');
    expect(cargarTienda().productos).toHaveLength(40);
    localStorage.setItem(CLAVES.productos, JSON.stringify([{ id: 'x' }]));
    localStorage.setItem(CLAVES.carrito, JSON.stringify('incorrecto'));
    expect(cargarTienda().productos).toHaveLength(40);
    expect(cargarTienda().carrito).toEqual([]);
  });

  it('respeta un catálogo vacío y rechaza ids repetidos', () => {
    localStorage.setItem(CLAVES.productos, JSON.stringify([]));
    expect(cargarTienda().productos).toEqual([]);
    localStorage.setItem(CLAVES.productos, JSON.stringify([productosIniciales[0], productosIniciales[0]]));
    expect(cargarTienda().productos).toHaveLength(40);
  });

  it('limpia productos inexistentes, cantidades inválidas, filas duplicadas y cupones falsos', () => {
    localStorage.setItem(
      CLAVES.carrito,
      JSON.stringify([
        { id: 1, cantidad: 2 },
        { id: 1, cantidad: 2 },
        { id: 999, cantidad: 1 },
        { id: 2, cantidad: -1 },
      ]),
    );
    localStorage.setItem(CLAVES.cupon, JSON.stringify({ codigo: 'FALSO', descuento: 99 }));
    const estado = cargarTienda();
    expect(estado.carrito).toEqual([{ id: 1, cantidad: 2 }]);
    expect(estado.cupon).toBeNull();
  });
});

describe('usuarios, sesión y mensajes', () => {
  it('siempre deja al menos una cuenta de administrador', () => {
    localStorage.setItem(CLAVES.usuarios, JSON.stringify([]));
    expect(cargarUsuarios()).toHaveLength(usuariosIniciales.length);
  });

  it('la sesión nunca guarda la contraseña', () => {
    expect(crearSesion(usuariosIniciales[0])).not.toHaveProperty('clave');
  });

  it('solo restaura una sesión que corresponda a un usuario existente', () => {
    const usuarios = cargarUsuarios();
    guardarAutenticacion({ usuarios, sesion: crearSesion(usuarios[0]) });
    expect(cargarSesion(usuarios)?.correo).toBe('admin@duoc.cl');
    localStorage.setItem(CLAVES.sesion, JSON.stringify({ run: '190110222', tipo: 'Cliente' }));
    expect(cargarSesion(usuarios)).toBeNull();
  });

  it('acumula los mensajes de contacto', () => {
    guardarMensaje({ nombre: 'Ana' });
    guardarMensaje({ nombre: 'Luis' });
    expect(leerJSON(CLAVES.mensajes)).toHaveLength(2);
  });
});
