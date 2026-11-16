/* ============ Módulo: Tema ============
   localStorage["theme"]: "light"/"dark"/"visual" (tema real); sin
   preferencia → seguir al sistema. El script inline del head evita el
   flash; aquí solo sincronización e interacción. */

const THEME_KEY = "theme";

// Mapeo tema → color del chrome del navegador (mismo que en el head).
const THEME_COLORS = {
  light: "#fdfefe",
  dark: "#06080f",
  visual: "#e9d5a8",
};

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

function applyThemeColor(theme) {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && THEME_COLORS[theme]) meta.setAttribute("content", THEME_COLORS[theme]);
}

/* ============ Módulo: Scrollspy ============
   Resalta en la nav la sección visible: la banda central del rootMargin
   decide cuál gana (exactamente una activa). */
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

/* ============ Módulo: Reveal ============
   Fade+slide con un observer único para todos los elementos .reveal.
   Solo pinta con html.js (guard anti-FOUC del head); con
   prefers-reduced-motion el CSS los deja visibles al instante. */
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

/* ============ Bootstrap ============
   Una sola inicialización: scrollspy → reveal → tema. Las cards de
   proyectos son HTML estático (indexables sin JS) y entran en el reveal
   junto con el resto de elementos .reveal. */
document.addEventListener("DOMContentLoaded", () => {
  initScrollspy();

  // Observa también los .reveal estáticos (títulos, skills, stack…).
  initReveal();

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