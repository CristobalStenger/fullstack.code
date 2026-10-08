import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth.js';
import AccesoDenegado from './AccesoDenegado.jsx';

// Sin sesión redirige al login recordando la ruta pedida.
// Con sesión pero sin el rol necesario muestra "acceso denegado".
// Es una protección visual: un backend real debe validar cada operación.
export default function RutaProtegida({ roles }) {
  const { sesion } = useAuth();
  const location = useLocation();

  if (!sesion) return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  if (!roles.includes(sesion.tipo)) return <AccesoDenegado tipo={sesion.tipo} />;
  return <Outlet />;
}
