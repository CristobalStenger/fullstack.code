import Form from 'react-bootstrap/Form';

// Campo con etiqueta, ayuda y mensaje de error asociado (aria-describedby).
// "as" permite usar input, textarea o select (Form.Select).
export default function CampoFormulario({
  id,
  etiqueta,
  ayuda,
  error,
  valido = false,
  as,
  children,
  className = 'mb-3',
  ...props
}) {
  const idError = `error-${id}`;
  const Control = as === 'select' ? Form.Select : Form.Control;
  const extra = as && as !== 'select' ? { as } : {};

  return (
    <Form.Group controlId={id} className={className}>
      <Form.Label className="fw-bold">{etiqueta}</Form.Label>
      {ayuda && <span className="text-muted small ms-1">({ayuda})</span>}
      <Control
        {...extra}
        {...props}
        isInvalid={Boolean(error)}
        isValid={valido && !error}
        aria-describedby={error ? idError : undefined}
      >
        {children}
      </Control>
      <Form.Control.Feedback type="invalid" id={idError}>
        {error}
      </Form.Control.Feedback>
    </Form.Group>
  );
}
