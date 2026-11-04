type Point = [number, number, number];

/** Orthographic globe: every vertex fits within radius 1.50, in any rotation. */
export function initGlobe(host: HTMLElement): () => void {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return () => {};
  const ctx = context;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const small = matchMedia('(max-width: 700px)').matches;
  const radians = Math.PI / 180;
  const point = (lat: number, lon: number, r = 1.25): Point => [
    r * Math.cos(lat * radians) * Math.sin(lon * radians),
    r * Math.sin(lat * radians),
    r * Math.cos(lat * radians) * Math.cos(lon * radians),
  ];
  const grid: Point[][] = [];
  for (let lat = -75; lat <= 75; lat += 15)
    grid.push(Array.from({ length: 97 }, (_, i) => point(lat, i * 360 / 96)));
  for (let lon = 0; lon < 360; lon += 15)
    grid.push(Array.from({ length: 97 }, (_, i) => point(i * 180 / 96 - 90, lon)));
  const count = small ? 750 : 1800;
  const points: Point[] = Array.from({ length: count }, (_, i) => {
    const y = 1 - i / (count - 1) * 2;
    const a = i * Math.PI * (3 - Math.sqrt(5));
    const r = Math.sqrt(1 - y * y);
    return [Math.cos(a) * r * 1.253, y * 1.253, Math.sin(a) * r * 1.253];
  });
  const origin = point(39.9, 116.4);
  const markers = [origin, point(20, 65), point(-5, 95), point(55, 155)];
  const arcs = markers.slice(1).map(target => Array.from({ length: 65 }, (_, i): Point => {
    const t = i / 64;
    const v = origin.map((n, axis) => n * (1 - t) + target[axis]! * t);
    const scale = (1.26 + Math.sin(Math.PI * t) * .22) / Math.hypot(...v);
    return [v[0]! * scale, v[1]! * scale, v[2]! * scale];
  }));
  let width = 0, height = 0, scale = 0, dpr = 1;
  let yaw = -.65, pitch = .15, frame = 0, previous = 0;
  let visible = false, disposed = false, dragging = false;
  let lastX = 0, lastY = 0, light = false;
  const project = ([x, y, z]: Point): Point => {
    const rx = x * Math.cos(yaw) + z * Math.sin(yaw);
    const rz = z * Math.cos(yaw) - x * Math.sin(yaw);
    const ry = y * Math.cos(pitch) - rz * Math.sin(pitch);
    const depth = y * Math.sin(pitch) + rz * Math.cos(pitch);
    return [width / 2 + (rx * Math.cos(-.15) - ry * Math.sin(-.15)) * scale,
      height / 2 - (rx * Math.sin(-.15) + ry * Math.cos(-.15)) * scale, depth];
  };
  const stroke = (paths: Point[][], accent: boolean) => {
    ctx.strokeStyle = light ? '#21684f' : accent ? '#c0f7dd' : '#70bca5';
    ctx.lineWidth = accent ? 1.15 : .65;
    for (const path of paths) {
      for (let i = 1; i < path.length; i++) {
        const a = project(path[i - 1]!); const b = project(path[i]!);
        ctx.globalAlpha = accent ? .85 : (a[2] + b[2] > 0 ? .34 : .12);
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      }
    }
  };
  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    stroke(grid, false);
    ctx.fillStyle = light ? '#286b53' : '#b4f1da';
    for (const p of points) {
      const [x, y, z] = project(p);
      ctx.globalAlpha = z > 0 ? .8 : .2;
      ctx.beginPath(); ctx.arc(x, y, small ? .85 : .8, 0, Math.PI * 2); ctx.fill();
    }
    stroke(arcs, true);
    ctx.globalAlpha = 1;
    ctx.fillStyle = light ? '#1b6c4d' : '#caffdf';
    markers.forEach((p, i) => {
      const [x, y] = project(p);
      ctx.beginPath(); ctx.arc(x, y, i ? 2 : 3.2, 0, Math.PI * 2); ctx.fill();
    });
  };
  const render = (time: number) => {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const delta = previous ? Math.min((time - previous) / 1000, .05) : 0;
    previous = time;
    if (!motion.matches && !dragging) yaw += delta * .065;
    draw();
    if (!motion.matches) frame = requestAnimationFrame(render);
  };
  const resume = () => {
    if (!frame && visible && !document.hidden && !disposed) frame = requestAnimationFrame(render);
  };
  const pause = () => { cancelAnimationFrame(frame); frame = 0; previous = 0; };
  const resize = new ResizeObserver(() => {
    ({ width, height } = host.getBoundingClientRect());
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    // 10% margin on every edge; the bound includes arcs, markers and antialiasing.
    scale = Math.max(0, Math.min(width, height) * .4 / 1.50);
    draw();
    resume();
  });
  const palette = () => { light = document.documentElement.dataset.theme === 'light'; if (width && height) draw(); resume(); };
  const theme = new MutationObserver(palette);
  theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    if (visible) resume(); else pause();
  });
  const visibility = () => { if (document.hidden) pause(); else resume(); };
  const motionChange = () => { pause(); resume(); };
  const down = (e: PointerEvent) => {
    if (motion.matches || (e.pointerType === 'mouse' && e.button !== 0)) return;
    dragging = true; lastX = e.clientX; lastY = e.clientY; host.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    if (!dragging || motion.matches) return;
    yaw += (e.clientX - lastX) * .005;
    pitch = Math.max(-1.1, Math.min(1.1, pitch + (e.clientY - lastY) * .005));
    lastX = e.clientX; lastY = e.clientY; resume();
  };
  const up = () => { dragging = false; };
  host.append(canvas); host.classList.add('ready');
  resize.observe(host); observer.observe(host); palette();
  document.addEventListener('visibilitychange', visibility);
  motion.addEventListener('change', motionChange);
  host.addEventListener('pointerdown', down); host.addEventListener('pointermove', move);
  host.addEventListener('pointerup', up); host.addEventListener('pointercancel', up);
  host.addEventListener('lostpointercapture', up);
  return () => {
    if (disposed) return;
    disposed = true; pause(); resize.disconnect(); observer.disconnect(); theme.disconnect();
    document.removeEventListener('visibilitychange', visibility);
    motion.removeEventListener('change', motionChange);
    host.removeEventListener('pointerdown', down); host.removeEventListener('pointermove', move);
    host.removeEventListener('pointerup', up); host.removeEventListener('pointercancel', up);
    host.removeEventListener('lostpointercapture', up);
    canvas.remove(); canvas.width = canvas.height = 0; host.classList.remove('ready');
  };
}
