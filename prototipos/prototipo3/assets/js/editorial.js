/**
 * PROTOTIPO 3: EDITORIAL SUIZO & MINIMALISMO CIENTÍFICO DE ALTO IMPACTO
 * Application Logic & Editorial Presentation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Theme state
  let currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeBtn(currentTheme);

  // Language state
  let currentLang = localStorage.getItem('lang') || 'es';
  applyLanguage(currentLang);

  // Renders
  renderStats();
  renderLines();
  renderTeam();
  renderTheses('ALL');
  renderPublications('ALL');

  // Event Listeners
  setupThemeToggle();
  setupLanguageSwitcher();
  setupTeamSearchAndFilter();
  setupThesesFilter();
  setupPubsFilter();
  setupModal();
});

function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeBtn(next);
  });
}

function updateThemeBtn(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;
  const icon = btn.querySelector('i');
  const text = btn.querySelector('.theme-text');
  if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  if (text) text.textContent = theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro';

  const logo = document.getElementById('ed-ehu-logo');
  if (logo) {
    logo.src = theme === 'dark' 
      ? 'assets/images/logo/ehu_logo_negatiboa.svg'
      : 'assets/images/logo/ehu_logo_positiboa.svg';
  }
}

function setupLanguageSwitcher() {
  const btns = document.querySelectorAll('.ed-lang-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      btns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const lang = e.target.dataset.lang;
      localStorage.setItem('lang', lang);
      applyLanguage(lang);
    });
  });
}

function applyLanguage(lang) {
  document.querySelectorAll('.ed-lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });

  if (!window.APP_DATA || !APP_DATA.translations || !APP_DATA.translations[lang]) return;
  const dict = APP_DATA.translations[lang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });
}

function renderStats() {
  const container = document.getElementById('ed-stats-strip');
  if (!container || !window.APP_DATA) return;

  container.innerHTML = APP_DATA.stats.map(s => `
    <div class="ed-stat-col">
      <div class="ed-stat-num">${s.number}</div>
      <div class="ed-stat-label">${s.label}</div>
      <div class="ed-stat-subtext">${s.subtext}</div>
    </div>
  `).join('');
}

function renderLines() {
  const container = document.getElementById('ed-lines-grid');
  if (!container || !window.APP_DATA) return;

  container.innerHTML = APP_DATA.researchLines.map((line, idx) => `
    <div class="ed-line-card">
      <img src="${line.image}" alt="${line.title}" class="ed-line-card-img" />
      <div class="ed-line-card-body">
        <span class="ed-line-tag">Línea 0${idx + 1} &bull; ${line.badge}</span>
        <h3 class="ed-line-title">${line.title}</h3>
        <p class="ed-line-desc">${line.shortDesc}</p>
        <button class="btn-ed-text" onclick="openEdModal('${line.id}')">
          Examinar Objetivos y Memoria <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `).join('');
}

let currentCategory = 'ALL';
let currentSearch = '';

function renderTeam(category = 'ALL', search = '') {
  const container = document.getElementById('ed-team-grid');
  if (!container || !window.APP_DATA) return;

  const query = search.toLowerCase().trim();

  const filtered = APP_DATA.teamMembers.filter(m => {
    let matchCat = false;
    if (category === 'ALL') matchCat = true;
    else if (category === 'PDI') {
      matchCat = m.category === 'Coordinadora' || m.category.includes('Directora') || m.category.includes('Senior') || m.category === 'PDI' || m.category.includes('Ramón y Cajal');
    } else {
      matchCat = m.category.toLowerCase().includes(category.toLowerCase());
    }

    const matchSearch = !query || 
      m.name.toLowerCase().includes(query) || 
      m.role.toLowerCase().includes(query) || 
      m.department.toLowerCase().includes(query);

    return matchCat && matchSearch;
  });

  container.innerHTML = filtered.map(m => `
    <div class="ed-member-card">
      <div class="ed-member-header">
        <img src="${m.image}" alt="${m.name}" class="ed-member-photo" />
        <div>
          <h4 class="ed-member-name">${m.name}</h4>
          <div class="ed-member-role">${m.role}</div>
          <span class="ed-member-category-tag">${m.category}</span>
        </div>
      </div>
      <p class="ed-member-dept">${m.department}</p>
      <div class="ed-member-footer">
        <span style="font-size:0.75rem; color:var(--ed-ink-muted);">UPV/EHU &bull; Biocruces</span>
        <a href="curriculum.html?id=${m.id}" class="btn-ed-text">
          Ver Currículum <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `).join('');
}

function setupTeamSearchAndFilter() {
  const input = document.getElementById('ed-team-search');
  const btns = document.querySelectorAll('.ed-filter-btn');

  if (input) {
    input.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      renderTeam(currentCategory, currentSearch);
    });
  }

  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      btns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.dataset.category;
      renderTeam(currentCategory, currentSearch);
    });
  });
}

function renderTheses(filterType = 'ALL') {
  const container = document.getElementById('ed-theses-list');
  if (!container || !window.APP_DATA) return;

  const ongoing = APP_DATA.theses.ongoing.map(t => ({ ...t, isOngoing: true }));
  const completed = APP_DATA.theses.completed.map(t => ({ ...t, isOngoing: false }));
  let list = [];

  if (filterType === 'ALL') list = [...ongoing, ...completed];
  else if (filterType === 'ONGOING') list = ongoing;
  else if (filterType === 'COMPLETED') list = completed;

  container.innerHTML = list.map((t, idx) => `
    <div class="ed-index-row">
      <div class="ed-row-year">#${String(idx + 1).padStart(2, '0')}</div>
      <div>
        <h4 class="ed-row-title">"${t.title}"</h4>
        <div class="ed-row-meta">
          <strong>Doctorando/a:</strong> ${t.author} &bull; 
          <strong>Dirección:</strong> ${t.directors || 'Dra. Patricia Aspichueta'} &bull; 
          <strong>Estado:</strong> ${t.badge} (${t.year})
        </div>
      </div>
      <div class="ed-row-actions">
        <a href="tesis.html?id=${t.id}" class="btn-ed-text">
          Abstract Completo <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `).join('');
}

function setupThesesFilter() {
  const btns = document.querySelectorAll('.ed-theses-filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      btns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderTheses(e.target.dataset.type);
    });
  });
}

function renderPublications(topic = 'ALL') {
  const container = document.getElementById('ed-pubs-list');
  if (!container || !window.APP_DATA) return;

  const filtered = APP_DATA.publications.filter(p => topic === 'ALL' || p.topic === topic);

  container.innerHTML = filtered.map(p => `
    <div class="ed-index-row">
      <div class="ed-row-year">${p.year}</div>
      <div>
        <h4 class="ed-row-title">${p.title}</h4>
        <div class="ed-row-meta" style="margin-bottom:0.5rem;">
          <strong>${p.authors}</strong> &bull; <em>${p.journal}</em>
        </div>
        <p style="font-size:0.92rem; color:var(--ed-ink-secondary); line-height:1.6; max-width:800px;">
          ${p.abstract}
        </p>
      </div>
      <div class="ed-row-actions">
        <a href="https://doi.org/${p.doi}" target="_blank" rel="noopener" class="btn-ed-text">
          DOI: ${p.doi} <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    </div>
  `).join('');
}

function setupPubsFilter() {
  const btns = document.querySelectorAll('.ed-pub-filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      btns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderPublications(e.target.dataset.topic);
    });
  });
}

function openEdModal(lineId) {
  if (!window.APP_DATA) return;
  const line = APP_DATA.researchLines.find(l => l.id === lineId);
  if (!line) return;

  const backdrop = document.getElementById('ed-modal-backdrop');
  const title = document.getElementById('ed-modal-title');
  const body = document.getElementById('ed-modal-body');

  title.textContent = line.title;
  body.innerHTML = line.details;
  backdrop.classList.add('active');
}
window.openEdModal = openEdModal;

function setupModal() {
  const backdrop = document.getElementById('ed-modal-backdrop');
  const closeBtn = document.getElementById('ed-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', () => backdrop.classList.remove('active'));
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.remove('active');
    });
  }
}
