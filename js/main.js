// ============================================================
// NexusTech - Funciones generales (carrito y sesión)
// ============================================================

// Al cargar cualquier página se refresca el carrito y la sesión
document.addEventListener("DOMContentLoaded", () => {
    crearAdministradorInicial();
    actualizarContadorCarrito();
    mostrarUsuarioActivo();
});

// ------------------------------------------------------------
// Agrega un producto al carrito guardado en localStorage
// ------------------------------------------------------------
function agregarAlCarrito(idProducto) {
    let carritoActual = JSON.parse(localStorage.getItem("CARRITO_NEXUSTECH")) || [];

    const productoEncontrado = productosNexus.find(p => p.id == idProducto);

    if (!productoEncontrado) return;

    const existe = carritoActual.find(item => item.id == idProducto);

    if (existe) {
        existe.cantidad += 1;
    } else {
        carritoActual.push({
            ...productoEncontrado,
            cantidad: 1
        });
    }

    localStorage.setItem("CARRITO_NEXUSTECH", JSON.stringify(carritoActual));
    actualizarContadorCarrito();
    alert(`¡${productoEncontrado.nombre} agregado al carrito!`);
}

// ------------------------------------------------------------
// Refresca el número del carrito en la barra de navegación
// ------------------------------------------------------------
function actualizarContadorCarrito() {
    const contadorBadge = document.getElementById("cart-count");
    if (contadorBadge) {
        const carritoActual = JSON.parse(localStorage.getItem("CARRITO_NEXUSTECH")) || [];
        const totalItems = carritoActual.reduce((acc, item) => acc + item.cantidad, 0);
        contadorBadge.innerText = totalItems;
    }
}

// ------------------------------------------------------------
// Muestra el nombre del usuario que inició sesión
// ------------------------------------------------------------
function mostrarUsuarioActivo() {
    const zonaUsuario = document.getElementById("zona-usuario");
    if (!zonaUsuario) return;

    const usuarioActivo = JSON.parse(localStorage.getItem("USUARIO_ACTIVO"));

    if (usuarioActivo) {
        const ruta = zonaUsuario.dataset.ruta || "";
        let enlaceAdmin = "";

        // Solo el administrador y el vendedor ven el panel de gestion
        if (usuarioActivo.tipo === "Administrador" || usuarioActivo.tipo === "Vendedor") {
            enlaceAdmin = `<a href="${ruta}admin/index.html" class="btn btn-sm btn-nexus-claro me-2">Panel</a>`;
        }

        zonaUsuario.innerHTML = `
            <span class="fw-bold me-2">Hola, ${usuarioActivo.nombre}</span>
            ${enlaceAdmin}
            <button class="btn btn-sm btn-nexus-claro" onclick="cerrarSesion()">Salir</button>
        `;
    }
}

// ------------------------------------------------------------
// Crea el usuario administrador la primera vez que se abre el sitio
// ------------------------------------------------------------
function crearAdministradorInicial() {
    let usuarios = JSON.parse(localStorage.getItem("USUARIOS_NEXUSTECH")) || [];

    if (usuarios.length > 0) return;

    usuarios.push({
        run: "190110222",
        nombre: "Admin",
        apellidos: "NexusTech",
        correo: "admin@duoc.cl",
        clave: "admin123",
        fechaNacimiento: "",
        tipo: "Administrador",
        region: "Region Metropolitana",
        comuna: "Santiago",
        direccion: "Av. Principal 1234"
    });

    localStorage.setItem("USUARIOS_NEXUSTECH", JSON.stringify(usuarios));
}

// ------------------------------------------------------------
// Cierra la sesión del usuario activo
// ------------------------------------------------------------
function cerrarSesion() {
    localStorage.removeItem("USUARIO_ACTIVO");
    alert("Sesión cerrada. ¡Hasta pronto!");
    location.reload();
}

// ------------------------------------------------------------
// Guarda el producto elegido y abre la pagina de detalle
// ------------------------------------------------------------
function verDetalle(idProducto, ruta) {
    localStorage.setItem("PRODUCTO_VISTO", idProducto);
    window.location.href = ruta + "producto.html";
}
