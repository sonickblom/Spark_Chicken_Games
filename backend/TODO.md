# TODO List - Spark Chicken Games Backend

## ✅ Completed
- [x] Project structure (modular monolith with clean architecture)
- [x] Go module with dependencies
- [x] Config management (viper + YAML + env vars)
- [x] Database connection (pgxpool)
- [x] Redis connection
- [x] Shared packages:
  - [x] Response handling (standardized JSON)
  - [x] Error definitions & HTTP status mapping
  - [x] Validator (go-playground/validator)
  - [x] Pagination (offset + cursor)
- [x] Migrations (23 files):
  - [x] 000_updated_at_function
  - [x] 001_roles
  - [x] 002_users
  - [x] 003_refresh_tokens
  - [x] 004_auth_sessions
  - [x] 005_games
  - [x] 006_categories
  - [x] 007_tags
  - [x] 008_game_categories
  - [x] 009_game_tags
  - [x] 010_favorites
  - [x] 011_play_history
  - [x] 012_user_game_progress
  - [x] 013_game_sessions (old)
  - [x] 014_session_players (old)
  - [x] 015_matchmaking_queue
  - [x] 016_analytics_events
  - [x] 017_game_views
  - [x] 018_leaderboards
  - [x] 019_achievements
  - [x] 020_user_achievements
  - [x] 021_reviews
  - [x] 022_ads_placements
  - [x] 023_game_sessions (new with constraints)
  - [x] 024_session_players (new)
- [x] Auth module:
  - [x] JWT service (access + refresh tokens, rotation)
  - [x] Password hashing (bcrypt)
  - [x] Auth middleware (required + optional + role-based)
- [x] Middleware:
  - [x] CORS
  - [x] Rate limiting (Redis + in-memory fallback)
  - [x] Request logging (zerolog)
- [x] Users module:
  - [x] Repository (CRUD + profile + queries)
  - [x] Service (register, login, refresh, logout, profile, password, admin)
  - [x] Handler (auth endpoints + user profile + admin)
- [x] Games module:
  - [x] Repository (CRUD + relations + featured/new/popular + play count + rating)
  - [x] Service (business logic)
  - [x] Handler (CRUD + list with filters + featured/new/popular + play)

---

## 🔄 In Progress / Need to Complete

### Categories Module
- [ ] Repository
- [ ] Service
- [ ] Handler

### Tags Module
- [ ] Repository
- [ ] Service
- [ ] Handler

### Favorites Module
- [ ] Repository
- [ ] Service
- [ ] Handler

### History Module (Play History)
- [ ] Repository
- [ ] Service
- [ ] Handler

### Progress Module (User Game Progress)
- [ ] Repository
- [ ] Service
- [ ] Handler

### Reviews Module
- [ ] Repository
- [ ] Service
- [ ] Handler

### Leaderboards Module
- [ ] Repository
- [ ] Service
- [ ] Handler

### Analytics Module
- [ ] Repository
- [ ] Service
- [ ] Handler

### Matchmaking Module
- [ ] Repository
- [ ] Service
- [ ] Handler

### Sessions Module (Game Sessions)
- [ ] Repository
- [ ] Service
- [ ] Handler

### Recommendations Module
- [ ] Repository
- [ ] Service
- [ ] Handler

### Ads Module
- [ ] Repository
- [ ] Service
- [ ] Handler

---

## 🏗️ Infrastructure & Integration

### Main Application Wiring
- [ ] `cmd/api/main.go` - Entry point
- [ ] `internal/server/server.go` - HTTP server setup
- [ ] `internal/server/routes.go` - Route registration (all modules)
- [ ] Dependency injection / container
- [ ] Health check endpoints (`/health`, `/ready`)
- [ ] Swagger/OpenAPI docs generation (swaggo)

### Database
- [ ] Migration runner (golang-migrate or custom)
- [ ] Seed data for development

### Docker
- [ ] `Dockerfile` (multi-stage build)
- [ ] `docker-compose.yml` (api, postgres, redis)
- [ ] `.dockerignore`

### Testing
- [ ] Integration tests for auth
- [ ] Integration tests for games
- [ ] Integration tests for categories
- [ ] Test helpers / fixtures

### Configuration
- [ ] `config.example.yaml` for reference
- [ ] Environment-specific configs

---

## 📋 API Endpoints Checklist (from requirements)

### Auth
- [x] POST `/api/v1/auth/register`
- [x] POST `/api/v1/auth/login`
- [x] POST `/api/v1/auth/refresh`
- [x] POST `/api/v1/auth/logout`
- [x] GET `/api/v1/auth/me`

