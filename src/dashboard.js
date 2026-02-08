const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

console.log(`[Dashboard] Initializing simple status dashboard`);
console.log(`[Dashboard] PORT from environment: ${process.env.PORT}`);
console.log(`[Dashboard] Using PORT: ${PORT}`);

// متغير لحفظ حالة البوت
let botStatus = {
    connected: false,
    username: null,
    guilds: 0,
    uptime: 0,
    startTime: null
};

// متغير لحفظ الـ server instance
let serverInstance = null;

// تحديث حالة البوت
function updateBotStatus(client) {
    if (client && client.user) {
        botStatus.connected = true;
        botStatus.username = client.user.tag;
        botStatus.guilds = client.guilds.cache.size;
        botStatus.startTime = Date.now();
        console.log(`[Dashboard] Bot status updated: ${botStatus.username} in ${botStatus.guilds} guilds`);
    } else {
        botStatus.connected = false;
        botStatus.username = null;
        botStatus.guilds = 0;
        console.log("[Dashboard] Bot status: Disconnected");
    }
}

// صفحة رئيسية بسيطة تعرض حالة البوت
app.get("/", (req, res) => {
    const uptime = botStatus.startTime ? Math.floor((Date.now() - botStatus.startTime) / 1000) : 0;
    
    const html = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meme Rating Bot - الحالة</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 20px;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .container {
                background: rgba(255, 255, 255, 0.95);
                border-radius: 20px;
                padding: 40px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 500px;
                width: 100%;
            }
            .status {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .online {
                color: #22c55e;
            }
            .offline {
                color: #ef4444;
            }
            .info {
                background: #f3f4f6;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                text-align: right;
            }
            .info-item {
                margin: 10px 0;
                font-size: 18px;
            }
            .refresh-btn {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 16px;
                cursor: pointer;
                margin-top: 20px;
            }
            .refresh-btn:hover {
                background: #2563eb;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🤖 Meme Rating Bot</h1>
            <div class="status ${botStatus.connected ? 'online' : 'offline'}">
                ${botStatus.connected ? '🟢 متصل' : '🔴 غير متصل'}
            </div>
            
            <div class="info">
                <div class="info-item">
                    <strong>اسم البوت:</strong> ${botStatus.username || 'غير متصل'}
                </div>
                <div class="info-item">
                    <strong>عدد السيرفرات:</strong> ${botStatus.guilds}
                </div>
                <div class="info-item">
                    <strong>وقت التشغيل:</strong> ${uptime} ثانية
                </div>
                <div class="info-item">
                    <strong>الحالة:</strong> ${botStatus.connected ? 'يعمل بشكل طبيعي' : 'في انتظار الاتصال'}
                </div>
            </div>
            
            <button class="refresh-btn" onclick="location.reload()">🔄 تحديث</button>
        </div>
        
        <script>
            // تحديث تلقائي كل 30 ثانية
            setTimeout(() => location.reload(), 30000);
        </script>
    </body>
    </html>
    `;
    
    res.send(html);
});

// API endpoint لحالة البوت
app.get("/api/status", (req, res) => {
    const uptime = botStatus.startTime ? Math.floor((Date.now() - botStatus.startTime) / 1000) : 0;
    res.json({
        ...botStatus,
        uptime,
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        botConnected: botStatus.connected,
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

// بدء السيرفر
function startServer() {
    if (!serverInstance) {
        console.log("[Dashboard] Starting server...");
        
        serverInstance = app.listen(PORT, '0.0.0.0', () => {
            console.log(`[Dashboard] ✅ Server running on port ${PORT}`);
            console.log(`[Dashboard] Status page: http://localhost:${PORT}`);
            console.log(`[Dashboard] Health check: http://localhost:${PORT}/health`);
        });
        
        serverInstance.on('error', (err) => {
            console.error('[Dashboard] Server error:', err);
            if (err.code === 'EADDRINUSE') {
                console.error(`[Dashboard] Port ${PORT} is already in use`);
            } else if (err.code === 'EACCES') {
                console.error(`[Dashboard] Permission denied for port ${PORT}`);
            }
        });
        
        serverInstance.on('listening', () => {
            const addr = serverInstance.address();
            console.log(`[Dashboard] Server listening on ${addr.address}:${addr.port}`);
        });
    }
}

// ربط مع البوت
function startDashboard(client) {
    console.log("[Dashboard] Connecting to bot...");
    updateBotStatus(client);
    
    // تحديث الحالة كل 30 ثانية
    if (client) {
        setInterval(() => updateBotStatus(client), 30000);
    }
}

// بدء السيرفر تلقائياً
setTimeout(startServer, 1000);

module.exports = { startDashboard, updateBotStatus };
