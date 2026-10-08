import { describe, expect, it } from 'vitest';
import {
  crearEstado,
  detalleCarrito,
  evaluarPago,
  resumenCarrito,
  siguienteNumeroOrden,
  tiendaReducer,
} from './tiendaReducer.js';

const mouse = {
  id: 1,
  codigo: 'MOU001',
  nombre: 'Mouse',
  categoria: 'Perifericos',
  tipo: 'Mouse',
  descripcion: '',
  precio: 10000,
  stock: 2,
  stockCritico: 1,
  descuento: 0,
  imagen: 'https://example.com/mouse.png',
};
const teclado = { ...mouse, id: 2, codigo: 'TEC001', nombre: 'Teclado', tipo: 'Teclado', precio: 20000, stock: 5, descuento: 50 };
const categorias = [
  { id: 1, nombre: 'Perifericos', slug: 'perifericos', icono: 'bi-mouse2-fill', descripcion: '' },
  { id: 2, nombre: 'Consolas', slug: 'consolas', icono: 'bi-controller', descripcion: '' },
];

const iniciar = (extra = {}) =>
  crearEstado({ productos: [{ ...mouse }, { ...teclado }], categorias, ...extra });

const datosPago = (numeroTarjeta = '4242424242424242', tipo = 'despacho') => ({
  cliente: { run: '', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com' },
  entrega: { tipo, calle: 'Calle 1', departamento: '', region: 'Región Metropolitana', comuna: 'Santiago', indicaciones: '' },
  numeroTarjeta,
});

describe('reglas del carrito', () => {
  it('acumula cantidades sin duplicar productos ni mutar el estado anterior', () => {
    const inicial = iniciar();
    const uno = tiendaReducer(inicial, { type: 'AGREGAR', id: 1 });
    const dos = tiendaReducer(uno, { type: 'AGREGAR', id: 1 });
    expect(dos.carrito).toEqual([{ id: 1, cantidad: 2 }]);
    expect(dos.aviso.texto).toBe('Mouse agregado al carrito.');
    expect(inicial.carrito).toEqual([]);
  });

  it('agrega varias unidades desde el detalle y respeta el stock', () => {
    const estado = tiendaReducer(iniciar(), { type: 'AGREGAR', id: 2, cantidad: 5 });
    expect(estado.carrito).toEqual([{ id: 2, cantidad: 5 }]);
    const rechazado = tiendaReducer(estado, { type: 'AGREGAR', id: 2 });
    expect(rechazado.carrito).toEqual(estado.carrito);
    expect(rechazado.aviso.tipo).toBe('warning');
  });

  it('impide agregar productos inexistentes o cantidades inválidas', () => {
    expect(tiendaReducer(iniciar(), { type: 'AGREGAR', id: 99 }).carrito).toEqual([]);
    expect(tiendaReducer(iniciar(), { type: 'AGREGAR', id: 1, cantidad: 0 }).carrito).toEqual([]);
  });

  it.each([-1, 1.5, 3, NaN])('rechaza la cantidad inválida %s', (cantidad) => {
    const inicial = iniciar({ carrito: [{ id: 1, cantidad: 1 }] });
    expect(tiendaReducer(inicial, { type: 'CANTIDAD', id: 1, cantidad }).carrito).toEqual(inicial.carrito);
  });

  it('cambia cantidades y retira el producto (y el cupón) al llegar a cero', () => {
    const inicial = iniciar({ carrito: [{ id: 1, cantidad: 1 }], cupon: { codigo: 'FELIZ18', descuento: 10 } });
    expect(tiendaReducer(inicial, { type: 'CANTIDAD', id: 1, cantidad: 2 }).carrito).toEqual([{ id: 1, cantidad: 2 }]);
    const vacio = tiendaReducer(inicial, { type: 'CANTIDAD', id: 1, cantidad: 0 });
    expect(vacio.carrito).toEqual([]);
    expect(vacio.cupon).toBeNull();
  });

  it('quita un producto y vacía el carrito', () => {
    const inicial = iniciar({ carrito: [{ id: 1, cantidad: 1 }, { id: 2, cantidad: 1 }] });
    expect(tiendaReducer(inicial, { type: 'QUITAR', id: 1 }).carrito).toEqual([{ id: 2, cantidad: 1 }]);
    expect(tiendaReducer(inicial, { type: 'VACIAR' }).carrito).toEqual([]);
  });

  it('calcula subtotal con ofertas, cupón y envío según la entrega', () => {
    const estado = iniciar({
      carrito: [{ id: 1, cantidad: 2 }, { id: 2, cantidad: 1 }],
      cupon: { codigo: 'FELIZ18', descuento: 10 },
    });
    expect(detalleCarrito(estado)[1].precioUnitario).toBe(10000);
    expect(resumenCarrito(estado)).toEqual({ unidades: 3, subtotal: 30000, descuento: 3000, envio: 0, total: 27000 });
    expect(resumenCarrito(estado, 'despacho').total).toBe(30990);
    expect(resumenCarrito(estado, 'retiro').envio).toBe(0);
    expect(resumenCarrito(iniciar(), 'despacho')).toEqual({ unidades: 0, subtotal: 0, descuento: 0, envio: 0, total: 0 });
  });

  it('aplica y quita cupones válidos', () => {
    const conProductos = iniciar({ carrito: [{ id: 1, cantidad: 1 }] });
    const conCupon = tiendaReducer(conProductos, { type: 'APLICAR_CUPON', codigo: 'xavicris' });
    expect(conCupon.cupon).toEqual({ codigo: 'XAVICRIS', descuento: 15 });
    expect(tiendaReducer(conCupon, { type: 'QUITAR_CUPON' }).cupon).toBeNull();
    expect(tiendaReducer(conProductos, { type: 'APLICAR_CUPON', codigo: 'FALSO' }).cupon).toBeNull();
    expect(tiendaReducer(iniciar(), { type: 'APLICAR_CUPON', codigo: 'FELIZ18' }).cupon).toBeNull();
  });
});

describe('pago simulado', () => {
  it('numera las órdenes en forma correlativa', () => {
    expect(siguienteNumeroOrden([])).toBe(1001);
    expect(siguienteNumeroOrden([{ numero: 1004 }])).toBe(1005);
  });

  it('descuenta stock, vacía el carrito y registra una orden pagada', () => {
    const inicial = iniciar({ carrito: [{ id: 1, cantidad: 2 }], cupon: { codigo: 'BOOTSTRAP', descuento: 5 } });
    const final = tiendaReducer(inicial, {
      type: 'PAGAR',
      numero: 1001,
      fecha: '2026-10-08T15:00:00.000Z',
      datos: datosPago(),
    });
    expect(final.productos[0].stock).toBe(0);
    expect(final.carrito).toEqual([]);
    expect(final.cupon).toBeNull();
    expect(final.ordenes[0]).toMatchObject({
      numero: 1001,
      codigo: 'ORD-20261008-1001',
      estado: 'pagada',
      subtotal: 20000,
      descuento: 1000,
      envio: 3990,
      total: 22990,
      pago: { tarjeta: '**** 4242' },
    });
    expect(inicial.productos[0].stock).toBe(2);
  });

  it('rechaza el pago con tarjeta terminada en 0000 sin tocar stock ni carrito', () => {
    const inicial = iniciar({ carrito: [{ id: 1, cantidad: 1 }] });
    const final = tiendaReducer(inicial, { type: 'PAGAR', numero: 1001, datos: datosPago('4242424242420000') });
    expect(final.ordenes[0].estado).toBe('rechazada');
    expect(final.ordenes[0].motivo).toMatch(/tarjeta fue rechazada/);
    expect(final.productos).toEqual(inicial.productos);
    expect(final.carrito).toEqual(inicial.carrito);
  });

  it('rechaza el pago completo si un producto perdió stock', () => {
    const inicial = iniciar({ carrito: [{ id: 1, cantidad: 2 }, { id: 2, cantidad: 6 }] });
    expect(evaluarPago(inicial)).toMatch(/Stock insuficiente para: Teclado/);
    const final = tiendaReducer(inicial, { type: 'PAGAR', numero: 1001, datos: datosPago() });
    expect(final.ordenes[0].estado).toBe('rechazada');
    expect(final.productos).toEqual(inicial.productos);
  });

  it('no crea órdenes con el carrito vacío y evita números repetidos', () => {
    expect(tiendaReducer(iniciar(), { type: 'PAGAR', datos: datosPago() }).ordenes).toEqual([]);
    const inicial = iniciar({ carrito: [{ id: 1, cantidad: 1 }], ordenes: [{ numero: 1001 }] });
    const final = tiendaReducer(inicial, { type: 'PAGAR', numero: 1001, datos: datosPago('4242424242424242', 'retiro') });
    expect(final.ordenes[1].numero).toBe(1002);
    expect(final.ordenes[1].envio).toBe(0);
  });
});

describe('CRUD de productos', () => {
  const nuevo = { ...mouse, codigo: 'AUD001', nombre: 'Audífonos', tipo: 'Audifonos', precio: '15000', stock: '3', stockCritico: '1', descuento: '' };

  it('crea un producto con id único y convierte los números del formulario', () => {
    const resultado = tiendaReducer(iniciar(), { type: 'GUARDAR_PRODUCTO', id: null, datos: nuevo });
    expect(resultado.productos[2]).toMatchObject({ id: 3, nombre: 'Audífonos', precio: 15000, stock: 3, descuento: 0 });
  });

  it('actualiza manteniendo el id y el carrito usa el precio nuevo', () => {
    const inicial = iniciar({ carrito: [{ id: 1, cantidad: 2 }] });
    const resultado = tiendaReducer(inicial, { type: 'GUARDAR_PRODUCTO', id: 1, datos: { ...mouse, precio: '15000' } });
    expect(resultado.productos).toHaveLength(2);
    expect(resumenCarrito(resultado).subtotal).toBe(30000);
  });

  it('rechaza datos inválidos, códigos repetidos y productos inexistentes', () => {
    const inicial = iniciar();
    expect(tiendaReducer(inicial, { type: 'GUARDAR_PRODUCTO', id: null, datos: { ...nuevo, codigo: 'mou001' } }).productos).toEqual(inicial.productos);
    expect(tiendaReducer(inicial, { type: 'GUARDAR_PRODUCTO', id: null, datos: { ...nuevo, categoria: 'Inventada' } }).aviso.tipo).toBe('danger');
    expect(tiendaReducer(inicial, { type: 'GUARDAR_PRODUCTO', id: 99, datos: nuevo }).aviso.tipo).toBe('warning');
  });

  it('elimina el producto del catálogo y del carrito', () => {
    const inicial = iniciar({ carrito: [{ id: 1, cantidad: 1 }] });
    const resultado = tiendaReducer(inicial, { type: 'ELIMINAR_PRODUCTO', id: 1 });
    expect(resultado.productos.map((p) => p.id)).toEqual([2]);
    expect(resultado.carrito).toEqual([]);
    expect(tiendaReducer(inicial, { type: 'ELIMINAR_PRODUCTO', id: 99 }).productos).toHaveLength(2);
  });
});

describe('CRUD de categorías', () => {
  it('crea una categoría con slug e ícono por defecto', () => {
    const resultado = tiendaReducer(iniciar(), { type: 'GUARDAR_CATEGORIA', id: null, datos: { nombre: 'Audio y Video', descripcion: '' } });
    expect(resultado.categorias[2]).toEqual({ id: 3, nombre: 'Audio y Video', slug: 'audio-y-video', icono: 'bi-tag', descripcion: '' });
  });

  it('al renombrar actualiza también los productos de la categoría', () => {
    const resultado = tiendaReducer(iniciar(), {
      type: 'GUARDAR_CATEGORIA',
      id: 1,
      datos: { nombre: 'Periféricos Gamer', icono: 'bi-keyboard', descripcion: 'Nuevo' },
    });
    expect(resultado.categorias[0].slug).toBe('perifericos-gamer');
    expect(resultado.productos.every((p) => p.categoria === 'Periféricos Gamer')).toBe(true);
  });

  it('rechaza duplicados y categorías inexistentes', () => {
    expect(tiendaReducer(iniciar(), { type: 'GUARDAR_CATEGORIA', id: null, datos: { nombre: 'consolas' } }).categorias).toHaveLength(2);
    expect(tiendaReducer(iniciar(), { type: 'GUARDAR_CATEGORIA', id: 9, datos: { nombre: 'Otra' } }).aviso.tipo).toBe('warning');
  });

  it('no elimina una categoría con productos, pero sí una vacía', () => {
    const conProductos = tiendaReducer(iniciar(), { type: 'ELIMINAR_CATEGORIA', id: 1 });
    expect(conProductos.categorias).toHaveLength(2);
    expect(conProductos.aviso.texto).toMatch(/tiene 2 producto/);
    expect(tiendaReducer(iniciar(), { type: 'ELIMINAR_CATEGORIA', id: 2 }).categorias).toHaveLength(1);
    expect(tiendaReducer(iniciar(), { type: 'ELIMINAR_CATEGORIA', id: 9 }).aviso.tipo).toBe('warning');
  });

  it('cierra avisos e ignora acciones desconocidas', () => {
    const conAviso = tiendaReducer(iniciar(), { type: 'AGREGAR', id: 1 });
    expect(tiendaReducer(conAviso, { type: 'CERRAR_AVISO' }).aviso).toBeNull();
    expect(tiendaReducer(conAviso, { type: 'DESCONOCIDA' })).toBe(conAviso);
  });
});
