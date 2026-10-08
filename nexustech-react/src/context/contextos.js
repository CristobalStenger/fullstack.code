import { createContext } from 'react';

// Los contextos viven en un archivo sin componentes para que
// Vite pueda recargar los providers sin perder el estado.
export const TiendaContext = createContext(null);
export const AuthContext = createContext(null);
