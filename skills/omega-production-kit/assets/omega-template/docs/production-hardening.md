# Omega Production Hardening Guide

Use this checklist before exposing Omega beyond a local lab.

## Authentication and identity

- Use short-lived JWTs for user/API access via `packages/auth/src/jwt.ts`.
- Use signed node credentials for node registration and heartbeat calls.
- Scope tokens by role: `core:write`, `node:register`, `node:heartbeat`, `memory:read`, `automation:execute`.
- Rotate node secrets and revoke stale node IDs from the registry.

## Event bus hardening

- Provision all topics in `infra/kafka/topics.json` before deployment.
- Send schema validation failures to `dead-letter`.
- Commit consumer offsets only after task result, memory write, and trace emission complete.
- Keep replay retention long enough for incident review and workflow replay.

## Observability

- Import `infra/docker/grafana/dashboards/omega-overview.json` into Grafana.
- Alert on unavailable core gateway, increasing dead-letter volume, node heartbeat staleness, and p95 task latency.
- Require trace IDs in every log line that handles user commands or automation actions.

## Reliability

- Run at least two replicas for stateless core services.
- Keep memory stores backed up and tested with restore drills.
- Keep automation actions idempotent or protected by dedupe keys.
- Disable v2 self-improvement in production until rollback and approval gates are tested.

## AWS deployment

- Configure GitHub OIDC with `AWS_DEPLOY_ROLE_ARN` before using `.github/workflows/aws-deploy.yml`.
- Store Terraform state in a remote encrypted backend before team usage.
- Review IAM permissions, private subnet routing, ingress, and secrets before `infra/scripts/aws-deploy.sh`.
