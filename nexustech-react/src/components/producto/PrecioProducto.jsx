import Badge from 'react-bootstrap/Badge';
import { enOferta, precioCLP, precioFinal, textoPrecio } from '../../utils/formatos.js';

// Muestra el precio; si hay oferta, el precio anterior tachado y el % de descuento
export default function PrecioProducto({ producto, className = 'fs-5' }) {
  const final = precioFinal(producto);
  return (
    <div className={`precio-producto ${className}`}>
      {enOferta(producto) && (
        <>
          <del className="precio-original me-2" aria-label={`Precio normal ${precioCLP(producto.precio)}`}>
            {precioCLP(producto.precio)}
          </del>
          <Badge bg="" className="badge-oferta me-2">-{producto.descuento}%</Badge>
        </>
      )}
      <span>{textoPrecio(final)}</span>
    </div>
  );
}
