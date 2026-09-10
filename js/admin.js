// ============================================================
// NexusTech - Panel de administracion
// Mantenedores de productos y usuarios + control de permisos
// Roles: Administrador (todo), Vendedor (solo ver), Cliente (sin acceso)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    if (!revisarPermisos()) return;

    sembrarProductos();
    ocultarOpcionesDelVendedor();
    mostrarResumen();
    listarProductosAdmin();
    listarUsuariosAdmin();
    cargarCategoriasProducto();
    llenarSelectProductos();
    llenarSelectUsuarios();
});

// ------------------------------------------------------------
// Solo el administrador y el vendedor pueden entrar al panel
// ------------------------------------------------------------
function revisarPermisos() {
    const usuarioActivo = JSON.parse(localStorage.getItem("USUARIO_ACTIVO"));

    if (!usuarioActivo) {
        alert("Debes iniciar sesion para entrar al panel de administracion.");
        window.location.href = "../login.html";
        return false;
    }

    if (usuarioActivo.tipo !== "Administrador" && usuarioActivo.tipo !== "Vendedor") {
        alert("Tu cuenta no tiene permisos para entrar al panel.");
        window.location.href = "../index.html";
        return false;
    }

    const zonaAdmin = document.getElementById("nombre-admin");
    if (zonaAdmin) {
        zonaAdmin.innerText = `${usuarioActivo.nombre} (${usuarioActivo.tipo})`;
    }

    return true;
}

// ------------------------------------------------------------
// El vendedor no ve las opciones que no le corresponden
// ------------------------------------------------------------
function ocultarOpcionesDelVendedor() {
    const usuarioActivo = JSON.parse(localStorage.getItem("USUARIO_ACTIVO"));
    if (!usuarioActivo || usuarioActivo.tipo === "Administrador") return;

    // El vendedor solo puede mirar: se esconde todo lo de crear y borrar
    document.querySelectorAll(".solo-admin").forEach(elemento => {
        elemento.style.display = "none";
    });
}

// ------------------------------------------------------------
// Numeros del home del administrador
// ------------------------------------------------------------
function mostrarResumen() {
    const cajaProductos = document.getElementById("total-productos");
    if (!cajaProductos) return;

    const usuarios = JSON.parse(localStorage.getItem("USUARIOS_NEXUSTECH")) || [];
    const productos = obtenerProductos();

    let enCritico = 0;
    productos.forEach(producto => {
        if (producto.stock <= producto.stockCritico) {
            enCritico = enCritico + 1;
        }
    });

    cajaProductos.innerText = productos.length;
    document.getElementById("total-usuarios").innerText = usuarios.length;
    document.getElementById("total-criticos").innerText = enCritico;
}

// ------------------------------------------------------------
// La primera vez copiamos los 40 productos del catalogo a
// localStorage. Desde ahi se crean, editan y eliminan
// ------------------------------------------------------------
function sembrarProductos() {
    const guardados = JSON.parse(localStorage.getItem("PRODUCTOS_NEXUSTECH"));

    if (!guardados || guardados.length === 0) {
        localStorage.setItem("PRODUCTOS_NEXUSTECH", JSON.stringify(productosNexus));
    }
}

// ------------------------------------------------------------
// Devuelve la lista de productos del sistema
// ------------------------------------------------------------
function obtenerProductos() {
    return JSON.parse(localStorage.getItem("PRODUCTOS_NEXUSTECH")) || [];
}

// ------------------------------------------------------------
// Guarda la lista completa de productos
// ------------------------------------------------------------
function guardarProductos(lista) {
    localStorage.setItem("PRODUCTOS_NEXUSTECH", JSON.stringify(lista));
}

