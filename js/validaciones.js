// ============================================================
// NexusTech - Validaciones de formularios
// Reglas de negocio pedidas por el cliente:
//   - Correos: solo @duoc.cl, @profesor.duoc.cl y @gmail.com
//   - Contraseña: entre 4 y 10 caracteres
//   - RUN: sin puntos ni guion, entre 7 y 9 caracteres
// ============================================================

const CORREOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

// ------------------------------------------------------------
// Revisa que el correo termine en un dominio permitido
// ------------------------------------------------------------
function correoEsValido(correo) {
    let valido = false;

    CORREOS_PERMITIDOS.forEach(dominio => {
        if (correo.toLowerCase().endsWith(dominio)) {
            valido = true;
        }
    });

    return valido;
}

// ------------------------------------------------------------
// Valida un RUN chileno con el digito verificador (modulo 11)
// Se escribe sin puntos ni guion. Ejemplo: 21456789K
// ------------------------------------------------------------
function runEsValido(run) {
    const runLimpio = run.toUpperCase().trim();

    if (runLimpio.length < 7 || runLimpio.length > 9) return false;

    const cuerpo = runLimpio.slice(0, -1);
    const digito = runLimpio.slice(-1);

    // El cuerpo tiene que ser solo numeros
    if (cuerpo === "" || isNaN(Number(cuerpo))) return false;

    let suma = 0;
    let multiplo = 2;

    // Se recorre el cuerpo de derecha a izquierda multiplicando por 2,3,4,5,6,7
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma = suma + Number(cuerpo.charAt(i)) * multiplo;
        multiplo = multiplo + 1;
        if (multiplo > 7) {
            multiplo = 2;
        }
    }

    const resto = 11 - (suma % 11);
    let digitoEsperado = String(resto);

    if (resto === 11) digitoEsperado = "0";
    if (resto === 10) digitoEsperado = "K";

    return digito === digitoEsperado;
}

