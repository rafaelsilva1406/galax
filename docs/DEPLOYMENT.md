# 🚀 Deployment Guide

This guide covers all deployment scenarios for the Galax game project.

## 📋 Prerequisites

### Required Tools
- **Node.js** 18.x or later
- **Docker** and Docker Compose
- **Terraform** 1.5.x or later
- **Azure CLI** (for Azure deployments)
- **Expo CLI** (for mobile deployments)
- **Git** for version control

### Required Accounts
- **GitHub** account with repository access
- **Azure** subscription (for web deployment)
- **Expo** account (for mobile deployment)
- **Netlify** account (for PR previews, optional)

## 🌐 Web Deployment (Azure)

### 1. Azure Infrastructure Setup

#### Create Azure Service Principal
```bash
# Login to Azure
az login

# Create service principal for automation
az ad sp create-for-rbac --name "galax-game-deploy" \
  --role contributor \
  --scopes /subscriptions/{your-subscription-id} \
  --sdk-auth
```

#### Configure GitHub Secrets
Add these secrets to your GitHub repository:

```
AZURE_CREDENTIALS: {
  "clientId": "...",
  "clientSecret": "...",
  "subscriptionId": "...",
  "tenantId": "..."
}
```

#### Initialize Terraform
```bash
cd infrastructure/

# Initialize Terraform
terraform init

# Create terraform.tfvars
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:
```hcl
resource_group_name = "rg-galax-game-prod"
location = "East US"
app_service_plan_name = "asp-galax-game-prod" 
app_service_name = "app-galax-game-prod"
container_registry_name = "acrgalaxgameprod"
```

#### Deploy Infrastructure
```bash
# Plan the deployment
terraform plan

# Apply the infrastructure
terraform apply
```

### 2. Container Registry Setup

#### Build and Push Docker Image
```bash
# Get ACR login server
ACR_LOGIN_SERVER=$(terraform output -raw container_registry_login_server)

# Login to ACR
az acr login --name $ACR_LOGIN_SERVER

# Build and tag image
docker build -t $ACR_LOGIN_SERVER/galax-game:latest .

# Push image
docker push $ACR_LOGIN_SERVER/galax-game:latest
```

### 3. App Service Deployment

#### Manual Deployment
```bash
# Deploy to App Service
az webapp config container set \
  --name app-galax-game-prod \
  --resource-group rg-galax-game-prod \
  --docker-custom-image-name $ACR_LOGIN_SERVER/galax-game:latest
```

#### Automated Deployment
The GitHub Actions workflow automatically:
1. Builds and tests the application
2. Creates Docker image
3. Pushes to Azure Container Registry
4. Deploys to App Service

## 📱 Mobile Deployment (Expo)

### 1. Expo Setup

#### Install Expo CLI
```bash
npm install -g @expo/cli
```

#### Login to Expo
```bash
expo login
```

### 2. Configure Expo Project

#### Update app.json
```json
{
  "expo": {
    "name": "Galax Space Adventure",
    "slug": "galax-game",
    "version": "1.0.0",
    "orientation": "landscape",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#000011"
    },
    "platforms": ["ios", "android", "web"],
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000011"
      }
    },
    "ios": {
      "supportsTablet": true
    }
  }
}
```

### 3. Deployment Options

#### Development Builds
```bash
# Start development server
expo start

# Build for specific platform
expo build:android --type apk
expo build:ios --type archive
```

#### Production Builds
```bash
# Publish to Expo
expo publish

# Build standalone apps
expo build:android --type app-bundle
expo build:ios --type app-store
```

#### EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for all platforms
eas build --platform all
```

## 🐳 Docker Deployment

### 1. Local Development
```bash
# Development environment
docker-compose up galax-dev

# Production environment  
docker-compose up galax-prod
```

### 2. Production Docker Deployment

#### Build Production Image
```bash
docker build --target production -t galax-game:prod .
```

#### Run Production Container
```bash
docker run -p 80:80 galax-game:prod
```

#### Docker Swarm Deployment
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml galax
```

### 3. Kubernetes Deployment

#### Create Kubernetes Manifests
```yaml
# k8s-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: galax-game
spec:
  replicas: 3
  selector:
    matchLabels:
      app: galax-game
  template:
    metadata:
      labels:
        app: galax-game
    spec:
      containers:
      - name: galax-game
        image: your-registry/galax-game:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: galax-game-service
spec:
  selector:
    app: galax-game
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

#### Deploy to Kubernetes
```bash
kubectl apply -f k8s-deployment.yml
```

## 🔄 CI/CD Pipeline

### 1. GitHub Actions Configuration

The project includes comprehensive CI/CD workflows:

