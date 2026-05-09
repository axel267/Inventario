// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: "AIzaSyD87O7QCdy26JPdzcQrOHZcYEG17jmoEVE",
  authDomain: "miinventary.firebaseapp.com",
  projectId: "miinventary",
  storageBucket: "miinventary.firebasestorage.app",
  messagingSenderId: "191420103988",
  appId: "1:191420103988:web:be7594143a6801533cf961",
  measurementId: "G-N726BCSK4C"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===== LocalStorage Migration Helper =====
async function migrateToCloud() {
    try {
        const localFolders = JSON.parse(localStorage.getItem('inventario_folders') || '[]');
        const localProducts = JSON.parse(localStorage.getItem('inventario_products') || '[]');
        
        if (localFolders.length > 0 || localProducts.length > 0) {
            console.log('🚀 Migración: Detectados datos locales. Subiendo...');
            for (const f of localFolders) await db.collection('folders').doc(f.id).set(f);
            for (const p of localProducts) await db.collection('products').doc(p.id).set(p);
            
            localStorage.removeItem('inventario_folders');
            localStorage.removeItem('inventario_products');
            console.log('✅ Migración: ¡Todo subido a la nube!');
            showToast('Sincronización inicial completada', 'success');
        }
    } catch (err) {
        console.error('❌ Error en migración:', err);
    }
}

// ===== State & Sync =====
let folders = [];
let products = [];
let currentFolderId = null;  // null = root
let currentStockProductId = null;
let currentDeleteProductId = null;
let currentDeleteFolderId = null;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔌 Conectando con Firebase & Auth...');
    
    // Auth Listener
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            console.log('👤 Usuario autenticado:', user.email);
            $('#loginOverlay').style.display = 'none';
            await migrateToCloud();
            loadData();
            showFolder(null); // Empezar en la raíz
            updateStats();
            bindEvents();
        } else {
            console.log('🚪 No hay sesión activa');
            $('#loginOverlay').style.display = 'flex';
            bindLoginEvents();
        }
    });

    registerServiceWorker();
});

function bindLoginEvents() {
    $('#loginForm').addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
    e.preventDefault();
    const email = $('#loginEmail').value.trim();
    const password = $('#loginPassword').value;
    const errorEl = $('#loginError');
    const btn = e.target.querySelector('button');

    btn.disabled = true;
    btn.textContent = 'Verificando...';
    errorEl.textContent = '';

    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        showToast('¡Bienvenido de nuevo!', 'success');
    } catch (err) {
        console.error('Login error:', err);
        errorEl.textContent = 'Correo o contraseña incorrectos.';
        btn.disabled = false;
        btn.textContent = 'Entrar al Inventario';
    }
}

function loadData() {
    // Listen to Folders
    db.collection('folders').onSnapshot((snapshot) => {
        folders = snapshot.docs.map(doc => doc.data());
        renderCurrentFolder();
    }, err => console.error('❌ Error leyendo carpetas:', err));

    // Listen to Products
    db.collection('products').onSnapshot((snapshot) => {
        products = snapshot.docs.map(doc => doc.data());
        products.forEach(p => { if (p.totalSold === undefined) p.totalSold = 0; });
        renderCurrentFolder();
    }, err => console.error('❌ Error leyendo productos:', err));
}

async function saveFolderToCloud(folder) { await db.collection('folders').doc(folder.id).set(folder); }
async function deleteFolderFromCloud(id) { await db.collection('folders').doc(id).delete(); }

async function saveProductToCloud(product) { await db.collection('products').doc(product.id).set(product); }
async function deleteProductFromCloud(id) { await db.collection('products').doc(id).delete(); }

// ===== Navigation & Rendering =====
function showFolder(id) {
    currentFolderId = id;
    renderCurrentFolder();
}

function renderCurrentFolder() {
    renderBreadcrumb();
    renderFolders();
    renderProducts();
    renderChart();
    updateStats();
    
    // Back button visibility
    $('#btnBack').style.display = currentFolderId ? 'flex' : 'none';
}

