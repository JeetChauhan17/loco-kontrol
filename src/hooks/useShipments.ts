import { useState, useEffect, useCallback } from 'react';
import { Shipment, Alert, Tier, Escalation, HistoryEntry } from '../types';

const INITIAL_SHIPMENTS: Shipment[] = [
  { id: 'SHP-022', name: 'Bread flour — distribution', type: 'BULK', origin: 'Cairo', destination: 'Aswan', carrier: 'FedEx Air', tier: 'AT_RISK', drs: 0.40, value: 80, daysLeft: 1.0, transitInfo: '2d', factors: { weather: 0.41, carrierDelay: 0.40, routeCongestion: 0.34, deadlinePressure: 0.52, portCongestion: 0.49 }, routes: [{name:'North America Road', etaDelta: '5d', costDelta: '1.00x', risk: 'NOMINAL', isActive: true}, {name:'Western Bypass', etaDelta: '6d', costDelta: '1.20x', risk: 'NOMINAL', isActive: false}] },
  { id: 'SHP-020', name: 'Espresso retail SKUs', type: 'STANDARD', origin: 'Paris', destination: 'Lyon', carrier: 'DHL', tier: 'AT_RISK', drs: 0.42, value: 45, daysLeft: 2.1, transitInfo: '3d', factors: { weather: 0.21, carrierDelay: 0.60, routeCongestion: 0.24, deadlinePressure: 0.42, portCongestion: 0.19 }, routes: [{name:'EU Rail', etaDelta: '3d', costDelta: '1.10x', risk: 'NOMINAL', isActive: true}, {name:'Truck Transit', etaDelta: '4d', costDelta: '0.90x', risk: 'NOMINAL', isActive: false}] },
  { id: 'SHP-014', name: 'Vaccine — regional depot', type: 'COLD CHAIN', origin: 'Mumbai', destination: 'Delhi', carrier: 'Maersk', tier: 'NOMINAL', drs: 0.38, value: 1200, daysLeft: 4.0, transitInfo: '5d', factors: { weather: 0.11, carrierDelay: 0.10, routeCongestion: 0.44, deadlinePressure: 0.32, portCongestion: 0.09 }, routes: [{name:'Air Freight Express', etaDelta: '1d', costDelta: '4.00x', risk: 'NOMINAL', isActive: true}, {name:'Truck Transit', etaDelta: '5d', costDelta: '0.80x', risk: 'AT_RISK', isActive: false}, {name:'Priority Courier', etaDelta: '2d', costDelta: '2.50x', risk: 'NOMINAL', isActive: false}] },
  { id: 'SHP-023', name: 'Dealer EVs — west coast', type: 'HIGH VALUE', origin: 'Detroit', destination: 'Seattle', carrier: 'Union Pacific', tier: 'NOMINAL', drs: 0.37, value: 3400, daysLeft: 7.0, transitInfo: '8d', factors: { weather: 0.51, carrierDelay: 0.20, routeCongestion: 0.14, deadlinePressure: 0.22, portCongestion: 0.00 }, routes: [{name:'West Rail', etaDelta: '7d', costDelta: '1.00x', risk: 'NOMINAL', isActive: true}, {name:'South Rail', etaDelta: '8d', costDelta: '1.10x', risk: 'NOMINAL', isActive: false}] },
  { id: 'SHP-025', name: 'Camera retail — UK chain', type: 'STANDARD', origin: 'London', destination: 'Manchester', carrier: 'Royal Mail', tier: 'NOMINAL', drs: 0.36, value: 210, daysLeft: 1.5, transitInfo: '1d', factors: { weather: 0.11, carrierDelay: 0.20, routeCongestion: 0.54, deadlinePressure: 0.62, portCongestion: 0.09 }, routes: [{name:'M1 Highway', etaDelta: '1d', costDelta: '1.00x', risk: 'NOMINAL', isActive: true}, {name:'Air Freight Dash', etaDelta: '4h', costDelta: '5.00x', risk: 'NOMINAL', isActive: false}] },
  { id: 'SHP-013', name: 'Seafood — distribution pallets', type: 'COLD CHAIN', origin: 'Los Angeles', destination: 'San Francisco', carrier: 'CoolTrans', tier: 'NOMINAL', drs: 0.35, value: 95, daysLeft: 0.5, transitInfo: '1d', factors: { weather: 0.01, carrierDelay: 0.05, routeCongestion: 0.84, deadlinePressure: 0.92, portCongestion: 0.09 }, routes: [{name:'I-5 North', etaDelta: '12h', costDelta: '1.00x', risk: 'NOMINAL', isActive: true}, {name:'Pacific Coast Hwy', etaDelta: '16h', costDelta: '1.10x', risk: 'NOMINAL', isActive: false}] },
  { id: 'SHP-018', name: 'Finished vaccines — EU dispatch', type: 'COLD CHAIN', origin: 'Milan', destination: 'Madrid', carrier: 'FedEx Air', tier: 'NOMINAL', drs: 0.35, value: 850, daysLeft: 2.0, transitInfo: '2d', factors: { weather: 0.11, carrierDelay: 0.10, routeCongestion: 0.14, deadlinePressure: 0.12, portCongestion: 0.69 }, routes: [{name:'Air Freight', etaDelta: '2d', costDelta: '1.00x', risk: 'NOMINAL', isActive: true}] },
  { id: 'SHP-024', name: 'Pharmacy stock — Iberia', type: 'COLD CHAIN', origin: 'Madrid', destination: 'Lisbon', carrier: 'DHL', tier: 'NOMINAL', drs: 0.32, value: 140, daysLeft: 3.0, transitInfo: '4d', factors: { weather: 0.01, carrierDelay: 0.10, routeCongestion: 0.24, deadlinePressure: 0.12, portCongestion: 0.09 }, routes: [{name:'Highway A5', etaDelta: '1d', costDelta: '1.00x', risk: 'NOMINAL', isActive: true}, {name:'Express Rail', etaDelta: '1d', costDelta: '1.20x', risk: 'NOMINAL', isActive: false}] },
  { id: 'SHP-017', name: 'EV powertrain — final assembly', type: 'HIGH VALUE', origin: 'Reno', destination: 'Detroit', carrier: 'Union Pacific', tier: 'NOMINAL', drs: 0.29, value: 1100, daysLeft: 6.0, transitInfo: '7d', factors: { weather: 0.21, carrierDelay: 0.20, routeCongestion: 0.14, deadlinePressure: 0.12, portCongestion: 0.09 }, routes: [{name:'East Rail', etaDelta: '7d', costDelta: '1.00x', risk: 'NOMINAL', isActive: true}, {name:'Route 80 Transit', etaDelta: '8d', costDelta: '1.40x', risk: 'NOMINAL', isActive: false}] },
  { id: 'SHP-009', name: 'Battery pack assemblies', type: 'HIGH VALUE', origin: 'Long Beach', destination: 'Reno', carrier: 'TruckNet', tier: 'NOMINAL', drs: 0.28, value: 2400, daysLeft: 2.0, transitInfo: '3d', factors: { weather: 0.01, carrierDelay: 0.00, routeCongestion: 0.44, deadlinePressure: 0.12, portCongestion: 0.39 }, routes: [{name:'Highway 395', etaDelta: '1d', costDelta: '1.00x', risk: 'NOMINAL', isActive: true}] },
];

