const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const edgeSwipeArea = document.getElementById('edgeSwipeArea');
const modalOverlay = document.getElementById('modalOverlay');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const fabBtn = document.getElementById('fabBtn');
const fabContainer = document.getElementById('fabBtn').parentElement;
const fabMenu = document.getElementById('fabMenu');
const fabAddItem = document.getElementById('fabAddItem');
const fabAddCategory = document.getElementById('fabAddCategory');
const modalForm = document.getElementById('modalForm');
const shareBtn = document.getElementById('shareBtn');
const shareModalOverlay = document.getElementById('shareModalOverlay');
const shareModalClose = document.getElementById('shareModalClose');
const shareCopyText = document.getElementById('shareCopyText');
const shareDownloadJson = document.getElementById('shareDownloadJson');
const modalItemName = document.getElementById('modalItemName');
const modalCategory = document.getElementById('modalCategory');
const modalQuantity = document.getElementById('modalQuantity');
const modalPrice = document.getElementById('modalPrice');
const modalTitle = document.getElementById('modalTitle');
const modalSubmit = document.getElementById('modalSubmit');
const itemList = document.getElementById('itemList');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const emptyState = document.getElementById('emptyState');
const itemCount = document.getElementById('itemCount');
const clearCompleted = document.getElementById('clearCompleted');
const countAll = document.getElementById('countAll');
const countPending = document.getElementById('countPending');
const countCompleted = document.getElementById('countCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');
const categoryList = document.getElementById('categoryList');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const mobileFilters = document.getElementById('mobileFilters');
const mobileFilterChips = document.querySelectorAll('.filter-chip');
const mobileCategorySelect = document.getElementById('mobileCategorySelect');
const categoryModalOverlay = document.getElementById('categoryModalOverlay');
const categoryModalClose = document.getElementById('categoryModalClose');
const categoryModalCancel = document.getElementById('categoryModalCancel');
const categoryModalTitle = document.getElementById('categoryModalTitle');
const categoryModalForm = document.getElementById('categoryModalForm');
const editingCategoryId = document.getElementById('editingCategoryId');
const categoryName = document.getElementById('categoryName');
const categoryColor = document.getElementById('categoryColor');
const categoryModalSubmit = document.getElementById('categoryModalSubmit');
const themeToggle = document.getElementById('themeToggle');
const progressBarFill = document.getElementById('progressBarFill');
const progressText = document.getElementById('progressText');
const progressPercent = document.getElementById('progressPercent');

let items = JSON.parse(localStorage.getItem('shopping-list')) || [];
items.forEach((item, i) => { if (!item.order) item.order = i; });
let categories = JSON.parse(localStorage.getItem('shopping-categories')) || [
    { id: 'frutas', name: 'Frutas', color: '#fef3c7' },
    { id: 'vegetais', name: 'Vegetais', color: '#d1fae5' },
    { id: 'laticinios', name: 'Laticínios', color: '#e0f2fe' },
    { id: 'carnes', name: 'Carnes', color: '#fee2e2' },
    { id: 'padaria', name: 'Padaria', color: '#fef9c3' },
    { id: 'bebidas', name: 'Bebidas', color: '#ede9fe' },
    { id: 'limpeza', name: 'Limpeza', color: '#ccfbf1' },
    { id: 'higiene', name: 'Higiene', color: '#fce7f3' },
    { id: 'outros', name: 'Outros', color: '#e5e7eb' }
];
let currentFilter = 'all';
let currentCategory = 'all';
let searchTerm = '';
let draggedItemEl = null;
let touchDragItem = null;
let touchDragId = null;
let touchClone = null;
let touchStartY = 0;
let touchCurrentTarget = null;

// ===================== THEME =====================

function initTheme() {
    const savedTheme = localStorage.getItem('shopping-theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.setAttribute('data-theme', 'dark');
    }
    updateThemeButton();
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('shopping-theme', newTheme);
    updateThemeButton();
}

function updateThemeButton() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const themeSpan = themeToggle.querySelector('span');
    if (themeSpan) {
        themeSpan.textContent = isDark ? 'Modo claro' : 'Modo escuro';
    }
}

// ===================== PROGRESS =====================

