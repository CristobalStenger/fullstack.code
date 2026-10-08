import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth.js';
import { seccionesVisibles } from './secciones.js';

export default function AdminSidebar() {
  const { sesion, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  function salir() {
    cerrarSesion();
    navigate('/', { replace: true });
  }

  return (
    <nav className="menu-lateral" aria-label="Menú de administración">
      <h2 className="mb-3">Menú</h2>
      {seccionesVisibles(sesion).map((s) => (
        <NavLink key={s.ruta} to={s.ruta} end={s.end}>
          <i className={`bi ${s.icono} me-2`} aria-hidden="true"></i>
          {s.texto}
        </NavLink>
      ))}
      <div className="separador"></div>
      <NavLink to="/admin/perfil">
        <i className="bi bi-person-circle me-2" aria-hidden="true"></i>Perfil
      </NavLink>
      <div className="separador"></div>
      <NavLink to="/">
        <i className="bi bi-shop me-2" aria-hidden="true"></i>Tienda
      </NavLink>
      <button type="button" className="btn btn-outline-danger w-100 mt-2" onClick={salir}>
        <i className="bi bi-box-arrow-right me-2" aria-hidden="true"></i>Cerrar sesión
      </button>
    </nav>
  );
}
