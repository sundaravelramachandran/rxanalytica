import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

/* ============ procedural PBR texture + material kit ============ */
const cv = (w, h, fn) => { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); return c; };
const T = (c, { srgb = true, rep } = {}) => { const t = new THREE.CanvasTexture(c); t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t; };
const grain = T(cv(256, 256, (x, w, h) => { const d = x.createImageData(w, h); for (let i = 0; i < d.data.length; i += 4) { d.data[i] = d.data[i + 1] = d.data[i + 2] = 90 + Math.random() * 90; d.data[i + 3] = 255; } x.putImageData(d, 0, 0); }), { srgb: false, rep: [3, 3] });
const weave = T(cv(64, 64, (x) => { for (let i = 0; i < 64; i += 4) for (let j = 0; j < 64; j += 4) { x.fillStyle = ((i + j) / 4) % 2 ? '#b4b4b4' : '#4c4c4c'; x.fillRect(i, j, 4, 4); } }), { srgb: false, rep: [12, 12] });
const brushed = T(cv(256, 256, (x, w, h) => { x.fillStyle = '#808080'; x.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${Math.random() > 0.5 ? 255 : 0},${0},${0},0)`; x.strokeStyle = `rgba(${100 + Math.random() * 100 | 0},${100 + Math.random() * 100 | 0},${100 + Math.random() * 100 | 0},.35)`; x.beginPath(); x.moveTo(0, Math.random() * h); x.lineTo(w, Math.random() * h); x.stroke(); } }), { srgb: false, rep: [2, 2] });

const fabric = (c) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.92, sheen: 1, sheenRoughness: 0.45, sheenColor: new THREE.Color(c).lerp(new THREE.Color(0xffffff), 0.45), bumpMap: weave, bumpScale: 0.9 });
const leather = (c) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.5, clearcoat: 0.3, clearcoatRoughness: 0.45, bumpMap: grain, bumpScale: 0.5 });
const metal = (c, r = 0.2) => new THREE.MeshPhysicalMaterial({ color: c, metalness: 1, roughness: r, envMapIntensity: 1.5 });
const brushedMetal = (c) => new THREE.MeshPhysicalMaterial({ color: c, metalness: 1, roughness: 0.38, roughnessMap: brushed, bumpMap: brushed, bumpScale: 0.15, envMapIntensity: 1.3 });
const gloss = (c, r = 0.12) => new THREE.MeshPhysicalMaterial({ color: c, roughness: r, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.2 });
const GOLD = 0xe6b030, INK = 0x0b1610, LEAF = 0x4fb800, SUN = 0xf7c21b;

const pageSide = T(cv(512, 32, (x, w, h) => { x.fillStyle = '#eee7d4'; x.fillRect(0, 0, w, h); for (let i = 0; i < h; i += 2) { x.fillStyle = `rgba(110,95,70,${0.18 + Math.random() * 0.2})`; x.fillRect(0, i, w, 1); } }));
const pageTop = T(cv(512, 512, (x, w, h) => { x.fillStyle = '#f7f2e6'; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(28,38,32,.8)'; x.fillRect(60, 50, 150, 16); for (let i = 0; i < 13; i++) x.fillRect(60, 100 + i * 29, [390, 380, 360, 300][i % 4] - (i % 5 === 4 ? 150 : 0), 8); x.fillStyle = 'rgba(79,184,0,.85)'; x.fillRect(60, 480, 90, 6); }));
const pageMats = () => [pageSide, pageSide, pageTop, pageSide, pageSide, pageSide].map((t) => new THREE.MeshStandardMaterial({ map: t, roughness: 0.93 }));
const rb = (w, h, d, r, m) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, r), m);
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const ease = (x) => x * x * (3 - 2 * x);

function book(w, h, d, color) {
  const g = new THREE.Group(), cm = leather(color);
  const cov = (y) => rb(w, 0.07, d, 0.03, cm).translateY(y);
  const spine = rb(0.14, h, d, 0.06, cm).translateX(-w / 2 + 0.03);
  g.add(cov(h / 2 - 0.035), cov(-h / 2 + 0.035), spine, new THREE.Mesh(new THREE.BoxGeometry(w - 0.17, h - 0.1, d - 0.1), pageMats()).translateX(0.05));
  [0.28, -0.28].forEach((k) => g.add(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, d + 0.004), metal(GOLD, 0.3)).translateX(-w / 2 + 0.03).translateY(h * k)));
  return g;
}

/* ---- 1. Hero: mortarboard resting on a stack of books beside an acrylic analytics chart ---- */
function hero() {
  const g = new THREE.Group(), bars = [];
  [[0x1c5a2d, 0.1], [0x9a6a1c, -0.16], [0x14201a, 0.06]].forEach(([c, r], i) => { const b = book(3.5, 0.44, 2.6, c); b.position.set([0, 0.16, -0.1][i], -1.55 + i * 0.45, 0); b.rotation.y = r; g.add(b); });
  const cap = new THREE.Group(); cap.position.set(0.05, 0.02, 0); cap.rotation.y = 0.28;
  const black = fabric(0x0f1613);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.12, 0.62, 64), black); base.position.y = 0.1;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.05, 16, 64), black); rim.rotation.x = Math.PI / 2; rim.position.y = -0.2;
  const board = rb(3.8, 0.1, 3.8, 0.035, black); board.rotation.y = Math.PI / 4; board.position.y = 0.46;
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 24), metal(GOLD, 0.25)); knob.scale.y = 0.6; knob.position.y = 0.53;
  const cord = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(0, 0.53, 0), V(0.9, 0.58, 0.05), V(1.9, 0.54, 0.1), V(2.5, 0.3, 0.1), V(2.62, -0.2, 0.1)]), 60, 0.03, 10), metal(GOLD, 0.4));
  const tassel = new THREE.Group(); tassel.position.set(2.62, -0.2, 0.1);
  tassel.add(new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.16, 20), metal(GOLD, 0.25)).translateY(0.0));
  for (let i = 0; i < 44; i++) { const a = (i / 44) * Math.PI * 2, y = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.8, 5), metal(GOLD, 0.5)); y.position.set(Math.cos(a) * 0.06, -0.52, Math.sin(a) * 0.06); y.rotation.set(Math.sin(a) * 0.1, 0, -Math.cos(a) * 0.1); tassel.add(y); }
  cap.add(base, rim, board, knob, cord, tassel); g.add(cap);
  const chart = new THREE.Group(); chart.position.set(3.2, -1.76, 0.3);
  chart.add(rb(3.1, 0.1, 1.2, 0.04, gloss(0xf2f4ef, 0.2)).translateX(1.0).translateY(-0.05));
  [0.9, 1.5, 2.2, 3].forEach((h, i) => { const geo = new RoundedBoxGeometry(0.5, h, 0.5, 4, 0.1); geo.translate(0, h / 2, 0); const m = new THREE.Mesh(geo, gloss(i % 2 ? SUN : LEAF, 0.1)); m.position.x = i * 0.68 - 0.3; chart.add(m); bars.push(m); });
  g.add(chart); g.position.x = -2.1;
  return { group: g, fit: 0.8, bottom: -1.78, update: (t) => { cap.rotation.y = 0.28 + Math.sin(t * 0.6) * 0.04; tassel.rotation.z = Math.sin(t * 1.3) * 0.05; bars.forEach((b, i) => { b.scale.y = 1 + Math.sin(t * 1.6 + i * 0.9) * 0.06; }); } };
}

/* ---- 2. Rx Live: a modern monitor showing a live session ---- */
function live() {
  const g = new THREE.Group();
  const ui = new THREE.CanvasTexture(cv(1280, 800, (x, w, h) => {
    const bg = x.createLinearGradient(0, 0, w, h); bg.addColorStop(0, '#0b1d12'); bg.addColorStop(0.55, '#0a6b10'); bg.addColorStop(1, '#58c300'); x.fillStyle = bg; x.fillRect(0, 0, w, h);
    x.fillStyle = 'rgba(255,255,255,.07)'; for (let i = 0; i < 6; i++) { x.beginPath(); x.arc(200 + i * 190, 560 - (i % 3) * 120, 150 + i * 14, 0, 7); x.fill(); }
    x.fillStyle = '#f7c21b'; x.beginPath(); x.roundRect(48, 44, 170, 56, 28); x.fill(); x.fillStyle = '#0b1610'; x.beginPath(); x.arc(86, 72, 10, 0, 7); x.fill(); x.font = '700 30px sans-serif'; x.fillText('LIVE', 112, 83);
    x.fillStyle = 'rgba(255,255,255,.95)'; x.beginPath(); x.arc(w / 2, h / 2 - 20, 118, 0, 7); x.fill(); x.fillStyle = '#0b1610'; x.beginPath(); x.moveTo(w / 2 - 36, h / 2 - 80); x.lineTo(w / 2 + 72, h / 2 - 20); x.lineTo(w / 2 - 36, h / 2 + 40); x.fill();
    x.fillStyle = 'rgba(255,255,255,.28)'; x.fillRect(48, h - 90, w - 96, 10); x.fillStyle = '#f7c21b'; x.fillRect(48, h - 90, (w - 96) * 0.42, 10); x.fillStyle = '#fff'; x.beginPath(); x.arc(48 + (w - 96) * 0.42, h - 85, 14, 0, 7); x.fill();
    [0, 1, 2].forEach((i) => { x.fillStyle = 'rgba(255,255,255,.85)'; x.beginPath(); x.roundRect(w - 330, 60 + i * 74, 280, 54, 27); x.fill(); x.fillStyle = 'rgba(11,22,16,.7)'; x.fillRect(w - 296, 80 + i * 74, 150 - i * 20, 10); }); }));
  ui.colorSpace = THREE.SRGBColorSpace; ui.anisotropy = 8;
  const glass = rb(4.2, 2.6, 0.16, 0.07, gloss(0x070b09, 0.08)); const shell = rb(4.1, 2.5, 0.16, 0.09, brushedMetal(0xcfd5d8)).translateZ(-0.12);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.95, 2.45), new THREE.MeshBasicMaterial({ map: ui, toneMapped: false })); screen.position.z = 0.085;
  const arm = rb(0.36, 1.05, 0.14, 0.06, brushedMetal(0xdfe3e5)).translateY(-1.75).translateZ(-0.22);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.35, 0.09, 80), brushedMetal(0xc3c9cc)); foot.scale.z = 0.55; foot.position.set(0, -2.3, -0.15);
  const rings = [0, 1, 2].map((i) => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.5 + i * 0.4, 0.045, 12, 64, Math.PI * 0.55), new THREE.MeshStandardMaterial({ color: SUN, emissive: SUN, emissiveIntensity: 1.4, transparent: true })); r.position.set(1.9, 1.35, 0.2); r.rotation.z = Math.PI * 0.12; return r; });
  g.add(glass, shell, screen, arm, foot, ...rings); g.position.y = 0.45; g.rotation.x = -0.03;
  return { group: g, fit: 1.0, bottom: -1.85, update: (t) => { rings.forEach((r, i) => { r.material.opacity = Math.max(0.1, Math.sin(t * 2.6 - i * 0.9)); }); } };
}

/* ---- 3. Rx Learn: an open hardback with curved pages and a turning leaf ---- */
function learn() {
  const g = new THREE.Group();
  const sheet = (s, curl = 1) => { const geo = new THREE.PlaneGeometry(2.3, 2.9, 28, 1); geo.rotateX(-Math.PI / 2); const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { const u = (p.getX(i) + 1.15) / 2.3; p.setY(i, curl * 0.3 * Math.sin(Math.min(u * 1.1, 1) * Math.PI * 0.5) * (1 - 0.3 * u) + 0.0); p.setX(i, s * (p.getX(i) + 1.15)); } geo.computeVertexNormals(); return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: pageTop, roughness: 0.9, side: THREE.DoubleSide })); };
  const cover = rb(5.2, 0.13, 3.2, 0.05, leather(0x1c5a2d)).translateY(-0.2);
  const stack = (s) => { const k = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.34, 2.95), pageMats()); k.position.set(s * 1.2, -0.02, 0); k.rotation.z = -s * 0.04; return k; };
  const foil = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.01, 3.0), metal(GOLD, 0.3)); foil.position.y = -0.13; foil.scale.set(1, 1, 1);
  const spine = rb(0.2, 0.3, 3.1, 0.08, leather(0x14452a)).translateY(-0.17);
  const flip = new THREE.Group(); const fp = sheet(1, 1); fp.position.y = 0.2; flip.add(fp);
  const lp = sheet(-1, 1); lp.position.y = 0.17; const rp = sheet(1, 1); rp.position.y = 0.17;
  const ribbon = rb(0.06, 0.012, 1.4, 0.005, new THREE.MeshPhysicalMaterial({ color: SUN, roughness: 0.4, sheen: 1 })); ribbon.position.set(0.5, 0.2, 1.9);
  g.add(cover, stack(-1), stack(1), spine, lp, rp, flip, ribbon); g.rotation.x = 0.5; g.position.y = -0.2;
  return { group: g, fit: 1.0, bottom: -0.55, update: (t) => { const f = (t % 3.4) / 3.4; flip.rotation.z = 0.04 + ease(Math.min(f * 1.4, 1)) * (Math.PI - 0.12); } };
}

/* ---- 4. Rx Aspire: a polished gold trophy on a black marble base ---- */
function aspire() {
  const g = new THREE.Group();
  const prof = new THREE.SplineCurve([[0.001, 0.0], [1.0, 0.0], [1.0, 0.14], [0.6, 0.2], [0.4, 0.45], [0.27, 0.85], [0.23, 1.15], [0.42, 1.28], [0.28, 1.45], [0.28, 1.75], [0.7, 2.0], [1.1, 2.55], [1.3, 3.3], [1.26, 3.5], [1.12, 3.32], [0.8, 2.75], [0.001, 2.45]].map(([x, y]) => new THREE.Vector2(x, y))).getPoints(110);
  const gold = new THREE.MeshPhysicalMaterial({ color: GOLD, metalness: 1, roughness: 0.14, envMapIntensity: 1.8, side: THREE.DoubleSide, clearcoat: 0.3 });
  const cup = new THREE.Mesh(new THREE.LatheGeometry(prof, 96), gold);
  const handle = (s) => new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(s * 1.02, 3.0, 0), V(s * 1.55, 3.1, 0), V(s * 1.85, 2.55, 0), V(s * 1.5, 2.1, 0), V(s * 0.74, 2.12, 0)]), 60, 0.085, 16), gold);
  const marble = new THREE.MeshPhysicalMaterial({ color: 0x0d1210, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 0.55 });
  const t1 = rb(2.4, 0.34, 2.4, 0.07, marble).translateY(-0.2), t2 = rb(3.0, 0.26, 3.0, 0.07, marble).translateY(-0.5);
  const plaque = rb(1.2, 0.2, 0.04, 0.02, metal(GOLD, 0.3)).translateY(-0.2).translateZ(1.21);
  g.add(cup, handle(-1), handle(1), t1, t2, plaque); g.position.y = -1.75; g.rotation.x = 0.05;
  return { group: g, fit: 0.92, bottom: -2.3, update: () => {} };
}

/* ---- 5. Rx Exam: a clipboard scorecard with a pencil ---- */
function exam() {
  const g = new THREE.Group();
  const doc = new THREE.CanvasTexture(cv(768, 1024, (x, w, h) => {
    x.fillStyle = '#fbfaf5'; x.fillRect(0, 0, w, h); x.fillStyle = '#0b1610'; x.fillRect(48, 52, 300, 26); x.fillStyle = 'rgba(11,22,16,.35)'; x.fillRect(48, 94, 200, 10);
    for (let i = 0; i < 5; i++) { const y = 170 + i * 118; x.strokeStyle = '#0b1610'; x.lineWidth = 5; x.strokeRect(54, y, 54, 54); if (i < 3) { x.strokeStyle = '#4fb800'; x.lineWidth = 9; x.lineCap = 'round'; x.beginPath(); x.moveTo(64, y + 28); x.lineTo(80, y + 44); x.lineTo(112, y - 8); x.stroke(); } x.fillStyle = '#0b1610'; x.fillRect(140, y + 6, 420 - (i % 3) * 70, 14); x.fillStyle = 'rgba(11,22,16,.3)'; x.fillRect(140, y + 32, 300 - (i % 2) * 60, 9); }
    [60, 110, 85, 150, 125].forEach((bh, i) => { x.fillStyle = i % 2 ? '#f7c21b' : '#4fb800'; x.fillRect(420 + i * 54, 960 - bh, 38, bh); }); x.fillStyle = 'rgba(11,22,16,.3)'; x.fillRect(48, 965, 640, 4); }));
  doc.colorSpace = THREE.SRGBColorSpace; doc.anisotropy = 8;
  const board = rb(2.9, 3.7, 0.2, 0.1, new THREE.MeshPhysicalMaterial({ color: 0x1a211d, roughness: 0.55, bumpMap: grain, bumpScale: 0.4, clearcoat: 0.2 }));
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(2.45, 3.25), new THREE.MeshStandardMaterial({ map: doc, roughness: 0.92 })); paper.position.z = 0.135;
  const sheetEdge = rb(2.45, 3.25, 0.03, 0.01, new THREE.MeshStandardMaterial({ color: 0xf1efe6, roughness: 0.9 })).translateZ(0.1);
  const clip = rb(1.15, 0.5, 0.16, 0.08, brushedMetal(0xc7ccce)).translateY(1.85).translateZ(0.16);
  const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.2, 24), metal(0x555b5e, 0.4)); hole.rotation.x = Math.PI / 2; hole.position.set(0, 1.9, 0.2);
  const pen = new THREE.Group();
  pen.add(new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.0, 6), gloss(SUN, 0.18)), new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.2, 32), metal(0xc9ced0, 0.25)).translateY(1.05), new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.088, 0.16, 24), new THREE.MeshStandardMaterial({ color: 0xe58a8a, roughness: 0.7 })).translateY(1.22), new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.3, 6), new THREE.MeshStandardMaterial({ color: 0xd9b88a, roughness: 0.8 })).translateY(-1.15), new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.09, 12), new THREE.MeshStandardMaterial({ color: 0x222 })).translateY(-1.34));
  pen.position.set(1.85, -0.5, 0.45); pen.rotation.z = 0.5;
  g.add(board, sheetEdge, paper, clip, hole, pen); g.position.y = 0.1; g.rotation.x = -0.04;
  return { group: g, fit: 1.0, bottom: -1.95, update: (t) => { pen.rotation.z = 0.5 + Math.sin(t * 2) * 0.05; } };
}

const BUILD = { hero, live, learn, aspire, exam };

export function createStage(canvas, names) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(30, 1, 0.1, 80); camera.position.set(0, 2.9, 15); camera.lookAt(0, 0.1, 0);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.9;
  new RGBELoader().load('/images/env/pedestrian_overpass_1k.hdr', (tex) => { tex.mapping = THREE.EquirectangularReflectionMapping; scene.environment = pm.fromEquirectangular(tex).texture; scene.environmentIntensity = 1.0; if (scene.environmentRotation) scene.environmentRotation.y = 0.9; tex.dispose(); });
  const key = new THREE.DirectionalLight(0xfff4e6, 2.3); key.position.set(4, 9, 6); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 7; key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03;
  Object.assign(key.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 30 }); scene.add(key);
  const rim = new THREE.DirectionalLight(0xdff6c4, 1.1); rim.position.set(-6, 3, -5); scene.add(rim);
  const items = names.map((n) => {
    const m = BUILD[n](), holder = new THREE.Group(); holder.add(m.group);
    m.group.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), new THREE.ShadowMaterial({ opacity: 0.26 })); ground.rotation.x = -Math.PI / 2; ground.position.y = m.bottom - 0.02; ground.receiveShadow = true; holder.add(ground);
    scene.add(holder); return { ...m, holder };
  });
  const S = { p: 0, mx: 0, my: 0, scroll: 0, vis: true, t: 0, cp: 0 };
  const size = () => { renderer.setSize(canvas.clientWidth, canvas.clientHeight, false); camera.aspect = canvas.clientWidth / canvas.clientHeight; camera.updateProjectionMatrix(); };
  new ResizeObserver(size).observe(canvas); size();
  addEventListener('pointermove', (e) => { S.mx = (e.clientX / innerWidth - 0.5) * 2; S.my = (e.clientY / innerHeight - 0.5) * 2; }, { passive: true });
  new IntersectionObserver(([e]) => { S.vis = e.isIntersecting; }).observe(canvas);
  let last = performance.now(), raf;
  const loop = (now) => {
    raf = requestAnimationFrame(loop);
    if (!S.vis) { last = now; return; }
    const dt = Math.min((now - last) / 1000, 0.05); last = now; S.t += dt; S.cp += (S.p - S.cp) * 0.12;
    items.forEach((it, i) => {
      const d = i - S.cp, a = Math.abs(d), k = ease(Math.max(0, 1 - a));
      it.holder.visible = a < 1; it.holder.scale.setScalar(Math.max(0.001, k) * it.fit);
      it.holder.position.set(d * 4.4, Math.sin(S.t * 1.1 + i) * 0.08 + S.scroll * 0.4, -a * 2);
      it.holder.rotation.set(S.my * 0.08 + S.scroll * 0.2, Math.sin(S.t * 0.45 + i) * 0.32 + d * 1.5 + S.mx * 0.3, d * 0.12);
      if (it.holder.visible) it.update(S.t);
    });
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(loop);
  return { setProgress: (v) => { S.p = v; }, setScroll: (v) => { S.scroll = v; }, destroy: () => { cancelAnimationFrame(raf); renderer.dispose(); } };
}
