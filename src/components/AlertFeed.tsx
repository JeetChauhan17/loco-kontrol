import { Alert } from '../types';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { Bot, User } from 'lucide-react';

export function AlertFeed({ alerts }: { alerts: Alert[] }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const visibleAlerts = alerts.filter(a => {
    if (a.type === 'DELIVERED') {
      return now.getTime() - a.timestamp.getTime() < 5000;
    }
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-[#fafafa]">
      <div className="px-4 py-3 border-b border-gray-200 shrink-0 flex items-center justify-between">
         <h2 className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Live Alert Feed</h2>
         <span className="text-xs font-mono text-gray-400">{visibleAlerts.length} events</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence initial={false}>
          {visibleAlerts.length === 0 && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="text-sm font-mono text-gray-400 mt-10 text-center"
             >
               No alerts in current session
             </motion.div>
          )}
          {visibleAlerts.map((a) => {
             let colorClass = 'bg-white border-gray-200';
             let indicatorClass = 'bg-gray-300';
             
             let heightClass = 'py-3 px-3';
             
             if (a.type === 'FAILED') { colorClass = 'bg-red-50 border-red-200'; indicatorClass = 'bg-red-600'; }
             else if (a.type === 'DELIVERED') { colorClass = 'bg-gray-50 border-gray-100 text-gray-400'; indicatorClass = 'bg-gray-300'; heightClass = 'py-1.5 px-3 opacity-60 hover:opacity-100'; }
             else if (a.type === 'AUTO_FIX') { colorClass = 'bg-purple-50 border-purple-200'; indicatorClass = 'bg-purple-500'; heightClass = 'py-2 px-3'; }
             else if (a.type === 'HUMAN_FIX') { colorClass = 'bg-indigo-50 border-indigo-200'; indicatorClass = 'bg-indigo-500'; heightClass = 'py-2 px-3'; }
             else if (a.type === 'RESENT') { colorClass = 'bg-pink-50 border-pink-200'; indicatorClass = 'bg-pink-500'; heightClass = 'py-2 px-3'; }
             else if (a.newTier === 'HIGH_RISK') { colorClass = 'bg-white border-red-200 shadow-sm shadow-red-100'; indicatorClass = 'bg-red-500'; }
             else if (a.newTier === 'AT_RISK') { colorClass = 'bg-white border-amber-200'; indicatorClass = 'bg-amber-500'; }
             else { colorClass = 'bg-white border-emerald-50'; indicatorClass = 'bg-emerald-400'; heightClass = 'py-1.5 px-3 opacity-60 hover:opacity-100'; }

             return (
            <motion.div 
              key={a.id} 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`text-xs font-mono flex justify-between rounded relative overflow-hidden border ${colorClass} ${heightClass}`}
            >
               <div className={`absolute left-0 top-0 bottom-0 w-1 ${indicatorClass}`} />
               
               <div className="z-10 relative pl-2 max-w-[80%]">
                  <div className="text-gray-900 font-bold mb-0.5">{a.shipmentId}</div>
                  
                  {a.message ? (
                     <div className="text-[10px] text-gray-800 leading-tight flex items-start">
                        {a.type === 'AUTO_FIX' && <Bot className="w-3 h-3 text-purple-600 mr-1.5 shrink-0 mt-0.5" />}
                        {a.type === 'HUMAN_FIX' && <User className="w-3 h-3 text-indigo-600 mr-1.5 shrink-0 mt-0.5" />}
                        {a.type === 'AUTO_FIX' || a.type === 'HUMAN_FIX' ? (
                           <span className="font-bold">{a.message}</span>
                        ) : a.type === 'FAILED' ? (
                           <span className="font-bold text-red-700">{a.message}</span>
                        ) : a.message}
                     </div>
                  ) : (
                     <div className="text-[10px] text-gray-500">
                       <span className={a.oldTier !== 'NOMINAL' ? (a.oldTier === 'HIGH_RISK' ? 'text-red-600 font-bold' : 'text-amber-600 font-bold') : 'text-gray-400'}>{a.oldTier.replace('_', ' ')}</span>
                       <span className="mx-1 text-gray-300">→</span>
                       <span className={a.newTier !== 'NOMINAL' ? (a.newTier === 'HIGH_RISK' ? 'text-red-600 font-bold' : 'text-amber-600 font-bold') : 'text-gray-400'}>{a.newTier.replace('_', ' ')}</span>
                     </div>
                  )}
               </div>
               <div className="text-gray-400 text-[10px] z-10 relative text-right shrink-0">
                 {format(a.timestamp, 'HH:mm:ss')}Z
               </div>
            </motion.div>
          )})}
        </AnimatePresence>
      </div>
    </div>
  );
}
