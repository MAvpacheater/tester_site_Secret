// Optimized General JavaScript - Fixed Category System
let currentAppLanguage = 'en';
let menuTranslations = null;
let appInitialized = false;

// Memory-based storage with fallback
const appStorage = {
    currentPage: 'calculator',
    language: 'en',
    settings: {},
    categoryStates: {
        calculatorButtons: false,
        infoButtons: false,
        othersButtons: false
    }
};

// Enhanced storage functions
function saveToStorage(key, value) {
    appStorage[key] = value;
    try {
        localStorage.setItem(`armHelper_${key}`, typeof value === 'string' ? value : JSON.stringify(value));
    } catch (e) {
        console.warn('LocalStorage not available, using memory storage');
    }
}

function loadFromStorage(key, defaultValue = null) {
    try {
        const stored = localStorage.getItem(`armHelper_${key}`);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                return stored;
            }
        }
    } catch (e) {
        console.warn('LocalStorage read failed');
    }
    return appStorage[key] || defaultValue;
}

// Simplified storage functions for compatibility
function saveCurrentPage(page) {
    saveToStorage('currentPage', page);
}

function getCurrentPage() {
    return loadFromStorage('currentPage', 'calculator');
}

function saveAppLanguage(lang) {
    saveToStorage('language', lang);
}

function getCurrentAppLanguage() {
    return loadFromStorage('language', 'en');
}

function saveSettingsToStorage(key, settings) {
    if (!appStorage.settings) appStorage.settings = {};
    appStorage.settings[key] = settings;
    saveToStorage(`settings_${key}`, settings);
}

function loadSettingsFromStorage(key) {
    return loadFromStorage(`settings_${key}`, null);
}

function saveCategoryStates() {
    saveToStorage('categoryStates', appStorage.categoryStates);
}

function loadCategoryStates() {
    const saved = loadFromStorage('categoryStates', {});
    appStorage.categoryStates = {
        calculatorButtons: false,
        infoButtons: false,
        othersButtons: false,
        ...saved
    };
}

// Enhanced language functions with caching
async function loadMenuTranslations() {
    if (menuTranslations) return menuTranslations;
    
    try {
        const response = await fetch('languages/menu.json');
        if (response.ok) {
            menuTranslations = await response.json();
            return menuTranslations;
        }
    } catch (error) {
        console.warn('Using fallback translations:', error);
    }
    
    // Enhanced fallback translations
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
    
    const previousLanguage = currentAppLanguage;
    currentAppLanguage = lang;
    saveAppLanguage(lang);
    
    // Update language flag buttons
    document.querySelectorAll('.lang-flag-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    updateMenuTranslations();
    updatePageTitles();
    
    // Dispatch language change event
    document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: lang, previousLanguage }
    }));
}

