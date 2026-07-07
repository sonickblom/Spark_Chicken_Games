# TODO - Latency Zero Frontend

## Status Atual
- ✅ Estrutura base do Next.js 15 + TypeScript + Tailwind
- ✅ Types TypeScript completos (`src/types/index.ts`)
- ✅ Utils (formatação, SEO, helpers) (`src/lib/utils.ts`)
- ✅ API Service com axios (`src/services/api.ts`)
- ✅ Root Layout com Header/Footer (`src/app/layout.tsx`)
- ✅ Home Page (`/`) - Hero, jogos em destaque, novos, populares, categorias
- ✅ Games Page (`/games`) - Listagem com filtros, busca, ordenação
- ✅ Components UI: Button, Skeleton, CategoryPill, SearchBar
- ✅ Components Game: GameCard, GameGrid
- ✅ Header & Footer responsivos
- ✅ Tailwind Config com tema Cyber-Performance
- ✅ Global CSS com utilitários
- ✅ **Build passando sem erros de tipo ou lint**
- ✅ **Script `pnpm typecheck` para verificar erros de TypeScript rapidamente**
- ✅ **Script `pnpm check` para rodar typecheck + lint de uma vez**

---

## ✅ Páginas Implementadas

### 1. Página do Jogo (`/game/[slug]`) ✅
- [x] Corrigir imports faltando (Card, CardHeader, CardTitle, CardDescription, CardContent, Download)
- [x] Remover uso de `Game` type não utilizado
- [x] Corrigir async client component warning
- [x] Implementar GameEmbed (iframe/canvas player)
- [x] Implementar botões de ação (Jogar, Favoritar, Compartilhar)
- [x] Adicionar metadados SEO dinâmicos
- [x] Corrigir `game.price`, `game.reviewCount`, `game.releaseDate` undefined checks
- [ ] Adicionar RelatedGames section

### 2. Página de Categorias (`/categories/[slug]`) ✅
- [x] Remover variável `categoriesLoading` não usada
- [x] Simplificar componente (versão client complexa desnecessária)
- [x] Usar Server Components onde possível (metadata.ts separado)
- [x] Corrigir `meta.limit` → `meta.pageSize`
- [x] Corrigir `variant="primary"` → `variant="default"`

### 3. Página de Busca (`/search`) ✅
- [x] Criar página completa com resultados
- [x] Implementar busca (via `useSearchGames` hook)
- [x] Adicionar `Suspense` boundary para `useSearchParams()`
- [ ] Implementar busca instantânea (debounce)
- [ ] Adicionar filtros laterais
- [ ] Paginação ou infinite scroll

### 4. Autenticação ✅
- [x] `/login` - Formulário de login visual
- [x] `/register` - Formulário de registro visual
- [x] Integração com `useAuth` hook
- [ ] Protected routes para `/profile`

### 5. Perfil do Usuário (`/profile`) ❌
- [ ] Dashboard com abas: Favoritos, Histórico, Progresso
- [ ] Integração com `useFavorites`, `useRecentlyPlayed`
- [ ] Configurações de conta

---

## ❌ Componentes Faltando

### Core Components
- [ ] **RelatedGames** - Carrossel de jogos relacionados
- [ ] **FeaturedCarousel** - Carrossel hero na home
- [ ] **SidebarFilters** - Filtros colapsáveis para `/games` e `/categories`

### UI Components
- [x] **Input** - Corrigir `className` não usado
- [x] **Card** - Criado e funcional
- [ ] **Modal** - Para login/register, compartilhar, etc.
- [ ] **Dropdown** - Para ordenação, filtros
- [ ] **Tabs** - Para perfil do usuário
- [ ] **Avatar** - Imagem do usuário com fallback
- [ ] **Badge** - Tags de categoria, status (NOVO, DESTAQUE)
- [ ] **Pagination** - Componente reutilizável
- [ ] **InfiniteScroll** - Hook + componente

---

## ✅ Correções de Lint e Build (Concluídas)

- [x] Todos os erros de lint resolvidos
- [x] `Error: Event handlers cannot be passed to Client Component props` — Adicionado `"use client"` ao `Button.tsx` e `game/GameCard.tsx`
- [x] `useSearchParams() should be wrapped in a suspense boundary` — Adicionado `Suspense` no search page
- [x] `'game.price' is possibly 'undefined'` — Adicionado `?? 0` e checks opcionais
- [x] `'game.reviewCount' is possibly 'undefined'` — Adicionado `?? 0`
- [x] `'game.releaseDate' is possibly 'undefined'` — Adicionado fallback condicional
- [x] `Property 'limit' does not exist on type` — Corrigido para `pageSize`
- [x] `Type '"primary"' is not assignable` — Corrigido para `"default"`
- [x] `Expected 1 arguments, but got 2` em `formatDate` — Adicionado parâmetro `options` opcional
- [x] `createReview` type mismatch — Adicionado type assertion

---

## ❌ Funcionalidades Avançadas

### Performance & SEO
- [ ] Implementar `next/image` otimizado em todos os lugares
- [ ] Adicionar `generateMetadata` dinâmico em todas as páginas
- [ ] Implementar sitemap.xml e robots.txt
- [ ] Adicionar structured data (JSON-LD) para jogos
- [ ] Configurar PWA (manifest.json, service worker)
- [ ] Implementar skeleton loading real (não apenas mock)

