# Spark Chicken Games 🎮

Plataforma de jogos online com dashboard, leaderboards, matchmaking e mais.

## Stack

- **Frontend:** Next.js 15, React 18, Tailwind CSS, TypeScript
- **Backend:** Go, Gin, PostgreSQL, Redis, Lipgloss (terminal styling)
- **Ferramentas:** pnpm workspaces, Docker Compose

## Quick Start

```bash
# 1. Instalar dependências
make install

# 2. Rodar tudo (build + Docker infra + servidores)
make start
```

Isso vai:
1. Buildar o backend (`go build -o bin/api ./cmd/api`)
2. Subir PostgreSQL + Redis via Docker
3. Rodar o backend (porta `8080`) e frontend (porta `3000`) simultaneamente

> Para rodar apenas a infra-estrutura Docker sem o build:
> ```bash
> make docker-up-infra
> ```

## Comandos Disponíveis

### Desenvolvimento

| Comando | Descrição |
|---------|-----------|
| `make install` | Instalar dependências (pnpm + Go modules) |
| `make start` | Buildar + subir infra + rodar tudo |
| `make dev` | Rodar frontend + backend em paralelo |
| `make dev-frontend` | Rodar só frontend (Next.js em :3000) |
| `make dev-backend` | Rodar só backend (Gin em :8080) |

### Docker

| Comando | Descrição |
|---------|-----------|
| `make docker-up-infra` | Subir só PostgreSQL + Redis |
| `make docker-up` | Subir todos containers (incluindo api) |
| `make docker-down` | Parar todos containers |
| `make docker-logs` | Seguir logs dos containers |
| `make docker-build` | Buildar imagens Docker |

### Build & Qualidade

| Comando | Descrição |
|---------|-----------|
| `make build` | Buildar frontend + backend |
| `make build-frontend` | Buildar só frontend |
| `make build-backend` | Buildar só backend |
| `make lint` | Rodar linters |
| `make test` | Rodar testes |

### Banco de Dados

| Comando | Descrição |
|---------|-----------|
| `make db-migrate` | Rodar migrations |
| `make db-studio` | Abrir studio do banco |
| `make db-generate` | Gerar código do banco |

### Utilitários

| Comando | Descrição |
|---------|-----------|
| `make clean` | Remover artefatos de build |
| `make reset` | Clean + reinstall completo |

## Terminal & Logging

O backend usa [Lipgloss](https://github.com/charmbracelet/lipgloss) para estilizar a saída do terminal:

- **Banner inicial** com logo ASCII e informações do serviço
- **Logs de requisições HTTP** com badges coloridos de status (🟢200, 🟡400, 🔴500)
- **Debug de rotas do Gin** colorido por método HTTP
- **Indicador de latência** visual com dots (·) proporcionais ao tempo de resposta

## Frontend → Backend

- **API Base URL:** `http://localhost:8080/api/v1` (configurável via `NEXT_PUBLIC_API_URL`)
- **CORS:** `http://localhost:3000` já permitido no `config.yaml`
- **Autenticação:** JWT (access + refresh tokens)
- **Respostas:** Padrão unificado `{ success, data, meta, error, timestamp, request_id }`

## Variáveis de Ambiente

Prefixo: `SCG_` (ex: `SCG_DATABASE_HOST`, `SCG_SERVER_PORT`)

Frontend:
- `NEXT_PUBLIC_API_URL` — URL base da API (default: `http://localhost:8080/api/v1`)
- `NEXT_PUBLIC_USE_MOCK` — Usar dados mockados quando `true` (default: `false`)
