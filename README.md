# Spark Chicken Games 🎮

Plataforma de jogos online com dashboard administrativo, leaderboards, matchmaking, sistema de recomendação e muito mais.

**Marca:** Latency Zero  
**Monorepo:** pnpm workspaces (frontend + backend)

---

## Stack

### Frontend
- **Framework:** Next.js 15 (App Router), React 18
- **Linguagem:** TypeScript 5.4
- **Estilização:** Tailwind CSS 3.4 com tema neon/cyber customizado
- **Estado & Dados:** React Context (autenticação), Axios (API client), Zod (validação)
- **UI:** Framer Motion (animações), Lucide React (ícones), date-fns, clsx + tailwind-merge
- **Build:** pnpm, Vitest, Testing Library

### Backend
- **Linguagem:** Go 1.22
- **Framework:** Gin Web Framework
- **Banco:** PostgreSQL 16 (pgx/v5), Redis 7 (go-redis/v9)
- **Config:** Viper (YAML + env vars prefixo `SCG_`)
- **Auth:** JWT (access + refresh tokens com rotação e revogação)
- **Rate Limit:** Redis-based (configurável)
- **Logging:** Zerolog + Lipgloss (terminal estilizado com banner ASCII)
- **Testes:** `go test -race` + golangci-lint

### Infraestrutura
- **Container:** Docker Compose (PostgreSQL + Redis)
- **Deploy:** Vercel (frontend + backend serverless) / Railway (backend Docker)
- **Pacotes:** pnpm workspaces, Go modules

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)                 │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────────┐  │
│  │ Páginas  │  │ Componentes│ │  API Service (axios)  │  │
│  │ App Router│  │ UI/Game  │  │  snake_case→camelCase │  │
│  └──────────┘  └──────────┘  └──────────┬────────────┘  │
└──────────────────────────────────────────┼──────────────┘
                                           │ HTTP (REST)
┌──────────────────────────────────────────┼──────────────┐
│         Backend (Go/Gin)                 │              │
│  ┌───────────────────────────────────────▼──────────┐   │
│  │             Router (Gin)                         │   │
│  │  Middlewares: CORS, Auth, Rate Limit, Logging    │   │
│  └───────┬───────────────────────┬──────────────────┘   │
│          │                       │                      │
│  ┌───────▼───────┐      ┌───────▼───────┐              │
│  │   Handlers    │      │  Middlewares  │              │
│  │  (HTTP layer) │      │  (Auth/CORS/  │              │
│  └───────┬───────┘      │   RateLimit)  │              │
│          │              └───────────────┘              │
│  ┌───────▼───────┐                                     │
│  │   Services    │  ─── Lógica de negócio ───          │
│  └───────┬───────┘                                     │
│          │                                              │
│  ┌───────▼───────┐                                     │
│  │  Repositories │  ─── Acesso a dados ───             │
│  └───────┬───────┘                                     │
│          │                                              │
│  ┌───────┴───────────────────────┐                     │
│  │  PostgreSQL (pgx) + Redis     │                     │
│  └───────────────────────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

O backend segue uma arquitetura **monolito modular** com 16 módulos, cada um seguindo o padrão **handler → service → repository**, com injeção de dependências via container.

---

## Estrutura do Projeto

