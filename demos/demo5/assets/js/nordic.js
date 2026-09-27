/**
 * DEMO 5: NORDIC MINIMALIST ACADEMIC JOURNAL
 * Interactive logic for data rendering, filtering, modal CVs, and scroll spy.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof APP_DATA === 'undefined') {
    console.error('APP_DATA is not loaded');
    return;
  }

  initPresentationTabs();
  renderResearchLines();
  renderTeam();
  renderTheses();
  renderPublications();
  renderTraining();
  initScrollSpy();
  initModalClose();
});

// 1. PRESENTATION TABS
function initPresentationTabs() {
  const container = document.getElementById('nordic-tabs-container');
  const panelsContainer = document.getElementById('nordic-tab-panels');
  if (!container || !panelsContainer) return;

  const tabs = [
    { id: 'perfil', label: 'Perfil del Grupo', key: 0 },
    { id: 'biocruces', label: 'IIS Biocruces Bizkaia', key: 1 },
    { id: 'sgiker', label: 'Unidad SGIker', key: 2 },
    { id: 'instalaciones', label: 'Instalaciones', key: 3 }
  ];

  container.innerHTML = tabs.map((t, idx) => `
    <button class="tab-pill ${idx === 0 ? 'active' : ''}" onclick="switchTab('${t.id}')">
      ${t.label}
    </button>
  `).join('');

  panelsContainer.innerHTML = tabs.map((t, idx) => {
    const data = APP_DATA.presentation[t.key] || {};
    return `
      <div id="panel-${t.id}" class="tab-panel ${idx === 0 ? 'active' : ''}">
        <h4 style="font-family:var(--font-serif); font-size:1.3rem; margin-bottom:12px; color:var(--nordic-primary);">
          ${data.title || t.label}
        </h4>
        <p style="margin-bottom:14px; font-size:0.95rem; line-height:1.7;">${data.lead || data.description || ''}</p>
        ${data.content ? `<div style="font-size:0.9rem; line-height:1.6; color:var(--nordic-ink-muted);">${data.content}</div>` : ''}
      </div>
    `;
  }).join('');
}

window.switchTab = function(tabId) {
  document.querySelectorAll('.tab-pill').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(tabId));
  });
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `panel-${tabId}`);
  });
};

// 2. RESEARCH LINES
function renderResearchLines() {
  const container = document.getElementById('nordic-lines-grid');
  if (!container || !APP_DATA.researchLines) return;

  container.innerHTML = APP_DATA.researchLines.map((line, idx) => {
    const imgPath = line.image ? `assets${line.image}` : 'assets/images/mafld.jpg';
    return `
      <article class="line-card">
        <img src="${imgPath}" alt="${line.title}" class="line-img" onerror="this.src='assets/images/mafld.jpg'" />
        <div class="line-body">
          <span class="line-tag">Línea 0${idx + 1}</span>
          <h3 class="line-title">${line.title}</h3>
          <p class="line-desc">${line.description || ''}</p>
          <div class="line-details-toggle" onclick="toggleLineDetails(${idx})">
            <span>Ver objetivos y patologías asociadas</span>
            <i class="fas fa-chevron-down" id="line-icon-${idx}"></i>
          </div>
          <div class="line-extra-content" id="line-extra-${idx}">
            ${line.objectives && line.objectives.length > 0 ? `
              <h5 style="font-weight:700; margin-bottom:6px; color:var(--nordic-primary);">Objetivos Principales:</h5>
              <ul style="padding-left:18px; margin-bottom:12px;">
                ${line.objectives.map(obj => `<li>${obj}</li>`).join('')}
              </ul>
            ` : ''}
            ${line.diseases && line.diseases.length > 0 ? `
              <div style="font-size:0.75rem; color:var(--nordic-accent); font-weight:600;">
                Impacto clínico: ${line.diseases.join(' • ')}
              </div>
            ` : ''}
          </div>
        </div>
      </article>
    `;
  }).join('');
}

window.toggleLineDetails = function(idx) {
  const extra = document.getElementById(`line-extra-${idx}`);
  const icon = document.getElementById(`line-icon-${idx}`);
  if (extra) {
    extra.classList.toggle('open');
    if (icon) {
      icon.style.transform = extra.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
      icon.style.transition = 'transform 0.2s';
    }
  }
};

// 3. TEAM MEMBERS WITH CATEGORY FILTER & DETAILED CV MODAL
let currentTeamFilter = 'all';

function renderTeam() {
  const container = document.getElementById('nordic-team-grid');
  if (!container || !APP_DATA.teamMembers) return;

  const filtered = APP_DATA.teamMembers.filter(m => {
    if (currentTeamFilter === 'all') return true;
    if (currentTeamFilter === 'cat' && m.role && m.role.toLowerCase().includes('catedrátic')) return true;
    if (currentTeamFilter === 'pi' && m.role && (m.role.toLowerCase().includes('coordinador') || m.role.toLowerCase().includes('investigador principal') || m.role.toLowerCase().includes('asociad') || m.role.toLowerCase().includes('adjunt'))) return true;
    if (currentTeamFilter === 'predoc' && m.role && (m.role.toLowerCase().includes('predoctoral') || m.role.toLowerCase().includes('fpi') || m.role.toLowerCase().includes('fpu'))) return true;
    if (currentTeamFilter === 'postdoc' && m.role && (m.role.toLowerCase().includes('postdoctoral') || m.role.toLowerCase().includes('ciberehd'))) return true;
    return true;
  });

  container.innerHTML = filtered.map(m => {
    const photo = m.image ? `assets${m.image}` : 'assets/images/team/patricia_aspichueta.jpg';
    return `
      <div class="member-card">
        <div class="member-top">
          <img src="${photo}" alt="${m.name}" class="member-photo" onerror="this.src='assets/images/team/patricia_aspichueta.jpg'" />
          <div class="member-info">
            <h4 class="member-name">${m.name}</h4>
            <div class="member-role">${m.role || 'Investigador/a'}</div>
            <div class="member-affil">${m.affiliation || 'UPV/EHU & Biocruces'}</div>
          </div>
        </div>
        <div class="member-meta">
          <span>${m.publications ? `${m.publications.length} publicaciones` : ''}</span>
          <button class="btn-open-cv" onclick="openMemberModal('${m.id}')">Ver expediente &rarr;</button>
        </div>
      </div>
    `;
  }).join('');
}

window.filterTeam = function(cat, btn) {
  currentTeamFilter = cat;
  document.querySelectorAll('.team-filters .filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderTeam();
};

window.openMemberModal = function(id) {
  const member = APP_DATA.teamMembers.find(m => m.id === id);
  if (!member) return;

  const modalBody = document.getElementById('nordic-modal-content');
  const modalBackdrop = document.getElementById('nordic-modal-backdrop');
  if (!modalBody || !modalBackdrop) return;

  const photo = member.image ? `assets${member.image}` : 'assets/images/team/patricia_aspichueta.jpg';

  modalBody.innerHTML = `
    <div style="display:flex; gap:24px; align-items:center; border-bottom:1px solid var(--nordic-border); padding-bottom:20px; margin-bottom:20px;">
      <img src="${photo}" style="width:84px; height:84px; border-radius:50%; object-fit:cover; border:2px solid var(--nordic-accent);" />
      <div>
        <h2 style="font-family:var(--font-serif); font-size:1.6rem; color:var(--nordic-primary); margin-bottom:4px;">${member.name}</h2>
        <div style="color:var(--nordic-accent); font-weight:600; font-size:0.9rem;">${member.role || ''}</div>
        <div style="color:var(--nordic-ink-muted); font-size:0.85rem;">${member.affiliation || ''}</div>
        ${member.orcid ? `<div style="margin-top:6px;"><a href="https://orcid.org/${member.orcid}" target="_blank" style="font-family:var(--font-mono); font-size:0.75rem; color:#A6CE39; font-weight:700;"><i class="fab fa-orcid"></i> ORCID: ${member.orcid}</a></div>` : ''}
      </div>
    </div>

    ${member.bio ? `
      <div style="margin-bottom:24px;">
        <h4 style="font-family:var(--font-serif); font-size:1.15rem; color:var(--nordic-primary); margin-bottom:8px;">Trayectoria Científica</h4>
        <p style="font-size:0.9rem; line-height:1.7; color:var(--nordic-ink-muted);">${member.bio}</p>
      </div>
    ` : ''}

    ${member.directedTheses && member.directedTheses.length > 0 ? `
      <div style="margin-bottom:24px;">
        <h4 style="font-family:var(--font-serif); font-size:1.15rem; color:var(--nordic-primary); margin-bottom:10px;">Tesis Doctorales Dirigidas</h4>
        <ul style="padding-left:20px; font-size:0.85rem; color:var(--nordic-ink-muted); display:flex; flex-direction:column; gap:8px;">
          ${member.directedTheses.map(t => `
            <li>
              <strong>${t.title}</strong> (${t.year})<br/>
              <span style="font-size:0.8rem; color:var(--nordic-ink-faint);">Doctorando/a: ${t.student}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : ''}

    ${member.publications && member.publications.length > 0 ? `
      <div>
        <h4 style="font-family:var(--font-serif); font-size:1.15rem; color:var(--nordic-primary); margin-bottom:10px;">Artículos Destacados</h4>
        <div style="display:flex; flex-direction:column; gap:8px; max-height:260px; overflow-y:auto; padding-right:8px;">
          ${member.publications.map(p => `
            <div style="padding:10px; background:var(--nordic-bg); border:1px solid var(--nordic-border-subtle); border-radius:4px; font-size:0.8rem;">
              <strong style="color:var(--nordic-primary);">${p.title}</strong>
              <div style="color:var(--nordic-accent); font-size:0.75rem; margin-top:2px;">${p.journal || ''} (${p.year || ''})</div>
              ${p.doi ? `<a href="https://doi.org/${p.doi}" target="_blank" style="color:var(--nordic-primary); font-family:var(--font-mono); font-size:0.7rem; text-decoration:underline;">doi:${p.doi}</a>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;

  modalBackdrop.classList.add('open');
};

function initModalClose() {
  const modalBackdrop = document.getElementById('nordic-modal-backdrop');
  const closeBtn = document.querySelector('.nordic-modal-close');
  if (closeBtn && modalBackdrop) {
    closeBtn.addEventListener('click', () => modalBackdrop.classList.remove('open'));
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
    });
  }
}

// 4. THESES SECTION
let currentThesesFilter = 'all';

function renderTheses() {
  const container = document.getElementById('nordic-theses-list');
  if (!container || !APP_DATA.theses) return;

  let list = [];
  if (currentThesesFilter === 'all') {
    list = APP_DATA.theses.all || [];
  } else if (currentThesesFilter === 'ongoing') {
    list = APP_DATA.theses.ongoing || [];
  } else {
    list = APP_DATA.theses.completed || [];
  }

  container.innerHTML = list.map(t => {
    const isOngoing = t.status === 'ongoing' || !t.defenseYear || t.year === 'En curso';
    return `
      <div class="thesis-row ${isOngoing ? 'ongoing' : ''}">
        <span class="thesis-status-badge ${isOngoing ? 'ongoing' : 'completed'}">
          ${isOngoing ? 'En Desarrollo' : `Defendida (${t.year || t.defenseYear})`}
        </span>
        <h4 class="thesis-title">${t.title}</h4>
        <div class="thesis-meta-grid">
          <div class="thesis-meta-item">
            <strong>Doctorando/a:</strong><br/>
            ${t.author || t.student || 'N/A'}
          </div>
          <div class="thesis-meta-item">
            <strong>Dirección:</strong><br/>
            ${Array.isArray(t.directors) ? t.directors.join(', ') : (t.directors || 'N/A')}
          </div>
          <div class="thesis-meta-item">
            <strong>Mención / Calificación:</strong><br/>
            ${t.mention || t.grade || (isOngoing ? 'Programa Oficial de Doctorado' : 'Sobresaliente Cum Laude')}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.filterTheses = function(type, btn) {
  currentThesesFilter = type;
  document.querySelectorAll('.theses-controls .filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderTheses();
};

// 5. PUBLICATIONS EXPLORER
function renderPublications() {
  const container = document.getElementById('nordic-pubs-container');
  const countLabel = document.getElementById('nordic-pub-count');
  const searchInput = document.getElementById('nordic-pub-search');
  const yearSelect = document.getElementById('nordic-pub-year');
  if (!container || !APP_DATA.publications) return;

  // Populate Year options
  if (yearSelect && yearSelect.options.length <= 1) {
    const years = [...new Set(APP_DATA.publications.map(p => p.year).filter(Boolean))].sort((a,b) => b - a);
    years.forEach(y => {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = `Año ${y}`;
      yearSelect.appendChild(opt);
    });
  }

  function updateList() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const selectedYear = yearSelect ? yearSelect.value : 'all';

    const filtered = APP_DATA.publications.filter(p => {
      const matchYear = selectedYear === 'all' || String(p.year) === String(selectedYear);
      const matchQuery = !query ||
        (p.title && p.title.toLowerCase().includes(query)) ||
        (p.authors && p.authors.toLowerCase().includes(query)) ||
        (p.journal && p.journal.toLowerCase().includes(query));
      return matchYear && matchQuery;
    });

    if (countLabel) {
      countLabel.textContent = `Mostrando ${filtered.length} de ${APP_DATA.publications.length} publicaciones indexadas JCR`;
    }

    container.innerHTML = filtered.map(p => `
      <div class="pub-card">
        <h4 class="pub-title">${p.title}</h4>
        <div class="pub-authors">${p.authors || ''}</div>
        <div class="pub-journal-line">
          <span>${p.journal || ''} &bull; ${p.year || ''}</span>
          ${p.doi ? `<a href="https://doi.org/${p.doi}" target="_blank" class="pub-doi-link">doi:${p.doi} &rarr;</a>` : ''}
        </div>
      </div>
    `).join('');
  }

  if (searchInput) searchInput.addEventListener('input', updateList);
  if (yearSelect) yearSelect.addEventListener('change', updateList);

  updateList();
}

// 6. TRAINING PROGRAMS
function renderTraining() {
  const container = document.getElementById('nordic-training-grid');
  if (!container || !APP_DATA.training) return;

  container.innerHTML = APP_DATA.training.map(t => `
    <div class="training-card">
      <div class="training-type">${t.type || 'Docencia'}</div>
      <h4 class="training-title">${t.title}</h4>
      <p class="training-desc">${t.description || ''}</p>
    </div>
  `).join('');
}

// 7. SCROLL SPY FOR SIDEBAR RAIL
function initScrollSpy() {
  const sections = document.querySelectorAll('.nordic-section');
  const navLinks = document.querySelectorAll('.rail-nav a');

  window.addEventListener('scroll', () => {
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}
