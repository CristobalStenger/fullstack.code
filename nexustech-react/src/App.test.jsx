import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CLAVES } from './services/storage.js';
import { productosIniciales } from './data/productosIniciales.js';
import { iniciarSesionComo, leer, renderApp } from './test/utilidades.jsx';

const navegacion = () => screen.getByRole('navigation', { name: 'Navegación principal' });

describe('navegación de la tienda', () => {
  it('cambia de página con NavLink, marca el enlace activo y actualiza el título', async () => {
    const user = userEvent.setup();
    renderApp('/');
    await user.click(within(navegacion()).getByRole('link', { name: 'Productos' }));
    expect(await screen.findByRole('heading', { name: 'Catálogo NexusTech' })).toBeInTheDocument();
    expect(within(navegacion()).getByRole('link', { name: 'Productos' })).toHaveAttribute('aria-current', 'page');
    expect(document.title).toBe('Productos | NexusTech');
  });

  it('muestra la página 404 para direcciones desconocidas', () => {
    renderApp('/ruta-inexistente');
    expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/');
  });

  it('el inicio muestra categorías, ofertas y productos destacados', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { name: 'Nuestras categorías' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Productos en oferta' })).toBeInTheDocument();
    // 4 ofertas + 8 destacados
    expect(screen.getAllByRole('article')).toHaveLength(12);
  });

  it('el buscador de la cabecera lleva al catálogo filtrado', async () => {
    const user = userEvent.setup();
    renderApp('/nosotros');
    await user.type(screen.getByLabelText('Buscar productos'), 'ryzen');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(await screen.findByRole('heading', { name: 'Catálogo NexusTech' })).toBeInTheDocument();
    expect(screen.getByLabelText('Buscar producto')).toHaveValue('ryzen');
    expect(screen.getByText('3 producto(s) encontrado(s)')).toBeInTheDocument();
  });

  it('muestra blogs, su detalle y la página nosotros', async () => {
    const user = userEvent.setup();
    renderApp('/blogs');
    await user.click(screen.getByRole('link', { name: 'Leer más: Cómo elegir tu primera tarjeta de video' }));
    expect(await screen.findByRole('heading', { name: 'Cómo elegir tu primera tarjeta de video' })).toBeInTheDocument();
    renderApp('/blogs/99');
    expect(screen.getByText('El artículo no existe.')).toBeInTheDocument();
  });
});

describe('catálogo, categorías y ofertas', () => {
  it('combina búsqueda, categoría, tipo, rango y orden, y puede limpiar los filtros', async () => {
    const user = userEvent.setup();
    renderApp('/productos');
    expect(screen.getAllByRole('article')).toHaveLength(40);
    await user.selectOptions(screen.getByLabelText('Categoría'), 'Perifericos');
    await user.selectOptions(screen.getByLabelText('Tipo'), 'Teclado');
    expect(screen.getAllByRole('article')).toHaveLength(3);
    await user.selectOptions(screen.getByLabelText('Rango de precio'), '0-99999');
    expect(screen.getAllByRole('article')).toHaveLength(2);
    await user.selectOptions(screen.getByLabelText('Ordenar'), 'menor');
    const nombres = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(nombres.slice(-2)).toEqual(['Redragon Kumara K552 RGB', 'Logitech G413 TKL SE']);
    await user.type(screen.getByLabelText('Buscar producto'), 'xyz');
    expect(screen.getByText('No encontramos productos con esos filtros.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    expect(screen.getAllByRole('article')).toHaveLength(40);
  });

  it('separa los productos por categoría y avisa si la categoría no existe', async () => {
    const user = userEvent.setup();
    renderApp('/categorias');
    await user.click(screen.getByRole('link', { name: /Consolas PlayStation/ }));
    expect(await screen.findByText('6 producto(s) encontrado(s)')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Consolas PlayStation/ })).toHaveAttribute('aria-current', 'page');
    renderApp('/categorias/inventada');
    expect(screen.getByText('La categoría no existe.')).toBeInTheDocument();
  });

  it('la vista de ofertas muestra solo productos con descuento', () => {
    renderApp('/ofertas');
    const ofertas = productosIniciales.filter((p) => p.descuento > 0);
    expect(screen.getAllByRole('article')).toHaveLength(ofertas.length);
    expect(screen.getByText('-30%')).toBeInTheDocument();
  });

  it('el detalle permite elegir cantidad sin superar el stock', async () => {
    const user = userEvent.setup();
    renderApp('/productos/7');
    expect(screen.getByRole('heading', { name: 'NVIDIA GeForce RTX 4080 Super 16GB' })).toBeInTheDocument();
    expect(screen.getByText('Últimas 2 unidades')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Sumar una unidad' }));
    expect(screen.getByLabelText('Cantidad')).toHaveValue(2);
    expect(screen.getByRole('button', { name: 'Sumar una unidad' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /Agregar al carrito/ }));
    expect(screen.getByRole('link', { name: 'Carrito (2)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ya tienes todo el stock/ })).toBeDisabled();
    expect(leer(CLAVES.carrito)).toEqual([{ id: 7, cantidad: 2 }]);
  });

  it('avisa cuando el producto no existe', () => {
    renderApp('/productos/999');
    expect(screen.getByText('Producto no encontrado.')).toBeInTheDocument();
  });
});

describe('rutas protegidas por rol', () => {
  it('sin sesión el panel redirige al login y luego vuelve al panel', async () => {
    const user = userEvent.setup();
    renderApp('/admin/productos');
    expect(await screen.findByText('Inicia sesión para continuar.')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Correo electrónico'), 'admin@duoc.cl');
    await user.type(screen.getByLabelText('Contraseña'), 'admin123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByRole('heading', { name: 'Productos', level: 1 })).toBeInTheDocument();
  });

  it('un cliente no puede entrar al panel', () => {
    iniciarSesionComo('Cliente');
    renderApp('/admin');
    expect(screen.getByText('Acceso denegado')).toBeInTheDocument();
  });

  it('el vendedor solo consulta: no ve acciones de escritura ni usuarios', () => {
    iniciarSesionComo('Vendedor');
    renderApp('/admin/productos');
    expect(screen.getByText(/Tu rol de vendedor solo permite consultar/)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Nuevo producto/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Eliminar/ })).not.toBeInTheDocument();
    const menu = screen.getByRole('navigation', { name: 'Menú de administración' });
    expect(within(menu).queryByRole('link', { name: /Usuarios/ })).not.toBeInTheDocument();
  });

  it('el vendedor ve acceso denegado al intentar crear productos', () => {
    iniciarSesionComo('Vendedor');
    renderApp('/admin/productos/nuevo');
    expect(screen.getByText('Acceso denegado')).toBeInTheDocument();
  });

  it('restaura la sesión guardada al volver a montar la aplicación', () => {
    iniciarSesionComo('Administrador');
    renderApp('/admin');
    expect(screen.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeInTheDocument();
  });
});
