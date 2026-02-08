require("dotenv").config({ path: ".env" });

// Start dashboard immediately for Render port detection
console.log('[Start] Starting dashboard immediately for port binding...');
const { startDashboard } = require("./src/dashboard");
startDashboard(null);

// Start bot after a small delay to ensure dashboard binds first
setTimeout(() => {
    console.log('[Start] Starting Discord bot...');
    require("./src/bot.js");
}, 1000);
