# Loco-Kontrol
> **Enterprise Supply Chain Intelligence & Autonomous Logistics Orchestration Platform**

Predict disruptions before they happen. Understand the financial impact instantly. Resolve operational failures autonomously.

---

## Table of Contents

- [Overview](#overview)
- [Why Loco-Kontrol](#why-loco-kontrol)
- [Architecture](#architecture)
- [Core Capabilities](#core-capabilities)
  - [Dynamic Risk Scoring](#dynamic-risk-scoring)
  - [Cascade Propagation Engine](#cascade-propagation-engine)
  - [AI Narrative Engine](#ai-narrative-engine)
  - [Autonomous Resolution Engine](#autonomous-resolution-engine)
  - [Intelligent Review Queue](#intelligent-review-queue)
  - [Live Operational Feed](#live-operational-feed)
  - [Historical Timeline](#historical-timeline)
  - [Chaos Engineering Environment](#chaos-engineering-environment)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Enterprise Integration](#enterprise-integration)
- [Enterprise Readiness](#enterprise-readiness)
- [Demo Scenarios](#demo-scenarios)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

**Loco-Kontrol** is a production-oriented operational intelligence platform built for modern logistics and supply chain ecosystems.

The platform continuously ingests shipment telemetry, evaluates disruption probability in real time using a **Dynamic Risk Scoring (DRS)** engine, predicts downstream operational and financial impact through dependency propagation, and autonomously mitigates disruptions before SLA breaches occur.

Unlike traditional supply chain systems that react *after* failures become visible, Loco-Kontrol operates proactively — identifying risks early, explaining them clearly, and executing mitigation workflows automatically within configurable authority boundaries.

The current release includes a **deterministic simulation environment** for demonstrations, onboarding, resilience testing, and chaos engineering, while preserving full compatibility with real enterprise telemetry pipelines.

---

## Why Loco-Kontrol

Modern supply chains do not fail because organizations lack data — they fail because:

- Telemetry is fragmented across systems
- Operational context is disconnected from business impact
- Disruptions compound faster than humans can react
- Existing systems are reactive rather than predictive

Loco-Kontrol acts as an intelligence layer above existing logistics infrastructure, transforming raw telemetry into:

| Capability | Description |
|---|---|
| **Operational Awareness** | Unified view of all shipment risk in real time |
| **Financial Risk Visibility** | Cascading value-at-risk quantification |
| **AI-Assisted Decision Making** | Narrative explanations and mitigation recommendations |
| **Autonomous Mitigation** | Self-resolving disruptions within authority boundaries |
| **Escalation Orchestration** | Intelligent human handoff for critical incidents |

---

## Architecture

```
┌───────────────────────────────────────────────────────┐
│                  Enterprise Data Sources              │
│        SAP • Oracle • WMS • IoT • Carrier APIs        │
└──────────────────────────┬────────────────────────────┘
                           │
                           ▼
┌───────────────────────────────────────────────────────┐
│           Ingestion & Event Processing Layer          │
│    Kafka • EventBridge • Queue Processing             │
└──────────────────────────┬────────────────────────────┘
                           ▼
┌───────────────────────────────────────────────────────┐
│           Dynamic Risk Intelligence Engine            │
│              Real-Time DRS Calculation                │
└───────────────┬───────────────────┬───────────────────┘
                │                   │
                ▼                   ▼
┌──────────────────────┐  ┌────────────────────────────┐
│  AI Narrative Engine │  │  Cascade Propagation Engine│
│  Operational Briefing│  │  Dependency Impact Analysis│
└──────────┬───────────┘  └──────────────┬─────────────┘
           └──────────────┬───────────────┘
                          ▼
┌───────────────────────────────────────────────────────┐
│       Autonomous Resolution & Authority Engine        │
│       AI Rerouting • Escalation • SLA Protection      │
└──────────────────────────┬────────────────────────────┘
                           ▼
┌───────────────────────────────────────────────────────┐
│          Loco-Kontrol Operations Dashboard            │
│    Risk Board • Review Queue • Live Feed • History    │
└───────────────────────────────────────────────────────┘
```

---

## Core Capabilities

### Dynamic Risk Scoring

Every shipment is continuously evaluated against multiple disruption vectors and assigned a real-time **Dynamic Risk Score (DRS)**.

**Risk Formula:**

```
DRS = (weather_risk    × 0.30)
    + (carrier_delay   × 0.25)
    + (route_congestion × 0.20)
    + (deadline_pressure × 0.15)
    + (port_congestion  × 0.10)
```

Each component is scored from `0.00` (safe) to `1.00` (severe).

**Risk Tiers:**

| Tier | DRS Range | Status |
|---|---|---|
| `NOMINAL` | 0.00 – 0.39 | Stable |
| `AT_RISK` | 0.40 – 0.69 | Monitoring & Mitigation |
| `HIGH_RISK` | 0.70 – 1.00 | Escalation & Intervention |

Every DRS component supports hover interactions showing factor explanation, score contribution, operational implications, and triggering telemetry.

---

### Cascade Propagation Engine

A delayed shipment rarely impacts only itself. The Cascade Propagation Engine maps dependency chains between shipments, manufacturing stages, warehouses, QA pipelines, and customer deliveries — turning logistics telemetry into business intelligence.

**Example cascade:**

```
SHP-014 delayed
    │
    ├── Engine Assembly Impacted
    ├── Final QC Delayed
    └── Customer Delivery Blocked

Total Value At Risk: $182,400
```

The engine predicts downstream failures, SLA exposure, manufacturing delays, customer delivery impact, and total financial value at risk.

---

### AI Narrative Engine

Instead of forcing analysts to manually interpret telemetry, Loco-Kontrol automatically generates human-readable operational narratives covering:

- Disruption summaries and probable root causes
- Estimated operational and financial impact
- Mitigation recommendations and reroute suggestions
- Escalation reasoning

**Example:**

> *Shipment SHP-014 faces elevated disruption risk due to severe weather conditions intersecting the Taiwan Strait corridor within the next 6 hours. Carrier reliability on this route is currently degraded due to regional congestion. Route B is recommended as it reduces disruption probability while maintaining SLA compliance within acceptable thresholds.*

Narratives are generated lazily to reduce API overhead and maintain performance.

---

### Autonomous Resolution Engine

Loco-Kontrol includes an AI-driven authority evaluation system that determines whether the platform can safely act without human intervention.

**AI can autonomously:**

- Reroute shipments and swap carriers
- Stabilize congestion drift
- Hold upstream dependencies
- Rebalance routes
- Suppress false-positive alerts
- Recover weather-related delays
- Mitigate low-severity disruptions

**Human escalation occurs only when:**

- Shipment value is extremely high
- No valid reroute exists
- A terminal operational blockage occurs
- SLA breach probability becomes critical
- Accidents or complete route failures occur

This prevents operator overload and ensures humans only handle truly critical events.

---

### Intelligent Review Queue

The review queue provides full context for every escalated incident:

- Issue severity classification
- Detailed operational explanation and financial impact
- AI-generated route alternatives and recommended actions
- Escalation reasoning and operator decision workflows

The queue is persistent and does not remove unresolved incidents.

**Resolution types:**

| Status | Meaning |
|---|---|
| AI Stabilized | AI autonomously mitigated the disruption |
| Human Resolved | Analyst intervention was required |
| Pending Review | Awaiting escalation handling |
| Unresolved | Critical unresolved issue |

---

### Live Operational Feed

The live feed prioritizes by operational severity rather than chronology:

1. `HIGH_RISK` disruptions
2. Failed deliveries
3. Escalations
4. Human interventions
5. AI reroutes
6. Standard operational events

Completed delivery notifications automatically fade after 5 seconds to reduce interface noise.

---

### Historical Timeline

All operational events are persisted into an immutable historical ledger for full operational traceability and audit visibility. Each entry captures timestamp, shipment ID, route metadata, disruption severity, operational impact, resolution status, and AI vs. human resolution outcome.

---

### Chaos Engineering Environment

Loco-Kontrol includes a deterministic disruption simulation environment inspired by chaos engineering methodologies, supporting:

- Resilience and SLA stress testing
- Operator training and escalation validation
- Incident replay and onboarding workflows
- Recovery verification

> The simulation layer only replaces the ingestion source. The core risk engine, AI systems, escalation logic, and orchestration flows remain production-compatible.

The system periodically recommends Chaos Mode activation if operators have not recently tested resilience scenarios.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 6, Tailwind CSS 4, Framer Motion, Recharts |
| **Backend / Infra** | Node.js, Kafka-compatible ingestion, event-driven processing |
| **AI Layer** | Google Gemini, Claude API |
| **Utilities** | date-fns, Lucide React |

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- A Google Gemini API key

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd loco-kontrol

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_api_key
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Deployable to Vercel, Netlify, AWS Amplify, or Cloudflare Pages.

---

## Project Structure

```
src/
├── components/
│   ├── dashboard/
│   ├── review/
│   ├── alerts/
│   ├── onboarding/
│   ├── history/
│   └── charts/
│
├── engine/
│   ├── scoring/
│   ├── cascade/
│   ├── authority/
│   ├── ai/
│   └── simulation/
│
├── context/
├── reducers/
├── hooks/
├── data/
├── docs/
└── utils/
```

---

## Enterprise Integration

Loco-Kontrol integrates directly into enterprise logistics ecosystems without requiring frontend redesigns or workflow changes, supporting:

- **ERP:** SAP, Oracle SCM
- **Warehouse & Transport:** WMS, TMS
- **Streaming:** Kafka, AWS EventBridge
- **Logistics:** Carrier APIs, GPS telemetry, IoT shipment trackers
- **Port & Customs:** Port authority systems, freight & customs systems
- **Other:** EDI pipelines, fleet management platforms

---

## Enterprise Readiness

**Production Architecture:**

- Stateless risk evaluation with horizontal scaling
- Event-driven, queue-safe orchestration
- AI fallback handling and authority-bound automation
- Human override workflows and deterministic recovery logic
- Immutable audit-safe action pipelines

**Security & Compliance:**

- JWT authentication compatible
- RBAC-ready architecture
- API gateway and TLS transport support
- Immutable audit logging
- AI action traceability and event replay capability

---

## Demo Scenarios

### Weather Cascade
Typhoon disruption triggering route instability, dependency cascade, and autonomous rerouting.

### Carrier Reliability Collapse
Carrier failure event triggering multi-shipment escalation, manual intervention workflows, and alternate carrier routing.

### Port Congestion
Port saturation triggering upstream holds, SLA protection workflows, and dependency mitigation.

---

## Roadmap

| Feature | Description |
|---|---|
| **Live ERP Action Execution** | Direct SAP / Oracle operational updates |
| **Multi-Operator Collaboration** | Shared analyst workflows and escalation ownership |
| **Neo4j Dependency Intelligence** | Advanced graph analytics for global supply chains |
| **Voice-Based AI Operations** | Conversational operational analysis via real-time voice AI |
| **Predictive Financial Forecasting** | Projected revenue loss and SLA breach modeling |
| **Autonomous Optimization Layer** | Self-improving mitigation strategies based on operational outcomes |

---

## License

This project is proprietary software.
Unauthorized use, copying, modification, or distribution is prohibited.
