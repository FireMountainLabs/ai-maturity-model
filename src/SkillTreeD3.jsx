import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

// Simple static data for DoubleLinePlacer style
const data = {
  name: 'root',
  children: [
    { name: 'A' },
    { name: 'B' },
    { name: 'C' },
    { name: 'D' },
  ],
};

const width = 320;
const height = 220;
const nodeSize = 36;
const nodeSpacing = 60;
const verticalSpacing = 70;

export default function SkillTreeD3() {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous

    // Root node position
    const rootX = width / 2;
    const rootY = 40;

    // Child node positions
    const childCount = data.children.length;
    const totalWidth = (childCount - 1) * nodeSpacing;
    const startX = rootX - totalWidth / 2;
    const childY = rootY + verticalSpacing;

    // Draw connectors (orthogonal)
    data.children.forEach((child, i) => {
      const childX = startX + i * nodeSpacing;
      // Horizontal from root to above child
      svg.append('line')
        .attr('x1', rootX)
        .attr('y1', rootY + nodeSize / 2)
        .attr('x2', childX)
        .attr('y2', rootY + nodeSize / 2)
        .attr('stroke', 'black')
        .attr('stroke-width', 3);
      // Vertical down to child
      svg.append('line')
        .attr('x1', childX)
        .attr('y1', rootY + nodeSize / 2)
        .attr('x2', childX)
        .attr('y2', childY - nodeSize / 2)
        .attr('stroke', 'black')
        .attr('stroke-width', 3)
        .attr('marker-end', 'url(#arrow)');
    });

    // Arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 5)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', 'black');

    // Draw root node (yellow)
    svg.append('rect')
      .attr('x', rootX - nodeSize / 2)
      .attr('y', rootY - nodeSize / 2)
      .attr('width', nodeSize)
      .attr('height', nodeSize)
      .attr('fill', 'yellow')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    // Draw child nodes (blue)
    data.children.forEach((child, i) => {
      const childX = startX + i * nodeSpacing;
      svg.append('rect')
        .attr('x', childX - nodeSize / 2)
        .attr('y', childY - nodeSize / 2)
        .attr('width', nodeSize)
        .attr('height', nodeSize)
        .attr('fill', 'blue')
        .attr('stroke', 'black')
        .attr('stroke-width', 2);
    });
  }, []);

  return (
    <svg ref={svgRef} width={width} height={height} style={{ display: 'block', margin: '0 auto', background: 'white' }} />
  );
} 