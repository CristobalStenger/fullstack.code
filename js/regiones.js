// ============================================================
// NexusTech - Regiones y comunas para el formulario de registro
// ============================================================

const regionesChile = [
    {
        nombre: "Región de Antofagasta",
        comunas: ["Antofagasta", "Calama", "Mejillones", "Taltal", "Tocopilla"]
    },
    {
        nombre: "Región de Coquimbo",
        comunas: ["La Serena", "Coquimbo", "Ovalle", "Illapel", "Vicuña"]
    },
    {
        nombre: "Región de Valparaíso",
        comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio", "Quillota"]
    },
    {
        nombre: "Región Metropolitana",
        comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto", "La Florida", "Ñuñoa", "San Bernardo"]
    },
    {
        nombre: "Región del Libertador O'Higgins",
        comunas: ["Rancagua", "San Fernando", "Machalí", "Santa Cruz", "Rengo"]
    },
    {
        nombre: "Región del Maule",
        comunas: ["Talca", "Curicó", "Linares", "Constitución", "Cauquenes"]
    },
    {
        nombre: "Región del Biobío",
        comunas: ["Concepción", "Talcahuano", "Los Ángeles", "Chiguayante", "San Pedro de la Paz"]
    },
    {
        nombre: "Región de La Araucanía",
        comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Angol", "Pucón"]
    },
    {
        nombre: "Región de Los Lagos",
        comunas: ["Puerto Montt", "Osorno", "Castro", "Ancud", "Puerto Varas"]
    },
    {
        nombre: "Región de Magallanes",
        comunas: ["Punta Arenas", "Puerto Natales", "Porvenir", "Cabo de Hornos"]
    }
];

// ------------------------------------------------------------
// Llena un select de regiones (se le pasa el id del select)
// ------------------------------------------------------------
function cargarRegiones(idRegion) {
    const selectorRegion = document.getElementById(idRegion);
    if (!selectorRegion) return;

    regionesChile.forEach(region => {
        selectorRegion.innerHTML += `<option value="${region.nombre}">${region.nombre}</option>`;
    });
}

// ------------------------------------------------------------
// Llena el select de comunas segun la region elegida
// ------------------------------------------------------------
function cargarComunas(idRegion, idComuna) {
    const selectorRegion = document.getElementById(idRegion);
    const selectorComuna = document.getElementById(idComuna);

    if (!selectorRegion || !selectorComuna) return;

    selectorComuna.innerHTML = `<option value="">Selecciona tu comuna</option>`;

    const regionElegida = regionesChile.find(region => region.nombre === selectorRegion.value);

    if (!regionElegida) return;

    regionElegida.comunas.forEach(comuna => {
        selectorComuna.innerHTML += `<option value="${comuna}">${comuna}</option>`;
    });
}

// Al cargar la pagina llenamos los selects de region que existan
document.addEventListener("DOMContentLoaded", () => {
    cargarRegiones("registro-region");
    cargarRegiones("usuario-region");
});
