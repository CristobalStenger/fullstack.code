import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import EncabezadoPagina from '../../components/comunes/EncabezadoPagina.jsx';
import FiltrosCatalogo from '../../components/producto/FiltrosCatalogo.jsx';
import ProductoGrid from '../../components/producto/ProductoGrid.jsx';
import { FILTROS_VACIOS, filtrarProductos, tiposDe } from '../../utils/catalogo.js';
import { useTienda } from '../../hooks/useTienda.js';
import { useTitulo } from '../../hooks/useTitulo.js';

// Catálogo completo. El texto de búsqueda vive en la URL (?q=) para que
// el buscador del Header funcione desde cualquier página.
export default function Productos() {
  useTitulo('Productos');
  const { estado, dispatch } = useTienda();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const texto = searchParams.get('q') ?? '';
  const todos = { ...filtros, texto };

  function cambiar(campo, valor) {
    if (campo === 'texto') {
      setSearchParams(valor ? { q: valor } : {}, { replace: true });
      return;
    }
    // Al cambiar de categoría el tipo elegido puede dejar de existir
    setFiltros((actual) => ({ ...actual, [campo]: valor, ...(campo === 'categoria' ? { tipo: '' } : {}) }));
  }

  function limpiar() {
    setFiltros(FILTROS_VACIOS);
    setSearchParams({}, { replace: true });
  }

  const visibles = filtrarProductos(estado.productos, todos);

  return (
    <>
      <EncabezadoPagina titulo="Catálogo NexusTech">
        Todos nuestros productos: componentes, periféricos, consolas y notebooks.
      </EncabezadoPagina>

      <nav className="d-flex flex-wrap justify-content-center gap-2 mb-4" aria-label="Categorías">
        {estado.categorias.map((c) => (
          <Link key={c.id} to={`/categorias/${c.slug}`} className="btn btn-nexus-claro">
            <i className={`bi ${c.icono} me-1`} aria-hidden="true"></i>
            {c.nombre}
          </Link>
        ))}
        <Link to="/ofertas" className="btn btn-nexus-claro">
          <i className="bi bi-percent me-1" aria-hidden="true"></i>
          Ofertas
        </Link>
      </nav>

      <FiltrosCatalogo
        filtros={todos}
        onCambio={cambiar}
        onLimpiar={limpiar}
        categorias={estado.categorias}
        tipos={tiposDe(estado.productos, filtros.categoria)}
        resultados={visibles.length}
      />

      <ProductoGrid productos={visibles} alAgregar={(id) => dispatch({ type: 'AGREGAR', id })} />
    </>
  );
}
