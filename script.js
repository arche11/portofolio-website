(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const backToTop = document.querySelector('.back-to-top');
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);

  document.getElementById('year').textContent = new Date().getFullYear();

  const starfield = document.querySelector('.starfield');
  for (let index = 0; index < 28; index += 1) {
    const star = document.createElement('i');
    star.className = 'particle';
    star.style.setProperty('--x', `${(index * 37 + 9) % 97}%`);
    star.style.setProperty('--y', `${(index * 61 + 13) % 91}%`);
    star.style.setProperty('--size', `${index % 7 === 0 ? 3 : 2}px`);
    star.style.setProperty('--duration', `${4 + (index % 6)}s`);
    star.style.setProperty('--delay', `${-(index % 8)}s`);
    starfield.append(star);
  }

  const closeMenu = () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  };

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open', isOpen);
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  // Reveal content only when it enters view, with a safe fallback for older browsers.
  const revealItems = document.querySelectorAll('.reveal, .reveal-section');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          entry.target.querySelectorAll('.skill-card, .project-card').forEach((card, index) => {
            card.style.setProperty('--card-order', index);
            card.classList.add('in-view');
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Keep the compact reference-style navigation in sync with the current section.
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        nav.querySelectorAll('a').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
  }

  // A restrained tilt gives the code panel depth on pointer devices.
  const heroVisual = document.querySelector('.hero-visual');
  const visualCard = heroVisual.querySelector('.visual-card');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canHover && !reduceMotion) {
    heroVisual.addEventListener('pointermove', event => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      visualCard.style.setProperty('--tilt-x', `${(x * 5).toFixed(2)}deg`);
      visualCard.style.setProperty('--tilt-y', `${(y * -5).toFixed(2)}deg`);
    });
    heroVisual.addEventListener('pointerleave', () => {
      visualCard.style.setProperty('--tilt-x', '0deg');
      visualCard.style.setProperty('--tilt-y', '0deg');
    });
  }

  // Each project card opens its live site; the repository link remains independent.
  document.querySelectorAll('.project-card[data-live]').forEach(card => {
    const openProject = () => window.open(card.dataset.live, '_blank', 'noopener,noreferrer');
    card.addEventListener('click', event => {
      if (!event.target.closest('.repo-link')) openProject();
    });
    card.addEventListener('keydown', event => {
      if (event.target === card && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        openProject();
      }
    });
    if (canHover && !reduceMotion) {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--card-x', `${(x * 3).toFixed(2)}deg`);
        card.style.setProperty('--card-y', `${(y * -3).toFixed(2)}deg`);
        card.style.setProperty('--shine-x', `${((x + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty('--shine-y', `${((y + 0.5) * 100).toFixed(1)}%`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--card-x', '0deg');
        card.style.setProperty('--card-y', '0deg');
      });
    }
  });

  let ticking = false;
  const updateScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    document.documentElement.style.setProperty('--scroll-progress', ratio.toFixed(4));
    document.documentElement.style.setProperty('--grid-drift', `${(window.scrollY * -0.08).toFixed(1)}px`);
    backToTop.classList.toggle('visible', window.scrollY > 500);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();
})();
