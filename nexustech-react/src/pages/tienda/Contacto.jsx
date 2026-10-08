import { useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import EncabezadoPagina from '../../components/comunes/EncabezadoPagina.jsx';
import CampoFormulario from '../../components/formularios/CampoFormulario.jsx';
import { guardarMensaje } from '../../services/persistencia.js';
import { validarContacto } from '../../utils/validaciones.js';
import { nombreCompleto } from '../../utils/formatos.js';
import { useFormulario } from '../../hooks/useFormulario.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function Contacto() {
  useTitulo('Contacto');
  const { sesion } = useAuth();
  const inicial = {
    nombre: sesion ? nombreCompleto(sesion) : '',
    correo: sesion?.correo ?? '',
    comentario: '',
  };
  const form = useFormulario(inicial, validarContacto);
  const [enviado, setEnviado] = useState('');

  const enviar = form.enviar((valores) => {
    guardarMensaje({ ...valores, fecha: new Date().toISOString() });
    setEnviado(`Gracias ${valores.nombre.trim()}, recibimos tu mensaje. Te responderemos pronto.`);
    form.reiniciar({ ...inicial, comentario: '' });
  });

  return (
    <>
      <EncabezadoPagina icono="bi-envelope-fill" titulo="Contacto">
        Escríbenos y te respondemos dentro de 24 horas hábiles.
      </EncabezadoPagina>

      <Row className="g-4">
        <Col xs={12} lg={7}>
          <div className="caja-sesion">
            <h2 className="h4 fw-bold mb-4">Enviar un mensaje</h2>
            <Form noValidate onSubmit={enviar} onChange={() => setEnviado('')}>
              <CampoFormulario
                id="contacto-nombre"
                name="nombre"
                etiqueta="Nombre"
                ayuda="obligatorio, máx. 100"
                maxLength={100}
                value={form.valores.nombre}
                onChange={form.cambiar}
                error={form.error('nombre')}
                valido={form.valido('nombre')}
              />
              <CampoFormulario
                id="contacto-correo"
                name="correo"
                etiqueta="Correo electrónico"
                ayuda="opcional, @duoc.cl, @profesor.duoc.cl o @gmail.com"
                type="email"
                maxLength={100}
                value={form.valores.correo}
                onChange={form.cambiar}
                error={form.error('correo')}
              />
              <CampoFormulario
                id="contacto-comentario"
                name="comentario"
                etiqueta="Comentario"
                ayuda="obligatorio, máx. 500"
                as="textarea"
                rows={4}
                maxLength={500}
                value={form.valores.comentario}
                onChange={form.cambiar}
                error={form.error('comentario')}
                valido={form.valido('comentario')}
              />
              <Form.Text className="d-block mb-3" aria-live="polite">
                Te quedan {500 - form.valores.comentario.length} caracteres.
              </Form.Text>
              <Button type="submit" variant="nexus" className="w-100 py-2">
                <i className="bi bi-send me-1" aria-hidden="true"></i> Enviar mensaje
              </Button>
              {enviado && (
                <Alert variant="success" className="mt-3 mb-0" role="status">
                  {enviado}
                </Alert>
              )}
            </Form>
          </div>
        </Col>

        <Col xs={12} lg={5}>
          <div className="caja-vidrio p-4 h-100">
            <h2 className="h4 fw-bold mb-3">Nuestros datos</h2>
            <ul className="list-unstyled">
              <li className="mb-3"><i className="bi bi-geo-alt-fill me-2" aria-hidden="true"></i>Av. Principal 1234, Santiago</li>
              <li className="mb-3"><i className="bi bi-telephone-fill me-2" aria-hidden="true"></i>+56 2 2345 6789</li>
              <li className="mb-3"><i className="bi bi-envelope-fill me-2" aria-hidden="true"></i>contacto@nexustech.cl</li>
              <li className="mb-3"><i className="bi bi-clock-fill me-2" aria-hidden="true"></i>Lunes a viernes de 9:00 a 19:00</li>
              <li className="mb-3"><i className="bi bi-truck me-2" aria-hidden="true"></i>Despacho a todo Chile</li>
            </ul>
            <h3 className="h5 fw-bold mt-4">Preguntas frecuentes</h3>
            <p className="mb-2"><strong>¿Cuánto demora el despacho?</strong><br />48 horas hábiles a todo Chile.</p>
            <p className="mb-2"><strong>¿Tienen garantía?</strong><br />Sí, 12 meses en todo el catálogo.</p>
            <p className="mb-0"><strong>¿Puedo retirar en tienda?</strong><br />Sí, en nuestra sucursal de Santiago.</p>
          </div>
        </Col>
      </Row>
    </>
  );
}
