import { useEffect, useState } from 'react';
import { Shipment } from '../types';
import { getNarrative } from '../lib/GeminiService';
import { Network, Navigation, CloudLightning, Activity, Play, Eye, Undo, ShieldAlert } from 'lucide-react';

export function ShipmentDetails({ shipment, onElevate, onResolve }: { shipment: Shipment, onElevate?: () => void, onResolve?: (id: string, actionType: 'REROUTE' | 'CARRIER', routeIndex?: number) => void }) {
  const [narrative, setNarrative] = useState<string>('Analyzing risk parameters...');
  const [isResolving, setIsResolving] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);

  useEffect(() => {
    setIsResolving(false);
    setSelectedRoute(null);
    setNarrative('Analyzing risk parameters...');
    if (shipment.tier !== 'NOMINAL') {
        getNarrative(shipment).then(res => setNarrative(res));
    } else {
        setNarrative('Nominal operating parameters. No analyst summary required.');
    }
  }, [shipment.id, shipment.tier]);

  const formatFactor = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  
  const FACTOR_INFO: Record<string, string> = {
    weather: 'Meteorological disruptions along the route.',
    carrierDelay: 'Carrier performance and current delays.',
    routeCongestion: 'Traffic or issues on the main route.',
    deadlinePressure: 'SLA risk based on exact delivery window.',
    portCongestion: 'Delays caused by high traffic at transit hubs.',
  };
  
  const factors = Object.entries(shipment.factors).sort((a, b) => b[1] - a[1]);

  const handleRerouteClick = () => {
    if (isResolving) {
      if (selectedRoute !== null && onResolve) {
         onResolve(shipment.id, 'REROUTE', selectedRoute);
      }
      setIsResolving(false);
      setSelectedRoute(null);
    } else {
      setIsResolving(true);
      // default selection is the next non-active route if available
      const altIndex = shipment.routes.findIndex(r => !r.isActive);
      setSelectedRoute(altIndex !== -1 ? altIndex : 0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 shrink-0 bg-white/80 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs text-gray-400">{shipment.id}</span>
            <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border ${
              shipment.tier === 'HIGH_RISK' ? 'bg-red-50 text-red-700 border-red-200' :
              shipment.tier === 'AT_RISK' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {shipment.tier.replace('_', ' ')}
            </span>
            {shipment.isResent && (
               <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border bg-purple-50 text-purple-700 border-purple-200">
                  Resent (SLA Breach)
               </span>
            )}
          </div>
          <div className="text-right">
            <div className="font-mono text-xs text-gray-400">Value</div>
            <div className="font-mono text-lg font-bold">${shipment.value}K</div>
            {shipment.extraCost ? (
               <div className="font-mono text-[9px] text-red-500 uppercase tracking-wider">
                  +${shipment.extraCost}K Extra Cost
               </div>
            ) : null}
          </div>
        </div>
        
        <h1 className="text-2xl font-serif text-gray-900 mb-2">{shipment.name}</h1>
        <div className="text-xs font-mono text-gray-500 uppercase tracking-wider flex items-center space-x-2">
          <span>{shipment.origin}</span>
          <Navigation className="w-3 h-3 mx-2 inline" />
          <span>{shipment.destination}</span>
          <span className="mx-2">·</span>
          <span>{shipment.carrier}</span>
          <span className="mx-2">·</span>
          <span>{shipment.type}</span>
        </div>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        <div className="grid grid-cols-2 gap-6">
          {/* DRS Component Bar */}
          <div className="border border-gray-200 rounded-lg p-5 bg-white/95 shadow-sm">
             <div className="flex justify-between items-end mb-4">
               <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">DRS Breakdown</h3>
               <div className="text-right">
                 <div className={`text-2xl font-mono font-bold ${shipment.drs >= 0.7 ? 'text-red-500' : shipment.drs >= 0.4 ? 'text-amber-500' : 'text-emerald-500'}`}>{shipment.drs.toFixed(2)}</div>
                 <div className="text-[9px] uppercase tracking-wider text-gray-400">Composite Risk</div>
               </div>
             </div>
             
             <div className="space-y-3">
               {factors.map(([key, val], index) => {
                 const isTopFactor = index === 0;
                 return (
                 <div key={key} className="flex items-center text-xs font-mono group relative">
                   <div className={`w-1/3 truncate font-medium ${isTopFactor ? 'text-gray-900' : 'text-gray-500'}`}>
                     {formatFactor(key)}
                   </div>
                   
                   <div className="hidden group-hover:block absolute bottom-full left-1/3 ml-2 mb-1 w-48 bg-gray-900 text-white text-[10px] p-2 rounded z-20 shadow-lg leading-tight uppercase tracking-wider">
                     {FACTOR_INFO[key]}
                     <div className="absolute top-full left-4 -mt-px border-4 border-transparent border-t-gray-900" />
                   </div>

                   <div className="flex-1 h-[6px] bg-gray-100 relative mx-3 min-w-[50px]">
                      <div 
                        className={`absolute left-0 top-0 bottom-0 ${isTopFactor ? 'bg-[#325240]' : 'bg-[#7a818c]'}`} 
                        style={{ width: `${val * 100}%` }}
                      />
                   </div>
                   <div className={`w-12 text-right ${isTopFactor ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>{val.toFixed(2)}</div>
                 </div>
               )})}
             </div>
          </div>

          {/* AI Narrative */}
          <div className="border border-gray-200 rounded-lg p-5 bg-white/95 shadow-sm relative overflow-hidden flex flex-col group">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200" />
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center">
                 <CloudLightning className="w-3 h-3 mr-1.5 text-gray-400" />
                 AI Operator Narrative
              </h3>
              {shipment.tier !== 'NOMINAL' && <div className="text-[9px] uppercase text-amber-500 font-bold flex items-center"><Activity className="w-3 h-3 mr-1 animate-pulse"/> Live</div>}
            </div>
            <div className="font-serif text-[13px] leading-relaxed text-gray-600 flex-1">
              <span className="italic">{narrative === 'Analyzing risk parameters...' ? <span className="flex items-center text-gray-400"><Activity className="w-3 h-3 mr-2 animate-pulse" /> {narrative}</span> : `"${narrative}"`}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
           <div className="border border-gray-200 rounded-lg bg-white/95 shadow-sm overflow-hidden flex flex-col">
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                 <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center">
                   <Navigation className="w-3 h-3 mr-1.5" />
                   Location Intelligence
                 </h3>
                 <span className="text-[9px] text-gray-400 uppercase">Live Map</span>
              </div>
              <div className="flex-1 bg-gray-100 min-h-[150px] relative">
                 <iframe 
                   width="100%" 
                   height="100%" 
                   frameBorder="0" 
                   scrolling="no" 
                   marginHeight={0} 
                   marginWidth={0} 
                   src={`https://maps.google.com/maps?q=${encodeURIComponent(shipment.origin + ' to ' + shipment.destination)}&t=&z=4&ie=UTF8&iwloc=&output=embed`}
                   className="absolute inset-0 grayscale contrast-125 opacity-80"
                 />
              </div>
           </div>

           {/* Route comparison table */}
           <div className={`border rounded-lg p-5 shadow-sm flex flex-col transition-colors ${isResolving ? 'border-indigo-400 bg-indigo-50/50' : 'border-gray-200 bg-white/95'}`}>
             <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-4">Route Options</h3>
             <div className="flex-1 overflow-x-auto">
               <table className="w-full text-left text-xs text-gray-600 font-mono table-fixed">
                 <thead className="border-b border-gray-100">
                   <tr>
                     <th className="font-normal w-6 py-2"></th>
                     <th className="font-normal py-2 text-gray-400 uppercase tracking-wider">Route</th>
                     <th className="font-normal w-16 py-2 text-gray-400 uppercase tracking-wider text-right">ETA</th>
                     <th className="font-normal w-16 py-2 text-gray-400 uppercase tracking-wider text-right">Cost</th>
                     <th className="font-normal w-16 py-2 text-gray-400 uppercase tracking-wider text-right">Risk</th>
                   </tr>
                 </thead>
                 <tbody>
                   {shipment.routes.map((r, i) => {
                     const isSelected = selectedRoute === i;
                     return (
                     <tr 
                        key={i} 
                        onClick={() => isResolving && !r.isActive && setSelectedRoute(i)}
                        className={`
                          ${isResolving && !r.isActive ? 'cursor-pointer hover:bg-white' : ''} 
                          ${r.isActive ? 'text-gray-900 bg-gray-50/50' : 'opacity-60'}
                          ${isSelected && isResolving ? 'bg-white shadow-sm ring-1 ring-indigo-200 opacity-100 text-indigo-900' : ''}
                        `}
                     >
                       <td className="py-2.5 px-2">
                          {isResolving && !r.isActive ? (
                            <div className={`w-3 h-3 rounded-full border ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'}`} />
                          ) : r.isActive ? (
                             <Play className="w-3 h-3 text-emerald-500 fill-current" />
                          ) : null}
                       </td>
                       <td className={`py-2.5 truncate font-bold ${isSelected && isResolving ? 'text-indigo-700' : ''}`}>
                         {r.name}
                       </td>
                       <td className="py-2.5 text-right">{r.etaDelta}</td>
                       <td className="py-2.5 text-right">{r.costDelta}</td>
                       <td className={`py-2.5 text-right ${isSelected && isResolving ? 'font-bold text-indigo-600' : ''}`}>{r.risk === 'NOMINAL' ? '−' : r.risk}</td>
                     </tr>
                    )})}
                   {shipment.routes.length === 1 && (
                      <tr><td colSpan={5} className="py-4 text-center text-gray-400 text-[10px] italic">No alternates available.</td></tr>
                   )}
                 </tbody>
               </table>
             </div>
           </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-gray-200 shrink-0 bg-[#f9f9f9] flex items-center justify-between">
         <div className="text-[10px] uppercase font-mono tracking-widest flex items-center">
           {isResolving ? (
              <span className="text-indigo-600 font-bold flex items-center">
                 <Activity className="w-3 h-3 mr-2 animate-pulse" /> Awaiting route confirmation...
              </span>
           ) : (
              <span className="text-gray-500 flex items-center">
                 <ShieldAlert className="w-3 h-3 mr-2 text-gray-400" />
                 {shipment.drs >= 0.85 ? 'Auto threshold exceeded' : 'Below auto threshold · monitoring'}
              </span>
           )}
         </div>
         <div className="flex space-x-2">
            {isResolving ? (
               <button 
                  onClick={() => setIsResolving(false)}
                  className="px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors"
                >
                 Cancel
               </button>
            ) : (
               <>
                 <button 
                   onClick={handleRerouteClick}
                   disabled={!shipment.routes.some(r => !r.isActive)}
                   className={`px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider rounded transition-all shadow-sm ${!shipment.routes.some(r => !r.isActive) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#9ca3af] text-white hover:bg-[#6b7280]'}`}
                 >
                   Reroute
                 </button>
                 <button 
                   onClick={() => onResolve && onResolve(shipment.id, 'CARRIER')}
                   disabled={shipment.routes.some(r => !r.isActive)}
                   className={`px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider rounded transition-all shadow-sm ${shipment.routes.some(r => !r.isActive) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                 >
                   Switch Carrier
                 </button>
                 <button 
                   onClick={() => {
                     onElevate && onElevate();
                   }} 
                   className="px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider bg-red-600 text-white hover:bg-red-700 rounded transition-all shadow-sm"
                 >
                   Elevate
                 </button>
               </>
            )}
            
            {isResolving && selectedRoute !== null && (
              <button 
                 onClick={handleRerouteClick}
                 className="px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-wider rounded transition-all shadow-sm bg-indigo-600 text-white hover:bg-indigo-700 ring-2 ring-indigo-600 ring-offset-1"
              >
                Confirm Reroute
              </button>
            )}
         </div>
      </div>
    </div>
  );
}
