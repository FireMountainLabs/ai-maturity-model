import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

// Example data: { name: 'Root', children: [{ name: 'Child1' }, { name: 'Child2' }] }
export default function D3Tree({ data, width = 320, height = 220 }) {
  const ref = useRef();

  useEffect(() => {
    // Clear previous SVG
    d3.select(ref.current).selectAll('*').remove();

    // Set up SVG
    const svg = d3
      .select(ref.current)
      .attr('width', width)
      .attr('height', height);

    // Create a D3 hierarchy
    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([width - 60, height - 80]);
    treeLayout(root);

    // Draw links (orthogonal)
    svg
      .selectAll('path.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d =>
        `M${d.source.x + 30},${d.source.y + 40}V${d.target.y + 25}H${d.target.x + 30}`
      )
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrow)');

    // Arrow marker
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 7)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', '#333');

    // Draw nodes (rounded, shadow, accessible)
    svg
      .selectAll('rect.node')
      .data(root.descendants())
      .enter()
      .append('rect')
      .attr('class', 'node')
      .attr('x', d => d.x + 10)
      .attr('y', d => d.y + 20)
      .attr('width', 40)
      .attr('height', 40)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('fill', d => (d.depth === 0 ? '#FFD600' : '#3b5cff'))
      .attr('stroke', '#23244a')
      .attr('stroke-width', 2)
      .attr('tabindex', 0)
      .attr('aria-label', d => d.data.name)
      .attr('role', 'treeitem')
      .style('filter', 'drop-shadow(0 2px 8px #23244a44)');

    // Draw labels (with background for contrast)
    svg
      .selectAll('g.label-group')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'label-group')
      .attr('transform', d => `translate(${d.x + 30},${d.y + 70})`)
      .each(function (d) {
        const g = d3.select(this);
        const text = d.data.name;
        g.append('rect')
          .attr('x', -55)
          .attr('y', -22)
          .attr('width', 110)
          .attr('height', 28)
          .attr('rx', 7)
          .attr('fill', 'rgba(24,32,43,0.92)');
        g.append('text')
          .attr('class', 'label')
          .attr('x', 0)
          .attr('y', 0)
          .attr('text-anchor', 'middle')
          .attr('font-size', 16)
          .attr('font-weight', 700)
          .attr('fill', '#fff')
          .attr('style', 'pointer-events: none;')
          .text(text);
      });
  }, [data, width, height]);

  return (
    <svg
      ref={ref}
      style={{ display: 'block', margin: '0 auto' }}
      role="img"
      aria-label="Skill tree graph"
      tabIndex={0}
    ></svg>
  );
} 