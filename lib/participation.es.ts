/**
 * Spanish copy for the participation forms and the community email signup.
 * Option `value`s stay in English on purpose: they are what the intake queue
 * already receives and filters on. Only the visible labels are Spanish.
 */

export const participationEs = {
  kinds: {
    family: {
      eyebrow: "Familias",
      title: "Cuéntanos qué podría ayudar a tu familia a acercarse a ASC3ND.",
      intro: "Tu mensaje llega directamente a la lista de seguimiento de familias, para que la persona indicada te responda.",
    },
    "mentor-volunteer": {
      eyebrow: "Mentores y voluntarios",
      title: "Cuéntanos cómo quieres participar.",
      intro: "Elige si quieres ser mentor o voluntario, y tu mensaje llegará al equipo de ASC3ND que corresponde.",
    },
    partner: {
      eyebrow: "Aliados de la comunidad",
      title: "Cuéntanos qué tipo de alianza te gustaría explorar.",
      intro: "Las alianzas, los patrocinios y las donaciones en especie se atienden por separado, para que la persona indicada del equipo te responda.",
    },
  },
  labels: {
    name: "Nombre",
    email: "Correo electrónico",
    phone: "Teléfono",
    language: "Idioma preferido",
    ageRange: "Edad de tu hijo o hijos",
    supportNeeded: "¿Qué te sería más útil en este momento?",
    supportPlaceholder: "Mentoría, actividades, habilidades para la vida, apoyo escolar, oportunidades, otra cosa...",
    familyGoal: "¿Qué te gustaría que ASC3ND supiera sobre tus metas?",
    iWantTo: "Quiero",
    experience: "Experiencia, habilidades o intereses que puedan servir",
    availability: "Disponibilidad general",
    availabilityPlaceholder: "Fines de semana, por las noches, una vez al mes, días de evento...",
    whyInvolved: "¿Por qué quieres participar?",
    organization: "Organización o empresa",
    involvement: "Tipo de colaboración",
    explore: "¿Qué te gustaría explorar con nosotros?",
    anythingElse: "¿Hay algo más que debamos saber?",
    contactConsent: "Acepto que ASC3ND se comunique conmigo sobre esta solicitud.",
    updatesOptIn: "También quiero recibir por correo las novedades ocasionales de la comunidad de ASC3ND.",
    honeypot: "Sitio web",
  },
  options: {
    languages: [
      { value: "en", label: "English" },
      { value: "es", label: "Español" },
    ],
    chooseOne: "Elige una opción",
    ageRanges: [
      { value: "Preschool", label: "Preescolar" },
      { value: "Elementary school", label: "Escuela primaria" },
      { value: "Middle school", label: "Escuela intermedia (middle school)" },
      { value: "High school", label: "Escuela preparatoria (high school)" },
      { value: "Mixed ages", label: "Varias edades" },
    ],
    roles: [
      { value: "volunteer", label: "Ser voluntario o voluntaria" },
      { value: "mentor", label: "Ser mentor o mentora" },
    ],
    involvement: [
      { value: "partner", label: "Alianza con la comunidad" },
      { value: "sponsor", label: "Patrocinio" },
      { value: "supplies", label: "Donación de bienes o materiales" },
    ],
  },
  submit: "Enviar a ASC3ND",
  submitting: "Enviando…",
  status: {
    draftRestored: (when: string) => `Recuperamos tu borrador del ${when}.`,
    draftSaved: "Guardado en este dispositivo.",
    draftFailed: "No pudimos guardar el borrador en este dispositivo. Deja esta página abierta hasta que lo envíes.",
    success: "Gracias. ASC3ND recibió tu información.",
    error: "No pudimos guardar tu información. Inténtalo de nuevo.",
    tooMany: "Se enviaron muchas solicitudes desde esta conexión. Espera unos minutos e inténtalo de nuevo.",
    stillSaved: "Tus respuestas siguen guardadas en este dispositivo.",
    network: "No pudimos conectarnos con ASC3ND en este momento. Tus respuestas siguen guardadas en este dispositivo. Inténtalo de nuevo cuando vuelva tu conexión.",
  },
  validation: {
    required: "Completa este campo.",
    checkbox: "Marca esta casilla para continuar.",
    email: "Escribe un correo electrónico válido, por ejemplo nombre@ejemplo.com.",
    tooShort: "Escribe al menos 2 caracteres.",
    tooLong: "Este texto es demasiado largo.",
    generic: "Revisa este campo.",
  },
} as const;

export const signupEs = {
  title: "Entérate de lo que sigue en ASC3ND.",
  intro: "Te escribiremos de vez en cuando, cuando se confirme un programa, un evento o una necesidad de voluntarios. Puedes darte de baja cuando quieras.",
  name: "Nombre",
  email: "Correo electrónico",
  consent: "Acepto recibir novedades de ASC3ND por correo. Puedo darme de baja cuando quiera.",
  honeypot: "Sitio web",
  submit: "Quiero recibir novedades",
  submitting: "Enviando…",
  success: "Listo. Te suscribiste a las novedades de ASC3ND.",
  error: "No pudimos guardar tu suscripción. Inténtalo de nuevo.",
  network: "No pudimos conectarnos con ASC3ND en este momento. Revisa tu conexión e inténtalo de nuevo.",
} as const;
