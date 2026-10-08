import { describe, expect, it } from 'vitest';
import { filtrarProductos, productosEnOferta, tiposDe } from './catalogo.js';

const productos = [
  { id: 1, codigo: 'MOU1', nombre: 'Mouse Pro', categoria: 'Perifericos', tipo: 'Mouse', precio: 50000, descuento: 0, stock: 3 },
  { id: 2, codigo: 'TEC1', nombre: 'Teclado Ñandú', categoria: 'Perifericos', tipo: 'Teclado', precio: 120000, descuento: 50, stock: 0 },
  { id: 3, codigo: 'CPU1', nombre: 'Ryzen 5', categoria: 'Componentes', tipo: 'Procesador', precio: 250000, descuento: 10, stock: 8 },
];

describe('filtros del catálogo', () => {
  it('sin filtros devuelve todos los productos sin modificar el arreglo', () => {
    const copia = [...productos];
    expect(filtrarProductos(productos)).toHaveLength(3);
    expect(productos).toEqual(copia);
  });

  it('busca por nombre sin importar tildes, también por tipo y código', () => {
    expect(filtrarProductos(productos, { texto: 'nandu' }).map((p) => p.id)).toEqual([2]);
    expect(filtrarProductos(productos, { texto: 'procesador' }).map((p) => p.id)).toEqual([3]);
    expect(filtrarProductos(productos, { texto: 'mou1' }).map((p) => p.id)).toEqual([1]);
  });

  it('combina categoría, tipo, rango de precio final y disponibilidad', () => {
    expect(filtrarProductos(productos, { categoria: 'Perifericos', tipo: 'Teclado' })).toHaveLength(1);
    // El teclado cuesta 60.000 con descuento, por eso entra en el rango
    expect(filtrarProductos(productos, { rango: '0-99999' }).map((p) => p.id)).toEqual([1, 2]);
    expect(filtrarProductos(productos, { disponibilidad: 'agotado' }).map((p) => p.id)).toEqual([2]);
    expect(filtrarProductos(productos, { disponibilidad: 'disponible' })).toHaveLength(2);
  });

  it.each([
    ['az', [1, 3, 2]],
    ['za', [2, 3, 1]],
    ['menor', [1, 2, 3]],
    ['mayor', [3, 2, 1]],
  ])('ordena por %s', (orden, ids) => {
    expect(filtrarProductos(productos, { orden }).map((p) => p.id)).toEqual(ids);
  });

  it('lista los tipos y las ofertas ordenadas por descuento', () => {
    expect(tiposDe(productos)).toEqual(['Mouse', 'Procesador', 'Teclado']);
    expect(tiposDe(productos, 'Componentes')).toEqual(['Procesador']);
    expect(productosEnOferta(productos).map((p) => p.id)).toEqual([2, 3]);
  });
});
