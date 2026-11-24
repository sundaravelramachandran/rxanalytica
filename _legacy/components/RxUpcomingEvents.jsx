import React, { useState } from 'react';
import './RxUpcomingEvents.css';

const RX_LIVE_EVENTS = [
  {
    id: 1,
    type: 'webinar',
    category: 'Rx Live • AI & Pharma',
    topic: 'AI & Machine Learning in Modern Clinical Pharmacy & Drug Design',
    date: 'Sat, Dec 14, 2024',
    time: '06:00 PM – 07:30 PM IST',
    image: 'images/blog/blog-1/4.png',
    imageAlt: 'AI and clinical pharmacy webinar',
    registerUrl: 'rx-live.html#register',
    highlights: [
      'Real-world AI algorithms in molecular target mapping & automated pharmacokinetics.',
      'Clinical case study: Accelerating trial matching and predicting drug-drug interactions.',
      'Live Q&A session with senior pharmaceutical AI consultants & research directors.',
    ],
    benefits: [
      'Verified Certificate of Completion accredited by Rx Analytica One.',
      'Downloadable AI in Pharmacy Starter Toolkit & complete session presentation deck.',
      'Exclusive fast-track access to industry mentorship & pharma network channels.',
    ],
  },
  {
    id: 2,
    type: 'webinar',
    category: 'Rx Live | Industry Careers',
    topic: 'Pharma Career Launchpad: Skills for a Changing Industry',
    date: 'Wed, Dec 18, 2024',
    time: '07:00 PM – 08:30 PM IST',
    image: 'images/blog/blog-1/1.png',
    imageAlt: 'Expert webinar on pharmaceutical career pathways',
    registerUrl: 'rx-live.html#register',
    highlights: [
      'Explore career paths across pharmaceutical research, manufacturing, quality, and clinical practice.',
      'Learn which digital, AI, and communication skills employers value in new graduates.',
      'Join an expert-led Q&A about building a strong start in the pharmaceutical industry.',
    ],
    benefits: [
      'Get a practical career roadmap with suggested skills and next steps.',
      'Download an industry skills checklist to guide your learning plan.',
      'Receive the webinar notes and links to recommended learning resources.',
    ],
  },
];

const RX_EXAM_EVENTS = [
  {
    id: 3,
    type: 'exam',
    category: 'Rx Exam • Evaluative Analytics',
    topic: 'Evaluation Masterclass: How Mock Analytics Drive 3x Retention',
    date: 'Sat, Dec 28, 2024',
    time: '05:30 PM – 07:00 PM IST',
    image: 'images/blog/blog-1/3.png',
    imageAlt: 'Mock evaluation and test analytics masterclass',
    registerUrl: 'rx-exam.html#register',
    highlights: [
      'Cognitive error-tagging: How identifying silly mistakes boosts scores by 25%.',
      'Time-per-question behavioral pacing tactics to eliminate negative marking penalty.',
      'Live demonstration of Rx Exam’s AI-powered student diagnostic progress dashboard.',
    ],
    benefits: [
      '1 Complimentary Full-Length Mock Evaluation Test with AI diagnostic feedback.',
      'Customized weak-spot remediation plan generated based on your performance.',
      'Access to the Rx Exam peer percentile benchmarking leaderboard.',
    ],
  },
  {
    id: 4,
    type: 'exam',
    category: 'Rx Exam • Mock Simulation',
    topic: 'National Mock Simulation & Diagnostic Performance Benchmarking',
    date: 'Sun, Jan 05, 2025',
    time: '10:30 AM – 12:30 PM IST',
    image: 'images/blog/blog-1/2.png',
    imageAlt: 'National mock simulation and test analytics',
    registerUrl: 'rx-exam.html#register',
    highlights: [
      'Standardized test simulation modeling real exam conditions and negative marking algorithms.',
      'Multi-parameter question-level accuracy reports and cognitive stamina breakdown.',
      'Comprehensive peer percentile mapping across statewide and national applicant pools.',
    ],
    benefits: [
      'Immediate in-depth diagnostic scorecard highlighting top 3 priority improvement areas.',
      'Personalized AI revision question set targeted to your unique error categories.',
      'Exclusive invitation to post-test doubt resolution and score booster workshop.',
    ],
  },
];

