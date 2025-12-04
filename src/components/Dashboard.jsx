/**
 * Dashboard Component
 * Displays overall statistics with year filtering
 */

import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import Timeline from './Timeline';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getStats();
      setStats(response);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
  };

  const getFilteredStats = () => {
    if (!stats || !stats.papers || !selectedYear) return stats;

    // This is a simplified filter - in a real app, you'd filter on the backend
    // For now, we'll just show the selected year in the UI
    return stats;
  };

  const filteredStats = getFilteredStats();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
        <p>Error loading statistics: {error}</p>
        <button onClick={fetchStats} style={{ marginTop: '10px', padding: '8px 16px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      
      {/* Timeline */}
      <div className="dashboard-section">
        <Timeline onYearSelect={handleYearSelect} />
      </div>

      {/* Overall Statistics */}
      <div className="dashboard-section">
        <h3>Overall Statistics {selectedYear && `(${selectedYear})`}</h3>
        
        {filteredStats && filteredStats.papers && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{filteredStats.papers.total}</div>
              <div className="stat-label">Total Papers</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{filteredStats.papers.avg_citations.toFixed(1)}</div>
              <div className="stat-label">Avg Citations</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{filteredStats.papers.avg_team_size.toFixed(1)}</div>
              <div className="stat-label">Avg Team Size</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">
                {filteredStats.papers.year_range[0]}-{filteredStats.papers.year_range[1]}
              </div>
              <div className="stat-label">Year Range</div>
            </div>
          </div>
        )}

        {filteredStats && filteredStats.citation_network && (
          <div className="stats-grid" style={{ marginTop: '20px' }}>
            <div className="stat-card">
              <div className="stat-value">{filteredStats.citation_network.nodes}</div>
              <div className="stat-label">Citation Network Nodes</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{filteredStats.citation_network.edges}</div>
              <div className="stat-label">Citation Network Edges</div>
            </div>
            
            {filteredStats.collaboration_network && (
              <>
                <div className="stat-card">
                  <div className="stat-value">{filteredStats.collaboration_network.nodes}</div>
                  <div className="stat-label">Collaboration Network Nodes</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">{filteredStats.collaboration_network.edges}</div>
                  <div className="stat-label">Collaboration Network Edges</div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Top Cited Papers */}
      {filteredStats && filteredStats.papers && filteredStats.papers.top_cited && (
        <div className="dashboard-section">
          <h3>Top 5 Most Cited Papers</h3>
          <div className="top-papers-list">
            {filteredStats.papers.top_cited.map((paper, index) => (
              <div key={paper.paperid} className="paper-item">
                <div className="paper-rank">#{index + 1}</div>
                <div className="paper-info">
                  <div className="paper-citations">
                    <strong>{paper.citation_count}</strong> citations
                  </div>
                  <div className="paper-year">Year: {paper.year}</div>
                  {paper.doi && (
                    <a 
                      href={`https://doi.org/${paper.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="paper-link"
                    >
                      View Paper →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedYear && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px', 
          padding: '15px', 
          background: '#fff3cd',
          borderRadius: '4px',
          border: '1px solid #ffc107'
        }}>
          <p style={{ margin: 0, color: '#856404' }}>
            💡 Year filter applied: <strong>{selectedYear}</strong>
            <button
              onClick={() => handleYearSelect(null)}
              style={{ 
                marginLeft: '10px', 
                padding: '4px 12px',
                background: '#856404',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Clear Filter
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
