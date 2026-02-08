// Frutiger Aero Landing Page - Modern JavaScript

const BOT_INVITE_URL = "https://discord.com/oauth2/authorize?client_id=1469945646793363496&permissions=8&scope=bot&response_type=code&redirect_uri=https://meme-rating-bot-v1-private.onrender.com/auth/callback";

// DOM Elements
const elements = {
    headerActions: document.getElementById('headerActions'),
    heroButtons: document.getElementById('heroButtons'),
    statServers: document.getElementById('statServers'),
    statUsers: document.getElementById('statUsers'),
    statMemes: document.getElementById('statMemes'),
    statDownloads: document.getElementById('statDownloads')
};

// Initialize landing page
async function initLanding() {
    try {
        await checkAuth();
        await loadStats();
        startAnimations();
    } catch (error) {
        console.error('Landing initialization error:', error);
    }
}

// Check authentication
async function checkAuth() {
    try {
        const response = await fetch(`${window.location.origin}/api/user`);
        const data = await response.json();
        
        if (data.loggedIn) {
            renderLoggedInState(data.user);
        } else {
            renderLoggedOutState();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        renderLoggedOutState();
    }
}

// Render logged in state
function renderLoggedInState(user) {
    const avatarUrl = user.avatar ? 
        `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : 
        null;
    
    elements.headerActions.innerHTML = `
        <div class="user-info">
            <div class="user-avatar">
                ${avatarUrl ?
                    `<img src="${avatarUrl}" class="user-avatar-small" alt="">` :
                    `<div class="user-avatar-placeholder-small">${user.username.charAt(0).toUpperCase()}</div>`
                }
            </div>
            <div class="user-details">
                <div class="user-name">${user.globalName || user.username}</div>
                <div class="user-status">
                    <span class="status-dot online"></span>
                    <span>متصل</span>
                </div>
            </div>
        </div>
    `;
    
    elements.heroButtons.innerHTML = `
        <a href="/dashboard" class="btn-primary">
            <span>🎛️</span>
            لوحة التحكم
        </a>
        <a href="${BOT_INVITE_URL}" target="_blank" class="btn-secondary">
            <span>➕</span>
            إضافة البوت
        </a>
    `;
}

// Render logged out state
function renderLoggedOutState() {
    elements.headerActions.innerHTML = `
        <button class="btn-ghost" onclick="showLogin()">
            <span>🔐</span>
            تسجيل الدخول
        </button>
    `;
    
    elements.heroButtons.innerHTML = `
        <a href="/auth/login" class="btn-primary">
            <span>🚀</span>
            ابدأ الآن
        </a>
        <a href="/dashboard" class="btn-secondary">
            <span>🎛️</span>
            لوحة التحكم
        </a>
    `;
}

// Load statistics
async function loadStats() {
    try {
        // Simulate stats loading (replace with real API calls)
        const stats = {
            servers: Math.floor(Math.random() * 100) + 50,
            users: Math.floor(Math.random() * 5000) + 1000,
            memes: Math.floor(Math.random() * 10000) + 5000,
            downloads: Math.floor(Math.random() * 1000) + 500
        };
        
        updateStats(stats);
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

// Update statistics with animation
function updateStats(stats) {
    animateNumber(elements.statServers, stats.servers);
    animateNumber(elements.statUsers, stats.users);
    animateNumber(elements.statMemes, stats.memes);
    animateNumber(elements.statDownloads, stats.downloads);
}

// Animate number counting
function animateNumber(element, target) {
    const duration = 2000;
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Show login modal
function showLogin() {
    // Redirect to Discord OAuth
    window.location.href = "/auth/login";
}

// Start animations
function startAnimations() {
    // Animate shapes on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed) * 0.1;
            shape.style.transform = `translateY(${yPos}px)`;
        });
    });
    
    // Parallax effect for hero
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroVisual = document.querySelector('.hero-visual');
            if (heroVisual) {
                heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
    }
}

// Add floating particles
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(0, 102, 255, 0.6);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${10 + Math.random() * 20}s linear infinite;
        `;
        particlesContainer.appendChild(particle);
    }
    
    document.body.appendChild(particlesContainer);
}

// Add CSS for particles
const particleCSS = `
    @keyframes particleFloat {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = particleCSS;
document.head.appendChild(styleSheet);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements
document.addEventListener('DOMContentLoaded', () => {
    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });
    
    // Initialize
    initLanding();
    createParticles();
    
    // Add hover effects
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Enter or Space for primary action
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const primaryBtn = document.querySelector('.btn-primary');
        if (primaryBtn) {
            primaryBtn.click();
        }
    }
});

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    
    // Show performance indicator in development
    if (window.location.hostname === 'localhost') {
        const perfIndicator = document.createElement('div');
        perfIndicator.innerHTML = `⚡ ${loadTime.toFixed(0)}ms`;
        perfIndicator.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 1000;
        `;
        document.body.appendChild(perfIndicator);
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showNotification('حدث خطأ غير متوقع', 'error');
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('حدث خطأ في الاتصال', 'error');
});

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        fontWeight: '500',
        fontSize: '14px',
        zIndex: '1001',
        opacity: '0',
        transform: 'translateY(-20px)',
        transition: 'all 0.3s ease'
    });
    
    const colors = {
        success: { bg: '#10B981', text: '#FFFFFF' },
        error: { bg: '#EF4444', text: '#FFFFFF' },
        info: { bg: '#0066FF', text: '#FFFFFF' }
    };
    
    const color = colors[type] || colors.info;
    notification.style.backgroundColor = color.bg;
    notification.style.color = color.text;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
