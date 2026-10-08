import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CampoFormulario from './CampoFormulario.jsx';
import SelectorRegionComuna from './SelectorRegionComuna.jsx';
import { ROLES } from '../../data/usuariosIniciales.js';
import { validarUsuario } from '../../utils/validaciones.js';
import { useFormulario } from '../../hooks/useFormulario.js';

const USUARIO_VACIO = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  clave: '',
  clave2: '',
  fechaNacimiento: '',
  tipo: '',
  region: '',
  comuna: '',
  direccion: '',
  terminos: false,
};

// Formulario único de usuario para tres casos:
//   registro: cliente nuevo (repite contraseña y acepta términos)
//   admin:    el administrador elige el tipo de usuario
//   perfil:   la persona edita sus datos (sin cambiar RUN ni rol)
export default function UsuarioForm({
  inicial = USUARIO_VACIO,
  usuarios,
  runOriginal = null,
  modo = 'admin',
  textoBoton = 'Guardar usuario',
  onGuardar,
  onCancelar,
}) {
  const opciones = {
    confirmarClave: modo === 'registro',
    conTerminos: modo === 'registro',
    conTipo: modo !== 'registro',
  };
  const form = useFormulario({ ...USUARIO_VACIO, ...inicial }, (v) =>
    validarUsuario(v, usuarios, runOriginal, opciones),
  );
  const { valores, cambiar } = form;
  const campo = (nombre) => ({
    id: `usuario-${nombre}`,
    name: nombre,
    value: valores[nombre],
    onChange: cambiar,
    error: form.error(nombre),
    valido: form.valido(nombre),
  });

  return (
    <Form noValidate onSubmit={form.enviar(onGuardar)}>
      <Row className="g-3">
        <Col md={6}>
          <CampoFormulario
            {...campo('run')}
            etiqueta="RUN"
            ayuda="sin puntos ni guion"
            maxLength={9}
            placeholder="21456789K"
            disabled={modo === 'perfil'}
            className=""
          />
        </Col>
        <Col md={6}>
          <CampoFormulario {...campo('fechaNacimiento')} etiqueta="Fecha de nacimiento" ayuda="opcional" type="date" className="" />
        </Col>
        <Col md={6}>
          <CampoFormulario {...campo('nombre')} etiqueta="Nombre" ayuda="máx. 50" maxLength={50} autoComplete="given-name" className="" />
        </Col>
        <Col md={6}>
          <CampoFormulario {...campo('apellidos')} etiqueta="Apellidos" ayuda="máx. 100" maxLength={100} autoComplete="family-name" className="" />
        </Col>
        <Col xs={12}>
          <CampoFormulario
            {...campo('correo')}
            etiqueta="Correo electrónico"
            ayuda="@duoc.cl, @profesor.duoc.cl o @gmail.com"
            type="email"
            maxLength={100}
            autoComplete="email"
            className=""
          />
        </Col>
        <Col md={6}>
          <CampoFormulario
            {...campo('clave')}
            etiqueta="Contraseña"
            ayuda="entre 4 y 10"
            type="password"
            maxLength={10}
            autoComplete="new-password"
            className=""
          />
        </Col>
        {modo === 'registro' && (
          <Col md={6}>
            <CampoFormulario
              {...campo('clave2')}
              etiqueta="Repetir contraseña"
              type="password"
              maxLength={10}
              autoComplete="new-password"
              className=""
            />
          </Col>
        )}
        {modo === 'admin' && (
          <Col md={6}>
            <CampoFormulario {...campo('tipo')} etiqueta="Tipo de usuario" as="select" className="">
              <option value="">Selecciona el tipo</option>
              {ROLES.map((rol) => (
                <option key={rol} value={rol}>
                  {rol}
                </option>
              ))}
            </CampoFormulario>
          </Col>
        )}
        <Col xs={12}>
          <SelectorRegionComuna
            prefijo="usuario"
            region={valores.region}
            comuna={valores.comuna}
            errores={{ region: form.error('region'), comuna: form.error('comuna') }}
            onCambio={form.actualizar}
          />
        </Col>
        <Col xs={12}>
          <CampoFormulario
            {...campo('direccion')}
            etiqueta="Dirección"
            ayuda="máx. 300"
            maxLength={300}
            placeholder="Calle, número, departamento"
            autoComplete="street-address"
            className=""
          />
        </Col>
        {modo === 'registro' && (
          <Col xs={12}>
            <Form.Check
              id="usuario-terminos"
              name="terminos"
              checked={valores.terminos}
              onChange={cambiar}
              isInvalid={Boolean(form.error('terminos'))}
              feedback={form.error('terminos')}
              feedbackType="invalid"
              label="Acepto los términos y condiciones de NexusTech."
            />
          </Col>
        )}
        <Col xs={12} className="d-flex gap-2 flex-wrap">
          <Button type="submit" variant="nexus" className="flex-grow-1 py-2">
            {textoBoton}
          </Button>
          {onCancelar && (
            <Button type="button" variant="secondary" onClick={onCancelar}>
              Cancelar
            </Button>
          )}
        </Col>
      </Row>
    </Form>
  );
}
