import { useNavigate } from 'react-router';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin.jsx';
import RolBadge from '../../components/admin/RolBadge.jsx';
import UsuarioForm from '../../components/formularios/UsuarioForm.jsx';
import { obtener } from '../../services/crud.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useTitulo } from '../../hooks/useTitulo.js';

// Vista nueva: la persona que inició sesión edita sus propios datos
export default function Perfil() {
  useTitulo('Mi perfil');
  const { usuarios, sesion, guardarUsuario } = useAuth();
  const navigate = useNavigate();
  const usuario = obtener(usuarios, sesion.run, 'run');

  function guardar(datos) {
    // El RUN y el rol no cambian desde el perfil
    if (guardarUsuario({ ...datos, run: usuario.run, tipo: usuario.tipo }, usuario.run).ok) navigate('/admin');
  }

  return (
    <>
      <EncabezadoAdmin titulo="Mi perfil">
        Rol actual: <RolBadge tipo={usuario.tipo} />
      </EncabezadoAdmin>
      <section className="caja-sesion">
        <UsuarioForm
          inicial={usuario}
          usuarios={usuarios}
          runOriginal={usuario.run}
          modo="perfil"
          textoBoton="Guardar mis datos"
          onGuardar={guardar}
          onCancelar={() => navigate('/admin')}
        />
      </section>
    </>
  );
}
