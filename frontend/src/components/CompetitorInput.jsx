import React, { useState, useEffect } from 'react';
import { Play, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

export default function CompetitorInput({ onStartAnalysis, isAnalyzing }) {
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);
  
  const [competitorName, setCompetitorName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [bundleUrl, setBundleUrl] = useState('');
  const [apiKey, setApiKey] = useState('');

  // Load presets from backend
  useEffect(() => {
    fetch('/api/presets')
      .then(res => res.json())
      .then(data => {
        setPresets(data);
        // Set default preset
        if (data.length > 0) {
          applyPreset(data[0]);
        }
      })
      .catch(err => console.error("Error loading presets:", err));
  }, []);

  const applyPreset = (preset) => {
    setSelectedPreset(preset.id);
    setCompetitorName(preset.name);
    setVideoUrl(preset.video_url);
    setRepoUrl(preset.repo_url);
    setBundleUrl(preset.bundle_url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!competitorName.trim()) return;
    
    onStartAnalysis({
      competitor_name: competitorName,
      video_url: videoUrl,
      repo_url: repoUrl,
      bundle_url: bundleUrl,
      api_key: apiKey
    });
  };

  const getPresetMeta = (id) => {
    if (id === 'taskflow') {
      return {
        icon: '📝',
        tags: ['Management', '🎥 2m Video', '💻 Git Repo'],
        color: 'var(--color-purple)'
      };
    }
    if (id === 'supadb') {
      return {
        icon: '🗄️',
        tags: ['Database', '🎥 1m Demo', '📁 Bundle JS'],
        color: 'var(--color-cyan)'
      };
    }
    return {
      icon: '⚙️',
      tags: ['Custom', '🔍 Manual Setup'],
      color: 'var(--color-indigo)'
    };
  };

  return (
    <div className="panel-content" style={{ padding: '16px 20px', height: '100%', overflowY: 'auto' }}>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <span className="form-label">Competitor Presets</span>
          <div className="presets-container">
            {presets.map(p => {
              const meta = getPresetMeta(p.id);
              return (
                <div 
                  key={p.id} 
                  className={`preset-card ${selectedPreset === p.id ? 'active' : ''}`}
                  onClick={() => applyPreset(p)}
                  style={{
                    borderColor: selectedPreset === p.id ? meta.color : undefined,
                    background: selectedPreset === p.id ? `${meta.color}05` : undefined
                  }}
                >
                  <div className="preset-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                    <span style={{ fontSize: '14px' }}>{meta.icon}</span>
                    {p.name}
                  </div>
                  <div className="preset-desc" style={{ marginBottom: '8px' }}>{p.description}</div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {meta.tags.map((tag, i) => (
                      <span key={i} style={{ fontSize: '8px', padding: '2px 6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', color: 'var(--text-secondary)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
            <div 
              className={`preset-card ${selectedPreset === 'custom' ? 'active' : ''}`}
              onClick={() => {
                setSelectedPreset('custom');
                setCompetitorName('');
                setVideoUrl('');
                setRepoUrl('');
                setBundleUrl('');
              }}
              style={{
                borderColor: selectedPreset === 'custom' ? 'var(--color-indigo)' : undefined,
                background: selectedPreset === 'custom' ? 'rgba(129, 140, 248, 0.05)' : undefined
              }}
            >
              <div className="preset-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <span style={{ fontSize: '14px' }}>🌐</span>
                Custom Competitor Target
              </div>
              <div className="preset-desc" style={{ marginBottom: '8px' }}>Input custom URLs to audit target site updates.</div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ fontSize: '8px', padding: '2px 6px', background: 'rgba(129, 140, 248, 0.1)', border: '1px solid rgba(129, 140, 248, 0.2)', borderRadius: '10px', color: 'var(--color-indigo)' }}>
                  ✨ Real-time Audit
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Competitor Name</label>
          <input 
            type="text" 
            className="form-input" 
            required
            placeholder="e.g. Linear"
            value={competitorName}
            onChange={e => setCompetitorName(e.target.value)}
            disabled={isAnalyzing}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Demonstration Video URL (Agent 1)</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. YouTube URL or mp4 file path"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            disabled={isAnalyzing}
          />
        </div>

        <div className="form-group">
          <label className="form-label">GitHub Repository URL (Agent 2)</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. github.com/competitor/app"
            value={repoUrl}
            onChange={e => setRepoUrl(e.target.value)}
            disabled={isAnalyzing}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Public Script/Bundle URL (Agent 2)</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="e.g. app.com/assets/index.js"
            value={bundleUrl}
            onChange={e => setBundleUrl(e.target.value)}
            disabled={isAnalyzing}
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Gemini API Key (Optional)
            <span style={{ fontSize: '10px', textTransform: 'none', color: 'var(--text-muted)' }}>(Supports live analysis)</span>
          </label>
          <input 
            type="password" 
            className="form-input code-font" 
            placeholder="AIzaSy..."
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            disabled={isAnalyzing}
          />
          {apiKey ? (
            <div style={{ fontSize: '10px', color: 'var(--text-primary)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ffffff' }}></div>
              Gemini Live Mode Activated
            </div>
          ) : (
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#27272a' }}></div>
              Simulated Sandbox Mode (No API keys needed)
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isAnalyzing || !competitorName}
          style={{ marginTop: '8px' }}
        >
          <Play size={13} fill="black" />
          {isAnalyzing ? 'Executing Agent Swarm...' : 'Audit Competitor'}
        </button>

      </form>
    </div>
  );
}
