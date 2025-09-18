// Fixed General JavaScript - Working Menu & Page Loading
let currentAppLanguage = 'en';
let menuTranslations = null;
let appInitialized = false;

// Simple storage
const appStorage = {
    currentPage: 'calculator',
    language: 'en',
    categoryStates: {}
};

// Storage functions
function saveToStorage(key, value) {
    appStorage[key] = value;
    try {
        localStorage.setItem(`armHelper_${key}`, JSON.stringify(value));
    } catch (e) {
        console.warn('LocalStorage not available');
    }
}

function loadFromStorage(key, defaultValue = null) {
    try {
        const stored = localStorage.getItem(`armHelper_${key}`);
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.warn('LocalStorage read failed');
    }
    return appStorage[key] || defaultValue;
}

// Helper functions
function saveCurrentPage(page) { saveToStorage('currentPage', page); }
function getCurrentPage() { return loadFromStorage('currentPage', 'calculator'); }
function saveAppLanguage(lang) { saveToStorage('language', lang); }
function getCurrentAppLanguage() { return loadFromStorage('language', 'en'); }

// Language system
async function loadMenuTranslations() {
    if (menuTranslations) return menuTranslations;
    
    try {
        const response = await fetch('languages/menu.json');
        if (response.ok) {
            menuTranslations = await response.json();
            return menuTranslations;
        }
    } catch (error) {
        console.warn('Using fallback translations');
    }
    
    // Fallback translations
    menuTranslations = {
        en: {
            menu: "Menu", calculator: "Calculator", info: "Info", others: "Others",
            pages: {
                calculator: "🐾 Pet Calculator", grind: "🏋️‍♂️ Grind Calculator",
                boosts: "🚀 Boosts", shiny: "✨ Shiny Stats", secret: "🔮 Secret Pets",
                codes: "🎁 Codes", aura: "🌟 Aura", trainer: "🏆 Trainer",
                charms: "🔮 Charms", potions: "🧪 Potions & Food", worlds: "🌍 Worlds",
                settings: "⚙️ Settings", updates: "📝 Updates", help: "🆘 Help", peoples: "🙏 Peoples"
            },
            auth: { login: "Login (Soon...)" }
        },
        uk: {
            menu: "Меню", calculator: "Калькулятор", info: "Інфо", others: "Інше",
            pages: {
                calculator: "🐾 Калькулятор Тварин", grind: "🏋️‍♂️ Калькулятор Грінду",
                boosts: "🚀 Бусти", shiny: "✨ Блискучі", secret: "🔮 Секретні Тварини",
                codes: "🎁 Коди", aura: "🌟 Аура", trainer: "🏆 Тренер",
                charms: "🔮 Чари", potions: "🧪 Зілля та Їжа", worlds: "🌍 Світи",
                settings: "⚙️ Налаштування", updates: "📝 Оновлення", help: "🆘 Допомога", peoples: "🙏 Люди"
            },
            auth: { login: "Увійти (Скоро...)" }
        },
        ru: {
            menu: "Меню", calculator: "Калькулятор", info: "Инфо", others: "Другое",
            pages: {
                calculator: "🐾 Калькулятор Питомцев", grind: "🏋️‍♂️ Калькулятор Гринда",
                boosts: "🚀 Бусты", shiny: "✨ Блестящие", secret: "🔮 Секретные Питомцы",
                codes: "🎁 Коды", aura: "🌟 Аура", trainer: "🏆 Тренер",
                charms: "🔮 Чары", potions: "🧪 Зелья и Еда", worlds: "🌍 Миры",
                settings: "⚙️ Настройки", updates: "📝 Обновления", help: "🆘 Помощь", peoples: "🙏 Люди"
            },
            auth: { login: "Войти (Скоро...)" }
        }
    };
    return menuTranslations;
}

async function switchAppLanguage(lang) {
    if (!menuTranslations) await loadMenuTranslations();
    if (!menuTranslations[lang]) lang = 'en';
    
    currentAppLanguage = lang;
    saveAppLanguage(lang);
    
    document.querySelectorAll('.lang-flag-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    updateMenuTranslations();
    
    document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: lang }
    }));
}

