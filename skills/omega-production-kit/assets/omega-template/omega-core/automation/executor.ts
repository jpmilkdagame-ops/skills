import type { ExecutionPlan } from "../router/modelRouter";

export interface StepResult {
  step: string;
  target: string;
  status: "done";
  completedAt: string;
}

export interface ExecutionResult {
  status: "complete";
  strategy: string;
  steps: StepResult[];
}

export const executor = {
  async run(plan: ExecutionPlan): Promise<ExecutionResult> {
    const steps: StepResult[] = [];

    for (const step of plan.steps) {
      steps.push({
        step: step.action,
        target: step.target,
        status: "done",
        completedAt: new Date().toISOString()
      });
    }

    return { status: "complete", strategy: plan.strategy, steps };
  }
};
