// Título de cada vista del panel con botones de acción opcionales
export default function EncabezadoAdmin({ titulo, children, acciones }) {
  return (
    <section className="caja-vidrio p-4 mb-4">
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <h1 className="h2 fw-bold">{titulo}</h1>
          {children && <p className="mb-0">{children}</p>}
        </div>
        {acciones && <div className="d-flex gap-2 flex-wrap">{acciones}</div>}
      </div>
    </section>
  );
}
