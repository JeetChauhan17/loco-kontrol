import { HistoryEntry } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, PieChart, Activity, User, Bot, AlertTriangle, Clock, Target, ArrowDownRight } from 'lucide-react';

export function ReportsModal({ isOpen, onClose, history, valueLost }: { isOpen: boolean, onClose: () => void, history: HistoryEntry[], valueLost: number }) {
  if (!isOpen) return null;

  const totalShipments = history.length;
  const issues = history.filter(h => h.maxTier !== 'NOMINAL');
  const humanFixed = issues.filter(h => h.fixedBy === 'HUMAN');
  const aiFixed = issues.filter(h => h.fixedBy === 'AI');
  const unresolvedAndFailed = issues.filter(h => h.status === 'FAILED');

  const calculateExtraCost = (entries: HistoryEntry[]) => {
      // the only way they have extra cost is if they were fixed but cost goes to shipments
      // actually we don't have cost in history. We can estimate it from the fact we add 5% to shipments that are alternate rerouted
      return entries.reduce((acc, curr) => acc + Math.round(curr.value * 0.05), 0);
  }

  // Track resolution times for issues
  const calculateAverageResolutionTime = (entries: HistoryEntry[]) => {
    let totalTime = 0;
    let count = 0;
    entries.forEach(e => {
        if (e.resolvedAt) {
            totalTime += (e.resolvedAt.getTime() - e.createdAt.getTime());
            count++;
        }
    });
    if (count === 0) return 0;
    return totalTime / count / 1000; // in seconds
  };

  const humanAvgTime = calculateAverageResolutionTime(humanFixed);
  const aiAvgTime = calculateAverageResolutionTime(aiFixed);
  
  const issueRate = totalShipments > 0 ? (issues.length / totalShipments) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="absolute inset-0 bg-white/95 z-50 flex flex-col pointer-events-auto backdrop-blur-md"
      >
        <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
           <h2 className="text-sm font-bold uppercase tracking-widest flex items-center">
             <PieChart className="w-4 h-4 mr-2" /> Operations Report
           </h2>
           <button onClick={onClose} className="hover:bg-gray-800 p-1 rounded transition-colors text-gray-400 hover:text-white">
             <X className="w-5 h-5" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 w-full max-w-5xl mx-auto space-y-8 pb-20">
           
           <div className="grid grid-cols-4 gap-4">
               <div className="border border-gray-200 bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 flex items-center">
                    <Activity className="w-3 h-3 mr-1" /> Total Issues Hit
                  </div>
                  <div className="text-4xl font-mono text-gray-900 font-light">{issues.length} <span className="text-sm text-gray-400 font-sans">/ {totalShipments}</span></div>
                  <div className="text-xs text-gray-500 mt-2 font-mono">({issueRate.toFixed(1)}% anomaly rate)</div>
               </div>
               <div className="border border-gray-200 bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 flex items-center">
                    <Target className="w-3 h-3 mr-1" /> Resolved
                  </div>
                  <div className="text-4xl font-mono text-emerald-600 font-light">{humanFixed.length + aiFixed.length}</div>
                  <div className="text-xs text-emerald-500 mt-2 font-mono">Successfully mitigated</div>
               </div>
               <div className="border border-red-200 bg-red-50 rounded-xl p-6 shadow-sm">
                  <div className="text-[10px] uppercase tracking-widest text-red-700 font-bold mb-1 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" /> SLA Breaches
                  </div>
                  <div className="text-4xl font-mono text-red-600 font-light">{unresolvedAndFailed.length}</div>
                  <div className="text-xs text-red-500 mt-2 font-mono">Failed state reached</div>
               </div>
               <div className="border border-red-200 bg-red-50 rounded-xl p-6 shadow-sm">
                  <div className="text-[10px] uppercase tracking-widest text-red-700 font-bold mb-1 flex items-center">
                    <ArrowDownRight className="w-3 h-3 mr-1" /> Value Lost
                  </div>
                  <div className="text-4xl font-mono text-red-600 font-light">${valueLost}K</div>
                  <div className="text-xs text-red-500 mt-2 font-mono">Capital destroyed</div>
               </div>
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white rounded-xl p-8 relative overflow-hidden shadow-sm">
                 <User className="absolute -right-8 -bottom-8 w-40 h-40 text-indigo-100 opacity-50" />
                 <h3 className="text-sm uppercase tracking-widest text-indigo-900 font-bold mb-6 flex items-center">
                   <span className="w-8 h-8 rounded bg-indigo-200 text-indigo-700 flex items-center justify-center mr-3 shadow-inner">
                     <User className="w-5 h-5" />
                   </span>
                   Human Analysts
                 </h3>
                 <div className="grid grid-cols-2 gap-6 relative z-10">
                    <div>
                       <div className="text-[10px] text-indigo-500/80 uppercase font-bold tracking-wider mb-1 flex items-center"><Target className="w-3 h-3 mr-1" /> Mitigations</div>
                       <div className="text-3xl font-mono text-indigo-900 font-light">{humanFixed.length}</div>
                    </div>
                    <div>
                       <div className="text-[10px] text-indigo-500/80 uppercase font-bold tracking-wider mb-1 flex items-center"><Clock className="w-3 h-3 mr-1" /> Avg Time</div>
                       <div className="text-3xl font-mono text-indigo-900 font-light">{humanAvgTime > 0 ? `${humanAvgTime.toFixed(1)}s` : '-'}</div>
                    </div>
                    <div className="col-span-2 bg-white/50 p-5 rounded-xl border border-indigo-100/50 shadow-sm">
                       <div className="text-[10px] text-indigo-500/80 uppercase font-bold tracking-wider mb-1">Cost Incurred</div>
                       <div className="text-2xl font-mono text-indigo-900 font-light">${calculateExtraCost(humanFixed)}K</div>
                       <div className="text-xs text-indigo-400 mt-1">Cost of manual adjustments</div>
                    </div>
                 </div>
              </div>

              <div className="border border-purple-100 bg-gradient-to-br from-purple-50 to-white rounded-xl p-8 relative overflow-hidden shadow-sm">
                 <Bot className="absolute -right-8 -bottom-8 w-40 h-40 text-purple-100 opacity-50" />
                 <h3 className="text-sm uppercase tracking-widest text-purple-900 font-bold mb-6 flex items-center">
                   <span className="w-8 h-8 rounded bg-purple-200 text-purple-700 flex items-center justify-center mr-3 shadow-inner">
                     <Bot className="w-5 h-5" />
                   </span>
                   A.I. Autonomous
                 </h3>
                 <div className="grid grid-cols-2 gap-6 relative z-10">
                    <div>
                       <div className="text-[10px] text-purple-500/80 uppercase font-bold tracking-wider mb-1 flex items-center"><Target className="w-3 h-3 mr-1" /> Mitigations</div>
                       <div className="text-3xl font-mono text-purple-900 font-light">{aiFixed.length}</div>
                    </div>
                    <div>
                       <div className="text-[10px] text-purple-500/80 uppercase font-bold tracking-wider mb-1 flex items-center"><Clock className="w-3 h-3 mr-1" /> Avg Time</div>
                       <div className="text-3xl font-mono text-purple-900 font-light">{aiAvgTime > 0 ? `${aiAvgTime.toFixed(1)}s` : '-'}</div>
                    </div>
                    <div className="col-span-2 bg-white/50 p-5 rounded-xl border border-purple-100/50 shadow-sm">
                       <div className="text-[10px] text-purple-500/80 uppercase font-bold tracking-wider mb-1">Execution Cost Incurred</div>
                       <div className="text-2xl font-mono text-purple-900 font-light">${calculateExtraCost(aiFixed)}K</div>
                       <div className="text-xs text-purple-400 mt-1">Cost of algorithmic interventions</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