export function useShipments() {
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [valueLost, setValueLost] = useState<number>(0);
  const [utcTime, setUtcTime] = useState<Date>(new Date());
  const [isChaosMode, setIsChaosMode] = useState(false);

  const [history, setHistory] = useState<Record<string, HistoryEntry>>(() => {
    const init: Record<string, HistoryEntry> = {};
    INITIAL_SHIPMENTS.forEach(s => {
      init[s.id] = { id: s.id, name: s.name, createdAt: new Date(), status: 'IN_TRANSIT', fixedBy: 'NONE', maxTier: s.tier, value: s.value };
    });
    return init;
  });

  const escalateShipment = useCallback((shipmentId: string) => {
    setShipments(prev => prev.map(s => s.id === shipmentId ? { ...s, aiNeedsElevation: false, tier: 'HIGH_RISK', drs: Math.max(s.drs, 0.85) } : s));
    setEscalations(prev => {
      if (prev.some(e => e.shipmentId === shipmentId && e.status === 'PENDING')) return prev;
      return [{
        id: Math.random().toString(36).substr(2, 9),
        shipmentId,
        timestamp: new Date(),
        status: 'PENDING',
        value: shipments.find(s => s.id === shipmentId)?.value || 0
      }, ...prev];
    });
  }, [shipments]);

  const resolveEscalation = useCallback((id: string) => {
    setEscalations(prev => prev.map(e => e.id === id && e.status === 'PENDING' ? { ...e, status: 'REVIEWED' } : e));
  }, []);

  const resolveIssue = useCallback((shipmentId: string, actionType: 'REROUTE' | 'CARRIER', routeIndex?: number) => {
    let extraCostIncurred = 0;
    
    setShipments(prev => {
      const s = prev.find(shipment => shipment.id === shipmentId);
      if (!s) return prev;
      
      let msg = '';
      if (actionType === 'REROUTE') {
         msg = `Human Operator rerouted shipment. Risk neutralized.`;
      } else if (actionType === 'CARRIER') {
         msg = `Human Operator switched carrier. Risk neutralized.`;
      }

      setAlerts(alertsList => [{
        id: Math.random().toString(36).substr(2,9),
        shipmentId,
        timestamp: new Date(),
        oldTier: s.tier,
        newTier: 'NOMINAL',
        message: msg,
        type: 'HUMAN_FIX'
      }, ...alertsList].slice(0, 50));
      
      return prev.map(ship => {
        if (ship.id !== shipmentId) return ship;
        
        let extraParams = {};
        if (actionType === 'REROUTE') {
            const indexToUse = routeIndex ?? ship.routes.findIndex(r => !r.isActive) ?? 1;
            const newRoutes = ship.routes.map((r, i) => ({ ...r, isActive: i === indexToUse }));
            const cost = 0;
            extraCostIncurred = cost;
            extraParams = { routes: newRoutes, extraCost: (ship.extraCost || 0) + cost };
        } else if (actionType === 'CARRIER') {
            const cost = Math.max(1, Math.round(ship.value * 0.01)); // Small extra cost
            extraCostIncurred = cost;
            extraParams = { carrier: 'Priority Vendor', extraCost: (ship.extraCost || 0) + cost };
        }

        return { 
          ...ship, 
          ...extraParams,
          drs: 0.15, 
          tier: 'NOMINAL'
        };
      });
    });

    setHistory(prev => {
      const h = { ...prev };
      if (h[shipmentId]) {
        h[shipmentId] = { ...h[shipmentId], fixedBy: 'HUMAN', resolvedAt: new Date() };
      }
      return h;
    });

    if (actionType === 'CARRIER') {
       setValueLost(v => v + extraCostIncurred);
    }
    
    setEscalations(prev => prev.map(e => e.shipmentId === shipmentId && e.status === 'PENDING' ? { ...e, status: 'REVIEWED' } : e));
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      setUtcTime(new Date());
      
      // Handle Escalation Timeouts
      let newFailedShipments: string[] = [];
      setEscalations(prev => {
        let changed = false;
        let newValueLost = 0;
        const now = new Date();
        const next = prev.map(e => {
           if (e.status === 'PENDING' && now.getTime() - e.timestamp.getTime() > 45000) { // 45s wait time
              changed = true;
              newValueLost += e.value;
              newFailedShipments.push(e.shipmentId);
              return { ...e, status: 'FAILED' as const };
           }
           return e;
        });
        if (changed) {
           setValueLost(v => v + newValueLost);
           
           setHistory(prevH => {
               const newH = { ...prevH };
               newFailedShipments.forEach(shipmentId => {
                   if (newH[shipmentId]) {
                       newH[shipmentId] = { ...newH[shipmentId], status: 'FAILED', resolvedAt: new Date() };
                   }
               });
               return newH;
           });
           
           setAlerts(prevA => {
               const newAlerts = newFailedShipments.map(shipmentId => ({
                   id: Math.random().toString(36).substr(2, 9),
                   shipmentId,
                   timestamp: new Date(),
                   oldTier: 'HIGH_RISK' as Tier,
                   newTier: 'HIGH_RISK' as Tier,
                   type: 'FAILED' as const,
                   message: 'SLA Breach: Human reviewer failed to act in time.'
               }));
               return [...newAlerts, ...prevA].slice(0, 50);
           });

           return next;
        }
        return prev;
      });

      setShipments(prev => {
        const newAlerts: Alert[] = [];
        const newEscalations: string[] = [];
        
        let historyUpdates: Record<string, Partial<HistoryEntry>> = {};

        // 1. Process failed shipments (remove old, replace with new one)
        let processedShipments: Shipment[] = [];
        for (const s of prev) {
           if (newFailedShipments.includes(s.id)) {
              historyUpdates[s.id] = { status: 'FAILED', resolvedAt: new Date() };
              // It failed! We repopulate as a new shipment
              newAlerts.push({
                 id: Math.random().toString(36).substr(2, 9),
                 shipmentId: s.id,
                 timestamp: new Date(),
                 oldTier: s.tier,
                 newTier: 'HIGH_RISK',
                 type: 'FAILED',
                 message: 'SLA Breach: Shipment lost/spoiled. Processing replacement.'
              });
              
              const replacementId = `${s.id}-R${Math.floor(Math.random() * 1000)}`;
              newAlerts.push({
                 id: Math.random().toString(36).substr(2, 9),
                 shipmentId: replacementId,
                 timestamp: new Date(),
                 oldTier: 'NOMINAL',
                 newTier: 'NOMINAL',
                 type: 'RESENT',
                 message: 'Replacement expedited into network.'
              });

              processedShipments.push({
                 ...s,
                 id: replacementId,
                 isResent: true,
                 extraCost: (s.extraCost || 0) + Math.max(1, Math.round(s.value * 0.05)),
                 daysLeft: s.daysLeft + 2, // new transit time
                 drs: 0.1,
                 tier: 'NOMINAL'
              });
              historyUpdates[replacementId] = { id: replacementId, name: s.name, createdAt: new Date(), status: 'IN_TRANSIT', fixedBy: 'NONE', maxTier: 'NOMINAL', value: s.value };
           } else {
              processedShipments.push(s);
           }
        }

        // 2. Decrement daysLeft and do delivery check
        let activeShipments: Shipment[] = [];
        for (const s of processedShipments) {
           const newDaysLeft = s.daysLeft - 0.05;
           if (newDaysLeft <= 0) {
              historyUpdates[s.id] = { status: 'DELIVERED', resolvedAt: new Date() };
              newAlerts.push({
                 id: Math.random().toString(36).substr(2, 9),
                 shipmentId: s.id,
                 timestamp: new Date(),
                 oldTier: s.tier,
                 newTier: 'NOMINAL',
                 type: 'DELIVERED',
                 message: 'Shipment delivered successfully.'
              });
           } else {
              activeShipments.push({ ...s, daysLeft: newDaysLeft });
           }
        }

        // Replenish depleted shipments
        while (activeShipments.length < INITIAL_SHIPMENTS.length) {
            const template = INITIAL_SHIPMENTS[Math.floor(Math.random() * INITIAL_SHIPMENTS.length)];
            const newId = 'SHP-' + Math.floor(1000 + Math.random() * 8999).toString() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
            activeShipments.push({
                ...template,
                id: newId,
                daysLeft: template.daysLeft * (0.8 + Math.random() * 0.4),
                drs: 0.15 + (Math.random() * 0.1),
                tier: 'NOMINAL',
                isResent: false,
                extraCost: 0
            });
            historyUpdates[newId] = { id: newId, name: template.name, createdAt: new Date(), status: 'IN_TRANSIT', fixedBy: 'NONE', maxTier: 'NOMINAL', value: template.value };
        }

        // 3. Normal drift & Auto-Fix
        const next = activeShipments.map(s => {
          let currentDrs = s.drs;
          let newTier = s.tier;

          // AUTO-FIX CHANCE (only if in at_risk / high_risk range)
          if (currentDrs > 0.50 && currentDrs < 0.84) {
             if (Math.random() < 0.30) { // 30% chance to auto-fix/elevate per tick when in this window
                 const altIndex = s.routes.findIndex(r => !r.isActive);
                 const canReroute = altIndex !== -1;
                 
                 const maxFactor = Object.entries(s.factors).reduce((a, b) => a[1] > b[1] ? a : b);
                 const isSevere = maxFactor[1] > 0.7; // Defines if there's a severe blocker
                 const isAccident = maxFactor[0] === 'routeCongestion' && maxFactor[1] > 0.8; // Specific edge case 

                 if (canReroute) {
                    historyUpdates[s.id] = { ...(historyUpdates[s.id] || {}), fixedBy: 'AI' as const, resolvedAt: new Date() };
                    
                    s.routes = s.routes.map((r, i) => ({ ...r, isActive: i === altIndex }));
                    const costIncurred = 0;
                    s.extraCost = (s.extraCost || 0) + costIncurred;
                    const msg = `A.I. Autonomously rerouted to ${s.routes[altIndex].name}. Risk neutralized.`;
                    
                    newAlerts.push({
                       id: Math.random().toString(36).substr(2, 9),
                       shipmentId: s.id,
                       timestamp: new Date(),
                       oldTier: s.tier,
                       newTier: 'NOMINAL',
                       type: 'AUTO_FIX',
                       message: msg
                    });
                    currentDrs = 0.2;
                    newTier = 'NOMINAL';
                 } else if (!isSevere && !isAccident) {
                    // AI judges it's fine
                    historyUpdates[s.id] = { ...(historyUpdates[s.id] || {}), fixedBy: 'AI' as const, resolvedAt: new Date() };
                    const msg = `A.I. judged risk (${maxFactor[0]}) acceptable. Delay tolerable.`;
                    
                    newAlerts.push({
                       id: Math.random().toString(36).substr(2, 9),
                       shipmentId: s.id,
                       timestamp: new Date(),
                       oldTier: s.tier,
                       newTier: 'NOMINAL',
                       type: 'AUTO_FIX',
                       message: msg
                    });
                    currentDrs = 0.2;
                    newTier = 'NOMINAL';
                 } else if (!s.aiNeedsElevation) {
                    // Cannot reroute and it IS severe, must ask human to elevate
                    s.aiNeedsElevation = true;
                    newAlerts.push({
                       id: Math.random().toString(36).substr(2, 9),
                       shipmentId: s.id,
                       timestamp: new Date(),
                       oldTier: s.tier,
                       newTier: 'AT_RISK',
                       type: 'TIER_CHANGE',
                       message: 'A.I. unable to autonomously resolve. Human Review Elevation Required.'
                    });
                 }
             }
          }

          // Calculate drift towards nominal or spike
          const isSpike = Math.random() < (isChaosMode ? 0.3 : 0.05); // 5% chance of spike normally, 30% in chaos
          const targetDrs = isSpike ? (0.6 + Math.random() * 0.4) : (0.2 + Math.random() * 0.15); // gravity towards 0.2 ~ 0.35, or jump to 0.6+
          
          // Move towards target
          const drift = (targetDrs - currentDrs) * (isChaosMode ? 0.2 : 0.05);
          let newDrs = Math.max(0.1, Math.min(0.99, currentDrs + drift));
          
          if (newTier !== 'NOMINAL') { // if not already overriden by auto-fix
             newTier = 'NOMINAL';
             if (newDrs >= 0.7) newTier = 'HIGH_RISK';
             else if (newDrs >= 0.4) newTier = 'AT_RISK';

             if (newTier !== 'NOMINAL') {
                 historyUpdates[s.id] = { ...(historyUpdates[s.id] || {}), maxTier: newTier };
             }
          }
          
          if (newTier !== s.tier) {
            newAlerts.push({
              id: Math.random().toString(36).substr(2, 9),
              shipmentId: s.id,
              timestamp: new Date(),
              oldTier: s.tier,
              newTier: newTier,
              type: 'TIER_CHANGE'
            });
          }

          if (newDrs >= 0.85) {
             newEscalations.push(s.id);
          }
          
          return {
            ...s,
            drs: newDrs,
            tier: newTier,
            factors: {
              ...s.factors,
              weather: Math.max(0, Math.min(1, s.factors.weather + (Math.random()-0.5)*0.1)),
              routeCongestion: Math.max(0, Math.min(1, s.factors.routeCongestion + (Math.random()-0.5)*0.1))
            }
          };
        });

        if (newAlerts.length > 0) {
          setAlerts(a => [...newAlerts, ...a].slice(0, 50));
        }

        if (newEscalations.length > 0) {
           setEscalations(prevEscalations => {
              const toAdd = newEscalations.filter(id => !prevEscalations.some(e => e.shipmentId === id && e.status === 'PENDING'));
              if (toAdd.length === 0) return prevEscalations;
              
              const newItems = toAdd.map(id => ({
                id: Math.random().toString(36).substr(2, 9),
                shipmentId: id,
                timestamp: new Date(),
                status: 'PENDING' as const,
                value: next.find(s => s.id === id)?.value || 0
              }));
              return [...newItems, ...prevEscalations];
           });
        }

        if (Object.keys(historyUpdates).length > 0) {
           setHistory(prevH => {
               const newH = { ...prevH };
               for (const k in historyUpdates) {
                   if (newH[k]) newH[k] = { ...newH[k], ...historyUpdates[k] };
                   else newH[k] = historyUpdates[k] as HistoryEntry;

                   // Force maxTier to be the worst case seen
                   if (historyUpdates[k].maxTier && prevH[k]) {
                       if (prevH[k].maxTier === 'HIGH_RISK') newH[k].maxTier = 'HIGH_RISK';
                       else if (prevH[k].maxTier === 'AT_RISK' && historyUpdates[k].maxTier !== 'HIGH_RISK') newH[k].maxTier = 'AT_RISK';
                   }
               }
               return newH;
           });
        }

        return next;
      });
    }, 2000);
    
    return () => clearInterval(tick);
  }, [isChaosMode]);

  const toggleChaos = useCallback(() => setIsChaosMode(c => !c), []);
  const reset = useCallback(() => {
    setShipments(INITIAL_SHIPMENTS);
    setAlerts([]);
    setEscalations([]);
    setValueLost(0);
    setHistory(() => {
        const h: Record<string, HistoryEntry> = {};
        INITIAL_SHIPMENTS.forEach(s => {
          h[s.id] = { id: s.id, name: s.name, createdAt: new Date(), status: 'IN_TRANSIT', fixedBy: 'NONE', maxTier: s.tier, value: s.value };
        });
        return h;
    });
  }, []);

  return { shipments, alerts, history: Object.values(history) as HistoryEntry[], escalations, valueLost, escalateShipment, resolveEscalation, resolveIssue, utcTime, isChaosMode, toggleChaos, reset };
}
