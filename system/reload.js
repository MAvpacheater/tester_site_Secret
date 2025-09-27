// Simplified and Reliable GitHub Auto-reload System
class GitHubAutoReload {
    constructor(options = {}) {
        this.githubUser = options.githubUser || 'MAvpacheater';
        this.githubRepo = options.githubRepo || 'tester_site_Secret';
        this.branch = options.branch || 'main';
        this.checkInterval = options.checkInterval || 30000;
        this.lastCommitSha = null;
        this.isActive = false;
        this.intervalId = null;
        this.failureCount = 0;
        this.maxFailures = 3;
        this.isReloading = false;
    }

    async init() {
        console.log('🔄 Initializing GitHub auto-reload...');
        
        try {
            await this.getCurrentCommitSha();
            this.start();
            this.showIndicator();
            console.log('✅ GitHub auto-reload activated');
            return true;
        } catch (error) {
            console.warn('⚠️ GitHub auto-reload initialization failed:', error.message);
            return false;
        }
    }

    async getCurrentCommitSha() {
        try {
            const apiUrl = `https://api.github.com/repos/${this.githubUser}/${this.githubRepo}/commits/${this.branch}`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            
            const response = await fetch(apiUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Arm-Helper-Auto-Reload'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.status === 403) {
                const resetTime = response.headers.get('X-RateLimit-Reset');
                const resetDate = resetTime ? new Date(resetTime * 1000) : new Date(Date.now() + 3600000);
                throw new Error(`GitHub API rate limit exceeded. Resets at ${resetDate.toLocaleTimeString()}`);
            }

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const commitData = await response.json();
            const newSha = commitData.sha;
            
            this.failureCount = 0;

            if (this.lastCommitSha === null) {
                this.lastCommitSha = newSha;
                console.log('🎯 Initial commit SHA recorded');
                return false;
            }

            if (this.lastCommitSha !== newSha) {
                console.log('🔄 New commit detected!');
                this.lastCommitSha = newSha;
                return true;
            }

            return false;
        } catch (error) {
            this.failureCount++;
            console.warn(`❌ GitHub API request failed (${this.failureCount}/${this.maxFailures}):`, error.message);
            
            if (this.failureCount >= this.maxFailures) {
                this.stop();
                this.hideIndicator();
            }
            
            throw error;
        }
    }

    start() {
        if (this.isActive || this.isReloading) return;
        
        this.isActive = true;
        
        this.intervalId = setInterval(async () => {
            if (this.isReloading) return;
            
            try {
                const hasChanges = await this.getCurrentCommitSha();
                if (hasChanges && !this.isReloading) {
                    this.reloadPage();
                }
            } catch (error) {
                // Error handled in getCurrentCommitSha
            }
        }, this.checkInterval);
        
        console.log(`🚀 GitHub monitoring started`);
    }

