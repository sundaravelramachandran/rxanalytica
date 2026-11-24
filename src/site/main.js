import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './site.css';
import { render } from './pages.js';
import { NAV, PROGRAMS } from './content.js';
import { mountNav } from './navMount.jsx';

gsap.registerPlugin(ScrollTrigger, SplitText);

const app = document.getElementById('app'), page = app.dataset.page;
app.innerHTML = render(page);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const $ = (s, r = document) => [...r.querySelectorAll(s)];
let lenis, stages = [];

/* ---------- Liquid (gooey) nav: the original site's animation ---------- */
const here = page === 'index' ? 'index.html' : page + '.html';
mountNav(document.getElementById('gooey-nav'), NAV.map(([label, href]) => ({ label, href })), Math.max(0, NAV.findIndex(([, h]) => h === here)));

/* ---------- Modals, drawer, anchors ---------- */
const lock = (on) => { document.documentElement.classList.toggle('is-locked', on); on ? lenis?.stop() : lenis?.start(); };
const openModal = (id) => { $('.modal.is-open').forEach((m) => m.classList.remove('is-open')); const m = document.getElementById(id + 'Modal'); m.classList.add('is-open'); m.setAttribute('aria-hidden', 'false'); lock(true); m.querySelector('input')?.focus({ preventScroll: true }); };
const closeModals = () => { $('.modal.is-open').forEach((m) => { m.classList.remove('is-open'); m.setAttribute('aria-hidden', 'true'); }); lock(false); };
const drawer = (on) => { document.getElementById('drawer').classList.toggle('is-open', on); document.querySelector('.nav__burger').setAttribute('aria-expanded', on); lock(on); };

