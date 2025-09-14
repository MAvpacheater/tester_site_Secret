// Updated General JavaScript functions - Page state persistence added

// Global language state
let currentAppLanguage = 'en';
let menuTranslations = null;

// Page state management
function saveCurrentPage(page) {
    localStorage.setItem('armHelper_currentPage', page);
    console.log(`Current page saved: ${page}`);
}

function getCurrentPage() {
    return localStorage.getItem('armHelper_currentPage') || 'calculator';
}

// Language management functions
function getCurrentAppLanguage() {
    const saved = localStorage.getItem('armHelper_language');
    return saved || 'en';
}

function saveAppLanguage(lang) {
    localStorage.setItem('armHelper_language', lang);
    console.log(`App language saved: ${lang}`);
}

// Load menu translations
async function loadMenuTranslations() {
    if (menuTranslations) return menuTranslations;
    
    try {
        console.log('📥 Loading menu translations...');
        const response = await fetch('languages/menu.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        menuTranslations = await response.json();
        console.log('✅ Menu translations loaded successfully');
        return menuTranslations;
    } catch (error) {
        console.error('❌ Error loading menu translations:', error);
        // Fallback to English
        menuTranslations = {
            en: {
                menu: "Menu",
                calculator: "Calculator", 
                info: "Info",
                others: "Others",
                pages: {
                    calculator: "🐾 Pet Calculator",
                    arm: "💪 Arm Calculator",
                    grind: "🏋️‍♂️ Grind Calculator",
                    boosts: "🚀 Boosts",
                    shiny: "✨ Shiny Stats",
                    secret: "🔮 Secret Pets",
                    codes: "🎁 Codes",
                    aura: "🌟 Aura",
                    trainer: "🏆 Trainer",
                    charms: "🔮 Charms",
                    potions: "🧪 Potions & Food",
                    worlds: "🌍 Worlds",
                    updates: "📝 Updates",
                    help: "🆘 Help",
                    peoples: "🙏 Peoples"
                },
                auth: {
                    login: "Login (Soon...)"
                }
            }
        };
        return menuTranslations;
    }
}

// Switch app language
async function switchAppLanguage(lang) {
    if (!menuTranslations) {
        await loadMenuTranslations();
    }
    
    if (!menuTranslations[lang]) {
        console.error(`❌ Language ${lang} not found, defaulting to English`);
        lang = 'en';
    }
    
    const previousLanguage = currentAppLanguage;
    currentAppLanguage = lang;
    saveAppLanguage(lang);
    
    // Update language flag buttons (they already exist in HTML)
    document.querySelectorAll('.lang-flag-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Update menu text AND page titles
    updateMenuTranslations();
    updatePageTitles();
    
    // Notify ALL modules about language change
    console.log(`🌍 Broadcasting language change from ${previousLanguage} to ${lang}`);
    
    // Dispatch custom event for language change
    const languageChangeEvent = new CustomEvent('languageChanged', {
        detail: {
            language: lang,
            previousLanguage: previousLanguage
        }
    });
    document.dispatchEvent(languageChangeEvent);
    
    // Directly notify specific modules if their functions exist
    const moduleNotifications = [
        { name: 'worlds', func: 'updateWorldsLanguage' },
        { name: 'potions', func: 'updatePotionsLanguage' },
        { name: 'secret', func: 'updateSecretLanguage' },
        { name: 'peoples', func: 'updatePeoplesLanguage' },
        { name: 'help', func: 'updateHelpLanguage' },
        { name: 'updates', func: 'updateUpdatesLanguage' }
    ];
    
    moduleNotifications.forEach(({ name, func }) => {
        if (typeof window[func] === 'function') {
            try {
                window[func](lang);
                console.log(`✅ ${name} language updated via ${func}`);
            } catch (error) {
                console.error(`❌ Error updating ${name} language:`, error);
            }
        }
    });
    
    // Legacy support for older function names
    if (typeof window.switchWorldsLanguage === 'function') {
        try {
            window.switchWorldsLanguage(lang);
            console.log('✅ Worlds language updated via legacy function');
        } catch (error) {
            console.error('❌ Error in legacy worlds language update:', error);
        }
    }
    
    console.log(`🌍 App language switched to: ${lang}`);
}

// Update menu text with translations
function updateMenuTranslations() {
    if (!menuTranslations || !currentAppLanguage) return;
    
    const translations = menuTranslations[currentAppLanguage];
    if (!translations) return;
    
    // Update sidebar header
    const sidebarHeader = document.querySelector('.sidebar-header h3');
    if (sidebarHeader) {
        sidebarHeader.textContent = translations.menu;
    }
    
    // Update category headers
    const categoryMappings = {
        'calculatorButtons': 'calculator',
        'infoButtons': 'info',
        'othersButtons': 'others'
    };
    
    Object.entries(categoryMappings).forEach(([categoryId, translationKey]) => {
        const categoryHeader = document.querySelector(`[data-category="${categoryId}"] .category-title span:last-child`);
        if (categoryHeader && translations[translationKey]) {
            categoryHeader.textContent = translations[translationKey];
        }
    });
    
    // Update page buttons
    Object.entries(translations.pages).forEach(([page, translation]) => {
        const pageButton = document.querySelector(`[data-page="${page}"]`);
        if (pageButton) {
            pageButton.textContent = translation; // Full text with emoji
        }
    });
    
    // Update auth button
    const authButton = document.getElementById('authButton');
    if (authButton && translations.auth.login) {
        authButton.textContent = translations.auth.login;
    }
    
    console.log(`✅ Menu translations updated for ${currentAppLanguage}`);
}

// Update page titles
function updatePageTitles() {
    if (!menuTranslations || !currentAppLanguage) return;
    
    const translations = menuTranslations[currentAppLanguage];
    if (!translations || !translations.pages) return;
    
    // Page title mappings (page ID -> translation key)
    const pageTitleMappings = {
        'calculatorPage': 'calculator',
        'armPage': 'arm',
        'grindPage': 'grind',
        'boostsPage': 'boosts',
        'shinyPage': 'shiny',
        'secretPage': 'secret',
        'codesPage': 'codes',
        'auraPage': 'aura',
        'trainerPage': 'trainer',
        'charmsPage': 'charms',
        'potionsPage': 'potions',
        'worldsPage': 'worlds',
        'updatesPage': 'updates',
        'helpPage': 'help',
        'peoplesPage': 'peoples'
    };
    
    // Update each page title
    Object.entries(pageTitleMappings).forEach(([pageId, translationKey]) => {
        const page = document.getElementById(pageId);
        if (page && translations.pages[translationKey]) {
            // Find the h1 title element in the page
            const titleElement = page.querySelector('h1, .title, .peoples-title, .help-title, .updates-title');
            if (titleElement) {
                titleElement.textContent = translations.pages[translationKey];
                console.log(`✅ Updated title for ${pageId}: ${translations.pages[translationKey]}`);
            }
            
            // Special handling for header-controls h1 elements
            const headerControlsTitle = page.querySelector('.header-controls h1');
            if (headerControlsTitle) {
                headerControlsTitle.textContent = translations.pages[translationKey];
                console.log(`✅ Updated header title for ${pageId}: ${translations.pages[translationKey]}`);
            }
        }
    });
    
    console.log(`✅ Page titles updated for ${currentAppLanguage}`);
}

// Page switching functionality with persistence
function switchPage(page) {
    console.log(`Switching to page: ${page}`);
    
    // Save current page to localStorage
    saveCurrentPage(page);
    
    // Remove active class from all pages and nav buttons
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    // Add active class to selected page
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        console.log(`Page ${page}Page activated`);
    } else {
        console.error(`Page ${page}Page not found`);
    }
    
    // Update active nav button
    const pageMap = {
        'calculator': 'calculator',
        'arm': 'arm',
        'grind': 'grind',
        'boosts': 'boosts',
        'shiny': 'shiny',
        'codes': 'codes',
        'aura': 'aura',
        'trainer': 'trainer',
        'charms': 'charms',
        'secret': 'secret',
        'potions': 'potions',
        'worlds': 'worlds',
        'updates': 'updates',
        'help': 'help',
        'peoples': 'peoples'
    };
    
    const targetButton = document.querySelector(`[data-page="${pageMap[page]}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
        console.log(`Nav button activated for ${page}`);
    }
    
    // Close sidebar after selection
    closeSidebar();
    
    // Force re-initialize specific page content when switching
    setTimeout(() => {
        initializePageContent(page);
    }, 100);
}

// Initialize specific page content when switching
function initializePageContent(page) {
    console.log(`🔄 Initializing content for page: ${page}`);
    
    // Check if the page container exists first
    const pageContainer = document.getElementById(page + 'Page');
    if (!pageContainer) {
        console.error(`❌ Page container ${page}Page not found`);
        return;
    }
    
    switch(page) {
        case 'calculator':
            if (typeof initializeCalculator === 'function') {
                initializeCalculator();
            }
            break;
        case 'arm':
            if (typeof initializeArm === 'function') {
                initializeArm();
            }
            break;
        case 'grind':
            if (typeof initializeGrind === 'function') {
                if (typeof window !== 'undefined' && window.grindInitialized !== undefined) {
                    window.grindInitialized = false;
                }
                initializeGrind();
            }
            break;
        case 'shiny':
            if (typeof initializeShiny === 'function') {
                initializeShiny();
            }
            break;
        case 'boosts':
            if (typeof initializeBoosts === 'function') {
                initializeBoosts();
            }
            break;
        case 'trainer':
            if (typeof initializeTrainer === 'function') {
                initializeTrainer();
            }
            break;
        case 'aura':
            if (typeof initializeAura === 'function') {
                initializeAura();
            }
            break;
        case 'codes':
            if (typeof initializeCodes === 'function') {
                initializeCodes();
            }
            break;
        case 'charms':
            if (typeof initializeCharms === 'function') {
                initializeCharms();
            }
            break;
        case 'secret':
            console.log('🔮 Initializing Secret Pets page...');
            if (typeof initializeSecret === 'function') {
                if (typeof window !== 'undefined' && window.secretInitialized !== undefined) {
                    window.secretInitialized = false;
                }
                initializeSecret();
            } else {
                console.error('❌ initializeSecret function not found');
            }
            break;
        case 'potions':
            console.log('🧪 Initializing Potions & Food page...');
            if (typeof initializePotions === 'function') {
                if (typeof window !== 'undefined' && window.potionsInitialized !== undefined) {
                    window.potionsInitialized = false;
                }
                initializePotions();
            } else {
                console.error('❌ initializePotions function not found');
            }
            break;
        case 'worlds':
            console.log('🌍 Initializing Worlds page...');
            if (typeof initializeWorlds === 'function') {
                initializeWorlds();
            } else {
                console.error('❌ initializeWorlds function not found');
            }
            break;
        case 'updates':
            console.log('📝 Initializing Updates page...');
            if (typeof initializeUpdates === 'function') {
                if (typeof window !== 'undefined' && window.updatesInitialized !== undefined) {
                    window.updatesInitialized = false;
                }
                initializeUpdates();
            } else {
                console.error('❌ initializeUpdates function not found');
            }
            break;
        case 'help':
            console.log('🆘 Initializing Help page...');
            if (typeof initializeHelp === 'function') {
                if (typeof window !== 'undefined' && window.helpInitialized !== undefined) {
                    window.helpInitialized = false;
                }
                initializeHelp();
            } else {
                console.error('❌ initializeHelp function not found');
            }
            break;
        case 'peoples':
            console.log('🙏 Initializing Peoples page...');
            if (typeof initializePeoples === 'function') {
                if (typeof window !== 'undefined' && window.peoplesInitialized !== undefined) {
                    window.peoplesInitialized = false;
                }
                initializePeoples();
            } else {
                console.error('❌ initializePeoples function not found');
            }
            break;
    }
}

// Category toggle functionality
function toggleCategory(categoryId) {
    const categoryButtons = document.getElementById(categoryId);
    const toggleIcon = document.querySelector(`[data-category="${categoryId}"] .category-toggle`);
    
    if (categoryButtons && toggleIcon) {
        const isExpanded = categoryButtons.classList.contains('expanded');
        
        // Close all categories first
        document.querySelectorAll('.category-buttons').forEach(el => {
            el.classList.remove('expanded');
        });
        document.querySelectorAll('.category-toggle').forEach(el => {
            el.classList.remove('expanded');
        });
        
        // If this category wasn't expanded, expand it
        if (!isExpanded) {
            categoryButtons.classList.add('expanded');
            toggleIcon.classList.add('expanded');
        }
    }
}

// Initialize categories on app start
function initializeCategories() {
    console.log('✅ Categories initialized - all closed by default');
}

// Sidebar functionality
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    }
}

// Disabled auth action
function handleAuthAction() {
    console.log('Login feature coming soon...');
}

// Settings persistence helpers (kept for other modules that might use them)
function saveSettingsToStorage(key, settings) {
    localStorage.setItem(`armHelper_${key}_settings`, JSON.stringify(settings));
    console.log(`Settings saved to localStorage for ${key}`);
}

function loadSettingsFromStorage(key) {
    const localSettings = localStorage.getItem(`armHelper_${key}_settings`);
    if (localSettings) {
        try {
            return JSON.parse(localSettings);
        } catch (e) {
            console.warn('Invalid local settings data');
            return null;
        }
    }
    return null;
}

// Flag to prevent repeated initialization
let appInitialized = false;

// App initialization with enhanced language support and page state restoration
async function initializeApp() {
    if (appInitialized) {
        console.log('⚠️ App already initialized');
        return;
    }
    
    console.log('🚀 Starting app initialization...');
    
    // Check if content is loaded
    const appContent = document.getElementById('app-content');
    if (!appContent || !appContent.innerHTML.trim()) {
        console.error('❌ Content not loaded');
        return;
    }
    
    // Load current language
    currentAppLanguage = getCurrentAppLanguage();
    
    // Load menu translations
    await loadMenuTranslations();
    
    // Just update the active state of existing flags
    document.querySelectorAll('.lang-flag-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === currentAppLanguage) {
            btn.classList.add('active');
        }
    });
    
    // Update menu translations AND page titles
    updateMenuTranslations();
    updatePageTitles();
    
    // Initialize categories
    initializeCategories();
    
    // Initialize all modules first
    initializeAllModules();
    
    // Restore last page or default to calculator
    const lastPage = getCurrentPage();
    console.log(`🔄 Restoring last page: ${lastPage}`);
    
    setTimeout(() => {
        switchPage(lastPage);
        console.log(`✅ Page restored to: ${lastPage}`);
    }, 200);
    
    // Enhanced click outside settings panel handler (for other modules)
    document.addEventListener('click', e => {
        const settingsPanels = [
            { panel: document.getElementById('settingsPanel'), btn: document.querySelector('#calculatorPage .settings-btn') },
            { panel: document.getElementById('settingsPanelArm'), btn: document.querySelector('#armPage .settings-btn') },
            { panel: document.getElementById('settingsPanelGrind'), btn: document.querySelector('#grindPage .settings-btn') }
        ];
        
        settingsPanels.forEach(({ panel, btn }) => {
            if (panel && btn) {
                const isClickInsidePanel = panel.contains(e.target);
                const isClickOnSettingsBtn = btn.contains(e.target);
                const isClickOnCategoryButton = e.target.closest('.category-button');
                const isClickOnBackButton = e.target.closest('.back-btn');
                const isClickOnCategorySwitch = e.target.closest('.category-switch');
                const isClickOnSimpleModifier = e.target.closest('.simple-modifier');
                const isClickOnCategoryHeader = e.target.closest('.category-header');
                const isClickOnGrindCategoryHeader = e.target.closest('.category-header-modifier');
                const isClickOnLanguageFlag = e.target.closest('.lang-flag-btn');
                
                if (!isClickInsidePanel && !isClickOnSettingsBtn && 
                    !isClickOnCategoryButton && !isClickOnBackButton && 
                    !isClickOnCategorySwitch && !isClickOnSimpleModifier &&
                    !isClickOnCategoryHeader && !isClickOnGrindCategoryHeader &&
                    !isClickOnLanguageFlag) {
                    panel.classList.remove('show');
                }
            }
        });
    });

    appInitialized = true;
    console.log('✅ App initialization completed - Page state persistence enabled');
}

// Initialize all modules with proper DOM readiness checks
function initializeAllModules() {
    console.log('🔧 Initializing all modules...');
    
    const modules = [
        'initializeCalculator',
        'initializeArm', 
        'initializeGrind',
        'initializeBoosts',
        'initializeShiny',
        'initializeSecret',
        'initializePotions',
        'initializeAura',
        'initializeTrainer',
        'initializeCharms',
        'initializeCodes',
        'initializeWorlds',
        'initializeUpdates',
        'initializeHelp',
        'initializePeoples'
    ];

    modules.forEach(moduleName => {
        try {
            if (typeof window[moduleName] === 'function') {
                // Add delay for DOM-dependent modules
                if (moduleName === 'initializeSecret' || moduleName === 'initializePotions' || 
                    moduleName === 'initializeGrind' || moduleName === 'initializePeoples' ||
                    moduleName === 'initializeWorlds' || moduleName === 'initializeHelp' ||
                    moduleName === 'initializeUpdates') {
                    setTimeout(() => {
                        try {
                            // Force reinitialization by resetting flags
                            if (moduleName === 'initializeSecret' && window.secretInitialized) {
                                window.secretInitialized = false;
                            }
                            if (moduleName === 'initializePotions' && window.potionsInitialized) {
                                window.potionsInitialized = false;
                            }
                            if (moduleName === 'initializeGrind' && window.grindInitialized) {
                                window.grindInitialized = false;
                            }
                            if (moduleName === 'initializePeoples' && window.peoplesInitialized) {
                                window.peoplesInitialized = false;
                            }
                            if (moduleName === 'initializeHelp' && window.helpInitialized) {
                                window.helpInitialized = false;
                            }
                            if (moduleName === 'initializeUpdates' && window.updatesInitialized) {
                                window.updatesInitialized = false;
                            }
                            
                            window[moduleName]();
                            console.log(`✅ ${moduleName} initialized (delayed)`);
                        } catch (error) {
                            console.error(`❌ Error initializing ${moduleName}:`, error);
                        }
                    }, 300);
                } else {
                    window[moduleName]();
                    console.log(`✅ ${moduleName} initialized`);
                }
            } else {
                console.warn(`⚠️ Function ${moduleName} not found`);
            }
        } catch (error) {
            console.error(`❌ Error initializing ${moduleName}:`, error);
        }
    });
}

// Debug function to check page states
function debugPageStates() {
    console.log('=== DEBUG PAGE STATES ===');
    document.querySelectorAll('.page').forEach(page => {
        console.log(`${page.id}: ${page.classList.contains('active') ? 'ACTIVE' : 'INACTIVE'}`);
    });
    console.log(`Current saved page: ${getCurrentPage()}`);
    console.log('========================');
}

// Force reinitialization for specific modules
function forceReinitializeModule(moduleName) {
    console.log(`🔄 Force reinitializing ${moduleName}...`);
    
    // Reset initialization flags
    if (moduleName === 'secret' && typeof window !== 'undefined') {
        window.secretInitialized = false;
    }
    if (moduleName === 'potions' && typeof window !== 'undefined') {
        window.potionsInitialized = false;
    }
    if (moduleName === 'grind' && typeof window !== 'undefined') {
        window.grindInitialized = false;
    }
    if (moduleName === 'peoples' && typeof window !== 'undefined') {
        window.peoplesInitialized = false;
    }
    if (moduleName === 'help' && typeof window !== 'undefined') {
        window.helpInitialized = false;
    }
    if (moduleName === 'updates' && typeof window !== 'undefined') {
        window.updatesInitialized = false;
    }
    
    // Call initialization
    const initFunctionName = `initialize${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;
    if (typeof window[initFunctionName] === 'function') {
        setTimeout(() => {
            window[initFunctionName]();
            console.log(`✅ ${initFunctionName} force reinitialized`);
        }, 100);
    }
}
// Auto-reload system for detecting code changes
// Додати в general.js або як окремий файл

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

// Експортувати функції
if (typeof window !== 'undefined') {
    window.initAutoReload = initAutoReload;
    window.stopAutoReload = stopAutoReload;
    window.startAutoReload = startAutoReload;
    window.getAutoReloadStatus = getAutoReloadStatus;
    window.autoReloadSystem = autoReloadSystem;
}

// Автоматично ініціалізувати при завантаженні DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoReload);
} else {
    // DOM вже завантажений
    setTimeout(initAutoReload, 1000);
}

console.log('📁 Auto-reload system loaded');

// Make functions globally available
window.switchPage = switchPage;
window.toggleMobileMenu = toggleMobileMenu;
window.closeSidebar = closeSidebar;
window.handleAuthAction = handleAuthAction;
window.initializeApp = initializeApp;
window.debugPageStates = debugPageStates;
window.saveSettingsToStorage = saveSettingsToStorage;
window.loadSettingsFromStorage = loadSettingsFromStorage;
window.toggleCategory = toggleCategory;
window.initializeCategories = initializeCategories;
window.forceReinitializeModule = forceReinitializeModule;
window.switchAppLanguage = switchAppLanguage;
window.getCurrentAppLanguage = getCurrentAppLanguage;
window.saveAppLanguage = saveAppLanguage;
window.updateMenuTranslations = updateMenuTranslations;
window.updatePageTitles = updatePageTitles;
window.saveCurrentPage = saveCurrentPage;
window.getCurrentPage = getCurrentPage;
