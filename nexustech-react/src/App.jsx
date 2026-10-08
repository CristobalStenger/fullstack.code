import { Route, Routes } from 'react-router';
import { AuthProvider } from './context/AuthProvider.jsx';
import { TiendaProvider } from './context/TiendaProvider.jsx';
import Layout from './components/layout/Layout.jsx';
import Inicio from './pages/tienda/Inicio.jsx';
import Productos from './pages/tienda/Productos.jsx';
import DetalleProducto from './pages/tienda/DetalleProducto.jsx';
import Categorias from './pages/tienda/Categorias.jsx';
import Ofertas from './pages/tienda/Ofertas.jsx';
import Nosotros from './pages/tienda/Nosotros.jsx';
import Blogs from './pages/tienda/Blogs.jsx';
import DetalleBlog from './pages/tienda/DetalleBlog.jsx';
import Contacto from './pages/tienda/Contacto.jsx';
import Login from './pages/tienda/Login.jsx';
import Registro from './pages/tienda/Registro.jsx';
import Carrito from './pages/tienda/Carrito.jsx';
import Checkout from './pages/tienda/Checkout.jsx';
import CompraExitosa from './pages/tienda/CompraExitosa.jsx';
import CompraError from './pages/tienda/CompraError.jsx';
import NoEncontrada from './pages/tienda/NoEncontrada.jsx';

export default function App() {
  return (
    <AuthProvider>
      <TiendaProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Inicio />} />
            <Route path="productos" element={<Productos />} />
            <Route path="productos/:id" element={<DetalleProducto />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="categorias/:slug" element={<Categorias />} />
            <Route path="ofertas" element={<Ofertas />} />
            <Route path="nosotros" element={<Nosotros />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="blogs/:id" element={<DetalleBlog />} />
            <Route path="contacto" element={<Contacto />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Registro />} />
            <Route path="carrito" element={<Carrito />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="compra/exitosa/:numero" element={<CompraExitosa />} />
            <Route path="compra/error/:numero" element={<CompraError />} />
            <Route path="*" element={<NoEncontrada />} />
          </Route>
        </Routes>
      </TiendaProvider>
    </AuthProvider>
  );
}