function renderBreadcrumb() {
    const title = $('#breadcrumbTitle');
    if (!currentFolderId) {
        title.textContent = '📁 Mis Inventarios';
        return;
    }
    
    const path = getPath(currentFolderId);
    title.innerHTML = `
        <span onclick="showFolder(null)" style="cursor:pointer">Inicio</span>
        ${path.map(f => ` <span class="path-sep">/</span> <span onclick="showFolder('${f.id}')" style="cursor:pointer">${f.icon} ${f.name}</span>`).join('')}
    `;
}

function getPath(folderId) {
    let path = [];
    let current = folders.find(f => f.id === folderId);
    while (current) {
        path.unshift(current);
        current = folders.find(f => f.id === current.parentId);
    }
    return path;
}

function goBack() {
    if (!currentFolderId) return;
    const folder = folders.find(f => f.id === currentFolderId);
    showFolder(folder ? folder.parentId : null);
}

// ===== Events =====
function bindEvents() {
    // Folder modal
    $('#btnNewFolder').addEventListener('click', openAddFolderModal);
    $('#btnCloseFolderModal').addEventListener('click', () => closeModal($('#folderModalOverlay')));
    $('#btnCancelFolder').addEventListener('click', () => closeModal($('#folderModalOverlay')));
    $('#folderForm').addEventListener('submit', handleFolderSubmit);

    // Delete folder modal
    $('#btnCloseDeleteFolderModal').addEventListener('click', () => closeModal($('#deleteFolderModalOverlay')));
    $('#btnCancelDeleteFolder').addEventListener('click', () => closeModal($('#deleteFolderModalOverlay')));
    $('#btnConfirmDeleteFolder').addEventListener('click', handleDeleteFolderConfirm);

    // Icon buttons
    $$('.icon-btn').forEach(btn => {
        btn.addEventListener('click', () => { $('#folderIcon').value = btn.dataset.icon; });
    });

    // Color buttons
    $$('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Back
    $('#btnBack').addEventListener('click', goBack);

    // Product modal
    $('#btnOpenModal').addEventListener('click', openAddModal);
    $('#btnCloseModal').addEventListener('click', () => closeModal($('#modalOverlay')));
    $('#btnCancel').addEventListener('click', () => closeModal($('#modalOverlay')));
    $('#productForm').addEventListener('submit', handleFormSubmit);

    // Image upload
    const imageUploadArea = $('#imageUploadArea');
    const productImage = $('#productImage');
    imageUploadArea.addEventListener('click', () => productImage.click());
    productImage.addEventListener('change', handleImageSelect);
    imageUploadArea.addEventListener('dragover', (e) => { e.preventDefault(); imageUploadArea.style.borderColor = 'var(--accent-primary)'; });
    imageUploadArea.addEventListener('dragleave', () => { imageUploadArea.style.borderColor = ''; });
    imageUploadArea.addEventListener('drop', (e) => {
        e.preventDefault(); imageUploadArea.style.borderColor = '';
        if (e.dataTransfer.files.length > 0) { productImage.files = e.dataTransfer.files; handleImageSelect({ target: productImage }); }
    });

    // Stock modal
    $('#btnCloseStockModal').addEventListener('click', () => closeModal($('#stockModalOverlay')));
    $('#stockBtnMinus').addEventListener('click', () => adjustStock(-getStockAdjustAmount()));
    $('#stockBtnPlus').addEventListener('click', () => adjustStock(getStockAdjustAmount()));
    $$('.quick-btn').forEach(btn => { btn.addEventListener('click', () => { $('#stockAdjustInput').value = btn.dataset.amount; }); });
    $('#btnSetStock').addEventListener('click', handleSetStock);

    // Delete modal
    $('#btnCloseDeleteModal').addEventListener('click', () => closeModal($('#deleteModalOverlay')));
    $('#btnCancelDelete').addEventListener('click', () => closeModal($('#deleteModalOverlay')));
    $('#btnConfirmDelete').addEventListener('click', handleDeleteConfirm);

    // Search
    $('#searchInput').addEventListener('input', () => renderCurrentFolder());

    // Close overlays on click outside / Escape
    ['modalOverlay', 'stockModalOverlay', 'deleteModalOverlay', 'folderModalOverlay', 'deleteFolderModalOverlay'].forEach(id => {
        const el = $('#' + id);
        el.addEventListener('click', (e) => { if (e.target === el) closeModal(el); });
    });
    // Chart toggle & reset
    $('#btnToggleChart').addEventListener('click', toggleChart);
    $('#btnResetSales').addEventListener('click', resetSales);
    $('#btnLogout').addEventListener('click', () => firebase.auth().signOut());

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            ['modalOverlay', 'stockModalOverlay', 'deleteModalOverlay', 'folderModalOverlay', 'deleteFolderModalOverlay']
                .forEach(id => closeModal($('#' + id)));
        }
    });
}

