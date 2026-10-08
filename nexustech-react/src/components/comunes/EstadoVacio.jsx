// Mensaje que se muestra cuando una lista no tiene elementos
export default function EstadoVacio({ icono = 'bi-search', titulo, children }) {
  return (
    <div className="caja-vidrio text-center p-5">
      <i className={`bi ${icono} fs-1`} aria-hidden="true"></i>
      <p className="mt-3 mb-2 fw-bold">{titulo}</p>
      {children}
    </div>
  );
}
