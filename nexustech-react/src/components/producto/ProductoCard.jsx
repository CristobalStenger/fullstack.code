import { Link } from 'react-router';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import PrecioProducto from './PrecioProducto.jsx';
import StockBadge from './StockBadge.jsx';

// Tarjeta de un producto. No guarda su propio carrito:
// avisa al padre con alAgregar(id) para que todos compartan el mismo.
export default function ProductoCard({ producto, alAgregar }) {
  const agotado = producto.stock === 0;
  const ruta = `/productos/${producto.id}`;

  return (
    <article className="card-producto h-100 d-flex flex-column">
      <Link to={ruta} className="caja-imagen enlace-producto" tabIndex={-1} aria-hidden="true">
        <img src={producto.imagen} alt="" loading="lazy" />
      </Link>
      <div className="card-body d-flex flex-column">
        <div className="mb-2 d-flex flex-wrap gap-1">
          <Badge bg="" className="badge-nexus">{producto.categoria}</Badge>
          <Badge bg="" className="badge-tipo">{producto.tipo}</Badge>
          <StockBadge producto={producto} />
        </div>
        <Link to={ruta} className="enlace-producto">
          <h2 className="h6 fw-bold">{producto.nombre}</h2>
        </Link>
        <PrecioProducto producto={producto} className="fs-5 mt-auto mb-3" />
        <Button
          variant="nexus"
          className="w-100"
          disabled={agotado}
          onClick={() => alAgregar(producto.id)}
          aria-label={agotado ? `${producto.nombre} sin stock` : `Agregar ${producto.nombre} al carrito`}
        >
          <i className="bi bi-cart-plus me-1" aria-hidden="true"></i>
          {agotado ? 'Sin stock' : 'Agregar al carrito'}
        </Button>
      </div>
    </article>
  );
}
