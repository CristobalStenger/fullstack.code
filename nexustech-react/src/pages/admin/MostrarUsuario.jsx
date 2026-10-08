import { Link, useParams } from 'react-router';
import Table from 'react-bootstrap/Table';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin.jsx';
import RolBadge from '../../components/admin/RolBadge.jsx';
import EstadoVacio from '../../components/comunes/EstadoVacio.jsx';
import { obtener } from '../../services/crud.js';
import { nombreCompleto, precioCLP } from '../../utils/formatos.js';
import { ordenesDeUsuario, resumenVentas } from '../../utils/reportes.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function MostrarUsuario() {
  const { run } = useParams();
  const { usuarios } = useAuth();
  const { estado } = useTienda();
  const usuario = obtener(usuarios, run, 'run');
  useTitulo(usuario ? nombreCompleto(usuario) : 'Usuario no encontrado');

  if (!usuario)
    return (
      <EstadoVacio icono="bi-person-x" titulo="El usuario no existe.">
        <Link to="/admin/usuarios" className="btn btn-nexus">Volver a usuarios</Link>
      </EstadoVacio>
    );

  const compras = resumenVentas(ordenesDeUsuario(estado.ordenes, usuario));
  const filas = [
    ['RUN', usuario.run],
    ['Correo', usuario.correo],
    ['Fecha de nacimiento', usuario.fechaNacimiento || '—'],
    ['Región', usuario.region],
    ['Comuna', usuario.comuna],
    ['Dirección', usuario.direccion],
    ['Compras pagadas', `${compras.pagadas} (${precioCLP(compras.totalVentas)})`],
  ];

  return (
    <>
      <EncabezadoAdmin
        titulo={nombreCompleto(usuario)}
        acciones={
          <>
            <Link to={`/admin/usuarios/${usuario.run}/editar`} className="btn btn-nexus">
              <i className="bi bi-pencil me-1" aria-hidden="true"></i>Editar usuario
            </Link>
            <Link to={`/admin/usuarios/${usuario.run}/compras`} className="btn btn-nexus-claro">
              Historial de compras
            </Link>
            <Link to="/admin/usuarios" className="btn btn-nexus-claro">Volver</Link>
          </>
        }
      >
        <RolBadge tipo={usuario.tipo} />
      </EncabezadoAdmin>
      <section className="caja-vidrio p-4">
        <Table className="tabla-admin mb-0">
          <tbody>
            {filas.map(([etiqueta, valor]) => (
              <tr key={etiqueta}>
                <th scope="row">{etiqueta}</th>
                <td>{valor}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>
    </>
  );
}
