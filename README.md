# Mini Kanban Board

A full-stack Kanban board application built with **Next.js, Express.js, TypeScript, Prisma, and PostgreSQL**.

Users can create boards, share boards with other registered users, manage columns and tasks, and move tasks between columns using drag-and-drop.

---

## Features

- User registration and login
- JWT-based authentication
- Protected API routes
- Board creation and management
- Board sharing with registered users
- Board member management
- Role-based board access
  - Board owner
  - Board member

- Column management
- Task management
- Drag-and-drop task movement
- Reorder tasks within the same column
- Move tasks between columns
- Stable task ordering
- PostgreSQL database
- Prisma ORM
- Docker and Docker Compose support
- Responsive frontend

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- dnd-kit
- Fetch API

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma
- PostgreSQL
- JWT
- bcryptjs
- Zod
- CORS

### DevOps

- Docker
- Docker Compose

---

## Project Structure

```text
Mini Kanban Board/
│
├── Backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── board/
│   │   │   ├── column/
│   │   │   ├── task/
│   │   │   └── user/
│   │   │
│   │   ├── middlewares/
│   │   └── ...
│   │
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── .env
│   ├── .env.example
│   ├── .dockerignore
│   ├── .gitignore
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── .dockerignore
│   ├── .gitignore
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

# Installation

## Prerequisites

Make sure the following are installed:

- Node.js 24+
- npm
- Docker Desktop
- Git

Docker Desktop is recommended because it runs PostgreSQL automatically through Docker Compose.

---

# Option 1: Run with Docker

This is the recommended way to run the complete application.

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd "Mini Kanban Board"
```

### 2. Start the application

```bash
docker compose up --build
```

This starts:

- PostgreSQL
- Backend
- Frontend

### 3. Open the application

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:5000
```

PostgreSQL:

```text
localhost:5433
```

---

## Docker Services

| Service    | Port | Description         |
| ---------- | ---: | ------------------- |
| Frontend   | 3000 | Next.js application |
| Backend    | 5000 | Express API         |
| PostgreSQL | 5433 | PostgreSQL database |

Inside Docker, the backend connects to PostgreSQL using:

```text
postgres:5432
```

The `postgres` hostname refers to the PostgreSQL Docker service.

---

# Environment Variables

## Backend

Create:

```text
Backend/.env
```

Example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/mini_kanban"

PORT=5000

ACCESS_TOKEN="your_access_token_secret"
ACCESS_TOKEN_EXPIRES_IN="15m"
```

> The actual `.env` file should not be committed to Git.

The repository includes:

```text
Backend/.env.example
```

as a template.

---

## Frontend

Configure the API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

The frontend uses `localhost:5000` because API requests are made by the browser.

Do not use:

```text
http://backend:5000
```

in the frontend environment variable. `backend` is a Docker service name and is only resolvable from other Docker containers.

---

# Database & Prisma

The project uses PostgreSQL with Prisma ORM.

### Check migration status

From the `Backend` directory:

```bash
npx prisma migrate status
```

### Apply migrations

```bash
npx prisma migrate dev
```

### Generate Prisma Client

```bash
npx prisma generate
```

---

# Option 2: Run Without Docker

Docker is recommended, but the application can also be run locally.

## 1. Start PostgreSQL

Install and start PostgreSQL locally.

Create a database named:

```text
mini_kanban
```

Update `Backend/.env` with your local PostgreSQL connection string.

Example:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/mini_kanban"

PORT=5000

ACCESS_TOKEN="your_access_token_secret"
ACCESS_TOKEN_EXPIRES_IN="15m"
```

## 2. Install backend dependencies

```bash
cd Backend
npm install
```

## 3. Run Prisma migrations

```bash
npx prisma migrate dev
```

## 4. Start the backend

```bash
npm run start:dev
```

The backend will run on:

```text
http://localhost:5000
```

## 5. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

## 6. Start the frontend

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:3000
```

---

# Authentication

The application uses JWT-based authentication.

## Registration

Users can register through:

```http
POST /api/v1/users/register
```

## Login

Users can log in through:

```http
POST /api/v1/auth/login
```

The returned access token is used for authenticated API requests.

Authenticated requests must include:

```http
Authorization: Bearer <access_token>
```

---

# Authorization

The application uses board-level access control.

A user can access a board if they are:

- The board owner
- A member of the board

Unauthorized users cannot access or mutate the board's:

- Columns
- Tasks
- Board data

### Board Owner

The board owner can:

- View the board
- Update the board
- Delete the board
- Add members
- Remove members
- View board members
- Manage columns
- Manage tasks

### Board Member

Board members can:

