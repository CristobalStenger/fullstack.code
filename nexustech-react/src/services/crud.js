// ============================================================
// NexusTech - Operaciones CRUD genéricas sobre colecciones
// Funciones puras: reciben un arreglo y devuelven uno nuevo,
// sin modificar el original. Las usan los reducers para
// crear, leer, actualizar y eliminar productos, categorías,
// usuarios y órdenes.
// ============================================================

// Leer: todos los elementos o solo los que cumplan el filtro
export const listar = (coleccion, filtro) =>
  filtro ? coleccion.filter(filtro) : [...coleccion];

// Leer: un elemento por su clave (id por defecto)
export const obtener = (coleccion, valor, campo = 'id') =>
  coleccion.find((elemento) => elemento[campo] === valor) ?? null;

export const existe = (coleccion, valor, campo = 'id') =>
  coleccion.some((elemento) => elemento[campo] === valor);

// Id correlativo: el mayor existente + 1
export const siguienteId = (coleccion, campo = 'id', inicial = 1) =>
  coleccion.length
    ? Math.max(...coleccion.map((elemento) => elemento[campo])) + 1
    : inicial;

// Crear: agrega al final
export const crear = (coleccion, elemento) => [...coleccion, elemento];

// Actualizar: mezcla los cambios conservando la clave original
export const actualizar = (coleccion, valor, cambios, campo = 'id') =>
  coleccion.map((elemento) =>
    elemento[campo] === valor ? { ...elemento, ...cambios } : elemento,
  );

// Eliminar: deja fuera el elemento indicado
export const eliminar = (coleccion, valor, campo = 'id') =>
  coleccion.filter((elemento) => elemento[campo] !== valor);
