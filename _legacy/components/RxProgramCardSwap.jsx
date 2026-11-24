import React, { useEffect, useRef, useState } from 'react';
import CardSwap, { Card } from './CardSwap.jsx';

const programs = [
  {
    id: 'live',
    name: 'Rx Live',
    label: 'Learn from Experts',
    description: 'Learn directly from experienced educators.',
    icon: '/images/hero/3d-icon-live.svg',
    image: '/images/hero/home-3/hero-img-1.jpg',
    theme: 'live-theme',
  },
  {
    id: 'learn',
    name: 'Rx Learn',
    label: 'Concept Made Simple',
    description: 'Clear lessons and structured study resources.',
    icon: '/images/hero/3d-icon-learn.svg',
    image: '/images/hero/home-3/hero-img-2.jpg',
    theme: 'learn-theme',
  },
  {
    id: 'aspire',
    name: 'Rx Aspire',
    label: 'Smart, Quick Exam Revision',
    description: 'Focused preparation for competitive exams.',
    icon: '/images/hero/3d-icon-aspire.svg',
    image: '/images/hero/home-3/hero-img-3.jpg',
    theme: 'aspire-theme',
  },
  {
    id: 'exam',
    name: 'Rx Exam',
    label: 'Practice, Mock Test and Scholarships',
    description: 'Practice, assess, and track your progress.',
    icon: '/images/hero/3d-icon-exams.svg',
    image: '/images/hero/home-1/hero-img.png',
    theme: 'exam-theme',
  },
];

function ProgramCard({ program }) {
  return (
    <Card customClass={`rx-program-swap-card ${program.theme}`}>
      <div className={`rx-card-item ${program.theme}`} data-pillar={program.id} data-video-src="">
        <img className="rx-swap-photo" src={program.image} alt="" draggable={false} />
        <div className="rx-swap-content">
          <div className="rx-swap-card-top">
            <img className="rx-swap-program-icon" src={program.icon} alt="" />
            <span className="rx-card-pill">{program.label}</span>
          </div>
          <div className="rx-swap-card-bottom">
            <div className="rx-swap-copy">
              <h3 className="rx-card-title">{program.name}</h3>
              <p>{program.description}</p>
            </div>
            <button className="rx-card-popout" type="button" aria-label={`Play ${program.name} video`}>
              <i className="fi fi-rr-play" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function RxProgramCardSwap({ id = 'rxCardsDeck' }) {
  const containerRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(300);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const availableWidth = entry.contentRect.width;
      setCardWidth(Math.min(322, Math.max(204, Math.floor(availableWidth - 150))));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const cardHeight = Math.round(cardWidth * 0.76);

  return (
    <div
      ref={containerRef}
      className="rx-hero-cards-grid rx-hero-cards-grid--swap"
      id={id}
      aria-label="Explore Rx programs"
      style={{ height: cardHeight + 155 }}
    >
      <CardSwap
        className="rx-header-card-swap"
        width={cardWidth}
        height={cardHeight}
        cardDistance={Math.round(cardWidth * 0.085)}
        verticalDistance={24}
        depth={82}
        skewAmount={2.6}
        visibleCards={4}
        autoplay={false}
        draggable
        speed={1}
        bounce={0.28}
        parallax={0.16}
        hoverSpread={0.12}
        dim={0.2}
        cardRadius={22}
        intro
        theme="dark"
      >
        {programs.map((program) => <ProgramCard key={program.id} program={program} />)}
      </CardSwap>
    </div>
  );
}
