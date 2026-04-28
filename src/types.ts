export type Tier = "NOMINAL" | "AT_RISK" | "HIGH_RISK";

export interface Shipment {
  id: string;
  name: string;
  type: string;
  origin: string;
  destination: string;
  carrier: string;
  tier: Tier;
  drs: number; // overall risk
  value: number; // in thousands
  daysLeft: number;
  transitInfo: string;
  extraCost?: number;
  isResent?: boolean;
  aiNeedsElevation?: boolean;
  
  factors: {
    weather: number;
    carrierDelay: number;
    routeCongestion: number;
    deadlinePressure: number;
    portCongestion: number;
  };
  
  routes: Array<{
    name: string;
    etaDelta: string;
    costDelta: string;
    risk: Tier;
    isActive: boolean;
  }>;
}

export interface Alert {
  id: string;
  shipmentId: string;
  timestamp: Date;
  oldTier: Tier;
  newTier: Tier;
  type?: 'TIER_CHANGE' | 'AUTO_FIX' | 'HUMAN_FIX' | 'DELIVERED' | 'RESENT' | 'FAILED';
  message?: string;
}

export interface HistoryEntry {
  id: string;
  name: string;
  createdAt: Date;
  resolvedAt?: Date;
  status: 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';
  fixedBy: 'NONE' | 'HUMAN' | 'AI';
  maxTier: Tier;
  value: number;
}

export interface Escalation {
  id: string;
  shipmentId: string;
  timestamp: Date;
  status: 'PENDING' | 'REVIEWED' | 'FAILED';
  value: number; // to track lost value
}
