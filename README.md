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

## Architecture

- TanStack Query owns server state and mutations.
- Redux Toolkit owns shared UI state such as modal mode and dashboard view.
- React Hook/local state owns component-only controls and form inputs.
- Feature-first folders keep task domain code together.
