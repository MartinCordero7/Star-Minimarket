let adminProducts = JSON.parse(localStorage.getItem('adminProducts')) || [];
let adminPromotions = JSON.parse(localStorage.getItem('adminPromotions')) || [];

if (adminProducts.length === 0) {
    adminProducts = [
        {
            id: 1,
            name: 'Leche Deslactosada',
            price: 2.99,
            category: 'alimentos',
            stock: 15,
            img: 'static/images/Leche_deslactosada.jpg'
        },
        {
            id: 2,
            name: 'Arroz Premium',
            price: 3.49,
            category: 'alimentos',
            stock: 20,
            img: 'static/images/arroz_premium.jpg'
        },
        {
            id: 3,
            name: 'Agua Mineral 1L',
            price: 1.25,
            category: 'bebidas',
            stock: 30,
            img: 'static/images/agua_mineral.jpg'
        },
        {
            id: 4,
            name: 'Refresco Cola',
            price: 1.99,
            category: 'bebidas',
            stock: 25,
            img: 'static/images/coca_cola.jpeg'
        },
        {
            id: 5,
            name: 'Detergente Líquido',
            price: 4.50,
            category: 'limpieza',
            stock: 10,
            img: 'static/images/detergente_liquido.jpeg'
        },
        {
            id: 6,
            name: 'Jabón de Manos',
            price: 2.25,
            category: 'limpieza',
            stock: 18,
            img: 'static/images/jabon.jpeg'
        },
        {
            id: 7,
            name: 'Shampoo Revitalizante',
            price: 5.99,
            category: 'personal',
            stock: 12,
            img: 'static/images/shampoo.jpg'
        },
        {
            id: 8,
            name: 'Pasta Dental',
            price: 3.15,
            category: 'personal',
            stock: 22,
            img: 'static/images/pasta_dental.jpeg'
        }
    ];
    localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
}

if (adminPromotions.length === 0) {
    adminPromotions = [
        {
            id: 'promo1',
            name: 'Pack Limpieza',
            originalPrice: 15.99,
            price: 13.59,
            discount: 15,
            category: 'limpieza',
            img: 'static/images/pack_limpieza.jpg'
        },
        {
            id: 'promo2',
            name: 'Combo Desayuno',
            originalPrice: 12.50,
            price: 10.00,
            discount: 20,
            category: 'alimentos',
            img: 'static/images/pack_leche.jpg'
        }
    ];
    localStorage.setItem('adminPromotions', JSON.stringify(adminPromotions));
}

const productModal = document.getElementById('product-modal');
const closeProductModal = document.getElementById('close-product-modal');
const addProductBtn = document.getElementById('add-product-btn');
const productForm = document.getElementById('product-form');
const productsTbody = document.getElementById('products-tbody');

const promotionModal = document.getElementById('promotion-modal');
const closePromotionModal = document.getElementById('close-promotion-modal');
const addPromotionBtn = document.getElementById('add-promotion-btn');
const promotionForm = document.getElementById('promotion-form');
const promotionsTbody = document.getElementById('promotions-tbody');

const adminLogoutLink = document.getElementById('admin-logout-link');
const tabButtons = document.querySelectorAll('.tab-btn');

document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();
    adminProducts = JSON.parse(localStorage.getItem('adminProducts')) || adminProducts;
    adminPromotions = JSON.parse(localStorage.getItem('adminPromotions')) || adminPromotions;
    loadAdminProducts();
    loadAdminPromotions();
    updateStats();
    setupTabs();
});

function setupTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
}

function checkAdminAuth() {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
        alert('Acceso denegado. Debe iniciar sesión como administrador.');
        window.location.href = 'login.html';
    }
}

adminLogoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('adminUser');
    alert('Sesión de administrador cerrada.');
    window.location.href = 'index.html';
});

addProductBtn.addEventListener('click', () => {
    document.getElementById('modal-title').textContent = 'Agregar Producto';
    productForm.reset();
    document.getElementById('product-id').value = '';
    productModal.style.display = 'block';
});

