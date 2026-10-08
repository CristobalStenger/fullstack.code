import { Link, useParams } from 'react-router';
import Badge from 'react-bootstrap/Badge';
import EstadoVacio from '../../components/comunes/EstadoVacio.jsx';
import { blogs } from '../../data/blogs.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function DetalleBlog() {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === Number(id));
  useTitulo(blog?.titulo ?? 'Artículo no encontrado');

  if (!blog)
    return (
      <EstadoVacio icono="bi-newspaper" titulo="El artículo no existe.">
        <Link to="/blogs" className="btn btn-nexus">
          Volver a los blogs
        </Link>
      </EstadoVacio>
    );

  return (
    <article className="caja-vidrio p-4 mb-4">
      <Badge bg="" className="badge-nexus mb-2">
        {blog.etiqueta}
      </Badge>
      <h1 className="fw-bold">{blog.titulo}</h1>
      <div className="caja-imagen-blog caja-imagen-blog-grande my-4">
        <img src={blog.imagen} alt={blog.titulo} />
      </div>
      {blog.parrafos.map((parrafo) => (
        <p key={parrafo.slice(0, 30)}>{parrafo}</p>
      ))}
      <h2 className="h4 fw-bold mt-4">{blog.subtitulo}</h2>
      <ul>
        {blog.puntos.map((punto) => (
          <li key={punto}>{punto}</li>
        ))}
      </ul>
      <p className="mt-4">{blog.cierre}</p>
      <Link to="/blogs" className="btn btn-nexus-claro mt-3">
        <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>Volver a los blogs
      </Link>
    </article>
  );
}
