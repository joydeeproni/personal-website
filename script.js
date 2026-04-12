/* ─────────────────────────────────────────────
   PIXEL PARTICLE BACKGROUND
   ───────────────────────────────────────────── */

const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');

let W, H;
const PIXEL_SIZE = 4;
const particles = [];
const PARTICLE_COUNT = 60;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Pixel {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x     = Math.random() * W;
    this.y     = initial ? Math.random() * H : H + PIXEL_SIZE;
    this.vx    = (Math.random() - 0.5) * 0.4;
    this.vy    = -(Math.random() * 0.5 + 0.2);
    this.life  = 0;
    this.maxLife = 200 + Math.random() * 300;
    this.size  = PIXEL_SIZE * (Math.random() < 0.3 ? 2 : 1);
    this.alpha = 0;
  }

  update() {
    this.life++;
    this.x += this.vx;
    this.y += this.vy;

    const t = this.life / this.maxLife;
    // fade in for first 20%, hold, fade out last 20%
    if (t < 0.2)       this.alpha = t / 0.2;
    else if (t > 0.8)  this.alpha = (1 - t) / 0.2;
    else               this.alpha = 1;

    if (this.life >= this.maxLife || this.y < -PIXEL_SIZE) this.reset();
  }

  draw() {
    ctx.globalAlpha = this.alpha * 0.5;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(
      Math.round(this.x / PIXEL_SIZE) * PIXEL_SIZE,
      Math.round(this.y / PIXEL_SIZE) * PIXEL_SIZE,
      this.size, this.size
    );
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Pixel());

/* ─── scanline overlay ─── */
function drawScanlines() {
  ctx.globalAlpha = 0.03;
  ctx.fillStyle = '#000';
  for (let y = 0; y < H; y += 4) {
    ctx.fillRect(0, y, W, 2);
  }
}

function loop() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawScanlines();
  ctx.globalAlpha = 1;
  requestAnimationFrame(loop);
}
loop();

/* ─────────────────────────────────────────────
   GLITCH EFFECT ON NAME (home page only)
   ───────────────────────────────────────────── */

const nameEl = document.getElementById('pixelName');
if (nameEl) {
  // Trigger glitch randomly
  function triggerGlitch() {
    nameEl.classList.add('glitching');
    const duration = 200 + Math.random() * 400;
    setTimeout(() => nameEl.classList.remove('glitching'), duration);
    // schedule next
    setTimeout(triggerGlitch, 2000 + Math.random() * 5000);
  }
  setTimeout(triggerGlitch, 1200);

  // Also brief glitch on hover
  nameEl.addEventListener('mouseenter', () => {
    nameEl.classList.add('glitching');
  });
  nameEl.addEventListener('mouseleave', () => {
    setTimeout(() => nameEl.classList.remove('glitching'), 300);
  });
}

/* ─────────────────────────────────────────────
   TYPEWRITER INTRO for bio text (home page only)
   ───────────────────────────────────────────── */

const bioEl = document.querySelector('.bio-text');
if (bioEl) {
  const original = bioEl.textContent.trim();
  bioEl.textContent = '';
  bioEl.style.opacity = '0.75';

  let i = 0;
  function type() {
    if (i <= original.length) {
      bioEl.textContent = original.slice(0, i);
      i++;
      setTimeout(type, 18 + Math.random() * 12);
    }
  }
  // start after a beat
  setTimeout(type, 600);
}

/* ─────────────────────────────────────────────
   ARTICLE LIST staggered fade-in (blog page only)
   ───────────────────────────────────────────── */

const articleLinks = document.querySelectorAll('.article-link');
if (articleLinks.length) {
  articleLinks.forEach((el, idx) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    el.style.transition = 'opacity 0.35s ease, transform 0.35s ease, color 0.15s, padding-left 0.15s';
    setTimeout(() => {
      el.style.opacity = '0.8';
      el.style.transform = 'translateY(0)';
    }, 80 + idx * 60);
  });
}