closeProductModal.addEventListener('click', () => {
    productModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.style.display = 'none';
    }
    if (e.target === promotionModal) {
        promotionModal.style.display = 'none';
    }
});

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const stock = parseInt(document.getElementById('product-stock').value);
    const img = document.getElementById('product-img').value;

    if (id) {
        const index = adminProducts.findIndex(p => p.id == id);
        adminProducts[index] = { id: parseInt(id), name, price, category, stock, img };
    } else {
        const newId = adminProducts.length > 0 ? Math.max(...adminProducts.map(p => p.id)) + 1 : 1;
        adminProducts.push({ id: newId, name, price, category, stock, img });
    }

    localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
    loadAdminProducts();
    updateStats();
    productModal.style.display = 'none';
    alert(id ? 'Producto actualizado correctamente' : 'Producto agregado correctamente');
});

promotionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('promotion-id').value;
    const name = document.getElementById('promotion-name').value;
    const originalPrice = parseFloat(document.getElementById('promotion-original-price').value);
    const price = parseFloat(document.getElementById('promotion-price').value);
    const category = document.getElementById('promotion-category').value;
    const img = document.getElementById('promotion-img').value;
    
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

    if (id) {
        const index = adminPromotions.findIndex(p => p.id == id);
        adminPromotions[index] = { id, name, originalPrice, price, discount, category, img };
    } else {
        const newId = 'promo' + (adminPromotions.length + 1);
        adminPromotions.push({ id: newId, name, originalPrice, price, discount, category, img });
    }

    localStorage.setItem('adminPromotions', JSON.stringify(adminPromotions));
    loadAdminPromotions();
    promotionModal.style.display = 'none';
    alert(id ? 'Promoción actualizada correctamente' : 'Promoción agregada correctamente');
});

function loadAdminProducts() {
    productsTbody.innerHTML = '';
    
    adminProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.img}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/50'"></td>
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.category}</td>
            <td>${product.stock}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        `;
        productsTbody.appendChild(row);
    });
}

function loadAdminPromotions() {
    promotionsTbody.innerHTML = '';
    
    adminPromotions.forEach(promo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${promo.id}</td>
            <td><img src="${promo.img}" alt="${promo.name}" onerror="this.src='https://via.placeholder.com/50'"></td>
            <td>${promo.name}</td>
            <td>$${promo.originalPrice.toFixed(2)}</td>
            <td>$${promo.price.toFixed(2)}</td>
            <td>-${promo.discount}%</td>
            <td>${promo.category}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editPromotion('${promo.id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="action-btn delete-btn" onclick="deletePromotion('${promo.id}')">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        `;
        promotionsTbody.appendChild(row);
    });
}

function editProduct(id) {
    const product = adminProducts.find(p => p.id === id);
    if (product) {
        document.getElementById('modal-title').textContent = 'Editar Producto';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-img').value = product.img;
        productModal.style.display = 'block';
    }
}

function editPromotion(id) {
    const promo = adminPromotions.find(p => p.id === id);
    if (promo) {
        document.getElementById('promotion-modal-title').textContent = 'Editar Promoción';
        document.getElementById('promotion-id').value = promo.id;
        document.getElementById('promotion-name').value = promo.name;
        document.getElementById('promotion-original-price').value = promo.originalPrice;
        document.getElementById('promotion-price').value = promo.price;
        document.getElementById('promotion-category').value = promo.category;
        document.getElementById('promotion-img').value = promo.img;
        promotionModal.style.display = 'block';
    }
}

function deleteProduct(id) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
        adminProducts = adminProducts.filter(p => p.id !== id);
        localStorage.setItem('adminProducts', JSON.stringify(adminProducts));
        loadAdminProducts();
        updateStats();
        alert('Producto eliminado correctamente');
    }
}

function deletePromotion(id) {
    if (confirm('¿Está seguro de eliminar esta promoción?')) {
        adminPromotions = adminPromotions.filter(p => p.id !== id);
        localStorage.setItem('adminPromotions', JSON.stringify(adminPromotions));
        loadAdminPromotions();
        alert('Promoción eliminada correctamente');
    }
}

function updateStats() {
    document.getElementById('total-products').textContent = adminProducts.length;
    
    const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
    document.getElementById('total-sales').textContent = purchaseHistory.length;
    
    let totalRevenue = 0;
    purchaseHistory.forEach(purchase => {
        const total = parseFloat(purchase.total.replace('$', ''));
        totalRevenue += total;
    });
    document.getElementById('total-revenue').textContent = '$' + totalRevenue.toFixed(2);
}