```
spark-chicken-games/
├── Makefile                          # 40+ comandos (dev, build, docker, db, lint, test)
├── docker-compose.yml                # PostgreSQL 16 + Redis 7
├── pnpm-workspace.yaml               # Monorepo config
├── tsconfig.base.json                # Base TypeScript
│
├── backend/                          # 🖥 Go/Gin monolith
│   ├── cmd/
│   │   ├── api/main.go               # Servidor HTTP principal
│   │   └── migrate/main.go           # CLI de migrations
│   ├── api/index.go                  # Entrypoint Vercel Serverless
│   ├── migrations/                   # 26 migrations SQL (000-025 + seed)
│   ├── pkg/
│   │   ├── config/                   # Config via Viper + SCG_ env vars
│   │   ├── db/                       # PostgreSQL pgx pool + Redis + migration runner
│   │   ├── auth/                     # JWT (access 15m + refresh 7d)
│   │   ├── middleware/
│   │   │   ├── auth/                 # AuthRequired, OptionalAuth, RequireAdmin
│   │   │   ├── cors/                 # CORS configurável
│   │   │   ├── logging/              # Zerolog + Lipgloss
│   │   │   └── ratelimit/            # Redis-based rate limiter
│   │   ├── server/                   # HTTP server + routes + DI container
│   │   ├── shared/                   # response, errors (60+ sentinel), pagination, validator
│   │   └── modules/                  # 16 módulos funcionais
│   │       ├── auth/                 # Register, Login, Refresh, Logout, GetMe
│   │       ├── users/                # Profile CRUD, admin user management
│   │       ├── games/                # CRUD, featured, new, popular, play count
│   │       ├── categories/           # CRUD, slug lookup, with-count
│   │       ├── tags/                 # CRUD, slug lookup, with-count
│   │       ├── favorites/            # Add, Remove, Check, Count, List
│   │       ├── history/              # Record play, List, Stats, Delete
│   │       ├── progress/             # Save, Get, Update, Delete, List
│   │       ├── reviews/              # Create, Get, Update, Delete, Average rating
│   │       ├── leaderboards/         # Global, per-game, submit score, user rank
│   │       ├── matchmaking/          # Join queue, Leave, Status, Try match
│   │       ├── sessions/             # Create room, Join, Leave, Start, End
│   │       ├── recommendations/      # Personalized, Similar, Trending, New releases
│   │       ├── analytics/            # Platform, Game, User, Top games
│   │       ├── ads/                  # Admin CRUD, Impressions, Clicks, Stats
│   │       └── roles/                # List roles
│   └── config.example.yaml           # Config de referência
│
└── frontend/                         # 🌐 Next.js 15 App Router
    └── src/
        ├── app/
        │   ├── layout.tsx            # Root: AuthProvider + Header + Footer
        │   ├── page.tsx              # Home: Hero, Featured, New, Popular, Categories
        │   ├── globals.css           # Tema neon/cyber customizado
        │   │
        │   ├── games/
        │   │   ├── page.tsx          # Listagem com search + filtros + sort
        │   │   └── game/[slug]/
        │   │       └── page.tsx      # Detalhe do jogo + embed + ações
        │   ├── categories/[slug]/    # Jogos por categoria
        │   ├── search/               # Resultados de busca
        │   ├── login/                # Login
        │   ├── register/             # Cadastro
        │   └── admin/
        │       ├── layout.tsx        # AdminGuard wrapper
        │       ├── page.tsx          # Dashboard com stats
        │       ├── games/            # CRUD de jogos
        │       ├── users/            # Gerenciamento de usuários
        │       └── upload/           # Upload de jogos HTML (drag-drop + paste)
        │
        ├── components/
        │   ├── ui/                   # Button, Card, Input, Skeleton, CategoryPill, SearchBar, Motion
        │   ├── game/                 # GameEmbed, GameCard, GameGrid
        │   ├── admin/                # AdminGuard, StatCard, GameForm
        │   └── layout/               # Header, Footer
        │
        ├── hooks/                    # use-data, use-uploaded-games
        ├── lib/                      # utils, auth-context, game-storage, mock-data
        ├── services/api.ts           # API client com 30+ métodos
        └── types/index.ts            # Interfaces TypeScript
```

---

## Funcionalidades

### Backend (16 módulos, 70+ endpoints)

| Módulo | Descrição | Endpoints |
|--------|-----------|-----------|
| **Auth** | Registro, login, refresh token, logout, perfil atual | 5 |
| **Users** | Perfil, alterar senha, deletar conta + admin CRUD | 8 |
| **Games** | CRUD, listagem com filtros, featured, new, popular | 10 |
| **Categories** | CRUD, slug lookup, listagem com contagem de jogos | 6 |
| **Tags** | CRUD, slug lookup, listagem com contagem de jogos | 6 |
| **Favorites** | Adicionar, remover, verificar, contar, listar | 6 |
| **History** | Registrar partida, listar, stats, deletar | 4 |
| **Progress** | Salvar, obter, atualizar, deletar progresso | 5 |
| **Reviews** | Criar, obter, atualizar, deletar, média por jogo | 6 |
| **Leaderboards** | Global, por jogo, ranking do usuário, submit score | 4 |
| **Matchmaking** | Entrar/sair da fila, status, tentar match (admin) | 4 |
| **Sessions** | Salas multiplayer, participantes, iniciar/finalizar | 8 |
| **Recommendations** | Personalizado, trending, novos, similares | 4 |
| **Analytics** | Plataforma, jogo, usuário, top jogos | 4 |
| **Ads** | CRUD admin + ativos, impressões, cliques, stats | 9 |
| **Roles** | Listar papéis (admin, moderator, user) | 1 |

