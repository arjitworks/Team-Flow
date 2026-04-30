# Team Task Manager

Production-ready full-stack team collaboration app for managing projects and tasks with role-based access control.

## Overview

Team Task Manager helps teams organize projects, assign tasks, and track execution status with clear separation of permissions:
- **Admin** manages projects, members, and task assignments.
- **Member** works on assigned tasks and updates status.

The app is built as a split architecture:
- **Frontend (React + Vite + Tailwind)** for UI/UX
- **Backend (Node.js + Express + Prisma)** for APIs and business logic
- **PostgreSQL** for persistent relational data

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios, Recharts
- **Backend:** Node.js, Express, Prisma ORM, Zod validation
- **Database:** PostgreSQL
- **Authentication:** JWT + bcrypt password hashing
- **Security:** Helmet, CORS policy, rate limiting, validated inputs

## High-Level Architecture

1. User authenticates via `/api/auth/login` or `/api/auth/signup`.
2. Backend returns JWT token.
3. Frontend stores token in local storage and sends `Authorization: Bearer <token>` for API calls.
4. Auth middleware verifies token and loads current user from DB.
5. Role middleware enforces access rules for admin-only actions.
6. Prisma handles all data access and relationships in PostgreSQL.

## Folder Structure

```text
Team Flow/
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios client and request configuration
│   │   ├── components/         # Shared UI and route guards
│   │   ├── context/            # Auth context/state management
│   │   ├── pages/              # Login, Signup, Dashboard, Projects, Tasks, Profile
│   │   ├── App.jsx             # Frontend routes
│   │   └── main.jsx            # App bootstrap
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # DB models and relations
│   │   └── seed.js             # Seed users for local testing
│   ├── src/
│   │   ├── config/             # env + prisma client
│   │   ├── controllers/        # Route handler business logic
│   │   ├── middlewares/        # auth, validation, error handling
│   │   ├── routes/             # REST endpoint modules
│   │   ├── validators/         # Zod schemas
│   │   ├── app.js              # Express app setup
│   │   └── server.js           # Server start entry
│   ├── .env.example
│   ├── API.md                  # Detailed API reference
│   └── package.json
│
└── README.md
```

## Core Use Cases

### Admin Use Cases
- Sign up / log in as admin
- Create and delete projects
- Add or remove members from project
- Create tasks and assign users
- View overall task metrics and overdue tasks

### Member Use Cases
- Log in and access assigned scope
- View projects where member is included
- View assigned tasks
- Update task status (`TODO`, `IN_PROGRESS`, `COMPLETED`)

## Data Model Summary

### User
- `id`, `name`, `email`, `password`, `role`

### Project
- `id`, `title`, `description`, `createdBy`

### Task
- `id`, `title`, `description`, `status`, `dueDate`, `assignedTo`, `projectId`

### ProjectMember (join table)
- maps many-to-many relation between users and projects
- stores member role per project

## RBAC Rules

- **Admin-only**
  - Create/delete projects
  - Add/remove project members
  - Create tasks
- **Member**
  - View assigned/member projects and tasks
  - Update status of their own assigned tasks

## Local Setup (Step-by-Step)

### Prerequisites
- Node.js 18+
- PostgreSQL running locally
- npm

### 1) Clone and install dependencies

```bash
git clone <your-repo-url>
cd "Team Flow"
```

### 2) Configure backend

```bash
cd backend
cp .env.example .env
npm install
```

Update `backend/.env` with your DB and app config:
- `PORT=5000` (or any free port)
- `DATABASE_URL=postgresql://<user>:<password>@localhost:5432/team_task_manager`
- `JWT_SECRET=<your-secret>`
- `CLIENT_URL=http://localhost:5173`

### 3) Run migrations and generate Prisma client

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4) Seed local test users

```bash
npm run seed
```

Seed credentials (all users password: `Test@12345`):
- `admin@test.com` (`ADMIN`)
- `member1@test.com` (`MEMBER`)
- `member2@test.com` (`MEMBER`)
- `member3@test.com` (`MEMBER`)
- `member4@test.com` (`MEMBER`)

### 5) Start backend

```bash
npm run dev
```

### 6) Start frontend (new terminal)

```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

## Default Local URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api` (or your backend `PORT`)
- Health check: `GET http://localhost:5000/api/health`

## Frontend Routes

- `/` - Landing page
- `/login` - Login
- `/signup` - Signup
- `/app` - Dashboard
- `/app/projects` - Projects list
- `/app/projects/:id` - Project details
- `/app/tasks` - Task management
- `/app/profile` - User profile

## API Routes (Summary)

- Auth: `/api/auth/signup`, `/api/auth/login`
- Users: `/api/users`, `/api/users/me`
- Projects: `/api/projects`
- Tasks: `/api/tasks`
- Dashboard: `/api/dashboard`

Detailed API request/response details are in `backend/API.md`.

## Security and Validation

- Passwords hashed with bcrypt before DB write
- JWT verification on protected routes
- Role-based middleware for admin operations
- Zod request validation for auth/project/task payloads
- Helmet, CORS allow-list, and request rate limiting enabled

## Troubleshooting

- **403 on project creation:** login with `admin@test.com`
- **Invalid token / 401:** log out and log in again
- **Prisma connection errors:** verify PostgreSQL is running and `DATABASE_URL` is correct
- **CORS issues:** ensure `CLIENT_URL` in backend matches frontend host/port


