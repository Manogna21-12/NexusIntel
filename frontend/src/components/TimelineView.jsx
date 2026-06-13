import React, { useState } from 'react';
import { Calendar, AlertTriangle, Eye, FileCode, Download, Search, Filter, Maximize2 } from 'lucide-react';

export default function TimelineView({ results, isAnalyzing, onSelectCard }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  if (isAnalyzing) {
    return (
      <div className="panel timeline-panel" style={{ height: '100%' }}>
        <div className="welcome-overlay">
          <div className="welcome-icon spin-anim" style={{ color: 'var(--color-purple)' }}>
            <Calendar size={36} />
          </div>
          <div className="welcome-title">Reconciling Competitor Features...</div>
          <div className="welcome-desc">
            Resolving visual demo mockups with codebase diffs. Assembling roadmap...
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
            <Calendar size={36} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="welcome-title">Reconciled Strategic Roadmap</div>
          <div className="welcome-desc">
            Choose a preset target or enter a custom competitor URL to trigger multi-agent synthesis.
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
    return 'badge-status mockup';
  };

  const getStatusLabel = (status) => {
    if (status.includes('Mockup')) return 'Mockup (Draft)';
    if (status.includes('Flag')) return 'Closed Beta (Testing)';
    if (status.includes('Development') || status.includes('API')) return 'Stealth API (Hidden)';
    return 'Live (Active)';
  };

  const getStatusCardClass = (status) => {
    const s = status.toLowerCase();
    if (s.includes('live')) return 'live';
    if (s.includes('closed beta') || s.includes('flag')) return 'beta';
    if (s.includes('development') || s.includes('api')) return 'development';
    return 'mockup';
  };

  const exportReport = () => {
    let mdContent = `# NexusIntel Strategic Roadmap: ${competitor}\n`;
    mdContent += `Generated At: ${generated_at}\n`;
    mdContent += `Evidence Integrity Score: ${Math.round(overall_integrity * 100)}%\n\n`;
    
    mdContent += `## Synthesized Roadmap Timeline\n\n`;
    timeline.forEach((item, index) => {
      mdContent += `### ${index + 1}. ${item.feature} (${item.status})\n`;
      mdContent += `- **Details**: ${item.details}\n`;
      mdContent += `- **Estimated Launch**: ${item.weeks_to_launch === 0 ? 'Available Now' : `In ${item.weeks_to_launch} Weeks`}\n`;
      mdContent += `- **Evidence Level**: UI Detected: ${item.indicators.ui_detected ? 'Yes' : 'No'}, Code Detected: ${item.indicators.code_detected ? 'Yes' : 'No'}\n`;
      if (item.indicators.endpoints && item.indicators.endpoints.length > 0) {
        mdContent += `- **Leaked Endpoints**:\n`;
        item.indicators.endpoints.forEach(ep => {
          mdContent += `  - \`${ep}\`\n`;
        });
      }
      mdContent += `\n`;
    });

    if (conflicts && conflicts.length > 0) {
      mdContent += `## Resolved Marketing & Codebase Conflicts\n\n`;
      conflicts.forEach(c => {
        mdContent += `### ⚠️ Feature: ${c.feature} (${c.type})\n`;
        mdContent += `- **Resolution**: ${c.description}\n\n`;
      });
    }

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nexusintel_roadmap_${competitor.toLowerCase().replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logic
  const filteredTimeline = timeline.filter(item => {
    const matchesSearch = item.feature.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    const s = item.status.toLowerCase();
    if (statusFilter === 'LIVE' && s.includes('live')) return matchesSearch;
    if (statusFilter === 'BETA' && (s.includes('beta') || s.includes('flag'))) return matchesSearch;
    if (statusFilter === 'STEALTH' && (s.includes('development') || s.includes('api'))) return matchesSearch;
    if (statusFilter === 'MOCKUP' && s.includes('mockup')) return matchesSearch;
    return false;
  });

  return (
    <div className="panel timeline-panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={16} style={{ color: 'var(--color-indigo)' }} />
          Synthesized Competitor Roadmap: {competitor}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <span>Integrity Score: <strong style={{ color: 'var(--color-emerald)' }}>{Math.round(overall_integrity * 100)}%</strong></span>
          <span>Compiled: <strong>{generated_at}</strong></span>
          <button 
            onClick={exportReport}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#ffffff',
              fontSize: '10px',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 500,
              transition: 'var(--transition-smooth)'
            }}
          >
            <Download size={11} />
            Export Markdown
          </button>
        </div>
      </div>
      
      <div className="panel-content" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Swarm Metrics Summary Bento Grid Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '4px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.03) 0%, rgba(129, 140, 248, 0.01) 100%)', 
            border: '1px solid rgba(129, 140, 248, 0.15)', 
            boxShadow: '0 4px 12px rgba(129, 140, 248, 0.03)',
            borderRadius: '8px', 
            padding: '12px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-indigo)' }}>{timeline.length}</div>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 600 }}>Features Found</div>
          </div>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(248, 113, 113, 0.03) 0%, rgba(248, 113, 113, 0.01) 100%)', 
            border: '1px solid rgba(248, 113, 113, 0.15)', 
            boxShadow: '0 4px 12px rgba(248, 113, 113, 0.03)',
            borderRadius: '8px', 
            padding: '12px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-rose)' }}>{conflicts ? conflicts.length : 0}</div>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 600 }}>Mockups Solved</div>
          </div>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.03) 0%, rgba(34, 211, 238, 0.01) 100%)', 
            border: '1px solid rgba(34, 211, 238, 0.15)', 
            boxShadow: '0 4px 12px rgba(34, 211, 238, 0.03)',
            borderRadius: '8px', 
            padding: '12px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-cyan)' }}>
              {timeline.length > 0 ? Math.round(timeline.reduce((acc, curr) => acc + curr.weeks_to_launch, 0) / timeline.length) : 0} Wk
            </div>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 600 }}>Avg Launch Time</div>
          </div>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.03) 0%, rgba(52, 211, 153, 0.01) 100%)', 
            border: '1px solid rgba(52, 211, 153, 0.15)', 
            boxShadow: '0 4px 12px rgba(52, 211, 153, 0.03)',
            borderRadius: '8px', 
            padding: '12px', 
            textAlign: 'center' 
          }}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-emerald)' }}>{Math.round(overall_integrity * 100)}%</div>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 600 }}>Swarm Integrity</div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.01)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '8px 12px',
          marginBottom: '4px'
        }}>
          {/* Search box */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={12} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search competitor features..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                fontSize: '11px',
                padding: '6px 12px 6px 28px',
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <Filter size={11} style={{ color: 'var(--text-muted)', marginRight: '4px' }} />
            {[
              { id: 'ALL', label: 'All', color: '#ffffff' },
              { id: 'LIVE', label: '🟢 Live', color: 'var(--color-emerald)' },
              { id: 'BETA', label: '🟡 Beta', color: 'var(--color-amber)' },
              { id: 'STEALTH', label: '🔵 Stealth', color: 'var(--color-cyan)' },
              { id: 'MOCKUP', label: '🔴 Mockup', color: 'var(--color-rose)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  background: statusFilter === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                  border: '1px solid',
                  borderColor: statusFilter === tab.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                  color: statusFilter === tab.id ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '10px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: statusFilter === tab.id ? 600 : 500,
                  transition: 'var(--transition-smooth)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conflicts Banner Section */}
        {conflicts && conflicts.length > 0 && (
          <div className="conflicts-wrapper">
            {conflicts.map((c, i) => (
              <div key={i} className="conflict-banner" style={{ background: 'rgba(248, 113, 113, 0.02)', border: '1px solid rgba(248, 113, 113, 0.1)' }}>
                <AlertTriangle size={13} className="conflict-banner-icon" style={{ marginTop: '2px' }} />
                <div className="conflict-banner-content">
                  <div className="conflict-banner-title" style={{ color: 'var(--color-rose)', fontSize: '11px', fontWeight: 600 }}>Mockup Claims Solved: {c.feature}</div>
                  <div className="conflict-banner-desc" style={{ fontSize: '10px', marginTop: '1px' }}>{c.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline Cards Row */}
        <div className="timeline-scroller">
          {filteredTimeline.length === 0 ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic' }}>
              No competitor features match this search filter.
            </div>
          ) : (
            filteredTimeline.map((item, index) => {
              const cardClass = getStatusCardClass(item.status);
              return (
                <div 
                  key={index} 
                  className={`timeline-card ${cardClass}`}
                  onClick={() => onSelectCard(item)}
                  style={{ cursor: 'pointer', position: 'relative' }}
                  title="Click to view detailed telemetry proof files"
                >
                  <div style={{ position: 'absolute', right: '10px', top: '10px', color: 'var(--text-muted)', opacity: 0.3 }}>
                    <Maximize2 size={10} />
                  </div>

                  <div className="card-header-main" style={{ paddingRight: '12px' }}>
                    <div className="feature-title" style={{ fontSize: '13px', fontWeight: 600 }}>{item.feature}</div>
                    <span className={getStatusClass(item.status)} style={{ fontSize: '8px' }}>
                      {getStatusLabel(item.status)}
                    </span>
                  </div>
                  
                  <div className="card-body" style={{ fontSize: '10px', lineHeight: 1.3, height: '70px', overflowY: 'auto' }}>
                    {item.details}
                  </div>

                  {/* Proof pills section */}
                  <div style={{ display: 'flex', gap: '4px', margin: '4px 0 10px 0', flexWrap: 'wrap' }}>
                    {item.indicators.ui_detected ? (
                      <span className="proof-pill detected-ui" style={{ fontSize: '8px', padding: '2px 6px' }}>
                        👁️ Screen Proof
                      </span>
                    ) : null}
                    {item.indicators.code_detected ? (
                      <span className="proof-pill detected-code" style={{ fontSize: '8px', padding: '2px 6px' }}>
                        💻 Code Proof
                      </span>
                    ) : null}
                    {!item.indicators.ui_detected && !item.indicators.code_detected ? (
                      <span className="proof-pill none" style={{ fontSize: '8px', padding: '2px 6px' }}>
                        ❌ Unverified
                      </span>
                    ) : null}
                  </div>

                  <div className="card-meta" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '8px', fontSize: '9px' }}>
                    <div className="meta-item">
                      <span className="meta-label">Est. Launch</span>
                      <span className={`meta-value ${item.weeks_to_launch === 0 ? 'highlight-emerald' : 'highlight-cyan'}`}>
                        {item.weeks_to_launch === 0 ? 'Available Now' : `In ${item.weeks_to_launch} Weeks`}
                      </span>
                    </div>
                    <div className="meta-item" style={{ alignItems: 'flex-end' }}>
                      <span className="meta-label">Confidence</span>
                      <span style={{ 
                        fontWeight: 700, 
                        color: item.status.toLowerCase().includes('mockup') ? 'var(--color-rose)' :
                               item.status.toLowerCase().includes('live') ? 'var(--color-emerald)' : 'var(--color-amber)'
                      }}>
                        {item.status.toLowerCase().includes('mockup') ? 'Low (Mock)' : 'High (Code)'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
