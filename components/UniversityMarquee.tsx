
import React from 'react';

const universities = [
  'Stanford University',
  'MIT',
  'Harvard University',
  'UC Berkeley',
  'University of Oxford',
  'ETH Zurich',
  'Tsinghua University',
  'National University of Singapore',
  'Princeton University',
  'Yale University',
];

const UniversityMarquee: React.FC = () => {
  const allLogos = [...universities, ...universities]; // Duplicate for seamless loop

  return (
    <div className="w-full overflow-hidden py-8 bg-surface-light/50 dark:bg-surface/50 backdrop-blur-sm">
      <div className="relative w-full">
        <div className="flex animate-marquee whitespace-nowrap">
          {allLogos.map((name, index) => (
            <div key={index} className="mx-8 text-xl font-semibold text-text-secondary-light dark:text-text-secondary">
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniversityMarquee;
