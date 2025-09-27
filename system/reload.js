// Fixed GitHub Auto-reload System
class GitHubAutoReload {
    constructor(options = {}) {
        this.githubUser = options.githubUser || 'MAvpacheater';
        this.githubRepo = options.githubRepo || 'tester_site_Secret';
        this.branch = options.branch || 'main';
        this.checkInterval = options.checkInterval || 30000; // 30 seconds
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

            if (response.status === 404) {
                throw new Error('Repository not found or private');
            }

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const commitData = await response.json();
            const newSha = commitData.sha;
            
            console.log(`📝 Latest commit: ${newSha.substring(0, 8)}...`);

            this.failureCount = 0;

            if (this.lastCommitSha === null) {
                this.lastCommitSha = newSha;
                console.log('🎯 Initial commit SHA recorded');
                return false;
            }

            if (this.lastCommitSha !== newSha) {
                console.log('🔄 New commit detected!');
                console.log(`Old: ${this.lastCommitSha.substring(0, 8)}...`);
                console.log(`New: ${newSha.substring(0, 8)}...`);
                this.lastCommitSha = newSha;
                return true;
            }

            return false;
        } catch (error) {
            this.failureCount++;
            console.warn(`❌ GitHub API request failed (${this.failureCount}/${this.maxFailures}):`, error.message);
            
            if (this.failureCount >= this.maxFailures) {
                console.warn('⚠️ Max failures reached, stopping auto-reload');
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
                // Error already handled in getCurrentCommitSha
            }
        }, this.checkInterval);
        
        console.log(`🚀 GitHub monitoring started (${this.checkInterval/1000}s interval)`);
    }

    stop() {
        if (!this.isActive) return;
        
        this.isActive = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        console.log('⏸️ GitHub monitoring stopped');
    }

    reloadPage() {
        if (this.isReloading) return;
        
        this.isReloading = true;
        console.log('🔄 Changes detected, preparing to reload...');
        
        this.stop();
        this.showReloadNotification();
        
        // Save current page state to restore after reload
        const currentPage = urlRouter ? urlRouter.getPageFromURL() : 'calculator';
        sessionStorage.setItem('pageBeforeReload', currentPage);
        sessionStorage.setItem('reloadTimestamp', Date.now().toString());
        
        console.log(`💾 Saved page before reload: ${currentPage}`);
        
        setTimeout(() => {
            console.log('🔄 Reloading page...');
            window.location.reload(true);
        }, 2000);
    }

    showReloadNotification() {
        // Remove any existing notifications
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
                max-width: 400px;
                font-family: 'Segoe UI', sans-serif;
                animation: slideIn 0.3s ease-out;
            ">
                <div style="font-size: 3em; margin-bottom: 15px;">🚀</div>
                <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">Code Updated!</div>
                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 20px;">
                    Reloading in <span id="reloadCountdown">2</span> seconds...
                </div>
                <div style="font-size: 12px; opacity: 0.7;">
                    Your current page will be restored
                </div>
            </div>
            <style>
                @keyframes slideIn {
                    from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            </style>
        `;
        
        document.body.appendChild(notification);
        
        // Countdown
        let seconds = 2;
        const countdownEl = document.getElementById('reloadCountdown');
        const countdownInterval = setInterval(() => {
            seconds--;
            if (countdownEl) countdownEl.textContent = seconds;
            if (seconds <= 0) clearInterval(countdownInterval);
        }, 1000);
    }

    showIndicator() {
        const indicator = document.getElementById('autoReloadIndicator');
        if (indicator) {
            indicator.innerHTML = `🔄 Auto-reload active`;
            indicator.classList.add('show');
            
            // Auto-hide after 5 seconds
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

    async checkNow() {
        try {
            console.log('🔍 Manual check requested...');
            const hasChanges = await this.getCurrentCommitSha();
            if (hasChanges) {
                this.reloadPage();
            } else {
                console.log('✅ No changes detected');
                // Show temporary notification
                const indicator = document.getElementById('autoReloadIndicator');
                if (indicator) {
                    const original = indicator.innerHTML;
                    indicator.innerHTML = '✅ No updates available';
                    indicator.classList.add('show');
                    setTimeout(() => {
                        indicator.innerHTML = original;
                        indicator.classList.remove('show');
                    }, 3000);
                }
            }
        } catch (error) {
            console.error('❌ Manual check failed:', error);
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
    if (urlRouter) {
        console.log('⚠️ URL Router already initialized');
        return urlRouter;
    }

    urlRouter = new URLRouter();
    
    // Initialize immediately for faster routing
    setTimeout(() => {
        urlRouter.init();
    }, 100);

    // Enhance switchPage function
    const originalSwitchPage = window.switchPage;
    if (typeof originalSwitchPage === 'function') {
        window.switchPage = function(page) {
            console.log(`🔀 Enhanced switchPage called for: ${page}`);
            
            const result = originalSwitchPage.call(this, page);
            
            if (urlRouter) {
                urlRouter.updateURL(page, true);
            }
            
            return result;
        };
        
        console.log('✅ switchPage function enhanced with URL routing');
    }

    return urlRouter;
}

// Initialize Auto-reload
function initGitHubAutoReload(options = {}) {
    if (githubAutoReloadSystem) {
        console.log('⚠️ GitHub auto-reload already initialized');
        return githubAutoReloadSystem;
    }

    githubAutoReloadSystem = new GitHubAutoReload(options);
    
    // Start after page is fully loaded
    setTimeout(async () => {
        await githubAutoReloadSystem.init();
    }, 3000);

    return githubAutoReloadSystem;
}

// Handle page restoration after reload
function handlePageRestoration() {
    const savedPage = sessionStorage.getItem('pageBeforeReload');
    const reloadTimestamp = sessionStorage.getItem('reloadTimestamp');
    
    if (savedPage && reloadTimestamp) {
        const timeDiff = Date.now() - parseInt(reloadTimestamp);
        
        // Only restore if reload was recent (within 10 seconds)
        if (timeDiff < 10000) {
            console.log(`🔄 Restoring page after auto-reload: ${savedPage}`);
            
            setTimeout(() => {
                if (typeof switchPage === 'function') {
                    switchPage(savedPage);
                }
            }, 1000);
        }
        
        // Clean up
        sessionStorage.removeItem('pageBeforeReload');
        sessionStorage.removeItem('reloadTimestamp');
    }
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
    } else {
        console.warn('⚠️ Auto-reload not initialized');
    }
}

function debugURLRouter() {
    if (urlRouter) {
        urlRouter.debug();
    } else {
        console.warn('⚠️ URL Router not initialized');
    }
}

function getSystemStatus() {
    const status = {
        urlRouter: {
            initialized: !!urlRouter,
            baseURL: urlRouter?.baseURL,
            currentPage: urlRouter?.getPageFromURL()
        },
        autoReload: {
            initialized: !!githubAutoReloadSystem,
            status: githubAutoReloadSystem?.getStatus()
        }
    };
    
    console.table(status);
    return status;
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

// Initialize page restoration on load
document.addEventListener('DOMContentLoaded', () => {
    handlePageRestoration();
});

console.log('✅ Fixed URL and Auto-reload systems loaded');
