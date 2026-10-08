// ============================================================
// NexusTech - Validaciones de formularios
// Reglas de negocio pedidas por el cliente (entrega 1):
//   - Correos: solo @duoc.cl, @profesor.duoc.cl y @gmail.com
//   - Contraseña: entre 4 y 10 caracteres
//   - RUN: sin puntos ni guion, entre 7 y 9 caracteres (módulo 11)
// Cada función devuelve un objeto { campo: mensaje }.
// Un objeto vacío significa que no hay errores.
// ============================================================

import { ROLES } from '../data/usuariosIniciales.js';
import { comunasDe } from '../data/regiones.js';
import { CUPONES } from '../data/cupones.js';
import { normalizar } from './formatos.js';

export const CORREOS_PERMITIDOS = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];

const texto = (valor) => String(valor ?? '').trim();

export const sinErrores = (errores) => Object.keys(errores).length === 0;

// ---------- Reglas sueltas ----------

export function correoEsValido(correo) {
  const valor = texto(correo).toLowerCase();
  const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  return formato && CORREOS_PERMITIDOS.some((dominio) => valor.endsWith(dominio));
}

// Valida un RUN chileno con su dígito verificador. Ejemplo: 21456789K
export function runEsValido(run) {
  const limpio = texto(run).toUpperCase();
  if (limpio.length < 7 || limpio.length > 9) return false;

  const cuerpo = limpio.slice(0, -1);
  const digito = limpio.slice(-1);
  if (!/^\d+$/.test(cuerpo)) return false;

  let suma = 0;
  let multiplo = 2;
  // Se recorre el cuerpo de derecha a izquierda multiplicando por 2..7
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const resto = 11 - (suma % 11);
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  return digito === esperado;
}

export function mensajeCorreo(valor, { opcional = false } = {}) {
  const correo = texto(valor);
  if (correo === '') return opcional ? '' : 'El correo es obligatorio.';
  if (correo.length > 100) return 'El correo no puede superar los 100 caracteres.';
  if (!correoEsValido(correo))
    return 'Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com';
  return '';
}

export function mensajeClave(valor) {
  const clave = String(valor ?? '');
  if (clave === '') return 'La contraseña es obligatoria.';
  if (clave.length < 4 || clave.length > 10)
    return 'La contraseña debe tener entre 4 y 10 caracteres.';
  return '';
}

export function mensajeRun(valor) {
  const run = texto(valor);
  if (run === '') return 'El RUN es obligatorio.';
  if (run.includes('.') || run.includes('-'))
    return 'Escribe el RUN sin puntos ni guion. Ejemplo: 21456789K';
  if (run.length < 7 || run.length > 9) return 'El RUN debe tener entre 7 y 9 caracteres.';
  if (!runEsValido(run)) return 'El RUN no es válido, revisa el dígito verificador.';
  return '';
}

// nombreCampo incluye el artículo ("El nombre", "La calle") para concordar el género
function mensajeObligatorio(valor, maximo, nombreCampo) {
  const v = texto(valor);
  const obligatorio = nombreCampo.startsWith('La ') ? 'obligatoria' : 'obligatorio';
  if (v === '') return `${nombreCampo} es ${obligatorio}.`;
  if (v.length > maximo) return `${nombreCampo} no puede superar los ${maximo} caracteres.`;
  return '';
}

function mensajeRegionComuna(region, comuna) {
  const errores = {};
  if (texto(region) === '') errores.region = 'Selecciona una región.';
  if (texto(comuna) === '') errores.comuna = 'Selecciona una comuna.';
  else if (texto(region) !== '' && !comunasDe(region).includes(comuna))
    errores.comuna = 'La comuna no pertenece a la región elegida.';
  return errores;
}

// Junta solo los mensajes que no estén vacíos
function armar(mensajes) {
  return Object.fromEntries(Object.entries(mensajes).filter(([, mensaje]) => mensaje));
}

// ---------- Inicio de sesión ----------

export function validarLogin({ correo, clave }) {
  return armar({ correo: mensajeCorreo(correo), clave: mensajeClave(clave) });
}

// ---------- Usuarios (registro, administrador y perfil) ----------