// ===== Modal Helpers =====
function openModal(overlay) { overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeModal(overlay) { overlay.classList.remove('active'); document.body.style.overflow = ''; }

// ===== FOLDERS =====
function openAddFolderModal() {
    $('#folderModalTitle').textContent = 'Nueva Carpeta';
    $('#folderForm').reset();
    $('#folderIcon').value = '📦';
    $('#editFolderId').value = '';
    $$('.color-btn').forEach(b => b.classList.remove('active'));
    $('.color-btn').classList.add('active');
    openModal($('#folderModalOverlay'));
}

function openEditFolderModal(id) {
    const folder = folders.find(f => f.id === id);
    if (!folder) return;
    $('#folderModalTitle').textContent = 'Editar Carpeta';
    $('#folderName').value = folder.name;
    $('#folderIcon').value = folder.icon;
    $('#editFolderId').value = folder.id;
    $$('.color-btn').forEach(b => {
        b.classList.remove('active');
        if (b.dataset.color === folder.color) b.classList.add('active');
    });
    openModal($('#folderModalOverlay'));
}

function handleFolderSubmit(e) {
    e.preventDefault();
    const name = $('#folderName').value.trim();
    const icon = $('#folderIcon').value.trim() || '📦';
    const activeColor = $('.color-btn.active');
    const color = activeColor ? activeColor.dataset.color : '#6c63ff';
    const editId = $('#editFolderId').value;

    if (!name) { showToast('El nombre es obligatorio', 'error'); return; }

    if (editId) {
        const folder = folders.find(f => f.id === editId);
        if (folder) {
            saveFolderToCloud({ ...folder, name, icon, color });
            showToast('Carpeta actualizada ✅', 'success');
        }
    } else {
        const newFolder = { 
            id: generateId(), 
            parentId: currentFolderId, 
            name, icon, color,
            createdAt: new Date().toISOString() 
        };
        saveFolderToCloud(newFolder);
        showToast('Carpeta creada ✅', 'success');
    }

    closeModal($('#folderModalOverlay'));
}

function openDeleteFolderModal(id) {
    const folder = folders.find(f => f.id === id);
    if (!folder) return;
    currentDeleteFolderId = id;
    $('#deleteFolderName').textContent = `${folder.icon} ${folder.name}`;
    openModal($('#deleteFolderModalOverlay'));
}

async function handleDeleteFolderConfirm() {
    if (!currentDeleteFolderId) return;
    
    // Recursive Delete
    const foldersToDelete = getAllSubfolderIds(currentDeleteFolderId);
    foldersToDelete.push(currentDeleteFolderId);
    
    for (const fid of foldersToDelete) {
        // Delete products in this subfolder
        const prods = products.filter(p => p.folderId === fid);
        for (const p of prods) await deleteProductFromCloud(p.id);
        // Delete folder
        await deleteFolderFromCloud(fid);
    }
    
    currentDeleteFolderId = null;
    closeModal($('#deleteFolderModalOverlay'));
    showToast('Carpeta y contenido eliminados', 'error');
}

function getAllSubfolderIds(parentId) {
    let ids = [];
    const subs = folders.filter(f => f.parentId === parentId);
    for (const sub of subs) {
        ids.push(sub.id);
        ids = ids.concat(getAllSubfolderIds(sub.id));
    }
    return ids;
}

function renderFolders() {
    const grid = $('#folderGrid');
    const filtered = folders.filter(f => f.parentId === currentFolderId);

    if (filtered.length === 0) {
        grid.innerHTML = '';
        return;
    }

    grid.innerHTML = filtered.map((folder, i) => {
        const count = folders.filter(f => f.parentId === folder.id).length + 
                      products.filter(p => p.folderId === folder.id).length;
        return `
        <div class="folder-card" style="--folder-color:${folder.color}; animation-delay:${i * 0.06}s"
             onclick="showFolder('${folder.id}')">
            <div class="folder-card-actions">
                <button class="folder-action-btn" onclick="event.stopPropagation(); openEditFolderModal('${folder.id}')" title="Editar">✏️</button>
                <button class="folder-action-btn delete" onclick="event.stopPropagation(); openDeleteFolderModal('${folder.id}')" title="Eliminar">🗑️</button>
            </div>
            <span class="folder-card-icon">${folder.icon}</span>
            <div class="folder-card-name">${escapeHtml(folder.name)}</div>
            <div class="folder-card-count"><span>${count}</span> elementos</div>
        </div>`;
    }).join('');
}

// ===== PRODUCTS =====
function openAddModal() {
    $('#modalTitle').textContent = 'Agregar Producto';
    $('#productForm').reset();
    $('#editProductId').value = '';
    $('#imageUploadArea').classList.remove('has-image');
    $('#imagePreview').src = '';
    openModal($('#modalOverlay'));
}

function openEditModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    $('#modalTitle').textContent = 'Editar Producto';
    $('#productName').value = product.name;
    $('#productDescription').value = product.description || '';
    $('#productStock').value = product.stock;
    $('#editProductId').value = product.id;
    if (product.image) { $('#imagePreview').src = product.image; $('#imageUploadArea').classList.add('has-image'); }
    else { $('#imageUploadArea').classList.remove('has-image'); $('#imagePreview').src = ''; }
    openModal($('#modalOverlay'));
}

