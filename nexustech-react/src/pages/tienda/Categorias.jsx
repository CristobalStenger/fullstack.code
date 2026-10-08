import { useState } from 'react';
import { Link, useParams } from 'react-router';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EncabezadoPagina from '../../components/comunes/EncabezadoPagina.jsx';
import EstadoVacio from '../../components/comunes/EstadoVacio.jsx';
import CategoriaCard from '../../components/producto/CategoriaCard.jsx';
import FiltrosCatalogo from '../../components/producto/FiltrosCatalogo.jsx';
import ProductoGrid from '../../components/producto/ProductoGrid.jsx';
import { FILTROS_VACIOS, filtrarProductos, tiposDe } from '../../utils/catalogo.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useTitulo } from '../../hooks/useTitulo.js';

// Vista nueva: separa los productos por categoría.
// /categorias muestra todas; /categorias/:slug una en particular.
export default function Categorias() {
  const { slug } = useParams();
  const { estado, dispatch } = useTienda();
  const seleccionada = estado.categorias.find((c) => c.slug === slug) ?? null;
  useTitulo(seleccionada ? seleccionada.nombre : 'Categorías');

  const agregar = (id) => dispatch({ type: 'AGREGAR', id });
  const cantidadDe = (c) => estado.productos.filter((p) => p.categoria === c.nombre).length;

  return (
    <>
      <EncabezadoPagina icono="bi-grid" titulo="Categorías">
        Elige una categoría para ver sus productos.
      </EncabezadoPagina>

      <Row className="g-3 mb-5 justify-content-center">
        {estado.categorias.map((c) => (
          <Col xs={6} md={4} lg={3} key={c.id}>
            <CategoriaCard categoria={c} cantidad={cantidadDe(c)} activa={c.slug === slug} />
          </Col>
        ))}
      </Row>

      {slug && !seleccionada && (
        <EstadoVacio icono="bi-tags" titulo="La categoría no existe.">
          <Link to="/categorias" className="btn btn-nexus">
            Ver todas las categorías
          </Link>
        </EstadoVacio>
      )}

      {seleccionada && (
        <ProductosDeCategoria key={seleccionada.id} categoria={seleccionada} productos={estado.productos} alAgregar={agregar} />
      )}

      {!slug &&
        estado.categorias.map((c) => (
          <section key={c.id} className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h3 fw-bold mb-0">{c.nombre}</h2>
              <Link to={`/categorias/${c.slug}`} className="btn btn-nexus-claro btn-sm">
                Ver todos ({cantidadDe(c)})
              </Link>
            </div>
            <ProductoGrid
              productos={estado.productos.filter((p) => p.categoria === c.nombre).slice(0, 4)}
              alAgregar={agregar}
              mensajeVacio="Esta categoría aún no tiene productos."
            />
          </section>
        ))}
    </>
  );
}

function ProductosDeCategoria({ categoria, productos, alAgregar }) {
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const visibles = filtrarProductos(productos, { ...filtros, categoria: categoria.nombre });

  return (
    <section>
      <h2 className="h3 fw-bold mb-3">{categoria.nombre}</h2>
      <FiltrosCatalogo
        filtros={filtros}
        onCambio={(campo, valor) => setFiltros((actual) => ({ ...actual, [campo]: valor }))}
        onLimpiar={() => setFiltros(FILTROS_VACIOS)}
        tipos={tiposDe(productos, categoria.nombre)}
        mostrarCategoria={false}
        resultados={visibles.length}
      />
      <ProductoGrid productos={visibles} alAgregar={alAgregar} />
    </section>
  );
}
