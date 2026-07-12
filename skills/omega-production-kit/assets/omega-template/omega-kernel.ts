import { executor } from "./core/executor/executor";
import { brain } from "./core/brain/brain";
import { bus } from "./event-bus/bus";
import { dagEngine } from "./core/dag/dag";
import { memory } from "./core/memory/memory";
import { monitor } from "./core/monitor/monitor";
import { router } from "./core/router/router";
import { createTaskRequest } from "./omega-core/bus/eventBus";

const maxEvents = Number.parseInt(process.env.OMEGA_SYSTEM_MAX_EVENTS ?? "0", 10);

export async function runOmegaSystem(): Promise<void> {
  if (bus.size() === 0) {
    await bus.publish(createTaskRequest(process.env.OMEGA_SYSTEM_DEMO_INTENT ?? "automate onboarding"));
  }

  let handled = 0;
  while (maxEvents === 0 || handled < maxEvents) {
    const event = await bus.consume();
    if (!event) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      continue;
    }

    const intent = brain.parse(event);
    const graph = dagEngine.build(intent);
    const scheduled = dagEngine.schedule(graph);
    const plan = router.optimize(scheduled);
    const result = await executor.run(plan);

    await memory.write({ event, intent, graph, plan, result });
    brain.learn(event, result);
    monitor.trace(event, result);

    console.log("OMEGA_SYSTEM_EVENT_COMPLETE", JSON.stringify({ trace_id: event.trace_id, result }));
    handled += 1;
  }
}

if (require.main === module) {
  runOmegaSystem().catch((error: unknown) => {
    console.error("Omega system stopped", error);
    process.exitCode = 1;
  });
}
