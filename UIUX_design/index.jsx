import { useState, useEffect, useRef } from "react";

const PLATFORMS = [
  {
    id: "hubspot",
    label: "HubSpot CRM",
    shortLabel: "HubSpot",
    color: "#FF7A59",
    bg: "#1a0f0b",
    accent: "#FF7A59",
    tag: "CRM / RevOps",
    description: "Full-stack revenue platform: marketing, sales, service, CMS hubs"
  },
  {
    id: "notebooklm",
    label: "NotebookLM",
    shortLabel: "NotebookLM",
    color: "#4285F4",
    bg: "#0b0e1a",
    accent: "#4285F4",
    tag: "AI Research Notebook",
    description: "Google's AI-native notebook grounded in user-uploaded sources"
  },
  {
    id: "contentplatform",
    label: "Content Platform",
    shortLabel: "Content",
    color: "#00C9A7",
    bg: "#0a1a16",
    accent: "#00C9A7",
    tag: "Notion + Canva Composite",
    description: "Structured docs + visual publishing: block-based creation & design"
  },
  {
    id: "dealfront",
    label: "Dealfront",
    shortLabel: "Dealfront",
    color: "#7C3AED",
    bg: "#120b1a",
    accent: "#7C3AED",
    tag: "B2B Sales Intelligence",
    description: "European B2B lead gen, intent data, and buyer identification platform"
  }
];

const SECTIONS = [
  { id: "context", icon: "◈", label: "Product & User Context" },
  { id: "ia", icon: "⊞", label: "Global Information Architecture" },
  { id: "datamodel", icon: "◉", label: "Domain Object & Data Model" },
  { id: "layouts", icon: "▣", label: "Screen-Level Layouts" },
  { id: "flows", icon: "→", label: "Navigation & User Flows" },
  { id: "interactions", icon: "◎", label: "Interaction Patterns" },
  { id: "datacapture", icon: "⊕", label: "Data Definition & Validation" },
  { id: "presentation", icon: "▦", label: "Data Presentation & Sense-Making" },
  { id: "states", icon: "⟳", label: "State Management & Modes" },
  { id: "jtbd", icon: "⬡", label: "JTBD Alignment" },
  { id: "onboarding", icon: "✦", label: "Onboarding & Guidance" },
  { id: "errors", icon: "⚠", label: "Error Handling & Recovery" },
  { id: "opportunities", icon: "◆", label: "Opportunities & Transferable Patterns" }
];

