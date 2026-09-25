/**
 * PROTOTIPO 4: HIGH-TECH LAB & PRECISION LIPIDOMICS CANVAS
 * Interactive Console Logic & Telemetry Renders
 */

document.addEventListener('DOMContentLoaded', () => {
  // Theme state (default dark for high-tech)
  let currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeUI(currentTheme);

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
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeUI(next);
  });
}

function updateThemeUI(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;
  const icon = btn.querySelector('i');
  const text = btn.querySelector('.theme-text');
  if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  if (text) text.textContent = theme === 'dark' ? 'LIGHT_UI' : 'DARK_UI';

  const logo = document.getElementById('ht-ehu-logo');
  if (logo) {
    logo.src = theme === 'dark' 
      ? 'assets/images/logo/ehu_logo_negatiboa.svg'
      : 'assets/images/logo/ehu_logo_positiboa.svg';
  }
}

function setupLanguageSwitcher() {
  const btns = document.querySelectorAll('.ht-lang-btn');
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
  document.querySelectorAll('.ht-lang-btn').forEach(b => {
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
  const container = document.getElementById('ht-stats-grid');
  if (!container || !window.APP_DATA) return;

  container.innerHTML = APP_DATA.stats.map(s => `
    <div class="ht-stat-panel">
      <div class="ht-stat-val">${s.number}</div>
      <div class="ht-stat-label">${s.label}</div>
      <div class="ht-stat-subtext">${s.subtext}</div>
    </div>
  `).join('');
}

function renderLines() {
  const container = document.getElementById('ht-lines-grid');
  if (!container || !window.APP_DATA) return;

  container.innerHTML = APP_DATA.researchLines.map((line, idx) => `
    <div class="ht-line-card">
      <img src="${line.image}" alt="${line.title}" class="ht-line-thumb" />
      <div class="ht-line-body">
        <div class="ht-line-code">[SYS_LINE_0${idx + 1} // ${line.badge.toUpperCase()}]</div>
        <h3 class="ht-line-title">${line.title}</h3>
        <p class="ht-line-desc">${line.shortDesc}</p>
        <button class="btn-ht-telemetry" onclick="openHtModal('${line.id}')">
          <i class="fas fa-terminal"></i> INSPECT_TARGETS_AND_DATA
        </button>
      </div>
    </div>
  `).join('');
}

let currentCategory = 'ALL';
let currentSearch = '';

function renderTeam(category = 'ALL', search = '') {
  const container = document.getElementById('ht-team-grid');
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

  container.innerHTML = filtered.map(m => {
    let catClass = 'pdi';
    if (m.category === 'Coordinadora') catClass = 'leadership';
    else if (m.category.includes('Ramón y Cajal')) catClass = 'ryc';
    else if (m.category.includes('Posdoctoral')) catClass = 'postdoc';
    else if (m.category.includes('Predoctoral')) catClass = 'predoc';
    else if (m.category.includes('Técnico')) catClass = 'tech';

    return `
      <div class="ht-member-card cat-${catClass}">
        <div class="ht-member-top">
          <img src="${m.image}" alt="${m.name}" class="ht-member-avatar" />
          <div>
            <h4 class="ht-member-name">${m.name}</h4>
            <div class="ht-member-role">${m.role}</div>
            <div style="font-family:var(--ht-font-mono); font-size:0.68rem; color:var(--ht-text-muted); margin-top:2px;">[${m.category.toUpperCase()}]</div>
          </div>
        </div>
        <p class="ht-member-dept"><i class="fas fa-microchip" style="opacity:0.6; margin-right:4px;"></i> ${m.department}</p>
        <div class="ht-member-bottom">
          <span style="font-family:var(--ht-font-mono); font-size:0.72rem; color:var(--ht-text-muted);">UPV/EHU &bull; BIOCRUCES</span>
          <a href="curriculum.html?id=${m.id}" class="btn-ht-ghost" style="text-decoration:none; padding:4px 10px;">
            <i class="fas fa-id-badge"></i> READ_DOSSIER
          </a>
        </div>
      </div>
    `;
  }).join('');
}

function setupTeamSearchAndFilter() {
  const input = document.getElementById('ht-team-search');
  const btns = document.querySelectorAll('.ht-filter-btn');

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
  const container = document.getElementById('ht-theses-list');
  if (!container || !window.APP_DATA) return;

  const ongoing = APP_DATA.theses.ongoing.map(t => ({ ...t, isOngoing: true }));
  const completed = APP_DATA.theses.completed.map(t => ({ ...t, isOngoing: false }));
  let list = [];

  if (filterType === 'ALL') list = [...ongoing, ...completed];
  else if (filterType === 'ONGOING') list = ongoing;
  else if (filterType === 'COMPLETED') list = completed;

  container.innerHTML = list.map((t, idx) => `
    <div class="ht-data-row">
      <div class="ht-data-header">
        <h4 class="ht-data-title">"${t.title}"</h4>
        <span style="font-family:var(--ht-font-mono); font-size:0.75rem; color:${t.isOngoing ? 'var(--ht-mint)' : 'var(--ht-cyan)'};">
          [${t.isOngoing ? 'STATUS: IN_PROGRESS' : 'STATUS: DEFENDED'}]
        </span>
      </div>
      <div class="ht-data-meta">
        CANDIDATE: ${t.author} &bull; DIRECTORS: ${t.directors || 'Dra. Patricia Aspichueta'} &bull; YEAR: ${t.year}
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem;">
        <span style="font-family:var(--ht-font-mono); font-size:0.72rem; color:var(--ht-text-muted);">
          REF: BIOMED_THESIS_0${idx + 1}
        </span>
        <a href="tesis.html?id=${t.id}" class="btn-ht-ghost" style="text-decoration:none; padding:4px 10px; font-size:0.75rem;">
          <i class="fas fa-file-alt"></i> VIEW_ABSTRACT
        </a>
      </div>
    </div>
  `).join('');
}

function setupThesesFilter() {
  const btns = document.querySelectorAll('.ht-theses-filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      btns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderTheses(e.target.dataset.type);
    });
  });
}

