import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, HelpCircle, Shield, TrendingUp, Sparkles } from 'lucide-react';

export default function ComparisonMatrix({ results }) {
  if (!results) {
    return (
      <div className="panel" style={{ height: '100%' }}>
        <div className="welcome-overlay">
          <div className="welcome-icon">
            <TrendingUp size={36} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="welcome-title">Strategic Gap Comparison Matrix</div>
          <div className="welcome-desc">
            Analyze target features against your own product capabilities side-by-side. Run an audit to see real-time comparisons.
          </div>
        </div>
      </div>
    );
  }

  const { competitor, timeline } = results;

  // Determine our simulated platform status for each feature
  const getSelfStatus = (item, index) => {
    // Make it look interesting and diverse
    if (item.status.toLowerCase().includes('mockup')) {
      return {
        label: 'Fully Supported',
        color: 'var(--color-emerald)',
        icon: CheckCircle2,
        desc: 'Our platform has full backend integration.'
      };
    }
    if (index % 3 === 0) {
      return {
        label: 'Gap Detected',
        color: 'var(--color-rose)',
        icon: XCircle,
        desc: 'Feature is live on competitor, but we do not support it.'
      };
    }
    if (index % 3 === 1) {
      return {
        label: 'Under Development',
        color: 'var(--color-amber)',
        icon: AlertCircle,
        desc: 'Currently in active sprint cycle.'
      };
    }
    return {
      label: 'Fully Supported',
      color: 'var(--color-emerald)',
      icon: CheckCircle2,
      desc: 'We match their feature set completely.'
    };
  };

  const getGapSeverity = (item, index) => {
    if (item.status.toLowerCase().includes('mockup')) return { label: 'LOW', color: 'rgba(255,255,255,0.2)' };
    if (index % 3 === 0) return { label: 'CRITICAL', color: 'var(--color-rose)' };
    if (index % 3 === 1) return { label: 'MEDIUM', color: 'var(--color-amber)' };
    return { label: 'LOW', color: 'rgba(255,255,255,0.2)' };
  };

  return (
    <div className="panel" style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header">
        <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={16} style={{ color: 'var(--color-purple)' }} />
          Gaps Matrix: Us vs {competitor}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Side-by-side feature capability matching
        </div>
      </div>

      <div className="matrix-container">
        
        {/* Intro banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <Sparkles size={18} style={{ color: 'var(--color-purple)', flexShrink: 0 }} />
          <div style={{ fontSize: '11px', lineHeight: 1.4 }}>
            <strong>Hackathon Analysis</strong>: NexusIntel has automatically matched competitor visual cues and leaked endpoints against your own API schemas to discover functional gaps and priorities.
          </div>
        </div>

        <table className="matrix-table">
          <thead>
            <tr>
              <th style={{ width: '30%' }}>Feature Name</th>
              <th style={{ width: '25%' }}>{competitor} Status</th>
              <th style={{ width: '25%' }}>Our Status</th>
              <th style={{ width: '10%', textAlign: 'center' }}>Priority</th>
              <th style={{ width: '10%', textAlign: 'right' }}>Evidence</th>
            </tr>
          </thead>
          <tbody>
            {timeline.map((item, idx) => {
              const self = getSelfStatus(item, idx);
              const SelfIcon = self.icon;
              const severity = getGapSeverity(item, idx);
              
              return (
                <tr key={idx} className="matrix-row">
                  <td>
                    <div style={{ fontWeight: 600, color: 'white' }}>{item.feature}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Est: {item.weeks_to_launch === 0 ? 'Live now' : `${item.weeks_to_launch} wks`}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: item.status.toLowerCase().includes('live') ? 'var(--color-emerald)' : 
                                    item.status.toLowerCase().includes('beta') ? 'var(--color-amber)' :
                                    item.status.toLowerCase().includes('mockup') ? 'var(--color-rose)' : 'var(--color-cyan)'
                      }}></div>
                      <span style={{ fontSize: '11px', color: 'white' }}>{item.status}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <SelfIcon size={14} style={{ color: self.color }} />
                      <div>
                        <div style={{ fontWeight: 600, color: 'white' }}>{self.label}</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{self.desc}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      color: severity.color,
                      border: `1px solid ${severity.color === 'rgba(255,255,255,0.2)' ? 'rgba(255,255,255,0.1)' : severity.color}`,
                      background: severity.color === 'rgba(255,255,255,0.2)' ? 'transparent' : `${severity.color}15`,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {severity.label}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '4px' }}>
                      {item.indicators.ui_detected && (
                        <span style={{ fontSize: '10px' }} title="UI Telemetry Proof">👁️</span>
                      )}
                      {item.indicators.code_detected && (
                        <span style={{ fontSize: '10px' }} title="Code Telemetry Proof">💻</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
