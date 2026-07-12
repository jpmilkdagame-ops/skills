import type { ScheduledStep } from "../dag/dagEngine";

export type ExecutionTarget = "edge-node" | "local-node" | "cloud-llm";

export interface RoutedStep extends ScheduledStep {
  target: ExecutionTarget;
  reason: string;
}

export interface ExecutionPlan {
  steps: RoutedStep[];
  strategy: "low-latency" | "balanced" | "deep-reasoning";
}

function targetFor(action: string): ExecutionTarget {
  if (action.includes("retrieve_memory")) {
    return "local-node";
  }
  if (action.includes("analyze") || action.includes("decide")) {
    return "cloud-llm";
  }
  return "edge-node";
}

export const router = {
  optimize(steps: ScheduledStep[]): ExecutionPlan {
    const routed = steps.map((step) => {
      const target = targetFor(step.action);
      return {
        ...step,
        target,
        reason: `route ${step.action} to ${target}`
      };
    });

    const strategy = routed.some((step) => step.target === "cloud-llm") ? "deep-reasoning" : "balanced";
    return { steps: routed, strategy };
  },

  rebalance(plan: ExecutionPlan): ExecutionPlan {
    return {
      ...plan,
      strategy: "balanced",
      steps: plan.steps.map((step) => ({ ...step, target: step.target === "cloud-llm" ? "local-node" : step.target }))
    };
  }
};
