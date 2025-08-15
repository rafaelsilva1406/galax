terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Variables
variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "rg-galax-game"
}

variable "location" {
  description = "Azure location"
  type        = string
  default     = "East US"
}

variable "app_service_plan_name" {
  description = "Name of the App Service Plan"
  type        = string
  default     = "asp-galax-game"
}

variable "app_service_name" {
  description = "Name of the App Service"
  type        = string
  default     = "app-galax-game"
}

variable "container_registry_name" {
  description = "Name of the Container Registry"
  type        = string
  default     = "acrgalaxgame"
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Environment = "production"
    Project     = "galax-game"
  }
}

# Container Registry
resource "azurerm_container_registry" "main" {
  name                = var.container_registry_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true

  tags = {
    Environment = "production"
    Project     = "galax-game"
  }
}

# App Service Plan
resource "azurerm_service_plan" "main" {
  name                = var.app_service_plan_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  os_type             = "Linux"
  sku_name            = "B1"

  tags = {
    Environment = "production"
    Project     = "galax-game"
  }
}

# App Service
resource "azurerm_linux_web_app" "main" {
  name                = var.app_service_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  service_plan_id     = azurerm_service_plan.main.id

  site_config {
    always_on = true
    
    application_stack {
      docker_image     = "${azurerm_container_registry.main.login_server}/galax-game"
      docker_image_tag = "latest"
    }
  }

  app_settings = {
    "DOCKER_REGISTRY_SERVER_URL"      = "https://${azurerm_container_registry.main.login_server}"
    "DOCKER_REGISTRY_SERVER_USERNAME" = azurerm_container_registry.main.admin_username
    "DOCKER_REGISTRY_SERVER_PASSWORD" = azurerm_container_registry.main.admin_password
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "NODE_ENV" = "production"
  }

  tags = {
    Environment = "production"
    Project     = "galax-game"
  }
}

# Application Insights
resource "azurerm_application_insights" "main" {
  name                = "ai-galax-game"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  application_type    = "web"

  tags = {
    Environment = "production"
    Project     = "galax-game"
  }
}

# Outputs
output "app_service_url" {
  description = "The URL of the deployed App Service"
  value       = "https://${azurerm_linux_web_app.main.name}.azurewebsites.net"
}

output "container_registry_login_server" {
  description = "The login server URL for the Container Registry"
  value       = azurerm_container_registry.main.login_server
}

output "container_registry_username" {
  description = "The admin username for the Container Registry"
  value       = azurerm_container_registry.main.admin_username
  sensitive   = true
}

output "container_registry_password" {
  description = "The admin password for the Container Registry"
  value       = azurerm_container_registry.main.admin_password
  sensitive   = true
}

output "application_insights_instrumentation_key" {
  description = "The instrumentation key for Application Insights"
  value       = azurerm_application_insights.main.instrumentation_key
  sensitive   = true
}