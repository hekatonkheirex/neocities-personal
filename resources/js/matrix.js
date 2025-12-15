(() => {
  'use strict';

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const canvas = document.getElementById('matrix');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-'.split('');
  let fontSize = 14;
  let columns = 0;
  let drops = [];
  let rafId = null;

  function resize() {
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    const w = Math.floor(window.innerWidth);
    const h = Math.floor(window.innerHeight);

    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = w * dpr;
    canvas.height = h * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    columns = Math.floor(w / fontSize);
    drops = new Array(columns).fill(1);
  }

  function draw() {
    // Trail
    ctx.fillStyle = 'rgba(13, 2, 8, 0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + 'px Space Mono, monospace';
    ctx.fillStyle = '#00FF41';

    for (let i = 0; i < drops.length; i++) {
      const text = letters[(Math.random() * letters.length) | 0];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillText(text, x, y);

      // Reset drop
      if (y > window.innerHeight && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    rafId = window.requestAnimationFrame(draw);
  }

  function start() {
    resize();
    if (rafId) cancelAnimationFrame(rafId);
    draw();
  }

  window.addEventListener('resize', () => {
    resize();
  }, { passive: true });

  // Start after fonts/layout are ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
