# Kubernetes Deployment Guide

## Prerequisites

- Kubernetes cluster (1.20+)
- kubectl configured
- Docker images built and available

## Quick Start

1. Create namespace and resources:
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
```

2. Deploy PostgreSQL:
```bash
kubectl apply -f k8s/postgres.yaml
```

3. Wait for PostgreSQL to be ready:
```bash
kubectl wait --for=condition=ready pod -l app=postgres -n naturem --timeout=300s
```

4. Deploy backend:
```bash
kubectl apply -f k8s/backend.yaml
```

5. Deploy frontend:
```bash
kubectl apply -f k8s/frontend.yaml
```

6. (Optional) Deploy ingress:
```bash
kubectl apply -f k8s/ingress.yaml
```

## Verify Deployment

Check pod status:
```bash
kubectl get pods -n naturem
```

Check services:
```bash
kubectl get svc -n naturem
```

## Access the Application

If using LoadBalancer:
```bash
kubectl get svc frontend-service -n naturem
```

If using port-forward:
```bash
kubectl port-forward -n naturem svc/frontend-service 8080:80
```

Then access: http://localhost:8080

## Database Initialization

Initialize the database schema:
```bash
kubectl exec -it -n naturem deployment/backend -- npm run migrate
```

Seed sample data:
```bash
kubectl exec -it -n naturem deployment/backend -- npm run seed
```

## Scaling

Scale backend:
```bash
kubectl scale deployment backend -n naturem --replicas=3
```

Scale frontend:
```bash
kubectl scale deployment frontend -n naturem --replicas=3
```

## Logs

View backend logs:
```bash
kubectl logs -n naturem -l app=backend --tail=100 -f
```

View frontend logs:
```bash
kubectl logs -n naturem -l app=frontend --tail=100 -f
```

## Cleanup

Remove all resources:
```bash
kubectl delete namespace naturem
```
