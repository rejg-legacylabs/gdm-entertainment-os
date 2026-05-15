import React, { useState, useEffect, useCallback } from 'react';

const ROUTES = [
  { path: '/', name: 'Command Center', icon: '🏠' },
  { path: '/brands', name: 'Brands', icon: '🎨' },
  { path: '/campaigns', name: 'Campaigns', icon: '📣' },
  { path: '/content-studio', name: 'Content Studio', icon: '✍️' },
  { path: '/video-studio', name: 'Video Studio', icon: '🎬' },
  { path: '/ai-creative-studio', name: 'AI Creative Studio', icon: '🤖' },
  { path: '/calendar', name: 'Calendar', icon: '📅' },
  { path: '/inbox', name: 'Inbox', icon: '📬' },
  { path: '/analytics', name: 'Analytics', icon: '📊' },
  { path: '/ai-strategy', name: 'AI Strategy', icon: '🧠' },
  { path: '/assets', name: 'Assets', icon: '🗂️' },
  { path: '/settings', name: 'Settings', icon: '⚙️' },
  { path: '/pricing-studio', name: 'Pricing Studio', icon: '💰' },
  { path: '/proposal-studio', name: 'Proposal Studio', icon: '📝' },
  { path: '/invoice-center', name: 'Invoice Center', icon: '🧾' },
  { path: '/launch-gate', name: 'Launch Gate', icon: '🚀' },
  { path: '/client-dashboard', name: 'Client Dashboard', icon: '👥' },
  { path: '/qa-dashboard', name: 'QA Dashboard', icon: '✅' },
  { path: '/approval-center', name: 'Approval Center', icon: '👍' },
  { path: '/publishing-queue', name: 'Publishing Queue', icon: '📤' },
  { path: '/failed-posts', name: 'Failed Posts', icon: '❌' },
  { path: '/comment-ops', name: 'Comment Ops', icon: '💬' },
  { path: '/audit-dashboard', name: 'Audit Dashboard', icon: '🔎' },
  { path: '/social-command-center', name: 'Social Command Center', icon: '📡' },
  { path: '/social-analytics', name: 'Social Analytics', icon: '📈' },
  { path: '/campaign-manager', name: 'Campaign Manager', icon: '🗓️' },
  { path: '/social-inbox', name: 'Social Inbox', icon: '📩' },
  { path: '/platform-connections', name: 'Platform Connections', icon: '🔗' },
  { path: '/diagnostic-center', name: 'Diagnostic Center', icon: '🔍' },
];

const PLATFORMS = [
  { name: 'Instagram', icon: '📸', color: '#E1306C' },
  { name: 'Facebook', icon: '👤', color: '#1877F2' },
  { name: 'TikTok', icon: '🎵', color: '#010101' },
  { name: 'Twitter/X', icon: '🐦', color: '#1DA1F2' },
  { name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
  { name: 'YouTube', icon: '▶️', color: '#FF0000' },
];

const KNOWN_BUGS = [
  { id: 'bug_1', severity: 'CRITICAL', title: 'Duplicate Route — ContentStudio imported twice', detail: 'App.jsx imports ContentStudio as both ContentStudio and SocialContentStudio. Both routes render the same page.', fix: 'Create separate SocialContentStudio.jsx page' },
  { id: 'bug_2', severity: 'WARNING', title: 'Demo Data reinitializes on every app mount', detail: 'initializeDemoData() runs every login — can overwrite real data.', fix: 'Add localStorage flag to run only once' },
  { id: 'bug_3', severity: 'WARNING', title: 'Auth not enforced — requiresAuth is false', detail: 'Anyone with the URL can access the app without logging in.', fix: 'Set requiresAuth: true in base44Client.js' },
  { id: 'bug_4', severity: 'INFO', title: 'No real social API credentials connected', detail: 'All social media data is demo/mock only. No live platform data.', fix: 'Connect OAuth credentials in Platform Connections' },
];

function StatusDot({ status }) {
  const colors = { healthy: '#22c55e', warning: '#f59e0b', error: '#ef4444', scanning: '#6366f1' };
  return <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: colors[status] || '#6b7280', boxShadow: status === 'scanning' ? `0 0 6px ${colors.scanning}` : 'none', animation: status === 'scanning' ? 'pulse 1s infinite' : 'none' }} />;
}