- View the board
- View columns
- Create columns
- Update columns
- Delete columns
- View tasks
- Create tasks
- Update tasks
- Delete tasks
- Move/reorder tasks

Board members cannot:

- Update the board
- Delete the board
- Add members
- Remove members
- View the board member list

---

# API Documentation

Base URL:

```text
http://localhost:5000/api/v1
```

All endpoints marked **Protected** require:

```http
Authorization: Bearer <access_token>
```

---

## Users

### Register User

```http
POST /users/register
```

**Authentication:** Public

---

## Authentication

### Login

```http
POST /auth/login
```

**Authentication:** Public

### Get Current Session

```http
GET /auth/session
```

**Authentication:** Protected

---

# Boards

### Create Board

```http
POST /boards
```

**Authentication:** Protected

### Get My Boards

```http
GET /boards
```

**Authentication:** Protected

Returns boards where the authenticated user is either:

- Owner
- Member

### Get Board

```http
GET /boards/:id
```

**Authentication:** Protected

### Update Board

```http
PATCH /boards/:id
```

**Authentication:** Protected

**Authorization:** Board owner only

### Delete Board

```http
DELETE /boards/:id
```

**Authentication:** Protected

**Authorization:** Board owner only

---

## Board Members

### Get Board Members

```http
GET /boards/members/:id
```

**Authentication:** Protected

**Authorization:** Board owner only

### Add Member

```http
POST /boards/add-member/:id
```

**Authentication:** Protected

**Authorization:** Board owner only

### Remove Member

```http
DELETE /boards/remove-member/:id
```

**Authentication:** Protected

**Authorization:** Board owner only

---

# Columns

### Create Column

```http
POST /boards/:boardId/columns
```

**Authentication:** Protected

### Get Columns

```http
GET /boards/:boardId/columns
```

**Authentication:** Protected

### Get Column

```http
GET /boards/:boardId/columns/:id
```

**Authentication:** Protected

### Update Column

```http
PATCH /boards/:boardId/columns/:id
```

**Authentication:** Protected

### Delete Column

```http
DELETE /boards/:boardId/columns/:id
```

**Authentication:** Protected

---

# Tasks

### Create Task

```http
POST /boards/:boardId/columns/:columnId/tasks
```

**Authentication:** Protected

### Get Tasks

```http
GET /boards/:boardId/columns/:columnId/tasks
```

**Authentication:** Protected

### Get Task

```http
GET /boards/:boardId/columns/:columnId/tasks/:id
```

**Authentication:** Protected

### Update Task

```http
PATCH /boards/:boardId/columns/:columnId/tasks/:id
```

**Authentication:** Protected

### Delete Task

```http
DELETE /boards/:boardId/columns/:columnId/tasks/:id
```

**Authentication:** Protected

---

# Task Movement & Reordering

Tasks can be moved:

- Within the same column
- Between different columns
- To a specific position

### Move Task

```http
PATCH /boards/:boardId/tasks/:taskId/move
```

**Authentication:** Protected

The movement operation updates the task's:

- Column
- Position

The backend uses a database transaction to keep task ordering consistent when tasks are moved or reordered.

---

# Complete API Endpoint List

| Method | Endpoint                                       | Auth      | Access             |
| ------ | ---------------------------------------------- | --------- | ------------------ |
| POST   | `/users/register`                              | Public    | All                |
| POST   | `/auth/login`                                  | Public    | All                |
| GET    | `/auth/session`                                | Protected | Authenticated user |
| POST   | `/boards`                                      | Protected | Authenticated user |
| GET    | `/boards`                                      | Protected | Authenticated user |
| GET    | `/boards/:id`                                  | Protected | Owner/Member       |
| PATCH  | `/boards/:id`                                  | Protected | Owner              |
| DELETE | `/boards/:id`                                  | Protected | Owner              |
| GET    | `/boards/members/:id`                          | Protected | Owner              |
| POST   | `/boards/add-member/:id`                       | Protected | Owner              |
| DELETE | `/boards/remove-member/:id`                    | Protected | Owner              |
| POST   | `/boards/:boardId/columns`                     | Protected | Owner/Member       |
| GET    | `/boards/:boardId/columns`                     | Protected | Owner/Member       |
| GET    | `/boards/:boardId/columns/:id`                 | Protected | Owner/Member       |
| PATCH  | `/boards/:boardId/columns/:id`                 | Protected | Owner/Member       |
| DELETE | `/boards/:boardId/columns/:id`                 | Protected | Owner/Member       |
| POST   | `/boards/:boardId/columns/:columnId/tasks`     | Protected | Owner/Member       |
| GET    | `/boards/:boardId/columns/:columnId/tasks`     | Protected | Owner/Member       |
| GET    | `/boards/:boardId/columns/:columnId/tasks/:id` | Protected | Owner/Member       |
| PATCH  | `/boards/:boardId/columns/:columnId/tasks/:id` | Protected | Owner/Member       |
| DELETE | `/boards/:boardId/columns/:columnId/tasks/:id` | Protected | Owner/Member       |
| PATCH  | `/boards/:boardId/tasks/:taskId/move`          | Protected | Owner/Member       |

