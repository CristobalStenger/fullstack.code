import { Outlet } from 'react-router';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import AvisosGlobales from '../comunes/AvisosGlobales.jsx';
import { useCambioDeRuta } from './useCambioDeRuta.js';

// Estructura común de la tienda. Outlet muestra la página de la ruta.
export default function Layout() {
  const main = useCambioDeRuta();

  return (
    <>
      <a className="saltar-contenido" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <AvisosGlobales />
      <main id="contenido" tabIndex={-1} ref={main} className="container my-4">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