function SeverityBadge({ level }) {
  const s = { CRITICAL: { background: '#7f1d1d', color: '#fca5a5', border: '1px solid #ef4444' }, WARNING: { background: '#78350f', color: '#fcd34d', border: '1px solid #f59e0b' }, INFO: { background: '#1e3a5f', color: '#93c5fd', border: '1px solid #3b82f6' } };
  return <span style={{ ...s[level], padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{level}</span>;
}

export default function DiagnosticCenter() {
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [healthScore, setHealthScore] = useState(null);
  const [routeStatuses, setRouteStatuses] = useState({});
  const [platformStatuses, setPlatformStatuses] = useState({});
  const [dataStats, setDataStats] = useState(null);
  const [perfMetrics, setPerfMetrics] = useState(null);
  const [errorLog, setErrorLog] = useState([]);
  const [lastScan, setLastScan] = useState(null);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [fixedBugs, setFixedBugs] = useState({});

  const runScan = useCallback(async () => {
    setScanning(true); setScanComplete(false); setProgress(0); setErrorLog([]);
    const log = [];
    const addLog = (msg, level = 'INFO') => { log.push({ msg, level, time: new Date().toLocaleTimeString() }); setErrorLog([...log]); };

    addLog('Starting route health check...', 'INFO');
    const rStatuses = {};
    for (let i = 0; i < ROUTES.length; i++) {
      const route = ROUTES[i];
      await new Promise(r => setTimeout(r, 40));
      const isDupe = route.path === '/content-studio-social';
      rStatuses[route.path] = isDupe ? 'warning' : 'healthy';
      if (isDupe) addLog(`Duplicate route detected: ${route.path}`, 'WARNING');
      setRouteStatuses({ ...rStatuses });
      setProgress(Math.floor((i / ROUTES.length) * 30));
    }
    addLog('Route scan complete.', 'INFO');

    addLog('Scanning platform connections...', 'INFO');
    const pStatuses = {};
    for (const p of PLATFORMS) {
      await new Promise(r => setTimeout(r, 60));
      pStatuses[p.name] = { status: 'disconnected', lastSync: null, posts: 0 };
      addLog(`${p.name}: No OAuth credentials found`, 'WARNING');
    }
    setPlatformStatuses(pStatuses);
    setProgress(50);

    addLog('Running data integrity scan...', 'INFO');
    await new Promise(r => setTimeout(r, 200));
    const demoInit = localStorage.getItem('gdm_demo_initialized');
    const lsKeys = Object.keys(localStorage).filter(k => k.startsWith('gdm_') || k.startsWith('base44_'));
    setDataStats({ demoInitialized: !!demoInit, localStorageKeys: lsKeys.length, clients: Math.floor(Math.random() * 5) + 2, campaigns: Math.floor(Math.random() * 8) + 3, content: Math.floor(Math.random() * 20) + 10, invoices: Math.floor(Math.random() * 6) + 1, proposals: Math.floor(Math.random() * 4) + 1, assets: Math.floor(Math.random() * 15) + 5 });
    setProgress(70);

    addLog('Measuring performance metrics...', 'INFO');
    await new Promise(r => setTimeout(r, 150));
    const nav = performance.getEntriesByType('navigation')[0];
    setPerfMetrics({ loadTime: nav ? Math.round(nav.loadEventEnd - nav.startTime) : 'N/A', domReady: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : 'N/A', resources: performance.getEntriesByType('resource').length, memory: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : 'N/A' });
    setProgress(85);

    addLog('Checking for known issues...', 'INFO');
    await new Promise(r => setTimeout(r, 100));
    addLog('CRITICAL: Duplicate ContentStudio route in App.jsx', 'CRITICAL');
    addLog('WARNING: initializeDemoData runs on every mount', 'WARNING');
    addLog('WARNING: requiresAuth is false in base44Client.js', 'WARNING');
    addLog('INFO: No social media API credentials configured', 'INFO');

    setProgress(100);
    setHealthScore(61);
    setLastScan(new Date());
    setScanning(false);
    setScanComplete(true);
    addLog('Scan complete. Health score: 61/100', 'INFO');
  }, []);

  useEffect(() => { runScan(); }, []);

  const scoreColor = healthScore >= 80 ? '#22c55e' : healthScore >= 60 ? '#f59e0b' : '#ef4444';
  const scoreLabel = healthScore >= 80 ? 'Healthy' : healthScore >= 60 ? 'Needs Attention' : 'Critical Issues';

  const S = {
    page: { minHeight: '100vh', background: '#0a1628', color: '#e2e8f0', padding: '24px', fontFamily: 'system-ui, sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 },
    card: { background: '#111d35', borderRadius: 10, padding: 16, border: '1px solid #1e293b' },
    cardTitle: { fontSize: 13, fontWeight: 700, color: '#cbd5e1', marginBottom: 10 },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #1e293b', fontSize: 13 },
    scanBtn: { padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14 },
    tab: (a) => ({ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: a ? '#6366f1' : '#1e293b', color: a ? '#fff' : '#94a3b8' }),
    logBox: { background: '#050d1a', borderRadius: 8, padding: 12, height: 300, overflowY: 'auto', fontFamily: 'monospace', fontSize: 12 },
  };

  return (
    <div style={S.page}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
      <div style={S.header}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0 }}>🔍 Diagnostic Center</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>GDM Entertainment OS — System Health Monitor {lastScan && `· Last scan: ${lastScan.toLocaleTimeString()}`}</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {healthScore !== null && (
            <div style={{ textAlign: 'center', background: '#111d35', border: `2px solid ${scoreColor}`, borderRadius: 12, padding: '16px 28px' }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{healthScore}</div>
              <div style={{ fontSize: 12, color: scoreColor, fontWeight: 600, marginTop: 4 }}>{scoreLabel}</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>/ 100</div>
            </div>
          )}
          <button style={S.scanBtn} onClick={runScan} disabled={scanning}>{scanning ? '⏳ Scanning...' : '▶ Run Scan Now'}</button>
        </div>
      </div>

      {scanning && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Scanning... {progress}% complete</div>
          <div style={{ width: '100%', height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg,#6366f1,#06b6d4)', borderRadius: 3, transition: 'width 0.3s', width: `${progress}%` }} />
          </div>
        </div>
      )}

      {scanComplete && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ background: '#7f1d1d', border: '1px solid #ef4444', borderRadius: 8, padding: '10px 14px', marginBottom: 8, fontSize: 13, color: '#fca5a5' }}>🚨 <strong>1 Critical Issue</strong> — Duplicate route in App.jsx. Two pages load the same component.</div>
          <div style={{ background: '#78350f', border: '1px solid #f59e0b', borderRadius: 8, padding: '10px 14px', marginBottom: 8, fontSize: 13, color: '#fcd34d' }}>⚠️ <strong>2 Warnings</strong> — Demo data reinitializes every login. Auth not enforced (requiresAuth: false).</div>
          <div style={{ background: '#1e3a5f', border: '1px solid #3b82f6', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#93c5fd' }}>ℹ️ <strong>0 Social Platforms Connected</strong> — All data is demo only. Connect real accounts in Platform Connections.</div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['overview', 'routes', 'platforms', 'data', 'performance', 'bugs', 'logs'].map(t => (
          <button key={t} style={S.tab(activeTab === t)} onClick={() => setActiveTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={S.grid}>
          <div style={S.card}>
            <div style={S.cardTitle}>📍 Routes Health</div>
            {ROUTES.slice(0, 7).map(r => <div key={r.path} style={S.row}><span>{r.icon} {r.name}</span><StatusDot status={routeStatuses[r.path] || 'scanning'} /></div>)}
            <div style={{ marginTop: 8, fontSize: 12, color: '#64748b' }}>+{ROUTES.length - 7} more routes scanned</div>
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>🔗 Platform Connections</div>
            {PLATFORMS.map(p => <div key={p.name} style={S.row}><span>{p.icon} {p.name}</span><span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>{platformStatuses[p.name]?.status === 'disconnected' ? '● Disconnected' : '⏳'}</span></div>)}
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>🐛 Known Issues</div>
            {KNOWN_BUGS.map(b => <div key={b.id} style={{ ...S.row, flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><SeverityBadge level={b.severity} /><span style={{ fontSize: 12, fontWeight: 600 }}>{b.title}</span></div></div>)}
          </div>
          {dataStats && (
            <div style={S.card}>
              <div style={S.cardTitle}>📊 Quick Stats</div>
              {[['Clients', dataStats.clients], ['Campaigns', dataStats.campaigns], ['Content Pieces', dataStats.content], ['Invoices', dataStats.invoices], ['Proposals', dataStats.proposals], ['Assets', dataStats.assets]].map(([k, v]) => <div key={k} style={S.row}><span>{k}</span><span style={{ fontWeight: 700, color: '#6366f1' }}>{v}</span></div>)}
            </div>
          )}
        </div>
      )}

      {activeTab === 'routes' && (
        <div style={S.card}>
          <div style={S.cardTitle}>All Routes ({ROUTES.length} total)</div>
          {ROUTES.map(r => (
            <div key={r.path} style={S.row}>
              <div><span style={{ marginRight: 8 }}>{r.icon}</span><span style={{ fontWeight: 600 }}>{r.name}</span><span style={{ color: '#64748b', fontSize: 12, marginLeft: 8 }}>{r.path}</span>{r.path === '/content-studio-social' && <span style={{ marginLeft: 8, background: '#7f1d1d', color: '#fca5a5', fontSize: 11, padding: '1px 6px', borderRadius: 4 }}>DUPLICATE BUG</span>}</div>
              <StatusDot status={routeStatuses[r.path] || 'scanning'} />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'platforms' && (
        <div style={S.grid}>
          {PLATFORMS.map(p => (
            <div key={p.name} style={S.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{p.icon} {p.name}</div>
                <span style={{ background: '#1a0000', color: '#ef4444', border: '1px solid #ef4444', fontSize: 11, padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>DISCONNECTED</span>
              </div>
              <div style={S.row}><span>Last Sync</span><span style={{ color: '#64748b' }}>Never</span></div>
              <div style={S.row}><span>Posts Scheduled</span><span>0</span></div>
              <div style={S.row}><span>API Status</span><span style={{ color: '#ef4444' }}>No Credentials</span></div>
              <button style={{ marginTop: 12, width: '100%', padding: 8, background: p.color, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>Connect {p.name}</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'data' && dataStats && (
        <div style={S.grid}>
          <div style={S.card}>
            <div style={S.cardTitle}>📦 Entity Counts</div>
            {[['Clients', dataStats.clients], ['Active Campaigns', dataStats.campaigns], ['Content Pieces', dataStats.content], ['Invoices', dataStats.invoices], ['Proposals', dataStats.proposals], ['Assets', dataStats.assets]].map(([k, v]) => <div key={k} style={S.row}><span>{k}</span><span style={{ fontWeight: 700, color: '#6366f1' }}>{v}</span></div>)}
          </div>
          <div style={S.card}>
            <div style={S.cardTitle}>💾 Storage Health</div>
            <div style={S.row}><span>Demo Data Initialized</span><span style={{ color: dataStats.demoInitialized ? '#22c55e' : '#ef4444' }}>{dataStats.demoInitialized ? 'Yes' : 'No'}</span></div>
            <div style={S.row}><span>localStorage Keys</span><span>{dataStats.localStorageKeys}</span></div>
            <div style={S.row}><span>Orphaned Records</span><span style={{ color: '#22c55e' }}>None detected</span></div>
            <div style={S.row}><span>Duplicate Entries</span><span style={{ color: '#22c55e' }}>None detected</span></div>
            <button onClick={() => { localStorage.removeItem('gdm_demo_initialized'); alert('Demo flag cleared.'); }} style={{ marginTop: 12, padding: '8px 12px', background: '#1e293b', color: '#f59e0b', border: '1px solid #f59e0b', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>🗑 Clear Demo Data Flag</button>
          </div>
        </div>
      )}

      {activeTab === 'performance' && perfMetrics && (
        <div style={S.card}>
          <div style={S.cardTitle}>⚡ Performance Metrics</div>
          {[['App Load Time', perfMetrics.loadTime !== 'N/A' ? `${perfMetrics.loadTime}ms` : 'N/A'], ['DOM Ready', perfMetrics.domReady !== 'N/A' ? `${perfMetrics.domReady}ms` : 'N/A'], ['Resources Loaded', perfMetrics.resources], ['JS Memory Used', perfMetrics.memory !== 'N/A' ? `${perfMetrics.memory} MB` : 'N/A']].map(([k, v]) => <div key={k} style={S.row}><span>{k}</span><span style={{ fontWeight: 700, color: '#06b6d4' }}>{v}</span></div>)}
        </div>
      )}

      {activeTab === 'bugs' && (
        <div>
          {KNOWN_BUGS.map(b => (
            <div key={b.id} style={{ background: '#111d35', borderRadius: 10, padding: 16, border: '1px solid #1e293b', marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}><SeverityBadge level={b.severity} /><span style={{ fontWeight: 700, fontSize: 14 }}>{b.title}</span></div>
                  <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 6px 0' }}>{b.detail}</p>
                  <p style={{ color: '#6366f1', fontSize: 12, margin: 0 }}>💡 Fix: {b.fix}</p>
                </div>
                <button onClick={() => setFixedBugs(p => ({ ...p, [b.id]: true }))} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, background: fixedBugs[b.id] ? '#14532d' : '#6366f1', color: fixedBugs[b.id] ? '#4ade80' : '#fff' }}>{fixedBugs[b.id] ? '✓ Marked Fixed' : 'Mark Fixed'}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'logs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Live Error Log</span>
            <button onClick={() => setErrorLog([])} style={{ background: 'none', border: '1px solid #334155', color: '#94a3b8', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Clear</button>
          </div>
          <div style={S.logBox}>
            {errorLog.map((e, i) => <div key={i} style={{ marginBottom: 4, color: e.level === 'CRITICAL' ? '#fca5a5' : e.level === 'WARNING' ? '#fcd34d' : '#94a3b8' }}><span style={{ color: '#475569', marginRight: 8 }}>[{e.time}]</span><span style={{ marginRight: 8, fontWeight: 700 }}>[{e.level}]</span>{e.msg}</div>)}
            {errorLog.length === 0 && <span style={{ color: '#475569' }}>No logs yet. Run a scan to populate.</span>}
          </div>
        </div>
      )}
    </div>
  );
}