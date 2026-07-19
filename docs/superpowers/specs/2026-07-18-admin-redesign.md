# Admin Redesign — Latency Zero

## Overview

Redesign visual e funcional do painel administrativo, mantendo o tema cyber/neon existente. Primeiro o redesign visual, depois novas funcionalidades.

## Layout

- Sidebar `w-64` fixa à esquerda: glassmorphism (`bg-cyber-dark-surface/80 backdrop-blur-xl`), borda direita `border-white/[0.06]`
- Logo no topo: ícone stack + "ADMIN" em Orbitron neon, com glow
- Nav items com ícones Lucide (20px), label em `font-mono text-xs uppercase tracking-wider`
- Active state: barra vertical neon-green (`w-0.5 h-full bg-neon-green`) + glow sutil
- Footer da sidebar: "Voltar ao Site" + versão do admin
- Topbar sticky: breadcrumbs dinâmicos (Admin > Nome da Página) + botão "Upload Rápido" + status server (green dot pulsante)
- Mobile: sidebar oculta com hamburger, overlay escuro

### Páginas na Sidebar

| Item | Ícone | Rota |
|------|-------|------|
| Dashboard | LayoutDashboard | `/admin` |
| Jogos | Gamepad2 | `/admin/games` |
| Upload | Upload | `/admin/upload` |
| Categorias | Tags | `/admin/categories` |
| Usuários | Users | `/admin/users` |

## Dashboard (`/admin`)

### Header
- Saudação por horário: "Bom dia / Boa tarde / Boa noite, Samuteg"
- Data atual formatada (pt-BR)
- Resumo: "X jogos · Y jogadores ativos"

### Stats Row (4 cards)
Cada card: `rounded-xl bg-cyber-dark-surface/50 border border-cyber-dark-border p-5`

| Card | Ícone | Dado |
|------|-------|------|
| Jogos | Gamepad2 | `totalGames` + sparkline 7d |
| Jogadas | Play | `totalPlayCount` + sparkline 7d |
| Armazenamento | HardDrive | `totalStorage` formatado |
| Jogadores | Users | `activeUsers` (placeholder — futuro) |

Cada card com:
- Ícone em círculo neon (`w-10 h-10 rounded-full bg-neon-green/10 flex items-center justify-center`)
- Valor em `text-2xl font-bold text-neon-green`
- Sparkline SVG com `<polyline>` (últimos 7 dias, 7 pontos)
- Variação percentual em `text-xs` (verde se positivo, vermelho se negativo)

### Charts Row (2 colunas, `grid-cols-2`)

**Jogadas por Dia** — gráfico de barras SVG (últimos 14 dias)
- Eixo X: dias da semana abreviados
- Eixo Y: escala automática
- Barras em neon-green com opacidade variável
- Tooltip no hover mostrando valor exato

**Jogos por Categoria** — gráfico de pizza/donut SVG
- Fatias com cores derivadas do neon-green (diferentes opacidades)
- Legenda ao lado com nome + contagem
- Destaque no hover (fatia se expande levemente)

### Tables Row (2 colunas, `grid-cols-2`)

**Mais Populares** — top 5 jogos
| # | Título | Jogadas | 
|---|--------|---------|
| Rank | Link para `/play/{slug}` | Número |

**Atividade Recente** — últimos eventos
| Ação | Detalhe | Quando |
|------|---------|--------|
| Upload / Exclusão | Nome do jogo | `há X minutos` |

## Jogos (`/admin/games`)

### Header
- Título "Jogos" com contagem total
- Botão "Novo Jogo" → `/admin/games/new`

### Barra de ferramentas
- Input de busca com ícone de lupa (filtra por título/slug)
- Dropdown de filtro por categoria
- Dropdown de sort (Mais Recentes, A-Z, Mais Jogados)

### Tabela
```html
<table class="w-full">
  <thead class="sticky top-0 bg-cyber-dark-surface border-b border-cyber-dark-border">
    <tr>
      <th class="cursor-pointer hover:text-neon-green" data-sort="title">Título</th>
      <th>Slug</th>
      <th>Categoria</th>
      <th class="cursor-pointer" data-sort="playCount">Jogadas</th>
      <th>Tamanho</th>
      <th class="cursor-pointer" data-sort="createdAt">Criado em</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody class="divide-y divide-cyber-dark-border">
    <tr class="hover:bg-neon-green/[0.02] transition-colors">
      <td class="font-medium text-white">{title}</td>
      <td class="text-cyber-text-muted font-mono text-xs">{slug}</td>
      <td><span class="category-pill">{category}</span></td>
      <td>{playCount}</td>
      <td>{size}</td>
      <td>{createdAt formatado}</td>
      <td class="flex gap-2">
        <a href={url} target="_blank" class="icon-btn">Jogar</a>
        <button class="icon-btn text-red-400" onclick="confirmDelete">Excluir</button>
      </td>
    </tr>
  </tbody>
</table>
```

- Linhas com hover highlight
- Ações: "Jogar" (link externo), "Excluir" (modal de confirmação)
- Nenhum resultado: SVG ilustrativo + mensagem + CTA

