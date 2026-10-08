// ============================================================
// NexusTech - Regiones y comunas para registro, usuarios y checkout
// ============================================================

export const regionesChile = [
  {
    nombre: 'Región de Antofagasta',
    comunas: ['Antofagasta', 'Calama', 'Mejillones', 'Taltal', 'Tocopilla'],
  },
  {
    nombre: 'Región de Coquimbo',
    comunas: ['La Serena', 'Coquimbo', 'Ovalle', 'Illapel', 'Vicuña'],
  },
  {
    nombre: 'Región de Valparaíso',
    comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'San Antonio', 'Quillota'],
  },
  {
    nombre: 'Región Metropolitana',
    comunas: ['Santiago', 'Providencia', 'Las Condes', 'Maipú', 'Puente Alto', 'La Florida', 'Ñuñoa', 'San Bernardo', 'Cerrillos'],
  },
  {
    nombre: "Región del Libertador O'Higgins",
    comunas: ['Rancagua', 'San Fernando', 'Machalí', 'Santa Cruz', 'Rengo'],
  },
  {
    nombre: 'Región del Maule',
    comunas: ['Talca', 'Curicó', 'Linares', 'Constitución', 'Cauquenes'],
  },
  {
    nombre: 'Región del Biobío',
    comunas: ['Concepción', 'Talcahuano', 'Los Ángeles', 'Chiguayante', 'San Pedro de la Paz'],
  },
  {
    nombre: 'Región de La Araucanía',
    comunas: ['Temuco', 'Padre Las Casas', 'Villarrica', 'Angol', 'Pucón'],
  },
  {
    nombre: 'Región de Los Lagos',
    comunas: ['Puerto Montt', 'Osorno', 'Castro', 'Ancud', 'Puerto Varas'],
  },
  {
    nombre: 'Región de Magallanes',
    comunas: ['Punta Arenas', 'Puerto Natales', 'Porvenir', 'Cabo de Hornos'],
  },
];

export function comunasDe(nombreRegion) {
  return regionesChile.find((r) => r.nombre === nombreRegion)?.comunas ?? [];
}
