// ===== AUTHENTICATION.JS - Enhanced Interactive Features =====

// ===== EXPANDABLE INSIGHT MODULES =====
document.addEventListener('DOMContentLoaded', () => {
    
    // Handle insight module expansion
    const insightHeaders = document.querySelectorAll('.insight-header');
    
    insightHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = header.classList.contains('active');
            
            // Close all other insights
            document.querySelectorAll('.insight-header').forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.classList.remove('active');
            });
            
            // Toggle current insight
            if (!isActive) {
                header.classList.add('active');
                content.classList.add('active');
            }
        });
    });

    // ===== GALLERY SYSTEM =====
    initializeGalleries();
    
    // ===== TESTIMONIAL CAROUSEL =====
    initializeTestimonialCarousel();
    
    // ===== SCROLL ANIMATIONS =====
    initializeScrollAnimations();
});

// ===== GALLERY FUNCTIONALITY =====
function initializeGalleries() {
    // Get all galleries
    const galleries = document.querySelectorAll('.insight-gallery-container');
    
    galleries.forEach(gallery => {
        const mainImage = gallery.querySelector('.gallery-hero-image');
        const thumbnails = gallery.querySelectorAll('.thumbnail');
        
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                // Get the full-size image URL
                const fullImageUrl = thumbnail.dataset.full;
                
                // Fade out current image
                mainImage.style.opacity = '0';
                
                // Wait for fade, then change image
                setTimeout(() => {
                    mainImage.src = fullImageUrl;
                    mainImage.style.opacity = '1';
                }, 300);
                
                // Update active thumbnail
                thumbnails.forEach(t => t.classList.remove('active'));
                thumbnail.classList.add('active');
            });
        });
    });
}

// ===== TESTIMONIAL CAROUSEL =====
function initializeTestimonialCarousel() {
    const track = document.getElementById('testimonialTrack');
    const slides = track.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('testimonialDots');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('testimonial-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    const dots = dotsContainer.querySelectorAll('.testimonial-dot');
    
    // Show initial slide
    showSlide(0);
    
    // Navigation functions
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(prev);
    }
    
    function goToSlide(index) {
        showSlide(index);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Auto-play (optional - uncomment to enable)
    // setInterval(nextSlide, 6000);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Animate timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(40px)';
        item.style.transition = `opacity 0.8s ease ${index * 0.15}s, transform 0.8s ease ${index * 0.15}s`;
        fadeInObserver.observe(item);
    });
    
    // Animate insight modules
    const insightModules = document.querySelectorAll('.insight-module');
    insightModules.forEach((module, index) => {
        module.style.opacity = '0';
        module.style.transform = 'translateY(40px)';
        module.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        fadeInObserver.observe(module);
    });
    
    // Animate why items
    const whyItems = document.querySelectorAll('.why-item');
    whyItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-40px)';
        item.style.transition = `opacity 0.8s ease ${index * 0.15}s, transform 0.8s ease ${index * 0.15}s`;
        fadeInObserver.observe(item);
    });
}

// ===== SMOOTH IMAGE LOADING =====
// Add loading state to images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.gallery-hero-image, .thumbnail img');
    
    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.addEventListener('load', () => {
                img.style.transition = 'opacity 0.5s ease';
                img.style.opacity = '1';
            });
        }
    });
});
