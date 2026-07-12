terraform {
  required_version = ">= 1.6.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
}

variable "location" {
  type    = string
  default = "East US"
}

resource "azurerm_resource_group" "omega" {
  name     = "OMEGA_PROJECT_NAME-rg"
  location = var.location
}

resource "azurerm_kubernetes_cluster" "omega" {
  name                = "OMEGA_PROJECT_NAME-aks"
  location            = azurerm_resource_group.omega.location
  resource_group_name = azurerm_resource_group.omega.name
  dns_prefix          = "OMEGA_PROJECT_NAME"

  default_node_pool {
    name       = "system"
    node_count = 2
    vm_size    = "Standard_D4s_v5"
  }

  identity {
    type = "SystemAssigned"
  }
}
