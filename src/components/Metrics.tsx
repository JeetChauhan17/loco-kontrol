import { Shipment, HistoryEntry } from '../types';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

import { format } from 'date-fns';

export function Metrics({ shipments, valueLost, history, utcTime, isChaosMode, onToggleChaos, onReset }: { shipments: Shipment[], valueLost: number, history: HistoryEntry[], utcTime: Date, isChaosMode: boolean, onToggleChaos: () => void, onReset: () => void }) {
  const [timeWithoutChaos, setTimeWithoutChaos] = useState(0);

  useEffect(() => {
    if (isChaosMode) {
      setTimeWithoutChaos(0);
      return;
    }
    const interval = setInterval(() => {
      setTimeWithoutChaos(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isChaosMode]);

  const atRisk = shipments.filter(s => s.tier === 'AT_RISK').length;
  const highRisk = shipments.filter(s => s.tier === 'HIGH_RISK').length;
  const totalValueAtRisk = shipments
    .filter(s => s.tier !== 'NOMINAL')
    .reduce((sum, s) => sum + s.value, 0);

  const valueSaved = history.filter(h => h.fixedBy !== 'NONE').reduce((sum, h) => sum + h.value, 0);
  const potentialLoss = valueSaved + valueLost;

  return (
    <div className="flex items-center space-x-6 px-4 py-2 bg-white border-b border-gray-200 text-[11px] font-mono sticky top-0 z-20">
      <div className="flex items-center space-x-4">
        <div>
          <span className="text-gray-400 mr-2">TICK</span>
          <span>{Math.floor(Date.now()/1000 % 10000).toString().padStart(4, '0')}</span>
        </div>
        <div>
          <span className="text-gray-400 mr-2">UTC</span>
          <span>{utcTime.toISOString().substring(11, 19)}Z</span>
        </div>
      </div>
      <div className="w-px h-4 bg-gray-200" />
      
      <div className="flex items-center space-x-6 flex-1">
        <div>
          <span className="text-gray-400 uppercase mr-2 text-[10px]">Fleet</span>
          <span className="font-bold text-gray-800 text-sm">{shipments.length}</span>
        </div>
        <div>
          <span className="text-gray-400 uppercase mr-2 text-[10px]">At Risk / High</span>
          <span className="font-bold text-amber-500 text-sm">{atRisk}</span>
          <span className="text-gray-300 mx-1">/</span>
          <span className="font-bold text-red-500 text-sm">{highRisk}</span>
        </div>
        <div>
           <span className="text-gray-400 uppercase mr-2 text-[10px]">Val at Risk</span>
           <span className="font-bold text-gray-800 text-sm">${totalValueAtRisk}K</span>
        </div>

        <div className="flex items-center">
           <span className="text-gray-400 uppercase mr-2 text-[10px]">Financial Impact</span>
           
           <div className="flex items-center bg-gray-50 border border-gray-200 rounded px-2 py-1 relative shadow-inner">
              <div className="flex flex-col mr-3 items-end border-r border-gray-200 pr-3">
                 <span className="text-[9px] text-gray-400 uppercase mb-0.5 leading-none">Potential</span>
                 <strike className="text-gray-400 text-xs font-bold leading-none decoration-red-300 w-full text-right">${potentialLoss}K</strike>
              </div>
              <div className="flex flex-col mr-3 items-end border-r border-gray-200 pr-3">
                 <span className="text-[9px] text-gray-400 uppercase mb-0.5 leading-none flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>Saved</span>
                 <motion.span 
                    key={`saved-${valueSaved}`}
                    initial={{ scale: 1.2, color: '#34d399' }}
                    animate={{ scale: 1, color: '#10b981' }}
                    className="font-bold text-emerald-500 text-sm leading-none"
                 >
                    ${valueSaved}K
                 </motion.span>
              </div>
              <div className="flex flex-col items-end pl-1">
                 <span className="text-[9px] text-gray-400 uppercase mb-0.5 leading-none">Lost</span>
                 <motion.span 
                    key={`lost-${valueLost}`}
                    initial={valueLost > 0 ? { scale: 1.5, color: '#dc2626' } : {}}
                    animate={{ scale: 1, color: '#ef4444' }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    className={`font-bold text-sm leading-none ${valueLost > 0 ? 'text-red-500' : 'text-gray-400'}`}
                 >
                    ${valueLost}K
                 </motion.span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 shrink-0 border border-gray-200 rounded-md p-1.5 bg-gray-50 shadow-inner overflow-visible">
         <button 
            onClick={onToggleChaos} 
            className={`px-3 py-1.5 uppercase tracking-widest text-[10px] rounded shadow-sm font-bold transition-all relative ${
              isChaosMode 
                ? 'bg-red-600 text-white hover:bg-red-700 ring-2 ring-red-600 ring-offset-1' 
                : timeWithoutChaos > 30 
                  ? 'bg-indigo-600 outline outline-2 outline-offset-2 outline-indigo-500 text-white animate-pulse'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
           {isChaosMode ? 'Chaos Active' : 'Chaos Off'}
         </button>
         <button 
            onClick={onReset} 
            className="px-3 py-1.5 uppercase tracking-widest text-[10px] bg-gray-900 text-white font-bold hover:bg-gray-800 rounded shadow-sm transition-all border border-gray-900"
          >
           Reset Sim
         </button>
      </div>
    </div>
  );
}
