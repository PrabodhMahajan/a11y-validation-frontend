import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, useParams, useNavigate, Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "/api";

// ─── Shared styles ──────────────────────────────────────────────────────────

const css = `
  :root {
    --ink: #1a1a1a; --ink-soft: #545454; --paper: #fdfcfa; --line: #e3ddd2;
    --accent: #185FA5; --accent-light: #EBF3FC;
    --critical: #A32D2D; --critical-bg: #FCEBEB;
    --serious: #B5530E; --serious-bg: #FCEFE3;
    --moderate: #185FA5; --moderate-bg: #EBF3FC;
    --minor: #3B6D11; --minor-bg: #EAF3DE;
    --disability: #6B3FA0; --disability-bg: #F3EBFA;
    --success: #3B6D11; --success-bg: #EAF3DE;
  }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: var(--paper); color: var(--ink); margin: 0; line-height: 1.5; }
  .wrap { max-width: 1020px; margin: 0 auto; padding: 2rem 1.5rem 6rem; }
  h1 { font-size: 24px; font-weight: 700; margin: 0 0 4px; }
  h2 { font-size: 18px; font-weight: 600; margin: 0 0 4px; }
  h3 { font-size: 15px; font-weight: 600; margin: 0 0 4px; }
  p { margin: 0 0 8px; }
  .eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-soft); margin-bottom: 6px; }
  .sub { font-size: 13px; color: var(--ink-soft); margin-bottom: 1rem; }
  section { margin-bottom: 2.5rem; }

  /* Cards */
  .card { background: white; border: 1px solid var(--line); border-radius: 12px; padding: 20px; margin-bottom: 12px; }
  .card-sm { background: white; border: 1px solid var(--line); border-radius: 10px; padding: 14px 16px; margin-bottom: 8px; }

  /* Buttons */
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 14px; font-weight: 500; transition: opacity 0.15s; }
  .btn:hover { opacity: 0.85; }
  .btn-primary { background: var(--ink); color: white; }
  .btn-accent { background: var(--accent); color: white; }
  .btn-ghost { background: transparent; border: 1px solid var(--line); color: var(--ink); }
  .btn-danger { background: var(--critical); color: white; }
  .btn-success { background: var(--success); color: white; }
  .btn-sm { padding: 5px 12px; font-size: 12px; }
  .btn-full { width: 100%; justify-content: center; }

  /* Form elements */
  .form-group { margin-bottom: 16px; }
  label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 5px; }
  input, select, textarea { width: 100%; padding: 8px 12px; border: 1px solid var(--line); border-radius: 8px; font-size: 14px; background: white; color: var(--ink); }
  input:focus, select:focus, textarea:focus { outline: 2px solid var(--accent); outline-offset: 1px; border-color: var(--accent); }
  textarea { min-height: 80px; resize: vertical; }

  /* Pills */
  .pill { display: inline-block; font-size: 11px; padding: 2px 8px; border-radius: 99px; font-weight: 600; white-space: nowrap; }
  .pill-a { background: var(--critical-bg); color: var(--critical); }
  .pill-aa { background: var(--serious-bg); color: var(--serious); }
  .pill-aaa { background: var(--disability-bg); color: var(--disability); }
  .pill-confirmed { background: var(--success-bg); color: var(--success); }
  .pill-disputed { background: #FFF8E1; color: #B8860B; }
  .pill-added { background: var(--disability-bg); color: var(--disability); }
  .pill-pass { background: var(--success-bg); color: var(--success); }
  .pill-fail { background: var(--critical-bg); color: var(--critical); }
  .pill-partial { background: var(--serious-bg); color: var(--serious); }

  /* Metric grid */
  .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 1.5rem; }
  .metric-card { background: white; border: 1px solid var(--line); border-radius: 10px; padding: 14px 16px; }
  .metric-card .m-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--ink-soft); margin-bottom: 2px; }
  .metric-card .m-value { font-size: 28px; font-weight: 700; }
  .metric-card .m-sub { font-size: 11px; color: var(--ink-soft); margin-top: 2px; }

  /* Nav */
  nav.topnav { border-bottom: 1px solid var(--line); background: white; padding: 12px 24px; display: flex; align-items: center; gap: 16px; margin-bottom: 0; }
  nav.topnav .brand { font-weight: 700; font-size: 15px; color: var(--ink); text-decoration: none; }
  nav.topnav a { font-size: 13px; color: var(--ink-soft); text-decoration: none; }
  nav.topnav a:hover { color: var(--ink); }

  /* Checklist */
  .criterion-card { background: white; border: 1px solid var(--line); border-radius: 10px; margin-bottom: 8px; overflow: hidden; }
  .criterion-head { padding: 12px 16px; display: flex; align-items: flex-start; gap: 12px; cursor: pointer; }
  .criterion-head:hover { background: #fafaf8; }
  .criterion-body { border-top: 1px solid var(--line); padding: 14px 16px; background: #fcfbf9; display: none; }
  .criterion-body.open { display: block; }
  .criterion-actions { display: flex; gap: 6px; margin-top: 12px; flex-wrap: wrap; }
  .code-hint { font-family: ui-monospace, monospace; font-size: 11px; background: #1e1e1e; color: #d4d4d4; padding: 8px 10px; border-radius: 6px; overflow-x: auto; white-space: pre-wrap; word-break: break-word; margin-top: 6px; }
  .info-row { display: grid; grid-template-columns: 90px 1fr; gap: 4px 12px; font-size: 13px; margin-bottom: 10px; }
  .info-row dt { color: var(--ink-soft); font-weight: 500; }
  .info-row dd { margin: 0; }

  /* Violation list */
  .violation-row { background: white; border: 1px solid var(--line); border-radius: 8px; padding: 12px 14px; margin-bottom: 8px; display: flex; align-items: flex-start; gap: 12px; }
  .violation-actions { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }

  /* Tab bar */
  .tabs { display: flex; gap: 0; border-bottom: 1px solid var(--line); margin-bottom: 1.5rem; }
  .tab { padding: 10px 16px; font-size: 13px; font-weight: 500; cursor: pointer; border-bottom: 2px solid transparent; color: var(--ink-soft); background: none; border-top: none; border-left: none; border-right: none; }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); }

  /* Status badge */
  .status-badge { display: inline-block; padding: 2px 10px; border-radius: 99px; font-size: 11px; font-weight: 600; }
  .status-in_progress { background: var(--serious-bg); color: var(--serious); }
  .status-completed { background: var(--success-bg); color: var(--success); }

  .divider { border: none; border-top: 1px solid var(--line); margin: 1.5rem 0; }
  .alert { padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 12px; }
  .alert-info { background: var(--accent-light); color: var(--accent); }
  .alert-success { background: var(--success-bg); color: var(--success); }
  .tag-row { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px; }
  .disability-tag { font-size: 11px; padding: 2px 7px; border-radius: 99px; background: var(--disability-bg); color: var(--disability); }
  .standards-tag { font-size: 11px; padding: 2px 7px; border-radius: 99px; background: #f0eee8; color: var(--ink-soft); }
`;

