import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CampoFormulario from './CampoFormulario.jsx';
import { comunasDe, regionesChile } from '../../data/regiones.js';

// Dos selects dependientes: al cambiar la región se reinicia la comuna
export default function SelectorRegionComuna({ prefijo, region, comuna, errores = {}, onCambio, disabled }) {
  return (
    <Row className="g-3">
      <Col md={6}>
        <CampoFormulario
          id={`${prefijo}-region`}
          etiqueta="Región"
          as="select"
          value={region}
          error={errores.region}
          disabled={disabled}
          onChange={(e) => onCambio({ region: e.target.value, comuna: '' })}
        >
          <option value="">Selecciona la región</option>
          {regionesChile.map((r) => (
            <option key={r.nombre} value={r.nombre}>
              {r.nombre}
            </option>
          ))}
        </CampoFormulario>
      </Col>
      <Col md={6}>
        <CampoFormulario
          id={`${prefijo}-comuna`}
          etiqueta="Comuna"
          as="select"
          value={comuna}
          error={errores.comuna}
          disabled={disabled || !region}
          onChange={(e) => onCambio({ comuna: e.target.value })}
        >
          <option value="">Selecciona la comuna</option>
          {comunasDe(region).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </CampoFormulario>
      </Col>
    </Row>
  );
}
