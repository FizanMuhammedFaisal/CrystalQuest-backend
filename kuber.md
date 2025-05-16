.
├── k8s/
│ ├── base/ # Base configurations
│ │ ├── api-gateway/
│ │ │ ├── deployment.yaml
│ │ │ ├── service.yaml
│ │ │ └── kustomization.yaml
│ │ ├── auth/
│ │ │ ├── deployment.yaml
│ │ │ ├── service.yaml
│ │ │ └── kustomization.yaml
│ │ ├── dashboard/
│ │ │ ├── deployment.yaml
│ │ │ ├── service.yaml
│ │ │ └── kustomization.yaml
│ │ └── game/
│ │ ├── deployment.yaml
│ │ ├── service.yaml
│ │ └── kustomization.yaml
│ ├── overlays/ # Environment-specific overrides
│ │ ├── development/
│ │ │ ├── api-gateway/
│ │ │ │ ├── config.yaml
│ │ │ │ └── kustomization.yaml
│ │ │ └── ...
│ │ ├── staging/
│ │ │ └── ...
│ │ └── production/
│ │ └── ...
│ └── common/ # Shared resources
│ ├── namespace.yaml
│ └── ingress.yaml
└── skaffold.yaml # For local k8s development
