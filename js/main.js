// ==================================================================
// Render de la sección "Proyectos".
// Sólo lógica de render: lee el array `projects` (definido en
// js/projects.js, cargado antes) y construye las cards dentro de
// .projects-grid. Sin fetch, sin async, sin dependencias: son
// <a href> simples, por lo que funciona incluso abriendo el sitio
// con file://.
// ==================================================================

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
    buttons.appendChild(btnRepo);

    if (project.demo) {
      const btnDemo = document.createElement("a");
      btnDemo.className = "project-btn";
      btnDemo.href = project.demo;
      btnDemo.target = "_blank";
      btnDemo.rel = "noopener noreferrer";
      btnDemo.textContent = "Demo";
      buttons.appendChild(btnDemo);
    }

    card.append(img, title, description, buttons);
    grid.appendChild(card);
  }
});