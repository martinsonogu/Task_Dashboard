# TaskFlow Dashboard

A production-oriented React + TypeScript task dashboard using Vite, React Router, TanStack Query, Redux Toolkit, Axios, and CSS Modules.

## Run

```bash
cp .env.example .env
npm install
npm run dev:all
```

Start PostgreSQL with a `task_dashboard` database before running the app. The
API creates its `tasks` table on startup and serves the frontend through the
Vite proxy. For frontend-only work, set `VITE_API_MODE=mock` to use localStorage.

The backend exposes `GET /health`, `GET /metrics`, and task CRUD endpoints under
`/api/tasks`.

## Docker

Run the frontend, API, and PostgreSQL together:

```bash
docker compose up --build
```

Open `http://localhost:8080`. The frontend container proxies `/api` to the
Express container, which connects to the PostgreSQL container. The API is also
available directly at `http://localhost:3001`. Stop the stack with
`docker compose down`; add `-v` when you also want to remove the database volume.

## PostgreSQL on Kubernetes

Create the Kind cluster with host ports 80 and 443 exposed, then deploy
PostgreSQL:

```bash
kind create cluster --config kind/kind-config.yaml
kubectl apply -f k8s/postgres.yaml
kubectl get statefulset,pod,svc,pvc
```

Kind port mappings are fixed when a cluster is created. If `task-dashboard`
already exists without these mappings, recreate it with this config before
installing the Ingress Controller.

The database is available inside the cluster at `postgres:5432`. The
`postgres-data-postgres-0` PVC keeps data across pod restarts. Remove the
resources with `kubectl delete -f k8s/postgres.yaml`.

## API on Kubernetes

Build the API image, load it into Kind, and deploy the API:

```bash
docker compose build api
kind load docker-image task_dashboard-api:latest --name task-dashboard
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/api.yaml
kubectl rollout status deployment/task-api
```

The API receives its database credentials from `postgres-credentials` and its
database connection settings from `api-config`. Its internal connection is:
`task-api -> postgres-service -> postgres-0`.

## Frontend on Kubernetes

Build and load the frontend image into Kind, then deploy it:

```bash
docker compose build frontend
kind load docker-image task_dashboard-frontend:latest --name task-dashboard
kubectl apply -f k8s/frontend.yaml
kubectl rollout status deployment/task-frontend
```

## Ingress on Kubernetes

Install the NGINX Ingress Controller in Kind once:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.1/deploy/static/provider/kind/deploy.yaml
kubectl wait --namespace ingress-nginx --for=condition=ready pod \
	--selector=app.kubernetes.io/component=controller --timeout=120s
```

Apply the application Ingress:

```bash
kubectl apply -f k8s/ingress.yaml
```

Add `127.0.0.1 task-dashboard.local` to `/etc/hosts`, then open
`http://task-dashboard.local`. The Ingress routes `/api` directly to the
internal `task-api` Service and all other paths to `task-frontend`.

## Two-tier Kubernetes deployment

The two-tier variant runs a frontend and an in-memory API in its own namespace.
It is independent of the existing PostgreSQL-backed deployment; tasks in this
variant are intentionally lost whenever the API pod restarts.

Build and load the current images, then deploy the directory:

```bash
docker compose build api frontend
kind load docker-image task_dashboard-api:latest task_dashboard-frontend:latest \
  --name task-dashboard
kubectl apply -f k8s/2-tier/ -n task-2tier
kubectl get pods,svc,ingress -n task-2tier
```

Add `127.0.0.1 task-2tier.local` to `/etc/hosts`, then open
`http://task-2tier.local`. The original three-tier application remains
available at `http://task-dashboard.local`.

## Architecture

- TanStack Query owns server state and mutations.
- Redux Toolkit owns shared UI state such as modal mode and dashboard view.
- React Hook/local state owns component-only controls and form inputs.
- Feature-first folders keep task domain code together.
