import type { OmegaEvent } from "../../event-schemas/src";

export interface OmegaClientOptions {
  endpoint: string;
  apiKey?: string;
}

export class OmegaClient {
  constructor(private readonly options: OmegaClientOptions) {}

  async submit(event: OmegaEvent): Promise<{ accepted: true; endpoint: string; traceId: string }> {
    // Replace with fetch/WebSocket transport when the core gateway is enabled.
    return { accepted: true, endpoint: this.options.endpoint, traceId: event.trace_id };
  }
}
