/**
 * Spanish copy for the core public pages (home, historia, eventos, Community Cuts,
 * privacidad, seguridad juvenil, transparencia). Same facts as the English pages.
 * US Spanish, tú form, sentence case.
 */

export const esLocation = "Everett, Washington";
export const esDateLabel = "agosto de 2026";
export const esProjectName = "Community Cuts for Kids";

/** Shown once beside translated founder quotes. */
export const translationNote = "Traducción del testimonio original en inglés.";

export const founderQuotesEs = [
  {
    name: "Otha Minnifield",
    role: "fundador",
    quote:
      "Es poderoso cuando hay alguien que puede sentarse a hablar con un joven, apoyarse en lo que esa persona quiere para su vida y hacerle saber de qué puede ser parte, que es el futuro.",
  },
  {
    name: "Elisha Minnifield",
    role: "fundadora",
    quote:
      "Quiero que cualquier joven que se me acerque, aunque sea un poco, se vaya sintiéndose mejor persona por haber encontrado amor, trato y comunicación conmigo.",
  },
] as const;

export const pathwaysEs = [
  {
    title: "Guía de confianza",
    copy: "Conectar a los jóvenes con adultos que sepan escuchar, animar y ayudarles a ver los próximos pasos concretos.",
    status: "En desarrollo",
  },
  {
    title: "Habilidades para la vida",
    copy: "Crear experiencias útiles donde los jóvenes practiquen la comunicación, la confianza en sí mismos y las habilidades del día a día.",
    status: "En desarrollo",
  },
  {
    title: "Oportunidades en la comunidad",
    copy: "Conectar a los jóvenes y a sus familias con personas, programas y oportunidades de su comunidad.",
    status: "En desarrollo",
  },
] as const;

export const participationRoutesEs = [
  {
    label: "Familias",
    action: "Mantente al tanto",
    detail: "Entérate de los programas y eventos para los jóvenes de tu familia.",
    href: "/es/participar/familia",
  },
  {
    label: "Mentores y voluntarios",
    action: "Súmate",
    detail: "Ofrece tu tiempo, tus habilidades o simplemente tu escucha a jóvenes de tu zona.",
    href: "/es/participar/mentores-voluntariado",
  },
  {
    label: "Aliados comunitarios",
    action: "Hablemos",
    detail: "Aporta un espacio, servicios o apoyo para un evento o programa.",
    href: "/es/participar/aliados",
  },
] as const;

export const homeEs = {
  meta: {
    title: "Empoderar a la juventud. Elevar futuros. Construir comunidad.",
    description:
      "ASC3ND ayuda a los jóvenes a encontrar guía de confianza, practicar habilidades para la vida y conectarse con oportunidades en su comunidad.",
  },
  explainer:
    "ASC3ND ayuda a los jóvenes a encontrar guía de confianza, practicar habilidades para la vida y conectarse con oportunidades en su comunidad.",
  ctaPrimary: "Cómo participar",
  ctaSecondary: "Conoce Community Cuts",
  heroAlt:
    "Familias haciendo fila en la carpa de ASC3ND, bajo una pancarta con el lema de la organización (en inglés)",
  proof: (n: number) =>
    `El primer evento: Community Cuts for Kids, Everett, Washington, agosto de 2026. ${n} fotografías en el registro público.`,
  foundersTitle: "Fundada por Otha y Elisha Minnifield.",
  founderAlt: (name: string, role: string) => `${name}, ${role} de ASC3ND Collective`,
  focusTitle: "Lo que ASC3ND está construyendo.",
  focusIntro: "Tres áreas guían el trabajo. Cada una sigue en desarrollo.",
  focusPhotoAlts: [
    "Otha Minnifield, con una camiseta de ASC3ND, conversando con un joven en Community Cuts for Kids",
    "Un barbero voluntario con camiseta de ASC3ND cortándole el pelo a un niño",
    "Familias y voluntarios en la mesa de ASC3ND, bajo la carpa del evento",
  ],
  essayIntro: "Cortes de pelo y útiles escolares para niños que regresan a clases.",
  essayLink: (n: number) => `Mira las ${n} fotos y el video`,
  essayAlts: [
    "Voluntarios de ASC3ND riéndose mientras organizan mochilas frente a un letrero de regreso a clases",
    "Un barbero dándole forma al pelo de un niño",
    "Dos voluntarios en la mesa de registro de ASC3ND",
    "Una mamá y sus hijos con los artículos que recibieron",
    "Un voluntario entregando mochilas bajo la pancarta de ASC3ND",
    "Cortes de pelo en marcha dentro de la barbería",
  ],
  joinTitle: "Encuentra tu manera de sumarte.",
};

