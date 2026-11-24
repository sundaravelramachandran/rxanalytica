import React, { useEffect, useRef } from 'react';
import './TechText.css';

const approach = (current, target, dt, seconds) =>
  current + (target - current) * (1 - Math.exp(-dt / seconds));

export default function TechText({
  text,
  className = '',
  fontSize = 54,
  fontWeight = 800,
  letterSpacing = 0,
  align = 'left',
  color = 'currentColor',
  accentColor = '#E8A220',
  reveal = 'letter',
  reach = 150,
  softness = 0.7,
  sweep = true,
  draggable = true,
  labels = false,
  selection = true,
  guides = false,
  intro = 'metrics',
  introDuration = 1.8,
  specks = 12
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!container || !canvas || !ctx) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    let alive = true;
    let clock = 0;
    let introClock = 0;
    let glyphs = [];
    let lens = { x: 0, y: 0 };
    let pointer = { x: 0, y: 0, inside: false };
    let dragging = -1;
    let grab = { x: 0, y: 0 };
    let frame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 };

    const measure = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const family = getComputedStyle(container).fontFamily || 'sans-serif';
      ctx.font = `${fontWeight} ${fontSize}px ${family}`;
      ctx.textBaseline = 'alphabetic';
      if ('letterSpacing' in ctx) ctx.letterSpacing = `${letterSpacing}px`;

      let size = fontSize;
      const fitWidth = width * 0.98;
      const maxMeasure = ctx.measureText(text);
      if (maxMeasure.width > fitWidth) size = fontSize * (fitWidth / maxMeasure.width);
      size = Math.max(24, size);

      ctx.font = `${fontWeight} ${size}px ${family}`;
      const metrics = ctx.measureText(text);
      const inkWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
      const inkHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
      const baseline = (height - inkHeight) / 2 + metrics.actualBoundingBoxAscent;
      const left = align === 'right'
        ? width - inkWidth
        : align === 'center'
          ? (width - inkWidth) / 2
          : 0;

      glyphs = [];
      let prefix = '';
      Array.from(text).forEach((char, index) => {
        prefix += char;
        const own = ctx.measureText(char);
        const x = left + ctx.measureText(prefix).width - own.width;
        const box = {
          x1: x - own.actualBoundingBoxLeft,
          y1: baseline - own.actualBoundingBoxAscent,
          x2: x + own.actualBoundingBoxRight,
          y2: baseline + own.actualBoundingBoxDescent
        };
        glyphs.push({ char, x, baseline, box, offset: { x: 0, y: 0 }, outline: 0, shown: 1, index });
      });

      lens.x = left + inkWidth * 0.5;
      lens.y = baseline;
    };

    const glyphAt = (x, y) => {
      let best = -1;
      let bestDistance = Infinity;
      glyphs.forEach((glyph, index) => {
        const x1 = glyph.box.x1 + glyph.offset.x;
        const x2 = glyph.box.x2 + glyph.offset.x;
        const d = x < x1 ? x1 - x : x > x2 ? x - x2 : 0;
        if (d < bestDistance) {
          bestDistance = d;
          best = index;
        }
      });
      return bestDistance < 28 ? best : -1;
    };

    const onMove = event => {
      const rect = container.getBoundingColor?.() || container.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.inside = true;
    };

    const onLeave = () => {
      if (dragging < 0) pointer.inside = false;
    };

    const onDown = event => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const index = glyphAt(x, y);
      if (draggable && index >= 0) {
        dragging = index;
        grab.x = x - glyphs[index].offset.x;
        grab.y = y - glyphs[index].offset.y;
        container.setPointerCapture?.(event.pointerId);
      }
    };

    const onUp = event => {
      if (dragging >= 0) {
        dragging = -1;
        container.releasePointerCapture?.(event.pointerId);
      }
    };

    const draw = now => {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      clock += dt;
      introClock += dt;

      const progress = reducedMotion || intro === 'none'
        ? 1
        : Math.min(1, introClock / Math.max(0.3, introDuration));

      let targetX = pointer.x;
      let targetY = pointer.y;
      if (sweep && !pointer.inside && !reducedMotion) {
        const first = glyphs[0]?.box;
        const lastGlyph = glyphs[glyphs.length - 1]?.box;
        if (first && lastGlyph) {
          targetX = first.x1 + (lastGlyph.x2 - first.x1) * (0.5 - 0.5 * Math.cos(clock * 0.6));
          targetY = (first.y1 + first.y2) / 2;
        }
      }

      lens.x = approach(lens.x, targetX || lens.x, dt, pointer.inside ? 0.05 : 0.18);
      lens.y = approach(lens.y, targetY || lens.y, dt, pointer.inside ? 0.05 : 0.18);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const family = getComputedStyle(container).fontFamily || 'sans-serif';
      glyphs.forEach((glyph, index) => {
        if (dragging === index) {
          const rect = container.getBoundingClientRect();
          glyph.offset.x = pointer.x - grab.x;
          glyph.offset.y = pointer.y - grab.y;
        } else {
          glyph.offset.x = approach(glyph.offset.x, 0, dt, 0.09);
          glyph.offset.y = approach(glyph.offset.y, 0, dt, 0.09);
        }

        const lead = glyphs.length > 1 ? index / (glyphs.length - 1) : 0;
        const introAmount = intro === 'none' || progress >= 1
          ? 1
          : Math.min(1, Math.max(0, (progress - lead * 0.22) / 0.78));
        const distance = Math.hypot(
          lens.x - (glyph.box.x1 + glyph.box.x2) / 2,
          lens.y - (glyph.box.y1 + glyph.box.y2) / 2
        );
        const revealed = reveal === 'letter'
          ? Math.max(0, 1 - distance / reach)
          : pointer.inside ? 1 : 0;

        ctx.save();
        ctx.globalAlpha = Math.max(0.12, introAmount);
        ctx.font = `${fontWeight} ${ctx.font.match(/\d+(?:\.\d+)?px/)?.[0] || '54px'} ${family}`;
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = distance < reach * 0.72 ? accentColor : color;

        if (progress < 1) {
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.strokeText(glyph.char, glyph.x + glyph.offset.x, glyph.baseline);
        } else {
          ctx.globalAlpha = 0.35 + revealed * 0.65;
          ctx.fillText(glyph.char, glyph.x + glyph.offset.x, glyph.baseline);
        }
        ctx.restore();
      });

      const activeIndex = pointer.inside ? glyphAt(lens.x, lens.y) : -1;
      if (selection && activeIndex >= 0) {
        const glyph = glyphs[activeIndex];
        frame.x1 = approach(frame.x1, glyph.box.x1 - 5 + glyph.offset.x, dt, 0.08);
        frame.y1 = approach(frame.y1, glyph.box.y1 - 5 + glyph.offset.y, dt, 0.08);
        frame.x2 = approach(frame.x2, glyph.box.x2 + 5 + glyph.offset.x, dt, 0.08);
        frame.y2 = approach(frame.y2, glyph.box.y2 + 5 + glyph.offset.y, dt, 0.08);
        frame.alpha = approach(frame.alpha, 1, dt, 0.1);
        frame.index = activeIndex;
      } else {
        frame.alpha = approach(frame.alpha, 0, dt, 0.1);
      }

      if (frame.alpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = frame.alpha * 0.72;
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.strokeRect(frame.x1, frame.y1, frame.x2 - frame.x1, frame.y2 - frame.y1);
        ctx.setLineDash([]);
        ctx.restore();

        if (labels) {
          ctx.save();
          ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
          ctx.fillStyle = accentColor;
          ctx.globalAlpha = frame.alpha * 0.8;
          ctx.fillText(glyphs[frame.index]?.char || '', frame.x1, frame.y1 - 7);
          ctx.restore();
        }
      }

      if (guides) {
        ctx.save();
        ctx.strokeStyle = accentColor;
        ctx.globalAlpha = 0.28;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.restore();
      }

      const speckCount = specks;
      if (speckCount > 0 && frame.alpha > 0.05) {
        ctx.fillStyle = accentColor;
        ctx.globalAlpha = frame.alpha * 0.5;
        for (let i = 0; i < speckCount; i++) {
          const x = frame.x1 + (i * 37 % Math.max(30, frame.x2 - frame.x1 + 30));
          const y = i % 2 ? frame.y1 - 7 - (i % 3) * 4 : frame.y2 + 8 + (i % 3) * 4;
          ctx.fillRect(Math.round(x), Math.round(y), i % 4 === 0 ? 5 : 2, i % 4 === 0 ? 5 : 2);
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(container);
    window.addEventListener('resize', measure);
    container.addEventListener('pointermove', onMove, { passive: true });
    container.addEventListener('pointerleave', onLeave, { passive: true });
    container.addEventListener('pointerdown', onDown, { passive: true });
    container.addEventListener('pointerup', onUp, { passive: true });

    measure();
    raf = requestAnimationFrame(draw);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerleave', onLeave);
      container.removeEventListener('pointerdown', onDown);
      container.removeEventListener('pointerup', onUp);
    };
  }, [text, fontSize, fontWeight, letterSpacing, align, color, accentColor, reach, softness, reveal, sweep, draggable, labels, selection, guides, intro, introDuration, specks]);

  return (
    <div ref={containerRef} className={`tech-text ${className}`.trim()} role="img" aria-label={text}>
      <canvas ref={canvasRef} className="tech-text-canvas" />
    </div>
  );
}
