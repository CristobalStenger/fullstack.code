import Badge from 'react-bootstrap/Badge';
import { estadoStock } from '../../utils/formatos.js';

export default function StockBadge({ producto }) {
  const { texto, variante } = estadoStock(producto);
  return (
    <Badge bg={variante} text={variante === 'warning' ? 'dark' : undefined}>
      {texto}
    </Badge>
  );
}
