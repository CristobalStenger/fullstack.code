// ============================================================
// NexusTech - Fuente de datos simulada: órdenes de ejemplo
// Sirven para que el dashboard, los reportes y el historial de
// compras tengan información desde el primer uso.
// ============================================================

import { productosIniciales } from './productosIniciales.js';
import { COSTO_DESPACHO } from './configuracion.js';

const cliente = {
  run: '21456789K',
  nombre: 'Pedro',
  apellidos: 'Soto Fuentes',
  correo: 'cliente@gmail.com',
};

const direccionCliente = {
  calle: 'Los Crisantemos 789, Edificio Norte',
  departamento: 'Depto 603',
  region: 'Región Metropolitana',
  comuna: 'Providencia',
  indicaciones: 'Si no estoy, dejar con el conserje.',
};

function crearOrden({ numero, fecha, comprador, entrega, lineas, estado = 'pagada', motivo = '', cupon = null }) {
  const items = lineas.map(([id, cantidad]) => {
    const p = productosIniciales.find((producto) => producto.id === id);
    return {
      id: p.id,
      codigo: p.codigo,
      nombre: p.nombre,
      categoria: p.categoria,
      imagen: p.imagen,
      precio: Math.round(p.precio * (1 - p.descuento / 100)),
      cantidad,
    };
  });
  const subtotal = items.reduce((total, i) => total + i.precio * i.cantidad, 0);
  const descuento = cupon ? Math.round((subtotal * cupon.descuento) / 100) : 0;
  const envio = entrega.tipo === 'despacho' ? COSTO_DESPACHO : 0;
  const dia = fecha.slice(0, 10).replaceAll('-', '');
  return {
    numero,
    codigo: `ORD-${dia}-${numero}`,
    fecha,
    estado,
    motivo,
    cliente: comprador,
    entrega,
    pago: { tarjeta: estado === 'pagada' ? '**** 4242' : '**** 0000' },
    cupon,
    items,
    subtotal,
    descuento,
    envio,
    total: subtotal - descuento + envio,
  };
}

export const ordenesIniciales = [
  crearOrden({
    numero: 1001,
    fecha: '2026-09-14T15:20:00.000Z',
    comprador: cliente,
    entrega: { ...direccionCliente, tipo: 'despacho' },
    lineas: [
      [1, 1],
      [9, 2],
    ],
  }),
  crearOrden({
    numero: 1002,
    fecha: '2026-09-21T19:05:00.000Z',
    comprador: {
      run: '',
      nombre: 'Camila',
      apellidos: 'Herrera Díaz',
      correo: 'camila.herrera@gmail.com',
    },
    entrega: {
      calle: 'Av. Libertad 1020',
      departamento: '',
      region: 'Región de Valparaíso',
      comuna: 'Viña del Mar',
      indicaciones: '',
      tipo: 'despacho',
    },
    lineas: [
      [29, 1],
      [18, 1],
    ],
    cupon: { codigo: 'FELIZ18', descuento: 10 },
  }),
  crearOrden({
    numero: 1003,
    fecha: '2026-09-28T13:45:00.000Z',
    comprador: cliente,
    entrega: { ...direccionCliente, tipo: 'retiro' },
    lineas: [[21, 2]],
    estado: 'rechazada',
    motivo: 'La tarjeta fue rechazada por el banco emisor.',
  }),
  crearOrden({
    numero: 1004,
    fecha: '2026-09-28T13:52:00.000Z',
    comprador: cliente,
    entrega: { ...direccionCliente, tipo: 'retiro' },
    lineas: [
      [21, 2],
      [17, 1],
    ],
  }),
  crearOrden({
    numero: 1005,
    fecha: '2026-10-03T22:10:00.000Z',
    comprador: {
      run: '',
      nombre: 'Ignacio',
      apellidos: 'Morales Vera',
      correo: 'ignacio.morales@duoc.cl',
    },
    entrega: {
      calle: 'Pasaje Los Olmos 55',
      departamento: '',
      region: 'Región del Biobío',
      comuna: 'Concepción',
      indicaciones: 'Casa con reja verde.',
      tipo: 'despacho',
    },
    lineas: [
      [35, 1],
      [24, 1],
      [28, 1],
    ],
  }),
];
