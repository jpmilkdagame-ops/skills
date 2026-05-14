import type { OmegaEvent } from "../../packages/event-schemas/src";

export interface IntentPlan {
  intent: string;
  steps: string[];
  traceId: string;
  priority: number;
}

export interface LearningRecord {
  eventId: string;
  traceId: string;
  resultStatus: string;
  learnedAt: string;
}

const learningLog: LearningRecord[] = [];

export const brainEngine = {
  parse(event: OmegaEvent): IntentPlan {
    const payload = event.payload as { intent?: string; command?: string };
    return {
      intent: payload.intent ?? payload.command ?? "unknown intent",
      steps: ["analyze", "retrieve_memory", "execute"],
      traceId: event.trace_id,
      priority: event.priority
    };
  },

  learn(event: OmegaEvent, result: { status: string }): LearningRecord {
    const record = {
      eventId: event.event_id,
      traceId: event.trace_id,
      resultStatus: result.status,
      learnedAt: new Date().toISOString()
    };
    learningLog.push(record);
    return record;
  },

  learningLog(): readonly LearningRecord[] {
    return learningLog;
  }
};
