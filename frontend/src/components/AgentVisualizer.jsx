import React from 'react';
import { Eye, FileCode, GitCompare, AlertTriangle, Calendar, Workflow } from 'lucide-react';

export default function AgentVisualizer({ currentAgent, progress, progressText }) {
  const sequence = [
    {
      id: 'VisionAuditor',
      name: '👁️ Screen Scanner (Vision AI)',
      description: 'Extracts visual features from product demos and screenshots.',
      icon: Eye,
      activeColor: 'var(--color-purple)'
    },
    {
      id: 'CodeArcheologist',
      name: '💻 Code Inspector (Code AI)',
      description: 'Scans repositories and script files to match backend telemetry.',
      icon: FileCode,
      activeColor: 'var(--color-cyan)'
    },
    {
      id: 'Reconciliation',
      name: '🔄 Feature Comparer (Data Merger)',
      description: 'Matches UI layouts against codebase diffs to find disparities.',
      icon: GitCompare,
      activeColor: 'var(--color-indigo)'
    },
    {
      id: 'ConflictResolver',
      name: '⚠️ Anomalies Detector (Resolver)',
      description: 'Validates if features are real or just marketing mockups.',
      icon: AlertTriangle,
      activeColor: 'var(--color-amber)'
    },
    {
      id: 'TimelineGenerator',
      name: '📅 Roadmap Compiler (Launch Estimator)',
      description: 'Synthesizes final competitor launch roadmaps and confidence scores.',
      icon: Calendar,
      activeColor: 'var(--color-emerald)'
    }
  ];

  const getNodeState = (nodeId) => {
    if (!currentAgent) {
      if (progress === 100) return 'completed';
      return 'idle';
    }

    const order = sequence.map(s => s.id);
    const currentIdx = order.indexOf(currentAgent);
    const nodeIdx = order.indexOf(nodeId);

    if (currentAgent === nodeId) return 'active';
    if (nodeIdx !== -1 && currentIdx > nodeIdx) return 'completed';
    return 'idle';
  };

  const getStepStatusLabel = (state) => {
    if (state === 'active') return 'Analyzing...';
    if (state === 'completed') return 'Ready';
    return 'Pending';
  };

  return (
    <div className="panel" style={{ height: '100%' }}>
      
      {/* Real-time Swarm Progress Header */}
      <div className="panel-header" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'stretch', padding: '12px 20px 8px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Workflow size={14} style={{ color: 'var(--color-purple)' }} />
            Swarm Orchestration Pipeline
          </div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: progress === 100 ? 'var(--color-emerald)' : 'var(--text-secondary)' }}>
            {progress}%
          </span>
        </div>
        
        {/* Sleek horizontal progress bar */}
        <div style={{ width: '100%', height: '3px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '2px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${progress}%`, 
              height: '100%', 
              background: progress === 100 ? 'var(--color-emerald)' : 'linear-gradient(to right, var(--color-purple), var(--color-cyan))', 
              borderRadius: '2px',
              transition: 'width 0.3s ease-out'
            }} 
          />
        </div>
        
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: progress > 0 && progress < 100 ? 'var(--color-purple)' : 'var(--text-muted)', animation: progress > 0 && progress < 100 ? 'pulse 1.5s infinite' : 'none' }}></div>
          {progressText}
        </div>
      </div>

      <div className="panel-content" style={{ padding: '8px 0' }}>
        <div className="pipeline-container" style={{ padding: '4px 16px' }}>
          {sequence.map((step, idx) => {
            const state = getNodeState(step.id);
            const Icon = step.icon;

            // Determine active glowing connector state
            let connectorState = 'idle';
            if (progress === 100) {
              connectorState = 'completed';
            } else if (currentAgent) {
              const order = sequence.map(s => s.id);
              const currentIdx = order.indexOf(currentAgent);
              if (idx < currentIdx) {
                connectorState = 'completed';
              } else if (idx === currentIdx) {
                connectorState = 'active';
              }
            }

            return (
              <React.Fragment key={step.id}>
                {idx > 0 && (
                  <div style={{
                    marginLeft: '28px',
                    width: '2px',
                    height: '10px',
                    background: connectorState === 'completed' ? 'var(--color-emerald)' : 
                                connectorState === 'active' ? 'linear-gradient(to bottom, var(--color-purple), var(--color-cyan))' : 'rgba(255,255,255,0.06)',
                    opacity: connectorState === 'idle' ? 0.35 : 1,
                    transition: 'var(--transition-smooth)'
                  }} />
                )}
                <div 
                  className={`pipeline-step ${state}`}
                  style={{
                    borderColor: state === 'active' ? step.activeColor : undefined,
                    background: state === 'active' ? `${step.activeColor}05` : undefined,
                    boxShadow: state === 'active' ? `0 0 12px ${step.activeColor}15` : undefined,
                    padding: '8px 12px'
                  }}
                >
                  <div 
                    className="step-indicator"
                    style={{
                      borderColor: state === 'active' ? step.activeColor : undefined,
                      color: state === 'active' ? step.activeColor : undefined,
                      background: state === 'completed' ? 'rgba(52, 211, 153, 0.1)' : undefined
                    }}
                  >
                    <Icon size={12} />
                  </div>
                  <div className="step-info">
                    <div className="step-title" style={{ fontSize: '12px', fontWeight: 600 }}>{step.name}</div>
                    <div className="step-desc" style={{ fontSize: '10px', marginTop: '1px' }}>{step.description}</div>
                  </div>
                  <div 
                    className={`step-status ${state}`}
                    style={{
                      fontSize: '9px',
                      color: state === 'active' ? step.activeColor : undefined
                    }}
                  >
                    {getStepStatusLabel(state)}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
