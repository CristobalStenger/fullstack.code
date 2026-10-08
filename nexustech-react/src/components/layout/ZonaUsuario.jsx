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
        <Link to="/login" className="btn btn-nexus-claro btn-sm">
          Iniciar sesión
        </Link>
        <Link to="/registro" className="btn btn-nexus btn-sm">
          Crear cuenta
        </Link>
      </div>
    );

  return (
    <div className="d-flex gap-2 align-items-center flex-wrap">
      <span className="fw-bold">Hola, {sesion.nombre}</span>
      {puedeVerPanel(sesion) && (
        <Link to="/admin" className="btn btn-nexus-claro btn-sm">
          Panel
        </Link>
      )}
      <Button variant="nexus-claro" size="sm" onClick={salir}>
        Salir
      </Button>
    </div>
  );
}
