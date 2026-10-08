import EncabezadoPagina from '../../components/comunes/EncabezadoPagina.jsx';
import ProductoGrid from '../../components/producto/ProductoGrid.jsx';
import { productosEnOferta } from '../../utils/catalogo.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useTitulo } from '../../hooks/useTitulo.js';

// Vista nueva: todos los productos con descuento, del mayor al menor
export default function Ofertas() {
  useTitulo('Ofertas');
  const { estado, dispatch } = useTienda();
  const ofertas = productosEnOferta(estado.productos);

  return (
    <>
      <EncabezadoPagina icono="bi-percent" titulo="Ofertas">
        {ofertas.length} producto(s) con descuento por tiempo limitado.
      </EncabezadoPagina>
      <ProductoGrid
        productos={ofertas}
        alAgregar={(id) => dispatch({ type: 'AGREGAR', id })}
        mensajeVacio="Por ahora no hay productos en oferta."
      />
    </>
  );
}