const CONTENT = {
  hubspot: {
    context: {
      title: "HubSpot CRM — Product & User Context",
      blocks: [
        {
          heading: "Core Value Proposition",
          type: "prose",
          content: "HubSpot sells the idea that marketing, sales, and service teams can share a single system of record without the enterprise implementation tax of Salesforce. Its CRM is free-forever at the base tier, creating a land-and-expand motion where users adopt the contact/company/deal model first, then unlock paid hubs. The product bets on ease-of-use and full-funnel visibility over deep customization."
        },
        {
          heading: "Primary User Segments",
          type: "table",
          rows: [
            ["Segment", "Primary JTBD", "Frequency"],
            ["SDR / BDR", "Log activity, advance deals, track follow-ups", "Daily, mobile + desktop"],
            ["AE / Sales Manager", "Pipeline review, forecast, coach reps", "Daily dashboards, weekly pipeline review"],
            ["Marketing Ops", "Campaign attribution, contact segmentation, reporting", "Weekly setup, daily monitoring"],
            ["RevOps / Admin", "Object config, workflow automation, integrations", "Setup-heavy, periodic audits"],
            ["CS / Support", "Ticket management, customer health, renewal tracking", "Daily queue management"]
          ]
        },
        {
          heading: "Key Design Tensions",
          type: "insights",
          items: [
            "Free CRM creates a massive top-of-funnel but floods the UI with upsell prompts — gating creates friction at exactly the moment users need the feature most.",
            "Multi-hub architecture means the same user often needs to context-switch between CRM (contacts), Marketing (campaigns), and Service (tickets) — the nav bar must serve radically different mental models simultaneously.",
            "Global vs local configurability: admins can build complex property groups and workflows, but front-line reps only want to log a call — the same screen must serve both."
          ]
        }
      ]
    },
    ia: {
      title: "HubSpot — Global Information Architecture",
      blocks: [
        {
          heading: "Navigation Model",
          type: "prose",
          content: "HubSpot uses a persistent left-rail mega-nav organized by Hub (Marketing, Sales, Service, CMS, Ops, Commerce). Each hub has a collapsible submenu with object-level entries (Contacts, Companies, Deals, Tickets). A global top bar carries search, notifications, help, and account switching. The 'Workspaces' concept introduced in 2023 adds a task-and-deal combined view for reps — a break from the object-centric model toward a role-centric one."
        },
        {
          heading: "Content Hierarchy",
          type: "hierarchy",
          items: [
            { level: 0, label: "Hub (Marketing / Sales / Service / CMS)" },
            { level: 1, label: "Object Index (Contacts, Companies, Deals, Tickets, Products)" },
            { level: 2, label: "Object Record (Contact: Timeline, Properties, Associations)" },
            { level: 3, label: "Inline sub-objects (Emails, Calls, Meetings, Notes on Timeline)" },
            { level: 1, label: "Reports & Dashboards (cross-hub analytics)" },
            { level: 1, label: "Automation (Workflows, Sequences, Chatflows)" },
            { level: 1, label: "Settings (Admin-gated configuration)" }
          ]
        },
        {
          heading: "Cross-Hub Navigation Pattern",
          type: "insights",
          items: [
            "Object records are shared across hubs — a Contact record visible from Sales is the same as seen from Marketing, but contextual actions differ (enroll in sequence vs add to campaign).",
            "Association panels on records create lateral navigation (Deal → Company → Contact) without returning to list views — reducing top-level nav dependency.",
            "Breadcrumbs are shallow: typically only 'Back to [object name]' rather than full path, which suggests HubSpot assumes most navigation happens within a hub, not across hubs."
          ]
        }
      ]
    },
    datamodel: {
      title: "HubSpot — Domain Object & Data Model",
      blocks: [
        {
          heading: "Core Objects & Relationships",
          type: "table",
          rows: [
            ["Object", "Key Properties Surfaced", "Key Relationships"],
            ["Contact", "Name, Email, Lifecycle Stage, Owner, Last Activity", "→ Company (many-to-one), → Deal (many-to-many), → Ticket"],
            ["Company", "Name, Domain, Revenue, Industry, # Contacts", "→ Contacts (one-to-many), → Deals (one-to-many)"],
            ["Deal", "Name, Stage, Amount, Close Date, Owner", "→ Contact, → Company, → Line Items"],
            ["Ticket", "Subject, Status, Priority, Source, Owner", "→ Contact, → Company, → Conversations"],
            ["Product", "Name, Unit Price, SKU", "→ Deals (via Line Items)"]
          ]
        },
        {
          heading: "Filtering & Segmentation Exposure",
          type: "prose",
          content: "List views use a 'Filter' button that opens a right-panel query builder. Users chain AND/OR conditions across any property, including associations ('Contacts where associated Deal amount > $10k'). Saved Views persist filters as named tabs above the list. Advanced filtering power is hidden behind a 'More filters' toggle — progressive disclosure that protects novice users while rewarding power users. Column configuration is per-object, per-user, not globally admin-set."
        },
        {
          heading: "Data Model Design Decisions",
          type: "insights",
          items: [
            "Custom Objects (Enterprise) allow extending beyond the 5 standard objects — but the UI for custom objects is identical to standard ones, which is a strong design constraint: everything must fit the record-page template.",
            "Properties are organized into 'Property Groups' by admins — but reps see a flat sidebar scroll. The group concept is primarily an admin metadata concern, not a user-facing navigation device.",
            "Lifecycle Stage on Contact is a special property because its values are pipeline-like (Lead → MQL → SQL → Customer) but it isn't a pipeline board — it's a dropdown. This reflects a deliberate choice to keep the Contact model simple and push pipeline complexity to Deals."
          ]
        }
      ]
    },
    layouts: {
      title: "HubSpot — Screen-Level Layout Patterns",
      blocks: [
        {
          heading: "Primary Layouts Used",
          type: "table",
          rows: [
            ["Screen", "Layout Pattern", "Primary Action"],
            ["Contact/Company/Deal Index", "Filterable table with inline quick-actions", "Create new object"],
            ["Deal Pipeline", "Kanban board with collapsible columns", "Move deal stage / create deal"],
            ["Record Page", "Two-column: timeline left, properties right", "Log activity / Edit properties"],
            ["Reports", "Dashboard grid of chart cards", "Add report / filter date range"],
            ["Workflow Builder", "Canvas with node connections", "Add action / trigger"],
            ["Email Composer", "Split: editor left, preview right", "Send / Schedule"],
            ["Settings", "Left nav + form panel", "Save changes"]
          ]
        },
        {
          heading: "CTA Hierarchy on the Record Page",
          type: "prose",
          content: "The record page concentrates actions in a toolbar just above the Timeline: Log Activity (call/email/meeting/note), Create Task, Schedule Meeting. These are always visible and always primary — the design hypothesis is that 'logging what happened' is the #1 rep job. Secondary actions (Edit, Clone, Delete) are in a secondary '...' overflow menu in the top right. Destructive actions (Delete) require a confirmation modal. This hierarchy reflects a deliberate choice: reduce accidental data loss over optimizing for bulk deletion speed."
        },
        {
          heading: "Key Layout Constraints",
          type: "insights",
          items: [
            "The two-column record layout (timeline + sidebar) is rigid — admins can reorder sidebar sections but cannot change the overall page architecture. This is a strong componentization constraint.",
            "Pipeline Kanban uses horizontal scroll for stages > 6 — a known UX debt that HubSpot has partially addressed with stage collapsing, but it reveals the constraint that the board must be in a single viewport row.",
            "Modals for 'Create' flows are kept narrow (single-column) to reduce cognitive load at creation time — complex properties are deferred to the record page post-creation."
          ]
        }
      ]
    },
    flows: {
      title: "HubSpot — Navigation & User Flows",
      blocks: [
        {
          heading: "Happy Path: Creating and Qualifying a Deal",
          type: "flow",
          steps: [
            { step: "1", label: "Entry: Contact record → 'Create Deal' button in associations panel" },
            { step: "2", label: "Modal: Deal Name, Pipeline, Stage, Amount, Close Date, Owner (5 required fields)" },
            { step: "3", label: "Deal record auto-opens — Timeline empty, sidebar shows key properties" },
            { step: "4", label: "Rep logs first activity: 'Log Activity → Call' — fills outcome, notes, next steps" },
            { step: "5", label: "Task created from next steps — appears in rep's task queue and Workspace" },
            { step: "6", label: "Manager reviews in Pipeline board, drags deal to next stage or adds private note" }
          ]
        },
        {
          heading: "Happy Path: Running a Marketing Campaign Sequence",
          type: "flow",
          steps: [
            { step: "1", label: "Marketing Hub → Contacts → Create List (active: filter by Lifecycle = MQL)" },
            { step: "2", label: "Marketing → Email → Create Email (template picker → drag-drop editor)" },
            { step: "3", label: "Campaigns → New Campaign → attach email, landing page, ads" },
            { step: "4", label: "Review → Schedule → Send / A-B test variant" },
            { step: "5", label: "Campaigns dashboard: opens, clicks, contacts influenced, revenue attributed" }
          ]
        },
        {
          heading: "Back/Forward Navigation Strategy",
          type: "insights",
          items: [
            "HubSpot relies on browser back button plus a single contextual 'Back to [List Name]' breadcrumb at the top of record pages — no multi-level breadcrumb trail.",
            "The Pipeline board maintains state on return — filter, collapsed columns, and scroll position are preserved within a session, reducing disorientation after record drilldown.",
            "Workspace (2023) introduces a persistent side-panel model for quick deal/task interaction without full page navigation — reduces the back-button dependency for rep workflows."
          ]
        }
      ]
    },
    interactions: {
      title: "HubSpot — Interaction & Design Patterns",
      blocks: [
        {
          heading: "Form Patterns",
          type: "prose",
          content: "HubSpot uses two form paradigms: modal-creation forms (short, 3–7 fields, no autosave) and inline editing on record pages (click any property value to edit in place, tab to next, auto-saves on blur). This reflects a 'creation is deliberate, editing is casual' design principle. Multi-step forms appear only in Workflows and Email sequences — progressive reveal using a step indicator at the top. Validation is real-time for email format, URL format — but most fields accept any string without constraint."
        },
        {
          heading: "Table / Collection Patterns",
          type: "table",
          rows: [
            ["Pattern", "Implementation", "Insight"],
            ["Bulk Actions", "Checkbox select → action bar appears above table", "Contextual, not always visible — reduces noise"],
            ["Saved Views", "Named filter presets as tabs above table", "Promotes team-shared segmentation conventions"],
            ["Column Config", "Per-user column picker — drag to reorder", "User autonomy, but no admin-set defaults"],
            ["Inline Filters", "Filter panel opens right — stacked conditions", "AND/OR logic exposed after 'Add filter'"],
            ["Quick Edit", "Inline cell edit on hover for status/owner fields", "Reduces round-trip to record page for common updates"]
          ]
        },
        {
          heading: "Feedback Patterns",
          type: "insights",
          items: [
            "Toast notifications (bottom-left, 4s auto-dismiss) for save, create, delete success — include 'Undo' link for destructive actions within the window.",
            "Empty states are among HubSpot's strongest design moments: they include an illustration, contextual copy ('No deals yet — create your first deal to track revenue'), and a primary CTA button. They are JTBD-framed, not generically empty.",
            "Inline errors on forms appear below the field in red, but do not prevent typing — non-blocking. Submission-level errors appear above the form as a banner."
          ]
        }
      ]
    },
    datacapture: {
      title: "HubSpot — Data Definition & Validation",
      blocks: [
        {
          heading: "Data Introduction Methods",
          type: "table",
          rows: [
            ["Method", "Description", "Quality Signal"],
            ["Manual input", "Rep creates Contact/Deal via modal or record", "Low — rep discretion"],
            ["Forms", "Website form submissions → auto-create contact", "High — structured fields"],
            ["CSV import", "Bulk import with column mapping wizard", "Medium — depends on source"],
            ["Integrations", "Salesforce sync, Gmail, LinkedIn Sales Nav", "High — system-of-record sync"],
            ["Tracking", "HubSpot JS pixel tracks page views → enriches contact", "High — behavioral"],
            ["AI enrichment", "Breeze AI can suggest company properties from domain", "Medium — AI confidence varies"]
          ]
        },
        {
          heading: "Required vs Optional Fields",
          type: "prose",
          content: "HubSpot's default required fields at Deal creation are minimal: only Deal Name is truly required. Close Date, Amount, Pipeline, and Stage are required by most admin configurations but are platform-optional. This reflects an important design bet: a low-friction deal creation path that allows reps to log the existence of an opportunity immediately and fill in details later — matching the sales reality that deals are often vague at inception. Admins can enforce additional required fields via 'Required on creation' property settings."
        },
        {
          heading: "Guardrails & Progressive Profiling",
          type: "insights",
          items: [
            "Duplicate detection runs on Contact email on creation — HubSpot surfaces a 'similar contact exists' warning but doesn't block creation. Prioritizes recall over precision.",
            "Property groups implement staged data collection by surfacing 'essential' properties first in the sidebar, with 'View all properties' revealing the full set. This is progressive disclosure at the data level.",
            "Workflows can enforce data quality indirectly: a workflow can flag deals without a close date by creating a task for the owner — governance through automation rather than hard constraints."
          ]
        }
      ]
    },
    presentation: {
      title: "HubSpot — Data Presentation & Sense-Making",
      blocks: [
        {
          heading: "Dashboard & KPI Layer",
          type: "prose",
          content: "Reports dashboards are widget grids: each widget is a report (bar chart, pie, table, number card). The default Sales Dashboard ships with 'Deals Closed Won vs Target', 'Pipeline by Stage', 'Activity Leaderboard' — immediately actionable for a sales manager. Custom dashboards are per-user or shared. The 'number card' (single KPI with trend arrow and comparison period) is the most frequently used widget — designed for glanceable management review, not deep analysis."
        },
        {
          heading: "Visualization Types by Context",
          type: "table",
          rows: [
            ["Context", "Visualization", "Why"],
            ["Pipeline board", "Kanban with deal-count and value per stage", "Spatial metaphor for sales process stages"],
            ["Sales dashboards", "Bar charts, funnel charts, number cards", "Comparison and trend over time"],
            ["Contact timeline", "Chronological activity feed with type icons", "History reconstruction, not aggregation"],
            ["Forecast view", "Table with amount columns + variance vs quota", "Numerical precision for manager review"],
            ["Workflow performance", "Funnel visualization: enrolled → completed", "Process health check"]
          ]
        },
        {
          heading: "AI Content Differentiation",
          type: "insights",
          items: [
            "Breeze AI generates call summaries, email drafts, and property suggestions — these are surfaced with a subtle 'AI' badge/icon and are always editable before saving. The boundary between AI-generated and user-entered data is maintained at the property level.",
            "ChatSpot (conversational AI) produces reports and summaries inline in a chat panel — the output is presented in a card that can be pinned to a dashboard. This separates AI-generated analysis from canonical CRM data clearly.",
            "AI-suggested next steps appear in a non-blocking 'suggestion chip' below the timeline — not intrusive, but visible for users who want AI guidance."
          ]
        }
      ]
    },
    states: {
      title: "HubSpot — State Management & Modes",
      blocks: [
        {
          heading: "Viewing vs Editing States",
          type: "prose",
          content: "HubSpot uses inline editing rather than a distinct 'edit mode' for record pages — clicking any property value in the sidebar immediately makes it editable. This removes the cognitive step of entering/exiting edit mode but creates an implicit 'always potentially editing' state. The Email/Landing Page editors are the exception: they use an explicit 'builder mode' vs 'preview mode' toggle, reflecting that template editing requires a different spatial context than quick field edits."
        },
        {
          heading: "Drafts, Autosave & Version History",
          type: "table",
          rows: [
            ["Feature", "Behavior", "User Signal"],
            ["Property edits", "Autosave on blur/tab — no explicit save button", "No draft state — edits are live immediately"],
            ["Email drafts", "Auto-saved as draft — 'Last saved X min ago' indicator", "Explicit draft state in email index"],
            ["Workflow edits", "Must publish — unpublished changes are 'draft' mode", "Clear draft/live distinction"],
            ["Import mapping", "Session-only — not saved if tab closed", "Known UX debt in import flow"]
          ]
        },
        {
          heading: "Permission-Related States",
          type: "insights",
          items: [
            "Gated features show a lock icon on the nav item and a 'Upgrade to unlock' tooltip — not hidden, but visually dimmed. This is intentional upsell design: show the path before hiding it.",
            "View-only permissions on a deal render the sidebar properties as static text with no hover state — removing the affordance for editing without explaining why. Users must infer the permission.",
            "Team-based visibility (only see contacts owned by your team) doesn't visually indicate that the list is filtered — users with limited permissions may not realize they're seeing a subset."
          ]
        }
      ]
    },
    jtbd: {
      title: "HubSpot — JTBD Alignment",
      blocks: [
        {
          heading: "JTBD Mapping",
          type: "table",
          rows: [
            ["JTBD", "Functional", "Emotional", "Social"],
            ["Log what happened in a deal", "Record call outcome + next step in <60s", "'I'm on top of my pipeline'", "Manager can see I'm active"],
            ["Review pipeline health", "See deal stage distribution + at-risk deals", "'I'm not going to miss forecast'", "Credible forecast to VP"],
            ["Qualify a lead from a form fill", "Score + route contact to right rep", "'No lead falls through the cracks'", "Marketing attribution credit"],
            ["Measure campaign ROI", "Connect campaign spend to closed revenue", "'Marketing is driving real revenue'", "Budget justification to CFO"]
          ]
        },
        {
          heading: "Where Friction is Intentionally Reduced",
          type: "insights",
          items: [
            "Deal creation modal is intentionally short: HubSpot deliberately removed required fields from defaults to reduce the activation energy for logging a deal. Speed over completeness.",
            "Email logging via BCC/forward address: removes the need to open HubSpot at all — the lowest-friction logging path for reps living in Gmail.",
            "One-click call logging from the record page, with auto-populated duration and timestamp from the dialer — no manual time entry."
          ]
        },
        {
          heading: "Where Friction is Intentionally Added",
          type: "insights",
          items: [
            "Deal deletion requires a text-confirmation dialog (type the deal name) for deals above a certain value — protecting against accidental data loss in high-value scenarios.",
            "Publishing a workflow requires an explicit 'Review and Publish' confirmation step with a summary of what the workflow will do — safety net before automation goes live.",
            "Deleting a contact with associated deals/tickets shows a warning with a count — requires an active decision, not a passive confirmation."
          ]
        }
      ]
    },
    onboarding: {
      title: "HubSpot — Onboarding & Guidance",
      blocks: [
        {
          heading: "First-Time User Experience",
          type: "prose",
          content: "HubSpot's onboarding is role-segmented: on signup, the user selects their role (Marketing, Sales, Customer Service, Owner) and company size. This gates which hub and which sample data are pre-populated. The 'Getting Started' checklist persists in the left nav bottom until all items are checked off — items are contextually linked ('Import your contacts → click here to import'). Sample Deals and Contacts are pre-created in a demo company so users experience the pipeline board before inputting real data."
        },
        {
          heading: "Inline Guidance Patterns",
          type: "table",
          rows: [
            ["Pattern", "Where Used", "Effectiveness"],
            ["Tooltip on hover (ⓘ icon)", "Next to property names, filter operators", "Low — passive, not contextual"],
            ["Contextual onboarding tooltips", "Step-by-step overlays on first feature use", "High — action-anchored"],
            ["Empty state CTAs", "Deal board, Contact list, Reports", "High — JTBD-framed"],
            ["In-app notifications", "When workflow hits error, deal is stale", "High — proactive nudge"],
            ["HubSpot Academy links", "In Settings, Workflow builder", "Medium — exits to learn"]
          ]
        },
        {
          heading: "Progressive Disclosure of Complexity",
          type: "insights",
          items: [
            "Workflow builder starts with the most common trigger types (Contact property updated, Form submitted) at the top — advanced triggers (Webhook, Custom code) are collapsed under 'More triggers'.",
            "Report builder uses a 'Simple' vs 'Custom Report Builder' split — the simple path uses pre-built chart types with guided field selection; the custom builder exposes a full query-like interface.",
            "Sequences (sales automation) are only visible in the Sales Hub nav — not surfaced to users without the Sales seat, avoiding confusing features they cannot use."
          ]
        }
      ]
    },
    errors: {
      title: "HubSpot — Error Handling & Recovery",
      blocks: [
        {
          heading: "Error Types & Recovery",
          type: "table",
          rows: [
            ["Error Type", "Example", "Recovery Path"],
            ["Validation", "Invalid email format on contact create", "Red underline + helper text — stays on form"],
            ["System / API", "Integration sync failure", "Red banner notification + link to integration status"],
            ["Permission", "No access to a paid feature", "Lock icon + upgrade CTA — not a generic 403"],
            ["Import", "Column mismatch in CSV import", "Row-level error report — downloadable error log"],
            ["Workflow", "Action failure mid-execution", "Enrollment error tab in workflow — per-contact error detail"]
          ]
        },
        {
          heading: "Tone & Undo Patterns",
          type: "insights",
          items: [
            "Error messages are direct and actionable: 'This email address is already associated with another contact. View that contact or enter a different email.' — never generic 'An error occurred'.",
            "The 'Undo' toast after delete is one of HubSpot's most valued micro-interactions — 5-second window to recover. After that, restore requires a support ticket for paid plans.",
            "Workflow errors are surfaced at the workflow level (error count badge), at the enrollment level (which contacts failed), and at the action level (why it failed) — three zoom levels of diagnostic depth."
          ]
        }
      ]
    },
    opportunities: {
      title: "HubSpot — Opportunities & Transferable Patterns",
      blocks: [
        {
          heading: "Patterns Worth Reusing",
          type: "insights",
          items: [
            "JTBD-framed empty states: every empty list or board has copy that names the job ('No deals yet — start tracking your pipeline') and a single primary CTA. Avoids the generic 'No data found' anti-pattern.",
            "Association panels on records (lateral navigation): the right sidebar shows related Companies, Contacts, Deals — clicking any item navigates there without returning to a list. Efficient for object-graph traversal.",
            "Inline editing with autosave on blur: removes mode switching overhead. Works exceptionally well for CRM-style field updates that are brief and frequent.",
            "Three-level error diagnostics for automation: error at system level → object level → action level. Perfect model for any workflow/pipeline product."
          ]
        },
        {
          heading: "Patterns to Adapt Carefully",
          type: "insights",
          items: [
            "Upsell lock icons on nav items are intrusive at scale — works when there are 2–3 gated features, but becomes noise when 40% of the nav is locked.",
            "The two-column record page (timeline + sidebar) is powerful but rigid — works well for CRM objects with clear timeline semantics, but would need adaptation for objects without a strong temporal narrative.",
            "Saved Views as tab-style nav above the list is effective but creates visual clutter when teams create many named views — needs a collapsing or search mechanism at scale."
          ]
        },
        {
          heading: "Gaps & Application to Our Domain",
          type: "insights",
          items: [
            "HubSpot's AI features (Breeze) are additive overlays, not native — they feel bolted on. In a greenfield AI-native product, AI should be the primary data entry and analysis path, not a suggestion layer.",
            "For XVentures matchmaking: the Deal pipeline board maps well to a 'Match Pipeline' — events as stages, investor-founder pairs as deals, match strength as deal amount. The association panel pattern is directly applicable for showing Investor ↔ Startup ↔ Event relationships.",
            "The 'Workspace' role-centric view (vs object-centric) is the most forward-looking pattern in HubSpot — suggests the future of CRM is task queues and guided actions, not data browsing."
          ]
        }
      ]
    }
  },

  notebooklm: {
    context: {
      title: "NotebookLM — Product & User Context",
      blocks: [
        {
          heading: "Core Value Proposition",
          type: "prose",
          content: "NotebookLM reframes AI assistance from 'chatbot over the web' to 'AI grounded in your documents'. The key differentiator is hallucination reduction through source-grounding — every AI output is tied to a specific passage in an uploaded source. This is AI as a research instrument, not a general-purpose assistant. The product targets knowledge workers who need to synthesize large document corpora without trusting uncited AI output."
        },
        {
          heading: "Primary User Segments",
          type: "table",
          rows: [
            ["Segment", "Primary JTBD", "Key Sources They Upload"],
            ["Academic researchers", "Synthesize literature, find contradictions", "PDFs, journal articles"],
            ["Journalists / analysts", "Extract facts, cross-reference claims", "Reports, filings, transcripts"],
            ["Students", "Study from lecture notes/textbooks", "PDFs, slides"],
            ["Knowledge workers", "Summarize long documents for decisions", "Policies, contracts, reports"],
            ["Podcast / content creators", "Generate audio overviews from content", "Articles, notes, drafts"]
          ]
        },
        {
          heading: "Usage Scenarios",
          type: "insights",
          items: [
            "Session-oriented: users tend to open NotebookLM, upload sources, complete a research task, and leave — not a daily-check product but a high-intensity session tool.",
            "Desktop-primary: the source panel + chat + notes layout requires significant screen real estate; mobile use is likely read-only or audio playback.",
            "Collaborative use is nascent — sharing notebooks is supported but the primary mental model is individual researcher with private documents."
          ]
        }
      ]
    },
    ia: {
      title: "NotebookLM — Global Information Architecture",
      blocks: [
        {
          heading: "Navigation Model",
          type: "prose",
          content: "NotebookLM has a deliberately shallow IA. The top-level view is a Notebook Index (cards grid). Selecting a notebook enters a three-panel workspace: Sources (left), Chat (center), Notes (right). There is no persistent global nav bar beyond the Google account switcher. This minimal IA reflects a product hypothesis: once you're in a notebook, everything you need is in the workspace. Leaving the workspace means you're done with that research context."
        },
        {
          heading: "Content Hierarchy",
          type: "hierarchy",
          items: [
            { level: 0, label: "Notebook Index (user's collection of research contexts)" },
            { level: 1, label: "Notebook (a bounded research context with sources + conversation history)" },
            { level: 2, label: "Sources Panel: uploaded documents, URLs, YouTube, Google Docs, Slides" },
            { level: 2, label: "Chat Panel: conversation history + grounded AI responses with citations" },
            { level: 2, label: "Notes Panel: user notes + AI-generated 'Studio' artifacts" },
            { level: 3, label: "Studio Artifacts: summaries, FAQs, briefing docs, audio overviews, timelines" },
            { level: 3, label: "Citations: inline markers → highlights in source document" }
          ]
        },
        {
          heading: "Key Architectural Decisions",
          type: "insights",
          items: [
            "The three-panel workspace is the entire product — no settings, no integrations nav, no reports. Radical scope narrowing that reduces cognitive load to near zero.",
            "Sources are the authoritative layer — the chat and notes panels are derivative. This hierarchy is embedded in the visual design: sources panel is on the left (primary), outputs on the right.",
            "Notebook granularity is deliberately left to the user — one notebook per project, topic, or document. No prescribed organization, which scales from power users (many notebooks) to casual users (one)."
          ]
        }
      ]
    },
    datamodel: {
      title: "NotebookLM — Domain Object & Data Model",
      blocks: [
        {
          heading: "Core Objects & Relationships",
          type: "table",
          rows: [
            ["Object", "Key Properties", "Relationships"],
            ["Notebook", "Title, Last modified, Source count, Share status", "→ Sources (one-to-many), → Conversations, → Notes"],
            ["Source", "Type (PDF/URL/Doc), Title, Page count, Upload date", "→ Notebook, → Citations (one-to-many)"],
            ["Conversation", "Message history, Grounding sources per message", "→ Notebook, ← Sources (grounded in)"],
            ["Citation", "Source reference, Page/paragraph, Highlighted text", "→ Source, → Message (attaches to)"],
            ["Studio Artifact", "Type (FAQ/Summary/Podcast/Timeline), Content", "→ Notebook, → Notes panel"]
          ]
        },
        {
          heading: "The Citation Object — Central Design Decision",
          type: "prose",
          content: "Citations are the defining data object in NotebookLM — they create the bidirectional link between AI output and source text. Each AI response contains numbered citation markers [1][2][3]. Clicking a citation opens the source document with the relevant passage highlighted. This citation object is not a passive link — it's an active verification mechanism that fundamentally changes how users trust AI output. The product's entire trust proposition rests on this data relationship."
        },
        {
          heading: "Filtering & Discovery",
          type: "insights",
          items: [
            "Source filtering in chat is possible — users can select which specific sources the AI should draw from using checkboxes in the sources panel. This is scoped search at the data layer.",
            "Notes are not searchable in the current product — a notable gap that limits the product for power users who accumulate many AI-generated artifacts.",
            "Notebook index has no tagging or folder organization — notebooks are sorted by last-modified only. A clear signal that the product is not yet designed for users managing 50+ notebooks."
          ]
        }
      ]
    },
    layouts: {
      title: "NotebookLM — Screen-Level Layout Patterns",
      blocks: [
        {
          heading: "The Three-Panel Workspace",
          type: "prose",
          content: "The workspace is a fixed three-panel layout: Sources (left ~25%), Chat (center ~50%), Notes/Studio (right ~25%). This is not a responsive layout — it's a deliberate workstation metaphor. The center chat panel is the active work surface; the left sources panel is the reference library; the right notes panel is the output collection. This tripartite structure mirrors how a researcher physically arranges a desk: source documents on the left, working notebook on the right, active page in the center."
        },
        {
          heading: "Primary vs Secondary Actions",
          type: "table",
          rows: [
            ["Location", "Primary Actions", "Secondary Actions"],
            ["Sources panel", "Add source (+ button, prominent)", "Delete source, View source"],
            ["Chat panel", "Send message (Enter key)", "Copy response, Regenerate, Add to notes"],
            ["Notes panel", "Add note, Generate studio artifact", "Delete note, Rename artifact"],
            ["Source viewer", "Navigate pages, Highlight citation", "Download source, Remove source"]
          ]
        },
        {
          heading: "Layout Pattern Insights",
          type: "insights",
          items: [
            "The chat panel uses a bottom-anchored input with conversation scrolling up — identical to chat UI conventions but with the source panel visible simultaneously, which is the key differentiator from ChatGPT.",
            "Source documents open in an overlay panel that pushes (not replaces) the chat — maintaining conversation context while reviewing the cited passage. This prevents the disorientation of navigating away.",
            "Studio artifacts (audio overview, briefing doc) are generated in a modal that transforms into a pinned card in the notes panel — a clean 'creation to storage' flow."
          ]
        }
      ]
    },
    flows: {
      title: "NotebookLM — Navigation & User Flows",
      blocks: [
        {
          heading: "Happy Path: Research a Topic from Sources",
          type: "flow",
          steps: [
            { step: "1", label: "Create new notebook → Name it (e.g., 'Q3 Competitor Analysis')" },
            { step: "2", label: "Add Sources: drag-drop PDFs, paste URLs, link Google Docs" },
            { step: "3", label: "Sources panel shows ingestion status — 'Processing...' → green checkmark" },
            { step: "4", label: "Chat: ask the first question — AI responds with inline citations [1][2]" },
            { step: "5", label: "Click citation [1] → Source opens with highlighted passage" },
            { step: "6", label: "Continue dialogue — AI references multiple sources per answer" },
            { step: "7", label: "Pin a key answer to Notes panel → becomes a persistent artifact" }
          ]
        },
        {
          heading: "Happy Path: Generate Audio Overview (Podcast)",
          type: "flow",
          steps: [
            { step: "1", label: "Sources loaded → Studio panel → 'Audio Overview' button" },
            { step: "2", label: "Optionally add custom instructions: 'Focus on the financial risks'" },
            { step: "3", label: "Processing screen (~30–90s) → two AI voices discuss the content" },
            { step: "4", label: "Audio player appears in Notes panel — play, pause, 1x/1.5x/2x speed" },
            { step: "5", label: "Share link or download MP3 — output leaves the product" }
          ]
        },
        {
          heading: "Navigation Strategy Insights",
          type: "insights",
          items: [
            "There is effectively no 'back' navigation within a notebook — the three panels coexist and the source overlay is modal, not a page navigation. This is a deliberately stationary workspace.",
            "Notebook switching requires returning to the index — there's no sidebar list of all notebooks visible from within the workspace. This is a deliberate isolation design: one research context at a time.",
            "The Audio Overview flow is the only multi-step wizard in the product — a modal with optional customization and a progress screen. All other actions are immediate."
          ]
        }
      ]
    },
    interactions: {
      title: "NotebookLM — Interaction Patterns",
      blocks: [
        {
          heading: "Unique Interaction: Citation Exploration",
          type: "prose",
          content: "The citation tap → source highlight interaction is NotebookLM's most distinctive pattern. Clicking a citation number [1] in a chat response causes the source document to open in-panel with the referenced passage visually highlighted in yellow. This is bidirectional: users can also highlight text in a source and 'Ask about this selection' — creating a reverse path from source to query. These two directions form a verification loop: AI output → source, and source text → AI exploration."
        },
        {
          heading: "Studio Generation Patterns",
          type: "table",
          rows: [
            ["Artifact", "Interaction Pattern", "Output Location"],
            ["FAQ", "One-click generate → streaming text output", "Notes panel card"],
            ["Briefing Doc", "One-click → multi-section document", "Notes panel card"],
            ["Audio Overview", "Configure → process wait → audio player", "Notes panel card (pinned)"],
            ["Study Guide", "One-click → questions + key terms", "Notes panel card"],
            ["Timeline", "One-click → chronological event list", "Notes panel card"]
          ]
        },
        {
          heading: "Feedback & Loading Patterns",
          type: "insights",
          items: [
            "Source ingestion uses a progressive status pattern: 'Adding source...' → spinner → 'Ready' checkmark. Crucial for large PDFs where users need to know when they can start querying.",
            "Chat responses stream token-by-token — the typing animation sets expectations that the response is being generated live. Citations appear after the streaming completes, preventing layout shift.",
            "Empty notebook state is strongly guided: not an empty screen but a structured onboarding card with 'Add a source to get started' and quick-access buttons for the most common source types (Upload PDF, Link URL)."
          ]
        }
      ]
    },
    datacapture: {
      title: "NotebookLM — Data Definition & Validation",
      blocks: [
        {
          heading: "Source Intake Methods",
          type: "table",
          rows: [
            ["Method", "Types Supported", "Processing Time"],
            ["File upload", "PDF, TXT, Markdown, Audio", "5–60s depending on size"],
            ["URL paste", "Web pages (text-extractable)", "5–15s"],
            ["Google Docs/Slides/Sheets", "Via Google Drive picker", "5–10s"],
            ["YouTube URL", "Transcript extraction", "5–30s"],
            ["Copy-paste text", "Inline text block", "Immediate"]
          ]
        },
        {
          heading: "Guardrails on Source Quality",
          type: "prose",
          content: "NotebookLM performs silent quality checks: scanned PDFs without OCR layer return a warning ('This source may have limited text'). URLs that block scraping return a 'Could not access this page' error. Sources over 500,000 words may be truncated — the UI shows a warning chip on the source card. These guardrails are visible but not blocking: the source is added even if partial, and the user is warned rather than rejected. This preserves user agency while setting accurate expectations."
        },
        {
          heading: "User-Initiated Context Setting",
          type: "insights",
          items: [
            "Custom instructions on Audio Overview are the only form of user-controlled generation parameter — a single free-text field: 'What should the hosts focus on? Any context to provide?'",
            "Notebook title and source names are user-editable but not required — reinforcing the low-friction, minimal-metadata philosophy of the product.",
            "There is no concept of 'required fields' in NotebookLM — sources are atomic (one file = one source) and the chat is free-form. Data structure is entirely emergent from conversation."
          ]
        }
      ]
    },
    presentation: {
      title: "NotebookLM — Data Presentation & Sense-Making",
      blocks: [
        {
          heading: "How AI Output is Differentiated",
          type: "prose",
          content: "NotebookLM makes a consistent visual distinction between AI-generated content and user input. AI responses have a subtle grey background; user messages have white. Studio artifacts have a 'Generated' chip and a distinct card style from user-written notes. Citations use superscript numbers [1] in a distinctive blue color that signals interactivity. This systematic differentiation maintains epistemic clarity — users always know what came from AI vs their own writing or their source documents."
        },
        {
          heading: "Source Panel as Primary Sense-Making Surface",
          type: "insights",
          items: [
            "The sources panel acts as a bibliography: each source has a title, type icon, and status chip. Hovering reveals a snippet of the source content — reducing the need to open the full source for confirmation.",
            "Source selection state (checked vs unchecked) communicates to users which documents are 'active' in the AI's grounding context — a novel UI pattern that externalizes the AI's knowledge scope.",
            "The notebook overview (auto-generated) appears as a summary card at the top of the notes panel after sources are loaded — offering a pre-synthesized entry point into the research context before the first question."
          ]
        },
        {
          heading: "Audio as Output Medium",
          type: "insights",
          items: [
            "Audio Overview is NotebookLM's most surprising presentation format — converting text documents into a two-host conversational podcast. This expands the product's output surface from visual to auditory, enabling consumption during commutes.",
            "The podcast transcript is not shown alongside the audio — a gap that forces users to either listen fully or return to the source documents. An opportunity for a synchronized transcript view.",
            "Audio generation unavoidability of waiting (~60–90s) is presented with a progress animation — not a spinner but an oscillating waveform, which primes the user for the audio format they're about to receive."
          ]
        }
      ]
    },
    states: {
      title: "NotebookLM — State Management & Modes",
      blocks: [
        {
          heading: "Notebook State Model",
          type: "table",
          rows: [
            ["State", "Trigger", "Visual Signal"],
            ["Empty", "Newly created notebook, no sources", "Onboarding card with CTAs"],
            ["Processing", "Source being ingested", "Spinner on source card"],
            ["Ready", "Sources loaded, ready to query", "Green status indicators"],
            ["Generating", "AI producing response", "Streaming text, loading indicator"],
            ["Source-focused", "Citation clicked, source open", "Source overlay panel active"]
          ]
        },
        {
          heading: "No Explicit Edit Mode",
          type: "prose",
          content: "NotebookLM has no 'edit mode' concept — notes are always editable in place, sources can always be added or removed, chat is always active. The product is always in a 'working' state once sources are loaded. This is consistent with the research instrument metaphor: a researcher's notebook is always open, always writable. The only exception is the Audio Overview generation state, which is a locked processing mode during which the UI is temporarily non-interactive."
        },
        {
          heading: "Persistence & Session Management",
          type: "insights",
          items: [
            "Conversation history is persistent across sessions — users can return to a notebook days later and resume the exact conversation. This is a meaningful design decision: treating chat as durable memory, not ephemeral context.",
            "Source removal is permanent — there's no 'archive' or 'hide' option. Removing a source also removes any citations to it from previous chat responses (visually — the citations become unlinked). A notable UX risk.",
            "Notebooks are personal by default — sharing creates a public link (no edit permissions for collaborators). True collaboration (multi-user editing) is not yet supported."
          ]
        }
      ]
    },
    jtbd: {
      title: "NotebookLM — JTBD Alignment",
      blocks: [
        {
          heading: "Core JTBD Mapping",
          type: "table",
          rows: [
            ["JTBD", "Functional", "Emotional", "Social"],
            ["Synthesize a large document", "Get a summary + key points in 2 minutes", "'I understand this doc without reading all 200 pages'", "Credible synthesis to share with team"],
            ["Verify AI claims", "Click citation → see exact source passage", "'I can trust this AI output'", "Cite sources in my own work"],
            ["Generate study material", "Create FAQ/study guide from textbook", "'I'm going to pass this exam'", "Share study guide with classmates"],
            ["Create audio briefing", "Convert PDFs to listenable podcast", "'I can learn during my commute'", "Share audio with team"]
          ]
        },
        {
          heading: "Friction Decisions",
          type: "insights",
          items: [
            "Citation friction is intentional: citations require a tap/click to verify. This is not a bug — it creates an active verification habit that reinforces that AI can be wrong and sources should be checked.",
            "No conversation-starters or example prompts in the empty state — the assumption is that users who upload research documents know what they want to ask. This is a deliberate choice to not infantilize the target user.",
            "Source upload as the mandatory first step adds friction compared to just starting to chat — but this friction is the product's core value proposition: sources ground the AI."
          ]
        }
      ]
    },
    onboarding: {
      title: "NotebookLM — Onboarding & Guidance",
      blocks: [
        {
          heading: "First-Time Experience",
          type: "prose",
          content: "New users land on the notebook index with a sample notebook already created — titled something like 'Explore NotebookLM' with Google's own blog posts as sources and pre-seeded questions answered. This lets users experience the citation interaction before uploading their own documents. The sample notebook is read-only, which creates a safe exploration context."
        },
        {
          heading: "Progressive Guidance",
          type: "insights",
          items: [
            "Source type icons (PDF, Globe, YouTube) create an immediate visual taxonomy without requiring documentation — users quickly learn what kinds of sources are supported.",
            "The Studio panel reveals its artifact types only after sources are loaded — progressive disclosure that prevents overwhelm at the empty state.",
            "Suggested questions appear below the chat input when a new source is added — 'You might ask: What is the main argument? What are the key findings?' This is the most helpful onboarding pattern in the product, reducing blank-prompt anxiety."
          ]
        }
      ]
    },
    errors: {
      title: "NotebookLM — Error Handling & Recovery",
      blocks: [
        {
          heading: "Error Scenarios & Responses",
          type: "table",
          rows: [
            ["Error", "Message Style", "Recovery"],
            ["URL blocked by site", "Inline on source card: 'Couldn't access this URL'", "Prompt to copy-paste content instead"],
            ["PDF with no text layer", "Warning chip: 'Limited text available'", "Suggest uploading a text version"],
            ["Source too large", "Warning on card: 'Content may be truncated'", "No recovery — inform only"],
            ["Audio generation fails", "Modal error with retry button", "Retry immediately or close"],
            ["AI response error", "Inline message: 'Something went wrong. Try again.'", "Retry button in chat"]
          ]
        },
        {
          heading: "Trust & Transparency",
          type: "insights",
          items: [
            "NotebookLM's most important 'error' state is when the AI says 'I couldn't find information about this in your sources' — this is not treated as a failure but as a success of the grounding system. The product is designed to refuse to hallucinate rather than to always give an answer.",
            "No undo for note deletion — a gap for a product where notes may represent significant research synthesis work.",
            "Error messages consistently maintain a calm, informational tone — no apologetic language, no blame assignment. Matches the analytical, professional user base."
          ]
        }
      ]
    },
    opportunities: {
      title: "NotebookLM — Opportunities & Transferable Patterns",
      blocks: [
        {
          heading: "Strongest Patterns to Reuse",
          type: "insights",
          items: [
            "Citation as trust mechanism: any AI-native product generating outputs from structured data should implement a citation/evidence trail. In XVentures, every match score explanation should link back to the specific data points that drove it.",
            "Suggested questions on new data: when a user uploads a new investor or startup, auto-generate 3 suggested questions or analyses they could run — reduces blank-slate friction.",
            "Source selection scope: allowing users to scope AI responses to specific sources is a powerful control mechanism. Applies to any multi-entity AI product where users want to constrain the AI's reference space.",
            "Studio artifacts as output templates: the concept of named output types (FAQ, Summary, Timeline, Audio) maps to domain-specific output templates. In a VC matchmaking context: Match Brief, Due Diligence Checklist, Event Agenda."
          ]
        },
        {
          heading: "Gaps & Adaptation Opportunities",
          type: "insights",
          items: [
            "No collaboration: a major gap for team research contexts. In B2B products, collaborative annotation and shared notebooks would significantly increase stickiness.",
            "No note search: at scale (20+ notebooks, 50+ notes per notebook), discovery breaks. Any knowledge product needs full-text search across all artifacts.",
            "Audio is output-only: no ability to voice-query the notebook — adding voice input would complete the audio-first UX loop.",
            "The flat notebook index needs folder/project organization above ~20 notebooks — directly applicable to any product where users manage many bounded research/analysis contexts."
          ]
        }
      ]
    }
  },

  contentplatform: {
    context: {
      title: "Content Platform (Notion + Canva) — Product & User Context",
      blocks: [
        {
          heading: "Composite Platform Overview",
          type: "prose",
          content: "This analysis composites two complementary content creation paradigms: Notion (structured docs, databases, wikis) and Canva (visual design, publishing, multi-format output). Together they represent the full spectrum of content platform design — from information architecture and knowledge management (Notion) to visual creation and brand publishing (Canva). Their convergence (both now offer AI generation, templates, and team collaboration) makes them valuable to study as a unified design space."
        },
        {
          heading: "Primary User Segments",
          type: "table",
          rows: [
            ["Segment", "Platform", "Primary JTBD"],
            ["Knowledge workers / PMO", "Notion", "Centralize team knowledge, process docs, project tracking"],
            ["Content marketers", "Both", "Plan content in Notion, produce visual assets in Canva"],
            ["Educators", "Notion + Canva", "Course materials in Notion, slides/infographics in Canva"],
            ["Designers (non-pro)", "Canva", "Create brand-consistent visuals without Adobe skills"],
            ["Startup founders", "Notion", "All-in-one wiki: product specs, team onboarding, OKRs"],
            ["Social media managers", "Canva", "Batch-produce on-brand templates for multiple platforms"]
          ]
        },
        {
          heading: "Key Tensions",
          type: "insights",
          items: [
            "Notion's flexibility (anything can be a page, database, or block) creates power but defeats discoverability — the blank canvas problem where new users don't know what to create.",
            "Canva's template-first model accelerates creation but risks brand homogenization — many Canva designs look identifiably 'Canva-made', which is a design credibility risk for professional users.",
            "Both products are expanding into each other's territory: Notion added databases and Canva-style design blocks; Canva added docs and AI writing. The convergence will intensify competition."
          ]
        }
      ]
    },
    ia: {
      title: "Content Platform — Global Information Architecture",
      blocks: [
        {
          heading: "Notion's IA: Nested Page Tree",
          type: "prose",
          content: "Notion uses a left-sidebar tree navigation where every page can be a parent of infinitely nested sub-pages. The tree is the global nav — there's no separate 'sections' or 'tabs' concept; everything is a page node. This is the most flexible IA of any product in this analysis — users can replicate any information architecture they want. The cost is that there's no prescribed structure, so teams without an intentional IA strategy end up with a Notion graveyard of orphaned pages."
        },
        {
          heading: "Canva's IA: Project-Folder-Design",
          type: "hierarchy",
          items: [
            { level: 0, label: "Home (templates, recent, brand kit)" },
            { level: 1, label: "Projects (user-created organizational folders)" },
            { level: 2, label: "Designs (individual canvases: presentation, post, doc, video)" },
            { level: 1, label: "Brand Kit (colors, fonts, logos — admin-managed)" },
            { level: 1, label: "Template Gallery (filtered by format, industry, style)" },
            { level: 1, label: "Magic Studio (AI generation hub)" }
          ]
        },
        {
          heading: "IA Design Decisions",
          type: "insights",
          items: [
            "Notion's recent addition of 'Home' (a customizable landing page with recently visited pages, pinned items, and team activity) addresses the infinite-tree problem by creating a curated entry point.",
            "Canva's format-first IA (what size/type of design are you creating?) is more constrained than Notion's — but this constraint accelerates creation. Knowing format upfront enables AI template generation.",
            "Both products show 'Recent' as the primary entry point after login — reflecting that most users are returning to in-progress work, not starting from scratch."
          ]
        }
      ]
    },
    datamodel: {
      title: "Content Platform — Domain Object & Data Model",
      blocks: [
        {
          heading: "Notion's Object Model",
          type: "table",
          rows: [
            ["Object", "Description", "Key Properties"],
            ["Page", "Universal container — can be doc, wiki, or database view", "Title, Icon, Cover, Properties (if in DB)"],
            ["Block", "Atomic content unit within a page", "Type (text/heading/image/code/embed/AI block)"],
            ["Database", "Structured collection of pages with shared properties", "Schema, Views (table/board/calendar/gallery/list)"],
            ["Database Property", "Typed field on a database item", "Text, Number, Select, Date, Person, Relation, Formula"],
            ["Template", "Pre-structured page/database for reuse", "Content + property defaults"]
          ]
        },
        {
          heading: "Canva's Design Model",
          type: "table",
          rows: [
            ["Object", "Description", "Key Properties"],
            ["Design", "Top-level canvas with format dimensions", "Format type, Pages/slides, Share status"],
            ["Element", "Visual object on canvas", "Type (text/image/shape/video/embed), Position, Style"],
            ["Template", "Pre-designed design as starting point", "Format, Style, Industry, Color palette"],
            ["Brand Kit", "Org-level style guide", "Colors, Fonts, Logos, Voice/tone guidelines"],
            ["Magic Media", "AI-generated image/video", "Prompt, Style, Aspect ratio"]
          ]
        },
        {
          heading: "Cross-Platform Insights",
          type: "insights",
          items: [
            "Notion's 'Relation' property creates cross-database links that enable a lightweight relational data model — e.g., linking a 'Projects' database to a 'Tasks' database. This is the closest a content tool comes to a data layer.",
            "Canva's Brand Kit is a shared style object that constrains design choices across all team members — an organizational data model for visual identity. Teams that enforce Brand Kit see higher brand consistency.",
            "Both platforms use 'Template' as a first-class object — evidence that user-generated reuse patterns are a primary growth vector. Templates are viral content."
          ]
        }
      ]
    },
    layouts: {
      title: "Content Platform — Screen-Level Layout Patterns",
      blocks: [
        {
          heading: "Notion Layout Patterns",
          type: "table",
          rows: [
            ["Screen", "Layout", "Design Rationale"],
            ["Doc editor", "Centered text column, full-bleed cover, sidebar hidden", "Distraction-free writing; Wikipedia-like readability"],
            ["Database table view", "Sticky header, infinite scroll rows, frozen left column", "Spreadsheet mental model for structured data"],
            ["Database board view", "Kanban columns, drag-to-reorder cards", "Project management / workflow tracking"],
            ["Gallery view", "Card grid with cover image + title", "Visual discovery for media-rich content"],
            ["Calendar view", "Month grid with page titles on date cells", "Time-based scheduling and publishing"]
          ]
        },
        {
          heading: "Canva Layout Patterns",
          type: "table",
          rows: [
            ["Screen", "Layout", "Design Rationale"],
            ["Canvas editor", "Center canvas + left panel (elements/templates) + right panel (style)", "Professional design tool conventions (similar to Figma)"],
            ["Template picker", "Masonry grid with format filter chips", "Visual browsing; inspiration-first"],
            ["Magic Studio", "Chat-like prompt input → streaming generation", "Conversational AI metaphor"],
            ["Brand Kit", "Settings-style form + preview panels", "Admin configuration that affects all designers"]
          ]
        },
        {
          heading: "Layout Design Insights",
          type: "insights",
          items: [
            "Notion's centered text column with large margins is a strong reading UX decision — it prioritizes content consumption as much as creation, unlike Google Docs which optimizes for print-format production.",
            "Canva's three-panel editor (left tools, center canvas, right properties) is borrowed from professional design tools — reducing the learning curve for users who have used Figma, InDesign, or older Canva competitors.",
            "Both products use full-bleed, high-quality imagery in their templates and marketing surfaces — the visual quality of empty states and templates sets a quality bar that users aspire to match."
          ]
        }
      ]
    },
    flows: {
      title: "Content Platform — Navigation & User Flows",
      blocks: [
        {
          heading: "Happy Path: Create a Notion Project Tracker",
          type: "flow",
          steps: [
            { step: "1", label: "Sidebar: '+ New Page' → Select 'Database — Table'" },
            { step: "2", label: "Name database 'Q3 Projects' — default properties appear (Name, Tags, Status, Date)" },
            { step: "3", label: "Add custom properties: 'Owner' (Person), 'Priority' (Select), 'Launch Date' (Date)" },
            { step: "4", label: "Add first row — inline form fills Name, Status, Owner" },
            { step: "5", label: "Switch to Board View — group by Status → Kanban appears" },
            { step: "6", label: "Share page with team — toggle 'Edit access' for collaborators" }
          ]
        },
        {
          heading: "Happy Path: Create a Canva Social Media Post",
          type: "flow",
          steps: [
            { step: "1", label: "Home → 'Create a design' → Select 'Instagram Post (Square)'" },
            { step: "2", label: "Template gallery opens — filter by 'Business' → select a template" },
            { step: "3", label: "Canvas opens with template — click text to edit, drag elements" },
            { step: "4", label: "Left panel: upload brand logo image → drag to canvas → resize" },
            { step: "5", label: "Brand Kit: apply brand color palette with one click" },
            { step: "6", label: "Download → PNG / JPG / PDF — or Share → Schedule via Canva Planner" }
          ]
        },
        {
          heading: "Navigation Strategy Insights",
          type: "insights",
          items: [
            "Notion's 'quick find' (Cmd+K) is the primary navigation for power users — the sidebar tree is for orientation, not daily navigation. This split reflects a keyboard-native vs mouse-native user dichotomy.",
            "Canva's 'format first' entry point (pick your design size before seeing the editor) prevents layout-change frustration — changing dimensions post-design is destructive in a raster tool.",
            "Both products support 'duplicate' as a primary creation flow — users more often start from an existing design/page than from scratch."
          ]
        }
      ]
    },
    interactions: {
      title: "Content Platform — Interaction Patterns",
      blocks: [
        {
          heading: "Notion's Block Editor Patterns",
          type: "prose",
          content: "Notion's block editor uses a slash command (/) to insert any block type — this is a command-palette pattern embedded in the editor flow. Users stay in keyboard mode without reaching for the mouse to insert images, callouts, database embeds, or AI blocks. The '/' trigger is now an industry convention (adopted by Linear, Coda, Craft) — Notion established this UX pattern. Block drag-and-drop handles appear on hover, enabling spatial rearrangement without cut-paste."
        },
        {
          heading: "Canva's Direct Manipulation Patterns",
          type: "table",
          rows: [
            ["Interaction", "Pattern", "Why It Works"],
            ["Resize element", "8-handle bounding box drag", "Direct manipulation — professional tool convention"],
            ["Style matching", "'Eyedropper' + 'Copy style' → 'Paste style'", "Reduces manual style specification"],
            ["Smart guides", "Auto-snap alignment lines on drag", "Professional layout quality without manual measurement"],
            ["Magic Resize", "One-click resize to multiple formats simultaneously", "Batch production for social media managers"],
            ["AI prompt-to-image", "Free text in Magic Media → image generation", "Conversational creation metaphor"]
          ]
        },
        {
          heading: "Shared Interaction Insights",
          type: "insights",
          items: [
            "Both products use real-time collaborative cursors (colored user avatars on shared pages/designs) — the standard Google Docs convention. The visual signal reduces collision anxiety in simultaneous editing.",
            "Comment threads (Cmd+click in Notion, right-click in Canva) provide asynchronous collaboration without blocking the document flow — comments are overlaid, not embedded in content.",
            "Both use 'magic' branding for AI features (Notion AI, Canva Magic Studio / Magic Write / Magic Resize) — a deliberate brand pattern that makes AI feel surprising and premium rather than utilitarian."
          ]
        }
      ]
    },
    datacapture: {
      title: "Content Platform — Data Definition & Validation",
      blocks: [
        {
          heading: "Content Input Methods",
          type: "table",
          rows: [
            ["Method", "Notion", "Canva"],
            ["Manual typing/creation", "Block editor — free-form text + structured blocks", "Canvas direct manipulation"],
            ["Template start", "Page templates with pre-filled content", "Design templates with styled elements"],
            ["Import", "Markdown, CSV, Confluence, Evernote, Docs", "Images, videos, PDFs for use as elements"],
            ["AI generation", "Notion AI: write, summarize, translate, autofill DB", "Magic Write, Magic Media, Magic Design"],
            ["Integration/embed", "Embed Figma, Google Docs, Loom, GitHub", "Embed video, QR codes, Google Maps"]
          ]
        },
        {
          heading: "Notion Database Validation",
          type: "prose",
          content: "Notion databases provide type-level validation through property types — a Date property won't accept a non-date string; a Number property converts typed text to numbers or shows an error. However, there are no cross-field validation rules (e.g., 'End date must be after Start date') — Notion is deliberately a flexible tool, not a form builder. Required fields don't exist in Notion databases — every property is optional by convention. This limits Notion's use for structured data governance but preserves its flexibility as a wiki tool."
        }
      ]
    },
    presentation: {
      title: "Content Platform — Data Presentation & Sense-Making",
      blocks: [
        {
          heading: "Notion's Multi-View Data Presentation",
          type: "prose",
          content: "Notion's database views transform the same underlying data into radically different presentations: the same project database can be viewed as a spreadsheet (Table), a kanban (Board), a calendar (Calendar), a visual card grid (Gallery), or a condensed list (List). This view-switching is the most powerful data presentation pattern in the analysis — users can choose the mental model that matches their job at any given moment without changing the data structure."
        },
        {
          heading: "Canva's Visual Presentation Logic",
          type: "insights",
          items: [
            "Canva's template gallery uses a masonry grid because designs are visual and need to be evaluated at a glance — a table or list view would be meaningless for image-based content.",
            "Brand Kit preview panels show typography and colors applied to realistic mockups (business cards, social posts, presentations) — contextual data presentation that makes abstract style choices concrete.",
            "Canva's design editor shows real-time preview of all changes — no 'preview mode' toggle needed because the canvas is always the preview. This is in contrast to web builders (Webflow, WordPress) that require preview mode."
          ]
        },
        {
          heading: "AI Content in Both Platforms",
          type: "insights",
          items: [
            "Notion AI responses appear inline below the cursor, with an 'Accept', 'Discard', or 'Try again' action bar — a clear boundary between AI suggestion and accepted content.",
            "Canva Magic Media generated images appear in a results panel before being dragged to the canvas — maintaining the separation between 'generated options' and 'design decisions'.",
            "Both platforms show AI generation in a 'streaming' fashion (text appears word-by-word; images appear with a reveal animation) — the generation animation signals that work is being done and builds anticipation."
          ]
        }
      ]
    },
    states: {
      title: "Content Platform — State Management & Modes",
      blocks: [
        {
          heading: "Notion State Model",
          type: "table",
          rows: [
            ["State", "Trigger", "Visual Signal"],
            ["Editing", "Click anywhere on page", "Cursor appears, no mode indicator"],
            ["Locked", "Page lock toggled by editor", "'Locked' badge + click-to-edit prompt"],
            ["Comment mode", "Cmd+click in margin", "Comment thread panel appears"],
            ["Full-page", "⊞ icon in top right", "Sidebar collapses, content expands"],
            ["Publishing", "Share → Publish to web", "Public URL available, view count shown"]
          ]
        },
        {
          heading: "Canva State Model",
          type: "table",
          rows: [
            ["State", "Trigger", "Visual Signal"],
            ["Design mode", "Default on canvas open", "All tools active"],
            ["Presentation mode", "Present button → fullscreen", "Canvas fills screen, no tools"],
            ["Comment mode", "Comment toggle on top bar", "Comment pins visible on canvas"],
            ["Print bleed mode", "'Print' view toggle", "Red bleed margins appear"],
            ["Brand lock", "Admin sets element as locked", "Lock icon, non-selectable element"]
          ]
        }
      ]
    },
    jtbd: {
      title: "Content Platform — JTBD Alignment",
      blocks: [
        {
          heading: "JTBD Mapping",
          type: "table",
          rows: [
            ["JTBD", "Platform", "Functional", "Emotional"],
            ["Document team processes", "Notion", "Create wiki page with structure", "'My team will finally know how we do things'"],
            ["Track project status", "Notion", "Database with status property + board view", "'I can see everything at a glance'"],
            ["Create on-brand visuals fast", "Canva", "Template + Brand Kit → export in 5 min", "'I can produce professional content without a designer'"],
            ["Publish content consistently", "Canva", "Schedule social posts from Canva directly", "'My social presence looks professional and consistent'"]
          ]
        },
        {
          heading: "Speed vs Control Tradeoffs",
          type: "insights",
          items: [
            "Canva optimizes for speed on first use (template gallery is the default entry point) but sacrifices uniqueness — every template-started design competes with thousands of identical-looking designs.",
            "Notion optimizes for control over time — the product becomes more powerful as teams invest in database schemas and templates, but has a high initial investment cost.",
            "Both products have 'AI-assisted' modes that temporarily shift the speed/control dial — Notion AI writes first drafts quickly; Canva Magic Design generates complete layout options. AI is the speed layer on a control-oriented product."
          ]
        }
      ]
    },
    onboarding: {
      title: "Content Platform — Onboarding & Guidance",
      blocks: [
        {
          heading: "Notion's Onboarding Challenge",
          type: "prose",
          content: "Notion's onboarding is one of the most studied cases in product design because it solves an extremely hard problem: how do you onboard users to an infinitely flexible tool? Notion's solution is role-based template injection: users select their use case (personal, team, school) and Notion pre-populates their workspace with relevant databases and pages. This reduces the blank-canvas problem but creates a different problem: the injected templates may not match the user's actual workflow, leading to deletion and confusion."
        },
        {
          heading: "Canva's Template-First Onboarding",
          type: "insights",
          items: [
            "Canva's onboarding is the industry benchmark for low-friction creation: select format → see templates → click → edit. Three steps to a working design. The product never asks users to start from scratch on first use.",
            "Canva's 'Design School' and contextual hints ('Pro tip: Use Magic Resize to adapt this to other formats') are woven into the editor flow — learning happens through use, not documentation.",
            "Brand Kit setup is presented as a 'setup checklist' for team admins — 'Add your logo', 'Set brand colors', 'Choose brand fonts' — gamifying the configuration that unlocks the product's value for teams."
          ]
        }
      ]
    },
    errors: {
      title: "Content Platform — Error Handling & Recovery",
      blocks: [
        {
          heading: "Notion's Version History",
          type: "prose",
          content: "Notion's version history (30 days on free, unlimited on paid) is its strongest error recovery mechanism — every page change is snapshotted, and users can restore any previous version. The history viewer shows a timeline of edits with author attribution and diff preview. This is table-stakes for a wiki/documentation product — without it, accidental deletions would be catastrophic. The 7-day limit on free plans is a deliberate retention mechanic."
        },
        {
          heading: "Canva's Recovery Patterns",
          type: "insights",
          items: [
            "Canva's 'Version History' (Canva Pro) shows named checkpoints — users can save a named version before a major change, then restore if the direction was wrong. Manual checkpointing vs Notion's automatic snapshots.",
            "Undo/Redo (Cmd+Z/Y) in Canva supports ~50 steps — sufficient for design work but insufficient for long sessions. Users working over hours need version history, not just undo.",
            "Canva shows a 'Your design was auto-saved' indicator at the top — proactive reassurance that reduces save anxiety. No 'Save' button — the product commits to autosave as the single save paradigm."
          ]
        }
      ]
    },
    opportunities: {
      title: "Content Platform — Opportunities & Transferable Patterns",
      blocks: [
        {
          heading: "Strongest Patterns to Reuse",
          type: "insights",
          items: [
            "Notion's multi-view database is the most adaptable pattern: the same underlying data (e.g., investor profiles, startup profiles, match results) presented as table / board / gallery / calendar gives different user types the mental model they need without maintaining separate data sets.",
            "Canva's template-as-onboarding: every new user in a platform should see a domain-relevant template immediately. For XVentures: 'Here's a sample match report from a completed event' as the landing experience.",
            "Slash command (/) for block/action insertion: best-in-class pattern for reducing toolbar dependency in any editor or form context. Directly applicable to any AI command palette.",
            "Brand Kit as organizational constraint: the pattern of admin-set shared style objects that constrain individual creation is powerful for any multi-user product — analogous to a shared scoring rubric in a matchmaking platform."
          ]
        },
        {
          heading: "Gaps & Application Opportunities",
          type: "insights",
          items: [
            "Neither Notion nor Canva has strong structured data validation — a gap that any B2B platform with data governance requirements should address. Required fields + cross-field validation + type constraints are all under-served.",
            "Content platform AI is still 'assist and accept/reject' — not yet 'AI proposes, user refines iteratively in dialogue.' The next generation will be conversational refinement of generated content.",
            "For XVentures: the database view-switching pattern (Board for match pipeline, Table for scoring detail, Gallery for investor/startup cards) would be a direct value-add for event organizers managing a large pool of participants."
          ]
        }
      ]
    }
  },

  dealfront: {
    context: {
      title: "Dealfront — Product & User Context",
      blocks: [
        {
          heading: "Core Value Proposition",
          type: "prose",
          content: "Dealfront (formed by the merger of Echobot and Leadfeeder in 2022) is a European-focused B2B sales intelligence platform. Its core bet is identifying who is visiting your website, enriching those anonymous companies with firmographic data, and surfacing intent signals — giving sales teams a warm-lead pipeline from their own web traffic. Unlike US-centric tools (ZoomInfo, Apollo), Dealfront specifically targets GDPR compliance as a competitive advantage, which shapes many product decisions."
        },
        {
          heading: "Primary User Segments",
          type: "table",
          rows: [
            ["Segment", "Primary JTBD", "Key Workflow"],
            ["SDR / BDR", "Find and prioritize warm accounts to prospect", "Daily: check new Leadfeeder visitors → qualify → export to CRM"],
            ["Sales Manager", "Ensure reps focus on highest-intent accounts", "Weekly: review team feed, set account filters, review KPIs"],
            ["Growth Marketer", "Understand which campaigns drive qualified web traffic", "Campaign attribution: filter visitors by UTM → identify companies"],
            ["Ops / RevOps", "Integrate intent data into CRM and routing workflows", "Integration setup: CRM sync, Slack alerts, scoring thresholds"],
            ["Prospector (Echobot)", "Find new prospects from a company database", "Outbound: filter by firmographics, industry, intent → contact export"]
          ]
        },
        {
          heading: "Structural Context",
          type: "insights",
          items: [
            "Dealfront has two primary product lines with distinct UX: Leadfeeder (website visitor identification — inbound motion) and Echobot (B2B database prospecting — outbound motion). The platform attempts to unify these but they retain distinct interaction models.",
            "GDPR compliance is not just a legal constraint — it's a product design driver. Dealfront shows only company-level identification (not individual tracking), which limits the data model and shapes every data presentation screen.",
            "The product's core magic (website visitor identification) is invisible to users — it happens via a JavaScript tracking pixel. The UX surfaces the output (company cards) without revealing the mechanism, which creates an 'it just works' experience."
          ]
        }
      ]
    },
    ia: {
      title: "Dealfront — Global Information Architecture",
      blocks: [
        {
          heading: "Navigation Model",
          type: "prose",
          content: "Dealfront uses a left-rail icon nav (collapsed by default) with top-level sections: Feed, Companies, Contacts, Reports, Integrations, Settings. The Feed is the primary entry point for daily SDR use — a reverse-chronological list of companies that visited the website. This nav structure reflects a product attempting to unify two workflows (inbound visitor identification from Leadfeeder + outbound prospecting database from Echobot) into a single IA — with mixed success."
        },
        {
          heading: "Content Hierarchy",
          type: "hierarchy",
          items: [
            { level: 0, label: "Feed (inbound: website visitors, ranked by intent/fit)" },
            { level: 1, label: "Company Card (company name, industry, location, visit data)" },
            { level: 2, label: "Company Detail: Visit sessions, pages viewed, contact list" },
            { level: 0, label: "Target (prospecting database: Echobot company/contact search)" },
            { level: 1, label: "Company search results → Contact list" },
            { level: 0, label: "Reports (campaign attribution, team activity, performance)" },
            { level: 0, label: "Integrations (HubSpot, Salesforce, Pipedrive, Slack, Zapier)" },
            { level: 0, label: "Settings (tracking, team, scoring, filters, subscriptions)" }
          ]
        },
        {
          heading: "IA Design Tensions",
          type: "insights",
          items: [
            "The Feed/Target split reflects two different user mindsets (inbound responder vs outbound hunter) coexisting in one nav — users doing both jobs context-switch between radically different interaction modes.",
            "Company is the central object in both modules but has different representations: in Feed, a Company is an anonymous visitor with session data; in Target, a Company is a static firmographic record. The same entity, two contexts.",
            "Contacts (decision-maker contacts exported from the database) don't have their own primary workflow surface — they're a sub-object of Companies. This is a gap for users who want to manage a prospect contact list independently."
          ]
        }
      ]
    },
    datamodel: {
      title: "Dealfront — Domain Object & Data Model",
      blocks: [
        {
          heading: "Core Objects",
          type: "table",
          rows: [
            ["Object", "Key Properties", "Source"],
            ["Visitor Company", "Name, Domain, Industry, Country, Visit date, Pages viewed, Session duration", "Pixel tracking + enrichment"],
            ["Target Company", "Name, Domain, Revenue, Employee count, Industry, Tech stack, Growth signals", "Echobot database"],
            ["Contact", "Name, Title, Email, LinkedIn, Phone", "Echobot / third-party enrichment"],
            ["Lead (CRM export)", "Company + Contact + intent context", "User action: 'Send to CRM'"],
            ["Custom Feed", "Saved filter configuration + notification settings", "User-created"],
            ["Scoring Rule", "Property conditions + weight → score", "Admin configuration"]
          ]
        },
        {
          heading: "Intent Data Layer",
          type: "prose",
          content: "Dealfront's differentiating data is behavioral intent: page visit frequency, pages visited, time-on-site per company, return visit rate. These are surfaced as a 'Quality Score' — a composite metric combining visit intent signals with ICP fit (industry, size, location matching the user's configured target profile). The Quality Score is the primary sort key in the Feed, not recency. This reflects a product hypothesis: a high-intent visitor from last week is more valuable than a low-intent visitor from today."
        },
        {
          heading: "Data Model Insights",
          type: "insights",
          items: [
            "The anonymization constraint (GDPR: show company, not individual visitor) creates an interesting data model: Company is the atomic unit of intent, not Person. This is different from most US-centric sales intelligence tools where intent is tracked at the individual level.",
            "Custom scoring rules allow users to weight different intent signals (industry match, visit frequency, pages visited) — surfacing the algorithmic layer to users rather than treating it as a black box.",
            "Visitor Companies that match a CRM-connected account are auto-linked — the data model has a foreign key relationship between the anonymous tracking layer and the known CRM layer."
          ]
        }
      ]
    },
    layouts: {
      title: "Dealfront — Screen-Level Layout Patterns",
      blocks: [
        {
          heading: "The Feed: Primary Daily-Use Screen",
          type: "prose",
          content: "The Feed is a vertically scrolling list of company cards, each showing: company logo, name, industry, country, quality score badge, last visit timestamp, and page view count. Cards have a hover state revealing quick actions (Add to list, Send to CRM, View profile). The density is calibrated for a professional daily review: enough context to qualify at a glance without requiring the full company detail page. A filter sidebar on the left allows scoping by country, industry, employee range, and intent signals."
        },
        {
          heading: "Layout Pattern Map",
          type: "table",
          rows: [
            ["Screen", "Layout", "Primary Action"],
            ["Feed", "Filterable vertical card list + left filter sidebar", "Click company → expand / send to CRM"],
            ["Company Detail", "Two-column: metadata left + session timeline right", "Export contacts / Add to CRM"],
            ["Target Search", "Filter panel top + results table", "Select contacts → export list"],
            ["Reports", "Tab-based chart dashboard", "Date range filter + export"],
            ["Integration Settings", "Wizard-style step flow", "Authenticate → configure field mapping → activate"]
          ]
        },
        {
          heading: "Layout Design Insights",
          type: "insights",
          items: [
            "Quality Score badge uses color coding (green/amber/red) — immediately scannable in the feed list without reading any numbers. Color as primary signal, number as confirmation.",
            "The session timeline in company detail (pages visited in order, with timestamp and duration per page) is the product's most unique layout — it reconstructs a company's research journey. It reveals not just that they visited, but what they were interested in.",
            "Filter sidebar is persistent and left-anchored (not a modal/panel) — prioritizing reps who spend long sessions in the Feed refining their prospect list, not casual visitors who would find the persistent sidebar intrusive."
          ]
        }
      ]
    },
    flows: {
      title: "Dealfront — Navigation & User Flows",
      blocks: [
        {
          heading: "Happy Path: SDR Daily Prospecting from Feed",
          type: "flow",
          steps: [
            { step: "1", label: "Login → Feed opens with yesterday's + today's new visitors sorted by Quality Score" },
            { step: "2", label: "Set/confirm filter: Industry = SaaS, Employees = 50–500, Country = DACH" },
            { step: "3", label: "Scan company cards — identify 3-5 high-score visitors not already in CRM" },
            { step: "4", label: "Click company → detail page: review pages visited (e.g., Pricing, Enterprise features)" },
            { step: "5", label: "'Contacts' tab: find VP Sales or CRO at that company → verify email" },
            { step: "6", label: "'Send to CRM' → creates Contact + Company in HubSpot with visit context appended" },
            { step: "7", label: "Back to Feed → repeat for next company. Goal: 10 qualified leads exported before 10am" }
          ]
        },
        {
          heading: "Happy Path: Outbound Prospecting via Echobot",
          type: "flow",
          steps: [
            { step: "1", label: "Target tab → Search Companies: Industry = Manufacturing, Revenue > €5M, Tech = SAP" },
            { step: "2", label: "Results: 1,240 companies matching filter — sort by employee count desc" },
            { step: "3", label: "Select 50 companies → View Contacts → filter by Title contains 'IT Director'" },
            { step: "4", label: "Select 80 contacts → Export to CRM / CSV / Outreach sequence" },
            { step: "5", label: "Contacts appear in HubSpot sequence → SDR begins outreach" }
          ]
        },
        {
          heading: "Navigation Pain Points",
          type: "insights",
          items: [
            "Moving between Feed (inbound) and Target (outbound) feels like switching products — the interaction model, data density, and primary actions are fundamentally different. This is the product's biggest UX coherence challenge.",
            "After sending a company to CRM, there's no in-app signal that it was done — no 'Sent to HubSpot' indicator persists on the card in the Feed. Users rely on CRM confirmation rather than Dealfront state.",
            "The 'Create Custom Feed' flow (named saved filter configuration) is not discoverable — it's buried in the Feed toolbar rather than presented as a primary organizational concept for daily workflow setup."
          ]
        }
      ]
    },
    interactions: {
      title: "Dealfront — Interaction Patterns",
      blocks: [
        {
          heading: "Quick Actions on Company Cards",
          type: "prose",
          content: "The Feed card hover state reveals a compact action strip: bookmark, add to list, send to CRM, and view company. This progressive disclosure keeps the feed visually clean during browsing but makes actions discoverable only through hover — a potential discoverability issue for new users who haven't explored the hover state. The 'Send to CRM' action is the most critical action in the product and deserves more prominent placement than a hover-revealed icon."
        },
        {
          heading: "Filter Interaction Patterns",
          type: "table",
          rows: [
            ["Pattern", "Implementation", "Insight"],
            ["Active filter chips", "Selected filters shown as dismissable chips above feed", "Immediate visual feedback on active scope"],
            ["Quick filter presets", "Saved filter configurations ('My ICP', 'Hot leads')", "Reduces daily setup friction for consistent workflows"],
            ["Range sliders", "Employee count, Revenue ranges", "Approximate targeting — precision less important than speed"],
            ["Multi-select dropdowns", "Industry, Country, Technology", "Familiar pattern; handles large option sets cleanly"],
            ["Quality score filter", "Slider: High / Medium / All", "Opinionated — pushes users toward intent-first filtering"]
          ]
        },
        {
          heading: "Alert & Notification Patterns",
          type: "insights",
          items: [
            "Dealfront supports email digest notifications ('Your target accounts visited today') — a key retention mechanism that brings users back without requiring them to check the product daily.",
            "Slack integration pushes real-time company visit alerts to a configured channel — this is the highest-frequency interaction for teams that want instant notification of target account activity.",
            "CRM integration triggers automatic contact creation when a tracked company matches a CRM account — an invisible automation that surfaces as 'last visited' property updates in HubSpot/Salesforce."
          ]
        }
      ]
    },
    datacapture: {
      title: "Dealfront — Data Definition & Validation",
      blocks: [
        {
          heading: "Data Sources",
          type: "table",
          rows: [
            ["Data Type", "Source", "Refresh Frequency"],
            ["Website visit data", "JavaScript pixel on customer website", "Real-time"],
            ["Company firmographics", "Echobot proprietary database + third-party enrichment", "Monthly"],
            ["Contact data", "Echobot database (GDPR-compliant European sources)", "Quarterly"],
            ["Technology stack", "Web crawling (tech detection)", "Monthly"],
            ["Intent signals (external)", "Bombora integration (US) / G2 review behavior", "Weekly"],
            ["CRM data", "Bidirectional sync with HubSpot / Salesforce", "Real-time sync"]
          ]
        },
        {
          heading: "GDPR as Data Design Constraint",
          type: "prose",
          content: "Dealfront's GDPR compliance shapes the data model structurally: IP-to-company resolution is used for identification (not cookie-based individual tracking). Contact data in the Echobot database is sourced from public professional directories, press releases, and company websites — all legally permissible under legitimate interest provisions. Users are shown a compliance indicator on contact records ('GDPR compliant source'). This is data provenance surfaced in the UI as a trust signal — a pattern increasingly relevant in any data-heavy B2B product."
        },
        {
          heading: "Scoring Configuration",
          type: "insights",
          items: [
            "Lead Scoring setup is a guided wizard: Step 1 - define your ICP (industry, size, location), Step 2 - weight intent signals (page visits, return visits, high-value pages visited), Step 3 - preview feed with new scoring applied.",
            "The 'High-value pages' configuration (tag specific pages like /pricing, /enterprise as higher-intent) is user-managed — putting scoring control in the hands of users who understand their own funnel.",
            "Score thresholds for notifications are configurable — 'Alert me when a company scores above 80' — giving users control over alert sensitivity without exposing the underlying algorithm."
          ]
        }
      ]
    },
    presentation: {
      title: "Dealfront — Data Presentation & Sense-Making",
      blocks: [
        {
          heading: "Quality Score as Primary Navigation Signal",
          type: "prose",
          content: "The Quality Score (0–100) is Dealfront's most powerful data presentation decision. Rather than showing raw metrics (3 visits, 7 pages, 4 minutes on site), the product collapses intent signals into a single comparable number. This enables rapid scanning — reps can assess 50 company cards in 2 minutes by reading only the score badge color and number. The score trades transparency for speed. Power users can drill into the score breakdown; casual users trust the number."
        },
        {
          heading: "Session Timeline — Narrative Data Presentation",
          type: "insights",
          items: [
            "The company visit timeline (chronological list of pages visited with time spent) is a narrative data visualization — it tells a story about a company's research journey. 'Monday: visited Home (2min) → Pricing (8min) → Enterprise contact form (left without submitting)' is far more actionable than '3 sessions, 18 pages total'.",
            "UTM parameter display alongside visit sessions gives marketers attribution context without leaving the visitor intelligence product — 'This visit came from your LinkedIn ABM campaign'.",
            "Heat-map view of most-visited pages across all companies reveals which product areas generate interest before pipeline conversations — product insight embedded in a sales tool."
          ]
        },
        {
          heading: "Reports Layer",
          type: "insights",
          items: [
            "Dealfront reports are primarily campaign attribution (which traffic sources bring high-quality company visitors) and team performance (which reps export the most leads). These are manager-facing, not rep-facing.",
            "The reports layer is the weakest part of the product — basic chart types without the flexibility of a real BI tool. Reflects a product that hasn't yet invested in its analytics layer proportional to its data richness.",
            "Benchmark data ('Your visitors score 15% higher than the SaaS industry average') appears in reports — contextualizing the user's data against anonymized platform benchmarks. A rare and valuable pattern."
          ]
        }
      ]
    },
    states: {
      title: "Dealfront — State Management & Modes",
      blocks: [
        {
          heading: "Feed States",
          type: "table",
          rows: [
            ["State", "Trigger", "Visual Signal"],
            ["New visitors", "First load / return visit today", "Blue 'New' badge on company card"],
            ["Sent to CRM", "User exports company", "Checkmark indicator on card (session-only)"],
            ["Bookmarked", "User bookmarks for follow-up", "Bookmark icon filled"],
            ["Filtered", "Active filter applied", "Filter chips above list + result count"],
            ["No results", "Filter too narrow", "Empty state with 'Adjust your filters' CTA"]
          ]
        },
        {
          heading: "Integration States",
          type: "insights",
          items: [
            "CRM integration has clear status indicators: 'Connected', 'Syncing', 'Error — reauthenticate'. Connection health is surfaced on the integrations page, not hidden in settings — users are proactively informed of sync failures.",
            "The tracking pixel has an installation verification state: after users add the pixel to their site, Dealfront shows 'Waiting for first visitor...' for up to 24h — setting clear expectations about detection latency.",
            "Team user management is role-gated: Admin vs User roles determine who can configure scoring, integrations, and billing. Role-based state is clearly indicated in the Settings nav."
          ]
        }
      ]
    },
    jtbd: {
      title: "Dealfront — JTBD Alignment",
      blocks: [
        {
          heading: "JTBD Mapping",
          type: "table",
          rows: [
            ["JTBD", "Functional", "Emotional", "Social"],
            ["Warm up cold outbound", "Know who visited before calling", "'My call has a reason — I'm not cold'", "Credible opener: 'I saw your team researched us'"],
            ["Prioritize accounts daily", "Quality score sorts highest-intent accounts first", "'I'm always working the hottest leads'", "Manager sees rep working smart"],
            ["Attribute campaign ROI", "Tie web visits to campaign UTMs → companies", "'My campaigns actually reach the right companies'", "Marketing proves pipeline impact"],
            ["Never miss a target account", "Slack alert when key account visits", "'No hot lead slips through while I'm offline'", "First to reach target account"]
          ]
        },
        {
          heading: "Friction Design Decisions",
          type: "insights",
          items: [
            "The tracking pixel installation (copy-paste code to website) is the highest-friction step in the product and gates all value. Dealfront provides detailed instructions and a verification flow — but this technical step is still a significant adoption barrier for non-technical buyers.",
            "Contact export requiring credits (Echobot module) intentionally adds friction to contact data access — a business model constraint that also prevents bulk data extraction. Users must make deliberate export decisions.",
            "Slack alert configuration is low-friction by design — one-click account connection, then select channels. Because alerts drive daily active usage, removing friction here is a direct retention investment."
          ]
        }
      ]
    },
    onboarding: {
      title: "Dealfront — Onboarding & Guidance",
      blocks: [
        {
          heading: "Onboarding Flow",
          type: "prose",
          content: "Dealfront's onboarding is structured around the pixel installation milestone: users are guided through a 5-step checklist (Install pixel → Configure ICP filters → Connect CRM → Set up alerts → Invite team). Progress is shown in a persistent sidebar checklist. The feed remains empty until the pixel detects first visitors, which can take 24–48 hours — creating a unique 'anticipation gap' in onboarding that no empty-state design fully resolves."
        },
        {
          heading: "Handling the Empty Feed",
          type: "insights",
          items: [
            "During the first 24–48h post-pixel installation, Dealfront populates the Feed with sample companies (visually distinct, labeled 'Sample data') to show users what the product will look like when live. This addresses the dead-time between installation and first real data — one of the most honest and useful empty-state patterns in this analysis.",
            "Contextual tooltips on the Quality Score ('This score combines your ICP match + visit intent signals') appear on first view — just-in-time explanation of the product's core algorithm.",
            "Integration setup wizard includes a 'Test connection' step that creates a sample record in the connected CRM — letting users verify the integration end-to-end before going live. Reduces fear of mis-configuration."
          ]
        }
      ]
    },
    errors: {
      title: "Dealfront — Error Handling & Recovery",
      blocks: [
        {
          heading: "Error Scenarios",
          type: "table",
          rows: [
            ["Error", "Presentation", "Recovery"],
            ["Pixel not detected on site", "Red status on Pixel Settings + 'Pixel not verified'", "Re-paste code + re-test button"],
            ["CRM sync failure", "Orange banner in Integrations + last sync timestamp", "Re-authenticate → re-sync"],
            ["Export credit limit reached", "Inline message at export: 'No credits remaining'", "Upgrade plan CTA"],
            ["No results for filter", "Empty feed with filter chip summary", "'Adjust filters' button + filter reset"],
            ["Company data unavailable", "Company card: 'Limited data available'", "No recovery — inform only"]
          ]
        },
        {
          heading: "Trust & Data Quality Indicators",
          type: "insights",
          items: [
            "Dealfront surfaces data freshness on company records ('Enriched: 3 months ago') — a transparency pattern that acknowledges data staleness rather than hiding it. This is particularly important for contact email addresses.",
            "Contact verification status ('Email verified', 'Unverified') appears as a badge — users know which contacts to trust for outreach vs which need additional verification before adding to sequences.",
            "When a company can't be identified from a website visit (too small, uses a residential IP, or obscured by VPN), the session is discarded rather than shown as 'Unknown Company' — preventing noise in the feed."
          ]
        }
      ]
    },
    opportunities: {
      title: "Dealfront — Opportunities & Transferable Patterns",
      blocks: [
        {
          heading: "Strongest Patterns to Reuse",
          type: "insights",
          items: [
            "Composite scoring surfaced as a single badge: collapsing multiple weighted signals into one comparable number (0–100) with color coding is the most reusable pattern for any AI matching or ranking product. In XVentures, a 'Match Score' badge per investor-startup pair would directly apply this pattern.",
            "Session timeline as narrative data: showing a sequence of actions taken with timestamps tells a story, not just statistics. For matchmaking: showing 'Investor viewed startup profile 3x, downloaded pitch deck, registered for the evening session' is far more actionable than a raw score.",
            "Sample data during onboarding empty state: pre-populating with realistic-looking sample data (clearly labeled) so new users experience the product value proposition before their real data arrives. Essential for any product with a data-loading lag.",
            "Data provenance badges ('GDPR compliant source', 'Enriched 3 months ago', 'Email verified'): surfacing metadata about data quality and origin builds trust in AI-enriched data — critical for any product making decisions on enriched rather than user-entered data."
          ]
        },
        {
          heading: "Gaps Worth Addressing in Your Product",
          type: "insights",
          items: [
            "The Feed → CRM export flow lacks a persistent state indicator — users can't tell at a glance which companies they've already processed. In any lead prioritization product, 'done' and 'to-do' states are essential for queue management.",
            "Inbound (Feed) and Outbound (Target) live too separately — a unified 'account-centric' view that shows both web visit history and database firmographics for the same company simultaneously would be more powerful.",
            "Reporting is underdeveloped relative to the data richness — a gap that any B2B intelligence platform should address. Intent data benchmarks, funnel conversion from visit → exported lead → closed won, and rep performance analytics would all add value.",
            "For XVentures specifically: Dealfront's approach of combining passive behavioral signals (who visited a profile) with active intent configuration (users define their ICP) is directly applicable to a matchmaking context — investors who viewed certain startup types + their declared focus areas = composite match intent signal."
          ]
        }
      ]
    }
  }
};

