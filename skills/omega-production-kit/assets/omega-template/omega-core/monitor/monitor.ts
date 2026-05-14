import type { OmegaEvent } from "../../packages/event-schemas/src";

export interface TraceRecord {
  traceId: string;
  eventType: string;
  resultStatus: string;
  observedAt: string;
}

const traces: TraceRecord[] = [];

export const monitor = {
  trace(event: OmegaEvent, result: { status: string }): TraceRecord {
    const record = {
      traceId: event.trace_id,
      eventType: event.event_type,
      resultStatus: result.status,
      observedAt: new Date().toISOString()
    };
    traces.push(record);
    return record;
  },

  traces(): readonly TraceRecord[] {
    return traces;
  }
};