### Frontend (13 páginas)

| Rota | Descrição |
|------|-----------|
| `/` | Home com Hero, Featured Games, New Releases, Popular, Categories |
| `/games` | Listagem de jogos com busca, filtros e ordenação |
| `/game/[slug]` | Detalhe do jogo com embed (iframe), favoritar, compartilhar |
| `/categories/[slug]` | Jogos filtrados por categoria |
| `/search` | Busca full-text |
| `/login` | Login com email/senha |
| `/register` | Cadastro com username/email/senha |
| `/admin` | Dashboard com estatísticas da plataforma |
| `/admin/games` | CRUD de jogos publicados via API |
| `/admin/games/new` | Formulário de criação de jogo |
| `/admin/users` | Gerenciamento de usuários (role toggle) |
| `/admin/upload` | Upload de jogos HTML (drag-and-drop + paste) |

---

## API Endpoints

### Públicos
```
GET  /health
GET  /ready
GET  /api/v1/games                          # Listar jogos
GET  /api/v1/games/featured                 # Jogos em destaque
GET  /api/v1/games/new                      # Novos lançamentos
GET  /api/v1/games/popular                  # Mais populares
GET  /api/v1/games/slug/:slug               # Buscar por slug
GET  /api/v1/games/:game_id                 # Buscar por ID
GET  /api/v1/categories                     # Listar categorias
GET  /api/v1/categories/with-count          # Categorias com contagem
GET  /api/v1/tags                           # Listar tags
GET  /api/v1/tags/with-count                # Tags com contagem
GET  /api/v1/recommendations/trending       # Recomendações em alta
GET  /api/v1/recommendations/new-releases   # Novos lançamentos
GET  /api/v1/games/:game_id/reviews         # Reviews de um jogo
GET  /api/v1/games/:game_id/leaderboard     # Leaderboard do jogo
GET  /api/v1/leaderboards                   # Leaderboard global
GET  /api/v1/ads/active                     # Anúncios ativos
POST /api/v1/auth/register                  # Cadastro
POST /api/v1/auth/login                     # Login
POST /api/v1/auth/refresh                   # Refresh token
```

### Autenticados (Bearer Token)
```
POST /api/v1/auth/logout                    # Logout
GET  /api/v1/auth/me                        # Dados do usuário atual
GET/PATCH/DELETE /api/v1/users/me           # Gerenciar perfil
POST /api/v1/users/me/password              # Alterar senha
GET/POST/DELETE /api/v1/favorites           # Gerenciar favoritos
GET/POST/DELETE /api/v1/history             # Histórico de partidas
GET/POST/PUT/DELETE /api/v1/progress        # Progresso em jogos
POST /api/v1/games/:game_id/play            # Registrar partida
POST /api/v1/games/:game_id/reviews         # Avaliar jogo
POST /api/v1/games/:game_id/leaderboard     # Enviar score
POST/DELETE /api/v1/games/:game_id/matchmaking/queue  # Matchmaking
POST/GET /api/v1/sessions                   # Sessões multiplayer
GET  /api/v1/recommendations/personalized   # Recomendações personalizadas
GET  /api/v1/analytics/me                   # Analytics do usuário
GET  /api/v1/leaderboards/me/rank           # Ranking do usuário
```

