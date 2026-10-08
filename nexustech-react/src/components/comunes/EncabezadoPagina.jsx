// Caja de título reutilizada en todas las páginas
export default function EncabezadoPagina({ icono, titulo, children }) {
  return (
    <section className="caja-vidrio text-center p-4 mb-4">
      <h1 className="fw-bold">
        {icono && <i className={`bi ${icono} me-3`} aria-hidden="true"></i>}
        {titulo}
      </h1>
      {children && <p className="mb-0">{children}</p>}
    </section>
  );
}
