import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CampoFormulario from './CampoFormulario.jsx';
import PrecioProducto from '../producto/PrecioProducto.jsx';
import { validarProducto } from '../../utils/validaciones.js';
import { useFormulario } from '../../hooks/useFormulario.js';

const VACIO = {
  codigo: '',
  nombre: '',
  categoria: '',
  tipo: '',
  descripcion: '',
  precio: '',
  stock: '',
  stockCritico: '',
  descuento: '',
  imagen: '',
};

// Los inputs trabajan con texto; los números se convierten al guardar
const aTexto = (producto) =>
  Object.fromEntries(Object.keys(VACIO).map((campo) => [campo, String(producto[campo] ?? '')]));

// Formulario único para crear (producto null) y editar productos
export default function ProductoForm({ producto = null, productos, categorias, onGuardar, onCancelar }) {
  const id = producto?.id ?? null;
  const form = useFormulario(producto ? aTexto(producto) : VACIO, (v) =>
    validarProducto(v, productos, id, categorias),
  );
  const { valores } = form;
  const campo = (nombre) => ({
    id: `producto-${nombre}`,
    name: nombre,
    value: valores[nombre],
    onChange: form.cambiar,
    error: form.error(nombre),
    valido: form.valido(nombre),
    className: '',
  });
  const vistaPrevia = {
    precio: Number(valores.precio) || 0,
    descuento: Number(valores.descuento) || 0,
  };

  return (
    <Form noValidate onSubmit={form.enviar((datos) => onGuardar(datos, id))}>
      <Row className="g-3">
        <Col md={4}>
          <CampoFormulario {...campo('codigo')} etiqueta="Código" ayuda="mín. 3" placeholder="CPU005" />
        </Col>
        <Col md={8}>
          <CampoFormulario {...campo('nombre')} etiqueta="Nombre del producto" ayuda="máx. 100" maxLength={100} />
        </Col>
        <Col md={6}>
          <CampoFormulario {...campo('categoria')} etiqueta="Categoría" as="select">
            <option value="">Selecciona una categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.nombre}>
                {c.nombre}
              </option>
            ))}
          </CampoFormulario>
        </Col>
        <Col md={6}>
          <CampoFormulario {...campo('tipo')} etiqueta="Tipo" ayuda="ej: Procesador, Mouse" maxLength={50} />
        </Col>
        <Col xs={12}>
          <CampoFormulario
            {...campo('descripcion')}
            etiqueta="Descripción"
            ayuda="opcional, máx. 500"
            as="textarea"
            rows={3}
            maxLength={500}
          />
        </Col>
        <Col xs={6} md={3}>
          <CampoFormulario {...campo('precio')} etiqueta="Precio" ayuda="0 = FREE" type="number" min={0} />
        </Col>
        <Col xs={6} md={3}>
          <CampoFormulario {...campo('descuento')} etiqueta="Descuento %" ayuda="opcional" type="number" min={0} max={90} />
        </Col>
        <Col xs={6} md={3}>
          <CampoFormulario {...campo('stock')} etiqueta="Stock" type="number" min={0} step={1} />
        </Col>
        <Col xs={6} md={3}>
          <CampoFormulario {...campo('stockCritico')} etiqueta="Stock crítico" ayuda="opcional" type="number" min={0} step={1} />
        </Col>
        <Col xs={12}>
          <CampoFormulario {...campo('imagen')} etiqueta="URL de imagen" ayuda="opcional, http o https" type="url" />
        </Col>
        <Col xs={12} className="d-flex align-items-center gap-3">
          <span className="fw-bold">Vista previa del precio:</span>
          <PrecioProducto producto={vistaPrevia} className="fs-5" />
        </Col>
        <Col xs={12} className="d-flex gap-2 flex-wrap">
          <Button type="submit" variant="nexus" className="flex-grow-1">
            Guardar producto
          </Button>
          <Button type="button" variant="secondary" onClick={onCancelar}>
            Cancelar
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
