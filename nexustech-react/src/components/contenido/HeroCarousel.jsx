import { Link } from 'react-router';
import Carousel from 'react-bootstrap/Carousel';

// Carrusel de portada con las diapositivas de src/data/portada.js
export default function HeroCarousel({ diapositivas }) {
  return (
    <Carousel className="caja-vidrio overflow-hidden" interval={6000} aria-label="Novedades de NexusTech">
      {diapositivas.map((d) => (
        <Carousel.Item key={d.titulo}>
          <div className="portada-nexus d-flex flex-column justify-content-center p-5">
            <img src={d.imagen} className="fondo-portada" alt="" />
            <div className="contenido-portada">
              <i className={`bi ${d.icono} display-3`} aria-hidden="true"></i>
              <h2 className="fw-bold display-5 mt-3 mb-2">{d.titulo}</h2>
              <p className="lead w-75 d-none d-md-block">{d.texto}</p>
              <Link to={d.ruta} className="btn btn-portada mt-3">
                {d.boton}
              </Link>
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
