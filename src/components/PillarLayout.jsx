import React from 'react';
import PillarTreeTabs from '../PillarTreeTabs';

const PillarLayout = ({ pillar, description, glowClass }) => {
  return (
    <div className="pillar-layout">
      <div className="pillar-layout-left">
        <div className="pillar-description-card">
          <div 
            className="pillar-description-title" 
            style={{ 
              fontSize: 'clamp(1rem, 4vw, 1.15rem)', 
              fontWeight: 800, 
              color: '#fff', 
              marginBottom: '0.7rem',
              lineHeight: 1.3
            }}
          >
            {pillar.name}
          </div>
          <div 
            className="pillar-description-text" 
            style={{ 
              fontSize: 'clamp(0.9rem, 3.5vw, 1rem)', 
              color: '#e0e0e0',
              lineHeight: 1.6
            }}
          >
            {description}
          </div>
        </div>
      </div>
      <div className="pillar-layout-right">
        <div 
          className="pillar-tree-tabs-canvas" 
          style={{ 
            width: '100%',
            maxWidth: '360px',
            minHeight: '260px',
            margin: '0 auto'
          }}
        >
          <PillarTreeTabs pillar={pillar} />
        </div>
      </div>
    </div>
  );
};

export default PillarLayout; 