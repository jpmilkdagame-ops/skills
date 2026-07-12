export interface RouteableTask {
  complexity: number;
  latencyBudgetMs: number;
}

export function route(task: RouteableTask): "cloud-llm" | "edge-node" | "core" {
  if (task.complexity > 8) {
    return "cloud-llm";
  }

  if (task.latencyBudgetMs < 50) {
    return "edge-node";
  }

  return "core";
}
