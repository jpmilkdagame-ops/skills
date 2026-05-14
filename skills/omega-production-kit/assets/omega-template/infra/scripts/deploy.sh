#!/usr/bin/env bash
set -euo pipefail

kubectl apply -f infra/k8s/namespace.yaml
kubectl apply -f infra/k8s/config.yaml
kubectl apply -f infra/k8s/event-bus-topics.yaml
kubectl apply -f infra/k8s/core-gateway.yaml
kubectl apply -f infra/k8s/nodes.yaml