### Cache & Offline
- [ ] Service Worker para cache de jogos
- [ ] IndexedDB para progresso offline
- [ ] Sincronização quando online
- [ ] Prefetch de rotas críticas

### Analytics & Tracking
- [ ] Event tracking (page_view, game_play, favorite_add, etc.)
- [ ] Integração com Vercel Analytics / GA4
- [ ] Error boundary com Sentry

### Acessibilidade
- [ ] Testar com screen readers
- [ ] Focus management em modais
- [ ] Skip links
- [ ] ARIA labels completos
- [ ] Contraste de cores (WCAG AA)

---

## ✅ Mock Data & Services

- [x] Dados mockados completos e funcionando
- [x] Funções assíncronas simulando API
- [x] Categorias, jogos, usuários, reviews, news
- [x] `api.ts` com todos endpoints necessários
- [ ] Adicionar interceptors para refresh token
- [ ] Error handling padronizado

---

## ❌ Testes

### Unit Tests
- [ ] Components: Button, GameCard, GameGrid, SearchBar
- [ ] Hooks: useGames, useGame, useAuth, useFavorites
- [ ] Utils: formatNumber, formatDate, slugify, cn

### Integration Tests
- [ ] Fluxo de busca e filtros
- [ ] Autenticação login/logout
- [ ] Favoritar/desfavoritar
- [ ] Navegação entre páginas

### E2E Tests
- [ ] Cypress/Playwright para fluxos críticos
- [ ] Mobile responsiveness
- [ ] Offline mode

---

## ❌ Documentação & Deploy

### Documentação
- [ ] README.md com setup, scripts, estrutura
- [ ] CONTRIBUTING.md
- [ ] Storybook para componentes
- [ ] API documentation (OpenAPI/Swagger)

### Deploy & CI/CD
- [ ] GitHub Actions workflow
- [ ] Vercel deployment config
- [ ] Environment variables template
- [ ] Preview deployments

---

## 📋 Priorização Sugerida

### Sprint 1 (Core Pages) ✅
1. ✅ Corrigir todos os erros de lint (bloqueiam build)
2. ✅ Completar `/game/[slug]` com GameEmbed
3. ✅ Criar `/search` page
4. ✅ Criar `/login` e `/register`

### Sprint 2 (User Features)
5. Completar `/profile` com favoritos/histórico
6. Implementar auth real
7. Adicionar RelatedGames na página do jogo

### Sprint 3 (Polish)
8. Performance: Image optimization, prefetch
9. SEO: Metadata, sitemap, structured data
10. Acessibilidade completa
11. Testes unitários + E2E

### Sprint 4 (Production Ready)
12. PWA + Offline support
13. Analytics + Error tracking
14. CI/CD + Documentação
15. Deploy production

---

## 📁 Estrutura de Arquivos (Atual)

```
src/
├── app/
│   ├── layout.tsx ✅
│   ├── page.tsx ✅
│   ├── globals.css ✅
│   ├── games/
│   │   └── page.tsx ✅
│   ├── game/
│   │   └── [slug]/
│   │       └── page.tsx ✅ (build ok)
│   ├── categories/
│   │   └── [slug]/
│   │       ├── page.tsx ✅ (build ok)
│   │       └── metadata.ts ✅
│   ├── search/
│   │   └── page.tsx ✅ (build ok)
│   ├── login/
│   │   └── page.tsx ✅
│   ├── register/
│   │   └── page.tsx ✅
│   └── profile/
│       └── (vazio) ❌
├── components/
│   ├── ui/
│   │   ├── Button.tsx ✅ (+ "use client")
│   │   ├── Skeleton.tsx ✅
│   │   ├── CategoryPill.tsx ✅
│   │   ├── SearchBar.tsx ✅
│   │   ├── Input.tsx ✅
│   │   ├── Card.tsx ✅
│   │   └── Motion.tsx ✅
│   ├── game/
│   │   ├── GameCard.tsx ✅ (+ "use client")
│   │   ├── GameGrid.tsx ✅
│   │   ├── GameEmbed.tsx ✅
│   │   ├── RelatedGames.tsx ❌ (missing)
│   │   └── FeaturedCarousel.tsx ❌ (missing)
│   ├── layout/
│   │   ├── Header.tsx ✅
│   │   ├── Footer.tsx ✅
│   │   └── SidebarFilters.tsx ❌ (missing)
│   ├── GameGrid.tsx ✅
│   ├── GameCard.tsx ✅
│   └── SearchBar.tsx ✅
├── hooks/
│   ├── use-data.ts ✅
│   ├── use-debounce.ts ❌
│   └── use-infinite-scroll.ts ❌
├── lib/
│   ├── utils.ts ✅ (formatDate aceita options)
│   ├── mock-data.ts ✅
│   └── constants.ts ❌
├── services/
│   ├── api.ts ✅
│   └── analytics.ts ❌
├── types/
│   └── index.ts ✅
└── styles/
    └── globals.css ✅
```

---

## 🔧 Comandos Úteis

```bash
# Verificar type errors (rápido, sem build)
pnpm typecheck

# Verificar lint
pnpm lint

# Corrigir auto-fixable
pnpm lint:fix

# Type check + lint (tudo)
pnpm check

# Build production
pnpm build

# Dev server
pnpm dev

# Testes
pnpm test
pnpm test:watch
```

---

*Última atualização: 2026-07-05*
*Build: ✅ Passando sem erros*
