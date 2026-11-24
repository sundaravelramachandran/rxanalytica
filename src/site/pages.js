import { NAV, QUICK, PROGRAMS, HOME, CTA, FOOT, ABOUT, PAGES, AUTH, VIDEOS } from './content.js';
import { EVENTS } from './events.js';
import { SLIDES } from './activity.js';

const src = (p) => '/' + encodeURI(p).replace(/%25/g, '%');
const ico = (k) => `/images/hero/3d-icon-${k}.svg`;
const mask = (lines, cls = '') => lines.map((l) => `<span class="mask"><span class="ln ${cls}">${l}</span></span>`).join('');
const eyebrow = (t) => `<p class="eyebrow">${t}</p>`;
const modalBtn = (kind, label, cls = 'btn btn--solid') => `<button class="${cls}" data-modal="${kind}"><span>${label}</span></button>`;

const header = (active) => `
<header class="nav" id="nav">
  <a class="nav__brand" href="index.html"><img src="/images/logo.png" alt="Rx Analytica One" width="150" height="50"></a>
  <div class="nav__links" id="gooey-nav" aria-label="Main">${NAV.map(([n, h]) => `<a href="${h}" ${h === active ? 'class="is-active" aria-current="page"' : ''}>${n}</a>`).join('')}</div>
  <div class="nav__cta">${modalBtn('login', 'Log In', 'btn btn--ghost')}${modalBtn('signup', 'Register')}</div>
  <button class="nav__burger" aria-label="Menu" aria-expanded="false"><i></i><i></i></button>
</header>
<div class="drawer" id="drawer"><nav>${NAV.map(([n, h]) => `<a href="${h}">${n}</a>`).join('')}</nav><div>${modalBtn('login', 'Log In', 'btn btn--ghost')}${modalBtn('signup', 'Register')}</div></div>`;

const cta = () => `
<section class="cta" id="register">
  <img class="cta__ico cta__ico--a" src="${ico('live')}" alt="" data-float><img class="cta__ico cta__ico--b" src="${ico('exams')}" alt="" data-float>
  <div class="wrap">${eyebrow(CTA.eyebrow)}<h2 class="mega">${mask(CTA.title)}</h2><p data-reveal>${CTA.text}</p>${modalBtn('signup', CTA.button, 'btn btn--ink btn--lg')}</div>
</section>`;

const footer = () => `
<footer class="foot" id="contact"><div class="wrap foot__grid">
  <div><img src="/images/logo.png" alt="Rx Analytica One" width="150" height="50"><p>${FOOT.text}</p>
    <ul class="social">${FOOT.social.map(([h, n]) => `<li><a href="${h}" target="_blank" rel="noopener" aria-label="${n}"><img src="/images/icons/icon-dark-${n}.svg" alt=""></a></li>`).join('')}</ul></div>
  <div><h4>Quick Links</h4><ul>${QUICK.map(([n, h]) => `<li><a href="${h}">${n}</a></li>`).join('')}</ul></div>
  <div><h4>${FOOT.phone[0]}</h4><a class="big-link" href="${FOOT.phone[2]}">${FOOT.phone[1]}</a><h4>${FOOT.mail[0]}</h4><a class="big-link" href="${FOOT.mail[2]}">${FOOT.mail[1]}</a></div>
  <div><h4>${FOOT.sub[0]}</h4><p>${FOOT.sub[1]}</p>${modalBtn('signup', FOOT.sub[2])}</div>
</div><p class="foot__copy">${FOOT.copy}</p></footer>`;

const modal = (id, m) => `
<div class="modal" id="${id}Modal" aria-hidden="true"><div class="modal__bg" data-close></div>
  <div class="modal__box" role="dialog" aria-modal="true" aria-label="${m.title}"><button class="modal__x" data-close aria-label="Close">×</button>
    <img src="/images/logo.png" alt="Rx Analytica One" width="130" height="43"><h3>${m.title}</h3>
    <p>${m.alt[0]} <button class="link" data-modal="${id === 'signup' ? 'login' : 'signup'}">${m.alt[1]}</button></p>
    <form action="#" method="post">${m.fields.map(([n, p, t]) => `<input name="${n}" placeholder="${p}" type="${t}" required>`).join('')}
      <label class="check"><input type="checkbox"> ${m.check[0]}<strong>${m.check[1]}</strong></label>
      <button class="btn btn--solid btn--lg" type="submit"><span>${m.submit}</span></button></form>
    ${m.social ? `<div class="modal__soc"><p>${m.social}</p><ul>${['google', 'facebook', 'linkedin'].map((s) => `<li><a href="https://${s}.com/"><img src="/images/icons/icon-color-${s}.svg" alt="${s}"></a></li>`).join('')}</ul></div>` : ''}
  </div></div>`;

