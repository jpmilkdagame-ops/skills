import type { OmegaEvent } from "../../packages/event-schemas/src";

export abstract class OmegaNode<TInput = OmegaEvent, TOutput = OmegaEvent> {
  constructor(
    public readonly id: string,
    public readonly type: string
  ) {}

  abstract process(event: TInput): Promise<TOutput>;

  async emit(eventBus: { publish(event: TOutput): Promise<void> }, event: TOutput): Promise<void> {
    await eventBus.publish(event);
  }
}
