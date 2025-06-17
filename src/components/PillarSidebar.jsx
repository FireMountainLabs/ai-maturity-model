import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const PillarSidebar = ({ pillars, selectedPillar, onSelectPillar, selectedParentSkill, onSelectParentSkill }) => {
  const hasParentSkills =
    selectedPillar !== null &&
    pillars[selectedPillar] &&
    Array.isArray(pillars[selectedPillar].skills);

  // Pillar color mapping based on the provided image
  const pillarColors = [
    '#8BC34A', // Ethical, Equitable, and Responsible Use
    '#E6A15A', // Strategy & Resources
    '#5AC0E6', // Organization
    '#B085E6', // Technology Enablers
    '#F3E37C', // Data
    '#E68A8A', // Performance & Application
  ];

  return (
    <Box sx={{ width: '100%', background: '#232a36', px: 4, pt: 2, pb: hasParentSkills ? 0 : 2, borderBottom: '2px solid #1e2533' }}>
      <Typography variant="h6" fontWeight={700} color="#fff" sx={{ mb: 1, textAlign: 'center' }}>
        AI Maturity Pillars
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Tabs
          value={selectedPillar}
          onChange={(_, idx) => onSelectPillar(idx)}
          variant="scrollable"
          scrollButtons="auto"
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            '.MuiTab-root': {
              color: '#fff',
              fontWeight: 600,
              fontSize: '1rem',
              minWidth: 120,
              mx: 1,
              // Color each tab according to pillar color
              '& span': {
                display: 'inline-block',
                width: '100%',
              },
            },
            '.Mui-selected': {
              color: pillarColors[selectedPillar],
            },
          }}
        >
          {pillars.map((pillar, idx) => (
            <Tab
              key={pillar.name}
              label={<span style={{ color: selectedPillar === idx ? pillarColors[idx] : pillarColors[idx], opacity: selectedPillar === idx ? 1 : 0.7 }}>{pillar.name}</span>}
            />
          ))}
        </Tabs>
      </Box>
      {hasParentSkills && (
        <Box sx={{ mt: 1, pb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} color="#b0b8c1" sx={{ mb: 0.5, pl: 1 }}>
            Parent Skills
          </Typography>
          <Tabs
            value={selectedParentSkill}
            onChange={(_, idx) => onSelectParentSkill(idx)}
            variant="scrollable"
            scrollButtons="auto"
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              '.MuiTab-root': {
                color: '#fff',
                fontWeight: 500,
                fontSize: '0.95rem',
                minWidth: 120,
                mx: 1,
              },
              '.Mui-selected': {
                color: '#ffb366',
              },
            }}
          >
            {pillars[selectedPillar].skills.map((skill, idx) => (
              <Tab key={skill.name} label={skill.name} />
            ))}
          </Tabs>
        </Box>
      )}
    </Box>
  );
};

export default PillarSidebar; 