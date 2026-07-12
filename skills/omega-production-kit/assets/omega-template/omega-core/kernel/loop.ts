import { executor } from "../automation/executor";
import { brainEngine } from "../brain/brainEngine";
import { createTaskRequest, eventBus } from "../bus/eventBus";
import { dagEngine } from "../dag/dagEngine";
import { memory } from "../memory/memory";
import { monitor } from "../monitor/monitor";
import { router } from "../router/modelRouter";

const maxEvents = Number.parseInt(process.env.OMEGA_CORE_MAX_EVENTS ?? "0", 10);
const seedDemo = process.env.OMEGA_CORE_SEED_DEMO !== "false";

export async function runOmegaCore(): Promise<void> {
  if (seedDemo && eventBus.size() === 0) {
    await eventBus.publish(createTaskRequest(process.env.OMEGA_CORE_DEMO_INTENT ?? "demo automation"));
  }

  let handled = 0;

  while (maxEvents === 0 || handled < maxEvents) {
    const event = await eventBus.consume();
    if (!event) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      continue;
    }

    const intent = brainEngine.parse(event);
    const dag = dagEngine.build(intent);
    const scheduled = dagEngine.schedule(dag);
    const plan = router.optimize(scheduled);
    const result = await executor.run(plan);
    const stored = await memory.store({ event, intent, dag, plan, result });
    const learning = brainEngine.learn(event, result);
    const trace = monitor.trace(event, result);

    console.log(
      "OMEGA_CORE_EVENT_COMPLETE",
      JSON.stringify({ trace_id: event.trace_id, result, storedAt: stored.storedAt, learning, trace })
    );

    handled += 1;
  }
}

if (require.main === module) {
  runOmegaCore().catch((error: unknown) => {
    console.error("Omega core stopped", error);
    process.exitCode = 1;
  });
}
