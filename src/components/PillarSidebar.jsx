import React from 'react';

const PillarSidebar = ({ pillars, selectedPillar, onSelectPillar, selectedParentSkill, onSelectParentSkill }) => {
  const hasParentSkills =
    selectedPillar !== null &&
    pillars[selectedPillar] &&
    Array.isArray(pillars[selectedPillar].skills);

  return (
    <aside className="pillar-sidebar">
      <h2>Pillars</h2>
      <ul className="pillar-list">
        {pillars.map((pillar, idx) => (
          <li
            key={pillar.name}
            className={selectedPillar === idx ? 'selected' : ''}
            onClick={() => onSelectPillar(idx)}
          >
            {pillar.name}
          </li>
        ))}
      </ul>
      {hasParentSkills && (
        <>
          <h3>Parent Skills</h3>
          <ul className="parent-skill-list">
            {pillars[selectedPillar].skills.map((skill, idx) => (
              <li
                key={skill.name}
                className={selectedParentSkill === idx ? 'selected' : ''}
                onClick={() => onSelectParentSkill(idx)}
              >
                {skill.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
};

export default PillarSidebar; 