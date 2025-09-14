// reload.js - Auto-reload system for detecting code changes

class AutoReloadSystem {
    constructor() {
        this.checkInterval = 3000; // Перевірка кожні 3 секунди
        this.files = [
            'general.js',
            'general.css',
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
            'other/updates.js',
            'other/peoples.js',
            'other/help.js',
            'index/content_loader.js'
        ];
        this.fileHashes = new Map();
        this.isActive = false;
        this.intervalId = null;
    }

    // Початкова ініціалізація
    async init() {
        console.log('🔄 Initializing auto-reload system...');
        
        // Зберегти початкові хеші файлів
        await this.updateFileHashes();
        
        // Запустити моніторинг
        this.start();
        
        // Показати індикатор
        this.showIndicator();
        
        console.log('✅ Auto-reload system activated');
    }

    // Запуск системи моніторингу
    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.intervalId = setInterval(() => {
            this.checkForChanges();
        }, this.checkInterval);
        
        console.log('🚀 Auto-reload monitoring started');
    }

    // Зупинка системи моніторингу
    stop() {
        if (!this.isActive) return;
        
        this.isActive = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        console.log('⏸️ Auto-reload monitoring stopped');
    }

    // Оновити хеші файлів
    async updateFileHashes() {
        const promises = this.files.map(async (file) => {
            try {
                const hash = await this.getFileHash(file);
                this.fileHashes.set(file, hash);
                return { file, hash, success: true };
            } catch (error) {
                console.warn(`⚠️ Could not get hash for ${file}:`, error.message);
                return { file, hash: null, success: false };
            }
        });

        const results = await Promise.all(promises);
        const successful = results.filter(r => r.success).length;
        console.log(`📊 File hashes updated: ${successful}/${this.files.length} files`);
    }

    // Отримати хеш файлу
    async getFileHash(file) {
        try {
            const response = await fetch(file + '?t=' + Date.now());
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const content = await response.text();
            return this.simpleHash(content);
        } catch (error) {
            throw new Error(`Failed to fetch ${file}: ${error.message}`);
        }
    }

    // Простий хеш для тексту
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }

    // Перевірка на зміни
    async checkForChanges() {
        if (!this.isActive) return;

        try {
            let changedFiles = [];

            for (const file of this.files) {
                try {
                    const currentHash = await this.getFileHash(file);
                    const oldHash = this.fileHashes.get(file);

                    if (oldHash !== null && oldHash !== currentHash) {
                        changedFiles.push(file);
                        console.log(`🔄 File changed detected: ${file}`);
                    }
                } catch (error) {
                    // Ігноруємо помилки окремих файлів
                    continue;
                }
            }

            if (changedFiles.length > 0) {
                console.log(`🔄 Changes detected in ${changedFiles.length} file(s):`, changedFiles);
                this.reloadPage();
            }
        } catch (error) {
            console.error('❌ Error checking for changes:', error);
        }
    }

    // Перезагрузка сторінки з збереженням стану
    reloadPage() {
        console.log('🔄 Code changes detected, reloading page...');
        
        // Зупинити моніторинг перед перезагрузкою
        this.stop();
        
        // Зберегти поточний стан перед перезагрузкою
        this.saveCurrentState();
        
        // Показати повідомлення користувачу
        this.showReloadNotification();
        
        // Перезагрузити сторінку через коротку затримку
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    // Зберегти поточний стан додатка
    saveCurrentState() {
        try {
            // Стан вже зберігається через існуючі функції
            console.log('💾 Current state preserved before reload');
        } catch (error) {
            console.error('❌ Error saving state:', error);
        }
    }

    // Показати повідомлення про перезагрузку
    showReloadNotification() {
        // Створити повідомлення
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                font-family: 'Segoe UI', sans-serif;
                font-size: 14px;
                max-width: 300px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            ">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="font-size: 18px;">🔄</div>
                    <div>
                        <div style="font-weight: bold; margin-bottom: 4px;">Code Updated!</div>
                        <div style="font-size: 12px; opacity: 0.9;">Reloading to apply changes...</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Анімація появи
        const notificationEl = notification.firstElementChild;
        notificationEl.style.transform = 'translateX(100%)';
        notificationEl.style.transition = 'transform 0.3s ease-out';
        
        setTimeout(() => {
            notificationEl.style.transform = 'translateX(0)';
        }, 50);
    }

    // Показати індикатор активності
    showIndicator() {
        const indicator = document.getElementById('autoReloadIndicator');
        if (indicator && this.shouldEnableAutoReload()) {
            indicator.classList.add('show');
            setTimeout(() => {
                indicator.classList.remove('show');
            }, 3000);
        }
    }

    // Перевірити, чи потрібно увімкнути автоматичне оновлення
    shouldEnableAutoReload() {
        const isDevelopment = 
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname.includes('192.168.') ||
            window.location.protocol === 'file:' ||
            window.location.search.includes('debug=true');
        
        return isDevelopment;
    }

    // Налаштування інтервалу перевірки
    setCheckInterval(ms) {
        this.checkInterval = ms;
        if (this.isActive) {
            this.stop();
            this.start();
        }
        console.log(`⚙️ Check interval updated to ${ms}ms`);
    }

    // Додати файл до моніторингу
    addFile(filepath) {
        if (!this.files.includes(filepath)) {
            this.files.push(filepath);
            console.log(`➕ Added ${filepath} to monitoring`);
        }
    }

    // Видалити файл з моніторингу
    removeFile(filepath) {
        const index = this.files.indexOf(filepath);
        if (index > -1) {
            this.files.splice(index, 1);
            this.fileHashes.delete(filepath);
            console.log(`➖ Removed ${filepath} from monitoring`);
        }
    }

    // Отримати статус
    getStatus() {
        return {
            isActive: this.isActive,
            checkInterval: this.checkInterval,
            filesCount: this.files.length,
            monitoredFiles: [...this.files]
        };
    }
}

