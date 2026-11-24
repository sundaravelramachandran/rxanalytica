import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import GooeyNav from './GooeyNav.jsx';

// The original site's liquid (gooey) nav. On click the pill flows to the new item, then the page loads;
// the new page starts the pill on the previous item and flows it to the current one, so the jump continues.
export function mountNav(el, items, current) {
  const key = 'rx-nav-prev';
  const raw = sessionStorage.getItem(key); sessionStorage.removeItem(key);
  const prev = raw === null ? current : Math.min(Math.max(0, Number(raw) || 0), items.length - 1);
  function Nav() {
    const [idx, setIdx] = useState(prev);
    useEffect(() => { if (idx !== current) { const t = setTimeout(() => setIdx(current), 1400); return () => clearTimeout(t); } }, []);
    return (
      <GooeyNav items={items} activeIndex={idx} theme="light" color="#ffcd20" colors={['#ffcd20']} size="md" frame={false}
        className="rx-goo" onChange={(i) => { sessionStorage.setItem(key, String(current)); setIdx(i); }} />
    );
  }
  createRoot(el).render(<Nav />);
}
