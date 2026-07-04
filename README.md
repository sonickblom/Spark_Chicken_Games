# Spark Chicken Games

A modern gaming platform built with a monorepo architecture using **pnpm workspaces**.

## 🏗️ Architecture

```
Spark_Chicken_Games/
├── frontend/          # Next.js 15 + React 18 + TypeScript
├── backend/           # Go 1.22 + Gin + PostgreSQL + Redis
└── package.json       # pnpm workspace root
```

| Component | Tech Stack | Port |
|-----------|------------|------|
| **Frontend** | Next.js 15, React 18, TypeScript, Tailwind CSS | 3000 |
| **Backend** | Go 1.22, Gin, GORM, PostgreSQL, Redis | 8080 |
| **Database** | PostgreSQL 16 | 5432 |
| **Cache** | Redis 7 | 6379 |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **pnpm** 9+ (`npm install -g pnpm`)
- **Go** 1.22+
- **Docker** & **Docker Compose** (for backend services)

### Installation

```bash
# Clone and install dependencies
git clone <repo-url>
cd Spark_Chicken_Games
make install
```

### Development

**Option 1: Everything with Make (recommended)**
```bash
# Terminal 1 - Start backend services (PostgreSQL + Redis + API)
make docker-up

# Terminal 2 - Start frontend + backend in parallel
make dev
```

**Option 2: Separate terminals**
```bash
# Terminal 1 - Backend services
make docker-up

# Terminal 2 - Backend API only (if running Go locally)
make dev-backend

# Terminal 3 - Frontend only
make dev-frontend
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- API Health: http://localhost:8080/health

---

## 📋 Available Commands

### Using Make (recommended)

```bash
make help           # Show all commands
make install        # Install all dependencies
make dev            # Run frontend + backend (parallel)
make dev-frontend   # Frontend only (port 3000)
make dev-backend    # Backend only (port 8080)

# Docker (backend + DB + Redis)
make docker-up      # Start all containers
make docker-down    # Stop all containers
make docker-logs    # Follow all logs
make docker-logs-api # Follow API logs only
make docker-build   # Build Docker images
make docker-restart # Restart containers

# Database (via backend)
make db-migrate     # Run migrations
make db-studio      # Open DB studio
make db-generate    # Generate DB code

# Build & Quality
make build          # Build all packages
make build-frontend # Build frontend only
make build-backend  # Build backend only
make lint           # Lint all packages
make lint-fix       # Auto-fix lint issues
make test           # Run all tests

# Cleanup
make clean          # Remove build artifacts
make reset          # Clean + reinstall
```

### Using pnpm directly

```bash
# Development
pnpm dev              # Frontend + Backend (concurrently)
pnpm dev:frontend     # Frontend only
pnpm dev:backend      # Backend only

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Prisma Studio

# Build
pnpm build            # Build all
pnpm build:frontend   # Build frontend
pnpm build:backend    # Build backend

# Quality
pnpm lint             # Lint all
pnpm lint:fix         # Fix lint issues
pnpm test             # Run tests
```

---

## 🐳 Docker Services (Backend)

The `backend/docker-compose.yml` includes:

| Service | Port | Description |
|---------|------|-------------|
| `postgres` | 5432 | PostgreSQL 16 |
| `redis` | 6379 | Redis 7 |
| `api` | 8080 | Go/Gin API server |

```bash
cd backend

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop and remove volumes (clean DB)
docker-compose down -v
```

---

## ⚙️ Configuration

### Backend (`backend/config.yaml`)

```yaml
database:
  host: localhost
  port: 5432
  user: postgres
  password: postgres
  name: spark_chicken_games

redis:
  host: localhost
  port: 6379

server:
  host: 0.0.0.0
  port: 8080

jwt:
  secret: "your-secret-key"
  expires_in: "24h"
```

> **Note**: When using Docker Compose, the config uses `localhost` since containers expose ports to host.

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

---

## 📁 Project Structure

### Frontend (`frontend/`)
```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities & config
│   └── styles/           # Global styles
├── package.json
└── tsconfig.json
```

### Backend (`backend/`)
```
backend/
├── cmd/
│   └── main.go           # Application entry point
├── internal/
│   ├── config/           # Configuration
│   ├── handler/          # HTTP handlers
│   ├── middleware/       # Gin middleware
│   ├── model/            # Data models
│   ├── repository/       # Data access
│   ├── service/          # Business logic
│   └── router/           # Route definitions
├── pkg/                  # Shared packages
├── config.yaml           # Configuration
├── go.mod
├── go.sum
└── docker-compose.yml
```

---

## 🧪 Testing

```bash
# Frontend tests
cd frontend && pnpm test

# Backend tests
cd backend && go test ./...

# All tests via make
make test
```

---

## 🔧 Development Workflow

1. **Start services**: `make docker-up`
2. **Run migrations**: `make db-migrate`
3. **Start dev servers**: `make dev`
4. **Make changes** to frontend/backend
5. **Run tests**: `make test`
6. **Lint**: `make lint`
7. **Build**: `make build`

---

## 📦 Building for Production

```bash
# Build all
make build

# Or individually
make build-frontend  # Output: frontend/.next
make build-backend   # Output: backend/bin/

# Docker production build
cd backend && docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
```

---

## 🧹 Cleanup

```bash
# Remove build artifacts only
make clean

# Nuclear option - remove everything and reinstall
make reset
```

---

## 📝 License

MIT License - feel free to use this project for learning or production.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `make lint` and `make test`
5. Submit a PR