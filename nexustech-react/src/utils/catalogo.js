// ============================================================
// NexusTech - Filtros y orden del catálogo (funciones puras)
// ============================================================

import { normalizar, precioFinal } from './formatos.js';

export const RANGOS_PRECIO = [
  { valor: 'todos', texto: 'Todos los precios' },
  { valor: '0-99999', texto: 'Menos de $100.000' },
  { valor: '100000-299999', texto: '$100.000 a $300.000' },
  { valor: '300000-599999', texto: '$300.000 a $600.000' },
  { valor: '600000-999999', texto: '$600.000 a $1.000.000' },
  { valor: '1000000-99999999', texto: 'Más de $1.000.000' },
];

export const ORDENES = [
  { valor: 'default', texto: 'Sin orden' },
  { valor: 'az', texto: 'Nombre de A a Z' },
  { valor: 'za', texto: 'Nombre de Z a A' },
  { valor: 'menor', texto: 'Precio de menor a mayor' },
  { valor: 'mayor', texto: 'Precio de mayor a menor' },
];

export const FILTROS_VACIOS = {
  texto: '',
  categoria: '',
  tipo: '',
  rango: 'todos',
  disponibilidad: '',
  orden: 'default',
};

const comparadores = {
  az: (a, b) => a.nombre.localeCompare(b.nombre),
  za: (a, b) => b.nombre.localeCompare(a.nombre),
  menor: (a, b) => precioFinal(a) - precioFinal(b),
  mayor: (a, b) => precioFinal(b) - precioFinal(a),
};

// Aplica todos los filtros a la vez. No modifica el arreglo original.
export function filtrarProductos(productos, filtros = {}) {
  const f = { ...FILTROS_VACIOS, ...filtros };
  const busqueda = normalizar(f.texto);
  const [minimo, maximo] =
    f.rango === 'todos' ? [0, Infinity] : f.rango.split('-').map(Number);

  const visibles = productos.filter(
    (p) =>
      (busqueda === '' ||
        normalizar(`${p.nombre} ${p.tipo} ${p.codigo}`).includes(busqueda)) &&
      (!f.categoria || p.categoria === f.categoria) &&
      (!f.tipo || p.tipo === f.tipo) &&
      precioFinal(p) >= minimo &&
      precioFinal(p) <= maximo &&
      (!f.disponibilidad ||
        (f.disponibilidad === 'disponible' ? p.stock > 0 : p.stock === 0)),
  );

  const comparar = comparadores[f.orden];
  return comparar ? [...visibles].sort(comparar) : visibles;
}

// Tipos de producto disponibles (opcionalmente dentro de una categoría)
export function tiposDe(productos, categoria = '') {
  return [
    ...new Set(
      productos
        .filter((p) => !categoria || p.categoria === categoria)
        .map((p) => p.tipo),
    ),
  ].sort((a, b) => a.localeCompare(b));
}

export const productosEnOferta = (productos) =>
  productos
    .filter((p) => (p.descuento ?? 0) > 0)
    .sort((a, b) => b.descuento - a.descuento);
