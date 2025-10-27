# Naturem Setup Guide

This guide will help you set up and run the Naturem application locally or in production.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Docker Setup](#docker-setup)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **PostgreSQL**: Version 15.x or higher (or use Docker)
- **Git**: For version control

### Optional Software
- **Docker**: Version 20.x or higher
- **Docker Compose**: Version 2.x or higher
- **kubectl**: For Kubernetes deployment
- **A code editor**: VS Code, WebStorm, or your preferred IDE

## Local Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/chnaveen1998-bit/Naturem.git
cd Naturem
```

### Step 2: Install PostgreSQL (if not using Docker)

#### On macOS (using Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### On Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql-15 postgresql-contrib
sudo systemctl start postgresql
```

#### On Windows
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### Step 3: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# In PostgreSQL shell, run:
CREATE DATABASE naturem;
CREATE USER naturem_user WITH PASSWORD 'naturem_password';
GRANT ALL PRIVILEGES ON DATABASE naturem TO naturem_user;
\q
```

### Step 4: Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your preferred editor
# Update the following values:
# - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD (if different from defaults)
# - JWT_SECRET (use a strong secret for production)
# - ADMIN_EMAIL and ADMIN_PASSWORD (your admin credentials)
```

### Step 5: Install Dependencies

```bash
# Install all dependencies (both frontend and backend)
npm run install:all

# Or install separately:
cd backend && npm install
cd ../frontend && npm install
```

### Step 6: Initialize Database

```bash
# Navigate to backend directory
cd backend

# Run migrations to create tables
npm run migrate

# Seed the database with sample data
npm run seed

# Go back to root
cd ..
```

### Step 7: Start Development Servers

#### Option A: Start Both Servers (Recommended)
```bash
# From root directory
npm run dev
```

This will start:
- Backend on http://localhost:3001
- Frontend on http://localhost:3000

#### Option B: Start Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 8: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health

### Step 9: Test Login

Use the default admin credentials:
- **Email**: admin@naturem.com
- **Password**: admin123

Or register a new account at http://localhost:3000/register

## Docker Setup

### Step 1: Install Docker

Download and install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)

### Step 2: Configure Environment

```bash
# Copy environment file (if not already done)
cp .env.example .env

# Edit .env if needed
# Docker Compose will use these values
```

### Step 3: Start Services

```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker-compose up -d

# Check if services are running
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 4: Initialize Database

```bash
# Wait for PostgreSQL to be ready (about 10-20 seconds)
sleep 20

# Run migrations
docker-compose exec backend npm run migrate

# Seed data
docker-compose exec backend npm run seed
```

### Step 5: Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api-docs

### Docker Management Commands

```bash
# Stop services
docker-compose down

# Rebuild images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f [service_name]

# Execute commands in containers
docker-compose exec backend npm test
docker-compose exec frontend npm run lint

# Remove all containers and volumes
docker-compose down -v
```

## Production Deployment

### Option 1: Docker in Production

```bash
# Build production images
docker-compose -f docker-compose.yml build

# Start with production settings
NODE_ENV=production docker-compose up -d

# Or use docker-compose.prod.yml if you create one
```

### Option 2: Kubernetes Deployment

See [k8s/README.md](k8s/README.md) for detailed Kubernetes deployment instructions.

Quick overview:

```bash
# Apply all manifests
kubectl apply -f k8s/

# Wait for pods to be ready
kubectl wait --for=condition=ready pod --all -n naturem --timeout=300s

# Initialize database
kubectl exec -it -n naturem deployment/backend -- npm run migrate
kubectl exec -it -n naturem deployment/backend -- npm run seed

# Get service URL
kubectl get svc frontend-service -n naturem
```

### Option 3: Manual Deployment

#### Backend Deployment

```bash
cd backend

# Install production dependencies only
npm ci --only=production

# Build TypeScript to JavaScript
npm run build

