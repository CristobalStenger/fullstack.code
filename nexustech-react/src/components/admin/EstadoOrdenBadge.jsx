import Badge from 'react-bootstrap/Badge';

export default function EstadoOrdenBadge({ estado }) {
  return estado === 'pagada' ? <Badge bg="success">Pagada</Badge> : <Badge bg="danger">Rechazada</Badge>;
}
