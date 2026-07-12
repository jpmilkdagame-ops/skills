import type { IntentPlan } from "../brain/brainEngine";

export interface DagNode {
  id: string;
  action: string;
  dependsOn: string[];
}

export interface Dag {
  traceId: string;
  nodes: DagNode[];
}

export interface ScheduledStep {
  id: string;
  action: string;
}

export const dagEngine = {
  build(intent: IntentPlan): Dag {
    return {
      traceId: intent.traceId,
      nodes: intent.steps.map((step, index) => ({
        id: `${index + 1}-${step}`,
        action: step,
        dependsOn: index === 0 ? [] : [`${index}-${intent.steps[index - 1]}`]
      }))
    };
  },

  schedule(dag: Dag): ScheduledStep[] {
    return dag.nodes.map((node) => ({ id: node.id, action: node.action }));
  },

  rewrite(dag: Dag, failedAction: string): Dag {
    return {
      ...dag,
      nodes: dag.nodes.map((node) =>
        node.action === failedAction ? { ...node, action: `${node.action}_with_fallback` } : node
      )
    };
  }
};
