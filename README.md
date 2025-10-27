# Naturem

A Progressive Web Application (PWA) for discovering and sharing natural remedies and wellness solutions.

## Features

- 🔐 **Authentication**: Secure user registration and login
- 💊 **Remedy Management**: Browse, search, and manage natural remedies
- 📝 **User Submissions**: Submit and share your own remedies
- 📋 **Boards**: Organize remedies into custom collections
- 🔍 **Advanced Search**: BM25 and semantic search capabilities
- 👨‍💼 **Admin Dashboard**: Manage users, remedies, and content
- 📱 **PWA Support**: Install as a native app on any device
- 🔔 **Offline Support**: Access content without an internet connection

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- React Router for navigation
- Axios for API calls
- PWA with service worker support

### Backend
- Node.js with TypeScript
- Express.js framework
- PostgreSQL database
- JWT authentication
- OpenAPI/Swagger documentation
- BM25 and semantic search

### Infrastructure
- Docker and Docker Compose
- GitHub Actions for CI/CD
- Kubernetes deployment manifests

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+ (or use Docker)
- Docker and Docker Compose (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/chnaveen1998-bit/Naturem.git
cd Naturem
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Install dependencies:
```bash
npm run install:all
```

### Development

#### Using Docker (Recommended)

```bash
# Start all services
npm run docker:up

# Stop all services
npm run docker:down
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api-docs

#### Local Development

1. Start PostgreSQL (if not using Docker):
```bash
# Install and start PostgreSQL locally
```

2. Initialize the database:
```bash
cd backend
npm run migrate
npm run seed
```

3. Start development servers:
```bash
# In the root directory
npm run dev
```

Or run them separately:
```bash
# Backend (in one terminal)
npm run dev:backend

# Frontend (in another terminal)
npm run dev:frontend
```

### Building for Production

```bash
# Build both frontend and backend
npm run build

# Or build separately
npm run build:backend
npm run build:frontend
```

### Testing

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:backend

# Run frontend tests only
npm run test:frontend
```

### Linting

```bash
# Lint all code
npm run lint
```

## API Documentation

Once the backend is running, access the OpenAPI documentation at:
- Swagger UI: http://localhost:3001/api-docs
- OpenAPI JSON: http://localhost:3001/api-docs.json

## Project Structure

```
Naturem/
├── backend/              # Node.js + TypeScript backend
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   ├── services/     # Business logic
│   │   ├── database/     # DB schema and migrations
│   │   └── utils/        # Utility functions
│   ├── tests/            # Backend tests
│   └── Dockerfile
├── frontend/             # React + TypeScript frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── hooks/        # Custom React hooks
│   │   ├── context/      # React context
│   │   └── utils/        # Utility functions
│   ├── public/           # Static files and PWA assets
│   └── Dockerfile
├── k8s/                  # Kubernetes manifests
├── .github/
│   └── workflows/        # GitHub Actions CI/CD
└── docker-compose.yml    # Docker composition
```

## Deployment

### Docker

```bash
# Build images
npm run docker:build

# Start services
npm run docker:up
```

### Kubernetes

```bash
# Apply manifests
kubectl apply -f k8s/
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.