#### Main Pipeline (`ci-cd.yml`)
- **Triggers**: Push to main/develop, PRs to main
- **Stages**: Test → Build → Deploy
- **Outputs**: 
  - Web app deployed to Azure
  - Mobile app published to Expo
  - Docker images in registry

#### PR Preview (`pr-preview.yml`)
- **Triggers**: Pull request events
- **Outputs**: Preview deployment on Netlify
- **Features**: Lighthouse performance audits

### 2. Environment Configuration

#### Required GitHub Secrets
```
AZURE_CREDENTIALS       # Azure service principal
EXPO_TOKEN              # Expo authentication token
NETLIFY_AUTH_TOKEN      # Netlify deployment token
NETLIFY_SITE_ID         # Netlify site identifier
CODECOV_TOKEN           # Code coverage reporting
```

#### Environment Variables
```bash
# Production
NODE_ENV=production
EXPO_PUBLIC_API_URL=https://api.galaxgame.com

# Development
NODE_ENV=development
EXPO_PUBLIC_API_URL=http://localhost:3001
```

## 📊 Monitoring and Logging

### 1. Azure Application Insights

#### Setup Application Insights
```bash
# Get instrumentation key
INSTRUMENTATION_KEY=$(terraform output -raw application_insights_instrumentation_key)

# Configure in app settings
az webapp config appsettings set \
  --name app-galax-game-prod \
  --resource-group rg-galax-game-prod \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY=$INSTRUMENTATION_KEY
```

### 2. Performance Monitoring

#### Lighthouse CI
```bash
# Run Lighthouse audit
npm install -g @lhci/cli
lhci autorun
```

#### Custom Metrics
```javascript
// Track game events
applicationInsights.trackEvent({
  name: "GameStarted",
  properties: {
    version: "1.0.0",
    platform: "web"
  }
});
```

## 🚨 Troubleshooting

### Common Deployment Issues

#### 1. Azure Deployment Failures
```bash
# Check App Service logs
az webapp log tail --name app-galax-game-prod --resource-group rg-galax-game-prod

# Check container logs
az webapp log show --name app-galax-game-prod --resource-group rg-galax-game-prod
```

#### 2. Docker Build Issues
```bash
# Clear Docker cache
docker system prune -f

# Rebuild without cache
docker build --no-cache -t galax-game .
```

#### 3. Expo Build Problems
```bash
# Clear Expo cache
expo r -c

# Check build status
expo build:status
```

### Performance Issues

#### 1. Slow Load Times
- Check bundle analyzer output
- Optimize asset loading
- Enable compression in nginx

#### 2. High Memory Usage
- Review object pooling
- Check for memory leaks
- Monitor garbage collection

## 🔒 Security Considerations

### 1. Container Security
```bash
# Scan for vulnerabilities
docker scan galax-game:latest

# Use non-root user
USER node
```

### 2. Azure Security
```bash
# Enable HTTPS only
az webapp update --name app-galax-game-prod --resource-group rg-galax-game-prod --https-only true

# Configure custom domain with SSL
az webapp config hostname add --webapp-name app-galax-game-prod --resource-group rg-galax-game-prod --hostname galaxgame.com
```

### 3. Expo Security
```bash
# Review app permissions
expo doctor

# Enable code signing
eas build --platform ios --profile production
```

## 📈 Scaling

### 1. Azure App Service Scaling
```bash
# Scale out (horizontal)
az appservice plan update --name asp-galax-game-prod --resource-group rg-galax-game-prod --number-of-workers 3

# Scale up (vertical)
az appservice plan update --name asp-galax-game-prod --resource-group rg-galax-game-prod --sku P1V2
```

### 2. CDN Configuration
```bash
# Create CDN profile
az cdn profile create --resource-group rg-galax-game-prod --name cdn-galax-game --sku Standard_Microsoft

# Create CDN endpoint
az cdn endpoint create --resource-group rg-galax-game-prod --name galax-game --profile-name cdn-galax-game --origin app-galax-game-prod.azurewebsites.net
```

## 📞 Support

### Deployment Support Checklist

- [ ] All prerequisites installed
- [ ] Azure subscription active
- [ ] GitHub secrets configured
- [ ] Terraform state backed up
- [ ] DNS records configured
- [ ] SSL certificates valid
- [ ] Monitoring enabled
- [ ] Backup strategy in place

### Getting Help

1. **Check logs** first (Azure, Docker, Expo)
2. **Review documentation** and troubleshooting sections
3. **Search existing issues** on GitHub
4. **Create new issue** with:
   - Deployment target (Azure/Expo/Docker)
   - Error messages and logs
   - Environment details
   - Steps to reproduce

---

*Last updated: [Current Date]*
*Version: 1.0.0*