import { useState } from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin.jsx';
import ConfirmarModal from '../../components/comunes/ConfirmarModal.jsx';
import RolBadge from '../../components/admin/RolBadge.jsx';
import { ROLES } from '../../data/usuariosIniciales.js';
import { nombreCompleto, normalizar } from '../../utils/formatos.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function UsuariosAdmin() {
  useTitulo('Usuarios');
  const { usuarios, sesion, eliminarUsuario } = useAuth();
  const [texto, setTexto] = useState('');
  const [rol, setRol] = useState('');
  const [eliminando, setEliminando] = useState(null);

  const visibles = usuarios.filter(
    (u) =>
      (!rol || u.tipo === rol) &&
      normalizar(`${u.run} ${nombreCompleto(u)} ${u.correo}`).includes(normalizar(texto)),
  );

  function confirmarEliminar() {
    eliminarUsuario(eliminando.run);
    setEliminando(null);
  }

  return (
    <>
      <EncabezadoAdmin
        titulo="Usuarios"
        acciones={
          <Link to="/admin/usuarios/nuevo" className="btn btn-nexus">
            <i className="bi bi-person-plus me-1" aria-hidden="true"></i>Nuevo usuario
          </Link>
        }
      >
        {usuarios.length} cuentas registradas.
      </EncabezadoAdmin>
      <section className="caja-vidrio p-4">
        <Row className="g-3 mb-3">
          <Col md={8}>
            <Form.Control
              type="search"
              aria-label="Buscar usuario"
              placeholder="Buscar por RUN, nombre o correo"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Select aria-label="Filtrar por rol" value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="">Todos los roles</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Table responsive hover className="tabla-admin align-middle mb-0">
          <thead>
            <tr>
              <th scope="col">RUN</th>
              <th scope="col">Nombre</th>
              <th scope="col">Correo</th>
              <th scope="col">Tipo</th>
              <th scope="col">Comuna</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((u) => (
              <tr key={u.run}>
                <td>{u.run}</td>
                <td>{nombreCompleto(u)}</td>
                <td>{u.correo}</td>
                <td><RolBadge tipo={u.tipo} /></td>
                <td>{u.comuna}</td>
                <td className="text-nowrap">
                  <Link to={`/admin/usuarios/${u.run}`} className="btn btn-sm btn-nexus-claro me-1" aria-label={`Ver ${u.nombre}`}>
                    <i className="bi bi-eye" aria-hidden="true"></i>
                  </Link>
                  <Link to={`/admin/usuarios/${u.run}/editar`} className="btn btn-sm btn-nexus-claro me-1" aria-label={`Editar ${u.nombre}`}>
                    <i className="bi bi-pencil" aria-hidden="true"></i>
                  </Link>
                  <Link to={`/admin/usuarios/${u.run}/compras`} className="btn btn-sm btn-nexus-claro me-1" aria-label={`Historial de compras de ${u.nombre}`}>
                    <i className="bi bi-bag" aria-hidden="true"></i>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    aria-label={`Eliminar ${u.nombre}`}
                    disabled={u.run === sesion.run}
                    title={u.run === sesion.run ? 'No puedes eliminar tu propia cuenta' : undefined}
                    onClick={() => setEliminando(u)}
                  >
                    <i className="bi bi-trash" aria-hidden="true"></i>
                  </Button>
                </td>
              </tr>
            ))}
            {!visibles.length && (
              <tr>
                <td colSpan={6} className="text-center py-4">No hay usuarios que coincidan.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </section>
      <ConfirmarModal
        abierto={eliminando !== null}
        titulo="Eliminar usuario"
        textoConfirmar="Eliminar"
        confirmar={confirmarEliminar}
        cancelar={() => setEliminando(null)}
      >
        ¿Seguro que quieres eliminar a "{eliminando && nombreCompleto(eliminando)}"?
      </ConfirmarModal>
    </>
  );
}