function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('Imagen muy grande. Máx 5MB.', 'error'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
        resizeImage(ev.target.result, 400, 400, (resized) => {
            $('#imagePreview').src = resized;
            $('#imageUploadArea').classList.add('has-image');
        });
    };
    reader.readAsDataURL(file);
}

function resizeImage(dataUrl, maxW, maxH, cb) {
    const img = new Image();
    img.onload = () => {
        let w = img.width, h = img.height;
        if (w > maxW || h > maxH) { const r = Math.min(maxW/w, maxH/h); w = Math.round(w*r); h = Math.round(h*r); }
        const c = document.createElement('canvas'); c.width = w; c.height = h;
        c.getContext('2d').drawImage(img, 0, 0, w, h);
        cb(c.toDataURL('image/jpeg', 0.7));
    };
    img.src = dataUrl;
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const editId = $('#editProductId').value;
    const name = $('#productName').value.trim();
    const description = $('#productDescription').value.trim();
    const stock = parseInt($('#productStock').value) || 0;
    const image = $('#imagePreview').src || '';

    if (!name) { showToast('El nombre es obligatorio', 'error'); return; }

    if (editId) {
        const product = products.find(p => p.id === editId);
        if (product) {
            const updated = { ...product, name, description, stock, image: image || product.image, updatedAt: new Date().toISOString() };
            await saveProductToCloud(updated);
            showToast('Producto actualizado ✅', 'success');
        }
    } else {
        const newProduct = { 
            id: generateId(), 
            folderId: currentFolderId, // Guardamos en la carpeta actual
            name, description, stock, 
            image: image || '', 
            totalSold: 0, 
            createdAt: new Date().toISOString(), 
            updatedAt: new Date().toISOString() 
        };
        await saveProductToCloud(newProduct);
        showToast('Producto agregado ✅', 'success');
    }
    closeModal($('#modalOverlay'));
}

