import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Person } from '@mui/icons-material';

const circleSize = 64;
const connectorLength = 40;

const cardModules = import.meta.glob('../data/cards/*.json', { eager: true });

const allCards = Object.values(cardModules)
  .flatMap(module => Array.isArray(module.default) ? module.default : []);

// Build timeline with level nodes interleaved
const timelineArray = [
  { type: 'level', level: 1 },
  ...allCards.filter(card => card.level === 1).map(card => ({ ...card, type: 'card' })),
  { type: 'level', level: 2 },
  ...allCards.filter(card => card.level === 2).map(card => ({ ...card, type: 'card' })),
  { type: 'level', level: 3 },
  ...allCards.filter(card => card.level === 3).map(card => ({ ...card, type: 'card' })),
  { type: 'level', level: 4 },
  { type: 'level', level: 5 }
];

const SkillFlow = () => (
  <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', mt: 6, mb: 6, position: 'relative' }}>
    <Typography variant="h6" color="#fff" sx={{ mb: 4, textAlign: 'center' }}>
      Integrate AI into operations to deliver measurable business value, monitor outcomes, and continuously improve models.
    </Typography>
    <Box sx={{ position: 'relative', minHeight: 600, py: 6 }}>
      {/* Central vertical line */}
      <Box sx={{
        position: 'absolute',
        left: '50%',
        top: 0,
        bottom: 0,
        width: 6,
        bgcolor: '#3a4252',
        transform: 'translateX(-50%)',
        zIndex: 0,
        borderRadius: 3,
      }} />
      {timelineArray.map((item, idx) => {
        if (item.type === 'level') {
          // Render level node
          return (
            <Box
              key={`level-${item.level}`}
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                my: 6,
                position: 'relative',
                zIndex: 2,
              }}
            >
              <Box sx={{
                width: 100,
                height: 100,
                bgcolor: '#232a36',
                border: '6px solid #FFD600',
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 6,
              }}>
                <Typography variant="h6" fontWeight={900} sx={{ color: '#FFD600', fontSize: 28, textAlign: 'center' }}>
                  {`Level ${item.level}`}
                </Typography>
              </Box>
            </Box>
          );
        } else {
          // Card rendering
          const isLeft = idx % 2 === 0;
          const imageLinks = (item.links && Array.isArray(item.links)) ? item.links.filter(link => link.url) : [];
          const isMultiImageOnly = imageLinks.length > 1 && !item.title && !item.description;
          const isImageOnly = imageLinks.length === 1 && !item.title && !item.description;
          if (item.invisibility) {
            // Invisible card: just render the icons, no card background/border
            return (
              <Box
                key={item.id || idx}
                sx={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  flexDirection: isLeft ? 'row' : 'row-reverse',
                  alignItems: 'center',
                  mb: 10,
                  zIndex: 1,
                  minHeight: 60,
                }}
              >
                <Box sx={{
                  width: '45%',
                  display: 'flex',
                  justifyContent: isLeft ? 'flex-end' : 'flex-start',
                  alignItems: 'center',
                }}>
                  {imageLinks.length > 1 ? (
                    <Box sx={{
                      width: 320,
                      height: 320,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gridTemplateRows: 'repeat(2, 1fr)',
                      gap: '24px',
                    }}>
                      {imageLinks.slice(0, 4).map((link, i) => (
                        <img key={i} src={link.url} alt={`icon-${i}`} style={{ width: 140, height: 140, borderRadius: '16px', objectFit: 'contain', background: 'none', boxShadow: 'none', filter: 'none' }} />
                      ))}
                    </Box>
                  ) : (
                    <img src={imageLinks[0].url} alt="icon" style={{ width: 120, height: 120, borderRadius: '12px', objectFit: 'contain', filter: 'drop-shadow(0 0 16px #ffd60088)' }} />
                  )}
                </Box>
                {/* Connector and Dot - T-junction style */}
                <Box sx={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 0, pointerEvents: 'none', zIndex: 2 }}>
                  {/* Horizontal dashed line, ends at center */}
                  {isLeft ? (
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '45%',
                      width: '5%',
                      height: 0,
                      borderTop: `2px dashed ${item.color_code || '#FFD600'}`,
                      zIndex: 2,
                      transform: 'translateY(-50%)',
                    }} />
                  ) : (
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      right: '45%',
                      height: 0,
                      borderTop: `2px dashed ${item.color_code || '#FFD600'}`,
                      zIndex: 2,
                      transform: 'translateY(-50%)',
                    }} />
                  )}
                  {/* Dot at intersection, overlapping both lines */}
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 14,
                    height: 14,
                    bgcolor: '#181d26',
                    borderRadius: '50%',
                    border: `3px solid ${item.color_code || '#FFD600'}`,
                    zIndex: 3,
                    transform: 'translate(-50%, -50%)',
                  }} />
                </Box>
                <Box sx={{
                  width: '5%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  {/* Empty for spacing/alignment */}
                </Box>
              </Box>
            );
          } else if (isMultiImageOnly) {
            // Multi-image card: render as a 2x2 grid in the card slot, with normal connector logic
            return (
              <Box
                key={item.id || idx}
                sx={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  flexDirection: isLeft ? 'row' : 'row-reverse',
                  alignItems: 'center',
                  mb: 10,
                  zIndex: 1,
                  minHeight: 60,
                }}
              >
                <Box sx={{
                  width: '45%',
                  display: 'flex',
                  justifyContent: isLeft ? 'flex-end' : 'flex-start',
                  alignItems: 'center',
                }}>
                  <Box sx={{
                    width: 320,
                    height: 320,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gridTemplateRows: 'repeat(2, 1fr)',
                    gap: '24px',
                    background: '#232a36',
                    borderRadius: 4,
                    boxShadow: 6,
                    border: `2px solid ${item.color_code || '#FFD600'}`,
                    px: 3,
                    py: 2,
                  }}>
                    {imageLinks.slice(0, 4).map((link, i) => (
                      <img key={i} src={link.url} alt={`icon-${i}`} style={{ width: 140, height: 140, borderRadius: '16px', objectFit: 'contain', background: 'none', boxShadow: 'none', filter: 'none' }} />
                    ))}
                  </Box>
                </Box>
                {/* Connector and Dot - T-junction style */}
                <Box sx={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 0, pointerEvents: 'none', zIndex: 2 }}>
                  {/* Horizontal dashed line, ends at center */}
                  {isLeft ? (
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '45%',
                      width: '5%',
                      height: 0,
                      borderTop: `2px dashed ${item.color_code || '#FFD600'}`,
                      zIndex: 2,
                      transform: 'translateY(-50%)',
                    }} />
                  ) : (
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      right: '45%',
                      height: 0,
                      borderTop: `2px dashed ${item.color_code || '#FFD600'}`,
                      zIndex: 2,
                      transform: 'translateY(-50%)',
                    }} />
                  )}
                  {/* Dot at intersection, overlapping both lines */}
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 14,
                    height: 14,
                    bgcolor: '#181d26',
                    borderRadius: '50%',
                    border: `3px solid ${item.color_code || '#FFD600'}`,
                    zIndex: 3,
                    transform: 'translate(-50%, -50%)',
                  }} />
                </Box>
                <Box sx={{
                  width: '5%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  {/* Empty for spacing/alignment */}
                </Box>
              </Box>
            );
          } else if (isImageOnly) {
            // Singleton image-only card: render in card slot, with normal connector logic
            return (
              <Box
                key={item.id || idx}
                sx={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  flexDirection: isLeft ? 'row' : 'row-reverse',
                  alignItems: 'center',
                  mb: 10,
                  zIndex: 1,
                  minHeight: 60,
                }}
              >
                <Box sx={{
                  width: '45%',
                  display: 'flex',
                  justifyContent: isLeft ? 'flex-end' : 'flex-start',
                  alignItems: 'center',
                }}>
                  <Box sx={{
                    width: 140,
                    height: 140,
                    background: '#232a36',
                    borderRadius: 4,
                    boxShadow: 6,
                    border: `2px solid ${item.color_code || '#FFD600'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <img src={imageLinks[0].url} alt="icon" style={{ width: 120, height: 120, borderRadius: '12px', objectFit: 'contain', filter: 'drop-shadow(0 0 16px #ffd60088)' }} />
                  </Box>
                </Box>
                {/* Connector and Dot - T-junction style */}
                <Box sx={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 0, pointerEvents: 'none', zIndex: 2 }}>
                  {/* Horizontal dashed line, ends at center */}
                  {isLeft ? (
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '45%',
                      width: '5%',
                      height: 0,
                      borderTop: `2px dashed ${item.color_code || '#FFD600'}`,
                      zIndex: 2,
                      transform: 'translateY(-50%)',
                    }} />
                  ) : (
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      right: '45%',
                      height: 0,
                      borderTop: `2px dashed ${item.color_code || '#FFD600'}`,
                      zIndex: 2,
                      transform: 'translateY(-50%)',
                    }} />
                  )}
                  {/* Dot at intersection, overlapping both lines */}
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 14,
                    height: 14,
                    bgcolor: '#181d26',
                    borderRadius: '50%',
                    border: `3px solid ${item.color_code || '#FFD600'}`,
                    zIndex: 3,
                    transform: 'translate(-50%, -50%)',
                  }} />
                </Box>
                <Box sx={{
                  width: '5%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  {/* Empty for spacing/alignment */}
                </Box>
              </Box>
            );
          } else {
            // Default card rendering (original logic)
            let imageUrl = null;
            if (item.links && Array.isArray(item.links)) {
              const customImg = item.links.find(link => link.text && link.text.toLowerCase().includes('custom png'));
              if (customImg) imageUrl = customImg.url;
            }
            return (
              <Box
                key={item.id || idx}
                sx={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  flexDirection: isLeft ? 'row' : 'row-reverse',
                  alignItems: 'center',
                  mb: 10,
                  zIndex: 1,
                  minHeight: 60,
                }}
              >
                <Box sx={{
                  width: '45%',
                  display: 'flex',
                  justifyContent: isLeft ? 'flex-end' : 'flex-start',
                  alignItems: 'center',
                }}>
                  <Card sx={{
                    minWidth: 320,
                    maxWidth: 420,
                    background: '#232a36',
                    color: '#fff',
                    boxShadow: 6,
                    borderRadius: 4,
                    px: 3,
                    py: 2,
                    border: `2px solid ${item.color_code || '#FFD600'}`,
                  }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
                      {imageUrl && (
                        <img src={imageUrl} alt={item.title || 'placeholder'} style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: 16 }} />
                      )}
                      <Typography variant="h5" fontWeight={700} align="center">
                        {item.title || 'Title'}
                      </Typography>
                      {item.description && (
                        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                          {item.description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Box>
                {/* Connector and Dot - T-junction style */}
                <Box sx={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 0, pointerEvents: 'none', zIndex: 2 }}>
                  {/* Horizontal dashed line, ends at center */}
                  {isLeft ? (
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '45%',
                      width: '5%',
                      height: 0,
                      borderTop: `2px dashed ${item.color_code || '#FFD600'}`,
                      zIndex: 2,
                      transform: 'translateY(-50%)',
                    }} />
                  ) : (
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      right: '45%',
                      height: 0,
                      borderTop: `2px dashed ${item.color_code || '#FFD600'}`,
                      zIndex: 2,
                      transform: 'translateY(-50%)',
                    }} />
                  )}
                  {/* Dot at intersection, overlapping both lines */}
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 14,
                    height: 14,
                    bgcolor: '#181d26',
                    borderRadius: '50%',
                    border: `3px solid ${item.color_code || '#FFD600'}`,
                    zIndex: 3,
                    transform: 'translate(-50%, -50%)',
                  }} />
                </Box>
                <Box sx={{
                  width: '5%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  {/* Empty for spacing/alignment */}
                </Box>
              </Box>
            );
          }
        }
      })}
    </Box>
  </Box>
);

export default SkillFlow; 