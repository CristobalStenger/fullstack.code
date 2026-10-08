import Alert from 'react-bootstrap/Alert';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { useTienda } from '../../hooks/useTienda.js';
import { useAuth } from '../../hooks/useAuth.js';

const iconos = {
  success: 'bi-check-circle-fill',
  info: 'bi-info-circle-fill',
  warning: 'bi-exclamation-triangle-fill',
  danger: 'bi-x-circle-fill',
};

function Aviso({ aviso, cerrar }) {
  return (
    <Toast
      bg={aviso.tipo}
      onClose={cerrar}
      autohide
      delay={3500}
      className={aviso.tipo === 'warning' ? '' : 'text-white'}
    >
      <Toast.Body className="d-flex align-items-center gap-2">
        <i className={`bi ${iconos[aviso.tipo] ?? iconos.info}`} aria-hidden="true"></i>
        <span className="me-auto">{aviso.texto}</span>
        <button
          type="button"
          className={`btn-close ${aviso.tipo === 'warning' ? '' : 'btn-close-white'}`}
          aria-label="Cerrar aviso"
          onClick={cerrar}
        ></button>
      </Toast.Body>
    </Toast>
  );
}

// Reemplaza los alert() de la entrega 1 por avisos no bloqueantes
export default function AvisosGlobales() {
  const { estado, dispatch, errorGuardado } = useTienda();
  const { aviso, cerrarAviso, errorGuardado: errorSesion } = useAuth();

  return (
    <>
      {(errorGuardado || errorSesion) && (
        <Alert variant="warning" className="container mt-3">
          No se pudo guardar en este navegador. Los cambios funcionan mientras esta
          página permanezca abierta.
        </Alert>
      )}
      <ToastContainer position="top-end" className="p-3 position-fixed" style={{ zIndex: 1080 }}>
        {estado.aviso && (
          <Aviso
            key={`tienda-${estado.aviso.id}`}
            aviso={estado.aviso}
            cerrar={() => dispatch({ type: 'CERRAR_AVISO' })}
          />
        )}
        {aviso && <Aviso key={`auth-${aviso.id}`} aviso={aviso} cerrar={cerrarAviso} />}
      </ToastContainer>
    </>
  );
}
