/**
 * PROTOTIPO 2: BIOTECH VANGUARDIA & BENTO GRID
 * Interactive Logic, Bento Rendering & Micro-interactions
 * Shared Data Schema from APP_DATA
 */

document.addEventListener('DOMContentLoaded', () => {
  // Theme state
  let currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemePill(currentTheme);

  // Language state
  let currentLang = localStorage.getItem('lang') || 'es';
  applyLanguage(currentLang);

  // Initial Renders
  renderStatsBento();
  renderLinesBento();
  renderTeamBento();
  renderThesesBento('ALL');
  renderPubsBento('ALL');

  // Event Listeners
  setupThemeToggle();
  setupLanguageSwitcher();
  setupTeamSearchAndFilter();
  setupThesesFilter();
  setupPubsFilter();
  setupTabs();
  setupModal();
  setupContact();
});

/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */
function setupThemeToggle() {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemePill(next);
  });
}

function updateThemePill(theme) {
  const btn = document.getElementById('theme-toggle-btn');
  if (!btn) return;
  const icon = btn.querySelector('i');
  const text = btn.querySelector('.theme-text');
  
  if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  if (text) text.textContent = theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro';

  const ehuLogo = document.getElementById('ehu-brand-logo');
  if (ehuLogo) {
    ehuLogo.src = theme === 'dark' 
      ? 'assets/images/logo/ehu_logo_negatiboa.svg'
      : 'assets/images/logo/ehu_logo_positiboa.svg';
  }
}

/* ==========================================================================
   LANGUAGE SWITCHER
   ========================================================================== */
function setupLanguageSwitcher() {
  const btns = document.querySelectorAll('.lang-pill-btn');
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
  document.querySelectorAll('.lang-pill-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });

  if (!window.APP_DATA || !APP_DATA.translations || !APP_DATA.translations[lang]) return;
  const dict = APP_DATA.translations[lang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });
}

/* ==========================================================================
   STATS BENTO RENDERER
   ========================================================================== */
function renderStatsBento() {
  const container = document.getElementById('stats-bento-grid');
  if (!container || !window.APP_DATA) return;

  container.innerHTML = APP_DATA.stats.map(s => `
    <div class="bento-card stats-bento-card">
      <div class="stat-glow-num">${s.number}</div>
      <div class="stat-label-title">${s.label}</div>
      <div class="stat-label-sub">${s.subtext}</div>
    </div>
  `).join('');
}

/* ==========================================================================
   RESEARCH LINES BENTO
   ========================================================================== */
