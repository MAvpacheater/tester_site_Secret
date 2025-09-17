// Fixed reload.js - Auto-reload system for detecting code changes

class AutoReloadSystem {
    constructor() {
        this.checkInterval = 5000; // Check every 5 seconds (increased for stability)
        this.files = [
            'general.js',
            'general.css',
            'general_menu.css',
            'calc/calculator.js',
            'calc/arm.js',
            'calc/grind.js',
            'info/boosts.js',
            'info/shiny.js',
            'info/secret.js',
            'info/codes.js',
            'info/aura.js',
            'info/trainer.js',
            'info/charms.js',
            'info/potions.js',
            'info/worlds.js',
            'moderation/settings.js',
            'other/updates.js',
            'other/peoples.js',
            'other/help.js',
            'index/content_loader.js'
        ];
        this.fileHashes = new Map();
        this.isActive = false;
        this.intervalId = null;
        this.initializationDelay = 10000; // 10 seconds delay before starting
        this.isInitialized = false;
    }

    // Initial initialization
    async init() {
        if (this.isInitialized) {
            console.log('⚠️ Auto-reload system already initialized');
            return;
        }

        console.log('🔄 Initializing auto-reload system...');
        
        try {
            // Store initial file hashes
            await this.updateFileHashes();
            
            // Start monitoring with delay
            setTimeout(() => {
                this.start();
                this.showIndicator();
            }, this.initializationDelay);
            
            this.isInitialized = true;
            console.log(`✅ Auto-reload system initialized (will start monitoring in ${this.initializationDelay/1000}s)`);
        } catch (error) {
            console.error('❌ Failed to initialize auto-reload system:', error);
        }
    }

    // Start monitoring system
    start() {
        if (this.isActive) return;
        
        // Only start in development mode
        if (!this.shouldEnableAutoReload()) {
            console.log('🚫 Auto-reload disabled (not in development mode)');
            return;
        }
        
        this.isActive = true;
        this.intervalId = setInterval(() => {
            this.checkForChanges();
        }, this.checkInterval);
        
        console.log(`🚀 Auto-reload monitoring started (checking every ${this.checkInterval/1000}s)`);
    }

    // Stop monitoring system
    stop() {
        if (!this.isActive) return;
        
        this.isActive = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        console.log('⏸️ Auto-reload monitoring stopped');
    }

    // Update file hashes
    async updateFileHashes() {
        const results = await Promise.allSettled(
            this.files.map(async (file) => {
                try {
                    const hash = await this.getFileHash(file);
                    this.fileHashes.set(file, hash);
                    return { file, success: true };
                } catch (error) {
                    console.warn(`⚠️ Could not get hash for ${file}: ${error.message}`);
                    this.fileHashes.set(file, null);
                    return { file, success: false };
                }
            })
        );

        const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
        console.log(`📊 File hashes updated: ${successful}/${this.files.length} files`);
    }

