import { Link, Navigate, useNavigate } from 'react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EncabezadoPagina from '../../components/comunes/EncabezadoPagina.jsx';
import UsuarioForm from '../../components/formularios/UsuarioForm.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function Registro() {
  useTitulo('Crear cuenta');
  const { sesion, usuarios, registrar } = useAuth();
  const navigate = useNavigate();

  if (sesion) return <Navigate to="/" replace />;

  function guardar(datos) {
    if (registrar(datos).ok)
      navigate('/login', { state: { registrado: true, correo: datos.correo.trim() } });
  }

  return (
    <>
      <EncabezadoPagina icono="bi-person-plus" titulo="Crear cuenta">
        Regístrate para comprar más rápido: tus datos de despacho se completan solos.
      </EncabezadoPagina>
      <Row className="justify-content-center">
        <Col xs={12} lg={9}>
          <div className="caja-sesion">
            <UsuarioForm usuarios={usuarios} modo="registro" textoBoton="Crear mi cuenta" onGuardar={guardar} />
            <p className="text-center mt-3 mb-0">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="fw-bold">
                Inicia sesión
              </Link>
            </p>
          </div>
        </Col>
      </Row>
    </>
  );
}
