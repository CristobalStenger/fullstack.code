import { describe, expect, it } from 'vitest';
import {
  buscarCupon,
  convertirProducto,
  convertirUsuario,
  correoEsValido,
  mensajeRun,
  runEsValido,
  validarCategoria,
  validarCheckout,
  validarContacto,
  validarLogin,
  validarProducto,
  validarTarjeta,
  validarUsuario,
} from './validaciones.js';

const usuarioValido = {
  run: '21456789K',
  nombre: 'Pedro',
  apellidos: 'Soto',
  correo: 'pedro@gmail.com',
  clave: 'abcd1',
  clave2: 'abcd1',
  fechaNacimiento: '',
  tipo: 'Cliente',
  region: 'Región Metropolitana',
  comuna: 'Providencia',
  direccion: 'Calle 123',
  terminos: true,
};

const productoValido = {
  codigo: 'tec010',
  nombre: 'Teclado nuevo',
  categoria: 'Perifericos',
  tipo: 'Teclado',
  descripcion: '',
  precio: '0',
  stock: '0',
  stockCritico: '',
  descuento: '',
  imagen: '',
};

describe('RUN y correo', () => {
  it.each(['21456789K', '190110222', '123456785', '111111111'])(
    'acepta el RUN válido %s',
    (run) => expect(runEsValido(run)).toBe(true),
  );

  it.each(['21456789', '2145678A9', '123', '1234567890'])('rechaza el RUN %s', (run) => {
    expect(runEsValido(run)).toBe(false);
  });

  it('explica por qué un RUN es inválido', () => {
    expect(mensajeRun('')).toBe('El RUN es obligatorio.');
    expect(mensajeRun('21.456.789-K')).toMatch(/sin puntos ni guion/);
    expect(mensajeRun('123456')).toMatch(/entre 7 y 9/);
    expect(mensajeRun('214567890')).toMatch(/dígito verificador/);
  });

  it('solo acepta los dominios permitidos por el cliente', () => {
    expect(correoEsValido('alumno@duoc.cl')).toBe(true);
    expect(correoEsValido('profe@profesor.duoc.cl')).toBe(true);
    expect(correoEsValido('persona@gmail.com')).toBe(true);
    expect(correoEsValido('persona@hotmail.com')).toBe(false);
    expect(correoEsValido('@gmail.com')).toBe(false);
  });
});

describe('formularios de usuario', () => {
  it('valida el login con correo y contraseña de 4 a 10 caracteres', () => {
    expect(validarLogin({ correo: 'a@duoc.cl', clave: '1234' })).toEqual({});
    expect(Object.keys(validarLogin({ correo: 'x@yahoo.com', clave: '123' }))).toEqual([
      'correo',
      'clave',
    ]);
  });

  it('acepta un registro completo', () => {
    expect(validarUsuario(usuarioValido, [], null, { confirmarClave: true, conTerminos: true })).toEqual({});
  });

  it('informa todos los errores del registro a la vez', () => {
    const errores = validarUsuario(
      { run: '', nombre: '', apellidos: '', correo: 'x', clave: '1', clave2: '2', region: '', comuna: '', direccion: '' },
      [],
      null,
      { confirmarClave: true, conTerminos: true, conTipo: true },
    );
    expect(Object.keys(errores).sort()).toEqual(
      ['apellidos', 'clave', 'clave2', 'comuna', 'correo', 'direccion', 'nombre', 'region', 'run', 'terminos', 'tipo'].sort(),
    );
  });

  it('rechaza RUN y correo repetidos, salvo al editar el mismo usuario', () => {
    const existentes = [{ ...usuarioValido, correo: 'PEDRO@gmail.com' }];
    const errores = validarUsuario(usuarioValido, existentes);
    expect(errores.run).toMatch(/Ya existe/);
    expect(errores.correo).toMatch(/Ya existe/);
    expect(validarUsuario(usuarioValido, existentes, '21456789K')).toEqual({});
  });

  it('rechaza fechas de nacimiento futuras y comunas de otra región', () => {
    const errores = validarUsuario(
      { ...usuarioValido, fechaNacimiento: '2999-01-01', comuna: 'Temuco' },
      [],
    );
    expect(errores.fechaNacimiento).toBeDefined();
    expect(errores.comuna).toMatch(/no pertenece/);
  });

  it('convierte los datos del formulario', () => {
    expect(convertirUsuario({ ...usuarioValido, run: '21456789k', correo: ' PEDRO@GMAIL.COM ', tipo: 'Otro' })).toMatchObject({
      run: '21456789K',
      correo: 'pedro@gmail.com',
      tipo: 'Cliente',
    });
  });

  it('valida el formulario de contacto con correo opcional', () => {
    expect(validarContacto({ nombre: 'Ana', correo: '', comentario: 'Hola' })).toEqual({});
    expect(
      Object.keys(validarContacto({ nombre: '', correo: 'malo@yahoo.com', comentario: 'x'.repeat(501) })),
    ).toEqual(['nombre', 'correo', 'comentario']);
  });
});

