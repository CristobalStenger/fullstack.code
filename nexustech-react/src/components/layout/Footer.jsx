import { Link } from 'react-router';

const enlaces = [
  { ruta: '/', texto: 'Inicio' },
  { ruta: '/productos', texto: 'Productos' },
  { ruta: '/categorias', texto: 'Categorías' },
  { ruta: '/ofertas', texto: 'Ofertas' },
  { ruta: '/nosotros', texto: 'Nosotros' },
  { ruta: '/blogs', texto: 'Blogs' },
  { ruta: '/contacto', texto: 'Contacto' },
];

export default function Footer() {
  return (
    <footer className="footer-nexus text-center p-4 mt-5">
      <p className="mb-1 fw-bold">
        <i className="bi bi-cpu-fill me-1" aria-hidden="true"></i> NexusTech
      </p>
      <nav aria-label="Enlaces del pie de página">
        <ul className="list-unstyled d-flex flex-wrap justify-content-center gap-3 mb-2">
          {enlaces.map((e) => (
            <li key={e.ruta}>
              <Link to={e.ruta}>{e.texto}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="mb-0">&copy; 2026 NexusTech. Tienda de tecnología, componentes y gaming.</p>
    </footer>
  );
}
