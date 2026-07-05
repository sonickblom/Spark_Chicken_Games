# Spark Chicken Games 🎮

Plataforma de jogos web de alta performance com acesso instantâneo, suporte offline e sincronização de progresso.

## Stack

| Camada    | Tecnologia                                         |
| --------- | -------------------------------------------------- |
| Frontend  | Next.js 15, React 18, TypeScript, Tailwind CSS     |
| Backend   | Go 1.22, Gin, PostgreSQL, Redis                    |
| Ferramentas | pnpm, Docker, Make                               |

## Requisitos

- [Go](https://go.dev/dl/) 1.22+
- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/installation) 9+
- [Docker](https://docs.docker.com/get-docker/) + [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

```bash
# 1. Instalar dependências
make install

# 2. Build + iniciar Docker infra + rodar servidores de desenvolvimento
make start
```

Isso vai:
1. Buildar o backend (Go binary em `backend/bin/api`)
2. Subir PostgreSQL e Redis via Docker
3. Iniciar o backend em `http://localhost:8080`
4. Iniciar o frontend em `http://localhost:3000`

> **Importante**: Na primeira execução, é necessário rodar as migrations do banco:
> ```bash
> make db-migrate
> ```

## Comandos Disponíveis

### Desenvolvimento

```bash
make dev              # Frontend + backend em paralelo (dev mode)
make dev-frontend     # Apenas frontend (Next.js em :3000)
make dev-backend      # Apenas backend (Go/Gin em :8080)
make start            # Build + Docker infra + dev servers
```

### Build

```bash
make build               # Frontend + backend
make build-frontend      # Apenas frontend (next build)
make build-backend       # Apenas backend (go build)
make build-backend-bin   # Apenas Go binary (bin/api)
```

### Docker

```bash
make docker-up           # Sobe PostgreSQL + Redis + API
make docker-up-infra     # Sobe apenas PostgreSQL + Redis
make docker-down         # Para todos os containers
make docker-logs         # Logs de todos os containers
make docker-logs-api     # Logs apenas da API
make docker-logs-infra   # Logs apenas do PostgreSQL e Redis
make docker-restart      # Reinicia todos os containers
```

### Banco de Dados

```bash
make db-migrate     # Executa migrations
make db-studio      # Abre studio do banco
make db-generate    # Gera código do banco
```

### Qualidade

```bash
make lint         # Executa linters
make lint-fix     # Corrige issues de lint
make test         # Executa testes
```

### Utilitários

```bash
make clean        # Remove build artifacts e node_modules
make reset        # Clean + reinstala tudo
```

## Estrutura do Projeto

```
├── frontend/                # Next.js 15 (React 18, TypeScript)
│   └── src/
│       ├── app/             # App Router pages
│       ├── components/      # Componentes React
│       ├── hooks/           # Custom hooks
│       ├── lib/             # Utilitários e mock data
│       ├── services/        # API service (axios)
│       ├── styles/          # Estilos globais
│       └── types/           # Tipos TypeScript
├── backend/                 # Go 1.22 + Gin
│   ├── cmd/
│   │   ├── api/             # Entrypoint da API
│   │   └── migrate/         # CLI de migrations
│   ├── internal/
│   │   ├── auth/            # JWT, bcrypt
│   │   ├── config/          # Config (YAML + env vars)
│   │   ├── db/              # PostgreSQL + Redis
│   │   ├── middleware/      # Auth, rate limit
│   │   ├── modules/         # Módulos (handler → service → repository)
│   │   ├── server/          # HTTP server, rotas, container DI
│   │   └── shared/          # Response, errors, validation
│   └── migrations/          # SQL migrations
├── Makefile                 # Comandos do projeto
└── package.json             # pnpm workspace root
```

## Frontend → Backend

O frontend se conecta ao backend via axios. A URL base é configurada pela variável de ambiente:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

- O backend usa um wrapper de resposta padronizado: `{ success, data, meta, error, timestamp, request_id }`
- O frontend converte automaticamente de `snake_case` (backend) para `camelCase` (TypeScript)
- Autenticação via JWT armazenado no `localStorage` (chave: `auth_token`)