describe('formularios de productos y categorías', () => {
  it('acepta un producto válido con precio y stock cero', () => {
    expect(validarProducto(productoValido, [])).toEqual({});
  });

  it('informa todos los campos incorrectos', () => {
    const errores = validarProducto(
      {
        codigo: 'x',
        nombre: '',
        categoria: '',
        tipo: '',
        descripcion: 'a'.repeat(501),
        precio: '-1',
        stock: '1.5',
        stockCritico: 'abc',
        descuento: '95',
        imagen: 'javascript:alert(1)',
      },
      [],
    );
    expect(Object.keys(errores).sort()).toEqual(
      ['categoria', 'codigo', 'descripcion', 'descuento', 'imagen', 'nombre', 'precio', 'stock', 'stockCritico', 'tipo'].sort(),
    );
  });

  it('rechaza códigos repetidos y categorías inexistentes', () => {
    const existentes = [{ id: 1, codigo: 'TEC010' }];
    expect(validarProducto(productoValido, existentes).codigo).toMatch(/Ya existe/);
    expect(validarProducto(productoValido, existentes, 1)).toEqual({});
    expect(validarProducto(productoValido, [], null, [{ nombre: 'Consolas' }]).categoria).toMatch(/no existe/);
  });

  it('convierte números y valores opcionales', () => {
    expect(convertirProducto({ ...productoValido, precio: '15000', stock: '4' })).toMatchObject({
      codigo: 'TEC010',
      precio: 15000,
      stock: 4,
      stockCritico: 0,
      descuento: 0,
    });
  });

  it('valida categorías sin nombres duplicados', () => {
    const categorias = [{ id: 1, nombre: 'Periféricos' }];
    expect(validarCategoria({ nombre: 'perifericos' }, categorias).nombre).toMatch(/Ya existe/);
    expect(validarCategoria({ nombre: 'Periféricos' }, categorias, 1)).toEqual({});
    expect(validarCategoria({ nombre: 'TV', descripcion: 'x'.repeat(201) }, [])).toHaveProperty('descripcion');
  });
});

describe('checkout, tarjeta y cupones', () => {
  const hoy = new Date('2026-10-08T12:00:00');

  it('exige datos del cliente y la dirección de entrega', () => {
    const errores = validarCheckout({ entrega: 'otra' });
    expect(Object.keys(errores)).toEqual(
      expect.arrayContaining(['nombre', 'apellidos', 'correo', 'calle', 'region', 'comuna', 'entrega']),
    );
  });

  it('acepta una tarjeta vigente y rechaza formatos inválidos o vencidos', () => {
    const tarjeta = { numeroTarjeta: '4242 4242 4242 4242', titular: 'Pedro', vencimiento: '10/26', cvv: '123' };
    expect(validarTarjeta(tarjeta, hoy)).toEqual({});
    expect(validarTarjeta({ ...tarjeta, vencimiento: '09/26' }, hoy).vencimiento).toMatch(/vencida/);
    expect(Object.keys(validarTarjeta({ numeroTarjeta: '123', titular: '', vencimiento: '13/30', cvv: '1' }, hoy))).toEqual([
      'numeroTarjeta',
      'titular',
      'vencimiento',
      'cvv',
    ]);
  });

  it('busca cupones existentes solo si hay productos en el carrito', () => {
    expect(buscarCupon('', [{ id: 1 }]).error).toBeDefined();
    expect(buscarCupon('FELIZ18', []).error).toMatch(/Agrega productos/);
    expect(buscarCupon('NOEXISTE', [{ id: 1 }]).error).toMatch(/no existe/);
    expect(buscarCupon('feliz18', [{ id: 1 }]).cupon).toEqual({ codigo: 'FELIZ18', descuento: 10 });
  });
});
