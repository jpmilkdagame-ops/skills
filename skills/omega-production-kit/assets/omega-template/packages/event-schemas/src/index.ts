export type OmegaEventType =
  | "task.request"
  | "task.decompose"
  | "task.route"
  | "task.execute"
  | "task.complete"
  | "task.failed"
  | "voice.transcribed"
  | "vision.detected"
  | "reasoning.plan"
  | "automation.result"
  | "memory.write"
  | "node.register"
  | "node.heartbeat";

export interface OmegaEvent<TPayload = Record<string, unknown>> {
  event_id: string;
  timestamp: string;
  source_node: string;
  event_type: OmegaEventType;
  priority: number;
  payload: TPayload;
  trace_id: string;
  schema_version: string;
  target_node?: string;
  tenant_id?: string;
  correlation_id?: string;
}

export interface OmegaTask {
  taskId: string;
  intent: string;
  priority: number;
  traceId: string;
  sourceEvent: OmegaEvent;
}

export interface OmegaDag {
  nodes: string[];
  edges: Array<[string, string]>;
}

export interface ExecutionPlan {
  executionOrder: string[];
}
