import { Link } from 'react-router';

export default function CategoriaCard({ categoria, cantidad, activa = false }) {
  return (
    <Link
      to={`/categorias/${categoria.slug}`}
      className="text-decoration-none d-block h-100"
      aria-current={activa ? 'page' : undefined}
    >
      <div className={`card-categoria${activa ? ' activa' : ''}`}>
        <i className={`bi ${categoria.icono}`} aria-hidden="true"></i>
        <h3>{categoria.nombre}</h3>
        <p className="mb-1">{categoria.descripcion}</p>
        {cantidad !== undefined && <small className="fw-bold">{cantidad} producto(s)</small>}
      </div>
    </Link>
  );
}
