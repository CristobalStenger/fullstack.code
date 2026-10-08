import { useNavigate } from 'react-router';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin.jsx';
import UsuarioForm from '../../components/formularios/UsuarioForm.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function NuevoUsuario() {
  useTitulo('Nuevo usuario');
  const { usuarios, guardarUsuario } = useAuth();
  const navigate = useNavigate();

  function guardar(datos) {
    if (guardarUsuario(datos).ok) navigate('/admin/usuarios');
  }

  return (
    <>
      <EncabezadoAdmin titulo="Nuevo usuario">Crea cuentas de administrador, vendedor o cliente.</EncabezadoAdmin>
      <section className="caja-sesion">
        <UsuarioForm usuarios={usuarios} onGuardar={guardar} onCancelar={() => navigate('/admin/usuarios')} />
      </section>
    </>
  );
}
