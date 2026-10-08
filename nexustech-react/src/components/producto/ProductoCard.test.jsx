import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import ProductoCard from './ProductoCard.jsx';
import PrecioProducto from './PrecioProducto.jsx';

const producto = {
  id: 7,
  codigo: 'MOU001',
  nombre: 'Mouse Gamer',
  categoria: 'Perifericos',
  tipo: 'Mouse',
  precio: 20000,
  stock: 5,
  stockCritico: 2,
  descuento: 0,
  imagen: 'https://example.com/mouse.png',
};

const mostrar = (props) =>
  render(
    <MemoryRouter>
      <ProductoCard producto={producto} alAgregar={vi.fn()} {...props} />
    </MemoryRouter>,
  );

describe('ProductoCard (props y eventos)', () => {
  it('muestra los datos recibidos por props', () => {
    mostrar();
    expect(screen.getByRole('heading', { name: 'Mouse Gamer' })).toBeInTheDocument();
    expect(screen.getByText('$20.000')).toBeInTheDocument();
    expect(screen.getByText('Perifericos')).toBeInTheDocument();
    expect(screen.getByText('Disponible')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Mouse Gamer' })).toHaveAttribute('href', '/productos/7');
  });

  it('llama a la función onClick recibida con el id del producto', async () => {
    const alAgregar = vi.fn();
    mostrar({ alAgregar });
    await userEvent.click(screen.getByRole('button', { name: 'Agregar Mouse Gamer al carrito' }));
    expect(alAgregar).toHaveBeenCalledTimes(1);
    expect(alAgregar).toHaveBeenCalledWith(7);
  });

  it('deshabilita el botón cuando no hay stock', async () => {
    const alAgregar = vi.fn();
    mostrar({ producto: { ...producto, stock: 0 }, alAgregar });
    const boton = screen.getByRole('button', { name: 'Mouse Gamer sin stock' });
    expect(boton).toBeDisabled();
    expect(boton).toHaveTextContent('Sin stock');
    await userEvent.click(boton);
    expect(alAgregar).not.toHaveBeenCalled();
  });
});

describe('PrecioProducto (renderizado condicional)', () => {
  it('sin oferta muestra solo el precio', () => {
    render(<PrecioProducto producto={{ precio: 10000, descuento: 0 }} />);
    expect(screen.getByText('$10.000')).toBeInTheDocument();
    expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument();
  });

  it('con oferta muestra el precio anterior tachado y el porcentaje', () => {
    render(<PrecioProducto producto={{ precio: 10000, descuento: 20 }} />);
    expect(screen.getByLabelText('Precio normal $10.000')).toBeInTheDocument();
    expect(screen.getByText('-20%')).toBeInTheDocument();
    expect(screen.getByText('$8.000')).toBeInTheDocument();
  });

  it('muestra FREE cuando el precio final es cero', () => {
    render(<PrecioProducto producto={{ precio: 0, descuento: 0 }} />);
    expect(screen.getByText('FREE')).toBeInTheDocument();
  });
});
