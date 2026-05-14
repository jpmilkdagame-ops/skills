export type CloudProvider = "aws" | "gcp" | "azure" | "edge";

export interface CloudRegionSignal {
  id: string;
  cloud: CloudProvider;
  region: string;
  costIndex: number;
  latencyMs: number;
  availability: number;
  gpuAvailable: number;
  carbonIntensity?: number;
}

export interface WorkloadDemand {
  id: string;
  service: string;
  currentRegion?: string;
  requiredGpu?: boolean;
  latencyBudgetMs: number;
  priority: number;
  replicas: number;
}

export interface GlobalPlacementScore {
  signal: CloudRegionSignal;
  score: number;
  reasons: string[];
}

export interface GlobalPlacementDecision {
  workloadId: string;
  target: CloudRegionSignal;
  score: number;
  reasons: string[];
  shouldMigrate: boolean;
}

export interface ServiceSpec {
  name: string;
  image: string;
  scale: number;
  port: number;
  env?: Record<string, string>;
}

export interface InfraBundle {
  terraform: string;
  k8s: string;
}
