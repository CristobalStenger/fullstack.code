// ============================================================
// NexusTech - Artículos del blog (contenido de la entrega 1)
// ============================================================

export const blogs = [
  {
    id: 1,
    etiqueta: 'Guía',
    titulo: 'Cómo elegir tu primera tarjeta de video',
    resumen:
      'Resolución, cuadros por segundo y presupuesto: las tres cosas que de verdad importan al momento de elegir una GPU sin gastar de más.',
    imagen:
      'https://centrale.cl/wp-content/uploads/pc-repairpc-spare-parts-video-card-motherboard-ram-pc-cooling-system-hard-drive-power-supply-with-wires-scaled.jpg',
    parrafos: [
      'La tarjeta de video es, para la mayoría de los juegos, la pieza que más influye en el rendimiento. Pero eso no significa que siempre convenga comprar la más cara: lo importante es que quede equilibrada con el resto del equipo y con el monitor que vas a usar.',
      'La primera pregunta es la resolución. Para jugar en 1080p una tarjeta de gama media rinde muy bien y te deja presupuesto para más memoria RAM o un mejor almacenamiento. Para 1440p ya conviene subir de gama, y para 4K necesitas una tarjeta de gama alta si quieres mantener buenos cuadros por segundo.',
      'La segunda pregunta es el monitor. De nada sirve una tarjeta capaz de generar 200 cuadros por segundo si tu pantalla solo muestra 60. Si tu monitor es de 60Hz, una tarjeta de gama media es más que suficiente; si es de 144Hz o más, ahí sí vale la pena invertir.',
    ],
    subtitulo: 'Antes de comprar revisa estos puntos',
    puntos: [
      'Que la fuente de poder tenga los watts y los conectores que pide la tarjeta.',
      'Que la tarjeta quepa físicamente dentro de tu gabinete.',
      'Que tu procesador no sea demasiado antiguo, o la frenará igual.',
      'Cuánta memoria de video trae: 8GB es el mínimo cómodo hoy.',
      'Qué tipo de puertos tiene y si calzan con los de tu monitor.',
    ],
    cierre:
      'Si tienes dudas, escríbenos por la página de contacto y te ayudamos a armar una configuración que calce con tu presupuesto.',
  },
  {
    id: 2,
    etiqueta: 'Dato curioso',
    titulo: 'Por qué tu PC necesita más RAM de la que crees',
    resumen:
      'Un navegador con 20 pestañas abiertas puede usar más memoria que un juego completo. Te explicamos por qué pasa y cuánta RAM te conviene.',
    imagen:
      'https://i0.wp.com/tarreo.buscafs.com/2026/02/10-memorias-RAM-Amazon.jpg?fit=1200,675&quality=75&strip=all',
    parrafos: [
      'Mucha gente asume que la memoria RAM solo importa para los juegos. En la práctica, el programa que más memoria consume en un computador normal suele ser el navegador web: cada pestaña abierta es prácticamente un programa independiente corriendo al mismo tiempo.',
      "Cuando la RAM se llena, el sistema empieza a usar el disco como memoria de reserva. El disco es muchísimo más lento que la memoria, y por eso el computador se siente pesado aunque el procesador no esté trabajando al máximo. Ese es el momento en que la gente cree que 'el PC está viejo', cuando en realidad solo le falta memoria.",
      'Otro detalle poco conocido: instalar dos módulos en vez de uno solo activa el modo de doble canal, lo que puede mejorar el rendimiento sin gastar más dinero. Dos módulos de 8GB suelen rendir mejor que uno solo de 16GB.',
    ],
    subtitulo: 'Cuánta memoria conviene según tu uso',
    puntos: [
      '8GB: navegar, ofimática y tareas básicas.',
      '16GB: juegos actuales y multitarea cómoda. Es el punto dulce hoy.',
      '32GB: edición de video, diseño, máquinas virtuales y streaming.',
      '64GB o más: trabajo profesional muy específico.',
      'Siempre en pares, para aprovechar el doble canal.',
    ],
    cierre:
      'Antes de comprar revisa qué tipo de memoria acepta tu placa madre: las DDR4 y las DDR5 no son compatibles entre sí.',
  },
];
