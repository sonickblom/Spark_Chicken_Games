# Spark Chicken Games - Makefile
# Usage: make <target>

.PHONY: help install dev dev-frontend dev-backend build build-frontend build-backend build-backend-bin lint lint-fix typecheck test test-frontend test-backend docker-up docker-up-infra docker-down docker-logs docker-logs-api docker-logs-infra docker-build docker-restart db-migrate db-rollback db-status db-shell db-check-roles db-fix-users db-list-users db-clean-seed start clean reset admin-fix

# Default target
help:
	@echo "Spark Chicken Games - Available Commands"
	@echo ""
	@echo "Quick Start:"
	@echo "  make install        Install all dependencies (pnpm + Go modules)"
	@echo "  make docker-up-infra  Start PostgreSQL + Redis (required before backend)"
	@echo "  make dev-backend    Run backend (Go/Gin on :8080)"
	@echo "  make dev-frontend   Run frontend (Next.js on :3000)"
	@echo "  make dev            Run frontend + backend together"
	@echo "  make start          Start everything (infra + backend + frontend)"
	@echo ""
	@echo "Build:"
	@echo "  make build          Build frontend + backend"
	@echo "  make build-frontend Build only frontend"
	@echo "  make build-backend  Build only backend"
	@echo "  make build-backend-bin  Build Go binary (bin/api)"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up         Start all Docker services (API + PostgreSQL + Redis)"
	@echo "  make docker-up-infra   Start only PostgreSQL and Redis"
	@echo "  make docker-down       Stop all Docker containers"
	@echo "  make docker-logs       Follow logs from all containers"
	@echo "  make docker-logs-api   Follow only API logs"
	@echo "  make docker-logs-infra Follow only infra logs (postgres, redis)"
	@echo "  make docker-build      Build Docker images"
	@echo "  make docker-restart    Restart all containers"
	@echo ""
	@echo "Database:"
	@echo "  make db-migrate       Run database migrations"
	@echo "  make db-rollback      Rollback the last migration"
	@echo "  make db-status        Show migration status"
	@echo "  make db-shell         Open PostgreSQL interactive shell"
	@echo "  make db-check-roles   Verify roles table UUIDs"
	@echo "  make db-list-users    Show all users with roles"
	@echo "  make db-fix-users     Reset non-Samuteg users to 'user' role"
	@echo "  make db-clean-seed    Remove seed/mock data (categories, tags, games)"
	@echo ""
	@echo "Quality:"
	@echo "  make lint           Run linters (frontend)"
	@echo "  make lint-fix       Fix linting issues (frontend)"
	@echo "  make typecheck      Run TypeScript type checking (frontend)"
	@echo "  make test           Run all tests"
	@echo "  make test-frontend  Run frontend tests only"
	@echo "  make test-backend   Run backend tests only"
	@echo ""
	@echo "Admin:"
	@echo "  make admin-fix      Force Samuteg's role to admin (requires DB running)"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean          Remove build artifacts and node_modules"
	@echo "  make reset          Clean + reinstall everything"

# ── Install dependencies ──────────────────────────────────────────────────────

install: install-frontend install-backend

install-frontend:
	@echo "  Installing frontend dependencies..."
	cd frontend && CI=true pnpm install

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

# ── Start (infra + backend + frontend) ────────────────────────────────────────

start:
	@echo "  Starting infrastructure..."
	cd backend && docker compose up -d postgres redis
	@echo "  Waiting for PostgreSQL to be ready..."
	@sleep 3
	@echo "  Running migrations..."
	cd backend && go run ./cmd/migrate 2>/dev/null || true
	@echo ""
	@echo "  ┌─────────────────────────────────────────────────────┐"
	@echo "  │  Run in separate terminals:                        │"
	@echo "  │    make dev-backend    (Go API on :8080)           │"
	@echo "  │    make dev-frontend   (Next.js on :3000)          │"
	@echo "  │                                                     │"
	@echo "  │  Or run both with:    make dev                      │"
	@echo "  └─────────────────────────────────────────────────────┘"
	@echo ""

# ── Docker ────────────────────────────────────────────────────────────────────

docker-up-infra:
	cd backend && docker compose up -d postgres redis

docker-up:
	cd backend && docker compose up -d

docker-down:
	cd backend && docker compose down

docker-logs:
	cd backend && docker compose logs -f

docker-logs-api:
	cd backend && docker compose logs -f api

docker-logs-infra:
	cd backend && docker compose logs -f postgres redis

docker-build:
	cd backend && docker compose build

docker-restart:
	cd backend && docker compose restart

# ── Database ──────────────────────────────────────────────────────────────────

db-migrate:
	@echo "  Running database migrations..."
	cd backend && go run ./cmd/migrate

db-rollback:
	@echo "  Rolling back last migration..."
	cd backend && go run ./cmd/migrate -direction down

db-status:
	@echo "  Migration status:"
	@cd backend && go run ./cmd/migrate -status || true

db-shell:
	@echo "  Opening PostgreSQL shell..."
	@docker exec -it backend-postgres-1 psql -U postgres -d spark_chicken_games 2>/dev/null || \
		echo "  Docker container not running."

db-check-roles:
	@echo "  Verifying roles in database..."
	@docker exec backend-postgres-1 psql -U postgres -d spark_chicken_games \
		-c "SELECT id::text, name FROM roles ORDER BY name;" 2>/dev/null || \
		echo "  Docker container not running."

db-list-users:
	@echo "  Listing all users with roles..."
	@docker exec backend-postgres-1 psql -U postgres -d spark_chicken_games \
		-c "SELECT u.id::text, u.username, u.email, r.name as role \
			FROM users u JOIN roles r ON u.role_id = r.id \
			ORDER BY u.created_at;" 2>/dev/null || \
		echo "  Docker container not running."

db-fix-users:
	@echo "  Resetting non-Samuteg users to 'user' role..."
	@docker exec backend-postgres-1 psql -U postgres -d spark_chicken_games \
		-c "UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'user'), \
			updated_at = NOW() WHERE LOWER(username) != 'samuteg';" 2>/dev/null || \
		echo "  Docker container not running."
	@echo "  ✓ Done! Only Samuteg has admin role."

db-clean-seed:
	@echo "  Removing seed/mock data from database..."
	@docker exec backend-postgres-1 psql -U postgres -d spark_chicken_games \
		-c "DELETE FROM game_categories; DELETE FROM game_tags; \
			DELETE FROM games; DELETE FROM categories; DELETE FROM tags;" \
		2>/dev/null || echo "  Docker container not running."
	@echo "  ✓ Seed data removed!"

admin-fix:
	@echo "  Forcing Samuteg to admin role..."
	@docker exec backend-postgres-1 psql -U postgres -d spark_chicken_games \
		-c "UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'admin'), \
			updated_at = NOW() WHERE LOWER(username) = 'samuteg';" \
		2>/dev/null || echo "  Docker container not running."
	@echo "  ✓ Samuteg is now admin!"

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
	cd backend && docker compose down -v 2>/dev/null || true
