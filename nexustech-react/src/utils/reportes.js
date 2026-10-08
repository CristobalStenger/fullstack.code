// ============================================================
// NexusTech - Cálculos para el dashboard y los reportes
// Funciones puras sobre órdenes y productos.
// ============================================================

import { diaChile, esStockCritico } from './formatos.js';

export const ordenesPagadas = (ordenes) => ordenes.filter((o) => o.estado === 'pagada');

export function resumenVentas(ordenes) {
  const pagadas = ordenesPagadas(ordenes);
  const totalVentas = pagadas.reduce((total, o) => total + o.total, 0);
  const unidades = pagadas.reduce(
    (total, o) => total + o.items.reduce((suma, i) => suma + i.cantidad, 0),
    0,
  );
  return {
    totalVentas,
    pagadas: pagadas.length,
    rechazadas: ordenes.length - pagadas.length,
    unidades,
    ticketPromedio: pagadas.length ? Math.round(totalVentas / pagadas.length) : 0,
  };
}

// Agrupa una lista en un objeto { clave: acumulado } y lo devuelve como arreglo ordenado
function agrupar(lista, obtenerClave, acumular, inicial) {
  const grupos = new Map();
  for (const elemento of lista) {
    const clave = obtenerClave(elemento);
    grupos.set(clave, acumular(grupos.get(clave) ?? inicial(clave), elemento));
  }
  return [...grupos.values()];
}

const conPorcentaje = (filas, campo) => {
  const total = filas.reduce((suma, f) => suma + f[campo], 0);
  return filas.map((f) => ({ ...f, porcentaje: total ? Math.round((f[campo] / total) * 100) : 0 }));
};

export function ventasPorCategoria(ordenes) {
  const items = ordenesPagadas(ordenes).flatMap((o) => o.items);
  const filas = agrupar(
    items,
    (i) => i.categoria,
    (fila, i) => ({ ...fila, unidades: fila.unidades + i.cantidad, total: fila.total + i.precio * i.cantidad }),
    (categoria) => ({ categoria, unidades: 0, total: 0 }),
  );
  return conPorcentaje(filas, 'total').sort((a, b) => b.total - a.total);
}

export function ventasPorDia(ordenes) {
  return agrupar(
    ordenesPagadas(ordenes),
    (o) => diaChile(o.fecha),
    (fila, o) => ({ ...fila, ordenes: fila.ordenes + 1, total: fila.total + o.total }),
    (dia) => ({ dia, ordenes: 0, total: 0 }),
  ).sort((a, b) => b.dia.localeCompare(a.dia));
}

export function productosMasVendidos(ordenes, limite = 5) {
  const items = ordenesPagadas(ordenes).flatMap((o) => o.items);
  return agrupar(
    items,
    (i) => i.id,
    (fila, i) => ({ ...fila, unidades: fila.unidades + i.cantidad, total: fila.total + i.precio * i.cantidad }),
    (id) => ({ id, nombre: items.find((i) => i.id === id).nombre, unidades: 0, total: 0 }),
  )
    .sort((a, b) => b.unidades - a.unidades || b.total - a.total)
    .slice(0, limite);
}

export function inventarioPorCategoria(productos) {
  const filas = agrupar(
    productos,
    (p) => p.categoria,
    (fila, p) => ({
      ...fila,
      productos: fila.productos + 1,
      unidades: fila.unidades + p.stock,
      valor: fila.valor + p.precio * p.stock,
      criticos: fila.criticos + (esStockCritico(p) ? 1 : 0),
    }),
    (categoria) => ({ categoria, productos: 0, unidades: 0, valor: 0, criticos: 0 }),
  );
  return conPorcentaje(filas, 'valor').sort((a, b) => b.valor - a.valor);
}

export function entregasPorTipo(ordenes) {
  const pagadas = ordenesPagadas(ordenes);
  return {
    despacho: pagadas.filter((o) => o.entrega.tipo === 'despacho').length,
    retiro: pagadas.filter((o) => o.entrega.tipo === 'retiro').length,
  };
}

// Historial de un usuario: órdenes con su RUN o su correo
export const ordenesDeUsuario = (ordenes, usuario) =>
  ordenes.filter(
    (o) =>
      (o.cliente.run && o.cliente.run === usuario.run) ||
      o.cliente.correo.toLowerCase() === usuario.correo.toLowerCase(),
  );

export const productosCriticos = (productos) =>
  productos.filter(esStockCritico).sort((a, b) => a.stock - b.stock);