function GlobalStyle() {
  return <style>{css}</style>;
}

// ─── API helpers ─────────────────────────────────────────────────────────────

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// ─── Home — create session ───────────────────────────────────────────────────

function HomePage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("crawl"); // "crawl" | "upload"
  const [form, setForm] = useState({ siteUrl: "", auditorName: "", maxPages: 8 });
  const [auditJson, setAuditJson] = useState(null);
  const [auditFileName, setAuditFileName] = useState("");
  const [crawling, setCrawling] = useState(false);
  const [crawlProgress, setCrawlProgress] = useState([]);
  const [crawlResult, setCrawlResult] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setAuditFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result);
        setAuditJson(json);
        if (json.siteUrl && !form.siteUrl) setForm((f) => ({ ...f, siteUrl: json.siteUrl }));
      } catch {
        setError("Could not parse JSON file. Make sure it is a valid axe-core site report.");
      }
    };
    reader.readAsText(file);
  }

  async function handleLiveCrawl() {
    if (!form.siteUrl) return setError("Site URL is required");
    setCrawling(true);
    setCrawlProgress([]);
    setCrawlResult(null);
    setError("");

    try {
      const res = await fetch(`${API}/crawl`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: form.siteUrl, maxPages: form.maxPages }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const { type, data } = JSON.parse(line.slice(6));
            if (type === "progress" || type === "status") {
              setCrawlProgress((p) => [...p, data]);
            } else if (type === "complete") {
              setCrawlResult(data);
              setCrawlProgress((p) => [...p, `Done — ${data.siteSummary.totalViolationInstances} violation instances across ${data.pagesAudited} pages`]);
            } else if (type === "error") {
              setError(`Crawl failed: ${data}`);
            }
          } catch { }
        }
      }
    } catch (err) {
      setError(`Connection error: ${err.message}`);
    } finally {
      setCrawling(false);
    }
  }

  async function handleCreateSession() {
    if (!form.siteUrl) return setError("Site URL is required");
    const json = mode === "crawl" ? crawlResult : auditJson;
    setCreating(true);
    setError("");
    try {
      const result = await apiFetch("/sessions", {
        method: "POST",
        body: { siteUrl: form.siteUrl, auditorName: form.auditorName, auditJson: json },
      });
      navigate(`/session/${result.sessionId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  const readyToCreate = mode === "crawl" ? !!crawlResult : !!auditJson;

  return (
    <div className="wrap">
      <p className="eyebrow">Accessibility Validation Platform</p>
      <h1>Start a validation session</h1>
      <p className="sub" style={{ marginBottom: "1.5rem" }}>
        Run a real Playwright + axe-core audit, then combine it with human lived-experience validation to measure true accessibility coverage — the X/Y/Z/N% framework.
      </p>

      <div className="card" style={{ maxWidth: 600 }}>
        <div className="form-group">
          <label>Your name (session facilitator)</label>
          <input
            type="text"
            placeholder="Prabodh Mahajan"
            value={form.auditorName}
            onChange={(e) => setForm((f) => ({ ...f, auditorName: e.target.value }))}
          />
        </div>

        <div className="tabs" style={{ marginBottom: "1.5rem" }}>
          <button className={`tab ${mode === "crawl" ? "active" : ""}`} onClick={() => setMode("crawl")}>
            🕷 Run live audit (Playwright + axe-core)
          </button>
          <button className={`tab ${mode === "upload" ? "active" : ""}`} onClick={() => setMode("upload")}>
            📁 Upload existing JSON report
          </button>
        </div>

        {mode === "crawl" && (
          <>
            <div className="form-group">
              <label>Site URL to audit *</label>
              <input
                type="url"
                placeholder="https://depwd.gov.in"
                value={form.siteUrl}
                onChange={(e) => setForm((f) => ({ ...f, siteUrl: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Pages to audit (max 20)</label>
              <input
                type="number"
                min={1}
                max={20}
                value={form.maxPages}
                onChange={(e) => setForm((f) => ({ ...f, maxPages: parseInt(e.target.value) || 8 }))}
              />
              <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4 }}>
                Homepage + up to {form.maxPages - 1} pages selected by heuristic sampling (applications, forms, grievances, certificates, downloads).
              </p>
            </div>

            {!crawlResult && (
              <button
                className="btn btn-primary btn-full"
                onClick={handleLiveCrawl}
                disabled={crawling || !form.siteUrl}
              >
                {crawling ? "Crawling..." : "▶ Run live audit"}
              </button>
            )}

            {crawlProgress.length > 0 && (
              <div style={{ marginTop: 16, background: "#1e1e1e", borderRadius: 8, padding: "12px 14px", maxHeight: 200, overflowY: "auto" }}>
                {crawlProgress.map((msg, i) => (
                  <p key={i} style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: "#d4d4d4", margin: "2px 0" }}>
                    {crawling && i === crawlProgress.length - 1 ? "→ " : "✓ "}{msg}
                  </p>
                ))}
              </div>
            )}

            {crawlResult && (
              <div className="alert alert-success" style={{ marginTop: 12 }}>
                ✓ Audit complete — {crawlResult.siteSummary.totalViolationInstances} violation instances across {crawlResult.pagesAudited} pages ({crawlResult.ruleAggregate.length} distinct rules)
              </div>
            )}
          </>
        )}

        {mode === "upload" && (
          <>
            <div className="form-group">
              <label>Site URL</label>
              <input
                type="url"
                placeholder="https://depwd.gov.in"
                value={form.siteUrl}
                onChange={(e) => setForm((f) => ({ ...f, siteUrl: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Upload SITE_*.json from your local axe-core sandbox *</label>
              <input type="file" accept=".json" onChange={handleFileUpload} style={{ padding: "6px" }} />
              {auditFileName && (
                <p style={{ fontSize: 12, color: "var(--success)", marginTop: 4 }}>
                  ✓ Loaded: {auditFileName}
                  {auditJson?.siteSummary && ` — ${auditJson.siteSummary.totalViolationInstances} automated violation instances`}
                </p>
              )}
            </div>
          </>
        )}

        {error && <div className="alert alert-info" style={{ marginTop: 12 }}>{error}</div>}

        {readyToCreate && (
          <button
            className="btn btn-accent btn-full"
            onClick={handleCreateSession}
            disabled={creating}
            style={{ marginTop: 16 }}
          >
            {creating ? "Creating..." : "→ Start validation session"}
          </button>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link to="/admin" style={{ fontSize: 13, color: "var(--ink-soft)" }}>
          View all sessions →
        </Link>
      </div>
    </div>
  );
}

// ─── Session view ────────────────────────────────────────────────────────────

function SessionPage() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [criteria, setCriteria] = useState([]);
  const [disabilities, setDisabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDisability, setSelectedDisability] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openCriteria, setOpenCriteria] = useState({});

  // Participant form
  const [newParticipant, setNewParticipant] = useState({ name: "", role: "", disabilityId: "" });

  // New human-added barrier form
  const [newBarrier, setNewBarrier] = useState({
    title: "", disabilityId: "", wcagCriterionId: "",
    description: "", whereFound: "", severity: "Serious", confirmedBy: "",
  });

  const sessionUrl = window.location.href;

  useEffect(() => {
    Promise.all([
      apiFetch(`/sessions/${id}`),
      apiFetch("/criteria"),
    ]).then(([s, c]) => {
      // Normalize all fields so the rest of the component never needs null checks
      setSession({
        ...s,
        humanConfirmed: s.humanConfirmed || [],
        humanDisputed: s.humanDisputed || [],
        humanAdded: s.humanAdded || [],
        checklistResponses: s.checklistResponses || {},
        participants: s.participants || [],
        metrics: s.metrics || { X: 0, Y: 0, Z: 0, N: 0, falsePositiveRate: 0 },
        automatedViolations: s.automatedViolations || [],
        auditJson: s.auditJson || null,
      });
      setCriteria(c.criteria || []);
      setDisabilities(c.disabilities || []);
      if (c.disabilities && c.disabilities.length > 0) setSelectedDisability(c.disabilities[0].id);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const save = useCallback(async (patch) => {
    if (!session) return;
    setSaving(true);
    try {
      const result = await apiFetch(`/sessions/${id}`, { method: "PATCH", body: patch });
      setSession((s) => ({
        ...s,
        ...patch,
        metrics: result.metrics || s.metrics,
        humanConfirmed: patch.humanConfirmed || s.humanConfirmed || [],
        humanDisputed: patch.humanDisputed || s.humanDisputed || [],
        humanAdded: patch.humanAdded || s.humanAdded || [],
        checklistResponses: patch.checklistResponses || s.checklistResponses || {},
        participants: patch.participants || s.participants || [],
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }, [id, session]);

  function toggleCriterion(cid) {
    setOpenCriteria((o) => ({ ...o, [cid]: !o[cid] }));
  }

  function setChecklistStatus(criterionId, status, note = "") {
    const updated = {
      ...session.checklistResponses,
      [criterionId]: {
        status,
        note,
        testedBy: session.auditorName || "Facilitator",
        timestamp: new Date().toISOString(),
      },
    };
    save({ checklistResponses: updated });
  }

  function confirmViolation(violationId) {
    if (session.humanConfirmed.find((c) => c.violationId === violationId)) return;
    const updated = [
      ...session.humanConfirmed,
      { violationId, confirmedBy: session.auditorName || "Validator", note: "", timestamp: new Date().toISOString() },
    ];
    save({ humanConfirmed: updated });
  }

  function disputeViolation(violationId, reason = "") {
    if (session.humanDisputed.find((d) => d.violationId === violationId)) return;
    const updated = [
      ...session.humanDisputed,
      { violationId, disputedBy: session.auditorName || "Validator", reason, timestamp: new Date().toISOString() },
    ];
    save({ humanDisputed: updated });
  }

  function addBarrier() {
    if (!newBarrier.title || !newBarrier.description) return;
    const barrier = {
      id: `human-${Date.now()}`,
      ...newBarrier,
      confirmedBy: session.auditorName || "Validator",
      timestamp: new Date().toISOString(),
    };
    save({ humanAdded: [...session.humanAdded, barrier] });
    setNewBarrier({ title: "", disabilityId: "", wcagCriterionId: "", description: "", whereFound: "", severity: "Serious", confirmedBy: "" });
  }

  function addParticipant() {
    if (!newParticipant.name) return;
    const disability = disabilities.find((d) => d.id === newParticipant.disabilityId);
    const p = {
      ...newParticipant,
      disabilityLabel: disability?.label || "",
      addedAt: new Date().toISOString(),
    };
    save({ participants: [...session.participants, p] });
    setNewParticipant({ name: "", role: "", disabilityId: "" });
  }

  async function completeSession() {
    await apiFetch(`/sessions/${id}/complete`, { method: "POST" });
    setSession((s) => ({ ...s, status: "completed" }));
  }

  if (loading) return <div className="wrap"><p>Loading session...</p></div>;
  if (!session) return <div className="wrap"><p>Session not found.</p></div>;

  const filteredCriteria = selectedDisability
    ? criteria.filter((c) => c.disabilities.includes(selectedDisability))
    : criteria;

  const metrics = session.metrics;

  return (
    <div>
      {/* Top nav */}
      <nav className="topnav">
        <Link className="brand" to="/">A11y Validation</Link>
        <span style={{ color: "var(--line)" }}>|</span>
        <span style={{ fontSize: 13 }}>{session.siteUrl}</span>
        <span className={`status-badge status-${session.status}`} style={{ marginLeft: "auto" }}>
          {session.status === "completed" ? "Completed" : "In progress"}
        </span>
      </nav>

      <div className="wrap">
        {/* Share URL */}
        <div className="alert alert-info" style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between", flexWrap: "wrap" }}>
          <span>🔗 Share session: <code style={{ fontSize: 12 }}>{sessionUrl}</code></span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigator.clipboard.writeText(sessionUrl)}>
            Copy link
          </button>
        </div>

        {/* Metrics */}
        <div className="metric-grid">
          <div className="metric-card">
            <div className="m-label">X — Automated</div>
            <div className="m-value" style={{ color: "var(--critical)" }}>{metrics.X}</div>
            <div className="m-sub">violation instances</div>
          </div>
          <div className="metric-card">
            <div className="m-label">Y — Confirmed</div>
            <div className="m-value" style={{ color: "var(--serious)" }}>{metrics.Y}</div>
            <div className="m-sub">validated by humans</div>
          </div>
          <div className="metric-card">
            <div className="m-label">Z — Added</div>
            <div className="m-value" style={{ color: "var(--disability)" }}>{metrics.Z}</div>
            <div className="m-sub">missed by automation</div>
          </div>
          <div className="metric-card">
            <div className="m-label">N% — Coverage</div>
            <div className="m-value" style={{ color: "var(--accent)" }}>{metrics.N}%</div>
            <div className="m-sub">X ÷ (Y+Z)</div>
          </div>
        </div>

        {saved && <div className="alert alert-success">✓ Saved</div>}

        {/* Tabs */}
        <div className="tabs">
          {["overview", "checklist", "violations", "add-barrier", "participants"].map((t) => (
            <button key={t} className={`tab ${activeTab === t ? "active" : ""}`} onClick={() => setActiveTab(t)}>
              {t === "overview" ? "Overview" : t === "checklist" ? "WCAG Checklist" : t === "violations" ? "Automated Findings" : t === "add-barrier" ? "Add Barrier" : "Participants"}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === "overview" && (
          <section>
            <h2>Session overview</h2>
            <p className="sub">Track progress across all validation activities.</p>

            <div className="card" style={{ marginBottom: 16 }}>
              <p className="eyebrow">Accuracy formula</p>
              <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 14, background: "#f0eee8", padding: "10px 14px", borderRadius: 8, margin: "8px 0" }}>
                N% = X ÷ (X + Z) = {metrics.X} ÷ ({metrics.X} + {metrics.Z}) = {metrics.N}%
              </div>
              <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                Automated tools detected {metrics.X} violation instances. Human validation confirmed {metrics.Y} and found {metrics.Z} additional barriers.
                Automation coverage: <strong>{metrics.N}%</strong> of real barriers (X ÷ (X+Z)). GDS benchmark: 40%.
              </p>
            </div>

            <div className="card">
              <p className="eyebrow">Checklist progress</p>
              <p style={{ fontSize: 13 }}>
                {Object.values(session.checklistResponses).filter((r) => r.status === "fail").length} failures &nbsp;·&nbsp;
                {Object.values(session.checklistResponses).filter((r) => r.status === "pass").length} passes &nbsp;·&nbsp;
                {Object.keys(session.checklistResponses).length} of {criteria.length} criteria reviewed
              </p>
            </div>

            <hr className="divider" />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a className="btn btn-accent" href={`${API}/sessions/${id}/report`} target="_blank" rel="noopener">
                📄 Open full report
              </a>
              {session.status !== "completed" && (
                <button className="btn btn-success" onClick={completeSession}>
                  ✓ Complete session
                </button>
              )}
              <button className="btn btn-ghost" onClick={() => window.print()}>
                🖨 Print / Save PDF
              </button>
            </div>
          </section>
        )}

        {/* Checklist tab */}
        {activeTab === "checklist" && (
          <section>
            <h2>WCAG checklist</h2>
            <p className="sub">Select a disability to filter criteria relevant to that user group. Click any criterion to see where it applies on this site and how to implement it.</p>

            {criteria.length === 0 ? (
              <div className="card"><p style={{ color: "var(--ink-soft)" }}>Loading criteria...</p></div>
            ) : (
              <>
            <div className="form-group" style={{ maxWidth: 360 }}>
              <label>Filter by disability (RPWD Act 2016)</label>
              <select value={selectedDisability} onChange={(e) => setSelectedDisability(e.target.value)}>
                <option value="">All disabilities</option>
                {disabilities.map((d) => (
                  <option key={d.id} value={d.id}>{d.icon} {d.label}</option>
                ))}
              </select>
            </div>

            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 12 }}>
              Showing {filteredCriteria.length} criteria {selectedDisability ? `relevant to selected disability` : ""}
            </p>

            {filteredCriteria.map((c) => {
              const response = session.checklistResponses[c.id];
              const isOpen = openCriteria[c.id];
              return (
                <div key={c.id} className="criterion-card">
                  <div className="criterion-head" onClick={() => toggleCriterion(c.id)}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{c.id} — {c.title}</span>
                        <span className={`pill pill-${c.level.toLowerCase()}`}>Level {c.level}</span>
                        {response && (
                          <span className={`pill pill-${response.status}`}>
                            {response.status === "pass" ? "✓ Pass" : response.status === "fail" ? "✗ Fail" : response.status === "partial" ? "~ Partial" : "—"}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "3px 0 0" }}>{c.description}</p>
                      <div className="tag-row">
                        {c.disabilities.map((did) => {
                          const d = disabilities.find((x) => x.id === did);
                          return d ? <span key={did} className="disability-tag">{d.icon} {d.label}</span> : null;
                        })}
                      </div>
                    </div>
                    <span style={{ color: "var(--ink-soft)", fontSize: 12, flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>

                  {isOpen && (
                    <div className="criterion-body open">
                      <dl className="info-row">
                        <dt>Where on site</dt><dd>{c.whereOnSite}</dd>
                        <dt>How to fix</dt><dd>{c.howToImplement}</dd>
                        <dt>Standards</dt>
                        <dd>
                          <div className="tag-row">
                            {(c.standards || []).map((s) => <span key={s} className="standards-tag">{s}</span>)}
                          </div>
                        </dd>
                      </dl>
                      {c.codeExample && (
                        <>
                          <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Example implementation:</p>
                          <div className="code-hint">{c.codeExample}</div>
                        </>
                      )}
                      {c.note && (
                        <div style={{ background: "var(--accent-light)", borderLeft: "3px solid var(--accent)", padding: "8px 12px", borderRadius: "0 6px 6px 0", marginTop: 10, fontSize: 12, color: "var(--accent)" }}>
                          📌 {c.note}
                        </div>
                      )}

                      <div className="criterion-actions">
                        <button className="btn btn-sm btn-success" onClick={() => setChecklistStatus(c.id, "pass")}>✓ Pass</button>
                        <button className="btn btn-sm btn-danger" onClick={() => setChecklistStatus(c.id, "fail")}>✗ Fail</button>
                        <button className="btn btn-sm btn-ghost" onClick={() => setChecklistStatus(c.id, "partial")}>~ Partial</button>
                        <button className="btn btn-sm btn-ghost" onClick={() => setChecklistStatus(c.id, "not_tested")}>— Not tested</button>
                      </div>

                      {response && (
                        <div style={{ marginTop: 10 }}>
                          <input
                            placeholder="Add a note (optional)..."
                            defaultValue={response.note}
                            style={{ fontSize: 12 }}
                            onBlur={(e) => {
                              if (e.target.value !== response.note) {
                                setChecklistStatus(c.id, response.status, e.target.value);
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
              </>
            )}
          </section>
        )}

        {/* Violations tab */}
        {activeTab === "violations" && (
          <section>
            <h2>Automated findings — validate or dispute</h2>
            <p className="sub">Review each automated finding. Confirm it as a real barrier (counts as Y) or dispute it as a false positive.</p>

            {(!session.auditJson?.ruleAggregate || session.auditJson.ruleAggregate.length === 0) ? (
              <div className="card">
                <p style={{ color: "var(--ink-soft)" }}>No automated audit data loaded. Upload an axe-core JSON report when creating the session to see findings here.</p>
              </div>
            ) : (
              session.auditJson.ruleAggregate.map((v) => {
                const confirmed = session.humanConfirmed.find((c) => c.violationId === v.ruleId);
                const disputed = session.humanDisputed.find((d) => d.violationId === v.ruleId);
                return (
                  <div key={v.ruleId} className="violation-row" style={{ flexDirection: "column" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", width: "100%" }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: 14, margin: "0 0 2px" }}>{v.help}</p>
                        <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: 0, fontFamily: "ui-monospace, monospace" }}>{v.ruleId}</p>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 5 }}>
                          <span className={`pill`} style={{ background: v.severity === "Critical" ? "var(--critical-bg)" : v.severity === "Serious" ? "var(--serious-bg)" : "var(--moderate-bg)", color: v.severity === "Critical" ? "var(--critical)" : v.severity === "Serious" ? "var(--serious)" : "var(--moderate)" }}>{v.severity}</span>
                          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>{v.totalInstances} instances · {v.pagesAffected?.length || 0} pages</span>
                          {confirmed && <span className="pill pill-confirmed">✓ Confirmed</span>}
                          {disputed && <span className="pill pill-disputed">⚠ Disputed</span>}
                        </div>
                      </div>
                    </div>
                    {!confirmed && !disputed && (
                      <div className="violation-actions">
                        <button className="btn btn-sm btn-success" onClick={() => confirmViolation(v.ruleId)}>✓ Confirm as real barrier</button>
                        <button className="btn btn-sm btn-ghost" onClick={() => {
                          const reason = prompt("Why is this a false positive or not applicable?");
                          if (reason !== null) disputeViolation(v.ruleId, reason);
                        }}>⚠ Dispute / false positive</button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </section>
        )}

        {/* Add barrier tab */}
        {activeTab === "add-barrier" && (
          <section>
            <h2>Add a barrier missed by automation (Z)</h2>
            <p className="sub">Document accessibility barriers that automated testing cannot detect — lived-experience findings from persons with disabilities or expert manual review.</p>

            {session.humanAdded.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3>{session.humanAdded.length} barrier{session.humanAdded.length !== 1 ? "s" : ""} added so far</h3>
                {session.humanAdded.map((b) => (
                  <div key={b.id} className="card-sm" style={{ display: "flex", gap: 10 }}>
                    <div>
                      <span className="pill pill-added">Human-identified</span>
                      <p style={{ fontWeight: 600, fontSize: 13, margin: "4px 0 2px" }}>{b.title}</p>
                      <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: 0 }}>{b.description}</p>
                    </div>
                  </div>
                ))}
                <hr className="divider" />
              </div>
            )}

            <div className="card">
              <h3>Add new barrier</h3>
              <div className="form-group">
                <label>Barrier title *</label>
                <input placeholder="e.g. No ISL interpretation available for video content" value={newBarrier.title} onChange={(e) => setNewBarrier((b) => ({ ...b, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Disability category</label>
                <select value={newBarrier.disabilityId} onChange={(e) => setNewBarrier((b) => ({ ...b, disabilityId: e.target.value }))}>
                  <option value="">Select disability</option>
                  {disabilities.map((d) => <option key={d.id} value={d.id}>{d.icon} {d.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Related WCAG criterion (if known)</label>
                <select value={newBarrier.wcagCriterionId} onChange={(e) => setNewBarrier((b) => ({ ...b, wcagCriterionId: e.target.value }))}>
                  <option value="">Select criterion</option>
                  {criteria.map((c) => <option key={c.id} value={c.id}>{c.id} — {c.title} (Level {c.level})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Where on the site was this found? *</label>
                <input placeholder="e.g. Homepage carousel, Apply for UDID form, all video pages" value={newBarrier.whereFound} onChange={(e) => setNewBarrier((b) => ({ ...b, whereFound: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Description of the barrier *</label>
                <textarea placeholder="Describe what the barrier is, how it affects the user, and why automation missed it..." value={newBarrier.description} onChange={(e) => setNewBarrier((b) => ({ ...b, description: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Severity</label>
                <select value={newBarrier.severity} onChange={(e) => setNewBarrier((b) => ({ ...b, severity: e.target.value }))}>
                  <option>Critical</option>
                  <option>Serious</option>
                  <option>Moderate</option>
                  <option>Minor</option>
                </select>
              </div>
              <button className="btn btn-primary" onClick={addBarrier} disabled={!newBarrier.title || !newBarrier.description}>
                + Add barrier
              </button>
            </div>
          </section>
        )}

        {/* Participants tab */}
        {activeTab === "participants" && (
          <section>
            <h2>Session participants</h2>
            <p className="sub">Record who participated in this validation session for methodological transparency.</p>

            {session.participants.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                {session.participants.map((p, i) => (
                  <div key={i} className="card-sm" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{p.name}</p>
                      <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: 0 }}>
                        {p.role && `${p.role}`}{p.disabilityLabel && ` · ${p.disabilityLabel}`}
                      </p>
                    </div>
                  </div>
                ))}
                <hr className="divider" />
              </div>
            )}

            <div className="card">
              <h3>Add participant</h3>
              <div className="form-group">
                <label>Name *</label>
                <input placeholder="Participant name" value={newParticipant.name} onChange={(e) => setNewParticipant((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input placeholder="e.g. Person with visual impairment, Accessibility expert, NGO representative" value={newParticipant.role} onChange={(e) => setNewParticipant((p) => ({ ...p, role: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Disability (if applicable)</label>
                <select value={newParticipant.disabilityId} onChange={(e) => setNewParticipant((p) => ({ ...p, disabilityId: e.target.value }))}>
                  <option value="">Not applicable / prefer not to say</option>
                  {disabilities.map((d) => <option key={d.id} value={d.id}>{d.icon} {d.label}</option>)}
                </select>
              </div>
              <button className="btn btn-primary" onClick={addParticipant} disabled={!newParticipant.name}>
                + Add participant
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ─── Admin — list all sessions ───────────────────────────────────────────────

function AdminPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/sessions").then((data) => {
      setSessions(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="wrap">
      <p className="eyebrow">Admin</p>
      <h1>All validation sessions</h1>
      <p className="sub" style={{ marginBottom: "1.5rem" }}>
        {sessions.length} session{sessions.length !== 1 ? "s" : ""} recorded
      </p>

      <Link to="/" className="btn btn-primary" style={{ marginBottom: "1.5rem", display: "inline-flex" }}>
        + New session
      </Link>

      {loading ? <p>Loading...</p> : sessions.length === 0 ? (
        <div className="card"><p style={{ color: "var(--ink-soft)" }}>No sessions yet.</p></div>
      ) : (
        sessions.map((s) => (
          <div key={s.id} className="card" style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                <span className={`status-badge status-${s.status}`}>{s.status === "completed" ? "Completed" : "In progress"}</span>
              </div>
              <p style={{ fontWeight: 600, fontSize: 15, margin: "0 0 2px" }}>{s.siteUrl}</p>
              <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: 0 }}>
                Led by {s.auditorName} · {new Date(s.createdAt).toLocaleDateString("en-GB")} · {s.participantCount} participant{s.participantCount !== 1 ? "s" : ""}
              </p>
              <p style={{ fontSize: 12, color: "var(--ink-soft)", margin: "4px 0 0" }}>
                X={s.metrics?.X || 0} Y={s.metrics?.Y || 0} Z={s.metrics?.Z || 0} N={s.metrics?.N || 0}%
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link to={`/session/${s.id}`} className="btn btn-ghost btn-sm">Open session</Link>
              <a href={`${API}/sessions/${s.id}/report`} target="_blank" rel="noopener" className="btn btn-accent btn-sm">View report</a>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/session/:id" element={<SessionPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
}
