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

---

## ❌ Páginas Faltando

### 1. Página do Jogo (`/game/[slug]`)
- [ ] Corrigir imports faltando (Card, CardHeader, CardTitle, CardDescription, CardContent, Download)
- [ ] Remover uso de `Game` type não utilizado
- [ ] Corrigir async client component warning
- [ ] Implementar GameEmbed (iframe/canvas player)
- [ ] Adicionar RelatedGames section
- [ ] Implementar botões de ação (Jogar, Favoritar, Compartilhar)
- [ ] Adicionar metadados SEO dinâmicos

### 2. Página de Categorias (`/categories/[slug]`)
- [ ] Remover variável `categoriesLoading` não usada
- [ ] Simplificar componente (versão client complexa desnecessária)
- [ ] Usar Server Components onde possível

### 3. Página de Busca (`/search`)
- [ ] Criar página completa com resultados
- [ ] Implementar busca instantânea (debounce)
- [ ] Adicionar filtros laterais
- [ ] Paginação ou infinite scroll

### 4. Autenticação
- [ ] `/login` - Formulário de login visual
- [ ] `/register` - Formulário de registro visual
- [ ] Integração com `useAuth` hook
- [ ] Protected routes para `/profile`

### 5. Perfil do Usuário (`/profile`)
- [ ] Dashboard com abas: Favoritos, Histórico, Progresso
- [ ] Integração com `useFavorites`, `useRecentlyPlayed`
- [ ] Configurações de conta

---

## ❌ Componentes Faltando

### Core Components
- [ ] **GameEmbed** - Player de jogo (iframe/canvas WebGL)
- [ ] **RelatedGames** - Carrossel de jogos relacionados
- [ ] **FeaturedCarousel** - Carrossel hero na home
- [ ] **SidebarFilters** - Filtros colapsáveis para `/games` e `/categories`
- [ ] **GameEmbed** - Wrapper para iframe com fullscreen, loading

### UI Components
- [ ] **Input** - Corrigir `className` não usado
- [ ] **Card** - Criar componente Card reutilizável
- [ ] **Modal** - Para login/register, compartilhar, etc.
- [ ] **Dropdown** - Para ordenação, filtros
- [ ] **Tabs** - Para perfil do usuário
- [ ] **Avatar** - Imagem do usuário com fallback
- [ ] **Badge** - Tags de categoria, status (NOVO, DESTAQUE)
- [ ] **Pagination** - Componente reutilizável
- [ ] **InfiniteScroll** - Hook + componente

---

## ❌ Correções de Lint (Prioridade Alta)

### src/app/page.tsx
- [ ] Corrigir parsing error: JSX closing tag para Link (linha 522)

### src/components/game/GameCard.tsx
- [ ] Corrigir parsing error: JSX closing tag para Link (linha 99)

### src/components/SearchBar.tsx
- [ ] Adicionar `aria-selected` aos botões com role="option"
- [ ] Escapar aspas nas strings JSX (linha 206)
- [ ] Remover import `Image` não usado (linha 6)

### src/components/GameCard.tsx
- [ ] Remover imports não usados: Tag, Monitor, Gamepad2, Zap
- [ ] Substituir `<img>` por `<Image>` do Next.js

### src/components/ui/Input.tsx
- [ ] Remover `className` não usado da destructuring

### src/app/categories/[slug]/page.tsx
- [ ] Remover `categoriesLoading` não usada

### src/app/game/[slug]/page.tsx
- [ ] Remover import `Game` não usado
- [ ] Adicionar imports faltando: Card, CardHeader, CardTitle, CardDescription, CardContent, Download
- [ ] Corrigir async client component warning

### src/hooks/use-data.ts
- [ ] Remover `USE_MOCK` das dependency arrays dos useCallback (apenas warnings)

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

## ❌ Mock Data & Services

### lib/mock-data.ts
- [ ] Criar arquivo com dados mockados completos
- [ ] Funções assíncronas simulando API
- [ ] Categorias, jogos, usuários, reviews, news

### Services
- [ ] `api.ts` - Verificar se todos endpoints necessários existem
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

### Sprint 1 (Core Pages)
1. Corrigir todos os erros de lint (bloqueiam build)
2. Completar `/game/[slug]` com GameEmbed
3. Criar `/search` page
4. Criar `/login` e `/register`

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

## 📁 Estrutura de Arquivos Esperada (Final)

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
│   │       └── page.tsx ❌ (lint errors)
│   ├── categories/
│   │   └── [slug]/
│   │       └── page.tsx ❌ (lint errors)
│   ├── search/
│   │   └── page.tsx ❌ (missing)
│   ├── login/
│   │   └── page.tsx ❌ (missing)
│   ├── register/
│   │   └── page.tsx ❌ (missing)
│   ├── profile/
│   │   ├── page.tsx ❌ (missing)
│   │   ├── favorites/
│   │   ├── history/
│   │   └── settings/
│   └── api/ (se necessário)
├── components/
│   ├── ui/
│   │   ├── Button.tsx ✅
│   │   ├── Skeleton.tsx ✅
│   │   ├── CategoryPill.tsx ✅
│   │   ├── SearchBar.tsx ✅ (lint warnings)
│   │   ├── Input.tsx ❌ (lint error)
│   │   ├── Card.tsx ❌ (missing)
│   │   ├── Modal.tsx ❌ (missing)
│   │   ├── Dropdown.tsx ❌ (missing)
│   │   ├── Tabs.tsx ❌ (missing)
│   │   ├── Avatar.tsx ❌ (missing)
│   │   ├── Badge.tsx ❌ (missing)
│   │   ├── Pagination.tsx ❌ (missing)
│   │   └── index.ts (barrel exports)
│   ├── game/
│   │   ├── GameCard.tsx ✅
│   │   ├── GameGrid.tsx ✅
│   │   ├── GameEmbed.tsx ❌ (missing)
│   │   ├── RelatedGames.tsx ❌ (missing)
│   │   └── FeaturedCarousel.tsx ❌ (missing)
│   ├── layout/
│   │   ├── Header.tsx ✅
│   │   ├── Footer.tsx ✅
│   │   └── SidebarFilters.tsx ❌ (missing)
│   └── SearchBar.tsx ❌ (lint warnings)
├── hooks/
│   ├── use-data.ts ✅ (warnings)
│   ├── use-debounce.ts ❌ (missing)
│   ├── use-infinite-scroll.ts ❌ (missing)
│   └── index.ts
├── lib/
│   ├── utils.ts ✅
│   ├── mock-data.ts ❌ (missing)
│   └── constants.ts ❌ (missing)
├── services/
│   ├── api.ts ✅
│   └── analytics.ts ❌ (missing)
├── types/
│   └── index.ts ✅
└── styles/
    └── globals.css ✅
```

---

## 🔧 Comandos Úteis

```bash
# Verificar lint
pnpm lint

# Corrigir auto-fixable
pnpm lint:fix

# Type check
pnpm tsc --noEmit

# Build production
pnpm build

# Dev server
pnpm dev

# Testes
pnpm test
pnpm test:watch
```

---

*Última atualização: $(date)*
*Total de tarefas: ~80+*