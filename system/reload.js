// GitHub Auto-reload system - Simplified and fixed

class GitHubAutoReload {
    constructor(options = {}) {
        this.githubUser = options.githubUser || 'MAvpacheater';
        this.githubRepo = options.githubRepo || 'tester_site_Secret';
        this.branch = options.branch || 'main';
        this.checkInterval = options.checkInterval || 30000;
        this.lastCommitSha = null;
        this.isActive = false;
        this.intervalId = null;
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
            console.error('❌ Failed to initialize GitHub auto-reload:', error);
            return false;
        }
    }

    async getCurrentCommitSha() {
        try {
            const apiUrl = `https://api.github.com/repos/${this.githubUser}/${this.githubRepo}/commits/${this.branch}`;
            
            const response = await fetch(apiUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Auto-Reload-System'
                }
            });

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const commitData = await response.json();
            const newSha = commitData.sha;
            
            console.log(`📝 Latest commit: ${newSha.substring(0, 8)}...`);

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
            console.error('❌ Error fetching commit data:', error.message);
            throw error;
        }
    }

    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        
        this.intervalId = setInterval(async () => {
            try {
                const hasChanges = await this.getCurrentCommitSha();
                if (hasChanges) {
                    this.reloadPage();
                }
            } catch (error) {
                console.warn('⚠️ Auto-reload check failed:', error.message);
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
        console.log('🔄 Changes detected, reloading...');
        
        this.stop();
        this.showReloadNotification();
        
        setTimeout(() => {
            window.location.reload(true);
        }, 2000);
    }

    showReloadNotification() {
        const notification = document.createElement('div');
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
                z-index: 20000;
                text-align: center;
                max-width: 400px;
                font-family: 'Segoe UI', sans-serif;
            ">
                <div style="font-size: 3em; margin-bottom: 15px;">🚀</div>
                <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">Code Updated!</div>
                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 20px;">
                    Reloading in <span id="countdown">2</span> seconds...
                </div>
                <div style="font-size: 12px; opacity: 0.7;">
                    Your settings will be preserved
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Countdown
        let seconds = 2;
        const countdownEl = document.getElementById('countdown');
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
            setTimeout(() => indicator.classList.remove('show'), 5000);
        }
    }

    async checkNow() {
        try {
            const hasChanges = await this.getCurrentCommitSha();
            if (hasChanges) {
                this.reloadPage();
            } else {
                console.log('✅ No changes detected');
            }
        } catch (error) {
            console.error('❌ Manual check failed:', error);
        }
    }
}

// Global instance
let githubAutoReloadSystem = null;

// Initialize function
function initGitHubAutoReload(options = {}) {
    if (githubAutoReloadSystem) {
        console.log('⚠️ GitHub auto-reload already initialized');
        return githubAutoReloadSystem;
    }

    githubAutoReloadSystem = new GitHubAutoReload(options);
    
    setTimeout(async () => {
        await githubAutoReloadSystem.init();
    }, 3000);

    return githubAutoReloadSystem;
}

// Control functions
function stopGitHubAutoReload() {
    if (githubAutoReloadSystem) githubAutoReloadSystem.stop();
}

function startGitHubAutoReload() {
    if (githubAutoReloadSystem) {
        githubAutoReloadSystem.start();
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

// Global exports
window.initGitHubAutoReload = initGitHubAutoReload;
window.stopGitHubAutoReload = stopGitHubAutoReload;
window.startGitHubAutoReload = startGitHubAutoReload;
window.checkGitHubNow = checkGitHubNow;

console.log('📁 GitHub Auto-reload system loaded');
