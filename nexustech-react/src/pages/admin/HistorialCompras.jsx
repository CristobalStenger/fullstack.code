import { Link, useParams } from 'react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin.jsx';
import TablaOrdenes from '../../components/admin/TablaOrdenes.jsx';
import TarjetaMetrica from '../../components/admin/TarjetaMetrica.jsx';
import EstadoVacio from '../../components/comunes/EstadoVacio.jsx';
import { obtener } from '../../services/crud.js';
import { nombreCompleto, precioCLP } from '../../utils/formatos.js';
import { ordenesDeUsuario, resumenVentas } from '../../utils/reportes.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useTitulo } from '../../hooks/useTitulo.js';

// Vista nueva: compras de un usuario (por RUN o correo)
export default function HistorialCompras() {
  useTitulo('Historial de compras');
  const { run } = useParams();
  const { usuarios } = useAuth();
  const { estado } = useTienda();
  const usuario = obtener(usuarios, run, 'run');

  if (!usuario)
    return (
      <EstadoVacio icono="bi-person-x" titulo="El usuario no existe.">
        <Link to="/admin/usuarios" className="btn btn-nexus">Volver a usuarios</Link>
      </EstadoVacio>
    );

  const ordenes = ordenesDeUsuario(estado.ordenes, usuario).sort((a, b) => b.numero - a.numero);
  const resumen = resumenVentas(ordenes);

  return (
    <>
      <EncabezadoAdmin
        titulo={`Historial de compras de ${nombreCompleto(usuario)}`}
        acciones={<Link to={`/admin/usuarios/${usuario.run}`} className="btn btn-nexus-claro">Volver al usuario</Link>}
      />
      <Row className="g-3 mb-4">
        <Col md={4}>
          <TarjetaMetrica titulo="Compras pagadas" valor={resumen.pagadas} icono="bi-bag-check" variante="success" />
        </Col>
        <Col md={4}>
          <TarjetaMetrica titulo="Total gastado" valor={precioCLP(resumen.totalVentas)} icono="bi-cash" />
        </Col>
        <Col md={4}>
          <TarjetaMetrica titulo="Pagos rechazados" valor={resumen.rechazadas} icono="bi-x-circle" variante="danger" />
        </Col>
      </Row>
      <section className="caja-vidrio p-4">
        <TablaOrdenes ordenes={ordenes} />
      </section>
    </>
  );
}
