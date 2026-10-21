(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
      nav.classList.toggle('is-open', !open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
    }));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const revealTargets = document.querySelectorAll('.section-kicker, .signal-intro, .project-object, .about-content, .manifesto, .contact-inner > *');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  // The space reacts gently to pointer movement and scroll, without blocking page interaction.
  const world = document.querySelector('.hero-world');
  const object = document.querySelector('.world-object');
  const grid = document.querySelector('.world-grid');
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let scrollY = window.scrollY || 0;
  let ticking = false;

  if (window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
    document.body.classList.add('has-pointer');
    window.addEventListener('pointermove', event => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
      targetX = pointerX;
      targetY = pointerY;
      const aura = document.querySelector('.cursor-aura');
      if (aura) {
        aura.style.left = event.clientX + 'px';
        aura.style.top = event.clientY + 'px';
      }
    }, { passive: true });

    const animateWorld = () => {
      ticking = false;
      if (world && object && grid) {
        const bounds = world.getBoundingClientRect();
        const visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
        if (visible) {
          const x = targetX * 11;
          const y = targetY * 9;
          object.style.transform = 'translate(calc(-50% + ' + x + 'px), calc(-50% + ' + y + 'px)) rotateX(' + (-targetY * 3) + 'deg) rotateY(' + (targetX * 4) + 'deg)';
          grid.style.transform = 'perspective(500px) rotateX(' + (58 + targetY * 2) + 'deg) rotateZ(' + (-22 + targetX * 2) + 'deg) scale(1.45) translate(' + (targetX * -7) + 'px,' + (targetY * -7) + 'px)';
        }
      }
    };
    window.addEventListener('pointermove', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(animateWorld);
      }
    }, { passive: true });
  }

  let scrollFrame = false;
  const onScroll = () => {
    scrollY = window.scrollY || 0;
    if (scrollFrame) return;
    scrollFrame = true;
    requestAnimationFrame(() => {
      const hero = document.querySelector('.hero');
      if (hero && !reduceMotion) {
        const progress = Math.min(scrollY / Math.max(hero.offsetHeight, 1), 1);
        hero.style.setProperty('--scroll-progress', progress.toFixed(3));
        if (world) {
          world.style.opacity = String(1 - progress * 0.48);
          world.style.transform = 'translateY(' + (progress * -32) + 'px) scale(' + (1 - progress * 0.035) + ')';
        }
      }
      scrollFrame = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Lightweight animated signal field. It is decorative, scales with the viewport,
  // and respects reduced-motion settings.
  const canvas = document.getElementById('field');
  const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  if (!ctx) return;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let points = [];
  let frame = 0;
  const pointer = { x: -1000, y: -1000 };
  const spacing = window.innerWidth < 700 ? 58 : 76;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    points = [];
    const cols = Math.ceil(width / spacing);
    const rows = Math.ceil(height / spacing);
    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        points.push({ x: col * spacing, y: row * spacing, phase: Math.random() * Math.PI * 2 });
      }
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const time = reduceMotion ? 0 : frame * 0.006;
    for (const point of points) {
      const dx = pointer.x - point.x;
      const dy = pointer.y - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const influence = distance < 180 ? (1 - distance / 180) : 0;
      const wave = reduceMotion ? 0 : Math.sin(time + point.phase) * 2.2;
      const x = point.x + (distance < 180 && distance > 0 ? dx / distance * influence * -13 : 0);
      const y = point.y + (distance < 180 && distance > 0 ? dy / distance * influence * -13 : 0) + wave;
      const alpha = 0.06 + influence * 0.35 + (reduceMotion ? 0 : (Math.sin(time + point.phase) + 1) * 0.025);
      ctx.fillStyle = 'rgba(151, 208, 175,' + alpha.toFixed(3) + ')';
      ctx.fillRect(x, y, influence > 0.35 ? 2 : 1.2, influence > 0.35 ? 2 : 1.2);
      if (influence > 0.72) {
        ctx.strokeStyle = 'rgba(109,244,228,' + (influence * 0.18).toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(pointer.x, pointer.y);
        ctx.stroke();
      }
    }
    frame++;
    if (!reduceMotion) requestAnimationFrame(draw);
  };

  window.addEventListener('pointermove', event => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }, { passive: true });
  window.addEventListener('pointerleave', () => {
    pointer.x = -1000;
    pointer.y = -1000;
  }, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  resize();
  draw();
})();