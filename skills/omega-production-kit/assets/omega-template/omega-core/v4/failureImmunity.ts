import { pickBackup } from "./globalRouter";
import type { CloudRegionSignal, GlobalPlacementDecision, WorkloadDemand } from "./types";

export interface RegionFailure {
  regionId: string;
  status: "down" | "degraded";
  tasks: WorkloadDemand[];
}

export function failover(region: RegionFailure, regions: CloudRegionSignal[]): GlobalPlacementDecision[] {
  if (region.status !== "down") {
    return [];
  }
  return region.tasks.map((task) => pickBackup(region.regionId, task, regions));
}
