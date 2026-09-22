/* ==================================================================
                  Render de la sección "Proyectos".
Lee el array `projects` (definido en js/projects.js, cargado antes) 
y construye las cards dentro de .projects-grid. 
================================================================== */

// ==================================================================
// Utilidades
// ==================================================================

// Crea un <svg><use href="#..."></use></svg> que referencia un sprite
// <symbol> definido en index.html.
function createIcon(symbolId) {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", symbolId);
  icon.appendChild(use);
  return icon;
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".projects-grid");

  // Sin grilla en el documento: no hay nada que renderizar.
  if (!grid) return;

  for (const project of projects) {
    // Card incompleta (sin imagen o sin repo): se omite para evitar
    // un <img> roto o un enlace vacío.
    if (!project.image || !project.repo) continue;

    const card = document.createElement("article");
    card.className = "project-card";

    // Imagen
    const img = document.createElement("img");
    img.className = "project-image";
    img.src = project.image;
    img.alt = project.title;

    // Título
    const title = document.createElement("h3");
    title.className = "project-title";
    title.textContent = project.title;

    // Descripción
    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = project.description;

    // Botones: Repo siempre; Demo sólo si el proyecto la declara
    // (nada de href vacío ni botón fantasma).
    const buttons = document.createElement("div");
    buttons.className = "project-buttons";

    const btnRepo = document.createElement("a");
    btnRepo.className = "project-btn";
    btnRepo.href = project.repo;
    btnRepo.target = "_blank";
    btnRepo.rel = "noopener noreferrer";
    btnRepo.textContent = "Repo";
    btnRepo.prepend(createIcon("#icon-github"));
    buttons.appendChild(btnRepo);

    if (project.demo) {
      const btnDemo = document.createElement("a");
      btnDemo.className = "project-btn";
      btnDemo.href = project.demo;
      btnDemo.target = "_blank";
      btnDemo.rel = "noopener noreferrer";
      btnDemo.textContent = "Demo";
      btnDemo.prepend(createIcon("#icon-link"));
      buttons.appendChild(btnDemo);
    }

    card.classList.add("reveal"); // entra con el scroll-reveal
    card.append(img, title, description, buttons);
    grid.appendChild(card);
    registerReveal(card);
  }

  // Observa también los .reveal estáticos (títulos, skills, stack…).
  initReveal();
});

/* ==================================================================
              Selector de tema (claro / oscuro / visual).
Botón fijo en la esquina superior derecha (index.html) con menú
desplegable. Persistencia en localStorage["theme"]:
  - "light" / "dark" / "visual" → elección explícita del usuario
    (sobreescribe la preferencia del sistema). "visual" es un TERCER
    tema real: fondo beige #e9d5a8 con paleta Gruvbox retro.
  - Sin preferencia guardada → seguir la preferencia del sistema
    operativo. No existe un valor "seguir sistema" en el menú: el
    seguimiento solo aplica cuando no hay elección guardada.
El script inline en el <head> ya aplica data-theme en el primer paint
para evitar el flash; aquí solo se sincroniza el estado del menú y la
interacción.
================================================================== */

const THEME_KEY = "theme";

// Mapeo tema → color del chrome del navegador (mismo que en el head).
const THEME_COLORS = {
  light: "#fdfefe",
  dark: "#06080f",
  visual: "#e9d5a8",
};

function applyThemeColor(theme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && THEME_COLORS[theme]) meta.setAttribute("content", THEME_COLORS[theme]);
}

function readStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (_) {
    return null;
  }
}

function resolveTheme(choice) {
  if (choice === "dark" || choice === "light" || choice === "visual") {
    return choice;
  }
  // Sin preferencia guardada → seguir al sistema operativo.
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function syncMenuState(choice) {
  const mode = resolveTheme(choice);
  const items = document.querySelectorAll(".theme-menu__item");
  items.forEach((item) => {
    if (item.disabled) return;
    // Sin elección explícita: el menú refleja el tema realmente aplicado.
    const expected = choice === null ? mode : choice;
    item.setAttribute("aria-checked", String(item.dataset.themeChoice === expected));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  const btn = toggle.querySelector(".theme-toggle__btn");
  const menu = document.getElementById("theme-menu");

  function closeMenu(returnFocus = false) {
    toggle.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    if (returnFocus) btn.focus();
  }

  function selectTheme(choice) {
    try {
      localStorage.setItem(THEME_KEY, choice);
    } catch (_) {}
    document.documentElement.setAttribute("data-theme", resolveTheme(choice));
    applyThemeColor(resolveTheme(choice));
    syncMenuState(choice);
    closeMenu();
  }

  btn.addEventListener("click", () => {
    const open = toggle.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
  });

  // Cerrar al hacer click fuera del widget.
  document.addEventListener("click", (event) => {
    if (!toggle.contains(event.target)) closeMenu();
  });

  // Cerrar con Escape y devolver el foco al botón.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.classList.contains("is-open")) {
      closeMenu(true);
    }
  });

  menu.addEventListener("click", (event) => {
    const item = event.target.closest(".theme-menu__item");
    if (!item || item.disabled) return;
    selectTheme(item.dataset.themeChoice);
  });

  // Estado inicial: la elección guardada (o el sistema).
  syncMenuState(readStoredTheme());
  // theme-color acorde al tema realmente aplicado.
  applyThemeColor(resolveTheme(readStoredTheme()));
});

/* ==================================================================
              Scrollspy: resalta en la nav la sección visible.
IntersectionObserver sobre las secciones referenciadas por .nav-item
(#inicio, #proyectos, #skills, #stack, #sobremi). La banda central
definida por rootMargin decide cuál gana: exactamente una activa.
================================================================== */
function initScrollspy() {
  if (!("IntersectionObserver" in window)) return;

  const navItems = Array.from(document.querySelectorAll(".nav-item"));
  if (!navItems.length) return;

  // Mapa sección → item de la nav (los href="#..." apuntan a ids reales).
  const sections = [];
  const itemBySection = new Map();
  for (const item of navItems) {
    const href = item.getAttribute("href");
    if (!href || !href.startsWith("#")) continue;
    const section = document.getElementById(href.slice(1));
    if (!section) continue;
    sections.push(section);
    itemBySection.set(section, item);
  }
  if (!sections.length) return;

  function setActive(section) {
    navItems.forEach((item) => {
      const isActive = itemBySection.get(section) === item;
      item.classList.toggle("is-active", isActive);
      if (isActive) item.setAttribute("aria-current", "true");
      else item.removeAttribute("aria-current");
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        setActive(entry.target);
        break;
      }
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));

  // Estado inicial al cargar: la sección que ocupa la banda central.
  const band = window.innerHeight * 0.425;
  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= band && rect.bottom > band) {
      setActive(section);
      break;
    }
  }
}

/* ==================================================================
          Scroll-reveal: fade+slide de entrada con un observer único.
Solo pinta con html.js (guard anti-FOUC del script inline del head);
con prefers-reduced-motion el CSS los deja visibles al instante.
El observador se reutiliza para las cards que renderiza el módulo
de proyectos vía registerReveal().
================================================================== */
let revealObserver = null;

function initReveal() {
  if (revealObserver || !("IntersectionObserver" in window)) return;
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
}

// Registra un elemento revelable creado dinámicamente (project-card).
function registerReveal(el) {
  if (!revealObserver) initReveal();
  if (revealObserver) revealObserver.observe(el);
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollspy();
  initReveal();
});
