#!/bin/bash
# =============================================================
# Docker Hub Build & Push Script
# Usage: ./docker-push.sh YOUR_DOCKERHUB_USERNAME
# =============================================================

USERNAME=${1:-"your-dockerhub-username"}
VERSION="1.0.0"

echo "🐳 Building and pushing images for user: $USERNAME"

# ── Build Backend ──────────────────────────────────────────────
echo ""
echo "📦 Building backend image..."
docker build -t $USERNAME/taskmanager-backend:latest \
             -t $USERNAME/taskmanager-backend:$VERSION \
             ./backend

# ── Build Frontend ─────────────────────────────────────────────
echo ""
echo "📦 Building frontend image..."
docker build -t $USERNAME/taskmanager-frontend:latest \
             -t $USERNAME/taskmanager-frontend:$VERSION \
             ./frontend

# ── Login & Push ───────────────────────────────────────────────
echo ""
echo "🔐 Logging into Docker Hub..."
docker login

echo ""
echo "⬆️  Pushing backend..."
docker push $USERNAME/taskmanager-backend:latest
docker push $USERNAME/taskmanager-backend:$VERSION

echo ""
echo "⬆️  Pushing frontend..."
docker push $USERNAME/taskmanager-frontend:latest
docker push $USERNAME/taskmanager-frontend:$VERSION

echo ""
echo "✅ Done! Images available at:"
echo "   https://hub.docker.com/r/$USERNAME/taskmanager-backend"
echo "   https://hub.docker.com/r/$USERNAME/taskmanager-frontend"
