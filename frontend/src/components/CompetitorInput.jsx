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

  return (
    <div className="panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <div className="panel-title">
          <Cpu size={18} className="icon-glow" style={{ color: 'var(--color-purple)' }} />
          Target Definition
        </div>
      </div>
      <div className="panel-content">
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <span className="form-label">Competitor Presets</span>
            <div className="presets-container">
              {presets.map(p => (
                <div 
                  key={p.id} 
                  className={`preset-card ${selectedPreset === p.id ? 'active' : ''}`}
                  onClick={() => applyPreset(p)}
                >
                  <div className="preset-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={13} style={{ color: selectedPreset === p.id ? 'var(--color-purple)' : 'var(--text-secondary)' }} />
                    {p.name}
                  </div>
                  <div className="preset-desc">{p.description}</div>
                </div>
              ))}
              <div 
                className={`preset-card ${selectedPreset === 'custom' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedPreset('custom');
                  setCompetitorName('');
                  setVideoUrl('');
                  setRepoUrl('');
                  setBundleUrl('');
                }}
              >
                <div className="preset-title">Custom Competitor Target</div>
                <div className="preset-desc">Input custom URLs to audit target site updates.</div>
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
              <div style={{ fontSize: '11px', color: 'var(--color-emerald)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-emerald)' }}></div>
                Gemini 1.5 Pro Live Mode Activated
              </div>
            ) : (
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-purple)' }}></div>
                Simulated Sandbox Mode (No API keys needed)
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isAnalyzing || !competitorName}
          >
            <Play size={15} fill="white" />
            {isAnalyzing ? 'Executing Agent Swarm...' : 'Audit Competitor'}
          </button>

        </form>
      </div>
    </div>
  );
}