function FlipCard({ event, isFlipped, onToggle }) {
  const isExam = event.type === 'exam';
  const overviewLabel = isExam ? 'Evaluation Overview' : 'Webinar Overview';
  const highlightsLabel = isExam ? 'What This Mock Exam Covers' : 'Webinar Session Highlights';
  const benefitsLabel = isExam ? 'Your Evaluation Benefits' : 'Attendee Benefits';
  const actionLabel = isExam ? 'Register for Exam' : 'Register for Webinar';

  return (
    <div
      className={`rx-flip-card ${isFlipped ? 'is-flipped' : ''}`}
      onClick={onToggle}
    >
      <div className="rx-flip-card__inner">
        {/* ================= FRONT SIDE ================= */}
        <div className="rx-flip-card__front">
          {/* Webinar Image & Badges */}
          <div className="rx-flip-card__media">
            <img src={event.image} alt={event.imageAlt} loading="lazy" />
            <span className="rx-flip-card__category-badge">{event.category}</span>
            <div className="rx-flip-card__live-pill">
              <span className="rx-flip-card__pulse-dot" />
              <span>{isExam ? 'Mock Exam' : 'Live Webinar'}</span>
            </div>
          </div>

          {/* Front Details */}
          <div className="rx-flip-card__body">
            <h3 className="rx-flip-card__topic">{event.topic}</h3>

            <div className="rx-flip-card__footer-group">

            {/* Date & Time Widget */}
            <div className="rx-flip-card__datetime">
              <div className="rx-flip-card__datetime-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <strong>{event.date}</strong>
              </div>

              <div className="rx-flip-card__datetime-row">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{event.time}</span>
              </div>
            </div>

            {/* Front Action Buttons */}
            <div className="rx-flip-card__actions">
              <a
                href={event.registerUrl}
                className="rx-btn-register"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{actionLabel}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
            </div>
          </div>
        </div>{/* ================= BACK SIDE ================= */}
        <div className="rx-flip-card__back">
          {/* Back Header */}
          <div className="rx-flip-card__back-header">
            <span className="rx-flip-card__back-tag">{overviewLabel}</span>
          </div>

          {/* Back Content (Highlights & Benefits) */}
          <div className="rx-flip-card__back-content">
            {/* Section 1: Highlights of Webinar */}
            <div className="rx-back-section">
              <div className="rx-back-section__title">
                <span className="rx-back-section__title-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </span>
                <span>{highlightsLabel}</span>
              </div>
              <ul className="rx-back-list">
                {event.highlights.map((point, idx) => (
                  <li key={idx}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 2: Benefits of the Webinar */}
            <div className="rx-back-section">
              <div className="rx-back-section__title">
                <span className="rx-back-section__title-icon rx-back-section__title-icon--benefits">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                </span>
                <span>{benefitsLabel}</span>
              </div>
              <ul className="rx-back-list rx-back-list--benefits">
                {event.benefits.map((point, idx) => (
                  <li key={idx}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Back Actions */}
          <div className="rx-flip-card__back-actions">
            <a
              href={event.registerUrl}
              className="rx-btn-register"
              onClick={(e) => e.stopPropagation()}
            >
              <span>{actionLabel}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RxUpcomingEvents() {
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="rx-events-section" id="upcoming-events" aria-labelledby="rxEventsTitle">
      <div className="container ed-container">
        {/* Main Section Header */}
        <div className="rx-events__header">
          <span className="rx-events__badge">LIVE WEBINARS &amp; EXAM EVALUATIONS</span>
          <h2 className="rx-events__title" id="rxEventsTitle">
            Upcoming <span>Events</span>
          </h2>
          <p className="rx-events__subtitle">
            Explore live webinars and diagnostic evaluations segregated by Rx Live interactive sessions and Rx Exam performance mock evaluations.
          </p>
        </div>

        {/* Segregated Layout Architecture with Dotted Divider */}
        <div className="rx-events-columns-wrapper">
          {/* GROUP 1: RX LIVE (Cards 1 & 2) */}
          <div className="rx-events-group rx-events-group--live">
            {/* Architectural Group Banner */}
            <div className="rx-group-banner rx-group-banner--live">
              <div className="rx-group-banner__bar" />
              <div className="rx-group-banner__main">
                <div className="rx-group-banner__identity">
                  <div className="rx-group-banner__icon rx-group-banner__icon--live" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                  </div>
                  <div className="rx-group-banner__titles">
                    <div className="rx-group-banner__tag rx-group-banner__tag--live">
                      <span className="rx-group-banner__beacon rx-group-banner__beacon--live" />
                      LIVE SESSIONS
                    </div>
                    <h3 className="rx-group-banner__title">Rx Live</h3>
                  </div>
                </div>
                <div className="rx-group-banner__chip rx-group-banner__chip--live">
                  <span className="rx-group-banner__chip-dot rx-group-banner__chip-dot--live" />
                  <span>2 Live Webinars</span>
                </div>
              </div>
              <div className="rx-group-banner__footer">
                <p className="rx-group-banner__desc">
                  Expert-Led Webinars &amp; Interactive Masterclasses
                </p>
              </div>
            </div>

            {/* 2 Cards Side-by-Side */}
            <div className="rx-events-group__grid">
              {RX_LIVE_EVENTS.map((event) => (
                <FlipCard
                  key={event.id}
                  event={event}
                  isFlipped={!!flippedCards[event.id]}
                  onToggle={() => toggleFlip(event.id)}
                />
              ))}
            </div>
          </div>

          {/* DOTTED SEGREGATION DIVIDER */}
          <div className="rx-events-segregation-divider" aria-hidden="true">
            <div className="rx-events-segregation-divider__line" />
            <div className="rx-events-segregation-divider__badge">
              <span>✦</span>
            </div>
          </div>

          {/* GROUP 2: RX EXAM (Cards 3 & 4) */}
          <div className="rx-events-group rx-events-group--exam">
            {/* Architectural Group Banner */}
            <div className="rx-group-banner rx-group-banner--exam">
              <div className="rx-group-banner__bar" />
              <div className="rx-group-banner__main">
                <div className="rx-group-banner__identity">
                  <div className="rx-group-banner__icon rx-group-banner__icon--exam" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <div className="rx-group-banner__titles">
                    <div className="rx-group-banner__tag rx-group-banner__tag--exam">
                      <span className="rx-group-banner__beacon rx-group-banner__beacon--exam" />
                      DIAGNOSTIC BENCHMARKS
                    </div>
                    <h3 className="rx-group-banner__title">Rx Exam</h3>
                  </div>
                </div>
                <div className="rx-group-banner__chip rx-group-banner__chip--exam">
                  <span className="rx-group-banner__chip-dot rx-group-banner__chip-dot--exam" />
                  <span>2 Mock Benchmarks</span>
                </div>
              </div>
              <div className="rx-group-banner__footer">
                <p className="rx-group-banner__desc">
                  Simulated Mock Evaluations &amp; Retention Analytics
                </p>
              </div>
            </div>

            {/* 2 Cards Side-by-Side */}
            <div className="rx-events-group__grid">
              {RX_EXAM_EVENTS.map((event) => (
                <FlipCard
                  key={event.id}
                  event={event}
                  isFlipped={!!flippedCards[event.id]}
                  onToggle={() => toggleFlip(event.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
