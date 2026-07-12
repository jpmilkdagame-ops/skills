import type { OmegaEvent } from "../../packages/event-schemas/src";

export const observability = {
  trace(event: OmegaEvent, result: unknown): void {
    console.log("TRACE", JSON.stringify({ trace_id: event.trace_id, event_type: event.event_type, result }));
  }
};
