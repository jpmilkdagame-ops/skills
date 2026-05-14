import type { InfraBundle, ServiceSpec } from "./types";

function renderEnv(env: Record<string, string> = {}): string {
  return Object.entries(env)
    .map(([name, value]) => `          - name: ${name}\n            value: ${JSON.stringify(value)}`)
    .join("\n");
}

export function generateInfra(spec: ServiceSpec): InfraBundle {
  const env = renderEnv(spec.env);
  return {
    terraform: `resource "kubernetes_deployment" "${spec.name}" {\n  metadata { name = "${spec.name}" }\n  spec { replicas = ${spec.scale} }\n}\n`,
    k8s: `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: ${spec.name}\nspec:\n  replicas: ${spec.scale}\n  selector:\n    matchLabels:\n      app: ${spec.name}\n  template:\n    metadata:\n      labels:\n        app: ${spec.name}\n    spec:\n      containers:\n        - name: ${spec.name}\n          image: ${spec.image}\n          ports:\n            - containerPort: ${spec.port}${env ? `\n          env:\n${env}` : ""}\n`
  };
}
