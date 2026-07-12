# Omega Production Checklist

Use this checklist before presenting an Omega kit as production-ready.


## Physical readiness

- Rack layout, port map, VLAN/IP plan, cable labels, and device placement are documented.
- UPS/PDU/circuit sizing has been validated for measured or nameplate peak load with headroom.
- Cooling path, intake/exhaust temperature probes, and alert thresholds are defined.
- Cameras, microphones, sensors, and actuators have privacy controls and physical/manual override paths.

## Control plane

- Core gateway exposes health/readiness endpoints and authenticates operator/API traffic.
- Brain engine emits DAG definitions; it does not directly execute external side effects.
- DAG orchestrator owns dependency resolution, retries, timeout policy, and rollback hooks.
- Node registry records node identity, capabilities, heartbeat timestamps, versions, and trust state.

## Event bus

- Kafka-compatible topics exist for task flow, node lifecycle, memory, audit, and dead-letter events.
- Event schemas are versioned and include trace/correlation IDs.
- Consumers are idempotent or use deduplication by `event_id`.
- Replay strategy is documented before enabling self-improving policies.

## Memory fabric

- Redis is used only for volatile working memory and cache state.
- PostgreSQL stores durable structured history and audit metadata.
- Qdrant/vector DB stores semantic memory with tenant/namespace separation.
- Event retention and cold archive policies are explicit.

## Kubernetes

- Each service has resource requests/limits, liveness/readiness probes, and a Service object.
- Secrets are not hard-coded; manifests use placeholder Secret or external secret references.
- ConfigMaps keep non-secret service configuration.
- Stateful dependencies are either managed services or installed through an operator/chart with persistent volumes.

## Observability

- OpenTelemetry traces flow across gateway, brain, DAG, workers, and memory services.
- Prometheus metrics include latency, error rate, queue lag, task retry count, and model routing decisions.
- Logs are structured JSON with `trace_id`, `event_id`, `node_id`, and `task_id` when present.
- Dashboard panels distinguish infrastructure failure from model/task failure.

## Security

- Use TLS at ingress and mTLS/service mesh or signed node credentials internally for production.
- Give nodes scoped credentials by capability rather than global credentials.
- Audit all external automation actions and all privileged control-plane changes.
- Keep self-improvement features behind policy gates with rollback and human override.