    // Get file hash
    async getFileHash(file) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        try {
            const response = await fetch(file + '?t=' + Date.now(), {
                signal: controller.signal,
                cache: 'no-cache'
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const content = await response.text();
            return this.simpleHash(content);
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw new Error(`Failed to fetch ${file}: ${error.message}`);
        }
    }

    // Simple hash for text
    simpleHash(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }

    // Check for changes
    async checkForChanges() {
        if (!this.isActive) return;

        try {
            let changedFiles = [];
            let errors = 0;

            // Check files in parallel with limit
            const checkPromises = this.files.map(async (file) => {
                try {
                    const currentHash = await this.getFileHash(file);
                    const oldHash = this.fileHashes.get(file);

                    // Only compare if we have a valid old hash
                    if (oldHash !== null && oldHash !== currentHash) {
                        changedFiles.push(file);
                        console.log(`🔄 File changed detected: ${file}`);
                    }
                } catch (error) {
                    errors++;
                    // Don't log every error to avoid spam
                    if (errors <= 3) {
                        console.warn(`⚠️ Error checking ${file}:`, error.message);
                    }
                }
            });

            await Promise.allSettled(checkPromises);

            if (changedFiles.length > 0) {
                console.log(`🔄 Changes detected in ${changedFiles.length} file(s):`, changedFiles);
                this.reloadPage(changedFiles);
            }

            // If too many errors, reduce check frequency
            if (errors > this.files.length / 2) {
                console.warn('⚠️ Too many file check errors, reducing check frequency');
                this.setCheckInterval(this.checkInterval * 2);
            }

        } catch (error) {
            console.error('❌ Error during change check:', error);
        }
    }

    // Reload page with state preservation
    reloadPage(changedFiles) {
        console.log('🔄 Code changes detected, reloading page...', changedFiles);
        
        // Stop monitoring before reload
        this.stop();
        
        // Save current state
        this.saveCurrentState();
        
        // Show notification
        this.showReloadNotification(changedFiles);
        
        // Reload page after short delay
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }

    // Save current application state
    saveCurrentState() {
        try {
            // Get current page
            let currentPage = 'calculator';
            if (typeof window.getCurrentPage === 'function') {
                currentPage = window.getCurrentPage();
            }
            
            // Get current language
            let currentLanguage = 'en';
            if (typeof window.getCurrentAppLanguage === 'function') {
                currentLanguage = window.getCurrentAppLanguage();
            }
            
            // Store in sessionStorage for page reload persistence
            try {
                sessionStorage.setItem('armHelper_preReload_page', currentPage);
                sessionStorage.setItem('armHelper_preReload_language', currentLanguage);
                console.log('💾 State preserved before reload:', { currentPage, currentLanguage });
            } catch (e) {
                console.warn('⚠️ Could not save to sessionStorage');
            }
        } catch (error) {
            console.error('❌ Error saving state:', error);
        }
    }

    // Show reload notification
    showReloadNotification(changedFiles) {
        // Remove any existing notifications
        const existing = document.querySelector('.auto-reload-notification');
        if (existing) existing.remove();
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'auto-reload-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
                z-index: 10001;
                font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
                font-size: 14px;
                max-width: 350px;
                backdrop-filter: blur(15px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                transform: translateX(100%);
                transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            ">
                <div style="display: flex; align-items: flex-start; gap: 12px;">
                    <div style="font-size: 20px; flex-shrink: 0;">🔄</div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; margin-bottom: 6px;">Code Updated!</div>
                        <div style="font-size: 12px; opacity: 0.9; margin-bottom: 8px;">
                            ${changedFiles.length} file(s) changed
                        </div>
                        <div style="font-size: 11px; opacity: 0.7;">
                            Reloading to apply changes...
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        const notificationEl = notification.firstElementChild;
        requestAnimationFrame(() => {
            notificationEl.style.transform = 'translateX(0)';
        });
        
        // Auto remove after reload
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Show activity indicator
    showIndicator() {
        const indicator = document.getElementById('autoReloadIndicator');
        if (indicator && this.shouldEnableAutoReload()) {
            indicator.classList.add('show');
            
            // Update text to show it's active
            indicator.innerHTML = `
                <span style="display: inline-flex; align-items: center; gap: 6px;">
                    <span style="animation: pulse 2s infinite;">🔄</span>
                    <span>Auto-reload active</span>
                </span>
            `;
            
            setTimeout(() => {
                indicator.classList.remove('show');
            }, 4000);
        }
    }

    // Check if auto-reload should be enabled
    shouldEnableAutoReload() {
        const isDevelopment = 
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname.includes('192.168.') ||
            window.location.hostname.includes('10.') ||
            window.location.protocol === 'file:' ||
            window.location.search.includes('debug=true') ||
            window.location.search.includes('dev=true');
        
        return isDevelopment;
    }

    // Set check interval
    setCheckInterval(ms) {
        const oldInterval = this.checkInterval;
        this.checkInterval = Math.max(ms, 2000); // Minimum 2 seconds
        
        if (this.isActive) {
            this.stop();
            this.start();
        }
        
        console.log(`⚙️ Check interval updated from ${oldInterval}ms to ${this.checkInterval}ms`);
    }

    // Add file to monitoring
    addFile(filepath) {
        if (!this.files.includes(filepath)) {
            this.files.push(filepath);
            console.log(`➕ Added ${filepath} to monitoring`);
        }
    }

    // Remove file from monitoring
    removeFile(filepath) {
        const index = this.files.indexOf(filepath);
        if (index > -1) {
            this.files.splice(index, 1);
            this.fileHashes.delete(filepath);
            console.log(`➖ Removed ${filepath} from monitoring`);
        }
    }

    // Get status
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            isActive: this.isActive,
            checkInterval: this.checkInterval,
            filesCount: this.files.length,
            monitoredFiles: [...this.files],
            isDevelopmentMode: this.shouldEnableAutoReload()
        };
    }

    // Reset system
    reset() {
        this.stop();
        this.fileHashes.clear();
        this.isInitialized = false;
        console.log('🔄 Auto-reload system reset');
    }
}

// Global instance
let autoReloadSystem = null;

// Initialize auto-reload system
function initAutoReload() {
    // Check if should be enabled
    if (!shouldEnableAutoReload()) {
        console.log('🚫 Auto-reload disabled (production mode)');
        return;
    }

    if (autoReloadSystem) {
        console.log('⚠️ Auto-reload system already exists');
        return;
    }

    console.log('🔧 Creating auto-reload system...');
    autoReloadSystem = new AutoReloadSystem();
    
    // Initialize after app is fully loaded
    setTimeout(async () => {
        try {
            await autoReloadSystem.init();
        } catch (error) {
            console.error('❌ Failed to initialize auto-reload system:', error);
            autoReloadSystem = null;
        }
    }, 3000);
}

// Check if auto-reload should be enabled
function shouldEnableAutoReload() {
    const isDevelopment = 
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('192.168.') ||
        window.location.hostname.includes('10.') ||
        window.location.protocol === 'file:' ||
        window.location.search.includes('debug=true') ||
        window.location.search.includes('dev=true');
    
    return isDevelopment;
}

// Restore state after reload
function restoreStateAfterReload() {
    try {
        const savedPage = sessionStorage.getItem('armHelper_preReload_page');
        const savedLanguage = sessionStorage.getItem('armHelper_preReload_language');
        
        if (savedPage || savedLanguage) {
            console.log('🔄 Restoring state after reload:', { savedPage, savedLanguage });
            
            // Wait for app to be ready
            const restoreState = () => {
                if (savedLanguage && typeof window.switchAppLanguage === 'function') {
                    window.switchAppLanguage(savedLanguage);
                }
                
                if (savedPage && typeof window.switchPage === 'function') {
                    window.switchPage(savedPage);
                }
                
                // Clean up
                sessionStorage.removeItem('armHelper_preReload_page');
                sessionStorage.removeItem('armHelper_preReload_language');
            };
            
            // Try multiple times with delays
            setTimeout(restoreState, 1000);
            setTimeout(restoreState, 2000);
            setTimeout(restoreState, 3000);
        }
    } catch (error) {
        console.warn('⚠️ Could not restore state after reload:', error);
    }
}

// Control functions
function stopAutoReload() {
    if (autoReloadSystem) {
        autoReloadSystem.stop();
        console.log('🛑 Auto-reload system stopped');
    }
}

function startAutoReload() {
    if (autoReloadSystem) {
        autoReloadSystem.start();
        console.log('▶️ Auto-reload system started');
    } else {
        initAutoReload();
    }
}

function getAutoReloadStatus() {
    if (!autoReloadSystem) {
        return { 
            initialized: false, 
            available: shouldEnableAutoReload(),
            reason: shouldEnableAutoReload() ? 'Not initialized' : 'Production mode'
        };
    }
    
    return {
        initialized: true,
        available: true,
        ...autoReloadSystem.getStatus()
    };
}

function setAutoReloadInterval(ms) {
    if (autoReloadSystem) {
        autoReloadSystem.setCheckInterval(ms);
    } else {
        console.warn('⚠️ Auto-reload system not initialized');
    }
}

function addFileToReloadMonitoring(filepath) {
    if (autoReloadSystem) {
        autoReloadSystem.addFile(filepath);
    } else {
        console.warn('⚠️ Auto-reload system not initialized');
    }
}

function removeFileFromReloadMonitoring(filepath) {
    if (autoReloadSystem) {
        autoReloadSystem.removeFile(filepath);
    } else {
        console.warn('⚠️ Auto-reload system not initialized');
    }
}

function resetAutoReload() {
    if (autoReloadSystem) {
        autoReloadSystem.reset();
        autoReloadSystem = null;
    }
    initAutoReload();
}

// Export functions globally
if (typeof window !== 'undefined') {
    window.initAutoReload = initAutoReload;
    window.stopAutoReload = stopAutoReload;
    window.startAutoReload = startAutoReload;
    window.getAutoReloadStatus = getAutoReloadStatus;
    window.setAutoReloadInterval = setAutoReloadInterval;
    window.addFileToReloadMonitoring = addFileToReloadMonitoring;
    window.removeFileFromReloadMonitoring = removeFileFromReloadMonitoring;
    window.resetAutoReload = resetAutoReload;
    window.restoreStateAfterReload = restoreStateAfterReload;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Restore state first
        restoreStateAfterReload();
        
        // Then init auto-reload
        setTimeout(initAutoReload, 2000);
    });
} else {
    // DOM already loaded
    restoreStateAfterReload();
    setTimeout(initAutoReload, 2000);
}

console.log('📁 Auto-reloa
