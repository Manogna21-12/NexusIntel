import React from 'react';
import { Eye, FileCode, GitCompare, RefreshCw, AlertTriangle, CalendarRange, Workflow } from 'lucide-react';

export default function AgentVisualizer({ currentAgent, currentStep }) {
  // Determine states of nodes based on currentAgent and currentStep
  const getNodeState = (nodeName) => {
    if (!currentAgent) return 'idle';
    
    // Mapping of node sequence
    const sequence = [
      'VisionAuditor',
      'CodeArcheologist',
      'Reconciliation',
      'ConflictResolver',
      'TimelineGenerator'
    ];

    const currentIdx = sequence.indexOf(currentAgent);
    const nodeIdx = sequence.indexOf(nodeName);

    if (currentAgent === nodeName) return 'active';
    if (nodeIdx !== -1 && currentIdx > nodeIdx) return 'completed';
    return 'idle';
  };

  const getPathClass = (fromNode, toNode) => {
    const fromState = getNodeState(fromNode);
    const toState = getNodeState(toNode);

    if (fromState === 'completed' && toState === 'active') return 'conn-path active';
    if (fromState === 'completed' && toState === 'completed') return 'conn-path completed';
    return 'conn-path';
  };

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <div className="panel-title">
          <Workflow size={18} className="icon-glow" style={{ color: 'var(--color-purple)' }} />
          LangGraph Workflow Engine
        </div>
        <span className="panel-subtitle">Agent Swarm Logic</span>
      </div>
      <div className="panel-content" style={{ padding: 0 }}>
        <div className="visualizer-container">
          
          {/* Dynamic Connector SVG Paths */}
          <svg className="connections-svg">
            <defs>
              <linearGradient id="purple-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-purple)" />
                <stop offset="100%" stopColor="var(--color-cyan)" />
              </linearGradient>
            </defs>
            
            {/* Vision Auditor -> Reconciliation */}
            <path 
              d="M 100, 110 C 100, 160 180, 160 180, 210" 
              className={getPathClass('VisionAuditor', 'Reconciliation')} 
            />
            {/* Code Archeologist -> Reconciliation */}
            <path 
              d="M 270, 110 C 270, 160 180, 160 180, 210" 
              className={getPathClass('CodeArcheologist', 'Reconciliation')} 
            />
            {/* Reconciliation -> ConflictResolver */}
            <path 
              d="M 180, 260 L 180, 310" 
              className={getPathClass('Reconciliation', 'ConflictResolver')} 
            />
            {/* ConflictResolver -> TimelineGenerator */}
            <path 
              d="M 180, 360 L 180, 410" 
              className={getPathClass('ConflictResolver', 'TimelineGenerator')} 
            />
          </svg>

          {/* Nodes Layer */}
          <div className="nodes-layer">
            
            {/* Row 1: Multimodal Collectors */}
            <div className="node-row" style={{ marginTop: '20px' }}>
              
              {/* Agent 1 Node */}
              <div className={`agent-node ${getNodeState('VisionAuditor')}`}>
                <div className="node-avatar">
                  <Eye size={20} className={getNodeState('VisionAuditor') === 'active' ? 'spin-anim' : ''} />
                </div>
                <div className="node-name">Vision Auditor</div>
                <div className="node-status">
                  {getNodeState('VisionAuditor') === 'active' && 'Scanning Video...'}
                  {getNodeState('VisionAuditor') === 'completed' && 'Frames Parsed'}
                  {getNodeState('VisionAuditor') === 'idle' && 'Waiting...'}
                </div>
              </div>

              {/* Agent 2 Node */}
              <div className={`agent-node ${getNodeState('CodeArcheologist')}`}>
                <div className="node-avatar">
                  <FileCode size={20} />
                </div>
                <div className="node-name">Code Archeologist</div>
                <div className="node-status">
                  {getNodeState('CodeArcheologist') === 'active' && 'Diffing JS/Commits...'}
                  {getNodeState('CodeArcheologist') === 'completed' && 'AST Diff Complete'}
                  {getNodeState('CodeArcheologist') === 'idle' && 'Waiting...'}
                </div>
              </div>

            </div>

            {/* Row 2: Synthesis Engine Node 1 - Reconciliation */}
            <div className="node-row">
              <div className={`agent-node ${getNodeState('Reconciliation')}`} style={{ width: '220px' }}>
                <div className="node-avatar">
                  <GitCompare size={20} />
                </div>
                <div className="node-name">1. Reconciliation Node</div>
                <div className="node-status">
                  {getNodeState('Reconciliation') === 'active' && 'Merging features...'}
                  {getNodeState('Reconciliation') === 'completed' && 'Merged Candidates'}
                  {getNodeState('Reconciliation') === 'idle' && 'Idle'}
                </div>
              </div>
            </div>

            {/* Row 3: Synthesis Engine Node 2 - Conflict Resolver */}
            <div className="node-row">
              <div className={`agent-node ${getNodeState('ConflictResolver')}`} style={{ width: '220px' }}>
                <div className="node-avatar">
                  <AlertTriangle size={20} />
                </div>
                <div className="node-name">2. Conflict Resolver</div>
                <div className="node-status">
                  {getNodeState('ConflictResolver') === 'active' && 'Auditing claims...'}
                  {getNodeState('ConflictResolver') === 'completed' && 'Discrepancies Solved'}
                  {getNodeState('ConflictResolver') === 'idle' && 'Idle'}
                </div>
              </div>
            </div>

            {/* Row 4: Synthesis Engine Node 3 - Timeline Generator */}
            <div className="node-row" style={{ marginBottom: '20px' }}>
              <div className={`agent-node ${getNodeState('TimelineGenerator')}`} style={{ width: '220px' }}>
                <div className="node-avatar">
                  <CalendarRange size={20} />
                </div>
                <div className="node-name">3. Timeline Generator</div>
                <div className="node-status">
                  {getNodeState('TimelineGenerator') === 'active' && 'Mapping roadmap...'}
                  {getNodeState('TimelineGenerator') === 'completed' && 'Roadmap Rendered'}
                  {getNodeState('TimelineGenerator') === 'idle' && 'Idle'}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
