import { Link } from 'react-router';
import Table from 'react-bootstrap/Table';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin.jsx';
import EstadoVacio from '../../components/comunes/EstadoVacio.jsx';
import StockBadge from '../../components/producto/StockBadge.jsx';
import { esAdministrador } from '../../store/authReducer.js';
import { productosCriticos } from '../../utils/reportes.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useTitulo } from '../../hooks/useTitulo.js';

// Vista nueva: productos con stock menor o igual a su stock crítico
export default function ProductosCriticos() {
  useTitulo('Productos críticos');
  const { estado } = useTienda();
  const { sesion } = useAuth();
  const criticos = productosCriticos(estado.productos);

  return (
    <>
      <EncabezadoAdmin
        titulo="Listado de productos críticos"
        acciones={<Link to="/admin/productos" className="btn btn-nexus-claro">Volver a productos</Link>}
      >
        Productos cuyo stock es menor o igual a su stock crítico: conviene reponerlos.
      </EncabezadoAdmin>
      {!criticos.length ? (
        <EstadoVacio icono="bi-check2-circle" titulo="No hay productos en stock crítico." />
      ) : (
        <section className="caja-vidrio p-4">
          <Table responsive hover className="tabla-admin align-middle mb-0">
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Producto</th>
                <th scope="col">Stock</th>
                <th scope="col">Crítico</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {criticos.map((p) => (
                <tr key={p.id}>
                  <td>{p.codigo}</td>
                  <td>{p.nombre}</td>
                  <td className="aviso-stock">{p.stock}</td>
                  <td>{p.stockCritico}</td>
                  <td><StockBadge producto={p} /></td>
                  <td>
                    <Link
                      to={esAdministrador(sesion) ? `/admin/productos/${p.id}/editar` : `/admin/productos/${p.id}`}
                      className="btn btn-sm btn-nexus-claro"
                    >
                      {esAdministrador(sesion) ? 'Reponer stock' : 'Ver'}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>
      )}
    </>
  );
}
