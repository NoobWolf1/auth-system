#!/bin/bash

echo "🚀 Starting Development Environment..."

# Start development services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

echo "🔧 Development environment ready!"
echo "🌐 API available at: http://localhost:3000"
echo "🐛 Debug port: 9229"

echo "📋 Tailing logs (Press Ctrl+C to stop logging and keep containers running)..."
# Start tailing logs from all services in real-time
docker-compose logs -f
