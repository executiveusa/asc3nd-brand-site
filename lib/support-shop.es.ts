import type { ShopCopy, SupportCopy } from "@/lib/support-shop.en";

export const supportEs: SupportCopy = {
  eyebrow: "Apoyo",
  title: "Ayuda a que ASC3ND crezca.",
  intro: "Puedes donar, dar tu tiempo, hacer alianza con nosotros o compartir lo que tienes. Elige lo que mejor te quede.",
  rows: {
    donate: {
      label: "Donar",
      detail: "Dona en línea a través de Zeffy. Saldrás de este sitio para completar tu donación.",
      action: "Donar",
    },
    volunteer: {
      label: "Ser voluntario",
      detail: "Cuéntanos cómo te gustaría ayudar. Una persona te responde directamente.",
      action: "Ser voluntario",
      href: "/es/participar/mentores-voluntariado",
    },
    partner: {
      label: "Hacer alianza",
      detail: "Organizaciones, negocios y vecinos que quieran trabajar con ASC3ND.",
      action: "Ser aliado",
      href: "/es/participar/aliados",
    },
    supplies: {
      label: "Dar materiales",
      detail: "¿Tienes materiales que quieras dar? Escríbenos antes de reunir nada, para decirte si responden a una necesidad actual.",
      action: "main@asc3nd.org",
    },
  },
  trust: {
    eyebrow: "Antes de dar",
    title: "Confirma a quién le estás dando.",
    body: "Antes de hacer una donación, confirma directamente con la organización quién es el destinatario legal y cualquier información sobre la deducibilidad de impuestos.",
    link: "Lee confianza y transparencia",
    href: "/es/transparencia",
  },
};

export const shopEs: ShopCopy = {
  eyebrow: "Tienda",
  title: "Lleva la misión.",
  intro: "Una vista previa de cómo podría verse una tienda de ASC3ND.",
  gridLabel: "Conceptos de mercancía de ASC3ND",
  demo: {
    chip: "Vista previa del concepto",
    note: "Son conceptos de diseño. Los artículos, los diseños y los precios no son definitivos, y todavía no hay nada a la venta.",
    state: "Solo vista previa",
  },
  signup: {
    title: "Entérate primero.",
    body: "Un correo cuando abra la tienda, y de vez en cuando noticias cuando se confirme un programa o un evento. Puedes darte de baja cuando quieras.",
    name: "Nombre",
    email: "Correo electrónico",
    consent: "Acepto recibir noticias de ASC3ND por correo. Puedo darme de baja cuando quiera.",
    submit: "Recibir noticias",
    submitting: "Enviando…",
    success: "Ya estás en la lista de ASC3ND.",
    failed: "No pudimos guardar tu registro. Inténtalo de nuevo.",
    unreachable: "No pudimos conectarnos con ASC3ND en este momento. Revisa tu conexión e inténtalo de nuevo.",
  },
};
