// ============================================================
// NexusTech - Formatos de precios, textos, fechas y stock
// ============================================================

const formatoCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

export const precioCLP = (valor) => formatoCLP.format(valor);

// Regla de la entrega 1: un producto con precio 0 se muestra como FREE
export const textoPrecio = (valor) => (valor === 0 ? 'FREE' : precioCLP(valor));

// Precio con el porcentaje de descuento de la oferta aplicado
export function precioFinal(producto) {
  const descuento = producto.descuento ?? 0;
  return Math.round(producto.precio * (1 - descuento / 100));
}

export const enOferta = (producto) => (producto.descuento ?? 0) > 0;

// Quita tildes y mayúsculas para comparar textos
export const normalizar = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

// "Periféricos y Audio" -> "perifericos-y-audio"
export const crearSlug = (texto) =>
  normalizar(texto)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const esStockCritico = (producto) =>
  producto.stock <= (producto.stockCritico ?? 0);

export function estadoStock(producto) {
  if (producto.stock <= 0) return { texto: 'Sin stock', variante: 'danger' };
  if (esStockCritico(producto))
    return { texto: `Últimas ${producto.stock} unidades`, variante: 'warning' };
  return { texto: 'Disponible', variante: 'success' };
}

const formatoFecha = new Intl.DateTimeFormat('es-CL', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/Santiago',
});

export const formatearFecha = (iso) => formatoFecha.format(new Date(iso));

// Fecha (AAAA-MM-DD) en horario de Chile, usada para agrupar ventas por día
export const diaChile = (iso) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago' }).format(
    new Date(iso),
  );

// Muestra solo los últimos 4 dígitos de una tarjeta
export function enmascararTarjeta(numero) {
  const digitos = String(numero).replace(/\D/g, '');
  return `**** ${digitos.slice(-4)}`;
}

export const nombreCompleto = (persona) =>
  `${persona?.nombre ?? ''} ${persona?.apellidos ?? ''}`.trim();