const hero = (title, text, extra = '', model = 'hero') => `
<section class="hero hero--page"><canvas class="orb" data-model="${model}" aria-hidden="true"></canvas>
  <div class="wrap">${title}${text}${extra}</div></section>`;

const course = (c) => `
<article class="course" data-tilt>
  <div class="course__media"><img src="/images/course/course-1/${c.img}.png" alt="" data-parallax><span class="chips">${c.tags.map((t) => `<b>${t}</b>`).join('')}</span></div>
  <div class="course__body"><h3>${c.title}</h3>
    <p class="rate"><span aria-label="5 stars">★★★★★</span> (${c.reviews} Reviews)</p>
    <p class="pills"><span>${c.badge}</span><span>${c.stat}</span></p>
    <dl class="meta">${c.meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
    <h4>${c.hl}</h4><ul class="ticks">${c.list.map((l) => `<li>${l}</li>`).join('')}</ul>${modalBtn('signup', c.cta)}</div>
</article>`;

const stars = (n) => n;

/* ---------- HOME ---------- */
const arrow = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';
const ticket = (e, i) => {
  const x = e.type === 'exam', [wd, md, yr] = e.date.split(', '), [mo, day] = md.split(' ');
  return `<article class="tk ${x ? 'tk--exam' : ''}" data-tk data-reveal>
    <button class="tk__head" aria-expanded="false" aria-controls="tk${i}">
      <span class="tk__date"><b>${day}</b><i>${mo}</i><small>${wd} · ${yr}</small></span>
      <span class="tk__main"><span class="tagc">${x ? 'Mock Exam' : 'Live Webinar'}</span><small>${e.category}</small><h3>${e.topic}</h3><span class="tk__time">${e.time}</span></span>
      <span class="tk__go">${arrow}</span></button>
    <div class="tk__body" id="tk${i}"><div class="tk__in">
      <img src="${src(e.image)}" alt="${e.imageAlt}">
      <div><h5>${x ? 'Evaluation Overview' : 'Webinar Overview'}</h5><h6>${x ? 'What This Mock Exam Covers' : 'Webinar Session Highlights'}</h6><ul class="ticks">${e.highlights.map((l) => `<li>${l}</li>`).join('')}</ul>
        <h6>${x ? 'Your Evaluation Benefits' : 'Attendee Benefits'}</h6><ul class="ticks">${e.benefits.map((l) => `<li>${l}</li>`).join('')}</ul>${modalBtn('signup', x ? 'Register for Exam' : 'Register for Webinar')}</div>
    </div></div></article>`;
};

