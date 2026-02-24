import { useState, useEffect, useRef } from "react";

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "why", label: "Why a Data Strategy?" },
  { id: "how", label: "How It Works" },
  { id: "dimensions", label: "The Two Readiness Dimensions" },
  { id: "pipeline", label: "The Four-Agent Pipeline" },
  { id: "sources", label: "Data Sources" },
  { id: "quality", label: "Quality Monitoring" },
  { id: "usecases", label: "Use Cases" },
  { id: "faq", label: "FAQ" },
  { id: "glossary", label: "Glossary" },
];

const PERSONAS = [
  {
    id: "investor", label: "Investor", color: "#2D9B6F", bg: "#E8F9F2", icon: "◆",
    intent: "deploy_capital", gamma: "fin", alpha: "0.60", beta: "0.05",
    examples: [
      { title: "VC GP sourcing Series A compliance infrastructure", body: "A $400M crypto-native fund with 2023 vintage enters the event to source compliance-infrastructure founders at Series A. Agent 1 extracts: fin_ready=0.91 (AUM confirmed, young fund, deployment mandate in freetext). Agent 2 scores persona_fit=0.90 against a compliant L2 founder. Agent 3 applies alpha=0.60 on the founder's fin_ready=0.85 → rank_score=1.62. Agent 4 assigns P1 with a thesis-specific explanation mentioning the founder's Trail of Bits audit and MiCA compliance module shipped in Q3." },
      { title: "SWF allocator evaluating custody infrastructure", body: "A Sovereign Wealth Fund with $8B AUM signals interest in institutional custody plays. stage_mandate = Series B+. Agent 1 computes fund_eol_risk=0.10 (vintage 2022). Agent 2 filters out pre-seed founders via the eligibility pre-check — they never score. The SWF's shortlist surfaces only operationally mature custody founders with live product and institutional clients confirmed in freetext." },
    ],
  },
  {
    id: "founder", label: "Founder", color: "#7B4FD6", bg: "#EEE9FF", icon: "▲",
    intent: "raise_capital", gamma: "max", alpha: "0.50", beta: "0.10",
    examples: [
      { title: "MiCA-compliant L2 founder raising Series A", body: "NexaLayer's founder registers with product_live=true confirmed in freetext, sandbox_seeking=true with a 3-month pilot window, and actively_raising=true targeting €12M. Agent 1 produces fin_ready=0.84, ops_ready=0.88, compliance_tags=[MiCA, KYC, AML]. Agent 2 scores intent_overlap=1.00 against investors and compliance_tag_overlap=0.67 against regulators. The founder appears in P1 shortlists for VC GPs AND in PILOT shortlists for sandbox directors — two separate match tracks, neither interfering with the other." },
      { title: "Infra builder seeking strategic partnerships", body: "A settlement-layer founder with no active raise (fin_ready=0.32) but a live product integrated with two European banks. ops_ready=0.79. Agent 3 applies gamma=max: deal_cpty = MAX(0.32, 0.79) = 0.79. The founder surfaces in PILOT matches with corporates and regulators, correctly bypassing P1 capital matches where they would fail the financial_ready ≥ 0.70 gate." },
    ],
  },
  {
    id: "regulator", label: "Regulator", color: "#0A7FAD", bg: "#E3F4FB", icon: "■",
    intent: "seek_sandbox_pilot", gamma: "ops", alpha: "0.20", beta: "0.05",
    examples: [
      { title: "Bundesbank CBDC sandbox director recruiting participants", body: "The Bundesbank Digital Euro sandbox director registers with sandbox_seeking=true (recruiting, not seeking to join), pilot_timeline_months=3. Agent 1 flags: fin_ready=0.20 (constant — regulators never deploy capital), ops_ready=0.91. Agent 2 scores against MiCA-compliant founders: compliance_tag_overlap=0.75, operational_ready=MIN(0.91, 0.88)=0.88. Agent 3 applies gamma=ops, alpha=0.20. The regulator's shortlist is entirely PILOT-bucket — no P1 matches appear." },
      { title: "FCA sandbox lead evaluating payments infrastructure", body: "An FCA sandbox director wants to evaluate payments-layer applicants. Agent 1 tags regulatory_tags=[FCA_sandbox], vertical_tags=[payments, identity, compliance_infra]. Agent 2 computes thematic_fit=0.71 against a payments-focused founder with FCA_sandbox in their regulatory_tags (Jaccard=1.0 on regulatory). With match_score=0.88 and operational_ready=0.82 ≥ 0.65: PILOT bucket, CTA='Sandbox or partnership meeting'." },
    ],
  },
  {
    id: "corporate", label: "Corporate", color: "#C47A00", bg: "#FFF5E0", icon: "●",
    intent: "seek_partner", gamma: "max", alpha: "0.40", beta: "0.15",
    examples: [
      { title: "Deutsche Bank digital assets lead evaluating integration", body: "The Head of Digital Assets at Deutsche Bank (seniority_score=0.90, institution_quality=1.0, credibility_score=0.88) registers with sandbox_seeking=true and has Basel_IV, DORA in compliance_tags. Agent 1 produces ops_ready=0.72 and fin_ready=0.55 (corp_vc function active but limited). Agent 3 applies beta=0.15 — the corporate's own procurement readiness differentiates matches. Their shortlist surfaces founders with DORA-compatible products above those without, even when other signals are similar." },
    ],
  },
];

