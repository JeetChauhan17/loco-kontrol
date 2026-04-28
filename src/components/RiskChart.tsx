import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Shipment, Tier } from '../types';

export function RiskChart({ shipments, onFilter }: { shipments: Shipment[], onFilter?: (tier: Tier) => void }) {
  let data = [
    { name: 'NOMINAL', value: shipments.filter(s => s.tier === 'NOMINAL').length, color: '#f3f4f6', tier: 'NOMINAL' as Tier },
    { name: 'AT_RISK', value: shipments.filter(s => s.tier === 'AT_RISK').length, color: '#f59e0b', tier: 'AT_RISK' as Tier },
    { name: 'HIGH_RISK', value: shipments.filter(s => s.tier === 'HIGH_RISK').length, color: '#ef4444', tier: 'HIGH_RISK' as Tier },
  ];

  if (data.every(d => d.value === 0)) {
     data = [{ name: 'NOMINAL', value: 1, color: '#f3f4f6', tier: 'NOMINAL' as Tier }];
  } else {
     data = data.filter(d => d.value > 0);
  }

  return (
    <div className="w-16 h-16 shrink-0 cursor-pointer">
      <ResponsiveContainer width={64} height={64}>
        <PieChart width={64} height={64}>
          <Pie
            data={data}
            cx={32}
            cy={32}
            innerRadius={16}
            outerRadius={30}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
            onClick={(entry) => {
               if (onFilter && entry && entry.payload && entry.payload.tier) {
                  onFilter(entry.payload.tier);
               }
            }}
          >
            {data.map((entry, index) => (
              <Cell 
                 key={`cell-${index}`} 
                 fill={entry.color} 
                 className="hover:opacity-80 transition-opacity outline-none" 
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