/* ---------- Video pop-up (empty template: add URLs in content.js > VIDEOS) ---------- */
const vm = document.getElementById('videoModal'), vid = vm.querySelector('video'), frame = vm.querySelector('.vm__frame');
const VS = JSON.parse(vm.querySelector('#videoSrc').textContent);
const TINT = { live: '#57c501', learn: '#ffcd20', aspire: '#c9f27a', exam: '#1d3326' };
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const setPlaying = (on) => vm.classList.toggle('is-playing', on);
function openVideo(key, origin) {
  const p = PROGRAMS.find((x) => x.key === key), src = VS[key];
  vm.style.setProperty('--c', TINT[key]); vm.querySelector('.vm__title').textContent = `${p.name} · ${p.sub}`;
  vm.querySelector('.vm__empty img').src = `/images/hero/3d-icon-${p.icon}.svg`;
  vm.classList.toggle('has-src', !!src); setPlaying(false); vm.querySelector('.vm__track b').style.width = '0%'; vm.querySelector('.vm__time').textContent = '0:00';
  if (src) { vid.src = src; vid.load(); } else vid.removeAttribute('src');
  const r = origin.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  vm.classList.add('is-open'); vm.setAttribute('aria-hidden', 'false'); lock(true);
  gsap.fromTo(vm, { clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(160% at ${x}px ${y}px)`, duration: 1.05, ease: 'power3.inOut' });
  gsap.fromTo(frame, { y: 90, rotationX: 22, scale: 0.82, autoAlpha: 0 }, { y: 0, rotationX: 0, scale: 1, autoAlpha: 1, duration: 1.2, ease: 'expo.out', delay: 0.3 });
}
function closeVideo() {
  if (!vm.classList.contains('is-open')) return;
  gsap.to(frame, { y: 50, scale: 0.92, autoAlpha: 0, duration: 0.4, ease: 'power2.in' });
  gsap.to(vm, { clipPath: 'circle(0px at 50% 55%)', duration: 0.75, ease: 'power3.inOut', onComplete: () => { vm.classList.remove('is-open'); vm.setAttribute('aria-hidden', 'true'); vid.pause(); vid.removeAttribute('src'); vid.load(); setPlaying(false); lock(false); } });
}
const togglePlay = () => { if (vm.classList.contains('has-src')) (vid.paused ? vid.play() : vid.pause()); else setPlaying(!vm.classList.contains('is-playing')); };
vid.addEventListener('play', () => setPlaying(true)); vid.addEventListener('pause', () => setPlaying(false));
vid.addEventListener('timeupdate', () => { vm.querySelector('.vm__track b').style.width = (vid.currentTime / (vid.duration || 1)) * 100 + '%'; vm.querySelector('.vm__time').textContent = fmt(vid.currentTime); });
vm.querySelector('.vm__track').addEventListener('click', (e) => { const r = e.currentTarget.getBoundingClientRect(); if (vid.duration) vid.currentTime = ((e.clientX - r.left) / r.width) * vid.duration; });
vm.querySelector('.vm__mute').addEventListener('click', (e) => { vid.muted = !vid.muted; e.currentTarget.classList.toggle('is-muted', vid.muted); });
vm.querySelectorAll('.vm__big, .vm__pp').forEach((b) => b.addEventListener('click', togglePlay));
if (fine) { const rx = gsap.quickTo(frame, 'rotationX', { duration: 0.8, ease: 'power3' }), ry = gsap.quickTo(frame, 'rotationY', { duration: 0.8, ease: 'power3' }), gx = gsap.quickTo(vm.querySelector('.vm__glow'), 'x', { duration: 1.2 }), gy = gsap.quickTo(vm.querySelector('.vm__glow'), 'y', { duration: 1.2 });
  gsap.set(frame, { transformPerspective: 1200 });
  vm.addEventListener('pointermove', (e) => { const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5; ry(nx * 10); rx(-ny * 8); gx(nx * 200); gy(ny * 160); }); }

document.addEventListener('click', (e) => {
  const pv = e.target.closest('[data-video]'); if (pv) { e.preventDefault(); openVideo(pv.dataset.video, pv); return; }
  if (e.target.closest('[data-vclose]')) { closeVideo(); return; }
  const mb = e.target.closest('[data-modal]'); if (mb) { e.preventDefault(); drawer(false); openModal(mb.dataset.modal); return; }
  if (e.target.closest('[data-close]')) closeModals();
  if (e.target.closest('.nav__burger')) drawer(!document.getElementById('drawer').classList.contains('is-open'));
  const f = e.target.closest('.flip'); if (f) f.classList.toggle('is-flipped');
  const a = e.target.closest('a[href^="#"]');
  if (a && a.getAttribute('href').length > 1) { const t = document.querySelector(a.getAttribute('href')); if (t) { e.preventDefault(); drawer(false); lenis ? lenis.scrollTo(t, { offset: -70, duration: 1.6 }) : t.scrollIntoView({ behavior: 'smooth' }); } }
  else if (e.target.closest('#drawer a')) drawer(false);
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeVideo(); closeModals(); drawer(false); } if (e.key === ' ' && vm.classList.contains('is-open')) { e.preventDefault(); togglePlay(); } });
$('.modal form').forEach((f) => f.addEventListener('submit', (e) => e.preventDefault()));

/* ---------- Event tickets (accordion) ---------- */
$('[data-tk]').forEach((tk, i, all) => {
  const head = tk.querySelector('.tk__head'), body = tk.querySelector('.tk__body');
  const set = (open, instant) => { tk.classList.toggle('is-open', open); head.setAttribute('aria-expanded', open);
    if (instant || reduce) body.style.height = open ? 'auto' : '0'; else gsap.to(body, { height: open ? 'auto' : 0, duration: 0.85, ease: 'power3.inOut', onComplete: () => ScrollTrigger.refresh() }); };
  head.addEventListener('click', () => { const open = !tk.classList.contains('is-open'); if (open) all.forEach((o) => o !== tk && o.classList.contains('is-open') && o.querySelector('.tk__head').click()); set(open); });
  set(i === 0, true);
});

/* ---------- 3D stages ---------- */
function initStages(scrollDriven) {
  import('./stage.js').then(({ createStage }) => {
    $('canvas.orb').forEach((c) => { const st = createStage(c, [c.dataset.model]); stages.push(st); if (scrollDriven) gsap.from(c, { autoAlpha: 0, scale: 0.85, duration: 1.8, ease: 'power3.out', delay: 1.4 }); });
    const sc = document.querySelector('canvas.show__canvas'); if (sc) { window.__show = createStage(sc, sc.dataset.names.split(',')); stages.push(window.__show); }
    if (window.__pendingP != null) window.__show?.setProgress(window.__pendingP);
  }).catch(() => {});
}

/* ---------- Motion ---------- */
const hash = location.hash && document.querySelector(location.hash);
if (reduce) { document.documentElement.classList.add('no-motion'); document.getElementById('progress').remove(); initCounters(true); initStages(false); }
else boot();

function boot() {
  document.documentElement.classList.add('js-motion');
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, touchMultiplier: 1.4, prevent: (n) => !!n.closest?.('.modal__box, .drawer, .vm') });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();

  const bar = document.getElementById('progress'), nav = document.getElementById('nav');
  lenis.on('scroll', ({ progress, direction, scroll }) => {
    bar.style.transform = `scaleX(${progress})`;
    nav.classList.toggle('is-hidden', direction === 1 && scroll > 400);
    nav.classList.toggle('is-solid', scroll > 30);
    stages[0]?.setScroll(Math.min(scroll / innerHeight, 1.2));
  });

  const pre = document.createElement('div'); pre.className = 'pre'; pre.innerHTML = '<img src="/images/logo.png" alt="Rx Analytica One"><i></i>'; document.body.append(pre);
  gsap.set('.mask .ln', { yPercent: 115 });
  gsap.set('[data-hero], .cta__ico', { autoAlpha: 0, y: 40 });
  const intro = gsap.timeline({ onComplete: () => { pre.remove(); lenis.start(); if (hash) lenis.scrollTo(hash, { immediate: true, offset: -70 }); } });
  intro.from('.pre img', { y: 24, autoAlpha: 0, duration: 0.7, ease: 'power3.out' })
    .fromTo('.pre i', { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, '<0.1')
    .to('.pre', { yPercent: -100, duration: 0.9, ease: 'power4.inOut' })
    .from('.nav', { yPercent: -120, autoAlpha: 0, duration: 1, ease: 'power4.out' }, '-=0.35')
    .to('.hero .mask .ln', { yPercent: 0, duration: 1.3, ease: 'power4.out', stagger: 0.12 }, '<')
    .to('[data-hero]', { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12 }, '-=0.9');
  initStages(true);

  $('.mask .ln').filter((l) => !l.closest('.hero')).forEach((l) => gsap.to(l, { yPercent: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: l.closest('.mask'), start: 'top 90%', once: true } }));
  $('.words').forEach((el) => { const s = new SplitText(el, { type: 'words' }); gsap.fromTo(s.words, { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 } }); });

  const items = $('[data-reveal], .goal, .course, .track, .feat, .adv').filter((e, i, a) => a.indexOf(e) === i);
  gsap.set(items, { y: 56, autoAlpha: 0 });
  ScrollTrigger.batch(items, { start: 'top 92%', once: true, onEnter: (b) => gsap.to(b, { y: 0, autoAlpha: 1, duration: 1.2, ease: 'power3.out', stagger: 0.12, clearProps: 'transform' }) });

  $('[data-clip]').forEach((f) => gsap.fromTo(f, { clipPath: 'inset(14% 14% 14% 14% round 40px)' }, { clipPath: 'inset(0% 0% 0% 0% round 40px)', ease: 'none', scrollTrigger: { trigger: f, start: 'top 90%', end: 'top 35%', scrub: 0.6 } }));
  $('[data-parallax]').forEach((img) => gsap.fromTo(img, { yPercent: -8, scale: 1.18 }, { yPercent: 8, scale: 1.18, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.5 } }));

  /* Program showcase: one pinned stage; scroll morphs text, colour and the 3D model */
  const pin = document.querySelector('.show__pin');
  if (pin) ScrollTrigger.matchMedia({ '(min-width: 900px)': () => {
    const panels = $('.spanel'), bgs = $('.show__bg'), pills = $('.show__rail button'), fill = pin.querySelector('.show__fill');
    gsap.set([...panels.slice(1), ...bgs.slice(1)], { autoAlpha: 0 });
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, scrollTrigger: { trigger: pin, start: 'top top', end: '+=320%', pin: true, scrub: 0.6, onUpdate: (s) => {
      const t = s.progress * tl.duration(); let p = 0; for (let k = 0; k < 3; k++) p += Math.min(Math.max((t - (k + 0.5)) / 0.8, 0), 1);
      window.__pendingP = p; window.__show?.setProgress(p); fill.style.transform = `scaleX(${(p / 3) * 0.75 + 0.25})`; pills.forEach((b, i) => b.classList.toggle('is-on', i === Math.round(p)));
    } } });
    for (let i = 0; i < 3; i++) tl.to(panels[i], { autoAlpha: 0, y: -70, duration: 0.5 }, i + 0.5).to(bgs[i + 1], { autoAlpha: 1, duration: 0.6 }, i + 0.5).fromTo(panels[i + 1], { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 0.5 }, i + 0.8);
    pills[0].classList.add('is-on');
    pills.forEach((b, i) => b.onclick = () => { const st = tl.scrollTrigger; lenis.scrollTo(st.start + ((i + 0.4) / tl.duration()) * (st.end - st.start), { duration: 1.6 }); });
  } });

  const hs = document.querySelector('.hs');
  if (hs) { const track = hs.querySelector('.hs__track'); ScrollTrigger.matchMedia({ '(min-width: 900px)': () => {
    const dist = () => track.scrollWidth - innerWidth + innerWidth * 0.08;
    gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: hs.querySelector('.hs__pin'), start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.7, invalidateOnRefresh: true } });
  } }); }

  $('.goal').forEach((g) => ScrollTrigger.create({ trigger: g, start: 'top 55%', end: 'bottom 55%', toggleClass: { targets: g, className: 'is-on' } }));

  const mq = document.querySelector('.marquee__in');
  if (mq) { const t = gsap.to(mq, { xPercent: -50, ease: 'none', duration: 28, repeat: -1 }); ScrollTrigger.create({ onUpdate: (s) => gsap.to(t, { timeScale: 1 + Math.min(Math.abs(s.getVelocity()) / 500, 6), duration: 0.3, overwrite: true, onComplete: () => gsap.to(t, { timeScale: 1, duration: 1 }) }) }); }

  $('[data-float]').forEach((el, i) => gsap.to(el, { y: '+=14', rotate: i % 2 ? 2 : -2, duration: 2.6 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 4 }));
  initCounters(false);

  if (fine) {
    $('[data-tilt]').forEach((card) => { const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' }), ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' }); gsap.set(card, { transformPerspective: 1000 });
      card.addEventListener('pointermove', (e) => { const r = card.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 8); rx(-((e.clientY - r.top) / r.height - 0.5) * 8); });
      card.addEventListener('pointerleave', () => { rx(0); ry(0); }); });
    $('[data-tilt-img]').forEach((el) => { const host = el.closest('a, figure, article') || el.parentElement; const x = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3' }), y = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3' });
      host.addEventListener('pointermove', (e) => { const r = host.getBoundingClientRect(); x(((e.clientX - r.left) / r.width - 0.5) * 30); y(((e.clientY - r.top) / r.height - 0.5) * 30); }); host.addEventListener('pointerleave', () => { x(0); y(0); }); });
    $('.btn, .play').forEach((b) => { const x = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' }), y = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' });
      b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * 0.25); y((e.clientY - r.top - r.height / 2) * 0.35); }); b.addEventListener('pointerleave', () => { x(0); y(0); }); });
  }
  addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

function initCounters(instant) {
  $('[data-count]').forEach((el) => {
    const end = +el.dataset.count; if (instant) { el.textContent = end.toLocaleString(); return; }
    const o = { v: 0 }; gsap.to(o, { v: end, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString(); } });
  });
}
