#!/bin/bash
# =============================================================
# Git Setup Script — DevOps Mini Project
# Run this inside your project folder
# =============================================================

set -e

echo "🚀 Initializing Git repository..."
git init

git config user.email "student@example.com"
git config user.name "Your Name"

# ── Commit 1: Initial project structure ──────────────────────
git add README.md .gitignore
git commit -m "chore: initialize project with README and gitignore"

# ── Commit 2: Backend API ─────────────────────────────────────
git checkout -b feature/backend-api
git add backend/
git commit -m "feat(backend): add Express REST API with MongoDB

- Add CRUD endpoints for tasks (/api/tasks)
- Add /health endpoint returning {status: ok}
- Add /about endpoint with student info
- Add /api/stats for task statistics
- Configure dotenv for environment variables"

# ── Commit 3: Frontend UI ─────────────────────────────────────
git checkout -b feature/frontend-ui
git add frontend/
git commit -m "feat(frontend): add task manager UI with nginx

- Single-page app with Tasks, About, Health pages
- Form to create tasks with priority selection
- Task list with toggle complete and delete
- Stats dashboard (total, done, pending, urgent)
- Nginx reverse proxy configuration"

# ── Commit 4: Docker setup ────────────────────────────────────
git checkout -b feature/docker-setup
git add backend/Dockerfile frontend/Dockerfile backend/.dockerignore frontend/.dockerignore
git commit -m "chore(docker): add multi-stage Dockerfiles for BE and FE

- Backend: Node 20 Alpine with non-root user and healthcheck
- Frontend: Nginx Alpine with custom reverse proxy config
- .dockerignore to keep images lean"

# ── Commit 5: Docker Compose ──────────────────────────────────
git add docker-compose.yml
git commit -m "chore(compose): add docker-compose with 3-service stack

- MongoDB 7.0 with persistent volume
- Backend with env_file and depends_on healthcheck
- Frontend proxying /api, /health, /about to backend
- Custom bridge network: taskmanager-network"

# ── Merge to develop ──────────────────────────────────────────
git checkout -b develop
git merge feature/backend-api --no-ff -m "merge: feature/backend-api into develop"
git merge feature/frontend-ui --no-ff -m "merge: feature/frontend-ui into develop"
git merge feature/docker-setup --no-ff -m "merge: feature/docker-setup into develop"

# ── Final commit on develop ────────────────────────────────────
git add .
git commit -m "chore: add env.example and finalize project config" 2>/dev/null || true

# ── Merge to main ─────────────────────────────────────────────
git checkout main 2>/dev/null || git checkout -b main
git merge develop --no-ff -m "release: v1.0.0 — complete DevOps mini project"

echo ""
echo "✅ Git setup complete!"
echo ""
echo "Branches created:"
git branch
echo ""
echo "Commit history:"
git log --oneline
echo ""
echo "Next steps:"
echo "  1. Create a GitHub repo: https://github.com/new"
echo "  2. git remote add origin https://github.com/YOUR_USER/devops-taskmanager.git"
echo "  3. git push -u origin main"
echo "  4. git push origin develop feature/backend-api feature/frontend-ui feature/docker-setup"
