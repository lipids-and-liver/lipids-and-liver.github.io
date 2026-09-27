/**
 * PROTOTIPO 3: EDITORIAL SUIZO & MINIMALISMO CIENTÍFICO DE ALTO IMPACTO
 * Complete Logic for Lipids & Liver Research Group
 */

document.addEventListener('DOMContentLoaded', () => {
  // Theme state
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeBtn(currentTheme);

  // Language state
  const currentLang = localStorage.getItem('lang') || 'es';
  applyLanguage(currentLang);

  // Home Page Renders
  renderStats();
  renderAboutTabs();
  renderLines();
  renderTeam();
  renderTheses('ALL');
  renderPublications('ALL');
  renderTraining();

  // Detail Pages Check
  setupCurriculumPage();
  setupThesesPage();
  setupLineasPage();
  setupFullPublicationsPage();

  // Event Listeners
  setupThemeToggle();
  setupLanguageSwitcher();
  setupTeamSearchAndFilter();
  setupThesesFilter();
  setupPubsFilter();
  setupModal();
  setupContactForm();
});

// ==========================================
// 1. THEME TOGGLE
// ==========================================
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
  if (btn) {
    const icon = btn.querySelector('i');
    const text = btn.querySelector('.theme-text');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    if (text) text.textContent = theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro';
  }

  const logo = document.getElementById('ed-ehu-logo');
  if (logo) {
    logo.src = theme === 'dark' 
      ? 'assets/images/logo/ehu_logo_negatiboa.svg'
      : 'assets/images/logo/ehu_logo_positiboa.svg';
  }
}

// ==========================================
// 2. LANGUAGE SWITCHER
// ==========================================
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

// ==========================================
// 3. STATS STRIP
// ==========================================
function renderStats() {
  const container = document.getElementById('ed-stats-strip');
  if (!container || !window.APP_DATA || !APP_DATA.stats) return;

  container.innerHTML = APP_DATA.stats.map(s => `
    <div class="ed-stat-col">
      <div class="ed-stat-num">${s.number}</div>
      <div class="ed-stat-label">${s.label}</div>
      <div class="ed-stat-subtext">${s.subtext}</div>
    </div>
  `).join('');
}

// ==========================================
// 4. ABOUT TABS (EL GRUPO)
// ==========================================
function renderAboutTabs() {
  const navContainer = document.getElementById('ed-about-tabs-nav');
  const panelsContainer = document.getElementById('ed-about-panels');
  if (!navContainer || !panelsContainer || !window.APP_DATA || !APP_DATA.presentation) return;

  const tabs = APP_DATA.presentation;

  navContainer.innerHTML = tabs.map((t, idx) => `
    <button class="ed-tab-btn ${idx === 0 ? 'active' : ''}" data-tab="${t.id}">
      0${idx + 1}. ${t.tabTitle}
    </button>
  `).join('');

  panelsContainer.innerHTML = tabs.map((t, idx) => {
    let extraHtml = '';
    if (t.id === 'perfil') {
      const specs = (t.specialties || []).map(s => `<span class="ed-spec-tag"><i class="fas fa-check-circle" style="color:var(--ed-accent)"></i> ${s}</span>`).join('');
      const staff = (t.staffComposition || []).map(m => `
        <li style="display:flex; justify-content:space-between; border-bottom:1px solid var(--ed-border); padding:6px 0;">
          <strong style="color:var(--ed-accent)">${m.count}</strong> 
          <span style="color:var(--ed-ink-secondary)">${m.role}</span>
        </li>
      `).join('');

      extraHtml = `
        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:3rem; margin-top:2rem;">
          <div>
            <h4 style="font-family:var(--font-serif); font-size:1.25rem; margin-bottom:1rem; color:var(--ed-ink-primary);">Áreas de Especialidad Biomédica</h4>
            <div class="ed-spec-list">${specs}</div>
          </div>
          <div style="background:var(--ed-surface); border:1px solid var(--ed-border); padding:1.5rem;">
            <h4 style="font-family:var(--font-serif); font-size:1.15rem; margin-bottom:1rem; color:var(--ed-ink-primary);">
              <i class="fas fa-users" style="color:var(--ed-accent)"></i> ${t.staffCompositionTitle || 'Composición del Personal'}
            </h4>
            <ul style="list-style:none;">${staff}</ul>
          </div>
        </div>
      `;
    }

    return `
      <div class="ed-tab-panel ${idx === 0 ? 'active' : ''}" id="panel-${t.id}">
        <div style="font-size:1.05rem; line-height:1.8; color:var(--ed-ink-secondary); max-width:960px;">
          ${t.contentHtml}
        </div>
        ${extraHtml}
      </div>
    `;
  }).join('');

  // Wire tabs
  const tabBtns = navContainer.querySelectorAll('.ed-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panelsContainer.querySelectorAll('.ed-tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(`panel-${btn.dataset.tab}`);
      if (target) target.classList.add('active');
    });
  });
}

