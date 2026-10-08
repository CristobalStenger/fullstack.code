import { Link } from 'react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import HeroCarousel from '../../components/contenido/HeroCarousel.jsx';
import CategoriaCard from '../../components/producto/CategoriaCard.jsx';
import ProductoGrid from '../../components/producto/ProductoGrid.jsx';
import { beneficios, diapositivas } from '../../data/portada.js';
import { LIMITE_DESTACADOS } from '../../data/configuracion.js';
import { productosEnOferta } from '../../utils/catalogo.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function Inicio() {
  useTitulo('Inicio');
  const { estado, dispatch } = useTienda();
  const agregar = (id) => dispatch({ type: 'AGREGAR', id });
  const destacados = estado.productos.filter((p) => p.stock > 0).slice(0, LIMITE_DESTACADOS);
  const ofertas = productosEnOferta(estado.productos).slice(0, 4);

  return (
    <>
      <h1 className="visually-hidden">NexusTech, tienda de tecnología</h1>
      <section className="mb-5">
        <HeroCarousel diapositivas={diapositivas} />
      </section>

      <section className="mb-5">
        <h2 className="titulo-seccion">Nuestras categorías</h2>
        <Row className="g-4">
          {estado.categorias.map((c) => (
            <Col xs={12} md={6} lg={3} key={c.id}>
              <CategoriaCard categoria={c} />
            </Col>
          ))}
        </Row>
      </section>

      {ofertas.length > 0 && (
        <section className="mb-5">
          <h2 className="titulo-seccion">Productos en oferta</h2>
          <ProductoGrid productos={ofertas} alAgregar={agregar} />
          <div className="text-center mt-4">
            <Link to="/ofertas" className="btn btn-nexus-claro px-4">
              Ver todas las ofertas
            </Link>
          </div>
        </section>
      )}

      <section className="mb-4">
        <h2 className="titulo-seccion">Productos destacados</h2>
        <ProductoGrid productos={destacados} alAgregar={agregar} mensajeVacio="Aún no hay productos disponibles." />
        <div className="text-center mt-4">
          <Link to="/productos" className="btn btn-nexus px-5 py-2 fs-5 text-uppercase">
            Ver todos los productos
          </Link>
        </div>
      </section>

      <section className="caja-vidrio p-4 my-5">
        <h2 className="visually-hidden">Beneficios</h2>
        <Row className="text-center g-4">
          {beneficios.map((b) => (
            <Col xs={12} md={3} key={b.titulo}>
              <i className={`bi ${b.icono} fs-1`} aria-hidden="true"></i>
              <h3 className="h5 fw-bold mt-2">{b.titulo}</h3>
              <p className="mb-0">{b.texto}</p>
            </Col>
          ))}
        </Row>
      </section>
    </>
  );
}
