import React from 'react';
import TechText from './TechText.jsx';

export default function RxHeroTechText({ className = '' }) {
  return (
    <h1 className={`rx-hero__title rx-hero__title--tech ${className}`.trim()}>
      <span className="rx-hero-tech-line rx-hero-tech-line--first">
        <TechText
          text="Learning Simplified."
          accentColor="#48a92a"
          color="#48a92a"
          fontSize={54}
          fontWeight={800}
          letterSpacing={0}
          align="left"
          reach={150}
          intro="metrics"
          introDuration={1.8}
          sweep
          specks={10}
          labels={false}
          guides
        />
      </span>
      <span className="rx-hero-tech-line rx-hero-tech-line--highlight">
        Futures Empowered.
      </span>
    </h1>
  );
}