// ==========================================
// 5. RESEARCH LINES
// ==========================================
function renderLines() {
  const container = document.getElementById('ed-lines-grid');
  if (!container || !window.APP_DATA || !APP_DATA.researchLines) return;

  container.innerHTML = APP_DATA.researchLines.map((line, idx) => `
    <div class="ed-line-card">
      <img src="${line.image}" alt="${line.title}" class="ed-line-card-img" />
      <div class="ed-line-card-body">
        <span class="ed-line-tag">Línea 0${idx + 1} &bull; ${line.badge}</span>
        <h3 class="ed-line-title">${line.title}</h3>
        <p class="ed-line-desc">${line.shortDesc}</p>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:1rem; border-top:1px solid var(--ed-border);">
          <button class="btn-ed-text" onclick="openEdModal('line', '${line.id}')">
            Detalle <i class="fas fa-file-alt"></i>
          </button>
          <a href="lineas.html?id=${line.id}" class="btn-ed-text" style="color:var(--ed-accent); border-bottom-color:var(--ed-accent);">
            Página Completa <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `).join('');
}

// ==========================================
// 6. TEAM MEMBERS
// ==========================================
let currentTeamCategory = 'ALL';
let currentTeamSearch = '';

function renderTeam(category = 'ALL', search = '') {
  const container = document.getElementById('ed-team-grid');
  if (!container || !window.APP_DATA || !APP_DATA.teamMembers) return;

  const query = search.toLowerCase().trim();

  const filtered = APP_DATA.teamMembers.filter(m => {
    let matchCat = false;
    const cat = (m.category || '').toLowerCase();
    if (category === 'ALL') {
      matchCat = true;
    } else if (category === 'PDI') {
      matchCat = cat.includes('coordinadora') || cat.includes('directora') || cat.includes('senior') || cat === 'pdi' || cat.includes('ramón y cajal');
    } else if (category === 'Posdoctoral') {
      matchCat = cat.includes('posdoctoral');
    } else if (category === 'Predoctoral') {
      matchCat = cat.includes('predoctoral');
    } else if (category === 'Técnico') {
      matchCat = cat.includes('técnico') || cat.includes('tecnico');
    }

    const matchSearch = !query || 
      (m.name || '').toLowerCase().includes(query) || 
      (m.role || '').toLowerCase().includes(query) || 
      (m.department || '').toLowerCase().includes(query);

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
      currentTeamSearch = e.target.value;
      renderTeam(currentTeamCategory, currentTeamSearch);
    });
  }

  btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      btns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentTeamCategory = e.target.dataset.category;
      renderTeam(currentTeamCategory, currentTeamSearch);
    });
  });
}

