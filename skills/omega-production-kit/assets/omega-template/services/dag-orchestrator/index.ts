import type { ExecutionPlan, OmegaDag, OmegaTask } from "../../packages/event-schemas/src";

export const dagOrchestrator = {
  build(task: OmegaTask): OmegaDag {
    const needsMemory = !task.intent.toLowerCase().includes("stateless");
    const nodes = needsMemory
      ? ["reasoning", "memory", "automation"]
      : ["reasoning", "automation"];

    return {
      nodes,
      edges: nodes.slice(1).map((node, index) => [nodes[index], node] as [string, string])
    };
  },

  async schedule(dag: OmegaDag): Promise<ExecutionPlan> {
    return { executionOrder: dag.nodes };
  }
};
