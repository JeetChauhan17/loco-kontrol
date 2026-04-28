import { Escalation, Shipment } from '../types';
import { format } from 'date-fns';
import { Eye, Check, Lightbulb, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ManualReviewQueue({ 
  escalations, 
  shipments,
  onResolve,
  onSelectShipment,
  onClose
}: { 
  escalations: Escalation[], 
  shipments: Shipment[],
  onResolve: (id: string) => void,
  onSelectShipment: (id: string) => void,
  onClose: () => void
}) {
  const pending = escalations.filter(e => e.status === 'PENDING');

  return (
    <div className="absolute right-0 top-16 bottom-0 w-80 bg-white border-l border-gray-200 shadow-2xl z-40 flex flex-col pointer-events-auto overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 bg-red-50 text-red-900 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold flex items-center">
            Manual Review Queue
          </h2>
          <div className="text-[10px] uppercase tracking-wider font-mono opacity-80 mt-1">Operator Action Required</div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-red-200 text-red-800 text-xs font-bold px-2 py-0.5 rounded-full">
            {pending.length}
          </div>
          <button onClick={onClose} className="text-red-700 hover:text-red-900 transition p-1 rounded hover:bg-red-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fafafa]">
        <AnimatePresence initial={false}>
          {pending.length === 0 && (
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="text-[11px] font-mono text-gray-400 mt-10 text-center"
             >
               No active escalations.
             </motion.div>
          )}
          {pending.map((e) => {
            const shipment = shipments.find(s => s.id === e.shipmentId);
            const suggestedRoute = shipment?.routes.find(r => !r.isActive);
            return (
            <motion.div 
              key={e.id} 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white border hover:border-red-300 border-red-200 p-3 rounded shadow-sm text-xs font-mono"
            >
               <div className="flex justify-between items-start mb-2">
                 <div className="text-gray-900 font-bold text-sm cursor-pointer hover:underline" onClick={() => onSelectShipment(e.shipmentId)}>
                    {e.shipmentId}
                 </div>
                 <div className="text-gray-400 text-[10px]">
                   {format(e.timestamp, 'HH:mm:ss')}Z
                 </div>
               </div>
               
               {(() => {
                  const maxFactor: [string, number] = shipment ? Object.entries(shipment.factors).reduce((a, b) => a[1] > b[1] ? a : b) as [string, number] : ['Unknown', 0];
                  let factorName = maxFactor[0].replace(/([A-Z])/g, ' $1').trim().toLowerCase();
                  return (
                     <div className="text-gray-500 mb-3 text-[11px] leading-tight flex-1">
                        <span className="font-bold text-red-600 block mb-0.5">Critical Risk: {factorName} ({Math.round(Number(maxFactor[1]) * 100)}% severity)</span>
                        Auto-escalated due to severe factors and value at risk (${shipment?.value}K). Immediate routing review needed to prevent SLA breach.
                     </div>
                  );
               })()}

               {suggestedRoute ? (
                 <div className="mb-3 bg-indigo-50 border border-indigo-100 rounded p-2 text-indigo-900 flex items-start">
                    <Lightbulb className="w-3.5 h-3.5 mr-1.5 shrink-0 mt-0.5 text-indigo-500" />
                    <div>
                       <span className="font-bold text-[10px] uppercase">Suggestion</span>
                       <div className="text-[11px] mt-0.5">Reroute via <span className="font-bold">{suggestedRoute.name}</span> (+{suggestedRoute.costDelta})</div>
                    </div>
                 </div>
               ) : (
                 <div className="mb-3 bg-red-50 border border-red-100 rounded p-2 text-red-900 flex items-start">
                    <Lightbulb className="w-3.5 h-3.5 mr-1.5 shrink-0 mt-0.5 text-red-500" />
                    <div>
                       <span className="font-bold text-[10px] uppercase">Analysis</span>
                       <div className="text-[11px] mt-0.5">No viable alternative routes identified. Elevate to Carrier level or Accept Delay.</div>
                    </div>
                 </div>
               )}
               
               <div className="flex space-x-2 pt-2 border-t border-gray-100">
                  <button 
                     onClick={() => onSelectShipment(e.shipmentId)}
                     className="flex-1 py-1.5 flex justify-center items-center rounded border border-gray-200 hover:bg-gray-50 text-gray-700 transition"
                  >
                     <Eye className="w-3 h-3 mr-1.5" /> View
                  </button>
                  <button 
                     onClick={() => onResolve(e.id)}
                     className="flex-1 py-1.5 flex justify-center items-center rounded bg-gray-900 text-white hover:bg-gray-800 transition"
                  >
                     <Check className="w-3 h-3 mr-1.5" /> Checked
                  </button>
               </div>
            </motion.div>
          )})}
        </AnimatePresence>
      </div>
    </div>
  );
}