---

# Docker Commands

### Start containers

```bash
docker compose up
```

### Start and rebuild images

```bash
docker compose up --build
```

### Run in detached mode

```bash
docker compose up -d
```

### Check running containers

```bash
docker compose ps
```

### View logs

```bash
docker compose logs
```

### View backend logs

```bash
docker compose logs backend
```

### View frontend logs

```bash
docker compose logs frontend
```

### Stop containers

```bash
docker compose down
```

### Stop containers and remove database volume

> Warning: This deletes the PostgreSQL Docker data.

```bash
docker compose down -v
```

---

# Installation Troubleshooting

## Docker Desktop is not running

If you see errors related to Docker Engine or Docker daemon, make sure Docker Desktop is running.

Then check:

```bash
docker --version
```

and:

```bash
docker compose version
```

After Docker Desktop starts, run:

```bash
docker compose up --build
```

---

## Port 5432 is already in use

If PostgreSQL is already running on your Windows machine, port `5432` may already be occupied.

This project maps Docker PostgreSQL to:

```text
5433:5432
```

So the host connection should use:

```text
localhost:5433
```

For example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/mini_kanban"
```

Inside Docker, the backend still uses:

```text
postgres:5432
```

---

## Port 5000 is already in use

If the backend fails with an error indicating that port `5000` is already in use, stop any locally running backend process before starting the Docker backend.

Check the port on Windows:

```powershell
netstat -ano | findstr :5000
```

Then stop the process if necessary.

---

## Port 3000 is already in use

If the frontend cannot bind to port `3000`, check which process is using it:

```powershell
netstat -ano | findstr :3000
```

Stop the process and run:

```bash
docker compose up
```

again.

---

## Prisma cannot connect to PostgreSQL

First check that PostgreSQL is running:

```bash
docker compose ps
```

You should see:

```text
mini-kanban-postgres
```

running.

You can also test the database directly:

```bash
docker exec -e PGPASSWORD=postgres mini-kanban-postgres psql -U postgres -d mini_kanban -c "SELECT 1;"
```

If the command returns:

```text
1
```

the PostgreSQL container is working.

---

## Prisma migration problems

Check migration status:

```bash
cd Backend
npx prisma migrate status
```

If migrations have not been applied:

```bash
npx prisma migrate dev
```

Then generate Prisma Client:

```bash
npx prisma generate
```

---

## Backend starts locally but Docker backend cannot connect to PostgreSQL

When the backend runs directly on Windows, use:

```text
localhost:5433
```

When the backend runs inside Docker, use:

```text
postgres:5432
```

Docker Compose automatically provides the internal connection:

```yaml
environment:
  DATABASE_URL: postgresql://postgres:postgres@postgres:5432/mini_kanban
```

Do not change this to `localhost` for the Docker backend.

---

## Frontend cannot connect to the backend

Make sure the frontend environment variable points to:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

Then restart the frontend container:

```bash
docker compose up --build frontend
```

Remember that the browser accesses the backend through:

```text
localhost:5000
```

not the Docker service name.

---

## Containers are running but the application is not updated

Rebuild the images:

```bash
docker compose up --build
```

Or rebuild and recreate everything:

```bash
docker compose down
docker compose up --build
```

---

# Security

- Passwords are hashed using bcryptjs.
- Authentication uses JWT access tokens.
- Protected endpoints require authentication.
- Board-level authorization prevents unauthorized access.
- Users cannot access boards they do not own or belong to.
- Environment secrets are stored in `.env`.
- `.env` files are excluded from Git.

---

# Database Models

The main database entities are:

- User
- Board
- BoardMember
- Column
- Task

Relationships:

```text
User
 ├── owns → Board
 └── member of → Board

Board
 ├── has → BoardMember
 ├── has → Column
 └── has → Tasks through Columns

Column
 └── has → Task
```

---

# Task Ordering

Each task has a `position` value.

The task movement API supports:

```text
Same column
    ↓
Reorder task
    ↓
Update positions
```

and:

```text
Column A
    ↓
Move task
    ↓
Column B
    ↓
Insert at requested position
```

The backend performs the necessary position updates inside a database transaction to maintain consistent ordering.

---

# Development

### Backend

```bash
cd Backend
npm install
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Docker

From the project root:

```bash
docker compose up --build
```

---

# License

This project was developed as a technical assessment project.
