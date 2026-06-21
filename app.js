(() => {
  const menuButton = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-nav-links]');
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
  }

  const heroScene = document.querySelector('[data-hero-scene]');
  if (heroScene && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('pointermove', (event) => {
      const x = ((event.clientX / window.innerWidth) - 0.5) * 7;
      const y = ((event.clientY / window.innerHeight) - 0.5) * 7;
      heroScene.style.setProperty('--scene-x', `${x}px`);
      heroScene.style.setProperty('--scene-y', `${y}px`);
    }, { passive: true });
  }

  const simulation = document.querySelector('[data-simulation]');
  if (simulation) {
    const phases = [
      { name: 'PRE-SURVEY', draft: 10.80, list: 0.00, fill: 8, lidar: 'SCANNING', crane: 'LOCKED', stability: 'ACTIVE' },
      { name: 'BALLAST-ADJ', draft: 11.35, list: 0.18, fill: 12, lidar: 'VERIFY', crane: 'STANDBY', stability: 'ACTIVE' },
      { name: 'CRANE-POS', draft: 11.72, list: 0.30, fill: 28, lidar: 'LOCKED', crane: 'POSITIONING', stability: 'ACTIVE' },
      { name: 'CARGO-LOAD', draft: 12.12, list: 0.62, fill: 68, lidar: 'WATCH', crane: 'LOADING', stability: 'ACTIVE' },
      { name: 'TRIM-CORR', draft: 12.38, list: 0.12, fill: 91, lidar: 'VERIFY', crane: 'CORRECTING', stability: 'ACTIVE' },
      { name: 'FINAL-SURV', draft: 12.45, list: 0.00, fill: 100, lidar: 'COMPLETE', crane: 'SECURED', stability: 'ACTIVE' }
    ];

    const rail = simulation.querySelector('[data-phase-rail]');
    const phaseName = simulation.querySelector('[data-phase-name]');
    const pauseButton = simulation.querySelector('[data-pause]');
    let current = 0;
    let paused = false;
    let timer;

    const text = (selector, value) => {
      const element = simulation.querySelector(selector);
      if (element) element.textContent = value;
    };

    const setCargo = (fill) => {
      const heights = [
        Math.min(42, fill * 0.42),
        Math.max(0, Math.min(42, (fill - 34) * 0.64)),
        Math.max(0, Math.min(42, (fill - 68) * 1.32))
      ];
      ['[data-cargo-a]', '[data-cargo-b]', '[data-cargo-c]'].forEach((selector, index) => {
        const element = simulation.querySelector(selector);
        if (!element) return;
        if (element instanceof SVGElement) {
          element.setAttribute('height', heights[index].toFixed(1));
          element.setAttribute('y', (282 - heights[index]).toFixed(1));
        } else {
          element.style.height = `${heights[index]}px`;
        }
      });
    };

    const renderRail = () => {
      rail.innerHTML = '';
      phases.forEach((phase, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `phase-button${index === current ? ' is-live' : ''}${index < current ? ' is-done' : ''}`;
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', String(index === current));
        const state = index < current ? 'DONE' : index === current ? 'LIVE' : 'QUEUED';
        button.innerHTML = `<strong>${phase.name}</strong><span class="phase-status">${state}</span>`;
        button.addEventListener('click', () => setPhase(index));
        rail.appendChild(button);
      });
    };

    const setPhase = (index) => {
      current = index;
      const phase = phases[index];
      phaseName.classList.add('is-changing');
      window.setTimeout(() => {
        phaseName.textContent = phase.name;
        phaseName.classList.remove('is-changing');
      }, 120);
      text('[data-t-phase]', phase.name);
      text('[data-t-draft]', phase.draft.toFixed(2));
      text('[data-t-list]', phase.list.toFixed(2));
      text('[data-t-fill]', String(phase.fill).padStart(2, '0'));
      text('[data-t-lidar]', phase.lidar);
      text('[data-t-crane]', phase.crane);
      text('[data-t-stability]', phase.stability);
      setCargo(phase.fill);
      renderRail();
    };

    const restartTimer = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => {
        if (!paused) setPhase((current + 1) % phases.length);
      }, 4200);
    };

    pauseButton.addEventListener('click', () => {
      paused = !paused;
      simulation.classList.toggle('simulation-paused', paused);
      pauseButton.textContent = paused ? 'Resume Simulation' : 'Pause Simulation';
      pauseButton.setAttribute('aria-pressed', String(paused));
    });

    setPhase(0);
    restartTimer();
  }

  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(contactForm);
      const subject = encodeURIComponent(`FREQ AI Architecture Request — ${form.get('projectType')}`);
      const body = encodeURIComponent([
        `Name / Company: ${form.get('name')}`,
        `Email: ${form.get('email')}`,
        `Project Type: ${form.get('projectType')}`,
        '',
        String(form.get('message'))
      ].join('\n'));
      window.location.href = `mailto:dre.freqsystem@outlook.com?subject=${subject}&body=${body}`;
    });
  }
})();
