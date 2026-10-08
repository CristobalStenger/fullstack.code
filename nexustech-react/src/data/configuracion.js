// ============================================================
// NexusTech - Reglas fijas del negocio
// ============================================================

// Costo del despacho a domicilio. El retiro en tienda es gratis.
export const COSTO_DESPACHO = 3990;

export const OPCIONES_ENTREGA = [
  {
    valor: 'despacho',
    texto: 'Despacho a domicilio (48 horas hábiles)',
    costo: COSTO_DESPACHO,
  },
  {
    valor: 'retiro',
    texto: 'Retiro en tienda (Av. Principal 1234, Santiago)',
    costo: 0,
  },
];

// Las órdenes se numeran en forma correlativa desde este valor
export const NUMERO_ORDEN_INICIAL = 1000;

// Tarjetas de prueba: las terminadas en estos dígitos son rechazadas
export const SUFIJO_TARJETA_RECHAZADA = '0000';

export const LIMITE_DESTACADOS = 8;