function updateMenuTranslations() {
    if (!menuTranslations?.[currentAppLanguage]) return;
    
    const translations = menuTranslations[currentAppLanguage];
    
    // Update sidebar header
    const sidebarHeader = document.querySelector('.sidebar-header h3');
    if (sidebarHeader) sidebarHeader.textContent = translations.menu;
    
    // Update category headers with mapping
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

function updatePageTitles() {
    if (!menuTranslations?.[currentAppLanguage]?.pages) return;
    
    const translations = menuTranslations[currentAppLanguage].pages;
    const pageMappings = {
        calculatorPage: 'calculator', grindPage: 'grind',
        boostsPage: 'boosts', shinyPage: 'shiny', secretPage: 'secret',
        codesPage: 'codes', auraPage: 'aura', trainerPage: 'trainer',
        charmsPage: 'charms', potionsPage: 'potions', worldsPage: 'worlds',
        settingsPage: 'settings', updatesPage: 'updates', helpPage: 'help', peoplesPage: 'peoples'
    };
    
    Object.entries(pageMappings).forEach(([pageId, key]) => {
        const page = document.getElementById(pageId);
        if (page && translations[key]) {
            const selectors = ['h1', '.title', '.peoples-title', '.help-title', '.updates-title', '.settings-title', '.header-controls h1'];
            const titleEl = selectors.map(sel => page.querySelector(sel)).find(el => el);
            if (titleEl) titleEl.textContent = translations[key];
        }
    });
}

// Enhanced page switching with validation
function switchPage(page) {
    if (!page) {
        console.error('No page specified for switching');
        return;
    }
    
    console.log(`Switching to page: ${page}`);
    saveCurrentPage(page);
    
    // Hide all pages efficiently
    const allPages = document.querySelectorAll('.page');
    const allNavBtns = document.querySelectorAll('.nav-btn');
    
    allPages.forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none';
    });
    allNavBtns.forEach(el => el.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.style.display = 'block';
        console.log(`✅ Page ${page} shown successfully`);
    } else {
        console.error(`❌ Page ${page}Page not found`);
        return;
    }
    
    // Update active nav button
    const targetBtn = document.querySelector(`[data-page="${page}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
        // Auto-expand parent category
        const parentCategory = targetBtn.closest('.category-buttons');
        if (parentCategory) {
            const categoryId = parentCategory.id;
            if (categoryId && !parentCategory.classList.contains('expanded')) {
                expandCategory(categoryId);
            }
        }
    }
    
    closeSidebar();
    // Delayed initialization to ensure DOM is ready
    requestAnimationFrame(() => {
        setTimeout(() => initializePageContent(page), 50);
    });
}

function initializePageContent(page) {
    const pageContainer = document.getElementById(page + 'Page');
    if (!pageContainer) {
        console.warn(`Page container ${page}Page not found`);
        return;
    }
    
    const initFunctions = {
        calculator: 'initializeCalculator', grind: 'initializeGrind',
        shiny: 'initializeShiny', boosts: 'initializeBoosts', trainer: 'initializeTrainer',
        aura: 'initializeAura', codes: 'initializeCodes', charms: 'initializeCharms',
        secret: 'initializeSecret', potions: 'initializePotions', worlds: 'initializeWorlds',
        settings: 'initializeSettings', updates: 'initializeUpdates', help: 'initializeHelp', peoples: 'initializePeoples'
    };
    
    const initFunc = initFunctions[page];
    if (initFunc && typeof window[initFunc] === 'function') {
        try {
            // Reset initialization flags for modules that need it
            const resetModules = ['secret', 'potions', 'grind', 'peoples', 'help', 'updates', 'settings'];
            if (resetModules.includes(page)) {
                const flagName = page + 'Initialized';
                if (typeof window[flagName] !== 'undefined') {
                    window[flagName] = false;
                }
            }
            
            window[initFunc]();
            console.log(`✅ ${initFunc} initialized successfully`);
        } catch (error) {
            console.error(`❌ Error initializing ${page}:`, error);
        }
    } else {
        console.warn(`No initialization function found for page: ${page}`);
    }
}

// Fixed and optimized category functions
function toggleCategory(categoryId) {
    if (!categoryId) {
        console.error('No category ID provided');
        return;
    }
    
    console.log(`Toggling category: ${categoryId}`);
    
    const categoryButtons = document.getElementById(categoryId);
    const toggleIcon = document.querySelector(`[data-category="${categoryId}"] .category-toggle`);
    
    if (!categoryButtons || !toggleIcon) {
        console.error(`Category elements not found for: ${categoryId}`);
        return;
    }
    
    const isCurrentlyExpanded = categoryButtons.classList.contains('expanded');
    
    // Close all categories first
    closeAllCategories();
    
    // Toggle current category if it wasn't expanded
    if (!isCurrentlyExpanded) {
        expandCategory(categoryId);
    }
    
    saveCategoryStates();
}

function expandCategory(categoryId) {
    const categoryButtons = document.getElementById(categoryId);
    const toggleIcon = document.querySelector(`[data-category="${categoryId}"] .category-toggle`);
    
    if (categoryButtons && toggleIcon) {
        categoryButtons.classList.add('expanded');
        toggleIcon.classList.add('expanded');
        appStorage.categoryStates[categoryId] = true;
        
        // Smooth animation
        categoryButtons.style.maxHeight = '800px';
        
        console.log(`✅ Category ${categoryId} expanded`);
    }
}

function closeAllCategories() {
    document.querySelectorAll('.category-buttons').forEach(el => {
        el.classList.remove('expanded');
        el.style.maxHeight = '0';
    });
    document.querySelectorAll('.category-toggle').forEach(el => {
        el.classList.remove('expanded');
    });
    
    // Reset all states
    Object.keys(appStorage.categoryStates).forEach(key => {
        appStorage.categoryStates[key] = false;
    });
}

function restoreCategoryStates() {
    loadCategoryStates();
    Object.entries(appStorage.categoryStates).forEach(([categoryId, isExpanded]) => {
        if (isExpanded) {
            expandCategory(categoryId);
        }
    });
}

// Optimized sidebar functions
function toggleMobileMenu() {
    console.log('Toggling mobile menu');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (!sidebar || !overlay) {
        console.error('Sidebar elements not found');
        return;
    }
    
    const isOpen = sidebar.classList.contains('open');
    
    if (isOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.add('open');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        console.log('✅ Sidebar opened');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        document.body.style.overflow = ''; // Restore scroll
        console.log('✅ Sidebar closed');
    }
}

function handleAuthAction() {
    const authBtn = document.getElementById('authButton');
    if (!authBtn) return;
    
    const originalText = authBtn.textContent;
    const originalBg = authBtn.style.background;
    
    // Visual feedback
    authBtn.textContent = '🔒 Coming Soon!';
    authBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ff5252)';
    authBtn.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        authBtn.textContent = originalText;
        authBtn.style.background = originalBg;
        authBtn.style.transform = 'scale(1)';
    }, 1500);
}

// Enhanced app initialization
async function initializeApp() {
    if (appInitialized) {
        console.log('App already initialized');
        return;
    }
    
    console.log('🚀 Initializing app...');
    
    // Wait for content to be loaded with timeout
    const appContent = document.getElementById('app-content');
    let attempts = 0;
    const maxAttempts = 20;
    
    while ((!appContent || !appContent.innerHTML.trim()) && attempts < maxAttempts) {
        console.log(`Waiting for app content... (${attempts + 1}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 200));
        attempts++;
    }
    
    if (attempts >= maxAttempts) {
        console.error('❌ App content failed to load within timeout');
        return;
    }
    
    try {
        // Load saved state
        currentAppLanguage = getCurrentAppLanguage();
        await loadMenuTranslations();
        
        // Setup UI
        updateLanguageFlags();
        updateMenuTranslations();
        updatePageTitles();
        setupEventListeners();
        restoreCategoryStates();
        
        // Initialize modules
        await initializeAllModules();
        
        // Switch to saved page or default
        const lastPage = getCurrentPage();
        setTimeout(() => switchPage(lastPage), 300);
        
        appInitialized = true;
        console.log('✅ App initialized successfully');
        
        // Dispatch initialization complete event
        document.dispatchEvent(new CustomEvent('appInitialized'));
        
    } catch (error) {
        console.error('❌ App initialization failed:', error);
    }
}

