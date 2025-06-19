# 🔐 Authentication System

A production-ready authentication and user management system built with **Node.js**, **Express**, **Sequelize**, and **PostgreSQL**. It features secure JWT-based authentication, role-based access control, and a RESTful API with Dockerized deployment.

---

## 📦 Features

- ✅ User registration, login, logout, and token refresh
- 🔐 Secure password hashing with bcrypt
- 🔁 JWT access and refresh token support
- 🧑‍💼 Role-Based Access Control (RBAC)
- 👮 Admin endpoints for managing users
- 🌐 OpenAPI 3.0 compliant documentation (`openapi.yml`)
- 🚦 Rate limiting, CORS, and security headers
- 🐳 Docker & Docker Compose for containerized deployment
- 🧪 Jest testing support
- 🛠 Sequelize migrations and seeders
- 🪵 Centralized logging using Winston
- 🔍 Input validation using `express-validator`

---

## 🛠 Technology Stack

- **Backend:** Node.js, Express.js
- **ORM:** Sequelize
- **Database:** PostgreSQL
- **Auth:** JWT (Access & Refresh Tokens), bcrypt
- **Containerization:** Docker, Docker Compose
- **Validation:** express-validator
- **Logging:** Winston
- **Security:** Helmet, Rate Limiting, CORS
- **Documentation:** OpenAPI 3.0 (Swagger)
- **Testing:** Jest, Supertest

---

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js v18+ (for local development without Docker)
- PostgreSQL (if running outside Docker)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/auth-system.git
cd auth-system
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory and configure (add passwords and jwt-secret of your own):

```env
# Server Configuration
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_NAME=auth_system_db
DB_USERNAME=postgres
DB_PASSWORD=
DB_DIALECT=postgres

# JWT Configuration
JWT_SECRET=
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug

API_PREFIX=api

REGULAR_USER_PASSWORD=
ADMIN_USER_PASSWORD=
```

## 🐳 Running with Docker

```bash
# Build and start the services
./start.sh

# Stop all services
./stop.sh

# Clean all docker resources
./clean.sh
```

**API available at:** http://localhost:3000/api

## 🧪 Running in Development

```bash
# Start in development mode (hot reload)
./dev.sh
```

## 🧪 Running Tests

```bash
npm install
npm test
```

---

## 📚 API Documentation

- Full OpenAPI spec available in `openapi.yml`
- Can be imported into Swagger UI for interactive exploration

---

## 📂 Project Structure

```
.
├── src/
│   ├── app.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
├── migrations/
├── seeders/
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.dev
├── .env
├── start.sh
├── stop.sh
├── dev.sh
├── clean.sh
├── openapi.yml
└── README.md
```

---

## 🔐 Authentication Flow

1. **Register** → `/api/auth/register`
2. **Login** → `/api/auth/login` (returns JWTs)
3. **Refresh Token** → `/api/auth/refresh`
4. **Logout** → `/api/auth/logout`

JWT access tokens are required for all protected routes. Use the `Authorization: Bearer <token>` header.

---

## 🧑‍💼 Admin Endpoints

- **Get all users:** `GET /api/admin/users`
- **Get user by ID:** `GET /api/admin/users/:id`
- **Update user status:** `PUT /api/admin/users/:id/status`
- **Delete user:** `DELETE /api/admin/users/:id`

*Requires Admin role with proper permissions.*

---

## 🛡️ Roles & Permissions

**Predefined roles:**
- Admin
- PM
- Legal
- Sales

Each role comes with specific permissions (`user:read`, `user:write`, etc.), managed via Sequelize.

---

## 📝 License

MIT License © 2025 Malay Shukla