// ------------------------------------------------------------
// LISTADO DE PRODUCTOS
// ------------------------------------------------------------
function listarProductosAdmin() {
    const cuerpoTabla = document.getElementById("tabla-productos");
    if (!cuerpoTabla) return;

    const productos = obtenerProductos();
    cuerpoTabla.innerHTML = "";

    productos.forEach((producto, index) => {
        // Marcamos en rojo los productos con stock critico
        let celdaStock = `<td>${producto.stock}</td>`;
        if (producto.stock <= producto.stockCritico) {
            celdaStock = `<td class="aviso-stock">${producto.stock} <i class="bi bi-exclamation-triangle"></i></td>`;
        }

        let textoPrecio = `$${producto.precio.toLocaleString("es-CL")}`;
        if (producto.precio === 0) {
            textoPrecio = "FREE";
        }

        cuerpoTabla.innerHTML += `
            <tr>
                <td>${producto.codigo}</td>
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>${textoPrecio}</td>
                ${celdaStock}
                <td>${producto.stockCritico}</td>
                <td class="text-center solo-admin">
                    <button class="btn btn-sm btn-nexus-claro me-1" onclick="editarProductoAdmin(${index})"
                        title="Editar producto">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarProductoAdmin(${index})"
                        title="Eliminar producto">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    ocultarOpcionesDelVendedor();
}

// ------------------------------------------------------------
// LISTADO DE USUARIOS
// ------------------------------------------------------------
function listarUsuariosAdmin() {
    const cuerpoTabla = document.getElementById("tabla-usuarios");
    if (!cuerpoTabla) return;

    const usuarios = JSON.parse(localStorage.getItem("USUARIOS_NEXUSTECH")) || [];
    cuerpoTabla.innerHTML = "";

    if (usuarios.length === 0) {
        cuerpoTabla.innerHTML = `<tr><td colspan="7" class="text-center py-4">Todavia no hay usuarios.</td></tr>`;
        return;
    }

    usuarios.forEach((usuario, index) => {
        cuerpoTabla.innerHTML += `
            <tr>
                <td>${usuario.run}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.apellidos}</td>
                <td>${usuario.correo}</td>
                <td><span class="badge badge-nexus">${usuario.tipo}</span></td>
                <td>${usuario.comuna}</td>
                <td class="text-center solo-admin">
                    <button class="btn btn-sm btn-nexus-claro me-1" onclick="editarUsuarioAdmin(${index})"
                        title="Editar usuario">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarUsuarioAdmin(${index})"
                        title="Eliminar usuario">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    ocultarOpcionesDelVendedor();
}

// ------------------------------------------------------------
// Llena el select de categorias del formulario de producto
// ------------------------------------------------------------
function cargarCategoriasProducto() {
    const selectorCategoria = document.getElementById("producto-categoria");
    if (!selectorCategoria) return;

    const categorias = [];
    productosNexus.forEach(producto => {
        if (!categorias.includes(producto.categoria)) {
            categorias.push(producto.categoria);
        }
    });

    categorias.forEach(categoria => {
        selectorCategoria.innerHTML += `<option value="${categoria}">${categoria}</option>`;
    });
}

// ------------------------------------------------------------
// NUEVO PRODUCTO
// ------------------------------------------------------------
const CAMPOS_PRODUCTO = [
    "producto-codigo", "producto-nombre", "producto-descripcion",
    "producto-precio", "producto-stock", "producto-stock-critico", "producto-categoria"
];

function validarProducto(evento) {
    evento.preventDefault();

    if (!revisarFormulario(CAMPOS_PRODUCTO, "mensaje-producto")) return;

    const codigo = document.getElementById("producto-codigo").value.trim().toUpperCase();

    if (obtenerProductos().find(producto => producto.codigo.toUpperCase() === codigo)) {
        mostrarMensaje("mensaje-producto", "Ya existe un producto con ese codigo.", true);
        return;
    }

    let stockCritico = document.getElementById("producto-stock-critico").value;
    if (stockCritico === "") {
        stockCritico = 0;
    }

    let productos = obtenerProductos();

    productos.push({
        id: 1000 + productos.length,
        codigo: codigo,
        nombre: document.getElementById("producto-nombre").value.trim(),
        categoria: document.getElementById("producto-categoria").value,
        tipo: "Nuevo",
        descripcion: document.getElementById("producto-descripcion").value.trim(),
        precio: Number(document.getElementById("producto-precio").value),
        stock: Number(document.getElementById("producto-stock").value),
        stockCritico: Number(stockCritico),
        imagen: ""
    });

    guardarProductos(productos);

    mostrarMensaje("mensaje-producto", "Producto guardado correctamente.", false);
    document.getElementById("form-producto").reset();
    limpiarAyudas(CAMPOS_PRODUCTO);
}

// ------------------------------------------------------------
// NUEVO USUARIO (desde el administrador)
// ------------------------------------------------------------
const CAMPOS_USUARIO = [
    "usuario-run", "usuario-nombre", "usuario-apellidos", "usuario-correo",
    "usuario-clave", "usuario-tipo-usuario", "usuario-region", "usuario-comuna",
    "usuario-direccion"
];

function validarUsuario(evento) {
    evento.preventDefault();

    if (!revisarFormulario(CAMPOS_USUARIO, "mensaje-usuario")) return;

    const run = document.getElementById("usuario-run").value.trim().toUpperCase();
    const correo = document.getElementById("usuario-correo").value.trim();

    let usuarios = JSON.parse(localStorage.getItem("USUARIOS_NEXUSTECH")) || [];

    if (usuarios.find(usuario => usuario.run === run)) {
        mostrarMensaje("mensaje-usuario", "Ya existe un usuario con ese RUN.", true);
        return;
    }

    if (usuarios.find(usuario => usuario.correo.toLowerCase() === correo.toLowerCase())) {
        mostrarMensaje("mensaje-usuario", "Ya existe un usuario con ese correo.", true);
        return;
    }

    usuarios.push({
        run: run,
        nombre: document.getElementById("usuario-nombre").value.trim(),
        apellidos: document.getElementById("usuario-apellidos").value.trim(),
        correo: correo,
        clave: document.getElementById("usuario-clave").value,
        fechaNacimiento: document.getElementById("usuario-fecha").value,
        tipo: document.getElementById("usuario-tipo-usuario").value,
        region: document.getElementById("usuario-region").value,
        comuna: document.getElementById("usuario-comuna").value,
        direccion: document.getElementById("usuario-direccion").value.trim()
    });

    localStorage.setItem("USUARIOS_NEXUSTECH", JSON.stringify(usuarios));

    mostrarMensaje("mensaje-usuario", "Usuario creado correctamente.", false);
    document.getElementById("form-usuario").reset();
    limpiarAyudas(CAMPOS_USUARIO);
    cargarComunas("usuario-region", "usuario-comuna");
}

// ------------------------------------------------------------
// Eliminar (solo el administrador)
// ------------------------------------------------------------
function eliminarProductoAdmin(index) {
    let productos = obtenerProductos();
    const producto = productos[index];

    if (!producto) return;

    if (!confirm(`Seguro que quieres eliminar "${producto.nombre}"?`)) return;

    productos.splice(index, 1);
    guardarProductos(productos);

    listarProductosAdmin();
    mostrarResumen();
}

function eliminarUsuarioAdmin(index) {
    let usuarios = JSON.parse(localStorage.getItem("USUARIOS_NEXUSTECH")) || [];
    const usuarioActivo = JSON.parse(localStorage.getItem("USUARIO_ACTIVO"));

    if (usuarios[index] && usuarioActivo && usuarios[index].run === usuarioActivo.run) {
        alert("No puedes eliminar tu propia cuenta mientras la estas usando.");
        return;
    }

    if (!confirm(`Seguro que quieres eliminar a "${usuarios[index].nombre}"?`)) return;

    usuarios.splice(index, 1);
    localStorage.setItem("USUARIOS_NEXUSTECH", JSON.stringify(usuarios));

    listarUsuariosAdmin();
    mostrarResumen();
}

// ============================================================
// EDITAR PRODUCTO
// ============================================================

// ------------------------------------------------------------
// Desde el listado: guarda cual se va a editar y abre la vista
// ------------------------------------------------------------
function editarProductoAdmin(index) {
    localStorage.setItem("PRODUCTO_EDITAR", index);
    window.location.href = "producto-editar.html";
}

// ------------------------------------------------------------
// Llena el select con todos los productos disponibles
// ------------------------------------------------------------
function llenarSelectProductos() {
    const selector = document.getElementById("elegir-producto");
    if (!selector) return;

    const productos = obtenerProductos();

    productos.forEach((producto, index) => {
        selector.innerHTML += `<option value="${index}">${producto.codigo} - ${producto.nombre}</option>`;
    });

    // Si venimos del listado, ya viene uno elegido
    const guardado = localStorage.getItem("PRODUCTO_EDITAR");
    if (guardado !== null && productos[guardado]) {
        selector.value = guardado;
        localStorage.removeItem("PRODUCTO_EDITAR");
    }

    cargarProductoAEditar();
}

// ------------------------------------------------------------
// Copia los datos del producto elegido dentro del formulario
// ------------------------------------------------------------
function cargarProductoAEditar() {
    const selector = document.getElementById("elegir-producto");
    const formulario = document.getElementById("form-producto-editar");
    if (!selector || !formulario) return;

    limpiarAyudas(CAMPOS_PRODUCTO);
    document.getElementById("mensaje-producto").innerHTML = "";

    // Sin producto elegido, el formulario se esconde
    if (selector.value === "") {
        formulario.hidden = true;
        return;
    }

    const producto = obtenerProductos()[selector.value];
    if (!producto) return;

    formulario.hidden = false;

    document.getElementById("producto-codigo").value = producto.codigo;
    document.getElementById("producto-nombre").value = producto.nombre;
    document.getElementById("producto-descripcion").value = producto.descripcion;
    document.getElementById("producto-precio").value = producto.precio;
    document.getElementById("producto-stock").value = producto.stock;
    document.getElementById("producto-stock-critico").value = producto.stockCritico;
    document.getElementById("producto-categoria").value = producto.categoria;
}

// ------------------------------------------------------------
// Guarda los cambios del producto
// ------------------------------------------------------------
function guardarEdicionProducto(evento) {
    evento.preventDefault();

    if (!revisarFormulario(CAMPOS_PRODUCTO, "mensaje-producto")) return;

    const selector = document.getElementById("elegir-producto");
    const posicion = Number(selector.value);

    let productos = obtenerProductos();
    const producto = productos[posicion];
    if (!producto) return;

    const codigo = document.getElementById("producto-codigo").value.trim().toUpperCase();

    // El codigo no se puede repetir con OTRO producto
    const repetido = productos.find((otro, index) =>
        index !== posicion && otro.codigo.toUpperCase() === codigo
    );

    if (repetido) {
        mostrarMensaje("mensaje-producto", "Ya existe otro producto con ese codigo.", true);
        return;
    }

    let stockCritico = document.getElementById("producto-stock-critico").value;
    if (stockCritico === "") {
        stockCritico = 0;
    }

    producto.codigo = codigo;
    producto.nombre = document.getElementById("producto-nombre").value.trim();
    producto.descripcion = document.getElementById("producto-descripcion").value.trim();
    producto.precio = Number(document.getElementById("producto-precio").value);
    producto.stock = Number(document.getElementById("producto-stock").value);
    producto.stockCritico = Number(stockCritico);
    producto.categoria = document.getElementById("producto-categoria").value;

    guardarProductos(productos);

    // Refrescamos el nombre en el select por si cambio
    selector.options[posicion].text = `${producto.codigo} - ${producto.nombre}`;

    mostrarMensaje("mensaje-producto", `Producto "${producto.nombre}" actualizado correctamente.`, false);
}

// ============================================================
// EDITAR USUARIO
// ============================================================

// ------------------------------------------------------------
// Desde el listado: guarda cual se va a editar y abre la vista
// ------------------------------------------------------------
function editarUsuarioAdmin(index) {
    localStorage.setItem("USUARIO_EDITAR", index);
    window.location.href = "usuario-editar.html";
}

// ------------------------------------------------------------
// Llena el select con todos los usuarios registrados
// ------------------------------------------------------------
function llenarSelectUsuarios() {
    const selector = document.getElementById("elegir-usuario");
    if (!selector) return;

    const usuarios = JSON.parse(localStorage.getItem("USUARIOS_NEXUSTECH")) || [];

    usuarios.forEach((usuario, index) => {
        selector.innerHTML += `<option value="${index}">${usuario.run} - ${usuario.nombre} ${usuario.apellidos}</option>`;
    });

    const guardado = localStorage.getItem("USUARIO_EDITAR");
    if (guardado !== null && usuarios[guardado]) {
        selector.value = guardado;
        localStorage.removeItem("USUARIO_EDITAR");
    }

    cargarUsuarioAEditar();
}

// ------------------------------------------------------------
// Copia los datos del usuario elegido dentro del formulario
// ------------------------------------------------------------
function cargarUsuarioAEditar() {
    const selector = document.getElementById("elegir-usuario");
    const formulario = document.getElementById("form-usuario-editar");
    if (!selector || !formulario) return;

    limpiarAyudas(CAMPOS_USUARIO);
    document.getElementById("mensaje-usuario").innerHTML = "";

    if (selector.value === "") {
        formulario.hidden = true;
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("USUARIOS_NEXUSTECH")) || [];
    const usuario = usuarios[selector.value];
    if (!usuario) return;

    formulario.hidden = false;

    document.getElementById("usuario-run").value = usuario.run;
    document.getElementById("usuario-nombre").value = usuario.nombre;
    document.getElementById("usuario-apellidos").value = usuario.apellidos;
    document.getElementById("usuario-correo").value = usuario.correo;
    document.getElementById("usuario-clave").value = usuario.clave;
    document.getElementById("usuario-fecha").value = usuario.fechaNacimiento;
    document.getElementById("usuario-tipo-usuario").value = usuario.tipo;

    // La comuna depende de la region, por eso se carga despues
    document.getElementById("usuario-region").value = usuario.region;
    cargarComunas("usuario-region", "usuario-comuna");
    document.getElementById("usuario-comuna").value = usuario.comuna;

    document.getElementById("usuario-direccion").value = usuario.direccion;
}

// ------------------------------------------------------------
// Guarda los cambios del usuario
// ------------------------------------------------------------
function guardarEdicionUsuario(evento) {
    evento.preventDefault();

    if (!revisarFormulario(CAMPOS_USUARIO, "mensaje-usuario")) return;

    const selector = document.getElementById("elegir-usuario");
    const posicion = Number(selector.value);

    let usuarios = JSON.parse(localStorage.getItem("USUARIOS_NEXUSTECH")) || [];
    const usuario = usuarios[posicion];
    if (!usuario) return;

    const run = document.getElementById("usuario-run").value.trim().toUpperCase();
    const correo = document.getElementById("usuario-correo").value.trim();

    // El RUN y el correo no se pueden repetir con OTRO usuario
    if (usuarios.find((otro, index) => index !== posicion && otro.run === run)) {
        mostrarMensaje("mensaje-usuario", "Ya existe otro usuario con ese RUN.", true);
        return;
    }

    if (usuarios.find((otro, index) => index !== posicion && otro.correo.toLowerCase() === correo.toLowerCase())) {
        mostrarMensaje("mensaje-usuario", "Ya existe otro usuario con ese correo.", true);
        return;
    }

    const usuarioActivo = JSON.parse(localStorage.getItem("USUARIO_ACTIVO"));
    const esMiCuenta = usuarioActivo && usuarioActivo.run === usuario.run;

    // Si el administrador se quita a si mismo el rol, se queda sin panel
    if (esMiCuenta && document.getElementById("usuario-tipo-usuario").value === "Cliente") {
        if (!confirm("Estas cambiando tu propia cuenta a Cliente y perderas el acceso al panel. Continuar?")) return;
    }

    usuario.run = run;
    usuario.nombre = document.getElementById("usuario-nombre").value.trim();
    usuario.apellidos = document.getElementById("usuario-apellidos").value.trim();
    usuario.correo = correo;
    usuario.clave = document.getElementById("usuario-clave").value;
    usuario.fechaNacimiento = document.getElementById("usuario-fecha").value;
    usuario.tipo = document.getElementById("usuario-tipo-usuario").value;
    usuario.region = document.getElementById("usuario-region").value;
    usuario.comuna = document.getElementById("usuario-comuna").value;
    usuario.direccion = document.getElementById("usuario-direccion").value.trim();

    localStorage.setItem("USUARIOS_NEXUSTECH", JSON.stringify(usuarios));

    // Si edito su propia cuenta, actualizamos la sesion abierta
    if (esMiCuenta) {
        localStorage.setItem("USUARIO_ACTIVO", JSON.stringify(usuario));
    }

    selector.options[posicion].text = `${usuario.run} - ${usuario.nombre} ${usuario.apellidos}`;

    mostrarMensaje("mensaje-usuario", `Usuario "${usuario.nombre}" actualizado correctamente.`, false);
}
