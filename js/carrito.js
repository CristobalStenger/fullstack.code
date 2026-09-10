// ============================================================
// NexusTech - Página del carrito de compras
// ============================================================

// Cupones de descuento disponibles en la tienda
const CUPONES = [
    { codigo: "FELIZ18", descuento: 10 },
    { codigo: "CUTURRUFO70", descuento: 25 },
    { codigo: "BOOTSTRAP", descuento: 5 },
    { codigo: "XAVICRIS", descuento: 15 }
];

document.addEventListener("DOMContentLoaded", () => {
    renderizarTablaCarrito();
});

// ------------------------------------------------------------
// Revisa el codigo escrito y guarda el cupon si existe
// ------------------------------------------------------------
function aplicarCupon() {
    const entrada = document.getElementById("cupon");
    const aviso = document.getElementById("mensaje-cupon");
    if (!entrada) return;

    const codigoEscrito = entrada.value.trim().toUpperCase();

    if (codigoEscrito === "") {
        aviso.innerHTML = `<div class="alert alert-danger mb-0 py-2">Escribe un codigo de descuento.</div>`;
        return;
    }

    const cuponEncontrado = CUPONES.find(cupon => cupon.codigo === codigoEscrito);

    if (!cuponEncontrado) {
        localStorage.removeItem("CUPON_NEXUSTECH");
        aviso.innerHTML = `<div class="alert alert-danger mb-0 py-2">El cupon "${codigoEscrito}" no existe.</div>`;
        renderizarTablaCarrito();
        return;
    }

    const carritoStorage = JSON.parse(localStorage.getItem("CARRITO_NEXUSTECH")) || [];
    if (carritoStorage.length === 0) {
        aviso.innerHTML = `<div class="alert alert-danger mb-0 py-2">Agrega productos antes de usar un cupon.</div>`;
        return;
    }

    localStorage.setItem("CUPON_NEXUSTECH", JSON.stringify(cuponEncontrado));
    aviso.innerHTML = `<div class="alert alert-success mb-0 py-2">
        Cupon <strong>${cuponEncontrado.codigo}</strong> aplicado: ${cuponEncontrado.descuento}% de descuento.
    </div>`;

    renderizarTablaCarrito();
}

// ------------------------------------------------------------
// Quita el cupon que estaba aplicado
// ------------------------------------------------------------
function quitarCupon() {
    localStorage.removeItem("CUPON_NEXUSTECH");

    const entrada = document.getElementById("cupon");
    if (entrada) entrada.value = "";

    const aviso = document.getElementById("mensaje-cupon");
    if (aviso) aviso.innerHTML = "";

    renderizarTablaCarrito();
}