function updateProgress() {
    const total = items.length;
    const completed = items.filter(i => i.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (progressBarFill) {
        progressBarFill.style.width = percent + '%';
    }
    if (progressText) {
        progressText.textContent = `${completed} de ${total} itens`;
    }
    if (progressPercent) {
        progressPercent.textContent = percent + '%';
    }
}

// ===================== LABELS =====================

const filterLabels = {
    all: 'Todos',
    pending: 'Pendentes',
    completed: 'Comprados'
};

// Event listener para theme toggle
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Listen para mudanças no sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('shopping-theme')) {
        document.body.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        updateThemeButton();
    }
});

function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    sidebarClose.classList.add('sidebar-visible');
    sidebarToggle.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
}

function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    sidebar.style.display = '';
    sidebar.style.transform = '';
    sidebarOverlay.style.display = '';
    sidebarOverlay.style.opacity = '';
    sidebarClose.classList.remove('sidebar-visible');
    sidebarToggle.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
}

function openModal() {
    closeSidebar();
    renderCategorySelects();
    modalOverlay.classList.add('active');
    setTimeout(() => modalItemName.focus(), 100);
    initModalSwipe(modalOverlay, closeModal);
}

function closeModal() {
    modalOverlay.classList.remove('active');
    modalOverlay.removeEventListener('touchstart', modalOverlay._touchStart);
    modalOverlay.removeEventListener('touchmove', modalOverlay._touchMove);
    modalOverlay.removeEventListener('touchend', modalOverlay._touchEnd);
    editingItemId = null;
    modalTitle.textContent = 'Novo item';
    modalSubmit.textContent = 'Adicionar';
    modalForm.reset();
    modalQuantity.value = 1;
    modalPrice.value = '';
}

function openCategoryModal(editing = null) {
    closeSidebar();
    if (editing) {
        categoryModalTitle.textContent = 'Editar categoria';
        categoryModalSubmit.textContent = 'Salvar';
        editingCategoryId.value = editing.id;
        categoryName.value = editing.name;
        categoryColor.value = editing.color;
    } else {
        categoryModalTitle.textContent = 'Nova categoria';
        categoryModalSubmit.textContent = 'Criar';
        editingCategoryId.value = '';
        categoryName.value = '';
        categoryColor.value = '#2563eb';
    }
    categoryModalOverlay.classList.add('active');
    setTimeout(() => categoryName.focus(), 100);
    initModalSwipe(categoryModalOverlay, closeCategoryModal);
}

function closeCategoryModal() {
    categoryModalOverlay.classList.remove('active');
    categoryModalOverlay.removeEventListener('touchstart', categoryModalOverlay._touchStart);
    categoryModalOverlay.removeEventListener('touchmove', categoryModalOverlay._touchMove);
    categoryModalOverlay.removeEventListener('touchend', categoryModalOverlay._touchEnd);
    editingCategoryId.value = '';
    categoryName.value = '';
}

let modalSwipeStartY = 0;
let modalSwipeDragging = false;

function initModalSwipe(overlay, closeFn) {
    overlay.removeEventListener('touchstart', overlay._touchStart);
    overlay.removeEventListener('touchmove', overlay._touchMove);
    overlay.removeEventListener('touchend', overlay._touchEnd);
    
    overlay._touchStart = (e) => {
        const modal = overlay.querySelector('.modal, #categoryModal');
        if (!modal) return;
        modalSwipeStartY = e.touches[0].clientY;
        modalSwipeDragging = false;
    };
    
    overlay._touchMove = (e) => {
        const modal = overlay.querySelector('.modal, #categoryModal');
        if (!modal) return;
        const touchY = e.touches[0].clientY;
        const diff = touchY - modalSwipeStartY;
        
        if (diff > 15 && !modalSwipeDragging) {
            modalSwipeDragging = true;
        }
        
        if (modalSwipeDragging && diff > 0) {
            const translateY = Math.min(diff * 0.5, 200);
            modal.style.transform = `translateY(${translateY}px)`;
            e.preventDefault();
        }
    };
    
    overlay._touchEnd = () => {
        const modal = overlay.querySelector('.modal, #categoryModal');
        if (!modal) return;
        
        if (modalSwipeDragging) {
            closeFn();
            modal.style.transform = '';
        }
        modalSwipeDragging = false;
    };
    
    overlay.addEventListener('touchstart', overlay._touchStart, { passive: true });
    overlay.addEventListener('touchmove', overlay._touchMove, { passive: false });
    overlay.addEventListener('touchend', overlay._touchEnd, { passive: true });
}

function openShareModal() {
    shareModalOverlay.classList.add('active');
}

