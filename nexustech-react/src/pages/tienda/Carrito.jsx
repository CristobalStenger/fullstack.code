import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import EncabezadoPagina from '../../components/comunes/EncabezadoPagina.jsx';
import EstadoVacio from '../../components/comunes/EstadoVacio.jsx';
import ConfirmarModal from '../../components/comunes/ConfirmarModal.jsx';
import FilaCarrito from '../../components/compra/FilaCarrito.jsx';
import ResumenCompra from '../../components/compra/ResumenCompra.jsx';
import { detalleCarrito, resumenCarrito } from '../../store/tiendaReducer.js';
import { buscarCupon } from '../../utils/validaciones.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function Carrito() {
  useTitulo('Carrito');
  const { estado, dispatch } = useTienda();
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [mensajeCupon, setMensajeCupon] = useState(null);
  const [confirmarVaciar, setConfirmarVaciar] = useState(false);

  const detalle = detalleCarrito(estado);
  const resumen = resumenCarrito(estado);
  const stockCambio = detalle.some((p) => p.cantidad > p.stock);

  function aplicarCupon(evento) {
    evento.preventDefault();
    const { cupon, error } = buscarCupon(codigo, estado.carrito);
    if (error) {
      setMensajeCupon({ tipo: 'danger', texto: error });
      return;
    }
    dispatch({ type: 'APLICAR_CUPON', codigo: cupon.codigo });
    setMensajeCupon({ tipo: 'success', texto: `Cupón ${cupon.codigo} aplicado: ${cupon.descuento}% de descuento.` });
  }

  function quitarCupon() {
    dispatch({ type: 'QUITAR_CUPON' });
    setCodigo('');
    setMensajeCupon(null);
  }

  function vaciar() {
    dispatch({ type: 'VACIAR' });
    setConfirmarVaciar(false);
    setMensajeCupon(null);
  }

  return (
    <>
      <EncabezadoPagina icono="bi-cart3" titulo="Mi carrito de compras" />

      {!detalle.length ? (
        <EstadoVacio icono="bi-cart-x" titulo="Tu carrito está vacío.">
          <Link to="/productos" className="btn btn-nexus">
            Ir al catálogo
          </Link>
        </EstadoVacio>
      ) : (
        <Row className="g-4">
          <Col lg={8}>
            {stockCambio && (
              <Alert variant="warning">
                El stock de algunos productos cambió. Reduce las cantidades marcadas para poder comprar.
              </Alert>
            )}
            <div className="tabla-carrito table-responsive">
              <Table className="align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">Producto</th>
                    <th scope="col">Precio</th>
                    <th scope="col" className="text-center">Cantidad</th>
                    <th scope="col">Subtotal</th>
                    <th scope="col" className="text-center">Quitar</th>
                  </tr>
                </thead>
                <tbody>
                  {detalle.map((item) => (
                    <FilaCarrito
                      key={item.id}
                      item={item}
                      alCambiar={(cantidad) => dispatch({ type: 'CANTIDAD', id: item.id, cantidad })}
                      alQuitar={() => dispatch({ type: 'QUITAR', id: item.id })}
                    />
                  ))}
                </tbody>
              </Table>
            </div>
            <Link to="/productos" className="btn btn-nexus-claro mt-3">
              <i className="bi bi-arrow-left me-1" aria-hidden="true"></i> Seguir comprando
            </Link>
          </Col>

          <Col lg={4}>
            <div className="caja-vidrio p-4">
              <h2 className="h4 fw-bold mb-4">Resumen de compra</h2>
              <p className="mb-2">Productos: {resumen.unidades} unidad(es)</p>
              <ResumenCompra {...resumen} envio={undefined} cupon={estado.cupon} />
              <p className="small text-muted mt-2">El costo de envío se calcula en el checkout.</p>

              <Form onSubmit={aplicarCupon} className="mb-3">
                <Form.Label htmlFor="cupon">¿Tienes un cupón?</Form.Label>
                <InputGroup>
                  <Form.Control
                    id="cupon"
                    placeholder="Código de descuento"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                  />
                  <Button type="submit" variant="nexus-claro">
                    Aplicar
                  </Button>
                </InputGroup>
                {mensajeCupon && (
                  <Alert variant={mensajeCupon.tipo} className="mt-2 mb-0 py-2">
                    {mensajeCupon.texto}
                  </Alert>
                )}
                {estado.cupon && (
                  <Button variant="link" size="sm" className="p-0 mt-1" onClick={quitarCupon}>
                    Quitar cupón
                  </Button>
                )}
              </Form>

              <Button
                variant="nexus"
                className="w-100 py-2 mb-2"
                disabled={stockCambio}
                onClick={() => navigate('/checkout')}
              >
                <i className="bi bi-credit-card me-1" aria-hidden="true"></i> Comprar ahora
              </Button>
              <Button variant="outline-danger" className="w-100 py-2" onClick={() => setConfirmarVaciar(true)}>
                <i className="bi bi-trash me-1" aria-hidden="true"></i> Vaciar carrito
              </Button>
            </div>
          </Col>
        </Row>
      )}

      <ConfirmarModal
        abierto={confirmarVaciar}
        titulo="Vaciar carrito"
        textoConfirmar="Vaciar"
        confirmar={vaciar}
        cancelar={() => setConfirmarVaciar(false)}
      >
        ¿Deseas retirar todos los productos del carrito?
      </ConfirmarModal>
    </>
  );
}
