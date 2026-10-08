import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductoCard from './ProductoCard.jsx';
import EstadoVacio from '../comunes/EstadoVacio.jsx';

// Lista de tarjetas: map() convierte el arreglo en componentes
export default function ProductoGrid({
  productos,
  alAgregar,
  mensajeVacio = 'No encontramos productos con esos filtros.',
}) {
  if (!productos.length) return <EstadoVacio titulo={mensajeVacio} />;

  return (
    <Row className="g-4">
      {productos.map((producto) => (
        <Col xs={12} sm={6} lg={3} key={producto.id}>
          <ProductoCard producto={producto} alAgregar={alAgregar} />
        </Col>
      ))}
    </Row>
  );
}
