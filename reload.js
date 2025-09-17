// Optimized Auto-reload system for detecting code changes
class AutoReloadSystem {
    constructor() {
        this.checkInterval = 3000; // Reduced interval
        this.files = [
            'general.js', 'general.css', 'general_menu.css',
            'calc/calculator.js', 'calc/grind.js',
            'info/boosts.js', 'info/shiny.js', 'info/secret.js', 'info/codes.js',
            'info/aura.js', 'info/trainer.js', 'info/charms.js', 'info/potions.js', 'info/worlds.js',
            'moderation/settings.js', 'other/updates.js', 'other/peoples.js', 'other/help.js',
            'index/content_loader.js'
        ];
        this.fileHashes = new Map();
        this.isActive = false;
        this.intervalId = null;
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;
        
        try {
            await this.updateFileHashes();
            
            setTimeout(() => {
                this.start();
                this.showIndicator();
            }, 5000);
            
            this.isInitialized = true;
            console.log('✅ Auto-reload system initialized');
        } catch (error) {
            console.error('❌ Failed to initialize auto-reload:', error);
        }
    }

    start() {
        if (this.isActive || !this.shouldEnableAutoReload()) return;
        
        this.isActive = true;
        this.intervalId = setInterval(() => this.checkForChanges(), this.checkInterval);
        console.log(`🚀 Auto-reload monitoring started (${this.checkInterval}ms)`);
    }

