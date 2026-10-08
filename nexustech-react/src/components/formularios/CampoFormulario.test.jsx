import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import CampoFormulario from './CampoFormulario.jsx';

describe('CampoFormulario', () => {
  it('asocia la etiqueta y no muestra error si no lo hay', () => {
    render(<CampoFormulario id="campo-run" etiqueta="RUN" value="" onChange={() => {}} />);
    const campo = screen.getByLabelText('RUN');
    expect(campo).not.toHaveClass('is-invalid');
    expect(campo).not.toHaveAttribute('aria-describedby');
  });

  it('muestra el mensaje de error solo cuando recibe uno', () => {
    render(<CampoFormulario id="campo-run" etiqueta="RUN" value="1" onChange={() => {}} error="RUN inválido" />);
    const campo = screen.getByLabelText('RUN');
    expect(campo).toHaveClass('is-invalid');
    expect(campo).toHaveAttribute('aria-describedby', 'error-campo-run');
    expect(screen.getByText('RUN inválido')).toHaveAttribute('id', 'error-campo-run');
  });

  it('marca el campo válido y puede ser un select', () => {
    render(
      <CampoFormulario id="campo-tipo" etiqueta="Tipo" as="select" value="a" onChange={() => {}} valido>
        <option value="a">A</option>
      </CampoFormulario>,
    );
    expect(screen.getByLabelText('Tipo')).toHaveClass('form-select', 'is-valid');
  });
});