export function validarUsuario(
  datos,
  usuarios = [],
  runOriginal = null,
  { confirmarClave = false, conTerminos = false, conTipo = false, hoy = new Date() } = {},
) {
  const run = texto(datos.run).toUpperCase();
  const correo = texto(datos.correo).toLowerCase();
  const otros = usuarios.filter((u) => u.run !== runOriginal);

  const errores = {
    run: mensajeRun(run),
    nombre: mensajeObligatorio(datos.nombre, 50, 'El nombre'),
    apellidos: mensajeObligatorio(datos.apellidos, 100, 'El apellido'),
    correo: mensajeCorreo(correo),
    clave: mensajeClave(datos.clave),
    direccion: mensajeObligatorio(datos.direccion, 300, 'La dirección'),
    ...mensajeRegionComuna(datos.region, datos.comuna),
  };

  if (!errores.run && otros.some((u) => u.run === run))
    errores.run = 'Ya existe un usuario con ese RUN.';
  if (!errores.correo && otros.some((u) => u.correo.toLowerCase() === correo))
    errores.correo = 'Ya existe un usuario con ese correo.';

  if (texto(datos.fechaNacimiento) !== '') {
    const fecha = new Date(datos.fechaNacimiento);
    if (Number.isNaN(fecha.getTime()) || fecha > hoy)
      errores.fechaNacimiento = 'Ingresa una fecha de nacimiento válida.';
  }

  if (confirmarClave && datos.clave2 !== datos.clave)
    errores.clave2 = datos.clave2 ? 'Las contraseñas no coinciden.' : 'Repite la contraseña.';
  if (conTerminos && !datos.terminos)
    errores.terminos = 'Debes aceptar los términos y condiciones.';
  if (conTipo && !ROLES.includes(datos.tipo)) errores.tipo = 'Selecciona el tipo de usuario.';

  return armar(errores);
}

export function convertirUsuario(datos) {
  return {
    run: texto(datos.run).toUpperCase(),
    nombre: texto(datos.nombre),
    apellidos: texto(datos.apellidos),
    correo: texto(datos.correo).toLowerCase(),
    clave: String(datos.clave),
    fechaNacimiento: texto(datos.fechaNacimiento),
    tipo: ROLES.includes(datos.tipo) ? datos.tipo : 'Cliente',
    region: texto(datos.region),
    comuna: texto(datos.comuna),
    direccion: texto(datos.direccion),
  };
}

// ---------- Contacto ----------

export function validarContacto({ nombre, correo, comentario }) {
  return armar({
    nombre: mensajeObligatorio(nombre, 100, 'El nombre'),
    correo: mensajeCorreo(correo, { opcional: true }),
    comentario: mensajeObligatorio(comentario, 500, 'El comentario'),
  });
}

// ---------- Productos ----------

function mensajeEntero(valor, nombreCampo, { obligatorio = true, maximo = Infinity } = {}) {
  const v = texto(valor);
  if (v === '') return obligatorio ? `${nombreCampo} es obligatorio.` : '';
  const numero = Number(v);
  if (Number.isNaN(numero)) return `${nombreCampo} debe ser un número.`;
  if (numero < 0) return `${nombreCampo} no puede ser negativo.`;
  if (!Number.isInteger(numero)) return `${nombreCampo} debe ser un número entero.`;
  if (numero > maximo) return `${nombreCampo} no puede superar ${maximo}.`;
  return '';
}

export function urlImagenValida(valor) {
  try {
    return ['http:', 'https:'].includes(new URL(texto(valor)).protocol);
  } catch {
    return false;
  }
}

export function validarProducto(datos, productos = [], id = null, categorias = null) {
  const codigo = texto(datos.codigo).toUpperCase();
  const errores = {
    nombre: mensajeObligatorio(datos.nombre, 100, 'El nombre'),
    tipo: mensajeObligatorio(datos.tipo, 50, 'El tipo'),
    precio: mensajeEntero(datos.precio, 'El precio'),
    stock: mensajeEntero(datos.stock, 'El stock'),
    stockCritico: mensajeEntero(datos.stockCritico, 'El stock crítico', { obligatorio: false }),
    descuento: mensajeEntero(datos.descuento, 'El descuento', { obligatorio: false, maximo: 90 }),
  };

  if (codigo === '') errores.codigo = 'El código es obligatorio.';
  else if (codigo.length < 3) errores.codigo = 'El código debe tener al menos 3 caracteres.';
  else if (productos.some((p) => p.id !== id && p.codigo.toUpperCase() === codigo))
    errores.codigo = 'Ya existe un producto con ese código.';

  if (texto(datos.descripcion).length > 500)
    errores.descripcion = 'La descripción no puede superar los 500 caracteres.';

  if (texto(datos.categoria) === '') errores.categoria = 'Selecciona una categoría.';
  else if (categorias && !categorias.some((c) => c.nombre === datos.categoria))
    errores.categoria = 'La categoría no existe.';

  if (texto(datos.imagen) !== '' && !urlImagenValida(datos.imagen))
    errores.imagen = 'Ingresa una URL de imagen http o https.';

  return armar(errores);
}

