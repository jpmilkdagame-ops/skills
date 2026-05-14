terraform {
  required_version = ">= 1.6.0"
}

variable "edge_cluster_name" {
  type    = string
  default = "OMEGA_PROJECT_NAME-edge"
}

output "edge_cluster_name" {
  value       = var.edge_cluster_name
  description = "Placeholder for k3s/k0s edge cluster inventory integration."
}
