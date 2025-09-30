// ===== COLLECTION.JS - Collection Page Logic =====

// Store all products globally
let allProducts = [];
let filteredProducts = [];

// ===== LOAD PRODUCTS FROM JSON =====
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        
        // Apply URL parameters if any (e.g., ?category=handbags)
        applyURLFilters();
        
        displayProducts(filteredProducts);
        updateProductCount(filteredProducts.length);
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsGrid').innerHTML = `
            <div class="loading-message sans">
                Unable to load products. Please check that data/products.json exists.
            </div>
        `;
    }
}

// ===== APPLY FILTERS FROM URL =====
function applyURLFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        // Check the appropriate filter checkbox
        const checkbox = document.querySelector(`input[name="category"][value="${category}"]`);
        if (checkbox) {
            checkbox.checked = true;
        }
        applyFilters();
    }
}

// ===== DISPLAY PRODUCTS =====
function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    
    if (products.length === 0) {
        productsGrid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    productsGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                ${product.featured ? '<span class="product-badge sans">Featured</span>' : ''}
            </div>
            <div class="product-info">
                <span class="product-brand sans">${product.brand}</span>
                <h3 class="product-name">${product.name}</h3>
                <span class="product-condition sans">Condition: ${product.condition}</span>
                <span class="product-price">£${product.price.toLocaleString()}</span>
                <a href="mailto:sales@avantelle.co.uk?subject=Inquiry about ${product.brand} ${product.name}" class="product-cta sans">Inquire</a>
            </div>
        </div>
    `).join('');
}

// ===== UPDATE PRODUCT COUNT =====
function updateProductCount(count) {
    const productCount = document.getElementById('productCount');
    productCount.textContent = `${count} ${count === 1 ? 'piece' : 'pieces'} available`;
}

// ===== APPLY FILTERS =====
function applyFilters() {
    // Get all checked filters
    const selectedCategories = getSelectedFilters('category');
    const selectedBrands = getSelectedFilters('brand');
    const selectedConditions = getSelectedFilters('condition');
    const selectedPriceRanges = getSelectedFilters('price');
    
    // Filter products
    filteredProducts = allProducts.filter(product => {
        // Category filter
        const categoryMatch = selectedCategories.length === 0 || 
            selectedCategories.includes(product.category);
        
        // Brand filter
        const brandMatch = selectedBrands.length === 0 || 
            selectedBrands.includes(product.brand);
        
        // Condition filter
        const conditionMatch = selectedConditions.length === 0 || 
            selectedConditions.includes(product.condition);
        
        // Price filter
        const priceMatch = selectedPriceRanges.length === 0 || 
            selectedPriceRanges.some(range => {
                const [min, max] = range.split('-').map(Number);
                return product.price >= min && product.price <= max;
            });
        
        return categoryMatch && brandMatch && conditionMatch && priceMatch;
    });
    
    // Apply current sort
    sortProducts(document.getElementById('sortSelect').value);
    
    displayProducts(filteredProducts);
    updateProductCount(filteredProducts.length);
}

// ===== GET SELECTED FILTERS =====
function getSelectedFilters(filterName) {
    const checkboxes = document.querySelectorAll(`input[name="${filterName}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

// ===== SORT PRODUCTS =====
function sortProducts(sortType) {
    switch(sortType) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        case 'brand':
            filteredProducts.sort((a, b) => a.brand.localeCompare(b.brand));
            break;
        case 'featured':
        default:
            // Featured items first, then by date added
            filteredProducts.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return new Date(b.dateAdded) - new Date(a.dateAdded);
            });
            break;
    }
}

// ===== CLEAR ALL FILTERS =====
function clearAllFilters() {
    // Uncheck all filter checkboxes
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset to all products
    filteredProducts = [...allProducts];
    sortProducts(document.getElementById('sortSelect').value);
    displayProducts(filteredProducts);
    updateProductCount(filteredProducts.length);
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', () => {
    // Load products on page load
    loadProducts();
    
    // Listen to all filter checkboxes
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Listen to sort select
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        sortProducts(e.target.value);
        displayProducts(filteredProducts);
    });
    
    // Clear filters button
    document.getElementById('clearFilters').addEventListener('click', clearAllFilters);
    
    // Reset filters button (in no results section)
    document.getElementById('resetFilters').addEventListener('click', clearAllFilters);
});
