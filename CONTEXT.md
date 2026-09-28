# Lista de Compras - Project Context

## Visão Geral
PWA (Progressive Web App) de lista de compras construído com HTML, CSS e JavaScript vanilla. Sem dependências externas. Usa localStorage para persistência de dados e Service Worker para funcionamento offline. Interface responsiva com suporte a gestures mobile (swipe, drag-and-drop, long-press).

## Estrutura de Arquivos
```
lista_compras/
├── index.html       # Markup (sidebar, main content, modais, FAB)
├── styles.css       # Estilos (dark mode, responsivo, animações)
├── app.js           # Lógica da aplicação (CRUD, filtros, gestures)
├── sw.js            # Service Worker (cache offline)
├── manifest.json    # Manifesto PWA
├── icon-192.png     # Ícone 192x192
└── icon-512.png     # Ícone 512x512
```

## Stack Tecnológica
- **HTML5** - Markup semântico, SVG inline (sem ícones externos)
- **CSS3** - Custom properties, flexbox, grid, animações, media queries
- **JavaScript ES6+** - Manipulação DOM, localStorage, eventos, Service Workers
- **PWA** - manifest.json + sw.js (cache-first strategy)

## Arquitetura

### Modelo de Dados
- **items**: `{ id, name, category, quantity, completed, createdAt, order, price }`
- **categories**: `{ id, name, color }` (9 categorias padrão)

### Categorias Padrão
Frutas, Vegetais, Laticínios, Carnes, Padaria, Bebidas, Limpeza, Higiene, Outros

### Estado
- `localStorage.shopping-list` - Array de itens
- `localStorage.shopping-categories` - Array de categorias
- `localStorage.shopping-theme` - Tema (light/dark)
- Estado em memória: `items`, `categories`, `currentFilter`, `currentCategory`, `searchTerm`

### Renderização
- `render()` - Renderiza lista de itens agrupados por categoria
- `renderCategories()` - Renderiza sidebar + selects mobile/modal
- `renderDebounced()` - Chamada debounced (300ms) após mutações
- Atualizações: `updateCounts()`, `updateProgress()`, `formatCount()`

## Componentes UI

### Sidebar (480px+) / Drawer (mobile)
- Filtros: Todos, Pendentes, Comprados (com contadores)
- Barra de progresso (%, texto, barra visual)
- Lista de categorias com badges de contagem
- Botões: limpar comprados, alternar tema, exportar
- Editar/excluir categorias clicando na cor ou botões de ação

### Conteúdo Principal
- Mobile bar (hamburger + título + contador)
- Search bar com clear button e highlight de texto
- Mobile filter chips + category select dropdown
- Item list (agrupada por categoria, collapsible em mobile)
- List footer com total estimado
- Empty state quando lista vazia

### FAB (Floating Action Button)
- Menu expandível: "Novo item" / "Nova categoria"
- Posição: bottom-right com safe area support

### Modais
- **Item modal**: Nome, categoria (select), quantidade, preço
- **Categoria modal**: Nome, color picker
- **Share modal**: Copiar texto formatado / Baixar JSON
- Swiping para fechar (mobile)
- Bottom sheet no mobile, center modal no desktop

### Interações Mobile
- Swipe right para abrir sidebar (edge swipe)
- Swipe left para fechar sidebar
- Swipe right no item para completar checkbox
- Long press (500ms) para ativar reorder
- Drag vertical para reordenar itens
- Swipe down no modal para fechar

## Funções Principais

### Items
- `addItem(name, category, quantity, price)` - Cria item
- `updateItem(id, name, category, quantity, price)` - Atualiza item
- `toggleItem(id)` - Alterna completed
- `deleteItem(id, element)` - Remove com animação slideOut
- `openEditItemModal(itemId)` - Abre modal de edição
- `getFilteredItems()` - Aplica filter + category + search

### Categorias
- `addCategory(name, color)` - Cria categoria
- `updateCategory(id, name, color)` - Atualiza
- `deleteCategory(id)` - Remove (itens ficam sem categoria)
- `getCategoryName(id)` / `getCategoryColor(id)` - Helpers

