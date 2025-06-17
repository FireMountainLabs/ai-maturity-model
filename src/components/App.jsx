import React, { useState } from 'react';
import Hero from './Hero';
import PillarSidebar from './PillarSidebar';
import SkillFlow from './SkillFlow';
import Box from '@mui/material/Box';

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
    <Box sx={{ minHeight: '100vh', background: '#181d26' }}>
      <Hero />
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
      <Box component="main" sx={{ width: '100%', maxWidth: 1400, mx: 'auto', p: 4 }}>
        <SkillFlow parentSkill={parentSkill} pillarDescription={pillarDescription} />
      </Box>
    </Box>
  );
};

export default App; 