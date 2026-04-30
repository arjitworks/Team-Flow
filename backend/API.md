# API Documentation

Base URL: `http://localhost:<PORT>/api`

## Auth
- `POST /auth/signup` - Register user
- `POST /auth/login` - Login user

## Users
- `GET /users/me` - Current user profile
- `GET /users` - List users (Admin only)

## Projects
- `GET /projects` - List projects (role scoped)
- `GET /projects/:id` - Project details
- `POST /projects` - Create project (Admin)
- `POST /projects/:id/members` - Add member (Admin)
- `DELETE /projects/:id/members/:userId` - Remove member (Admin)
- `DELETE /projects/:id` - Delete project (Admin)

## Tasks
- `GET /tasks?status=&assignedTo=&projectId=` - Filter tasks
- `POST /tasks` - Create task (Admin)
- `PATCH /tasks/:id/status` - Update task status

## Dashboard
- `GET /dashboard` - Role-based task statistics

## Notifications
- `GET /notifications` - List latest notifications for current user
- `PATCH /notifications/:id/read` - Mark one notification as read
- `PATCH /notifications/read-all` - Mark all notifications as read

## Auth Header
`Authorization: Bearer <jwt_token>`
