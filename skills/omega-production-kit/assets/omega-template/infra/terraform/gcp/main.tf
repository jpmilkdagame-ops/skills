terraform {
  required_version = ">= 1.6.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }
}

variable "project_id" {
  type        = string
  description = "GCP project for Omega GKE placement."
}

variable "region" {
  type    = string
  default = "us-central1"
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_container_cluster" "omega" {
  name     = "OMEGA_PROJECT_NAME-gke"
  location = var.region

  remove_default_node_pool = true
  initial_node_count       = 1
}