function renderPublications(topic = 'ALL') {
  const container = document.getElementById('ht-pubs-list');
  if (!container || !window.APP_DATA) return;

  const filtered = APP_DATA.publications.filter(p => topic === 'ALL' || p.topic === topic);

  container.innerHTML = filtered.map(p => `
    <div class="ht-data-row">
      <div class="ht-data-header">
        <h4 class="ht-data-title">${p.title}</h4>
        <span style="font-family:var(--ht-font-mono); font-size:0.75rem; color:var(--ht-amber);">
          [JCR_${p.year}]
        </span>
      </div>
      <div class="ht-data-meta">
        AUTHORS: ${p.authors} &bull; JOURNAL: ${p.journal}
      </div>
      <p class="ht-data-desc">${p.abstract}</p>
      <div>
        <a href="https://doi.org/${p.doi}" target="_blank" rel="noopener" class="btn-ht-ghost" style="text-decoration:none; padding:4px 12px; font-size:0.75rem;">
          <i class="fas fa-link"></i> DOI: ${p.doi}
        </a>
      </div>
    </div>
  `).join('');
}

function setupPubsFilter() {
  const btns = document.querySelectorAll('.ht-pub-filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      btns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderPublications(e.target.dataset.topic);
    });
  });
}

function openHtModal(lineId) {
  if (!window.APP_DATA) return;
  const line = APP_DATA.researchLines.find(l => l.id === lineId);
  if (!line) return;

  const overlay = document.getElementById('ht-modal-overlay');
  const title = document.getElementById('ht-modal-title');
  const body = document.getElementById('ht-modal-body');

  title.textContent = line.title;
  body.innerHTML = line.details;
  overlay.classList.add('active');
}
window.openHtModal = openHtModal;

function setupModal() {
  const overlay = document.getElementById('ht-modal-overlay');
  const closeBtn = document.getElementById('ht-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  }
}
