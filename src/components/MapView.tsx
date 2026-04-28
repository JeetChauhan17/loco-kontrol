import { Shipment } from '../types';
import { motion } from 'motion/react';

export function MapView({ shipments, activeId }: { shipments: Shipment[], activeId: string | null }) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#fafafa] flex items-center justify-center opacity-40">
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(to right, #ececec 1px, transparent 1px), linear-gradient(to bottom, #ececec 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      
      <svg viewBox="0 0 1000 500" className="w-[120%] h-auto max-w-[1200px] stroke-[#d1d5db] stroke-1 fill-[#f3f4f6]">
        <path d="M 100 100 Q 150 50 200 100 T 300 200 Q 350 250 400 150 T 500 150 Q 550 100 600 50" />
        <path d="M 600 50 Q 650 100 700 80 T 800 200 Q 850 250 900 150 T 950 150" />
        <path d="M 300 200 Q 250 300 350 400 T 450 300 Q 500 200 600 300" />
      </svg>

      <div className="absolute inset-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] aspect-[2/1]">
        {shipments.map((s) => {
          const x = 20 + ((s.id.charCodeAt(5) * 17) % 60);
          const y = 30 + ((s.id.charCodeAt(6) * 23) % 40);
          const isActive = s.id === activeId;
          const color = s.tier === 'HIGH_RISK' ? 'bg-red-500' : s.tier === 'AT_RISK' ? 'bg-amber-500' : 'bg-emerald-500';
          
          return (
            <motion.div 
              key={s.id} 
              className="absolute"
              style={{ left: `${x}%`, top: `${y}%` }}
              animate={{ 
                scale: isActive ? 1.5 : 1, 
                opacity: isActive ? 1 : 0.6,
                zIndex: isActive ? 10 : 1
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className={`w-3 h-3 rounded-full ${color} shadow-lg ring-2 ring-white`} />
              {isActive && (
                 <div className="absolute -inset-2 rounded-full border border-current animate-ping opacity-75 text-indigo-500" />
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  );
}

