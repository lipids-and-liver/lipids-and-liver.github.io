// JavaScript para demo_ampliada - Lipids & Liver Research Group

document.addEventListener('DOMContentLoaded', () => {
  // 1. Manejo del Tema Claro / Oscuro
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('demo-theme');

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeButton(true);
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeButton(false);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('demo-theme', newTheme);
      updateThemeButton(!isDark);
    });
  }

  function updateThemeButton(isDark) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('.theme-text');
    if (isDark) {
      if (icon) icon.className = 'fas fa-sun';
      if (text) text.textContent = 'Modo Claro';
    } else {
      if (icon) icon.className = 'fas fa-moon';
      if (text) text.textContent = 'Modo Oscuro';
    }
  }

  // 2. Sistema de Pestañas (Tabs)
  const tabButtons = document.querySelectorAll('[data-tab-target]');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const container = btn.closest('.tab-wrapper');
      if (!container) return;

      const targetId = btn.getAttribute('data-tab-target');
      
      // Update buttons
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update contents
      container.querySelectorAll('.tab-content').forEach(content => {
        if (content.id === targetId) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });

  // 3. Filtro de Proyectos de Investigación
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. Modales o Notificaciones Informativas
  window.simularDescarga = function(nombreArchivo) {
    alert(`[DEMO]: Se ha iniciado la descarga simulada del recurso: ${nombreArchivo}\n\nEn la versión final, este botón descargará el PDF oficial o enlazará al repositorio correspondiente.`);
  };

  window.simularSolicitud = function(puesto) {
    alert(`[DEMO]: Has seleccionado la vacante: "${puesto}".\n\nEn la versión final se abrirá un formulario interactivo para adjuntar CV (formato CVI/CVA) y carta de motivación dirigida a la Dra. Patricia Aspichueta.`);
  };
});
