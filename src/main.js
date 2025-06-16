import { pillar1Collection } from './data/pillar_1.js';
import { pillar2Collection } from './data/pillar_2.js';
import { pillar3Collection } from './data/pillar_3.js';
import { pillar4Collection } from './data/pillar_4.js';
import { pillar5Collection } from './data/pillar_5.js';
import { pillar6Collection } from './data/pillar_6.js';

const pillars = [
  pillar1Collection,
  pillar2Collection,
  pillar3Collection,
  pillar4Collection,
  pillar5Collection,
  pillar6Collection
];

const phases = [
  'Initial',
  'Engaged',
  'Defined',
  'Managed',
  'Optimized'
];

// Sample mapping: assign skills to phases in round-robin for demonstration
function mapSkillsToPhases(areas) {
  const phaseMap = phases.reduce((acc, phase) => {
    acc[phase] = [];
    return acc;
  }, {});
  let phaseIdx = 0;
  areas.forEach(area => {
    area.skills.forEach(skill => {
      phaseMap[phases[phaseIdx % phases.length]].push({
        name: skill.name,
        description: skill.description?.text || '',
        area: area.name
      });
      // Nested skills
      if (skill.skills) {
        skill.skills.forEach(subskill => {
          phaseMap[phases[phaseIdx % phases.length]].push({
            name: subskill.name,
            description: subskill.description?.text || '',
            area: area.name
          });
        });
      }
      phaseIdx++;
    });
  });
  return phaseMap;
}

function createPhaseColumns(phaseMap) {
  return `
    <div class="pillar-phase-row">
      ${phases
        .map(
          phase => `
            <div class="pillar-phase-col">
              <div class="pillar-phase-label">${phase}</div>
              <div class="pillar-phase-cards">
                ${phaseMap[phase]
                  .map(
                    skill => `
                      <div class="pillar-skill-card">
                        <div class="pillar-skill-title">${skill.name}</div>
                        <div class="pillar-skill-area">${skill.area}</div>
                        <div class="pillar-skill-desc">${skill.description}</div>
                      </div>
                    `
                  )
                  .join('')}
              </div>
            </div>
          `
        )
        .join('')}
    </div>
  `;
}

const panelRow = document.getElementById('pillars-panel-row');
panelRow.innerHTML = pillars
  .map(
    pillar => `
      <div class="pillar-skilltree-card">
        <div class="pillar-card-header">${pillar.name}</div>
        ${createPhaseColumns(mapSkillsToPhases(pillar.areas))}
      </div>
    `
  )
  .join(''); 