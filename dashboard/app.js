// Frutiger Aero Dashboard - Modern JavaScript

const API = window.location.origin;

// Global state
let currentUser = null;
let guilds = [];
let stats = {
    servers: 0,
    users: 0,
    memes: 0,
    downloads: 0
};

// DOM Elements
const elements = {
    loadingOverlay: document.getElementById('loadingOverlay'),
    userName: document.getElementById('userName'),
    userAvatar: document.getElementById('userAvatar'),
    serverCount: document.getElementById('serverCount'),
    totalUsers: document.getElementById('totalUsers'),
    totalMemes: document.getElementById('totalMemes'),
    downloadCount: document.getElementById('downloadCount'),
    serversGrid: document.getElementById('serversGrid'),
    activityList: document.getElementById('activityList')
};

// Initialize dashboard
async function initDashboard() {
    showLoading(true);
    
    try {
        await checkAuth();
        await loadUserData();
        await loadStats();
        await loadServers();
        await loadActivity();
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        showError('فشل في تحميل لوحة التحكم');
    } finally {
        showLoading(false);
    }
}

// Check authentication
async function checkAuth() {
    try {
        const response = await fetch(`${API}/api/user`);
        const data = await response.json();
        
        if (!data.loggedIn) {
            window.location.href = '/';
            return;
        }
        
        currentUser = data.user;
        updateUserUI();
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/';
    }
}

// Update user UI
function updateUserUI() {
    if (!currentUser) return;
    
    elements.userName.textContent = currentUser.globalName || currentUser.username;
    elements.userAvatar.src = `https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.avatar}.png`;
}

// Load user data
async function loadUserData() {
    try {
        const response = await fetch(`${API}/api/user/guilds`);
        guilds = await response.json();
        stats.servers = guilds.length;
        updateStats();
    } catch (error) {
        console.error('Failed to load guilds:', error);
    }
}

// Load statistics
async function loadStats() {
    try {
        // Simulate stats loading (replace with real API calls)
        stats.users = Math.floor(Math.random() * 1000) + 500;
        stats.memes = Math.floor(Math.random() * 500) + 200;
        stats.downloads = Math.floor(Math.random() * 100) + 50;
        updateStats();
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

// Update statistics UI
function updateStats() {
    elements.serverCount.textContent = stats.servers;
    elements.totalUsers.textContent = stats.users.toLocaleString();
    elements.totalMemes.textContent = stats.memes.toLocaleString();
    elements.downloadCount.textContent = stats.downloads.toLocaleString();
}

// Load servers
async function loadServers() {
    if (!guilds.length) return;
    
    const serversHTML = guilds.map(guild => `
        <div class="server-card">
            <div class="server-icon">
                ${guild.icon ? 
                    `<img src="${guild.icon}" alt="${guild.name}" style="width: 100%; height: 100%; border-radius: 8px;">` : 
                    guild.name.charAt(0).toUpperCase()
                }
            </div>
            <div class="server-info">
                <h4>${guild.name}</h4>
                <p>${guild.memberCount || 'N/A'} عضو</p>
            </div>
        </div>
    `).join('');
    
    elements.serversGrid.innerHTML = serversHTML;
}

// Load activity
async function loadActivity() {
    const activities = [
        { icon: '⭐', title: 'تم تقييم 10 ميمز', time: 'منذ 5 دقائق' },
        { icon: '📥', title: 'تم تحميل 5 فيديوهات', time: 'منذ 15 دقيقة' },
        { icon: '🌐', title: 'انضم سيرفر جديد', time: 'منذ ساعة' },
        { icon: '⚙️', title: 'تم تحديث الإعدادات', time: 'منذ ساعتين' },
        { icon: '📊', title: 'تم إنشاء تقرير', time: 'منذ 3 ساعات' }
    ];
    
    const activityHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
    
    elements.activityList.innerHTML = activityHTML;
}

// Refresh functions
async function refreshServers() {
    showLoading(true);
    try {
        await loadUserData();
        showNotification('تم تحديث السيرفرات', 'success');
    } catch (error) {
        showNotification('فشل في تحديث السيرفرات', 'error');
    } finally {
        showLoading(false);
    }
}

async function refreshActivity() {
    showLoading(true);
    try {
        await loadActivity();
        showNotification('تم تحديث النشاط', 'success');
    } catch (error) {
        showNotification('فشل في تحديث النشاط', 'error');
    } finally {
        showLoading(false);
    }
}

// Loading overlay
function showLoading(show) {
    if (elements.loadingOverlay) {
        elements.loadingOverlay.classList.toggle('active', show);
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
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
    
    // Set color based on type
    const colors = {
        success: { bg: '#10B981', text: '#FFFFFF' },
        error: { bg: '#EF4444', text: '#FFFFFF' },
        info: { bg: '#0066FF', text: '#FFFFFF' }
    };
    
    const color = colors[type] || colors.info;
    notification.style.backgroundColor = color.bg;
    notification.style.color = color.text;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Show error
function showError(message) {
    showNotification(message, 'error');
}

// Navigation
document.addEventListener('DOMContentLoaded', () => {
    // Handle navigation clicks
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            document.querySelectorAll('.nav-item').forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Handle navigation (placeholder for now)
            const href = item.getAttribute('href');
            if (href === '#dashboard') {
                // Already on dashboard
                showNotification('أنت بالفعل في لوحة التحكم', 'info');
            } else {
                showNotification(`قسم ${href.substring(1)} قيد التطوير`, 'info');
            }
        });
    });
    
    // Initialize dashboard
    initDashboard();
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && currentUser) {
        // Refresh data when page becomes visible
        loadStats();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + R for refresh
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        refreshServers();
        refreshActivity();
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