// ------------------------------------------------------------
// Revisa UN campo y muestra la ayuda debajo (validacion en vivo)
// Devuelve true si el campo esta correcto
// ------------------------------------------------------------
function revisarCampo(idCampo) {
    const campo = document.getElementById(idCampo);
    if (!campo) return true;

    const ayuda = document.getElementById("ayuda-" + idCampo);
    const valor = campo.value.trim();

    let mensaje = "";
    let correcto = true;

    // ---------- CORREOS (login, registro, contacto y admin) ----------
    if (idCampo.includes("correo")) {
        const esOpcional = (idCampo === "contacto-correo");

        if (valor === "" && !esOpcional) {
            mensaje = "El correo es obligatorio.";
            correcto = false;
        } else if (valor.length > 100) {
            mensaje = "El correo no puede superar los 100 caracteres.";
            correcto = false;
        } else if (valor !== "" && !correoEsValido(valor)) {
            mensaje = "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com";
            correcto = false;
        } else if (valor !== "") {
            mensaje = "Correo valido.";
        }
    }

    // ---------- CONTRASEÑAS ----------
    else if (idCampo.includes("clave2")) {
        const primera = document.getElementById(idCampo.replace("clave2", "clave"));
        if (valor === "") {
            mensaje = "Repite la contraseña.";
            correcto = false;
        } else if (primera && valor !== primera.value) {
            mensaje = "Las contraseñas no coinciden.";
            correcto = false;
        } else {
            mensaje = "Las contraseñas coinciden.";
        }
    } else if (idCampo.includes("clave")) {
        if (valor === "") {
            mensaje = "La contraseña es obligatoria.";
            correcto = false;
        } else if (valor.length < 4 || valor.length > 10) {
            mensaje = "La contraseña debe tener entre 4 y 10 caracteres.";
            correcto = false;
        } else {
            mensaje = "Contraseña valida.";
        }
    }

    // ---------- RUN ----------
    else if (idCampo.includes("run")) {
        if (valor === "") {
            mensaje = "El RUN es obligatorio.";
            correcto = false;
        } else if (valor.includes(".") || valor.includes("-")) {
            mensaje = "Escribe el RUN sin puntos ni guion. Ejemplo: 21456789K";
            correcto = false;
        } else if (valor.length < 7 || valor.length > 9) {
            mensaje = "El RUN debe tener entre 7 y 9 caracteres.";
            correcto = false;
        } else if (!runEsValido(valor)) {
            mensaje = "El RUN no es valido, revisa el digito verificador.";
            correcto = false;
        } else {
            mensaje = "RUN valido.";
        }
    }

    // ---------- NOMBRE ----------
    else if (idCampo.includes("nombre")) {
        // En contacto y en productos el maximo es 100, en usuarios es 50
        let maximo = 50;
        if (idCampo === "contacto-nombre" || idCampo === "producto-nombre") {
            maximo = 100;
        }

        if (valor === "") {
            mensaje = "El nombre es obligatorio.";
            correcto = false;
        } else if (valor.length > maximo) {
            mensaje = `El nombre no puede superar los ${maximo} caracteres.`;
            correcto = false;
        }
    }

    // ---------- APELLIDOS ----------
    else if (idCampo.includes("apellidos")) {
        if (valor === "") {
            mensaje = "Los apellidos son obligatorios.";
            correcto = false;
        } else if (valor.length > 100) {
            mensaje = "Los apellidos no pueden superar los 100 caracteres.";
            correcto = false;
        }
    }

    // ---------- DIRECCION ----------
    else if (idCampo.includes("direccion")) {
        if (valor === "") {
            mensaje = "La direccion es obligatoria.";
            correcto = false;
        } else if (valor.length > 300) {
            mensaje = "La direccion no puede superar los 300 caracteres.";
            correcto = false;
        }
    }

    // ---------- REGION Y COMUNA ----------
    else if (idCampo.includes("region")) {
        if (valor === "") {
            mensaje = "Selecciona tu region.";
            correcto = false;
        }
    } else if (idCampo.includes("comuna")) {
        if (valor === "") {
            mensaje = "Selecciona tu comuna.";
            correcto = false;
        }
    }

    // ---------- TIPO DE USUARIO (solo administrador) ----------
    else if (idCampo.includes("tipo-usuario")) {
        if (valor === "") {
            mensaje = "Selecciona el tipo de usuario.";
            correcto = false;
        }
    }

    // ---------- COMENTARIO DE CONTACTO ----------
    else if (idCampo.includes("comentario")) {
        if (valor === "") {
            mensaje = "El comentario es obligatorio.";
            correcto = false;
        } else if (valor.length > 500) {
            mensaje = "El comentario no puede superar los 500 caracteres.";
            correcto = false;
        } else {
            mensaje = `Te quedan ${500 - valor.length} caracteres.`;
        }
    }

    // ---------- CODIGO DEL PRODUCTO ----------
    else if (idCampo.includes("codigo")) {
        if (valor === "") {
            mensaje = "El codigo es obligatorio.";
            correcto = false;
        } else if (valor.length < 3) {
            mensaje = "El codigo debe tener al menos 3 caracteres.";
            correcto = false;
        }
    }

    // ---------- DESCRIPCION DEL PRODUCTO (opcional) ----------
    else if (idCampo.includes("descripcion")) {
        if (valor.length > 500) {
            mensaje = "La descripcion no puede superar los 500 caracteres.";
            correcto = false;
        } else if (valor !== "") {
            mensaje = `Te quedan ${500 - valor.length} caracteres.`;
        }
    }

    // ---------- PRECIO ----------
    else if (idCampo.includes("precio")) {
        if (valor === "") {
            mensaje = "El precio es obligatorio.";
            correcto = false;
        } else if (isNaN(Number(valor))) {
            mensaje = "El precio debe ser un numero.";
            correcto = false;
        } else if (Number(valor) < 0) {
            mensaje = "El precio no puede ser negativo.";
            correcto = false;
        } else if (Number(valor) === 0) {
            mensaje = "Precio 0: el producto se marcara como FREE.";
        }
    }

    // ---------- STOCK CRITICO (opcional, entero) ----------
    else if (idCampo.includes("stock-critico")) {
        if (valor !== "") {
            if (isNaN(Number(valor))) {
                mensaje = "El stock critico debe ser un numero.";
                correcto = false;
            } else if (Number(valor) < 0) {
                mensaje = "El stock critico no puede ser negativo.";
                correcto = false;
            } else if (!Number.isInteger(Number(valor))) {
                mensaje = "El stock critico debe ser un numero entero.";
                correcto = false;
            }
        }
    }

    // ---------- STOCK (obligatorio, entero) ----------
    else if (idCampo.includes("stock")) {
        if (valor === "") {
            mensaje = "El stock es obligatorio.";
            correcto = false;
        } else if (isNaN(Number(valor))) {
            mensaje = "El stock debe ser un numero.";
            correcto = false;
        } else if (Number(valor) < 0) {
            mensaje = "El stock no puede ser negativo.";
            correcto = false;
        } else if (!Number.isInteger(Number(valor))) {
            mensaje = "El stock debe ser un numero entero.";
            correcto = false;
        }
    }

    // ---------- CATEGORIA DEL PRODUCTO ----------
    else if (idCampo.includes("categoria")) {
        if (valor === "") {
            mensaje = "Selecciona una categoria.";
            correcto = false;
        }
    }

    // Pintamos el borde y escribimos la ayuda
    if (correcto) {
        campo.classList.remove("is-invalid");
        if (valor !== "") campo.classList.add("is-valid");
    } else {
        campo.classList.remove("is-valid");
        campo.classList.add("is-invalid");
    }

    if (ayuda) {
        ayuda.innerText = mensaje;
        if (correcto) {
            ayuda.classList.add("ayuda-ok");
        } else {
            ayuda.classList.remove("ayuda-ok");
        }
    }

    return correcto;
}

