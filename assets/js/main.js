/**
 * Lipids & Liver Research Group - Main Application Logic & Micro-interactions
 * Institutional & Sober Academic Edition with Refined Thesis & CV Views
 */

document.addEventListener('DOMContentLoaded', () => {
  // Current state
  let currentLang = 'es';
  let currentTheme = localStorage.getItem('theme') || 'light';

  // Apply saved theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateHeaderLogo(currentTheme);

  // Initial Data Renders
  renderStats();
  renderResearchLines();
  renderTeam();
  renderTheses('ALL');
  renderPublications();
  renderTraining();

  // Setup Event Listeners
  setupThemeToggle();
  setupLanguageSwitcher();
  setupTeamSearchAndFilter();
  setupThesesFilter();
  setupPubsFilter();
  setupTabs();
  setupModal();
  setupContactForm();
});

function updateHeaderLogo(theme) {
  const ehuLogo = document.getElementById('ehu-header-logo');
  if (ehuLogo) {
    ehuLogo.src = theme === 'dark' 
      ? 'assets/images/logo/ehu_logo_negatiboa.svg' 
      : 'assets/images/logo/ehu_logo_positiboa.svg';
  }
}

/* ==========================================================================
   RENDERERS
   ========================================================================== */
function renderStats() {
  const container = document.getElementById('stats-grid');
  if (!container) return;

  container.innerHTML = APP_DATA.stats.map(stat => `
    <div class="stat-box">
      <div class="stat-val">${stat.number}</div>
      <div class="stat-tit">${stat.label}</div>
      <div class="stat-desc">${stat.subtext}</div>
    </div>
  `).join('');
}

function renderResearchLines() {
  const container = document.getElementById('lines-grid');
  if (!container) return;

  container.innerHTML = APP_DATA.researchLines.map(line => `
    <div class="research-card-inst">
      <img src="${line.image}" alt="${line.title}" class="research-card-img" />
      <div class="research-card-content">
        <span class="research-badge">${line.badge}</span>
        <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:0.75rem; color:var(--ehu-navy);">${line.title}</h3>
        <p style="font-size:0.92rem; color:var(--text-secondary); margin-bottom:1.25rem; flex-grow:1;">${line.shortDesc}</p>
        <button class="btn-inst-primary" style="width:100%; justify-content:center; padding:10px; font-size:0.88rem;" onclick="openLineModal('${line.id}')">
          Ver Proyecto y Objetivos <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `).join('');
}

let currentTeamCategory = 'ALL';
let currentTeamSearch = '';