function HierarchyItem({ level, label }) {
  const indent = level * 20;
  const colors = ["#f0a500", "#888", "#666", "#555"];
  const sizes = ["13px", "12px", "12px", "11px"];
  return (
    <div style={{ paddingLeft: indent + "px", marginBottom: "6px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
      <span style={{ color: colors[level] || "#444", fontSize: "10px", marginTop: "2px", flexShrink: 0 }}>
        {level === 0 ? "▸" : level === 1 ? "◦" : "·"}
      </span>
      <span style={{ color: colors[level] || "#444", fontSize: sizes[level] || "11px", fontFamily: "IBM Plex Mono, monospace", lineHeight: 1.5 }}>{label}</span>
    </div>
  );
}

function FlowStep({ step, label }) {
  return (
    <div style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "flex-start" }}>
      <div style={{
        background: "rgba(240,165,0,0.15)", border: "1px solid rgba(240,165,0,0.4)",
        borderRadius: "50%", width: "24px", height: "24px", display: "flex",
        alignItems: "center", justifyContent: "center", flexShrink: 0,
        fontSize: "11px", fontFamily: "IBM Plex Mono, monospace", color: "#f0a500"
      }}>{step}</div>
      <p style={{ color: "#ccc", fontSize: "13px", lineHeight: 1.6, margin: 0, paddingTop: "2px", fontFamily: "'Crimson Pro', serif" }}>{label}</p>
    </div>
  );
}