function closeShareModal() {
    shareModalOverlay.classList.remove('active');
}

function generateListText() {
    const filtered = getFilteredItems();
    const total = getTotalPrice();
    let text = '🛒 Lista de Compras\n\n';

    const categories = {};
    filtered.forEach(item => {
        const catName = getCategoryName(item.category);
        if (!categories[catName]) categories[catName] = [];
        categories[catName].push(item);
    });

    for (const [catName, catItems] of Object.entries(categories)) {
        text += `📦 ${catName}\n`;
        catItems.forEach(item => {
            const status = item.completed ? '✅' : '⬜';
            const price = item.price ? ` (R$ ${Number(item.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} × ${item.quantity} = R$ ${(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})` : '';
            text += `${status} ${item.name} - qtd: ${item.quantity}${price}\n`;
        });
        text += '\n';
    }

    if (total > 0) {
        text += `💰 Total estimado: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }

    return text;
}

function copyListToClipboard() {
    const text = generateListText();
    navigator.clipboard.writeText(text).then(() => {
        showToast('Lista copiada para a área de transferência!');
        closeShareModal();
    }).catch(() => {
        showToast('Erro ao copiar lista');
        closeShareModal();
    });
}

function downloadListJson() {
    const data = {
        items: items,
        categories: categories,
        exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lista-compras-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Lista exportada como JSON!');
    closeShareModal();
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
        error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
    };
    
    toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function saveItems() {
    localStorage.setItem('shopping-list', JSON.stringify(items));
}

function saveCategories() {
    localStorage.setItem('shopping-categories', JSON.stringify(categories));
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function getCategoryName(id) {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : id;
}

function getCategoryColor(id) {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.color : '#e5e7eb';
}

function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function formatCount() {
    const total = items.length;
    const completed = items.filter(i => i.completed).length;
    const pending = total - completed;

    if (total === 0) return 'Lista vazia';
    if (completed === 0) return `${pending} itens pendentes`;
    if (pending === 0) return `${total} itens concluídos`;
    return `${total} itens (${pending} pendente${pending > 1 ? 's' : ''})`;
}

function getFilteredItems() {
    let filtered = items;

    if (currentFilter === 'pending') {
        filtered = filtered.filter(i => !i.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(i => i.completed);
    }

    if (currentCategory !== 'all') {
        filtered = filtered.filter(i => i.category === currentCategory);
    }

    if (searchTerm) {
        const normalizedSearch = removeAccents(searchTerm.toLowerCase());
        filtered = filtered.filter(i => removeAccents(i.name.toLowerCase()).includes(normalizedSearch));
    }

    return filtered;
}

function updateCounts() {
    const total = items.length;
    const completed = items.filter(i => i.completed).length;
    const pending = total - completed;

    countAll.textContent = total;
    countPending.textContent = pending;
    countCompleted.textContent = completed;
}

function renderCategorySelects() {
    // Sidebar category list
    categoryList.innerHTML = `
        <button class="category-btn ${currentCategory === 'all' ? 'active' : ''}" data-category="all">Todas</button>
    `;
    categories.forEach(cat => {
        const count = items.filter(i => i.category === cat.id).length;
        const countHtml = count > 0 ? `<span class="count-badge">${count}</span>` : '';
        categoryList.innerHTML += `
            <span class="category-btn ${currentCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
                <span class="category-item">
                    <span class="cat-dot" style="background: ${cat.color};" data-cat-id="${cat.id}" title="Clique para editar"></span>
                    <span>${cat.name}</span>
                    ${countHtml}
                </span>
                <button class="cat-action-btn" data-edit="${cat.id}" title="Editar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                <button class="cat-action-btn delete" data-delete="${cat.id}" title="Excluir">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            </span>
        `;
    });

    // Mobile category select
    mobileCategorySelect.innerHTML = '<option value="all">Todas as categorias</option>';
    categories.forEach(cat => {
        const count = items.filter(i => i.category === cat.id).length;
        const countHtml = count > 0 ? ` (${count})` : '';
        mobileCategorySelect.innerHTML += `<option value="${cat.id}" ${currentCategory === cat.id ? 'selected' : ''}>${cat.name}${countHtml}</option>`;
    });

    // Modal category select
    modalCategory.innerHTML = '';
    categories.forEach(cat => {
        modalCategory.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
    });

    // Bind category actions
    document.querySelectorAll('.cat-action-btn[data-edit]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const catId = btn.dataset.edit;
            const cat = categories.find(c => c.id === catId);
            if (cat) openCategoryModal(cat);
        });
    });

    document.querySelectorAll('.cat-action-btn[data-delete]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const catId = btn.dataset.delete;
            if (confirm(`Excluir a categoria "${getCategoryName(catId)}"? Os itens ficarão sem categoria.`)) {
                deleteCategory(catId);
            }
        });
    });

    // Bind category dot click (edit)
    document.querySelectorAll('.cat-dot[data-cat-id]').forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            const catId = e.target.dataset.catId;
            const cat = categories.find(c => c.id === catId);
            if (cat) openCategoryModal(cat);
        });
    });

    // Bind category filter clicks
    document.querySelectorAll('.category-btn[data-category]').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            renderCategories();
            renderDebounced();
        });
    });
}

function renderCategories() {
    renderCategorySelects();
}

function addCategory(name, color) {
    const id = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
    categories.push({ id, name: name.trim(), color });
    saveCategories();
    renderCategories();
    showToast('Categoria criada!', 'success');
}

function updateCategory(id, name, color) {
    const cat = categories.find(c => c.id === id);
    if (cat) {
        cat.name = name.trim();
        cat.color = color;
        saveCategories();
        renderCategories();
        showToast('Categoria atualizada!', 'success');
    }
}

function deleteCategory(id) {
    categories = categories.filter(c => c.id !== id);
    saveCategories();
    if (currentCategory === id) currentCategory = 'all';
    renderCategories();
    renderDebounced();
    showToast('Categoria removida!', 'info');
}

function render() {
    let filtered = items;

    if (currentFilter === 'pending') {
        filtered = filtered.filter(i => !i.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(i => i.completed);
    }

    if (currentCategory !== 'all') {
        filtered = filtered.filter(i => i.category === currentCategory);
    }

    if (searchTerm) {
        const normalizedSearch = removeAccents(searchTerm.toLowerCase());
        filtered = filtered.filter(i => removeAccents(i.name.toLowerCase()).includes(normalizedSearch));
    }

    filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // Update progress
    updateProgress();
    
    itemList.innerHTML = '';

    emptyState.style.display = items.length === 0 ? 'block' : 'none';
    clearCompleted.disabled = items.filter(i => i.completed).length === 0;

    if (filtered.length === 0 && items.length > 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'empty-state';
        emptyMsg.style.display = 'block';
        emptyMsg.innerHTML = `<p>Nenhum item encontrado</p><span class="empty-hint">Tente outro filtro ou categoria</span>`;
        itemList.parentElement.insertBefore(emptyMsg, clearCompleted.nextElementSibling);
        document.querySelectorAll('.item-list + .empty-state').forEach(el => el.remove());
    } else {
        document.querySelectorAll('.empty-state').forEach(el => el.remove());
    }

    // Group by category
    const grouped = {};
    const defaultCat = { id: 'sem-categoria', name: 'Sem categoria', color: '#e5e7eb' };
    const catList = categories.length > 0 ? categories : [defaultCat];
    
    filtered.forEach(item => {
        const catId = item.category || 'sem-categoria';
        if (!grouped[catId]) {
            const cat = catList.find(c => c.id === catId) || defaultCat;
            grouped[catId] = { ...cat, items: [] };
        }
        grouped[catId].items.push(item);
    });

    // Render each category group
    for (const [catId, group] of Object.entries(grouped)) {
        const groupEl = document.createElement('div');
        groupEl.className = 'category-group';
        
        const headerEl = document.createElement('div');
        headerEl.className = 'category-group-header';
        headerEl.innerHTML = `
            <span class="category-group-dot" style="background: ${group.color};"></span>
            <span class="category-group-name">${group.name}</span>
            <span class="category-group-count">${group.items.length} item${group.items.length > 1 ? 's' : ''}</span>
        `;
        
        // Mobile: collapsible
        if (window.innerWidth < 480) {
            headerEl.addEventListener('click', () => {
                groupEl.classList.toggle('collapsed');
            });
        }
        
        groupEl.appendChild(headerEl);
        
        const itemsEl = document.createElement('div');
        itemsEl.className = 'category-group-items';
        
        group.items.forEach(item => {
            const li = document.createElement('li');
            li.className = `item ${item.completed ? 'completed' : ''}`;
            li.dataset.id = item.id;
            const catColor = getCategoryColor(item.category);
            const catName = getCategoryName(item.category);

            li.innerHTML = `
                <span class="drag-handle" aria-label="Arrastar para reordenar">
                    <svg viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="5" cy="3" r="1.2"/><circle cx="11" cy="3" r="1.2"/>
                        <circle cx="5" cy="8" r="1.2"/><circle cx="11" cy="8" r="1.2"/>
                        <circle cx="5" cy="13" r="1.2"/><circle cx="11" cy="13" r="1.2"/>
                    </svg>
                </span>
                <label class="checkbox-wrapper">
                    <input type="checkbox" ${item.completed ? 'checked' : ''}>
                    <div class="checkbox">
                        <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                </label>
                <div class="item-content">
                    <div class="item-name">${highlightText(item.name, searchTerm)}</div>
                    <div class="item-meta">
                        <span class="quantity-badge">x${item.quantity}</span>
                        ${item.price ? `<span class="price-badge">${formatPrice(item.price)}</span>` : ''}
                    </div>
                </div>
                <button class="btn-edit" aria-label="Editar item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                <button class="btn-delete" aria-label="Remover item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <path d="M3 6h18"/>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                </button>
            `;

            const checkbox = li.querySelector('input[type="checkbox"]');
            const editBtn = li.querySelector('.btn-edit');
            const deleteBtn = li.querySelector('.btn-delete');

            checkbox.addEventListener('change', () => toggleItem(item.id));
            editBtn.addEventListener('click', () => openEditItemModal(item.id));
            deleteBtn.addEventListener('click', () => deleteItem(item.id, li));

            itemsEl.appendChild(li);
        });
        
        groupEl.appendChild(itemsEl);
        itemList.appendChild(groupEl);
    }

    itemCount.textContent = formatCount();
    updateCounts();
    const total = getTotalPrice();
    const footer = document.getElementById('listFooter');
    if (footer) {
        footer.style.display = total > 0 ? 'flex' : 'none';
        document.getElementById('totalPrice').textContent = formatPrice(total);
    }
}

let editingItemId = null;
let renderTimeout = null;

function renderDebounced() {
    if (renderTimeout) clearTimeout(renderTimeout);
    renderTimeout = setTimeout(render, 300);
}

function openEditItemModal(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    editingItemId = itemId;
    renderCategorySelects();
    modalTitle.textContent = 'Editar item';
    modalItemName.value = item.name;
    modalCategory.value = item.category;
    modalQuantity.value = item.quantity;
    modalPrice.value = item.price || '';
    modalSubmit.textContent = 'Salvar';
    modalOverlay.classList.add('active');
    setTimeout(() => modalItemName.focus(), 100);
}


function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function highlightText(text, term) {
    if (!term) return escapeHtml(text);
    const escaped = escapeHtml(text);
    const normalizedSearch = removeAccents(term.toLowerCase());
    const normalizedText = removeAccents(text.toLowerCase());
    const idx = normalizedText.indexOf(normalizedSearch);
    if (idx === -1) return escaped;
    const before = escaped.substring(0, idx);
    const match = escaped.substring(idx, idx + term.length);
    const after = escaped.substring(idx + term.length);
    return `${before}<mark>${match}</mark>${after}`;
}

function formatPrice(value) {
    if (value === null || value === undefined || isNaN(value)) return 'R$ 0,00';
    return 'R$ ' + Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getTotalPrice() {
    return items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
}

function addItem(name, category, quantity, price) {
    items.push({
        id: generateId(),
        name: name.trim(),
        category,
        quantity: parseInt(quantity),
        completed: false,
        createdAt: Date.now(),
        order: Date.now(),
        price: price ? parseFloat(price) : 0
    });
    saveItems();
    renderDebounced();
    showToast('Item adicionado!', 'success');
}

function updateItem(id, name, category, quantity, price) {
    const item = items.find(i => i.id === id);
    if (!item) return;
    item.name = name.trim();
    item.category = category;
    item.quantity = parseInt(quantity);
    item.price = price ? parseFloat(price) : 0;
    saveItems();
    renderDebounced();
    showToast('Item atualizado!');
}

function toggleItem(id) {
    const item = items.find(i => i.id === id);
    if (item) {
        item.completed = !item.completed;
        saveItems();
        renderDebounced();
        showToast(item.completed ? 'Item comprado!' : 'Item desmarcado!', 'success');
    }
}

function deleteItem(id, element) {
    element.classList.add('removing');
    setTimeout(() => {
        items = items.filter(i => i.id !== id);
        saveItems();
        renderDebounced();
        showToast('Item removido!', 'info');
    }, 250);
}

clearCompleted.addEventListener('click', () => {
    const count = items.filter(i => i.completed).length;
    items = items.filter(i => !i.completed);
    saveItems();
    renderDebounced();
    if (count > 0) showToast(`${count} item(ns) removido(s)!`, 'info');
});

fabBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fabContainer.classList.toggle('open');
});

fabAddItem.addEventListener('click', (e) => {
    e.stopPropagation();
    fabContainer.classList.remove('open');
    openModal();
});

fabAddCategory.addEventListener('click', (e) => {
    e.stopPropagation();
    fabContainer.classList.remove('open');
    openCategoryModal();
});

document.addEventListener('click', (e) => {
    if (!fabContainer.contains(e.target) && fabContainer.classList.contains('open')) {
        fabContainer.classList.remove('open');
    }
});
shareBtn.addEventListener('click', openShareModal);
shareModalClose.addEventListener('click', closeShareModal);
shareCopyText.addEventListener('click', copyListToClipboard);
shareDownloadJson.addEventListener('click', downloadListJson);

modalClose.addEventListener('click', closeModal);
modalCancel.addEventListener('click', closeModal);
sidebarClose.addEventListener('click', closeSidebar);
sidebarToggle.addEventListener('click', openSidebar);
addCategoryBtn.addEventListener('click', () => openCategoryModal());
categoryModalClose.addEventListener('click', closeCategoryModal);
categoryModalCancel.addEventListener('click', closeCategoryModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

shareModalOverlay.addEventListener('click', (e) => {
    if (e.target === shareModalOverlay) closeShareModal();
});

categoryModalOverlay.addEventListener('click', (e) => {
    if (e.target === categoryModalOverlay) closeCategoryModal();
});

document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') && e.target === sidebarOverlay) {
        closeSidebar();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (categoryModalOverlay.classList.contains('active')) {
            closeCategoryModal();
        } else if (shareModalOverlay.classList.contains('active')) {
            closeShareModal();
        } else if (modalOverlay.classList.contains('active')) {
            closeModal();
        } else if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else if (searchTerm) {
            searchTerm = '';
            searchInput.value = '';
            searchClear.style.display = 'none';
            renderDebounced();
            showToast('Busca limpa!', 'info');
        }
    }
});

searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.trim();
    searchClear.style.display = searchTerm ? 'flex' : 'none';
    renderDebounced();
});

searchClear.addEventListener('click', () => {
    searchTerm = '';
    searchInput.value = '';
    searchClear.style.display = 'none';
    searchInput.focus();
    renderDebounced();
    showToast('Busca limpa!', 'info');
});

modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = modalItemName.value.trim();
    const category = modalCategory.value;
    const quantity = modalQuantity.value || 1;
    const price = modalPrice.value;

    if (!name) return;

    if (editingItemId) {
        updateItem(editingItemId, name, category, quantity, price);
    } else {
        addItem(name, category, quantity, price);
    }
    closeModal();
});

categoryModalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = categoryName.value.trim();
    const color = categoryColor.value;
    const editId = editingCategoryId.value;

    if (!name) return;

    if (editId) {
        updateCategory(editId, name, color);
    } else {
        addCategory(name, color);
    }

    closeCategoryModal();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderDebounced();
    });
});

mobileFilterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        mobileFilterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentFilter = chip.dataset.filter;

        filterBtns.forEach(b => {
            if (b.dataset.filter === currentFilter) b.classList.add('active');
            else b.classList.remove('active');
        });

        renderDebounced();
    });
});

mobileCategorySelect.addEventListener('change', (e) => {
    currentCategory = e.target.value;

    document.querySelectorAll('.category-btn').forEach(btn => {
        if (btn.dataset.category === currentCategory) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    renderDebounced();
});

renderCategories();
render();
initTheme();

itemList.addEventListener('dragstart', (e) => {
    const itemEl = e.target.closest('.item');
    if (!itemEl || !e.target.closest('.drag-handle')) {
        draggedItemEl = null;
        return;
    }
    draggedItemEl = itemEl;
    itemEl.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemEl.dataset.id);
});

itemList.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const itemEl = e.target.closest('.item');
    if (itemEl && itemEl !== draggedItemEl) {
        itemEl.classList.add('drag-over');
    }
});

itemList.addEventListener('dragleave', (e) => {
    const itemEl = e.target.closest('.item');
    if (itemEl) itemEl.classList.remove('drag-over');
});

itemList.addEventListener('drop', (e) => {
    e.preventDefault();
    const targetItemEl = e.target.closest('.item');
    if (!targetItemEl || targetItemEl === draggedItemEl) return;
    const draggedId = e.dataTransfer.getData('text/plain');
    const targetId = targetItemEl.dataset.id;
    const draggedIdx = items.findIndex(i => i.id === draggedId);
    const targetIdx = items.findIndex(i => i.id === targetId);
    if (draggedIdx > -1 && targetIdx > -1) {
        const [dragged] = items.splice(draggedIdx, 1);
        items.splice(targetIdx, 0, dragged);
        items.forEach((item, i) => item.order = i);
        saveItems();
        renderDebounced();
    }
    targetItemEl.classList.remove('drag-over');
});

itemList.addEventListener('dragend', () => {
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    draggedItemEl = null;
});

let touchDragStartIndex = -1;
let touchDragging = false;
let touchStartX = 0;
let touchCurrentX = 0;
let touchItemEl = null;
let touchDeltaX = 0;

let longPressTimer = null;
let longPressFired = false;
let longPressItemEl = null;

// Touch handlers - swipe + long press
itemList.addEventListener('touchstart', (e) => {
    const itemEl = e.target.closest('.item');
    if (!itemEl) return;
    if (e.target.closest('.drag-handle') || e.target.closest('.btn-edit') || e.target.closest('.btn-delete')) return;
    touchItemEl = itemEl;
    longPressItemEl = itemEl;
    longPressFired = false;
    touchStartX = e.touches[0].clientX;
    touchCurrentX = touchStartX;
    touchDeltaX = 0;
    
    longPressTimer = setTimeout(() => {
        if (Math.abs(touchDeltaX) < 20) {
            longPressFired = true;
            activateReorder(itemEl);
        }
        longPressTimer = null;
    }, 500);
}, { passive: true });

itemList.addEventListener('touchmove', (e) => {
    if (!touchItemEl) return;
    if (longPressFired) return;
    touchCurrentX = e.touches[0].clientX;
    touchDeltaX = touchCurrentX - touchStartX;
    
    if (Math.abs(touchDeltaX) > 20) {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
    }
    
    if (Math.abs(touchDeltaX) > 5) {
        touchItemEl.style.transform = `translateX(${Math.max(-20, Math.min(touchDeltaX, 150))}px)`;
        e.preventDefault();
    }
}, { passive: false });

itemList.addEventListener('touchend', () => {
    if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
    }
    
    if (longPressFired) return;
    
    if (touchItemEl) {
        if (touchDeltaX > 50) {
            touchItemEl.style.transform = `translateX(80px)`;
            const checkbox = touchItemEl.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        } else {
            touchItemEl.style.transform = '';
        }
        touchItemEl = null;
        touchDeltaX = 0;
    }
});

function activateReorder(itemEl) {
    const item = items.find(i => i.id === itemEl.dataset.id);
    if (!item) return;
    touchDragId = item.id;
    touchDragStartIndex = items.indexOf(item);
    touchStartY = 0;
    touchDragging = false;
    itemEl.classList.add('dragging');
    document.body.style.userSelect = 'none';
}

// Drag handlers
itemList.addEventListener('touchstart', (e) => {
    if (e.target.closest('.drag-handle')) {
        const itemEl = e.target.closest('.item');
        if (!itemEl) return;
        touchDragId = itemEl.dataset.id;
        touchDragStartIndex = items.findIndex(i => i.id === touchDragId);
        touchStartY = e.touches[0].clientY;
        touchDragging = false;
    }
}, { passive: true });

itemList.addEventListener('touchmove', (e) => {
    if (!touchDragId) return;
    const touchY = e.touches[0].clientY;
    const diff = Math.abs(touchY - touchStartY);
    if (!touchDragging && diff < 10) return;
    if (!touchDragging) {
        touchDragging = true;
        const itemEl = itemList.querySelector(`[data-id="${touchDragId}"]`);
        if (itemEl) itemEl.classList.add('dragging');
        document.body.style.userSelect = 'none';
    }
    const targetEl = document.elementFromPoint(e.touches[0].clientX, touchY);
    const itemEl = targetEl?.closest('.item');
    if (itemEl && itemEl.dataset.id !== touchDragId) {
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        itemEl.classList.add('drag-over');
        touchCurrentTarget = itemEl;
    }
}, { passive: true });

itemList.addEventListener('touchend', (e) => {
    if (!touchDragId || !touchDragging) {
        touchDragId = null;
        touchDragging = false;
        return;
    }
    const targetEl = touchCurrentTarget;
    if (targetEl && targetEl.dataset.id !== touchDragId) {
        const targetId = targetEl.dataset.id;
        const targetIdx = items.findIndex(i => i.id === targetId);
        if (touchDragStartIndex > -1 && targetIdx > -1 && touchDragStartIndex !== targetIdx) {
            const [dragged] = items.splice(touchDragStartIndex, 1);
            const newIdx = touchDragStartIndex > targetIdx ? targetIdx : targetIdx + 1;
            items.splice(newIdx, 0, dragged);
            items.forEach((item, i) => item.order = i);
            saveItems();
            renderDebounced();
        }
    }
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    document.body.style.userSelect = '';
    touchDragId = null;
    touchDragging = false;
    touchCurrentTarget = null;
    touchDragStartIndex = -1;
});

let edgeSwipeStartX = 0;
let edgeSwipeActive = false;

edgeSwipeArea.addEventListener('touchstart', (e) => {
    if (sidebar.classList.contains('open')) return;
    edgeSwipeStartX = e.touches[0].clientX;
    edgeSwipeActive = true;
}, { passive: true });

edgeSwipeArea.addEventListener('touchmove', (e) => {
    if (!edgeSwipeActive) return;
    const touchX = e.touches[0].clientX;
    const deltaX = touchX - edgeSwipeStartX;
    if (deltaX <= 5) return;
    if (!sidebar.classList.contains('open')) {
        sidebar.style.display = 'flex';
    }
    const progress = Math.min(deltaX / 100, 1);
    sidebar.style.transform = `translateX(${-280 + (280 * progress)}px)`;
    sidebarOverlay.style.display = 'block';
    sidebarOverlay.style.opacity = progress;
    e.preventDefault();
}, { passive: false });

edgeSwipeArea.addEventListener('touchend', () => {
    if (!edgeSwipeActive) return;
    edgeSwipeActive = false;
    const transform = sidebar.style.transform;
    if (transform) {
        const match = transform.match(/translateX\((.*)px\)/);
        const currentX = match ? parseFloat(match[1]) : -280;
        if (currentX > -100) {
            openSidebar();
            sidebarOverlay.style.opacity = '';
        } else {
            sidebar.style.transform = '';
            sidebar.style.display = '';
            sidebarOverlay.style.display = 'none';
            sidebarOverlay.style.opacity = '';
        }
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('SW registrado:', registration.scope);
            })
            .catch((error) => {
                console.log('Falha no SW:', error);
            });
    });
}

// Swipe to close sidebar on mobile
let sidebarCloseActive = false;
let sidebarCloseStartX = 0;
let sidebarCloseDistX = 0;

document.addEventListener('touchstart', (e) => {
    if (!sidebar.classList.contains('open')) return;
    if (e.target.closest('.btn-edit') || e.target.closest('.btn-delete') || e.target.closest('.drag-handle') || e.target.closest('.sidebar-close')) return;
    sidebarCloseStartX = e.touches[0].clientX;
    sidebarCloseActive = true;
    sidebarCloseDistX = 0;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    if (!sidebarCloseActive) return;
    const touchX = e.touches[0].clientX;
    sidebarCloseDistX = touchX - sidebarCloseStartX;
    
    if (sidebarCloseDistX < -5) {
        const progress = Math.abs(sidebarCloseDistX / 100);
        const clamped = Math.min(progress, 1);
        sidebar.style.transition = 'none';
        sidebar.style.transform = `translateX(${-clamped * 280}px)`;
        sidebarOverlay.style.opacity = Math.max(0, 1 - clamped);
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchend', () => {
    if (!sidebarCloseActive) return;
    sidebarCloseActive = false;
    sidebar.style.transition = '';
    if (sidebarCloseDistX < -100) {
        closeSidebar();
    } else {
        sidebar.style.transform = '';
        sidebarOverlay.style.opacity = '';
    }
}, { passive: true });

