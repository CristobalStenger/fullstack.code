import { useEffect } from 'react';

// Actualiza el título de la pestaña del navegador en cada página
export function useTitulo(titulo) {
  useEffect(() => {
    document.title = `${titulo} | NexusTech`;
  }, [titulo]);
}
