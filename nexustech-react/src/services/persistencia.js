// ============================================================
// NexusTech - Base de datos simulada en localStorage
// Carga cada colección validando su estructura. Si el JSON está
// corrupto o tiene datos inválidos se usan los datos iniciales
// de src/data. También limpia referencias que ya no existen.
// ============================================================

import { productosIniciales } from '../data/productosIniciales.js';
import { categoriasIniciales } from '../data/categoriasIniciales.js';
import { usuariosIniciales, ROLES } from '../data/usuariosIniciales.js';
import { ordenesIniciales } from '../data/ordenesIniciales.js';
import { CUPONES } from '../data/cupones.js';
import { CLAVES, guardarJSON, leerJSON } from './storage.js';

const esTexto = (v) => typeof v === 'string';
const esEnteroNoNegativo = (v) => Number.isInteger(v) && v >= 0;

export function productoValido(p) {
  return Boolean(
    p &&
      Number.isInteger(p.id) &&
      p.id > 0 &&
      esTexto(p.codigo) &&
      esTexto(p.nombre) &&
      esTexto(p.categoria) &&
      esTexto(p.tipo) &&
      esTexto(p.imagen) &&
      esEnteroNoNegativo(p.precio) &&
      esEnteroNoNegativo(p.stock) &&
      esEnteroNoNegativo(p.stockCritico) &&
      esEnteroNoNegativo(p.descuento ?? 0),
  );
}

export function categoriaValida(c) {
  return Boolean(
    c && Number.isInteger(c.id) && esTexto(c.nombre) && esTexto(c.slug) && esTexto(c.icono),
  );
}

export function usuarioValido(u) {
  return Boolean(
    u &&
      esTexto(u.run) &&
      esTexto(u.nombre) &&
      esTexto(u.correo) &&
      esTexto(u.clave) &&
      ROLES.includes(u.tipo),
  );
}

export function ordenValida(o) {
  return Boolean(
    o &&
      Number.isInteger(o.numero) &&
      ['pagada', 'rechazada'].includes(o.estado) &&
      o.cliente &&
      Array.isArray(o.items) &&
      Number.isFinite(o.total),
  );
}

// Copia profunda para no compartir objetos con los datos iniciales
const copiar = (datos) => JSON.parse(JSON.stringify(datos));

// Devuelve la colección guardada si es un arreglo válido y sin claves repetidas
export function cargarColeccion(clave, semilla, esValido, campo = 'id', { permitirVacia = true } = {}) {
  const guardada = leerJSON(clave, null);
  const valida =
    Array.isArray(guardada) &&
    (permitirVacia || guardada.length > 0) &&
    guardada.every(esValido) &&
    new Set(guardada.map((e) => e[campo])).size === guardada.length;
  return valida ? guardada : copiar(semilla);
}

// El carrito solo guarda { id, cantidad } de productos que existan
export function limpiarCarrito(candidato, productos) {
  const ids = new Set();
  return (Array.isArray(candidato) ? candidato : [])
    .filter((item) => {
      const valido =
        item &&
        Number.isInteger(item.id) &&
        !ids.has(item.id) &&
        Number.isInteger(item.cantidad) &&
        item.cantidad > 0 &&
        productos.some((p) => p.id === item.id);
      if (valido) ids.add(item.id);
      return valido;
    })
    .map((item) => ({ id: item.id, cantidad: item.cantidad }));
}

function cargarCupon() {
  const guardado = leerJSON(CLAVES.cupon, null);
  return CUPONES.find((c) => c.codigo === guardado?.codigo) ?? null;
}

export function cargarTienda() {
  // Un catálogo vacío es válido: no se restauran productos que el admin eliminó
  const productos = cargarColeccion(CLAVES.productos, productosIniciales, productoValido);
  const categorias = cargarColeccion(CLAVES.categorias, categoriasIniciales, categoriaValida);
  const ordenes = cargarColeccion(CLAVES.ordenes, ordenesIniciales, ordenValida, 'numero');
  const carrito = limpiarCarrito(leerJSON(CLAVES.carrito, []), productos);
  const cupon = carrito.length ? cargarCupon() : null;
  return { productos, categorias, ordenes, carrito, cupon, aviso: null };
}

export function guardarTienda({ productos, categorias, ordenes, carrito, cupon }) {
  const resultados = [
    guardarJSON(CLAVES.productos, productos),
    guardarJSON(CLAVES.categorias, categorias),
    guardarJSON(CLAVES.ordenes, ordenes),
    guardarJSON(CLAVES.carrito, carrito),
    guardarJSON(CLAVES.cupon, cupon),
  ];
  return resultados.every(Boolean);
}

// ---------- Usuarios y sesión ----------

export function cargarUsuarios() {
  // Siempre debe existir al menos una cuenta (como crearAdministradorInicial)
  return cargarColeccion(CLAVES.usuarios, usuariosIniciales, usuarioValido, 'run', {
    permitirVacia: false,
  });
}

// La sesión nunca guarda la contraseña
export function crearSesion(usuario) {
  const { run, nombre, apellidos, correo, tipo, region, comuna, direccion } = usuario;
  return { run, nombre, apellidos, correo, tipo, region, comuna, direccion };
}

// Solo se restaura una sesión que corresponda a un usuario existente
export function cargarSesion(usuarios) {
  const guardada = leerJSON(CLAVES.sesion, null);
  const usuario = usuarios.find((u) => u.run === guardada?.run && u.tipo === guardada?.tipo);
  return usuario ? crearSesion(usuario) : null;
}

export function guardarAutenticacion({ usuarios, sesion }) {
  const usuariosOk = guardarJSON(CLAVES.usuarios, usuarios);
  const sesionOk = guardarJSON(CLAVES.sesion, sesion);
  return usuariosOk && sesionOk;
}

// ---------- Mensajes de contacto ----------

export function guardarMensaje(mensaje) {
  const mensajes = leerJSON(CLAVES.mensajes, []);
  const lista = Array.isArray(mensajes) ? mensajes : [];
  return guardarJSON(CLAVES.mensajes, [...lista, mensaje]);
}
