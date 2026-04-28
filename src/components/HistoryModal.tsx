import { HistoryEntry } from '../types';
import { format } from 'date-fns';
import { AlertCircle, AlertTriangle, ArrowRight, Bot, CheckCircle, Package, RefreshCw, Truck, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function HistoryModal({ isOpen, onClose, history }: { isOpen: boolean, onClose: () => void, history: HistoryEntry[] }) {
  if (!isOpen) return null;

  // sort by created desc
  const sortedHistory = [...history].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <AnimatePresence>
      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className="absolute inset-0 bg-white/95 z-50 flex flex-col"
      >
        <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
           <h2 className="text-sm font-bold uppercase tracking-widest flex items-center">
             <ListIcon className="w-4 h-4 mr-2" /> Shipment Log / History
           </h2>
           <button onClick={onClose} className="hover:bg-gray-800 p-1 rounded transition-colors text-gray-400 hover:text-white">
             <X className="w-5 h-5" />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
           {sortedHistory.map(entry => {
              const hasIssues = entry.maxTier !== 'NOMINAL';
              
              return (
              <div key={entry.id} className="border border-gray-200 rounded-md bg-white shadow-sm flex overflow-hidden">
                {/* Left section: Time & Identity */}
                <div className="w-1/3 bg-gray-50 px-4 py-3 border-r border-gray-200 flex flex-col justify-center">
                   <div className="text-[10px] text-gray-400 font-mono tracking-wider mb-1">
                     {format(entry.createdAt, 'HH:mm:ss')} Z
                   </div>
                   <div className="text-sm font-bold text-gray-800 font-mono">{entry.id}</div>
                   <div className="text-xs text-gray-500 mt-0.5 truncate">{entry.name}</div>
                   <div className="text-xs font-mono font-medium text-gray-400 mt-2">${entry.value}K</div>
                </div>

                {/* Middle section: Issues */}
                <div className="w-1/3 px-4 py-3 border-r border-gray-200 flex flex-col justify-center bg-white">
                   <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Issues Logged</div>
                   {hasIssues ? (
                     <div className="flex items-center space-x-2">
                        {entry.maxTier === 'HIGH_RISK' ? (
                          <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                            <AlertCircle className="w-3 h-3 mr-1.5" />
                            <span className="text-xs font-bold uppercase tracking-wider font-mono">High Risk</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                            <AlertTriangle className="w-3 h-3 mr-1.5" />
                            <span className="text-xs font-bold uppercase tracking-wider font-mono">At Risk</span>
                          </div>
                        )}
                     </div>
                   ) : (
                     <div className="text-xs font-mono text-gray-400">NONE</div>
                   )}
                </div>

                {/* Right section: Resolution */}
                <div className="flex-1 px-4 py-3 flex flex-col justify-center relative bg-white overflow-hidden">
                   <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">Resolution</div>
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-2">
                        {entry.fixedBy === 'AI' && (
                           <div className="flex items-center text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono border border-purple-100">
                             <Bot className="w-3 h-3 mr-1" />
                             Auto
                           </div>
                        )}
                        {entry.fixedBy === 'HUMAN' && (
                           <div className="flex items-center text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono border border-indigo-100">
                             <User className="w-3 h-3 mr-1" />
                             Human
                           </div>
                        )}
                        
                        {entry.fixedBy !== 'NONE' && <ArrowRight className="w-3 h-3 text-gray-300 mx-1" />}

                        {entry.status === 'DELIVERED' && (
                          <div className="flex items-center text-emerald-600 font-bold text-xs uppercase tracking-wider font-mono">
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                            Delivered
                          </div>
                        )}
                        {entry.status === 'FAILED' && (
                          <div className="flex items-center text-red-600 font-bold text-xs uppercase tracking-wider font-mono">
                            <X className="w-4 h-4 mr-1.5" />
                            Failed / SLA
                          </div>
                        )}
                        {entry.status === 'IN_TRANSIT' && (
                          <div className="flex items-center text-blue-600 font-bold text-xs uppercase tracking-wider font-mono">
                            <Truck className="w-4 h-4 mr-1.5" />
                            In Transit
                          </div>
                        )}
                     </div>
                     {entry.resolvedAt && (
                       <div className="text-[10px] font-mono text-gray-400">
                         {format(entry.resolvedAt, 'HH:mm:ss')} Z
                       </div>
                     )}
                   </div>
                   
                   {entry.fixedBy === 'AI' && <div className="absolute top-0 right-0 w-2 h-full bg-purple-500" />}
                   {entry.fixedBy === 'HUMAN' && <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500" />}
                </div>
              </div>
           )})}
           <div className="h-4" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ListIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  )
}
