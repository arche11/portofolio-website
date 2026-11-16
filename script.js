const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

// Reveal sections as they enter the viewport.
const revealItems = document.querySelectorAll('.reveal, .reveal-section');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

// Show a back-to-top shortcut after scrolling.
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });


// Signature scroll motion: progress line, staggered reveals and gentle depth.
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  body.appendChild(progress);

  const orb = document.createElement('div');
  orb.className = 'scroll-orb';
  orb.setAttribute('aria-hidden', 'true');
  body.appendChild(orb);

  if (reduceMotion) return;

  body.classList.add('js-motion');

  // Reveal sections and individual content in a staggered sequence.
  const revealTargets = [
    ...document.querySelectorAll(
      '.section-heading, .about-lead, .about-detail, .skill-card, .skill-note, .project-card, .quote-inner, .contact-grid, .hero-copy, .hero-visual'
    )
  ];

  revealTargets.forEach((el, index) => {
    el.classList.add('scroll-reveal');
    if (el.matches('.about-lead, .skill-card:nth-child(odd), .project-card:nth-child(odd)')) {
      el.classList.add('from-left');
    } else if (el.matches('.about-detail, .skill-card:nth-child(even), .project-card:nth-child(even)')) {
      el.classList.add('from-right');
    }
    const parent = el.parentElement;
    const siblings = parent ? [...parent.children].filter(child => child.classList.contains('scroll-reveal')) : [];
    el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el), 3) * 110}ms`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -7% 0px' });

  revealTargets.forEach(el => observer.observe(el));
  document.querySelectorAll('.quote-band').forEach(el => observer.observe(el));

  let ticking = false;
  const updateScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progressValue = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    document.documentElement.style.setProperty('--scroll-progress', progressValue.toFixed(4));

    // A slow-moving ambient glow follows the page's scroll position.
    const glowY = 35 + (window.scrollY / Math.max(maxScroll, 1)) * 45;
    document.documentElement.style.setProperty('--scroll-glow-y', `${glowY}vh`);
    orb.style.setProperty('--orb-x', `${Math.sin(window.scrollY * 0.0012) * 150 + 80}px`);
    orb.style.setProperty('--orb-y', `${window.scrollY * 0.22}px`);

    // The hero graphic gently shifts in depth as the visitor leaves the top.
    const hero = document.querySelector('.hero-visual');
    if (hero && window.scrollY < window.innerHeight * 1.15) {
      const amount = Math.min(window.scrollY / 900, 1);
      const card = hero.querySelector('.visual-card');
      if (card) {
        card.style.translate = `0 ${amount * 24}px`;
        card.style.rotate = `${amount * -2}deg`;
      }
    }
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
