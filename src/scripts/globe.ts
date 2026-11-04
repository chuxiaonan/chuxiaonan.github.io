type Point = [number, number, number];
type Dot = { p: Point; land: boolean };
type LonLat = [number, number];

/**
 * Coarse closed continent silhouettes as [lon, lat] rings (degrees).
 * Accurate enough to read Africa / Eurasia / Americas / Australia at a glance.
 */
const CONTINENTS: LonLat[][] = [
  // Africa
  [[-17, 35], [-5, 36], [10, 37], [25, 32], [32, 31], [36, 28], [43, 12], [51, 12], [43, -1],
   [40, -15], [35, -25], [32, -30], [25, -34], [18, -35], [12, -28], [14, -10], [9, 4],
   [-5, 5], [-10, 6], [-17, 14], [-16, 22], [-17, 28]],
  // Eurasia (Europe + Asia, coarse)
  [[-10, 36], [-9, 43], [-5, 48], [-5, 58], [5, 62], [20, 70], [40, 70], [60, 70], [80, 72],
   [100, 72], [130, 71], [160, 68], [180, 65], [180, 55], [145, 50], [140, 40], [130, 35],
   [122, 30], [120, 22], [110, 18], [100, 12], [95, 8], [90, 15], [85, 20], [75, 22],
   [70, 25], [62, 25], [55, 27], [48, 30], [44, 36], [40, 40], [35, 36], [28, 36],
   [20, 36], [10, 38], [0, 36]],
  // India / SE Asia peninsula fill (helps India silhouette)
  [[68, 24], [72, 8], [80, 6], [88, 22], [95, 16], [100, 6], [105, 2], [110, 8], [105, 18], [95, 24]],
  // Japan / Korea hint
  [[128, 34], [132, 43], [142, 45], [146, 43], [141, 35], [136, 33], [130, 31]],
  // UK / Scandinavia hint
  [[-10, 50], [-6, 58], [2, 59], [8, 63], [16, 69], [25, 71], [30, 60], [20, 55], [5, 52], [-5, 50]],
  // North America
  [[-168, 66], [-140, 70], [-120, 72], [-90, 72], [-60, 65], [-55, 55], [-65, 45], [-75, 35],
   [-80, 25], [-97, 18], [-105, 22], [-115, 32], [-125, 38], [-130, 50], [-140, 58], [-160, 60], [-168, 63]],
  // Greenland
  [[-55, 60], [-45, 60], [-30, 68], [-20, 75], [-40, 83], [-60, 76], [-70, 70], [-60, 62]],
  // South America
  [[-80, 12], [-70, 12], [-60, 5], [-50, 0], [-40, -5], [-35, -8], [-35, -20], [-40, -30],
   [-50, -40], [-55, -50], [-68, -55], [-72, -50], [-75, -40], [-78, -20], [-80, 0]],
  // Australia
  [[113, -22], [120, -18], [130, -12], [140, -12], [148, -18], [153, -28], [150, -35],
   [140, -38], [130, -35], [120, -35], [115, -32]],
  // Antarctica (subtle southern belt)
  [[-180, -70], [-120, -70], [-60, -70], [0, -70], [60, -70], [120, -70], [180, -70],
   [180, -85], [-180, -85]],
];

