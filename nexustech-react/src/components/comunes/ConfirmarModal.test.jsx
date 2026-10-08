import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmarModal from './ConfirmarModal.jsx';

describe('ConfirmarModal (renderizado condicional y eventos)', () => {
  it('no muestra nada mientras está cerrado', () => {
    render(<ConfirmarModal abierto={false} titulo="Eliminar" confirmar={vi.fn()} cancelar={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('al abrirse muestra el contenido y ejecuta confirmar o cancelar', async () => {
    const confirmar = vi.fn();
    const cancelar = vi.fn();
    render(
      <ConfirmarModal abierto titulo="Eliminar producto" textoConfirmar="Eliminar" confirmar={confirmar} cancelar={cancelar}>
        ¿Seguro?
      </ConfirmarModal>,
    );
    const dialogo = await screen.findByRole('dialog', { name: 'Eliminar producto' });
    expect(within(dialogo).getByText('¿Seguro?')).toBeInTheDocument();
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Eliminar' }));
    expect(confirmar).toHaveBeenCalledTimes(1);
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Cancelar' }));
    expect(cancelar).toHaveBeenCalledTimes(1);
  });
});
