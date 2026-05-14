import type { CloudRegionSignal, GlobalPlacementDecision, GlobalPlacementScore, WorkloadDemand } from "./types";

const WEIGHTS = {
  cost: 0.35,
  latency: 0.35,
  availability: 0.2,
  gpu: 0.08,
  carbon: 0.02
};

function normalizeLatency(latencyMs: number, latencyBudgetMs: number): number {
  return Math.min(latencyMs / Math.max(latencyBudgetMs, 1), 4);
}

function scoreRegion(workload: WorkloadDemand, signal: CloudRegionSignal): GlobalPlacementScore {
  const cost = signal.costIndex;
  const latency = normalizeLatency(signal.latencyMs, workload.latencyBudgetMs);
  const availabilityPenalty = 1 - signal.availability;
  const gpuPenalty = workload.requiredGpu && signal.gpuAvailable <= 0 ? 10 : 0;
  const carbonPenalty = signal.carbonIntensity ? signal.carbonIntensity / 1000 : 0;
  const score =
    cost * WEIGHTS.cost +
    latency * WEIGHTS.latency +
    availabilityPenalty * WEIGHTS.availability +
    gpuPenalty * WEIGHTS.gpu +
    carbonPenalty * WEIGHTS.carbon;

  const reasons = [
    `cost=${cost.toFixed(3)}`,
    `latency=${signal.latencyMs}ms`,
    `availability=${signal.availability.toFixed(3)}`
  ];
  if (workload.requiredGpu) reasons.push(`gpu=${signal.gpuAvailable}`);
  if (signal.carbonIntensity !== undefined) reasons.push(`carbon=${signal.carbonIntensity}`);

  return { signal, score, reasons };
}

export function routeGlobally(workload: WorkloadDemand, regions: CloudRegionSignal[]): GlobalPlacementDecision {
  if (regions.length === 0) {
    throw new Error("routeGlobally requires at least one region signal");
  }

  const ranked = regions
    .map((signal) => scoreRegion(workload, signal))
    .sort((a, b) => a.score - b.score);
  const best = ranked[0];

  return {
    workloadId: workload.id,
    target: best.signal,
    score: best.score,
    reasons: best.reasons,
    shouldMigrate: workload.currentRegion !== undefined && workload.currentRegion !== best.signal.id
  };
}

export function pickBackup(failedRegionId: string, workload: WorkloadDemand, regions: CloudRegionSignal[]): GlobalPlacementDecision {
  return routeGlobally(
    workload,
    regions.filter((region) => region.id !== failedRegionId && region.availability > 0.5)
  );
}
