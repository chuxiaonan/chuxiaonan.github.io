import { geoGraticule, geoInterpolate, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
// Natural Earth 110m land, TopoJSON via world-atlas. Public domain.
import landAtlas from "../data/land-110m.json";

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

type Slot = {
  city: City;
  index: number;
  x: number;
  y: number;
  front: boolean;
};

type Cluster = {
  idx: number[];
  count: number;
  x: number;
  y: number;
};

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

const DEG = 180 / Math.PI;
const ARC_STEPS = 48;

const landTopology = landAtlas as unknown as Topology<{ land: GeometryCollection }>;
const land = feature(landTopology, landTopology.objects.land);
const graticule = geoGraticule().step([20, 20])();

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

function greatArc(from: [number, number], to: [number, number]): GeoJSON.LineString {
  const interpolate = geoInterpolate(from, to);
  const coordinates: [number, number][] = new Array(ARC_STEPS + 1);
  for (let i = 0; i <= ARC_STEPS; i++) coordinates[i] = interpolate(i / ARC_STEPS);
  return { type: "LineString", coordinates };
}

type StoredArc = { id: string; kind: CityKind; line: GeoJSON.LineString };

/** Orthographic globe. `applyView` is the only camera update; d3-geo clips the back face. */
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
  const projection = geoOrthographic().clipAngle(90).precision(small ? 0.7 : 0.4);
  const path = geoPath(projection, ctx);
  const rotate: [number, number, number] = [0, 0, 0];
  const hub = CITIES.find((city) => city.kind === "hub")!;
  const hubLonLat: [number, number] = [hub.lon, hub.lat];
  const arcs: StoredArc[] = [];
  for (const city of CITIES) {
    if (city.kind === "hub") continue;
    arcs.push({
      id: city.id,
      kind: city.kind,
      line: greatArc(hubLonLat, [city.lon, city.lat]),
    });
  }
  const pulseLine: GeoJSON.LineString = { type: "LineString", coordinates: [] };

  const labelEl = document.querySelector<HTMLElement>("#globe-label");
  const labelCoord = document.querySelector<HTMLElement>("#globe-label-coord");
  const labelName = document.querySelector<HTMLElement>("#globe-label-name");
  const setLabel = (city: City) => {
    const { title, coord } = cityLabel(city);
    if (labelCoord) labelCoord.textContent = coord;
    if (labelName) labelName.textContent = title;
    if (labelEl) labelEl.dataset.city = city.id;
  };
  setLabel(hub);

  const cityIndex = new Map(CITIES.map((city, index) => [city.id, index]));
  const slots: Slot[] = CITIES.map((city, index) => ({
    city,
    index,
    x: 0,
    y: 0,
    front: false,
  }));
  const clusterPool: Cluster[] = CITIES.map(() => ({ idx: [], count: 0, x: 0, y: 0 }));
  const used = new Uint8Array(CITIES.length);
  const hidden = new Uint8Array(CITIES.length);
  let clusterCount = 0;

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
    dpr = 1,
    cx = 0,
    cy = 0,
    radius = 0;
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
      "ui-monospace, SFMono-Regular, Consolas, monospace";
    return `11px ${stack}`;
  };
  let activeCity: City | null = null;
  let hoverCity: City | null = null;
  let pinned = false;
  let target: { yaw: number; pitch: number } | null = null;
  let pointer: { x: number; y: number } | null = null;
  let inertia = 0;
  let idleAt = 0;
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

  const applyView = () => {
    rotate[0] = yaw * DEG;
    rotate[1] = -pitch * DEG;
    rotate[2] = 0;
    projection.rotate(rotate);
  };

  const projectCities = () => {
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i]!;
      const projected = projection([slot.city.lon, slot.city.lat]);
      if (!projected) {
        slot.front = false;
        continue;
      }
      slot.x = projected[0];
      slot.y = projected[1];
      slot.front = true;
    }
  };

  const buildClusters = () => {
    used.fill(0);
    clusterCount = 0;
    for (let i = 0; i < slots.length; i++) {
      const seed = slots[i]!;
      if (used[i] || seed.city.kind !== "footprint" || !seed.front) continue;
      const cluster = clusterPool[clusterCount]!;
      cluster.idx.length = 0;
      cluster.idx.push(i);
      used[i] = 1;
      let grew = true;
      while (grew) {
        grew = false;
        for (let j = 0; j < slots.length; j++) {
          if (used[j]) continue;
          const other = slots[j]!;
          if (other.city.kind !== "footprint" || !other.front) continue;
          for (let k = 0; k < cluster.idx.length; k++) {
            const member = slots[cluster.idx[k]!]!;
            if (Math.hypot(member.x - other.x, member.y - other.y) < CLUSTER_PX) {
              cluster.idx.push(j);
              used[j] = 1;
              grew = true;
              break;
            }
          }
        }
      }
      let sx = 0,
        sy = 0;
      for (let k = 0; k < cluster.idx.length; k++) {
        const member = slots[cluster.idx[k]!]!;
        sx += member.x;
        sy += member.y;
      }
      cluster.count = cluster.idx.length;
      cluster.x = sx / cluster.count;
      cluster.y = sy / cluster.count;
      clusterCount++;
    }
  };

  const clusterIsOpen = (cluster: Cluster) => {
    for (let i = 0; i < cluster.count; i++) {
      const id = slots[cluster.idx[i]!]!.city.id;
      if (id === activeCity?.id || id === hoverCity?.id) return true;
    }
    if (!pointer) return false;
    return Math.hypot(pointer.x - cluster.x, pointer.y - cluster.y) < CLUSTER_PX + 10;
  };

  const markHidden = () => {
    hidden.fill(0);
    for (let i = 0; i < clusterCount; i++) {
      const cluster = clusterPool[i]!;
      if (cluster.count < 3 || clusterIsOpen(cluster)) continue;
      for (let j = 0; j < cluster.count; j++) hidden[cluster.idx[j]!] = 1;
    }
  };

  const placeLabel = () => {
    if (!labelEl) return;
    const slot = activeCity ? slots.find((item) => item.city.id === activeCity!.id) : undefined;
    if (!slot?.front) {
      labelEl.classList.remove("is-anchored");
      labelEl.style.removeProperty("transform");
      return;
    }
    labelEl.classList.add("is-anchored");
    labelEl.classList.remove("is-flipped");
    const cardW = labelEl.offsetWidth || 132;
    const cardH = labelEl.offsetHeight || 36;
    let x = slot.x + 12;
    let y = slot.y - cardH - 10;
    if (x + cardW > width - 6) x = slot.x - cardW - 12;
    x = Math.max(6, Math.min(width - cardW - 6, x));
    if (y < 6) y = slot.y + 12;
    y = Math.max(6, Math.min(height - cardH - 6, y));
    const edgeX = Math.max(x, Math.min(slot.x, x + cardW));
    const edgeY = Math.max(y, Math.min(slot.y, y + cardH));
    ctx.strokeStyle = ink;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(slot.x, slot.y);
    ctx.lineTo(edgeX, edgeY);
    ctx.stroke();
    ctx.globalAlpha = 1;
    labelEl.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  };

  const drawLabels = () => {
    ctx.font = monoFont();
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillStyle = ink;
    ctx.strokeStyle = ink;
    let placed = 0;
    const placedX = new Float64Array(8);
    const placedY = new Float64Array(8);
    for (let i = 0; i < slots.length && placed < placedX.length; i++) {
      const slot = slots[i]!;
      if (slot.city.kind !== "featured" || !slot.front || slot.city.id === activeCity?.id) continue;
      const text = slot.city.nameZh;
      const textWidth = ctx.measureText(text).width;
      let lx = slot.x + 8;
      if (lx + textWidth > width - 6) lx = slot.x - 8 - textWidth;
      if (lx < 4) lx = 4;
      const ly = Math.max(8, Math.min(height - 8, slot.y));
      let blocked = false;
      for (let p = 0; p < placed; p++) {
        if (Math.hypot(placedX[p]! - lx, placedY[p]! - ly) < textWidth) blocked = true;
      }
      if (blocked) continue;
      placedX[placed] = lx;
      placedY[placed] = ly;
      placed++;
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(slot.x, slot.y);
      ctx.lineTo(lx < slot.x ? lx + textWidth : lx, ly);
      ctx.stroke();
      ctx.globalAlpha = 0.88;
      ctx.fillText(text, lx, ly);
    }
    ctx.globalAlpha = 1;
  };

  const drawArc = (line: GeoJSON.LineString, phase: number) => {
    ctx.globalAlpha = 0.75;
    ctx.lineWidth = 0.9;
    path(line);
    ctx.stroke();
    if (motion.matches) return;
    const coords = line.coordinates;
    const len = coords.length - 1;
    const head = phase * len;
    const span = Math.max(4, Math.floor(len * 0.1));
    const out = pulseLine.coordinates;
    out.length = 0;
    for (let i = 0; i < coords.length; i++) {
      const dist = Math.min(Math.abs(i - head), Math.abs(i - head - len), Math.abs(i - head + len));
      if (dist <= span) out.push(coords[i] as [number, number]);
    }
    if (out.length < 2) return;
    ctx.globalAlpha = 0.95;
    ctx.lineWidth = 1.15;
    path(pulseLine);
    ctx.stroke();
  };

  const draw = () => {
    readInk();
    applyView();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = ink;

    ctx.globalAlpha = 0.32;
    ctx.lineWidth = 0.6;
    path(graticule);
    ctx.stroke();

    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 0.85;
    path(land);
    ctx.stroke();

    ctx.globalAlpha = 0.92;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i]!;
      if (arc.kind !== "featured" && activeCity?.id !== arc.id) continue;
      drawArc(arc.line, (animT / 10 + i * 0.13) % 1);
    }

    projectCities();
    buildClusters();
    markHidden();

    ctx.fillStyle = ink;
    ctx.strokeStyle = ink;
    for (let i = 0; i < clusterCount; i++) {
      const cluster = clusterPool[i]!;
      if (cluster.count < 3 || clusterIsOpen(cluster)) continue;
      ctx.globalAlpha = 0.8;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(cluster.x, cluster.y, small ? 4.5 : 5.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cluster.x, cluster.y, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < slots.length; i++) {
      if (hidden[i]) continue;
      const slot = slots[i]!;
      if (!slot.front) continue;
      const active = activeCity?.id === slot.city.id;
      const hubCity = slot.city.kind === "hub";
      const core = hubCity
        ? small
          ? 2.2
          : 2.6
        : slot.city.kind === "featured"
          ? small
            ? 1.5
            : 1.7
          : small
            ? 1.05
            : 1.2;
      ctx.globalAlpha = active ? 1 : 0.92;
      ctx.beginPath();
      ctx.arc(slot.x, slot.y, active ? core + 0.6 : core, 0, Math.PI * 2);
      ctx.fill();
      if (hubCity) {
        const pulse = motion.matches ? 0 : 0.5 + 0.5 * Math.sin(animT * 1.3);
        ctx.globalAlpha = 0.35 + pulse * 0.25;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(slot.x, slot.y, core + 2.4 + pulse * 1.2, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    drawLabels();
    placeLabel();

    for (const { city, btn } of hits) {
      const found = slots[cityIndex.get(city.id)!]!;
      btn.classList.toggle("is-back", !found.front);
      if (found.front) btn.style.transform = `translate(${found.x}px, ${found.y}px)`;
      btn.classList.toggle("is-active", activeCity?.id === city.id);
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

  const pickCityAt = (x: number, y: number): City | null => {
    let best: City | null = null;
    let bestDist = 13;
    for (let i = 0; i < slots.length; i++) {
      if (hidden[i]) continue;
      const slot = slots[i]!;
      if (!slot.front) continue;
      const d = Math.hypot(slot.x - x, slot.y - y);
      if (d < bestDist) {
        bestDist = d;
        best = slot.city;
      }
    }
    if (hoverCity) {
      const current = slots.find((slot) => slot.city.id === hoverCity!.id && slot.front && !hidden[slot.index]);
      if (current) {
        const d = Math.hypot(current.x - x, current.y - y);
        if (d < 20 && (!best || d < bestDist * 1.45)) return hoverCity;
      }
    }
    if (best) return best;
    for (let i = 0; i < clusterCount; i++) {
      const cluster = clusterPool[i]!;
      if (cluster.count < 3 || clusterIsOpen(cluster)) continue;
      if (Math.hypot(cluster.x - x, cluster.y - y) > 8) continue;
      let nearest = slots[cluster.idx[0]!]!;
      let nearestDist = Infinity;
      for (let j = 0; j < cluster.count; j++) {
        const member = slots[cluster.idx[j]!]!;
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
    cx = width / 2;
    cy = height / 2;
    radius = Math.min(width, height) * 0.42;
    projection.scale(radius).translate([cx, cy]).precision(small || width < 500 ? 0.7 : 0.4);
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
      if (document.activeElement && hits.some((hit) => hit.btn === document.activeElement)) return;
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
