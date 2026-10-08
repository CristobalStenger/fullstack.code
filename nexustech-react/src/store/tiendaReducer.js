// ============================================================
// NexusTech - Reducer de la tienda
// Función pura: recibe el estado y una acción y devuelve el
// estado siguiente, sin tocar el DOM ni localStorage.
// Estado: { productos, categorias, ordenes, carrito, cupon, aviso }
// ============================================================

import { COSTO_DESPACHO, NUMERO_ORDEN_INICIAL, SUFIJO_TARJETA_RECHAZADA } from '../data/configuracion.js';
import { CUPONES } from '../data/cupones.js';
import { actualizar, crear, eliminar, obtener, siguienteId } from '../services/crud.js';
import { crearSlug, enmascararTarjeta, precioFinal } from '../utils/formatos.js';
import {
  convertirProducto,
  sinErrores,
  validarCategoria,
  validarProducto,
} from '../utils/validaciones.js';

export function crearEstado({
  productos = [],
  categorias = [],
  ordenes = [],
  carrito = [],
  cupon = null,
} = {}) {
  return { productos, categorias, ordenes, carrito, cupon, aviso: null };
}

// ---------- Valores derivados (no se guardan) ----------

export function detalleCarrito(estado) {
  return estado.carrito
    .map((item) => {
      const producto = obtener(estado.productos, item.id);
      return producto
        ? { ...producto, precioUnitario: precioFinal(producto), cantidad: item.cantidad }
        : null;
    })
    .filter(Boolean);
}

// entrega: null (aún no se elige), 'despacho' o 'retiro'
export function resumenCarrito(estado, entrega = null) {
  const detalle = detalleCarrito(estado);
  const unidades = detalle.reduce((total, p) => total + p.cantidad, 0);
  const subtotal = detalle.reduce((total, p) => total + p.precioUnitario * p.cantidad, 0);
  const descuento = estado.cupon ? Math.round((subtotal * estado.cupon.descuento) / 100) : 0;
  const envio = entrega === 'despacho' && detalle.length ? COSTO_DESPACHO : 0;
  return { unidades, subtotal, descuento, envio, total: subtotal - descuento + envio };
}

export const siguienteNumeroOrden = (ordenes) =>
  siguienteId(ordenes, 'numero', NUMERO_ORDEN_INICIAL + 1);

// Reglas de negocio del pago simulado. Devuelve el motivo del rechazo o ''.
export function evaluarPago(estado, numeroTarjeta = '') {
  const sinStock = estado.carrito
    .filter((item) => {
      const producto = obtener(estado.productos, item.id);
      return !producto || item.cantidad > producto.stock;
    })
    .map((item) => obtener(estado.productos, item.id)?.nombre ?? `Producto ${item.id}`);

  if (sinStock.length)
    return `Stock insuficiente para: ${sinStock.join(', ')}. Revisa las cantidades de tu carrito.`;
  if (String(numeroTarjeta).replace(/\D/g, '').endsWith(SUFIJO_TARJETA_RECHAZADA))
    return 'La tarjeta fue rechazada por el banco emisor.';
  return '';
}

function conAviso(estado, texto, tipo = 'success') {
  return { ...estado, aviso: { texto, tipo, id: (estado.aviso?.id ?? 0) + 1 } };
}

// ---------- Casos del reducer ----------

function agregar(estado, { id, cantidad = 1 }) {
  const producto = obtener(estado.productos, id);
  const item = obtener(estado.carrito, id);
  const nueva = (item?.cantidad ?? 0) + cantidad;
  if (!producto || !Number.isInteger(cantidad) || cantidad < 1 || nueva > producto.stock)
    return conAviso(estado, 'No hay más stock disponible de ese producto.', 'warning');

  const carrito = item
    ? actualizar(estado.carrito, id, { cantidad: nueva })
    : crear(estado.carrito, { id, cantidad });
  return conAviso({ ...estado, carrito }, `${producto.nombre} agregado al carrito.`);
}

function cambiarCantidad(estado, { id, cantidad }) {
  const producto = obtener(estado.productos, id);
  if (!producto || !Number.isInteger(cantidad) || cantidad < 0 || cantidad > producto.stock)
    return conAviso(estado, 'La cantidad debe ser un entero y no superar el stock.', 'warning');

  const carrito =
    cantidad === 0
      ? eliminar(estado.carrito, id)
      : actualizar(estado.carrito, id, { cantidad });
  return { ...estado, carrito, cupon: carrito.length ? estado.cupon : null, aviso: null };
}

function aplicarCupon(estado, { codigo }) {
  const cupon = CUPONES.find((c) => c.codigo === String(codigo).toUpperCase());
  if (!cupon || !estado.carrito.length)
    return conAviso(estado, 'No se pudo aplicar el cupón.', 'danger');
  return conAviso({ ...estado, cupon: { ...cupon } }, `Cupón ${cupon.codigo} aplicado.`);
}

