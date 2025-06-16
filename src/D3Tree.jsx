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
    const treeLayout = d3.tree().size([width - 40, height - 60]);
    treeLayout(root);

    // Draw links (orthogonal)
    svg
      .selectAll('path.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d =>
        `M${d.source.x + 20},${d.source.y + 30}V${d.target.y + 10}H${d.target.x + 20}`
      )
      .attr('fill', 'none')
      .attr('stroke', 'black')
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
      .attr('fill', 'black');

    // Draw nodes
    svg
      .selectAll('rect.node')
      .data(root.descendants())
      .enter()
      .append('rect')
      .attr('class', 'node')
      .attr('x', d => d.x + 5)
      .attr('y', d => d.y + 10)
      .attr('width', 30)
      .attr('height', 30)
      .attr('fill', d => (d.depth === 0 ? 'yellow' : 'blue'))
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    // Draw labels
    svg
      .selectAll('text.label')
      .data(root.descendants())
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => d.x + 20)
      .attr('y', d => d.y + 55)
      .attr('text-anchor', 'middle')
      .attr('font-size', 13)
      .attr('fill', '#222')
      .text(d => d.data.name);
  }, [data, width, height]);

  return <svg ref={ref} style={{ display: 'block', margin: '0 auto' }}></svg>;
} 