const home = () => {
  const h = HOME;
  return `${hero(`<h1 class="mega">${mask(h.title, 'grad-last')}</h1>`, `<p class="lead" data-hero>${h.lead}</p><a class="btn btn--solid btn--lg" href="#programs" data-hero><span>Explore Programs</span></a>`, '', 'hero')}
<div class="marquee" aria-hidden="true"><div class="marquee__in">${[0, 1].map(() => `<div>${PROGRAMS.map((p) => `<span><img src="${ico(p.icon)}" alt="">${p.sub}</span>`).join('')}${PROGRAMS.map((p) => `<span><img src="${ico(p.icon)}" alt="">${p.name}</span>`).join('')}</div>`).join('')}</div></div>

<section class="show" id="programs"><div class="show__pin">
  ${PROGRAMS.map((p) => `<div class="show__bg show__bg--${p.key}"></div>`).join('')}
  <canvas class="show__canvas" data-names="live,learn,aspire,exam" aria-hidden="true"></canvas>
  <div class="wrap show__wrap"><div class="show__panels">${PROGRAMS.map((p, i) => `
    <article class="spanel spanel--${p.key}" data-i="${i}"><small>${p.tag}</small><h2>${p.name}</h2><strong>${p.sub}</strong><h3>${p.line}</h3><p>${p.text}</p>
      <div class="spanel__act"><a class="btn btn--ink" href="${p.href}"><span>Explore ${p.name}</span></a><button class="play" data-video="${p.key}" aria-label="Play ${p.name} video"><i></i><span>Play video</span></button></div>
      <img class="spanel__ico" src="${ico(p.icon)}" alt=""></article>`).join('')}</div></div>
  <ol class="show__rail" aria-label="Programs">${PROGRAMS.map((p, i) => `<li><button data-go="${i}">${p.name}</button></li>`).join('')}<i class="show__fill"></i></ol>
</div></section>

<section class="sec who" id="who-we-are"><div class="wrap">
  ${eyebrow(h.who.eyebrow)}<h2 class="huge">${mask(h.who.title)}</h2>
  <p class="words">${h.who.lead}</p>
  <div class="who__grid">
    <div>${h.who.body.map((b) => `<p data-reveal>${b}</p>`).join('')}
      <ul class="vals">${h.who.values.map((v) => `<li data-reveal><span></span>${v}</li>`).join('')}</ul></div>
    <figure class="frame" data-clip><img src="${src(h.who.img)}" alt="${h.who.alt}" data-parallax></figure>
  </div></div></section>

<section class="sec events" id="upcoming-events"><div class="wrap events__grid">
  <div class="events__head">${eyebrow(h.events.eyebrow)}<h2 class="huge">${mask([h.events.title])}</h2><p class="sub" data-reveal>${h.events.sub}</p></div>
  <div class="tickets">${EVENTS.map(ticket).join('')}</div></div></section>

<section class="hs" id="recent-activity"><div class="hs__pin">
  <div class="wrap hs__head">${eyebrow(h.activity.eyebrow)}<h2 class="huge">${mask([h.activity.title])}</h2></div>
  <div class="hs__track">${SLIDES.map((s) => `
    <article class="hs__card"><img src="${src(s.image)}" alt="${s.imageAlt}"><div><small>${s.tag}</small><h4>${s.institution}</h4><h3>${s.subject}</h3><p>${s.summary}</p><ul class="ticks">${s.checklist.map((c) => `<li>${c}</li>`).join('')}</ul></div></article>`).join('')}</div>
</div></section>

<section class="impact"><div class="wrap impact__grid">
  <div><h2 class="mega">${mask([h.impact.title.replace('experience', '<br>experience')])}</h2>
    <figure class="frame frame--b" data-clip><img src="${src(h.impact.img)}" alt="${h.impact.alt}"><figcaption data-tilt-img><b>${h.impact.badge[0]}</b>${h.impact.badge[1]}</figcaption></figure></div>
  <div>${eyebrow(h.impact.eyebrow)}<h3>${h.impact.head}</h3>
    <div class="stats">${h.impact.stats.map(([n, s, l]) => `<div class="stat" data-reveal><b><span data-count="${n}">0</span>${s}</b><small>${l}</small></div>`).join('')}</div></div>
</div></section>
${cta()}`;
};

/* ---------- ABOUT ---------- */
const about = () => {
  const a = ABOUT;
  return `${hero(`${eyebrow(a.eyebrow)}<h1 class="mega">${mask(a.title, 'grad-last')}</h1>`, `<p class="lead" data-hero>${a.text}</p><a class="btn btn--solid btn--lg" href="#learning-ecosystem" data-hero><span>${a.button}</span></a>`)}
<section class="sec goals"><div class="wrap goals__grid">
  <div class="goals__head">${eyebrow(a.goals.eyebrow)}<h2 class="huge">${mask(a.goals.title)}</h2></div>
  <ol class="goals__list">${a.goals.items.map(([t, d], i) => `<li class="goal"><span>0${i + 1}</span><div><h3>${t}</h3><p>${d}</p></div></li>`).join('')}</ol></div></section>
<section class="sec eco" id="learning-ecosystem"><div class="wrap">${eyebrow(a.eco.eyebrow)}<h2 class="huge">${mask(a.eco.title)}</h2>
  <div class="eco__grid">${PROGRAMS.map((p) => `<a class="ecard ecard--${p.key}" href="${p.href}" data-tilt data-reveal><img src="${ico(p.icon)}" alt="" data-tilt-img><small>RX</small><h3>${p.name.replace('Rx ', '')}</h3><strong>${p.line}</strong><p>${p.text}</p><span class="btn btn--ink"><span>Know more</span></span></a>`).join('')}</div></div></section>
<section class="sec partners"><div class="wrap">${eyebrow(a.partners.eyebrow)}<h2 class="huge">${mask([a.partners.title])}</h2><p class="sub" data-reveal>${a.partners.text}</p>
  <div class="pgrid">${a.partners.people.map(([n, r, f, d, im, alt]) => `
    <button class="flip" data-reveal aria-label="${n}, ${r}"><span class="flip__in">
      <span class="flip__f"><img src="/images/${im}" alt="${alt}"><i>${a.partners.hint}</i><em>${r}</em><u>${f}</u></span>
      <span class="flip__b"><p>${d}</p><b>${n}</b><em>${r}</em><u>${f}</u></span></span></button>`).join('')}</div></div></section>
<section class="sec insights"><div class="wrap">${eyebrow(a.insights.eyebrow)}<h2 class="huge">${mask(a.insights.title)}</h2><p class="sub" data-reveal>${a.insights.text}</p>
  <div class="posts">${a.insights.posts.map(([k, n, m, t, h, i, alt]) => `<a class="post" href="${h}" data-tilt data-reveal><img src="/images/blog/blog-1/${i}.png" alt="${alt}"><div><small>${k}</small><b>${n}</b><em>${m}</em><h3>${t}</h3><span class="btn btn--ink"><span>Explore ${n}</span></span></div></a>`).join('')}</div></div></section>
${cta()}`;
};

