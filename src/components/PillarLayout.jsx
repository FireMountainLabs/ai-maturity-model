import React from 'react';
import PillarTreeTabs from '../PillarTreeTabs';

const PillarLayout = ({ pillar, description, glowClass }) => {
  return (
    <div className="pillar-layout">
      <div className="pillar-layout-left">
        <div className="pillar-description-card">
          <div className="pillar-description-title" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '0.7rem' }}>
            {pillar.name}
          </div>
          <div className="pillar-description-text" style={{ fontSize: '1rem', color: '#e0e0e0' }}>
            {description}
          </div>
        </div>
      </div>
      <div className="pillar-layout-right">
        <div className="pillar-tree-tabs-canvas" style={{ width: '360px', minHeight: '260px' }}>
          <PillarTreeTabs pillar={pillar} />
        </div>
      </div>
    </div>
  );
};

export default PillarLayout; 