export const storyEs = {
  meta: {
    title: "Nuestra historia",
    description:
      "ASC3ND nació con Community Cuts for Kids en Everett, Washington, en agosto de 2026. Conoce cómo la organización sigue creciendo a partir de esa base.",
  },
  eyebrow: "Por qué existe ASC3ND",
  title: "ASC3ND nació con Community Cuts for Kids.",
  intro:
    "En agosto de 2026, en Everett, Community Cuts puso el trabajo de ASC3ND a la vista de todos. La organización sigue creciendo a partir de esa base: guía de confianza, experiencias útiles y vínculos más fuertes con la comunidad para los jóvenes.",
  nextEyebrow: "Lo que viene",
  nextTitle: "Tres áreas que ASC3ND está desarrollando.",
};

export const eventsEs = {
  meta: {
    title: "Eventos",
    description:
      "Un archivo en crecimiento de los eventos de ASC3ND: registros de proyectos, videos, fotografías aprobadas, créditos y resultados verificados.",
  },
  eyebrow: "Archivo de eventos",
  title: "Un registro para cada evento de ASC3ND.",
  intro:
    "Cada evento conserva aquí su propio video, sus fotografías aprobadas, sus créditos y sus resultados verificados. La página de inicio se centra en ASC3ND como un todo.",
  listLabel: "Archivo de eventos de ASC3ND",
  openLabel: (title: string) => `Abrir el registro del evento ${title}`,
  emptyCover: "Material aprobado del evento",
  film: "Video",
  photos: (n: number) => `${n} fotos aprobadas`,
  outcomes: (n: number) => `${n} resultados verificados`,
  outcomesPending: "Resultados pendientes de verificación",
  openEvent: "Abrir el evento completo",
  nextEyebrow: "Próximo evento",
  nextTitle: "Aquí agregaremos el próximo evento confirmado de ASC3ND.",
};

export const communityCutsEs = {
  meta: {
    title: "Community Cuts for Kids",
    description:
      "Community Cuts for Kids en Everett, Washington, agosto de 2026: el video del evento, 86 fotografías aprobadas y los créditos.",
  },
  eyebrow: "Proyecto comunitario",
  summary:
    "Community Cuts for Kids se realizó en Everett, Washington, en agosto de 2026. Esta página reúne en un solo registro público el video del evento, las fotografías aprobadas y los créditos.",
  film: {
    eyebrow: "El video",
    title: "Community Cuts for Kids, Everett.",
    lead: "Mira el video completo del evento.",
    filmTitle: "Community Cuts for Kids: video completo",
    caption: "Everett, Washington, agosto de 2026",
  },
  photos: {
    eyebrow: "Fotografías",
    title: "Community Cuts en imágenes.",
    count: (n: number) => (n ? `${n} fotografías aprobadas del evento.` : "Las fotografías aprobadas del evento aparecerán aquí."),
    empty: "Community Cuts: fotos y video aprobados",
    alt: (n: number) => `Community Cuts for Kids, foto del evento ${n}`,
    caption: "Community Cuts for Kids, Everett, Washington, agosto de 2026",
  },
  outcomes: {
    eyebrow: "Resultados",
    title: "Lo que ASC3ND puede verificar.",
    pending: "Los totales de resultados se publicarán aquí cuando se verifiquen.",
  },
  thanks: {
    eyebrow: "Con gratitud",
    title: "Gracias a todas las personas que hicieron posible Community Cuts.",
    intro:
      "A los barberos, voluntarios, familias, aliados, fotógrafos, organizadores y a todas las personas que dieron su tiempo, su talento y su apoyo: gracias por estar presentes para la comunidad.",
  },
  /** Group labels translated; the "Names to be confirmed" placeholder keeps its meaning. */
  creditGroups: [
    { label: "Aliados del evento", entries: ["Nombres por confirmar"] },
    { label: "Patrocinadores", entries: ["Nombres por confirmar"] },
    { label: "Barberos", entries: ["Nombres por confirmar"] },
    { label: "Voluntarios", entries: ["Nombres por confirmar"] },
    { label: "Fotografía y video", entries: ["Nombres por confirmar"] },
    { label: "Aliados comunitarios", entries: ["Nombres por confirmar"] },
    { label: "Organizadores", entries: ["Nombres por confirmar"] },
    { label: "Agradecimientos especiales", entries: ["Nombres por confirmar"] },
  ],
};

