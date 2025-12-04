/**
 * Collaboration Network Component
 * Visualizes author collaboration relationships
 */

import React, { useState, useEffect } from 'react';
import NetworkGraph from './NetworkGraph';
import apiService from '../services/api';

const CollaborationNetwork = () => {
  const [data, setData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    limit: 50,
    minCollaborations: 1,
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getCollaborationNetwork(
        filters.limit,
        filters.minCollaborations
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
        throw new Error(`No authors found with these filters (limit: ${filters.limit}, min collaborations: ${filters.minCollaborations})`);
      }
      
      // Transform data for D3
      const nodes = response.nodes.map(node => ({
        ...node,
        id: node.id.toString(),
      }));
      
      // Create a set of valid node IDs for faster lookup
      const validNodeIds = new Set(nodes.map(n => n.id));
      
      // Filter links to only include edges where both authors exist
      const links = response.edges
        .map(edge => ({
          source: edge.author1.toString(),
          target: edge.author2.toString(),
          weight: edge.weight,
        }))
        .filter(edge => {
          const isValid = validNodeIds.has(edge.source) && validNodeIds.has(edge.target);
          if (!isValid) {
            console.warn(`Skipping invalid collaboration: ${edge.source} <-> ${edge.target}`);
          }
          return isValid;
        });
      
      console.log(`✅ Loaded ${nodes.length} authors and ${links.length} valid collaborations`);
      
      setData({ nodes, links, stats: response.stats });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching collaboration network:', err);
      setError(err.message || 'Failed to load collaboration network');
      setLoading(false);
    }
  };

  const getNodeColor = (node) => {
    // Color by productivity
    const papers = node.paper_count || 0;
    if (papers >= 10) return '#8e44ad';
    if (papers >= 7) return '#3498db';
    if (papers >= 5) return '#1abc9c';
    if (papers >= 3) return '#f39c12';
    return '#95a5a6';
  };

  const getNodeSize = (node) => {
    // Size by paper count
    const papers = node.paper_count || 0;
    return Math.max(5, Math.sqrt(papers) * 3);
  };

  const getNodeLabel = (node) => {
    return `Author ID: ${node.id}\nPapers: ${node.paper_count || 0}`;
  };

  const handleNodeClick = (node) => {
    console.log('Clicked author:', node);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="spinner" />
        <p>Loading collaboration network...</p>
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
        <h2>Collaboration Network</h2>
        <p className="network-description">
          Visualization of author collaboration relationships. Node size = papers, color = productivity.
        </p>
        
        {/* Controls */}
        <div className="network-controls">
          <label>
            Max Authors:
            <input
              type="number"
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value) })}
              min="10"
              max="1000"
              step="10"
              style={{ marginLeft: '8px', width: '80px' }}
            />
          </label>
          <span style={{ fontSize: '11px', color: '#666', marginLeft: '5px' }}>
            (max 1000)
          </span>
          
          <label style={{ marginLeft: '20px' }}>
            Min Collaborations:
            <input
              type="number"
              value={filters.minCollaborations}
              onChange={(e) => setFilters({ ...filters, minCollaborations: parseInt(e.target.value) })}
              min="1"
              max="10"
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
        </div>

        {/* Stats */}
        {data.stats && (
          <div className="network-stats">
            <span>Authors: {data.stats.total_nodes}</span>
            <span style={{ marginLeft: '20px' }}>Collaborations: {data.stats.total_edges}</span>
            <span style={{ marginLeft: '20px' }}>
              Avg Papers/Author: {data.stats.avg_paper_count?.toFixed(1)}
            </span>
            <span style={{ marginLeft: '20px' }}>
              Avg Collab Strength: {data.stats.avg_collaboration_weight?.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Graph */}
      <NetworkGraph
        nodes={data.nodes}
        links={data.links}
        width={1000}
        height={700}
        nodeRadius={6}
        linkDistance={80}
        chargeStrength={-500}
        directed={false}  // Collaboration is undirected
        getNodeColor={getNodeColor}
        getNodeSize={getNodeSize}
        getNodeLabel={getNodeLabel}
        onNodeClick={handleNodeClick}
      />

      {/* Legend */}
      <div className="network-legend">
        <h4>Legend (by paper count):</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#8e44ad' }} />
            <span>10+ papers</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#3498db' }} />
            <span>7-9 papers</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#1abc9c' }} />
            <span>5-6 papers</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#f39c12' }} />
            <span>3-4 papers</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ background: '#95a5a6' }} />
            <span>1-2 papers</span>
          </div>
        </div>
        <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          💡 Tip: Link thickness = collaboration strength, drag nodes to reposition
        </p>
      </div>
    </div>
  );
};

export default CollaborationNetwork;
