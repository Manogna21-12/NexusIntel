import React, { useState } from 'react';
import CompetitorInput from './components/CompetitorInput';
import AgentVisualizer from './components/AgentVisualizer';
import TerminalLogs from './components/TerminalLogs';
import TimelineView from './components/TimelineView';
import { ShieldAlert, RefreshCw, Cpu, Activity } from 'lucide-react';

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState(null);

  const startAnalysis = async (requestData) => {
    setIsAnalyzing(true);
    setResults(null);
    setLogs([]);
    setCurrentAgent('VisionAuditor');
    
    // Quick starter log
    setLogs([{
      agent: 'Orchestrator',
      message: `Establishing connection to competitor tracker daemon...`,
      timestamp: new Date().toLocaleTimeString()
    }]);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`Agent server error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Play back the logs in real time to show the LangGraph nodes transitioning!
      playBackAnalysis(data);

    } catch (error) {
      console.error(error);
      setLogs(prev => [...prev, {
        agent: 'Orchestrator',
        message: `❌ ANALYSIS FAILED: ${error.message}. Please check local logs.`,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setIsAnalyzing(false);
      setCurrentAgent(null);
    }
  };

  const playBackAnalysis = (data) => {
    const rawLogs = data.logs || [];
    let logIndex = 0;

    const interval = setInterval(() => {
      if (logIndex < rawLogs.length) {
        const nextLog = rawLogs[logIndex];
        
        // Add log entry
        setLogs(prev => [...prev, {
          agent: nextLog.agent,
          message: nextLog.message,
          timestamp: nextLog.timestamp || new Date().toLocaleTimeString()
        }]);

        // Transition the current active node in LangGraph Visualizer
        if (nextLog.agent && nextLog.agent !== 'Orchestrator') {
          setCurrentAgent(nextLog.agent);
        }

        logIndex++;
      } else {
        clearInterval(interval);
        // Analysis completed! Update state to render the timeline and clear active agent
        setResults(data);
        setIsAnalyzing(false);
        setCurrentAgent(null);
        
        // Add completion log
        setLogs(prev => [...prev, {
          agent: 'Orchestrator',
          message: `✨ Reverse engineering analysis finalized. Roadmap successfully synthesized.`,
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
    }, 450); // Playback speed in milliseconds per log
  };

  return (
    <div className="app-container">
      {/* Header bar */}
      <header className="app-header">
        <div className="logo-container">
          <div className="logo-icon">N</div>
          <h1 className="logo-text" style={{ fontSize: '24px', margin: 0 }}>NexusIntel</h1>
          <span className="badge-beta">Multimodal Audits</span>
        </div>
        <div className="header-status">
          <Activity size={14} style={{ color: 'var(--color-emerald)' }} />
          <span>Agent Swarm Node: </span>
          <div className="status-dot"></div>
          <span style={{ fontWeight: 600, color: 'white' }}>Online</span>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <main className="dashboard-grid">
        
        {/* Left column: Controls & Preset Configuration */}
        <div style={{ gridColumn: '1', gridRow: '1' }}>
          <CompetitorInput 
            onStartAnalysis={startAnalysis} 
            isAnalyzing={isAnalyzing} 
          />
        </div>

        {/* Center column: LangGraph Visualizer */}
        <div style={{ gridColumn: '2', gridRow: '1' }}>
          <AgentVisualizer 
            currentAgent={currentAgent} 
            currentStep={currentStep} 
          />
        </div>

        {/* Right column: Audit Terminal Console */}
        <div style={{ gridColumn: '3', gridRow: '1' }}>
          <TerminalLogs logs={logs} />
        </div>

        {/* Bottom column: Roadmap Timeline */}
        <TimelineView 
          results={results} 
          isAnalyzing={isAnalyzing} 
        />

      </main>
    </div>
  );
}
