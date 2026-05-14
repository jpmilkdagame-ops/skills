import type { OmegaEvent, OmegaTask } from "../../packages/event-schemas/src";

export const brainEngine = {
  parse(event: OmegaEvent): OmegaTask {
    const payload = event.payload as { intent?: string; command?: string; task_id?: string };
    const intent = payload.intent ?? payload.command ?? "unknown intent";

    return {
      taskId: payload.task_id ?? event.trace_id,
      intent,
      priority: event.priority,
      traceId: event.trace_id,
      sourceEvent: event
    };
  }
};
