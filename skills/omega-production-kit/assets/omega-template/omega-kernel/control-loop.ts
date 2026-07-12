import { automationEngine } from "../services/automation-engine";
import { brainEngine } from "../services/brain-engine";
import { dagOrchestrator } from "../services/dag-orchestrator";
import { eventBus } from "../services/event-bus/client";
import { memoryFabric } from "../services/memory-fabric";
import { observability } from "../services/observability";

const maxEvents = Number.parseInt(process.env.OMEGA_KERNEL_MAX_EVENTS ?? "0", 10);

export async function loop(): Promise<void> {
  let handled = 0;

  while (maxEvents === 0 || handled < maxEvents) {
    const event = await eventBus.consume();
    if (!event) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      continue;
    }

    const task = brainEngine.parse(event);
    const dag = dagOrchestrator.build(task);
    const executionPlan = await dagOrchestrator.schedule(dag);
    const result = await automationEngine.execute(executionPlan);

    await memoryFabric.store({ event, task, dag, executionPlan, result });
    observability.trace(event, result);
    handled += 1;
  }
}

if (require.main === module) {
  loop().catch((error: unknown) => {
    console.error("Omega kernel stopped", error);
    process.exitCode = 1;
  });
}
