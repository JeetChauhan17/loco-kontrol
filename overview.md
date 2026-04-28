# Project Overview - Kontrol Center

**Kontrol Center** is a real-time, interactive dashboard that visualizes global supply chain shipments, dynamic risk analysis, and automatic issue resolution. The application demonstrates an "AI in the loop" approach to supply chain operations. 

## Features & Philosophy

1. **Risk Board & Shipment List:** Sorts shipments based on Dynamic Risk Score (DRS). High DRS signifies external disruption (weather, delays, route congestion).
2. **AI Autonomous Overrides:** The application simulates a background Risk Engine. If a certain shipment crosses an `AT_RISK` threshold (DRS 0.5 - 0.84), the AI will:
   - Make an executive decision to switch routes (Reroute) without human intervention if an alternative exists.
   - Ignore minor flags if they represent no severe blockage.
   - Forward cases to manual review if no fast option exists or the threshold is entirely broken.
3. **Manual Review Queue:** The escalation queue handles "Terminal" cases: shipments above `0.85` DRS or with serious disruption (e.g. Route Congestion > 0.80). Humans act to:
   - Accept the delay.
   - Pay to switch carriers or reroute manually.
4. **Resilience & SLA Value Savings:** Acknowledging the financial dimension, the system tracks "Financial Impact": how much money the AI and Human Operators have combined to save (by removing friction before SLA Breach happens) and how much has actually been lost to breaches.

## Application Architecture

The system is conceptualized as a distributed event-driven mesh but runs entirely as a localized React / Vite prototype app. 

### Key Modules 

* `/components/AlertFeed.tsx` - Visualizes the global event stream in real time. Showcases Autonomous AI actions vs alerts.
* `/components/DocsModal.tsx` - Provides an interactive guide and an architectural diagram bridging external factors with the LLM/Engine and UI.
* `/components/ManualReviewQueue.tsx` - Renders escalated "Terminal Risk" shipments for user interaction. Allows 'resolving' or ignoring.
* `/components/Metrics.tsx` - Holds the main KPI counters: Fleet count, Value Saved, SLA Loss.
* `/components/ShipmentDetails.tsx` - Drills down into the risk parameters, providing dynamic GenAI summaries about specific shipment states, routes, options, and status.
* `/components/RiskChart.tsx` - Displays a Recharts visual for system-wide health (Nominal, At Risk, High Risk).
* `/hooks/useShipments.ts` - The localized physics engine simulating real-time environment changes. It modifies shipment DRS dynamically to mimic organic delay creep.

## User Flow

1. An observer watches shipments bounce between Nominal and At Risk.
2. The AI seamlessly performs background Reroutes to protect shipments.
3. If an extreme bottleneck hits, the shipment is kicked into `HIGH_RISK` and visually elevated into the Manual Review Queue (pulsing red).
4. The observer is tasked to intervene; they must "Switch Carrier" or "Reroute" the item.
5. In extreme "Chaos Mode", multiple vectors decay rapidly forcing constant interaction and testing user load.

### Constraints & Edge Cases 
- GenAI Situation reports generate on command when a shipment is at risk, summarizing the disruption. 
- Escalations persist in the UI permanently until human interaction addresses them (ensuring operators don't lose value unexpectedly). 
- Changing Carriers costs money, while Rerouting alters delivery timelines. 

## Technical Foundation

* Built with React 18, Vite, TypeScript, and TailwindCSS.
* Uses Framer Motion for event-based visual triggers (like SLA value lost counting up).
* Lucide React icons provide clean structural iconography.
* Dummy Data replicates various Global Freight and Logistics models (from EV Powertrains out of Reno to Pharma shipments in Iberia). 

## Notes for the Future 

If transitioned from frontend simulation into full-stack architecture, we would port the `useShipments.ts` risk modification engine into a Golang or Rust event stream handler that feeds an Apache Kafka mesh, allowing the React UI to connect exclusively via WebSockets to visually surface and accept actions via secure RPC. 
