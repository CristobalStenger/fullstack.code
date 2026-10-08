import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FiltrosCatalogo from './FiltrosCatalogo.jsx';
import { FILTROS_VACIOS } from '../../utils/catalogo.js';

describe('FiltrosCatalogo (componente controlado)', () => {
  it('informa cada cambio al padre y limpia los filtros', async () => {
    const onCambio = vi.fn();
    const onLimpiar = vi.fn();
    render(
      <FiltrosCatalogo
        filtros={FILTROS_VACIOS}
        onCambio={onCambio}
        onLimpiar={onLimpiar}
        categorias={[{ id: 1, nombre: 'Consolas' }]}
        tipos={['Mouse', 'Teclado']}
        resultados={12}
      />,
    );
    await userEvent.type(screen.getByLabelText('Buscar producto'), 'r');
    expect(onCambio).toHaveBeenCalledWith('texto', 'r');
    await userEvent.selectOptions(screen.getByLabelText('Categoría'), 'Consolas');
    expect(onCambio).toHaveBeenCalledWith('categoria', 'Consolas');
    await userEvent.selectOptions(screen.getByLabelText('Tipo'), 'Teclado');
    expect(onCambio).toHaveBeenCalledWith('tipo', 'Teclado');
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    expect(onLimpiar).toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('12 producto(s) encontrado(s)');
  });

  it('puede ocultar el filtro de categoría', () => {
    render(<FiltrosCatalogo filtros={FILTROS_VACIOS} onCambio={vi.fn()} onLimpiar={vi.fn()} mostrarCategoria={false} />);
    expect(screen.queryByLabelText('Categoría')).not.toBeInTheDocument();
  });
});
