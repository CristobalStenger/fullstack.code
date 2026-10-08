import { useState } from 'react';
import { Link, useParams } from 'react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import PrecioProducto from '../../components/producto/PrecioProducto.jsx';
import StockBadge from '../../components/producto/StockBadge.jsx';
import ProductoGrid from '../../components/producto/ProductoGrid.jsx';
import EstadoVacio from '../../components/comunes/EstadoVacio.jsx';
import { obtener } from '../../services/crud.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function DetalleProducto() {
  const { id } = useParams();
  const { estado, dispatch } = useTienda();
  const producto = obtener(estado.productos, Number(id));
  useTitulo(producto?.nombre ?? 'Producto no encontrado');

  if (!producto)
    return (
      <EstadoVacio icono="bi-box-seam" titulo="Producto no encontrado.">
        <Link to="/productos" className="btn btn-nexus">
          Ir al catálogo
        </Link>
      </EstadoVacio>
    );

  const relacionados = estado.productos
    .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 4);

  return (
    <>
      {/* key reinicia la cantidad elegida al navegar a otro producto */}
      <FichaProducto
        key={producto.id}
        producto={producto}
        enCarrito={obtener(estado.carrito, producto.id)?.cantidad ?? 0}
        alAgregar={(cantidad) => dispatch({ type: 'AGREGAR', id: producto.id, cantidad })}
      />
      {relacionados.length > 0 && (
        <section className="mt-5">
          <h2 className="titulo-seccion">También te puede interesar</h2>
          <ProductoGrid productos={relacionados} alAgregar={(pid) => dispatch({ type: 'AGREGAR', id: pid })} />
        </section>
      )}
    </>
  );
}

function FichaProducto({ producto, enCarrito, alAgregar }) {
  const [elegida, setElegida] = useState(1);
  const disponible = producto.stock - enCarrito;
  // Nunca se ofrece más de lo que queda disponible
  const cantidad = Math.min(elegida, Math.max(1, disponible));
  const cambiar = (valor) => setElegida(Math.min(Math.max(1, valor), Math.max(1, disponible)));

  return (
    <Row className="g-4">
      <Col xs={12} lg={5}>
        <div className="caja-vidrio p-3">
          <div className="caja-imagen-grande">
            <img src={producto.imagen} alt={producto.nombre} />
          </div>
        </div>
      </Col>
      <Col xs={12} lg={7}>
        <div className="caja-vidrio p-4 h-100">
          <div className="mb-2 d-flex flex-wrap gap-1">
            <Badge bg="" className="badge-nexus">{producto.categoria}</Badge>
            <Badge bg="" className="badge-tipo">{producto.tipo}</Badge>
            <StockBadge producto={producto} />
          </div>
          <h1 className="fw-bold">{producto.nombre}</h1>
          <p className="mb-1">
            Código: <strong>{producto.codigo}</strong>
          </p>
          <p className="mb-1">
            Stock disponible: <strong>{producto.stock}</strong> unidades
            {enCarrito > 0 && ` (${enCarrito} en tu carrito)`}
          </p>
          <PrecioProducto producto={producto} className="fs-2 my-3" />

          <h2 className="h5 fw-bold">Descripción</h2>
          <p>{producto.descripcion || 'Sin descripción.'}</p>

          <h2 className="h5 fw-bold mt-4">Características</h2>
          <ul>
            <li>Categoría: {producto.categoria}</li>
            <li>Tipo: {producto.tipo}</li>
            <li>Garantía oficial de 12 meses</li>
            <li>Envío a todo Chile en 48 horas hábiles</li>
          </ul>

          <Form.Label htmlFor="cantidad-detalle" className="fw-bold mt-2">
            Cantidad
          </Form.Label>
          <InputGroup className="mb-3" style={{ maxWidth: 180 }}>
            <Button variant="nexus-claro" aria-label="Restar una unidad" onClick={() => cambiar(cantidad - 1)} disabled={cantidad <= 1}>
              -
            </Button>
            <Form.Control
              id="cantidad-detalle"
              type="number"
              min={1}
              max={Math.max(1, disponible)}
              className="text-center"
              value={cantidad}
              onChange={(e) => cambiar(Number(e.target.value) || 1)}
            />
            <Button variant="nexus-claro" aria-label="Sumar una unidad" onClick={() => cambiar(cantidad + 1)} disabled={cantidad >= disponible}>
              +
            </Button>
          </InputGroup>

          <Button variant="nexus" className="w-100 py-2" disabled={disponible < 1} onClick={() => alAgregar(cantidad)}>
            <i className="bi bi-cart-plus me-1" aria-hidden="true"></i>
            {producto.stock === 0 ? 'Sin stock' : disponible < 1 ? 'Ya tienes todo el stock en tu carrito' : 'Agregar al carrito'}
          </Button>
          <Link to="/productos" className="btn btn-nexus-claro w-100 py-2 mt-2">
            <i className="bi bi-arrow-left me-1" aria-hidden="true"></i> Volver al catálogo
          </Link>
        </div>
      </Col>
    </Row>
  );
}
