import { randomUUID } from "node:crypto";
import type { OmegaEvent } from "../../packages/event-schemas/src";

const queue: OmegaEvent[] = [];
const published: OmegaEvent[] = [];
let demoEmitted = false;

function demoEvent(): OmegaEvent<{ intent: string }> {
  const traceId = randomUUID();
  return {
    event_id: randomUUID(),
    timestamp: new Date().toISOString(),
    source_node: "demo-cli",
    target_node: "core",
    event_type: "task.request",
    priority: 5,
    payload: { intent: "demo automation" },
    trace_id: traceId,
    correlation_id: traceId,
    schema_version: "1.0.0"
  };
}

export const eventBus = {
  async publish(event: OmegaEvent): Promise<void> {
    published.push(event);
    queue.push(event);
    console.log("EVENT PUBLISHED", JSON.stringify(event));
  },

  async consume(): Promise<OmegaEvent | undefined> {
    const queued = queue.shift();
    if (queued) {
      return queued;
    }
    if (!demoEmitted) {
      demoEmitted = true;
      return demoEvent();
    }
    return undefined;
  },

  published(): readonly OmegaEvent[] {
    return published;
  }
};
