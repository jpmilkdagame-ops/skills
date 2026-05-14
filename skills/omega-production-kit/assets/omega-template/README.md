# OMEGA_PROJECT_NAME

Omega AI is a runnable distributed-AI bootstrap repo with a TypeScript control loop, service boundaries, node runtimes, Docker Compose dependencies, Kubernetes starter manifests, and Terraform AWS/EKS baseline infrastructure.

## Quick start

```bash
npm install
npm run typecheck
npm run core:once
npm run system:once
npm run kernel:once
# or: scripts/omega.sh bootstrap
```

## Local infrastructure

```bash
npm run dev
```

For a one-command local validation, run `npm run bootstrap` or `scripts/omega.sh bootstrap`. For the full local stack, run `scripts/omega.sh up`.

This starts the local broker, Redis, PostgreSQL, Qdrant, core gateway, worker nodes, and observability dependencies declared in `docker-compose.yml`.

## Production path

1. Review `docs/physical-build-plan.md` before hardware procurement or installation.
2. Review `docs/full-lifecycle-build-pack.md`, `docs/omega-v4-global-organism.md`, and `docs/production-hardening.md` for the runtime core, Kubernetes/AWS path, Kafka topic contract, hardening checklist, and v2 self-evolving hooks.
3. Run the local core, unified system kernel, and distributed kernel to validate event flow.
4. Build/push container images for services and nodes.
5. Apply `infra/k8s/*.yaml` to the target cluster.
6. Customize `infra/terraform/aws/main.tf` for IAM, subnets, state backend, and ingress.