### Users
- [x] GET `/api/v1/users/me` (profile)
- [x] PATCH `/api/v1/users/me` (update profile)
- [x] POST `/api/v1/users/me/password` (change password)
- [x] DELETE `/api/v1/users/me` (delete account)
- [ ] Admin: GET `/api/v1/admin/users` (list)
- [ ] Admin: GET `/api/v1/admin/users/:id`
- [ ] Admin: PATCH `/api/v1/admin/users/:id`
- [ ] Admin: DELETE `/api/v1/admin/users/:id`

### Games (Catalog)
- [x] POST `/api/v1/games` (admin)
- [x] GET `/api/v1/games` (list with pagination, filters, search)
- [x] GET `/api/v1/games/featured`
- [x] GET `/api/v1/games/new`
- [x] GET `/api/v1/games/popular`
- [x] GET `/api/v1/games/:id` (by ID)
- [x] GET `/api/v1/games/slug/:slug` (by slug)
- [x] PATCH `/api/v1/games/:id` (admin)
- [x] DELETE `/api/v1/games/:id` (admin)
- [x] POST `/api/v1/games/:id/play` (increment play count)

### Categories
- [ ] GET `/api/v1/categories`
- [ ] GET `/api/v1/categories/:id`
- [ ] GET `/api/v1/categories/slug/:slug`
- [ ] POST `/api/v1/categories` (admin)
- [ ] PATCH `/api/v1/categories/:id` (admin)
- [ ] DELETE `/api/v1/categories/:id` (admin)

### Tags
- [ ] GET `/api/v1/tags`
- [ ] GET `/api/v1/tags/:id`
- [ ] POST `/api/v1/tags` (admin)
- [ ] PATCH `/api/v1/tags/:id` (admin)
- [ ] DELETE `/api/v1/tags/:id` (admin)

### Favorites
- [ ] GET `/api/v1/favorites` (user's favorites)
- [ ] POST `/api/v1/favorites` (add)
- [ ] DELETE `/api/v1/favorites/:gameId` (remove)
- [ ] GET `/api/v1/favorites/check/:gameId` (check if favorited)

### History
- [ ] GET `/api/v1/history` (user's play history)
- [ ] POST `/api/v1/history` (record play)

### Progress
- [ ] GET `/api/v1/progress/:gameId` (user's progress for game)
- [ ] PUT `/api/v1/progress/:gameId` (save progress)

### Reviews
- [ ] GET `/api/v1/games/:gameId/reviews` (list)
- [ ] POST `/api/v1/games/:gameId/reviews` (create)
- [ ] PATCH `/api/v1/reviews/:id` (update own)
- [ ] DELETE `/api/v1/reviews/:id` (delete own)

### Leaderboards
- [ ] GET `/api/v1/games/:gameId/leaderboard` (with season filter)
- [ ] POST `/api/v1/games/:gameId/leaderboard` (submit score)

### Analytics
- [ ] POST `/api/v1/analytics/events` (track event)
- [ ] GET `/api/v1/analytics/events` (admin - list)
- [ ] GET `/api/v1/analytics/games/:gameId/views` (game views)

### Matchmaking
- [ ] POST `/api/v1/matchmaking/queue` (join queue)
- [ ] DELETE `/api/v1/matchmaking/queue` (leave queue)
- [ ] GET `/api/v1/matchmaking/status` (check status)

### Sessions
- [ ] POST `/api/v1/sessions` (create session)
- [ ] GET `/api/v1/sessions/:id` (get session)
- [ ] POST `/api/v1/sessions/:id/join` (join)
- [ ] POST `/api/v1/sessions/:id/leave` (leave)
- [ ] POST `/api/v1/sessions/:id/start` (host starts)
- [ ] POST `/api/v1/sessions/:id/end` (host ends)

### Recommendations
- [ ] GET `/api/v1/recommendations` (personalized)
- [ ] GET `/api/v1/recommendations/similar/:gameId`

### Ads
- [ ] GET `/api/v1/ads/placements` (active placements)
- [ ] GET `/api/v1/ads/placements/:code` (by code)
- [ ] POST `/api/v1/ads/impressions` (track impression)
- [ ] POST `/api/v1/ads/clicks` (track click)

### Home (Aggregated)
- [ ] GET `/api/v1/home` (featured + new + popular + categories)

---

## 📝 Notes for Tomorrow

1. **Priority**: Complete remaining modules (Categories, Tags, Favorites, History, Progress) - these are core user-facing features
2. **Then**: Reviews, Leaderboards, Analytics (content features)
3. **Then**: Matchmaking, Sessions, Recommendations, Ads (advanced features)
4. **Finally**: Main wiring, Docker, tests, docs

The modular structure is solid - each module follows handler → service → repository pattern with interfaces.
All database schemas and migrations are ready.
Auth system is production-ready with JWT rotation, Redis storage, and role-based access.