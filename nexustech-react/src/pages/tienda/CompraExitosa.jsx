import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import EstadoVacio from '../../components/comunes/EstadoVacio.jsx';
import ResultadoCompra from '../../components/compra/ResultadoCompra.jsx';
import { obtener } from '../../services/crud.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function CompraExitosa() {
  useTitulo('Compra exitosa');
  const { numero } = useParams();
  const { estado } = useTienda();
  const [correoEnviado, setCorreoEnviado] = useState(false);
  const orden = obtener(estado.ordenes, Number(numero), 'numero');

  if (!orden)
    return (
      <EstadoVacio icono="bi-receipt" titulo="No encontramos esa orden.">
        <Link to="/productos" className="btn btn-nexus">Ir al catálogo</Link>
      </EstadoVacio>
    );
  if (orden.estado !== 'pagada') return <Navigate to={`/compra/error/${orden.numero}`} replace />;

  return (
    <Row className="justify-content-center">
      <Col xs={12} lg={10} xl={9}>
        <ResultadoCompra
          orden={orden}
          icono="bi-check-circle"
          claseIcono="exito"
          titulo="Se ha realizado la compra."
          subtitulo="Guarda este comprobante. Te enviaremos novedades del despacho a tu correo."
          acciones={
            <>
              <Button variant="danger" size="sm" onClick={() => window.print()}>
                <i className="bi bi-file-earmark-pdf me-1" aria-hidden="true"></i>Imprimir boleta en PDF
              </Button>
              <Button variant="success" size="sm" onClick={() => setCorreoEnviado(true)}>
                <i className="bi bi-envelope me-1" aria-hidden="true"></i>Enviar boleta por email
              </Button>
              <Link to="/productos" className="btn btn-nexus-claro btn-sm">
                Seguir comprando
              </Link>
            </>
          }
        >
          {correoEnviado && (
            <Alert variant="success" role="status">
              Boleta enviada a {orden.cliente.correo} (envío simulado).
            </Alert>
          )}
        </ResultadoCompra>
      </Col>
    </Row>
  );
}
