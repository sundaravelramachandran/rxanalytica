import React, { useState, useEffect, useRef, useCallback } from 'react';
import './RxRecentActivity.css';

const SLIDES = [
  {
    id: 1,
    tag: 'Pharmacy Career Workshop',
    institution: 'The Erode College of Pharmacy, Erode',
    subject: 'AI-Driven Career Opportunities for Pharma Graduates',
    summary: 'Conducted an interactive workshop on AI-driven career opportunities for pharmacy graduates.',
    checklist: [
      'Explored emerging career paths, essential AI skills, and evolving industry expectations.',
      'Guided students on preparing for future opportunities in the pharmaceutical industry.',
    ],
    image: 'images/our recent activity images/88C18D29-F120-4363-92D5-2B5533A9ADAA.jpeg',
    imageAlt: 'AI-driven pharma career opportunities workshop at The Erode College of Pharmacy',
  },
  {
    id: 2,
    tag: 'Pharmacy Career Guidance',
    institution: 'P.S.V. College of Pharmaceutical Science and Research, Krishnagiri',
    subject: 'AI-Driven Pharma Career Guidance',
    summary: 'Delivered an insightful session on AI-driven career opportunities in the pharmaceutical industry.',
    checklist: [
      'Highlighted emerging technologies, industry-relevant skills, and career pathways for pharmacy graduates.',
      'Helped students understand how to build skills and prepare for future industry roles.',
    ],
    image: 'images/our recent activity images/53B80C88-0E02-4CFB-8D95-1D3C6381BBC9.jpeg',
    imageAlt: 'AI-driven pharma career guidance session at P.S.V. College of Pharmaceutical Science and Research',
  },
  {
    id: 3,
    tag: 'AI & Pharmaceutical Applications',
    institution: 'KMCH College of Pharmacy, Coimbatore',
    subject: 'Artificial Intelligence & Machine Learning in Pharmaceutical Applications',
    summary: 'Delivered an engaging session on Artificial Intelligence and Machine Learning in the pharmaceutical industry.',
    checklist: [
      'Explained how AI and ML can support pharmaceutical manufacturing, quality improvement, and data-driven decision-making.',
      'Connected classroom knowledge with real-world industry applications to inspire future-ready learning.',
    ],
    image: 'images/our recent activity images/414D4832-8A67-4BB1-8FC6-B15F86E0DBCB.jpeg',
    imageAlt: 'Artificial intelligence and machine learning session at KMCH College of Pharmacy, Coimbatore',
  },
];

const AUTOPLAY_INTERVAL = 5000; // 5 seconds per slide
const STEP_MS = 30;

export default function RxRecentActivity() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goToSlide = useCallback((index) => {
    setCurrentIndex((index + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  const toggleAutoplay = () => {
    setIsPlaying((prev) => !prev);
    setProgress(0);
  };

  // Autoplay ticker and smooth progress line
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setInterval(() => {
      setProgress((old) => {
        const increment = (STEP_MS / AUTOPLAY_INTERVAL) * 100;
        const nextVal = old + increment;
        if (nextVal >= 100) {
          goToSlide(currentIndex + 1);
          return 0;
        }
        return nextVal;
      });
    }, STEP_MS);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, currentIndex, goToSlide]);

  // Touch Swipe Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section
      className="rx-activity"
      id="recent-activity"
      aria-labelledby="rxActivityTitle"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container ed-container">
        {/* Header row with Green Title and Sleek Navigation Capsule */}
        <div className="rx-activity__heading-wrap">
          <div>
            <span className="rx-activity__badge">LEARNING BEYOND THE CLASSROOM</span>
            <h2 className="rx-activity__title" id="rxActivityTitle">
              Our Recent Activity
            </h2>
          </div>

          {/* Action Capsule: Play/Pause, Prev, Next */}
          <div className="rx-activity__nav-capsule" role="toolbar" aria-label="Activity carousel controls">
            <button
              className={`rx-activity__nav-btn rx-activity__nav-btn--toggle ${!isPlaying ? 'is-paused' : ''}`}
              type="button"
              onClick={toggleAutoplay}
              aria-label={isPlaying ? 'Pause automatic activity scrolling' : 'Play automatic activity scrolling'}
              aria-pressed={isPlaying}
              title={isPlaying ? 'Pause auto-scroll' : 'Play auto-scroll'}
            >
              {isPlaying ? (
                /* Pause Icon */
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
                </svg>
              ) : (
                /* Play Icon */
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              className="rx-activity__nav-btn"
              type="button"
              onClick={prevSlide}
              aria-label="Previous activity"
              title="Previous activity"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <button
              className="rx-activity__nav-btn"
              type="button"
              onClick={nextSlide}
              aria-label="Next activity"
              title="Next activity"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Viewport - Zero scrollbar, pure GPU transform */}
        <div
          className="rx-activity__viewport"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-roledescription="carousel"
          aria-label="Recent Activities Carousel"
        >
          <div
            className="rx-activity__slider-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {SLIDES.map((slide, index) => (
              <article
                key={slide.id}
                className="rx-activity__card-slide"
                aria-hidden={index !== currentIndex}
              >
                <div className="rx-activity__card-inner">
                  {/* Photo Column */}
                  <div className="rx-activity__media-col">
                    <img
                      src={slide.image}
                      alt={slide.imageAlt}
                      loading="lazy"
                    />
                    <div className="rx-activity__media-overlay" />
                    <div className="rx-activity__media-badge">
                      <span className="rx-activity__media-badge-dot" />
                      <span className="rx-activity__media-badge-text">
                        Campus Session {`0${slide.id}`}
                      </span>
                    </div>
                  </div>

                  {/* Details Column */}
                  <div className="rx-activity__body-col">
                    <span className="rx-activity__watermark">{`0${slide.id}`}</span>
                    <span className="rx-activity__tag">{slide.tag}</span>

                    <h4 className="rx-activity__venue">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      {slide.institution}
                    </h4>

                    <h3 className="rx-activity__subject">{slide.subject}</h3>
                    <p className="rx-activity__summary">{slide.summary}</p>

                    <ul className="rx-activity__checklist">
                      {slide.checklist.map((item, idx) => (
                        <li key={idx}>
                          <span className="rx-activity__check-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Bottom Pagination & Real-Time Auto-Scroll Progress */}
        <div className="rx-activity__footer-row">
          <div className="rx-activity__dots" aria-label="Slide indicators">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`rx-activity__dot ${index === currentIndex ? 'is-active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="rx-activity__progress-line" title="Auto-advance countdown">
            <div
              className="rx-activity__progress-bar"
              style={{ width: `${isPlaying && !isHovered ? progress : (currentIndex + 1) * 33.33}%` }}
            />
          </div>

          <div className="rx-activity__slide-counter">
            <strong>{`0${currentIndex + 1}`}</strong> / {`0${SLIDES.length}`}
          </div>
        </div>
      </div>
    </section>
  );
}
