import { precioCLP } from '../../utils/formatos.js';

// Subtotal, descuento del cupón, envío y total de una compra
export default function ResumenCompra({ subtotal, descuento = 0, envio, total, cupon, textoTotal = 'TOTAL' }) {
  return (
    <dl className="mb-0">
      <div className="d-flex justify-content-between mb-2">
        <dt className="fw-normal">Subtotal</dt>
        <dd className="mb-0">{precioCLP(subtotal)}</dd>
      </div>
      {descuento > 0 && (
        <div className="d-flex justify-content-between mb-2">
          <dt className="fw-normal">
            Descuento {cupon && <span className="badge badge-nexus">{cupon.codigo} ({cupon.descuento}%)</span>}
          </dt>
          <dd className="mb-0 text-success fw-bold">-{precioCLP(descuento)}</dd>
        </div>
      )}
      {envio !== undefined && (
        <div className="d-flex justify-content-between mb-2">
          <dt className="fw-normal">Envío</dt>
          <dd className="mb-0">{envio === 0 ? 'Gratis' : precioCLP(envio)}</dd>
        </div>
      )}
      <hr />
      <div className="d-flex justify-content-between align-items-center">
        <dt className="fs-5">{textoTotal}</dt>
        <dd className="mb-0 fs-4 precio-producto">{precioCLP(total)}</dd>
      </div>
    </dl>
  );
}
