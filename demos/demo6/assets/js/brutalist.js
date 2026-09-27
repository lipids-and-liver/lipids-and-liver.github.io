/**
 * DEMO 6: NEO-BRUTALIST ACADEMIC & TECHNICAL MONOSPACE GRID
 * Interactive engine for technical data presentation and search queries.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof APP_DATA === 'undefined') {
    console.error('APP_DATA not found');
    return;
  }

  renderBrutalLines();
  renderBrutalTeam();
  renderBrutalTheses();
  renderBrutalPublications();
  initBrutalModal();
});

// 1. RESEARCH LINES
function renderBrutalLines() {
  const container = document.getElementById('brutal-lines-container');
  if (!container || !APP_DATA.researchLines) return;

  container.innerHTML = APP_DATA.researchLines.map((line, idx) => {
    const img = line.image ? `assets${line.image}` : 'assets/images/mafld.jpg';
    return `
      <div class="brutal-line-card">
        <img src="${img}" alt="${line.title}" class="brutal-line-img" onerror="this.src='assets/images/mafld.jpg'" />
        <div class="brutal-line-body">
          <div class="brutal-line-badge">[LINE_0${idx + 1}]</div>
          <h3 class="brutal-line-title">${line.title}</h3>
          <p class="brutal-line-desc">${line.description || ''}</p>
          <button class="brutal-btn-line-more" onclick="openLineModal(${idx})">
            <span>[SPECIFICATION_DATA]</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.openLineModal = function(idx) {
  const line = APP_DATA.researchLines[idx];
  if (!line) return;

  const modalBackdrop = document.getElementById('brutal-modal-backdrop');
  const modalContent = document.getElementById('brutal-modal-content');
  if (!modalBackdrop || !modalContent) return;

  modalContent.innerHTML = `
    <div style="font-family:var(--font-mono); font-size:0.8rem; background:var(--brutal-yellow); padding:4px 8px; border:1px solid var(--brutal-border); display:inline-block; margin-bottom:12px; font-weight:700;">
      [PROJECT_ID // LINE_0${idx + 1}]
    </div>
    <h2 style="font-family:var(--font-display); font-size:1.8rem; font-weight:800; text-transform:uppercase; margin-bottom:16px;">
      ${line.title}
    </h2>
    <p style="font-size:1rem; color:var(--brutal-muted); margin-bottom:24px; line-height:1.6;">
      ${line.description || ''}
    </p>

    ${line.objectives && line.objectives.length > 0 ? `
      <div style="border:2px solid var(--brutal-border); background:var(--brutal-bg); padding:18px; margin-bottom:20px; box-shadow:3px 3px 0px var(--brutal-border);">
        <h4 style="font-family:var(--font-mono); font-size:0.85rem; font-weight:700; text-transform:uppercase; margin-bottom:10px;">
          // PROTOCOL_OBJECTIVES
        </h4>
        <ul style="padding-left:20px; font-size:0.9rem; display:flex; flex-direction:column; gap:6px;">
          ${line.objectives.map(obj => `<li>${obj}</li>`).join('')}
        </ul>
      </div>
    ` : ''}

    ${line.diseases && line.diseases.length > 0 ? `
      <div style="font-family:var(--font-mono); font-size:0.8rem; color:var(--brutal-blue); font-weight:700;">
        TARGET_PATHOLOGY: ${line.diseases.join(' // ')}
      </div>
    ` : ''}
  `;

  modalBackdrop.classList.add('open');
};

// 2. TEAM ROSTER
let brutalTeamFilter = 'all';

function renderBrutalTeam() {
  const container = document.getElementById('brutal-team-container');
  const searchInput = document.getElementById('brutal-team-search');
  if (!container || !APP_DATA.teamMembers) return;

  const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

  const filtered = APP_DATA.teamMembers.filter(m => {
    const matchQuery = !query ||
      m.name.toLowerCase().includes(query) ||
      (m.role && m.role.toLowerCase().includes(query));

    if (!matchQuery) return false;
    if (brutalTeamFilter === 'all') return true;
    if (brutalTeamFilter === 'cat' && m.role && m.role.toLowerCase().includes('catedrátic')) return true;
    if (brutalTeamFilter === 'pi' && m.role && (m.role.toLowerCase().includes('coordinador') || m.role.toLowerCase().includes('investigador principal') || m.role.toLowerCase().includes('asociad') || m.role.toLowerCase().includes('adjunt'))) return true;
    if (brutalTeamFilter === 'predoc' && m.role && (m.role.toLowerCase().includes('predoctoral') || m.role.toLowerCase().includes('fpi') || m.role.toLowerCase().includes('fpu'))) return true;
    if (brutalTeamFilter === 'postdoc' && m.role && (m.role.toLowerCase().includes('postdoctoral') || m.role.toLowerCase().includes('ciberehd'))) return true;
    return true;
  });

  container.innerHTML = filtered.map(m => {
    const photo = m.image ? `assets${m.image}` : 'assets/images/team/patricia_aspichueta.jpg';
    return `
      <div class="brutal-member-card">
        <img src="${photo}" alt="${m.name}" class="brutal-member-photo" onerror="this.src='assets/images/team/patricia_aspichueta.jpg'" />
        <div class="brutal-member-info">
          <div class="brutal-member-name">${m.name}</div>
          <div class="brutal-member-role">${m.role || 'Investigador'}</div>
          <button class="brutal-btn-cv" onclick="openBrutalMemberModal('${m.id}')">[VIEW_FILE]</button>
        </div>
      </div>
    `;
  }).join('');
}

window.setBrutalTeamFilter = function(filter, btn) {
  brutalTeamFilter = filter;
  document.querySelectorAll('.brutal-filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderBrutalTeam();
};

window.openBrutalMemberModal = function(id) {
  const m = APP_DATA.teamMembers.find(item => item.id === id);
  if (!m) return;

  const modalBackdrop = document.getElementById('brutal-modal-backdrop');
  const modalContent = document.getElementById('brutal-modal-content');
  if (!modalBackdrop || !modalContent) return;

  const photo = m.image ? `assets${m.image}` : 'assets/images/team/patricia_aspichueta.jpg';

  modalContent.innerHTML = `
    <div style="display:flex; gap:20px; align-items:center; border-bottom:2px solid var(--brutal-border); padding-bottom:16px; margin-bottom:20px;">
      <img src="${photo}" style="width:80px; height:80px; object-fit:cover; border:2px solid var(--brutal-border); box-shadow:3px 3px 0px var(--brutal-border);" />
      <div>
        <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--brutal-blue); font-weight:700;">// PERSONNEL_ID: ${m.id}</div>
        <h2 style="font-family:var(--font-display); font-size:1.6rem; font-weight:800; text-transform:uppercase;">${m.name}</h2>
        <div style="font-family:var(--font-mono); font-size:0.8rem; font-weight:700;">${m.role || ''} &bull; ${m.affiliation || ''}</div>
        ${m.orcid ? `<div style="margin-top:6px;"><a href="https://orcid.org/${m.orcid}" target="_blank" style="font-family:var(--font-mono); font-size:0.75rem; background:var(--brutal-neon); color:var(--brutal-black); padding:2px 6px; border:1px solid var(--brutal-border); font-weight:700;">ORCID: ${m.orcid}</a></div>` : ''}
      </div>
    </div>

    ${m.bio ? `
      <div style="margin-bottom:20px;">
        <h4 style="font-family:var(--font-mono); font-size:0.85rem; font-weight:700; text-transform:uppercase; margin-bottom:6px;">// BIO_SUMMARY</h4>
        <p style="font-size:0.9rem; color:var(--brutal-muted);">${m.bio}</p>
      </div>
    ` : ''}

    ${m.directedTheses && m.directedTheses.length > 0 ? `
      <div style="margin-bottom:20px; border:2px solid var(--brutal-border); background:var(--brutal-bg); padding:16px;">
        <h4 style="font-family:var(--font-mono); font-size:0.85rem; font-weight:700; text-transform:uppercase; margin-bottom:8px;">// DIRECTED_THESES (${m.directedTheses.length})</h4>
        <ul style="padding-left:18px; font-size:0.85rem; display:flex; flex-direction:column; gap:6px;">
          ${m.directedTheses.map(t => `<li><strong>${t.title}</strong> (${t.year}) - Doctorando/a: ${t.student}</li>`).join('')}
        </ul>
      </div>
    ` : ''}

    ${m.publications && m.publications.length > 0 ? `
      <div>
        <h4 style="font-family:var(--font-mono); font-size:0.85rem; font-weight:700; text-transform:uppercase; margin-bottom:8px;">// INDEXED_ARTICLES (${m.publications.length})</h4>
        <div style="max-height:240px; overflow-y:auto; display:flex; flex-direction:column; gap:8px;">
          ${m.publications.map(p => `
            <div style="border:1px solid var(--brutal-border); background:var(--brutal-surface); padding:8px 12px; font-size:0.8rem;">
              <strong>${p.title}</strong>
              <div style="font-family:var(--font-mono); font-size:0.75rem; color:var(--brutal-muted); margin-top:2px;">${p.journal || ''} (${p.year || ''})</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;

  modalBackdrop.classList.add('open');
};

// 3. THESES ARCHIVE
function renderBrutalTheses() {
  const container = document.getElementById('brutal-theses-container');
  if (!container || !APP_DATA.theses) return;

  const allTheses = APP_DATA.theses.all || [];

  container.innerHTML = allTheses.map(t => {
    const isOngoing = t.status === 'ongoing' || !t.defenseYear || t.year === 'En curso';
    return `
      <div class="brutal-thesis-row">
        <div class="brutal-thesis-status ${isOngoing ? 'status-ongoing' : 'status-defended'}">
          ${isOngoing ? '[EN_CURSO]' : `[DEFENDIDA_${t.year || t.defenseYear}]`}
        </div>
        <div>
          <div class="brutal-thesis-title">${t.title}</div>
          <div class="brutal-thesis-authors">
            <strong>Doctorando/a:</strong> ${t.author || t.student || 'N/A'} &bull;
            <strong>Dirección:</strong> ${Array.isArray(t.directors) ? t.directors.join(', ') : (t.directors || 'N/A')}
          </div>
        </div>
        <div style="font-family:var(--font-mono); font-size:0.72rem; text-align:right; font-weight:700;">
          ${t.mention || (isOngoing ? 'PROG. DOCTORADO' : 'CUM LAUDE')}
        </div>
      </div>
    `;
  }).join('');
}

// 4. PUBLICATIONS TERMINAL
function renderBrutalPublications() {
  const container = document.getElementById('brutal-pubs-container');
  const countLabel = document.getElementById('brutal-pub-count');
  const searchInput = document.getElementById('brutal-pub-search');
  const yearSelect = document.getElementById('brutal-pub-year');
  if (!container || !APP_DATA.publications) return;

  // Fill Year dropdown
  if (yearSelect && yearSelect.options.length <= 1) {
    const years = [...new Set(APP_DATA.publications.map(p => p.year).filter(Boolean))].sort((a,b) => b - a);
    years.forEach(y => {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = `AÑO ${y}`;
      yearSelect.appendChild(opt);
    });
  }

  function updatePubs() {
    const q = (searchInput ? searchInput.value : '').toLowerCase().trim();
    const yr = yearSelect ? yearSelect.value : 'all';

    const filtered = APP_DATA.publications.filter(p => {
      const matchYear = yr === 'all' || String(p.year) === String(yr);
      const matchQuery = !q ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.authors && p.authors.toLowerCase().includes(q)) ||
        (p.journal && p.journal.toLowerCase().includes(q));
      return matchYear && matchQuery;
    });

    if (countLabel) {
      countLabel.textContent = `[QUERY_RESULT: ${filtered.length} / ${APP_DATA.publications.length} ITEMS MATCHED]`;
    }

    container.innerHTML = filtered.map(p => `
      <div class="brutal-pub-item">
        <div class="brutal-pub-title">${p.title}</div>
        <div style="font-size:0.82rem; color:var(--brutal-muted);">${p.authors || ''}</div>
        <div class="brutal-pub-meta">
          <span><strong>${p.journal || ''}</strong> &bull; ${p.year || ''}</span>
          ${p.doi ? `<a href="https://doi.org/${p.doi}" target="_blank" class="brutal-pub-doi">DOI: ${p.doi} &rarr;</a>` : ''}
        </div>
      </div>
    `).join('');
  }

  if (searchInput) searchInput.addEventListener('input', updatePubs);
  if (yearSelect) yearSelect.addEventListener('change', updatePubs);

  updatePubs();
}

function initBrutalModal() {
  const modalBackdrop = document.getElementById('brutal-modal-backdrop');
  const closeBtn = document.querySelector('.brutal-modal-close');
  if (closeBtn && modalBackdrop) {
    closeBtn.addEventListener('click', () => modalBackdrop.classList.remove('open'));
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
    });
  }
}
