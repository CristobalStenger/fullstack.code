import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from '../App.jsx';
import { AuthProvider } from '../context/AuthProvider.jsx';
import { TiendaProvider } from '../context/TiendaProvider.jsx';
import { usuariosIniciales } from '../data/usuariosIniciales.js';
import { CLAVES } from '../services/storage.js';
import { crearSesion } from '../services/persistencia.js';

// La aplicación completa con un historial en memoria
export function renderApp(ruta = '/', state) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: ruta.split('?')[0], search: ruta.includes('?') ? `?${ruta.split('?')[1]}` : '', state }]}>
      <App />
    </MemoryRouter>,
  );
}

// Un componente suelto con los providers y el router que necesita
export function renderConProviders(ui, ruta = '/') {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <TiendaProvider>{ui}</TiendaProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

// Deja guardada la sesión de uno de los usuarios de ejemplo
export function iniciarSesionComo(tipo) {
  const usuario = usuariosIniciales.find((u) => u.tipo === tipo);
  localStorage.setItem(CLAVES.sesion, JSON.stringify(crearSesion(usuario)));
  return usuario;
}

export function guardarCarrito(carrito) {
  localStorage.setItem(CLAVES.carrito, JSON.stringify(carrito));
}

export const leer = (clave) => JSON.parse(localStorage.getItem(clave));
