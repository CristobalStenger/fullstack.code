import Badge from 'react-bootstrap/Badge';

const colores = { Administrador: 'danger', Vendedor: 'warning', Cliente: 'primary' };

export default function RolBadge({ tipo }) {
  return (
    <Badge bg={colores[tipo] ?? 'secondary'} text={tipo === 'Vendedor' ? 'dark' : undefined}>
      {tipo}
    </Badge>
  );
}