function TableBlock({ rows }) {
  if (!rows || rows.length === 0) return null;
  const header = rows[0];
  const body = rows.slice(1);
  return (
    <div style={{ overflowX: "auto", marginBottom: "4px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
        <thead>
          <tr>
            {header.map((cell, i) => (
              <th key={i} style={{
                textAlign: "left", padding: "8px 12px", color: "#f0a500",
                borderBottom: "1px solid rgba(240,165,0,0.3)",
                fontFamily: "IBM Plex Mono, monospace", fontSize: "11px",
                fontWeight: 600, whiteSpace: "nowrap"
              }}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{
                  padding: "8px 12px", color: ci === 0 ? "#ddd" : "#aaa",
                  fontFamily: ci === 0 ? "IBM Plex Mono, monospace" : "'Crimson Pro', serif",
                  fontSize: ci === 0 ? "11px" : "13px", lineHeight: 1.5,
                  verticalAlign: "top"
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InsightItem({ text, accent }) {
  return (
    <div style={{
      display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start",
      padding: "10px 12px", background: "rgba(255,255,255,0.02)",
      borderLeft: `2px solid ${accent || "#f0a500"}`, borderRadius: "0 4px 4px 0"
    }}>
      <p style={{ color: "#bbb", fontSize: "13px", lineHeight: 1.65, margin: 0, fontFamily: "'Crimson Pro', serif" }}>{text}</p>
    </div>
  );
}

function ContentBlock({ block, accent }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <h4 style={{
        color: "#888", fontSize: "10px", fontFamily: "IBM Plex Mono, monospace",
        textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px", fontWeight: 600
      }}>{block.heading}</h4>

      {block.type === "prose" && (
        <p style={{ color: "#bbb", fontSize: "14px", lineHeight: 1.75, margin: 0, fontFamily: "'Crimson Pro', serif" }}>
          {block.content}
        </p>
      )}

      {block.type === "table" && <TableBlock rows={block.rows} />}

      {block.type === "hierarchy" && (
        <div style={{ padding: "12px 0" }}>
          {block.items.map((item, i) => <HierarchyItem key={i} {...item} />)}
        </div>
      )}

      {block.type === "flow" && (
        <div style={{ padding: "4px 0" }}>
          {block.steps.map((step, i) => <FlowStep key={i} {...step} />)}
        </div>
      )}

      {block.type === "insights" && (
        <div>
          {block.items.map((item, i) => <InsightItem key={i} text={item} accent={accent} />)}
        </div>
      )}
    </div>
  );
}

export default function UXPlaybook() {
  const [activePlatform, setActivePlatform] = useState("hubspot");
  const [activeSection, setActiveSection] = useState("context");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const contentRef = useRef(null);

  const platform = PLATFORMS.find(p => p.id === activePlatform);
  const section = SECTIONS.find(s => s.id === activeSection);
  const content = CONTENT[activePlatform]?.[activeSection];

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [activePlatform, activeSection]);

  return (
    <div style={{
      fontFamily: "IBM Plex Mono, monospace",
      background: "#080a0e",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      color: "#ccc"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />

      {/* TOP BAR */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        height: "48px",
        flexShrink: 0,
        background: "#090b0f"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "#f0a500", fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em" }}>◈ UX INTELLIGENCE</span>
          <span style={{ color: "#333", fontSize: "12px" }}>|</span>
          <span style={{ color: "#555", fontSize: "11px" }}>SaaS Reverse-Engineering Playbook</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{ color: "#444", fontSize: "10px" }}>v2.0 · 4 platforms · 13 dimensions</span>
        </div>
      </div>

      {/* PLATFORM SELECTOR */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        background: "#0a0c10",
        flexShrink: 0,
        overflowX: "auto"
      }}>
        {PLATFORMS.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePlatform(p.id)}
            style={{
              background: "none",
              border: "none",
              borderBottom: activePlatform === p.id ? `2px solid ${p.color}` : "2px solid transparent",
              padding: "12px 20px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              alignItems: "flex-start",
              transition: "all 0.15s",
              minWidth: "160px",
              flexShrink: 0
            }}
          >
            <span style={{
              color: activePlatform === p.id ? p.color : "#666",
              fontSize: "12px",
              fontFamily: "IBM Plex Mono, monospace",
              fontWeight: 600,
              transition: "color 0.15s"
            }}>{p.shortLabel}</span>
            <span style={{
              color: "#444",
              fontSize: "10px",
              fontFamily: "IBM Plex Mono, monospace"
            }}>{p.tag}</span>
          </button>
        ))}
      </div>

      {/* PLATFORM HEADER */}
      <div style={{
        padding: "16px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: platform.bg,
        flexShrink: 0
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: platform.color, flexShrink: 0
          }} />
          <span style={{ color: platform.color, fontSize: "11px", fontFamily: "IBM Plex Mono, monospace", fontWeight: 600 }}>
            {platform.label}
          </span>
          <span style={{ color: "#333" }}>·</span>
          <span style={{ color: "#555", fontSize: "11px", fontFamily: "'Crimson Pro', serif", fontStyle: "italic" }}>
            {platform.description}
          </span>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

        {/* SECTION NAV */}
        <div style={{
          width: sidebarOpen ? "220px" : "48px",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          background: "#090b0f",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          transition: "width 0.2s ease",
          overflow: "hidden"
        }}>
          <div style={{ padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: "none", border: "none", color: "#444",
                cursor: "pointer", fontSize: "12px", padding: "4px 8px",
                fontFamily: "IBM Plex Mono, monospace", width: "100%",
                textAlign: sidebarOpen ? "right" : "center"
              }}
            >{sidebarOpen ? "← collapse" : "→"}</button>
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                title={s.label}
                style={{
                  width: "100%",
                  background: activeSection === s.id ? `rgba(240,165,0,0.08)` : "none",
                  border: "none",
                  borderLeft: activeSection === s.id ? "2px solid #f0a500" : "2px solid transparent",
                  padding: sidebarOpen ? "10px 16px" : "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  textAlign: "left",
                  transition: "all 0.1s"
                }}
              >
                <span style={{
                  color: activeSection === s.id ? "#f0a500" : "#555",
                  fontSize: "13px",
                  flexShrink: 0,
                  transition: "color 0.1s"
                }}>{s.icon}</span>
                {sidebarOpen && (
                  <span style={{
                    color: activeSection === s.id ? "#ddd" : "#555",
                    fontSize: "10px",
                    fontFamily: "IBM Plex Mono, monospace",
                    lineHeight: 1.4,
                    transition: "color 0.1s"
                  }}>{s.label}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT PANEL */}
        <div ref={contentRef} style={{
          flex: 1,
          overflowY: "auto",
          padding: "32px 40px",
          background: "#080a0e"
        }}>
          {content ? (
            <>
              <div style={{ marginBottom: "28px", paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ color: platform.color, fontSize: "11px" }}>{section?.icon}</span>
                  <span style={{ color: "#555", fontSize: "10px", fontFamily: "IBM Plex Mono, monospace", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    {section?.label}
                  </span>
                </div>
                <h2 style={{
                  color: "#eee",
                  fontSize: "18px",
                  fontFamily: "'Crimson Pro', serif",
                  fontWeight: 600,
                  margin: 0,
                  lineHeight: 1.3
                }}>{content.title}</h2>
              </div>

              {content.blocks.map((block, i) => (
                <ContentBlock key={i} block={block} accent={platform.color} />
              ))}

              {/* SECTION NAV FOOTER */}
              <div style={{
                marginTop: "40px",
                paddingTop: "20px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                {(() => {
                  const idx = SECTIONS.findIndex(s => s.id === activeSection);
                  const prev = SECTIONS[idx - 1];
                  const next = SECTIONS[idx + 1];
                  return (
                    <>
                      {prev ? (
                        <button onClick={() => setActiveSection(prev.id)} style={{
                          background: "none", border: "1px solid rgba(255,255,255,0.1)",
                          color: "#666", cursor: "pointer", padding: "8px 14px",
                          fontSize: "10px", fontFamily: "IBM Plex Mono, monospace",
                          borderRadius: "3px", display: "flex", alignItems: "center", gap: "6px"
                        }}>← {prev.label}</button>
                      ) : <div />}
                      {next ? (
                        <button onClick={() => setActiveSection(next.id)} style={{
                          background: "none", border: "1px solid rgba(255,255,255,0.1)",
                          color: "#666", cursor: "pointer", padding: "8px 14px",
                          fontSize: "10px", fontFamily: "IBM Plex Mono, monospace",
                          borderRadius: "3px", display: "flex", alignItems: "center", gap: "6px"
                        }}>{next.label} →</button>
                      ) : <div />}
                    </>
                  );
                })()}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
              <span style={{ color: "#333", fontSize: "12px", fontFamily: "IBM Plex Mono, monospace" }}>Content loading...</span>
            </div>
          )}
        </div>

        {/* RIGHT CONTEXT PANEL */}
        <div style={{
          width: "200px",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          background: "#090b0f",
          flexShrink: 0,
          padding: "20px 16px",
          overflowY: "auto"
        }}>
          <div style={{ marginBottom: "20px" }}>
            <p style={{ color: "#444", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "10px" }}>Platforms</p>
            {PLATFORMS.map(p => (
              <div
                key={p.id}
                onClick={() => setActivePlatform(p.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  marginBottom: "6px", cursor: "pointer", padding: "4px 0"
                }}
              >
                <div style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: activePlatform === p.id ? p.color : "#333",
                  flexShrink: 0, transition: "background 0.15s"
                }} />
                <span style={{
                  color: activePlatform === p.id ? p.color : "#444",
                  fontSize: "10px", fontFamily: "IBM Plex Mono, monospace",
                  transition: "color 0.15s"
                }}>{p.shortLabel}</span>
              </div>
            ))}
          </div>

          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "16px 0" }} />

          <div>
            <p style={{ color: "#444", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "10px" }}>Sections</p>
            {SECTIONS.map(s => (
              <div
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "6px",
                  marginBottom: "5px", cursor: "pointer", padding: "2px 0"
                }}
              >
                <span style={{
                  color: activeSection === s.id ? "#f0a500" : "#333",
                  fontSize: "10px", flexShrink: 0, marginTop: "1px"
                }}>{s.icon}</span>
                <span style={{
                  color: activeSection === s.id ? "#aaa" : "#444",
                  fontSize: "10px", fontFamily: "IBM Plex Mono, monospace",
                  lineHeight: 1.4
                }}>{s.label}</span>
              </div>
            ))}
          </div>

          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "16px 0" }} />

          <div style={{ padding: "10px", background: "rgba(240,165,0,0.05)", borderRadius: "4px", border: "1px solid rgba(240,165,0,0.1)" }}>
            <p style={{ color: "#f0a500", fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "6px" }}>Framework</p>
            <p style={{ color: "#555", fontSize: "10px", lineHeight: 1.5, margin: 0, fontFamily: "'Crimson Pro', serif" }}>
              Reverse-engineer SaaS UX systematically across product context, IA, data model, layouts, flows, interactions, and JTBD alignment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
