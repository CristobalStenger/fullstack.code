import { Link, useNavigate, useParams } from 'react-router';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin.jsx';
import EstadoVacio from '../../components/comunes/EstadoVacio.jsx';
import CategoriaForm from '../../components/formularios/CategoriaForm.jsx';
import { obtener } from '../../services/crud.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function EditarCategoria() {
  useTitulo('Editar categoría');
  const { id } = useParams();
  const { estado, dispatch } = useTienda();
  const navigate = useNavigate();
  const categoria = obtener(estado.categorias, Number(id));

  if (!categoria)
    return (
      <EstadoVacio icono="bi-tags" titulo="La categoría no existe.">
        <Link to="/admin/categorias" className="btn btn-nexus">Volver a categorías</Link>
      </EstadoVacio>
    );

  function guardar(datos) {
    dispatch({ type: 'GUARDAR_CATEGORIA', id: categoria.id, datos });
    navigate('/admin/categorias');
  }

  return (
    <>
      <EncabezadoAdmin titulo={`Editar categoría: ${categoria.nombre}`}>
        Si cambias el nombre, los productos de esta categoría se actualizan automáticamente.
      </EncabezadoAdmin>
      <section className="caja-sesion">
        <CategoriaForm
          key={categoria.id}
          categoria={categoria}
          categorias={estado.categorias}
          onGuardar={guardar}
          onCancelar={() => navigate('/admin/categorias')}
        />
      </section>
    </>
  );
}
