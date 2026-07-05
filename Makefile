# Spark Chicken Games - Makefile
# Usage: make <target>

.PHONY: help install dev dev-frontend dev-backend build lint test start docker-up docker-up-infra docker-down docker-logs docker-build db-migrate db-studio clean

# Default target
help:
	@echo "Spark Chicken Games - Available Commands"
	@echo ""
	@echo "🚀 Start (build + docker + dev servers):"
	@echo "  make start         Build everything, start Docker services, and run dev servers"
	@echo ""
	@echo "Development:"
	@echo "  make install        Install all dependencies (pnpm + Go modules)"
	@echo "  make dev            Run frontend + backend in parallel"
	@echo "  make dev-frontend   Run only frontend (Next.js on :3000)"
	@echo "  make dev-backend    Run only backend (Go/Gin on :8080) - requires DB/Redis"
	@echo ""
	@echo "Docker (Backend + DB + Redis):"
	@echo "  make docker-up      Start PostgreSQL, Redis, and Backend API"
	@echo "  make docker-down    Stop all Docker containers"
	@echo "  make docker-logs    Follow logs from all containers"
	@echo "  make docker-logs-api Follow only API logs"
	@echo "  make docker-up-infra  Start only PostgreSQL + Redis (no API)"
	@echo "  make docker-build   Build Docker images"
	@echo "  make docker-restart Restart all containers"
	@echo ""
	@echo "Database:"
	@echo "  make db-migrate     Run database migrations (backend)"
	@echo "  make db-studio      Open database studio (backend)"
	@echo "  make db-generate    Generate database code (backend)"
	@echo ""
	@echo "Build & Quality:"
	@echo "  make build          Build frontend + backend"
	@echo "  make build-frontend Build only frontend"
	@echo "  make build-backend  Build only backend"
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
docker-up:
	cd backend && docker-compose up -d

docker-up-infra:
	cd backend && docker-compose up -d postgres redis

docker-down:
	cd backend && docker-compose down

docker-logs:
	cd backend && docker-compose logs -f

docker-logs-api:
	cd backend && docker-compose logs -f api

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

# Start everything (build + docker infra + dev servers)
start: build-frontend build-backend docker-up-infra
	@echo ""
	@echo "🚀 Starting frontend (Next.js :3000) and backend (Go/Gin :8080)..."
	@echo ""
	@trap 'kill 0' EXIT; \
	(cd frontend && pnpm dev) & \
	(cd backend && ./bin/api) & \
	wait

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