const GLOSSARY = [
  { term: "Reconciliation key", def: "The shared identifier between registration data and enriched profile. In XVentures: attendee_id." },
  { term: "fin_ready_score", def: "Individual financial readiness (0–1). Founders: from raising/timeline/size signals. Investors: deploy signal + EOL risk. Regulators/corporates: constant 0.20." },
  { term: "ops_ready_score", def: "Individual operational readiness (0–1). From product liveness, sandbox intent, pilot timeline, and compliance depth. Investors: constant 0.20." },
  { term: "FinancialReady(A,B)", def: "Pairwise = MIN(fin_ready_A, fin_ready_B). A pair is only as financially ready as its least-ready member." },
  { term: "OperationalReady(A,B)", def: "Pairwise = MIN(ops_ready_A, ops_ready_B). Fully independent of FinancialReady — never blended." },
  { term: "match_score", def: "Weighted sum of six components. Weights are persona-specific from the event playbook. Range 0–1." },
  { term: "rank_score", def: "Directional: match_score × (1 + α × deal_cpty + β × deal_self). A→B ≠ B→A." },
  { term: "Snapshot context", def: "Profile data frozen at enrichment time. Used for historical analysis, A/B testing of event formats, compliance audit trails." },
  { term: "Update context", def: "Profile data updated when the attendee edits their registration. For late-registration corrections and last-minute profile changes." },
  { term: "P1 bucket", def: "Priority capital meeting. Requires match_score ≥ 0.70 AND financial_ready ≥ 0.70." },
  { term: "PILOT bucket", def: "Sandbox or partnership meeting. Requires match_score ≥ 0.70 AND operational_ready ≥ 0.65 AND financial_ready < 0.70." },
  { term: "P2 bucket", def: "Strategic meeting. Requires match_score ≥ 0.65 AND MAX(financial_ready, operational_ready) ≥ 0.40." },
  { term: "P3 bucket", def: "Post-event follow-up. Requires match_score ≥ 0.40." },
  { term: "mandate_summary", def: "One sentence (50–250 chars) naming ≥1 specific signal. Feeds intent_overlap and non_obvious_score via semantic comparison." },
  { term: "jaccard overlap", def: "Tag similarity: |A∩B| / |A∪B|. Used for vertical, regulatory, geography, and compliance tags." },
  { term: "non_obvious_score", def: "High when mandate semantics align despite low tag overlap (<0.25). Capped at 0.10 when tag_overlap ≥ 0.50 (obvious match)." },
  { term: "enrichment_quality", def: "Confidence score (0–1) for each enriched profile. Triggers needs_review=true when < 0.30." },
  { term: "fund_eol_risk", def: "clamp((years_elapsed - 5) / 5, 0, 1). A 10-year-old fund = 1.0 risk (end of typical lifecycle)." },
  { term: "gamma", def: "Persona parameter selecting readiness dimension for rank_score. 'fin'=financial, 'ops'=operational, 'max'=MAX of both." },
  { term: "alpha / beta", def: "Playbook weights for counterparty readiness (alpha) and self-readiness (beta). Investor: α=0.60, β=0.05. Regulator: α=0.20, β=0.05." },
];

const FAQS = [
  { q: "Why does a Series B company sometimes score lower traction than a Seed company?", a: "Stage label is never a quality signal — it is a filter only. Traction is scored exclusively from evidence: institutional clients, audit history, TVL, known investors, regulatory approvals. A Seed company with enterprise clients and a Trail of Bits audit will outscore a Series B company with no demonstrable traction." },
  { q: "Why does a pair appear in PILOT even though neither side is raising capital?", a: "FinancialReady and OperationalReady are fully independent dimensions. PILOT fires when match_score ≥ 0.70 AND operational_ready ≥ 0.65 AND financial_ready < 0.70. This surfaces regulator-founder and corporate-founder pilot opportunities that would be incorrectly buried in P3 under a single-dimension system." },
  { q: "What happens if actively_raising is checked but freetext says 'we recently closed our Series B'?", a: "Agent 1 sets actively_raising_confirmed=false. The contradiction overrides the checkbox. fin_ready_score is reduced — the raising_signal component drops to 0.0 instead of 1.0. The mismatch is logged in the processing report." },
  { q: "Why are rank_scores directional? Why isn't A→B the same as B→A?", a: "Because each persona values readiness differently. An investor with alpha=0.60 weights the founder's financial readiness heavily. The founder's rank_score for the same investor uses alpha=0.50 and gamma=max — a different formula producing a different rank. Each person's shortlist is ranked from their own perspective." },
  { q: "When does a profile get flagged needs_review=true?", a: "When persona_confidence < 0.70 (self-reported persona contradicts evidence), enrichment_quality < 0.30 (insufficient signal — missing LinkedIn, thin freetext), or when the persona override confidence gap exceeds 0.20." },
  { q: "What is the difference between thematic_fit and complementary_score?", a: "thematic_fit measures topic alignment: do they work in the same verticals, regulatory environments, geographies? complementary_score is a weighted aggregate of persona_fit + intent_overlap + thematic_fit — it measures structural match quality holistically. A pair can have high thematic_fit but low complementary_score if their intents conflict." },
  { q: "When does non_obvious_score matter most?", a: "When vertical tag overlap is low (<0.25) but mandate_summary semantics suggest similar underlying problems. This surfaces founders from different sectors solving the same compliance or infrastructure challenge. When tag_overlap ≥ 0.50, non_obvious_score is capped at 0.10 — the match is obvious, not a discovery." },
];