// ==========================================
// 7. PHd THESES
// ==========================================
function renderTheses(filterType = 'ALL') {
  const container = document.getElementById('ed-theses-list');
  if (!container || !window.APP_DATA || !APP_DATA.theses) return;

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
          <strong>Dirección:</strong> ${Array.isArray(t.directors) ? t.directors.join(', ') : (t.directors || 'Dra. Patricia Aspichueta')} &bull; 
          <span class="ed-spec-tag" style="background:${t.status === 'ongoing' ? 'var(--ed-accent-light)' : 'var(--ed-surface-muted)'}; color:${t.status === 'ongoing' ? 'var(--ed-accent)' : 'var(--ed-ink-primary)'}; font-size:0.75rem;">
            ${t.status === 'ongoing' ? 'En Curso' : 'Defendida'} (${t.year})
          </span>
        </div>
        <p style="font-size:0.9rem; color:var(--ed-ink-secondary); margin-top:0.5rem; line-height:1.6; max-width:850px;">
          ${(t.abstract || '').substring(0, 190)}...
        </p>
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

// ==========================================
// 8. PUBLICATIONS (INDEX PREVIEW)
// ==========================================
function renderPublications(topic = 'ALL') {
  const container = document.getElementById('ed-pubs-list');
  if (!container || !window.APP_DATA || !APP_DATA.publications) return;

  const filtered = APP_DATA.publications.filter(p => topic === 'ALL' || p.topic === topic).slice(0, 8);

  container.innerHTML = filtered.map(p => `
    <div class="ed-index-row">
      <div class="ed-row-year">${p.year}</div>
      <div>
        <h4 class="ed-row-title">${p.title}</h4>
        <div class="ed-row-meta" style="margin-bottom:0.5rem;">
          <strong>${p.authors}</strong> &bull; <em>${p.journal}</em>
        </div>
        <p style="font-size:0.92rem; color:var(--ed-ink-secondary); line-height:1.6; max-width:820px;">
          ${p.abstract || ''}
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

// ==========================================
// 9. TRAINING & DOCENCIA
// ==========================================
function renderTraining() {
  const container = document.getElementById('ed-training-grid');
  if (!container || !window.APP_DATA || !APP_DATA.training) return;

  container.innerHTML = APP_DATA.training.map(tr => `
    <div class="ed-training-card">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <span class="ed-training-badge">${tr.type}</span>
        <i class="${tr.icon || 'fas fa-graduation-cap'}" style="font-size:1.5rem; color:var(--ed-accent)"></i>
      </div>
      <h3 class="ed-training-title">${tr.title}</h3>
      <div class="ed-training-meta">
        <i class="fas fa-university"></i> ${tr.institution} &bull; <strong>${tr.badge}</strong>
      </div>
      <div class="ed-training-body">
        ${tr.contentHtml}
      </div>
      ${tr.url ? `
        <div style="margin-top:auto; padding-top:1rem; border-top:1px solid var(--ed-border);">
          <a href="${tr.url}" target="_blank" rel="noopener" class="btn-ed-text">
            Web Oficial del Programa <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
      ` : ''}
    </div>
  `).join('');
}

// ==========================================
// 10. MODAL DIALOG
// ==========================================
function setupModal() {
  const backdrop = document.getElementById('ed-modal-backdrop');
  const closeBtn = document.getElementById('ed-modal-close');

  if (closeBtn && backdrop) {
    closeBtn.addEventListener('click', () => backdrop.classList.remove('active'));
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.remove('active');
    });
  }
}

window.openEdModal = function(type, id) {
  const backdrop = document.getElementById('ed-modal-backdrop');
  const titleEl = document.getElementById('ed-modal-title');
  const bodyEl = document.getElementById('ed-modal-body');
  if (!backdrop || !titleEl || !bodyEl || !window.APP_DATA) return;

  if (type === 'line') {
    const line = APP_DATA.researchLines.find(l => l.id === id);
    if (!line) return;
    titleEl.textContent = line.title;
    bodyEl.innerHTML = `
      <div style="margin-bottom:1rem;">
        <span class="ed-spec-tag" style="background:var(--ed-accent-light); color:var(--ed-accent); font-weight:700;">${line.badge}</span>
      </div>
      <div style="margin-bottom:1.5rem; line-height:1.75;">
        ${line.contentHtml}
      </div>
      <div style="margin-top:1.5rem; padding-top:1rem; border-top:1px solid var(--ed-border); display:flex; justify-content:flex-end;">
        <a href="lineas.html?id=${line.id}" class="btn-ed-primary">
          Ver Página Completa de la Línea <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    `;
  }

  backdrop.classList.add('active');
};

// ==========================================
// 11. CONTACT FORM
// ==========================================
function setupContactForm() {
  const form = document.getElementById('ed-contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Mensaje transmitido correctamente al Grupo Lipids & Liver (UPV/EHU & Biocruces). Le responderemos a la mayor brevedad.');
    form.reset();
  });
}

// ==========================================
// 12. CURRICULUM DETAIL PAGE
// ==========================================
function setupCurriculumPage() {
  const select = document.getElementById('member-select');
  const container = document.getElementById('cv-editorial-container');
  if (!select || !container || !window.APP_DATA || !APP_DATA.teamMembers) return;

  // Populate Select
  select.innerHTML = APP_DATA.teamMembers.map(m => `
    <option value="${m.id}">${m.name} (${m.category})</option>
  `).join('');

  function renderCV(id) {
    const m = APP_DATA.teamMembers.find(item => item.id === id) || APP_DATA.teamMembers[0];
    if (!m) return;
    select.value = m.id;

    const cv = m.cv || {};
    const degrees = (cv.degrees || []).map(d => `<li>${d}</li>`).join('');
    const positions = (cv.positions || []).map(p => `<li>${p}</li>`).join('');
    const grants = (cv.grants || []).map(g => `<li>${g}</li>`).join('');
    const pubs = (cv.publications || []).map(p => `<li>${p}</li>`).join('');
    const teaching = (cv.teaching || []).map(t => `<li>${t}</li>`).join('');

    container.innerHTML = `
      <div class="ed-detail-masthead">
        <div style="display:flex; gap:2.5rem; align-items:center; flex-wrap:wrap;">
          <img src="${m.image}" alt="${m.name}" style="width:140px; height:140px; object-fit:cover; border:2px solid var(--ed-border); border-radius:2px;" />
          <div>
            <span class="ed-spec-tag" style="background:var(--ed-accent-light); color:var(--ed-accent); font-weight:700; margin-bottom:8px;">${m.category}</span>
            <h1 style="font-family:var(--font-serif); font-size:2.4rem; font-weight:600; line-height:1.2; margin-bottom:6px;">${m.name}</h1>
            <div style="font-size:1.1rem; color:var(--ed-ink-secondary); margin-bottom:8px;">${m.role} &bull; ${m.department}</div>
            <div style="font-size:0.9rem; color:var(--ed-ink-muted); display:flex; gap:16px; flex-wrap:wrap;">
              ${m.email ? `<span><i class="fas fa-envelope"></i> <a href="mailto:${m.email}" style="color:var(--ed-ink-primary);">${m.email}</a></span>` : ''}
              ${m.office ? `<span><i class="fas fa-map-marker-alt"></i> ${m.office}</span>` : ''}
              ${m.orcid ? `<span><i class="fab fa-orcid" style="color:#a6ce39;"></i> <a href="https://orcid.org/${m.orcid}" target="_blank" rel="noopener" style="color:var(--ed-ink-primary);">ORCID: ${m.orcid}</a></span>` : ''}
            </div>
          </div>
        </div>
      </div>

      <div class="ed-detail-grid">
        <div>
          ${cv.researchSummary ? `
            <div class="ed-cv-section-block">
              <h3 class="ed-cv-section-title"><i class="fas fa-microscope" style="color:var(--ed-accent)"></i> Línea de Investigación & Trayectoria</h3>
              <p style="font-size:1.05rem; line-height:1.8; color:var(--ed-ink-secondary);">${cv.researchSummary}</p>
            </div>
          ` : ''}

          ${grants ? `
            <div class="ed-cv-section-block">
              <h3 class="ed-cv-section-title"><i class="fas fa-award" style="color:var(--ed-gold)"></i> Proyectos Financiados Seleccionados</h3>
              <ul class="ed-cv-list">${grants}</ul>
            </div>
          ` : ''}

          ${pubs ? `
            <div class="ed-cv-section-block">
              <h3 class="ed-cv-section-title"><i class="fas fa-book" style="color:var(--ed-navy)"></i> Publicaciones Destacadas</h3>
              <ul class="ed-cv-list">${pubs}</ul>
            </div>
          ` : ''}
        </div>

        <div>
          ${degrees ? `
            <div class="ed-cv-section-block">
              <h4 class="ed-cv-section-title" style="font-size:1.15rem;"><i class="fas fa-graduation-cap"></i> Titulación Académica</h4>
              <ul class="ed-cv-list" style="font-size:0.9rem;">${degrees}</ul>
            </div>
          ` : ''}

          ${positions ? `
            <div class="ed-cv-section-block">
              <h4 class="ed-cv-section-title" style="font-size:1.15rem;"><i class="fas fa-briefcase"></i> Cargos & Filiación</h4>
              <ul class="ed-cv-list" style="font-size:0.9rem;">${positions}</ul>
            </div>
          ` : ''}

          ${teaching ? `
            <div class="ed-cv-section-block">
              <h4 class="ed-cv-section-title" style="font-size:1.15rem;"><i class="fas fa-chalkboard-teacher"></i> Docencia Universitaria</h4>
              <ul class="ed-cv-list" style="font-size:0.9rem;">${teaching}</ul>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // URL Param handler
  const params = new URLSearchParams(window.location.search);
  const targetId = params.get('id') || APP_DATA.teamMembers[0].id;
  renderCV(targetId);

  select.addEventListener('change', (e) => {
    history.replaceState(null, '', `curriculum.html?id=${e.target.value}`);
    renderCV(e.target.value);
  });
}

// ==========================================
// 13. THESES DETAIL PAGE
// ==========================================
function setupThesesPage() {
  const select = document.getElementById('thesis-select');
  const container = document.getElementById('thesis-editorial-container');
  if (!select || !container || !window.APP_DATA || !APP_DATA.theses) return;

  const allTheses = APP_DATA.theses.all;

  // Populate Select
  select.innerHTML = allTheses.map(t => `
    <option value="${t.id}">[${t.status === 'ongoing' ? 'En Curso' : 'Defendida'}] ${t.author} - ${t.title.substring(0, 45)}...</option>
  `).join('');

  function renderThesis(id) {
    const t = allTheses.find(item => item.id === id) || allTheses[0];
    if (!t) return;
    select.value = t.id;

    const keywords = (t.keywords || []).map(k => `<span class="ed-spec-tag">${k}</span>`).join('');
    const directors = Array.isArray(t.directors) ? t.directors.join(', ') : (t.directors || 'Dra. Patricia Aspichueta');

    container.innerHTML = `
      <div class="ed-detail-masthead">
        <span class="ed-spec-tag" style="background:${t.status === 'ongoing' ? 'var(--ed-accent-light)' : 'var(--ed-surface-muted)'}; color:${t.status === 'ongoing' ? 'var(--ed-accent)' : 'var(--ed-ink-primary)'}; font-weight:700; margin-bottom:12px;">
          ${t.status === 'ongoing' ? 'Tesis Doctoral En Curso' : 'Tesis Doctoral Defendida'} &bull; ${t.year}
        </span>
        <h1 style="font-family:var(--font-serif); font-size:2.3rem; font-weight:600; line-height:1.25; margin-bottom:1.25rem;">"${t.title}"</h1>
        <div style="font-size:1.15rem; color:var(--ed-ink-secondary); margin-bottom:0.75rem;">
          <strong>Doctorando/a:</strong> ${t.author} &bull; <em>${t.institution}</em>
        </div>
      </div>

      <div class="ed-detail-grid">
        <div>
          <div class="ed-cv-section-block">
            <h3 class="ed-cv-section-title"><i class="fas fa-file-alt" style="color:var(--ed-accent)"></i> Memoria y Abstract Científico</h3>
            <div style="font-size:1.05rem; line-height:1.8; color:var(--ed-ink-secondary);">
              ${t.abstractHtml || `<p>${t.abstract}</p>`}
            </div>
          </div>
        </div>

        <div>
          <div class="ed-cv-section-block">
            <h4 class="ed-cv-section-title" style="font-size:1.15rem;"><i class="fas fa-user-tie"></i> Dirección de Tesis</h4>
            <p style="font-size:0.95rem; color:var(--ed-ink-secondary);">${directors}</p>
          </div>

          <div class="ed-cv-section-block">
            <h4 class="ed-cv-section-title" style="font-size:1.15rem;"><i class="fas fa-graduation-cap"></i> Programa Oficial</h4>
            <p style="font-size:0.95rem; color:var(--ed-ink-secondary);">${t.program || 'Programa de Doctorado en Biomedicina (UPV/EHU)'}</p>
          </div>

          <div class="ed-cv-section-block">
            <h4 class="ed-cv-section-title" style="font-size:1.15rem;"><i class="fas fa-tags"></i> Palabras Clave</h4>
            <div class="ed-spec-list">${keywords}</div>
          </div>
        </div>
      </div>
    `;
  }

  const params = new URLSearchParams(window.location.search);
  const targetId = params.get('id') || allTheses[0].id;
  renderThesis(targetId);

  select.addEventListener('change', (e) => {
    history.replaceState(null, '', `tesis.html?id=${e.target.value}`);
    renderThesis(e.target.value);
  });
}

// ==========================================
// 14. RESEARCH LINES DETAIL PAGE
// ==========================================
function setupLineasPage() {
  const select = document.getElementById('line-select');
  const container = document.getElementById('line-editorial-container');
  if (!select || !container || !window.APP_DATA || !APP_DATA.researchLines) return;

  const lines = APP_DATA.researchLines;

  // Populate Select
  select.innerHTML = lines.map(l => `
    <option value="${l.id}">${l.title}</option>
  `).join('');

  function renderLine(id) {
    const line = lines.find(item => item.id === id) || lines[0];
    if (!line) return;
    select.value = line.id;

    // Related Publications
    const relatedPubs = (APP_DATA.publications || []).filter(p => p.topic === line.id).slice(0, 5);
    const pubsHtml = relatedPubs.length > 0 ? `
      <div class="ed-cv-section-block">
        <h3 class="ed-cv-section-title"><i class="fas fa-book" style="color:var(--ed-accent)"></i> Publicaciones Destacadas de la Línea</h3>
        <div class="ed-index-list">
          ${relatedPubs.map(p => `
            <div class="ed-index-row" style="padding:1rem 0;">
              <div class="ed-row-year">${p.year}</div>
              <div>
                <h5 class="ed-row-title" style="font-size:1.05rem;">${p.title}</h5>
                <div class="ed-row-meta">${p.authors} &bull; <em>${p.journal}</em></div>
              </div>
              <div>
                <a href="https://doi.org/${p.doi}" target="_blank" rel="noopener" class="btn-ed-text" style="font-size:0.75rem;">
                  DOI <i class="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    container.innerHTML = `
      <div class="ed-detail-masthead">
        <div style="display:grid; grid-template-columns: 280px 1fr; gap:2.5rem; align-items:center;">
          <img src="${line.image}" alt="${line.title}" style="width:100%; height:200px; object-fit:cover; border:1px solid var(--ed-border);" />
          <div>
            <span class="ed-spec-tag" style="background:var(--ed-accent-light); color:var(--ed-accent); font-weight:700; margin-bottom:10px;">${line.badge}</span>
            <h1 style="font-family:var(--font-serif); font-size:2.2rem; font-weight:600; line-height:1.2; margin-bottom:0.75rem;">${line.title}</h1>
            <p style="font-size:1.1rem; color:var(--ed-ink-secondary); line-height:1.6;">${line.shortDesc}</p>
          </div>
        </div>
      </div>

      <div class="ed-detail-grid">
        <div>
          <div class="ed-cv-section-block">
            <h3 class="ed-cv-section-title"><i class="fas fa-microscope" style="color:var(--ed-accent)"></i> Memoria Científica y Abordaje Experimental</h3>
            <div style="font-size:1.05rem; line-height:1.8; color:var(--ed-ink-secondary);">
              ${line.contentHtml}
            </div>
          </div>
          ${pubsHtml}
        </div>

        <div>
          <div class="ed-cv-section-block">
            <h4 class="ed-cv-section-title" style="font-size:1.15rem;"><i class="fas fa-university"></i> Filiación y Financiación</h4>
            <p style="font-size:0.95rem; color:var(--ed-ink-secondary); line-height:1.6;">${line.affiliation || 'UPV/EHU & IIS Biocruces Bizkaia'}</p>
          </div>

          <div class="ed-cv-section-block">
            <h4 class="ed-cv-section-title" style="font-size:1.15rem;"><i class="fas fa-layer-group"></i> Otras Líneas Activas</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:8px;">
              ${lines.filter(l => l.id !== line.id).map(l => `
                <li>
                  <a href="lineas.html?id=${l.id}" style="color:var(--ed-ink-secondary); text-decoration:none; font-size:0.9rem; font-weight:600;">
                    &bull; ${l.title}
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  const params = new URLSearchParams(window.location.search);
  const targetId = params.get('id') || lines[0].id;
  renderLine(targetId);

  select.addEventListener('change', (e) => {
    history.replaceState(null, '', `lineas.html?id=${e.target.value}`);
    renderLine(e.target.value);
  });
}

// ==========================================
// 15. FULL PUBLICATIONS PAGE (PAGINATED & SEARCHABLE)
// ==========================================
function setupFullPublicationsPage() {
  const container = document.getElementById('ed-full-pubs-list');
  const searchInput = document.getElementById('ed-pub-search');
  const filterBtns = document.querySelectorAll('.ed-full-pub-filter-btn');
  const counterEl = document.getElementById('ed-pub-counter');
  const paginationContainer = document.getElementById('ed-pub-pagination');

  if (!container || !window.APP_DATA || !APP_DATA.publications) return;

  let currentTopic = 'ALL';
  let currentSearch = '';
  let currentPage = 1;
  const itemsPerPage = 20;

  function render() {
    const q = currentSearch.toLowerCase().trim();
    const filtered = APP_DATA.publications.filter(p => {
      const matchTopic = currentTopic === 'ALL' || p.topic === currentTopic;
      const matchSearch = !q || 
        (p.title || '').toLowerCase().includes(q) || 
        (p.authors || '').toLowerCase().includes(q) || 
        (p.journal || '').toLowerCase().includes(q) || 
        String(p.year || '').includes(q);
      return matchTopic && matchSearch;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageItems = filtered.slice(startIdx, startIdx + itemsPerPage);

    if (counterEl) {
      counterEl.textContent = `Mostrando ${Math.min(startIdx + 1, total)} - ${Math.min(startIdx + itemsPerPage, total)} de ${total} artículos científicos`;
    }

    if (pageItems.length === 0) {
      container.innerHTML = `
        <div style="padding:4rem 0; text-align:center; color:var(--ed-ink-muted);">
          <i class="fas fa-search" style="font-size:2rem; margin-bottom:1rem; opacity:0.5;"></i>
          <p style="font-size:1.1rem;">No se encontraron artículos para los criterios especificados.</p>
        </div>
      `;
      if (paginationContainer) paginationContainer.innerHTML = '';
      return;
    }

    container.innerHTML = pageItems.map((p, idx) => `
      <div class="ed-index-row">
        <div class="ed-row-year">${p.year}</div>
        <div>
          <h4 class="ed-row-title">${p.title}</h4>
          <div class="ed-row-meta" style="margin-bottom:0.5rem;">
            <strong>${p.authors}</strong> &bull; <em>${p.journal}</em>
          </div>
          ${p.abstract ? `
            <p style="font-size:0.92rem; color:var(--ed-ink-secondary); line-height:1.6; max-width:850px;">
              ${p.abstract}
            </p>
          ` : ''}
        </div>
        <div class="ed-row-actions">
          <a href="https://doi.org/${p.doi}" target="_blank" rel="noopener" class="btn-ed-text">
            DOI: ${p.doi} <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
      </div>
    `).join('');

    // Pagination
    if (paginationContainer) {
      let pagesHtml = `
        <button class="ed-page-btn" id="prev-page-btn" ${currentPage === 1 ? 'disabled' : ''}>
          <i class="fas fa-chevron-left"></i> Anterior
        </button>
        <span style="font-size:0.85rem; color:var(--ed-ink-secondary); font-weight:600;">
          Página ${currentPage} de ${totalPages}
        </span>
        <button class="ed-page-btn" id="next-page-btn" ${currentPage === totalPages ? 'disabled' : ''}>
          Siguiente <i class="fas fa-chevron-right"></i>
        </button>
      `;
      paginationContainer.innerHTML = pagesHtml;

      const prevBtn = document.getElementById('prev-page-btn');
      const nextBtn = document.getElementById('next-page-btn');
      if (prevBtn) prevBtn.addEventListener('click', () => { currentPage--; render(); window.scrollTo({ top: 300, behavior: 'smooth' }); });
      if (nextBtn) nextBtn.addEventListener('click', () => { currentPage++; render(); window.scrollTo({ top: 300, behavior: 'smooth' }); });
    }
  }

  render();

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      currentPage = 1;
      render();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentTopic = e.target.dataset.topic;
      currentPage = 1;
      render();
    });
  });
}
