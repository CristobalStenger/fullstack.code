import { Route, Routes } from 'react-router';
import { AuthProvider } from './context/AuthProvider.jsx';
import { TiendaProvider } from './context/TiendaProvider.jsx';
import Layout from './components/layout/Layout.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import RutaProtegida from './components/layout/RutaProtegida.jsx';
import { ROLES_PANEL } from './store/authReducer.js';
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
import Dashboard from './pages/admin/Dashboard.jsx';
import Ordenes from './pages/admin/Ordenes.jsx';
import DetalleOrden from './pages/admin/DetalleOrden.jsx';
import ProductosAdmin from './pages/admin/ProductosAdmin.jsx';
import MostrarProducto from './pages/admin/MostrarProducto.jsx';
import NuevoProducto from './pages/admin/NuevoProducto.jsx';
import EditarProducto from './pages/admin/EditarProducto.jsx';
import ProductosCriticos from './pages/admin/ProductosCriticos.jsx';
import ReportesProductos from './pages/admin/ReportesProductos.jsx';
import CategoriasAdmin from './pages/admin/CategoriasAdmin.jsx';
import NuevaCategoria from './pages/admin/NuevaCategoria.jsx';
import EditarCategoria from './pages/admin/EditarCategoria.jsx';
import UsuariosAdmin from './pages/admin/UsuariosAdmin.jsx';
import MostrarUsuario from './pages/admin/MostrarUsuario.jsx';
import NuevoUsuario from './pages/admin/NuevoUsuario.jsx';
import EditarUsuario from './pages/admin/EditarUsuario.jsx';
import HistorialCompras from './pages/admin/HistorialCompras.jsx';
import Reportes from './pages/admin/Reportes.jsx';
import Perfil from './pages/admin/Perfil.jsx';

// Vendedor: solo lectura. Administrador: además crea, edita y elimina.
const SOLO_ADMIN = ['Administrador'];

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

          <Route path="admin" element={<RutaProtegida roles={ROLES_PANEL} />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="ordenes" element={<Ordenes />} />
              <Route path="ordenes/:numero" element={<DetalleOrden />} />
              <Route path="productos" element={<ProductosAdmin />} />
              <Route path="productos/criticos" element={<ProductosCriticos />} />
              <Route path="productos/reportes" element={<ReportesProductos />} />
              <Route path="productos/:id" element={<MostrarProducto />} />
              <Route path="categorias" element={<CategoriasAdmin />} />
              <Route path="perfil" element={<Perfil />} />
              <Route element={<RutaProtegida roles={SOLO_ADMIN} />}>
                <Route path="productos/nuevo" element={<NuevoProducto />} />
                <Route path="productos/:id/editar" element={<EditarProducto />} />
                <Route path="categorias/nueva" element={<NuevaCategoria />} />
                <Route path="categorias/:id/editar" element={<EditarCategoria />} />
                <Route path="usuarios" element={<UsuariosAdmin />} />
                <Route path="usuarios/nuevo" element={<NuevoUsuario />} />
                <Route path="usuarios/:run" element={<MostrarUsuario />} />
                <Route path="usuarios/:run/editar" element={<EditarUsuario />} />
                <Route path="usuarios/:run/compras" element={<HistorialCompras />} />
                <Route path="reportes" element={<Reportes />} />
              </Route>
              <Route path="*" element={<NoEncontrada />} />
            </Route>
          </Route>
        </Routes>
      </TiendaProvider>
    </AuthProvider>
  );
}
