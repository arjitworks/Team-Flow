TEAM TASK MANAGER
=================

Overview
--------
Team Task Manager is a full-stack web app for managing projects and tasks with role-based access:
- ADMIN: create/delete projects, manage members, assign tasks
- MEMBER: view assigned work and update task status

Tech Stack
----------
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT + bcrypt
- Validation: Zod

Architecture
------------
1) User logs in/signup via backend auth API.
2) Backend returns JWT token.
3) Frontend sends token in Authorization header.
4) Backend auth middleware validates token and user role.
5) Prisma handles relational data and DB operations.

Project Structure
-----------------
Team Flow/
  frontend/
    src/
      api/
      components/
      context/
      pages/
  backend/
    prisma/
      schema.prisma
      seed.js
    src/
      config/
      controllers/
      middlewares/
      routes/
      validators/
  README.md
  README.txt

Local Setup
-----------
Prerequisites:
- Node.js 18+
- PostgreSQL running locally

Backend setup:
1) cd backend
2) cp .env.example .env
3) npm install
4) npx prisma generate
5) npx prisma migrate dev --name init
6) npm run seed
7) npm run dev

Frontend setup (new terminal):
1) cd frontend
2) cp .env.example .env
3) npm install
4) npm run dev

Default URLs
------------
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api (or your configured PORT)
- Health check: http://localhost:5001/api/health (if backend runs on 5001)

Seed Test Users
---------------
Password for all: Test@12345
- admin@test.com (ADMIN)
- member1@test.com (MEMBER)
- member2@test.com (MEMBER)
- member3@test.com (MEMBER)
- member4@test.com (MEMBER)

Core Features
-------------
- JWT authentication (signup/login)
- Role-based access control
- Project and member management
- Task assignment and status tracking
- Dashboard analytics (total/by-status/overdue/assigned)
- Assignment notifications (read + mark all read)

Main API Groups
---------------
- /api/auth
- /api/users
- /api/projects
- /api/tasks
- /api/dashboard
- /api/notifications

For full details, refer to:
- README.md
- backend/API.md
