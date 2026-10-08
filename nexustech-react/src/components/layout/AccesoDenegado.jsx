import { Link } from 'react-router';
import Container from 'react-bootstrap/Container';
import EstadoVacio from '../comunes/EstadoVacio.jsx';

export default function AccesoDenegado({ tipo }) {
  return (
    <Container as="section" className="py-4">
      <EstadoVacio icono="bi-shield-lock" titulo="Acceso denegado">
        <p>Tu cuenta ({tipo}) no tiene permisos para ver esta sección.</p>
        <Link to="/" className="btn btn-nexus">
          Volver a la tienda
        </Link>
      </EstadoVacio>
    </Container>
  );
}
