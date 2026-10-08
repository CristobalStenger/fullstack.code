import { Link, useParams } from 'react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin.jsx';
import EstadoVacio from '../../components/comunes/EstadoVacio.jsx';
import PrecioProducto from '../../components/producto/PrecioProducto.jsx';
import StockBadge from '../../components/producto/StockBadge.jsx';
import { obtener } from '../../services/crud.js';
import { esAdministrador } from '../../store/authReducer.js';
import { precioCLP } from '../../utils/formatos.js';
import { ordenesPagadas } from '../../utils/reportes.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function MostrarProducto() {
  const { id } = useParams();
  const { estado } = useTienda();
  const { sesion } = useAuth();
  const producto = obtener(estado.productos, Number(id));
  useTitulo(producto?.nombre ?? 'Producto no encontrado');

  if (!producto)
    return (
      <EstadoVacio icono="bi-box-seam" titulo="El producto no existe.">
        <Link to="/admin/productos" className="btn btn-nexus">Volver a productos</Link>
      </EstadoVacio>
    );

  const vendidas = ordenesPagadas(estado.ordenes)
    .flatMap((o) => o.items)
    .filter((i) => i.id === producto.id)
    .reduce((total, i) => total + i.cantidad, 0);

  const filas = [
    ['Código', producto.codigo],
    ['Categoría', producto.categoria],
    ['Tipo', producto.tipo],
    ['Precio normal', precioCLP(producto.precio)],
    ['Descuento', `${producto.descuento}%`],
    ['Stock', producto.stock],
    ['Stock crítico', producto.stockCritico],
    ['Unidades vendidas', vendidas],
  ];

  return (
    <>
      <EncabezadoAdmin
        titulo={producto.nombre}
        acciones={
          <>
            {esAdministrador(sesion) && (
              <Link to={`/admin/productos/${producto.id}/editar`} className="btn btn-nexus">
                <i className="bi bi-pencil me-1" aria-hidden="true"></i>Editar producto
              </Link>
            )}
            <Link to={`/productos/${producto.id}`} className="btn btn-nexus-claro">
              Ver en la tienda
            </Link>
            <Link to="/admin/productos" className="btn btn-nexus-claro">
              Volver
            </Link>
          </>
        }
      >
        <StockBadge producto={producto} />
      </EncabezadoAdmin>
      <Row className="g-4">
        <Col md={4}>
          <div className="caja-vidrio p-3">
            <div className="caja-imagen-grande">
              <img src={producto.imagen} alt={producto.nombre} />
            </div>
          </div>
        </Col>
        <Col md={8}>
          <div className="caja-vidrio p-4">
            <PrecioProducto producto={producto} className="fs-3 mb-3" />
            <Table className="tabla-admin mb-3">
              <tbody>
                {filas.map(([etiqueta, valor]) => (
                  <tr key={etiqueta}>
                    <th scope="row">{etiqueta}</th>
                    <td>{valor}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <h2 className="h6 fw-bold">Descripción</h2>
            <p className="mb-0">{producto.descripcion || 'Sin descripción.'}</p>
          </div>
        </Col>
      </Row>
    </>
  );
}
