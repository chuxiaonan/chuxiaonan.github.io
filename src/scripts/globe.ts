type Point = [number, number, number];
type Dot = { p: Point; land: boolean };
type LonLat = [number, number];

type CityKind = "hub" | "featured" | "footprint";

type City = {
  id: string;
  nameZh: string;
  nameEn: string;
  lat: number;
  lon: number;
  /** Hub is home. Featured cities keep a standing arc. Footprints are dots until selected. */
  kind: CityKind;
};

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
  // India / SE Asia peninsula fill
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
  // Antarctica
  [[-180, -70], [-120, -70], [-60, -70], [0, -70], [60, -70], [120, -70], [180, -70],
   [180, -85], [-180, -85]],
];

const CITIES: City[] = [
  { id: "beijing", nameZh: "北京", nameEn: "Beijing", lat: 39.9, lon: 116.4, kind: "hub" },
  { id: "london", nameZh: "伦敦", nameEn: "London", lat: 51.51, lon: -0.13, kind: "featured" },
  { id: "munich", nameZh: "慕尼黑", nameEn: "Munich", lat: 48.14, lon: 11.58, kind: "featured" },
  { id: "newyork", nameZh: "纽约", nameEn: "New York", lat: 40.71, lon: -74.01, kind: "featured" },
  { id: "tokyo", nameZh: "东京", nameEn: "Tokyo", lat: 35.68, lon: 139.69, kind: "featured" },
  { id: "shanghai", nameZh: "上海", nameEn: "Shanghai", lat: 31.23, lon: 121.47, kind: "featured" },
  { id: "singapore", nameZh: "新加坡", nameEn: "Singapore", lat: 1.35, lon: 103.82, kind: "featured" },
  { id: "chengdu", nameZh: "成都", nameEn: "Chengdu", lat: 30.67, lon: 104.07, kind: "footprint" },
  { id: "chongqing", nameZh: "重庆", nameEn: "Chongqing", lat: 29.56, lon: 106.55, kind: "footprint" },
  { id: "xian", nameZh: "西安", nameEn: "Xi'an", lat: 34.34, lon: 108.94, kind: "footprint" },
  { id: "changsha", nameZh: "长沙", nameEn: "Changsha", lat: 28.23, lon: 112.94, kind: "footprint" },
  { id: "macau", nameZh: "澳门", nameEn: "Macau", lat: 22.19, lon: 113.54, kind: "footprint" },
  { id: "zhuhai", nameZh: "珠海", nameEn: "Zhuhai", lat: 22.27, lon: 113.58, kind: "footprint" },
  { id: "foshan", nameZh: "佛山", nameEn: "Foshan", lat: 23.02, lon: 113.12, kind: "footprint" },
  { id: "guangzhou", nameZh: "广州", nameEn: "Guangzhou", lat: 23.13, lon: 113.26, kind: "footprint" },
  { id: "shenzhen", nameZh: "深圳", nameEn: "Shenzhen", lat: 22.54, lon: 114.06, kind: "footprint" },
  { id: "hongkong", nameZh: "香港", nameEn: "Hong Kong", lat: 22.32, lon: 114.17, kind: "footprint" },
  { id: "shantou", nameZh: "汕头", nameEn: "Shantou", lat: 23.35, lon: 116.68, kind: "footprint" },
  { id: "chaozhou", nameZh: "潮州", nameEn: "Chaozhou", lat: 23.66, lon: 116.63, kind: "footprint" },
  { id: "jieyang", nameZh: "揭阳", nameEn: "Jieyang", lat: 23.55, lon: 116.37, kind: "footprint" },
  { id: "zhangzhou", nameZh: "漳州", nameEn: "Zhangzhou", lat: 24.51, lon: 117.65, kind: "footprint" },
  { id: "xiamen", nameZh: "厦门", nameEn: "Xiamen", lat: 24.48, lon: 118.09, kind: "footprint" },
  { id: "hangzhou", nameZh: "杭州", nameEn: "Hangzhou", lat: 30.27, lon: 120.15, kind: "footprint" },
  { id: "nanjing", nameZh: "南京", nameEn: "Nanjing", lat: 32.06, lon: 118.8, kind: "footprint" },
  { id: "suzhou", nameZh: "苏州", nameEn: "Suzhou", lat: 31.3, lon: 120.62, kind: "footprint" },
  { id: "yangzhou", nameZh: "扬州", nameEn: "Yangzhou", lat: 32.39, lon: 119.42, kind: "footprint" },
  { id: "yantai", nameZh: "烟台", nameEn: "Yantai", lat: 37.46, lon: 121.45, kind: "footprint" },
  { id: "weihai", nameZh: "威海", nameEn: "Weihai", lat: 37.51, lon: 122.12, kind: "footprint" },
  { id: "jinan", nameZh: "济南", nameEn: "Jinan", lat: 36.67, lon: 117.0, kind: "footprint" },
  { id: "tianjin", nameZh: "天津", nameEn: "Tianjin", lat: 39.13, lon: 117.2, kind: "footprint" },
  { id: "shenyang", nameZh: "沈阳", nameEn: "Shenyang", lat: 41.8, lon: 123.43, kind: "footprint" },
  { id: "dalian", nameZh: "大连", nameEn: "Dalian", lat: 38.91, lon: 121.61, kind: "footprint" },
  { id: "changchun", nameZh: "长春", nameEn: "Changchun", lat: 43.88, lon: 125.32, kind: "footprint" },
  { id: "qiqihar", nameZh: "齐齐哈尔", nameEn: "Qiqihar", lat: 47.35, lon: 123.92, kind: "footprint" },
  { id: "harbin", nameZh: "哈尔滨", nameEn: "Harbin", lat: 45.8, lon: 126.53, kind: "footprint" },
  { id: "berlin", nameZh: "柏林", nameEn: "Berlin", lat: 52.52, lon: 13.4, kind: "footprint" },
  { id: "philadelphia", nameZh: "费城", nameEn: "Philadelphia", lat: 39.95, lon: -75.16, kind: "footprint" },
  { id: "washington", nameZh: "华盛顿", nameEn: "Washington", lat: 38.91, lon: -77.04, kind: "footprint" },
  { id: "boston", nameZh: "波士顿", nameEn: "Boston", lat: 42.36, lon: -71.06, kind: "footprint" },
  { id: "niagara", nameZh: "尼亚加拉瀑布", nameEn: "Niagara Falls", lat: 43.09, lon: -79.04, kind: "footprint" },
  { id: "edinburgh", nameZh: "爱丁堡", nameEn: "Edinburgh", lat: 55.95, lon: -3.19, kind: "footprint" },
  { id: "oxford", nameZh: "牛津", nameEn: "Oxford", lat: 51.75, lon: -1.26, kind: "footprint" },
  { id: "cambridge", nameZh: "剑桥", nameEn: "Cambridge", lat: 52.2, lon: 0.12, kind: "footprint" },
  { id: "osaka", nameZh: "大阪", nameEn: "Osaka", lat: 34.69, lon: 135.5, kind: "footprint" },
  { id: "kyoto", nameZh: "京都", nameEn: "Kyoto", lat: 35.01, lon: 135.77, kind: "footprint" },
  { id: "nara", nameZh: "奈良", nameEn: "Nara", lat: 34.69, lon: 135.8, kind: "footprint" },
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

function formatCoord(lat: number, lon: number): string {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(2)}° ${ns} ${Math.abs(lon).toFixed(2)}° ${ew}`;
}

function cityLabel(city: City): { title: string; coord: string } {
  return {
    title: `${city.nameZh} · ${city.nameEn.toUpperCase()}`,
    coord: formatCoord(city.lat, city.lon),
  };
}

/** Orthographic globe: every vertex fits within radius 1.50, in any rotation. */
export function initGlobe(host: HTMLElement): () => void {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return () => {};
  const ctx = context;
  canvas.setAttribute("role", "img");
  canvas.setAttribute(
    "aria-label",
    "可拖动的地球。到过的城市是足迹点，精选城市有到北京的航线。悬停或聚焦可查看城市。",
  );

  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const small = matchMedia("(max-width: 768px)").matches;
  const radians = Math.PI / 180;
  const point = (lat: number, lon: number, r = 1.25): Point => [
    r * Math.cos(lat * radians) * Math.sin(lon * radians),
    r * Math.sin(lat * radians),
    r * Math.cos(lat * radians) * Math.cos(lon * radians),
  ];

  const labelEl = document.querySelector<HTMLElement>("#globe-label");
  const labelCoord = document.querySelector<HTMLElement>("#globe-label-coord");
  const labelName = document.querySelector<HTMLElement>("#globe-label-name");
  const hub = CITIES.find((c) => c.kind === "hub")!;
  const setLabel = (city: City) => {
    const { title, coord } = cityLabel(city);
    if (labelCoord) labelCoord.textContent = coord;
    if (labelName) labelName.textContent = title;
    if (labelEl) labelEl.dataset.city = city.id;
  };
  const placeLabel = () => {
    if (!labelEl) return;
    const proj = activeCity && projectedCities.find((c) => c.city.id === activeCity!.id);
    if (!proj || proj.z < 0) {
      labelEl.classList.remove("is-anchored");
      labelEl.style.removeProperty("transform");
      return;
    }
    labelEl.classList.add("is-anchored");
    labelEl.classList.remove("is-flipped");
    const cardW = labelEl.offsetWidth || 132;
    const cardH = labelEl.offsetHeight || 36;
    let x = proj.x + 12;
    let y = proj.y - cardH - 10;
    if (x + cardW > width - 6) x = proj.x - cardW - 12;
    x = Math.max(6, Math.min(width - cardW - 6, x));
    if (y < 6) y = proj.y + 12;
    y = Math.max(6, Math.min(height - cardH - 6, y));
    const edgeX = Math.max(x, Math.min(proj.x, x + cardW));
    const edgeY = Math.max(y, Math.min(proj.y, y + cardH));
    ctx.strokeStyle = ink;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(proj.x, proj.y);
    ctx.lineTo(edgeX, edgeY);
    ctx.stroke();
    ctx.globalAlpha = 1;
    labelEl.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  };
  setLabel(hub);

  const grid: Point[][] = [];
  for (let lat = -75; lat <= 75; lat += 15)
    grid.push(Array.from({ length: 97 }, (_, i) => point(lat, (i * 360) / 96)));
  for (let lon = 0; lon < 360; lon += 15)
    grid.push(Array.from({ length: 97 }, (_, i) => point((i * 180) / 96 - 90, lon)));

  // Single Fibonacci lattice — land vs ocean is brightness only.
  const dots: Dot[] = [];
  const count = small ? 1400 : 2800;
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const a = i * Math.PI * (3 - Math.sqrt(5));
    const r = Math.sqrt(1 - y * y);
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const lat = (Math.asin(Math.max(-1, Math.min(1, y))) * 180) / Math.PI;
    const lon = (Math.atan2(x, z) * 180) / Math.PI;
    dots.push({ p: [x * 1.253, y * 1.253, z * 1.253], land: isLand(lon, lat) });
  }

  const cityPoints = CITIES.map((city) => ({
    city,
    p: point(city.lat, city.lon),
  }));
  const origin = cityPoints.find((c) => c.city.kind === "hub")!.p;
  const ARC_STEPS = 72;
  const arcBetween = (target: Point): Point[] =>
    Array.from({ length: ARC_STEPS }, (_, i): Point => {
      const t = i / (ARC_STEPS - 1);
      const v: Point = [
        origin[0] * (1 - t) + target[0] * t,
        origin[1] * (1 - t) + target[1] * t,
        origin[2] * (1 - t) + target[2] * t,
      ];
      const s = (1.2 + Math.sin(Math.PI * t) * 0.12) / Math.hypot(...v);
      return [v[0] * s, v[1] * s, v[2] * s];
    });
  // Every non-hub city has a path ready, but only featured arcs (plus the
  // city under the pointer) are stroked. Footprints stay dots.
  const arcById = new Map<string, Point[]>(
    cityPoints
      .filter(({ city }) => city.kind !== "hub")
      .map(({ city, p }): [string, Point[]] => [city.id, arcBetween(p)]),
  );

  // Keyboard targets for the hub and featured cities only. Footprints are
  // picked from the canvas so the tab order stays short.
  const hits = CITIES.filter((city) => city.kind !== "footprint").map((city) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "globe-city-hit";
    btn.dataset.city = city.id;
    const { title, coord } = cityLabel(city);
    btn.setAttribute("aria-label", `${title}, ${coord}`);
    btn.title = `${title} · ${coord}`;
    host.append(btn);
    return { city, btn };
  });

  let width = 0,
    height = 0,
    scale = 0,
    dpr = 1;
  // Face East Asia so the footprint cluster and Beijing sit on the front.
  // Phase 2 can replace `project` with a d3-geo orthographic; yaw/pitch stay the camera.
  let yaw = -1.9,
    pitch = 0.22,
    frame = 0,
    previous = 0,
    animT = 0;
  let visible = false,
    disposed = false,
    dragging = false;
  let ink = "#161616";
  const readInk = () => {
    ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || ink;
  };
  const monoFont = () => {
    const stack =
      getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() ||
      'ui-monospace, SFMono-Regular, Consolas, monospace';
    return `11px ${stack}`;
  };
  let activeCity: City | null = null;
  let hoverCity: City | null = null;
  let pinned = false;
  let target: { yaw: number; pitch: number } | null = null;
  let projectedCities: { city: City; x: number; y: number; z: number }[] = [];
  let pointer: { x: number; y: number } | null = null;
  let inertia = 0;
  let idleAt = 0;
  const SPHERE = 1.25;
  const CLUSTER_PX = small ? 12 : 14;

  type Gesture = {
    x: number;
    y: number;
    city: City | null;
    dragged: boolean;
    pointerId: number;
    kind: string;
    lastX: number;
    lastY: number;
    lastT: number;
  };
  let gesture: Gesture | null = null;

  /** Screen projection. Swap this function for d3-geo in phase 2. */
  const project = ([x, y, z]: Point): Point => {
    const rx = x * Math.cos(yaw) + z * Math.sin(yaw);
    const rz = z * Math.cos(yaw) - x * Math.sin(yaw);
    const ry = y * Math.cos(pitch) - rz * Math.sin(pitch);
    const depth = y * Math.sin(pitch) + rz * Math.cos(pitch);
    return [width / 2 + rx * scale, height / 2 - ry * scale, depth];
  };

  const limbRadius = () => SPHERE * scale;
  const onFront = (q: Point) => {
    if (q[2] <= 0.03) return false;
    const dx = q[0] - width / 2;
    const dy = q[1] - height / 2;
    return dx * dx + dy * dy <= (limbRadius() + 0.6) ** 2;
  };

  /** One stroke per visible run, so joints do not stack alpha. Back face is omitted. */
  const strokeFront = (points: Point[], alpha: number, lineWidth: number) => {
    ctx.strokeStyle = ink;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    let drawing = false;
    for (const point of points) {
      const q = project(point);
      if (!onFront(q)) {
        drawing = false;
        continue;
      }
      if (!drawing) ctx.moveTo(q[0], q[1]);
      else ctx.lineTo(q[0], q[1]);
      drawing = true;
    }
    ctx.stroke();
  };

  const strokeGrid = () => {
    for (const path of grid) strokeFront(path, 0.38, 0.7);
  };

  const strokeArc = (path: Point[], phase: number) => {
    strokeFront(path, 0.72, 0.9);
    if (motion.matches) return;
    const len = path.length - 1;
    const head = phase * len;
    const span = Math.max(5, Math.floor(len * 0.1));
    // The highlight wraps with `phase`, so one window can include samples
    // from both ends of the arc. Those runs are not adjacent; stroking them
    // as a single polyline joins the ends with a chord across the disk.
    let run: Point[] = [];
    let prev = -2;
    const flush = () => {
      if (run.length > 1) strokeFront(run, 0.9, 1.15);
      run = [];
    };
    for (let i = 0; i < path.length; i++) {
      const dist = Math.min(Math.abs(i - head), Math.abs(i - head - len), Math.abs(i - head + len));
      if (dist > span) continue;
      if (i !== prev + 1) flush();
      run.push(path[i]!);
      prev = i;
    }
    flush();
  };

  const draw = () => {
    readInk();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    strokeGrid();

    const rOcean = small ? 0.55 : 0.6;
    const rLand = small ? 0.65 : 0.72;
    ctx.fillStyle = ink;
    for (const { p, land } of dots) {
      const q = project(p);
      if (!onFront(q)) continue;
      ctx.globalAlpha = land ? 0.8 : 0.2;
      ctx.beginPath();
      ctx.arc(q[0], q[1], land ? rLand : rOcean, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, limbRadius(), 0, Math.PI * 2);
    ctx.stroke();

    const arcIds: string[] = [];
    for (const city of CITIES) {
      if (city.kind === "featured") arcIds.push(city.id);
    }
    if (activeCity?.kind === "footprint") arcIds.push(activeCity.id);
    arcIds.forEach((id, i) => {
      const path = arcById.get(id);
      if (!path) return;
      strokeArc(path, (animT / 10 + i * 0.13) % 1);
    });

    projectedCities = cityPoints.map(({ city, p }) => {
      const [x, y, z] = project(p);
      return { city, x, y, z };
    });

    const clusters = footprintClusters();
    const hidden = new Set<string>();
    for (const cluster of clusters) {
      if (cluster.members.length < 3 || clusterOpen(cluster)) continue;
      for (const member of cluster.members) hidden.add(member.city.id);
      ctx.strokeStyle = ink;
      ctx.globalAlpha = 0.8;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(cluster.x, cluster.y, small ? 4.5 : 5.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(cluster.x, cluster.y, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }

    const ordered = [...projectedCities].sort((a, b) => {
      const rank = (kind: CityKind) => (kind === "hub" ? 2 : kind === "featured" ? 1 : 0);
      return rank(a.city.kind) - rank(b.city.kind);
    });
    for (const { city, x, y, z } of ordered) {
      if (hidden.has(city.id) || !onFront(project(cityPoints.find((c) => c.city.id === city.id)!.p))) continue;
      if (z <= 0.03) continue;
      const active = activeCity?.id === city.id;
      const hubCity = city.kind === "hub";
      const core = hubCity ? (small ? 2.2 : 2.6) : city.kind === "featured" ? (small ? 1.5 : 1.7) : small ? 1.05 : 1.2;
      ctx.fillStyle = ink;
      ctx.globalAlpha = active ? 1 : 0.92;
      ctx.beginPath();
      ctx.arc(x, y, active ? core + 0.6 : core, 0, Math.PI * 2);
      ctx.fill();
      if (hubCity) {
        const pulse = motion.matches ? 0 : 0.5 + 0.5 * Math.sin(animT * 1.3);
        ctx.globalAlpha = 0.35 + pulse * 0.25;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(x, y, core + 2.4 + pulse * 1.2, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    drawCityLabels(hidden);

    // Reposition keyboard/pointer hit targets
    for (const { city, btn } of hits) {
      const proj = projectedCities.find((c) => c.city.id === city.id);
      if (!proj) continue;
      // Always focusable (keyboard rotates the city to the front); back side ignores pointer.
      btn.classList.toggle("is-back", proj.z < 0);
      btn.style.transform = `translate(${proj.x}px, ${proj.y}px)`;
      btn.classList.toggle("is-active", activeCity?.id === city.id);
    }
    placeLabel();
  };

  type Cluster = { members: typeof projectedCities; x: number; y: number };

  const footprintClusters = (): Cluster[] => {
    const seeds = projectedCities.filter((c) => c.city.kind === "footprint" && c.z > 0.08);
    const used = new Set<string>();
    const clusters: Cluster[] = [];
    for (const seed of seeds) {
      if (used.has(seed.city.id)) continue;
      const members = [seed];
      used.add(seed.city.id);
      let grew = true;
      while (grew) {
        grew = false;
        for (const other of seeds) {
          if (used.has(other.city.id)) continue;
          if (members.some((m) => Math.hypot(m.x - other.x, m.y - other.y) < CLUSTER_PX)) {
            members.push(other);
            used.add(other.city.id);
            grew = true;
          }
        }
      }
      clusters.push({
        members,
        x: members.reduce((sum, m) => sum + m.x, 0) / members.length,
        y: members.reduce((sum, m) => sum + m.y, 0) / members.length,
      });
    }
    return clusters;
  };

  const clusterOpen = (cluster: Cluster) => {
    if (cluster.members.some((m) => m.city.id === activeCity?.id || m.city.id === hoverCity?.id)) return true;
    if (!pointer) return false;
    return Math.hypot(pointer.x - cluster.x, pointer.y - cluster.y) < CLUSTER_PX + 10;
  };

  const drawCityLabels = (hidden: Set<string>) => {
    ctx.font = monoFont();
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillStyle = ink;
    ctx.strokeStyle = ink;
    const placed: { x: number; y: number }[] = [];
    const labels = projectedCities
      .filter((c) => c.city.kind === "featured" && !hidden.has(c.city.id) && c.z > 0.35 && c.city.id !== activeCity?.id)
      .sort((a, b) => b.z - a.z);
    for (const { city, x, y } of labels) {
      const text = city.nameZh;
      const textWidth = ctx.measureText(text).width;
      let lx = x + 8;
      let ly = y;
      if (lx + textWidth > width - 6) lx = x - 8 - textWidth;
      if (lx < 4) lx = 4;
      ly = Math.max(8, Math.min(height - 8, ly));
      if (placed.some((p) => Math.hypot(p.x - lx, p.y - ly) < textWidth)) continue;
      placed.push({ x: lx, y: ly });
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(lx < x ? lx + textWidth : lx, ly);
      ctx.stroke();
      ctx.globalAlpha = 0.88;
      ctx.fillText(text, lx, ly);
    }
    ctx.globalAlpha = 1;
  };

  const canvasPoint = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * width,
      y: ((clientY - rect.top) / rect.height) * height,
    };
  };

  const hiddenIds = () => {
    const hidden = new Set<string>();
    for (const cluster of footprintClusters()) {
      if (cluster.members.length < 3 || clusterOpen(cluster)) continue;
      for (const member of cluster.members) hidden.add(member.city.id);
    }
    return hidden;
  };

  const pickCityAt = (x: number, y: number): City | null => {
    const hidden = hiddenIds();
    let best: City | null = null;
    let bestDist = 13;
    for (const c of projectedCities) {
      if (c.z <= 0.03 || hidden.has(c.city.id)) continue;
      const d = Math.hypot(c.x - x, c.y - y);
      if (d < bestDist) {
        bestDist = d;
        best = c.city;
      }
    }
    if (hoverCity && !hidden.has(hoverCity.id)) {
      const current = projectedCities.find((c) => c.city.id === hoverCity!.id && c.z > 0.03);
      if (current) {
        const d = Math.hypot(current.x - x, current.y - y);
        if (d < 20 && (!best || d < bestDist * 1.45)) return hoverCity;
      }
    }
    if (best) return best;
    for (const cluster of footprintClusters()) {
      if (cluster.members.length < 3 || clusterOpen(cluster)) continue;
      if (Math.hypot(cluster.x - x, cluster.y - y) > 8) continue;
      let nearest = cluster.members[0]!;
      let nearestDist = Infinity;
      for (const member of cluster.members) {
        const d = Math.hypot(member.x - x, member.y - y);
        if (d < nearestDist) {
          nearest = member;
          nearestDist = d;
        }
      }
      return nearest.city;
    }
    return null;
  };

  const activate = (city: City | null) => {
    if (city?.id === activeCity?.id) {
      hoverCity = city;
      host.style.cursor = city ? "pointer" : dragging ? "grabbing" : "grab";
      return;
    }
    activeCity = city;
    hoverCity = city;
    setLabel(city ?? hub);
    host.style.cursor = city ? "pointer" : dragging ? "grabbing" : "grab";
    draw();
  };

  const flyTo = (city: City) => {
    const nextPitch = Math.max(-0.7, Math.min(0.7, city.lat * radians));
    target = { yaw: -city.lon * radians, pitch: nextPitch };
    inertia = 0;
    pinned = true;
    idleAt = performance.now() + 4500;
    if (motion.matches) {
      yaw = target.yaw;
      pitch = target.pitch;
      target = null;
    }
    activate(city);
    resume();
  };

  const render = (time: number) => {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
    previous = time;
    const now = performance.now();
    if (target) {
      const k = motion.matches ? 1 : 1 - Math.exp(-delta * 6);
      let dy = target.yaw - yaw;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      yaw += dy * k;
      pitch += (target.pitch - pitch) * k;
      if (Math.abs(dy) < 0.002 && Math.abs(target.pitch - pitch) < 0.002) target = null;
    } else if (!dragging && inertia && !motion.matches) {
      yaw += inertia;
      inertia *= Math.exp(-delta * 3.4);
      if (Math.abs(inertia) < 0.00035) inertia = 0;
    } else if (!motion.matches && !dragging && !pinned && !activeCity && now > idleAt) {
      yaw += delta * 0.045;
    }
    if (!motion.matches) animT += delta;
    draw();
    const busy = Boolean(dragging || inertia || target || (!motion.matches && now > idleAt));
    if (busy || activeCity || !motion.matches) frame = requestAnimationFrame(render);
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
    scale = Math.max(0, (Math.min(width, height) * 0.42) / SPHERE);
    draw();
    resume();
  });
  const palette = () => {
    readInk();
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

  const DRAG_PX = 6;

  const down = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const at = canvasPoint(e.clientX, e.clientY);
    pointer = at;
    gesture = {
      x: e.clientX,
      y: e.clientY,
      city: pickCityAt(at.x, at.y),
      dragged: false,
      pointerId: e.pointerId,
      kind: e.pointerType,
      lastX: e.clientX,
      lastY: e.clientY,
      lastT: performance.now(),
    };
    inertia = 0;
    idleAt = performance.now() + 4500;
  };
  const move = (e: PointerEvent) => {
    const at = canvasPoint(e.clientX, e.clientY);
    if (gesture && gesture.pointerId === e.pointerId) {
      const dx = e.clientX - gesture.x;
      const dy = e.clientY - gesture.y;
      const travel = Math.hypot(dx, dy);
      if (!gesture.dragged && travel > DRAG_PX) {
        const vertical = gesture.kind === "touch" && Math.abs(dy) > Math.abs(dx);
        if (vertical) {
          gesture = null;
          dragging = false;
          return;
        }
        gesture.dragged = true;
        dragging = true;
        pinned = false;
        if (gesture.kind !== "touch") {
          try {
            host.setPointerCapture(e.pointerId);
          } catch {
            /* Pointer may already be released. */
          }
        }
        host.style.cursor = "grabbing";
      }
      if (dragging && gesture) {
        const stepX = e.clientX - gesture.lastX;
        const stepY = e.clientY - gesture.lastY;
        const dt = Math.max(16, performance.now() - gesture.lastT);
        yaw += stepX * 0.005;
        if (gesture.kind !== "touch") {
          pitch = Math.max(-0.2, Math.min(0.6, pitch + stepY * 0.0035));
        }
        if (!motion.matches) inertia = (stepX * 0.005) / (dt / 16);
        gesture.lastX = e.clientX;
        gesture.lastY = e.clientY;
        gesture.lastT = performance.now();
        idleAt = performance.now() + 4500;
        resume();
        return;
      }
      return;
    }
    if (gesture?.dragged || dragging) return;
    if (e.pointerType !== "mouse") return;
    pointer = at;
    if (pinned) {
      draw();
      return;
    }
    activate(pickCityAt(at.x, at.y));
    draw();
  };
  const up = (e: PointerEvent) => {
    const current = gesture;
    if (current && e.pointerId !== current.pointerId) return;
    const wasDrag = Boolean(current?.dragged && dragging);
    const city = current && !current.dragged ? current.city : null;
    gesture = null;
    dragging = false;
    if (city) {
      flyTo(city);
      return;
    }
    if (wasDrag) {
      if (motion.matches) inertia = 0;
      idleAt = performance.now() + 4500;
      host.style.cursor = activeCity ? "pointer" : "grab";
      resume();
      return;
    }
    if (current && !current.city) {
      pinned = false;
      hoverCity = null;
      activate(null);
    }
    host.style.cursor = activeCity ? "pointer" : "grab";
  };
  const leave = () => {
    if (dragging || pinned) return;
    pointer = null;
    hoverCity = null;
    activate(null);
  };

  for (const { city, btn } of hits) {
    btn.addEventListener("focus", () => {
      flyTo(city);
    });
    btn.addEventListener("blur", () => {
      if (document.activeElement && hits.some((h) => h.btn === document.activeElement)) return;
      pinned = false;
      hoverCity = null;
      activate(null);
    });
    btn.addEventListener("pointerenter", () => activate(city));
  }

  host.append(canvas);
  host.classList.add("ready");
  host.style.cursor = "grab";
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
  host.addEventListener("pointerleave", leave);

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
    host.removeEventListener("pointerleave", leave);
    for (const { btn } of hits) btn.remove();
    canvas.remove();
    canvas.width = canvas.height = 0;
    host.classList.remove("ready");
    setLabel(hub);
  };
}
