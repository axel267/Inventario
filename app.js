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
let salesHistory = [];
let deliveries = [];

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== Init =====
let _eventsbound = false;
let _loginBound = false;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔌 Conectando con Firebase & Auth...');
    
    // Auth Listener
    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            console.log('👤 Usuario autenticado:', user.email);
            $('#loginOverlay').style.display = 'none';
            await migrateToCloud();
            loadData();
            showFolder(null);
            updateStats();
            if (!_eventsbound) { bindEvents(); _eventsbound = true; }
            requestNotificationPermission();
            setInterval(checkDeliveryReminders, 60000);
            checkDeliveryReminders();
        } else {
            console.log('🚪 No hay sesión activa');
            _eventsbound = false;
            $('#loginOverlay').style.display = 'flex';
            if (!_loginBound) { bindLoginEvents(); _loginBound = true; }
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

    // Listen to Sales History
    db.collection('sales_history').orderBy('timestamp', 'desc').limit(200).onSnapshot((snapshot) => {
        salesHistory = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
        renderSalesHistory();
    }, err => console.error('❌ Error leyendo historial:', err));

    // Listen to Deliveries
    db.collection('deliveries').orderBy('deliveryDateTime', 'asc').onSnapshot((snapshot) => {
        deliveries = snapshot.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
        renderDeliveries();
    }, err => console.error('❌ Error leyendo entregas:', err));
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
    
    // Opciones de carpeta actual
    $('#currentFolderOptions').style.display = currentFolderId ? 'flex' : 'none';
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

    // Chart toggle & reset
    $('#btnToggleChart').addEventListener('click', toggleChart);
    $('#btnResetSales').addEventListener('click', resetSales);
    $('#btnLogout').addEventListener('click', () => firebase.auth().signOut());

    // Sales History
    $('#btnToggleSalesHistory').addEventListener('click', toggleSalesHistory);
    $('#btnCloseHistory').addEventListener('click', () => $('#historySection').style.display = 'none');
    $('#historySearch').addEventListener('input', renderSalesHistory);

    // Deliveries panel
    $('#btnToggleDeliveries').addEventListener('click', toggleDeliveriesPanel);
    $('#btnCloseDeliveries').addEventListener('click', () => $('#deliveriesSection').style.display = 'none');

    // Restock Dashboard
    $('#btnToggleDashboard').addEventListener('click', toggleDashboard);
    $('#btnCloseDashboard').addEventListener('click', () => $('#dashboardSection').style.display = 'none');
    $('#btnCalculateRestock').addEventListener('click', computeRestockRecommendations);
    $$('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const days = parseInt(btn.dataset.days);
            const to = new Date();
            const from = new Date();
            from.setDate(from.getDate() - days);
            $('#dashFromDate').value = from.toISOString().split('T')[0];
            $('#dashToDate').value = to.toISOString().split('T')[0];
            $$('.preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            computeRestockRecommendations();
        });
    });
    // Remove active from presets when user manually changes dates
    $('#dashFromDate').addEventListener('change', () => $$('.preset-btn').forEach(b => b.classList.remove('active')));
    $('#dashToDate').addEventListener('change', () => $$('.preset-btn').forEach(b => b.classList.remove('active')));

    // Delivery modal
    $('#btnOpenDeliveryModal').addEventListener('click', openDeliveryModal);
    $('#btnCloseDeliveryModal').addEventListener('click', () => closeModal($('#deliveryModalOverlay')));
    $('#btnCancelDelivery').addEventListener('click', () => closeModal($('#deliveryModalOverlay')));
    $('#deliveryForm').addEventListener('submit', handleDeliverySubmit);

    // Delivery image upload
    const dImgArea = $('#deliveryImageUploadArea');
    const dImgInput = $('#deliveryImage');
    dImgArea.addEventListener('click', () => dImgInput.click());
    dImgInput.addEventListener('change', handleDeliveryImageSelect);
    dImgArea.addEventListener('dragover', (e) => { e.preventDefault(); dImgArea.style.borderColor = 'var(--accent-primary)'; });
    dImgArea.addEventListener('dragleave', () => { dImgArea.style.borderColor = ''; });
    dImgArea.addEventListener('drop', (e) => {
        e.preventDefault(); dImgArea.style.borderColor = '';
        if (e.dataTransfer.files.length > 0) { dImgInput.files = e.dataTransfer.files; handleDeliveryImageSelect({ target: dImgInput }); }
    });

    // Image viewer
    $('#btnCloseImageViewer').addEventListener('click', () => closeModal($('#deliveryImageViewerOverlay')));

    // Lost Sales
    $('#btnLostSale').addEventListener('click', handleLostSale);

    // Analytics panel
    $('#btnToggleAnalytics').addEventListener('click', toggleAnalytics);
    $('#btnCloseAnalytics').addEventListener('click', () => { $('#analyticsSection').style.display = 'none'; });
    $$('.analytics-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            $$('.analytics-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderAnalyticsTab(tab.dataset.tab);
        });
    });

    // Close overlays on click outside / Escape
    ['modalOverlay', 'stockModalOverlay', 'deleteModalOverlay', 'folderModalOverlay', 'deleteFolderModalOverlay', 'deliveryModalOverlay', 'deliveryImageViewerOverlay'].forEach(id => {
        const el = $('#' + id);
        el.addEventListener('click', (e) => { if (e.target === el) closeModal(el); });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            ['modalOverlay', 'stockModalOverlay', 'deleteModalOverlay', 'folderModalOverlay', 'deleteFolderModalOverlay', 'deliveryModalOverlay', 'deliveryImageViewerOverlay']
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
    
    try {
        console.log('🗑️ Borrando carpeta:', currentDeleteFolderId);
        // Recursive Delete
        const foldersToDelete = getAllSubfolderIds(currentDeleteFolderId);
        foldersToDelete.push(currentDeleteFolderId);
        
        for (const fid of foldersToDelete) {
            // Delete products in this subfolder
            const prods = products.filter(p => p.folderId === fid);
            for (const p of prods) {
                await db.collection('products').doc(p.id).delete();
            }
            // Delete folder
            await db.collection('folders').doc(fid).delete();
        }
        
        showToast('Carpeta y contenido eliminados', 'error');
    } catch (err) {
        console.error('Error al borrar carpeta:', err);
        showToast('Error al borrar carpeta', 'error');
    } finally {
        currentDeleteFolderId = null;
        closeModal($('#deleteFolderModalOverlay'));
    }
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
    // Compatibilidad: Si parentId no existe, lo tratamos como null (raíz)
    const filtered = folders.filter(f => {
        const pid = f.parentId || null;
        return pid === currentFolderId;
    });

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
            <span class="folder-card-icon">${folder.icon}</span>
            <div class="folder-card-name">${escapeHtml(folder.name)}</div>
            <div class="folder-card-count"><span>${count}</span> elementos</div>
            
            <div class="folder-card-footer" onclick="event.stopPropagation()">
                <button class="f-btn edit" onclick="openEditFolderModal('${folder.id}')">Editar</button>
                <button class="f-btn delete" onclick="openDeleteFolderModal('${folder.id}')">Borrar</button>
            </div>
        </div>`;
    }).join('');
}

function openEditCurrentFolder() {
    if (currentFolderId) openEditFolderModal(currentFolderId);
}

function openDeleteCurrentFolder() {
    if (currentFolderId) openDeleteFolderModal(currentFolderId);
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
    $('#productPrice').value = product.price || 0;
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
    const price = parseFloat($('#productPrice').value) || 0;
    const image = $('#imagePreview').src || '';

    if (!name) { showToast('El nombre es obligatorio', 'error'); return; }

    if (editId) {
        const product = products.find(p => p.id === editId);
        if (product) {
            const updated = { ...product, name, description, stock, price, image: image || product.image, updatedAt: new Date().toISOString() };
            await saveProductToCloud(updated);
            showToast('Producto actualizado ✅', 'success');
        }
    } else {
        const newProduct = { 
            id: generateId(), 
            folderId: currentFolderId,
            name, description, stock, price,
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

    // Filtramos productos: si no tienen folderId y estamos en raíz, los mostramos
    let filtered = products.filter(p => {
        const fid = p.folderId || null;
        return fid === currentFolderId;
    });

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
        const lostSales = product.lostSales || 0;
        return `
        <div class="product-card" style="animation-delay:${i * 0.05}s">
            <div class="card-image-container">
                ${product.image ? `<img src="${product.image}" alt="${escapeHtml(product.name)}" class="card-image">` : `<div class="card-no-image">📦</div>`}
                ${lostSales > 0 ? `<span class="lost-sales-badge" title="Ventas perdidas">💸 ${lostSales}</span>` : ''}
            </div>
            <div class="card-body">
                <h3 class="card-name">${escapeHtml(product.name)}</h3>
                ${product.description ? `<p class="card-description">${escapeHtml(product.description)}</p>` : ''}
                ${product.price > 0 ? `<span class="card-price">$${product.price.toLocaleString('es-MX', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>` : ''}
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
                ${product.stock === 0 ? `<button class="card-action-btn lost-sale" onclick="quickLostSale('${product.id}')" title="Registrar venta perdida">💸</button>` : ''}
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
    $('#lostSaleCount').textContent = `${product.lostSales || 0} ventas perdidas`;
    renderSizeShortcuts(product);
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
    const qtySold = (amount < 0) ? (oldStock - newStock) : 0;
    if (qtySold > 0) {
        totalSold += qtySold;
        logSale(product.id, product.name, qtySold);
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
    const qtySold = (amount < 0) ? (oldStock - newStock) : 0;
    if (qtySold > 0) {
        totalSold += qtySold;
        logSale(product.id, product.name, qtySold);
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
    const qtySold = (val < oldStock) ? (oldStock - val) : 0;
    if (qtySold > 0) {
        totalSold += qtySold;
        logSale(product.id, product.name, qtySold);
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

    const totalValue = localProducts.reduce((s, p) => s + ((p.price || 0) * p.stock), 0);
    const valEl = $('#totalValue');
    if (valEl) valEl.textContent = '$' + totalValue.toLocaleString('es-MX', {minimumFractionDigits:0, maximumFractionDigits:0});
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
    const totalLost = chartProducts.reduce((s, p) => s + (p.lostSales || 0), 0);
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
        ${totalLost > 0 ? `<div class="chart-stat">
            <span class="chart-stat-value" style="color:var(--warning)">${totalLost}</span>
            <span class="chart-stat-label">💸 Ventas Perdidas</span>
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

// ===== FEATURE 1: Sales History (Logs) =====
async function logSale(productId, productName, quantity) {
    try {
        const entry = {
            id: generateId(),
            productId,
            productName,
            quantity,
            timestamp: new Date().toISOString()
        };
        await db.collection('sales_history').doc(entry.id).set(entry);
    } catch (err) {
        console.error('❌ Error logging sale:', err);
    }
}

function toggleSalesHistory() {
    const section = $('#historySection');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
    if (section.style.display === 'block') renderSalesHistory();
}

function renderSalesHistory() {
    const container = $('#historyList');
    const filter = ($('#historySearch')?.value || '').trim().toLowerCase();

    let filtered = salesHistory;
    if (filter) {
        filtered = salesHistory.filter(s => s.productName.toLowerCase().includes(filter));
    }

    if (filtered.length === 0) {
        container.innerHTML = '<p class="chart-empty">No hay ventas registradas aún.</p>';
        return;
    }

    container.innerHTML = `
        <div class="history-table">
            <div class="history-row history-row-header">
                <span class="history-cell">Modelo</span>
                <span class="history-cell">Cantidad</span>
                <span class="history-cell">Fecha</span>
                <span class="history-cell"></span>
            </div>
            ${filtered.map(sale => {
                const d = new Date(sale.timestamp);
                const dateStr = d.toLocaleDateString('es-MX', { day:'2-digit', month:'short', year:'numeric' });
                const timeStr = d.toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit' });
                return `
                <div class="history-row">
                    <span class="history-cell history-model">${escapeHtml(sale.productName)}</span>
                    <span class="history-cell history-qty">-${sale.quantity} pz</span>
                    <span class="history-cell history-date">${dateStr} ${timeStr}</span>
                    <button class="history-delete-btn" onclick="deleteSaleEntry('${sale.docId}', '${sale.productId}', ${sale.quantity})" title="Deshacer esta venta">🗑️</button>
                </div>`;
            }).join('')}
        </div>`;
}

// ===== DELETE SALE ENTRY =====
async function deleteSaleEntry(docId, productId, quantity) {
    if (!confirm(`¿Deshacer esta venta de ${quantity} pz? Se devolverá al stock del producto.`)) return;
    try {
        // 1. Borrar el doc del historial
        await db.collection('sales_history').doc(docId).delete();

        // 2. Buscar el producto y actualizar stock y totalSold
        const product = products.find(p => p.id === productId);
        if (product) {
            const newStock = product.stock + quantity;
            const newTotalSold = Math.max(0, (product.totalSold || 0) - quantity);
            await saveProductToCloud({ ...product, stock: newStock, totalSold: newTotalSold, updatedAt: new Date().toISOString() });
            showToast(`✅ Venta deshecha: +${quantity} pz devueltas a "${product.name}"`, 'success');
        } else {
            showToast('✅ Entrada del historial eliminada', 'success');
        }
    } catch (err) {
        console.error('Error al deshacer venta:', err);
        showToast('❌ Error al deshacer la venta', 'error');
    }
}

// ===== FEATURE 2: Delivery Reminders =====
function openDeliveryModal() {
    $('#deliveryForm').reset();
    $('#editDeliveryId').value = '';
    $('#deliveryImageUploadArea').classList.remove('has-image');
    $('#deliveryImagePreview').src = '';
    openModal($('#deliveryModalOverlay'));
}

function handleDeliveryImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('Imagen muy grande. Máx 5MB.', 'error'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
        resizeImage(ev.target.result, 400, 400, (resized) => {
            $('#deliveryImagePreview').src = resized;
            $('#deliveryImageUploadArea').classList.add('has-image');
        });
    };
    reader.readAsDataURL(file);
}

async function handleDeliverySubmit(e) {
    e.preventDefault();
    const models = $('#deliveryModels').value.trim();
    const clientName = $('#deliveryClientName').value.trim();
    const clientPhone = $('#deliveryClientPhone').value.trim();
    const date = $('#deliveryDate').value;
    const time = $('#deliveryTime').value;
    const image = $('#deliveryImagePreview').src || '';

    if (!models || !clientName || !clientPhone || !date || !time) {
        showToast('Completa todos los campos obligatorios', 'error');
        return;
    }

    const deliveryDateTime = new Date(`${date}T${time}`).toISOString();
    const editId = $('#editDeliveryId').value;

    const delivery = {
        id: editId || generateId(),
        models,
        clientName,
        clientPhone,
        deliveryDateTime,
        image: image.startsWith('data:') ? image : '',
        notified: false,
        completed: false,
        createdAt: new Date().toISOString()
    };

    try {
        await db.collection('deliveries').doc(delivery.id).set(delivery);
        showToast('Entrega programada ✅', 'success');
        closeModal($('#deliveryModalOverlay'));
    } catch (err) {
        console.error('Error guardando entrega:', err);
        showToast('Error al guardar entrega', 'error');
    }
}

function toggleDeliveriesPanel() {
    const section = $('#deliveriesSection');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

function renderDeliveries() {
    const container = $('#deliveriesList');
    const pending = deliveries.filter(d => !d.completed);

    if (pending.length === 0) {
        container.innerHTML = '<p class="chart-empty">No hay entregas programadas.</p>';
        return;
    }

    container.innerHTML = pending.map(d => {
        const dt = new Date(d.deliveryDateTime);
        const dateStr = dt.toLocaleDateString('es-MX', { weekday:'short', day:'2-digit', month:'short' });
        const timeStr = dt.toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit' });
        const isPast = dt < new Date();
        return `
        <div class="delivery-card ${isPast ? 'delivery-past' : ''}">
            <div class="delivery-card-main">
                <div class="delivery-info">
                    <span class="delivery-models">📦 ${escapeHtml(d.models)}</span>
                    <span class="delivery-client">👤 ${escapeHtml(d.clientName)} · 📞 ${escapeHtml(d.clientPhone)}</span>
                    <span class="delivery-datetime">📅 ${dateStr} a las ${timeStr}</span>
                </div>
                <div class="delivery-actions">
                    ${d.image ? `<button class="card-action-btn" onclick="viewDeliveryImage('${d.id}')">📸</button>` : ''}
                    <button class="card-action-btn" onclick="completeDelivery('${d.id}')" title="Marcar completada">✅</button>
                    <button class="card-action-btn delete" onclick="deleteDelivery('${d.id}')" title="Eliminar">🗑️</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function viewDeliveryImage(id) {
    const d = deliveries.find(x => x.id === id);
    if (!d || !d.image) return;
    $('#deliveryImageViewerImg').src = d.image;
    openModal($('#deliveryImageViewerOverlay'));
}

async function completeDelivery(id) {
    const d = deliveries.find(x => x.id === id);
    if (!d) return;
    await db.collection('deliveries').doc(id).set({ ...d, completed: true });
    showToast('Entrega completada ✅', 'success');
}

async function deleteDelivery(id) {
    if (!confirm('¿Eliminar esta entrega?')) return;
    await db.collection('deliveries').doc(id).delete();
    showToast('Entrega eliminada', 'error');
}

// Notification System
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(p => {
            console.log('🔔 Permiso de notificaciones:', p);
        });
    }
}

function checkDeliveryReminders() {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const now = new Date();
    const fiveHoursMs = 5 * 60 * 60 * 1000;

    deliveries.forEach(async (d) => {
        if (d.completed || d.notified) return;
        const dt = new Date(d.deliveryDateTime);
        const diff = dt - now;
        // Notify if within 5 hours (but not past)
        if (diff > 0 && diff <= fiveHoursMs) {
            try {
                new Notification('📦 Entrega próxima', {
                    body: `${d.models}\n👤 ${d.clientName} · 📞 ${d.clientPhone}\n📅 ${dt.toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit' })}`,
                    icon: './icon.png',
                    tag: `delivery-${d.id}`
                });
                await db.collection('deliveries').doc(d.id).set({ ...d, notified: true });
            } catch (err) {
                console.error('Error enviando notificación:', err);
            }
        }
    });
}

// ===== FEATURE 3: Lost Sales =====
async function handleLostSale() {
    if (!currentStockProductId) return;
    const product = products.find(p => p.id === currentStockProductId);
    if (!product) return;
    const lostSales = (product.lostSales || 0) + 1;
    await saveProductToCloud({ ...product, lostSales });
    $('#lostSaleCount').textContent = `${lostSales} ventas perdidas`;
    showToast(`Venta perdida registrada para "${product.name}" (${lostSales} total)`, 'info');
}

async function quickLostSale(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const lostSales = (product.lostSales || 0) + 1;
    await saveProductToCloud({ ...product, lostSales });
    showToast(`💸 Venta perdida: "${product.name}" (${lostSales} total)`, 'info');
}


// ===== FEATURE 4: Restock Dashboard =====
function toggleDashboard() {
    const section = $('#dashboardSection');
    const isHidden = section.style.display === 'none';
    section.style.display = isHidden ? 'block' : 'none';

    if (isHidden) {
        // Auto-populate last 30 days on first open if dates are empty
        if (!$('#dashFromDate').value) {
            const to = new Date();
            const from = new Date();
            from.setDate(from.getDate() - 30);
            $('#dashFromDate').value = from.toISOString().split('T')[0];
            $('#dashToDate').value = to.toISOString().split('T')[0];
        }
        // Scroll into view
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

async function computeRestockRecommendations() {
    const fromVal = $('#dashFromDate').value;
    const toVal = $('#dashToDate').value;

    if (!fromVal || !toVal) {
        showToast('Selecciona un rango de fechas', 'error');
        return;
    }

    // Build date objects (local time)
    const fromDate = new Date(fromVal + 'T00:00:00');
    const toDate   = new Date(toVal   + 'T23:59:59');

    if (fromDate >= toDate) {
        showToast('La fecha inicio debe ser anterior a la fecha fin', 'error');
        return;
    }

    const content = $('#dashboardContent');
    content.innerHTML = '<div class="dash-loading"><span class="dash-spinner"></span> Calculando recomendaciones…</div>';

    try {
        // --- Query Firestore for sales in the selected range ---
        const snapshot = await db.collection('sales_history')
            .where('timestamp', '>=', fromDate.toISOString())
            .where('timestamp', '<=', toDate.toISOString())
            .get();

        const salesInRange = snapshot.docs.map(doc => doc.data());

        // Aggregate total sold per productId
        const salesMap = {}; // { productId: totalQty }
        for (const sale of salesInRange) {
            salesMap[sale.productId] = (salesMap[sale.productId] || 0) + (sale.quantity || 1);
        }

        // Period length in days
        const periodDays = Math.max(1, Math.round((toDate - fromDate) / (1000 * 60 * 60 * 24)));

        // Build folder -> products map (only products inside a folder)
        const folderProductsMap = {};
        for (const product of products) {
            const fid = product.folderId;
            if (!fid) continue;
            if (!folderProductsMap[fid]) folderProductsMap[fid] = [];
            folderProductsMap[fid].push(product);
        }

        // Build recommendation objects per folder (model)
        const recommendations = [];
        for (const folder of folders) {
            const folderProducts = folderProductsMap[folder.id] || [];
            if (folderProducts.length === 0) continue;

            const sizes = folderProducts.map(p => {
                const soldInPeriod = salesMap[p.id] || 0;
                // Projected need for next same-length period = same as sold
                // Order = max(0, projectedNeed - currentStock)
                const toOrder = Math.max(0, soldInPeriod - p.stock);
                return {
                    name:          p.name,
                    currentStock:  p.stock,
                    soldInPeriod,
                    toOrder
                };
            });

            // Only include folders that had at least 1 sale in the period
            const hasSales = sizes.some(s => s.soldInPeriod > 0);
            if (!hasSales) continue;

            const totalToOrder = sizes.reduce((sum, s) => sum + s.toOrder, 0);

            recommendations.push({ folder, sizes, totalToOrder });
        }

        // Sort: most urgent (highest totalToOrder) first
        recommendations.sort((a, b) => b.totalToOrder - a.totalToOrder);

        renderDashboard(recommendations, periodDays, fromDate, toDate);

    } catch (err) {
        console.error('Error computing restock recommendations:', err);
        content.innerHTML = '<p class="chart-empty">❌ Error al calcular. Verifica tu conexión e intenta de nuevo.</p>';
    }
}

function renderDashboard(recommendations, periodDays, fromDate, toDate) {
    const content = $('#dashboardContent');

    if (recommendations.length === 0) {
        content.innerHTML = '<p class="chart-empty">No se encontraron ventas en este período. Prueba con un rango de fechas más amplio.</p>';
        return;
    }

    const totalPairs    = recommendations.reduce((s, r) => s + r.totalToOrder, 0);
    const modelsToOrder = recommendations.filter(r => r.totalToOrder > 0).length;
    const totalModels   = recommendations.length;

    const fmtDate = d => d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

    content.innerHTML = `
        <div class="dash-summary">
            <div class="dash-stat">
                <span class="dash-stat-icon">📅</span>
                <span class="dash-stat-value">${periodDays}</span>
                <span class="dash-stat-label">Días analizados</span>
            </div>
            <div class="dash-stat">
                <span class="dash-stat-icon">📂</span>
                <span class="dash-stat-value">${totalModels}</span>
                <span class="dash-stat-label">Modelos con ventas</span>
            </div>
            <div class="dash-stat warn">
                <span class="dash-stat-icon">⚠️</span>
                <span class="dash-stat-value">${modelsToOrder}</span>
                <span class="dash-stat-label">Modelos a reabastecer</span>
            </div>
            <div class="dash-stat highlight">
                <span class="dash-stat-icon">📦</span>
                <span class="dash-stat-value">${totalPairs}</span>
                <span class="dash-stat-label">Pares totales a pedir</span>
            </div>
        </div>
        <p class="dash-period-note">
            📅 Análisis del <strong>${fmtDate(fromDate)}</strong> al <strong>${fmtDate(toDate)}</strong>
            &nbsp;·&nbsp; Proyección: pedir suficiente para cubrir los próximos <strong>${periodDays} días</strong>
        </p>
        <div class="restock-cards-grid">
            ${recommendations.map(renderRestockCard).join('')}
        </div>
    `;
}

function renderRestockCard(rec) {
    const { folder, sizes, totalToOrder } = rec;

    // Sort sizes: those needing reorder first, then by qty desc
    const sorted = [...sizes].sort((a, b) => b.toOrder - a.toOrder || b.soldInPeriod - a.soldInPeriod);

    const cardClass = totalToOrder === 0 ? 'card-ok'
                    : totalToOrder <= 4  ? 'card-medium'
                    : 'card-urgent';

    const badge = totalToOrder > 0
        ? `<span class="restock-badge badge-warn">⚡ ${totalToOrder} par${totalToOrder !== 1 ? 'es' : ''} a pedir</span>`
        : `<span class="restock-badge badge-ok">✅ Stock suficiente</span>`;

    const rows = sorted.map(s => {
        const rowClass = s.toOrder === 0   ? 'row-ok'
                       : s.toOrder <= 2    ? 'row-medium'
                       : 'row-urgent';
        const orderCell = s.toOrder > 0
            ? `<span class="order-pill ${s.toOrder >= 5 ? 'pill-red' : 'pill-yellow'}"><strong>${s.toOrder}</strong> pares</span>`
            : `<span class="order-pill pill-green">—</span>`;
        return `
            <div class="restock-row ${rowClass}">
                <span class="restock-size-name">${escapeHtml(s.name)}</span>
                <span class="restock-cell">${s.soldInPeriod} pz</span>
                <span class="restock-cell">${s.currentStock} pz</span>
                <span class="restock-cell">${orderCell}</span>
            </div>`;
    }).join('');

    // Plain-text summary for quick reading
    const orderList = sorted
        .filter(s => s.toOrder > 0)
        .map(s => `${s.toOrder} × ${s.name}`)
        .join(', ');

    const summary = orderList
        ? `<div class="restock-summary-text">🗒️ Pedir: ${orderList}</div>`
        : '';

    return `
        <div class="restock-card ${cardClass}">
            <div class="restock-card-header">
                <span class="restock-folder-icon">${folder.icon || '📦'}</span>
                <div class="restock-folder-meta">
                    <span class="restock-folder-name">${escapeHtml(folder.name)}</span>
                    ${badge}
                </div>
            </div>
            ${summary}
            <div class="restock-table">
                <div class="restock-row restock-row-header">
                    <span>Talla / Modelo</span>
                    <span>Vendidos</span>
                    <span>Stock actual</span>
                    <span>Pedir</span>
                </div>
                ${rows}
            </div>
        </div>`;
}


// ===== FEATURE: Size Shortcuts =====
function renderSizeShortcuts(product) {
    const grid = $('#sizeShortcutsGrid');
    const section = $('#sizeShortcuts');
    if (!grid || !section) return;

    const siblings = products.filter(p => p.folderId === product.folderId);
    if (siblings.length <= 1) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    grid.innerHTML = siblings.map(p => {
        const isActive = p.id === product.id;
        const sizeMatch = p.name.match(/(\d+[\.\d]*)\s*$/);
        const label = sizeMatch ? sizeMatch[1] : p.name.substring(0, 6);
        const dotClass = p.stock <= 0 ? 'dot-empty' : p.stock <= 3 ? 'dot-low' : 'dot-ok';
        const disabled = p.stock <= 0 ? 'disabled' : '';
        return `<button class="size-shortcut-btn ${isActive ? 'active' : ''} ${p.stock <= 0 ? 'size-empty' : ''}"
            onclick="quickSellSize('${p.id}')"
            title="${escapeHtml(p.name)} — ${p.stock} pz"
            ${disabled}>
            ${label}
            <span class="size-stock-dot ${dotClass}"></span>
        </button>`;
    }).join('');
}

async function quickSellSize(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (product.stock <= 0) { showToast(`💀 Sin stock: "${product.name}"`, 'error'); return; }

    const newStock = product.stock - 1;
    const totalSold = (product.totalSold || 0) + 1;
    await saveProductToCloud({ ...product, stock: newStock, totalSold, updatedAt: new Date().toISOString() });
    logSale(product.id, product.name, 1);
    showToast(`💀 Vendido: ${product.name} → ${newStock} pz`, 'success');

    if (product.id === currentStockProductId) {
        $('#stockCurrentValue').textContent = newStock;
    }
    // Refresh shortcuts with updated product
    const refreshTarget = products.find(p => p.id === currentStockProductId);
    if (refreshTarget) renderSizeShortcuts(refreshTarget);
}

// ===== FEATURE: Analytics Panel =====
function toggleAnalytics() {
    const section = $('#analyticsSection');
    const isHidden = section.style.display === 'none';
    section.style.display = isHidden ? 'block' : 'none';
    if (isHidden) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        renderAnalyticsTab('daily');
    }
}

function renderAnalyticsTab(tab) {
    if (tab === 'daily') renderDailySalesTab();
    else if (tab === 'sizes') renderTopSizesTab();
    else if (tab === 'monthly') renderMonthlySummaryTab();
}

function renderDailySalesTab() {
    const content = $('#analyticsContent');
    if (!content) return;

    const now = new Date();
    const dayMap = {};
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        dayMap[d.toISOString().split('T')[0]] = 0;
    }

    salesHistory.forEach(sale => {
        const key = sale.timestamp ? sale.timestamp.split('T')[0] : null;
        if (key && dayMap.hasOwnProperty(key)) {
            dayMap[key] += (sale.quantity || 1);
        }
    });

    const days = Object.entries(dayMap);
    const maxVal = Math.max(...days.map(d => d[1]), 1);
    const totalThirty = days.reduce((s, d) => s + d[1], 0);
    const avgDay = (totalThirty / 30).toFixed(1);
    const bestDay = days.reduce((a, b) => a[1] >= b[1] ? a : b);
    const todayKey = now.toISOString().split('T')[0];

    content.innerHTML = `
        <div class="analytics-summary">
            <div class="analytics-stat">
                <span class="analytics-stat-value">${totalThirty}</span>
                <span class="analytics-stat-label">Vendidas (30d)</span>
            </div>
            <div class="analytics-stat">
                <span class="analytics-stat-value">${avgDay}</span>
                <span class="analytics-stat-label">Promedio/día</span>
            </div>
            <div class="analytics-stat highlight">
                <span class="analytics-stat-value">${bestDay[1]}</span>
                <span class="analytics-stat-label">🔥 Mejor día<br><small>${new Date(bestDay[0]+'T12:00:00').toLocaleDateString('es-MX',{day:'2-digit',month:'short'})}</small></span>
            </div>
        </div>
        <div class="daily-chart-wrap">
            ${days.map(([date, qty]) => {
                const h = maxVal > 0 ? Math.round((qty / maxVal) * 100) : 0;
                const d = new Date(date + 'T12:00:00');
                const isToday = date === todayKey;
                return `<div class="day-bar-wrap" title="${d.toLocaleDateString('es-MX',{day:'2-digit',month:'short'})}: ${qty} pz">
                    <div class="day-bar ${isToday ? 'today' : ''}" style="height:${Math.max(h, qty > 0 ? 4 : 0)}%">
                        ${qty > 0 ? `<span class="day-bar-val">${qty}</span>` : ''}
                    </div>
                    <span class="day-bar-label">${d.getDate()}</span>
                </div>`;
            }).join('')}
        </div>
    `;
}

function renderTopSizesTab() {
    const content = $('#analyticsContent');
    if (!content) return;

    const sorted = [...products]
        .filter(p => (p.totalSold || 0) > 0)
        .sort((a, b) => (b.totalSold || 0) - (a.totalSold || 0))
        .slice(0, 20);

    if (sorted.length === 0) {
        content.innerHTML = '<p class="chart-empty">Aún no hay ventas registradas.</p>';
        return;
    }

    const maxSold = sorted[0].totalSold || 1;
    const totalAll = sorted.reduce((s, p) => s + (p.totalSold || 0), 0);
    const medals = ['🥇','🥈','🥉'];

    content.innerHTML = `
        <p class="analytics-note">Top tallas/modelos más vendidos (histórico total)</p>
        <div class="top-sizes-list">
            ${sorted.map((p, i) => {
                const pct = Math.round(((p.totalSold || 0) / maxSold) * 100);
                const share = ((p.totalSold || 0) / totalAll * 100).toFixed(1);
                return `<div class="top-size-row">
                    <span class="top-size-rank">${medals[i] || (i+1)}</span>
                    <div class="top-size-info">
                        <span class="top-size-name">${escapeHtml(p.name)}</span>
                        <div class="top-size-bar-wrap">
                            <div class="top-size-bar" style="width:${pct}%"></div>
                        </div>
                    </div>
                    <div class="top-size-nums">
                        <span class="top-size-sold">${p.totalSold} pz</span>
                        <span class="top-size-share">${share}%</span>
                    </div>
                </div>`;
            }).join('')}
        </div>
    `;
}

function renderMonthlySummaryTab() {
    const content = $('#analyticsContent');
    if (!content) return;

    const monthMap = {};
    salesHistory.forEach(sale => {
        if (!sale.timestamp) return;
        const d = new Date(sale.timestamp);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
        if (!monthMap[key]) monthMap[key] = { qty: 0, revenue: 0 };
        monthMap[key].qty += (sale.quantity || 1);
        const prod = products.find(p => p.id === sale.productId);
        const price = prod ? (prod.price || 0) : 0;
        monthMap[key].revenue += price * (sale.quantity || 1);
    });

    const months = Object.entries(monthMap).sort((a,b) => b[0].localeCompare(a[0])).slice(0, 12);

    if (months.length === 0) {
        content.innerHTML = '<p class="chart-empty">Aún no hay ventas registradas.</p>';
        return;
    }

    content.innerHTML = `
        <p class="analytics-note">Resumen mensual de ventas (últimos 12 meses)</p>
        <div class="monthly-table">
            <div class="monthly-row monthly-header">
                <span>Mes</span>
                <span>Piezas</span>
                <span>Ingresos</span>
            </div>
            ${months.map(([key, data]) => {
                const [year, month] = key.split('-');
                const d = new Date(parseInt(year), parseInt(month)-1, 1);
                const label = d.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
                const revenue = data.revenue > 0
                    ? '$' + data.revenue.toLocaleString('es-MX', {minimumFractionDigits:0})
                    : '—';
                return `<div class="monthly-row">
                    <span class="monthly-month">${label}</span>
                    <span class="monthly-qty">${data.qty} pz</span>
                    <span class="monthly-rev">${revenue}</span>
                </div>`;
            }).join('')}
        </div>
    `;
}
