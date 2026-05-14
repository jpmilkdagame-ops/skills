# Omega AI Full Lifecycle Build Pack

This document maps the generated repo to the four implementation layers required to move Omega from a blueprint to a live system.

## 1. Working codebase

The minimum live boot core is under `omega-core/`, while `core/` and `event-bus/` provide the top-level delivery-pack import paths used by `omega-kernel.ts`:

```text
omega-core/
  kernel/loop.ts
  bus/eventBus.ts
  brain/brainEngine.ts
  dag/dagEngine.ts
  memory/memory.ts
  automation/executor.ts
```

Run the compact core and unified system lifecycle with one command (`scripts/omega.sh bootstrap`) or the individual checks:

```bash
npm run core:once
npm run system:once
```

The loop performs:

```text
event -> parse intent -> build DAG -> route strategy -> execute -> store memory -> learn feedback -> trace health
```

## 2. AWS + Kubernetes deploy

Production starter manifests live in `infra/k8s/` and Terraform baseline files live in `infra/terraform/aws/`.

Default Kubernetes services model:

```text
AWS EKS cluster
  omega-core / core-gateway
  brain-engine
  dag-orchestrator
  automation-engine
  memory-service
  event-bus
```

Before production use, replace placeholder images, configure real secrets, configure ingress, and choose a Terraform state backend.

## 3. Kafka + Kubernetes wiring

The production event backbone should use these topics:

```text
task.request
task.execute
task.complete
node.health
memory.write
dag.build
system.alert
```

`omega-kernel.ts` is the single orchestrated runtime for the delivery-pack shape, and `infra/k8s/event-bus-topics.yaml` captures the topic contract as a Kubernetes ConfigMap so operators can keep the cluster wiring and event schema aligned.

## 4. Omega v2 self-evolving core

Experimental self-improvement hooks live under `omega-core/v2/`:

- `optimizer.ts`: DAG optimization and learning hooks.
- `registry.ts`: auto node spawn/replace primitives.
- `adaptiveRouter.ts`: complexity/latency routing policy.
- `selfImprovingLoop.ts`: one-cycle self-improving execution path.

Keep v2 disabled in production until observability, audit logs, rollback behavior, and manual approval gates are in place. Use `docs/production-hardening.md` as the preflight checklist.

## 5. Omega v4 global organism

The v4 layer in `omega-core/v4/` adds global multi-cloud routing, cost arbitrage, deploy-anywhere placement, infrastructure generation, and failure-immunity simulation. Read `docs/omega-v4-global-organism.md` before connecting real cloud credentials.
