#!/bin/bash

echo "🧹 Cleaning up Docker resources created by the project..."

# Stop and remove all services (volumes + images)
docker-compose -f docker-compose.yml down -v --rmi all

# If dev override file was used, clean that too
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v --rmi all

# Remove unused Docker volumes
docker volume prune -f

# Remove unused Docker networks
docker network prune -f

# Optionally: Remove dangling images (intermediate layers)
docker image prune -f

# Optionally: Remove build cache (can reclaim GBs, but rebuild will be slower)
read -p "⚠️  Do you want to clear the Docker build cache as well? [y/N]: " confirm
if [[ "$confirm" =~ ^[Yy]$ ]]; then
  docker builder prune -a -f
fi

echo "✅ Cleanup complete!"