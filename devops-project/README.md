# TaskFlow — DevOps Mini Project

A full-stack Task Manager application built with Node.js, MongoDB, and a vanilla HTML/CSS frontend, fully containerized with Docker and Docker Compose.

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│   Backend   │────▶│   MongoDB   │
│ nginx:80    │     │ express:5000│     │ mongo:27017 │
│ port: 3000  │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

## ✨ Features

- ✅ Create, read, update, delete tasks
- ✅ Task priorities (high / medium / low)
- ✅ Real-time stats dashboard
- ✅ `/about` — Student info page
- ✅ `/health` — Health check endpoint
- ✅ Environment variables via `.env`
- ✅ Full Docker + Docker Compose setup

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed
- Docker Compose v2+

### Run with Docker Compose

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/devops-taskmanager.git
cd devops-taskmanager

# Copy env file
cp backend/.env.example backend/.env

# Start all services
docker compose up -d

# View logs
docker compose logs -f
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/health
- About: http://localhost:5000/about

### Stop

```bash
docker compose down
# To also remove volumes:
docker compose down -v
```

## 🔧 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Backend port |
| `DB_URL` | `mongodb://mongo:27017/taskmanager` | MongoDB connection string |
| `APP_NAME` | `TaskManager` | Application name |
| `STUDENT_NAME` | — | Student full name |
| `STUDENT_ID` | — | Student ID |
| `STUDENT_CLASS` | — | Student class |

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/about` | Student information |
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/stats` | Task statistics |

## 🐳 Docker Hub

```bash
# Pull images
docker pull YOUR_USERNAME/taskmanager-backend:latest
docker pull YOUR_USERNAME/taskmanager-frontend:latest
```

## 🌿 Git Branches

- `main` — Production-ready code
- `develop` — Development integration branch
- `feature/backend-api` — Backend feature development
- `feature/frontend-ui` — Frontend feature development
- `feature/docker-setup` — Docker configuration

## 📁 Project Structure

```
devops-taskmanager/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── index.html
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── README.md
```