function updateLanguageFlags() {
    document.querySelectorAll('.lang-flag-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentAppLanguage);
    });
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Global click handler for settings panels
    document.addEventListener('click', handleGlobalClick);
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
    }
    
    // Sidebar overlay
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }
    
    // Settings gear button
    const settingsGear = document.querySelector('.settings-gear-btn');
    if (settingsGear) {
        settingsGear.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage('settings');
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    console.log('✅ Event listeners set up successfully');
}

function handleGlobalClick(e) {
    const panels = [
        { panel: document.getElementById('settingsPanel'), btn: document.querySelector('#calculatorPage .settings-btn') },
        { panel: document.getElementById('settingsPanelGrind'), btn: document.querySelector('#grindPage .settings-btn') }
    ];
    
    panels.forEach(({ panel, btn }) => {
        if (panel && btn) {
            const isInsidePanel = panel.contains(e.target);
            const isSettingsBtn = btn.contains(e.target);
            const isUI = e.target.closest('.category-button, .back-btn, .category-switch, .simple-modifier, .category-header, .lang-flag-btn, .mobile-menu-toggle, .settings-gear-btn');
            
            if (!isInsidePanel && !isSettingsBtn && !isUI) {
                panel.classList.remove('show');
            }
        }
    });
}

function handleKeyboardShortcuts(e) {
    // ESC to close sidebar
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            e.preventDefault();
            closeSidebar();
        }
    }
    
    // Ctrl/Cmd + M to toggle menu
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        toggleMobileMenu();
    }
}

async function initializeAllModules() {
    console.log('🔄 Initializing all modules...');
    
    const modules = [
        'initializeCalculator', 'initializeGrind', 'initializeBoosts',
        'initializeShiny', 'initializeSecret', 'initializePotions', 'initializeAura',
        'initializeTrainer', 'initializeCharms', 'initializeCodes', 'initializeWorlds',
        'initializeSettings', 'initializeUpdates', 'initializeHelp', 'initializePeoples'
    ];
    
    const delayedModules = ['initializeSecret', 'initializePotions', 'initializeGrind', 'initializePeoples', 'initializeWorlds', 'initializeHelp', 'initializeUpdates', 'initializeSettings'];
    
    for (const moduleName of modules) {
        if (typeof window[moduleName] === 'function') {
            try {
                if (delayedModules.includes(moduleName)) {
                    setTimeout(() => {
                        const flagName = moduleName.replace('initialize', '').toLowerCase() + 'Initialized';
                        if (window[flagName] !== undefined) window[flagName] = false;
                        window[moduleName]();
                    }, 500 + Math.random() * 200); // Add slight randomization to prevent conflicts
                } else {
                    window[moduleName]();
                }
            } catch (error) {
                console.error(`❌ Error initializing ${moduleName}:`, error);
            }
        }
        
        // Small delay between initializations
        await new Promise(resolve => setTimeout(resolve, 30));
    }
    
    console.log('✅ All modules initialization completed');
}

// Global exports with namespace protection
const globalExports = {
    switchPage, toggleMobileMenu, openSidebar, closeSidebar, handleAuthAction, initializeApp,
    saveSettingsToStorage, loadSettingsFromStorage, toggleCategory, expandCategory, closeAllCategories,
    switchAppLanguage, getCurrentAppLanguage, saveAppLanguage, updateMenuTranslations,
    updatePageTitles, saveCurrentPage, getCurrentPage, saveCategoryStates, loadCategoryStates,
    restoreCategoryStates, updateLanguageFlags
};

Object.assign(window, globalExports);

// Enhanced auto-initialization with error handling
function startApp() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeApp, 100);
        });
    } else {
        setTimeout(initializeApp, 100);
    }
}

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error caught:', e.error);
    // Attempt recovery
    if (!appInitialized) {
        console.log('Attempting app recovery...');
        setTimeout(initializeApp, 1000);
    }
});

// Start the application
startApp();
