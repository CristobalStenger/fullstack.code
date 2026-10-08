import { Link, useNavigate, useParams } from 'react-router';
import Alert from 'react-bootstrap/Alert';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin.jsx';
import EstadoVacio from '../../components/comunes/EstadoVacio.jsx';
import UsuarioForm from '../../components/formularios/UsuarioForm.jsx';
import { obtener } from '../../services/crud.js';
import { nombreCompleto } from '../../utils/formatos.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function EditarUsuario() {
  useTitulo('Editar usuario');
  const { run } = useParams();
  const { usuarios, sesion, guardarUsuario } = useAuth();
  const navigate = useNavigate();
  const usuario = obtener(usuarios, run, 'run');

  if (!usuario)
    return (
      <EstadoVacio icono="bi-person-x" titulo="El usuario no existe.">
        <Link to="/admin/usuarios" className="btn btn-nexus">Volver a usuarios</Link>
      </EstadoVacio>
    );

  function guardar(datos) {
    if (guardarUsuario(datos, usuario.run).ok) navigate(`/admin/usuarios/${datos.run.trim().toUpperCase()}`);
  }

  return (
    <>
      <EncabezadoAdmin titulo={`Editar usuario: ${nombreCompleto(usuario)}`} />
      {usuario.run === sesion.run && (
        <Alert variant="warning">
          Estás editando tu propia cuenta. Si cambias tu tipo a Cliente perderás el acceso al panel.
        </Alert>
      )}
      <section className="caja-sesion">
        <UsuarioForm
          key={usuario.run}
          inicial={usuario}
          usuarios={usuarios}
          runOriginal={usuario.run}
          onGuardar={guardar}
          onCancelar={() => navigate(-1)}
        />
      </section>
    </>
  );
}
