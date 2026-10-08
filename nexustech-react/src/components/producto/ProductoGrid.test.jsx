import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ProductoGrid from './ProductoGrid.jsx';
import { productosIniciales } from '../../data/productosIniciales.js';

describe('ProductoGrid (renderizado de listas)', () => {
  it('renderiza una tarjeta por cada elemento del arreglo', () => {
    render(
      <MemoryRouter>
        <ProductoGrid productos={productosIniciales} alAgregar={vi.fn()} />
      </MemoryRouter>,
    );
    expect(screen.getAllByRole('article')).toHaveLength(40);
    for (const p of productosIniciales.slice(0, 5))
      expect(screen.getByRole('heading', { name: p.nombre })).toBeInTheDocument();
  });

  it('muestra el mensaje vacío solo cuando no hay productos', () => {
    render(<ProductoGrid productos={[]} alAgregar={vi.fn()} mensajeVacio="Nada por aquí." />);
    expect(screen.getByText('Nada por aquí.')).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});