// ------------------------------------------------------------
// Revisa una lista de campos y avisa si alguno esta malo
// ------------------------------------------------------------
function revisarFormulario(listaCampos, idMensaje) {
    let todoCorrecto = true;

    listaCampos.forEach(idCampo => {
        if (!revisarCampo(idCampo)) {
            todoCorrecto = false;
        }
    });

    if (!todoCorrecto) {
        mostrarMensaje(idMensaje, "Revisa los campos marcados en rojo antes de continuar.", true);
    }

    return todoCorrecto;
}

// ------------------------------------------------------------
// Muestra un mensaje de error o de exito dentro de una caja
// ------------------------------------------------------------
function mostrarMensaje(idCaja, texto, esError) {
    const caja = document.getElementById(idCaja);
    if (!caja) return;

    let color = "alert-success";
    if (esError) {
        color = "alert-danger";
    }

    caja.innerHTML = `<div class="alert ${color} mb-0">${texto}</div>`;
}

// ------------------------------------------------------------
// Limpia los bordes verdes/rojos y las ayudas de un formulario
// ------------------------------------------------------------
function limpiarAyudas(listaCampos) {
    listaCampos.forEach(idCampo => {
        const campo = document.getElementById(idCampo);
        const ayuda = document.getElementById("ayuda-" + idCampo);
        if (campo) {
            campo.classList.remove("is-valid");
            campo.classList.remove("is-invalid");
        }
        if (ayuda) {
            ayuda.innerText = "";
        }
    });
}

// ============================================================
// INICIO DE SESION
// ============================================================
const CAMPOS_LOGIN = ["login-correo", "login-clave"];

function validarLogin(evento) {
    evento.preventDefault();

    if (!revisarFormulario(CAMPOS_LOGIN, "mensaje-login")) return;

    const correo = document.getElementById("login-correo").value.trim();
    const clave = document.getElementById("login-clave").value;

    const usuarios = JSON.parse(localStorage.getItem("USUARIOS_NEXUSTECH")) || [];
    const usuarioEncontrado = usuarios.find(usuario =>
        usuario.correo.toLowerCase() === correo.toLowerCase() && usuario.clave === clave
    );

    if (!usuarioEncontrado) {
        mostrarMensaje("mensaje-login", "Correo o contraseña incorrectos. Revisa tus datos.", true);
        return;
    }

    localStorage.setItem("USUARIO_ACTIVO", JSON.stringify(usuarioEncontrado));

    mostrarMensaje("mensaje-login",
        `Hola de nuevo, ${usuarioEncontrado.nombre}. Entrando como ${usuarioEncontrado.tipo}...`, false);

    document.getElementById("form-login").reset();
    limpiarAyudas(CAMPOS_LOGIN);

    // El administrador y el vendedor entran al panel de gestion
    let destino = "index.html";
    if (usuarioEncontrado.tipo === "Administrador" || usuarioEncontrado.tipo === "Vendedor") {
        destino = "admin/index.html";
    }

    setTimeout(() => {
        window.location.href = destino;
    }, 1500);
}

