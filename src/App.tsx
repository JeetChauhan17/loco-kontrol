import { useState } from 'react';
import { useShipments } from './hooks/useShipments';
import { Metrics } from './components/Metrics';
import { MapView } from './components/MapView';
import { ShipmentDetails } from './components/ShipmentDetails';
import { AlertFeed } from './components/AlertFeed';
import { RiskChart } from './components/RiskChart';
import { Bot, Layers, ShieldAlert, PieChart, Info, DollarSign, X } from 'lucide-react';
import { format } from 'date-fns';
import { ManualReviewQueue } from './components/ManualReviewQueue';
import { HistoryModal } from './components/HistoryModal';
import { ReportsModal } from './components/ReportsModal';
import { DocsModal } from './components/DocsModal';
import { OnboardingTour } from './components/OnboardingTour';
import { HistoryEntry } from './types';

export default function App() {
  const { shipments, alerts, history, escalations, valueLost, escalateShipment, resolveEscalation, resolveIssue, utcTime, isChaosMode, toggleChaos, reset } = useShipments();
  const [activeShipmentId, setActiveShipmentId] = useState<string | null>('SHP-022');
  const [activeModal, setActiveModal] = useState<'REVIEW' | 'HISTORY' | 'REPORTS' | 'DOCS' | null>(null);
  const [tierFilter, setTierFilter] = useState<'ALL' | 'NOMINAL' | 'AT_RISK' | 'HIGH_RISK'>('ALL');
  
  const activeShipment = shipments.find(s => s.id === activeShipmentId) || shipments[0];

  const sortedShipments = [...shipments].filter(s => tierFilter === 'ALL' || s.tier === tierFilter).sort((a, b) => {
    return b.drs - a.drs;
  });

  const pendingEscalations = escalations.filter(e => e.status === 'PENDING').length;

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden font-sans relative">
      <OnboardingTour />
      
      {/* Top Header - Kept clean and white per request */}
      <div className="px-5 py-4 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 z-20">
         <div className="flex items-center">
           <Layers className="w-5 h-5 text-gray-900 mr-3" />
           <div>
             <div className="text-[10px] font-mono tracking-widest text-gray-400 uppercase leading-none mb-1">
               SSC // Smart Supply Chains — {format(utcTime, 'yyyy-MM-dd')}
             </div>
             <h1 className="font-serif text-xl font-bold text-gray-900 leading-none tracking-tight">Kontrol Center</h1>
           </div>
         </div>
         
         <div className="flex items-center">
           <button 
             onClick={() => setActiveModal(activeModal === 'REVIEW' ? null : 'REVIEW')}
             className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
               pendingEscalations > 0 
                 ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100 ring-2 ring-red-500 ring-offset-1 animate-pulse' 
                 : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
             }`}
           >
              <ShieldAlert className={`w-4 h-4 ${pendingEscalations > 0 ? 'text-red-500' : 'text-gray-400'}`} />
              <span>Review Queue</span>
              {pendingEscalations > 0 && (
                 <span className="bg-red-500 text-white rounded-full px-1.5 py-0.5 text-[10px] leading-none ml-1">
                   {pendingEscalations}
                 </span>
              )}
           </button>
           
           <button 
             onClick={() => setActiveModal(activeModal === 'HISTORY' ? null : 'HISTORY')}
             className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs font-bold transition-all ml-2"
           >
             <Layers className="w-4 h-4 text-gray-400" />
             <span>History</span>
           </button>

           <button 
             onClick={() => setActiveModal(activeModal === 'REPORTS' ? null : 'REPORTS')}
             className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs font-bold transition-all ml-2"
           >
             <PieChart className="w-4 h-4 text-gray-400" />
             <span>Reports</span>
           </button>

           <button 
             onClick={() => setActiveModal(activeModal === 'DOCS' ? null : 'DOCS')}
             className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-all ml-2"
           >
             <Layers className="w-4 h-4 text-indigo-500" />
             <span>API Docs</span>
           </button>
         </div>
      </div>
      
      <Metrics 
        shipments={shipments} 
        valueLost={valueLost} 
        history={Object.values(history) as HistoryEntry[]} 
        utcTime={utcTime} 
        isChaosMode={isChaosMode} 
        onToggleChaos={toggleChaos} 
        onReset={reset} 
      />

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Column: Risk Board */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col z-10 shrink-0">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Risk Board</div>
              <div className="text-xs text-gray-500 font-mono mt-0.5 mb-1">{shipments.length} avg</div>
              {tierFilter !== 'ALL' && (
                 <button onClick={() => setTierFilter('ALL')} className="text-[9px] font-bold text-indigo-500 uppercase flex items-center hover:text-indigo-700">
                    <X className="w-3 h-3 mr-1" /> Clear Filter
                 </button>
              )}
            </div>
            <RiskChart shipments={shipments} onFilter={(tier) => setTierFilter(tier)} />
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {sortedShipments.map(s => {
              const isFlashing = escalations.some(e => e.shipmentId === s.id && e.status === 'PENDING') || s.tier === 'HIGH_RISK';
              const hEntry = history.find(h => h.id === s.id);
              const isAIFixed = hEntry?.fixedBy === 'AI';
              const isHumanFixed = hEntry?.fixedBy === 'HUMAN';

              return (
              <div 
                key={s.id} 
                onClick={() => setActiveShipmentId(s.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors relative ${activeShipmentId === s.id ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-gray-50'} ${isFlashing ? 'bg-red-50/80 hover:bg-red-50 animate-pulse' : ''}`}
              >
                {activeShipmentId === s.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-gray-700">{s.id}</span>
                    {isAIFixed && <span className="bg-purple-100 text-purple-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center"><Bot className="w-3 h-3 mr-1"/> AI Fixed</span>}
                    {isHumanFixed && <span className="bg-indigo-100 text-indigo-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Human Fixed</span>}
                  </div>
                  <span className={`text-[9px] uppercase font-bold tracking-wider ${s.tier === 'HIGH_RISK' ? 'text-red-500' : s.tier === 'AT_RISK' ? 'text-amber-500' : 'text-gray-400'}`}>
                    {s.tier === 'NOMINAL' ? '' : s.tier.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900 truncate mb-1">{s.name}</div>
                <div className="flex justify-between items-end mt-2">
                  <div className="text-[10px] text-gray-400 font-mono uppercase truncate flex-1 pr-2">
                    {s.origin} → {s.destination}
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`font-mono text-xs font-bold ${s.drs >= 0.7 ? 'text-red-600' : s.drs >= 0.4 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {s.drs.toFixed(2)} DRS
                    </div>
                    {(s.extraCost || 0) > 0 && (
                      <div className="text-[9px] font-mono text-red-500 mt-0.5 flex items-center">
                         +${s.extraCost}k
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* Center: Details overlying Map */}
        <div className="flex-1 relative flex flex-col">
           <MapView shipments={shipments} activeId={activeShipmentId} />
           
           <div className="absolute inset-0 pointer-events-none mt-20">
             {/* We leave some top space for the map to be visible. */}
           </div>
           
           <div className="absolute inset-x-0 bottom-0 top-0 overflow-y-auto pointer-events-auto bg-white/90 backdrop-blur-sm border-t border-gray-200">
              {activeShipment ? (
                <ShipmentDetails 
                   shipment={activeShipment} 
                   onElevate={() => escalateShipment(activeShipment.id)}
                   onResolve={(id, action) => resolveIssue(id, action)}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                   <div className="text-gray-400 font-mono text-sm uppercase tracking-widest">No active shipments in network</div>
                </div>
              )}
           </div>
        </div>

        {/* Right Column: Alert Feed */}
        <div className="w-80 border-l border-gray-200 z-10 shrink-0 bg-white">
           <AlertFeed alerts={alerts} />
        </div>

        {/* Floating Manual Review Queue */}
        {activeModal === 'REVIEW' && (
           <ManualReviewQueue 
             escalations={escalations} 
             shipments={shipments}
             onResolve={resolveEscalation} 
             onSelectShipment={(id) => {
               setActiveShipmentId(id);
             }}
             onClose={() => setActiveModal(null)}
           />
        )}
        
        <HistoryModal 
           isOpen={activeModal === 'HISTORY'}
           onClose={() => setActiveModal(null)}
           history={Object.values(history) as HistoryEntry[]}
        />

        <ReportsModal 
           isOpen={activeModal === 'REPORTS'}
           onClose={() => setActiveModal(null)}
           history={Object.values(history) as HistoryEntry[]}
           valueLost={valueLost}
        />

        <DocsModal 
           isOpen={activeModal === 'DOCS'}
           onClose={() => setActiveModal(null)}
        />
      </div>
    </div>
  );
}