function updateMenuTranslations() {
    if (!menuTranslations?.[currentAppLanguage]) return;
    
    const translations = menuTranslations[currentAppLanguage];
    
    // Update sidebar header
    const sidebarHeader = document.querySelector('.sidebar-header h3');
    if (sidebarHeader) sidebarHeader.textContent = translations.menu;
    
    // Update category headers
    const categoryMappings = {
        calculatorButtons: 'calculator',
        infoButtons: 'info', 
        othersButtons: 'others'
    };
    
    Object.entries(categoryMappings).forEach(([categoryId, key]) => {
        const header = document.querySelector(`[data-category="${categoryId}"] .category-title span:last-child`);
        if (header && translations[key]) {
            header.textContent = translations[key];
        }
    });
    
    // Update page buttons
    Object.entries(translations.pages).forEach(([page, translation]) => {
        const btn = document.querySelector(`[data-page="${page}"]`);
        if (btn) btn.textContent = translation;
    });
    
    // Update auth button
    const authBtn = document.getElementById('authButton');
    if (authBtn && translations.auth?.login) {
        authBtn.textContent = translations.auth.login;
    }
}

// Fixed Category System
function toggleCategory(categoryId) {
    console.log(`Toggling category: ${categoryId}`);
    
    const categoryButtons = document.getElementById(categoryId);
    const toggleIcon = document.querySelector(`[data-category="${categoryId}"] .category-toggle`);
    
    if (!categoryButtons || !toggleIcon) {
        console.error(`Category elements not found for: ${categoryId}`);
        return;
    }
    
    const isExpanded = categoryButtons.classList.contains('expanded');
    
    if (isExpanded) {
        // Close this category
        categoryButtons.classList.remove('expanded');
        toggleIcon.classList.remove('expanded');
        categoryButtons.style.maxHeight = '0';
        appStorage.categoryStates[categoryId] = false;
    } else {
        // Close all categories first
        closeAllCategories();
        // Open this category
        categoryButtons.classList.add('expanded');
        toggleIcon.classList.add('expanded');
        categoryButtons.style.maxHeight = '600px';
        appStorage.categoryStates[categoryId] = true;
    }
    
    saveToStorage('categoryStates', appStorage.categoryStates);
}

function closeAllCategories() {
    document.querySelectorAll('.category-buttons').forEach(el => {
        el.classList.remove('expanded');
        el.style.maxHeight = '0';
    });
    document.querySelectorAll('.category-toggle').forEach(el => {
        el.classList.remove('expanded');
    });
    
    appStorage.categoryStates = {};
}

function restoreCategoryStates() {
    const saved = loadFromStorage('categoryStates', {});
    appStorage.categoryStates = saved;
    
    Object.entries(saved).forEach(([categoryId, isExpanded]) => {
        if (isExpanded) {
            const categoryButtons = document.getElementById(categoryId);
            const toggleIcon = document.querySelector(`[data-category="${categoryId}"] .category-toggle`);
            
            if (categoryButtons && toggleIcon) {
                categoryButtons.classList.add('expanded');
                toggleIcon.classList.add('expanded');
                categoryButtons.style.maxHeight = '600px';
            }
        }
    });
}

