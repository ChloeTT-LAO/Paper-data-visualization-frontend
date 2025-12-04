/**
 * Citation Network Component
 * Visualizes paper citation relationships
 */

import React, { useState, useEffect } from 'react';
import NetworkGraph from './NetworkGraph';
import apiService from '../services/api';

const CitationNetwork = () => {
  const [data, setData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    limit: 100,
    minCitations: 0,
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getCitationNetwork(
        filters.limit,
        filters.minCitations
      );
      
      // Validate response
      if (!response) {
        throw new Error('No response from server');
      }
      
      if (!response.nodes || !Array.isArray(response.nodes)) {
        throw new Error('Invalid response format: nodes missing or not an array');
      }
      
      if (!response.edges || !Array.isArray(response.edges)) {
        throw new Error('Invalid response format: edges missing or not an array');
      }
      
      if (response.nodes.length === 0) {
        throw new Error(`No papers found with these filters (limit: ${filters.limit}, min citations: ${filters.minCitations})`);
      }
      
      // Transform data for D3
      const nodes = response.nodes.map(node => ({
        ...node,
        id: node.id.toString(), // Ensure ID is string
      }));
      
      // Create a set of valid node IDs for faster lookup
      const validNodeIds = new Set(nodes.map(n => n.id));
      
      // Filter links to only include edges where both nodes exist
      const links = response.edges
        .map(edge => ({
          source: edge.source.toString(),
          target: edge.target.toString(),
        }))
        .filter(edge => {
          const isValid = validNodeIds.has(edge.source) && validNodeIds.has(edge.target);
          if (!isValid) {
            console.warn(`Skipping invalid edge: ${edge.source} -> ${edge.target}`);
          }
          return isValid;
        });
      
      console.log(`✅ Loaded ${nodes.length} nodes and ${links.length} valid edges`);
      
      setData({ nodes, links, stats: response.stats });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching citation network:', err);
      setError(err.message || 'Failed to load citation network');
      setLoading(false);
    }
  };

  const getNodeColor = (node) => {
    // Color by year
    const year = node.year;
    if (year >= 2024) return '#e74c3c';
    if (year >= 2023) return '#f39c12';
    if (year >= 2022) return '#f1c40f';
    if (year >= 2021) return '#2ecc71';
    return '#3498db';
  };

  const getNodeSize = (node) => {
    // Size by citations (log scale)
    const citations = node.citations || 0;
    return Math.max(4, Math.log(citations + 1) * 2);
  };

  const getNodeLabel = (node) => {
    return `Year: ${node.year}\nCitations: ${node.citations}\nDOI: ${node.doi || 'N/A'}`;
  };

  const handleNodeClick = (node) => {
    console.log('Clicked node:', node);
    if (node.doi) {
      const url = `https://doi.org/${node.doi}`;
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="spinner" />
        <p>Loading citation network...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
        <h3>Error loading data</h3>
        <p>{error}</p>
        <button onClick={fetchData} style={{ marginTop: '10px', padding: '8px 16px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="network-container">
      <div className="network-header">
        <h2>Citation Network</h2>
        <p className="network-description">
          Visualization of paper citation relationships. Node size = citations, color = year.
        </p>
        
        {/* Controls */}
        <div className="network-controls">
          <label>
            Max Papers:
            <input
              type="number"
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value) })}
              min="10"
              max="2000"
              step="10"
              style={{ marginLeft: '8px', width: '80px' }}
            />
          </label>
          <span style={{ fontSize: '11px', color: '#666', marginLeft: '5px' }}>
            (max 2000)
          </span>
          
          <label style={{ marginLeft: '20px' }}>
            Min Citations:
            <input
              type="number"
              value={filters.minCitations}
              onChange={(e) => setFilters({ ...filters, minCitations: parseInt(e.target.value) })}
              min="0"
              max="100"
              step="1"
              style={{ marginLeft: '8px', width: '80px' }}
            />
          </label>
          
          <button 
            onClick={fetchData}
            style={{ marginLeft: '20px', padding: '6px 12px' }}
          >
            Apply Filters
          </button>
          
          <div style={{ 
            marginLeft: '20px', 
            fontSize: '0.85em', 
            color: '#666',
            padding: '5px 10px',
            background: '#f8f9fa',
            borderRadius: '4px'
          }}>
            💡 Tip: Use "Min Citations" to focus on highly-cited papers
          </div>
        </div>

        {/* Stats */}
        {data.stats && (
          <div className="network-stats">
            <span>Papers: {data.stats.total_nodes}</span>
            <span style={{ marginLeft: '20px' }}>Citations: {data.stats.total_edges}</span>
            <span style={{ marginLeft: '20px' }}>
              Avg Citations: {data.stats.avg_citations?.toFixed(1)}
            </span>
            {data.stats.total_available && (
              <span style={{ marginLeft: '20px', color: '#666', fontSize: '0.9em' }}>
                (Total available: {data.stats.total_available} papers)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Graph */}
      <NetworkGraph
        nodes={data.nodes}
        links={data.links}
        width={1000}
        height={700}
        nodeRadius={5}
        linkDistance={60}
        chargeStrength={-400}
        directed={true}  // Citation is directed (who cites whom)
        getNodeColor={getNodeColor}
        getNodeSize={getNodeSize}
        getNodeLabel={getNodeLabel}
        onNodeClick={handleNodeClick}
      />

      {/* Legend */}
      <div className="network-legend">
        <h4>Legend:</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#e74c3c' }} />
            <span>2024</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#f39c12' }} />
            <span>2023</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#f1c40f' }} />
            <span>2022</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#2ecc71' }} />
            <span>2021</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#3498db' }} />
            <span>2020</span>
          </div>
        </div>
        <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          💡 Tip: Drag nodes to reposition, scroll to zoom, click nodes to open DOI
        </p>
      </div>
    </div>
  );
};

export default CitationNetwork;
