---
name: omega-production-kit
description: Create production-ready Omega-style distributed AI platform kits, including physical hardware build plans, rack layouts, port-by-port wiring/network maps, monorepo scaffolds, runnable TypeScript Omega Core and Kernel v1 control loops, node runtime agents, live dashboard UI, lifecycle build-pack docs, Docker Compose local stacks, Kubernetes manifests, Terraform AWS/EKS baselines, GitHub Actions deployment pipeline, Kafka-compatible event schemas, DAG orchestration boundaries, memory hierarchy, node lifecycle, and observability wiring. Use when asked to build, scaffold, harden, or review a deployable “Omega AI”, distributed AI operating system, AI mesh, event-driven agent platform, physical AI lab/rack, or full production kit, autonomous cloud organism, global compute routing, or multi-cloud swarm.
---

# Omega Production Kit

## Core workflow

1. Clarify target environment only when the request is ambiguous: physical lab/rack, local dev, Kubernetes, AWS/EKS, edge/hybrid, or all-in production kit.
2. For physical builds, produce the hardware/rack/network/power plan before the software rollout. For software, prefer a stable production sequence: event bus and core gateway first, two node types second, memory fabric third, observability fourth, self-improvement loops last.
3. Use the bundled scaffold script when the user wants real files rather than architecture prose:

```bash
python <skill-dir>/scripts/scaffold_omega.py ./omega --project-name omega --namespace omega-ai --aws-region us-east-1
```

4. After scaffolding, inspect generated files before editing them. Patch service names, container registries, cloud provider details, and security posture to match the user’s deployment.
5. Validate generated YAML/JSON/Terraform when tooling is available. At minimum run the scaffold script in a temporary directory, parse JSON files, and run TypeScript typechecking plus one-shot core/system/kernel checks when npm is available.

## Architecture rules

- Treat Omega as a control-loop system: `event -> brain -> DAG -> node execution -> memory write -> learning/observation -> optimization` and provide executable kernel code when users ask for a live system rather than prose.
- Keep intelligence and execution separate:
  - `core-gateway`: ingress, auth boundary, API/WebSocket surface.
  - `brain-engine`: intent interpretation and DAG creation.
  - `dag-orchestrator`: task graph validation, scheduling, retries, rollback hooks.
  - `event-bus`: Kafka-compatible nervous system and dead-letter/replay policy.
  - `memory-fabric`: working, episodic, semantic, and event memory routing.
  - `node-registry`: node identity, capability declarations, heartbeats, lifecycle.
  - `automation-engine`: external workflow execution and webhook/API adapters.
- Route all cross-service workflow state through typed events; do not create hidden point-to-point coupling for production paths.
- Provide `omega-core/` as the minimum runnable boot brain when users ask for a full working codebase, and keep the larger `omega-kernel/`/service layout for distributed expansion.
- Design self-improvement and v4 global-autonomy features as opt-in control-plane policies after observability, audit logs, budget guardrails, provider quotas, and rollback behavior exist.

## Physical build guidance

- When asked for a physical build plan, use `references/physical-build-plan.md` and the scaffolded `docs/physical-build-plan.md` asset.
- Include core server, node classes, room interfaces, edge/mobile access, rack elevation, VLAN/IP zones, port-by-port switch map, cabling labels, UPS/cooling plan, install sequence, and acceptance tests.
- Avoid unverified current prices or claims that specific parts are buyable today unless you verify current availability.
- Require licensed electrical review for high-draw GPU racks and require manual overrides for physical automation.

## v4 global autonomy guidance

- Treat AWS/GCP/Azure/edge placement as a scored decision over cost, latency, health, GPU capacity, and optional carbon signals.
- Keep multi-cloud deploy-anywhere and self-writing infrastructure in simulation or approval mode until budget limits, cloud credentials, and rollback paths are validated.
- Provide failover behavior as explicit region migration decisions, not hidden background mutation.

## Deployment guidance

- Start locally with Docker Compose and a Kafka-compatible broker before moving to Kubernetes.
- For Kubernetes, provide namespace, config, deployments, services, probes, resource limits, and secrets placeholders.
- For AWS/EKS, provide a baseline VPC/EKS shape but flag IAM, subnet, ingress, secrets, and state backend decisions as environment-specific.
- For edge deployments, keep local nodes stateless where possible and use node registration plus capability heartbeats.

## Event schema requirements

- Every event must include: `event_id`, `timestamp`, `source_node`, `event_type`, `priority`, `payload`, `trace_id`, and `schema_version`.
- Include optional routing fields such as `target_node`, `tenant_id`, and `correlation_id` when useful.
- Define dead-letter behavior for malformed events, failed task attempts, and unsupported node capabilities.

## Memory hierarchy

- Working memory: Redis; seconds to minutes; volatile task context.
- Episodic memory: PostgreSQL; structured task history, audits, user workflows.
- Semantic memory: Qdrant or compatible vector store; embeddings and retrieval.
- Event memory: Kafka retention/object storage; replay and forensic debugging.

## References

- Read `references/physical-build-plan.md` when creating hardware, rack, wiring, network, power, or construction plans.
- Read `references/production-checklist.md` when reviewing or hardening an Omega production kit.
- Use `assets/omega-template/` through `scripts/scaffold_omega.py` when the user asks for a ready-to-run repo scaffold; it includes `docs/physical-build-plan.md`.
