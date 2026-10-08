import { esAdministrador } from '../../store/authReducer.js';

// Secciones del panel. soloAdmin: el vendedor no las ve.
export const SECCIONES = [
  { ruta: '/admin', texto: 'Dashboard', icono: 'bi-speedometer2', end: true, descripcion: 'Visión general de las métricas y estadísticas clave.' },
  { ruta: '/admin/ordenes', texto: 'Órdenes', icono: 'bi-receipt', descripcion: 'Gestión y seguimiento de las órdenes de compra.' },
  { ruta: '/admin/productos', texto: 'Productos', icono: 'bi-box-seam', descripcion: 'Inventario y detalle de los productos disponibles.' },
  { ruta: '/admin/categorias', texto: 'Categorías', icono: 'bi-tags', descripcion: 'Organiza los productos en categorías.' },
  { ruta: '/admin/usuarios', texto: 'Usuarios', icono: 'bi-people', soloAdmin: true, descripcion: 'Cuentas de usuario y sus roles dentro del sistema.' },
  { ruta: '/admin/reportes', texto: 'Reportes', icono: 'bi-bar-chart-line', soloAdmin: true, descripcion: 'Informes de ventas y operaciones de la tienda.' },
];

export const seccionesVisibles = (sesion) =>
  SECCIONES.filter((s) => !s.soloAdmin || esAdministrador(sesion));
