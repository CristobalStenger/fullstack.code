import { useEffect, useReducer, useState } from 'react';
import { TiendaContext } from './contextos.js';
import { cargarTienda, guardarTienda } from '../services/persistencia.js';
import { tiendaReducer } from '../store/tiendaReducer.js';

// Comparte el estado de la tienda y guarda cada cambio en localStorage
export function TiendaProvider({ children }) {
  const [estado, dispatch] = useReducer(tiendaReducer, undefined, cargarTienda);
  const [errorGuardado, setErrorGuardado] = useState(false);
  const { productos, categorias, ordenes, carrito, cupon } = estado;

  useEffect(() => {
    setErrorGuardado(!guardarTienda({ productos, categorias, ordenes, carrito, cupon }));
  }, [productos, categorias, ordenes, carrito, cupon]);

  return (
    <TiendaContext.Provider value={{ estado, dispatch, errorGuardado }}>
      {children}
    </TiendaContext.Provider>
  );
}
