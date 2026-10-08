// ============================================================
// NexusTech - Fuente de datos simulada: usuarios
// El administrador es el mismo de la entrega 1 (js/main.js).
// Se agregan un vendedor y un cliente para probar los roles.
// Las claves quedan en texto plano solo porque es una simulación
// académica: un backend real nunca debe guardarlas así.
// ============================================================

export const ROLES = ['Administrador', 'Vendedor', 'Cliente'];

export const usuariosIniciales = [
  {
    run: '190110222',
    nombre: 'Admin',
    apellidos: 'NexusTech',
    correo: 'admin@duoc.cl',
    clave: 'admin123',
    fechaNacimiento: '',
    tipo: 'Administrador',
    region: 'Región Metropolitana',
    comuna: 'Santiago',
    direccion: 'Av. Principal 1234',
  },
  {
    run: '123456785',
    nombre: 'Valentina',
    apellidos: 'Rojas Muñoz',
    correo: 'vendedor@duoc.cl',
    clave: 'vende123',
    fechaNacimiento: '1998-04-12',
    tipo: 'Vendedor',
    region: 'Región de Valparaíso',
    comuna: 'Viña del Mar',
    direccion: 'Calle Valparaíso 456',
  },
  {
    run: '21456789K',
    nombre: 'Pedro',
    apellidos: 'Soto Fuentes',
    correo: 'cliente@gmail.com',
    clave: 'cliente123',
    fechaNacimiento: '2002-09-30',
    tipo: 'Cliente',
    region: 'Región Metropolitana',
    comuna: 'Providencia',
    direccion: 'Los Crisantemos 789, Edificio Norte',
  },
];
