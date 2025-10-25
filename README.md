# Naturem

A Progressive Web Application (PWA) for discovering and sharing natural remedies. Built with React, TypeScript, Node.js, Express, and PostgreSQL.

## Features

- 🌿 **Browse Natural Remedies**: Explore a comprehensive database of natural remedies for common ailments
- 🔍 **Advanced Search**: Full-text search with BM25 ranking and semantic search capabilities
- 👥 **Community Boards**: Engage with the community through discussion boards
- 📝 **User Submissions**: Submit your own remedies for review
- 🔐 **Authentication**: Secure JWT-based authentication
- 📱 **PWA Support**: Install on mobile devices for offline access
- 👨‍💼 **Admin Dashboard**: Manage users, remedies, and submissions
- 🐳 **Docker Support**: Easy deployment with Docker Compose
- ☸️ **Kubernetes Ready**: Production-ready Kubernetes manifests
- 📚 **OpenAPI Documentation**: Auto-generated API documentation

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- React Router for navigation
- Axios for HTTP requests
- PWA with service workers (vite-plugin-pwa)

### Backend
- Node.js with TypeScript
- Express.js framework
- PostgreSQL database
- JWT authentication
- Swagger/OpenAPI documentation
- BM25 full-text search

### DevOps
- Docker & Docker Compose
- GitHub Actions CI/CD
- Kubernetes deployment manifests
- ESLint & TypeScript for code quality
- Jest for testing

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/chnaveen1998-bit/Naturem.git
   cd Naturem
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Setup Database**
   ```bash
   # Create PostgreSQL database
   createdb naturem
   
   # Run migrations
   psql -d naturem -f ../database/schema.sql
   
   # Seed data
   psql -d naturem -f ../database/seed.sql
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api-docs

### Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Default Credentials

When using seed data:
- **Admin**: admin@naturem.com / admin123
- **User**: user1@example.com / user123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Remedies
- `GET /api/remedies` - Get all remedies (paginated)
- `GET /api/remedies/:id` - Get remedy by ID
- `POST /api/remedies` - Create remedy (authenticated)
- `PUT /api/remedies/:id` - Update remedy (authenticated)
- `DELETE /api/remedies/:id` - Delete remedy (authenticated)

### Search
- `GET /api/search?q=query` - Search remedies

### Submissions
- `GET /api/submissions` - Get user submissions (authenticated)
- `POST /api/submissions` - Create submission (authenticated)

### Boards
- `GET /api/boards` - Get all boards
- `GET /api/boards/:id` - Get board with posts
- `POST /api/boards/:id/posts` - Create post (authenticated)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics (admin)
- `GET /api/admin/users` - Get all users (admin)
- `GET /api/admin/submissions` - Get all submissions (admin)
- `POST /api/admin/submissions/:id/approve` - Approve submission (admin)
- `POST /api/admin/submissions/:id/reject` - Reject submission (admin)

## Testing

### Backend Tests
```bash
cd backend
npm test
npm run test:watch
```

### Linting
```bash
# Backend
cd backend
npm run lint
npm run lint:fix

# Frontend
cd frontend
npm run lint
```

### Type Checking
```bash
cd backend
npm run typecheck
```

## Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Deployment

### Kubernetes

1. Update configuration in `kubernetes/deployment.yml`
2. Apply manifests:
   ```bash
   kubectl apply -f kubernetes/deployment.yml
   ```

### Environment Variables

#### Backend
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret for JWT tokens
- `FRONTEND_URL` - Frontend URL for CORS

#### Frontend
- `VITE_API_URL` - Backend API URL

## Project Structure

```
Naturem/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── index.ts        # Entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main app component
│   ├── Dockerfile
│   └── package.json
├── database/              # Database files
│   ├── schema.sql         # Database schema
│   └── seed.sql           # Seed data
├── kubernetes/            # K8s manifests
│   └── deployment.yml
├── .github/
│   └── workflows/
│       └── ci.yml         # GitHub Actions CI
├── docker-compose.yml     # Docker Compose config
└── README.md

```

## CI/CD

GitHub Actions workflow runs on push and PR:
- Lints backend and frontend code
- Runs type checking
- Builds both applications
- Runs tests
- Builds Docker images

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Support

For issues and questions, please create an issue in the GitHub repository.
