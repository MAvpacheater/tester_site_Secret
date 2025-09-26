// reload.js - GitHub Auto-reload system for detecting code changes

class GitHubAutoReloadSystem {
    constructor(options = {}) {
        // Налаштування GitHub репозиторію
        this.githubUser = options.githubUser || 'YOUR_GITHUB_USERNAME'; // Замініть на ваш username
        this.githubRepo = options.githubRepo || 'YOUR_REPOSITORY_NAME'; // Замініть на назву репозиторію
        this.branch = options.branch || 'main'; // або 'master'
        
        this.checkInterval = options.checkInterval || 30000; // Перевірка кожні 30 секунд (GitHub API має ліміти)
        this.lastCommitSha = null;
        this.isActive = false;
        this.intervalId = null;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        // Файли для моніторингу (опціонально - для додаткової перевірки)
        this.monitoredFiles = [
            'general.js',
            'general.css',
            'index.html',
            'calc/calculator.js',
            'info/worlds.js',
            // Додайте інші важливі файли
        ];
    }

    // Ініціалізація системи
    async init() {
        console.log('🔄 Initializing GitHub auto-reload system...');
        
        if (!this.githubUser || !this.githubRepo || 
            this.githubUser === 'YOUR_GITHUB_USERNAME' || 
            this.githubRepo === 'YOUR_REPOSITORY_NAME') {
            console.error('❌ GitHub credentials not configured! Please set your username and repository name.');
            return false;
        }
        
        try {
            // Отримати поточний commit SHA
            await this.getCurrentCommitSha();
            
            // Запустити моніторинг
            this.start();
            
            // Показати індикатор
            this.showIndicator();
            
            console.log('✅ GitHub auto-reload system activated');
            console.log(`📊 Monitoring: ${this.githubUser}/${this.githubRepo} (${this.branch})`);
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize GitHub auto-reload:', error);
            return false;
        }
    }

