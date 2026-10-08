import { useNavigate } from 'react-router';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin.jsx';
import CategoriaForm from '../../components/formularios/CategoriaForm.jsx';
import { useTienda } from '../../hooks/useTienda.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function NuevaCategoria() {
  useTitulo('Nueva categoría');
  const { estado, dispatch } = useTienda();
  const navigate = useNavigate();

  function guardar(datos) {
    dispatch({ type: 'GUARDAR_CATEGORIA', id: null, datos });
    navigate('/admin/categorias');
  }

  return (
    <>
      <EncabezadoAdmin titulo="Nueva categoría" />
      <section className="caja-sesion">
        <CategoriaForm categorias={estado.categorias} onGuardar={guardar} onCancelar={() => navigate('/admin/categorias')} />
      </section>
    </>
  );
}
