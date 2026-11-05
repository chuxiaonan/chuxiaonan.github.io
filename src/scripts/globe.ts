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
    const flip = proj.x > width - 190;
    labelEl.classList.add("is-anchored");
    labelEl.classList.toggle("is-flipped", flip);
    labelEl.style.transform = `translate(${Math.round(proj.x + (flip ? -14 : 14))}px, ${Math.round(proj.y - 14)}px)`;
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
      const s = (1.26 + Math.sin(Math.PI * t) * 0.22) / Math.hypot(...v);
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
  let yaw = -1.9,
    pitch = 0.28,
    frame = 0,
    previous = 0,
    animT = 0;
  let visible = false,
    disposed = false,
    dragging = false;
  let lastX = 0,
    lastY = 0,
    ink = "#161616";
  const readInk = () => {
    ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || ink;
  };
  let activeCity: City | null = null;
  let pinned = false;
  let target: { yaw: number; pitch: number } | null = null;
  let projectedCities: { city: City; x: number; y: number; z: number }[] = [];

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

  const strokeGrid = () => {
    ctx.strokeStyle = ink;
    ctx.lineWidth = 0.65;
    for (const path of grid) {
      for (let i = 1; i < path.length; i++) {
        const a = project(path[i - 1]!);
        const b = project(path[i]!);
        ctx.globalAlpha = a[2] + b[2] > 0 ? 0.28 : 0.1;
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }
    }
  };

  const strokeArcBase = (path: Point[]) => {
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.05;
    for (let i = 1; i < path.length; i++) {
      const a = project(path[i - 1]!);
      const b = project(path[i]!);
      const front = a[2] + b[2] > 0;
      ctx.globalAlpha = front ? 0.45 : 0.12;
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();
    }
  };

  const strokeArcPulse = (path: Point[], phase: number) => {
    if (motion.matches) return;
    const len = path.length - 1;
    const head = phase * len;
    const span = Math.max(4, Math.floor(len * 0.12));
    ctx.lineWidth = 2;
    ctx.strokeStyle = ink;
    for (let i = 1; i < path.length; i++) {
      const dist = Math.min(Math.abs(i - head), Math.abs(i - head - len), Math.abs(i - head + len));
      if (dist > span) continue;
      const a = project(path[i - 1]!);
      const b = project(path[i]!);
      if (a[2] + b[2] <= 0) continue;
      ctx.globalAlpha = (1 - dist / span) * 0.95;
      ctx.beginPath();
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
      ctx.stroke();
    }
  };

  const draw = () => {
    readInk();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    strokeGrid();

    const rOcean = small ? 0.75 : 0.8;
    const rLand = small ? 0.9 : 0.95;
    for (const { p, land } of dots) {
      const [x, y, z] = project(p);
      if (land) {
        ctx.fillStyle = ink;
        ctx.globalAlpha = z > 0 ? 0.95 : 0.2;
        ctx.beginPath();
        ctx.arc(x, y, rLand, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = ink;
        ctx.globalAlpha = z > 0 ? 0.28 : 0.07;
        ctx.beginPath();
        ctx.arc(x, y, rOcean, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const arcIds: string[] = [];
    for (const city of CITIES) {
      if (city.kind === "featured") arcIds.push(city.id);
    }
    if (activeCity?.kind === "footprint") arcIds.push(activeCity.id);
    arcIds.forEach((id, i) => {
      const path = arcById.get(id);
      if (!path) return;
      strokeArcBase(path);
      const phase = (animT / 10 + i * 0.13) % 1;
      strokeArcPulse(path, phase);
    });

    projectedCities = cityPoints.map(({ city, p }) => {
      const [x, y, z] = project(p);
      return { city, x, y, z };
    });

    const ordered = [...projectedCities].sort((a, b) => {
      const rank = (kind: CityKind) => (kind === "hub" ? 2 : kind === "featured" ? 1 : 0);
      return rank(a.city.kind) - rank(b.city.kind);
    });
    for (const { city, x, y, z } of ordered) {
      if (z < -0.05) continue;
      const active = activeCity?.id === city.id;
      const hubCity = city.kind === "hub";
      const front = z > 0;
      const core = hubCity ? (small ? 3.4 : 4.2) : active ? (small ? 2.6 : 3) : small ? 1.8 : 2.15;
      const pulse = hubCity && !motion.matches ? 0.5 + 0.5 * Math.sin(animT * 1.3) : 0;
      const glow = hubCity ? core * 2.6 + pulse * 3.2 : core * 2.4;
      ctx.fillStyle = ink;
      ctx.globalAlpha = front ? (hubCity ? 0.34 + pulse * 0.28 : active ? 0.5 : 0.34) : 0.1;
      ctx.beginPath();
      ctx.arc(x, y, glow, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = ink;
      ctx.globalAlpha = front ? 0.95 : 0.28;
      ctx.beginPath();
      ctx.arc(x, y, core, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = '13px "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';
    ctx.textBaseline = "bottom";
    ctx.textAlign = "left";
    const labelCandidates: { x: number; y: number; z: number; text: string }[] = [];
    for (const { city, x, y, z } of projectedCities) {
      if (city.kind === "footprint") continue;
      if (city.kind === "hub" && (!activeCity || activeCity.id === hub.id)) continue;
      if (z < 0.35) continue;
      if (activeCity?.id === city.id) continue;
      if (x < 4 || x > width - 48 || y < 18 || y > height - 6) continue;
      labelCandidates.push({ x: x + 8, y: y - 6, z, text: city.nameZh });
    }
    labelCandidates.sort((a, b) => b.z - a.z);
    const placed: { x: number; y: number }[] = [];
    ctx.fillStyle = ink;
    for (const label of labelCandidates) {
      if (placed.some((p) => Math.hypot(p.x - label.x, p.y - label.y) < 46)) continue;
      placed.push(label);
      ctx.globalAlpha = 0.9;
      ctx.fillText(label.text, label.x, label.y);
    }
    ctx.globalAlpha = 1;

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

  const pickCity = (clientX: number, clientY: number): City | null => {
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * width;
    const y = ((clientY - rect.top) / rect.height) * height;
    let best: City | null = null;
    let bestDist = 16;
    for (const c of projectedCities) {
      if (c.z < 0) continue;
      const d = Math.hypot(c.x - x, c.y - y);
      if (d < bestDist) {
        bestDist = d;
        best = c.city;
      }
    }
    return best;
  };

  const activate = (city: City | null) => {
    activeCity = city;
    setLabel(city ?? hub);
    host.style.cursor = city ? "pointer" : dragging ? "grabbing" : "grab";
    draw();
  };

  const render = (time: number) => {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
    previous = time;
    if (target) {
      const k = motion.matches ? 1 : 1 - Math.exp(-delta * 6);
      let dy = target.yaw - yaw;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      yaw += dy * k;
      pitch += (target.pitch - pitch) * k;
      if (Math.abs(dy) < 0.002 && Math.abs(target.pitch - pitch) < 0.002) target = null;
    } else if (!motion.matches) {
      if (!dragging && !activeCity) yaw += delta * 0.05;
    }
    if (!motion.matches) animT += delta;
    draw();
    if (!motion.matches || activeCity || target) frame = requestAnimationFrame(render);
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
    scale = Math.max(0, (Math.min(width, height) * 0.46) / 1.5);
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

  const down = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const hit = pickCity(e.clientX, e.clientY);
    if (e.pointerType !== "mouse") pinned = !!hit;
    if (hit) {
      activate(hit);
      return;
    }
    if (pinned === false && activeCity && e.pointerType !== "mouse") activate(null);
    if (motion.matches) return;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    host.setPointerCapture(e.pointerId);
    host.style.cursor = "grabbing";
  };
  const move = (e: PointerEvent) => {
    if (dragging && !motion.matches) {
      yaw += (e.clientX - lastX) * 0.005;
      pitch = Math.max(-1.1, Math.min(1.1, pitch + (e.clientY - lastY) * 0.005));
      lastX = e.clientX;
      lastY = e.clientY;
      resume();
      return;
    }
    if (pinned || e.pointerType !== "mouse") return;
    activate(pickCity(e.clientX, e.clientY));
  };
  const up = () => {
    dragging = false;
    host.style.cursor = activeCity ? "pointer" : "grab";
  };
  const leave = () => {
    if (!dragging && !pinned) activate(null);
  };

  for (const { city, btn } of hits) {
    btn.addEventListener("focus", () => {
      target = {
        yaw: -city.lon * radians,
        pitch: Math.max(-1.1, Math.min(1.1, city.lat * radians)),
      };
      if (motion.matches) {
        yaw = target.yaw;
        pitch = target.pitch;
        target = null;
      }
      activate(city);
      resume();
    });
    btn.addEventListener("blur", () => {
      if (document.activeElement && hits.some((h) => h.btn === document.activeElement)) return;
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