// ============================================================
// REGISTRO DE USUARIO (mismos datos que "crear usuario" del admin)
// ============================================================
const CAMPOS_REGISTRO = [
    "registro-run", "registro-nombre", "registro-apellidos", "registro-correo",
    "registro-clave", "registro-clave2", "registro-region", "registro-comuna",
    "registro-direccion"
];

function validarRegistro(evento) {
    evento.preventDefault();

    if (!revisarFormulario(CAMPOS_REGISTRO, "mensaje-registro")) return;

    if (!document.getElementById("registro-terminos").checked) {
        mostrarMensaje("mensaje-registro", "Debes aceptar los terminos y condiciones.", true);
        return;
    }

    const run = document.getElementById("registro-run").value.trim().toUpperCase();
    const correo = document.getElementById("registro-correo").value.trim();

    let usuarios = JSON.parse(localStorage.getItem("USUARIOS_NEXUSTECH")) || [];

    if (usuarios.find(usuario => usuario.correo.toLowerCase() === correo.toLowerCase())) {
        mostrarMensaje("mensaje-registro", "Ese correo ya tiene una cuenta en NexusTech.", true);
        return;
    }

    if (usuarios.find(usuario => usuario.run === run)) {
        mostrarMensaje("mensaje-registro", "Ese RUN ya esta registrado.", true);
        return;
    }

    usuarios.push({
        run: run,
        nombre: document.getElementById("registro-nombre").value.trim(),
        apellidos: document.getElementById("registro-apellidos").value.trim(),
        correo: correo,
        clave: document.getElementById("registro-clave").value,
        fechaNacimiento: document.getElementById("registro-fecha").value,
        tipo: "Cliente",
        region: document.getElementById("registro-region").value,
        comuna: document.getElementById("registro-comuna").value,
        direccion: document.getElementById("registro-direccion").value.trim()
    });

    localStorage.setItem("USUARIOS_NEXUSTECH", JSON.stringify(usuarios));

    mostrarMensaje("mensaje-registro",
        "Cuenta creada correctamente. Ya puedes iniciar sesion.", false);

    document.getElementById("form-registro").reset();
    limpiarAyudas(CAMPOS_REGISTRO);
    cargarComunas("registro-region", "registro-comuna");
}

// ============================================================
// FORMULARIO DE CONTACTO
// ============================================================
const CAMPOS_CONTACTO = ["contacto-nombre", "contacto-correo", "contacto-comentario"];

function validarContacto(evento) {
    evento.preventDefault();

    if (!revisarFormulario(CAMPOS_CONTACTO, "mensaje-contacto")) return;

    const nombre = document.getElementById("contacto-nombre").value.trim();

    // Guardamos los mensajes para poder revisarlos despues
    let mensajes = JSON.parse(localStorage.getItem("MENSAJES_NEXUSTECH")) || [];
    mensajes.push({
        nombre: nombre,
        correo: document.getElementById("contacto-correo").value.trim(),
        comentario: document.getElementById("contacto-comentario").value.trim()
    });
    localStorage.setItem("MENSAJES_NEXUSTECH", JSON.stringify(mensajes));

    mostrarMensaje("mensaje-contacto",
        `Gracias ${nombre}, recibimos tu mensaje. Te responderemos pronto.`, false);

    document.getElementById("form-contacto").reset();
    limpiarAyudas(CAMPOS_CONTACTO);
}