// Глобальний екземпляр системи
let autoReloadSystem = null;

// Ініціалізація системи автоматичного оновлення
function initAutoReload() {
    // Перевірити, чи потрібна система (тільки в режимі розробки)
    if (!shouldEnableAutoReload()) {
        console.log('🚫 Auto-reload disabled (production mode)');
        return;
    }

    if (autoReloadSystem) {
        console.log('⚠️ Auto-reload system already initialized');
        return;
    }

    autoReloadSystem = new AutoReloadSystem();
    
    // Ініціалізувати з затримкою, щоб дати час завантажитися додатку
    setTimeout(async () => {
        try {
            await autoReloadSystem.init();
        } catch (error) {
            console.error('❌ Failed to initialize auto-reload system:', error);
        }
    }, 5000); // 5 секунд після завантаження
}

// Перевірити, чи потрібно увімкнути автоматичне оновлення
function shouldEnableAutoReload() {
    // Увімкнути тільки в режимі розробки
    const isDevelopment = 
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.includes('192.168.') ||
        window.location.protocol === 'file:' ||
        window.location.search.includes('debug=true');
    
    return isDevelopment;
}

// Зупинити систему автоматичного оновлення
function stopAutoReload() {
    if (autoReloadSystem) {
        autoReloadSystem.stop();
        console.log('🛑 Auto-reload system stopped');
    }
}

// Запустити систему автоматичного оновлення
function startAutoReload() {
    if (autoReloadSystem) {
        autoReloadSystem.start();
        console.log('▶️ Auto-reload system started');
    } else {
        initAutoReload();
    }
}

// Отримати статус системи
function getAutoReloadStatus() {
    if (!autoReloadSystem) {
        return { initialized: false };
    }
    
    return {
        initialized: true,
        ...autoReloadSystem.getStatus()
    };
}

// Керування інтервалом перевірки
function setAutoReloadInterval(ms) {
    if (autoReloadSystem) {
        autoReloadSystem.setCheckInterval(ms);
    } else {
        console.warn('⚠️ Auto-reload system not initialized');
    }
}

// Додати файл до моніторингу
function addFileToReloadMonitoring(filepath) {
    if (autoReloadSystem) {
        autoReloadSystem.addFile(filepath);
    } else {
        console.warn('⚠️ Auto-reload system not initialized');
    }
}

// Видалити файл з моніторингу
function removeFileFromReloadMonitoring(filepath) {
    if (autoReloadSystem) {
        autoReloadSystem.removeFile(filepath);
    } else {
        console.warn('⚠️ Auto-reload system not initialized');
    }
}

// Експортувати функції для глобального доступу
if (typeof window !== 'undefined') {
    window.initAutoReload = initAutoReload;
    window.stopAutoReload = stopAutoReload;
    window.startAutoReload = startAutoReload;
    window.getAutoReloadStatus = getAutoReloadStatus;
    window.setAutoReloadInterval = setAutoReloadInterval;
    window.addFileToReloadMonitoring = addFileToReloadMonitoring;
    window.removeFileFromReloadMonitoring = removeFileFromReloadMonitoring;
    window.autoReloadSystem = autoReloadSystem;
}

// Автоматично ініціалізувати при завантаженні DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initAutoReload, 2000);
    });
} else {
    // DOM вже завантажений
    setTimeout(initAutoReload, 2000);
}

console.log('📁 Auto-reload system loaded and ready');
