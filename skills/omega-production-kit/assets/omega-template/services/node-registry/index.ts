export interface RegisteredNode {
  nodeId: string;
  role: string;
  capabilities: string[];
  version: string;
  lastHeartbeat: string;
  status: "ready" | "stale" | "degraded";
}

const registry = new Map<string, RegisteredNode>();

export const nodeRegistry = {
  register(node: Omit<RegisteredNode, "lastHeartbeat" | "status">): RegisteredNode {
    const registered = {
      ...node,
      lastHeartbeat: new Date().toISOString(),
      status: "ready" as const
    };
    registry.set(node.nodeId, registered);
    return registered;
  },

  heartbeat(nodeId: string): RegisteredNode | undefined {
    const node = registry.get(nodeId);
    if (!node) return undefined;
    const updated = { ...node, lastHeartbeat: new Date().toISOString(), status: "ready" as const };
    registry.set(nodeId, updated);
    return updated;
  },

  capabilities(role?: string): RegisteredNode[] {
    return [...registry.values()].filter((node) => !role || node.role === role);
  },

  deprecate(nodeId: string): boolean {
    return registry.delete(nodeId);
  }
};
