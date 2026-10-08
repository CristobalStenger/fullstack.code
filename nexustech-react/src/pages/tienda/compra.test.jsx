import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CLAVES } from '../../services/storage.js';
import { guardarCarrito, iniciarSesionComo, leer, renderApp } from '../../test/utilidades.jsx';

async function completarCheckout(user, tarjeta = '4242 4242 4242 4242') {
  await user.type(screen.getByLabelText('Nombre'), 'Pedro');
  await user.type(screen.getByLabelText('Apellidos'), 'Hacker');
  await user.type(screen.getByLabelText('Correo'), 'pedro@gmail.com');
  await user.type(screen.getByLabelText('Calle'), 'Los Crisantemos 123');
  await user.selectOptions(screen.getByLabelText('Región'), 'Región Metropolitana');
  await user.selectOptions(screen.getByLabelText('Comuna'), 'Cerrillos');
  await completarTarjeta(user, tarjeta);
}

async function completarTarjeta(user, tarjeta) {
  await user.type(screen.getByLabelText('Número de tarjeta'), tarjeta);
  await user.type(screen.getByLabelText('Titular'), 'Pedro Hacker');
  await user.type(screen.getByLabelText('Vencimiento'), '12/30');
  await user.type(screen.getByLabelText('CVV'), '123');
}

const stockDe = (id) => leer(CLAVES.productos).find((p) => p.id === id).stock;

describe('carrito', () => {
  it('agrega desde el catálogo, cambia cantidades y elimina productos', async () => {
    const user = userEvent.setup();
    renderApp('/productos');
    await user.click(screen.getByRole('button', { name: 'Agregar AMD Ryzen 5 7600X al carrito' }));
    expect(await screen.findByText('AMD Ryzen 5 7600X agregado al carrito.')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Carrito (1)' }));
    await user.click(screen.getByRole('button', { name: 'Agregar una unidad de AMD Ryzen 5 7600X' }));
    expect(screen.getByLabelText('Cantidad de AMD Ryzen 5 7600X')).toHaveTextContent('2');
    expect(screen.getByRole('link', { name: 'Carrito (2)' })).toHaveTextContent('$499.980');
    await user.click(screen.getByRole('button', { name: 'Quitar una unidad de AMD Ryzen 5 7600X' }));
    expect(screen.getByLabelText('Cantidad de AMD Ryzen 5 7600X')).toHaveTextContent('1');
    await user.click(screen.getByRole('button', { name: 'Eliminar AMD Ryzen 5 7600X' }));
    expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
  });

  it('conserva el carrito al desmontar y volver a montar la aplicación', async () => {
    const user = userEvent.setup();
    const vista = renderApp('/productos');
    await user.click(screen.getByRole('button', { name: 'Agregar Razer DeathAdder V3 al carrito' }));
    vista.unmount();
    renderApp('/carrito');
    expect(screen.getByLabelText('Cantidad de Razer DeathAdder V3')).toHaveTextContent('1');
  });

  it('aplica cupones válidos, rechaza los inexistentes y permite quitarlos', async () => {
    guardarCarrito([{ id: 1, cantidad: 1 }]);
    const user = userEvent.setup();
    renderApp('/carrito');
    await user.type(screen.getByLabelText('¿Tienes un cupón?'), 'NOEXISTE');
    await user.click(screen.getByRole('button', { name: 'Aplicar' }));
    expect(screen.getByText('El cupón "NOEXISTE" no existe.')).toBeInTheDocument();
    await user.clear(screen.getByLabelText('¿Tienes un cupón?'));
    await user.type(screen.getByLabelText('¿Tienes un cupón?'), 'cuturrufo70');
    await user.click(screen.getByRole('button', { name: 'Aplicar' }));
    expect(screen.getByText('Cupón CUTURRUFO70 aplicado: 25% de descuento.')).toBeInTheDocument();
    expect(screen.getByText('-$62.498')).toBeInTheDocument();
    expect(leer(CLAVES.cupon).codigo).toBe('CUTURRUFO70');
    await user.click(screen.getByRole('button', { name: 'Quitar cupón' }));
    expect(screen.queryByText('-$62.498')).not.toBeInTheDocument();
  });

  it('vacía el carrito solo después de confirmar en el modal', async () => {
    guardarCarrito([{ id: 1, cantidad: 1 }]);
    const user = userEvent.setup();
    renderApp('/carrito');
    await user.click(screen.getByRole('button', { name: /Vaciar carrito/ }));
    let dialogo = await screen.findByRole('dialog', { name: 'Vaciar carrito' });
    await user.click(within(dialogo).getByRole('button', { name: 'Cancelar' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByLabelText('Cantidad de AMD Ryzen 5 7600X')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Vaciar carrito/ }));
    dialogo = await screen.findByRole('dialog', { name: 'Vaciar carrito' });
    await user.click(within(dialogo).getByRole('button', { name: 'Vaciar' }));
    expect(await screen.findByText('Tu carrito está vacío.')).toBeInTheDocument();
  });

  it('bloquea la compra si el stock cambió', () => {
    guardarCarrito([{ id: 7, cantidad: 5 }]);
    renderApp('/carrito');
    expect(screen.getByText(/El stock de algunos productos cambió/)).toBeInTheDocument();
    expect(screen.getByText('Solo quedan 2 unidades')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Comprar ahora/ })).toBeDisabled();
  });
});

