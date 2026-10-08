import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { textoPrecio } from '../../utils/formatos.js';

// Una fila del carrito con controles de cantidad y eliminar
export default function FilaCarrito({ item, alCambiar, alQuitar }) {
  const excede = item.cantidad > item.stock;

  return (
    <tr className={excede ? 'fila-critica' : undefined}>
      <td>
        <div className="d-flex align-items-center gap-2">
          <div className="mini-imagen">
            <img src={item.imagen} alt="" />
          </div>
          <div>
            <span className="fw-semibold d-block">{item.nombre}</span>
            <small>{item.tipo}</small>
            {excede && (
              <small className="d-block aviso-stock">Solo quedan {item.stock} unidades</small>
            )}
          </div>
        </div>
      </td>
      <td>{textoPrecio(item.precioUnitario)}</td>
      <td className="text-center">
        <ButtonGroup size="sm">
          <Button
            variant="nexus-claro"
            aria-label={`Quitar una unidad de ${item.nombre}`}
            onClick={() => alCambiar(Math.min(item.stock, item.cantidad - 1))}
          >
            -
          </Button>
          <span className="btn btn-light disabled px-3 fw-bold" aria-label={`Cantidad de ${item.nombre}`}>
            {item.cantidad}
          </span>
          <Button
            variant="nexus-claro"
            aria-label={`Agregar una unidad de ${item.nombre}`}
            disabled={item.cantidad >= item.stock}
            onClick={() => alCambiar(item.cantidad + 1)}
          >
            +
          </Button>
        </ButtonGroup>
      </td>
      <td className="fw-bold">{textoPrecio(item.precioUnitario * item.cantidad)}</td>
      <td className="text-center">
        <Button size="sm" variant="outline-danger" aria-label={`Eliminar ${item.nombre}`} onClick={alQuitar}>
          <i className="bi bi-trash" aria-hidden="true"></i>
        </Button>
      </td>
    </tr>
  );
}
