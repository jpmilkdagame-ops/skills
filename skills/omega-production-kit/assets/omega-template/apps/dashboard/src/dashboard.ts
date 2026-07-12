interface NodeStatus {
  id: string;
  role: string;
  health: "ready" | "degraded";
  latencyMs: number;
}

interface DagStep {
  step: string;
  target: string;
  status: "queued" | "running" | "done";
}

const nodes: NodeStatus[] = [
  { id: "core-1", role: "core", health: "ready", latencyMs: 12 },
  { id: "reasoning-1", role: "reasoning", health: "ready", latencyMs: 44 },
  { id: "automation-1", role: "automation", health: "ready", latencyMs: 21 },
  { id: "vision-1", role: "vision", health: "degraded", latencyMs: 95 }
];

const dag: DagStep[] = [
  { step: "analyze", target: "cloud-llm", status: "queued" },
  { step: "retrieve_memory", target: "local-node", status: "queued" },
  { step: "execute", target: "edge-node", status: "queued" }
];

function byId<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`missing element: ${id}`);
  return node as T;
}

function renderNodes(): void {
  byId<HTMLDivElement>("nodes").innerHTML = nodes
    .map((node) => `<div class="node"><strong>${node.id}</strong><br/>${node.role}<br/><span class="${node.health === "ready" ? "ok" : "warn"}">${node.health}</span><br/>${node.latencyMs}ms</div>`)
    .join("");
}

function renderDag(): void {
  byId<HTMLDivElement>("dag").innerHTML = dag
    .map((step, index) => `<div class="step"><strong>${index + 1}. ${step.step}</strong><br/>target: ${step.target}<br/>status: <span class="ok">${step.status}</span></div>`)
    .join("");
}

function simulate(): void {
  dag.forEach((step) => (step.status = "done"));
  const event = {
    type: "task.request",
    trace_id: crypto.randomUUID(),
    payload: { intent: "automate onboarding" },
    result: dag
  };
  renderDag();
  byId<HTMLPreElement>("event").textContent = JSON.stringify(event, null, 2);
  byId<HTMLParagraphElement>("status").textContent = "task.request simulated and DAG completed";
}

renderNodes();
renderDag();
byId<HTMLButtonElement>("simulate").addEventListener("click", simulate);
