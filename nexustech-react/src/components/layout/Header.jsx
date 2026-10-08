import { Link, NavLink } from 'react-router';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import BuscadorHeader from './BuscadorHeader.jsx';
import ZonaUsuario from './ZonaUsuario.jsx';
import BotonCarrito from './BotonCarrito.jsx';
import { useTienda } from '../../hooks/useTienda.js';

const enlaces = [
  { ruta: '/', texto: 'Inicio', end: true },
  { ruta: '/productos', texto: 'Productos' },
  { ruta: '/ofertas', texto: 'Ofertas' },
  { ruta: '/nosotros', texto: 'Nosotros' },
  { ruta: '/blogs', texto: 'Blog' },
  { ruta: '/contacto', texto: 'Contacto' },
];

// Barra en dos filas: logo, buscador y sesión arriba; menú y carrito abajo.
// En móvil todo se agrupa en el menú colapsable de React Bootstrap.
export default function Header() {
  const { estado } = useTienda();
  const [inicio, productos, ...resto] = enlaces;

  const enlace = ({ ruta, texto, end }) => (
    <Nav.Link key={ruta} as={NavLink} to={ruta} end={end} eventKey={ruta}>
      {texto}
    </Nav.Link>
  );

  return (
    <header>
      <Navbar expand="lg" className="nav-nexus" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <i className="bi bi-cpu-fill fs-3 me-2" aria-hidden="true"></i>
            <span>NexusTech</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir navegación" />
          <Navbar.Collapse id="menu-principal" className="flex-wrap">
            <BuscadorHeader />
            <ZonaUsuario />
            <div className="salto-fila d-none d-lg-block"></div>
            <Nav className="mx-lg-auto mt-2 align-items-lg-center" aria-label="Navegación principal">
              {enlace(inicio)}
              {enlace(productos)}
              <NavDropdown title="Categorías" id="menu-categorias">
                {estado.categorias.map((c) => (
                  <NavDropdown.Item key={c.id} as={NavLink} to={`/categorias/${c.slug}`} eventKey={c.slug}>
                    <i className={`bi ${c.icono} me-2`} aria-hidden="true"></i>
                    {c.nombre}
                  </NavDropdown.Item>
                ))}
                <NavDropdown.Divider />
                <NavDropdown.Item as={NavLink} to="/categorias" end eventKey="categorias">
                  Ver todas
                </NavDropdown.Item>
              </NavDropdown>
              {resto.map(enlace)}
              <BotonCarrito />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
