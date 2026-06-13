export interface RegisteredUser {
  fullName: string;
  email: string;
  role: string;
  enterpriseName: string;
  source: string;
  country: string;
  registeredAt?: string;
}

export type BuyerCategory = 'hotels' | 'lodges' | 'health shops' | 'craft buyers' | 'distributors';
export type BuyerStatus = 'prospect' | 'contacted' | 'meeting_set' | 'sample_sent' | 'active_buyer' | 'inactive';

export interface Buyer {
  id: string;
  country: string;
  buyerName: string;
  buyerType: BuyerCategory;
  location: string;
  contactPerson: string;
  phone: string;
  email: string;
  productInterest: string;
  notes: string;
  status: BuyerStatus;
  createdAt: string;
}

export type WaterSourceType = 'borehole' | 'rainwater catchment' | 'river pump' | 'municipal supply' | 'deep well';

export interface WaterCalculationInput {
  country: string;
  region: string;
  waterSourceType: WaterSourceType;
  dailyLitresAvailable: number;
  plantCount: number;
  nurseryPhaseDuration: number; // in months
  establishmentPhaseDuration: number; // in months
  notes: string;
}

export interface WaterCalculationResult {
  dailyLitresPerPlant: number;
  totalDailyWaterNeed: number;
  nurseryTotalLitres: number;
  establishmentTotalLitres: number;
  isFeasible: boolean;
  riskRating: 'low' | 'moderate' | 'high' | 'critical';
  verdict: string;
}

export type ProvenanceStatus = 'pending' | 'verified' | 'rejected';

export interface ProvenanceLog {
  id: string;
  country: string;
  supplier: string;
  supplierCountry: string;
  motherPlantSource: string;
  motherPlantLocation: string;
  variety: string;
  quantity: number;
  importDate: string;
  phytosanitaryStatus: boolean;
  importPermitStatus: boolean;
  notes: string;
  status: ProvenanceStatus;
  batchSerialNumber: string;
}

export interface PestDiagnosis {
  id: string;
  name: string;
  symptom: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  immediateAction: string;
  followUpAction: string;
  timeframe: string;
  isolateOrRemove: 'isolate' | 'remove' | 'none';
  checklist: string[];
}

export interface CountryProfile {
  id: string;
  name: string;
  flag: string;
  currency: string;
  overview: string;
  localRules: {
    labeling: string;
    importRules: string;
    cooperativeAct: string;
    originProtection: string;
  };
  buyerCategories: string[];
  waterPlanningAssumptions: {
    nurseryDailyLitresPerPlant: number;
    establishmentDailyLitresPerPlant: number;
    evaporationRisk: 'low' | 'medium' | 'high';
  };
  provenanceLogContext: string;
}