function renderProducts() {
    const grid = $('#productGrid');
    const empty = $('#emptyState');
    const filter = ($('#searchInput')?.value || '').trim().toLowerCase();

    // Filtramos productos que pertenecen a la carpeta actual
    let filtered = products.filter(p => p.folderId === currentFolderId);

    // Si hay búsqueda, buscamos en TODOS los productos para facilitar encontrar cosas
    if (filter) {
        filtered = products.filter(p =>
            p.name.toLowerCase().includes(filter) ||
            (p.description && p.description.toLowerCase().includes(filter))
        );
    }

    const folderHasContent = folders.some(f => f.parentId === currentFolderId) || filtered.length > 0;

    if (!folderHasContent) {
        grid.innerHTML = '';
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';

    grid.innerHTML = filtered.map((product, i) => {
        const stockClass = product.stock === 0 ? 'out-of-stock' : product.stock <= 10 ? 'low-stock' : '';
        return `
        <div class="product-card" style="animation-delay:${i * 0.05}s">
            <div class="card-image-container">
                ${product.image ? `<img src="${product.image}" alt="${escapeHtml(product.name)}" class="card-image">` : `<div class="card-no-image">📦</div>`}
            </div>
            <div class="card-body">
                <h3 class="card-name">${escapeHtml(product.name)}</h3>
                ${product.description ? `<p class="card-description">${escapeHtml(product.description)}</p>` : ''}
            </div>
            <div class="card-stock-section">
                <div class="stock-info">
                    <span class="stock-number ${stockClass}">${product.stock}</span>
                    <span class="stock-unit">pz</span>
                </div>
                <div class="card-stock-buttons">
                    <button class="card-stock-btn minus" onclick="adjustStockQuick('${product.id}',-1)" title="Quitar 1">−</button>
                    <button class="card-stock-btn plus" onclick="adjustStockQuick('${product.id}',1)" title="Agregar 1">+</button>
                </div>
            </div>
            <div class="card-actions">
                <button class="card-action-btn edit" onclick="openEditModal('${product.id}')">✏️ Editar</button>
                <button class="card-action-btn stock-adj" onclick="openStockModal('${product.id}')">📊 Stock</button>
                <button class="card-action-btn delete" onclick="openDeleteModal('${product.id}')">🗑️</button>
            </div>
        </div>`;
    }).join('');
}

// ===== Stock =====
function openStockModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    currentStockProductId = id;
    $('#stockProductName').textContent = product.name;
    $('#stockCurrentValue').textContent = product.stock;
    $('#stockAdjustInput').value = 1;
    $('#stockSetDirect').value = '';
    openModal($('#stockModalOverlay'));
}

function getStockAdjustAmount() { return parseInt($('#stockAdjustInput').value) || 1; }

async function adjustStock(amount) {
    if (!currentStockProductId) return;
    const product = products.find(p => p.id === currentStockProductId);
    if (!product) return;
    const oldStock = product.stock;
    const newStock = Math.max(0, product.stock + amount);
    
    let totalSold = product.totalSold || 0;
    if (amount < 0) {
        totalSold += (oldStock - newStock);
    }
    
    await saveProductToCloud({ ...product, stock: newStock, totalSold, updatedAt: new Date().toISOString() });
    
    $('#stockCurrentValue').textContent = newStock;
    const action = amount > 0 ? `+${amount}` : `${amount}`;
    showToast(`Stock de "${product.name}": ${action} → ${newStock} pz`, 'info');
}

