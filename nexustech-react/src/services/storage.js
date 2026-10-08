// ============================================================
// NexusTech - Acceso seguro a localStorage
// Centraliza las claves y atrapa los errores del navegador
// (JSON corrupto, almacenamiento lleno o bloqueado).
// ============================================================

// Se mantienen los nombres de clave de la entrega 1
export const CLAVES = {
  productos: 'PRODUCTOS_NEXUSTECH',
  categorias: 'CATEGORIAS_NEXUSTECH',
  usuarios: 'USUARIOS_NEXUSTECH',
  sesion: 'USUARIO_ACTIVO',
  carrito: 'CARRITO_NEXUSTECH',
  cupon: 'CUPON_NEXUSTECH',
  ordenes: 'ORDENES_NEXUSTECH',
  mensajes: 'MENSAJES_NEXUSTECH',
};

export function leerJSON(clave, alternativa) {
  try {
    const valor = localStorage.getItem(clave);
    return valor === null ? alternativa : JSON.parse(valor);
  } catch {
    return alternativa;
  }
}

// null o undefined borran la clave. Devuelve false si el navegador rechaza la escritura.
export function guardarJSON(clave, valor) {
  try {
    if (valor === null || valor === undefined) localStorage.removeItem(clave);
    else localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}