export const privacyEs = {
  meta: {
    title: "Privacidad",
    description: "Cómo maneja ASC3ND la información que se envía a través de su sitio web.",
  },
  eyebrow: "Privacidad",
  title: "Qué información recopila ASC3ND y para qué.",
  intro:
    "ASC3ND solo recopila la información que las personas deciden enviar a través de este sitio web, para poder responder, dar seguimiento y enviar novedades cuando se da permiso.",
  sections: [
    {
      eyebrow: "Qué recopilamos",
      title: "La información que tú decides enviarnos.",
      body: "Según el formulario, puede incluir tu nombre, correo electrónico, teléfono (opcional), organización, lo que quieres lograr al participar, disponibilidad, solicitudes de apoyo para tu familia, respuestas escritas, idioma preferido y tus decisiones de consentimiento.",
    },
    {
      eyebrow: "Para qué la usamos",
      title: "Para responderte y dirigir tu solicitud.",
      body: "Los formularios de participación se usan para enviar el seguimiento al equipo de ASC3ND que corresponda. Solo enviamos novedades por correo electrónico si aceptas recibirlas por separado.",
    },
    {
      eyebrow: "Guardado en este dispositivo",
      title: "Los borradores de los formularios pueden quedarse en tu navegador.",
      body: "Algunos formularios de participación guardan un borrador sin terminar en el almacenamiento local de tu navegador, para que puedas recuperar tus respuestas en el mismo dispositivo. ASC3ND no recibe ese borrador hasta que envías el formulario.",
    },
    {
      eyebrow: "Conservación",
      title: "Todavía no se publica un plazo fijo de conservación.",
      body: "ASC3ND no ha publicado un calendario fijo de conservación de los datos del sitio web. Esta página se actualizará cuando se adopte un plazo formal.",
    },
  ],
  questions: {
    eyebrow: "Preguntas",
    title: "Escribe directamente a ASC3ND.",
    before: "Si tienes preguntas sobre la información que enviaste a través de este sitio, escribe a ",
    after: ".",
  },
};

export const safetyEs = {
  meta: {
    title: "Seguridad juvenil",
    description:
      "Los límites de seguridad del sitio web público de ASC3ND para jóvenes, familias, voluntarios, mentores y aliados.",
  },
  eyebrow: "Seguridad juvenil",
  title: "Límites claros para una organización que trabaja con jóvenes.",
  intro:
    "El sitio web público de ASC3ND está diseñado para conectar a familias, voluntarios, mentores y aliados comunitarios con la organización, sin crear canales privados de mensajes directos entre jóvenes y adultos.",
  sections: [
    {
      eyebrow: "Contacto desde el sitio web",
      title: "Los formularios públicos llegan a las colas de seguimiento de ASC3ND.",
      body: "Los formularios de participación son para familias, mentores y voluntarios, y aliados comunitarios. No son un servicio de emergencia ni un chat privado entre menores y adultos.",
    },
    {
      eyebrow: "Información sensible",
      title: "Comparte solo lo necesario para tu solicitud.",
      body: "No uses los formularios del sitio para enviar información de emergencia, contraseñas, datos de cuentas bancarias, expedientes médicos ni otra información muy sensible, a menos que ASC3ND te haya dado un proceso seguro específico para hacerlo.",
    },
    {
      eyebrow: "Fotos e historias",
      title: "El material público debe aprobarse antes de publicarse.",
      body: "El sistema de medios de los proyectos de ASC3ND está diseñado para publicar material aprobado solo cuando se ha confirmado el consentimiento correspondiente. Si tienes preguntas sobre una imagen o una historia publicada, puedes escribir directamente a ASC3ND.",
    },
    {
      eyebrow: "Protocolos formales",
      title: "Las pautas de este sitio no reemplazan una política de protección de la organización.",
      body: "Esta página describe los límites del sitio web público. ASC3ND debe mantener y aprobar por separado sus procedimientos operativos de protección de jóvenes para programas, voluntarios, mentores, eventos y personal.",
    },
  ],
  contact: {
    eyebrow: "Preguntas o inquietudes",
    title: "Contacta a ASC3ND.",
    before: "Escribe a ",
    after: " si tienes una pregunta sobre la seguridad del sitio, una inquietud sobre las imágenes o si quieres que te den seguimiento.",
  },
};

