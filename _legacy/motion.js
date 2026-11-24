import Lenis from 'lenis';

/**
 * RX Analytica One - motion layer
 * Inertia smooth scroll (Lenis) driven by the GSAP ticker, plus scroll-linked
 * reveals and parallax. Uses the GSAP / ScrollTrigger / SplitText globals that
 * the legacy scripts already load, so nothing is bundled twice.
 */
export function initMotion() {
  const { gsap, ScrollTrigger, SplitText } = window;
  if (!gsap || !ScrollTrigger) return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('rx-motion');

  /* ---------- 1. Inertia smooth scroll ---------- */
  const lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.4,
    prevent: (node) => !!node.closest?.('.rx-video-modal, .offcanvas__area, [class*="offcanvas"], [data-lenis-prevent]'),
  });
  window.__rxLenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  // Hold scrolling while the preloader is up
  const syncLock = () => (document.body.classList.contains('rx-loading') ? lenis.stop() : lenis.start());
  syncLock();
  const bodyObserver = new MutationObserver(syncLock);
  bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // Anchor links glide with the same easing (capture phase beats the legacy handlers)
  const onAnchorClick = (event) => {
    const link = event.target.closest?.('a[href*="#"]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    if (url.pathname !== location.pathname || url.hash.length < 2) return;
    let target = null;
    try { target = document.querySelector(url.hash); } catch { return; }
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    // Numeric target on purpose: Lenis would also subtract the site's scroll-margin/padding rules
    const y = target.getBoundingClientRect().top + lenis.scroll - 85;
    lenis.scrollTo(y, { duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 4) });
  };
  document.addEventListener('click', onAnchorClick, true);

  /* ---------- 2. Scroll progress bar ---------- */
  const bar = document.createElement('div');
  bar.className = 'rx-scroll-progress';
  document.body.append(bar);
  lenis.on('scroll', ({ progress }) => { bar.style.transform = `scaleX(${progress})`; });

  let removeResize = () => {};
  const ctx = gsap.context(() => {
    /* ---------- 3. Hero entrance (once) ---------- */
    const heroBits = gsap.utils.toArray('.rx-hero__description, .rx-hero__actions, .rx-hero-cards-wrapper');
    if (heroBits.length) {
      gsap.from(heroBits, {
        y: 48, opacity: 0, duration: 1.3, ease: 'power4.out', stagger: 0.14, delay: 0.35, clearProps: 'transform,opacity',
      });
      gsap.to('.rx-hero-cards-wrapper', {
        yPercent: -7, ease: 'none',
        scrollTrigger: { trigger: '.rx-hero-saas', start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
    }

    /* ---------- 4. Section headings: masked line reveal ---------- */
    const headings = gsap.utils.toArray('main h2, main .ed-section-head__title:not(.ed-split-text)')
      .filter((el) => !el.closest('.rx-hero__content') && !el.classList.contains('ed-split-text'));
    const splits = [];

    const buildHeading = (el) => {
      if (!SplitText) {
        gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        return;
      }
      const split = new SplitText(el, { type: 'lines', linesClass: 'rx-line' });
      split.lines.forEach((line) => {
        const mask = document.createElement('span');
        mask.className = 'rx-line-mask';
        line.parentNode.insertBefore(mask, line);
        mask.append(line);
      });
      const tween = gsap.from(split.lines, {
        yPercent: 110, duration: 1.15, ease: 'power4.out', stagger: 0.09,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
      splits.push({ el, split, tween });
    };
    const clearHeadings = () => {
      splits.splice(0).forEach(({ split, tween }) => {
        tween.scrollTrigger?.kill();
        tween.kill();
        split.revert();
      });
    };
    const runHeadings = () => headings.forEach(buildHeading);
    (document.fonts?.ready || Promise.resolve()).then(runHeadings);

    let lastWidth = window.innerWidth;
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        clearHeadings();
        runHeadings();
        ScrollTrigger.refresh();
      }, 250);
    };
    window.addEventListener('resize', onResize);
    removeResize = () => { window.clearTimeout(resizeTimer); window.removeEventListener('resize', onResize); };

    /* ---------- 5. Content blocks: staggered batch reveal ---------- */
    const blocks = [
      '.rx-who-we-are__lead', '.rx-who-we-are__body', '.rx-who-we-are__values li', '.rx-who-we-are__note',
      '.ed-funfact__counter', '.ed-funfact__img',
      '.rx-activity__slide', '.rx-events-section .text-muted',
      '.rx-flip-card', '.ed-footer__top .row > div',
    ].join(',');
    const items = gsap.utils.toArray(blocks);
    if (items.length) {
      gsap.set(items, { y: 56, opacity: 0 });
      ScrollTrigger.batch(items, {
        start: 'top 90%', once: true, interval: 0.1, batchMax: 6,
        onEnter: (batch) => gsap.to(batch, {
          y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.1, overwrite: true,
          clearProps: 'transform,opacity',
        }),
      });
    }

    /* ---------- 6. Image parallax inside its frame ---------- */
    gsap.utils.toArray('.rx-who-we-are__image-frame').forEach((frame) => {
      const img = frame.querySelector('img');
      if (!img) return;
      gsap.fromTo(img, { yPercent: -7, scale: 1.18 }, {
        yPercent: 7, scale: 1.18, ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
      });
    });
  });

  // Late-rendering content (React sections, images) shifts layout
  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener('load', refresh);
  const refreshTimer = window.setTimeout(refresh, 1200);

  return () => {
    window.clearTimeout(refreshTimer);
    window.removeEventListener('load', refresh);
    document.removeEventListener('click', onAnchorClick, true);
    bodyObserver.disconnect();
    gsap.ticker.remove(tick);
    removeResize();
    ctx.revert();
    lenis.destroy();
    bar.remove();
    delete window.__rxLenis;
    document.documentElement.classList.remove('rx-motion');
  };
}
