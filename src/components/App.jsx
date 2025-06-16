import React, { useState } from 'react';
import Hero from './Hero';
import PillarLayout from './PillarLayout';
import PillarSidebar from './PillarSidebar';
import SkillFlow from './SkillFlow';

const App = ({ pillars, pillarDescriptions, glowClasses }) => {
  const [selectedPillar, setSelectedPillar] = useState(0);
  const [selectedParentSkill, setSelectedParentSkill] = useState(null);

  // Get the selected parent skill object
  const parentSkill =
    selectedPillar !== null && selectedParentSkill !== null
      ? pillars[selectedPillar].skills[selectedParentSkill]
      : null;

  // Get the selected pillar description if a pillar is selected
  const pillarDescription =
    selectedPillar !== null && selectedParentSkill === null
      ? pillarDescriptions[selectedPillar]
      : null;

  return (
    <>
      <Hero />
      <div className="main-flex-layout">
        <PillarSidebar
          pillars={pillars}
          selectedPillar={selectedPillar}
          onSelectPillar={idx => {
            setSelectedPillar(idx);
            setSelectedParentSkill(null); // Reset parent skill when pillar changes
          }}
          selectedParentSkill={selectedParentSkill}
          onSelectParentSkill={setSelectedParentSkill}
        />
        <main className="container">
          <SkillFlow parentSkill={parentSkill} pillarDescription={pillarDescription} />
        </main>
      </div>
    </>
  );
};

export default App; 