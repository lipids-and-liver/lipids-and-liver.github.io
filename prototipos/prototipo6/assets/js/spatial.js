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
      // Don't trigger slide change if clicking a button or link inside active card
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
      title.textContent = "Líneas de Investigación Estratégicas (IT1560-22)";
      body.innerHTML = APP_DATA.researchLines.map((l, i) => `
        <div style="border-bottom:1px solid var(--sp-border); padding-bottom:1.5rem; margin-bottom:1.5rem;">
          <span style="color:var(--sp-cyan); font-family:var(--sp-font-mono); font-size:0.75rem; font-weight:700; text-transform:uppercase;">0${i + 1} // ${l.badge}</span>
          <h4 style="font-size:1.25rem; color:#fff; margin:6px 0 8px; font-family:var(--sp-font-display);">${l.title}</h4>
          <p style="color:var(--sp-text-secondary); font-size:0.95rem; line-height:1.6; margin-bottom:10px;">${l.shortDesc}</p>
          <div style="color:var(--sp-text-muted); font-size:0.9rem; line-height:1.6;">${l.details}</div>
        </div>
      `).join('');
    } else if (mode === 'team') {
      title.textContent = "Personal Investigador y Docente";
      body.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1rem;">
          ${APP_DATA.teamMembers.map(m => `
            <div style="display:flex; align-items:center; gap:14px; padding:12px; background:rgba(255,255,255,0.03); border-radius:12px; border:1px solid var(--sp-border);">
              <img src="${m.image}" alt="${m.name}" style="width:52px; height:52px; border-radius:50%; object-fit:cover; border:2px solid var(--sp-cyan);" />
              <div style="flex-grow:1;">
                <h5 style="color:#fff; font-size:1rem; margin-bottom:2px; font-family:var(--sp-font-display);">${m.name}</h5>
                <div style="font-size:0.8rem; color:var(--sp-cyan); font-family:var(--sp-font-mono);">${m.role} [${m.category}]</div>
                <div style="font-size:0.75rem; color:var(--sp-text-muted);">${m.department}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (mode === 'theses') {
      title.textContent = "Tesis Doctorales Tutorizadas (15 Registros)";
      const allTheses = [...APP_DATA.theses.ongoing, ...APP_DATA.theses.completed];
      body.innerHTML = allTheses.map(t => `
        <div style="border-bottom:1px solid var(--sp-border); padding-bottom:1.25rem; margin-bottom:1.25rem;">
          <span style="font-size:0.7rem; font-family:var(--sp-font-mono); color:var(--sp-cyan); border:1px solid var(--sp-cyan); padding:2px 8px; border-radius:12px; background:var(--sp-cyan-glow);">${t.badge}</span>
          <h4 style="font-size:1.1rem; color:#fff; margin:8px 0; font-family:var(--sp-font-display);">"${t.title}"</h4>
          <div style="font-size:0.85rem; color:var(--sp-gold); margin-bottom:6px;">Doctorando/a: ${t.author} (${t.year})</div>
          <p style="font-size:0.88rem; color:var(--sp-text-muted); line-height:1.5;">${t.abstract}</p>
        </div>
      `).join('');
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
          <p>Dirección de contacto: <a href="mailto:patricia.aspichueta@ehu.eus" style="color:var(--sp-cyan); font-weight:600;">patricia.aspichueta@ehu.eus</a></p>
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
