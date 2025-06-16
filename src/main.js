import cytoscape from 'cytoscape';
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

const elements = [];

pillars.forEach((pillar, i) => {
  const pillarId = `pillar-${i}`;
  elements.push({
    data: { id: pillarId, label: pillar.name },
    classes: 'pillar'
  });
  pillar.areas.forEach((area, j) => {
    const areaId = `pillar-${i}-area-${j}`;
    elements.push({
      data: { id: areaId, label: area.name },
      classes: 'area'
    });
    elements.push({ data: { source: pillarId, target: areaId } });
    area.skills.forEach((skill, k) => {
      const skillId = `pillar-${i}-area-${j}-skill-${k}`;
      elements.push({
        data: { id: skillId, label: skill.name },
        classes: 'skill'
      });
      elements.push({ data: { source: areaId, target: skillId } });
      // Nested skills
      if (skill.skills) {
        skill.skills.forEach((subskill, l) => {
          const subskillId = `pillar-${i}-area-${j}-skill-${k}-subskill-${l}`;
          elements.push({
            data: { id: subskillId, label: subskill.name },
            classes: 'subskill'
          });
          elements.push({ data: { source: skillId, target: subskillId } });
        });
      }
    });
  });
});

cytoscape({
  container: document.getElementById('cy'),
  elements,
  style: [
    {
      selector: 'node.pillar',
      style: {
        'background-color': '#1976d2',
        'label': 'data(label)',
        'color': '#fff',
        'font-size': '18px',
        'text-valign': 'center',
        'text-halign': 'center',
        'width': 60,
        'height': 60
      }
    },
    {
      selector: 'node.area',
      style: {
        'background-color': '#388e3c',
        'label': 'data(label)',
        'color': '#fff',
        'font-size': '16px',
        'text-valign': 'center',
        'text-halign': 'center',
        'width': 50,
        'height': 50
      }
    },
    {
      selector: 'node.skill',
      style: {
        'background-color': '#90caf9',
        'label': 'data(label)',
        'color': '#333',
        'font-size': '14px',
        'text-valign': 'center',
        'text-halign': 'center',
        'width': 40,
        'height': 40
      }
    },
    {
      selector: 'node.subskill',
      style: {
        'background-color': '#fff59d',
        'label': 'data(label)',
        'color': '#333',
        'font-size': '12px',
        'text-valign': 'center',
        'text-halign': 'center',
        'width': 30,
        'height': 30
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#bdbdbd',
        'target-arrow-color': '#bdbdbd',
        'target-arrow-shape': 'triangle'
      }
    }
  ],
  layout: {
    name: 'breadthfirst',
    directed: true,
    padding: 10
  }
}); 