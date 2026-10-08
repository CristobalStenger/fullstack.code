import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import ProgressBar from 'react-bootstrap/ProgressBar';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin.jsx';
import TarjetaMetrica from '../../components/admin/TarjetaMetrica.jsx';
import { precioCLP } from '../../utils/formatos.js';
import { entregasPorTipo, resumenVentas, ventasPorCategoria, ventasPorDia } from '../../utils/reportes.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useTitulo } from '../../hooks/useTitulo.js';

// Vista nueva: reportes generales de ventas
export default function Reportes() {
  useTitulo('Reportes');
  const { estado } = useTienda();
  const ventas = resumenVentas(estado.ordenes);
  const categorias = ventasPorCategoria(estado.ordenes);
  const dias = ventasPorDia(estado.ordenes);
  const entregas = entregasPorTipo(estado.ordenes);
  const totalOrdenes = ventas.pagadas + ventas.rechazadas;
  const aprobacion = totalOrdenes ? Math.round((ventas.pagadas / totalOrdenes) * 100) : 0;

  return (
    <>
      <EncabezadoAdmin titulo="Reportes de ventas">Informes generados a partir de las órdenes registradas.</EncabezadoAdmin>

      <Row className="g-3 mb-4">
        <Col md={6} xl={3}>
          <TarjetaMetrica titulo="Ventas totales" valor={precioCLP(ventas.totalVentas)} icono="bi-cash-stack" variante="success" />
        </Col>
        <Col md={6} xl={3}>
          <TarjetaMetrica titulo="Ticket promedio" valor={precioCLP(ventas.ticketPromedio)} icono="bi-receipt" />
        </Col>
        <Col md={6} xl={3}>
          <TarjetaMetrica titulo="Unidades vendidas" valor={ventas.unidades} icono="bi-box-seam" variante="warning" />
        </Col>
        <Col md={6} xl={3}>
          <TarjetaMetrica titulo="Pagos aprobados" valor={`${aprobacion}%`} detalle={`${ventas.rechazadas} rechazados`} icono="bi-credit-card" variante="danger" />
        </Col>
      </Row>

      <Row className="g-4">
        <Col xl={7}>
          <section className="caja-vidrio p-4 h-100">
            <h2 className="h5 fw-bold">Ventas por categoría</h2>
            {!categorias.length ? (
              <p className="mb-0">Todavía no hay ventas.</p>
            ) : (
              <Table responsive className="tabla-admin align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">Categoría</th>
                    <th scope="col">Unidades</th>
                    <th scope="col">Ventas</th>
                    <th scope="col" style={{ minWidth: 140 }}>Participación</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((f) => (
                    <tr key={f.categoria}>
                      <td>{f.categoria}</td>
                      <td>{f.unidades}</td>
                      <td>{precioCLP(f.total)}</td>
                      <td>
                        <ProgressBar variant="success" now={f.porcentaje} label={`${f.porcentaje}%`} aria-label={`${f.categoria} ${f.porcentaje}%`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </section>
        </Col>
        <Col xl={5}>
          <section className="caja-vidrio p-4 h-100">
            <h2 className="h5 fw-bold">Tipo de entrega</h2>
            <p className="mb-1">Despacho a domicilio: <strong>{entregas.despacho}</strong></p>
            <p>Retiro en tienda: <strong>{entregas.retiro}</strong></p>
            <h2 className="h5 fw-bold mt-4">Ventas por día</h2>
            {!dias.length ? (
              <p className="mb-0">Todavía no hay ventas.</p>
            ) : (
              <Table responsive size="sm" className="tabla-admin mb-0">
                <thead>
                  <tr>
                    <th scope="col">Día</th>
                    <th scope="col">Órdenes</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {dias.map((d) => (
                    <tr key={d.dia}>
                      <td>{d.dia}</td>
                      <td>{d.ordenes}</td>
                      <td>{precioCLP(d.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </section>
        </Col>
      </Row>
    </>
  );
}
