// Fixed General JavaScript functions - Memory-based storage
// Global language state
let currentAppLanguage = 'en';
let menuTranslations = null;

// Memory-based storage (instead of localStorage)
const appStorage = {
    currentPage: 'calculator',
    language: 'en',
    settings: {}
};

// Page state management
function saveCurrentPage(page) {
    appStorage.currentPage = page;
    console.log(`Current page saved: ${page}`);
}

function getCurrentPage() {
    return appStorage.currentPage;
}

// Language management functions
function getCurrentAppLanguage() {
    return appStorage.language;
}

function saveAppLanguage(lang) {
    appStorage.language = lang;
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
                    settings: "⚙️ Settings",
                    updates: "📝 Updates",
                    help: "🆘 Help",
                    peoples: "🙏 Peoples"
                },
                auth: {
                    login: "Login (Soon...)"
                }
            },
            uk: {
                menu: "Меню",
                calculator: "Калькулятор", 
                info: "Інфо",
                others: "Інше",
                pages: {
                    calculator: "🐾 Калькулятор Тварин",
                    arm: "💪 Калькулятор Рук",
                    grind: "🏋️‍♂️ Калькулятор Грінду",
                    boosts: "🚀 Бусти",
                    shiny: "✨ Блискучі",
                    secret: "🔮 Секретні Тварини",
                    codes: "🎁 Коди",
                    aura: "🌟 Аура",
                    trainer: "🏆 Тренер",
                    charms: "🔮 Чари",
                    potions: "🧪 Зілля та Їжа",
                    worlds: "🌍 Світи",
                    settings: "⚙️ Налаштування",
                    updates: "📝 Оновлення",
                    help: "🆘 Допомога",
                    peoples: "🙏 Люди"
                },
                auth: {
                    login: "Увійти (Скоро...)"
                }
            },
            ru: {
                menu: "Меню",
                calculator: "Калькулятор", 
                info: "Инфо",
                others: "Другое",
                pages: {
                    calculator: "🐾 Калькулятор Питомцев",
                    arm: "💪 Калькулятор Рук",
                    grind: "🏋️‍♂️ Калькулятор Гринда",
                    boosts: "🚀 Бусты",
                    shiny: "✨ Блестящие",
                    secret: "🔮 Секретные Питомцы",
                    codes: "🎁 Коды",
                    aura: "🌟 Аура",
                    trainer: "🏆 Тренер",
                    charms: "🔮 Чары",
                    potions: "🧪 Зелья и Еда",
                    worlds: "🌍 Миры",
                    settings: "⚙️ Настройки",
                    updates: "📝 Обновления",
                    help: "🆘 Помощь",
                    peoples: "🙏 Люди"
                },
                auth: {
                    login: "Войти (Скоро...)"
                }
            }
        };
        return menuTranslations;
    }
}

// Switch app language
async function switchAppLanguage(lang) {
    console.log(`🌍 Switching language to: ${lang}`);
    
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
    
    // Update language flag buttons
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
    
    console.log(`🌍 App language switched to: ${lang}`);
}

// Update menu text with translations
function updateMenuTranslations() {
    if (!menuTranslations || !currentAppLanguage) return;
    
    const translations = menuTranslations[currentAppLanguage];
    if (!translations) return;
    
    console.log(`📝 Updating menu translations for: ${currentAppLanguage}`);
    
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
            pageButton.textContent = translation;
        }
    });
    
    // Update auth button
    const authButton = document.getElementById('authButton');
    if (authButton && translations.auth && translations.auth.login) {
        authButton.textContent = translations.auth.login;
    }
    
    console.log(`✅ Menu translations updated for ${currentAppLanguage}`);
}

// Update page titles
function updatePageTitles() {
    if (!menuTranslations || !currentAppLanguage) return;
    
    const translations = menuTranslations[currentAppLanguage];
    if (!translations || !translations.pages) return;
    
    console.log(`📝 Updating page titles for: ${currentAppLanguage}`);
    
    // Page title mappings
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
        'settingsPage': 'settings',
        'updatesPage': 'updates',
        'helpPage': 'help',
        'peoplesPage': 'peoples'
    };
    
    // Update each page title
    Object.entries(pageTitleMappings).forEach(([pageId, translationKey]) => {
        const page = document.getElementById(pageId);
        if (page && translations.pages[translationKey]) {
            const titleSelectors = [
                'h1', 
                '.title', 
                '.peoples-title', 
                '.help-title', 
                '.updates-title', 
                '.settings-title',
                '.header-controls h1'
            ];
            
            for (const selector of titleSelectors) {
                const titleElement = page.querySelector(selector);
                if (titleElement) {
                    titleElement.textContent = translations.pages[translationKey];
                    console.log(`✅ Updated title for ${pageId}: ${translations.pages[translationKey]}`);
                    break; // Use first found selector
                }
            }
        }
    });
    
    console.log(`✅ Page titles updated for ${currentAppLanguage}`);
}