function pointInRing(lon: number, lat: number, ring: LonLat[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]!;
    const [xj, yj] = ring[j]!;
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function isLand(lon: number, lat: number): boolean {
  let l = lon;
  if (l > 180) l -= 360;
  if (l < -180) l += 360;
  return CONTINENTS.some((ring) => pointInRing(l, lat, ring));
}

/** Orthographic globe: every vertex fits within radius 1.50, in any rotation. */
export function initGlobe(host: HTMLElement): () => void {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return () => {};
  const ctx = context;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const small = matchMedia("(max-width: 700px)").matches;
  const radians = Math.PI / 180;
  const point = (lat: number, lon: number, r = 1.25): Point => [
    r * Math.cos(lat * radians) * Math.sin(lon * radians),
    r * Math.sin(lat * radians),
    r * Math.cos(lat * radians) * Math.cos(lon * radians),
  ];
  const grid: Point[][] = [];
  for (let lat = -75; lat <= 75; lat += 15)
    grid.push(Array.from({ length: 97 }, (_, i) => point(lat, (i * 360) / 96)));
  for (let lon = 0; lon < 360; lon += 15)
    grid.push(Array.from({ length: 97 }, (_, i) => point((i * 180) / 96 - 90, lon)));

  const dots: Dot[] = [];
  const baseCount = small ? 900 : 2200;
  for (let i = 0; i < baseCount; i++) {
    const y = 1 - (i / (baseCount - 1)) * 2;
    const a = i * Math.PI * (3 - Math.sqrt(5));
    const r = Math.sqrt(1 - y * y);
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const lat = (Math.asin(Math.max(-1, Math.min(1, y))) * 180) / Math.PI;
    const lon = (Math.atan2(x, z) * 180) / Math.PI;
    dots.push({ p: [x * 1.253, y * 1.253, z * 1.253], land: isLand(lon, lat) });
  }
  // Extra denser land samples so continents read clearly
  const landStep = small ? 4 : 2.5;
  for (let lat = -80; lat <= 80; lat += landStep) {
    const lonStep = landStep / Math.max(0.25, Math.cos(lat * radians));
    for (let lon = -180; lon < 180; lon += lonStep) {
      if (!isLand(lon, lat)) continue;
      // Deterministic thin-out (~45% keep) so continents stay readable without noise flicker
      const keep = (((lat * 73856093) ^ (lon * 19349663)) >>> 0) % 100 < 45;
      if (!keep) continue;
      dots.push({ p: point(lat, lon, 1.253), land: true });
    }
  }

  const origin = point(39.9, 116.4);
  const markers = [origin, point(20, 65), point(-5, 95), point(55, 155)];
  const arcs = markers.slice(1).map((target) =>
    Array.from({ length: 65 }, (_, i): Point => {
      const t = i / 64;
      const v = origin.map((n, axis) => n * (1 - t) + target[axis]! * t) as Point;
      const s = (1.26 + Math.sin(Math.PI * t) * 0.22) / Math.hypot(...v);
      return [v[0]! * s, v[1]! * s, v[2]! * s];
    }),
  );

  let width = 0,
    height = 0,
    scale = 0,
    dpr = 1;
  // Africa / Europe / Asia facing camera; Beijing near the eastern limb
  let yaw = -0.35,
    pitch = 0.18,
    frame = 0,
    previous = 0;
  let visible = false,
    disposed = false,
    dragging = false;
  let lastX = 0,
    lastY = 0,
    light = false;

  const project = ([x, y, z]: Point): Point => {
    const rx = x * Math.cos(yaw) + z * Math.sin(yaw);
    const rz = z * Math.cos(yaw) - x * Math.sin(yaw);
    const ry = y * Math.cos(pitch) - rz * Math.sin(pitch);
    const depth = y * Math.sin(pitch) + rz * Math.cos(pitch);
    return [
      width / 2 + (rx * Math.cos(-0.15) - ry * Math.sin(-0.15)) * scale,
      height / 2 - (rx * Math.sin(-0.15) + ry * Math.cos(-0.15)) * scale,
      depth,
    ];
  };

  const stroke = (paths: Point[][], accent: boolean) => {
    ctx.strokeStyle = light ? "#21684f" : accent ? "#c0f7dd" : "#70bca5";
    ctx.lineWidth = accent ? 1.15 : 0.65;
    for (const path of paths) {
      for (let i = 1; i < path.length; i++) {
        const a = project(path[i - 1]!);
        const b = project(path[i]!);
        ctx.globalAlpha = accent ? 0.85 : a[2] + b[2] > 0 ? 0.28 : 0.1;
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }
    }
  };

  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    stroke(grid, false);

    // Ocean dots first (dimmer / smaller)
    for (const { p, land } of dots) {
      if (land) continue;
      const [x, y, z] = project(p);
      ctx.fillStyle = light ? "#9bb8ad" : "#3d6a5c";
      ctx.globalAlpha = z > 0 ? 0.35 : 0.08;
      ctx.beginPath();
      ctx.arc(x, y, small ? 0.55 : 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // Land dots (brighter / larger)
    for (const { p, land } of dots) {
      if (!land) continue;
      const [x, y, z] = project(p);
      ctx.fillStyle = light ? "#1f6b4f" : "#c8f7df";
      ctx.globalAlpha = z > 0 ? 0.92 : 0.18;
      ctx.beginPath();
      ctx.arc(x, y, small ? 1.15 : 1.25, 0, Math.PI * 2);
      ctx.fill();
    }

    stroke(arcs, true);
    ctx.globalAlpha = 1;
    ctx.fillStyle = light ? "#1b6c4d" : "#caffdf";
    markers.forEach((p, i) => {
      const [x, y] = project(p);
      ctx.beginPath();
      ctx.arc(x, y, i ? 2 : 3.2, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const render = (time: number) => {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
    previous = time;
    if (!motion.matches && !dragging) yaw += delta * 0.065;
    draw();
    if (!motion.matches) frame = requestAnimationFrame(render);
  };
  const resume = () => {
    if (!frame && visible && !document.hidden && !disposed) frame = requestAnimationFrame(render);
  };
  const pause = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
  };
  const resize = new ResizeObserver(() => {
    ({ width, height } = host.getBoundingClientRect());
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    scale = Math.max(0, (Math.min(width, height) * 0.4) / 1.5);
    draw();
    resume();
  });
  const palette = () => {
    light = document.documentElement.dataset.theme === "light";
    if (width && height) draw();
    resume();
  };
  const theme = new MutationObserver(palette);
  theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    if (visible) resume();
    else pause();
  });
  const visibility = () => {
    if (document.hidden) pause();
    else resume();
  };
  const motionChange = () => {
    pause();
    resume();
  };
  const down = (e: PointerEvent) => {
    if (motion.matches || (e.pointerType === "mouse" && e.button !== 0)) return;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    host.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    if (!dragging || motion.matches) return;
    yaw += (e.clientX - lastX) * 0.005;
    pitch = Math.max(-1.1, Math.min(1.1, pitch + (e.clientY - lastY) * 0.005));
    lastX = e.clientX;
    lastY = e.clientY;
    resume();
  };
  const up = () => {
    dragging = false;
  };
  host.append(canvas);
  host.classList.add("ready");
  resize.observe(host);
  observer.observe(host);
  palette();
  document.addEventListener("visibilitychange", visibility);
  motion.addEventListener("change", motionChange);
  host.addEventListener("pointerdown", down);
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerup", up);
  host.addEventListener("pointercancel", up);
  host.addEventListener("lostpointercapture", up);
  return () => {
    if (disposed) return;
    disposed = true;
    pause();
    resize.disconnect();
    observer.disconnect();
    theme.disconnect();
    document.removeEventListener("visibilitychange", visibility);
    motion.removeEventListener("change", motionChange);
    host.removeEventListener("pointerdown", down);
    host.removeEventListener("pointermove", move);
    host.removeEventListener("pointerup", up);
    host.removeEventListener("pointercancel", up);
    host.removeEventListener("lostpointercapture", up);
    canvas.remove();
    canvas.width = canvas.height = 0;
    host.classList.remove("ready");
  };
}
