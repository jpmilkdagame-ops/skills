import { randomUUID } from "node:crypto";
import type { OmegaEvent } from "../../packages/event-schemas/src";

export interface EventBus {
  publish(event: OmegaEvent): Promise<void>;
  consume(): Promise<OmegaEvent | undefined>;
  size(): number;
}

class InMemoryEventBus implements EventBus {
  private readonly queue: OmegaEvent[] = [];

  async publish(event: OmegaEvent): Promise<void> {
    this.queue.push(event);
  }

  async consume(): Promise<OmegaEvent | undefined> {
    return this.queue.shift();
  }

  size(): number {
    return this.queue.length;
  }
}

export const eventBus = new InMemoryEventBus();

export function createTaskRequest(intent = "demo automation", priority = 5): OmegaEvent<{ intent: string }> {
  const traceId = randomUUID();
  return {
    event_id: randomUUID(),
    timestamp: new Date().toISOString(),
    source_node: "omega-core-bootstrap",
    target_node: "brain-engine",
    event_type: "task.request",
    priority,
    payload: { intent },
    trace_id: traceId,
    correlation_id: traceId,
    schema_version: "1.0.0"
  };
}
