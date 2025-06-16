import { pillar1Collection } from './data/pillar_1.js';
import { pillar2Collection } from './data/pillar_2.js';
import { pillar3Collection } from './data/pillar_3.js';
import { pillar4Collection } from './data/pillar_4.js';
import { pillar5Collection } from './data/pillar_5.js';
import { pillar6Collection } from './data/pillar_6.js';
import cytoscape from 'cytoscape';

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

// After DOM is ready, render Cytoscape mini-trees for each area
window.addEventListener('DOMContentLoaded', () => {
  const panelRow = document.getElementById('pillars-panel-row');
  panelRow.innerHTML = pillars
    .map((pillar, idx) => {
      const cyId = `cy-pillar${idx}-area0`;
      return `
        <div class="pillar-row" style="display: flex; flex-direction: row; align-items: flex-start; gap: 2.5rem; width: 100%; margin-bottom: 2rem;">
          <div class="pillar-description-card">
            <div class="pillar-description-title" style="font-size: 1.15rem; font-weight: 800; color: #fff; margin-bottom: 0.7rem;">${pillar.name}</div>
            <div class="pillar-description-text" style="font-size: 1rem; color: #e0e0e0;">${pillarDescriptions[idx]}</div>
          </div>
          <div id="${cyId}" class="cy-area-tree" style="width: 320px; height: 220px;"></div>
        </div>
      `;
    })
    .join('');

  // After rendering, initialize Cytoscape for each pillar's first area
  pillars.forEach((pillar, pillarIdx) => {
    const accent = pillarAccentColors[pillarIdx];
    const area = pillar.areas[0];
    if (!area) return;
    const cyId = `cy-pillar${pillarIdx}-area0`;
    const cyElem = document.getElementById(cyId);
    if (!cyElem) return;
    // Build Cytoscape elements: parent node and children
    const nodes = [
      { data: { id: 'area', label: area.name }, classes: 'area-node' },
      ...area.skills.map((skill, i) => ({
        data: { id: `skill${i}`, label: skill.name }, classes: 'skill-node'
      }))
    ];
    const edges = area.skills.map((_, i) => ({
      data: { source: 'area', target: `skill${i}` }, classes: 'area-edge'
    }));
    const cy = cytoscape({
      container: cyElem,
      elements: [...nodes, ...edges],
      layout: {
        name: 'breadthfirst',
        directed: true,
        spacingFactor: 1.3,
        avoidOverlap: true,
        nodeDimensionsIncludeLabels: true,
        roots: ['area'],
        animate: false,
        direction: 'TB'
      },
      style: [
        {
          selector: 'node',
          style: {
            'shape': 'roundrectangle',
            'background-color': '#232834ee',
            'color': '#fff',
            'font-family': 'Inter, system-ui, sans-serif',
            'font-size': 18,
            'font-weight': '700',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': 180,
            'padding': '12px 10px',
            'width': 'auto',
            'height': 'auto',
            'min-width': 120,
            'min-height': 60,
            'border-width': 2,
            'border-color': '#003452cc',
            'border-opacity': 0.7,
            'z-index': 10,
            'label': 'data(label)'
          }
        },
        {
          selector: 'node.area-node',
          style: {
            'background-color': accent,
            'color': '#fff',
            'font-size': 22,
            'font-weight': 'bold',
            'border-width': 6,
            'border-color': accent,
            'border-opacity': 0.35
          }
        },
        {
          selector: 'node.hover',
          style: {
            'background-color': '#3a3f4a',
            'border-width': 6,
            'border-color': accent,
            'border-opacity': 0.7
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 6,
            'line-color': accent,
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': accent,
            'arrow-scale': 1.2,
            'opacity': 0.9,
            'control-point-step-size': 80,
            'z-index': 1
          }
        }
      ],
      userZoomingEnabled: false,
      userPanningEnabled: false,
      boxSelectionEnabled: false,
      autoungrabify: true
    });
    cy.on('mouseover', 'node', function(evt){
      cy.$('node').removeClass('hover');
      evt.target.addClass('hover');
    });
    cy.on('mouseout', 'node', function(evt){
      evt.target.removeClass('hover');
    });
  });
}); 