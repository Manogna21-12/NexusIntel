import React, { useState, useEffect } from 'react';
import CompetitorInput from './components/CompetitorInput';
import AgentVisualizer from './components/AgentVisualizer';
import TerminalLogs from './components/TerminalLogs';
import TimelineView from './components/TimelineView';
import AboutPage from './components/AboutPage';
import ComparisonMatrix from './components/ComparisonMatrix';
import { Activity, BookOpen, Layers, Play, Pause, ShieldCheck, TrendingUp, Eye, FileCode } from 'lucide-react';

export default function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(null);
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState(null);
  const [leftTab, setLeftTab] = useState('config');
  const [mainView, setMainView] = useState('dashboard');
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('Swarm idle');

  // New states for interactive controls & features
  const [isPaused, setIsPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(450);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [rawLogs, setRawLogs] = useState([]);
  const [fullData, setFullData] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const startAnalysis = async (requestData) => {
    setIsAnalyzing(true);
    setResults(null);
    setLogs([]);
    setCurrentAgent('VisionAuditor');
    setLeftTab('console');
    setMainView('dashboard');
    setProgress(0);
    setProgressText('Orchestrating agent swarm nodes...');
    
    // Reset control states
    setIsPaused(false);
    setCurrentLogIndex(0);
    setRawLogs([]);
    setFullData(null);
    setSelectedCard(null);

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
      
      // Store logs and response in state to play them back reactively
      setRawLogs(data.logs || []);
      setFullData(data);

    } catch (error) {
      console.error(error);
      setLogs(prev => [...prev, {
        agent: 'Orchestrator',
        message: `❌ ANALYSIS FAILED: ${error.message}. Please check local logs.`,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setIsAnalyzing(false);
      setCurrentAgent(null);
      setProgressText('Analysis failed.');
    }
  };

  // Playback control reactive runner
  useEffect(() => {
    if (!isAnalyzing || isPaused || rawLogs.length === 0) return;

    const timeout = setTimeout(() => {
      if (currentLogIndex < rawLogs.length) {
        const nextLog = rawLogs[currentLogIndex];
        
        // Add log entry
        setLogs(prev => [...prev, {
          agent: nextLog.agent,
          message: nextLog.message,
          timestamp: nextLog.timestamp || new Date().toLocaleTimeString()
        }]);

        // Transition active node
        if (nextLog.agent && nextLog.agent !== 'Orchestrator') {
          setCurrentAgent(nextLog.agent);
          
          if (nextLog.agent === 'VisionAuditor') {
            setProgressText('Vision Auditor: Scanning target visual mockups & demo frames...');
          } else if (nextLog.agent === 'CodeArcheologist') {
            setProgressText('Code Archeologist: Auditing scripts & parsing dependency logs...');
          } else if (nextLog.agent === 'Reconciliation') {
            setProgressText('Synthesis Engine: Merging visual findings with codebase diffs...');
          } else if (nextLog.agent === 'ConflictResolver') {
            setProgressText('Synthesis Engine: Solving telemetry anomalies & flag configurations...');
          } else if (nextLog.agent === 'TimelineGenerator') {
            setProgressText('Synthesis Engine: Assembling estimated competitor launch timeline...');
          }
        } else {
          setProgressText('Orchestrator: Scheduling swarm routing updates...');
        }

        const pct = Math.min(Math.round(((currentLogIndex + 1) / rawLogs.length) * 100), 98);
        setProgress(pct);

        setCurrentLogIndex(prev => prev + 1);
      } else {
        // Analysis completed!
        setResults(fullData);
        setIsAnalyzing(false);
        setCurrentAgent(null);
        setProgress(100);
        setProgressText('Audit complete: strategic roadmap reconciled.');
        
        setLogs(prev => [...prev, {
          agent: 'Orchestrator',
          message: `✨ Reverse engineering analysis finalized. Roadmap successfully synthesized.`,
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
    }, playbackSpeed);

    return () => clearTimeout(timeout);
  }, [isAnalyzing, isPaused, playbackSpeed, currentLogIndex, rawLogs, fullData]);

  return (
    <div className="app-container">
      {/* Header bar */}
      <header className="app-header" style={{ borderBottom: '1px solid rgba(139, 92, 246, 0.2)', boxShadow: '0 1px 15px rgba(139, 92, 246, 0.05)' }}>
        <div className="logo-container">
          <div className="logo-icon" style={{ animation: isAnalyzing && !isPaused ? 'pulse 1.5s infinite' : 'none' }}>N</div>
          <h1 className="logo-text" style={{ fontSize: '20px', margin: 0, fontWeight: 700, background: 'linear-gradient(to right, #ffffff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            NexusIntel
          </h1>
          <span className="badge-beta">Multimodal Audits</span>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setMainView('dashboard')}
            style={{
              background: mainView === 'dashboard' ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
              border: mainView === 'dashboard' ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid transparent',
              color: mainView === 'dashboard' ? 'white' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Layers size={13} />
            Dashboard
          </button>
          <button
            onClick={() => setMainView('matrix')}
            style={{
              background: mainView === 'matrix' ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
              border: mainView === 'matrix' ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid transparent',
              color: mainView === 'matrix' ? 'white' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'var(--transition-smooth)'
            }}
          >
            <TrendingUp size={13} />
            Gaps Matrix
          </button>
          <button
            onClick={() => setMainView('about')}
            style={{
              background: mainView === 'about' ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
              border: mainView === 'about' ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid transparent',
              color: mainView === 'about' ? 'white' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'var(--transition-smooth)'
            }}
          >
            <BookOpen size={13} />
            Engine About
          </button>
        </div>

        <div className="header-status">
          <Activity size={14} style={{ color: 'var(--color-emerald)' }} />
          <span>Swarm Node: </span>
          <div className="status-dot radar-pulse"></div>
          <span style={{ fontWeight: 600, color: 'white', marginLeft: '4px' }}>Online</span>
        </div>
      </header>

      {/* Conditional Workspace Rendering */}
      {mainView === 'about' ? (
        <AboutPage />
      ) : mainView === 'matrix' ? (
        <main className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
          <ComparisonMatrix results={results} />
        </main>
      ) : (
        <main className="dashboard-grid">
          
          {/* Left column: Tabbed Sidebar */}
          <div className="panel left-column" style={{ height: '100%' }}>
            <div className="panel-header" style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.01)' }}>
              <button
                onClick={() => setLeftTab('config')}
                style={{
                  flex: 1,
                  background: leftTab === 'config' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  border: leftTab === 'config' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
                  color: leftTab === 'config' ? 'white' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'var(--transition-smooth)'
                }}
              >
                Configuration
              </button>
              <button
                onClick={() => setLeftTab('console')}
                style={{
                  flex: 1,
                  background: leftTab === 'console' ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  border: leftTab === 'console' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
                  color: leftTab === 'console' ? 'white' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'var(--transition-smooth)'
                }}
              >
                Console Logs
              </button>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              {leftTab === 'config' ? (
                <CompetitorInput 
                  onStartAnalysis={startAnalysis} 
                  isAnalyzing={isAnalyzing} 
                />
              ) : (
                <TerminalLogs logs={logs} />
              )}
            </div>
          </div>

          {/* Right column: Swarm visualizer & Reconciled Timeline */}
          <div className="right-column">
            
            {/* Playback Simulation Control Bar */}
            {isAnalyzing && (
              <div className="playback-controls">
                <button 
                  onClick={() => setIsPaused(!isPaused)} 
                  className="playback-btn"
                  title={isPaused ? "Resume swarm simulation" : "Pause swarm simulation"}
                >
                  {isPaused ? <Play size={10} fill="white" /> : <Pause size={10} fill="white" />}
                </button>
                <span style={{ fontWeight: 600, color: 'white' }}>
                  {isPaused ? "Simulation Paused" : "Live Swarm Running"}
                </span>
                <div style={{ flex: 1 }} />
                <span style={{ color: 'var(--text-muted)' }}>Delay:</span>
                <input 
                  type="range" 
                  min="150" 
                  max="1200" 
                  step="50" 
                  value={playbackSpeed} 
                  onChange={e => setPlaybackSpeed(Number(e.target.value))}
                  style={{ width: '80px', height: '2px', accentColor: 'var(--color-purple)' }}
                  title="Adjust delay between steps (ms)"
                />
                <span style={{ color: 'white', minWidth: '40px', textAlign: 'right', fontWeight: 600 }}>
                  {playbackSpeed}ms
                </span>
              </div>
            )}

            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ flex: '0 0 280px' }}>
                <AgentVisualizer 
                  currentAgent={currentAgent} 
                  progress={progress}
                  progressText={progressText}
                />
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <TimelineView 
                  results={results} 
                  isAnalyzing={isAnalyzing} 
                  onSelectCard={setSelectedCard}
                />
              </div>
            </div>
          </div>

        </main>
      )}

      {/* Telemetry Explorer side drawer */}
      {selectedCard && (
        <div className="telemetry-overlay" onClick={() => setSelectedCard(null)}>
          <div className="telemetry-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <ShieldCheck size={16} style={{ color: 'var(--color-purple)' }} />
                  Telemetry Proof Explorer
                </h3>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Real-time reverse engineering evidence</span>
              </div>
              <button 
                onClick={() => setSelectedCard(null)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}
              >
                ✕
              </button>
            </div>
            
            <div className="drawer-content">
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '6px' }}>{selectedCard.feature}</h2>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className={`badge-status ${selectedCard.status.toLowerCase().includes('live') ? 'live' : selectedCard.status.toLowerCase().includes('beta') ? 'beta' : selectedCard.status.toLowerCase().includes('mockup') ? 'mockup' : 'development'}`} style={{ fontSize: '9px' }}>
                    {selectedCard.status}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Est. Launch: {selectedCard.weeks_to_launch === 0 ? 'Live Now' : `${selectedCard.weeks_to_launch} Weeks`}
                  </span>
                </div>
              </div>

              {/* Confidence Gauge */}
              <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifycontent: 'space-between', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', justifyContent: 'space-between' }}>
                  <span>Evidence Integrity Score</span>
                  <span style={{ color: selectedCard.status.toLowerCase().includes('mockup') ? 'var(--color-rose)' : 'var(--color-emerald)' }}>
                    {selectedCard.status.toLowerCase().includes('mockup') ? '35% (Marketing Mockup)' : '95% (Verified Code)'}
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: selectedCard.status.toLowerCase().includes('mockup') ? '35%' : '95%',
                    height: '100%',
                    background: selectedCard.status.toLowerCase().includes('mockup') ? 'var(--color-rose)' : 'linear-gradient(to right, var(--color-purple), var(--color-emerald))',
                    borderRadius: '3px'
                  }} />
                </div>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.3 }}>
                  {selectedCard.status.toLowerCase().includes('mockup') 
                    ? '⚠️ Alert: UI exists in marketing videos but AST scans of script bundles show zero routing imports or server-side endpoints.'
                    : '✔️ Match: UI matches leaked code routes and environment feature flags detected in the public production javascript bundles.'}
                </p>
              </div>

              {/* Visual Telemetry details */}
              <div>
                <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-purple)', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={12} />
                  Visual Proof (Screen Analysis)
                </h4>
                <div style={{ background: 'rgba(167, 139, 250, 0.02)', border: '1px solid rgba(167, 139, 250, 0.1)', borderRadius: '6px', padding: '12px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {selectedCard.indicators.ui_detected 
                    ? `Detected in demonstration video timeline. Frames analyzed via Gemini OCR match canvas layouts and sidebars for "${selectedCard.feature}".`
                    : 'No visual evidence detected in public video assets or design system files.'}
                </div>
              </div>

              {/* Code Telemetry details */}
              <div>
                <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-cyan)', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileCode size={12} />
                  Code Telemetry (Bundle Analysis)
                </h4>
                <div style={{ background: 'rgba(34, 211, 238, 0.02)', border: '1px solid rgba(34, 211, 238, 0.1)', borderRadius: '6px', padding: '12px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {selectedCard.indicators.code_detected 
                    ? `Matching routing configuration AST definitions found in repository. Environment feature flag config keys verified.`
                    : 'Zero code matching AST paths or export declarations found in public repository files.'}
                </div>
              </div>

              {/* Leaked API Endpoints */}
              {selectedCard.indicators.endpoints && selectedCard.indicators.endpoints.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-amber)', fontWeight: 600, marginBottom: '6px' }}>
                    Leaked Endpoints
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {selectedCard.indicators.endpoints.map((ep, idx) => (
                      <code key={idx} style={{ fontSize: '9px', padding: '8px', background: 'black', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)', display: 'block' }}>
                        {ep}
                      </code>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
