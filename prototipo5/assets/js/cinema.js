/**
 * PROTOTIPO 5: CINEMATIC STORYTELLING & FLUID TRANSITIONS DECK
 * Deck Controller, 60fps Transitions, Canvas Particles & Drawer System
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initDeck();
  initPillars();
  initDrawer();
});

/* ==========================================================================
   INTERACTIVE CANVAS PARTICLES (LIPID VESICLE SIMULATION)
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = 45;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  let mouseX = width / 2;
  let mouseY = height / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse influence
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        p.x -= dx * 0.01;
        p.y -= dy * 0.01;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 245, 155, ${p.alpha})`;
      ctx.fill();

      // Connect close particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist2 < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 210, 255, ${0.15 * (1 - dist2 / 100)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   DECK CONTROLLER (FLUID CHAPTER NAVIGATION)
   ========================================================================== */
let currentChapter = 0;
const totalChapters = 5;
let isAnimating = false;

function initDeck() {
  const chapters = document.querySelectorAll('.cinema-chapter');
  const dots = document.querySelectorAll('.rail-dot');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const btnPrev = document.getElementById('deck-prev');
  const btnNext = document.getElementById('deck-next');

  function updateDeck(targetIdx) {
    if (targetIdx < 0 || targetIdx >= totalChapters || isAnimating) return;
    isAnimating = true;

    chapters.forEach((ch, idx) => {
      ch.classList.remove('active', 'previous');
      if (idx === targetIdx) {
        ch.classList.add('active');
      } else if (idx < targetIdx) {
        ch.classList.add('previous');
      }
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === targetIdx);
    });

    currentChapter = targetIdx;

    if (progressFill) {
      const pct = ((currentChapter + 1) / totalChapters) * 100;
      progressFill.style.width = `${pct}%`;
    }

    if (progressText) {
      progressText.textContent = `0${currentChapter + 1} / 0${totalChapters}`;
    }

    // Cooldown
    setTimeout(() => {
      isAnimating = false;
    }, 750);
  }
  window.updateDeck = updateDeck;

  // Arrow controls
  if (btnPrev) btnPrev.addEventListener('click', () => updateDeck(currentChapter - 1));
  if (btnNext) btnNext.addEventListener('click', () => updateDeck(currentChapter + 1));

  // Rail dot clicks
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => updateDeck(idx));
  });

  // Wheel listener with lock
  let wheelTimeout = null;
  window.addEventListener('wheel', (e) => {
    // Ignore if drawer is open
    if (document.querySelector('.cinema-drawer-backdrop.active')) return;

    if (wheelTimeout) return;
    wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 500);

    if (e.deltaY > 25) {
      updateDeck(currentChapter + 1);
    } else if (e.deltaY < -25) {
      updateDeck(currentChapter - 1);
    }
  }, { passive: true });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (document.querySelector('.cinema-drawer-backdrop.active')) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault();
      updateDeck(currentChapter + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      updateDeck(currentChapter - 1);
    } else if (e.key >= '1' && e.key <= '5') {
      updateDeck(parseInt(e.key) - 1);
    }
  });

  // Touch Swipe
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (document.querySelector('.cinema-drawer-backdrop.active')) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    if (diff > 50) {
      updateDeck(currentChapter + 1);
    } else if (diff < -50) {
      updateDeck(currentChapter - 1);
    }
  }, { passive: true });
}

/* ==========================================================================
   PILLAR SELECTOR DECK (CHAPTER 02)
   ========================================================================== */
function initPillars() {
  const pillars = document.querySelectorAll('.pillar-card');
  const focalTitle = document.getElementById('pillar-focal-title');
  const focalDesc = document.getElementById('pillar-focal-desc');
  const focalImg = document.getElementById('pillar-focal-img');

  const data = [
    {
      title: "Esteatohepatitis Metabólica (MAFLD / MASH)",
      desc: "Análisis longitudinal de la lipotoxicidad y perfiles de fosfolípidos que impulsan el paso de esteatosis simple a cirrosis hepática.",
      img: "assets/images/mafld.jpg"
    },
    {
      title: "Reprogramación en Hepatocarcinoma & Colangiocarcinoma",
      desc: "Dianas en la desaturación de ácidos grasos (SCD1) y caracterización de biomarcadores plasmáticos en pacientes oncológicos.",
      img: "assets/images/cancer.jpg"
    },
    {
      title: "Regulación Génica & Factores de Transcripción E2F",
      desc: "Papel central de E2F1 y E2F2 en el estrés de retículo, regeneración celular post-daño tisular y homeostasis lipídica.",
      img: "assets/images/e2f.jpg"
    },
    {
      title: "Unidad de Lipidómica Avanzada SGIker",
      desc: "Espectrometría de masas UHPLC-MS/MS para cuantificación absoluta de lípidos en matrices biológicas y colaboración internacional.",
      img: "assets/images/lipidomics.jpg"
    }
  ];

  pillars.forEach((card, idx) => {
    card.addEventListener('click', () => {
      pillars.forEach(p => p.classList.remove('active'));
      card.classList.add('active');

      if (focalTitle) focalTitle.textContent = data[idx].title;
      if (focalDesc) focalDesc.textContent = data[idx].desc;
      if (focalImg) focalImg.src = data[idx].img;
    });
  });
}

