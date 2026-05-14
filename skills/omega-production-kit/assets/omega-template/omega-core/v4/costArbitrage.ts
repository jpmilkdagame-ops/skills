import { routeGlobally } from "./globalRouter";
import { getAllCloudRegions } from "./signals";
import type { GlobalPlacementDecision, WorkloadDemand } from "./types";

const migrations: GlobalPlacementDecision[] = [];

export async function rebalance(workload: WorkloadDemand): Promise<GlobalPlacementDecision> {
  const regions = await getAllCloudRegions();
  const decision = routeGlobally(workload, regions);

  if (decision.shouldMigrate) {
    migrations.push(decision);
  }

  return decision;
}

export async function rebalanceAllWorkloads(workloads: WorkloadDemand[]): Promise<GlobalPlacementDecision[]> {
  return Promise.all(workloads.map((workload) => rebalance(workload)));
}

export function migrationLog(): readonly GlobalPlacementDecision[] {
  return migrations;
}