function renderTeam(filterCategory = 'ALL', searchQuery = '') {
  const container = document.getElementById('team-grid');
  if (!container) return;

  const query = searchQuery.toLowerCase().trim();

  const filtered = APP_DATA.teamMembers.filter(member => {
    let matchesCategory = false;
    if (filterCategory === 'ALL') {
      matchesCategory = true;
    } else if (filterCategory === 'PDI') {
      matchesCategory = member.category === 'Coordinadora' || member.category === 'Directora de Línea' || member.category === 'Investigador Senior' || member.category === 'PDI';
    } else {
      matchesCategory = member.category.toLowerCase().includes(filterCategory.toLowerCase());
    }

    const matchesSearch = !query || 
      member.name.toLowerCase().includes(query) || 
      member.role.toLowerCase().includes(query) ||
      member.category.toLowerCase().includes(query) ||
      member.department.toLowerCase().includes(query);
      
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:2.5rem; color:var(--text-muted)">No se encontraron miembros para el filtro o búsqueda seleccionada.</div>`;
    return;
  }

  container.innerHTML = filtered.map(m => {
    let catKey = 'pdi';
    let catBadge = 'PDI & Senior';

    if (m.category === 'Coordinadora') {
      catKey = 'leadership';
      catBadge = 'Coordinación';
    } else if (m.category.includes('Directora') || m.category.includes('Investigador Senior') || m.category === 'PDI') {
      catKey = 'pdi';
      catBadge = 'PDI & Senior';
    } else if (m.category.includes('Posdoctoral')) {
      catKey = 'postdoc';
      catBadge = 'Posdoctoral';
    } else if (m.category.includes('Predoctoral')) {
      catKey = 'predoc';
      catBadge = 'Predoctoral';
    } else if (m.category.includes('Técnico')) {
      catKey = 'tech';
      catBadge = 'Personal Técnico';
    }

    return `
      <div class="team-card-inst team-card-${catKey}">
        <span class="team-category-badge badge-${catKey}">${catBadge}</span>
        <div class="team-photo-box photo-${catKey}">
          <img src="${m.image}" alt="${m.name}" class="team-photo-img" />
        </div>
        <div class="team-card-info">
          <h4 class="team-member-name">${m.name}</h4>
          <div class="team-member-role">${m.role}</div>
          <div class="team-member-dept">${m.department}</div>
          <a href="curriculum.html?id=${m.id}" class="team-cv-btn">
            <i class="fas fa-file-alt"></i> Ver Currículum Completo
          </a>
        </div>
      </div>
    `;
  }).join('');
}

function renderTheses(filterType = 'ALL') {
  const container = document.getElementById('theses-grid');
  if (!container) return;

  let items = [];
  if (filterType === 'ALL' || filterType === 'ONGOING') {
    items = items.concat(APP_DATA.theses.ongoing.map(t => ({ ...t, isOngoing: true })));
  }
  if (filterType === 'ALL' || filterType === 'COMPLETED') {
    items = items.concat(APP_DATA.theses.completed.map(t => ({ ...t, isOngoing: false })));
  }

  container.innerHTML = items.map(t => `
    <div class="thesis-card-inst ${t.isOngoing ? 'ongoing' : ''}">
      <span class="${t.isOngoing ? 'thesis-badge-ongoing' : 'thesis-badge-completed'}">
        <i class="${t.isOngoing ? 'fas fa-spinner fa-spin' : 'fas fa-check-circle'}"></i> ${t.badge}
      </span>
      <h4 class="thesis-author">${t.author}</h4>
      <div class="thesis-title-text">"${t.title}"</div>
      <div class="thesis-meta-info">
        <span><i class="fas fa-university"></i> ${t.institution}</span>
        <span><i class="fas fa-calendar-alt"></i> ${t.year}</span>
      </div>
      <a href="tesis.html?id=${t.id}" class="thesis-detail-link">
        <i class="fas fa-book-reader"></i> Ver Información Ampliada
      </a>
    </div>
  `).join('');
}

function renderPublications(filterTopic = 'ALL') {
  const container = document.getElementById('pubs-list');
  if (!container) return;

  const filtered = APP_DATA.publications.filter(pub => {
    return filterTopic === 'ALL' || pub.topic === filterTopic;
  });

  container.innerHTML = filtered.map(pub => `
    <div class="pub-card">
      <div class="pub-header">
        <h4 class="pub-title">${pub.title}</h4>
        <span class="pub-year">${pub.year}</span>
      </div>
      <div class="pub-authors">${pub.authors}</div>
      <div class="pub-journal">${pub.journal}</div>
      <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:1rem; line-height:1.6;">${pub.abstract}</p>
      <div class="pub-actions">
        <a href="https://doi.org/${pub.doi}" target="_blank" rel="noopener" class="pub-doi-link">
          <i class="fas fa-external-link-alt" style="margin-right:4px"></i> DOI: ${pub.doi}
        </a>
      </div>
    </div>
  `).join('');
}

function renderTraining() {
  const container = document.getElementById('training-grid');
  if (!container) return;

  container.innerHTML = APP_DATA.trainings.map(t => `
    <div class="training-card">
      <span class="training-type">${t.type}</span>
      <h3 class="training-title">${t.title}</h3>
      <p class="training-desc">${t.description}</p>
    </div>
  `).join('');
}

/* ==========================================================================
   INTERACTION HANDLERS
   ========================================================================== */
function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    btn.querySelector('i').className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    updateHeaderLogo(next);
  });
}

function setupLanguageSwitcher() {
  const btns = document.querySelectorAll('.lang-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      btns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      applyTranslations(e.target.dataset.lang);
    });
  });
}

function applyTranslations(lang) {
  const dict = APP_DATA.translations[lang];
  if (!dict) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
}

function setupTeamSearchAndFilter() {
  const searchInput = document.getElementById('team-search');
  const filterBtns = document.querySelectorAll('.team-filter-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentTeamSearch = e.target.value;
      renderTeam(currentTeamCategory, currentTeamSearch);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      const target = e.target.closest('.team-filter-btn');
      if (target) {
        target.classList.add('active');
        currentTeamCategory = target.dataset.category;
        renderTeam(currentTeamCategory, currentTeamSearch);
      }
    });
  });
}

function setupThesesFilter() {
  const filterBtns = document.querySelectorAll('.segmented-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      const targetBtn = e.target.closest('.segmented-btn');
      if (targetBtn) {
        targetBtn.classList.add('active');
        renderTheses(targetBtn.dataset.type);
      }
    });
  });
}

function setupPubsFilter() {
  const filterBtns = document.querySelectorAll('.pub-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderPublications(e.target.dataset.topic);
    });
  });
}

function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      e.target.classList.add('active');
      const targetId = e.target.dataset.tab;
      document.getElementById(targetId)?.classList.add('active');
    });
  });
}

/* Modal Window */
function openLineModal(lineId) {
  const line = APP_DATA.researchLines.find(l => l.id === lineId);
  if (!line) return;

  const backdrop = document.getElementById('modal-backdrop');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  title.textContent = line.title;
  body.innerHTML = line.details;
  backdrop.classList.add('active');
}
window.openLineModal = openLineModal;

function setupModal() {
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.getElementById('modal-close');

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      backdrop.classList.remove('active');
    });
  }
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.remove('active');
    });
  }
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("¡Muchas gracias! Su mensaje ha sido enviado correctamente al Grupo de Investigación Lipids & Liver.");
    form.reset();
  });
}