export default function App() {
  const [activeSection, setActiveSection] = useState("overview");
  const [activePersona, setActivePersona] = useState("investor");
  const [openFaq, setOpenFaq] = useState(null);
  const [glossarySearch, setGlossarySearch] = useState("");
  const [finA, setFinA] = useState(0.85);
  const [opsA, setOpsA] = useState(0.40);
  const [finB, setFinB] = useState(0.90);
  const [opsB, setOpsB] = useState(0.88);
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 120;
      let current = NAV[0].id;
      for (const n of NAV) {
        const el = sectionRefs.current[n.id];
        if (el && el.offsetTop <= scrollY) current = n.id;
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = sectionRefs.current[id];
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  };

  const persona = PERSONAS.find((p) => p.id === activePersona);
  const finReady = Math.min(finA, finB);
  const opsReady = Math.min(opsA, opsB);
  const p1 = finReady >= 0.70;
  const pilot = !p1 && opsReady >= 0.65;
  const bucket = p1 ? "P1" : pilot ? "PILOT" : (finReady >= 0.40 || opsReady >= 0.40) ? "P2" : "P3";
  const bucketColor = { P1: "#2D9B6F", PILOT: "#0A7FAD", P2: "#C47A00", P3: "#888" }[bucket];
  const bucketBg = { P1: "#E8F9F2", PILOT: "#E3F4FB", P2: "#FFF5E0", P3: "#F5F5F5" }[bucket];

  const filteredGlossary = GLOSSARY.filter(g =>
    g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    g.def.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  const S = {
    wrap: { fontFamily: "'Georgia', serif", background: "#F7F4EF", minHeight: "100vh", color: "#18182E" },
    topbar: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: "#18182E", borderBottom: "1px solid #2A2A4A", height: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px" },
    sidebar: { width: 210, position: "fixed", top: 50, left: 0, bottom: 0, overflowY: "auto", background: "#F7F4EF", borderRight: "1px solid #E0DDD5", padding: "24px 12px 40px" },
    main: { marginLeft: 210, padding: "36px 64px 100px", maxWidth: 860, fontFamily: "'Instrument Sans', 'Helvetica Neue', sans-serif" },
    h1: { fontFamily: "'DM Serif Display', 'Georgia', serif", fontSize: 34, color: "#18182E", lineHeight: 1.15, marginBottom: 6 },
    h2: { fontFamily: "'DM Serif Display', 'Georgia', serif", fontSize: 21, color: "#18182E", margin: "32px 0 10px" },
    h3: { fontFamily: "'Instrument Sans', sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#999", margin: "20px 0 8px" },
    lead: { fontSize: 16, lineHeight: 1.75, color: "#48485A", fontFamily: "'Instrument Sans', sans-serif" },
    body: { fontSize: 14, lineHeight: 1.8, color: "#48485A", fontFamily: "'Instrument Sans', sans-serif" },
    divider: { border: "none", borderTop: "1px solid #E0DDD5", margin: "48px 0" },
    card: { background: "white", border: "1px solid #E4E0D8", borderRadius: 8, padding: "20px 24px", margin: "12px 0" },
    infoBox: { background: "#FAFAF6", border: "1px solid #E4E0D8", borderRadius: 6, padding: "13px 17px", margin: "14px 0", fontSize: 13, fontFamily: "'Instrument Sans', sans-serif", color: "#555" },
    tag: { display: "inline-block", padding: "2px 7px", borderRadius: 3, fontSize: 11, fontFamily: "'DM Mono', monospace", background: "#EEEAE0", color: "#555", margin: 2 },
    badge: { display: "inline-block", padding: "2px 8px", borderRadius: 3, fontSize: 11, fontWeight: 600, fontFamily: "'DM Mono', monospace" },
    code: { fontFamily: "'DM Mono', monospace", fontSize: 12, background: "#EEEAE0", padding: "1px 5px", borderRadius: 3, color: "#333" },
  };

  return (
    <div style={S.wrap}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .nav-btn { cursor: pointer; padding: 5px 10px; border-radius: 4px; font-size: 12.5px; font-family: 'Instrument Sans', sans-serif; font-weight: 500; transition: all 0.12s; border: none; background: none; text-align: left; width: 100%; display: block; color: #666; line-height: 1.4; }
        .nav-btn:hover { background: #EEE9DF; color: #18182E; }
        .nav-btn.act { background: #18182E; color: #F7F4EF; }
        .tbl { width: 100%; border-collapse: collapse; font-size: 13px; font-family: 'Instrument Sans', sans-serif; }
        .tbl th { background: #18182E; color: #F7F4EF; padding: 9px 14px; text-align: left; font-size: 11.5px; font-weight: 600; letter-spacing: 0.02em; }
        .tbl td { padding: 9px 14px; border-bottom: 1px solid #E4E0D8; color: #444; vertical-align: top; }
        .tbl tr:last-child td { border-bottom: none; }
        .tbl tr:nth-child(even) td { background: #FAFAF6; }
        input[type=range] { -webkit-appearance: none; width: 100%; height: 4px; border-radius: 2px; background: #E4E0D8; cursor: pointer; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #18182E; cursor: pointer; border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.18); }
        .faq-q { padding: 14px 18px; cursor: pointer; font-weight: 600; font-size: 13.5px; font-family: 'Instrument Sans', sans-serif; display: flex; justify-content: space-between; align-items: flex-start; background: white; gap: 12px; }
        .faq-q:hover { background: #FAFAF6; }
        .persona-tab { padding: 7px 15px; border-radius: 5px; cursor: pointer; font-size: 13px; font-weight: 600; font-family: 'Instrument Sans', sans-serif; border: 1.5px solid transparent; transition: all 0.12s; }
        .score-bar { height: 7px; border-radius: 4px; transition: width 0.35s ease; }
        @media (max-width: 700px) { .sidebar-el { display: none !important; } .main-el { margin-left: 0 !important; padding: 20px !important; } }
      `}</style>

      {/* TOP BAR */}
      <div style={S.topbar}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 26, height: 26, background: "linear-gradient(135deg, #2D9B6F, #0A7FAD)", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: 13, fontWeight: 800, fontFamily: "DM Mono" }}>X</span>
            </div>
            <span style={{ color: "#F7F4EF", fontSize: 13.5, fontWeight: 600, fontFamily: "Instrument Sans, sans-serif" }}>XVentures</span>
          </div>
          <span style={{ color: "#444" }}>/</span>
          <span style={{ color: "#999", fontSize: 13, fontFamily: "Instrument Sans, sans-serif" }}>Data Strategy Documentation</span>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Agent Pipeline", "API Reference", "Release Notes"].map(l => (
            <span key={l} style={{ color: "#666", fontSize: 12, fontFamily: "Instrument Sans, sans-serif", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className="sidebar-el" style={S.sidebar}>
        <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#BBB", fontFamily: "Instrument Sans, sans-serif", marginBottom: 14, paddingLeft: 10 }}>On This Page</div>
        {NAV.map((n) => (
          <div key={n.id} style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: 1 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: activeSection === n.id ? "#18182E" : "#DDD", flexShrink: 0, marginTop: 8, transition: "background 0.15s" }} />
            <button className={`nav-btn ${activeSection === n.id ? "act" : ""}`} onClick={() => scrollTo(n.id)}>{n.label}</button>
          </div>
        ))}
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-el" style={{ ...S.main, marginTop: 50 }}>

        {/* ── OVERVIEW ─────────────────────────────────── */}
        <section ref={el => sectionRefs.current.overview = el} style={{ paddingTop: 36 }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ ...S.badge, background: "#EEEAE0", color: "#666" }}>Data Strategy · v2.1</span>
          </div>
          <h1 style={S.h1}>XVentures Data Strategy</h1>
          <p style={{ ...S.lead, marginTop: 10, marginBottom: 20 }}>
            XVentures connects investors, founders, regulators, and corporates at professional events by turning raw registration data into precision-ranked meeting shortlists. This document explains the data architecture — from raw form fields to shortlisted pairs with meeting-type-specific explanations.
          </p>
          <div style={{ ...S.infoBox, borderLeft: "3px solid #2D9B6F" }}>
            <strong>Note:</strong> XVentures evolved from a single monolithic scoring prompt (v1.0) to a four-agent pipeline (v2.1) with independent financial and operational readiness dimensions. Enrichment data from v1 events migrated automatically.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 24 }}>
            {[
              { num: "4", label: "Agents in pipeline", sub: "Extract → Candidate → Score → Bucket" },
              { num: "6", label: "Match components", sub: "persona_fit · intent_overlap · thematic_fit · …" },
              { num: "2", label: "Readiness dimensions", sub: "Financial and Operational — fully independent" },
            ].map(s => (
              <div key={s.num} style={{ ...S.card, textAlign: "center", padding: "22px 16px" }}>
                <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 42, color: "#18182E", lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontWeight: 700, fontSize: 12, color: "#333", marginTop: 6, fontFamily: "Instrument Sans, sans-serif" }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 4, fontFamily: "Instrument Sans, sans-serif" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        <hr style={S.divider} />

        {/* ── WHY ──────────────────────────────────────── */}
        <section ref={el => sectionRefs.current.why = el}>
          <h1 style={S.h1}>Why a Data Strategy?</h1>
          <p style={{ ...S.lead, marginTop: 10 }}>Every event has structured participant data: roles, mandates, product readiness, compliance capabilities, investment theses. Without a systematic strategy, this data sits unused in form fields or requires expensive manual curation per event.</p>
          <h2 style={S.h2}>With XVentures' Data Strategy</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 4 }}>
            {[
              { title: "Organizers collect identifiers only", body: "A registration form captures role, goals, and freetext. XVentures automatically enriches each profile with structured tags, readiness scores, and mandate summaries — no manual tagging required." },
              { title: "Every match has business meaning", body: "Shortlisted pairs come with specific explanations grounded in the attendee's actual mandate: thesis, regulatory program, product stage, compliance capability. No generic copy." },
              { title: "Two meeting types surface independently", body: "Capital meetings (P1) and operational meetings (PILOT) are computed independently. A regulator-founder pair that would score P3 in a single-dimension system correctly surfaces as PILOT." },
              { title: "No implementation complexity", body: "Upload a CSV or connect via API. The pipeline enriches, scores, and ranks automatically. Attendees receive shortlists ranked from their own perspective using persona-aware weights." },
            ].map(c => (
              <div key={c.title} style={{ ...S.card, borderLeft: "3px solid #2D9B6F" }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#18182E", marginBottom: 6, fontFamily: "Instrument Sans, sans-serif" }}>{c.title}</div>
                <div style={{ ...S.body, fontSize: 12.5 }}>{c.body}</div>
              </div>
            ))}
          </div>
        </section>

        <hr style={S.divider} />

        {/* ── HOW IT WORKS ─────────────────────────────── */}
        <section ref={el => sectionRefs.current.how = el}>
          <h1 style={S.h1}>How It Works</h1>
          <p style={{ ...S.lead, marginTop: 10 }}>A catalog in XVentures consists of a reconciliation key (<span style={S.code}>attendee_id</span>), enriched profile fields, and pairwise scoring logic. The pipeline runs four agents in sequence, each with a focused input and clean JSON output contract.</p>

          <h2 style={S.h2}>Pipeline Workflow</h2>
          <div style={{ background: "#18182E", borderRadius: 10, padding: "26px 22px", margin: "16px 0", overflowX: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 560 }}>
              {[
                { n: "1", label: "EXTRACT", sub: "Enrichment", col: "#2D9B6F" },
                { n: "2", label: "CANDIDATE\nGEN", sub: "Components", col: "#0A7FAD" },
                { n: "3", label: "PERSONA\nSCORING", sub: "Weighted Rank", col: "#7B4FD6" },
                { n: "4", label: "BUCKET\n& RANK", sub: "Decision + Copy", col: "#C47A00" },
              ].map((a, i) => (
                <div key={a.n} style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
                  <div style={{ flex: 1, background: "#1E1E38", border: `1.5px solid ${a.col}`, borderRadius: 7, padding: "13px 8px", textAlign: "center" }}>
                    <div style={{ fontFamily: "DM Mono, monospace", fontSize: 9, color: a.col, fontWeight: 600, marginBottom: 3 }}>AGENT {a.n}</div>
                    <div style={{ fontFamily: "Instrument Sans, sans-serif", fontSize: 11.5, fontWeight: 700, color: "#F7F4EF", marginBottom: 2, whiteSpace: "pre" }}>{a.label}</div>
                    <div style={{ fontFamily: "Instrument Sans, sans-serif", fontSize: 10, color: "#666" }}>{a.sub}</div>
                  </div>
                  {i < 3 && <div style={{ color: "#444", fontSize: 16, flexShrink: 0 }}>→</div>}
                </div>
              ))}
            </div>
          </div>

          <h2 style={S.h2}>Reconciliation Keys</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="tbl">
              <thead><tr><th>Key</th><th>Type</th><th>Usage</th><th>Runs per</th></tr></thead>
              <tbody>
                <tr><td><span style={S.code}>attendee_id</span></td><td>String / UUID</td><td>Links registration to enriched profile across all pair computations</td><td>Attendee (1×, cached)</td></tr>
                <tr><td><span style={S.code}>pair_id</span></td><td>String (a-b)</td><td>Identifies a directed pair. A→B and B→A are separate with different rank_scores</td><td>Directed pair</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr style={S.divider} />

        {/* ── TWO READINESS DIMENSIONS ─────────────────── */}
        <section ref={el => sectionRefs.current.dimensions = el}>
          <h1 style={S.h1}>The Two Readiness Dimensions</h1>
          <p style={{ ...S.lead, marginTop: 10 }}>When creating a match, XVentures evaluates readiness across two fully independent dimensions. This determines which meeting type a pair is eligible for — a core architectural change in v2.1.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
            {[
              { id: "fin", n: "1", label: "Financial Readiness", tag: "FinancialReady(A,B)", col: "#2D9B6F", bg: "#E8F9F2", formula: "MIN(fin_ready_A, fin_ready_B)", best: ["P1 bucket (≥ 0.70): capital meetings", "Investor thesis matching", "Round size alignment"], ex: "Elena (investor, fin=0.91) + James (founder, fin=0.85) → MIN=0.85 → P1 eligible." },
              { id: "ops", n: "2", label: "Operational Readiness", tag: "OperationalReady(A,B)", col: "#0A7FAD", bg: "#E3F4FB", formula: "MIN(ops_ready_A, ops_ready_B)", best: ["PILOT bucket (≥ 0.65): sandbox/pilot meetings", "Regulator-founder collaboration", "Corporate integration partnerships"], ex: "Sophie (Bundesbank, ops=0.91) + James (ops=0.88) → MIN=0.88 → PILOT eligible." },
            ].map(d => (
              <div key={d.id} style={{ ...S.card, borderTop: `3px solid ${d.col}` }}>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: d.col, fontWeight: 600, marginBottom: 4 }}>DIMENSION {d.n}</div>
                <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 19, color: "#18182E", marginBottom: 4 }}>{d.label}</div>
                <span style={{ ...S.badge, background: d.bg, color: d.col }}>{d.tag}</span>
                <div style={{ background: "#F7F4EF", borderRadius: 5, padding: 12, fontFamily: "DM Mono, monospace", fontSize: 12, color: d.col, margin: "14px 0", wordBreak: "break-all" }}>{d.formula}</div>
                <div style={S.h3}>Best for</div>
                {d.best.map(b => <div key={b} style={{ fontSize: 12.5, color: "#555", fontFamily: "Instrument Sans, sans-serif", padding: "2px 0" }}>✓ {b}</div>)}
                <div style={{ ...S.infoBox, marginTop: 12, fontSize: 12, background: d.bg, border: "none" }}><strong>Example:</strong> {d.ex}</div>
              </div>
            ))}
          </div>

          {/* INTERACTIVE CALCULATOR */}
          <h2 style={S.h2}>Interactive Readiness Calculator</h2>
          <p style={{ ...S.body, marginBottom: 18 }}>Adjust individual readiness scores to see how pairwise readiness is computed and which bucket is assigned.</p>
          <div style={S.card}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              {[
                { label: "Person A", vals: [["fin_ready_A", finA, setFinA, "#2D9B6F"], ["ops_ready_A", opsA, setOpsA, "#0A7FAD"]] },
                { label: "Person B", vals: [["fin_ready_B", finB, setFinB, "#2D9B6F"], ["ops_ready_B", opsB, setOpsB, "#0A7FAD"]] },
              ].map(side => (
                <div key={side.label}>
                  <div style={S.h3}>{side.label}</div>
                  {side.vals.map(([label, val, set, col]) => (
                    <div key={label} style={{ marginBottom: 18 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                        <span style={S.code}>{label}</span>
                        <span style={{ fontFamily: "DM Mono, monospace", fontSize: 13, fontWeight: 600, color: col }}>{val.toFixed(2)}</span>
                      </div>
                      <input type="range" min="0" max="1" step="0.01" value={val} onChange={e => set(parseFloat(e.target.value))} style={{ accentColor: col }} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <hr style={{ border: "none", borderTop: "1px solid #E4E0D8", margin: "18px 0" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { label: "FinancialReady(A,B)", val: finReady, detail: `MIN(${finA.toFixed(2)}, ${finB.toFixed(2)})`, col: "#2D9B6F", bg: "#E8F9F2" },
                { label: "OperationalReady(A,B)", val: opsReady, detail: `MIN(${opsA.toFixed(2)}, ${opsB.toFixed(2)})`, col: "#0A7FAD", bg: "#E3F4FB" },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 6, padding: "14px 16px", textAlign: "center" }}>
                  <div style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: s.col, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 34, color: s.col }}>{s.val.toFixed(2)}</div>
                  <div style={{ fontSize: 10.5, color: "#888", fontFamily: "Instrument Sans, sans-serif", marginTop: 4 }}>{s.detail}</div>
                  <div style={{ height: 6, background: `${s.col}30`, borderRadius: 3, marginTop: 10 }}>
                    <div className="score-bar" style={{ width: `${s.val * 100}%`, background: s.col }} />
                  </div>
                </div>
              ))}
              <div style={{ background: bucketBg, border: `1.5px solid ${bucketColor}`, borderRadius: 6, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: bucketColor, marginBottom: 4 }}>BUCKET ASSIGNED</div>
                <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 36, color: bucketColor }}>{bucket}</div>
                <div style={{ fontSize: 10.5, color: "#888", fontFamily: "Instrument Sans, sans-serif", marginTop: 4 }}>
                  {p1 ? "fin_ready ≥ 0.70" : pilot ? "ops_ready ≥ 0.65" : (finReady >= 0.40 || opsReady >= 0.40) ? "MAX ≥ 0.40" : "match < 0.40"}
                </div>
              </div>
            </div>
          </div>

          <div style={{ ...S.infoBox, borderLeft: "3px solid #C47A00" }}>
            <strong>Critical rule:</strong> FinancialReady and OperationalReady are <em>never blended</em>. A pair with financial_ready=0.10 and operational_ready=0.85 is a PILOT match, not P3. Keeping the two dimensions independent prevents capital-deployment metrics from obscuring sandbox readiness.
          </div>
        </section>

        <hr style={S.divider} />

        {/* ── FOUR-AGENT PIPELINE ───────────────────────── */}
        <section ref={el => sectionRefs.current.pipeline = el}>
          <h1 style={S.h1}>The Four-Agent Pipeline</h1>
          <p style={{ ...S.lead, marginTop: 10 }}>Each agent has a single job, a defined input schema, and a clean JSON output contract. Agent 1 runs once per attendee and caches its output. Agents 2–4 run per directed pair and can be parallelised.</p>

          <div style={{ overflowX: "auto", marginTop: 20, marginBottom: 28 }}>
            <table className="tbl">
              <thead><tr><th>Agent</th><th>Job</th><th>Runs per</th><th>Token budget</th><th>Output</th></tr></thead>
              <tbody>
                {[
                  { n: "1 · Extract", job: "Raw registration → structured enriched profile", runs: "Attendee (1×, cached)", tok: "700–1,100", out: "persona · intent · tags · credibility · fin_ready · ops_ready" },
                  { n: "2 · Candidate Gen", job: "Score 6 match components + pairwise readiness", runs: "Directed pair (A→B)", tok: "500–800", out: "6 components + FinancialReady(A,B) + OperationalReady(A,B)" },
                  { n: "3 · Persona Scoring", job: "Apply playbook weights → match_score + rank_score", runs: "Directed pair (A→B)", tok: "250–400", out: "match_score · rank_score · top_feature" },
                  { n: "4 · Bucket & Rank", job: "Bucket assignment + explanation generation", runs: "Directed pair (A→B)", tok: "600–1,000", out: "bucket · CTA · explanation_short · explanation_long · flags" },
                ].map(r => (
                  <tr key={r.n}><td><strong style={{ fontFamily: "DM Mono, monospace", fontSize: 12 }}>{r.n}</strong></td><td>{r.job}</td><td>{r.runs}</td><td><span style={{ fontFamily: "DM Mono, monospace", fontSize: 11 }}>{r.tok}</span></td><td style={{ fontSize: 12, color: "#666" }}>{r.out}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          {[
            { n: "1", label: "Extract Agent", col: "#2D9B6F", bg: "#E8F9F2", runs: "Once per attendee — output cached for all pairs", tok: "700–1,100 tokens",
              inp: "Raw registration JSON + LinkedIn/Crunchbase fields",
              out: "persona_type · sub_persona · primary_intent · secondary_intents · mandate_summary · vertical/regulatory/geography/compliance_tags · credibility_score · fin_ready_score · ops_ready_score · confirmations",
              rules: ["Stage label never affects traction_score, credibility_score, or readiness — filter use only","Self-reported persona is an input, not a conclusion — always cross-check against job title and freetext","Confirmation fields require freetext corroboration — checkbox alone is insufficient","mandate_summary must name ≥1 specific: stage, product, regulatory program, geography, or technology"] },
            { n: "2", label: "Candidate Generation Agent", col: "#0A7FAD", bg: "#E3F4FB", runs: "Once per directed pair (A→B)", tok: "500–800 tokens",
              inp: "Two enriched profiles from Agent 1",
              out: "persona_fit · intent_overlap · thematic_fit · complementary_score · non_obvious_score · credibility_score · financial_ready(A,B) · operational_ready(A,B)",
              rules: ["fin_ready and ops_ready copied from Agent 1 — never recomputed here","MIN() for pairwise readiness — never average","financial_ready and operational_ready are fully independent — never blended","non_obvious_score fires when tag_overlap < 0.25 but mandate semantics align"] },
            { n: "3", label: "Persona-Aware Scoring Agent", col: "#7B4FD6", bg: "#EEE9FF", runs: "Once per directed pair (A→B) — directional", tok: "250–400 tokens",
              inp: "6 components + pairwise readiness + event playbook",
              out: "match_score · rank_score · top_feature · scoring detail (alpha, beta, gamma applied)",
              rules: ["Weights from the playbook — never hardcoded","rank_score is directional — A→B ≠ B→A; never reuse for the reverse pair","gamma selects dimension: fin=financial, ops=operational, max=MAX of both","Six component weights must sum to 1.0"] },
            { n: "4", label: "Bucket & Rank Agent", col: "#C47A00", bg: "#FFF5E0", runs: "Once per directed pair (A→B)", tok: "600–1,000 tokens",
              inp: "match_score + readiness + rank_score + lightweight profiles",
              out: "bucket (P1/PILOT/P2/P3/null) · CTA · explanation_short (≤180 chars) · explanation_long (150–300 words) · flags",
              rules: ["Bucket rules ordered — first match wins; P1 before PILOT before P2","explanation_short must name a specific reason — generic phrases are a failure","explanation_long uses only input data — never invent figures, clients, or timelines","null bucket = excluded from shortlist; no explanations written"] },
          ].map((step, i) => (
            <div key={step.n} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: step.col, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, fontFamily: "DM Mono, monospace", flexShrink: 0 }}>{step.n}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                    <div style={{ fontFamily: "DM Serif Display, serif", fontSize: 19, color: "#18182E" }}>{step.label}</div>
                    <span style={{ ...S.badge, background: step.bg, color: step.col }}>{step.runs}</span>
                    <span style={{ ...S.badge, background: "#EEEAE0", color: "#777" }}>{step.tok}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                    <div style={{ background: "#FAFAF6", borderRadius: 5, padding: "10px 12px" }}>
                      <div style={S.h3}>Input</div>
                      <div style={{ fontSize: 12, color: "#555", fontFamily: "Instrument Sans, sans-serif" }}>{step.inp}</div>
                    </div>
                    <div style={{ background: step.bg, borderRadius: 5, padding: "10px 12px" }}>
                      <div style={{ ...S.h3, color: step.col }}>Output</div>
                      <div style={{ fontSize: 12, color: "#444", fontFamily: "Instrument Sans, sans-serif" }}>{step.out}</div>
                    </div>
                  </div>
                  <div style={S.h3}>Critical rules</div>
                  {step.rules.map(r => (
                    <div key={r} style={{ fontSize: 12.5, color: "#555", fontFamily: "Instrument Sans, sans-serif", padding: "3px 0 3px 12px", borderLeft: `2px solid ${step.col}`, marginBottom: 5 }}>{r}</div>
                  ))}
                </div>
              </div>
              {i < 3 && <div style={{ width: 1, height: 20, background: "#E0DDD5", marginLeft: 15, marginTop: 6 }} />}
            </div>
          ))}
        </section>

        <hr style={S.divider} />

        {/* ── DATA SOURCES ─────────────────────────────── */}
        <section ref={el => sectionRefs.current.sources = el}>
          <h1 style={S.h1}>Data Sources</h1>
          <p style={{ ...S.lead, marginTop: 10 }}>Three import modes are available. Each feeds Agent 1's enrichment pipeline. All modes produce the same enriched profile structure.</p>

          <div style={{ overflowX: "auto", marginTop: 20 }}>
            <table className="tbl">
              <thead><tr><th>Mode</th><th>Format</th><th>Size Limit</th><th>Key Fields</th><th>Weight</th></tr></thead>
              <tbody>
                <tr><td><strong>API (Real-time)</strong></td><td>JSON / ndJSON</td><td>No limit</td><td>All registration + external fields via webhook</td><td><span style={{ color: "#2D9B6F", fontWeight: 700 }}>Primary</span></td></tr>
                <tr><td><strong>sFTP (Batch)</strong></td><td>CSV</td><td>5GB (1GB rec.)</td><td>Bulk export from event management systems</td><td><span style={{ color: "#0A7FAD", fontWeight: 700 }}>Automated</span></td></tr>
                <tr><td><strong>Manual Upload (UI)</strong></td><td>CSV</td><td>10MB</td><td>Drag-and-drop for offline registration lists</td><td><span style={{ color: "#7B4FD6", fontWeight: 700 }}>Self-serve</span></td></tr>
              </tbody>
            </table>
          </div>

          <h2 style={S.h2}>External Data Sources</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "LinkedIn API", col: "#0A7FAD", fields: "linkedin_headline, summary, recent_roles", use: "Persona override detection, seniority_score, institution_quality_score", weight: "High — most reliable for role confirmation" },
              { label: "Crunchbase API", col: "#7B4FD6", fields: "funding_total_usd, last_round_type, investor_count", use: "traction_score signals (funding confirmed, tier-1 investors)", weight: "Medium — corroborative, not primary" },
            ].map(s => (
              <div key={s.label} style={{ ...S.card, borderLeft: `3px solid ${s.col}` }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#18182E", fontFamily: "Instrument Sans, sans-serif", marginBottom: 8 }}>{s.label}</div>
                <div style={{ marginBottom: 6 }}><span style={S.h3}>Fields</span><div style={{ fontSize: 12, color: "#555", fontFamily: "DM Mono, monospace", marginTop: 2 }}>{s.fields}</div></div>
                <div style={{ marginBottom: 6 }}><span style={S.h3}>Used for</span><div style={{ fontSize: 12.5, color: "#555", fontFamily: "Instrument Sans, sans-serif", marginTop: 2 }}>{s.use}</div></div>
                <div><span style={S.h3}>Weight</span><div style={{ fontSize: 12.5, color: "#555", fontFamily: "Instrument Sans, sans-serif", marginTop: 2 }}>{s.weight}</div></div>
              </div>
            ))}
          </div>

          <div style={{ ...S.infoBox, marginTop: 12 }}>
            <strong>Alerting:</strong> If enrichment_quality {"<"} 0.40 for more than 15% of a batch, the organiser receives an email with a report of profiles flagged <span style={S.code}>needs_review=true</span> and the specific <span style={S.code}>data_gaps</span> that triggered the flag.
          </div>
        </section>

        <hr style={S.divider} />

        {/* ── QUALITY MONITORING ────────────────────────── */}
        <section ref={el => sectionRefs.current.quality = el}>
          <h1 style={S.h1}>Quality Monitoring</h1>
          <p style={{ ...S.lead, marginTop: 10 }}>Two monitoring layers operate independently: profile-level enrichment quality (per attendee, from Agent 1) and match-level quality flags (per pair, from Agents 2–4).</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24 }}>
            <div>
              <h2 style={{ ...S.h2, marginTop: 0 }}>Profile Quality Flags</h2>
              <table className="tbl">
                <thead><tr><th>Condition</th><th>Flag</th></tr></thead>
                <tbody>
                  {[
                    ["enrichment_quality < 0.40", "needs_review", "#FFE8E8", "#C00"],
                    ["persona_confidence < 0.70", "needs_review", "#FFE8E8", "#C00"],
                    ["Self-reported persona overridden", "persona_overridden", "#FFF5E0", "#C47A00"],
                    ["LinkedIn URL missing", "−0.15 quality", "#EEEAE0", "#666"],
                    ["Freetext < 20 words", "quality < 0.40", "#EEEAE0", "#666"],
                  ].map(([cond, flag, bg, col]) => (
                    <tr key={cond}><td style={{ fontSize: 12.5 }}>{cond}</td><td><span style={{ ...S.badge, background: bg, color: col }}>{flag}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h2 style={{ ...S.h2, marginTop: 0 }}>Match Quality Flags</h2>
              <table className="tbl">
                <thead><tr><th>Flag</th><th>Condition</th></tr></thead>
                <tbody>
                  {[
                    ["high_confidence", "#E8F9F2", "#2D9B6F", "Both persona_confidence ≥ 0.80"],
                    ["is_non_obvious", "#EEE9FF", "#7B4FD6", "non_obvious_score ≥ 0.55"],
                    ["is_complementary", "#E3F4FB", "#0A7FAD", "complementary_score ≥ 0.75"],
                    ["low_size_fit", "#FFF5E0", "#C47A00", "investor + round_size_match < 0.50 + P1"],
                    ["cross_type_match", "#FFE8E8", "#C00", "A=regulator AND bucket=P1"],
                    ["organizer_override", "#EEEAE0", "#666", "organizer_pinned forced P1"],
                  ].map(([flag, bg, col, cond]) => (
                    <tr key={flag}><td><span style={{ ...S.badge, background: bg, color: col }}>{flag}</span></td><td style={{ fontSize: 12.5 }}>{cond}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h2 style={S.h2}>Processing Report</h2>
          <p style={S.body}>Each import generates a processing report in the organiser dashboard: enrichment_quality distribution, needs_review count, persona override rate, most common data_gaps, and preview of the first 10 enriched profiles. The report is differentiated by import mode (API, sFTP, manual).</p>
        </section>

        <hr style={S.divider} />

        {/* ── USE CASES ────────────────────────────────── */}
        <section ref={el => sectionRefs.current.usecases = el}>
          <h1 style={S.h1}>Use Cases</h1>
          <p style={{ ...S.lead, marginTop: 10 }}>Each persona generates a distinct shortlist shaped by their scoring weights. Select a persona to see how the pipeline handles their data end-to-end.</p>

          <div style={{ display: "flex", gap: 8, marginTop: 20, marginBottom: 20, flexWrap: "wrap" }}>
            {PERSONAS.map(p => (
              <button key={p.id} className="persona-tab" onClick={() => setActivePersona(p.id)}
                style={{ background: activePersona === p.id ? p.color : "white", color: activePersona === p.id ? "white" : p.color, borderColor: p.color }}>
                {p.icon} {p.label}
              </button>
            ))}
          </div>

          <div style={{ ...S.card, borderTop: `3px solid ${persona.color}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Primary Intent", val: persona.intent },
                { label: "Rank Gamma (γ)", val: `gamma = ${persona.gamma}` },
                { label: "Alpha / Beta", val: `α = ${persona.alpha}  ·  β = ${persona.beta}` },
              ].map(s => (
                <div key={s.label} style={{ background: persona.bg, borderRadius: 6, padding: "12px 14px" }}>
                  <div style={{ ...S.h3, color: persona.color, marginTop: 0 }}>{s.label}</div>
                  <div style={{ fontFamily: "DM Mono, monospace", fontSize: 12.5, color: "#18182E" }}>{s.val}</div>
                </div>
              ))}
            </div>
            {persona.examples.map((ex, i) => (
              <div key={i} style={{ borderLeft: `3px solid ${persona.color}`, paddingLeft: 16, marginBottom: 18 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#18182E", fontFamily: "Instrument Sans, sans-serif", marginBottom: 6 }}>{ex.title}</div>
                <div style={{ ...S.body, fontSize: 13, color: "#555" }}>{ex.body}</div>
              </div>
            ))}
          </div>

          <h2 style={S.h2}>Bucket Eligibility by Persona</h2>
          <div style={{ overflowX: "auto" }}>
            <table className="tbl">
              <thead><tr><th>Persona</th><th>P1 (Capital)</th><th>PILOT (Sandbox)</th><th>P2 (Strategic)</th><th>Ranked by</th></tr></thead>
              <tbody>
                <tr><td>Investor</td><td>✓ Primary bucket</td><td>Rare (cross_type flag)</td><td>✓</td><td>Counterparty fin_ready (α=0.60)</td></tr>
                <tr><td>Founder</td><td>✓ If actively raising</td><td>✓ If operationally ready</td><td>✓</td><td>MAX(fin, ops) — γ=max</td></tr>
                <tr><td>Regulator</td><td>Rare (cross_type flag)</td><td>✓ Primary bucket</td><td>✓</td><td>Counterparty ops_ready (α=0.20)</td></tr>
                <tr><td>Corporate</td><td>✓ If corp_vc active</td><td>✓ If pilot-ready</td><td>✓</td><td>MAX(fin, ops) + own readiness (β=0.15)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr style={S.divider} />

        {/* ── FAQ ──────────────────────────────────────── */}
        <section ref={el => sectionRefs.current.faq = el}>
          <h1 style={S.h1}>FAQ</h1>
          <div style={{ marginTop: 20 }}>
            {FAQS.map((f, i) => (
              <div key={i} style={{ border: "1px solid #E4E0D8", borderRadius: 6, marginBottom: 8, overflow: "hidden" }}>
                <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span style={{ flex: 1 }}>{f.q}</span>
                  <span style={{ color: "#BBB", fontSize: 20, flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
                </div>
                {openFaq === i && (
                  <div style={{ padding: "0 18px 14px", fontSize: 13.5, lineHeight: 1.75, color: "#555", fontFamily: "Instrument Sans, sans-serif", background: "white" }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        <hr style={S.divider} />

        {/* ── GLOSSARY ─────────────────────────────────── */}
        <section ref={el => sectionRefs.current.glossary = el}>
          <h1 style={S.h1}>Glossary</h1>
          <div style={{ marginTop: 16, marginBottom: 20 }}>
            <input type="text" placeholder="Search terms or definitions…" value={glossarySearch} onChange={e => setGlossarySearch(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", border: "1px solid #E4E0D8", borderRadius: 6, fontFamily: "Instrument Sans, sans-serif", fontSize: 14, background: "white", outline: "none", color: "#18182E" }} />
          </div>
          <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
            {filteredGlossary.length === 0 ? (
              <div style={{ padding: 24, color: "#999", fontFamily: "Instrument Sans, sans-serif", textAlign: "center" }}>No terms match "{glossarySearch}"</div>
            ) : filteredGlossary.map((g, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "230px 1fr", borderBottom: i < filteredGlossary.length - 1 ? "1px solid #E4E0D8" : "none" }}>
                <div style={{ padding: "11px 16px 11px 20px", fontFamily: "DM Mono, monospace", fontSize: 12, fontWeight: 500, color: "#18182E" }}>{g.term}</div>
                <div style={{ padding: "11px 20px 11px 16px", fontSize: 13, color: "#555", fontFamily: "Instrument Sans, sans-serif", lineHeight: 1.6, borderLeft: "1px solid #E4E0D8" }}>{g.def}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <div style={{ marginTop: 64, paddingTop: 22, borderTop: "1px solid #E4E0D8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "Instrument Sans, sans-serif", fontSize: 12, color: "#BBB" }}>XVentures Data Strategy · v2.1</div>
          <div style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: "#CCC" }}>extract · candidate_gen · persona_scoring · bucket_rank</div>
        </div>
      </main>
    </div>
  );
}