// Page switching - FIXED
function switchPage(page) {
    console.log(`Switching to page: ${page}`);
    saveCurrentPage(page);
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none';
    });
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.style.display = 'block';
        console.log(`✅ Page ${page}Page activated`);
    } else {
        console.error(`❌ Page ${page}Page not found`);
    }
    
    // Update active nav button
    const targetBtn = document.querySelector(`[data-page="${page}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
        
        // Auto-expand parent category
        const parentCategory = targetBtn.closest('.category-buttons');
        if (parentCategory && !parentCategory.classList.contains('expanded')) {
            const categoryHeader = document.querySelector(`[data-category="${parentCategory.id}"]`);
            if (categoryHeader) {
                toggleCategory(parentCategory.id);
            }
        }
    }
    
    closeSidebar();
    
    // Initialize page content with delay
    setTimeout(() => {
        initializePageContent(page);
    }, 150);
}

// Initialize page content - ENHANCED
function initializePageContent(page) {
    console.log(`🔄 Initializing content for page: ${page}`);
    
    const initFunctions = {
        calculator: 'initializeCalculator',
        grind: 'initializeGrind',
        shiny: 'initializeShiny',
        boosts: 'initializeBoosts',
        trainer: 'initializeTrainer',
        aura: 'initializeAura',
        codes: 'initializeCodes',
        charms: 'initializeCharms',
        secret: 'initializeSecret',
        potions: 'initializePotions',
        worlds: 'initializeWorlds',
        settings: 'initializeSettings',
        updates: 'initializeUpdates',
        help: 'initializeHelp',
        peoples: 'initializePeoples'
    };
    
    const initFunc = initFunctions[page];
    if (initFunc && typeof window[initFunc] === 'function') {
        try {
            // Reset initialization flags for certain modules
            const moduleFlags = {
                secret: 'secretInitialized',
                potions: 'potionsInitialized',
                grind: 'grindInitialized',
                peoples: 'peoplesInitialized',
                help: 'helpInitialized',
                updates: 'updatesInitialized',
                settings: 'settingsInitialized'
            };
            
            const flagName = moduleFlags[page];
            if (flagName && typeof window[flagName] !== 'undefined') {
                window[flagName] = false;
            }
            
            window[initFunc]();
            console.log(`✅ ${initFunc} executed successfully`);
        } catch (error) {
            console.error(`❌ Error initializing ${page}:`, error);
        }
    } else {
        console.warn(`⚠️ No initialization function found for ${page}`);
    }
}

// Sidebar functions - FIXED
function toggleMobileMenu() {
    console.log('📱 Toggle mobile menu called');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (!sidebar || !overlay) {
        console.error('❌ Sidebar elements not found');
        return;
    }
    
    if (sidebar.classList.contains('open')) {
        console.log('🔒 Closing sidebar');
        closeSidebar();
    } else {
        console.log('🔓 Opening sidebar');
        openSidebar();
    }
}

function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.add('open');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        console.log('✅ Sidebar opened');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
        console.log('✅ Sidebar closed');
    }
}

function handleAuthAction() {
    const authBtn = document.getElementById('authButton');
    if (!authBtn) return;
    
    const originalText = authBtn.textContent;
    authBtn.textContent = '🔒 Coming Soon!';
    authBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ff5252)';
    
    setTimeout(() => {
        authBtn.textContent = originalText;
        authBtn.style.background = '';
    }, 1500);
}

// FIXED Event Listeners Setup
function setupEventListeners() {
    console.log('⚙️ Setting up event listeners...');
    
    // Remove existing listeners first (prevent duplicates)
    const existingListeners = document.querySelectorAll('[data-listener-added]');
    existingListeners.forEach(el => el.removeAttribute('data-listener-added'));
    
    // Mobile menu toggle - FIXED
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle && !mobileToggle.dataset.listenerAdded) {
        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔄 Mobile toggle clicked');
            toggleMobileMenu();
        });
        mobileToggle.dataset.listenerAdded = 'true';
        console.log('✅ Mobile toggle listener added');
    }
    
    // Settings gear button - FIXED
    const settingsGear = document.querySelector('.settings-gear-btn');
    if (settingsGear && !settingsGear.dataset.listenerAdded) {
        settingsGear.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('⚙️ Settings gear clicked');
            switchPage('settings');
        });
        settingsGear.dataset.listenerAdded = 'true';
        console.log('✅ Settings gear listener added');
    }
    
    // Sidebar overlay - FIXED
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay && !overlay.dataset.listenerAdded) {
        overlay.addEventListener('click', (e) => {
            e.preventDefault();
            closeSidebar();
        });
        overlay.dataset.listenerAdded = 'true';
        console.log('✅ Overlay listener added');
    }
    
    // Close sidebar button - FIXED
    const closeSidebarBtn = document.querySelector('.close-sidebar');
    if (closeSidebarBtn && !closeSidebarBtn.dataset.listenerAdded) {
        closeSidebarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeSidebar();
        });
        closeSidebarBtn.dataset.listenerAdded = 'true';
        console.log('✅ Close sidebar listener added');
    }
    
    // Global click handler for dynamic elements - ENHANCED
    document.addEventListener('click', (e) => {
        // Category headers
        const categoryHeader = e.target.closest('.category-header');
        if (categoryHeader) {
            e.preventDefault();
            e.stopPropagation();
            const categoryId = categoryHeader.getAttribute('data-category');
            if (categoryId) {
                console.log(`🔄 Category header clicked: ${categoryId}`);
                toggleCategory(categoryId);
            }
            return;
        }
        
        // Navigation buttons
        const navBtn = e.target.closest('.nav-btn');
        if (navBtn) {
            e.preventDefault();
            e.stopPropagation();
            const page = navBtn.getAttribute('data-page');
            if (page) {
                console.log(`🔄 Nav button clicked: ${page}`);
                switchPage(page);
            }
            return;
        }
        
        // Language buttons
        const langBtn = e.target.closest('.lang-flag-btn');
        if (langBtn) {
            e.preventDefault();
            e.stopPropagation();
            const lang = langBtn.getAttribute('data-lang');
            if (lang) {
                console.log(`🔄 Language button clicked: ${lang}`);
                switchAppLanguage(lang);
            }
            return;
        }
        
        // Auth button
        const authBtn = e.target.closest('#authButton');
        if (authBtn) {
            e.preventDefault();
            e.stopPropagation();
            handleAuthAction();
            return;
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const sidebar = document.getElementById('sidebar');
            if (sidebar?.classList.contains('open')) {
                closeSidebar();
            }
        }
    });
    
    console.log('✅ All event listeners set up successfully');
}

// App initialization - ENHANCED
async function initializeApp() {
    if (appInitialized) {
        console.log('⚠️ App already initialized');
        return;
    }
    
    console.log('🚀 Starting app initialization...');
    
    try {
        // Load language and translations
        currentAppLanguage = getCurrentAppLanguage();
        await loadMenuTranslations();
        
        // Setup event listeners FIRST
        setupEventListeners();
        
        // Update UI
        updateMenuTranslations();
        restoreCategoryStates();
        
        // Initialize modules with delays
        await initializeAllModules();
        
        // Switch to last page or default
        const lastPage = getCurrentPage();
        console.log(`🔄 Switching to page: ${lastPage}`);
        setTimeout(() => switchPage(lastPage), 300);
        
        appInitialized = true;
        console.log('✅ App initialization completed successfully');
        
        document.dispatchEvent(new CustomEvent('appInitialized'));
        
    } catch (error) {
        console.error('❌ App initialization failed:', error);
        appInitialized = false;
    }
}

// Initialize modules - ENHANCED
async function initializeAllModules() {
    console.log('🔧 Initializing all modules...');
    
    const modules = [
        'initializeCalculator', 'initializeGrind', 'initializeBoosts',
        'initializeShiny', 'initializeSecret', 'initializePotions',
        'initializeAura', 'initializeTrainer', 'initializeCharms',
        'initializeCodes', 'initializeWorlds', 'initializeSettings',
        'initializeUpdates', 'initializeHelp', 'initializePeoples'
    ];
    
    let initialized = 0;
    
    for (const moduleName of modules) {
        if (typeof window[moduleName] === 'function') {
            try {
                await new Promise(resolve => setTimeout(resolve, 50)); // Small delay
                window[moduleName]();
                initialized++;
                console.log(`✅ ${moduleName} initialized`);
            } catch (error) {
                console.error(`❌ Error initializing ${moduleName}:`, error);
            }
        } else {
            console.warn(`⚠️ Function ${moduleName} not found`);
        }
    }
    
    console.log(`🔧 Module initialization complete: ${initialized}/${modules.length}`);
}

// Ensure DOM is ready before any operations
function waitForDOM(callback, maxAttempts = 50) {
    if (document.getElementById('app-content') && document.querySelector('.container')) {
        callback();
    } else if (maxAttempts > 0) {
        setTimeout(() => waitForDOM(callback, maxAttempts - 1), 100);
    } else {
        console.error('❌ DOM elements not found after waiting');
    }
}

// Global exports
Object.assign(window, {
    switchPage, toggleMobileMenu, openSidebar, closeSidebar,
    handleAuthAction, initializeApp, toggleCategory,
    switchAppLanguage, getCurrentAppLanguage, saveCurrentPage,
    getCurrentPage, updateMenuTranslations, initializePageContent,
    setupEventListeners, waitForDOM
});

// Enhanced auto-start
function startApp() {
    console.log('🎯 Starting app...');
    
    const initialize = () => {
        waitForDOM(() => {
            console.log('✅ DOM ready, initializing app...');
            setTimeout(initializeApp, 200);
        });
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
}

// Listen for content loaded event
document.addEventListener('contentLoaded', () => {
    console.log('📄 Content loaded event received');
    setTimeout(() => {
        if (!appInitialized) {
            console.log('🔄 Content loaded, reinitializing...');
            initializeApp();
        }
    }, 100);
});

// Start the app
startApp();

console.log('📝 General.js v2.1 loaded with enhanced menu and page loading');
