import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Code, Database, Lock, Terminal, Shield, Zap, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export function DocsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'api' | 'security' | 'architecture'>('overview');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="absolute inset-0 bg-white/95 z-50 flex flex-col pointer-events-auto backdrop-blur-md"
      >
        <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md shrink-0">
           <h2 className="text-sm font-bold uppercase tracking-widest flex items-center">
             <BookOpen className="w-4 h-4 mr-2" /> Developer Documentation
           </h2>
           <button onClick={onClose} className="hover:bg-gray-800 p-1 rounded transition-colors text-gray-400 hover:text-white">
             <X className="w-5 h-5" />
           </button>
        </div>

        <div className="flex-1 overflow-hidden flex max-w-7xl mx-auto w-full">
           
           {/* Sidebar */}
           <div className="w-64 border-r border-gray-200 bg-gray-50/50 p-6 flex flex-col space-y-2 shrink-0">
              <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-4">Contents</div>
              
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex items-center text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              >
                 <BookOpen className={`w-4 h-4 mr-3 ${activeTab === 'overview' ? 'text-indigo-500' : 'text-gray-400'}`} />
                 Introduction
              </button>
              
              <button 
                onClick={() => setActiveTab('architecture')}
                className={`flex items-center text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'architecture' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              >
                 <Database className={`w-4 h-4 mr-3 ${activeTab === 'architecture' ? 'text-indigo-500' : 'text-gray-400'}`} />
                 System Architecture
              </button>

              <button 
                onClick={() => setActiveTab('api')}
                className={`flex items-center text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'api' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              >
                 <Code className={`w-4 h-4 mr-3 ${activeTab === 'api' ? 'text-indigo-500' : 'text-gray-400'}`} />
                 Data Ingestion API
              </button>
              
              <button 
                onClick={() => setActiveTab('security')}
                className={`flex items-center text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              >
                 <Shield className={`w-4 h-4 mr-3 ${activeTab === 'security' ? 'text-indigo-500' : 'text-gray-400'}`} />
                 Security & Compliance
              </button>
           </div>

           {/* Content Area */}
           <div className="flex-1 overflow-y-auto p-10 pb-20">
              
              {activeTab === 'overview' && (
                 <div className="prose prose-sm max-w-none animate-in fade-in slide-in-from-bottom-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6 font-serif">Kontrol Center Overview</h1>
                    <p className="text-gray-600 mb-8 text-base leading-relaxed">
                      Kontrol Center is designed to aggregate discrete supply chain events from fragmented data sources—ERPs, TMS platforms, IoT sensors, and carrier webhooks—into a singular risk schema. It predicts downstream supply chain failures and allows both human operators and autonomous systems to mitigate SLA breaches.
                    </p>
                    
                    <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl mb-12">
                       <h3 className="text-sm font-bold uppercase tracking-widest text-amber-900 flex items-center mb-2">Current State: Simulation Mode</h3>
                       <p className="text-amber-800 text-sm">
                         You are currently viewing Kontrol Center in simulated mode via <code>useShipments.ts</code>. The UI dynamically evaluates risk logic and routes on the client. To connect this to enterprise data lakes (e.g., Snowflake, Oracle), you replace the simulated hook with the real-time Websocket/EventBridge connector described in the API section.
                       </p>
                    </div>

                    <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-4 font-serif">How the Risk Engine Works</h2>
                    <ul className="space-y-4 text-gray-600 list-disc ml-4">
                       <li><strong>Dynamic Risk Score (DRS):</strong> Computed globally combining external disruptions (weather, port congestion) and shipment constraints (days left vs. ETA). Range is 0.00 to 1.00.</li>
                       <li><strong>Autonomous Tier Bumping:</strong> DRS naturally drifts based on environmental "gravity". &gt;0.4 triggers <code>AT_RISK</code>. &gt;0.7 triggers <code>HIGH_RISK</code>.</li>
                       <li><strong>Terminal Escalation:</strong> High risk shipments trigger the Manual Review Queue. If no action is taken within 10 bounds (10 seconds locally), a catastrophic SLA failure is logged and the associated financial value is destroyed.</li>
                       <li><strong>A.I. Autonomous Mitigation:</strong> The background engine evaluates <code>AT_RISK</code> shipments and can preemptively issue vendor API calls to switch carriers or reroute paths if confidence &gt; 85%, avoiding human intervention.</li>
                    </ul>
                 </div>
              )}

              {activeTab === 'architecture' && (
                 <div className="prose prose-sm max-w-none animate-in fade-in slide-in-from-bottom-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6 font-serif">System Architecture</h1>
                    <p className="text-gray-600 mb-8 text-base">To support high-frequency localized events (10k+ eps), we recommend deploying Kontrol Center in a decoupled event-driven architecture.</p>
                    
                    <div className="my-10 p-8 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-between relative overflow-hidden">
                       <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                       
                       {/* Line connector */}
                       <div className="absolute left-24 right-24 top-1/2 h-1 bg-gray-300 -translate-y-1/2 z-0">
                          <motion.div 
                            className="h-full bg-indigo-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                          />
                       </div>

                       <div className="bg-white border-2 border-indigo-200 rounded-xl p-4 w-40 flex flex-col items-center justify-center text-center z-10 shadow-sm relative">
                          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                             <Terminal className="w-5 h-5 text-indigo-600" />
                          </div>
                          <h4 className="font-bold text-gray-900 m-0 leading-tight">Data Sources</h4>
                          <p className="text-[10px] text-gray-500 mt-1 m-0 leading-tight">ERPs, IoT, Telematics</p>
                       </div>

                       <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-4 w-48 flex flex-col items-center justify-center text-center z-10 shadow-xl relative transform scale-110">
                          <motion.div 
                             animate={{ rotate: 360 }}
                             transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                             className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center mb-3 border border-gray-700"
                          >
                             <Zap className="w-6 h-6 text-amber-400" />
                          </motion.div>
                          <h4 className="font-bold text-white m-0 leading-tight">Risk Engine</h4>
                          <p className="text-[10px] text-gray-400 mt-1 m-0 leading-tight">ML Models, Graph DB</p>
                       </div>

                       <div className="bg-white border-2 border-emerald-200 rounded-xl p-4 w-40 flex flex-col items-center justify-center text-center z-10 shadow-sm relative">
                          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                             <RefreshCw className="w-5 h-5 text-emerald-600" />
                          </div>
                          <h4 className="font-bold text-gray-900 m-0 leading-tight">Kontrol Center UI</h4>
                          <p className="text-[10px] text-gray-500 mt-1 m-0 leading-tight">WebSockets (React)</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                       <div className="border border-gray-200 p-6 rounded-xl bg-white shadow-sm flex flex-col items-center text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600"><Terminal className="w-5 h-5"/></div>
                          <h3 className="text-sm font-bold text-gray-900 mb-2">Ingestion Layer</h3>
                          <p className="text-xs text-gray-500">SQS / Kafka accepting unstructured carrier JSON and EDI data.</p>
                       </div>
                       <div className="border border-indigo-200 p-6 rounded-xl bg-indigo-50 shadow-sm flex flex-col items-center text-center">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600"><Zap className="w-5 h-5"/></div>
                          <h3 className="text-sm font-bold text-gray-900 mb-2">Risk Processing</h3>
                          <p className="text-xs text-gray-500">AWS Lambda / Fargate standardizing entities and evaluating DRS using ML pipelines.</p>
                       </div>
                       <div className="border border-emerald-200 p-6 rounded-xl bg-emerald-50 shadow-sm flex flex-col items-center text-center">
                          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600"><RefreshCw className="w-5 h-5"/></div>
                          <h3 className="text-sm font-bold text-gray-900 mb-2">Live UI State</h3>
                          <p className="text-xs text-gray-500">GraphQL Subscriptions / WebSockets pushing delta-state to Kontrol Center frontend.</p>
                       </div>
                    </div>
                 </div>
              )}

              {activeTab === 'api' && (
                 <div className="prose prose-sm max-w-none animate-in fade-in slide-in-from-bottom-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6 font-serif">Data Ingestion API</h1>
                    
                    <p className="text-gray-600 mb-8 text-base">
                      You can push internal enterprise data into the Risk Engine REST endpoints. Doing so will immediately hydrate the UI and start algorithmic DRS predictions.
                    </p>

                    <div className="border border-gray-200 rounded-xl bg-white shadow-sm mb-8 overflow-hidden">
                       <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                         <div className="text-xs font-mono font-bold text-gray-700">POST /api/v1/shipments/event</div>
                         <div className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Live</div>
                       </div>
                       <div className="p-0">
                         <pre className="text-[11px] bg-gray-900 text-gray-100 p-6 font-mono m-0 overflow-x-auto rounded-none">
{`// Requires Authentication: Bearer <KONTROL_WRITE_KEY>

{
  "shipmentId": "SHP-10492",
  "eventType": "LOCATION_UPDATE",
  "lat": 34.0522,
  "lng": -118.2437,
  "telemetry": {
     "temperature": -18.5,
     "humidity": 45
  },
  "anomalyOverrides": {
     "weather": 0.85,
     "carrierDelay": 0.12
  }
}`}
                         </pre>
                       </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif">SDK Integration (React/Next.js)</h3>
                    <p className="text-gray-600 mb-4">To remove the mock data, simply replace useShipments with the live SDK store.</p>
                    <pre className="text-[11px] bg-gray-900 text-gray-100 p-6 rounded-xl font-mono overflow-x-auto">
{`import { createClient } from '@kontrol/sdk';
import { useSyncExternalStore } from 'react';

const kClient = createClient({
  projectId: process.env.NEXT_PUBLIC_KONTROL_PROJECT_ID,
  token: process.env.NEXT_PUBLIC_KONTROL_READ_TOKEN,
  endpoint: 'wss://api.kontrol-center.com/live'
});

export function useLiveShipments() {
  const shipments = useSyncExternalStore(
    kClient.subscribe,
    kClient.getSnapshot
  );
  
  return { shipments, resolveIssue: kClient.resolve }
}`}
                    </pre>

                 </div>
              )}

              {activeTab === 'security' && (
                 <div className="prose prose-sm max-w-none animate-in fade-in slide-in-from-bottom-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6 font-serif">Security & Compliance</h1>
                    <p className="text-gray-600 mb-8 text-base">
                      Supply chain telemetry is considered highly sensitive enterprise intellectual property. Kontrol Center enforces zero-trust practices across ingestion and routing.
                    </p>

                    <div className="space-y-6">
                       <div className="border border-gray-200 rounded-xl p-6 bg-white flex items-start shadow-sm">
                          <Lock className="w-6 h-6 text-indigo-500 mr-4 mt-1 shrink-0" />
                          <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-2">End-to-End Encryption</h3>
                            <p className="text-sm text-gray-600 m-0">All payloads traversing from edge devices or ERP sinks must be encrypted via TLS 1.3. At-rest data is encrypted using AES-256 with KMS dynamic key rotation policies.</p>
                          </div>
                       </div>
                       
                       <div className="border border-gray-200 rounded-xl p-6 bg-white flex items-start shadow-sm">
                          <Database className="w-6 h-6 text-purple-500 mr-4 mt-1 shrink-0" />
                          <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-2">VPC & Private Ingestion</h3>
                            <p className="text-sm text-gray-600 m-0">Clients operating under high strict-compliance logic (ITAR, DoD) can route directly over AWS PrivateLink or Azure ExpressRoute. Traffic never transits the public internet.</p>
                          </div>
                       </div>
                       
                       <div className="border border-gray-200 rounded-xl p-6 bg-white flex items-start shadow-sm">
                          <Shield className="w-6 h-6 text-emerald-500 mr-4 mt-1 shrink-0" />
                          <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-2">Operator RBAC & Audit Trails</h3>
                            <p className="text-sm text-gray-600 m-0">Every <code>resolveIssue()</code> call mutation in the UI—whether human or A.I.—is logged to an immutable append-only ledger for post-mortem forensics and insurance claims.</p>
                          </div>
                       </div>
                    </div>
                 </div>
              )}

           </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
