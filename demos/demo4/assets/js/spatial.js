/**
 * PROTOTIPO 6: SPATIAL 3D HORIZON & DEPTH PERSPECTIVE GALLERY
 * 3D Carousel Perspective Controller, Timeline Scrubber & Data Modal
 * Grupo Lipids & Liver (IT1560-22) - UPV/EHU & Biocruces
 */

document.addEventListener('DOMContentLoaded', () => {
  initSpatialGallery();
  initSpatialModal();
});

let currentSlide = 0;
const totalSlides = 5;
let isAnimating = false;

function initSpatialGallery() {
  const slides = document.querySelectorAll('.sp-card-slide');
  const steps = document.querySelectorAll('.sp-timeline-step');
  const prevBtn = document.getElementById('sp-prev-btn');
  const nextBtn = document.getElementById('sp-next-btn');

  function updateSlidePositions(target) {
    if (target < 0 || target >= totalSlides || isAnimating) return;
    isAnimating = true;

    currentSlide = target;

    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'prev-1', 'next-1', 'hidden-far');

      if (idx === currentSlide) {
        slide.classList.add('active');
      } else if (idx === currentSlide - 1) {
        slide.classList.add('prev-1');
      } else if (idx === currentSlide + 1) {
        slide.classList.add('next-1');
      } else {
        slide.classList.add('hidden-far');
      }
    });

    // Update timeline steps
    steps.forEach((step, idx) => {
      if (idx === currentSlide) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    setTimeout(() => {
      isAnimating = false;
    }, 750);
  }

  window.goToSlide = updateSlidePositions;

  // Click on flanking slides to navigate directly
  slides.forEach((slide, idx) => {
    slide.addEventListener('click', (e) => {
      if (slide.classList.contains('active')) return;
      if (slide.classList.contains('prev-1') || slide.classList.contains('next-1')) {
        updateSlidePositions(idx);
      }
    });
  });

  // Timeline Step Clicks
  steps.forEach((step, idx) => {
    step.addEventListener('click', () => updateSlidePositions(idx));
  });

  // Next / Prev Arrow Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => updateSlidePositions(currentSlide - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => updateSlidePositions(currentSlide + 1));
  }

  // Wheel Navigation (Debounced)
  let wheelTimeout = null;
  window.addEventListener('wheel', (e) => {
    if (document.querySelector('.sp-modal-backdrop.active')) return;
    if (wheelTimeout) return;
    wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 550);

    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (delta > 25) {
      updateSlidePositions(currentSlide + 1);
    } else if (delta < -25) {
      updateSlidePositions(currentSlide - 1);
    }
  }, { passive: true });

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (document.querySelector('.sp-modal-backdrop.active')) {
      if (e.key === 'Escape') {
        const modal = document.querySelector('.sp-modal-backdrop.active');
        if (modal) modal.classList.remove('active');
      }
      return;
    }

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault();
      updateSlidePositions(currentSlide + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      updateSlidePositions(currentSlide - 1);
    } else if (e.key >= '1' && e.key <= '5') {
      updateSlidePositions(parseInt(e.key) - 1);
    }
  });

  // Touch Navigation (Horizontal Swipe)
  let startX = 0;
  let startY = 0;
  window.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (document.querySelector('.sp-modal-backdrop.active')) return;
    const diffX = startX - e.changedTouches[0].clientX;
    const diffY = startY - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 45) {
        updateSlidePositions(currentSlide + 1);
      } else if (diffX < -45) {
        updateSlidePositions(currentSlide - 1);
      }
    }
  }, { passive: true });

  // Initialize first state
  updateSlidePositions(0);
}

