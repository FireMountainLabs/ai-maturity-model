import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <svg className="hero-bg-svg" viewBox="0 0 1440 480" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 400 Q720 100 1440 400" stroke="#fff" strokeOpacity="0.07" strokeWidth="4" fill="none"/>
        <path d="M0 440 Q720 180 1440 440" stroke="#fff" strokeOpacity="0.04" strokeWidth="4" fill="none"/>
      </svg>
      <img src="/ai-maturity-model/fml.png" alt="Fire Mountain Labs Logo" class="hero-logo" />
      <h1 className="hero-title">AI Maturity Model</h1>
      <p className="hero-subtitle">
        Discover your organization's strengths and opportunities in AI adoption, governance, and risk. 
        Take our quick assessment to get a personalized AI maturity roadmap.
      </p>
      <div className="hero-actions">
        <a href="https://aimaturityquiz.firemountainlabs.com" className="hero-btn primary" target="_blank" rel="noopener noreferrer">
          Take the AI Maturity Quiz
        </a>
        <a href="https://aimaturitymodel.mitre.org" className="hero-btn secondary" target="_blank" rel="noopener noreferrer">
          MITRE AI Maturity Model
        </a>
      </div>
    </section>
  );
};

export default Hero; 