// ------------------------------------------------------------
// Dibuja la tabla con los productos guardados
// ------------------------------------------------------------
function renderizarTablaCarrito() {
    const contenedorCarrito = document.getElementById("items-carrito");
    const elementoTotal = document.getElementById("total-carrito");

    if (!contenedorCarrito) return;

    const carritoStorage = JSON.parse(localStorage.getItem("CARRITO_NEXUSTECH")) || [];

    contenedorCarrito.innerHTML = "";
    let total = 0;

    if (carritoStorage.length === 0) {
        contenedorCarrito.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    Tu carrito está vacío.
                    <a href="catalogo.html" class="fw-bold">Ir al catálogo</a>
                </td>
            </tr>
        `;
        mostrarResumenCompra(0);
        return;
    }

    carritoStorage.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>
                <div class="d-flex align-items-center gap-2">
                    <div class="mini-imagen"><img src="${producto.imagen}" alt="${producto.nombre}"></div>
                    <div>
                        <span class="fw-semibold d-block">${producto.nombre}</span>
                        <small>${producto.tipo}</small>
                    </div>
                </div>
            </td>
            <td>$${producto.precio.toLocaleString("es-CL")}</td>
            <td class="text-center">
                <div class="btn-group btn-group-sm" role="group">
                    <button class="btn btn-nexus-claro" onclick="cambiarCantidad(${index}, -1)">-</button>
                    <span class="btn btn-light disabled px-3 fw-bold">${producto.cantidad}</span>
                    <button class="btn btn-nexus-claro" onclick="cambiarCantidad(${index}, 1)">+</button>
                </div>
            </td>
            <td class="fw-bold">$${subtotal.toLocaleString("es-CL")}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        contenedorCarrito.appendChild(fila);
    });

    mostrarResumenCompra(total);
}

// ------------------------------------------------------------
// Escribe subtotal, descuento y total aplicando el cupon
// ------------------------------------------------------------
function mostrarResumenCompra(subtotal) {
    const elementoSubtotal = document.getElementById("subtotal-carrito");
    const elementoDescuento = document.getElementById("descuento-carrito");
    const elementoTotal = document.getElementById("total-carrito");
    const filaCupon = document.getElementById("fila-cupon");

    const cuponActivo = JSON.parse(localStorage.getItem("CUPON_NEXUSTECH"));

    let rebaja = 0;
    if (cuponActivo && subtotal > 0) {
        rebaja = Math.round(subtotal * cuponActivo.descuento / 100);
    }

    const total = subtotal - rebaja;

    if (elementoSubtotal) elementoSubtotal.innerText = `$${subtotal.toLocaleString("es-CL")}`;
    if (elementoTotal) elementoTotal.innerText = `$${total.toLocaleString("es-CL")}`;

    if (elementoDescuento) {
        elementoDescuento.innerText = `-$${rebaja.toLocaleString("es-CL")}`;
    }

    // La fila del descuento solo se ve si hay un cupon aplicado
    if (filaCupon) {
        if (cuponActivo && subtotal > 0) {
            filaCupon.hidden = false;
            document.getElementById("nombre-cupon").innerText =
                `${cuponActivo.codigo} (${cuponActivo.descuento}%)`;
        } else {
            filaCupon.hidden = true;
        }
    }
}

// ------------------------------------------------------------
// Suma o resta unidades de un producto
// ------------------------------------------------------------
function cambiarCantidad(index, cambio) {
    let carritoStorage = JSON.parse(localStorage.getItem("CARRITO_NEXUSTECH")) || [];

    if (carritoStorage[index]) {
        carritoStorage[index].cantidad += cambio;

        if (carritoStorage[index].cantidad <= 0) {
            carritoStorage.splice(index, 1);
        }

        localStorage.setItem("CARRITO_NEXUSTECH", JSON.stringify(carritoStorage));
        renderizarTablaCarrito();
        actualizarContadorCarrito();
    }
}

// ------------------------------------------------------------
// Elimina un producto del carrito
// ------------------------------------------------------------
function eliminarProducto(index) {
    let carritoStorage = JSON.parse(localStorage.getItem("CARRITO_NEXUSTECH")) || [];
    carritoStorage.splice(index, 1);
    localStorage.setItem("CARRITO_NEXUSTECH", JSON.stringify(carritoStorage));
    renderizarTablaCarrito();
    actualizarContadorCarrito();
}

// ------------------------------------------------------------
// Vacía todo el carrito
// ------------------------------------------------------------
function vaciarCarrito() {
    localStorage.removeItem("CARRITO_NEXUSTECH");
    quitarCupon();
    renderizarTablaCarrito();
    actualizarContadorCarrito();
}

// ------------------------------------------------------------
// Botón pagar: revisa que haya sesión iniciada
// ------------------------------------------------------------
function pagarCompra() {
    const carritoStorage = JSON.parse(localStorage.getItem("CARRITO_NEXUSTECH")) || [];

    if (carritoStorage.length === 0) {
        alert("Tu carrito está vacío, agrega productos antes de pagar.");
        return;
    }

    const usuarioActivo = JSON.parse(localStorage.getItem("USUARIO_ACTIVO"));

    if (!usuarioActivo) {
        alert("Debes iniciar sesión para completar tu compra.");
        window.location.href = "login.html";
        return;
    }

    alert(`¡Gracias por tu compra, ${usuarioActivo.nombre}! Tu pedido fue registrado.`);
    vaciarCarrito();
}
