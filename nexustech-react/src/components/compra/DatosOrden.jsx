import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { OPCIONES_ENTREGA } from '../../data/configuracion.js';

function Dato({ etiqueta, valor, md = 4 }) {
  return (
    <Col xs={12} md={md}>
      <p className="small fw-bold mb-1">{etiqueta}</p>
      <p className="campo-solo-lectura mb-0">{valor || '—'}</p>
    </Col>
  );
}

// Datos del cliente y de la entrega de una orden (solo lectura)
export default function DatosOrden({ orden }) {
  const { cliente, entrega } = orden;
  const opcion = OPCIONES_ENTREGA.find((o) => o.valor === entrega.tipo);

  return (
    <>
      <h2 className="h5 fw-bold">Información del cliente</h2>
      <Row className="g-3 mb-4">
        <Dato etiqueta="Nombre" valor={cliente.nombre} />
        <Dato etiqueta="Apellidos" valor={cliente.apellidos} />
        <Dato etiqueta="Correo" valor={cliente.correo} />
      </Row>
      <h2 className="h5 fw-bold">Dirección de entrega de los productos</h2>
      <Row className="g-3 mb-4">
        <Dato etiqueta="Calle" valor={entrega.calle} md={6} />
        <Dato etiqueta="Departamento (opcional)" valor={entrega.departamento} md={6} />
        <Dato etiqueta="Región" valor={entrega.region} md={6} />
        <Dato etiqueta="Comuna" valor={entrega.comuna} md={6} />
        <Dato etiqueta="Indicaciones para la entrega (opcional)" valor={entrega.indicaciones} md={12} />
        <Dato etiqueta="Tipo de entrega" valor={opcion?.texto} md={6} />
        <Dato etiqueta="Medio de pago" valor={`Tarjeta ${orden.pago?.tarjeta ?? ''}`} md={6} />
      </Row>
    </>
  );
}