function pagar(estado, accion) {
  if (!estado.carrito.length) return conAviso(estado, 'El carrito está vacío.', 'warning');

  const { cliente, entrega, numeroTarjeta } = accion.datos;
  const numero = obtener(estado.ordenes, accion.numero, 'numero')
    ? siguienteNumeroOrden(estado.ordenes)
    : accion.numero ?? siguienteNumeroOrden(estado.ordenes);
  const fecha = accion.fecha ?? new Date().toISOString();
  const motivo = evaluarPago(estado, numeroTarjeta);
  const resumen = resumenCarrito(estado, entrega.tipo);

  const orden = {
    numero,
    codigo: `ORD-${fecha.slice(0, 10).replaceAll('-', '')}-${numero}`,
    fecha,
    estado: motivo ? 'rechazada' : 'pagada',
    motivo,
    cliente: { ...cliente },
    entrega: { ...entrega },
    pago: { tarjeta: enmascararTarjeta(numeroTarjeta) },
    cupon: estado.cupon,
    items: detalleCarrito(estado).map((p) => ({
      id: p.id,
      codigo: p.codigo,
      nombre: p.nombre,
      categoria: p.categoria,
      imagen: p.imagen,
      precio: p.precioUnitario,
      cantidad: p.cantidad,
    })),
    subtotal: resumen.subtotal,
    descuento: resumen.descuento,
    envio: resumen.envio,
    total: resumen.total,
  };
  const ordenes = crear(estado.ordenes, orden);

  // Pago rechazado: se registra la orden, pero no se toca el stock ni el carrito
  if (motivo) return conAviso({ ...estado, ordenes }, 'No se pudo realizar el pago.', 'danger');

  const productos = estado.productos.map((p) => {
    const item = obtener(estado.carrito, p.id);
    return item ? { ...p, stock: p.stock - item.cantidad } : p;
  });
  return conAviso(
    { ...estado, productos, ordenes, carrito: [], cupon: null },
    `Compra #${numero} realizada con éxito.`,
  );
}

function guardarProducto(estado, { id = null, datos }) {
  if (!sinErrores(validarProducto(datos, estado.productos, id, estado.categorias)))
    return conAviso(estado, 'Revisa los datos del producto.', 'danger');
  if (id !== null && !obtener(estado.productos, id))
    return conAviso(estado, 'El producto ya no existe.', 'warning');

  const convertido = convertirProducto(datos);
  const productos =
    id === null
      ? crear(estado.productos, { id: siguienteId(estado.productos), ...convertido })
      : actualizar(estado.productos, id, convertido);
  return conAviso(
    { ...estado, productos },
    id === null ? `Producto "${convertido.nombre}" creado.` : `Producto "${convertido.nombre}" actualizado.`,
  );
}

function eliminarProducto(estado, { id }) {
  const producto = obtener(estado.productos, id);
  if (!producto) return conAviso(estado, 'El producto ya no existe.', 'warning');
  const carrito = eliminar(estado.carrito, id);
  return conAviso(
    {
      ...estado,
      productos: eliminar(estado.productos, id),
      carrito,
      cupon: carrito.length ? estado.cupon : null,
    },
    `Producto "${producto.nombre}" eliminado del catálogo y del carrito.`,
    'info',
  );
}

function guardarCategoria(estado, { id = null, datos }) {
  if (!sinErrores(validarCategoria(datos, estado.categorias, id)))
    return conAviso(estado, 'Revisa los datos de la categoría.', 'danger');

  const nueva = {
    nombre: datos.nombre.trim(),
    slug: crearSlug(datos.nombre),
    icono: datos.icono || 'bi-tag',
    descripcion: (datos.descripcion ?? '').trim(),
  };

  if (id === null) {
    const categorias = crear(estado.categorias, { id: siguienteId(estado.categorias), ...nueva });
    return conAviso({ ...estado, categorias }, `Categoría "${nueva.nombre}" creada.`);
  }

  const anterior = obtener(estado.categorias, id);
  if (!anterior) return conAviso(estado, 'La categoría ya no existe.', 'warning');
  // Si cambia el nombre, los productos de esa categoría se actualizan también
  const productos = estado.productos.map((p) =>
    p.categoria === anterior.nombre ? { ...p, categoria: nueva.nombre } : p,
  );
  return conAviso(
    { ...estado, productos, categorias: actualizar(estado.categorias, id, nueva) },
    `Categoría "${nueva.nombre}" actualizada.`,
  );
}

function eliminarCategoria(estado, { id }) {
  const categoria = obtener(estado.categorias, id);
  if (!categoria) return conAviso(estado, 'La categoría ya no existe.', 'warning');
  const enUso = estado.productos.filter((p) => p.categoria === categoria.nombre).length;
  if (enUso)
    return conAviso(
      estado,
      `No se puede eliminar "${categoria.nombre}": tiene ${enUso} producto(s).`,
      'danger',
    );
  return conAviso(
    { ...estado, categorias: eliminar(estado.categorias, id) },
    `Categoría "${categoria.nombre}" eliminada.`,
    'info',
  );
}

export function tiendaReducer(estado, accion) {
  switch (accion.type) {
    case 'AGREGAR':
      return agregar(estado, accion);
    case 'CANTIDAD':
      return cambiarCantidad(estado, accion);
    case 'QUITAR': {
      const carrito = eliminar(estado.carrito, accion.id);
      return conAviso(
        { ...estado, carrito, cupon: carrito.length ? estado.cupon : null },
        'Producto retirado del carrito.',
        'info',
      );
    }
    case 'VACIAR':
      return conAviso({ ...estado, carrito: [], cupon: null }, 'El carrito quedó vacío.', 'info');
    case 'APLICAR_CUPON':
      return aplicarCupon(estado, accion);
    case 'QUITAR_CUPON':
      return { ...estado, cupon: null };
    case 'PAGAR':
      return pagar(estado, accion);
    case 'GUARDAR_PRODUCTO':
      return guardarProducto(estado, accion);
    case 'ELIMINAR_PRODUCTO':
      return eliminarProducto(estado, accion);
    case 'GUARDAR_CATEGORIA':
      return guardarCategoria(estado, accion);
    case 'ELIMINAR_CATEGORIA':
      return eliminarCategoria(estado, accion);
    case 'CERRAR_AVISO':
      return { ...estado, aviso: null };
    default:
      return estado;
  }
}
