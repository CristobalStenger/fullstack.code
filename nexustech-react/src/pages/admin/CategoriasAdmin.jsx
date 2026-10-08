import { useState } from 'react';
import { Link } from 'react-router';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin.jsx';
import ConfirmarModal from '../../components/comunes/ConfirmarModal.jsx';
import { esAdministrador } from '../../store/authReducer.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function CategoriasAdmin() {
  useTitulo('Categorías');
  const { estado, dispatch } = useTienda();
  const { sesion } = useAuth();
  const admin = esAdministrador(sesion);
  const [eliminando, setEliminando] = useState(null);
  const cantidadDe = (c) => estado.productos.filter((p) => p.categoria === c.nombre).length;

  function confirmarEliminar() {
    dispatch({ type: 'ELIMINAR_CATEGORIA', id: eliminando.id });
    setEliminando(null);
  }

  return (
    <>
      <EncabezadoAdmin
        titulo="Categorías"
        acciones={
          admin && (
            <Link to="/admin/categorias/nueva" className="btn btn-nexus">
              <i className="bi bi-plus-square me-1" aria-hidden="true"></i>Nueva categoría
            </Link>
          )
        }
      >
        Organiza los productos de la tienda. Una categoría con productos no se puede eliminar.
      </EncabezadoAdmin>
      <section className="caja-vidrio p-4">
        <Table responsive hover className="tabla-admin align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">Ícono</th>
              <th scope="col">Nombre</th>
              <th scope="col">Dirección</th>
              <th scope="col">Descripción</th>
              <th scope="col">Productos</th>
              {admin && <th scope="col">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {estado.categorias.map((c) => (
              <tr key={c.id}>
                <td><i className={`bi ${c.icono} fs-4`} aria-hidden="true"></i></td>
                <td>{c.nombre}</td>
                <td><Link to={`/categorias/${c.slug}`}>/categorias/{c.slug}</Link></td>
                <td>{c.descripcion}</td>
                <td>{cantidadDe(c)}</td>
                {admin && (
                  <td className="text-nowrap">
                    <Link to={`/admin/categorias/${c.id}/editar`} className="btn btn-sm btn-nexus-claro me-1" aria-label={`Editar categoría ${c.nombre}`}>
                      <i className="bi bi-pencil" aria-hidden="true"></i>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      aria-label={`Eliminar categoría ${c.nombre}`}
                      onClick={() => setEliminando(c)}
                    >
                      <i className="bi bi-trash" aria-hidden="true"></i>
                    </Button>
                  </td>
                )}
              </tr>
            ))}
            {!estado.categorias.length && (
              <tr>
                <td colSpan={6} className="text-center py-4">No hay categorías registradas.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </section>
      <ConfirmarModal
        abierto={eliminando !== null}
        titulo="Eliminar categoría"
        textoConfirmar="Eliminar"
        confirmar={confirmarEliminar}
        cancelar={() => setEliminando(null)}
      >
        {eliminando && cantidadDe(eliminando) > 0
          ? `"${eliminando.nombre}" tiene ${cantidadDe(eliminando)} producto(s). Muévelos a otra categoría antes de eliminarla.`
          : `¿Seguro que quieres eliminar "${eliminando?.nombre}"?`}
      </ConfirmarModal>
    </>
  );
}
