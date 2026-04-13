/* ─────────────────────────────────────────────
   TIMELINE SCROLL TRACKING
   ───────────────────────────────────────────── */

const main    = document.getElementById('siteMain');
const navEl   = document.getElementById('timelineNav');
const entries = navEl ? [...navEl.querySelectorAll('.era-entry')] : [];
const sections = main ? [...main.querySelectorAll('.era-section')] : [];

// Click on timeline entry → scroll to section
entries.forEach(entry => {
  entry.addEventListener('click', () => {
    const target = document.getElementById(entry.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// IntersectionObserver to update active timeline entry
if (main && sections.length) {
  const observer = new IntersectionObserver(
    (obs) => {
      obs.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          entries.forEach(e => {
            e.classList.toggle('active', e.dataset.target === id);
          });
        }
      });
    },
    { root: main, threshold: 0.5 }
  );
  sections.forEach(s => observer.observe(s));
}

/* ─────────────────────────────────────────────
   SUBTLE PARALLAX ON ART FRAMES
   ───────────────────────────────────────────── */

const frames = document.querySelectorAll('.browser-frame');

document.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx; // -1 to +1
  const dy = (e.clientY - cy) / cy;

  frames.forEach((frame, i) => {
    const depth = 0.4 + (i % 3) * 0.25; // different depths
    const tx = dx * 6 * depth;
    const ty = dy * 4 * depth;
    const baseRot = parseFloat(frame.style.getPropertyValue('--base-rot') || 0);
    frame.style.transform = `rotate(${baseRot}deg) translate(${tx}px, ${ty}px)`;
  });
});

// Store base rotations
frames.forEach(frame => {
  const match = frame.style.transform?.match(/rotate\(([^)]+)deg\)/);
  if (match) frame.style.setProperty('--base-rot', match[1]);
});

/* ─────────────────────────────────────────────
   ARTICLE LIST STAGGER (blog page)
   ───────────────────────────────────────────── */

const links = document.querySelectorAll('.article-link');
links.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(8px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease, padding-left 0.2s, opacity 0.2s';
  setTimeout(() => {
    el.style.opacity = '0.55';
    el.style.transform = 'translateY(0)';
  }, 60 + i * 55);
});
