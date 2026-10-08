import { useNavigate } from 'react-router';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin.jsx';
import ProductoForm from '../../components/formularios/ProductoForm.jsx';
import { useTienda } from '../../hooks/useTienda.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function NuevoProducto() {
  useTitulo('Nuevo producto');
  const { estado, dispatch } = useTienda();
  const navigate = useNavigate();

  function guardar(datos) {
    dispatch({ type: 'GUARDAR_PRODUCTO', id: null, datos });
    navigate('/admin/productos');
  }

  return (
    <>
      <EncabezadoAdmin titulo="Nuevo producto">Completa los datos para agregarlo al catálogo.</EncabezadoAdmin>
      <section className="caja-sesion">
        <ProductoForm
          productos={estado.productos}
          categorias={estado.categorias}
          onGuardar={guardar}
          onCancelar={() => navigate('/admin/productos')}
        />
      </section>
    </>
  );
}
