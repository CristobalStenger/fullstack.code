import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EncabezadoPagina from '../../components/comunes/EncabezadoPagina.jsx';
import BlogCard from '../../components/contenido/BlogCard.jsx';
import { blogs } from '../../data/blogs.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function Blogs() {
  useTitulo('Blog');
  return (
    <>
      <EncabezadoPagina icono="bi-newspaper" titulo="Blog NexusTech">
        Noticias, guías y datos curiosos del mundo de la tecnología.
      </EncabezadoPagina>
      <Row as="section" className="g-4">
        {blogs.map((blog) => (
          <Col xs={12} md={6} key={blog.id}>
            <BlogCard blog={blog} />
          </Col>
        ))}
      </Row>
    </>
  );
}
