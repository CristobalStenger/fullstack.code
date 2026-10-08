import { Link } from 'react-router';
import EstadoVacio from '../../components/comunes/EstadoVacio.jsx';
import { useTitulo } from '../../hooks/useTitulo.js';

export default function NoEncontrada() {
  useTitulo('Página no encontrada');
  return (
    <section className="py-4">
      <h1 className="visually-hidden">Página no encontrada</h1>
      <EstadoVacio icono="bi-signpost-split" titulo="Página no encontrada">
        <p>La dirección que abriste no existe.</p>
        <Link to="/" className="btn btn-nexus">
          Volver al inicio
        </Link>
      </EstadoVacio>
    </section>
  );
}
