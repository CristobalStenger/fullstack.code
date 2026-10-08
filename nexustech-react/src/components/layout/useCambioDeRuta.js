import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

// Al cambiar de página: vuelve arriba y mueve el foco al contenido principal
export function useCambioDeRuta() {
  const { pathname } = useLocation();
  const main = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [pathname]);

  return main;
}
