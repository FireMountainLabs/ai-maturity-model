import React from 'react';

const SkillFlow = ({ parentSkill, pillarDescription }) => {
  if (!parentSkill && pillarDescription) {
    return (
      <div className="skill-flow-empty">{pillarDescription}</div>
    );
  }
  if (!parentSkill) return <div className="skill-flow-empty">Select a parent skill to view details.</div>;

  // Assume levels are in parentSkill.skills (subskills)
  const levels = parentSkill.skills || [];

  return (
    <div className="skill-flow">
      <div className="skill-flow-header">
        <h2>{parentSkill.name}</h2>
        {parentSkill.description && <p>{parentSkill.description.text}</p>}
      </div>
      <div className="skill-flow-levels">
        {levels.map((level, idx) => (
          <div className="skill-level" key={level.name}>
            <div className="skill-level-title">LVL{idx + 1}</div>
            <div className="skill-level-name">{level.name}</div>
            {level.description && <div className="skill-level-desc">{level.description.text}</div>}
            {idx < levels.length - 1 && <div className="skill-level-connector">→</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillFlow; 