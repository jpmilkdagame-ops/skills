export interface RuntimeNode {
  id: string;
  type: string;
  failureRate: number;
  autoRegistered: boolean;
}

const nodes = new Map<string, RuntimeNode>();

export const registry = {
  spawnNode(capability: string): RuntimeNode {
    const node = {
      id: `${capability}-${nodes.size + 1}`,
      type: capability,
      failureRate: 0,
      autoRegistered: true
    };
    nodes.set(node.id, node);
    return node;
  },

  replace(node: RuntimeNode): RuntimeNode {
    nodes.delete(node.id);
    return this.spawnNode(node.type);
  },

  all(): RuntimeNode[] {
    return [...nodes.values()];
  }
};
