import { Link, Navigate, useNavigate, useParams } from 'react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import EstadoVacio from '../../components/comunes/EstadoVacio.jsx';
import ResultadoCompra from '../../components/compra/ResultadoCompra.jsx';
import { obtener } from '../../services/crud.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function CompraError() {
  useTitulo('Pago rechazado');
  const { numero } = useParams();
  const { estado } = useTienda();
  const navigate = useNavigate();
  const orden = obtener(estado.ordenes, Number(numero), 'numero');

  if (!orden)
    return (
      <EstadoVacio icono="bi-receipt" titulo="No encontramos esa orden.">
        <Link to="/productos" className="btn btn-nexus">Ir al catálogo</Link>
      </EstadoVacio>
    );
  if (orden.estado === 'pagada') return <Navigate to={`/compra/exitosa/${orden.numero}`} replace />;

  const puedeReintentar = estado.carrito.length > 0;

  return (
    <Row className="justify-content-center">
      <Col xs={12} lg={10} xl={9}>
        <ResultadoCompra
          orden={orden}
          icono="bi-x-circle"
          claseIcono="error"
          titulo="No se pudo realizar el pago."
          subtitulo="Detalle de la compra"
        >
          <Alert variant="danger">
            <strong>Motivo:</strong> {orden.motivo} Tu carrito se mantiene intacto y no se descontó stock.
          </Alert>
          <div className="text-center mb-4 d-flex justify-content-center flex-wrap gap-2">
            {puedeReintentar ? (
              <Button
                variant="success"
                onClick={() => navigate('/checkout', { state: { reintentoDe: orden.numero } })}
              >
                VOLVER A REALIZAR EL PAGO
              </Button>
            ) : (
              <Link to="/productos" className="btn btn-nexus">Ir al catálogo</Link>
            )}
            <Link to="/carrito" className="btn btn-nexus-claro">
              Revisar carrito
            </Link>
          </div>
        </ResultadoCompra>
      </Col>
    </Row>
  );
}
