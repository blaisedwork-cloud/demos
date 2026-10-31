/* ---------- assembly engine: any client's job, built part by part as the visitor scrolls ----------
   Reads the scene description from <script type="application/json" id="scene-data"> (see references/scene-design.md).
   T runs 0 → N along the page: 0 is the finished job in the hero, it comes apart by the process intro, and the parts
   of stage k land as step card k reaches the middle of the screen. three.js loads only once a visitor is there: on the
   first scroll, touch, pointer move or key press (or after 8 s), never while the page itself is loading. */
const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const D2R = Math.PI / 180;
function mulberry(seed) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const S = JSON.parse($('#scene-data').textContent);
const canvas = $('#stage');
const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
let reduce = mqReduce.matches;
const idle = cb => ('requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 1500 }) : setTimeout(cb, 250));
const WAKE = ['scroll', 'wheel', 'pointermove', 'pointerdown', 'touchstart', 'keydown'];
let booted = false;
const boot = () => {
  if (booted) return; booted = true;
  WAKE.forEach(e => removeEventListener(e, boot));
  idle(() => init().catch(err => { console.warn('3D unavailable:', err); canvas.remove(); }));
};
// the page is readable and fast first; phones don't spend battery on a scene until someone is looking
const arm = () => { if (scrollY > 0) return boot(); WAKE.forEach(e => addEventListener(e, boot, { passive: true })); setTimeout(boot, 8000); };
document.readyState === 'complete' ? arm() : addEventListener('load', arm);

// Materials anyone can name in a scene; a scene's own "materials" override or add to these.
const PRESETS = {
  timber: { color: '#a8754a', rough: .6 }, hardwood: { color: '#8b5a36', rough: .5 }, pine: { color: '#d9c08f', rough: .85 },
  frame: { color: '#c8bb93', rough: .85 }, ply: { color: '#d8bf94', rough: .8 }, concrete: { color: '#bdb7ac', rough: .95 },
  render: { color: '#ece6db', rough: .9 }, brick: { color: '#a5553a', rough: .9 }, stone: { color: '#9a948b', rough: .9 },
  block: { color: '#8f8a83', rough: .95 }, sand: { color: '#d9c79e', rough: 1 }, gravel: { color: '#a59e92', rough: 1 },
  soil: { color: '#7a5a3c', rough: 1 }, turf: { color: '#6f9a4a', rough: .95 }, leaf: { color: '#5f7d45', rough: .85 },
  bark: { color: '#5a4030', rough: .9 }, steel: { color: '#9ea4a6', rough: .45, metal: .55 }, galv: { color: '#b9bec0', rough: .4, metal: .6 },
  sheet: { color: '#3a3d40', rough: .5, metal: .3 }, tile: { color: '#e9e6e1', rough: .35 }, rooftile: { color: '#9c4a32', rough: .8 },
  glass: { color: '#2d3437', rough: .12, metal: .2, opacity: .75 }, water: { color: '#3fb7d6', rough: .08, metal: .1, opacity: .78 },
  copper: { color: '#b87333', rough: .35, metal: .8 }, pvc: { color: '#e8e8e8', rough: .5 }, chrome: { color: '#d5d8db', rough: .15, metal: .9 },
  solar: { color: '#1b2a4a', rough: .22, metal: .4 }, white: { color: '#f2f2f2', rough: .7 }, black: { color: '#222222', rough: .6 },
  dark: { color: '#4a3a2e', rough: .6 }, fabric: { color: '#d9cdb8', rough: .95 }, pot: { color: '#b78a64', rough: .9 },
  cable: { color: '#2b2b2b', rough: .5 }, rubber: { color: '#1d1d1d', rough: .9 },
};
const LIGHTS = {     // hemisphere sky/ground, sun colour and strength, fill
  golden: { sky: 0xfff3e2, ground: 0x8c7b5e, hemi: 1.15, sun: 0xffd6a6, sunI: 3.1, fill: .35 },
  day:    { sky: 0xf4f8ff, ground: 0x8a8f86, hemi: 1.25, sun: 0xfff4e6, sunI: 2.8, fill: .45 },
  dusk:   { sky: 0x9fb4d8, ground: 0x3a3440, hemi: .8, sun: 0xffb27a, sunI: 2.4, fill: .3 },
  evening: { sky: 0xc9d3e6, ground: 0x3c4048, hemi: 1.05, sun: 0xffe2c4, sunI: 1.5, fill: .35 },   // neutral walls, so glows read
  studio: { sky: 0xffffff, ground: 0x9a9a9a, hemi: 1.4, sun: 0xffffff, sunI: 2.2, fill: .6 },
  night:  { sky: 0x9aa3b8, ground: 0x23262e, hemi: .5, sun: 0xb4c2ec, sunI: .8, fill: .18 },    // blue hour: lamps and glows carry the scene
};

async function init() {
  const THREE = await import('three');
  const rand = mulberry(S.seed || 2287);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = S.env?.exposure ?? 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;               // shadows re-render only on frames where something moved

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(S.camera?.fov || 32, innerWidth / innerHeight, .05, 400);
  const N = $$('.step-card').length || 4;

  /* ---------- materials ---------- */
  const mats = {}, finishes = [];
  const defs = { ...PRESETS, ...(S.materials || {}) };
  function mat(name) {
    if (mats[name]) return mats[name];
    const d = defs[name] || (/^#/.test(name) ? { color: name } : PRESETS.white);
    const base = defs[d.like] || {};
    const m = new THREE.MeshStandardMaterial({ color: d.color || base.color || '#cccccc', roughness: d.rough ?? base.rough ?? .8, metalness: d.metal ?? base.metal ?? 0 });
    const op = d.opacity ?? base.opacity;
    if (op != null && op < 1) { m.transparent = true; m.opacity = op; m.depthWrite = false; }
    if (d.from) finishes.push({ m, from: new THREE.Color(d.from), to: new THREE.Color(m.color), r0: d.fromRough ?? Math.min(1, m.roughness + .25), r1: m.roughness, at: d.finishAt ?? N });
    if (d.glow) { m.emissive = new THREE.Color(d.glow); m.emissiveIntensity = 0; finishes.push({ m, glow: d.glowStrength ?? 1.4, at: d.glowAt ?? N }); }
    return (mats[name] = m);
  }

  /* ---------- geometry ---------- */
  const geoCache = {};
  const cached = (key, make) => geoCache[key] || (geoCache[key] = make());
  function geometry(p) {
    const s = p.size || [1, 1, 1];
    switch (p.shape || 'box') {
      case 'box': return cached('box', () => new THREE.BoxGeometry(1, 1, 1).translate(0, .5, 0));     // origin at the bottom face
      case 'cyl': case 'cone': {
        const r1 = p.r ?? p.r1 ?? .5, r2 = p.shape === 'cone' ? 0 : (p.r2 ?? r1), h = p.h ?? 1, seg = p.seg ?? 20;
        return cached(`cyl${r1},${r2},${h},${seg}`, () => new THREE.CylinderGeometry(r2, r1, h, seg).translate(0, h / 2, 0));
      }
      case 'sphere': return cached('sph', () => new THREE.SphereGeometry(.5, 24, 16));
      case 'blob': return cached('blob' + (p.detail ?? 1), () => new THREE.IcosahedronGeometry(.5, p.detail ?? 1));
      case 'plane': return cached('plane', () => new THREE.BoxGeometry(1, 1, 1).translate(0, .5, 0));
      case 'tube': {
        const pts = p.path.map(v => new THREE.Vector3(...v));
        let curve;
        if (p.curve === 'smooth') curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', .2);
        else { curve = new THREE.CurvePath(); for (let i = 1; i < pts.length; i++) curve.add(new THREE.LineCurve3(pts[i - 1], pts[i])); }
        const segs = Math.max(16, Math.round(curve.getLength() * (p.detail ?? 24)));
        const g = new THREE.TubeGeometry(curve, segs, p.r ?? .03, p.radial ?? 8, false);
        g.userData = { segs, radial: p.radial ?? 8 };
        return g;
      }
      case 'extrude': {
        const sh = new THREE.Shape(p.points.map(([x, y]) => new THREE.Vector2(x, y)));
        for (const hole of p.holes || []) sh.holes.push(new THREE.Path(hole.map(([x, y]) => new THREE.Vector2(x, y))));
        return new THREE.ExtrudeGeometry(sh, { depth: p.depth ?? .1, bevelEnabled: false });
      }
      default: throw new Error('unknown shape ' + p.shape);
    }
  }
  function mesh(p, at, i = 0) {
    const m = new THREE.Mesh(geometry(p), mat(p.mats ? p.mats[i % p.mats.length] : p.mat || 'white'));   // mats: cycle through several (boards, bricks)
    const s = p.size || [1, 1, 1];
    if (p.shape === 'plane') m.scale.set(s[0], p.thick ?? .02, s[1] ?? s[0]);
    else if (!p.shape || p.shape === 'box' || p.shape === 'sphere' || p.shape === 'blob') m.scale.set(s[0], s[1] ?? s[0], s[2] ?? s[0]);
    if (p.shape !== 'tube') m.position.set(...at);
    if (p.rot) m.rotation.set(p.rot[0] * D2R, (p.rot[1] || 0) * D2R, (p.rot[2] || 0) * D2R);
    m.castShadow = p.shadow !== false; m.receiveShadow = true;
    return m;
  }

  /* ---------- parts → units (one per copy), each with a build window [a, b] on 0..N ---------- */
  const units = [], root = new THREE.Group(); scene.add(root);
  const add = (v, w) => [v[0] + w[0], v[1] + w[1], v[2] + w[2]];
  function copies(p) {
    const at = p.at || [0, 0, 0];
    if (p.grid) {
      const g = p.grid, out = [];
      const axis = (k, n, d) => Array.isArray(g[k]) ? g[k] : Array.from({ length: g[n] || 1 }, (_, i) => i * (g[d] || 0));
      const xs = axis('x', 'nx', 'dx'), ys = axis('y', 'ny', 'dy'), zs = axis('z', 'nz', 'dz');
      // row by row from the front-left, the way most things are laid
      for (const y of ys) for (const z of zs) for (const x of xs) out.push(add(at, [x, y, z]));
      return out;
    }
    if (p.repeat) return Array.from({ length: p.repeat.n }, (_, i) => add(at, p.repeat.step.map(v => v * i)));
    if (p.each) return p.each.map(v => add(at, v));
    return [at];
  }
  for (const p of S.parts || []) {
    const list = copies(p);
    const stage = p.stage ?? 1, order = p.order ?? 0, spread = p.spread ?? .3, dur = p.dur ?? .16;
    list.forEach((at, i) => {
      const m = mesh(p, at, i);
      if (p.anim === 'fade') {     // own opacity per copy; its finish (glow, colour) follows the copy too
        const orig = m.material; m.material = orig.clone();
        finishes.filter(f => f.m === orig).forEach(f => finishes.push({ ...f, m: m.material }));
      }
      root.add(m);
      if (p.anim === 'static' || stage === 0) return;
      const o = clamp(order + (list.length > 1 ? i / (list.length - 1) * spread : 0));
      let [a, b] = p.t || [stage - .62 + o * .42, 0];
      if (!p.t) b = a + dur;
      units.push({ obj: m, p, a, b, layer: (stage - 1) * 2 + o * 2, homeP: m.position.clone(), homeQ: m.quaternion.clone(), homeS: m.scale.clone(), cast: m.castShadow });
    });
  }

  /* ---------- bounds: everything is framed around the job itself, not the backdrop ---------- */
  const box3 = new THREE.Box3();
  units.forEach(u => box3.expandByObject(u.obj));
  if (box3.isEmpty()) box3.setFromObject(root);
  const sphere = box3.getBoundingSphere(new THREE.Sphere());
  const C = sphere.center, R = S.camera?.radius ?? Math.max(.5, sphere.radius);
  camera.near = R * .05; camera.far = R * 40; camera.updateProjectionMatrix();   // a tight depth range keeps real GPUs from z-fighting near-coplanar faces

  // exploded offsets: outward from the middle, higher for later stages, with a little tumble
  for (const u of units) {
    const h = u.homeP.clone().sub(C); h.y = 0;
    if (h.lengthSq() < 1e-6) h.set(rand() - .5, 0, rand() - .5);
    h.normalize();
    const y0 = u.homeP.y - box3.min.y;
    const kind = u.p.anim || 'fly';
    if (u.p.from) u.off = new THREE.Vector3(...u.p.from);
    else if (kind === 'drop') u.off = new THREE.Vector3(0, R * (.32 + u.layer * .05), 0);
    else u.off = h.multiplyScalar(R * (.1 + rand() * .14)).add(new THREE.Vector3((rand() - .5) * R * .12, Math.max(R * .08, R * (.2 + u.layer * .07) - y0 * .65 + rand() * R * .05), (rand() - .5) * R * .1));
    const tum = kind === 'fly' || kind === 'remove' ? (u.p.tumble ?? 1) : 0;
    u.tum = new THREE.Euler((rand() - .5) * .7 * tum, (rand() - .5) * .9 * tum, (rand() - .5) * .7 * tum);
    u.ph = rand() * 6.28; u.bs = .6 + rand() * .7;
  }

  /* ---------- ground that fades into the page ---------- */
  if (S.env?.ground !== false) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d'), grd = g.createRadialGradient(128, 128, 20, 128, 128, 128);
    grd.addColorStop(0, '#fff'); grd.addColorStop(.55, '#fff'); grd.addColorStop(1, '#000');
    g.fillStyle = grd; g.fillRect(0, 0, 256, 256);
    const ground = new THREE.Mesh(new THREE.CircleGeometry(S.env?.groundRadius ?? R * 1.6, 64),
      new THREE.MeshStandardMaterial({ color: S.env?.ground || '#b9b3a6', roughness: 1, transparent: true, alphaMap: new THREE.CanvasTexture(c), depthWrite: false,
        polygonOffset: true, polygonOffsetFactor: 2, polygonOffsetUnits: 4 }));   // always loses a depth tie, so slabs growing up from y = 0 never flicker through it
    ground.rotation.x = -Math.PI / 2; ground.position.set(C.x, box3.min.y - .02, C.z + R * .3); ground.receiveShadow = true; scene.add(ground);
  }

  /* ---------- light ---------- */
  const L = LIGHTS[S.env?.light] || LIGHTS.golden;
  scene.add(new THREE.HemisphereLight(L.sky, L.ground, L.hemi));
  const sun = new THREE.DirectionalLight(L.sun, L.sunI);
  const sd = S.env?.sun || [-1.6, 1.3, 1.4];
  sun.position.copy(C).addScaledVector(new THREE.Vector3(...sd).normalize(), R * 2.4); sun.target.position.copy(C); scene.add(sun, sun.target);
  sun.castShadow = true;
  Object.assign(sun.shadow.camera, { left: -R * 1.7, right: R * 1.7, top: R * 1.7, bottom: -R * 1.7, near: .1, far: R * 6 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -.0004; sun.shadow.normalBias = .02; sun.shadow.radius = 2.5; sun.shadow.mapSize.set(2048, 2048);
  const fill = new THREE.DirectionalLight(0xd7e4ff, L.fill); fill.position.copy(C).add(new THREE.Vector3(R * 1.5, R, R * 1.7)); scene.add(fill);
  // lamps: real light that pools on walls and floors when a room switches on (keep to about 6; each one costs every pixel)
  for (const l of (S.lights || []).slice(0, 8)) {
    const pl = new THREE.PointLight(l.color || 0xffc98a, 0, l.distance ?? 6, l.decay ?? 2);
    pl.position.set(...l.at); scene.add(pl);
    finishes.push({ light: pl, glow: l.intensity ?? 6, at: l.glowAt ?? N, show: l.show });   // show: [a, b] = on only in that window (a work light)
  }

  /* ---------- dimension lines and callouts ---------- */
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8902e';
  const lineMats = [];
  const show = (x, T) => x.show ? smooth(x.show[0], x.show[0] + .25, T) * (1 - smooth(x.show[1] - .25, x.show[1], T))
    : smooth(x.stage - .6, x.stage - .35, T) * (1 - smooth(x.stage + .3, x.stage + .55, T));
  for (const l of S.lines || []) {
    const m = new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0 });
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(l.pts.map(p => new THREE.Vector3(...p))), m));
    lineMats.push({ m, l });
  }
  const layer = $('.callouts');
  const callouts = (S.callouts || []).map(c => {
    const el = document.createElement('span'); el.className = 'callout'; el.textContent = c.text; layer.append(el);
    return { el, c, v: new THREE.Vector3(...c.at) };
  });

  /* ---------- camera: four poses fitted to the job, blended along T ---------- */
  const V = (a, d) => new THREE.Vector3(...(a || d));
  const pose = (k, dir, ty, m, own) => {
    const o = own || S.camera?.[k] || {};
    return { dir: V(o.dir, dir).normalize(), t: o.t ? V(o.t) : C.clone().add(new THREE.Vector3(0, ty * R, 0)), m: o.m ?? m };
  };
  const POSES = {
    hero: pose('hero', [.95, .5, 1.3], -.12, 1.06), exploded: pose('exploded', [.85, .7, 1.2], .32, 1.3),
    build: pose('build', [1.05, .8, 1.05], 0, 1.15), done: pose('done', [.7, .48, 1.3], 0, .95),
  };
  // optional: one pose per step card, so the camera travels with the story (push in on the detail, pull back for the payoff)
  const STEPS = (S.camera?.steps || []).slice(0, N).map((o, i) => o ? pose('steps', [1.05, .8, 1.05], 0, 1.15, o) : null);
  const P = { dir: new THREE.Vector3(), t: new THREE.Vector3(), m: 1 }, UP = new THREE.Vector3(0, 1, 0);
  const blend = (pz, k) => { P.dir.lerp(pz.dir, k).normalize(); P.t.lerp(pz.t, k); P.m = lerp(P.m, pz.m, k); };
  let mobile = false, lastOffset = '';
  function placeCamera(T, time) {
    P.dir.copy(POSES.hero.dir); P.t.copy(POSES.hero.t); P.m = POSES.hero.m;
    blend(POSES.exploded, smooth(0, .9, T));
    if (STEPS.length) {
      STEPS.forEach((pz, i) => { if (pz) blend(pz, smooth(i ? i + .05 : .45, i + .88, T)); });   // pose k is reached as card k centres (the first waits for the job to come apart)
      if (S.camera?.done) blend(POSES.done, smooth(N - .3, N, T));
    } else {
      blend(POSES.build, smooth(1.2, Math.max(1.9, N - 1.6), T));
      blend(POSES.done, smooth(N - .9, N, T));
    }
    P.dir.applyAxisAngle(UP, reduce ? 0 : (1 - smooth(0, .35, T)) * Math.sin(time * .22) * .07);    // slow hero drift
    const w = innerWidth, h = innerHeight, vo = S.camera?.offset || {};
    // phones: in the hero the job sits in the space between the end of the copy and the call bar, pulled back to
    // fit when that space is small (it depends on how long each client's headline is), unless the scene sets mobileHeroY
    const below = Math.max(80, h - barH - copyBottom - 12), auto = mobile && vo.mobileHeroY == null;
    const far = auto ? clamp(w * .62 / below, 1, 1.7) : 1, heroY = auto ? (h / 2 - (copyBottom + 12 + h - barH) / 2) / h : vo.mobileHeroY ?? -.3;
    const vf = THREE.MathUtils.degToRad(camera.fov), hf = 2 * Math.atan(Math.tan(vf / 2) * camera.aspect);
    camera.position.copy(P.t).addScaledVector(P.dir, R / Math.tan(Math.min(vf, hf) / 2) * P.m * (mobile ? 1.08 * lerp(far, 1, smooth(0, .6, T)) : 1));
    camera.lookAt(P.t);
    // copy sits left on desktop and over the top on phones: shift the picture away from it
    const ox = mobile ? 0 : lerp(vo.heroX ?? -.25, vo.stepX ?? -.2, smooth(0, .8, T)) * w;
    const oy = mobile ? lerp(heroY, vo.mobileStepY ?? .17, smooth(.1, .8, T)) * h : 0;
    const key = `${Math.round(ox)},${Math.round(oy)},${w},${h}`;
    if (key !== lastOffset) { lastOffset = key; camera.setViewOffset(w, h, ox, oy, w, h); }
  }

  /* ---------- scroll → T ---------- */
  let anchors = [], copyBottom = 0, barH = 0;
  function measure() {
    const top = el => el.getBoundingClientRect().top + scrollY, vh = innerHeight, c = mobile ? .62 : .5;
    const copy = $('.hero-in'), bar = $('.actionbar');
    copyBottom = copy ? top(copy) + copy.offsetHeight : 0; barH = bar ? bar.offsetHeight : 0; lastOffset = '';
    anchors = [top($('.process-intro')) - vh * .7, ...$$('.step-card').map(el => top(el) + el.offsetHeight / 2 - vh * c)];
  }
  function stepT() {
    const s = scrollY;
    if (s <= anchors[0]) return 0;
    for (let k = 0; k < N; k++) if (s <= anchors[k + 1]) return k + (s - anchors[k]) / Math.max(1, anchors[k + 1] - anchors[k]);
    return N;
  }

  /* ---------- per-frame ---------- */
  const eul = new THREE.Euler(), q = new THREE.Quaternion(), grow = new THREE.Vector3();
  let flying = false;   // a part is mid-flight and bobbing: keep drawing even while the scroll is still
  function applyBuild(T, time) {
    const e = smooth(0, .42, T);
    flying = false;
    for (const u of units) {
      const kind = u.p.anim || 'fly';
      if (kind === 'remove') {         // the old thing being replaced: not in the finished hero, in place as the story starts, taken away in its window
        const o = u.obj, out = reduce ? (T < .5 || Math.round(T) >= u.p.stage ? 1 : 0) : smooth(u.a, u.b, T);
        o.position.copy(u.homeP); o.quaternion.copy(u.homeQ); o.scale.copy(u.homeS);
        o.visible = T > .25 && out < .999;
        if (o.visible && out > 0) {
          o.position.addScaledVector(u.off, out * 1.6);
          eul.set(u.tum.x * out, u.tum.y * out, u.tum.z * out); q.setFromEuler(eul); o.quaternion.multiply(q);
        }
        continue;
      }
      let amt;
      if (reduce) { const tq = T < .5 ? -1 : Math.min(N, Math.round(T)); amt = tq < 0 || smooth(u.a, u.b, tq + .25) >= .5 ? 0 : 1; }
      else amt = e * (1 - smooth(u.a, u.b, T));
      const o = u.obj;
      o.position.copy(u.homeP); o.quaternion.copy(u.homeQ); o.scale.copy(u.homeS); o.visible = true; o.castShadow = u.cast;
      if (amt < 1e-4) { if (kind === 'draw') setDraw(o, 1); if (kind === 'fade') o.material.opacity = u.p.opacity ?? 1; continue; }
      if (kind === 'grow') {
        if (amt > .999) { o.visible = false; continue; }
        const k = Math.max(1 - amt, .001), ax = u.p.axis || 'y';
        // a slab growing up from a surface would sit almost exactly on it and flicker (z-fighting) on real GPUs:
        // it appears at 12% of its height instead, and casts no shadow until it's fully grown
        if (ax === 'y' && k < .12) { o.visible = false; continue; }
        o.castShadow = false;
        if (ax === 'all') o.scale.multiplyScalar(k);
        else {
          o.scale[ax] *= k;
          // x/z growth rolls out from one edge (turf, membrane, carpet) instead of swelling from the middle
          if (ax !== 'y' && u.p.anchor !== 'centre' && (!u.p.shape || u.p.shape === 'box' || u.p.shape === 'plane')) {
            grow.set(0, 0, 0); grow[ax] = (u.p.anchor === 'end' ? 1 : -1) * (1 - k) * u.homeS[ax] / 2;
            o.position.add(grow.applyQuaternion(u.homeQ));
          }
        }
      } else if (kind === 'draw') { setDraw(o, 1 - amt); o.visible = amt < .999; }
      else if (kind === 'fade') { o.material.opacity = (u.p.opacity ?? 1) * (1 - amt); o.material.transparent = true; o.visible = amt < .999; }
      else {
        if (reduce) { o.visible = false; continue; }
        o.position.addScaledVector(u.off, amt);
        if (kind === 'fly') {
          flying = true;
          o.position.x += Math.sin(time * u.bs + u.ph) * R * .01 * amt;
          o.position.y += Math.cos(time * u.bs * .8 + u.ph) * R * .013 * amt;
          eul.set(u.tum.x * amt, u.tum.y * amt, u.tum.z * amt); q.setFromEuler(eul); o.quaternion.multiply(q);
        }
      }
    }
    for (const f of finishes) {
      const k = f.show ? (reduce ? (T >= f.show[0] && T <= f.show[1] ? 1 : 0) : smooth(f.show[0] - .2, f.show[0], T) * (1 - smooth(f.show[1], f.show[1] + .2, T)))
        : reduce ? (T < .5 || T >= f.at - .5 ? 1 : 0) : clamp(1 - smooth(.25, .6, T) + smooth(f.at - .45, f.at - .02, T));
      if (f.light) f.light.intensity = f.glow * k;
      else if (f.glow != null) f.m.emissiveIntensity = f.glow * k;
      else { f.m.color.copy(f.from).lerp(f.to, k); f.m.roughness = lerp(f.r0, f.r1, k); }
    }
  }
  function setDraw(o, f) {
    const g = o.geometry, d = g.userData;
    if (!d?.segs) return;
    g.setDrawRange(0, Math.floor(clamp(f) * d.segs) * d.radial * 6);
  }
  const proj = new THREE.Vector3();
  function placeLabels(T) {
    for (const { m, l } of lineMats) m.opacity = reduce ? (Math.round(T) === (l.stage ?? -1) ? 1 : 0) : show(l, T);
    for (const c of callouts) {
      // reduced motion: a stage label shows at its whole step; a timed label inside its window, never in the hero (T < .5)
      const a = reduce ? (T < .5 ? 0 : c.c.show ? (T >= c.c.show[0] && T <= c.c.show[1] ? 1 : 0) : (Math.round(T) === (c.c.stage ?? -1) ? 1 : 0)) : show(c.c, T);
      c.el.style.opacity = a.toFixed(3);
      if (a <= 0) continue;
      proj.copy(c.v).project(camera);
      c.el.style.transform = `translate(${(proj.x * .5 + .5) * innerWidth}px, ${(-proj.y * .5 + .5) * innerHeight}px) translate(-50%,-50%)`;
    }
  }

  /* ---------- quality governor: drop resolution, then shadows, if frames run slow ---------- */
  let dprCap = 1.5, ema = 16.7, slowSince = 0, degraded = 0;
  function sizeRenderer() {
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, dprCap));
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); lastOffset = '';
  }
  function govern(ms, now) {
    if (document.hidden || ms > 250 || degraded >= 2) return;
    ema += (ms - ema) * .08;
    if (ema > 30) { slowSince ||= now; if (now - slowSince > 2000) { degraded++; slowSince = 0;
      if (degraded === 1) { dprCap = 1; sun.shadow.mapSize.set(1024, 1024); } else sun.castShadow = false;
      if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
      sizeRenderer(); renderer.shadowMap.needsUpdate = true; } }
    else slowSince = 0;
  }

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '100px' }).observe($('.scene-wrap'));
  let dirty = true;
  const resize = () => { dirty = true; mobile = innerWidth <= 820 || innerWidth < innerHeight; sizeRenderer(); measure(); renderer.shadowMap.needsUpdate = true; };
  addEventListener('resize', resize);
  new ResizeObserver(() => { measure(); dirty = true; }).observe(document.body);
  mqReduce.addEventListener('change', e => { reduce = e.matches; dirty = true; });
  resize();

  let last = performance.now(), first = true, Ts = 0, lastT = -1, tick = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    const raw = now - last, dt = Math.min(raw, 64) / 1000; last = now;
    if (!visible && !first) return;
    const time = now / 1000, T = stepT();
    Ts = reduce ? T : Ts + (T - Ts) * (1 - Math.pow(.002, dt));
    // draw only when something moves: the scroll is still settling, a part is mid-flight, or the hero's slow drift
    // (that one at half rate). A parked page costs nothing.
    const settling = Math.abs(T - Ts) > 1e-4, drift = !reduce && Ts < .35;
    if (!first && !dirty && !settling && !flying && (!drift || (++tick & 1))) return;
    dirty = false;
    if ((!reduce && Ts > .02 && Ts < N - .02) || Math.abs(Ts - lastT) > 1e-4) renderer.shadowMap.needsUpdate = true;
    lastT = Ts;
    applyBuild(Ts, time);
    placeCamera(Ts, time);
    placeLabels(Ts);
    renderer.render(scene, camera);
    govern(raw, now);
    if (first) { first = false; canvas.classList.add('ready'); window.__assembly = { N, R, units: units.length }; }
  }
  requestAnimationFrame(frame);
}
