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

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <div className="panel-title">
          <Terminal size={18} className="icon-glow" style={{ color: 'var(--color-cyan)' }} />
          Audit Console Logs
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'VisionAuditor', 'CodeArcheologist', 'SynthesisEngine'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                background: filter === tab ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: 'none',
                color: filter === tab ? 'white' : 'var(--text-secondary)',
                fontSize: '10px',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontWeight: '600',
                transition: 'var(--transition-smooth)'
              }}
            >
              {tab === 'ALL' ? 'ALL' : tab.replace('Auditor', '').replace('Archeologist', '').replace('Engine', '')}
            </button>
          ))}
        </div>
      </div>
      <div className="panel-content" style={{ padding: '12px', display: 'flex', flexDirection: 'column' }}>
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-buttons">
              <span className="term-btn red"></span>
              <span className="term-btn yellow"></span>
              <span className="term-btn green"></span>
            </div>
            <span className="terminal-tab">bash - nexusintel_daemon.sh</span>
            <Shield size={12} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="terminal-body">
            {filteredLogs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic', padding: '10px' }}>
                Console idle. Awaiting targets...
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <div key={index} className={`log-line ${log.agent}`}>
                  <span className="tag">[{log.agent}]</span>
                  <span className="msg">{log.message}</span>
                </div>
              ))
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