    stop() {
        if (!this.isActive) return;
        
        this.isActive = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    async updateFileHashes() {
        const results = await Promise.allSettled(
            this.files.map(async (file) => {
                try {
                    const hash = await this.getFileHash(file);
                    this.fileHashes.set(file, hash);
                    return { file, success: true };
                } catch (error) {
                    this.fileHashes.set(file, null);
                    return { file, success: false };
                }
            })
        );

        const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
        console.log(`📊 File hashes updated: ${successful}/${this.files.length} files`);
    }

    async getFileHash(file) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        try {
            const response = await fetch(file + '?t=' + Date.now(), {
                signal: controller.signal,
                cache: 'no-cache'
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const content = await response.text();
            return this.simpleHash(content);
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }

    async checkForChanges() {
        if (!this.isActive) return;

        try {
            let changedFiles = [];

            const checkPromises = this.files.map(async (file) => {
                try {
                    const currentHash = await this.getFileHash(file);
                    const oldHash = this.fileHashes.get(file);

                    if (oldHash !== null && oldHash !== currentHash) {
                        changedFiles.push(file);
                        this.fileHashes.set(file, currentHash);
                    }
                } catch (error) {
                    // Ignore errors during checking
                }
            });

            await Promise.allSettled(checkPromises);

            if (changedFiles.length > 0) {
                console.log(`🔄 Changes detected:`, changedFiles);
                this.reloadPage(changedFiles);
            }
        } catch (error) {
            console.error('❌ Error during change check:', error);
        }
    }

    reloadPage(changedFiles) {
        this.stop();
        this.saveCurrentState();
        this.showReloadNotification(changedFiles);
        
        setTimeout(() => window.location.reload(), 1000);
    }

    saveCurrentState() {
        try {
            let currentPage = 'calculator';
            let currentLanguage = 'en';
            
            if (typeof window.getCurrentPage === 'function') {
                currentPage = window.getCurrentPage();
            }
            
            if (typeof window.getCurrentAppLanguage === 'function') {
                currentLanguage = window.getCurrentAppLanguage();
            }
            
            try {
                sessionStorage.setItem('armHelper_preReload_page', currentPage);
                sessionStorage.setItem('armHelper_preReload_language', currentLanguage);
                sessionStorage.setItem('armHelper_preReload_timestamp', Date.now().toString());
            } catch (e) {
                console.warn('⚠️ Could not save to sessionStorage');
            }
        } catch (error) {
            console.error('❌ Error saving state:', error);
        }
    }

    showReloadNotification(changedFiles) {
        const existing = document.querySelector('.auto-reload-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'auto-reload-notification';
        notification.innerHTML = `
            <div style="
                position: fixed; top: 20px; right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; padding: 15px 20px; border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4); z-index: 10001;
                font-family: 'Segoe UI', sans-serif; font-size: 14px; max-width: 300px;
                backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.2);
                transform: translateX(100%); transition: transform 0.4s ease;
            ">
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <div style="font-size: 20px;">🔄</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; margin-bottom: 6px;">Code Updated!</div>
                        <div style="font-size: 12px; opacity: 0.9; margin-bottom: 8px;">
                            ${changedFiles.length} file(s) changed
                        </div>
                        <div style="font-size: 11px; opacity: 0.7;">
                            Reloading in 1 second...
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        const notificationEl = notification.firstElementChild;
        requestAnimationFrame(() => {
            notificationEl.style.transform = 'translateX(0)';
        });
        
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 5000);
    }

    showIndicator() {
        const indicator = document.getElementById('autoReloadIndicator');
        if (indicator && this.shouldEnableAutoReload()) {
            indicator.classList.add('show');
            
            setTimeout(() => indicator.classList.remove('show'), 3000);
        }
    }

    shouldEnableAutoReload() {
        return window.location.hostname === 'localhost' ||
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('192.168.') ||
               window.location.hostname.includes('10.') ||
               window.location.protocol === 'file:' ||
               window.location.search.includes('debug=true') ||
               window.location.search.includes('dev=true');
    }

    getStatus() {
        return {
            isInitialized: this.isInitialized,
            isActive: this.isActive,
            checkInterval: this.checkInterval,
            filesCount: this.files.length,
            isDevelopmentMode: this.shouldEnableAutoReload()
        };
    }
}

// Global instance
let autoReloadSystem = null;

function initAutoReload() {
    if (!shouldEnableAutoReload()) {
        console.log('🚫 Auto-reload disabled (production mode)');
        return;
    }

    if (autoReloadSystem) return;

    autoReloadSystem = new AutoReloadSystem();
    
    setTimeout(async () => {
        try {
            await autoReloadSystem.init();
        } catch (error) {
            console.error('❌ Failed to initialize auto-reload:', error);
            autoReloadSystem = null;
        }
    }, 2000);
}

function shouldEnableAutoReload() {
    return window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname.includes('192.168.') ||
           window.location.hostname.includes('10.') ||
           window.location.protocol === 'file:' ||
           window.location.search.includes('debug=true') ||
           window.location.search.includes('dev=true');
}

function restoreStateAfterReload() {
    try {
        const savedPage = sessionStorage.getItem('armHelper_preReload_page');
        const savedLanguage = sessionStorage.getItem('armHelper_preReload_language');
        const timestamp = sessionStorage.getItem('armHelper_preReload_timestamp');
        
        // Only restore if reload was recent (within 10 seconds)
        const isRecentReload = timestamp && (Date.now() - parseInt(timestamp)) < 10000;
        
        if ((savedPage || savedLanguage) && isRecentReload) {
            console.log('🔄 Restoring state after reload:', { savedPage, savedLanguage });
            
            const restoreState = () => {
                if (savedLanguage && typeof window.switchAppLanguage === 'function') {
                    window.switchAppLanguage(savedLanguage);
                }
                
                if (savedPage && typeof window.switchPage === 'function') {
                    setTimeout(() => window.switchPage(savedPage), 100);
                }
                
                // Clean up
                sessionStorage.removeItem('armHelper_preReload_page');
                sessionStorage.removeItem('armHelper_preReload_language');
                sessionStorage.removeItem('armHelper_preReload_timestamp');
            };
            
            // Try multiple times to ensure state is restored
            setTimeout(restoreState, 500);
            setTimeout(restoreState, 1000);
            setTimeout(restoreState, 2000);
        }
    } catch (error) {
        console.warn('⚠️ Could not restore state after reload:', error);
    }
}

// Export functions globally
Object.assign(window, {
    initAutoReload,
    stopAutoReload: () => autoReloadSystem?.stop(),
    startAutoReload: () => autoReloadSystem?.start() || initAutoReload(),
    getAutoReloadStatus: () => autoReloadSystem?.getStatus() || { initialized: false, available: shouldEnableAutoReload() },
    restoreStateAfterReload
});

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        restoreStateAfterReload();
        setTimeout(initAutoReload, 1000);
    });
} else {
    restoreStateAfterReload();
    setTimeout(initAutoReload, 1000);
}
