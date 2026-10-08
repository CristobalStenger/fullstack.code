import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CLAVES } from '../../services/storage.js';
import { guardarCarrito, iniciarSesionComo, leer, renderApp } from '../../test/utilidades.jsx';

const titulo = (nombre) => screen.findByRole('heading', { name: nombre, level: 1 });

async function confirmarEnModal(user, nombreDialogo, boton) {
  const dialogo = await screen.findByRole('dialog', { name: nombreDialogo });
  await user.click(within(dialogo).getByRole('button', { name: boton }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
}

describe('dashboard, órdenes y reportes', () => {
  it('el dashboard muestra métricas y accesos a cada módulo', () => {
    iniciarSesionComo('Administrador');
    renderApp('/admin');
    expect(screen.getByRole('heading', { name: 'Compras' })).toBeInTheDocument();
    expect(screen.getByText('Hay 3 producto(s) con stock crítico.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Reportes Informes/ })).toHaveAttribute('href', '/admin/reportes');
  });

  it('filtra órdenes por estado y muestra la boleta', async () => {
    iniciarSesionComo('Administrador');
    const user = userEvent.setup();
    renderApp('/admin/ordenes');
    await user.selectOptions(screen.getByLabelText('Filtrar por estado'), 'rechazada');
    expect(screen.getAllByRole('link', { name: /Ver boleta/ })).toHaveLength(1);
    await user.click(screen.getByRole('link', { name: 'Ver boleta 1003' }));
    expect(await titulo('Boleta #1003')).toBeInTheDocument();
    expect(screen.getByText(/Motivo: La tarjeta fue rechazada/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Imprimir/ }));
    expect(window.print).toHaveBeenCalled();
  });

  it('muestra reportes de ventas e inventario', () => {
    iniciarSesionComo('Administrador');
    renderApp('/admin/reportes');
    expect(screen.getByRole('heading', { name: 'Ventas por categoría' })).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    renderApp('/admin/productos/reportes');
    expect(screen.getByRole('heading', { name: 'Productos más vendidos' })).toBeInTheDocument();
  });

  it('lista los productos críticos', () => {
    iniciarSesionComo('Administrador');
    renderApp('/admin/productos/criticos');
    expect(screen.getAllByRole('link', { name: 'Reponer stock' })).toHaveLength(3);
  });
});

describe('CRUD de productos', () => {
  it('crea, muestra y edita un producto conservando su id', async () => {
    iniciarSesionComo('Administrador');
    const user = userEvent.setup();
    renderApp('/admin/productos');
    await user.click(screen.getByRole('link', { name: /Nuevo producto/ }));
    await user.click(await screen.findByRole('button', { name: 'Guardar producto' }));
    expect(screen.getByText('El código es obligatorio.')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Código'), 'aud010');
    await user.type(screen.getByLabelText('Nombre del producto'), 'Audífonos Pro');
    await user.selectOptions(screen.getByLabelText('Categoría'), 'Perifericos');
    await user.type(screen.getByLabelText('Tipo'), 'Audifonos');
    await user.type(screen.getByLabelText('Precio'), '15000');
    await user.type(screen.getByLabelText('Stock'), '3');
    await user.type(screen.getByLabelText('Descuento %'), '10');
    expect(screen.getByText('$13.500')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Guardar producto' }));

    expect(await screen.findByText('Producto "Audífonos Pro" creado.')).toBeInTheDocument();
    const creado = leer(CLAVES.productos).at(-1);
    expect(creado).toMatchObject({ id: 41, codigo: 'AUD010', precio: 15000, stock: 3, descuento: 10 });

    await user.click(screen.getByRole('link', { name: 'Editar Audífonos Pro' }));
    await user.clear(await screen.findByLabelText('Precio'));
    await user.type(screen.getByLabelText('Precio'), '20000');
    await user.click(screen.getByRole('button', { name: 'Guardar producto' }));
    expect(await titulo('Audífonos Pro')).toBeInTheDocument();
    expect(screen.getByRole('row', { name: /Precio normal/ })).toHaveTextContent('$20.000');
    expect(leer(CLAVES.productos).filter((p) => p.codigo === 'AUD010')).toEqual([
      expect.objectContaining({ id: 41, precio: 20000 }),
    ]);
  });

  it('rechaza un código repetido', async () => {
    iniciarSesionComo('Administrador');
    const user = userEvent.setup();
    renderApp('/admin/productos/nuevo');
    await user.type(screen.getByLabelText('Código'), 'cpu001');
    expect(screen.getByText('Ya existe un producto con ese código.')).toBeInTheDocument();
  });

  it('cancela y confirma la eliminación, retirando el producto del carrito', async () => {
    iniciarSesionComo('Administrador');
    guardarCarrito([{ id: 1, cantidad: 1 }]);
    const user = userEvent.setup();
    renderApp('/admin/productos');
    await user.click(screen.getByRole('button', { name: 'Eliminar AMD Ryzen 5 7600X' }));
    await confirmarEnModal(user, 'Eliminar producto', 'Cancelar');
    expect(screen.getByRole('link', { name: 'Editar AMD Ryzen 5 7600X' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Eliminar AMD Ryzen 5 7600X' }));
    await confirmarEnModal(user, 'Eliminar producto', 'Eliminar');
    expect(screen.queryByRole('link', { name: 'Editar AMD Ryzen 5 7600X' })).not.toBeInTheDocument();
    expect(leer(CLAVES.productos)).toHaveLength(39);
    expect(leer(CLAVES.carrito)).toEqual([]);
  });

  it('busca productos en la tabla', async () => {
    iniciarSesionComo('Administrador');
    const user = userEvent.setup();
    renderApp('/admin/productos');
    await user.type(screen.getByLabelText('Buscar producto'), 'zzz');
    expect(screen.getByText('No hay productos que coincidan.')).toBeInTheDocument();
  });
});

describe('CRUD de categorías', () => {
  it('crea una categoría, la renombra y no elimina una categoría con productos', async () => {
    iniciarSesionComo('Administrador');
    const user = userEvent.setup();
    renderApp('/admin/categorias/nueva');
    await user.type(screen.getByLabelText('Nombre de la categoría'), 'Audio y Video');
    expect(screen.getByText('Dirección en la tienda: /categorias/audio-y-video')).toBeInTheDocument();
    await user.click(screen.getByLabelText('Ícono headphones'));
    await user.click(screen.getByRole('button', { name: 'Guardar categoría' }));
    expect(await screen.findByRole('link', { name: '/categorias/audio-y-video' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Editar categoría Consolas' }));
    const nombre = await screen.findByLabelText('Nombre de la categoría');
    await user.clear(nombre);
    await user.type(nombre, 'Consolas y Juegos');
    await user.click(screen.getByRole('button', { name: 'Guardar categoría' }));
    expect(await screen.findByRole('link', { name: '/categorias/consolas-y-juegos' })).toBeInTheDocument();
    expect(leer(CLAVES.productos).filter((p) => p.categoria === 'Consolas y Juegos')).toHaveLength(6);

    await user.click(screen.getByRole('button', { name: 'Eliminar categoría Consolas y Juegos' }));
    await confirmarEnModal(user, 'Eliminar categoría', 'Eliminar');
    expect(await screen.findByText(/No se puede eliminar "Consolas y Juegos"/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Eliminar categoría Audio y Video' }));
    await confirmarEnModal(user, 'Eliminar categoría', 'Eliminar');
    expect(screen.queryByRole('link', { name: '/categorias/audio-y-video' })).not.toBeInTheDocument();
  });
});

describe('CRUD de usuarios y perfil', () => {
  it('crea un vendedor, lo muestra, lo edita y lo elimina', async () => {
    iniciarSesionComo('Administrador');
    const user = userEvent.setup();
    renderApp('/admin/usuarios/nuevo');
    await user.type(screen.getByLabelText('RUN'), '111111111');
    await user.type(screen.getByLabelText('Nombre'), 'Lucía');
    await user.type(screen.getByLabelText('Apellidos'), 'Pérez');
    await user.type(screen.getByLabelText('Correo electrónico'), 'lucia@duoc.cl');
    await user.type(screen.getByLabelText('Contraseña'), 'clave1');
    await user.selectOptions(screen.getByLabelText('Tipo de usuario'), 'Vendedor');
    await user.selectOptions(screen.getByLabelText('Región'), 'Región de Coquimbo');
    await user.selectOptions(screen.getByLabelText('Comuna'), 'Ovalle');
    await user.type(screen.getByLabelText('Dirección'), 'Calle 1');
    await user.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    expect(await titulo('Usuarios')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Ver Lucía' }));
    expect(await titulo('Lucía Pérez')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: /Editar usuario/ }));
    const nombre = await screen.findByLabelText('Nombre');
    await user.clear(nombre);
    await user.type(nombre, 'Lucía Andrea');
    await user.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    expect(await titulo('Lucía Andrea Pérez')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Volver' }));
    await user.click(await screen.findByRole('button', { name: 'Eliminar Lucía Andrea' }));
    await confirmarEnModal(user, 'Eliminar usuario', 'Eliminar');
    expect(leer(CLAVES.usuarios).some((u) => u.run === '111111111')).toBe(false);
  });

  it('no permite eliminar la propia cuenta y filtra por rol', async () => {
    iniciarSesionComo('Administrador');
    const user = userEvent.setup();
    renderApp('/admin/usuarios');
    expect(screen.getByRole('button', { name: 'Eliminar Admin' })).toBeDisabled();
    await user.selectOptions(screen.getByLabelText('Filtrar por rol'), 'Cliente');
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('muestra el historial de compras de un cliente', () => {
    iniciarSesionComo('Administrador');
    renderApp('/admin/usuarios/21456789K/compras');
    expect(screen.getByRole('heading', { name: 'Historial de compras de Pedro Soto Fuentes' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Ver boleta/ }).map((l) => l.textContent)).toHaveLength(3);
  });

  it('el perfil actualiza los datos de la sesión', async () => {
    iniciarSesionComo('Vendedor');
    const user = userEvent.setup();
    renderApp('/admin/perfil');
    expect(screen.getByLabelText('RUN')).toBeDisabled();
    const nombre = screen.getByLabelText('Nombre');
    await user.clear(nombre);
    await user.type(nombre, 'Valeria');
    await user.click(screen.getByRole('button', { name: 'Guardar mis datos' }));
    expect(await screen.findByText('Valeria (Vendedor)')).toBeInTheDocument();
    expect(leer(CLAVES.sesion).nombre).toBe('Valeria');
  });

  it('cerrar sesión desde el panel vuelve a la tienda', async () => {
    iniciarSesionComo('Administrador');
    const user = userEvent.setup();
    renderApp('/admin');
    await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }));
    expect(await screen.findByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument();
    expect(localStorage.getItem(CLAVES.sesion)).toBeNull();
  });
});