/* ---------- PROGRAM PAGES ---------- */
const MODEL = { 'rx-live': 'live', 'rx-learn': 'learn', 'rx-aspire': 'aspire', 'rx-exam': 'exam' };
const program = (key) => {
  const p = PAGES[key];
  let extra = '';
  if (p.hub) {
    const h = p.hub;
    extra = `<section class="sec hub"><div class="wrap">${eyebrow(h.eyebrow)}<h2 class="huge">${mask([h.title])}</h2><p class="sub" data-reveal>${h.text}</p>
      <div class="tracks">${h.tracks.map(([l, t, d, li]) => `<article class="track" data-tilt data-reveal><small>${l}</small><h3>${t}</h3><p>${d}</p><ul class="ticks">${li.map((x) => `<li>${x}</li>`).join('')}</ul>${modalBtn('signup', h.track_cta, 'btn btn--ink')}</article>`).join('')}</div>
      <div class="adv" data-reveal><small>${h.adv[0]}</small><h3>${h.adv[1]}</h3><p>${h.adv[2]}</p>${modalBtn('signup', h.adv[3], 'btn btn--ink btn--lg')}</div></div></section>`;
  }
  if (p.engine) {
    const e = p.engine;
    extra = `<section class="sec engine"><div class="wrap engine__grid"><div>${eyebrow(e.eyebrow)}<h2 class="huge">${mask(e.title)}</h2><p data-reveal>${e.text}</p>
      ${e.feats.map(([i, t, d]) => `<div class="feat" data-reveal><img src="/images/why-choose/why-choose-1/${i}.svg" alt=""><div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}</div>
      <figure class="frame frame--b" data-clip><img src="/images/why-choose/why-choose-1/why-choose-img.png" alt=""><figcaption data-tilt-img><b>${e.stat[0]}</b>${e.stat[1]}</figcaption></figure></div></section>`;
  }
  return `${hero(`${eyebrow(p.eyebrow)}<h1 class="mega mega--m">${mask([p.title])}</h1>`, '', '', MODEL[key])}
<section class="sec courses"><div class="wrap">${p.courses.map(course).join('')}</div></section>${extra}${cta()}`;
};


const videoModal = () => `
<div class="vm" id="videoModal" aria-hidden="true">
  <div class="vm__bg" data-vclose></div><span class="vm__glow"></span>
  <div class="vm__frame" role="dialog" aria-modal="true" aria-label="Program video">
    <div class="vm__top"><span class="vm__title"></span><button class="vm__x" data-vclose aria-label="Close video">×</button></div>
    <div class="vm__screen">
      <video playsinline preload="none"></video>
      <div class="vm__empty"><span class="vm__rings"><i></i><i></i><i></i></span><img alt=""><p>Your video will appear here</p></div>
      <button class="vm__big" aria-label="Play video"><i></i></button>
    </div>
    <div class="vm__bar"><button class="vm__pp" aria-label="Play / pause"><i></i></button><div class="vm__track" role="slider" aria-label="Seek" tabindex="0"><b></b></div><span class="vm__time">0:00</span><button class="vm__mute" aria-label="Mute"><i></i></button></div>
  </div>
  <script type="application/json" id="videoSrc">${JSON.stringify(VIDEOS)}</script>
</div>`;

export function render(page) {
  const active = page === 'index' ? 'index.html' : page + '.html';
  const body = page === 'index' ? home() : page === 'about' ? about() : program(page);
  return `<div class="progress" id="progress"></div>${header(active)}<main>${body}</main>${footer()}${modal('signup', AUTH.signup)}${modal('login', AUTH.login)}${videoModal()}`;
}
