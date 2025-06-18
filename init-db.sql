-- Create database if it doesn't exist
SELECT 'CREATE DATABASE auth_system_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'auth_system_db');

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE auth_system_db TO postgres;