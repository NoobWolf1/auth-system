#!/bin/bash

echo "🛑 Stopping Authentication System..."

# Stop all services
docker-compose down

echo "✅ All services stopped!"