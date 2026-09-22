# Feature: Dark mode (modo oscuro) — `theme-mode`

**Objective:** Añadir modo oscuro con selector manual (Claro / Oscuro) + preferencia del sistema
como valor por defecto, persistido en `localStorage`. Botón flotante en la esquina superior
derecha, separado de la nav, que abre un menú pequeño con Claro, Oscuro y Visual (este último
solo como placeholder deshabilitado; se implementa en otro cambio).

**Problem:** La página tiene fondo claro fijo (`--cream`) y no existe forma de tema oscuro.
Muchos hovers usan `#000`/`#fff` hardcodeados; `.end` es un bloque oscuro fijo.

**Why:** Decisión explícita del usuario. El CSS ya es token-based (`:root`), lo que hace que el
dark mode sea un override de custom properties bajo `[data-theme="dark"]`.

**Scope autorizado (por el usuario):**
- Paleta oscura: fondo `#06080f`, texto `#f3f6f9`, strongs naranja → `#e0c15a`,
  strongs verde → `#b7cc85`.
- En dark, `.end` se invierte: fondo claro (el del tema light), grid y título oscuros.
- Selector: botón fijo `top-right` + dropdown (`role=menu` / `menuitemradio`) con
  Claro, Oscuro y Visual (disabled con etiqueta "(pronto)").
- Persistencia `localStorage["theme"]` = `"light" | "dark" | "visual"`; sin valor guardado
  (o `"visual"`), se resuelve por `prefers-color-scheme` en el primer paint (script inline en
  el `<head>` evita el flash).
- Semántica ARIA (`aria-expanded`, `aria-checked`), cierre con Escape y click fuera.
- Commit work-unit local en rama `feat/theme-mode`. SIN push ni PR.

**Fuera de alcance (explícito):** implementación real del tema "Visual" (futuro),
`meta theme-color`, cambios en README.

**Constraints:**
- Vanilla CSS/JS, sin build ni framework.
- Mantener la estética existente (glass pill de la nav, fuentes, emojis de sección).
- En `≤768px` y `≤480px`, la nav centrada no debe chocar con el botón fijo: ajustar el ancho
  de la nav a `min(calc(100% - 112px), 520px / 440px)`.
- Los comentarios de código nuevos siguen el idioma del archivo (español en `css/` y `js/`).

**Acceptance criteria:**
1. Sin preferencia guardada y OS en oscuro → la página arranca oscura, sin flash de tema.
2. Elegir Claro u Oscuro persiste y sobreescribe la preferencia del sistema.
3. El menú muestra Visual deshabilitado con "(pronto)".
4. Hovers de `nav-item`, `hero-btn` y `project-btn` visibles en dark (fondo claro invertido,
   mismo motivo que el `.end` invertido).
5. `.end` se invierte en dark (fondo claro con grid/título oscuro).
6. `node --check js/main.js` pasa sin errores.
7. El botón y el menú son accesibles (teclado: Enter abre, Escape cierra y devuelve foco).

**Checks aplicables:** `node --check js/main.js` (sintaxis), readback estructural del diff.
TDD: **off** (sin runner en sitio estático vanilla; se usan checks funcionales ordinarios).

**Delivery strategy:** `ask-on-risk` (defecto). Forecast ~300 líneas authored < 400 →
slice único, un solo commit work-unit.

## Tasks

- [ ] **T1** — Crear feature doc + mirror de Engram. _(inline, orchestrator)_
- [ ] **T2–T4** — Implementar: (T2) tokens dark + retheme CSS completo (paleta, hovers,
      `.end` invertido, `color-scheme`), (T3) selector UI en `index.html` + estilos del
      dropdown, (T4) engine JS + script inline anti-flash. _(delegated writer: general)_
- [ ] **T5** — Verificación (sintaxis JS, readback, assess) + commit work-unit.
      _(inline, orchestrator)_

## Progress

- T1: ✅ Feature doc + mirror de Engram.
- T2–T4: ✅ Implementación delegada (`general`, sesión ses_f39262a4fffeS6kzH7HOmD6knm).
  `node --check js/main.js` OK (writer + spot check del orquestador).
- T5: ✅ Verificación y commit.

**Verificación (2026-09-22):**
- `node --check js/main.js` → OK, exit 0.
- Gatekeeper ODD: PASS — sin drift, rutas reales, artefactos legibles.
- `gentle-ai review assess` (RDD off, verificación delegada): `risk: medium`
  (`executable_change` en css), `review_due_reason: under_budget` (314 líneas < 400).
  Writer en modelo por defecto → self-verification suficiente, sin verifier extra.

**Commit work-unit:** `9dd6ef7` `feat: add dark mode theme switcher` (4 archivos, +370/−15)
en rama `feat/theme-mode`. Push/merge/PR: decisión del usuario.

## Route declaration

| Task | Route | Trigger evidence |
| --- | --- | --- |
| T1 | inline | orquestación (doc de feature) |
| T2–T4 | delegated direct (`general`) | Writer trigger: 2+ archivos no triviales (`index.html`, `css/global.css`, `js/main.js`) |
| T5 | inline | estado/bash + commit |