    // Отримати SHA останнього коміту
    async getCurrentCommitSha() {
        try {
            const apiUrl = `https://api.github.com/repos/${this.githubUser}/${this.githubRepo}/commits/${this.branch}`;
            console.log(`🔍 Fetching latest commit from: ${apiUrl}`);
            
            const response = await fetch(apiUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Auto-Reload-System'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`Repository ${this.githubUser}/${this.githubRepo} not found or branch ${this.branch} doesn't exist`);
                }
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }

            const commitData = await response.json();
            const newSha = commitData.sha;
            
            console.log(`📝 Latest commit SHA: ${newSha.substring(0, 8)}...`);
            console.log(`💬 Commit message: "${commitData.commit.message}"`);
            console.log(`👤 Author: ${commitData.commit.author.name}`);
            console.log(`⏰ Date: ${new Date(commitData.commit.author.date).toLocaleString()}`);

            // Якщо це перший запуск, просто зберегти SHA
            if (this.lastCommitSha === null) {
                this.lastCommitSha = newSha;
                console.log('🎯 Initial commit SHA recorded');
                return false; // Нема змін на першому запуску
            }

            // Перевірити, чи є зміни
            if (this.lastCommitSha !== newSha) {
                console.log(`🔄 New commit detected!`);
                console.log(`   Old: ${this.lastCommitSha.substring(0, 8)}...`);
                console.log(`   New: ${newSha.substring(0, 8)}...`);
                
                this.lastCommitSha = newSha;
                return true; // Є зміни
            }

            return false; // Немає змін
        } catch (error) {
            console.error('❌ Error fetching commit data:', error.message);
            
            // Increment retry count
            this.retryCount++;
            if (this.retryCount >= this.maxRetries) {
                console.error('❌ Max retries reached, stopping auto-reload');
                this.stop();
            }
            
            throw error;
        }
    }

    // Запустити моніторинг
    start() {
        if (this.isActive) {
            console.log('⚠️ Auto-reload already active');
            return;
        }
        
        this.isActive = true;
        this.retryCount = 0;
        
        this.intervalId = setInterval(async () => {
            try {
                const hasChanges = await this.getCurrentCommitSha();
                if (hasChanges) {
                    this.reloadPage();
                } else {
                    // Reset retry count on successful check
                    this.retryCount = 0;
                }
            } catch (error) {
                console.warn('⚠️ Error during auto-reload check:', error.message);
            }
        }, this.checkInterval);
        
        console.log(`🚀 GitHub monitoring started (checking every ${this.checkInterval/1000}s)`);
    }

    // Зупинити моніторинг
    stop() {
        if (!this.isActive) return;
        
        this.isActive = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        console.log('⏸️ GitHub monitoring stopped');
    }

    // Перезавантажити сторінку
    reloadPage() {
        console.log('🔄 GitHub changes detected, reloading page...');
        
        // Зупинити моніторинг
        this.stop();
        
        // Зберегти поточний стан
        this.saveCurrentState();
        
        // Показати повідомлення
        this.showReloadNotification();
        
        // Перезавантажити з невеликою затримкою
        setTimeout(() => {
            window.location.reload(true); // Force reload from server
        }, 2000);
    }

    // Зберегти поточний стан
    saveCurrentState() {
        try {
            // Стан вже зберігається через існуючі функції
            if (typeof saveCurrentPage === 'function' && typeof getCurrentPage === 'function') {
                const currentPage = getCurrentPage();
                console.log(`💾 Current page preserved: ${currentPage}`);
            }
            
            if (typeof getCurrentAppLanguage === 'function') {
                const currentLang = getCurrentAppLanguage();
                console.log(`🌍 Current language preserved: ${currentLang}`);
            }
        } catch (error) {
            console.error('❌ Error saving state:', error);
        }
    }

    // Показати повідомлення про оновлення
    showReloadNotification() {
        // Створити стильне повідомлення
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
                font-family: 'Segoe UI', sans-serif;
                text-align: center;
                max-width: 400px;
                backdrop-filter: blur(20px);
                border: 2px solid rgba(255, 255, 255, 0.2);
                animation: slideIn 0.5s ease-out;
            ">
                <div style="font-size: 3em; margin-bottom: 15px;">🚀</div>
                <div style="font-size: 20px; font-weight: bold; margin-bottom: 10px;">Code Updated!</div>
                <div style="font-size: 14px; opacity: 0.9; margin-bottom: 20px;">
                    New changes detected in GitHub repository<br>
                    <strong>${this.githubUser}/${this.githubRepo}</strong>
                </div>
                <div style="
                    background: rgba(255, 255, 255, 0.2);
                    padding: 15px;
                    border-radius: 8px;
                    font-size: 13px;
                    margin-bottom: 20px;
                ">
                    ⏳ Reloading in <span id="countdown">2</span> seconds...
                </div>
                <div style="font-size: 12px; opacity: 0.7;">
                    Your current page and settings will be preserved
                </div>
            </div>
            
            <style>
                @keyframes slideIn {
                    from {
                        transform: translate(-50%, -50%) scale(0.8);
                        opacity: 0;
                    }
                    to {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                }
            </style>
        `;
        
        document.body.appendChild(notification);
        
        // Додати overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 19999;
        `;
        document.body.appendChild(overlay);
        
        // Countdown
        let seconds = 2;
        const countdownEl = document.getElementById('countdown');
        const countdownInterval = setInterval(() => {
            seconds--;
            if (countdownEl) {
                countdownEl.textContent = seconds;
            }
            if (seconds <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }

    // Показати індикатор активності
    showIndicator() {
        const indicator = document.getElementById('autoReloadIndicator');
        if (indicator) {
            indicator.innerHTML = `🔄 GitHub Auto-reload active`;
            indicator.classList.add('show');
            
            // Приховати через 5 секунд
            setTimeout(() => {
                indicator.classList.remove('show');
            }, 5000);
        }
    }

    // Налаштування
    setCheckInterval(ms) {
        if (ms < 10000) {
            console.warn('⚠️ Minimum check interval is 10 seconds (GitHub API limits)');
            ms = 10000;
        }
        
        this.checkInterval = ms;
        if (this.isActive) {
            this.stop();
            this.start();
        }
        console.log(`⚙️ Check interval updated to ${ms/1000}s`);
    }

    // Змінити репозиторій
    setRepository(user, repo, branch = 'main') {
        this.githubUser = user;
        this.githubRepo = repo;
        this.branch = branch;
        this.lastCommitSha = null; // Reset
        
        console.log(`🔄 Repository updated to ${user}/${repo} (${branch})`);
        
        if (this.isActive) {
            this.stop();
            setTimeout(() => this.init(), 1000);
        }
    }

    // Отримати статус
    getStatus() {
        return {
            isActive: this.isActive,
            repository: `${this.githubUser}/${this.githubRepo}`,
            branch: this.branch,
            checkInterval: this.checkInterval,
            lastCommitSha: this.lastCommitSha?.substring(0, 8) + '...',
            retryCount: this.retryCount,
            maxRetries: this.maxRetries
        };
    }

    // Ручна перевірка на оновлення
    async checkNow() {
        console.log('🔍 Manual check triggered...');
        try {
            const hasChanges = await this.getCurrentCommitSha();
            if (hasChanges) {
                this.reloadPage();
            } else {
                console.log('✅ No changes detected');
                
                // Показати повідомлення
                const notification = document.createElement('div');
                notification.innerHTML = `
                    <div style="
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: linear-gradient(135deg, #4CAF50, #45a049);
                        color: white;
                        padding: 15px 20px;
                        border-radius: 10px;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                        z-index: 10000;
                        font-family: 'Segoe UI', sans-serif;
                        font-size: 14px;
                    ">
                        ✅ No updates available
                    </div>
                `;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.remove();
                }, 3000);
            }
        } catch (error) {
            console.error('❌ Manual check failed:', error);
        }
    }
}

// Глобальний екземпляр системи
let githubAutoReloadSystem = null;

// Ініціалізація GitHub системи автоперезавантаження
function initGitHubAutoReload(options = {}) {
    if (githubAutoReloadSystem) {
        console.log('⚠️ GitHub auto-reload system already initialized');
        return githubAutoReloadSystem;
    }

    // ⚠️ ВАЖЛИВО: Налаштуйте ваші дані GitHub тут!
    const defaultOptions = {
        githubUser: 'MAvpacheater',    // 👈 Замініть на ваш GitHub username
        githubRepo: 'tester_site_Secret',    // 👈 Замініть на назву вашого репозиторію
        branch: 'main',                        // 👈 Або 'master', якщо ваша основна гілка називається master
        checkInterval: 30000                   // 30 секунд (не робіть менше через ліміти GitHub API)
    };

    const config = { ...defaultOptions, ...options };
    githubAutoReloadSystem = new GitHubAutoReloadSystem(config);
    
    // Ініціалізувати з затримкою
    setTimeout(async () => {
        try {
            await githubAutoReloadSystem.init();
        } catch (error) {
            console.error('❌ Failed to initialize GitHub auto-reload system:', error);
        }
    }, 3000);

    return githubAutoReloadSystem;
}

// Функції керування
function stopGitHubAutoReload() {
    if (githubAutoReloadSystem) {
        githubAutoReloadSystem.stop();
        console.log('🛑 GitHub auto-reload system stopped');
    }
}

function startGitHubAutoReload() {
    if (githubAutoReloadSystem) {
        githubAutoReloadSystem.start();
        console.log('▶️ GitHub auto-reload system started');
    } else {
        initGitHubAutoReload();
    }
}

function getGitHubAutoReloadStatus() {
    if (!githubAutoReloadSystem) {
        return { initialized: false };
    }
    
    return {
        initialized: true,
        ...githubAutoReloadSystem.getStatus()
    };
}

function checkGitHubNow() {
    if (githubAutoReloadSystem) {
        githubAutoReloadSystem.checkNow();
    } else {
        console.warn('⚠️ GitHub auto-reload system not initialized');
    }
}

function setGitHubRepository(user, repo, branch = 'main') {
    if (githubAutoReloadSystem) {
        githubAutoReloadSystem.setRepository(user, repo, branch);
    } else {
        console.warn('⚠️ GitHub auto-reload system not initialized');
    }
}

function setGitHubCheckInterval(ms) {
    if (githubAutoReloadSystem) {
        githubAutoReloadSystem.setCheckInterval(ms);
    } else {
        console.warn('⚠️ GitHub auto-reload system not initialized');
    }
}

// Експорт для глобального доступу
if (typeof window !== 'undefined') {
    window.initGitHubAutoReload = initGitHubAutoReload;
    window.stopGitHubAutoReload = stopGitHubAutoReload;
    window.startGitHubAutoReload = startGitHubAutoReload;
    window.getGitHubAutoReloadStatus = getGitHubAutoReloadStatus;
    window.checkGitHubNow = checkGitHubNow;
    window.setGitHubRepository = setGitHubRepository;
    window.setGitHubCheckInterval = setGitHubCheckInterval;
    window.githubAutoReloadSystem = githubAutoReloadSystem;
}

// Автоініціалізація
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initGitHubAutoReload, 2000);
    });
} else {
    setTimeout(initGitHubAutoReload, 2000);
}

console.log('📁 GitHub Auto-reload system loaded and ready');

// Додаткова функція для налаштування в консолі розробника
console.log(`
🔧 GitHub Auto-Reload Setup Instructions:

1. Open browser console (F12)
2. Run: setGitHubRepository('YOUR_USERNAME', 'YOUR_REPO', 'main')
3. Example: setGitHubRepository('john123', 'my-website', 'main')

Commands available:
- getGitHubAutoReloadStatus() - check status
- checkGitHubNow() - manual check
- stopGitHubAutoReload() - stop monitoring
- startGitHubAutoReload() - start monitoring
`);