function initSpatialModal() {
  const backdrop = document.getElementById('sp-modal');
  const closeBtn = document.getElementById('sp-modal-close');
  const title = document.getElementById('sp-modal-title');
  const body = document.getElementById('sp-modal-body');

  function openSpatialModal(mode) {
    if (!backdrop || !body || !window.APP_DATA) return;

    if (mode === 'lines') {
      title.textContent = "6 Líneas de Investigación Estratégicas (IT1560-22)";
      body.innerHTML = APP_DATA.researchLines.map((l, i) => `
        <div style="border-bottom:1px solid var(--sp-border); padding-bottom:1.5rem; margin-bottom:1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span style="color:var(--sp-cyan); font-family:var(--sp-font-mono); font-size:0.75rem; font-weight:700; text-transform:uppercase;">0${i + 1} // ${l.badge}</span>
          </div>
          <h4 style="font-size:1.25rem; color:#fff; margin:6px 0 8px; font-family:var(--sp-font-display);">${l.title}</h4>
          <p style="color:var(--sp-text-secondary); font-size:0.95rem; line-height:1.6; margin-bottom:10px;">${l.shortDesc}</p>
          <div style="color:var(--sp-text-muted); font-size:0.9rem; line-height:1.6; background:rgba(255,255,255,0.02); padding:1rem; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">${l.contentHtml || ''}</div>
        </div>
      `).join('');
    } else if (mode === 'team') {
      title.textContent = "Personal Investigador y Docente (23 Miembros)";
      body.innerHTML = `
        <div style="margin-bottom:1.5rem; display:flex; gap:8px; flex-wrap:wrap;">
          <span style="font-family:var(--sp-font-mono); font-size:0.75rem; color:var(--sp-cyan); padding:4px 10px; background:var(--sp-cyan-glow); border-radius:12px; border:1px solid var(--sp-cyan);">TODOS: 23</span>
          <span style="font-family:var(--sp-font-mono); font-size:0.75rem; color:var(--sp-gold); padding:4px 10px; background:rgba(229,192,123,0.1); border-radius:12px; border:1px solid var(--sp-gold);">PDI & SENIOR: 11</span>
          <span style="font-family:var(--sp-font-mono); font-size:0.75rem; color:#a78bfa; padding:4px 10px; background:rgba(167,139,250,0.1); border-radius:12px; border:1px solid #a78bfa);">PREDOCTORAL: 6</span>
          <span style="font-family:var(--sp-font-mono); font-size:0.75rem; color:var(--sp-emerald); padding:4px 10px; background:rgba(16,185,129,0.1); border-radius:12px; border:1px solid var(--sp-emerald);">POSDOCTORAL: 2</span>
          <span style="font-family:var(--sp-font-mono); font-size:0.75rem; color:#f472b6; padding:4px 10px; background:rgba(244,114,182,0.1); border-radius:12px; border:1px solid #f472b6);">TÉCNICOS: 2</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:1rem;">
          ${APP_DATA.teamMembers.map(m => `
            <div style="display:flex; align-items:flex-start; gap:14px; padding:14px; background:rgba(255,255,255,0.03); border-radius:12px; border:1px solid var(--sp-border);">
              <img src="${m.image}" alt="${m.name}" style="width:56px; height:56px; border-radius:8px; object-fit:cover; border:2px solid var(--sp-cyan); flex-shrink:0;" />
              <div style="flex-grow:1;">
                <div style="display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap; gap:6px;">
                  <h5 style="color:#fff; font-size:1.05rem; margin-bottom:2px; font-family:var(--sp-font-display);">${m.name}</h5>
                  <span style="font-size:0.72rem; color:var(--sp-cyan); font-family:var(--sp-font-mono);">${m.category}</span>
                </div>
                <div style="font-size:0.82rem; color:var(--sp-gold); margin-bottom:4px;">${m.role}</div>
                <div style="font-size:0.78rem; color:var(--sp-text-muted); line-height:1.4;">${m.department}</div>
                ${m.email ? `<div style="font-size:0.78rem; color:var(--sp-cyan); margin-top:4px;"><i class="fas fa-envelope"></i> ${m.email}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (mode === 'theses') {
      title.textContent = "Tesis Doctorales Tutorizadas (15 Registros)";
      const allTheses = APP_DATA.theses.all || [...APP_DATA.theses.ongoing, ...APP_DATA.theses.completed];
      body.innerHTML = `
        <div style="margin-bottom:1.5rem; display:flex; gap:8px;">
          <span style="font-family:var(--sp-font-mono); font-size:0.75rem; color:var(--sp-cyan); padding:4px 10px; background:var(--sp-cyan-glow); border-radius:12px; border:1px solid var(--sp-cyan);">EN CURSO: ${APP_DATA.theses.ongoing.length}</span>
          <span style="font-family:var(--sp-font-mono); font-size:0.75rem; color:var(--sp-emerald); padding:4px 10px; background:rgba(16,185,129,0.1); border-radius:12px; border:1px solid var(--sp-emerald);">DEFENDIDAS: ${APP_DATA.theses.completed.length}</span>
        </div>
        <div>
          ${allTheses.map(t => `
            <div style="border-bottom:1px solid var(--sp-border); padding-bottom:1.25rem; margin-bottom:1.25rem;">
              <span style="font-size:0.7rem; font-family:var(--sp-font-mono); color:${t.status === 'ongoing' ? 'var(--sp-cyan)' : 'var(--sp-emerald)'}; border:1px solid ${t.status === 'ongoing' ? 'var(--sp-cyan)' : 'var(--sp-emerald)'}; padding:2px 8px; border-radius:12px; background:rgba(255,255,255,0.03);">
                ${t.status === 'ongoing' ? 'EN CURSO' : 'DEFENDIDA'} &bull; ${t.year}
              </span>
              <h4 style="font-size:1.1rem; color:#fff; margin:8px 0; font-family:var(--sp-font-display);">"${t.title}"</h4>
              <div style="font-size:0.85rem; color:var(--sp-gold); margin-bottom:6px;">Doctorando/a: ${t.author} &bull; Dirección: ${Array.isArray(t.directors) ? t.directors.join(', ') : t.directors}</div>
              <p style="font-size:0.88rem; color:var(--sp-text-muted); line-height:1.5;">${t.abstract || ''}</p>
            </div>
          `).join('')}
        </div>
      `;
    } else if (mode === 'pubs') {
      title.textContent = `Catálogo Científico JCR (${APP_DATA.publications.length} Artículos)`;
      body.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          ${APP_DATA.publications.slice(0, 30).map((p, idx) => `
            <div style="border-bottom:1px solid var(--sp-border); padding-bottom:1rem;">
              <div style="display:flex; justify-content:space-between; align-items:baseline;">
                <span style="font-family:var(--sp-font-mono); font-size:0.75rem; color:var(--sp-cyan);">#${idx + 1} // ${p.year}</span>
                <span style="font-size:0.72rem; color:var(--sp-gold); text-transform:uppercase; font-family:var(--sp-font-mono);">${p.topic}</span>
              </div>
              <h5 style="color:#fff; font-size:1rem; margin:4px 0 6px; font-family:var(--sp-font-display);">${p.title}</h5>
              <div style="font-size:0.82rem; color:var(--sp-text-secondary); margin-bottom:4px;"><strong>${p.authors}</strong> &bull; <em>${p.journal}</em></div>
              <a href="https://doi.org/${p.doi}" target="_blank" rel="noopener" style="font-size:0.78rem; color:var(--sp-cyan); text-decoration:none; font-family:var(--sp-font-mono);">
                DOI: ${p.doi} <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          `).join('')}
          <div style="text-align:center; padding-top:1rem; color:var(--sp-text-muted); font-size:0.85rem;">
            Mostrando 30 artículos destacados de los ${APP_DATA.publications.length} indexados en el portal.
          </div>
        </div>
      `;
    } else if (mode === 'training') {
      title.textContent = "Formación y Docencia Universitaria Oficial";
      body.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          ${(APP_DATA.training || []).map(tr => `
            <div style="background:rgba(255,255,255,0.03); border:1px solid var(--sp-border); border-radius:12px; padding:1.25rem;">
              <span style="font-family:var(--sp-font-mono); font-size:0.72rem; color:var(--sp-cyan); text-transform:uppercase;">${tr.type} // ${tr.badge}</span>
              <h4 style="color:#fff; font-size:1.15rem; margin:6px 0 8px; font-family:var(--sp-font-display);">${tr.title}</h4>
              <div style="font-size:0.85rem; color:var(--sp-gold); margin-bottom:8px;">${tr.institution}</div>
              <div style="font-size:0.9rem; color:var(--sp-text-secondary); line-height:1.6;">${tr.contentHtml}</div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (mode === 'contact') {
      title.textContent = "Sedes & Contacto Institucional";
      body.innerHTML = `
        <div style="color:var(--sp-text-secondary); line-height:1.8; font-size:1rem;">
          <h4 style="color:#fff; font-family:var(--sp-font-display); font-size:1.2rem; margin-bottom:4px;">Facultad de Medicina y Enfermería &bull; UPV/EHU</h4>
          <p style="color:var(--sp-text-muted); margin-bottom:1.25rem;">Departamento de Fisiología &bull; Barrio Sarriena s/n, 48940 Leioa (Bizkaia)</p>
          <hr style="border:none; border-top:1px solid var(--sp-border); margin:1.25rem 0;" />
          <h4 style="color:#fff; font-family:var(--sp-font-display); font-size:1.2rem; margin-bottom:4px;">IIS Biocruces Bizkaia</h4>
          <p style="color:var(--sp-text-muted); margin-bottom:1.25rem;">Área de Endocrinología, Metabolismo y Nutrición &bull; Plaza de Cruces s/n, 48903 Barakaldo</p>
          <hr style="border:none; border-top:1px solid var(--sp-border); margin:1.25rem 0;" />
          <h4 style="color:#fff; font-family:var(--sp-font-display); font-size:1.2rem; margin-bottom:4px;">Coordinación Principal</h4>
          <p>Dra. Patricia Aspichueta Celaá &bull; <a href="mailto:patricia.aspichueta@ehu.eus" style="color:var(--sp-cyan); font-weight:600;">patricia.aspichueta@ehu.eus</a></p>
        </div>
      `;
    }

    backdrop.classList.add('active');
  }

  window.openSpatialModal = openSpatialModal;

  if (closeBtn) {
    closeBtn.addEventListener('click', () => backdrop.classList.remove('active'));
  }
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.remove('active');
    });
  }
}