async function adjustStockQuick(id, amount) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const oldStock = product.stock;
    const newStock = Math.max(0, product.stock + amount);
    
    let totalSold = product.totalSold || 0;
    if (amount < 0) {
        totalSold += (oldStock - newStock);
    }
    
    await saveProductToCloud({ ...product, stock: newStock, totalSold, updatedAt: new Date().toISOString() });
}

async function handleSetStock() {
    const val = parseInt($('#stockSetDirect').value);
    if (isNaN(val) || val < 0) { showToast('Número inválido', 'error'); return; }
    const product = products.find(p => p.id === currentStockProductId);
    if (!product) return;
    const oldStock = product.stock;
    
    let totalSold = product.totalSold || 0;
    if (val < oldStock) {
        totalSold += (oldStock - val);
    }
    
    await saveProductToCloud({ ...product, stock: val, totalSold, updatedAt: new Date().toISOString() });
    
    $('#stockCurrentValue').textContent = val;
    $('#stockSetDirect').value = '';
    showToast(`Stock de "${product.name}" → ${val} pz`, 'success');
}

// ===== Delete Product =====
function openDeleteModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    currentDeleteProductId = id;
    $('#deleteProductName').textContent = product.name;
    openModal($('#deleteModalOverlay'));
}

async function handleDeleteConfirm() {
    if (!currentDeleteProductId) return;
    const product = products.find(p => p.id === currentDeleteProductId);
    const name = product ? product.name : '';
    await deleteProductFromCloud(currentDeleteProductId);
    currentDeleteProductId = null;
    closeModal($('#deleteModalOverlay'));
    showToast(`"${name}" eliminado`, 'error');
}

// ===== Stats =====
function updateStats() {
    // Para las stats, mostramos lo que hay en la carpeta actual (o total si es raíz)
    const localProducts = currentFolderId ? products.filter(p => p.folderId === currentFolderId) : products;
    const localFolders = currentFolderId ? folders.filter(f => f.parentId === currentFolderId) : folders;

    animateNumber($('#totalProducts'), localProducts.length);
    animateNumber($('#totalStock'), localProducts.reduce((s, p) => s + p.stock, 0));
    animateNumber($('#lowStockCount'), localProducts.filter(p => p.stock <= 10 && p.stock > 0).length);
    animateNumber($('#totalCategories'), localFolders.length);
}

function animateNumber(el, target) {
    const current = parseInt(el.textContent) || 0;
    if (current === target) return;
    const diff = target - current;
    const steps = Math.min(Math.abs(diff), 20);
    const inc = diff / steps;
    let step = 0;
    const timer = setInterval(() => {
        step++;
        if (step >= steps) { el.textContent = target; clearInterval(timer); }
        else el.textContent = Math.round(current + inc * step);
    }, 30);
}

