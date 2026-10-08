import { Link } from 'react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import EncabezadoAdmin from '../../components/admin/EncabezadoAdmin.jsx';
import TarjetaMetrica from '../../components/admin/TarjetaMetrica.jsx';
import TablaOrdenes from '../../components/admin/TablaOrdenes.jsx';
import { seccionesVisibles } from '../../components/admin/secciones.js';
import { precioCLP } from '../../utils/formatos.js';
import { productosCriticos, resumenVentas } from '../../utils/reportes.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function Dashboard() {
  useTitulo('Dashboard');
  const { estado } = useTienda();
  const { usuarios, sesion } = useAuth();
  const ventas = resumenVentas(estado.ordenes);
  const criticos = productosCriticos(estado.productos);
  const inventario = estado.productos.reduce((total, p) => total + p.stock, 0);
  const clientes = usuarios.filter((u) => u.tipo === 'Cliente').length;
  const recientes = [...estado.ordenes].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 5);

  const modulos = [
    ...seccionesVisibles(sesion),
    { ruta: '/admin/perfil', texto: 'Perfil', icono: 'bi-person-circle', descripcion: 'Tu información personal y datos de la cuenta.' },
    { ruta: '/', texto: 'Tienda', icono: 'bi-shop', descripcion: 'Visualiza la tienda tal como la ven los clientes.' },
  ];

  return (
    <>
      <EncabezadoAdmin titulo="Dashboard">Resumen de las actividades de la tienda.</EncabezadoAdmin>

      <Row className="g-3 mb-4">
        <Col md={6} xl={3}>
          <TarjetaMetrica titulo="Compras" valor={ventas.pagadas} detalle={`Ventas: ${precioCLP(ventas.totalVentas)}`} icono="bi-cart-check" />
        </Col>
        <Col md={6} xl={3}>
          <TarjetaMetrica titulo="Productos" valor={estado.productos.length} detalle={`Inventario actual: ${inventario} unidades`} icono="bi-box-seam" variante="success" />
        </Col>
        <Col md={6} xl={3}>
          <TarjetaMetrica titulo="Usuarios" valor={usuarios.length} detalle={`Clientes registrados: ${clientes}`} icono="bi-people-fill" variante="warning" />
        </Col>
        <Col md={6} xl={3}>
          <TarjetaMetrica titulo="Stock crítico" valor={criticos.length} detalle={`Pagos rechazados: ${ventas.rechazadas}`} icono="bi-exclamation-triangle" variante="danger" />
        </Col>
      </Row>

      {criticos.length > 0 && (
        <Alert variant="warning" className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>Hay {criticos.length} producto(s) con stock crítico.</span>
          <Link to="/admin/productos/criticos" className="btn btn-sm btn-warning">
            Ver productos críticos
          </Link>
        </Alert>
      )}

      <Row className="g-3 mb-4">
        {modulos.map((m) => (
          <Col xs={6} md={4} xl={3} key={m.ruta}>
            <Link to={m.ruta} className="tarjeta-modulo caja-vidrio p-3">
              <i className={`bi ${m.icono}`} aria-hidden="true"></i>
              <h2 className="h6 fw-bold mt-2">{m.texto}</h2>
              <p className="small mb-0">{m.descripcion}</p>
            </Link>
          </Col>
        ))}
      </Row>

      <section className="caja-vidrio p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 fw-bold mb-0">Últimas órdenes</h2>
          <Link to="/admin/ordenes" className="btn btn-sm btn-nexus-claro">
            Ver todas
          </Link>
        </div>
        <TablaOrdenes ordenes={recientes} />
      </section>
    </>
  );
}
