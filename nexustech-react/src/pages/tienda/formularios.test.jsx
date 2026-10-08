import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CLAVES } from '../../services/storage.js';
import { leer, renderApp } from '../../test/utilidades.jsx';

describe('Login (estado del formulario)', () => {
  it('el estado del formulario cambia cuando el usuario escribe', async () => {
    const user = userEvent.setup();
    renderApp('/login');
    const correo = screen.getByLabelText('Correo electrónico');
    await user.type(correo, 'admin@duoc.cl');
    expect(correo).toHaveValue('admin@duoc.cl');
    await user.type(screen.getByLabelText('Contraseña'), '12');
    expect(screen.getByLabelText('Contraseña')).toHaveValue('12');
  });

  it('muestra errores de formato al tocar los campos y al enviar', async () => {
    const user = userEvent.setup();
    renderApp('/login');
    expect(screen.queryByText(/Solo se aceptan correos/)).not.toBeInTheDocument();
    await user.type(screen.getByLabelText('Correo electrónico'), 'persona@yahoo.com');
    expect(screen.getByText('Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(screen.getByText('La contraseña es obligatoria.')).toBeInTheDocument();
  });

  it('el mensaje de credenciales incorrectas aparece solo si hay error', async () => {
    const user = userEvent.setup();
    renderApp('/login');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await user.type(screen.getByLabelText('Correo electrónico'), 'admin@duoc.cl');
    await user.type(screen.getByLabelText('Contraseña'), 'mala1');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos');
    expect(leer(CLAVES.sesion)).toBeNull();
  });

  it('el cliente entra a la tienda y ve su nombre en la cabecera', async () => {
    const user = userEvent.setup();
    renderApp('/login');
    await user.type(screen.getByLabelText('Correo electrónico'), 'cliente@gmail.com');
    await user.type(screen.getByLabelText('Contraseña'), 'cliente123');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByText('Hola, Pedro')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Panel' })).not.toBeInTheDocument();
    expect(leer(CLAVES.sesion)).not.toHaveProperty('clave');
    await user.click(screen.getByRole('button', { name: 'Salir' }));
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument();
  });
});

describe('Registro de clientes', () => {
  it('valida todos los campos, crea la cuenta y permite iniciar sesión', async () => {
    const user = userEvent.setup();
    renderApp('/registro');
    await user.click(screen.getByRole('button', { name: 'Crear mi cuenta' }));
    expect(screen.getByText('El RUN es obligatorio.')).toBeInTheDocument();
    expect(screen.getByText('Debes aceptar los términos y condiciones.')).toBeInTheDocument();

    await user.type(screen.getByLabelText('RUN'), '111111111');
    await user.type(screen.getByLabelText('Nombre'), 'Lucía');
    await user.type(screen.getByLabelText('Apellidos'), 'Pérez');
    await user.type(screen.getByLabelText('Correo electrónico'), 'lucia@duoc.cl');
    await user.type(screen.getByLabelText('Contraseña'), 'clave1');
    await user.type(screen.getByLabelText('Repetir contraseña'), 'clave2');
    expect(screen.getByText('Las contraseñas no coinciden.')).toBeInTheDocument();
    await user.clear(screen.getByLabelText('Repetir contraseña'));
    await user.type(screen.getByLabelText('Repetir contraseña'), 'clave1');
    await user.selectOptions(screen.getByLabelText('Región'), 'Región de Coquimbo');
    await user.selectOptions(screen.getByLabelText('Comuna'), 'La Serena');
    await user.type(screen.getByLabelText('Dirección'), 'Av. del Mar 100');
    await user.click(screen.getByLabelText('Acepto los términos y condiciones de NexusTech.'));
    await user.click(screen.getByRole('button', { name: 'Crear mi cuenta' }));

    expect(await screen.findByText('Cuenta creada correctamente. Ya puedes iniciar sesión.', { selector: '.alert' })).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('lucia@duoc.cl');
    expect(leer(CLAVES.usuarios).find((u) => u.run === '111111111').tipo).toBe('Cliente');

    await user.type(screen.getByLabelText('Contraseña'), 'clave1');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByText('Hola, Lucía')).toBeInTheDocument();
  });

  it('no permite registrar un correo que ya existe', async () => {
    const user = userEvent.setup();
    renderApp('/registro');
    await user.type(screen.getByLabelText('Correo electrónico'), 'admin@duoc.cl');
    expect(screen.getByText('Ya existe un usuario con ese correo.')).toBeInTheDocument();
  });
});

describe('Contacto', () => {
  it('cuenta los caracteres, valida y guarda el mensaje', async () => {
    const user = userEvent.setup();
    renderApp('/contacto');
    await user.click(screen.getByRole('button', { name: /Enviar mensaje/ }));
    expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument();
    expect(screen.getByText('El comentario es obligatorio.')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Nombre'), 'Ana');
    await user.type(screen.getByLabelText('Comentario'), 'Hola');
    expect(screen.getByText('Te quedan 496 caracteres.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Enviar mensaje/ }));
    expect(screen.getByRole('status')).toHaveTextContent('Gracias Ana, recibimos tu mensaje.');
    expect(screen.getByLabelText('Comentario')).toHaveValue('');
    expect(leer(CLAVES.mensajes)).toEqual([expect.objectContaining({ nombre: 'Ana', comentario: 'Hola' })]);
  });
});
