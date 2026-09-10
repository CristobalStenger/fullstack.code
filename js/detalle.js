// ============================================================
// NexusTech - Detalle de un producto
// El id llega guardado en localStorage desde la lista de productos
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    mostrarDetalle();
});

function mostrarDetalle() {
    const contenedorDetalle = document.getElementById("detalle-producto");
    if (!contenedorDetalle) return;

    const idGuardado = localStorage.getItem("PRODUCTO_VISTO");
    const producto = productosNexus.find(p => p.id == idGuardado);

    if (!producto) {
        contenedorDetalle.innerHTML = `
            <div class="caja-vidrio text-center p-5">
                <i class="bi bi-box-seam fs-1"></i>
                <p class="mt-3 fw-bold">No elegiste ningun producto.</p>
                <a href="catalogo.html" class="btn btn-nexus">Ir al catalogo</a>
            </div>
        `;
        return;
    }

    // Aviso cuando queda poco inventario
    let avisoStock = `<p class="mb-1">Stock disponible: <strong>${producto.stock}</strong> unidades</p>`;
    if (producto.stock <= producto.stockCritico) {
        avisoStock = `
            <p class="mb-1">Stock disponible: <strong>${producto.stock}</strong> unidades</p>
            <p class="aviso-stock"><i class="bi bi-exclamation-triangle me-1"></i>Ultimas unidades disponibles</p>
        `;
    }

    // Precio 0 se considera un producto gratis
    let textoPrecio = `$${producto.precio.toLocaleString("es-CL")}`;
    if (producto.precio === 0) {
        textoPrecio = "FREE";
    }

    contenedorDetalle.innerHTML = `
        <div class="col-12 col-lg-5">
            <div class="caja-vidrio p-3">
                <div class="caja-imagen-grande">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>
            </div>
        </div>
        <div class="col-12 col-lg-7">
            <div class="caja-vidrio p-4 h-100">
                <div class="mb-2">
                    <span class="badge badge-nexus">${producto.categoria}</span>
                    <span class="badge badge-tipo">${producto.tipo}</span>
                </div>
                <h1 class="fw-bold">${producto.nombre}</h1>
                <p class="mb-1">Codigo: <strong>${producto.codigo}</strong></p>
                ${avisoStock}
                <p class="fs-2 precio-producto my-3">${textoPrecio}</p>

                <h2 class="h5 fw-bold">Descripcion</h2>
                <p>${producto.descripcion}</p>

                <h2 class="h5 fw-bold mt-4">Caracteristicas</h2>
                <ul>
                    <li>Categoria: ${producto.categoria}</li>
                    <li>Tipo: ${producto.tipo}</li>
                    <li>Garantia oficial de 12 meses</li>
                    <li>Envio a todo Chile en 48 horas habiles</li>
                </ul>

                <button class="btn btn-nexus w-100 py-2 mt-3" onclick="agregarAlCarrito('${producto.id}')">
                    <i class="bi bi-cart-plus me-1"></i> Agregar al carrito
                </button>
                <a href="catalogo.html" class="btn btn-nexus-claro w-100 py-2 mt-2">
                    <i class="bi bi-arrow-left me-1"></i> Volver al catalogo
                </a>
            </div>
        </div>
    `;
}
