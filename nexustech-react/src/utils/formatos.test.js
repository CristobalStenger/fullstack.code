import { describe, expect, it } from 'vitest';
import {
  crearSlug,
  diaChile,
  enmascararTarjeta,
  enOferta,
  estadoStock,
  formatearFecha,
  nombreCompleto,
  normalizar,
  precioCLP,
  precioFinal,
  textoPrecio,
} from './formatos.js';

describe('formatos de precio', () => {
  it('formatea pesos chilenos sin decimales', () => {
    expect(precioCLP(599990)).toBe('$599.990');
  });

  it('muestra FREE cuando el precio es cero (regla de la entrega 1)', () => {
    expect(textoPrecio(0)).toBe('FREE');
    expect(textoPrecio(1000)).toBe('$1.000');
  });

  it('aplica el descuento de la oferta y redondea', () => {
    expect(precioFinal({ precio: 69990, descuento: 25 })).toBe(52493);
    expect(precioFinal({ precio: 10000 })).toBe(10000);
    expect(enOferta({ descuento: 10 })).toBe(true);
    expect(enOferta({ descuento: 0 })).toBe(false);
  });
});

describe('formatos de texto', () => {
  it('normaliza tildes, mayúsculas y espacios', () => {
    expect(normalizar('  Periféricos ÁÉ ')).toBe('perifericos ae');
    expect(normalizar(undefined)).toBe('');
  });

  it('crea slugs para las URL de categorías', () => {
    expect(crearSlug('Audio y Video!')).toBe('audio-y-video');
  });

  it('enmascara la tarjeta y arma el nombre completo', () => {
    expect(enmascararTarjeta('4242 4242 4242 1234')).toBe('**** 1234');
    expect(nombreCompleto({ nombre: 'Pedro', apellidos: 'Soto' })).toBe('Pedro Soto');
  });

  it('formatea fechas en horario de Chile', () => {
    expect(formatearFecha('2026-09-14T15:20:00.000Z')).toMatch(/2026/);
    expect(diaChile('2026-09-15T02:00:00.000Z')).toBe('2026-09-14');
  });
});

describe('estado del stock', () => {
  it.each([
    [{ stock: 0, stockCritico: 2 }, 'Sin stock', 'danger'],
    [{ stock: 2, stockCritico: 2 }, 'Últimas 2 unidades', 'warning'],
    [{ stock: 10, stockCritico: 2 }, 'Disponible', 'success'],
  ])('clasifica %o', (producto, texto, variante) => {
    expect(estadoStock(producto)).toEqual({ texto, variante });
  });
});