### Administrativos (Bearer Token + Admin Role)
```
GET /api/v1/admin/users                     # Listar usuários
GET/PATCH/DELETE /api/v1/admin/users/:id    # Gerenciar usuário
PATCH /api/v1/admin/users/:id/role          # Alterar papel
POST/PATCH/DELETE /api/v1/games             # CRUD de jogos
POST/DELETE /api/v1/categories              # CRUD de categorias
POST/DELETE /api/v1/tags                    # CRUD de tags
POST /api/v1/games/:game_id/matchmaking/match  # Forçar match
GET /api/v1/admin/analytics/platform        # Analytics da plataforma
GET /api/v1/admin/analytics/top-games       # Top jogos
CRUD /api/v1/admin/ads                      # Gerenciar anúncios
```

> **Formato de resposta unificado:**
> ```json
> {
>   "success": true,
>   "data": { ... },
>   "error": { "code": "...", "message": "...", "details": {} },
>   "meta": { "page": 1, "per_page": 20, "total": 100 },
>   "timestamp": "2026-01-01T00:00:00Z",
>   "request_id": "uuid"
> }
> ```

---

## Banco de Dados

O schema possui **16 tabelas** gerenciadas por 26 migrations SQL:

| Tabela | Descrição |
|--------|-----------|
| `users` | Autenticação e perfil (id, username, email, password_hash, role_id) |
| `roles` | RBAC (admin, moderator, user) |
| `games` | Metadados dos jogos (title, slug, description, images, featured/new/popular flags) |
| `categories` | Categorias (name, slug) |
| `tags` | Tags (name, slug) |
| `game_categories` | Relação muitos-para-muitos jogos ↔ categorias |
| `game_tags` | Relação muitos-para-muitos jogos ↔ tags |
| `favorites` | Jogos favoritos por usuário |
| `history` | Histórico de partidas (played_at, duration) |
| `progress` | Progresso/save data (JSON) |
| `reviews` | Avaliações (rating, comment) |
| `leaderboard_entries` | Pontuações (score, metadata) |
| `sessions` | Salas multiplayer (room_code, status, max_players) |
| `session_participants` | Participantes de sessões |
| `matchmaking_queue` | Filas de matchmaking |
| `ads` | Anúncios (impressions, clicks) |
| `analytics_events` | Eventos de analytics |
| `refresh_tokens` | Revogação de refresh tokens |

---

## Quick Start

```bash
# 1. Instalar dependências
make install

# 2. Subir infraestrutura (PostgreSQL + Redis)
make docker-up-infra

# 3. Rodar migrations
make db-migrate

# 4. Iniciar desenvolvimento
make dev   # Frontend (:3000) + Backend (:8080) em paralelo
```

**Resultado:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- Health check: `http://localhost:8080/health`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

---

## Comandos

### Desenvolvimento
| Comando | Descrição |
|---------|-----------|
| `make install` | Instalar dependências (pnpm + Go modules) |
| `make start` | Build + infra + dev (tudo) |
| `make dev` | Rodar frontend + backend em paralelo |
| `make dev-frontend` | Next.js em `:3000` |
| `make dev-backend` | Gin em `:8080` |

### Docker
| Comando | Descrição |
|---------|-----------|
| `make docker-up-infra` | Subir PostgreSQL + Redis |
| `make docker-up` | Subir todos containers (incluindo API) |
| `make docker-down` | Parar todos containers |
| `make docker-logs` | Seguir logs dos containers |
| `make docker-build` | Buildar imagens |
| `make docker-restart` | Reiniciar containers |

### Build
| Comando | Descrição |
|---------|-----------|
| `make build` | Build frontend + backend |
| `make build-frontend` | Build Next.js |
| `make build-backend` | Build Go binary |
| `make build-migrate` | Build migration CLI |

### Database
| Comando | Descrição |
|---------|-----------|
| `make db-migrate` | Rodar todas as migrations |
| `make db-rollback` | Reverter última migration |
| `make db-status` | Status das migrations |
| `make db-shell` | Shell interativo PostgreSQL |
| `make db-check-roles` | Verificar papéis |
| `make db-list-users` | Listar usuários |
| `make db-fix-users` | Resetar papéis não-admin |
| `make db-clean-seed` | Remover dados de seed |

### Qualidade
| Comando | Descrição |
|---------|-----------|
| `make lint` | Linter frontend (Next.js) |
| `make lint-fix` | Corrigir lint automaticamente |
| `make typecheck` | TypeScript type checking |
| `make test` | Rodar todos os testes |
| `make test-frontend` | Testes Vitest |
| `make test-backend` | Testes Go (`-race`) |

