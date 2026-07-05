# Spark Chicken Games - Makefile
# Usage: make <target>

.PHONY: help install dev dev-frontend dev-backend build build-frontend build-backend lint lint-fix test docker-up docker-up-infra docker-down docker-logs docker-logs-api docker-logs-infra docker-build docker-restart db-migrate db-studio db-generate start clean reset

# Default target
help:
	@echo "Spark Chicken Games - Available Commands"
	@echo ""
	@echo "Quick Start:"
	@echo "  make install        Install all dependencies (pnpm + Go modules)"
	@echo "  make start          Build backend + frontend, start Docker infra, run both"
	@echo "  make dev            Run frontend + backend in dev mode"
	@echo ""
	@echo "Development:"
	@echo "  make dev-frontend   Run only frontend (Next.js on :3000)"
	@echo "  make dev-backend    Run only backend (Go/Gin on :8080) - requires DB/Redis"
	@echo ""
	@echo "Build:"
	@echo "  make build          Build frontend + backend"
	@echo "  make build-frontend Build only frontend"
	@echo "  make build-backend  Build only backend"
	@echo "  make build-backend-bin  Build Go binary (bin/api)"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up      Start PostgreSQL, Redis, and Backend API"
	@echo "  make docker-up-infra  Start only PostgreSQL and Redis"
	@echo "  make docker-down    Stop all Docker containers"
	@echo "  make docker-logs    Follow logs from all containers"
	@echo "  make docker-logs-api  Follow only API logs"
	@echo "  make docker-logs-infra Follow only infra logs (postgres, redis)"
	@echo "  make docker-build   Build Docker images"
	@echo "  make docker-restart Restart all containers"
	@echo ""
	@echo "Database:"
	@echo "  make db-migrate     Run database migrations (backend)"
	@echo "  make db-studio      Open database studio (backend)"
	@echo "  make db-generate    Generate database code (backend)"
	@echo ""
	@echo "Quality:"
	@echo "  make lint           Run linters on all packages"
	@echo "  make lint-fix       Fix linting issues"
	@echo "  make test           Run tests on all packages"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean          Remove build artifacts and node_modules"
	@echo "  make reset          Clean + reinstall everything"

# Install all dependencies
install:
	pnpm install
	cd backend && go mod download

# Development
dev:
	pnpm dev

dev-frontend:
	pnpm dev:frontend

dev-backend:
	pnpm dev:backend

# Docker commands (run from backend directory)
# ── Start (build + infra + run) ────────────────────────────────────────────

start: docker-up-infra build-backend
	@echo ""
	@echo "  ╔══════════════════════════════════════════════╗"
	@echo "  ║        ✦ Spark Chicken Games ✦             ║"
	@echo "  ║                                            ║"
	@echo "  ║  Backend:  http://localhost:8080            ║"
	@echo "  ║  Frontend: http://localhost:3000            ║"
	@echo "  ║                                            ║"
	@echo "  ║  Pressione Ctrl+C para parar                ║"
	@echo "  ╚══════════════════════════════════════════════╝"
	@echo ""
	# Run backend and frontend in parallel, kill both on exit
	trap 'kill 0 2>/dev/null' EXIT; \
	cd backend && ./bin/api & \
	cd frontend && pnpm dev & \
	wait

# ── Docker ────────────────────────────────────────────────────────────────

docker-up-infra:
	cd backend && docker-compose up -d postgres redis

docker-up:
	cd backend && docker-compose up -d

docker-down:
	cd backend && docker-compose down

docker-logs:
	cd backend && docker-compose logs -f

docker-logs-api:
	cd backend && docker-compose logs -f api

docker-logs-infra:
	cd backend && docker-compose logs -f postgres redis

docker-build:
	cd backend && docker-compose build

docker-restart:
	cd backend && docker-compose restart

# Database commands
db-migrate:
	pnpm db:migrate

db-studio:
	pnpm db:studio

db-generate:
	pnpm db:generate

# Build
build:
	pnpm build

build-frontend:
	pnpm build:frontend

build-backend:
	cd backend && go build -o bin/api ./cmd/api

# Linting
lint:
	pnpm lint

lint-fix:
	pnpm lint:fix

# Testing
test:
	pnpm test

# Clean up
clean:
	rm -rf node_modules
	rm -rf frontend/node_modules
	rm -rf frontend/.next
	cd backend && go clean -cache -modcache -testcache

# Full reset
reset: clean install
	cd backend && docker-compose down -v 2>/dev/null || true
