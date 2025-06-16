import React, { useState } from 'react';
import D3Tree from './D3Tree.jsx';
import './style.css';

export default function PillarTreeTabs({ pillar, width = 340, height = 240 }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const areas = pillar.areas || [];
  const selectedArea = areas[selectedIdx];

  // Prepare tree data for D3Tree
  const treeData = selectedArea
    ? {
        name: selectedArea.name,
        children: (selectedArea.skills || []).map(skill => ({ name: skill.name }))
      }
    : null;

  return (
    <div className="pillar-tree-card">
      <div className="pillar-tree-tabs" role="tablist" aria-label="Areas">
        {areas.map((area, idx) => (
          <button
            key={area.name}
            role="tab"
            aria-selected={selectedIdx === idx}
            aria-current={selectedIdx === idx ? 'page' : undefined}
            aria-controls={`tree-panel-${pillar.name}-${idx}`}
            id={`tree-tab-${pillar.name}-${idx}`}
            tabIndex={selectedIdx === idx ? 0 : -1}
            className={
              'pillar-tree-tab' + (selectedIdx === idx ? ' pillar-tree-tab--active' : '')
            }
            onClick={() => setSelectedIdx(idx)}
            onKeyDown={e => {
              if (e.key === 'ArrowRight') setSelectedIdx((selectedIdx + 1) % areas.length);
              if (e.key === 'ArrowLeft') setSelectedIdx((selectedIdx - 1 + areas.length) % areas.length);
            }}
          >
            {area.name}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`tree-panel-${pillar.name}-${selectedIdx}`}
        aria-labelledby={`tree-tab-${pillar.name}-${selectedIdx}`}
        className="pillar-tree-panel"
        style={{ minHeight: height }}
      >
        {treeData && <D3Tree data={treeData} width={width} height={height} key={selectedIdx} />}
      </div>
    </div>
  );
} 