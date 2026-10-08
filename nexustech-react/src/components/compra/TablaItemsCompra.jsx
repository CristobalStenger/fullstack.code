import Table from 'react-bootstrap/Table';
import { textoPrecio } from '../../utils/formatos.js';

// Tabla de solo lectura con los productos de una compra u orden.
// items: [{ id, nombre, imagen, precio, cantidad }]
export default function TablaItemsCompra({ items }) {
  return (
    <div className="tabla-carrito table-responsive">
      <Table className="align-middle mb-0" size="sm">
        <thead>
          <tr>
            <th scope="col">Imagen</th>
            <th scope="col">Nombre</th>
            <th scope="col">Precio</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="mini-imagen">
                  <img src={item.imagen} alt="" />
                </div>
              </td>
              <td>{item.nombre}</td>
              <td>{textoPrecio(item.precio)}</td>
              <td>{item.cantidad}</td>
              <td className="fw-bold">{textoPrecio(item.precio * item.cantidad)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