describe('checkout y pago simulado', () => {
  it('sin productos no muestra el formulario de pago', () => {
    renderApp('/checkout');
    expect(screen.getByText('No hay productos para pagar.')).toBeInTheDocument();
  });

  it('valida los datos del cliente, la dirección y la tarjeta', async () => {
    guardarCarrito([{ id: 1, cantidad: 1 }]);
    const user = userEvent.setup();
    renderApp('/checkout');
    await user.click(screen.getByRole('button', { name: /Pagar ahora/ }));
    for (const mensaje of [
      'El nombre es obligatorio.',
      'La calle es obligatoria.',
      'Selecciona una región.',
      'La tarjeta debe tener 16 dígitos.',
      'Usa el formato MM/AA.',
    ])
      expect(screen.getByText(mensaje)).toBeInTheDocument();
    expect(leer(CLAVES.ordenes)).toHaveLength(5);
  });

  it('autocompleta los datos del cliente con sesión iniciada y suma el envío elegido', async () => {
    iniciarSesionComo('Cliente');
    guardarCarrito([{ id: 1, cantidad: 1 }]);
    const user = userEvent.setup();
    renderApp('/checkout');
    expect(screen.getByLabelText('Nombre')).toHaveValue('Pedro');
    expect(screen.getByLabelText('Correo')).toHaveValue('cliente@gmail.com');
    expect(screen.getByLabelText('Comuna')).toHaveValue('Providencia');
    expect(screen.getByRole('button', { name: 'Pagar ahora $253.980' })).toBeInTheDocument();
    await user.click(screen.getByLabelText(/Retiro en tienda/));
    expect(screen.getByRole('button', { name: 'Pagar ahora $249.990' })).toBeInTheDocument();
  });

  it('compra exitosa: descuenta stock, vacía el carrito y muestra la boleta', async () => {
    guardarCarrito([{ id: 1, cantidad: 2 }]);
    const user = userEvent.setup();
    renderApp('/carrito');
    await user.click(screen.getByRole('button', { name: /Comprar ahora/ }));
    await completarCheckout(user);
    await user.click(screen.getByRole('button', { name: /Pagar ahora/ }));

    expect(await screen.findByRole('heading', { name: /Se ha realizado la compra\. nro #1006/ })).toBeInTheDocument();
    expect(screen.getByText('Total pagado')).toBeInTheDocument();
    expect(screen.getByText('$503.970')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Carrito (0)' })).toBeInTheDocument();
    expect(stockDe(1)).toBe(10);
    expect(leer(CLAVES.ordenes).at(-1)).toMatchObject({ numero: 1006, estado: 'pagada', total: 503970 });

    await user.click(screen.getByRole('button', { name: /Imprimir boleta en PDF/ }));
    expect(window.print).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /Enviar boleta por email/ }));
    expect(screen.getByText('Boleta enviada a pedro@gmail.com (envío simulado).')).toBeInTheDocument();
  });

  it('pago rechazado: conserva carrito y stock, y permite reintentar con los datos precargados', async () => {
    guardarCarrito([{ id: 1, cantidad: 1 }]);
    const user = userEvent.setup();
    renderApp('/checkout');
    await completarCheckout(user, '4242 4242 4242 0000');
    await user.click(screen.getByRole('button', { name: /Pagar ahora/ }));

    expect(await screen.findByRole('heading', { name: /No se pudo realizar el pago\. nro #1006/ })).toBeInTheDocument();
    expect(screen.getByText(/La tarjeta fue rechazada por el banco emisor/)).toBeInTheDocument();
    expect(stockDe(1)).toBe(12);
    expect(leer(CLAVES.carrito)).toEqual([{ id: 1, cantidad: 1 }]);

    await user.click(screen.getByRole('button', { name: 'VOLVER A REALIZAR EL PAGO' }));
    expect(screen.getByText('Reintentando el pago de la orden #1006.')).toBeInTheDocument();
    expect(screen.getByLabelText('Calle')).toHaveValue('Los Crisantemos 123');
    await completarTarjeta(user, '4242 4242 4242 4242');
    await user.click(screen.getByRole('button', { name: /Pagar ahora/ }));
    expect(await screen.findByRole('heading', { name: /Se ha realizado la compra\. nro #1007/ })).toBeInTheDocument();
    expect(stockDe(1)).toBe(11);
  });

  it('pago rechazado por stock insuficiente', async () => {
    guardarCarrito([{ id: 7, cantidad: 3 }]);
    const user = userEvent.setup();
    renderApp('/checkout');
    expect(screen.getByText(/Algunos productos ya no tienen stock suficiente/)).toBeInTheDocument();
    await completarCheckout(user);
    await user.click(screen.getByRole('button', { name: /Pagar ahora/ }));
    expect(await screen.findByText(/Stock insuficiente para: NVIDIA GeForce RTX 4080 Super 16GB/)).toBeInTheDocument();
  });

  it('redirige entre las vistas de resultado según el estado de la orden', () => {
    renderApp('/compra/exitosa/1003');
    expect(screen.getByRole('heading', { name: /No se pudo realizar el pago\. nro #1003/ })).toBeInTheDocument();
    renderApp('/compra/error/1001');
    expect(screen.getByRole('heading', { name: /Se ha realizado la compra\. nro #1001/ })).toBeInTheDocument();
    renderApp('/compra/exitosa/9999');
    expect(screen.getByText('No encontramos esa orden.')).toBeInTheDocument();
  });
});
