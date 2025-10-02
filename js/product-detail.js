// ===== PRODUCT-DETAIL.JS - Product Detail Page Logic =====

let currentProduct = null;
let allProducts = [];

// ===== LOAD PRODUCT ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', async () => {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        showNotFound();
        return;
    }
    
    // Load products and find the specific one
    await loadProductData(productId);
    
    // Initialize tabs
    initializeTabs();
    
    // Initialize inquiry form
    initializeInquiryForm();
});

// ===== LOAD PRODUCT DATA =====
async function loadProductData(productId) {
    try {
        const response = await fetch('data/products.json');
        if (!response.ok) throw new Error('Failed to load products');
        
        allProducts = await response.json();
        currentProduct = allProducts.find(p => p.id === parseInt(productId));
        
        if (!currentProduct) {
            showNotFound();
            return;
        }
        
        displayProduct(currentProduct);
        loadRelatedProducts(currentProduct);
        
    } catch (error) {
        console.error('Error loading product:', error);
        showNotFound();
    }
}

// ===== DISPLAY PRODUCT =====
function displayProduct(product) {
    // Hide loading, show content
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('productDetail').style.display = 'block';
    
    // Update page title and meta tags
    const title = `${product.brand} ${product.name} | Avantelle`;
    document.title = title;
    document.getElementById('pageTitle').textContent = title;
    document.getElementById('pageDescription').content = `Authenticated ${product.brand} ${product.name} in ${product.condition} condition. ${product.price.toLocaleString()} GBP.`;
    
    // Open Graph tags
    document.getElementById('ogTitle').content = title;
    document.getElementById('ogDescription').content = `Authenticated ${product.brand} ${product.name}`;
    document.getElementById('ogImage').content = product.image;
    document.getElementById('ogUrl').content = window.location.href;
    
    // Twitter tags
    document.getElementById('twitterTitle').content = title;
    document.getElementById('twitterDescription').content = `Authenticated ${product.brand} ${product.name}`;
    document.getElementById('twitterImage').content = product.image;
    
    // Breadcrumb
    document.getElementById('breadcrumbProduct').textContent = product.name;
    
    // Main product info
    document.getElementById('productBrand').textContent = product.brand;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productCategory').textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
    document.getElementById('productPrice').textContent = `£${product.price.toLocaleString()}`;
    document.getElementById('productCondition').textContent = `Condition: ${product.condition}`;
    
    // Description
    const description = product.description || `This exceptional ${product.brand} ${product.name} has been carefully authenticated by our specialist team. The piece is in ${product.condition.toLowerCase()} condition and comes with our certificate of authenticity.`;
    document.getElementById('productDescription').innerHTML = `<p>${description}</p>`;
    
    // Main image and gallery
    const mainImage = document.getElementById('mainProductImage');
    mainImage.src = product.image;
    mainImage.alt = `${product.brand} ${product.name}`;
    
    // Generate thumbnails (using same image for demo - you'll add multiple images later)
    const thumbsContainer = document.getElementById('galleryThumbs');
    const images = product.images || [product.image, product.image, product.image, product.image];
    
    thumbsContainer.innerHTML = images.map((img, index) => `
        <div class="gallery-thumb ${index === 0 ? 'active' : ''}" data-image="${img}">
            <img src="${img}" alt="${product.name} view ${index + 1}">
        </div>
    `).join('');
    
    // Thumbnail click handlers
    document.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            const imgUrl = thumb.dataset.image;
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = imgUrl;
                mainImage.style.opacity = '1';
            }, 200);
            
            document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
    
    // Specifications
    generateSpecifications(product);
    
    // Condition text
    document.getElementById('conditionText').textContent = product.condition.toLowerCase();
    
    // Pre-fill inquiry form
    const inquiryMessage = document.getElementById('inquiryMessage');
    inquiryMessage.value = `I'm interested in the ${product.brand} ${product.name} (£${product.price.toLocaleString()}). Please provide more information.`;
}

// ===== GENERATE SPECIFICATIONS =====
function generateSpecifications(product) {
    const specsContainer = document.getElementById('specificationsGrid');
    
    const specs = {
        'Brand': product.brand,
        'Condition': product.condition,
        'Category': product.category.charAt(0).toUpperCase() + product.category.slice(1),
        'Date Added': new Date(product.dateAdded).toLocaleDateString('en-GB', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }),
        'Authentication': 'Certificate Included',
        'Availability': 'Available Now'
    };
    
    // Add category-specific specs
    if (product.category === 'shoes') {
        specs['Type'] = 'Designer Footwear';
    } else if (product.category === 'handbags') {
        specs['Type'] = 'Luxury Handbag';
    }
    
    specsContainer.innerHTML = Object.entries(specs).map(([label, value]) => `
        <div class="spec-item">
            <span class="spec-label sans">${label}</span>
            <span class="spec-value">${value}</span>
        </div>
    `).join('');
}

// ===== LOAD RELATED PRODUCTS =====
function loadRelatedProducts(product) {
    // Find products from same brand or category
    const related = allProducts
        .filter(p => p.id !== product.id && (p.brand === product.brand || p.category === product.category))
        .slice(0, 3);
    
    if (related.length === 0) {
        return;
    }
    
    const relatedSection = document.getElementById('relatedProducts');
    const relatedGrid = document.getElementById('relatedGrid');
    
    relatedGrid.innerHTML = related.map(p => `
        <a href="product-detail.html?id=${p.id}" class="product-card">
            <div class="product-image-wrapper">
                <img src="${p.image}" alt="${p.name}" class="product-image">
                ${p.featured ? '<span class="product-badge sans">Featured</span>' : ''}
            </div>
            <div class="product-info">
                <span class="product-brand sans">${p.brand}</span>
                <h3 class="product-name">${p.name}</h3>
                <span class="product-condition sans">Condition: ${p.condition}</span>
                <span class="product-price">£${p.price.toLocaleString()}</span>
            </div>
        </a>
    `).join('');
    
    relatedSection.style.display = 'block';
}

// ===== TABS FUNCTIONALITY =====
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active from all
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active to clicked
            button.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
        });
    });
}

// ===== INQUIRY FORM =====
function initializeInquiryForm() {
    const form = document.getElementById('inquiryForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('inquiryName').value;
        const email = document.getElementById('inquiryEmail').value;
        const phone = document.getElementById('inquiryPhone').value;
        const message = document.getElementById('inquiryMessage').value;
        
        // Create mailto link with pre-filled data
        const subject = `Inquiry about ${currentProduct.brand} ${currentProduct.name}`;
        const body = `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}

---
Product: ${currentProduct.brand} ${currentProduct.name}
Price: £${currentProduct.price.toLocaleString()}
Product ID: ${currentProduct.id}
        `.trim();
        
        const mailtoLink = `mailto:sales@avantelle.co.uk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show confirmation
        alert('Your inquiry form has been opened in your email client. Please send the email to complete your inquiry.');
    });
}

// ===== SHOW NOT FOUND =====
function showNotFound() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('notFound').style.display = 'flex';
}
