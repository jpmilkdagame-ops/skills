const nodes = [
  { id: "core-1", role: "core", health: "ready", latencyMs: 12 },
  { id: "reasoning-1", role: "reasoning", health: "ready", latencyMs: 44 },
  { id: "automation-1", role: "automation", health: "ready", latencyMs: 21 },
  { id: "vision-1", role: "vision", health: "degraded", latencyMs: 95 }
];

const dag = [
  { step: "analyze", target: "cloud-llm", status: "queued" },
  { step: "retrieve_memory", target: "local-node", status: "queued" },
  { step: "execute", target: "edge-node", status: "queued" }
];

function byId(id) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`missing element: ${id}`);
  return node;
}

function renderNodes() {
  byId("nodes").innerHTML = nodes
    .map((node) => `<div class="node"><strong>${node.id}</strong><br/>${node.role}<br/><span class="${node.health === "ready" ? "ok" : "warn"}">${node.health}</span><br/>${node.latencyMs}ms</div>`)
    .join("");
}

function renderDag() {
  byId("dag").innerHTML = dag
    .map((step, index) => `<div class="step"><strong>${index + 1}. ${step.step}</strong><br/>target: ${step.target}<br/>status: <span class="ok">${step.status}</span></div>`)
    .join("");
}

function simulate() {
  dag.forEach((step) => (step.status = "done"));
  const event = {
    type: "task.request",
    trace_id: crypto.randomUUID(),
    payload: { intent: "automate onboarding" },
    result: dag
  };
  renderDag();
  byId("event").textContent = JSON.stringify(event, null, 2);
  byId("status").textContent = "task.request simulated and DAG completed";
}

renderNodes();
renderDag();
byId("simulate").addEventListener("click", simulate);