// Page switching functionality with persistence
function switchPage(page) {
    console.log(`🔄 Switching to page: ${page}`);
    
    // Save current page
    saveCurrentPage(page);
    
    // Remove active class from all pages and nav buttons
    document.querySelectorAll('.page').forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none';
    });
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    // Add active class to selected page
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.style.display = 'block';
        console.log(`✅ Page ${page}Page activated`);
    } else {
        console.error(`❌ Page ${page}Page not found`);
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
        'settings': 'settings',
        'updates': 'updates',
        'help': 'help',
        'peoples': 'peoples'
    };
    
    const targetButton = document.querySelector(`[data-page="${pageMap[page]}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
        console.log(`✅ Nav button activated for ${page}`);
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
    
    // Initialize based on page type
    const initFunctions = {
        'calculator': 'initializeCalculator',
        'arm': 'initializeArm',
        'grind': 'initializeGrind',
        'shiny': 'initializeShiny',
        'boosts': 'initializeBoosts',
        'trainer': 'initializeTrainer',
        'aura': 'initializeAura',
        'codes': 'initializeCodes',
        'charms': 'initializeCharms',
        'secret': 'initializeSecret',
        'potions': 'initializePotions',
        'worlds': 'initializeWorlds',
        'settings': 'initializeSettings',
        'updates': 'initializeUpdates',
        'help': 'initializeHelp',
        'peoples': 'initializePeoples'
    };
    
    const initFunction = initFunctions[page];
    if (initFunction && typeof window[initFunction] === 'function') {
        try {
            // Reset initialization flags for modules that use them
            const resetFlags = ['secret', 'potions', 'grind', 'peoples', 'help', 'updates', 'settings'];
            if (resetFlags.includes(page)) {
                const flagName = `${page}Initialized`;
                if (typeof window[flagName] !== 'undefined') {
                    window[flagName] = false;
                }
            }
            
            window[initFunction]();
            console.log(`✅ ${initFunction} executed successfully`);
        } catch (error) {
            console.error(`❌ Error executing ${initFunction}:`, error);
        }
    } else {
        console.warn(`⚠️ Initialization function ${initFunction} not found for page: ${page}`);
    }
}

// Category toggle functionality
function toggleCategory(categoryId) {
    console.log(`🔄 Toggling category: ${categoryId}`);
    
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
            console.log(`✅ Category ${categoryId} expanded`);
        } else {
            console.log(`✅ Category ${categoryId} collapsed`);
        }
    } else {
        console.error(`❌ Category elements not found for: ${categoryId}`);
    }
}

// Initialize categories on app start
function initializeCategories() {
    console.log('📂 Initializing categories...');
    // All categories start closed by default
    document.querySelectorAll('.category-buttons').forEach(el => {
        el.classList.remove('expanded');
    });
    document.querySelectorAll('.category-toggle').forEach(el => {
        el.classList.remove('expanded');
    });
    console.log('✅ Categories initialized - all closed by default');
}

// Sidebar functionality
function toggleMobileMenu() {
    console.log('📱 Toggling mobile menu');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        const isOpen = sidebar.classList.contains('open');
        
        if (isOpen) {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        } else {
            sidebar.classList.add('open');
            overlay.classList.add('show');
        }
        
        console.log(`📱 Sidebar ${isOpen ? 'closed' : 'opened'}`);
    } else {
        console.error('❌ Sidebar or overlay not found');
    }
}

function closeSidebar() {
    console.log('📱 Closing sidebar');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        console.log('✅ Sidebar closed');
    }
}

// Disabled auth action
function handleAuthAction() {
    console.log('🔒 Auth action triggered - feature coming soon');
    
    const authBtn = document.getElementById('authButton');
    if (authBtn) {
        const originalText = authBtn.textContent;
        authBtn.textContent = '🔒 Coming Soon!';
        authBtn.style.transform = 'scale(0.95)';
        authBtn.style.transition = 'all 0.2s ease';
        
        setTimeout(() => {
            authBtn.textContent = originalText;
            authBtn.style.transform = 'scale(1)';
        }, 1500);
    }
}

// Settings persistence helpers (memory-based)
function saveSettingsToStorage(key, settings) {
    if (!appStorage.settings) {
        appStorage.settings = {};
    }
    appStorage.settings[key] = settings;
    console.log(`💾 Settings saved to memory for ${key}`);
}

function loadSettingsFromStorage(key) {
    if (appStorage.settings && appStorage.settings[key]) {
        console.log(`📂 Settings loaded from memory for ${key}`);
        return appStorage.settings[key];
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
        console.error('❌ Content not loaded, retrying in 500ms...');
        setTimeout(initializeApp, 500);
        return;
    }
    
    // Load current language
    currentAppLanguage = getCurrentAppLanguage();
    console.log(`🌍 Current language: ${currentAppLanguage}`);
    
    // Load menu translations
    await loadMenuTranslations();
    
    // Update active state of language flags
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
    
    // Initialize event listeners
    setupEventListeners();
    
    // Initialize all modules first
    await initializeAllModules();
    
    // Restore last page or default to calculator
    const lastPage = getCurrentPage();
    console.log(`🔄 Restoring last page: ${lastPage}`);
    
    setTimeout(() => {
        switchPage(lastPage);
        console.log(`✅ Page restored to: ${lastPage}`);
    }, 300);
    
    appInitialized = true;
    console.log('✅ App initialization completed successfully');
}

// Setup event listeners
function setupEventListeners() {
    console.log('🎯 Setting up event listeners...');
    
    // Click outside settings panel handler
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
                const isClickOnUI = e.target.closest('.category-button, .back-btn, .category-switch, .simple-modifier, .category-header, .category-header-modifier, .lang-flag-btn');
                
                if (!isClickInsidePanel && !isClickOnSettingsBtn && !isClickOnUI) {
                    panel.classList.remove('show');
                }
            }
        });
    });
    
    // Sidebar overlay click
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
    
    console.log('✅ Event listeners set up');
}

// Initialize all modules
async function initializeAllModules() {
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
        'initializeSettings',
        'initializeUpdates',
        'initializeHelp',
        'initializePeoples'
    ];

    for (const moduleName of modules) {
        try {
            if (typeof window[moduleName] === 'function') {
                // Add delay for DOM-dependent modules
                const delayedModules = [
                    'initializeSecret', 'initializePotions', 'initializeGrind', 
                    'initializePeoples', 'initializeWorlds', 'initializeHelp',
                    'initializeUpdates', 'initializeSettings'
                ];
                
                if (delayedModules.includes(moduleName)) {
                    setTimeout(() => {
                        try {
                            // Reset initialization flags
                            const flagName = moduleName.replace('initialize', '').toLowerCase() + 'Initialized';
                            if (window[flagName] !== undefined) {
                                window[flagName] = false;
                            }
                            
                            window[moduleName]();
                            console.log(`✅ ${moduleName} initialized (delayed)`);
                        } catch (error) {
                            console.error(`❌ Error initializing ${moduleName}:`, error);
                        }
                    }, 500);
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
        
        // Small delay between modules
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    console.log('✅ All modules initialization completed');
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
    const flagMap = {
        'secret': 'secretInitialized',
        'potions': 'potionsInitialized',
        'grind': 'grindInitialized',
        'peoples': 'peoplesInitialized',
        'help': 'helpInitialized',
        'updates': 'updatesInitialized',
        'settings': 'settingsInitialized'
    };
    
    if (flagMap[moduleName] && typeof window[flagMap[moduleName]] !== 'undefined') {
        window[flagMap[moduleName]] = false;
    }
    
    // Call initialization
    const initFunctionName = `initialize${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;
    if (typeof window[initFunctionName] === 'function') {
        setTimeout(() => {
            try {
                window[initFunctionName]();
                console.log(`✅ ${initFunctionName} force reinitialized`);
            } catch (error) {
                console.error(`❌ Error force reinitializing ${initFunctionName}:`, error);
            }
        }, 100);
    }
}

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

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeApp, 100);
    });
} else {
    setTimeout(initializeApp, 100);
}

console.log('📁 General.js loaded and ready');
