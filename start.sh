#!/bin/bash

echo "🚀 Starting Authentication System..."

# Create logs directory
mkdir -p logs

# Start services
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
docker-compose ps

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=50 app

echo "✅ System is ready!"
echo "🌐 API available at: http://localhost:3000"
echo "🔗 Health check: http://localhost:3000/health"
echo "📊 Database accessible at: localhost:5432"