/**
 * DEMO 7: INTERACTIVE BIO-INTELLIGENCE DASHBOARD
 * Modern reactive workstation logic for the Lipids & Liver portal.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof APP_DATA === 'undefined') {
    console.error('APP_DATA is not defined');
    return;
  }

  renderKPIs();
  renderHubLines();
  renderHubTeam();
  renderHubKanban();
  renderHubPublications();
  initDrawerEvents();
  initHubScrollSpy();
});

// 1. KPI COUNTERS
function renderKPIs() {
  const kpiLines = document.getElementById('kpi-lines');
  const kpiTeam = document.getElementById('kpi-team');
  const kpiTheses = document.getElementById('kpi-theses');
  const kpiPubs = document.getElementById('kpi-pubs');

  if (kpiLines && APP_DATA.researchLines) kpiLines.textContent = APP_DATA.researchLines.length;
  if (kpiTeam && APP_DATA.teamMembers) kpiTeam.textContent = APP_DATA.teamMembers.length;
  if (kpiTheses && APP_DATA.theses && APP_DATA.theses.all) kpiTheses.textContent = APP_DATA.theses.all.length;
  if (kpiPubs && APP_DATA.publications) kpiPubs.textContent = APP_DATA.publications.length;
}

// 2. RESEARCH LINES
function renderHubLines() {
  const container = document.getElementById('hub-lines-container');
  if (!container || !APP_DATA.researchLines) return;

  container.innerHTML = APP_DATA.researchLines.map((line, idx) => {
    const img = line.image ? `assets${line.image}` : 'assets/images/mafld.jpg';
    return `
      <div class="hub-line-card">
        <img src="${img}" alt="${line.title}" class="hub-line-img" onerror="this.src='assets/images/mafld.jpg'" />
        <div class="hub-line-body">
          <span class="hub-line-badge">PROGRAMA 0${idx + 1}</span>
          <h3 class="hub-line-title">${line.title}</h3>
          <p class="hub-line-desc">${line.description || ''}</p>
          <div class="hub-btn-details" onclick="openHubLineDrawer(${idx})">
            <span>Explorar objetivos y traslación clínica</span>
            <i class="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.openHubLineDrawer = function(idx) {
  const line = APP_DATA.researchLines[idx];
  if (!line) return;

  const drawer = document.getElementById('hub-drawer');
  const backdrop = document.getElementById('hub-drawer-backdrop');
  const content = document.getElementById('hub-drawer-content');
  if (!drawer || !backdrop || !content) return;

  content.innerHTML = `
    <span class="hub-line-badge" style="margin-bottom:12px;">PROGRAMA ESTRATÉGICO 0${idx + 1}</span>
    <h2 style="font-size:1.5rem; font-weight:800; color:#FFFFFF; margin-bottom:14px; line-height:1.3;">
      ${line.title}
    </h2>
    <p style="font-size:0.92rem; color:var(--hub-text-muted); line-height:1.7; margin-bottom:24px;">
      ${line.description || ''}
    </p>

    ${line.objectives && line.objectives.length > 0 ? `
      <div style="background:rgba(255,255,255,0.03); border:1px solid var(--hub-border); border-radius:8px; padding:18px; margin-bottom:20px;">
        <h4 style="font-size:0.88rem; font-weight:700; color:var(--hub-emerald); text-transform:uppercase; margin-bottom:10px;">
          Objetivos de Investigación:
        </h4>
        <ul style="padding-left:18px; font-size:0.85rem; color:var(--hub-text-muted); display:flex; flex-direction:column; gap:8px;">
          ${line.objectives.map(o => `<li>${o}</li>`).join('')}
        </ul>
      </div>
    ` : ''}

    ${line.diseases && line.diseases.length > 0 ? `
      <div style="font-size:0.8rem; color:var(--hub-indigo); font-weight:600;">
        Impacto Patológico: ${line.diseases.join(' &bull; ')}
      </div>
    ` : ''}
  `;

  backdrop.classList.add('open');
  drawer.classList.add('open');
};

// 3. TEAM DIRECTORY WITH SLIDE-OVER INSPECTOR
let currentHubTeamFilter = 'all';

function renderHubTeam() {
  const container = document.getElementById('hub-team-container');
  const searchInput = document.getElementById('hub-team-search');
  if (!container || !APP_DATA.teamMembers) return;

  const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

  const filtered = APP_DATA.teamMembers.filter(m => {
    const matchQuery = !query ||
      m.name.toLowerCase().includes(query) ||
      (m.role && m.role.toLowerCase().includes(query));

    if (!matchQuery) return false;
    if (currentHubTeamFilter === 'all') return true;
    if (currentHubTeamFilter === 'cat' && m.role && m.role.toLowerCase().includes('catedrátic')) return true;
    if (currentHubTeamFilter === 'pi' && m.role && (m.role.toLowerCase().includes('coordinador') || m.role.toLowerCase().includes('investigador principal') || m.role.toLowerCase().includes('asociad') || m.role.toLowerCase().includes('adjunt'))) return true;
    if (currentHubTeamFilter === 'predoc' && m.role && (m.role.toLowerCase().includes('predoctoral') || m.role.toLowerCase().includes('fpi') || m.role.toLowerCase().includes('fpu'))) return true;
    if (currentHubTeamFilter === 'postdoc' && m.role && (m.role.toLowerCase().includes('postdoctoral') || m.role.toLowerCase().includes('ciberehd'))) return true;
    return true;
  });

  container.innerHTML = filtered.map(m => {
    const photo = m.image ? `assets${m.image}` : 'assets/images/team/patricia_aspichueta.jpg';
    return `
      <div class="hub-member-card" onclick="openHubMemberInspector('${m.id}')">
        <div class="hub-member-top">
          <img src="${photo}" alt="${m.name}" class="hub-member-avatar" onerror="this.src='assets/images/team/patricia_aspichueta.jpg'" />
          <div>
            <div class="hub-member-name">${m.name}</div>
            <div class="hub-member-role">${m.role || 'Investigador'}</div>
          </div>
        </div>
        <div class="hub-member-footer">
          <span>${m.publications ? `${m.publications.length} papers` : ''}</span>
          <span style="color:var(--hub-emerald); font-weight:600;">Ver CV &rarr;</span>
        </div>
      </div>
    `;
  }).join('');
}

window.setHubTeamFilter = function(filter, btn) {
  currentHubTeamFilter = filter;
  document.querySelectorAll('.hub-pill-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderHubTeam();
};

window.openHubMemberInspector = function(id) {
  const m = APP_DATA.teamMembers.find(item => item.id === id);
  if (!m) return;

  const drawer = document.getElementById('hub-drawer');
  const backdrop = document.getElementById('hub-drawer-backdrop');
  const content = document.getElementById('hub-drawer-content');
  if (!drawer || !backdrop || !content) return;

  const photo = m.image ? `assets${m.image}` : 'assets/images/team/patricia_aspichueta.jpg';

  content.innerHTML = `
    <div style="display:flex; gap:18px; align-items:center; margin-bottom:20px; border-bottom:1px solid var(--hub-border); padding-bottom:20px;">
      <img src="${photo}" style="width:72px; height:72px; border-radius:50%; object-fit:cover; border:2px solid var(--hub-emerald);" />
      <div>
        <h2 style="font-size:1.35rem; font-weight:700; color:#FFFFFF; margin-bottom:4px;">${m.name}</h2>
        <div style="font-size:0.85rem; color:var(--hub-emerald); font-weight:600;">${m.role || ''}</div>
        <div style="font-size:0.78rem; color:var(--hub-text-muted);">${m.affiliation || ''}</div>
        ${m.orcid ? `<div style="margin-top:6px;"><a href="https://orcid.org/${m.orcid}" target="_blank" style="font-family:var(--font-mono); font-size:0.75rem; color:#A6CE39;"><i class="fab fa-orcid"></i> ${m.orcid}</a></div>` : ''}
      </div>
    </div>

    ${m.bio ? `
      <div style="margin-bottom:24px;">
        <h4 style="font-size:0.85rem; text-transform:uppercase; color:var(--hub-text-muted); font-weight:700; margin-bottom:8px;">Perfil Científico</h4>
        <p style="font-size:0.88rem; color:var(--hub-text-muted); line-height:1.7;">${m.bio}</p>
      </div>
    ` : ''}

    ${m.directedTheses && m.directedTheses.length > 0 ? `
      <div style="margin-bottom:24px;">
        <h4 style="font-size:0.85rem; text-transform:uppercase; color:var(--hub-text-muted); font-weight:700; margin-bottom:10px;">Tesis Dirigidas (${m.directedTheses.length})</h4>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${m.directedTheses.map(t => `
            <div style="background:rgba(255,255,255,0.03); border:1px solid var(--hub-border); border-radius:6px; padding:10px; font-size:0.8rem;">
              <strong style="color:#FFFFFF;">${t.title}</strong> (${t.year})<br/>
              <span style="color:var(--hub-text-faint);">Doctorando/a: ${t.student}</span>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${m.publications && m.publications.length > 0 ? `
      <div>
        <h4 style="font-size:0.85rem; text-transform:uppercase; color:var(--hub-text-muted); font-weight:700; margin-bottom:10px;">Publicaciones Clave (${m.publications.length})</h4>
        <div style="display:flex; flex-direction:column; gap:8px; max-height:240px; overflow-y:auto;">
          ${m.publications.map(p => `
            <div style="background:rgba(255,255,255,0.03); border:1px solid var(--hub-border); border-radius:6px; padding:10px; font-size:0.8rem;">
              <div style="color:#FFFFFF; font-weight:600; margin-bottom:2px;">${p.title}</div>
              <div style="color:var(--hub-emerald); font-size:0.75rem;">${p.journal || ''} (${p.year || ''})</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;

  backdrop.classList.add('open');
  drawer.classList.add('open');
};

function initDrawerEvents() {
  const drawer = document.getElementById('hub-drawer');
  const backdrop = document.getElementById('hub-drawer-backdrop');
  const closeBtn = document.getElementById('hub-drawer-close');

  function close() {
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backdrop) backdrop.addEventListener('click', close);
}

// 4. THESES KANBAN BOARD
function renderHubKanban() {
  const ongoingStack = document.getElementById('hub-ongoing-theses');
  const completedStack = document.getElementById('hub-completed-theses');
  const ongoingCount = document.getElementById('hub-count-ongoing');
  const completedCount = document.getElementById('hub-count-completed');

  if (!APP_DATA.theses) return;

  const ongoing = APP_DATA.theses.ongoing || [];
  const completed = APP_DATA.theses.completed || [];

  if (ongoingCount) ongoingCount.textContent = ongoing.length;
  if (completedCount) completedCount.textContent = completed.length;

  if (ongoingStack) {
    ongoingStack.innerHTML = ongoing.map(t => `
      <div class="hub-thesis-card">
        <div class="hub-thesis-title">${t.title}</div>
        <div class="hub-thesis-meta">
          <strong>Doctorando/a:</strong> ${t.author || t.student || 'N/A'}<br/>
          <strong>Dirección:</strong> ${Array.isArray(t.directors) ? t.directors.join(', ') : (t.directors || 'N/A')}
        </div>
      </div>
    `).join('');
  }

  if (completedStack) {
    completedStack.innerHTML = completed.map(t => `
      <div class="hub-thesis-card">
        <div class="hub-thesis-title">${t.title}</div>
        <div class="hub-thesis-meta">
          <strong>Doctorando/a:</strong> ${t.author || t.student || 'N/A'} &bull; <strong>Año:</strong> ${t.year || t.defenseYear || 'N/A'}<br/>
          <span style="color:var(--hub-emerald); font-weight:600;">${t.grade || 'Sobresaliente Cum Laude'} ${t.mention ? `&bull; ${t.mention}` : ''}</span>
        </div>
      </div>
    `).join('');
  }
}

// 5. PUBLICATIONS HUB
function renderHubPublications() {
  const container = document.getElementById('hub-pubs-container');
  const countLabel = document.getElementById('hub-pubs-count');
  const searchInput = document.getElementById('hub-pubs-search');
  const yearPillsContainer = document.getElementById('hub-pubs-years');
  if (!container || !APP_DATA.publications) return;

  let activeYear = 'all';

  // Render Year Pills
  if (yearPillsContainer) {
    const years = ['all', ...new Set(APP_DATA.publications.map(p => p.year).filter(Boolean))].sort((a,b) => (b === 'all' ? -1 : (a === 'all' ? 1 : b - a)));
    yearPillsContainer.innerHTML = years.map(y => `
      <button class="hub-pill-btn ${y === 'all' ? 'active' : ''}" onclick="selectHubPubYear('${y}', this)">
        ${y === 'all' ? 'Todos' : y}
      </button>
    `).join('');
  }

  window.selectHubPubYear = function(y, btn) {
    activeYear = y;
    document.querySelectorAll('#hub-pubs-years .hub-pill-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    updatePubList();
  };

  function updatePubList() {
    const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

    const filtered = APP_DATA.publications.filter(p => {
      const matchYear = activeYear === 'all' || String(p.year) === String(activeYear);
      const matchQuery = !query ||
        (p.title && p.title.toLowerCase().includes(query)) ||
        (p.authors && p.authors.toLowerCase().includes(query)) ||
        (p.journal && p.journal.toLowerCase().includes(query));
      return matchYear && matchQuery;
    });

    if (countLabel) {
      countLabel.textContent = `${filtered.length} publicaciones encontradas`;
    }

    container.innerHTML = filtered.map(p => `
      <div class="hub-pub-card">
        <div class="hub-pub-main">
          <div class="hub-pub-title">${p.title}</div>
          <div class="hub-pub-authors">${p.authors || ''}</div>
          <div class="hub-pub-journal">${p.journal || ''} &bull; ${p.year || ''}</div>
        </div>
        <div class="hub-pub-actions">
          ${p.doi ? `
            <a href="https://doi.org/${p.doi}" target="_blank" class="hub-btn-doi">
              DOI &rarr;
            </a>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  if (searchInput) searchInput.addEventListener('input', updatePubList);
  updatePubList();
}

// 6. SCROLL SPY FOR SIDEBAR DOCK
function initHubScrollSpy() {
  const sections = document.querySelectorAll('.hub-sec');
  const navItems = document.querySelectorAll('.hub-nav-item');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });
}
