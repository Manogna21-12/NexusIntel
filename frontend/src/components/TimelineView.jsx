import React from 'react';
import { Calendar, AlertTriangle, Eye, FileCode, CheckCircle2, HelpCircle } from 'lucide-react';

export default function TimelineView({ results, isAnalyzing }) {
  if (isAnalyzing) {
    return (
      <div className="panel timeline-panel" style={{ height: '100%' }}>
        <div className="welcome-overlay">
          <div className="welcome-icon spin-anim" style={{ color: 'var(--color-purple)' }}>
            <Calendar size={48} />
          </div>
          <div className="welcome-title">Assembling Competitor Roadmap...</div>
          <div className="welcome-desc">
            Resolving UI layouts with source code AST diffs. Compiling timeline...
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="panel timeline-panel" style={{ height: '100%' }}>
        <div className="welcome-overlay">
          <div className="welcome-icon">
            <Calendar size={48} />
          </div>
          <div className="welcome-title">Reconciled Competitor Timeline</div>
          <div className="welcome-desc">
            Select a target preset or enter a custom competitor URL to trigger multi-agent synthesis.
          </div>
        </div>
      </div>
    );
  }

  const { competitor, conflicts, timeline, overall_integrity, generated_at } = results;

  const getStatusClass = (status) => {
    const s = status.toLowerCase();
    if (s.includes('live')) return 'badge-status live';
    if (s.includes('closed beta') || s.includes('flag')) return 'badge-status beta';
    if (s.includes('development') || s.includes('api')) return 'badge-status development';
    return 'badge-status mockup'; // Visual Mockup / Smoke Test
  };

  const getStatusLabel = (status) => {
    if (status.includes('Mockup')) return 'Mockup';
    if (status.includes('Flag')) return 'Closed Beta';
    if (status.includes('Development') || status.includes('API')) return 'Stealth API';
    return 'Live';
  };

  return (
    <div className="panel timeline-panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} style={{ color: 'var(--color-purple)' }} />
          Synthesized Competitor Roadmap: {competitor}
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <span>Integrity Score: <strong style={{ color: 'var(--color-emerald)' }}>{Math.round(overall_integrity * 100)}%</strong></span>
          <span>Compiled: <strong>{generated_at}</strong></span>
        </div>
      </div>
      <div className="panel-content" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Conflicts Banner Section */}
        {conflicts && conflicts.length > 0 && (
          <div className="conflicts-wrapper">
            {conflicts.map((c, i) => (
              <div key={i} className="conflict-banner">
                <AlertTriangle size={16} className="conflict-banner-icon" />
                <div className="conflict-banner-content">
                  <div className="conflict-banner-title">Conflict Solved: {c.feature} ({c.type})</div>
                  <div className="conflict-banner-desc">{c.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline Cards Row */}
        <div className="timeline-scroller">
          {timeline.map((item, index) => (
            <div key={index} className="timeline-card">
              <div className="card-header-main">
                <div className="feature-title">{item.feature}</div>
                <span className={getStatusClass(item.status)}>
                  {getStatusLabel(item.status)}
                </span>
              </div>
              
              <div className="card-body">
                {item.details}
              </div>

              {item.indicators.endpoints && item.indicators.endpoints.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                    Leaked Endpoints
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {item.indicators.endpoints.map((ep, idx) => (
                      <code key={idx} style={{ fontSize: '10px', padding: '2px 4px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.03)' }}>
                        {ep}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              <div className="card-meta">
                <div className="meta-item">
                  <span className="meta-label">Est. Launch</span>
                  <span className={`meta-value ${item.weeks_to_launch === 0 ? 'highlight-emerald' : 'highlight-cyan'}`}>
                    {item.weeks_to_launch === 0 ? 'Available Now' : `In ${item.weeks_to_launch} Weeks`}
                  </span>
                </div>
                <div className="meta-item" style={{ alignItems: 'flex-end' }}>
                  <span className="meta-label">Evidence Traces</span>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                    <Eye 
                      size={12} 
                      style={{ 
                        color: item.indicators.ui_detected ? 'var(--color-purple)' : 'var(--text-muted)',
                        opacity: item.indicators.ui_detected ? 1 : 0.4 
                      }} 
                      title={item.indicators.ui_detected ? "Detected visually in YouTube demo" : "No UI detected"}
                    />
                    <FileCode 
                      size={12} 
                      style={{ 
                        color: item.indicators.code_detected ? 'var(--color-cyan)' : 'var(--text-muted)',
                        opacity: item.indicators.code_detected ? 1 : 0.4
                      }} 
                      title={item.indicators.code_detected ? "Detected in source JS/Repo diffs" : "No code traces detected"}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