export function convertirProducto(datos) {
  return {
    codigo: texto(datos.codigo).toUpperCase(),
    nombre: texto(datos.nombre),
    categoria: texto(datos.categoria),
    tipo: texto(datos.tipo),
    descripcion: texto(datos.descripcion),
    precio: Number(datos.precio),
    stock: Number(datos.stock),
    stockCritico: texto(datos.stockCritico) === '' ? 0 : Number(datos.stockCritico),
    descuento: texto(datos.descuento) === '' ? 0 : Number(datos.descuento),
    imagen: texto(datos.imagen),
  };
}

// ---------- Categorías ----------

export function validarCategoria(datos, categorias = [], id = null) {
  const nombre = texto(datos.nombre);
  const errores = {};
  if (nombre.length < 3 || nombre.length > 50)
    errores.nombre = 'El nombre debe tener entre 3 y 50 caracteres.';
  else if (categorias.some((c) => c.id !== id && normalizar(c.nombre) === normalizar(nombre)))
    errores.nombre = 'Ya existe una categoría con ese nombre.';
  if (texto(datos.descripcion).length > 200)
    errores.descripcion = 'La descripción no puede superar los 200 caracteres.';
  return errores;
}

// ---------- Checkout ----------

export function validarCheckout(datos) {
  return armar({
    nombre: mensajeObligatorio(datos.nombre, 50, 'El nombre'),
    apellidos: mensajeObligatorio(datos.apellidos, 100, 'El apellido'),
    correo: mensajeCorreo(datos.correo),
    calle: mensajeObligatorio(datos.calle, 300, 'La calle'),
    departamento: texto(datos.departamento).length > 50 ? 'Máximo 50 caracteres.' : '',
    indicaciones: texto(datos.indicaciones).length > 300 ? 'Máximo 300 caracteres.' : '',
    entrega: ['despacho', 'retiro'].includes(datos.entrega) ? '' : 'Elige una opción de entrega.',
    ...mensajeRegionComuna(datos.region, datos.comuna),
  });
}

// Tarjeta simulada: 16 dígitos, titular, vencimiento MM/AA vigente y CVV
export function validarTarjeta(datos, hoy = new Date()) {
  const numero = String(datos.numeroTarjeta ?? '').replace(/\s/g, '');
  const errores = {};

  if (!/^\d{16}$/.test(numero)) errores.numeroTarjeta = 'La tarjeta debe tener 16 dígitos.';

  const titular = mensajeObligatorio(datos.titular, 100, 'El titular');
  if (titular) errores.titular = titular;

  const vencimiento = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(texto(datos.vencimiento));
  if (!vencimiento) errores.vencimiento = 'Usa el formato MM/AA.';
  else {
    // La tarjeta vale hasta el último día del mes indicado
    const finDeMes = new Date(2000 + Number(vencimiento[2]), Number(vencimiento[1]), 0, 23, 59, 59);
    if (finDeMes < hoy) errores.vencimiento = 'La tarjeta está vencida.';
  }

  if (!/^\d{3,4}$/.test(texto(datos.cvv))) errores.cvv = 'El CVV tiene 3 o 4 dígitos.';
  return errores;
}

// ---------- Cupones ----------

export function buscarCupon(codigo, carrito) {
  const escrito = texto(codigo).toUpperCase();
  if (escrito === '') return { error: 'Escribe un código de descuento.' };
  if (!carrito.length) return { error: 'Agrega productos antes de usar un cupón.' };
  const cupon = CUPONES.find((c) => c.codigo === escrito);
  if (!cupon) return { error: `El cupón "${escrito}" no existe.` };
  return { cupon: { ...cupon } };
}
