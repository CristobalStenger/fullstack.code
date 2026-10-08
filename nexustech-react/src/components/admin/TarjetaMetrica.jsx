// Tarjeta de color del dashboard (Figura 9 del PDF)
export default function TarjetaMetrica({ titulo, valor, detalle, icono, variante = 'primary' }) {
  return (
    <div className={`tarjeta-metrica ${variante} d-flex align-items-center gap-3`}>
      <i className={`bi ${icono}`} aria-hidden="true"></i>
      <div>
        <h2 className="h6 mb-1">{titulo}</h2>
        <p className="fs-3 fw-bold mb-0">{valor}</p>
        {detalle && <small>{detalle}</small>}
      </div>
    </div>
  );
}