// ===== Toast =====
function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// ===== SALES CHART =====
function renderChart() {
    const canvas = $('#salesChart');
    const emptyChart = $('#chartEmpty');
    const summary = $('#chartSummary');
    if (!canvas) return;

    // Get products for current view
    let chartProducts = products.filter(p => p.folderId === currentFolderId);

    // Only show products with sales
    const withSales = chartProducts.filter(p => (p.totalSold || 0) > 0);
    const totalSold = chartProducts.reduce((s, p) => s + (p.totalSold || 0), 0);

    // Summary
    const topProduct = withSales.length > 0 ? withSales.reduce((a, b) => (a.totalSold || 0) >= (b.totalSold || 0) ? a : b) : null;
    summary.innerHTML = `
        <div class="chart-stat">
            <span class="chart-stat-value">${totalSold}</span>
            <span class="chart-stat-label">Total Vendidas</span>
        </div>
        <div class="chart-stat">
            <span class="chart-stat-value">${withSales.length}</span>
            <span class="chart-stat-label">Productos con ventas</span>
        </div>
        ${topProduct ? `<div class="chart-stat top">
            <span class="chart-stat-value">${topProduct.totalSold || 0} pz</span>
            <span class="chart-stat-label">🏆 ${escapeHtml(topProduct.name)}</span>
        </div>` : ''}
    `;

    if (withSales.length === 0) {
        canvas.style.display = 'none';
        emptyChart.style.display = '';
        return;
    }
    canvas.style.display = '';
    emptyChart.style.display = 'none';

    // Sort by most sold
    withSales.sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0));
    const maxItems = 15;
    const data = withSales.slice(0, maxItems);

    // Draw chart
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 280 * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = 280;

    ctx.clearRect(0, 0, W, H);

    const padding = { top: 20, right: 20, bottom: 70, left: 50 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;
    const maxVal = Math.max(...data.map(p => p.totalSold || 0));
    const barWidth = Math.min(50, (chartW / data.length) * 0.6);
    const gap = (chartW - barWidth * data.length) / (data.length + 1);

    // Grid lines
    ctx.strokeStyle = 'rgba(108, 99, 255, 0.1)';
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
        const y = padding.top + (chartH / gridLines) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(W - padding.right, y);
        ctx.stroke();
        // Y labels
        ctx.fillStyle = '#6b6b80';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'right';
        const val = Math.round(maxVal - (maxVal / gridLines) * i);
        ctx.fillText(val, padding.left - 8, y + 4);
    }

    // Bars
    const colors = [
        '#6c63ff', '#00d2ff', '#00e676', '#ffab40', '#ff5252',
        '#e040fb', '#ff6e40', '#40c4ff', '#69f0ae', '#ffd740',
        '#ea80fc', '#84ffff', '#b2ff59', '#ff8a80', '#82b1ff'
    ];

    data.forEach((product, i) => {
        const sold = product.totalSold || 0;
        const barH = (sold / maxVal) * chartH;
        const x = padding.left + gap + i * (barWidth + gap);
        const y = padding.top + chartH - barH;
        const color = colors[i % colors.length];

        // Bar with gradient
        const grad = ctx.createLinearGradient(x, y, x, padding.top + chartH);
        grad.addColorStop(0, color);
        grad.addColorStop(1, color + '40');
        ctx.fillStyle = grad;
        ctx.beginPath();
        const r = Math.min(4, barWidth / 4);
        ctx.roundRect(x, y, barWidth, barH, [r, r, 0, 0]);
        ctx.fill();

        // Value on top
        ctx.fillStyle = '#e8e8f0';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(sold, x + barWidth / 2, y - 6);

        // Product name (rotated)
        ctx.save();
        ctx.translate(x + barWidth / 2, padding.top + chartH + 10);
        ctx.rotate(-Math.PI / 4);
        ctx.fillStyle = '#a0a0b8';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'right';
        const name = product.name.length > 12 ? product.name.substring(0, 12) + '…' : product.name;
        ctx.fillText(name, 0, 0);
        ctx.restore();
    });

    // Y axis label
    ctx.save();
    ctx.translate(14, padding.top + chartH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#6b6b80';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Piezas Vendidas', 0, 0);
    ctx.restore();
}

function toggleChart() {
    const body = $('#chartBody');
    const btn = $('#btnToggleChart');
    body.classList.toggle('collapsed');
    btn.classList.toggle('collapsed');
}

async function resetSales() {
    if (!confirm('¿Seguro que quieres reiniciar el reporte de ventas de esta carpeta? El stock no se verá afectado.')) return;
    
    let toReset = products.filter(p => p.folderId === currentFolderId);
    
    for (const p of toReset) {
        await saveProductToCloud({ ...p, totalSold: 0 });
    }
    
    showToast('Ventas reiniciadas', 'info');
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('Service Worker registrado ✅', reg))
                .catch(err => console.log('Fallo al registrar Service Worker ❌', err));
        });
    }
}

// ===== Utilities =====
function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 9); }
function escapeHtml(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }
