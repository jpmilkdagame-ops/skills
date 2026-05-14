# Omega v4 Global Autonomous Cloud Organism

Omega v4 treats AWS, GCP, Azure, and edge clusters as interchangeable compute markets. The system continuously evaluates placement using cost, latency, availability, GPU capacity, and optional carbon signals.

## Global control plane

```text
Global Omega Brain
  AWS EKS regions
  GCP GKE regions
  Azure AKS regions
  Edge/k3s worker swarm
```

The v4 implementation lives in `omega-core/v4/` and is intentionally deterministic by default so it can be tested locally before wiring real provider telemetry.

## Routing and cost arbitrage

- `globalRouter.ts` scores regions for a workload.
- `costArbitrage.ts` rebalances workloads when another region is better.
- `signals.ts` is the provider telemetry adapter seam.

Scoring favors low cost and latency while accounting for availability, GPU scarcity, and carbon intensity when provided.

## Dynamic deployment

- `deployAnywhere.ts` selects EKS, GKE, AKS, or edge/k3s actions from the same service spec.
- `infraGenerator.ts` emits starter Kubernetes and Terraform snippets for a service.
- `infra/terraform/gcp`, `infra/terraform/azure`, and `infra/terraform/edge` provide baseline multi-cloud landing zones.

## Failure immunity

`failureImmunity.ts` reroutes tasks away from down regions by selecting the best healthy backup region.

## Zero-human provisioning loop

`autonomyLoop.ts` performs one safe local cycle:

```text
predict demand -> generate infra -> deploy anywhere -> rebalance workloads -> fail over unhealthy regions
```

Keep v4 in simulation/approval mode until provider credentials, budget guardrails, audit logs, and rollback controls are validated.
