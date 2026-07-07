# Spark Chicken Games Backend - TODO

Status: completed for the current backend wiring pass.

## Completed

- [x] Modular monolith structure using handler -> service -> repository layers.
- [x] Go module dependencies and lockfile.
- [x] Configuration loading with YAML, defaults, and `SCG_*` environment variables.
- [x] PostgreSQL connection pool.
- [x] Redis client and cache helpers.
- [x] Shared response, errors, validation, and pagination packages.
- [x] Database migrations through `025_seed_development_data.up.sql`.
- [x] Custom migration runner in `internal/db/migrations.go`.
- [x] Migration CLI entrypoint: `cmd/migrate/main.go`.
- [x] API entrypoint: `cmd/api/main.go`.
- [x] HTTP server setup: `internal/server/server.go`.
- [x] Dependency injection container: `internal/server/container.go`.
- [x] Route registration: `internal/server/routes.go`.
- [x] Health endpoints: `GET /health`, `GET /ready`.
- [x] Docker support: `Dockerfile`, `docker-compose.yml`, `.dockerignore`.
- [x] Reference configuration: `config.example.yaml`.
- [x] Development seed data for categories, tags, and a demo game.
- [x] Fixed role seed UUIDs to match the auth registration default role.

## Completed Modules

- [x] Auth: register, login, refresh, logout, current user.
- [x] Users: profile, password change, account deletion, admin CRUD.
- [x] Games: CRUD, listing, filters, featured, new, popular, play count.
- [x] Categories: CRUD, slug lookup, listing with game counts.
- [x] Tags: CRUD, slug lookup, listing with game counts.
- [x] Favorites: add, remove, list, check, count.
- [x] History: record play, list, stats, delete.
- [x] Progress: save, get, update, delete, list.
- [x] Reviews: create, get, update, delete, list by game, average rating.
- [x] Leaderboards: global, game leaderboard, user rank, score submission.
- [x] Analytics: platform, game, user, top games.
- [x] Matchmaking: join queue, leave queue, status, match attempt.
- [x] Sessions: create, get, room lookup, list, join, leave, start, end, participants.
- [x] Recommendations: personalized, similar, trending, new releases.
- [x] Ads: admin CRUD, active ads, impressions, clicks, stats.

## Registered API Endpoints

### Auth

- [x] `POST /api/v1/auth/register`
- [x] `POST /api/v1/auth/login`
- [x] `POST /api/v1/auth/refresh`
- [x] `POST /api/v1/auth/logout`
- [x] `GET /api/v1/auth/me`

### Users

- [x] `GET /api/v1/users/me`
- [x] `PATCH /api/v1/users/me`
- [x] `POST /api/v1/users/me/password`
- [x] `DELETE /api/v1/users/me`
- [x] `GET /api/v1/admin/users`
- [x] `GET /api/v1/admin/users/:id`
- [x] `PATCH /api/v1/admin/users/:id`
- [x] `DELETE /api/v1/admin/users/:id`

### Games, Reviews, Leaderboards, Matchmaking

- [x] `GET /api/v1/games`
- [x] `GET /api/v1/games/featured`
- [x] `GET /api/v1/games/new`
- [x] `GET /api/v1/games/popular`
- [x] `GET /api/v1/games/slug/:slug`
- [x] `GET /api/v1/games/:game_id`
- [x] `POST /api/v1/games`
- [x] `PATCH /api/v1/games/:game_id`
- [x] `DELETE /api/v1/games/:game_id`
- [x] `POST /api/v1/games/:game_id/play`
- [x] `GET /api/v1/games/:game_id/reviews`
- [x] `GET /api/v1/games/:game_id/reviews/average`
- [x] `POST /api/v1/games/:game_id/reviews`
- [x] `GET /api/v1/reviews/:id`
- [x] `PATCH /api/v1/reviews/:id`
- [x] `DELETE /api/v1/reviews/:id`
- [x] `GET /api/v1/games/:game_id/leaderboard`
- [x] `POST /api/v1/games/:game_id/leaderboard`
- [x] `GET /api/v1/leaderboards`
- [x] `GET /api/v1/leaderboards/me/rank`
- [x] `POST /api/v1/games/:game_id/matchmaking/queue`
- [x] `DELETE /api/v1/games/:game_id/matchmaking/queue`
- [x] `GET /api/v1/games/:game_id/matchmaking/status`
- [x] `POST /api/v1/games/:game_id/matchmaking/match`