function renderLinesBento() {
  const container = document.getElementById('lines-bento-grid');
  if (!container || !window.APP_DATA) return;

  container.innerHTML = APP_DATA.researchLines.map((line, idx) => {
    const colClass = (idx === 0 || idx === 1) ? 'col-6' : 'col-4';
    return `
      <div class="bento-card ${colClass} line-card-bento">
        <img src="${line.image}" alt="${line.title}" class="line-img-thumb" />
        <span class="line-badge-bio">${line.badge}</span>
        <h3 class="line-title-bio">${line.title}</h3>
        <p class="line-desc-bio">${line.shortDesc}</p>
        <button class="btn-open-modal" onclick="openBioModal('${line.id}')">
          <i class="fas fa-atom"></i> Explorar Proyecto &amp; Dianas
        </button>
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   TEAM PERSONNEL BENTO
   ========================================================================== */
let currentCategory = 'ALL';
let currentSearch = '';

function renderTeamBento(category = 'ALL', search = '') {
  const container = document.getElementById('team-bento-grid');
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

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-12" style="text-align:center; padding:3rem; color:var(--bio-text-muted);">
        <i class="fas fa-search" style="font-size:2rem; margin-bottom:1rem; opacity:0.5;"></i>
        <p>No se encontraron investigadores o personal con los criterios seleccionados.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(m => {
    let catKey = 'pdi';
    let catBadge = 'PDI & Senior';

    if (m.category === 'Coordinadora') {
      catKey = 'leadership';
      catBadge = 'Coordinación';
    } else if (m.category.includes('Ramón y Cajal')) {
      catKey = 'ryc';
      catBadge = 'Ramón y Cajal';
    } else if (m.category.includes('Posdoctoral')) {
      catKey = 'postdoc';
      catBadge = 'Posdoctoral';
    } else if (m.category.includes('Predoctoral')) {
      catKey = 'predoc';
      catBadge = 'Predoctoral';
    } else if (m.category.includes('Técnico')) {
      catKey = 'tech';
      catBadge = 'Técnico';
    }

    return `
      <div class="bento-card team-member-bento cat-${catKey}">
        <div class="team-member-avatar-box">
          <img src="${m.image}" alt="${m.name}" class="team-member-avatar" />
          <div>
            <h4 class="team-member-name">${m.name}</h4>
            <div class="team-member-role">${m.role}</div>
          </div>
        </div>
        <p class="team-member-dept"><i class="fas fa-university" style="opacity:0.6; margin-right:4px;"></i> ${m.department}</p>
        <div class="team-member-actions">
          <span class="team-category-badge badge-${catKey}">${catBadge}</span>
          <a href="curriculum.html?id=${m.id}" class="cv-pill-btn">
            <i class="fas fa-id-card"></i> Ver CV
          </a>
        </div>
      </div>
    `;
  }).join('');
}

function setupTeamSearchAndFilter() {
  const input = document.getElementById('team-bento-search');
  const btns = document.querySelectorAll('.team-pill-btn');

  if (input) {
    input.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      renderTeamBento(currentCategory, currentSearch);
    });
  }

  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      btns.forEach(b => b.classList.remove('active'));
      const target = e.target.closest('.team-pill-btn');
      if (target) {
        target.classList.add('active');
        currentCategory = target.dataset.category;
        renderTeamBento(currentCategory, currentSearch);
      }
    });
  });
}

/* ==========================================================================
   PHD THESES BENTO
   ========================================================================== */
function renderThesesBento(filterType = 'ALL') {
  const container = document.getElementById('theses-bento-grid');
  if (!container || !window.APP_DATA) return;

  const ongoing = APP_DATA.theses.ongoing.map(t => ({ ...t, isOngoing: true }));
  const completed = APP_DATA.theses.completed.map(t => ({ ...t, isOngoing: false }));
  let list = [];

  if (filterType === 'ALL') list = [...ongoing, ...completed];
  else if (filterType === 'ONGOING') list = ongoing;
  else if (filterType === 'COMPLETED') list = completed;

  container.innerHTML = list.map(t => `
    <div class="bento-card theses-bento-card">
      <span class="thesis-badge-bio ${t.isOngoing ? 'badge-ongoing' : 'badge-completed'}">
        <i class="${t.isOngoing ? 'fas fa-spinner fa-spin' : 'fas fa-check-circle'}"></i> ${t.badge}
      </span>
      <h4 class="thesis-author-name">${t.author}</h4>
      <div class="thesis-title-bio">"${t.title}"</div>
      <div class="thesis-meta-bio">
        <span><i class="fas fa-university"></i> ${t.institution}</span>
        <span><i class="fas fa-calendar-alt"></i> ${t.year}</span>
      </div>
      <a href="tesis.html?id=${t.id}" class="cv-pill-btn" style="align-self:flex-start;">
        <i class="fas fa-microscope"></i> Ver Abstract &amp; Ficha
      </a>
    </div>
  `).join('');
}

function setupThesesFilter() {
  const btns = document.querySelectorAll('.theses-pill-filter');
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      btns.forEach(b => b.classList.remove('active'));
      const target = e.target.closest('.theses-pill-filter');
      if (target) {
        target.classList.add('active');
        renderThesesBento(target.dataset.type);
      }
    });
  });
}

/* ==========================================================================
   PUBLICATIONS BENTO
   ========================================================================== */
function renderPubsBento(topic = 'ALL') {
  const container = document.getElementById('pubs-bento-grid');
  if (!container || !window.APP_DATA) return;

  const filtered = APP_DATA.publications.filter(p => topic === 'ALL' || p.topic === topic);

  container.innerHTML = filtered.map(p => `
    <div class="bento-card pub-bento-card">
      <div class="pub-journal-bio"><i class="fas fa-award"></i> ${p.journal} &bull; ${p.year}</div>
      <h4 class="pub-title-bio">${p.title}</h4>
      <div class="pub-authors-bio">${p.authors}</div>
      <p class="pub-abstract-bio">${p.abstract}</p>
      <a href="https://doi.org/${p.doi}" target="_blank" rel="noopener" class="pub-doi-pill">
        <i class="fas fa-external-link-alt"></i> DOI: ${p.doi}
      </a>
    </div>
  `).join('');
}

function setupPubsFilter() {
  const btns = document.querySelectorAll('.pub-bento-pill');
  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      btns.forEach(b => b.classList.remove('active'));
      const target = e.target.closest('.pub-bento-pill');
      if (target) {
        target.classList.add('active');
        renderPubsBento(target.dataset.topic);
      }
    });
  });
}

/* ==========================================================================
   TABS SWITCHER
   ========================================================================== */
function setupTabs() {
  const tabBtns = document.querySelectorAll('.bio-tab-btn');
  const panes = document.querySelectorAll('.bio-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      const targetBtn = e.target.closest('.bio-tab-btn');
      if (targetBtn) {
        targetBtn.classList.add('active');
        const targetId = targetBtn.dataset.tab;
        document.getElementById(targetId)?.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   MODAL WINDOW
   ========================================================================== */
function openBioModal(lineId) {
  if (!window.APP_DATA) return;
  const line = APP_DATA.researchLines.find(l => l.id === lineId);
  if (!line) return;

  const overlay = document.getElementById('bio-modal-overlay');
  const title = document.getElementById('bio-modal-title');
  const body = document.getElementById('bio-modal-body');

  title.textContent = line.title;
  body.innerHTML = line.details;
  overlay.classList.add('active');
}
window.openBioModal = openBioModal;

function setupModal() {
  const overlay = document.getElementById('bio-modal-overlay');
  const closeBtn = document.getElementById('bio-modal-close');

  if (closeBtn) closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
  }
}

/* ==========================================================================
   CONTACT FORM
   ========================================================================== */
function setupContact() {
  const form = document.getElementById('bio-contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("¡Muchas gracias! Su mensaje ha sido enviado al Grupo de Investigación Lipids & Liver.");
    form.reset();
  });
}
