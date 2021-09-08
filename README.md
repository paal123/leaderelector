# Leaderelector
Simple side car leader elector.

https://github.com/paal123/leaderelector
# Quick Reference
Usage:
```
'/ProceedAsLeader?caller=66aad538-2756-4675-9ccb-d5ce9e568164'
```

The caller can be any kind for id, eg a guid or podname.

Returns true if caller is assigned leader, else returns false.


# Environment Variables

**`LEASE TIME`**

Lease time in minutes. Once a lease is obtained, lease will be renewed on every request the leader makes. In case leader dies or does not make any requests within specified lease time, the lease will expire and a new leader is elected.

Default lease time is 10 minutes.

## Deployment
A typical deployment. _Replicas  > 1 might result in unwanted side effects_
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: leaderelector-deployment
  labels:
    app: leaderelector
spec:
  replicas: 1
  selector:
    matchLabels:
      app: leaderelector
  template:
    metadata:
      labels:
        app: leaderelector
    spec:
      containers:
        - name: kubernetestest
          image: paal12345/leaderelector:4.11
          ports:
          - containerPort: 3003
          env:
          - name: LEASE_TIME
            value: "1"
---
apiVersion: v1
kind: Service
metadata:
  name: leaderelector-service
spec:
  selector:
    app: leaderelector
  ports:
    - protocol: TCP
      port: 3003
      targetPort: 3003
```

See Docker Hub image of usage:
https://hub.docker.com/repository/docker/paal12345/leaderelector
