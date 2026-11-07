/* ==================================================================
// Datos de los proyectos — SOLO datos, sin lógica de render.
// El render lo hace js/main.js leyendo este array en DOMContentLoaded.
//
// Cómo agregar un proyecto: añade un objeto más al array con:
//   title       → título de la card
//   description → texto breve del proyecto
//   image       → ruta de la imagen (placeholder por ahora)
//   repo        → enlace al repositorio (OBLIGATORIO)
//   demo        → enlace a la demo en vivo (OPCIONAL: omítela si no aplica)
//
// Si falta `image` o `repo`, la card NO se renderiza (ver main.js).
================================================================== */
const projects = [
  {
    title: "NominaSystem",
    description:
      "Sistema web completo para la gestión de empleados de una empresa con arquitectura SPA (Single Page Application), desarrollada con Node.js, Express y JavaScript vanilla.",
    image: "./files/proyect-images/nominasystem.webp",
    repo: "https://github.com/SbiDev-447/NominaSystem",
    // demo: sin demo todavía — se omite la propiedad para que no se renderice el botón
  },
  {
    title: "FulgenciaRegister-SPA",
    description:
      "SPA de registro e inscripción estudiantil para el Liceo Fulgencia Jiménez de Olmos. Interfaz en JavaScript vanilla sin recarga de página, API REST en Express y base de datos MariaDB en Docker.",
    image: "./files/proyect-images/fulgencia.webp",
    repo: "https://github.com/SbiDev-447/FulgenciaRegister-SPA",
  },
  {
    title: "SbiRadio",
    description:
      "Landing de la Radio: SbiRadio. Emisora comunitaria y un reproductor web minimalista.",
    image: "./files/proyect-images/SbiRadio.webp",
    repo: "https://github.com/SbiDev-447/SbiRadio",
    demo: "https://sbidev-447.github.io/SbiRadio/",
  },
  {
    title: "Dotfiles-SbiDev",
    description:
      "Colección de dotfiles, configuraciones y scripts para el compositor Niri en Debian 13 Trixie: personalización de entorno, gestión de energía, lanzadores rápidos con Fuzzel, Neovim con LazyVim (basado en GentlemanDots) y utilidades CLI propias.",
    image: "./files/proyect-images/dotfiles.webp",
    repo: "https://github.com/SbiDev-447/Dotfiles-SbiDev",
  },
  {
    title: "TurtleGlassesVSCode",
    description:
      "Tema de color para Visual Studio Code y VSCodium, pensado para la comodidad visual. Inspirado en la calma de las tortugas y la claridad de unas buenas gafas.",
    image: "./files/proyect-images/turtleglassesvscode.webp",
    repo: "https://github.com/SbiDev-447/TurtleGlassesVSCode",
    // demo: sin demo por ahora (pendiente de publicar en el marketplace de Microsoft)
  },
  {
    title: "TurtleGlasses-GTK",
    description:
      "Tema GTK basado en TurtleGlassesVSCode Light y Dark que proporciona una interfaz calida y agradable a la vista o bien vibrante y unica.",
    image: "./files/proyect-images/turtleglassesgtk.webp",
    repo: "https://github.com/SbiDev-447/TurtleGlasses-GTK",
  },
];
