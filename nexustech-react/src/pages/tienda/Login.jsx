import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import EncabezadoPagina from '../../components/comunes/EncabezadoPagina.jsx';
import CampoFormulario from '../../components/formularios/CampoFormulario.jsx';
import { validarLogin } from '../../utils/validaciones.js';
import { puedeVerPanel } from '../../store/authReducer.js';
import { useFormulario } from '../../hooks/useFormulario.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useTitulo } from '../../hooks/useTitulo.js';

// Ruta a la que se vuelve después de entrar
function destinoPara(usuario, desde) {
  if (desde && (!desde.startsWith('/admin') || puedeVerPanel(usuario))) return desde;
  return puedeVerPanel(usuario) ? '/admin' : '/';
}

export default function Login() {
  useTitulo('Iniciar sesión');
  const { sesion, ingresar } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const form = useFormulario({ correo: state?.correo ?? '', clave: '' }, validarLogin);
  const [error, setError] = useState('');

  if (sesion) return <Navigate to={destinoPara(sesion, state?.desde)} replace />;

  const enviar = form.enviar(({ correo, clave }) => {
    const resultado = ingresar(correo, clave);
    if (resultado.ok) navigate(destinoPara(resultado.usuario, state?.desde), { replace: true });
    else setError(resultado.error);
  });

  return (
    <>
      <EncabezadoPagina icono="bi-person-circle" titulo="Iniciar sesión">
        Inicia sesión para comprar más rápido o administrar la tienda.
      </EncabezadoPagina>

      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <div className="caja-sesion">
            {state?.registrado && (
              <Alert variant="success">Cuenta creada correctamente. Ya puedes iniciar sesión.</Alert>
            )}
            {state?.desde && !state?.registrado && (
              <Alert variant="info">Inicia sesión para continuar.</Alert>
            )}
            <Form noValidate onSubmit={enviar} onChange={() => setError('')}>
              <CampoFormulario
                id="login-correo"
                name="correo"
                etiqueta="Correo electrónico"
                ayuda="@duoc.cl, @profesor.duoc.cl o @gmail.com"
                type="email"
                autoComplete="username"
                maxLength={100}
                placeholder="nombre@duoc.cl"
                value={form.valores.correo}
                onChange={form.cambiar}
                error={form.error('correo')}
              />
              <CampoFormulario
                id="login-clave"
                name="clave"
                etiqueta="Contraseña"
                ayuda="entre 4 y 10 caracteres"
                type="password"
                autoComplete="current-password"
                maxLength={10}
                value={form.valores.clave}
                onChange={form.cambiar}
                error={form.error('clave')}
              />
              {error && (
                <Alert variant="danger" role="alert">
                  {error}
                </Alert>
              )}
              <Button type="submit" variant="nexus" className="w-100 py-2">
                <i className="bi bi-box-arrow-in-right me-1" aria-hidden="true"></i> Entrar
              </Button>
            </Form>
            <p className="text-center mt-3 mb-2">
              ¿Todavía no tienes cuenta?{' '}
              <Link to="/registro" className="fw-bold">
                Regístrate aquí
              </Link>
            </p>
            <details className="small text-muted">
              <summary>Cuentas de prueba</summary>
              <ul className="mb-0 mt-2">
                <li>Administrador: admin@duoc.cl / admin123</li>
                <li>Vendedor: vendedor@duoc.cl / vende123</li>
                <li>Cliente: cliente@gmail.com / cliente123</li>
              </ul>
            </details>
          </div>
        </Col>
      </Row>
    </>
  );
}
