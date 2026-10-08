import { Link, useNavigate } from 'react-router';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../../hooks/useAuth.js';
import { puedeVerPanel } from '../../store/authReducer.js';

// Botones de sesión: Iniciar sesión / Crear cuenta o saludo + Panel + Salir
export default function ZonaUsuario() {
  const { sesion, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  function salir() {
    cerrarSesion();
    navigate('/', { replace: true });
  }

  if (!sesion)
    return (
      <div className="d-flex gap-2 flex-wrap">
        <Button as={Link} to="/login" variant="nexus-claro" size="sm">
          Iniciar sesión
        </Button>
        <Button as={Link} to="/registro" variant="nexus" size="sm">
          Crear cuenta
        </Button>
      </div>
    );

  return (
    <div className="d-flex gap-2 align-items-center flex-wrap">
      <span className="fw-bold">Hola, {sesion.nombre}</span>
      {puedeVerPanel(sesion) && (
        <Button as={Link} to="/admin" variant="nexus-claro" size="sm">
          Panel
        </Button>
      )}
      <Button variant="nexus-claro" size="sm" onClick={salir}>
        Salir
      </Button>
    </div>
  );
}
