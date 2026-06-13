import React, { useState } from 'react';
import { Eye, FileCode, GitCompare, AlertTriangle, Calendar, ShieldCheck, Cpu, ArrowRight, Layers, Workflow, CheckCircle, Search, HelpCircle, Code } from 'lucide-react';

export default function AboutPage() {
  const [activeNode, setActiveNode] = useState('vision');

  const nodeDetails = {
    vision: {
      title: '👁️ Screen Scanner (Vision AI Prompt)',
      prompt: `Extract feature names, visual component states (buttons, graphs, canvas inputs), and details from screenshots. Identify if features are labeled as "mock", "coming soon", or "live".`,
      output: `{
  "feature": "Brainstorm AI Canvas",
  "status": "Mockup",
  "indicators": { "ui_detected": true }
}`,
      accent: 'var(--color-purple)'
    },
    code: {
      title: '💻 Code Inspector (Code AI Prompt)',
      prompt: `Audit codebase script bundles, index files, and git diff logs. Search for routing strings, API endpoints, and configuration flags matching target features.`,
      output: `{
  "feature": "Brainstorm AI Canvas",
  "status": "Closed Beta",
  "indicators": { "code_detected": true, "endpoints": ["/api/canvas/save"] }
}`,
      accent: 'var(--color-cyan)'
    },
    synthesis: {
      title: '🔄 Feature Comparer (Data Merger Prompt)',
      prompt: `Reconcile the findings from visual assets against backend telemetry. Solve conflicts: if UI is present but code is missing, label as "Mockup". If feature flags disable it, label as "Closed Beta".`,
      output: `{
  "feature": "Brainstorm AI Canvas",
  "status": "Mockup (Draft)",
  "resolution": "Deemed a Marketing Mockup (UI is visible, but zero code backend found)."
}`,
      accent: 'var(--color-indigo)'
    }
  };

  return (
    <div style={{ padding: '24px 32px', overflowY: 'auto', height: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Hero Header Section */}
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '20px', marginBottom: '12px' }}>
          <Workflow size={13} style={{ color: '#8b5cf6' }} />
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '1px' }}>Hackathon 2026 Innovation</span>
        </div>
        <h1 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-1.5px', background: 'linear-gradient(to right, #ffffff, #a78bfa, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 10px 0' }}>
          NexusIntel Engine Blueprint
        </h1>
        <p style={{ fontSize: '14px', color: '#a1a1aa', maxWidth: '600px', margin: '0 auto', lineHeight: 1.4 }}>
          An autonomous, multi-agent reverse-engineering platform. It tracks public video announcements and codebases side-by-side to expose competitor gaps instantly.
        </p>
      </div>

      {/* Interactive Workflow Schema Diagram */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <Layers size={16} style={{ color: 'var(--color-purple)' }} />
          Interactive Swarm Workflow
        </h2>

        {/* Visual Diagram Box */}
        <div style={{
          background: 'rgba(15, 15, 30, 0.4)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          alignItems: 'stretch'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            
            {/* 1. Input Assets Node */}
            <div style={{ flex: 1, minWidth: '150px', background: 'rgba(255,255,255,0.015)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>1. Competitor Inputs</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'white' }}>
                <span>🎥</span> Youtube Demo video
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'white' }}>
                <span>💻</span> GitHub Repository
              </div>
            </div>

            {/* Connecting Arrow */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="flow-line-animated" style={{ width: '40px', height: '2px', opacity: 0.8 }} />
              <ArrowRight size={14} style={{ color: 'var(--color-purple)', marginTop: '-8px' }} />
            </div>

            {/* 2. Swarm Agents Node (glowing) */}
            <div style={{ flex: 2, minWidth: '300px', background: 'rgba(139, 92, 246, 0.02)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-purple)' }}>2. Orchestrated Agents (Click to inspect prompt)</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <button 
                  onClick={() => setActiveNode('vision')}
                  style={{
                    background: activeNode === 'vision' ? 'rgba(167, 139, 250, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid',
                    borderColor: activeNode === 'vision' ? 'var(--color-purple)' : 'rgba(255,255,255,0.05)',
                    color: 'white',
                    padding: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 600,
                    textAlign: 'center',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  👁️ Screen Scanner
                </button>
                <button 
                  onClick={() => setActiveNode('code')}
                  style={{
                    background: activeNode === 'code' ? 'rgba(34, 211, 238, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid',
                    borderColor: activeNode === 'code' ? 'var(--color-cyan)' : 'rgba(255,255,255,0.05)',
                    color: 'white',
                    padding: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 600,
                    textAlign: 'center',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  💻 Code Inspector
                </button>
                <button 
                  onClick={() => setActiveNode('synthesis')}
                  style={{
                    background: activeNode === 'synthesis' ? 'rgba(129, 140, 248, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid',
                    borderColor: activeNode === 'synthesis' ? 'var(--color-indigo)' : 'rgba(255,255,255,0.05)',
                    color: 'white',
                    padding: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 600,
                    textAlign: 'center',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  🔄 Comparer Merger
                </button>
              </div>
            </div>

            {/* Connecting Arrow */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="flow-line-animated" style={{ width: '40px', height: '2px', opacity: 0.8 }} />
              <ArrowRight size={14} style={{ color: 'var(--color-emerald)', marginTop: '-8px' }} />
            </div>

            {/* 3. Output Strategic Report */}
            <div style={{ flex: 1, minWidth: '150px', background: 'rgba(52, 211, 153, 0.02)', border: '1px solid rgba(52, 211, 153, 0.2)', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--color-emerald)' }}>3. Intelligence Output</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'white' }}>
                <span>📅</span> Strategic Roadmap
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'white' }}>
                <span>📊</span> Gaps Matrix
              </div>
            </div>

          </div>

          {/* Active Node Detail Lookup Box */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '20px',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '20px'
          }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: nodeDetails[activeNode].accent, marginBottom: '6px' }}>
                {nodeDetails[activeNode].title}
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {nodeDetails[activeNode].prompt}
              </p>
            </div>
            <div>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Structured Engine Output
              </div>
              <pre style={{
                margin: 0,
                padding: '10px',
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                color: 'var(--color-cyan)',
                overflowX: 'auto'
              }}>
                {nodeDetails[activeNode].output}
              </pre>
            </div>
          </div>

        </div>
      </div>

      {/* Step-by-Step Operations Guide */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <Cpu size={16} style={{ color: 'var(--color-cyan)' }} />
          Operations & Features Guide
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          
          {/* Card 1 */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', display: 'flex', gap: '12px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-purple)25', color: 'var(--color-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>1</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>Load Pre-Configured Targets</div>
              <p style={{ fontSize: '11px', color: '#a1a1aa', lineHeight: 1.4 }}>
                Choose a preset competitor to automatically populate verification links. Switch to **Custom Target** to supply custom YouTube or repo links.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', display: 'flex', gap: '12px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-cyan)25', color: 'var(--color-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>2</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>Audit with Swarm Speed Controls</div>
              <p style={{ fontSize: '11px', color: '#a1a1aa', lineHeight: 1.4 }}>
                Run the audit and watch real-time LangGraph state updates. Pause or accelerate playback using the delay speed slider.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px', display: 'flex', gap: '12px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--color-emerald)25', color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>3</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>Explore Telemetry Gaps</div>
              <p style={{ fontSize: '11px', color: '#a1a1aa', lineHeight: 1.4 }}>
                Search, filter, or download the markdown report. Click timeline cards to inspect the code block diffs and OCR verification details in the sidebar.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Technology Integration Footer */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#71717a' }}>
        <span>Powered by Gemini Multimodal API Models</span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={13} /> Secure Sandbox</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Workflow size={13} /> LangGraph Multi-Agent Workflows</span>
        </div>
      </div>

    </div>
  );
}
