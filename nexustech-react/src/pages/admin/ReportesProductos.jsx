import { Link } from 'react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import ProgressBar from 'react-bootstrap/ProgressBar';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin.jsx';
import TarjetaMetrica from '../../components/admin/TarjetaMetrica.jsx';
import { precioCLP } from '../../utils/formatos.js';
import { inventarioPorCategoria, productosMasVendidos } from '../../utils/reportes.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function ReportesProductos() {
  useTitulo('Reporte de productos');
  const { estado } = useTienda();
  const inventario = inventarioPorCategoria(estado.productos);
  const masVendidos = productosMasVendidos(estado.ordenes, 10);
  const valorTotal = inventario.reduce((total, f) => total + f.valor, 0);
  const sinStock = estado.productos.filter((p) => p.stock === 0).length;
  const enOferta = estado.productos.filter((p) => p.descuento > 0).length;

  return (
    <>
      <EncabezadoAdmin
        titulo="Reporte de productos"
        acciones={<Link to="/admin/productos" className="btn btn-nexus-claro">Volver a productos</Link>}
      >
        Inventario valorizado y productos más vendidos.
      </EncabezadoAdmin>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <TarjetaMetrica titulo="Inventario valorizado" valor={precioCLP(valorTotal)} icono="bi-cash-stack" variante="success" />
        </Col>
        <Col md={4}>
          <TarjetaMetrica titulo="Sin stock" valor={sinStock} icono="bi-x-octagon" variante="danger" />
        </Col>
        <Col md={4}>
          <TarjetaMetrica titulo="En oferta" valor={enOferta} icono="bi-percent" />
        </Col>
      </Row>

      <section className="caja-vidrio p-4 mb-4">
        <h2 className="h5 fw-bold">Stock por categoría</h2>
        <Table responsive className="tabla-admin align-middle">
          <thead>
            <tr>
              <th scope="col">Categoría</th>
              <th scope="col">Productos</th>
              <th scope="col">Unidades</th>
              <th scope="col">Críticos</th>
              <th scope="col">Valor</th>
              <th scope="col" style={{ minWidth: 160 }}>% del inventario</th>
            </tr>
          </thead>
          <tbody>
            {inventario.map((f) => (
              <tr key={f.categoria}>
                <td>{f.categoria}</td>
                <td>{f.productos}</td>
                <td>{f.unidades}</td>
                <td>{f.criticos}</td>
                <td>{precioCLP(f.valor)}</td>
                <td>
                  <ProgressBar now={f.porcentaje} label={`${f.porcentaje}%`} aria-label={`${f.categoria} ${f.porcentaje}%`} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      <section className="caja-vidrio p-4">
        <h2 className="h5 fw-bold">Productos más vendidos</h2>
        {!masVendidos.length ? (
          <p className="mb-0">Todavía no hay ventas.</p>
        ) : (
          <Table responsive className="tabla-admin align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Producto</th>
                <th scope="col">Unidades</th>
                <th scope="col">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {masVendidos.map((p, indice) => (
                <tr key={p.id}>
                  <td>{indice + 1}</td>
                  <td>{p.nombre}</td>
                  <td>{p.unidades}</td>
                  <td>{precioCLP(p.total)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>
    </>
  );
}
