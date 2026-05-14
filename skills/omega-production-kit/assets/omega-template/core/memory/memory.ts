import { memory as coreMemory } from "../../omega-core/memory/memory";

export const memory = {
  write: coreMemory.store,
  store: coreMemory.store,
  all: coreMemory.all,
  count: coreMemory.count
};

export type { MemoryRecord } from "../../omega-core/memory/memory";
