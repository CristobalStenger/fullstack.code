import { Link } from 'react-router';
import Badge from 'react-bootstrap/Badge';

export default function BlogCard({ blog }) {
  return (
    <article className="card-producto h-100">
      <div className="caja-imagen-blog">
        <img src={blog.imagen} alt="" loading="lazy" />
      </div>
      <div className="card-body p-3">
        <Badge bg="" className="badge-nexus mb-2">
          {blog.etiqueta}
        </Badge>
        <h2 className="h5 fw-bold">{blog.titulo}</h2>
        <p>{blog.resumen}</p>
        <Link to={`/blogs/${blog.id}`} className="btn btn-nexus" aria-label={`Leer más: ${blog.titulo}`}>
          Leer más
        </Link>
      </div>
    </article>
  );
}
