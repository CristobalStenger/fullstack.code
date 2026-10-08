import { describe, expect, it } from 'vitest';
import {
  entregasPorTipo,
  inventarioPorCategoria,
  ordenesDeUsuario,
  productosCriticos,
  productosMasVendidos,
  resumenVentas,
  ventasPorCategoria,
  ventasPorDia,
} from './reportes.js';

const item = (id, categoria, precio, cantidad) => ({ id, nombre: `P${id}`, categoria, precio, cantidad });
const ordenes = [
  { numero: 1, estado: 'pagada', fecha: '2026-10-01T15:00:00Z', total: 30000, entrega: { tipo: 'despacho' }, cliente: { run: '1', correo: 'a@gmail.com' }, items: [item(1, 'A', 10000, 3)] },
  { numero: 2, estado: 'pagada', fecha: '2026-10-01T20:00:00Z', total: 10000, entrega: { tipo: 'retiro' }, cliente: { run: '', correo: 'B@gmail.com' }, items: [item(2, 'B', 5000, 2)] },
  { numero: 3, estado: 'rechazada', fecha: '2026-10-02T15:00:00Z', total: 99999, entrega: { tipo: 'retiro' }, cliente: { run: '1', correo: 'a@gmail.com' }, items: [item(2, 'B', 5000, 9)] },
];

describe('reportes de ventas', () => {
  it('resume solo las órdenes pagadas', () => {
    expect(resumenVentas(ordenes)).toEqual({ totalVentas: 40000, pagadas: 2, rechazadas: 1, unidades: 5, ticketPromedio: 20000 });
    expect(resumenVentas([]).ticketPromedio).toBe(0);
  });

  it('agrupa ventas por categoría con su porcentaje', () => {
    expect(ventasPorCategoria(ordenes)).toEqual([
      { categoria: 'A', unidades: 3, total: 30000, porcentaje: 75 },
      { categoria: 'B', unidades: 2, total: 10000, porcentaje: 25 },
    ]);
  });

  it('agrupa ventas por día y lista los más vendidos', () => {
    expect(ventasPorDia(ordenes)).toEqual([{ dia: '2026-10-01', ordenes: 2, total: 40000 }]);
    expect(productosMasVendidos(ordenes).map((p) => [p.id, p.unidades])).toEqual([
      [1, 3],
      [2, 2],
    ]);
  });

  it('cuenta entregas e historial por RUN o correo', () => {
    expect(entregasPorTipo(ordenes)).toEqual({ despacho: 1, retiro: 1 });
    expect(ordenesDeUsuario(ordenes, { run: '1', correo: 'x@gmail.com' }).map((o) => o.numero)).toEqual([1, 3]);
    expect(ordenesDeUsuario(ordenes, { run: '9', correo: 'b@gmail.com' }).map((o) => o.numero)).toEqual([2]);
  });
});

describe('reportes de inventario', () => {
  const productos = [
    { id: 1, categoria: 'A', precio: 1000, stock: 2, stockCritico: 3 },
    { id: 2, categoria: 'A', precio: 500, stock: 4, stockCritico: 1 },
    { id: 3, categoria: 'B', precio: 100, stock: 0, stockCritico: 0 },
  ];

  it('valoriza el stock por categoría', () => {
    expect(inventarioPorCategoria(productos)).toEqual([
      { categoria: 'A', productos: 2, unidades: 6, valor: 4000, criticos: 1, porcentaje: 100 },
      { categoria: 'B', productos: 1, unidades: 0, valor: 0, criticos: 1, porcentaje: 0 },
    ]);
  });

  it('lista los productos en stock crítico del menor al mayor stock', () => {
    expect(productosCriticos(productos).map((p) => p.id)).toEqual([3, 1]);
  });
});
