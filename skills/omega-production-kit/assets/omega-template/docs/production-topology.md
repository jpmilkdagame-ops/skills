# Omega Production Topology

Omega is deployed as a distributed AI control loop:

1. Voice, UI, API, and edge nodes emit typed events.
2. Core Gateway validates ingress and publishes `task.request` events.
3. Brain Engine converts intent into a DAG.
4. DAG Orchestrator schedules work across node capabilities.
5. Memory Fabric routes working, episodic, semantic, and event memory operations.
6. Observability captures traces, metrics, logs, queue lag, and audit records.

Production hardening requirements:

- Replace development secrets before deployment.
- Use managed Kafka/PostgreSQL/Redis/Qdrant or production-grade operators with persistent volumes.
- Use TLS at ingress and mTLS or signed node identities internally.
- Enable self-improving policies only after audit, rollback, and replay are operational.
