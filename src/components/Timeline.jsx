/**
 * Timeline Component
 * Visualizes publication timeline with D3.js
 */

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import apiService from '../services/api';

const Timeline = ({ onYearSelect }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const svgRef = useRef();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getTimeline();
      setData(response);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data || !data.timeline || !svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const timeline = data.timeline;
    const width = 800;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Scales
    const xScale = d3.scaleBand()
      .domain(timeline.map(d => d.year))
      .range([0, chartWidth])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(timeline, d => d.count)])
      .nice()
      .range([chartHeight, 0]);

    // Axes
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '12px');

    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px');

    // Bars
    g.selectAll('.bar')
      .data(timeline)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.year))
      .attr('y', d => yScale(d.count))
      .attr('width', xScale.bandwidth())
      .attr('height', d => chartHeight - yScale(d.count))
      .attr('fill', d => d.year === selectedYear ? '#e74c3c' : '#3498db')
      .attr('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill', '#2ecc71');
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('fill', d.year === selectedYear ? '#e74c3c' : '#3498db');
      })
      .on('click', (event, d) => {
        setSelectedYear(d.year);
        if (onYearSelect) {
          onYearSelect(d.year);
        }
      });

    // Value labels
    g.selectAll('.label')
      .data(timeline)
      .join('text')
      .attr('class', 'label')
      .attr('x', d => xScale(d.year) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.count) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '11px')
      .style('fill', '#333')
      .text(d => d.count);

    // Axis labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Year');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .text('Number of Papers');

  }, [data, selectedYear, onYearSelect]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>Loading timeline...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
        <p>Error loading timeline: {error}</p>
      </div>
    );
  }

  return (
    <div className="timeline-container">
      <h3>Publication Timeline</h3>
      <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
        Click on a bar to filter statistics by year
      </p>
      
      <svg ref={svgRef} style={{ display: 'block', margin: '0 auto' }} />
      
      {selectedYear && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <p style={{ fontSize: '14px', color: '#e74c3c', fontWeight: 'bold' }}>
            Selected Year: {selectedYear}
          </p>
          <button
            onClick={() => {
              setSelectedYear(null);
              if (onYearSelect) onYearSelect(null);
            }}
            style={{ padding: '4px 12px', fontSize: '12px', marginTop: '5px' }}
          >
            Clear Selection
          </button>
        </div>
      )}
      
      {data && data.stats && (
        <div className="timeline-stats" style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#666' }}>
            Total Papers: <strong>{data.stats.total_papers}</strong> | 
            Avg per Year: <strong>{data.stats.avg_per_year.toFixed(1)}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default Timeline;