export const transparencyEs = {
  meta: {
    title: "Confianza y transparencia",
    description:
      "Identidad corporativa en Washington y estado actual de la información fiscal y de registro benéfico que ASC3ND ha confirmado.",
  },
  heroEyebrow: "The ASC3ND Collective, registro público",
  heroIntro:
    "Nuestra identidad legal, nuestros registros públicos y la información que podemos confirmar. Sin afirmar nada más allá de la evidencia.",
  facts: [
    ["Nombre legal", "THE ASC3ND COLLECTIVE"],
    ["UBI de Washington", "606 247 629"],
    ["Tipo de entidad", "Corporación sin fines de lucro de Washington"],
    ["Estado de la entidad", "Activa, según el registro de Washington proporcionado"],
    ["Fecha de constitución", "18 de junio de 2026"],
    ["Jurisdicción", "Washington, Estados Unidos"],
    ["Naturaleza de la actividad", "Benéfica"],
    ["Domicilio principal", "Everett, Washington"],
    ["Agente registrado", "Otha Minnifield Jr."],
  ] as const,
  org: {
    eyebrow: "Organización",
    source: "Fuente: registro del Washington Corporations and Charities Filing System proporcionado por la organización. ",
    link: "Busca en los registros públicos de Washington",
  },
  tax: {
    eyebrow: "Impuestos y registro",
    statuses: [
      ["EIN federal", "Aún no confirmado para su publicación."],
      [
        "Exención fiscal federal",
        "Aún no confirmada para su publicación. La constitución en Washington no establece el reconocimiento federal como organización 501(c)(3).",
      ],
      [
        "Registro benéfico de Washington",
        "Aún no confirmado para su publicación. El registro para solicitar donaciones benéficas es independiente del registro corporativo.",
      ],
    ] as const,
    source:
      "Estas entradas describen la información disponible para este sitio web. No afirman que se haya presentado o no una solicitud. ",
    link: "Búsqueda de organizaciones exentas de impuestos del IRS",
  },
  giving: {
    eyebrow: "Donaciones",
    p1: "Antes de hacer una donación, confirma directamente con la organización quién es el destinatario legal y si la donación es deducible de impuestos. Publicaremos aquí la información fiscal federal y de registro benéfico de Washington cuando esté verificada.",
    p2: "El estatus de corporación sin fines de lucro, por sí solo, no significa que una donación sea deducible de impuestos.",
    cta: "Conoce las maneras de participar",
  },
};

/** Strings for shared components when locale="es". */
export const signupEs = {
  title: "Entérate de lo que sigue en ASC3ND.",
  intro:
    "Te escribiremos de vez en cuando, cuando se confirme un programa, un evento o una necesidad de voluntarios. Puedes cancelar la suscripción cuando quieras.",
  name: "Nombre",
  email: "Correo electrónico",
  consent:
    "Acepto recibir novedades de ASC3ND por correo electrónico. Puedo cancelar la suscripción en cualquier momento.",
  honeypot: "Sitio web",
  submit: "Recibir novedades",
  submitting: "Enviando…",
  failed: "No pudimos guardar tu registro. Inténtalo de nuevo.",
  saved: "Ya estás registrado para recibir novedades de ASC3ND.",
  offline: "No pudimos conectarnos con ASC3ND en este momento. Revisa tu conexión e inténtalo de nuevo.",
};

export const creditsEs = {
  open: "Ver los créditos del evento",
  eyebrow: "Créditos del evento",
  title: "Las personas detrás de este día.",
  close: "Cerrar",
  closeLabel: "Cerrar los créditos del evento",
};

export const galleryEs = {
  open: (alt: string) => `Abrir: ${alt}`,
  viewAll: (n: number) => `Ver las ${n} fotos`,
  close: "Cerrar la galería",
  prev: "Imagen anterior",
  next: "Imagen siguiente",
};
