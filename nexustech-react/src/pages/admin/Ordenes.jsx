import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin.jsx';
import TablaOrdenes from '../../components/admin/TablaOrdenes.jsx';
import { nombreCompleto, normalizar, precioCLP } from '../../utils/formatos.js';
import { resumenVentas } from '../../utils/reportes.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function Ordenes() {
  useTitulo('Órdenes');
  const { estado } = useTienda();
  const [texto, setTexto] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const ventas = resumenVentas(estado.ordenes);

  const visibles = [...estado.ordenes]
    .sort((a, b) => b.numero - a.numero)
    .filter(
      (o) =>
        (!filtroEstado || o.estado === filtroEstado) &&
        normalizar(`${o.numero} ${o.codigo} ${nombreCompleto(o.cliente)} ${o.cliente.correo}`).includes(normalizar(texto)),
    );

  return (
    <>
      <EncabezadoAdmin titulo="Órdenes y boletas">
        {ventas.pagadas} órdenes pagadas por {precioCLP(ventas.totalVentas)} · {ventas.rechazadas} pagos rechazados.
      </EncabezadoAdmin>
      <section className="caja-vidrio p-4">
        <Row className="g-3 mb-3">
          <Col md={8}>
            <Form.Control
              type="search"
              aria-label="Buscar orden"
              placeholder="Buscar por número, cliente o correo"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Select aria-label="Filtrar por estado" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="pagada">Pagadas</option>
              <option value="rechazada">Rechazadas</option>
            </Form.Select>
          </Col>
        </Row>
        <TablaOrdenes ordenes={visibles} />
      </section>
    </>
  );
}