### Catalog Metadata

- [x] `GET /api/v1/categories`
- [x] `GET /api/v1/categories/with-count`
- [x] `GET /api/v1/categories/slug/:slug`
- [x] `GET /api/v1/categories/:id`
- [x] `POST /api/v1/categories`
- [x] `PATCH /api/v1/categories/:id`
- [x] `DELETE /api/v1/categories/:id`
- [x] `GET /api/v1/tags`
- [x] `GET /api/v1/tags/with-count`
- [x] `GET /api/v1/tags/slug/:slug`
- [x] `GET /api/v1/tags/:id`
- [x] `POST /api/v1/tags`
- [x] `PATCH /api/v1/tags/:id`
- [x] `DELETE /api/v1/tags/:id`

### User Game Data

- [x] `GET /api/v1/favorites`
- [x] `POST /api/v1/favorites`
- [x] `DELETE /api/v1/favorites/id/:id`
- [x] `GET /api/v1/favorites/check/:gameId`
- [x] `GET /api/v1/favorites/count`
- [x] `DELETE /api/v1/favorites/:gameId`
- [x] `GET /api/v1/history`
- [x] `POST /api/v1/history`
- [x] `GET /api/v1/history/stats`
- [x] `DELETE /api/v1/history/:id`
- [x] `GET /api/v1/progress`
- [x] `POST /api/v1/progress`
- [x] `GET /api/v1/progress/:gameId`
- [x] `PUT /api/v1/progress/:gameId`
- [x] `DELETE /api/v1/progress/:gameId`

### Sessions, Recommendations, Analytics, Ads

- [x] `GET /api/v1/sessions`
- [x] `POST /api/v1/sessions`
- [x] `GET /api/v1/sessions/room/:code`
- [x] `GET /api/v1/sessions/:id/participants`
- [x] `POST /api/v1/sessions/:id/join`
- [x] `POST /api/v1/sessions/:id/leave`
- [x] `POST /api/v1/sessions/:id/start`
- [x] `POST /api/v1/sessions/:id/end`
- [x] `GET /api/v1/sessions/:id`
- [x] `GET /api/v1/recommendations/personalized`
- [x] `GET /api/v1/recommendations/trending`
- [x] `GET /api/v1/recommendations/new-releases`
- [x] `GET /api/v1/games/:game_id/recommendations/similar`
- [x] `GET /api/v1/analytics/me`
- [x] `GET /api/v1/admin/analytics/platform`
- [x] `GET /api/v1/admin/analytics/games/:game_id`
- [x] `GET /api/v1/admin/analytics/top-games`
- [x] `GET /api/v1/ads/active`
- [x] `POST /api/v1/ads/:id/impression`
- [x] `POST /api/v1/ads/:id/click`
- [x] `GET /api/v1/admin/ads`
- [x] `POST /api/v1/admin/ads`
- [x] `GET /api/v1/admin/ads/:id/stats`
- [x] `GET /api/v1/admin/ads/:id`
- [x] `PATCH /api/v1/admin/ads/:id`
- [x] `DELETE /api/v1/admin/ads/:id`

## Verification

- [x] `GOCACHE=/tmp/go-build-cache go test ./...`

## Backlog

- [ ] Add real integration tests that run against disposable PostgreSQL and Redis services.
- [ ] Add generated Swagger/OpenAPI documentation, preferably from route annotations or a maintained OpenAPI spec.
- [ ] Add a `/api/v1/home` aggregation endpoint if the frontend still needs a single home payload.
