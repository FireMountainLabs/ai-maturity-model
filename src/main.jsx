import React from 'react';
import { createRoot } from 'react-dom/client';
import { pillar1Collection } from './data/pillar_1.js';
import { pillar2Collection } from './data/pillar_2.js';
import { pillar3Collection } from './data/pillar_3.js';
import { pillar4Collection } from './data/pillar_4.js';
import { pillar5Collection } from './data/pillar_5.js';
import { pillar6Collection } from './data/pillar_6.js';
// import cytoscape from 'cytoscape';
import App from './components/App';
import './style.css';

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

const glowClasses = [
  'glow-orange', // Ethical, Equitable, and Responsible Use
  'glow-blue',   // Strategy & Resources
  'glow-green',  // Organization
  'glow-purple', // Technology Enablers
  'glow-yellow', // Data
  'glow-red'     // Performance & Application
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

function createPhaseColumns(phaseMap, glowClass) {
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
                      <div class="pillar-skill-card ${glowClass}">
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

function getAllSkills(areas) {
  // Flatten all skills (and subskills) in order
  const skills = [];
  areas.forEach(area => {
    area.skills.forEach(skill => {
      skills.push({
        name: skill.name,
        description: skill.description?.text || '',
        area: area.name
      });
      if (skill.skills) {
        skill.skills.forEach(subskill => {
          skills.push({
            name: subskill.name,
            description: subskill.description?.text || '',
            area: area.name
          });
        });
      }
    });
  });
  return skills;
}

// Add pillar descriptions
const pillarDescriptions = [
  'Ensure AI systems operate transparently, minimize bias, and align with legal and societal expectations.',
  'Establish clear AI goals, secure leadership commitment, and allocate funding and skilled teams to sustain adoption.',
  'Develop the structures, roles, and workflows needed for effective AI oversight and cross-functional collaboration.',
  'Implement the right tools, platforms, and engineering practices to support secure, scalable AI development and deployment.',
  'Govern data quality, accessibility, and protection to fuel AI solutions while safeguarding privacy and compliance.',
  'Integrate AI into operations to deliver measurable business value, monitor outcomes, and continuously improve models.'
];

// Helper: get pillar accent color for Cytoscape
const pillarAccentColors = [
  '#CB6929', // orange
  '#003452', // blue
  '#56876D', // green
  '#7c3aed', // purple
  '#FFD600', // yellow
  '#74121D'  // red
];

// Render the React app
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App
      pillars={pillars}
      pillarDescriptions={pillarDescriptions}
      glowClasses={glowClasses}
    />
  </React.StrictMode>
); 