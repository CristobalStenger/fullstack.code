import { Link, Outlet } from 'react-router';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdminSidebar from '../admin/AdminSidebar.jsx';
import AvisosGlobales from '../comunes/AvisosGlobales.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useCambioDeRuta } from './useCambioDeRuta.js';

// Estructura del panel: barra superior oscura, menú lateral y contenido
export default function AdminLayout() {
  const { sesion } = useAuth();
  const main = useCambioDeRuta();

  return (
    <>
      <a className="saltar-contenido" href="#contenido-admin">
        Saltar al contenido
      </a>
      <header>
        <Navbar className="admin-topbar" variant="dark">
          <Container fluid className="px-lg-4">
            <Navbar.Brand as={Link} to="/admin" className="d-flex align-items-center">
              <i className="bi bi-cpu-fill fs-4 me-2" aria-hidden="true"></i>
              NexusTech <small className="fw-normal ms-2">Administración</small>
            </Navbar.Brand>
            <span className="small d-none d-sm-inline">
              <i className="bi bi-person-badge me-1" aria-hidden="true"></i>
              {sesion.nombre} ({sesion.tipo})
            </span>
          </Container>
        </Navbar>
      </header>
      <AvisosGlobales />
      <Container fluid className="px-lg-4 my-4 flex-grow-1">
        <Row className="g-4">
          <Col xs={12} lg={3} xl={2}>
            <AdminSidebar />
          </Col>
          <Col xs={12} lg={9} xl={10}>
            <main id="contenido-admin" tabIndex={-1} ref={main}>
              <Outlet />
            </main>
          </Col>
        </Row>
      </Container>
      <footer className="footer-nexus text-center p-3">
        <small>&copy; 2026 NexusTech · Panel de administración</small>
      </footer>
    </>
  );
}
