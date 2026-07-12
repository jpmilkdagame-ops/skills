export interface MemoryRecord {
  storedAt: string;
  item: unknown;
}

const data: MemoryRecord[] = [];

export const memory = {
  async store(item: unknown): Promise<MemoryRecord> {
    const record = { storedAt: new Date().toISOString(), item };
    data.push(record);
    return record;
  },

  all(): readonly MemoryRecord[] {
    return data;
  },

  count(): number {
    return data.length;
  }
};
