import * as THREE from "three";

export function initGlobe(host: HTMLElement): () => void {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.z = 4.4;
  const globe = new THREE.Group();
  globe.rotation.set(0.15, -0.65, -0.15);
  scene.add(globe);
  const small = matchMedia("(max-width: 700px)").matches;
  const detail = small ? 48 : 96;
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x70bca5,
    transparent: true,
    opacity: 0.3,
  });
  const pointMaterial = new THREE.PointsMaterial({
    color: 0xb4f1da,
    size: small ? 0.012 : 0.009,
    transparent: true,
    opacity: 0.8,
  });
  const toVector = (lat: number, lon: number, radius = 1.25) => {
    const phi = THREE.MathUtils.degToRad(lat),
      theta = THREE.MathUtils.degToRad(lon);
    return new THREE.Vector3(
      radius * Math.cos(phi) * Math.sin(theta),
      radius * Math.sin(phi),
      radius * Math.cos(phi) * Math.cos(theta),
    );
  };
  const line = (points: THREE.Vector3[], material = lineMaterial) => {
    const object = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      material,
    );
    globe.add(object);
  };
  for (let lat = -75; lat <= 75; lat += 15) {
    line(
      Array.from({ length: detail + 1 }, (_, i) =>
        toVector(lat, (i / detail) * 360),
      ),
    );
  }
  for (let lon = 0; lon < 360; lon += 15) {
    line(
      Array.from({ length: detail + 1 }, (_, i) =>
        toVector((i / detail) * 180 - 90, lon),
      ),
    );
  }
  const points: THREE.Vector3[] = [];
  // A uniformly sampled field gives the sphere a technical point-cloud surface.
  const count = small ? 750 : 1800;
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const angle = i * Math.PI * (3 - Math.sqrt(5));
    const radius = Math.sqrt(1 - y * y);
    points.push(
      new THREE.Vector3(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius,
      ).multiplyScalar(1.253),
    );
  }
  globe.add(
    new THREE.Points(
      new THREE.BufferGeometry().setFromPoints(points),
      pointMaterial,
    ),
  );
  const accentMaterial = new THREE.LineBasicMaterial({
    color: 0xc0f7dd,
    transparent: true,
    opacity: 0.75,
  });
  const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xcaffdf });
  const beijing = toVector(39.9, 116.4);
  // Abstract connections from Beijing; these are visual elements, not project locations.
  for (const [lat, lon] of [
    [20, 65],
    [-5, 95],
    [55, 155],
  ]) {
    const target = toVector(lat!, lon!);
    line(
      Array.from({ length: 65 }, (_, i) => {
        const t = i / 64;
        return beijing
          .clone()
          .lerp(target, t)
          .normalize()
          .multiplyScalar(1.26 + Math.sin(Math.PI * t) * 0.22);
      }),
      accentMaterial,
    );
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.018, 8, 8),
      markerMaterial,
    );
    marker.position.copy(target);
    globe.add(marker);
  }
  const marker = new THREE.Mesh(
    new THREE.SphereGeometry(0.028, 12, 12),
    markerMaterial,
  );
  marker.position.copy(beijing);
  globe.add(marker);
  host.append(renderer.domElement);
  host.classList.add("ready");
  let frame = 0,
    visible = false,
    disposed = false,
    dragging = false,
    lastX = 0,
    lastY = 0;
  let parallaxX = 0,
    parallaxY = 0,
    previous = 0;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const render = (time: number) => {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
    previous = time;
    if (!motion.matches && !dragging) globe.rotation.y += delta * 0.065;
    camera.position.x += (parallaxX - camera.position.x) * 0.04;
    camera.position.y += (parallaxY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    if (!motion.matches) frame = requestAnimationFrame(render);
  };
  const resume = () => {
    if (!frame && visible && !document.hidden && !disposed) {
      previous = 0;
      frame = requestAnimationFrame(render);
    }
  };
  const pause = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
  };
  const systemTheme = matchMedia("(prefers-color-scheme: light)");
  const updatePalette = () => {
    const light =
      getComputedStyle(document.documentElement).colorScheme === "light";
    lineMaterial.color.set(light ? 0x34745f : 0x70bca5);
    lineMaterial.opacity = light ? 0.42 : 0.3;
    pointMaterial.color.set(light ? 0x286b53 : 0xb4f1da);
    accentMaterial.color.set(light ? 0x1b6c4d : 0xc0f7dd);
    markerMaterial.color.set(light ? 0x1b6c4d : 0xcaffdf);
    resume();
  };
  const themeObserver = new MutationObserver(updatePalette);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  systemTheme.addEventListener("change", updatePalette);
  updatePalette();
  const observer = new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? false;
    if (visible) resume();
    else pause();
  });
  observer.observe(host);
  const resize = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    resume();
  });
  resize.observe(host);
  const visibility = () => {
    if (document.hidden) pause();
    else resume();
  };
  const motionChange = () => {
    pause();
    resume();
  };
  const down = (event: PointerEvent) => {
    if (motion.matches) return;
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    host.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent) => {
    if (motion.matches) return;
    if (dragging) {
      globe.rotation.y += (event.clientX - lastX) * 0.005;
      globe.rotation.x = THREE.MathUtils.clamp(
        globe.rotation.x + (event.clientY - lastY) * 0.005,
        -1.1,
        1.1,
      );
    } else {
      const rect = host.getBoundingClientRect();
      parallaxX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.12;
      parallaxY = -((event.clientY - rect.top) / rect.height - 0.5) * 0.12;
    }
    lastX = event.clientX;
    lastY = event.clientY;
  };
  const up = () => {
    dragging = false;
  };
  const leave = () => {
    parallaxX = 0;
    parallaxY = 0;
  };
  document.addEventListener("visibilitychange", visibility);
  motion.addEventListener("change", motionChange);
  host.addEventListener("pointerdown", down);
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerup", up);
  host.addEventListener("pointercancel", up);
  host.addEventListener("lostpointercapture", up);
  host.addEventListener("pointerleave", leave);
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    pause();
    observer.disconnect();
    resize.disconnect();
    themeObserver.disconnect();
    systemTheme.removeEventListener("change", updatePalette);
    document.removeEventListener("visibilitychange", visibility);
    motion.removeEventListener("change", motionChange);
    host.removeEventListener("pointerdown", down);
    host.removeEventListener("pointermove", move);
    host.removeEventListener("pointerup", up);
    host.removeEventListener("pointercancel", up);
    host.removeEventListener("lostpointercapture", up);
    host.removeEventListener("pointerleave", leave);
    renderer.domElement.removeEventListener("webglcontextlost", contextLost);
    scene.traverse((object) => {
      if (
        object instanceof THREE.Mesh ||
        object instanceof THREE.Line ||
        object instanceof THREE.Points
      )
        object.geometry.dispose();
    });
    lineMaterial.dispose();
    pointMaterial.dispose();
    accentMaterial.dispose();
    markerMaterial.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    host.classList.remove("ready");
  };
  const contextLost = (event: Event) => {
    event.preventDefault();
    dispose();
  };
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  return dispose;
}
