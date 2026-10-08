import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EncabezadoPagina from '../../components/comunes/EncabezadoPagina.jsx';
import { equipo } from '../../data/portada.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function Nosotros() {
  useTitulo('Nosotros');
  return (
    <>
      <EncabezadoPagina icono="bi-people-fill" titulo="Sobre NexusTech">
        Quiénes somos y quiénes estamos detrás de la tienda.
      </EncabezadoPagina>

      <section className="caja-vidrio p-4 mb-4">
        <h2 className="h3 fw-bold">La empresa</h2>
        <p>
          NexusTech es una tienda chilena dedicada a la venta de tecnología para armar, mejorar y
          disfrutar tu equipo. Partimos el año 2024 como un taller pequeño de armado de computadores
          y hoy somos una tienda en línea con despacho a todo el país.
        </p>
        <p>
          Trabajamos con cuatro líneas de productos: componentes de PC, periféricos, consolas y
          notebooks. Todos nuestros productos son nuevos, con garantía oficial del fabricante.
        </p>

        <h2 className="h3 fw-bold mt-4">Nuestra misión</h2>
        <p>
          Que cualquier persona pueda armar el equipo que necesita, sin pagar de más y sin tener que
          ser experta en hardware para lograrlo.
        </p>

        <h2 className="h3 fw-bold mt-4">Nuestra visión</h2>
        <p>
          Ser la tienda de tecnología más recomendada de Chile por su asesoría honesta y su servicio
          de postventa.
        </p>

        <h2 className="h3 fw-bold mt-4">En qué nos diferenciamos</h2>
        <ul>
          <li>Asesoría gratuita para elegir componentes compatibles entre sí.</li>
          <li>Armado sin costo al comprar tres o más componentes.</li>
          <li>Garantía oficial de 12 meses en todo el catálogo.</li>
          <li>Despacho a todo Chile en 48 horas hábiles.</li>
          <li>Pago con débito, crédito y hasta en 6 cuotas.</li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="titulo-seccion">El equipo de desarrollo</h2>
        <Row className="g-4 justify-content-center">
          {equipo.map((persona) => (
            <Col xs={12} md={4} key={persona.nombre}>
              <div className="card-categoria">
                <i className={`bi ${persona.icono}`} aria-hidden="true"></i>
                <h3>{persona.nombre}</h3>
                <p className="mb-1">
                  <strong>{persona.rol}</strong>
                </p>
                <p className="mb-0">{persona.descripcion}</p>
              </div>
            </Col>
          ))}
        </Row>
      </section>
    </>
  );
}