    stop() {
        if (!this.isActive) return;
        
        this.isActive = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    reloadPage() {
        if (this.isReloading) return;
        
        this.isReloading = true;
        console.log('🔄 Changes detected, reloading...');
        
        this.stop();
        
        // Simple: just save current URL
        const currentURL = window.location.href;
        sessionStorage.setItem('reloadURL', currentURL);
        sessionStorage.setItem('reloadTime', Date.now().toString());
        
        console.log(`💾 Saved URL: ${currentURL}`);
        
        this.showReloadNotification();
        
        setTimeout(() => {
            window.location.reload(true);
        }, 1500);
    }

    showReloadNotification() {
        const existing = document.querySelector('.reload-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'reload-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px 40px;
                border-radius: 15px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                z-index: 30000;
                text-align: center;
                font-family: 'Segoe UI', sans-serif;
                animation: slideIn 0.3s ease-out;
            ">
                <div style="font-size: 3em; margin-bottom: 15px;">🚀</div>
                <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">Code Updated!</div>
                <div style="font-size: 14px; opacity: 0.9;">Reloading...</div>
            </div>
            <style>
                @keyframes slideIn {
                    from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            </style>
        `;
        
        document.body.appendChild(notification);
    }

    showIndicator() {
        const indicator = document.getElementById('autoReloadIndicator');
        if (indicator) {
            indicator.innerHTML = `🔄 Auto-reload active`;
            indicator.classList.add('show');
            
            setTimeout(() => {
                indicator.classList.remove('show');
            }, 5000);
        }
    }

    hideIndicator() {
        const indicator = document.getElementById('autoReloadIndicator');
        if (indicator) {
            indicator.classList.remove('show');
        }
    }

    getStatus() {
        return {
            active: this.isActive,
            lastCommitSha: this.lastCommitSha?.substring(0, 8),
            checkInterval: this.checkInterval,
            failureCount: this.failureCount,
            isReloading: this.isReloading
        };
    }
}

// Global instances
let urlRouter = null;
let githubAutoReloadSystem = null;

// Initialize URL Routing
function initURLRouting() {
    if (urlRouter) return urlRouter;

    urlRouter = new URLRouter();
    
    setTimeout(() => {
        urlRouter.init();
    }, 100);

    // Enhance switchPage function
    const originalSwitchPage = window.switchPage;
    if (typeof originalSwitchPage === 'function') {
        window.switchPage = function(page) {
            const result = originalSwitchPage.call(this, page);
            
            if (urlRouter) {
                urlRouter.updateURL(page, true);
            }
            
            return result;
        };
    }

    return urlRouter;
}

// Initialize Auto-reload
function initGitHubAutoReload(options = {}) {
    if (githubAutoReloadSystem) return githubAutoReloadSystem;

    githubAutoReloadSystem = new GitHubAutoReload(options);
    
    setTimeout(async () => {
        await githubAutoReloadSystem.init();
    }, 3000);

    return githubAutoReloadSystem;
}

// Simple and reliable page restoration
function handlePageRestoration() {
    console.log('🔄 Checking page restoration...');
    
    // Check for reload restoration
    const savedURL = sessionStorage.getItem('reloadURL');
    const reloadTime = sessionStorage.getItem('reloadTime');
    
    if (savedURL && reloadTime) {
        const timeDiff = Date.now() - parseInt(reloadTime);
        
        if (timeDiff < 30000) { // 30 seconds max
            console.log(`🔄 Restoring URL: ${savedURL}`);
            
            // Only restore if different
            if (savedURL !== window.location.href) {
                window.history.replaceState(null, null, savedURL);
                console.log('✅ URL restored');
            }
            
            // Let URL router handle page switching
            setTimeout(() => {
                if (urlRouter && typeof switchPage === 'function') {
                    const page = urlRouter.getPageFromURL();
                    switchPage(page);
                    console.log(`✅ Page restored: ${page}`);
                }
            }, 300);
        }
        
        // Clean up
        sessionStorage.removeItem('reloadURL');
        sessionStorage.removeItem('reloadTime');
        return;
    }
    
    // Check for 404 redirect
    const redirect = sessionStorage.getItem('pathToRestore');
    if (redirect && redirect !== '/') {
        console.log(`🔄 404 redirect: ${redirect}`);
        
        const protocol = window.location.protocol;
        const host = window.location.host;
        let basePath = '';
        
        if (host === 'mavpacheater.github.io') {
            basePath = '/tester_site_Secret';
        }
        
        const fullPath = basePath + redirect;
        window.history.replaceState(null, null, fullPath);
        
        sessionStorage.removeItem('pathToRestore');
        console.log(`✅ 404 URL corrected: ${fullPath}`);
        return;
    }
    
    console.log('ℹ️ No restoration needed');
}

// Control functions
function stopGitHubAutoReload() {
    if (githubAutoReloadSystem) {
        githubAutoReloadSystem.stop();
        githubAutoReloadSystem.hideIndicator();
    }
}

function startGitHubAutoReload() {
    if (githubAutoReloadSystem) {
        githubAutoReloadSystem.start();
        githubAutoReloadSystem.showIndicator();
    } else {
        initGitHubAutoReload();
    }
}

function checkGitHubNow() {
    if (githubAutoReloadSystem) {
        githubAutoReloadSystem.checkNow();
    }
}

function debugURLRouter() {
    if (urlRouter) {
        urlRouter.debug();
    }
}

function getSystemStatus() {
    return {
        urlRouter: !!urlRouter,
        autoReload: githubAutoReloadSystem?.getStatus()
    };
}

// Export functions
window.initURLRouting = initURLRouting;
window.initGitHubAutoReload = initGitHubAutoReload;
window.handlePageRestoration = handlePageRestoration;
window.stopGitHubAutoReload = stopGitHubAutoReload;
window.startGitHubAutoReload = startGitHubAutoReload;
window.checkGitHubNow = checkGitHubNow;
window.debugURLRouter = debugURLRouter;
window.getSystemStatus = getSystemStatus;
window.urlRouter = () => urlRouter;
window.githubAutoReloadSystem = () => githubAutoReloadSystem;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(handlePageRestoration, 500);
});

console.log('✅ Simplified reload system loaded');