### Admin & Utilitários
| Comando | Descrição |
|---------|-----------|
| `make admin-fix` | Forçar papel admin para Samuteg |
| `make clean` | Remover artefatos de build |
| `make reset` | Clean + reinstall completo |

---

## Terminal & Logging

O backend usa [Lipgloss](https://github.com/charmbracelet/lipgloss) para estilizar a saída do terminal:

- **Banner inicial** com logo ASCII e informações do serviço
- **Logs de requisições HTTP** com badges coloridos de status (`200` 🟢, `400` 🟡, `500` 🔴)
- **Debug de rotas do Gin** colorido por método HTTP
- **Indicador de latência** visual com dots (`·`) proporcionais ao tempo de resposta

---

## Variáveis de Ambiente

### Backend (prefixo `SCG_`)

| Variável | Default | Descrição |
|----------|---------|-----------|
| `SCG_DATABASE_HOST` | `localhost` | Host PostgreSQL |
| `SCG_DATABASE_PORT` | `5432` | Porta PostgreSQL |
| `SCG_DATABASE_USER` | `postgres` | Usuário PostgreSQL |
| `SCG_DATABASE_PASSWORD` | `postgres` | Senha PostgreSQL |
| `SCG_DATABASE_NAME` | `spark_chicken_games` | Database name |
| `SCG_DATABASE_SSLMODE` | `disable` | SSL mode |
| `SCG_REDIS_HOST` | `localhost` | Host Redis |
| `SCG_REDIS_PORT` | `6379` | Porta Redis |
| `SCG_REDIS_PASSWORD` | `""` | Senha Redis |
| `SCG_JWT_ACCESS_SECRET` | — | Chave secreta access token |
| `SCG_JWT_REFRESH_SECRET` | — | Chave secreta refresh token |
| `SCG_JWT_ACCESS_TOKEN_EXPIRY` | `15m` | Expiração access token |
| `SCG_JWT_REFRESH_TOKEN_EXPIRY` | `168h` | Expiração refresh token (7 dias) |
| `SCG_SERVER_PORT` | `8080` | Porta do servidor |
| `SCG_CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | Origens permitidas |
| `SCG_RATELIMIT_REQUESTS_PER_MINUTE` | `60` | Rate limit |

### Frontend
| Variável | Default | Descrição |
|----------|---------|-----------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api/v1` | URL base da API |

---

## Deploy

### Vercel (Frontend + Backend Serverless)

O projeto possui **dois projetos** no Vercel:

1. **Frontend** (`spark-chicken-games`)
   - Root directory: `frontend/`
   - Framework: Next.js
   - Build: `next build`

2. **Backend** (`spark-chicken-games-api`)
   - Root directory: `backend/`
   - Framework: Other (Go Serverless Function via `api/index.go`)
   - Runtime: `@vercel/go`

### Railway (Backend Docker)

- Build: `backend/Dockerfile` (multi-stage)
- Variáveis de ambiente configuradas via dashboard Railway

### Produção
- **Banco:** Neon (PostgreSQL serverless) + Upstash (Redis serverless)
- **Domínios:** Configurados via Vercel/Railway

---

## Desenvolvimento

### Estado Atual

- **Backend:** ✅ Completo (16 módulos, 70+ endpoints, migrations, seed data)
- **Frontend:** ✅ Core pages + admin completo
- **Pendentes:** Testes de integração, OpenAPI/Swagger, profile page, componentes UI avançados, testes E2E

### Convenções

- **Commits:** Mensagens claras e descritivas em português ou inglês
- **SQL:** Migrations progressivas (`NNN_description.up.sql` / `NNN_description.down.sql`)
- **Go:** Seguir `golangci-lint`, testes com `-race`, nomes descritivos
- **TypeScript:** Strict mode, `tsconfig.base.json` compartilhado, tipos em `types/index.ts`
- **API:** `snake_case` no backend → `camelCase` no frontend (transformação automática)

---

## Licença

Proprietário — Spark Chicken Games
