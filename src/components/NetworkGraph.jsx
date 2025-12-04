/**
 * NetworkGraph Component
 * Reusable D3.js Force-Directed Graph
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const NetworkGraph = ({ 
  nodes = [], 
  links = [], 
  width = 800, 
  height = 600,
  nodeRadius = 5,
  linkDistance = 50,
  chargeStrength = -300,
  directed = true,  // Whether to show arrows (directed graph)
  onNodeClick = null,
  getNodeColor = null,
  getNodeSize = null,
  getNodeLabel = null,
}) => {
  const svgRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    if (!nodes.length || !svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Add zoom behavior
    const g = svg.append('g');
    
    const zoom = d3.zoom()
      .scaleExtent([0.1, 10])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom);

    // Create arrow markers for directed graphs only
    if (directed) {
      svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 13)  // Reduced from 15 to make arrow closer to node
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 4)  // Reduced from 6
        .attr('markerHeight', 4)  // Reduced from 6
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#999')
        .style('stroke', 'none');
    }

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links)
        .id(d => d.id)
        .distance(linkDistance))
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => {
        return getNodeSize ? getNodeSize(d) + 2 : nodeRadius + 2;
      }));

    // Create links
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.weight || 1));
    
    // Add arrow markers only for directed graphs
    if (directed) {
      link.attr('marker-end', 'url(#arrowhead)');
    }

    // Create nodes
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => getNodeSize ? getNodeSize(d) : nodeRadius)
      .attr('fill', d => getNodeColor ? getNodeColor(d) : '#69b3a2')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .call(drag(simulation))
      .on('mouseover', function(event, d) {
        setHoveredNode(d);
        d3.select(this)
          .attr('stroke', '#ff6b6b')
          .attr('stroke-width', 3);
      })
      .on('mouseout', function() {
        setHoveredNode(null);
        d3.select(this)
          .attr('stroke', '#fff')
          .attr('stroke-width', 1.5);
      })
      .on('click', (event, d) => {
        if (onNodeClick) onNodeClick(d);
      });

    // Add labels (optional, for small networks)
    if (nodes.length < 50 && getNodeLabel) {
      g.append('g')
        .attr('class', 'labels')
        .selectAll('text')
        .data(nodes)
        .join('text')
        .text(d => getNodeLabel(d))
        .attr('font-size', 10)
        .attr('dx', 8)
        .attr('dy', 3)
        .style('pointer-events', 'none');
    }

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      if (nodes.length < 50 && getNodeLabel) {
        g.selectAll('.labels text')
          .attr('x', d => d.x)
          .attr('y', d => d.y);
      }
    });

    // Drag behavior
    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [nodes, links, width, height, nodeRadius, linkDistance, chargeStrength, directed, getNodeColor, getNodeSize, getNodeLabel, onNodeClick]);

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} style={{ border: '1px solid #ddd', borderRadius: '8px' }} />
      {hoveredNode && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '10px',
            borderRadius: '4px',
            maxWidth: '300px',
            pointerEvents: 'none',
            fontSize: '12px',
          }}
        >
          {getNodeLabel ? getNodeLabel(hoveredNode) : JSON.stringify(hoveredNode, null, 2)}
        </div>
      )}
    </div>
  );
};

export default NetworkGraph;
