/** Great-circle samples and orthographic limb clipping. Scratch buffers are reused. */

export const ARC_STEPS = 48;

const RAD = Math.PI / 180;
/** Just past the limb plane. Keeps a city dot from popping inside the disk. */
const CITY_FRONT = 0.004;
/** Samples strictly in front. The limb point is added separately. */
const ARC_FRONT = 1e-4;
/** A real sample step is a couple of degrees. Anything longer is a chord. */
const MAX_STEP_FRAC = 0.2;

const slerpOut = new Float64Array(3);
const limbXY = { x: 0, y: 0 };

export function writeGreatCircle(
  lon0: number,
  lat0: number,
  lon1: number,
  lat1: number,
  steps: number,
  out: Float64Array,
): void {
  const cos0 = Math.cos(lat0 * RAD);
  const cos1 = Math.cos(lat1 * RAD);
  const ax = cos0 * Math.sin(lon0 * RAD);
  const ay = Math.sin(lat0 * RAD);
  const az = cos0 * Math.cos(lon0 * RAD);
  const bx = cos1 * Math.sin(lon1 * RAD);
  const by = Math.sin(lat1 * RAD);
  const bz = cos1 * Math.cos(lon1 * RAD);
  let dot = ax * bx + ay * by + az * bz;
  if (dot > 1) dot = 1;
  else if (dot < -1) dot = -1;
  const omega = Math.acos(dot);
  const so = Math.sin(omega);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const s0 = so < 1e-6 ? 1 - t : Math.sin((1 - t) * omega) / so;
    const s1 = so < 1e-6 ? t : Math.sin(t * omega) / so;
    out[i * 3] = ax * s0 + bx * s1;
    out[i * 3 + 1] = ay * s0 + by * s1;
    out[i * 3 + 2] = az * s0 + bz * s1;
  }
}

export function rotateSamples(
  xyz: Float64Array,
  yaw: number,
  pitch: number,
  vx: Float64Array,
  vy: Float64Array,
  vz: Float64Array,
): void {
  const cyaw = Math.cos(yaw);
  const syaw = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const n = vx.length;
  for (let i = 0; i < n; i++) {
    const x = xyz[i * 3]!;
    const y = xyz[i * 3 + 1]!;
    const z = xyz[i * 3 + 2]!;
    const rx = x * cyaw + z * syaw;
    const rz = z * cyaw - x * syaw;
    vx[i] = rx;
    vy[i] = y * cp - rz * sp;
    vz[i] = y * sp + rz * cp;
  }
}

export function projectLonLat(
  lon: number,
  lat: number,
  yaw: number,
  pitch: number,
  cx: number,
  cy: number,
  radius: number,
  out: { x: number; y: number; front: boolean },
): void {
  const cosLat = Math.cos(lat * RAD);
  const x = cosLat * Math.sin(lon * RAD);
  const y = Math.sin(lat * RAD);
  const z = cosLat * Math.cos(lon * RAD);
  const cyaw = Math.cos(yaw);
  const syaw = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const rx = x * cyaw + z * syaw;
  const rz = z * cyaw - x * syaw;
  const ry = y * cp - rz * sp;
  const depth = y * sp + rz * cp;
  out.x = cx + rx * radius;
  out.y = cy - ry * radius;
  out.front = depth > CITY_FRONT;
}

function slerpTo(
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
  t: number,
): void {
  let dot = ax * bx + ay * by + az * bz;
  if (dot > 1) dot = 1;
  else if (dot < -1) dot = -1;
  const omega = Math.acos(dot);
  const so = Math.sin(omega);
  const s0 = so < 1e-6 ? 1 - t : Math.sin((1 - t) * omega) / so;
  const s1 = so < 1e-6 ? t : Math.sin(t * omega) / so;
  slerpOut[0] = ax * s0 + bx * s1;
  slerpOut[1] = ay * s0 + by * s1;
  slerpOut[2] = az * s0 + bz * s1;
}

/** First sample is in front, second is behind. Writes the limb point into `limbXY`. */
function limbPoint(
  vx: Float64Array,
  vy: Float64Array,
  vz: Float64Array,
  frontI: number,
  backI: number,
  cx: number,
  cy: number,
  radius: number,
): void {
  const ax = vx[frontI]!;
  const ay = vy[frontI]!;
  const az = vz[frontI]!;
  const bx = vx[backI]!;
  const by = vy[backI]!;
  const bz = vz[backI]!;
  let lo = 0;
  let hi = 1;
  for (let k = 0; k < 14; k++) {
    const t = (lo + hi) * 0.5;
    slerpTo(ax, ay, az, bx, by, bz, t);
    if (slerpOut[2]! > 0) lo = t;
    else hi = t;
  }
  slerpTo(ax, ay, az, bx, by, bz, (lo + hi) * 0.5);
  limbXY.x = cx + slerpOut[0]! * radius;
  limbXY.y = cy - slerpOut[1]! * radius;
}

/**
 * Stroke only the front portion of one hub→city arc.
 * A run that reaches the horizon ends on the limb. A screen jump becomes a
 * new subpath, so a back-face gap can never be drawn as a chord.
 * Not reentrant: the limb search reuses one scratch vector.
 */
export function traceVisible(
  vx: Float64Array,
  vy: Float64Array,
  vz: Float64Array,
  i0: number,
  i1: number,
  cx: number,
  cy: number,
  radius: number,
  moveTo: (x: number, y: number) => void,
  lineTo: (x: number, y: number) => void,
): void {
  const max2 = radius * MAX_STEP_FRAC * (radius * MAX_STEP_FRAC);
  let drawing = false;
  let px = 0;
  let py = 0;
  const pen = (x: number, y: number) => {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    if (!drawing) {
      moveTo(x, y);
      drawing = true;
    } else {
      const dx = x - px;
      const dy = y - py;
      if (dx * dx + dy * dy > max2) moveTo(x, y);
      else lineTo(x, y);
    }
    px = x;
    py = y;
  };

  for (let i = i0; i <= i1; i++) {
    const front = vz[i]! > ARC_FRONT;
    if (!front) {
      if (drawing && i > 0 && vz[i - 1]! > ARC_FRONT) {
        limbPoint(vx, vy, vz, i - 1, i, cx, cy, radius);
        pen(limbXY.x, limbXY.y);
        drawing = false;
      }
      continue;
    }
    if (!drawing && i > 0 && vz[i - 1]! <= ARC_FRONT) {
      limbPoint(vx, vy, vz, i, i - 1, cx, cy, radius);
      pen(limbXY.x, limbXY.y);
    }
    pen(cx + vx[i]! * radius, cy - vy[i]! * radius);
  }
}
