import { routeGlobally } from "./globalRouter";
import { getAllCloudRegions } from "./signals";
import type { GlobalPlacementDecision, ServiceSpec, WorkloadDemand } from "./types";

export interface DeploymentResult {
  service: string;
  provider: string;
  region: string;
  action: string;
  decision: GlobalPlacementDecision;
}

function workloadFromService(service: ServiceSpec): WorkloadDemand {
  return {
    id: `${service.name}-deploy`,
    service: service.name,
    latencyBudgetMs: 80,
    priority: 5,
    replicas: service.scale
  };
}

export async function deployAnywhere(service: ServiceSpec): Promise<DeploymentResult> {
  const decision = routeGlobally(workloadFromService(service), await getAllCloudRegions());
  const action = {
    aws: "deployToEKS",
    gcp: "deployToGKE",
    azure: "deployToAKS",
    edge: "deployToEdgeK3s"
  }[decision.target.cloud];

  return {
    service: service.name,
    provider: decision.target.cloud,
    region: decision.target.region,
    action,
    decision
  };
}
