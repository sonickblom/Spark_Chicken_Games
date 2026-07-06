# Spark Chicken Games - Makefile
# Usage: make <target>

.PHONY: help install dev dev-frontend dev-backend build build-frontend build-backend build-backend-bin lint lint-fix typecheck test test-frontend test-backend docker-up docker-up-infra docker-down docker-logs docker-logs-api docker-logs-infra docker-build docker-restart db-migrate start clean reset

# Default target
help:
	@echo "Spark Chicken Games - Available Commands"
	@echo ""
	@echo "Quick Start:"
	@echo "  make install        Install all dependencies (pnpm + Go modules)"
	@echo "  make dev            Run frontend + backend in dev mode (requires DB + Redis)"
	@echo "  make dev-frontend   Run only frontend (Next.js on :3000)"
	@echo "  make dev-backend    Run only backend (Go/Gin on :8080) - requires DB + Redis"
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
	@echo "  make db-migrate     Run database migrations"
	@echo ""
	@echo "Quality:"
	@echo "  make lint           Run linters (frontend)"
	@echo "  make lint-fix       Fix linting issues (frontend)"
	@echo "  make typecheck      Run TypeScript type checking (frontend)"
	@echo "  make test           Run all tests"
	@echo "  make test-frontend  Run frontend tests only"
	@echo "  make test-backend   Run backend tests only"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean          Remove build artifacts and node_modules"
	@echo "  make reset          Clean + reinstall everything"

# ── Install dependencies ──────────────────────────────────────────────────────

install: install-frontend install-backend

install-frontend:
	@echo "  Installing frontend dependencies..."
	cd frontend && pnpm install

install-backend:
	@echo "  Installing Go modules..."
	cd backend && go mod download

# ── Development ───────────────────────────────────────────────────────────────

dev:
	@echo ""
	@echo "  ╔══════════════════════════════════════════════╗"
	@echo "  ║         ✦ Spark Chicken Games ✦             ║"
	@echo "  ║                                              ║"
	@echo "  ║  Backend:  http://localhost:8080             ║"
	@echo "  ║  Frontend: http://localhost:3000             ║"
	@echo "  ║                                              ║"
	@echo "  ║  Pressione Ctrl+C para parar                 ║"
	@echo "  ╚══════════════════════════════════════════════╝"
	@echo ""
	trap 'kill 0 2>/dev/null' EXIT; \
		(cd backend && go run ./cmd/api) & \
		(cd frontend && pnpm dev) & \
		wait

dev-frontend:
	cd frontend && pnpm dev

dev-backend:
	cd backend && go run ./cmd/api

# ── Docker ────────────────────────────────────────────────────────────────────

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

# ── Database ──────────────────────────────────────────────────────────────────

db-migrate:
	@echo "  Running database migrations..."
	cd backend && go run ./cmd/migrate

# ── Build ─────────────────────────────────────────────────────────────────────

build: build-frontend build-backend

build-frontend:
	cd frontend && pnpm build

build-backend: build-backend-bin

build-backend-bin:
	@echo "  Building backend binary..."
	cd backend && go build -o bin/api ./cmd/api

# ── Quality ───────────────────────────────────────────────────────────────────

lint:
	cd frontend && pnpm lint

lint-fix:
	cd frontend && pnpm lint --fix

typecheck:
	cd frontend && pnpm typecheck

test: test-frontend test-backend

test-frontend:
	cd frontend && pnpm test

test-backend:
	cd backend && go test ./...

# ── Utilities ─────────────────────────────────────────────────────────────────

clean:
	@echo "  Cleaning build artifacts..."
	rm -rf frontend/node_modules
	rm -rf frontend/.next
	rm -rf backend/bin
	rm -rf node_modules
	cd backend && go clean -cache -modcache -testcache 2>/dev/null || true

reset: clean install
	@echo "  Removing Docker volumes..."
	cd backend && docker-compose down -v 2>/dev/null || true
