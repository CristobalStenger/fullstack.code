import { useState } from 'react';
import { Link } from 'react-router';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin.jsx';
import ConfirmarModal from '../../components/comunes/ConfirmarModal.jsx';
import { esStockCritico, normalizar, textoPrecio } from '../../utils/formatos.js';
import { esAdministrador } from '../../store/authReducer.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function ProductosAdmin() {
  useTitulo('Productos');
  const { estado, dispatch } = useTienda();
  const { sesion } = useAuth();
  const admin = esAdministrador(sesion);
  const [texto, setTexto] = useState('');
  const [eliminando, setEliminando] = useState(null);

  const visibles = estado.productos.filter((p) =>
    normalizar(`${p.codigo} ${p.nombre} ${p.categoria} ${p.tipo}`).includes(normalizar(texto)),
  );

  function confirmarEliminar() {
    dispatch({ type: 'ELIMINAR_PRODUCTO', id: eliminando.id });
    setEliminando(null);
  }

  return (
    <>
      <EncabezadoAdmin
        titulo="Productos"
        acciones={
          <>
            {admin && (
              <Link to="/admin/productos/nuevo" className="btn btn-nexus">
                <i className="bi bi-plus-square me-1" aria-hidden="true"></i>Nuevo producto
              </Link>
            )}
            <Link to="/admin/productos/criticos" className="btn btn-nexus-claro">
              Productos críticos
            </Link>
            <Link to="/admin/productos/reportes" className="btn btn-nexus-claro">
              Reportes
            </Link>
          </>
        }
      >
        {estado.productos.length} productos en el catálogo.{' '}
        {!admin && 'Tu rol de vendedor solo permite consultar.'}
      </EncabezadoAdmin>

      <section className="caja-vidrio p-4">
        <Form.Control
          type="search"
          className="mb-3"
          aria-label="Buscar producto"
          placeholder="Buscar por código, nombre, categoría o tipo"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <Table responsive hover className="tabla-admin align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Producto</th>
              <th scope="col">Categoría</th>
              <th scope="col">Precio</th>
              <th scope="col">Stock</th>
              <th scope="col">Crítico</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((p) => (
              <tr key={p.id} className={esStockCritico(p) ? 'fila-critica' : undefined}>
                <td>{p.codigo}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img className="admin-thumb" src={p.imagen} alt="" />
                    <span>{p.nombre}</span>
                  </div>
                </td>
                <td>{p.categoria}</td>
                <td>
                  {textoPrecio(p.precio)}
                  {p.descuento > 0 && <Badge bg="" className="badge-oferta ms-1">-{p.descuento}%</Badge>}
                </td>
                <td className={esStockCritico(p) ? 'aviso-stock' : undefined}>
                  {p.stock}
                  {esStockCritico(p) && <i className="bi bi-exclamation-triangle ms-1" aria-label="Stock crítico"></i>}
                </td>
                <td>{p.stockCritico}</td>
                <td className="text-nowrap">
                  <Link to={`/admin/productos/${p.id}`} className="btn btn-sm btn-nexus-claro me-1" aria-label={`Ver ${p.nombre}`}>
                    <i className="bi bi-eye" aria-hidden="true"></i>
                  </Link>
                  {admin && (
                    <>
                      <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-sm btn-nexus-claro me-1" aria-label={`Editar ${p.nombre}`}>
                        <i className="bi bi-pencil" aria-hidden="true"></i>
                      </Link>
                      <Button size="sm" variant="outline-danger" aria-label={`Eliminar ${p.nombre}`} onClick={() => setEliminando(p)}>
                        <i className="bi bi-trash" aria-hidden="true"></i>
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {!visibles.length && (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No hay productos que coincidan.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </section>

      <ConfirmarModal
        abierto={eliminando !== null}
        titulo="Eliminar producto"
        textoConfirmar="Eliminar"
        confirmar={confirmarEliminar}
        cancelar={() => setEliminando(null)}
      >
        ¿Seguro que quieres eliminar "{eliminando?.nombre}"? También se retirará de los carritos.
      </ConfirmarModal>
    </>
  );
}
