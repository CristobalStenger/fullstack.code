import { Link, useParams } from 'react-router';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin.jsx';
import EstadoOrdenBadge from '../../components/admin/EstadoOrdenBadge.jsx';
import EstadoVacio from '../../components/comunes/EstadoVacio.jsx';
import ResultadoCompra from '../../components/compra/ResultadoCompra.jsx';
import { obtener } from '../../services/crud.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useTitulo } from '../../hooks/useTitulo.js';

// Vista "Mostrar boleta" del panel
export default function DetalleOrden() {
  const { numero } = useParams();
  const { estado } = useTienda();
  const orden = obtener(estado.ordenes, Number(numero), 'numero');
  useTitulo(orden ? `Boleta #${orden.numero}` : 'Orden no encontrada');

  if (!orden)
    return (
      <EstadoVacio icono="bi-receipt" titulo="La orden no existe.">
        <Link to="/admin/ordenes" className="btn btn-nexus">Volver a órdenes</Link>
      </EstadoVacio>
    );

  const pagada = orden.estado === 'pagada';

  return (
    <>
      <EncabezadoAdmin
        titulo={`Boleta #${orden.numero}`}
        acciones={
          <>
            <Button variant="danger" size="sm" onClick={() => window.print()} className="no-imprimir">
              <i className="bi bi-printer me-1" aria-hidden="true"></i>Imprimir
            </Button>
            <Link to="/admin/ordenes" className="btn btn-sm btn-nexus-claro no-imprimir">
              Volver
            </Link>
          </>
        }
      >
        Estado: <EstadoOrdenBadge estado={orden.estado} />
      </EncabezadoAdmin>
      <ResultadoCompra
        orden={orden}
        icono={pagada ? 'bi-check-circle' : 'bi-x-circle'}
        claseIcono={pagada ? 'exito' : 'error'}
        titulo={pagada ? 'Compra' : 'Pago rechazado'}
      >
        {!pagada && <Alert variant="danger">Motivo: {orden.motivo}</Alert>}
      </ResultadoCompra>
    </>
  );
}
