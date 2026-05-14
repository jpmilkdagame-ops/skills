#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

usage() {
  cat <<'USAGE'
Omega local operator

Usage:
  scripts/omega.sh doctor       Check required local tools
  scripts/omega.sh bootstrap    Install deps, typecheck, and run one-shot core/system/v4 checks
  scripts/omega.sh up           Boot the full local Docker Compose stack
  scripts/omega.sh down         Stop the local Docker Compose stack
  scripts/omega.sh deploy       Apply Kubernetes manifests to the current kube context
  scripts/omega.sh aws-deploy   Run Terraform apply and Kubernetes deploy for AWS/EKS
USAGE
}

need() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "missing required tool: $1" >&2
    return 1
  fi
}

cmd="${1:-}"
case "$cmd" in
  doctor)
    need node
    need npm
    need docker
    need kubectl
    echo "Omega doctor passed"
    ;;
  bootstrap)
    npm install
    npm run typecheck
    npm run core:once
    npm run system:once
    npm run kernel:once
    npm run v4:once
    ;;
  up)
    docker compose up --build
    ;;
  down)
    docker compose down
    ;;
  deploy)
    bash infra/scripts/deploy.sh
    ;;
  aws-deploy)
    bash infra/scripts/aws-deploy.sh
    ;;
  -h|--help|help|"")
    usage
    ;;
  *)
    usage >&2
    exit 2
    ;;
esac
