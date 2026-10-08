import { Link } from 'react-router';
import Table from 'react-bootstrap/Table';
import EstadoOrdenBadge from './EstadoOrdenBadge.jsx';
import { formatearFecha, nombreCompleto, precioCLP } from '../../utils/formatos.js';

export default function TablaOrdenes({ ordenes }) {
  if (!ordenes.length) return <p className="mb-0">No hay órdenes para mostrar.</p>;

  return (
    <Table responsive hover className="tabla-admin align-middle mb-0">
      <thead>
        <tr>
          <th scope="col">N°</th>
          <th scope="col">Fecha</th>
          <th scope="col">Cliente</th>
          <th scope="col">Total</th>
          <th scope="col">Estado</th>
          <th scope="col">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ordenes.map((o) => (
          <tr key={o.numero}>
            <td>#{o.numero}</td>
            <td className="text-nowrap">{formatearFecha(o.fecha)}</td>
            <td>
              {nombreCompleto(o.cliente)}
              <small className="d-block text-muted">{o.cliente.correo}</small>
            </td>
            <td>{precioCLP(o.total)}</td>
            <td>
              <EstadoOrdenBadge estado={o.estado} />
            </td>
            <td>
              <Link to={`/admin/ordenes/${o.numero}`} className="btn btn-sm btn-nexus-claro" aria-label={`Ver boleta ${o.numero}`}>
                <i className="bi bi-eye me-1" aria-hidden="true"></i>Boleta
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
