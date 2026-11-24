import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import GooeyNav from './components/GooeyNav.jsx';
import RxHeroTechText from './components/RxHeroTechText.jsx';
import RxRecentActivity from './components/RxRecentActivity.jsx';
import RxUpcomingEvents from './components/RxUpcomingEvents.jsx';
import 'lenis/dist/lenis.css';
import './app.css';
import { initMotion } from './motion.js';

const pages = import.meta.glob('./templates/*.html', { query: '?raw', import: 'default',  });
const attributeNames = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', readonly: 'readOnly',
  maxlength: 'maxLength', colspan: 'colSpan', rowspan: 'rowSpan', crossorigin: 'crossOrigin',
  srcset: 'srcSet', datetime: 'dateTime', usemap: 'useMap', frameborder: 'frameBorder',
  allowfullscreen: 'allowFullScreen', playsinline: 'playsInline',
  cellpadding: 'cellPadding', cellspacing: 'cellSpacing', autocomplete: 'autoComplete',
  contenteditable: 'contentEditable', spellcheck: 'spellCheck', viewbox: 'viewBox',
  preserveaspectratio: 'preserveAspectRatio', 'xlink:href': 'xlinkHref',
};
const booleanAttributes = new Set([
  'allowfullscreen', 'async', 'autofocus', 'autoplay', 'checked', 'controls', 'default',
  'defer', 'disabled', 'formnovalidate', 'hidden', 'inert', 'ismap', 'itemscope', 'loop',
  'multiple', 'muted', 'nomodule', 'novalidate', 'open', 'playsinline', 'readonly', 'required', 'selected',
]);

class GooeyNavBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Animated navigation failed; showing the standard menu instead.', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <nav className="ed-header__navigation">
        <ul className="ed-header__menu">
          {this.props.items.map((item, index) => (
            <li key={item.href} className={index === this.props.activeIndex ? 'active' : undefined}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

function styleToObject(value) {
  return value.split(';').reduce((styles, declaration) => {
    const splitAt = declaration.indexOf(':');
    if (splitAt < 0) return styles;
    const rawName = declaration.slice(0, splitAt).trim();
    const rawValue = declaration.slice(splitAt + 1).trim();
    if (!rawName || !rawValue) return styles;
    const name = rawName.startsWith('--') ? rawName : rawName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    styles[name] = rawValue;
    return styles;
  }, {});
}

function toReactNode(node, key) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  const tag = node.tagName.toLowerCase();
  if (tag === 'script') return null;
  if (tag === 'div' && node.id === 'preloader') return null;

  const props = { key };
  for (const attribute of node.attributes) {
    const name = attribute.name.toLowerCase();
    if (name.startsWith('on')) continue;
    const propName = attributeNames[name] || name;
    props[propName] = name === 'style'
      ? styleToObject(attribute.value)
      : booleanAttributes.has(name) ? true : attribute.value;
  }

  if (tag === 'h1' && node.classList.contains('rx-hero__title') && document.getElementById('root')?.dataset.page === 'index') {
    return React.createElement(RxHeroTechText, { key, className: 'rx-hero__title-tech' });
  }

  if (tag === 'section' && (node.id === 'recent-activity' || node.classList.contains('rx-activity'))) {
    return React.createElement(RxRecentActivity, { key });
  }

  if (tag === 'section' && (node.id === 'upcoming-events' || node.classList.contains('ed-blog--home-refresh') || node.classList.contains('rx-events-section'))) {
    return React.createElement(RxUpcomingEvents, { key });
  }

  if (tag === 'nav' && node.classList.contains('ed-header__navigation')) {
    const currentPage = document.getElementById('root')?.dataset.page || 'index';
    const items = Array.from(node.querySelectorAll('a')).map((link) => {
      const href = link.getAttribute('href') || '#';
      const targetPage = href.split('/').pop().replace(/\.html(?:[?#].*)?$/, '');
      return {
        label: link.textContent.trim(),
        href,
        active: link.closest('li')?.classList.contains('active') || targetPage === currentPage,
      };
    });
    const initialActiveIndex = Math.max(0, items.findIndex((item) => item.active));
    const nav = React.createElement(GooeyNav, {
      items,
      initialActiveIndex,
      theme: 'light',
      color: '#ffcd20',
      colors: ['#ffcd20', '#ffcd20', '#ffcd20', '#ffcd20', '#ffcd20'],
      size: 'sm',
      frame: true,
      className: 'ed-header__navigation rx-header-gooey-nav',
    });
    return React.createElement(GooeyNavBoundary, { key, items, activeIndex: initialActiveIndex }, nav);
  }

  if (tag === 'input') {
    if (node.hasAttribute('value')) {
      props.defaultValue = node.getAttribute('value');
      delete props.value;
    }
    if (node.hasAttribute('checked')) {
      props.defaultChecked = true;
      delete props.checked;
    }
  }
  if (tag === 'textarea') {
    props.defaultValue = node.textContent;
    return React.createElement(tag, props);
  }
  const children = Array.from(node.childNodes).map((child, index) => toReactNode(child, `${key}.${index}`));
  return React.createElement(tag, props, ...children);
}

async function getPageMarkup(pageName) {
  const loadTemplate = pages[`./templates/${pageName}.html`];
  if (!loadTemplate) throw new Error(`Missing page template: ${pageName}`);
  const source = await loadTemplate();
  const markup = new DOMParser().parseFromString(source, 'text/html');

  if (pageName === 'index') {
    const main = markup.querySelector('main');
    const whoWeAre = main?.querySelector('#who-we-are');
    const upcomingEvents = main?.querySelector('#upcoming-events');
    const recentActivity = main?.querySelector('#recent-activity');
    const impact = main?.querySelector('.ed-funfact');
    if (whoWeAre && upcomingEvents) whoWeAre.after(upcomingEvents);
    if (recentActivity && impact) recentActivity.after(impact);
  }
  if (pageName === 'about') {
    const main = markup.querySelector('main');
    const banner = main?.querySelector('.rx-about-banner');
    const partners = main?.querySelector('#partners-investors');
    main?.querySelector('#learning-insights')?.remove();
    main?.querySelector('.ed-call-action')?.remove();
    if (banner && partners) banner.after(partners);
  }

  return markup;
}

function useEcosystemCardTilt(enabled) {
  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = Array.from(document.querySelectorAll('#learning-ecosystem .rx-ecosystem-card'));
    const cleanups = cards.map((card) => {
      let frame = 0;
      let active = false;
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;

      const animate = () => {
        frame = 0;
        const easing = active ? 0.2 : 0.42;
        currentX += (targetX - currentX) * easing;
        currentY += (targetY - currentY) * easing;
        if (Math.abs(targetX - currentX) < 0.06) currentX = targetX;
        if (Math.abs(targetY - currentY) < 0.06) currentY = targetY;

        card.style.setProperty('--rx-tilt-x', `${currentX.toFixed(2)}deg`);
        card.style.setProperty('--rx-tilt-y', `${currentY.toFixed(2)}deg`);

        const stillMoving = Math.abs(targetX - currentX) >= 0.06 || Math.abs(targetY - currentY) >= 0.06;
        if (stillMoving) frame = window.requestAnimationFrame(animate);
        else if (!active) card.removeAttribute('data-tilt-active');
      };

      const requestFrame = () => {
        if (!frame) frame = window.requestAnimationFrame(animate);
      };

      const onPointerEnter = (event) => {
        if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
        active = true;
        card.setAttribute('data-tilt-active', '');
        requestFrame();
      };

      const onPointerMove = (event) => {
        if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
        const bounds = card.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1));
        const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1));
        targetX = -y * 8;
        targetY = x * 10;
        card.style.setProperty('--rx-glare-x', `${((x + 1) / 2) * 100}%`);
        card.style.setProperty('--rx-glare-y', `${((y + 1) / 2) * 100}%`);
        requestFrame();
      };

      const onPointerLeave = () => {
        active = false;
        targetX = 0;
        targetY = 0;
        requestFrame();
      };

      card.addEventListener('pointerenter', onPointerEnter);
      card.addEventListener('pointermove', onPointerMove);
      card.addEventListener('pointerleave', onPointerLeave);

      return () => {
        window.cancelAnimationFrame(frame);
        card.removeEventListener('pointerenter', onPointerEnter);
        card.removeEventListener('pointermove', onPointerMove);
        card.removeEventListener('pointerleave', onPointerLeave);
        card.removeAttribute('data-tilt-active');
        card.style.removeProperty('--rx-tilt-x');
        card.style.removeProperty('--rx-tilt-y');
        card.style.removeProperty('--rx-glare-x');
        card.style.removeProperty('--rx-glare-y');
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [enabled]);
}

function addLegacyHead(markup) {
  const added = [];
  for (const element of markup.head.querySelectorAll('link, meta, style')) {
    if (element.tagName === 'META' && element.hasAttribute('charset')) continue;
    if (element.tagName === 'META' && element.name.toLowerCase() === 'viewport') continue;
    if (element.tagName === 'LINK' && element.rel.toLowerCase().includes('icon')) continue;
    const clone = element.cloneNode(true);
    if (clone.tagName === 'LINK' && clone.rel === 'shortcut icon') clone.href = new URL(clone.getAttribute('href'), location.href).href;
    document.head.append(clone);
    added.push(clone);
  }
  return added;
}

async function runLegacyScripts(markup) {
  const inserted = [];
  for (const original of markup.querySelectorAll('script')) {
    const script = document.createElement('script');
    for (const attribute of original.attributes) script.setAttribute(attribute.name, attribute.value);
    if (original.src) {
      script.src = new URL(original.getAttribute('src'), location.href).href;
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () => {
          console.error(`Could not load legacy script: ${script.src}`);
          resolve();
        };
        document.body.append(script);
      });
    } else {
      script.textContent = original.textContent;
      document.body.append(script);
    }
    inserted.push(script);
  }
  document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
  window.dispatchEvent(new Event('load'));
  return () => inserted.forEach((script) => script.remove());
}

function App() {
  const pageName = document.getElementById('root')?.dataset.page || 'index';
  const [markup, setMarkup] = useState(null);
  const [legacyReady, setLegacyReady] = useState(false);

  useEcosystemCardTilt(legacyReady && pageName === 'about');

  useEffect(() => {
    let cancelled = false;
    getPageMarkup(pageName)
      .then((pageMarkup) => { if (!cancelled) setMarkup(pageMarkup); })
      .catch((error) => console.error(error));
    return () => { cancelled = true; };
  }, [pageName]);
  useEffect(() => {
    if (!markup) return;
    document.querySelectorAll('.rx-video-modal.is-open').forEach((modal) => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    });
    document.querySelectorAll('.rx-video-modal__player, .rx-video-modal__embed').forEach((media) => {
      if (media.tagName === 'VIDEO') media.pause?.();
      media.removeAttribute('src');
      if (media.hidden !== undefined) media.hidden = true;
    });
    document.body.classList.remove('rx-video-modal-open');

    document.title = markup.title || 'Rx Analytica One';
    document.documentElement.lang = markup.documentElement.lang || 'en';
    document.documentElement.className = markup.documentElement.className;
    document.body.className = markup.body.className;
    const headNodes = addLegacyHead(markup);
    const brandPalette = document.createElement('link');
    brandPalette.rel = 'stylesheet';
    brandPalette.href = new URL('/section-css/brand-palette.css', location.origin).href;
    brandPalette.dataset.rxBrandPalette = 'true';
    document.head.append(brandPalette);
    headNodes.push(brandPalette);
    let removeScripts = () => {};
    let cancelled = false;
    runLegacyScripts(markup).then((cleanup) => {
      if (cancelled) cleanup();
      else {
        removeScripts = cleanup;
        setLegacyReady(true);
      }
    }).catch((error) => console.error(error));
    return () => {
      cancelled = true;
      removeScripts();
      headNodes.forEach((node) => node.remove());
    };
  }, [markup]);

  useEffect(() => {
    document.body.classList.remove('rx-loaded');
    const preloader = document.getElementById('preloader');
    if (!preloader) {
      document.body.classList.remove('rx-loading');
      document.body.classList.add('rx-loaded');
      return;
    }
    const fallbackTimer = window.setTimeout(() => {
      preloader.classList.add('is-hidden');
      document.body.classList.remove('rx-loading');
      document.body.classList.add('rx-loaded');
      window.setTimeout(() => {
        if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader);
        if (typeof window.ScrollTrigger !== 'undefined' && window.ScrollTrigger.refresh) {
          window.ScrollTrigger.refresh();
        }
      }, 500);
    }, 2200);
    return () => window.clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    if (!legacyReady) return;
    const preloader = document.getElementById('preloader');
    if (!preloader) {
      document.body.classList.remove('rx-loading');
      document.body.classList.add('rx-loaded');
      return;
    }
    const timer = window.setTimeout(() => {
      preloader.classList.add('is-hidden');
      document.body.classList.remove('rx-loading');
      document.body.classList.add('rx-loaded');
      window.setTimeout(() => {
        if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader);
        if (typeof window.ScrollTrigger !== 'undefined' && window.ScrollTrigger.refresh) {
          window.ScrollTrigger.refresh();
        }
      }, 500);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [legacyReady]);

  useEffect(() => {
    if (!legacyReady) return;
    return initMotion();
  }, [legacyReady]);

  useEffect(() => {
    if (!legacyReady) return;

    const initFunfactCounters = () => {
      const section = document.querySelector('.ed-funfact');
      if (!section) return;

      const counters = section.querySelectorAll('.counter');
      if (!counters.length) return;

      let hasAnimated = false;
      const startCounting = () => {
        if (hasAnimated) return;
        hasAnimated = true;

        counters.forEach((el) => {
          const targetStr = el.getAttribute('data-count') || el.textContent;
          const target = parseInt(targetStr.replace(/[^\d]/g, ''), 10);
          if (isNaN(target) || target <= 0) return;

          const duration = 1800;
          let startTime = null;

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.floor(ease * target);
            el.textContent = current.toLocaleString();

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              el.textContent = target.toLocaleString();
            }
          };

          el.textContent = '0';
          window.requestAnimationFrame(step);
        });
      };

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                startCounting();
                observer.disconnect();
              }
            });
          },
          { threshold: 0.15 }
        );
        observer.observe(section);
      } else {
        startCounting();
      }

      if (typeof window.ScrollTrigger !== 'undefined' && window.ScrollTrigger.create) {
        window.ScrollTrigger.create({
          trigger: section,
          start: 'top 85%',
          once: true,
          onEnter: () => startCounting(),
        });
      }

      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        startCounting();
      }
    };

    const countTimer = window.setTimeout(initFunfactCounters, 350);
    return () => window.clearTimeout(countTimer);
  }, [legacyReady]);

  const bodyNodes = markup ? Array.from(markup.body.childNodes).map((node, index) => toReactNode(node, index)) : null;
  return <div className="rx-react-page" aria-busy={!legacyReady}>{bodyNodes}</div>;
}

createRoot(document.getElementById('root')).render(<App />);
