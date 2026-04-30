# Frontend - Team Task Manager

React + Vite frontend for Team Task Manager.

## Features
- JWT-based authenticated UI
- Role-aware navigation and actions (`ADMIN` / `MEMBER`)
- Dashboard with task analytics chart
- Projects list/details and member management views
- Task creation, status updates, and filtering
- Tailwind responsive styling + error/loading states

## Run Locally
```bash
npm install
cp .env.example .env
npm run dev
```

`VITE_API_URL` defaults to `http://localhost:5000/api` if not provided.
