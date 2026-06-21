(function () {
  /* Skip entirely on touch-primary devices (phones, tablets).
     matchMedia pointer:fine is true only when a real mouse/trackpad
     is the primary input — it's false on touch screens.            */
  if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'dragon-cursor';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const SEGS = 30;
  const SEG_LEN = 13;
  const TEAL = [0, 230, 180];

  /* Head geometry constants — must match drawTriangleHead */
  const HEAD_SZ = 11;
  const HEAD_TIP_OFFSET = HEAD_SZ * 2.8; /* distance from anchor to tip */

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let trail = [];
  for (let i = 0; i < SEGS; i++) {
    trail.push({ x: mouse.x - i * SEG_LEN, y: mouse.y });
  }

  /* Click burst particles */
  let bursts = [];

  let tick = 0;

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mousedown', e => {
    spawnBurst(e.clientX, e.clientY);
  });

  /* Touch support */
  document.addEventListener('touchmove', e => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchstart', e => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
    spawnBurst(mouse.x, mouse.y);
  }, { passive: true });

  /* ── Burst on click ─────────────────────────────────────── */
  function spawnBurst(x, y) {
    const COUNT = 14;
    for (let i = 0; i < COUNT; i++) {
      const angle = (i / COUNT) * Math.PI * 2;
      const speed = 1.8 + Math.random() * 3.2;
      bursts.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.032 + Math.random() * 0.022,
        r: 1.2 + Math.random() * 2.2,
        ring: false
      });
    }
    /* expanding ring */
    bursts.push({ x, y, ring: true, radius: 2, life: 1, decay: 0.038 });
  }

  function updateDrawBursts() {
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.life -= b.decay;
      if (b.life <= 0) { bursts.splice(i, 1); continue; }

      if (b.ring) {
        b.radius += 4.5;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${TEAL[0]},${TEAL[1]},${TEAL[2]},${b.life * 0.55})`;
        ctx.lineWidth = 1.2;
        ctx.shadowColor = teal(0.8);
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.91;
        b.vy *= 0.91;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * b.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${TEAL[0]},${TEAL[1]},${TEAL[2]},${b.life * 0.85})`;
        ctx.shadowColor = teal(1);
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  /* ── Helpers ─────────────────────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }
  function teal(a) { return `rgba(${TEAL[0]},${TEAL[1]},${TEAL[2]},${a})`; }
  function bone(b, a) { return `rgba(${b},${b},${b + 18},${a})`; }
  function glow(color, blur) { ctx.shadowColor = color; ctx.shadowBlur = blur; }
  function noGlow() { ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'; }

  /* ── Draw functions ──────────────────────────────────────── */
  function drawBoneSegment(x, y, angle, sz, idx) {
    const t = idx / SEGS;
    const alpha = lerp(0.92, 0.45, t);
    const br = Math.round(lerp(200, 120, t));
    const kn = sz * 0.42;
    const hw = sz * 0.38;
    const hh = sz * 0.82;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    glow(teal(0.9), lerp(8, 3, t));
    ctx.fillStyle = bone(br, alpha);
    ctx.strokeStyle = teal(lerp(0.35, 0.1, t));
    ctx.lineWidth = 0.5;

    ctx.beginPath();
    ctx.ellipse(0, -hh + kn, kn, kn * 0.65, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    ctx.beginPath();
    ctx.rect(-hw * 0.48, -hh + kn * 0.65, hw * 0.96, hh * 1.35);
    ctx.fill(); ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, hh * 0.5 - kn, kn, kn * 0.65, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();

    ctx.fillStyle = teal(0.06);
    ctx.fillRect(-hw * 0.28, -hh * 0.35, hw * 0.56, hh * 0.7);

    noGlow();
    ctx.restore();
  }

  /*
   * The triangle is drawn with its tip at local (L, 0).
   * We pass in `anchorX/anchorY` which is trail[0] offset so
   * that (anchorX + cos(angle)*L, anchorY + sin(angle)*L) == mouse.
   * In other words: anchor = mouse - tip_offset_in_world_space.
   */
  function drawTriangleHead(anchorX, anchorY, angle, sz) {
    ctx.save();
    ctx.translate(anchorX, anchorY);
    ctx.rotate(angle);

    const L = sz * 2.8;
    const W2 = sz * 1.1;

    glow(teal(1), 22);
    ctx.strokeStyle = teal(0.9);
    ctx.lineWidth = 0.8;
    ctx.fillStyle = bone(215, 0.97);

    ctx.beginPath();
    ctx.moveTo(L, 0);
    ctx.lineTo(-sz * 0.2, -W2);
    ctx.lineTo(-sz * 0.2, W2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = bone(180, 0.85);
    ctx.beginPath();
    ctx.moveTo(L, 0);
    ctx.lineTo(L - sz * 0.6, -W2 * 0.35);
    ctx.lineTo(L - sz * 0.6, W2 * 0.35);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = teal(0.25);
    ctx.lineWidth = 0.4;
    ctx.beginPath(); ctx.moveTo(-sz * 0.2, 0); ctx.lineTo(L * 0.85, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sz * 0.6, -W2 * 0.55); ctx.lineTo(L * 0.7, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sz * 0.6, W2 * 0.55); ctx.lineTo(L * 0.7, 0); ctx.stroke();

    noGlow();
    ctx.restore();
  }

  function drawTailSpike(x, y, angle, sz) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI);
    glow(teal(0.6), 8);
    ctx.fillStyle = bone(180, 0.75);
    ctx.strokeStyle = teal(0.3);
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(sz * 0.45, -sz * 0.22);
    ctx.lineTo(sz * 2.5, 0);
    ctx.lineTo(sz * 0.45, sz * 0.22);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    noGlow();
    ctx.restore();
  }

  function drawHeadGlow(x, y) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, 70);
    g.addColorStop(0, teal(0.12));
    g.addColorStop(0.5, teal(0.04));
    g.addColorStop(1, teal(0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, 70, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawTrailGlow() {
    for (let i = 0; i < SEGS; i += 3) {
      const t = i / SEGS;
      const r = ctx.createRadialGradient(trail[i].x, trail[i].y, 0, trail[i].x, trail[i].y, 18);
      r.addColorStop(0, teal(lerp(0.07, 0.02, t)));
      r.addColorStop(1, teal(0));
      ctx.fillStyle = r;
      ctx.beginPath();
      ctx.arc(trail[i].x, trail[i].y, 18, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ── Main loop ───────────────────────────────────────────── */
  function animate() {
    requestAnimationFrame(animate);
    tick++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /*
     * Compute the head angle first so we can derive the anchor.
     * The tip must sit exactly on mouse, so:
     *   anchor = mouse - (cos(angle) * TIP, sin(angle) * TIP)
     *
     * We approximate angle from the previous frame's trail[0] → mouse
     * direction, then place the anchor so the tip hits mouse.
     */
    const rawAngle = Math.atan2(
      mouse.y - trail[0].y,
      mouse.x - trail[0].x
    );

    /* Target position for trail[0] = tip position minus the
       offset that places the tip at mouse */
    const targetX = mouse.x - Math.cos(rawAngle) * HEAD_TIP_OFFSET;
    const targetY = mouse.y - Math.sin(rawAngle) * HEAD_TIP_OFFSET;

    const dx = targetX - trail[0].x;
    const dy = targetY - trail[0].y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d > 0.5) {
      trail[0].x += dx * 0.25;
      trail[0].y += dy * 0.25;
    }

    for (let i = 1; i < SEGS; i++) {
      const px = trail[i - 1].x - trail[i].x;
      const py = trail[i - 1].y - trail[i].y;
      const pd = Math.sqrt(px * px + py * py);
      if (pd > SEG_LEN) {
        const f = (pd - SEG_LEN) / pd;
        trail[i].x += px * f * 0.55;
        trail[i].y += py * f * 0.55;
      }
    }

    drawTrailGlow();
    drawHeadGlow(mouse.x, mouse.y);

    const last = SEGS - 1;
    const tailAngle = Math.atan2(
      trail[last].y - trail[last - 1].y,
      trail[last].x - trail[last - 1].x
    );
    drawTailSpike(trail[last].x, trail[last].y, tailAngle, 6);

    for (let i = SEGS - 1; i >= 1; i--) {
      const nx = trail[i - 1].x - trail[i].x;
      const ny = trail[i - 1].y - trail[i].y;
      const angle = Math.atan2(ny, nx);
      const sz = lerp(9, 3, i / SEGS);
      drawBoneSegment(trail[i].x, trail[i].y, angle, sz, i);
    }

    /* Head: anchor is trail[0], tip lands on mouse */
    const headAngle = Math.atan2(
      mouse.y - trail[0].y,
      mouse.x - trail[0].x
    );
    drawTriangleHead(trail[0].x, trail[0].y, headAngle, HEAD_SZ);

    updateDrawBursts();
  }

  animate();
})();