/**
 * Main App Component
 */

import React, { useState } from 'react';
import CitationNetwork from './components/CitationNetwork';
import CollaborationNetwork from './components/CollaborationNetwork';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <h1>🎓 Warwick CS Paper Visualization</h1>
        <p className="app-subtitle">
          Interactive visualization of Warwick University Computer Science publications (2020-2024)
        </p>
      </header>

      {/* Navigation */}
      <nav className="app-nav">
        <button
          className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`nav-button ${activeTab === 'citation' ? 'active' : ''}`}
          onClick={() => setActiveTab('citation')}
        >
          🔗 Citation Network
        </button>
        <button
          className={`nav-button ${activeTab === 'collaboration' ? 'active' : ''}`}
          onClick={() => setActiveTab('collaboration')}
        >
          👥 Collaboration Network
        </button>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'citation' && <CitationNetwork />}
        {activeTab === 'collaboration' && <CollaborationNetwork />}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Data from SciSciNet v2 | Warwick University CS Department
        </p>
        <p style={{ fontSize: '12px', marginTop: '5px', color: '#666' }}>
          Built with React + D3.js | Backend: Flask
        </p>
      </footer>
    </div>
  );
}

export default App;
