#!/bin/bash

echo "🧹 Cleaning up Docker resources..."

# Stop and remove containers
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Remove unused volumes
docker volume prune -f

# Remove unused networks
docker network prune -f

echo "✅ Cleanup complete!"