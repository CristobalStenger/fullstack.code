import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ORDENES, RANGOS_PRECIO } from '../../utils/catalogo.js';

// Barra de filtros controlada: los valores vienen del padre y
// cada cambio se informa con onCambio(campo, valor).
export default function FiltrosCatalogo({
  filtros,
  onCambio,
  onLimpiar,
  categorias = [],
  tipos = [],
  mostrarCategoria = true,
  resultados,
}) {
  const cambiar = (campo) => (evento) => onCambio(campo, evento.target.value);

  return (
    <div className="barra-filtros">
      <Row className="g-3 align-items-end">
        <Col xs={12} md={6} lg={mostrarCategoria ? 3 : 4}>
          <Form.Group controlId="filtro-texto">
            <Form.Label>Buscar producto</Form.Label>
            <Form.Control
              type="search"
              placeholder="Ej: Ryzen, RTX, teclado..."
              value={filtros.texto}
              onChange={cambiar('texto')}
            />
          </Form.Group>
        </Col>
        {mostrarCategoria && (
          <Col xs={6} md={3} lg={2}>
            <Form.Group controlId="filtro-categoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Select value={filtros.categoria} onChange={cambiar('categoria')}>
                <option value="">Todas</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        )}
        <Col xs={6} md={3} lg={2}>
          <Form.Group controlId="filtro-tipo">
            <Form.Label>Tipo</Form.Label>
            <Form.Select value={filtros.tipo} onChange={cambiar('tipo')}>
              <option value="">Todos</option>
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={6} md={4} lg={2}>
          <Form.Group controlId="filtro-precio">
            <Form.Label>Rango de precio</Form.Label>
            <Form.Select value={filtros.rango} onChange={cambiar('rango')}>
              {RANGOS_PRECIO.map((r) => (
                <option key={r.valor} value={r.valor}>
                  {r.texto}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={6} md={4} lg={mostrarCategoria ? 1 : 2}>
          <Form.Group controlId="filtro-disponibilidad">
            <Form.Label>Stock</Form.Label>
            <Form.Select value={filtros.disponibilidad} onChange={cambiar('disponibilidad')}>
              <option value="">Todos</option>
              <option value="disponible">Disponible</option>
              <option value="agotado">Sin stock</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={8} md={3} lg={mostrarCategoria ? 1 : 1}>
          <Form.Group controlId="filtro-orden">
            <Form.Label>Ordenar</Form.Label>
            <Form.Select value={filtros.orden} onChange={cambiar('orden')}>
              {ORDENES.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.texto}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={4} md={1} lg={1}>
          <Button
            variant="nexus-claro"
            className="w-100"
            onClick={onLimpiar}
            title="Limpiar filtros"
            aria-label="Limpiar filtros"
          >
            <i className="bi bi-arrow-counterclockwise" aria-hidden="true"></i>
          </Button>
        </Col>
      </Row>
      {resultados !== undefined && (
        <p className="mb-0 mt-3 fw-bold" role="status">
          {resultados} producto(s) encontrado(s)
        </p>
      )}
    </div>
  );
}