/* ==========================================================================
   SLIDE-OVER DRAWER CONTROLLER
   ========================================================================== */
function initDrawer() {
  const backdrop = document.getElementById('cinema-drawer');
  const closeBtn = document.getElementById('drawer-close');
  const content = document.getElementById('drawer-body');
  const title = document.getElementById('drawer-title');

  function openDrawer(mode) {
    if (!backdrop || !content || !window.APP_DATA) return;

    if (mode === 'lines') {
      title.textContent = "Líneas de Investigación Estratégicas";
      content.innerHTML = APP_DATA.researchLines.map((l, i) => `
        <div style="border-bottom:1px solid var(--cinema-border); padding-bottom:1.5rem; margin-bottom:1.5rem;">
          <div style="color:var(--cinema-mint); font-family:var(--cinema-font-display); font-size:0.8rem; margin-bottom:4px;">LÍNEA 0${i + 1} &bull; ${l.badge}</div>
          <h4 style="font-size:1.2rem; color:#fff; margin-bottom:8px;">${l.title}</h4>
          <p style="color:var(--cinema-text-secondary); font-size:0.95rem; line-height:1.6; margin-bottom:1rem;">${l.shortDesc}</p>
          <div style="color:var(--cinema-text-muted); font-size:0.9rem; line-height:1.6;">${l.details}</div>
        </div>
      `).join('');
    } else if (mode === 'team') {
      title.textContent = "Equipo de Investigación Completo";
      content.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          ${APP_DATA.teamMembers.map(m => `
            <div style="display:flex; align-items:center; gap:16px; padding:12px; background:rgba(255,255,255,0.03); border-radius:12px; border:1px solid var(--cinema-border);">
              <img src="${m.image}" alt="${m.name}" style="width:54px; height:54px; border-radius:50%; object-fit:cover; border:1px solid var(--cinema-mint);" />
              <div style="flex-grow:1;">
                <h5 style="font-size:1.05rem; color:#fff; margin-bottom:2px;">${m.name}</h5>
                <div style="font-size:0.8rem; color:var(--cinema-mint);">${m.role}</div>
                <div style="font-size:0.75rem; color:var(--cinema-text-muted);">${m.department}</div>
              </div>
              <a href="../curriculum.html?id=${m.id}" target="_blank" style="color:var(--cinema-cyan); font-size:0.8rem; text-decoration:none; padding:4px 8px; border:1px solid var(--cinema-cyan); border-radius:12px;">CV <i class="fas fa-external-link-alt"></i></a>
            </div>
          `).join('')}
        </div>
      `;
    } else if (mode === 'theses') {
      title.textContent = "Repositorio Doctoral (15 Tesis)";
      const all = [...APP_DATA.theses.ongoing, ...APP_DATA.theses.completed];
      content.innerHTML = all.map(t => `
        <div style="border-bottom:1px solid var(--cinema-border); padding-bottom:1.25rem; margin-bottom:1.25rem;">
          <span style="font-size:0.75rem; color:var(--cinema-cyan); border:1px solid var(--cinema-cyan); padding:2px 6px; border-radius:4px;">${t.badge}</span>
          <h4 style="font-size:1.1rem; color:#fff; margin:8px 0 4px;">"${t.title}"</h4>
          <div style="font-size:0.85rem; color:var(--cinema-text-secondary); margin-bottom:6px;">Doctorando/a: <strong>${t.author}</strong> (${t.year})</div>
          <p style="font-size:0.88rem; color:var(--cinema-text-muted); line-height:1.5;">${t.abstract}</p>
        </div>
      `).join('');
    } else if (mode === 'contact') {
      title.textContent = "Sede y Enlace Académico";
      content.innerHTML = `
        <div style="color:var(--cinema-text-secondary); line-height:1.7; font-size:1rem;">
          <h4 style="color:#fff; margin-bottom:8px;">Departamento de Fisiología</h4>
          <p>Facultad de Medicina y Enfermería &bull; Universidad del País Vasco (UPV/EHU)<br />Barrio Sarriena s/n, 48940 Leioa, Bizkaia</p>
          <hr style="border:none; border-top:1px solid var(--cinema-border); margin:1.5rem 0;" />
          <h4 style="color:#fff; margin-bottom:8px;">Instituto Biocruces Bizkaia</h4>
          <p>Plaza de Cruces s/n, 48903 Barakaldo, Bizkaia</p>
          <hr style="border:none; border-top:1px solid var(--cinema-border); margin:1.5rem 0;" />
          <h4 style="color:#fff; margin-bottom:8px;">Contacto Principal</h4>
          <p>Dra. Patricia Aspichueta Celaá<br /><a href="mailto:patricia.aspichueta@ehu.eus" style="color:var(--cinema-mint);">patricia.aspichueta@ehu.eus</a></p>
        </div>
      `;
    }

    backdrop.classList.add('active');
  }
  window.openDrawer = openDrawer;

  if (closeBtn) closeBtn.addEventListener('click', () => backdrop.classList.remove('active'));
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.remove('active');
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop) backdrop.classList.remove('active');
  });
}
