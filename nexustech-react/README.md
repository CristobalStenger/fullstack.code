# NexusTech React (Evaluación 2)

Tienda de tecnología **NexusTech** migrada desde HTML + JavaScript (entrega 1, en la raíz del
repositorio) a **React 19 + Vite 7**. Usa React Router 7 (modo declarativo), React Bootstrap,
Context + `useReducer`, persistencia en `localStorage` y pruebas con Vitest + Testing Library.

## Puesta en marcha

Requiere Node.js 20.19 o superior.

```bash
cd nexustech-react
npm ci            # instala las versiones exactas de package-lock.json
npm run dev       # servidor de desarrollo en http://localhost:5173
```

| Script                  | Qué hace                                                    |
| ----------------------- | ----------------------------------------------------------- |
| `npm run dev`           | Servidor de desarrollo con recarga automática               |
| `npm run build`         | Compilación de producción en `dist/`                        |
| `npm run preview`       | Sirve la compilación de `dist/`                             |
| `npm run lint`          | Revisión de código con ESLint                               |
| `npm test`              | Vitest en modo observación                                  |
| `npm run test:run`      | Ejecuta todas las pruebas una vez                           |
| `npm run test:coverage` | Pruebas + reporte de cobertura (`coverage/index.html`)      |

### Cuentas de prueba

| Rol           | Correo              | Contraseña   | Acceso                                           |
| ------------- | ------------------- | ------------ | ------------------------------------------------ |
| Administrador | `admin@duoc.cl`     | `admin123`   | Tienda + panel completo (crear, editar, eliminar) |
| Vendedor      | `vendedor@duoc.cl`  | `vende123`   | Tienda + panel de solo lectura                    |
| Cliente       | `cliente@gmail.com` | `cliente123` | Solo la tienda (checkout autocompletado)          |

### Pago simulado

En el checkout se acepta cualquier tarjeta de 16 dígitos con vencimiento vigente. El pago es
**rechazado** (vista "pago con error") cuando:

- la tarjeta termina en `0000`, o
- algún producto del carrito ya no tiene stock suficiente.

Un pago rechazado queda registrado como orden `rechazada`, sin descontar stock ni vaciar el
carrito, y permite "Volver a realizar el pago" con los datos precargados.

## Rutas

**Tienda** (`Layout` con cabecera y pie):
`/`, `/productos`, `/productos/:id`, `/categorias`, `/categorias/:slug`, `/ofertas`, `/nosotros`,
`/blogs`, `/blogs/:id`, `/contacto`, `/login`, `/registro`, `/carrito`, `/checkout`,
`/compra/exitosa/:numero`, `/compra/error/:numero` y `*` (página no encontrada).

**Administración** (`/admin`, protegida por `RutaProtegida`; las rutas marcadas con ✱ son solo
para Administrador):
`/admin` (dashboard), `/admin/ordenes`, `/admin/ordenes/:numero` (boleta), `/admin/productos`,
`/admin/productos/nuevo` ✱, `/admin/productos/:id`, `/admin/productos/:id/editar` ✱,
`/admin/productos/criticos`, `/admin/productos/reportes`, `/admin/categorias`,
`/admin/categorias/nueva` ✱, `/admin/categorias/:id/editar` ✱, `/admin/usuarios` ✱,
`/admin/usuarios/nuevo` ✱, `/admin/usuarios/:run` ✱, `/admin/usuarios/:run/editar` ✱,
`/admin/usuarios/:run/compras` ✱, `/admin/reportes` ✱ y `/admin/perfil`.

> `BrowserRouter` usa direcciones sin `#`. Al publicar en un hosting estático, todas las rutas
> deben responder `index.html`; `public/_redirects` trae la regla para Netlify.

## Estructura

```
src/
├── main.jsx                 BrowserRouter + estilos (Bootstrap, Bootstrap Icons, styles.css)
├── App.jsx                  Providers y definición de rutas
├── styles.css               Estilos de la entrega 1 + estilos nuevos
├── data/                    Fuente de datos simulada (productos, categorías, usuarios,
│                            órdenes de ejemplo, blogs, regiones, cupones, configuración)
├── services/
│   ├── storage.js           Lectura/escritura segura de localStorage y nombres de claves
│   ├── crud.js              Funciones CRUD puras: listar, obtener, crear, actualizar, eliminar
│   └── persistencia.js      "Base de datos" en localStorage: carga validada y guardado
├── store/
│   ├── tiendaReducer.js     Carrito, cupones, pago, CRUD de productos y categorías
│   └── authReducer.js       Sesión, registro, CRUD de usuarios y roles
├── context/                 TiendaProvider y AuthProvider (useReducer + useEffect que guarda)
├── hooks/                   useTienda, useAuth, useFormulario, useTitulo
├── utils/                   formatos, validaciones, filtros del catálogo y reportes
├── components/
│   ├── layout/              Header, Footer, Layout, AdminLayout, RutaProtegida...
│   ├── producto/            ProductoCard, ProductoGrid, FiltrosCatalogo, PrecioProducto...
│   ├── compra/              FilaCarrito, TablaItemsCompra, ResumenCompra, ResultadoCompra...
│   ├── formularios/         CampoFormulario, SelectorRegionComuna, UsuarioForm, ProductoForm...
│   ├── admin/               AdminSidebar, TarjetaMetrica, TablaOrdenes, RolBadge...
│   └── comunes/             ConfirmarModal, EstadoVacio, AvisosGlobales, EncabezadoPagina
├── pages/
│   ├── tienda/              Una página por ruta de la tienda
│   └── admin/               Una página por ruta del panel
└── test/                    setup.js y utilidades de prueba
```

### Flujo de datos

1. `src/data` entrega los datos iniciales.
2. `persistencia.js` los carga desde `localStorage` (o usa los iniciales si no hay datos válidos).
3. `TiendaProvider` y `AuthProvider` crean el estado con `useReducer` y lo comparten por Context.
4. Las páginas leen el estado con `useTienda()` / `useAuth()` y envían acciones con `dispatch`.
5. Los reducers aplican las reglas de negocio usando las funciones de `crud.js` y `validaciones.js`.
6. Un `useEffect` guarda en `localStorage` cada cambio, por eso la interfaz se actualiza al instante.

Claves usadas: `PRODUCTOS_NEXUSTECH`, `CATEGORIAS_NEXUSTECH`, `USUARIOS_NEXUSTECH`,
`USUARIO_ACTIVO` (sin contraseña), `CARRITO_NEXUSTECH` (`{ id, cantidad }`), `CUPON_NEXUSTECH`,
`ORDENES_NEXUSTECH` y `MENSAJES_NEXUSTECH`. Para reiniciar la tienda borra esas claves desde
DevTools → Application → Local Storage.

## Reglas de negocio conservadas de la entrega 1

- Correos solo `@duoc.cl`, `@profesor.duoc.cl` y `@gmail.com`; contraseña de 4 a 10 caracteres;
  RUN sin puntos ni guion, de 7 a 9 caracteres, con dígito verificador (módulo 11).
- Precio 0 se muestra como **FREE**; stock crítico por producto; código de producto único.
- Cupones `FELIZ18`, `CUTURRUFO70`, `BOOTSTRAP` y `XAVICRIS`.
- Roles Administrador, Vendedor (solo lectura) y Cliente; nadie puede eliminar su propia cuenta.

## Nota de seguridad

El login, los roles y el pago son simulaciones de frontend con fines académicos: cualquier
persona puede modificar `localStorage`. En un sistema real la autenticación, la autorización y
los pagos se validan en el backend.