### Paginação
- "Anterior 1 2 3 ... N Próximo"
- Botões desabilitados quando no início/fim
- Seletor de items por página (10, 20, 50)

## Upload (`/admin/upload`)

Manter funcionalidade atual (file drop + HTML paste), melhorar layout:

### Layout 2 colunas (desktop)
- **Esquerda (form)**: Título, Descrição, Categoria (select melhorado)
- **Direita (files)**: Zona de drop + preview dos arquivos

### File Drop Zone
- Mantém drag-and-drop + clique
- Lista de arquivos com ícone por tipo (.html → HTML badge verde, .js → JS badge azul, .css → CSS badge roxo, img → thumbnail)
- Tamanho de cada arquivo
- Botão remover por arquivo

### HTML Paste (collapsible, mantido)
- Textarea monospace
- Validação de HTML válido
- Botão "Publicar HTML"

## Usuários (`/admin/users`)

### Header
- Título "Usuários" + contagem total
- Info card: "Apenas Samuteg pode gerenciar administradores" (ícone Shield)

### Filtros
- Input de busca (nome, email, username)
- Filter por papel: Todos / Admin / Moderator / Usuário (pill buttons)

### Tabela
| Avatar | Nome/Username | Email | Papel | Criado em | Ações |
|--------|---------------|-------|-------|-----------|-------|
- Avatar: círculo com inicial + cor derivada do username
- Role badges: Admin = purple (`bg-purple-500/20 text-purple-400`), Moderator = blue, User = gray
- Ações: "Tornar Admin" / "Remover Admin" (com confirmação via modal)
- Rodapé da tabela: "X admins · Y moderadores · Z usuários"

## Categorias (`/admin/categories`) — NOVA

### Header
- Título "Categorias" + contagem
- Botão "Nova Categoria" abre modal

### Listagem
- Grid de cards horizontais
- Cada card: ícone grande + nome + contagem de jogos + cor + actions

### Modal de Categoria (criar/editar)
- Nome (input text)
- Slug (auto-gerado a partir do nome)
- Ícone (select de emoji predefinidos)
- Cor (select de cores predefinidas)
- Salvar / Cancelar

### Persistência
- Arquivo `_categories.json` em `public/` (similar a `_games.json`)
- API route: `GET/POST/PUT/DELETE /api/categories`

## Visual Tokens (mantendo tema existente)

| Token | Valor |
|-------|-------|
| Background page | `bg-cyber-darker` (#030305) |
| Card bg | `bg-cyber-dark-surface/50` |
| Card border | `border-cyber-dark-border` |
| Card hover border | `border-neon-green/30` |
| Text primary | `text-white` |
| Text muted | `text-cyber-text-muted` |
| Accent | `text-neon-green` / `bg-neon-green` |
| Font headings | Orbitron / `font-sans` |
| Font body/data | JetBrains Mono / `font-mono` |
| Icons | Lucide React (sem emoji) |
| Animations | 150-300ms, `ease-[cubic-bezier(0.32,0.72,0,1)]` |
| Scrollbar | Custom fina, neon-green |

## Componentes a criar/modificar

### Componentes a modificar
| Componente | Descrição |
|-----------|-----------|
| `app/admin/layout.tsx` | Substituir por novo layout com sidebar + topbar + breadcrumbs |
| `components/admin/Sparkline` | SVG sparkline de 7 pontos |
| `components/admin/BarChart` | Gráfico de barras SVG simples |
| `components/admin/PieChart` | Gráfico de pizza/donut SVG |
| `components/admin/DataTable` | Tabela reutilizável com sort, search, pagination |
| `components/admin/ConfirmModal` | Modal de confirmação de ação |
| `components/admin/CategoryModal` | Modal de criar/editar categoria |
| `components/admin/StatsCard` | Card de estatística com sparkline (melhorar StatCard existente) |

### Arquivos a modificar
| Arquivo | Mudança |
|---------|---------|
| `app/admin/layout.tsx` | Novo layout com sidebar + topbar |
| `app/admin/page.tsx` | Dashboard com stats, charts, tables |
| `app/admin/games/page.tsx` | Tabela com sort, search, pagination |
| `app/admin/upload/page.tsx` | Layout 2 colunas, preview files |
| `app/admin/users/page.tsx` | Tabela melhorada, role badges |
| `components/admin/StatCard.tsx` | Adicionar sparkline, trend |
| `components/admin/GameForm.tsx` | Ajustes visuais menores |

### Novos arquivos
| Arquivo | Descrição |
|---------|-----------|
| `app/admin/categories/page.tsx` | Página de gerenciar categorias |
| `app/admin/categories/CategoriesClient.tsx` | Client component |
| `app/api/categories/route.ts` | API route CRUD categorias |
| `lib/category-storage.ts` | Persistência de categorias |
| `components/ui/Table.tsx` | Componente de tabela base |

## Ordem de implementação

1. Layout (sidebar + topbar + breadcrumbs)
2. Componentes base (StatsCard, DataTable, Sparkline, Charts, ConfirmModal)
3. Dashboard
4. Jogos (tabela com sort/search/pagination)
5. Upload (layout 2 colunas)
6. Usuários (tabela melhorada)
7. Categorias (nova página + API + storage)
8. Ajustes finos e testes
