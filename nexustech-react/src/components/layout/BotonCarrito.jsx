import { Link } from 'react-router';
import Badge from 'react-bootstrap/Badge';
import { useTienda } from '../../hooks/useTienda.js';
import { resumenCarrito } from '../../store/tiendaReducer.js';
import { precioCLP } from '../../utils/formatos.js';

// Botón verde del carrito con el total, como propone el PDF
export default function BotonCarrito() {
  const { estado } = useTienda();
  const { unidades, total } = resumenCarrito(estado);

  return (
    <Link
      to="/carrito"
      className="btn btn-success btn-sm btn-carrito ms-lg-3 position-relative"
      aria-label={`Carrito (${unidades})`}
    >
      <i className="bi bi-cart3 me-1" aria-hidden="true"></i>
      Carrito {precioCLP(total)}
      <Badge pill bg="primary" className="position-absolute top-0 start-100 translate-middle">
        {unidades}
      </Badge>
    </Link>
  );
}
