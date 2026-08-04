# TaskFlow Dashboard

A production-oriented React + TypeScript task dashboard using Vite, React Router, TanStack Query, Redux Toolkit, Axios, and CSS Modules.

## Run

```bash
cp .env.example .env
npm install
npm run dev
```

The default `VITE_API_MODE=mock` stores tasks in localStorage. Set it to `remote` and configure `VITE_API_URL` when a REST backend is available.

## Architecture

- TanStack Query owns server state and mutations.
- Redux Toolkit owns shared UI state such as modal mode and dashboard view.
- React Hook/local state owns component-only controls and form inputs.
- Feature-first folders keep task domain code together.
