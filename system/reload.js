class GitHubAutoReload {
    constructor(options = {}) {
        Object.assign(this, {
            githubUser: options.githubUser || 'MAvpacheater',
            githubRepo: options.githubRepo || 'roblox_info_post',
            branch: options.branch || 'main',
            checkInterval: options.checkInterval || 30000,
            lastCommitSha: null,
            isActive: false,
            intervalId: null,
            failureCount: 0,
            maxFailures: 3,
            isReloading: false
        });
    }

    async init() {
        try {
            await this.getCurrentCommitSha();
            this.start();
            this.showIndicator();
            return true;
        } catch (error) {
            console.warn('GitHub auto-reload init failed:', error.message);
            return false;
        }
    }

    async getCurrentCommitSha() {
        try {
            const apiUrl = `https://api.github.com/repos/${this.githubUser}/${this.githubRepo}/commits/${this.branch}`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            
            const response = await fetch(apiUrl, {
                headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'Arm-Helper-Auto-Reload' },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.status === 403) {
                const resetTime = response.headers.get('X-RateLimit-Reset');
                throw new Error(`Rate limit exceeded. Resets at ${new Date(resetTime * 1000).toLocaleTimeString()}`);
            }
            if (response.status === 404) throw new Error(`Repository ${this.githubUser}/${this.githubRepo} not found`);
            if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

            const commitData = await response.json();
            const newSha = commitData.sha;
            this.failureCount = 0;

            if (this.lastCommitSha === null) {
                this.lastCommitSha = newSha;
                return false;
            }

            if (this.lastCommitSha !== newSha) {
                this.lastCommitSha = newSha;
                return true;
            }

            return false;
        } catch (error) {
            this.failureCount++;
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
                if (hasChanges && !this.isReloading) this.reloadPage();
            } catch (error) {}
        }, this.checkInterval);
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
        this.stop();
        this.showReloadNotification();
        
        const currentPage = urlRouter ? urlRouter.getPageFromURL() : 'calculator';
        sessionStorage.setItem('pageBeforeReload', currentPage);
        sessionStorage.setItem('reloadTimestamp', Date.now().toString());
        
        setTimeout(() => window.location.reload(true), 2000);
    }

    showReloadNotification() {
        const existing = document.querySelector('.reload-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'reload-notification';
        notification.innerHTML = `<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
            background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:30px 40px;border-radius:15px;
            box-shadow:0 20px 40px rgba(0,0,0,.3);z-index:30000;text-align:center;max-width:400px;
            animation:slideIn .3s ease-out">
            <div style="font-size:3em;margin-bottom:15px">🚀</div>
            <div style="font-size:20px;font-weight:bold;margin-bottom:10px">Code Updated!</div>
            <div style="font-size:14px;opacity:.9;margin-bottom:20px">
                Reloading in <span id="reloadCountdown">2</span> seconds...
            </div>
            <div style="font-size:12px;opacity:.7">Your current page will be restored</div>
        </div>
        <style>@keyframes slideIn{from{transform:translate(-50%,-50%) scale(.8);opacity:0}
            to{transform:translate(-50%,-50%) scale(1);opacity:1}}</style>`;
        
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
        const indicator = document.getElementById('autoReloadIndicator');
        if (indicator) {
            indicator.innerHTML = `🔄 Auto-reload active (${this.githubRepo})`;
            indicator.classList.add('show');
            setTimeout(() => indicator.classList.remove('show'), 5000);
        }
    }

    hideIndicator() {
        const indicator = document.getElementById('autoReloadIndicator');
        if (indicator) indicator.classList.remove('show');
    }

    async checkNow() {
        try {
            const hasChanges = await this.getCurrentCommitSha();
            if (hasChanges) {
                this.reloadPage();
            } else {
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
            console.error('Manual check failed:', error);
        }
    }

    getStatus() {
        return {
            active: this.isActive,
            repository: `${this.githubUser}/${this.githubRepo}`,
            branch: this.branch,
            lastCommitSha: this.lastCommitSha?.substring(0, 8),
            checkInterval: this.checkInterval,
            failureCount: this.failureCount
        };
    }
}

let urlRouter = null;
let githubAutoReloadSystem = null;

function initURLRouting() {
    if (urlRouter) return urlRouter;
    urlRouter = new URLRouter();
    setTimeout(() => urlRouter.init(), 100);

    const originalSwitchPage = window.switchPage;
    if (typeof originalSwitchPage === 'function') {
        window.switchPage = function(page) {
            const result = originalSwitchPage.call(this, page);
            if (urlRouter) urlRouter.updateURL(page, true);
            return result;
        };
    }
    return urlRouter;
}

function initGitHubAutoReload(options = {}) {
    if (githubAutoReloadSystem) return githubAutoReloadSystem;
    githubAutoReloadSystem = new GitHubAutoReload(options);
    setTimeout(async () => await githubAutoReloadSystem.init(), 3000);
    return githubAutoReloadSystem;
}

function handlePageRestoration() {
    const savedPage = sessionStorage.getItem('pageBeforeReload');
    const reloadTimestamp = sessionStorage.getItem('reloadTimestamp');
    
    if (savedPage && reloadTimestamp && Date.now() - parseInt(reloadTimestamp) < 10000) {
        setTimeout(() => {
            if (typeof switchPage === 'function') switchPage(savedPage);
        }, 1000);
    }
    
    sessionStorage.removeItem('pageBeforeReload');
    sessionStorage.removeItem('reloadTimestamp');
}

Object.assign(window, {
    initURLRouting,
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
            githubAutoReloadSystem.showIndicator();
        } else initGitHubAutoReload();
    },
    checkGitHubNow: () => githubAutoReloadSystem?.checkNow(),
    debugURLRouter: () => urlRouter?.debug(),
    getSystemStatus: () => ({
        urlRouter: { initialized: !!urlRouter, baseURL: urlRouter?.baseURL, currentPage: urlRouter?.getPageFromURL() },
        autoReload: { initialized: !!githubAutoReloadSystem, status: githubAutoReloadSystem?.getStatus() }
    }),
    urlRouter: () => urlRouter,
    githubAutoReloadSystem: () => githubAutoReloadSystem
});

document.addEventListener('DOMContentLoaded', handlePageRestoration);
