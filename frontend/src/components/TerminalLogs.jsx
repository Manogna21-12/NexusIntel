import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Shield } from 'lucide-react';

export default function TerminalLogs({ logs }) {
  const terminalEndRef = useRef(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    // Scroll to bottom when new logs arrive
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const filteredLogs = logs.filter(log => {
    if (filter === 'ALL') return true;
    return log.agent === filter;
  });

  const getAgentInfo = (agent) => {
    switch (agent) {
      case 'VisionAuditor':
        return { tag: '👁️ SCREEN', color: 'var(--color-purple)' };
      case 'CodeArcheologist':
        return { tag: '💻 CODE', color: 'var(--color-cyan)' };
      case 'Reconciliation':
        return { tag: '🔄 COMPARER', color: 'var(--color-indigo)' };
      case 'ConflictResolver':
        return { tag: '⚠️ RESOLVER', color: 'var(--color-amber)' };
      case 'TimelineGenerator':
        return { tag: '📅 ROADMAP', color: 'var(--color-emerald)' };
      case 'Orchestrator':
      default:
        return { tag: '🚀 SWARM', color: '#ffffff' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '10px 16px', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'VisionAuditor', 'CodeArcheologist', 'SynthesisEngine'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                background: filter === tab ? 'rgba(255,255,255,0.06)' : 'transparent',
                border: filter === tab ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                color: filter === tab ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '10px',
                padding: '3px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontWeight: '500',
                transition: 'var(--transition-smooth)'
              }}
            >
              {tab === 'ALL' ? 'ALL' : tab.replace('Auditor', '').replace('Archeologist', '').replace('Engine', '')}
            </button>
          ))}
        </div>
      </div>
      <div className="panel-content" style={{ padding: '12px', display: 'flex', flexDirection: 'column', height: 'calc(100% - 46px)', overflow: 'hidden' }}>
        <div className="terminal-window" style={{ flex: 1, minHeight: 0 }}>
          <div className="terminal-header">
            <div className="terminal-buttons">
              <span className="term-btn"></span>
              <span className="term-btn"></span>
              <span className="term-btn"></span>
            </div>
            <span className="terminal-tab">bash - nexusintel_daemon.sh</span>
            <Shield size={11} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="terminal-body" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
            {filteredLogs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '10px' }}>
                Console idle. Awaiting targets...
              </div>
            ) : (
              filteredLogs.map((log, index) => {
                const info = getAgentInfo(log.agent);
                return (
                  <div key={index} style={{ marginBottom: '4px', lineHeight: 1.4 }}>
                    <span style={{ color: info.color, fontWeight: 700, marginRight: '8px' }}>[{info.tag}]</span>
                    <span style={{ color: '#e4e4e7' }}>{log.message}</span>
                  </div>
                );
              })
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
