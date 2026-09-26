/**
 * PROTOTIPO 4: SPLIT-SCREEN DUAL CURTAIN & KINETIC MONOLITH
 * Opposing Curtain Transition Logic & Synchronized Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initSplitScreen();
  initDrawer();
});

let currentSlide = 0;
const totalSlides = 5;
let isAnimating = false;

function initSplitScreen() {
  const leftPanels = document.querySelectorAll('.split-panel-left');
  const rightPanels = document.querySelectorAll('.split-panel-right');
  const counter = document.getElementById('split-counter-text');
  const btnPrev = document.getElementById('split-prev');
  const btnNext = document.getElementById('split-next');

  function goToSlide(target) {
    if (target < 0 || target >= totalSlides || isAnimating) return;
    isAnimating = true;

    // Left panels: slide up to previous or down to active
    leftPanels.forEach((panel, idx) => {
      panel.classList.remove('active', 'previous');
      if (idx === target) {
        panel.classList.add('active');
      } else if (idx < target) {
        panel.classList.add('previous');
      }
    });

    // Right panels: opposing curtain motion
    rightPanels.forEach((panel, idx) => {
      panel.classList.remove('active', 'previous');
      if (idx === target) {
        panel.classList.add('active');
      } else if (idx < target) {
        panel.classList.add('previous');
      }
    });

    currentSlide = target;

    if (counter) {
      counter.textContent = `0${currentSlide + 1} / 0${totalSlides}`;
    }

    setTimeout(() => {
      isAnimating = false;
    }, 850);
  }
  window.goToSlide = goToSlide;

  if (btnPrev) btnPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
  if (btnNext) btnNext.addEventListener('click', () => goToSlide(currentSlide + 1));

  // Wheel listener
  let wheelLock = null;
  window.addEventListener('wheel', (e) => {
    if (document.querySelector('.split-drawer-backdrop.active')) return;
    if (wheelLock) return;
    wheelLock = setTimeout(() => { wheelLock = null; }, 550);

    if (e.deltaY > 25) {
      goToSlide(currentSlide + 1);
    } else if (e.deltaY < -25) {
      goToSlide(currentSlide - 1);
    }
  }, { passive: true });

  // Key navigation
  window.addEventListener('keydown', (e) => {
    if (document.querySelector('.split-drawer-backdrop.active')) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault();
      goToSlide(currentSlide + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      goToSlide(currentSlide - 1);
    } else if (e.key >= '1' && e.key <= '5') {
      goToSlide(parseInt(e.key) - 1);
    }
  });

  // Touch Swipe
  let touchY = 0;
  window.addEventListener('touchstart', (e) => { touchY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchend', (e) => {
    if (document.querySelector('.split-drawer-backdrop.active')) return;
    const diff = touchY - e.changedTouches[0].clientY;
    if (diff > 50) goToSlide(currentSlide + 1);
    else if (diff < -50) goToSlide(currentSlide - 1);
  }, { passive: true });
}

function initDrawer() {
  const backdrop = document.getElementById('split-drawer');
  const closeBtn = document.getElementById('split-drawer-close');
  const title = document.getElementById('split-drawer-title');
  const body = document.getElementById('split-drawer-body');

  function openSplitModal(mode) {
    if (!backdrop || !body || !window.APP_DATA) return;

    if (mode === 'lines') {
      title.textContent = "Líneas de Investigación Estratégicas";
      body.innerHTML = APP_DATA.researchLines.map((l, i) => `
        <div style="border-bottom:1px solid var(--split-border); padding-bottom:1.5rem; margin-bottom:1.5rem;">
          <span style="color:var(--split-accent-emerald); font-size:0.75rem; font-weight:700; text-transform:uppercase;">0${i + 1} &bull; ${l.badge}</span>
          <h4 style="font-size:1.25rem; color:#fff; margin:6px 0 8px;">${l.title}</h4>
          <p style="color:var(--split-text-secondary); font-size:0.95rem; line-height:1.6; margin-bottom:10px;">${l.shortDesc}</p>
          <div style="color:var(--split-text-muted); font-size:0.9rem; line-height:1.6;">${l.details}</div>
        </div>
      `).join('');
    } else if (mode === 'team') {
      title.textContent = "Personal Investigador y Docente";
      body.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1rem;">
          ${APP_DATA.teamMembers.map(m => `
            <div style="display:flex; align-items:center; gap:14px; padding:12px; background:rgba(255,255,255,0.04); border-radius:6px; border:1px solid var(--split-border);">
              <img src="${m.image}" alt="${m.name}" style="width:50px; height:50px; border-radius:4px; object-fit:cover;" />
              <div style="flex-grow:1;">
                <h5 style="color:#fff; font-size:1rem; margin-bottom:2px;">${m.name}</h5>
                <div style="font-size:0.8rem; color:var(--split-accent-emerald);">${m.role} [${m.category}]</div>
                <div style="font-size:0.75rem; color:var(--split-text-muted);">${m.department}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (mode === 'theses') {
      title.textContent = "Repositorio Doctoral (15 Tesis)";
      const all = [...APP_DATA.theses.ongoing, ...APP_DATA.theses.completed];
      body.innerHTML = all.map(t => `
        <div style="border-bottom:1px solid var(--split-border); padding-bottom:1.25rem; margin-bottom:1.25rem;">
          <span style="font-size:0.75rem; color:var(--split-accent-cyan); border:1px solid var(--split-accent-cyan); padding:2px 6px; border-radius:2px;">${t.badge}</span>
          <h4 style="font-size:1.1rem; color:#fff; margin:6px 0;">"${t.title}"</h4>
          <div style="font-size:0.85rem; color:var(--split-text-secondary); margin-bottom:6px;">Doctorando/a: ${t.author} (${t.year})</div>
          <p style="font-size:0.88rem; color:var(--split-text-muted); line-height:1.5;">${t.abstract}</p>
        </div>
      `).join('');
    } else if (mode === 'contact') {
      title.textContent = "Contacto Institucional";
      body.innerHTML = `
        <div style="color:var(--split-text-secondary); line-height:1.8; font-size:1rem;">
          <h4 style="color:#fff;">Departamento de Fisiología &bull; UPV/EHU</h4>
          <p>Facultad de Medicina y Enfermería &bull; Barrio Sarriena s/n, 48940 Leioa</p>
          <hr style="border:none; border-top:1px solid var(--split-border); margin:1.5rem 0;" />
          <h4 style="color:#fff;">IIS Biocruces Bizkaia</h4>
          <p>Plaza de Cruces s/n, 48903 Barakaldo</p>
          <hr style="border:none; border-top:1px solid var(--split-border); margin:1.5rem 0;" />
          <p>Email: <a href="mailto:patricia.aspichueta@ehu.eus" style="color:var(--split-accent-emerald);">patricia.aspichueta@ehu.eus</a></p>
        </div>
      `;
    }

    backdrop.classList.add('active');
  }
  window.openSplitModal = openSplitModal;

  if (closeBtn) closeBtn.addEventListener('click', () => backdrop.classList.remove('active'));
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.remove('active');
    });
  }
}
