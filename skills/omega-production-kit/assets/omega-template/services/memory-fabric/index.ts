const writes: unknown[] = [];

export const memoryFabric = {
  async store(record: unknown): Promise<void> {
    writes.push(record);
    console.log("MEMORY WRITE", JSON.stringify(record));
  },

  writes(): readonly unknown[] {
    return writes;
  }
};