# Set environment variables
export NODE_ENV=production
export DB_HOST=your-db-host
export DB_USER=your-db-user
export DB_PASSWORD=your-db-password
export JWT_SECRET=your-jwt-secret

# Start server
npm start
```

#### Frontend Deployment

```bash
cd frontend

# Install dependencies
npm ci

# Build for production
npm run build

# Deploy the dist/ folder to your web server
# Or use a static hosting service like:
# - Netlify
# - Vercel
# - AWS S3 + CloudFront
# - GitHub Pages
```

## Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run in watch mode
npm test -- --watch
```

### All Tests

```bash
# From root directory
npm test
```

## Linting and Code Quality

### Lint Backend

```bash
cd backend
npm run lint
```

### Lint Frontend

```bash
cd frontend
npm run lint
```

### Lint Everything

```bash
npm run lint
```

## Building for Production

### Build Backend

```bash
cd backend
npm run build
# Output will be in dist/ directory
```

### Build Frontend

```bash
cd frontend
npm run build
# Output will be in dist/ directory
```

### Build Everything

```bash
npm run build
```

## Troubleshooting

### Issue: Database Connection Failed

**Solution:**
1. Verify PostgreSQL is running: `pg_isready`
2. Check credentials in .env file
3. Verify database exists: `psql -U postgres -l`
4. Check PostgreSQL logs for errors

### Issue: Port Already in Use

**Solution:**
```bash
# Find process using port 3000 or 3001
lsof -i :3000
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or change ports in .env:
PORT=3002  # for backend
```

### Issue: npm install Fails

**Solution:**
1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules: `rm -rf node_modules package-lock.json`
3. Reinstall: `npm install`
4. Check Node.js version: `node -v` (should be 18+)

### Issue: TypeScript Compilation Errors

**Solution:**
1. Install dependencies: `npm install`
2. Check tsconfig.json is present
3. Run: `npx tsc --noEmit` to see all errors
4. Clear dist folder: `rm -rf dist`

### Issue: Docker Container Won't Start

**Solution:**
```bash
# Check logs
docker-compose logs [service_name]

# Restart service
docker-compose restart [service_name]

# Rebuild images
docker-compose build --no-cache

# Remove and recreate
docker-compose down
docker-compose up -d
```

### Issue: Migrations Fail

**Solution:**
1. Check database connection
2. Drop and recreate database:
   ```sql
   DROP DATABASE naturem;
   CREATE DATABASE naturem;
   ```
3. Run migrations again: `npm run migrate`

### Issue: Frontend Can't Connect to Backend

**Solution:**
1. Check backend is running on http://localhost:3001
2. Verify REACT_APP_API_URL in .env
3. Check browser console for CORS errors
4. Ensure backend CORS is configured correctly

### Issue: PWA Not Installing

**Solution:**
1. Must be served over HTTPS (except localhost)
2. Check manifest.json is accessible
3. Verify service worker registration in browser DevTools
4. Clear browser cache and try again

## Environment Variables Reference

### Backend (.env)

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=naturem
DB_USER=naturem_user
DB_PASSWORD=naturem_password

# Server
NODE_ENV=development
PORT=3001

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Admin
ADMIN_EMAIL=admin@naturem.com
ADMIN_PASSWORD=admin123
```

### Frontend (.env)

```bash
REACT_APP_API_URL=http://localhost:3001
REACT_APP_NAME=Naturem
```

## Additional Resources

- [API Documentation](http://localhost:3001/api-docs) (when running)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [GitHub Issues](https://github.com/chnaveen1998-bit/Naturem/issues)
2. Review the [API documentation](http://localhost:3001/api-docs)
3. Check application logs
4. Open a new issue with:
   - Description of the problem
   - Steps to reproduce
   - Error messages
   - Your environment (OS, Node version, etc.)

## Next Steps

After setup:

1. Explore the application features
2. Review the codebase
3. Read [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
4. Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for architecture details
5. Start building your own features!

Happy coding! 🚀
