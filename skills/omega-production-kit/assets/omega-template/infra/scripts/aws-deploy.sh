#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

: "${AWS_REGION:=OMEGA_AWS_REGION}"
: "${OMEGA_CLUSTER_NAME:=OMEGA_PROJECT_NAME-cluster}"

for tool in aws terraform kubectl; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "missing required tool: $tool" >&2
    exit 1
  fi
done

terraform -chdir=infra/terraform/aws init
terraform -chdir=infra/terraform/aws apply -auto-approve
aws eks update-kubeconfig --region "$AWS_REGION" --name "$OMEGA_CLUSTER_NAME"
bash infra/scripts/deploy.sh
