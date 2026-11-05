export interface Species {
  id: number;
  commonName: string;
  scientificName: string;
  conservationStatus: string;
  habitat: string;
  diet: string;
  educationalFact: string;
}

export interface Animal {
  id: number;
  name: string;
  tagCode: string;
  speciesId: number;
  speciesName: string;
  sex: string;
  birthDate: string | null;
  weightKg: number;
  enclosure: string;
  healthStatus: string;
  notes: string | null;
  createdAt: string;
}

export interface AnimalWrite {
  name: string;
  tagCode: string;
  speciesId: number;
  sex: string;
  birthDate: string | null;
  weightKg: number;
  enclosure: string;
  healthStatus: string;
  notes: string | null;
}

export interface AnimalStats {
  total: number;
  healthy: number;
  observation: number;
  critical: number;
  pendingValidation: number;
}

export interface VetRecord {
  id: number;
  animalId: number;
  recordDate: string;
  recordType: string;
  description: string;
  temperatureC: number | null;
  heartRateBpm: number | null;
  source: string;
  anomalyScore: number | null;
  veterinarian: string;
  validatedByExpert: boolean;
}

export interface VetRecordWrite {
  recordType: string;
  description: string;
  temperatureC: number | null;
  heartRateBpm: number | null;
  source: string;
  anomalyScore: number | null;
  veterinarian: string;
}

export interface ChatResponse {
  answer: string;
  species: string | null;
  suggestions: string[];
}