### Utilitários
- `generateId()` - ID baseado em Date.now() + random
- `removeAccents(str)` - Normalização para busca
- `escapeHtml(text)` - Sanitização
- `highlightText(text, term)` - Destaque de termo na busca
- `formatPrice(value)` - Formatação R$ (pt-BR)
- `getTotalPrice()` - Soma (preço x quantidade) de todos os itens
- `formatCount()` - String formatada de contagem
- `saveItems()` / `saveCategories()` - Persistência

### UI
- `openModal()` / `closeModal()` - Item modal
- `openCategoryModal(editing)` - Categoria modal
- `openShareModal()` / `closeShareModal()` - Share modal
- `openSidebar()` / `closeSidebar()` - Sidebar
- `generateListText()` - Texto formatado para exportação
- `copyListToClipboard()` - Copia para clipboard
- `downloadListJson()` - Exporta JSON
- `showToast(message, type)` - Notificação temporária
- `initTheme()` / `toggleTheme()` - Dark/Light mode
- `updateProgress()` - Atualiza barra de progresso
- `initModalSwipe(overlay, closeFn)` - Touch gesture em modais

## Convenções de Código

### CSS Custom Properties
- Variáveis em `:root` para cores, radii, sombras, transições
- `[data-theme="dark"]` sobrescreve para tema escuro
- Gradientes no body e componentes principais

### Breakpoints
- `359px` - Extra small
- `479px` - Mobile (<480px = mobile styles)
- `480px` - Tablet+ (sidebar visível)
- `768px` - Tablet large
- `1024px` - Desktop
- `1440px` - Large desktop

### Animações
- `slideIn` - Items aparecendo (0.25s)
- `slideOut` - Items removendo (0.25s)
- `checkboxPop` - Checkbox marcando (0.4s com bounce)
- Modais: scale + translateY (0.25s-0.3s)

### Cores Principais
- Primary: `#2563eb` (azul)
- Success: `#22c55e` (verde)
- Danger: `#ef4444` (vermelho)
- Grays: 50-900 scale

### Events & Listeners
- Event delegation em `itemList` para items dinâmicos
- Touch events: `touchstart`, `touchmove`, `touchend` com `{ passive: true/false }`
- Keyboard: Escape fecha modais/sidebar, limpa busca
- Click em overlay fecha modais/sidebar

### Service Worker
- Cache name: `lista-compras-v1`
- Strategy: Cache-first com network fallback
- Assets: todos os arquivos do projeto
- Skip waiting on install/activate

## Pontos de Atenção para Desenvolvimento

### Segurança
- `innerHTML` usado extensivamente - usar `escapeHtml()` em textos de usuário
- `createElement`/`textContent` recomendado para novos elementos

### Performance
- `render()` reconstrói toda a lista - virtualization para >100 itens
- Debounce de 300ms aplicado na maioria das ações
- Evitar múltiplos listeners no mesmo elemento

### Conhecimentos Importantes
- `touchDragId` controla estado de drag/reorder (touch)
- `draggedItemEl` controla drag (desktop)
- `longPressTimer` / `longPressFired` controlam long-press detection
- `edgeSwipeActive` / `sidebarCloseActive` controlam sidebar gestures
- `editingItemId` variável global para modo edição no modal de item
- `editingCategoryId` input hidden para modo edição no modal de categoria

### Problemas Conhecidos
- URL no sw.js usa espaços (`/lista compras/`) mas diretório usa underscore (`lista_compras/`)
- Múltiplos handlers de touch registrados no `itemList` (podem conflitar)
- Sem testes automatizados
- Sem linter/formatter configurado

## Como Executar
Abrir `index.html` diretamente no navegador ou servir via HTTP (ex: `python -m http.server 8080`).

## Comandos Úteis
- Executar local: `python3 -m http.server 8080` ou `npx serve lista_compras`
- Testar PWA: Chrome DevTools > Application > Manifest, Service Workers
- Testar offline: Chrome DevTools > Application > Service Workers > Offline checkbox
