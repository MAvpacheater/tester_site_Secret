// ========== GITHUB AUTO-RELOAD CLASS ==========
class GitHubAutoReload {
    constructor(options = {}) {
        this.githubUser = options.githubUser || 'MAvpacheater';
        this.githubRepo = options.githubRepo || 'tester_site_Secret';
        this.branch = options.branch || 'main';
        this.checkInterval = options.checkInterval || 60000;
        this.lastCommitSha = null;
        this.isActive = false;
        this.intervalId = null;
        this.failureCount = 0;
        this.maxFailures = 3;
        this.isReloading = false;
        this.rateLimitResetTime = null;
    }

    async init() {
        try {
            console.log('🔄 Initializing GitHub Auto-Reload...');
            console.log(`📊 Repository: ${this.githubUser}/${this.githubRepo}`);
            console.log(`⏱️ Check interval: ${this.checkInterval / 1000}s`);
            
            await this.getCurrentCommitSha();
            this.start();
            // Видалено виклик showIndicator()
            console.log('✅ Auto-reload initialized');
            return true;
        } catch (error) {
            console.warn('⚠️ Auto-reload init failed:', error.message);
            this.handleInitError(error);
            return false;
        }
    }

    async getCurrentCommitSha() {
        try {
            if (this.rateLimitResetTime && Date.now() < this.rateLimitResetTime) {
                const waitMinutes = Math.ceil((this.rateLimitResetTime - Date.now()) / 60000);
                throw new Error(`Rate limited. Wait ${waitMinutes} more minutes`);
            }

            const apiUrl = `https://api.github.com/repos/${this.githubUser}/${this.githubRepo}/commits/${this.branch}`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const headers = {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Arm-Helper-Auto-Reload'
            };
            
            const token = localStorage.getItem('githubToken');
            if (token) {
                headers['Authorization'] = `token ${token}`;
            }
            
            const response = await fetch(apiUrl, {
                headers: headers,
                signal: controller.signal,
                cache: 'no-cache'
            });

            clearTimeout(timeoutId);

            if (response.status === 403) {
                const remaining = response.headers.get('X-RateLimit-Remaining');
                const resetTime = response.headers.get('X-RateLimit-Reset');
                
                if (resetTime) {
                    this.rateLimitResetTime = parseInt(resetTime) * 1000;
                    const resetDate = new Date(this.rateLimitResetTime);
                    throw new Error(`Rate limit exceeded (${remaining} remaining). Resets at ${resetDate.toLocaleTimeString()}`);
                }
                
                throw new Error('GitHub API rate limit exceeded.');
            }

            if (response.status === 404) {
                throw new Error(`Repository ${this.githubUser}/${this.githubRepo} not found`);
            }

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }

            const commitData = await response.json();
            const newSha = commitData.sha;
            
            this.failureCount = 0;
            this.rateLimitResetTime = null;

            if (this.lastCommitSha === null) {
                console.log('📝 Initial commit:', newSha.substring(0, 8));
                this.lastCommitSha = newSha;
                return false;
            }

            if (this.lastCommitSha !== newSha) {
                console.log('🆕 New commit detected!');
                console.log('  Old:', this.lastCommitSha.substring(0, 8));
                console.log('  New:', newSha.substring(0, 8));
                this.lastCommitSha = newSha;
                return true;
            }

            console.log('✅ Up to date:', newSha.substring(0, 8));
            return false;

        } catch (error) {
            this.failureCount++;
            console.warn(`⚠️ Check failed (${this.failureCount}/${this.maxFailures}):`, error.message);
            
            if (this.failureCount >= this.maxFailures) {
                console.error('❌ Too many failures, stopping auto-reload');
                this.stop();
                this.hideIndicator();
            }
            
            throw error;
        }
    }

    start() {
        if (this.isActive || this.isReloading) return;
        
        console.log('▶️ Starting auto-reload checks');
        this.isActive = true;
        
        this.intervalId = setInterval(async () => {
            if (this.isReloading) return;
            
            try {
                const hasChanges = await this.getCurrentCommitSha();
                if (hasChanges && !this.isReloading) {
                    this.reloadPage();
                }
            } catch (error) {
                // Error already logged
            }
        }, this.checkInterval);
    }

    stop() {
        if (!this.isActive) return;
        
        console.log('⏹️ Stopping auto-reload');
        this.isActive = false;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    reloadPage() {
        if (this.isReloading) return;
        
        console.log('🔄 Reloading page...');
        this.isReloading = true;
        this.stop();
        this.showReloadNotification();
        
        const currentPage = typeof getCurrentPage === 'function' ? getCurrentPage() : 'calculator';
        sessionStorage.setItem('pageBeforeReload', currentPage);
        sessionStorage.setItem('reloadTimestamp', Date.now().toString());
        
        setTimeout(() => {
            window.location.reload(true);
        }, 2000);
    }

    showReloadNotification() {
        const existing = document.querySelector('.reload-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'reload-notification';
        notification.innerHTML = `
            <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
                background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:30px 40px;
                border-radius:15px;box-shadow:0 20px 40px rgba(0,0,0,.3);z-index:30000;
                text-align:center;max-width:400px;animation:slideIn .3s ease-out">
                <div style="font-size:3em;margin-bottom:15px">🚀</div>
                <div style="font-size:20px;font-weight:bold;margin-bottom:10px">Code Updated!</div>
                <div style="font-size:14px;opacity:.9;margin-bottom:20px">
                    Reloading in <span id="reloadCountdown">2</span> seconds...
                </div>
                <div style="font-size:12px;opacity:.7">Your current page will be restored</div>
            </div>
            <style>
                @keyframes slideIn{
                    from{transform:translate(-50%,-50%) scale(.8);opacity:0}
                    to{transform:translate(-50%,-50%) scale(1);opacity:1}
                }
            </style>
        `;
        
        document.body.appendChild(notification);
        
        let seconds = 2;
        const countdownEl = document.getElementById('reloadCountdown');
        const countdownInterval = setInterval(() => {
            seconds--;
            if (countdownEl) countdownEl.textContent = seconds;
            if (seconds <= 0) clearInterval(countdownInterval);
        }, 1000);
    }

    showIndicator() {
        // Метод залишено порожнім - індикатор не буде показуватися
    }

    hideIndicator() {
        const indicator = document.getElementById('autoReloadIndicator');
        if (indicator) {
            indicator.classList.remove('show');
            indicator.onclick = null;
        }
    }

    handleInitError(error) {
        if (error.message.includes('Rate limit')) {
            console.warn('💡 TIP: Add a GitHub token to avoid rate limits');
        }
    }

    async checkNow() {
        console.log('🔍 Manual update check...');
        
        const indicator = document.getElementById('autoReloadIndicator');
        if (indicator) {
            indicator.innerHTML = '🔄 Checking...';
            indicator.classList.add('show');
        }
        
        try {
            const hasChanges = await this.getCurrentCommitSha();
            
            if (hasChanges) {
                this.reloadPage();
            } else {
                if (indicator) {
                    indicator.innerHTML = '✅ No updates available';
                    setTimeout(() => {
                        indicator.classList.remove('show');
                    }, 3000);
                }
            }
        } catch (error) {
            console.error('❌ Manual check failed:', error.message);
            
            if (indicator) {
                indicator.innerHTML = '❌ Check failed';
                setTimeout(() => {
                    indicator.classList.remove('show');
                }, 3000);
            }
        }
    }

    getStatus() {
        return {
            active: this.isActive,
            repository: `${this.githubUser}/${this.githubRepo}`,
            branch: this.branch,
            lastCommitSha: this.lastCommitSha?.substring(0, 8) || 'unknown',
            checkInterval: `${this.checkInterval / 1000}s`,
            failureCount: this.failureCount,
            rateLimited: this.rateLimitResetTime ? new Date(this.rateLimitResetTime).toLocaleTimeString() : 'no'
        };
    }
}

// ========== GLOBAL VARIABLES ==========
let githubAutoReloadSystem = null;

// ========== INITIALIZATION FUNCTIONS ==========
function initGitHubAutoReload(options = {}) {
    if (githubAutoReloadSystem) {
        console.log('ℹ️ Auto-reload already initialized');
        return githubAutoReloadSystem;
    }
    
    console.log('🔄 Initializing GitHub Auto-Reload...');
    githubAutoReloadSystem = new GitHubAutoReload(options);
    
    setTimeout(async () => {
        await githubAutoReloadSystem.init();
    }, 3000);
    
    return githubAutoReloadSystem;
}

function handlePageRestoration() {
    const savedPage = sessionStorage.getItem('pageBeforeReload');
    const reloadTimestamp = sessionStorage.getItem('reloadTimestamp');
    
    if (savedPage && reloadTimestamp) {
        const timeSinceReload = Date.now() - parseInt(reloadTimestamp);
        
        if (timeSinceReload < 10000) {
            console.log('📍 Restoring page after reload:', savedPage);
            
            setTimeout(() => {
                if (typeof switchPage === 'function') {
                    switchPage(savedPage);
                }
            }, 1000);
        }
    }
    
    sessionStorage.removeItem('pageBeforeReload');
    sessionStorage.removeItem('reloadTimestamp');
}

// ========== GLOBAL EXPORTS ==========
Object.assign(window, {
    GitHubAutoReload,
    githubAutoReloadSystem: () => githubAutoReloadSystem,
    initGitHubAutoReload,
    handlePageRestoration,
    
    stopGitHubAutoReload: () => {
        if (githubAutoReloadSystem) {
            githubAutoReloadSystem.stop();
            githubAutoReloadSystem.hideIndicator();
        }
    },
    
    startGitHubAutoReload: () => {
        if (githubAutoReloadSystem) {
            githubAutoReloadSystem.start();
            // Видалено виклик showIndicator()
        } else {
            initGitHubAutoReload();
        }
    },
    
    checkGitHubNow: () => {
        if (githubAutoReloadSystem) {
            githubAutoReloadSystem.checkNow();
        } else {
            console.warn('⚠️ Auto-reload not initialized');
        }
    }
});

// ========== AUTO-INIT ON DOM READY ==========
document.addEventListener('DOMContentLoaded', handlePageRestoration);

console.log('✅ Reload.js loaded (FIXED URLRouter dependency)');
