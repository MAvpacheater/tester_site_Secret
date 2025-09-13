// Optimized General JavaScript - Performance Enhanced

// Global state
let currentAppLanguage = 'en';
let menuTranslations = null;
let appInitialized = false;

// Language management - cached and optimized
function getCurrentAppLanguage() {
    return localStorage.getItem('armHelper_language') || 'en';
}

function saveAppLanguage(lang) {
    localStorage.setItem('armHelper_language', lang);
}

// Load menu translations - cached
async function loadMenuTranslations() {
    if (menuTranslations) return menuTranslations;
    
    try {
        const response = await fetch('languages/menu.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        menuTranslations = await response.json();
        return menuTranslations;
    } catch (error) {
        console.error('Error loading menu translations:', error);
        // Fallback
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
                    help: "🆘 Help",
                    peoples: "🙏 Peoples"
                },
                auth: { login: "Login (Soon...)" }
            }
        };
        return menuTranslations;
    }
}

// Switch app language - optimized
async function switchAppLanguage(lang) {
    if (!menuTranslations) await loadMenuTranslations();
    if (!menuTranslations[lang]) lang = 'en';
    
    const previousLanguage = currentAppLanguage;
    currentAppLanguage = lang;
    saveAppLanguage(lang);
    
    // Update UI immediately - batch DOM operations
    requestAnimationFrame(() => {
        // Update flags
        document.querySelectorAll('.lang-flag-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        updateMenuTranslations();
        updatePageTitles();
    });
    
    // Notify modules
    const languageChangeEvent = new CustomEvent('languageChanged', {
        detail: { language: lang, previousLanguage }
    });
    document.dispatchEvent(languageChangeEvent);
    
    // Notify specific modules - optimized
    const moduleNotifications = [
        'updateWorldsLanguage',
        'updatePotionsLanguage', 
        'updateSecretLanguage',
        'updatePeoplesLanguage',
        'updateHelpLanguage'
    ];
    
    moduleNotifications.forEach(func => {
        if (typeof window[func] === 'function') {
            try {
                window[func](lang);
            } catch (error) {
                console.error(`Error updating language:`, error);
            }
        }
    });
}

// Update menu translations - optimized with batch operations
function updateMenuTranslations() {
    if (!menuTranslations?.[currentAppLanguage]) return;
    
    const translations = menuTranslations[currentAppLanguage];
    
    // Batch DOM updates
    const updates = [
        ['.sidebar-header h3', translations.menu],
        ['#authButton', translations.auth.login]
    ];
    
    updates.forEach(([selector, text]) => {
        const element = document.querySelector(selector);
        if (element && text) element.textContent = text;
    });
    
    // Update categories
    const categoryMappings = {
        'calculatorButtons': 'calculator',
        'infoButtons': 'info', 
        'othersButtons': 'others'
    };
    
    Object.entries(categoryMappings).forEach(([categoryId, key]) => {
        const header = document.querySelector(`[data-category="${categoryId}"] .category-title span:last-child`);
        if (header && translations[key]) {
            header.textContent = translations[key];
        }
    });
    
    // Update page buttons
    Object.entries(translations.pages).forEach(([page, translation]) => {
        const button = document.querySelector(`[data-page="${page}"]`);
        if (button) button.textContent = translation;
    });
}

// Update page titles - optimized
function updatePageTitles() {
    if (!menuTranslations?.[currentAppLanguage]?.pages) return;
    
    const translations = menuTranslations[currentAppLanguage].pages;
    const pageMappings = {
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
        'helpPage': 'help',
        'peoplesPage': 'peoples'
    };
    
    Object.entries(pageMappings).forEach(([pageId, key]) => {
        const page = document.getElementById(pageId);
        if (page && translations[key]) {
            const title = page.querySelector('h1, .title, .peoples-title, .help-title, .header-controls h1');
            if (title) title.textContent = translations[key];
        }
    });
}

// Page switching - optimized
function switchPage(page) {
    // Batch DOM operations
    requestAnimationFrame(() => {
        // Remove active classes
        document.querySelectorAll('.page.active, .nav-btn.active').forEach(el => {
            el.classList.remove('active');
        });
        
        // Add active to target
        const targetPage = document.getElementById(page + 'Page');
        const targetButton = document.querySelector(`[data-page="${page}"]`);
        
        if (targetPage) targetPage.classList.add('active');
        if (targetButton) targetButton.classList.add('active');
    });
    
    closeSidebar();
    
    // Initialize content with delay
    setTimeout(() => initializePageContent(page), 50);
}

// Initialize page content - optimized
function initializePageContent(page) {
    const pageContainer = document.getElementById(page + 'Page');
    if (!pageContainer) return;
    
    const initFunctions = {
        calculator: 'initializeCalculator',
        arm: 'initializeArm',
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
        help: 'initializeHelp',
        peoples: 'initializePeoples'
    };
    
    const initFunc = initFunctions[page];
    if (initFunc && typeof window[initFunc] === 'function') {
        // Reset flags for modules that need it
        const resetFlags = ['secret', 'potions', 'grind', 'peoples', 'help'];
        if (resetFlags.includes(page)) {
            window[page + 'Initialized'] = false;
        }
        
        window[initFunc]();
    }
}

// Category toggle - simplified
function toggleCategory(categoryId) {
    const categoryButtons = document.getElementById(categoryId);
    const toggleIcon = document.querySelector(`[data-category="${categoryId}"] .category-toggle`);
    
    if (!categoryButtons || !toggleIcon) return;
    
    const isExpanded = categoryButtons.classList.contains('expanded');
    
    // Close all categories
    document.querySelectorAll('.category-buttons, .category-toggle').forEach(el => {
        el.classList.remove('expanded');
    });
    
    // Open this category if it wasn't expanded
    if (!isExpanded) {
        categoryButtons.classList.add('expanded');
        toggleIcon.classList.add('expanded');
    }
}

// Sidebar functions - optimized
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

// Settings persistence - optimized
function saveSettingsToStorage(key, settings) {
    localStorage.setItem(`armHelper_${key}_settings`, JSON.stringify(settings));
}

function loadSettingsFromStorage(key) {
    const data = localStorage.getItem(`armHelper_${key}_settings`);
    try {
        return data ? JSON.parse(data) : null;
    } catch (e) {
        return null;
    }
}

// App initialization - optimized (without adding language flags)
async function initializeApp() {
    if (appInitialized) return;
    
    const appContent = document.getElementById('app-content');
    if (!appContent?.innerHTML.trim()) {
        console.error('Content not loaded');
        return;
    }
    
    // Load language and translations
    currentAppLanguage = getCurrentAppLanguage();
    await loadMenuTranslations();
    
    // Update language flags state
    document.querySelectorAll('.lang-flag-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentAppLanguage);
    });
    
    // Update UI
    updateMenuTranslations();
    updatePageTitles();
    
    // Initialize modules
    initializeAllModules();
    
    // Start with calculator page
    setTimeout(() => switchPage('calculator'), 100);
    
    // Settings panel click handler - optimized with event delegation
    document.addEventListener('click', handleOutsideClick);
    
    appInitialized = true;
}

// Outside click handler - optimized
function handleOutsideClick(e) {
    const settingsPanels = document.querySelectorAll('[id^="settingsPanel"]');
    
    settingsPanels.forEach(panel => {
        if (!panel) return;
        
        const isClickInside = panel.contains(e.target);
        const isClickOnButton = e.target.closest('.settings-btn');
        const isClickOnControl = e.target.closest('.category-button, .back-btn, .category-switch, .simple-modifier, .category-header, .category-header-modifier, .lang-flag-btn');
        
        if (!isClickInside && !isClickOnButton && !isClickOnControl) {
            panel.classList.remove('show');
        }
    });
}

// Initialize all modules - optimized
function initializeAllModules() {
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
        'initializeHelp',
        'initializePeoples'
    ];
    
    // Initialize immediately available modules
    modules.forEach(moduleName => {
        if (typeof window[moduleName] === 'function') {
            try {
                window[moduleName]();
            } catch (error) {
                console.error(`Error initializing ${moduleName}:`, error);
            }
        }
    });
}

// Utility functions
function handleAuthAction() {
    console.log('Login feature coming soon...');
}

function forceReinitializeModule(moduleName) {
    const flags = ['secret', 'potions', 'grind', 'peoples', 'help'];
    if (flags.includes(moduleName)) {
        window[moduleName + 'Initialized'] = false;
    }
    
    const initFunc = `initialize${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;
    if (typeof window[initFunc] === 'function') {
        setTimeout(() => window[initFunc](), 50);
    }
}

// Global exports - simplified
Object.assign(window, {
    switchPage,
    toggleMobileMenu,
    closeSidebar,
    handleAuthAction,
    initializeApp,
    saveSettingsToStorage,
    loadSettingsFromStorage,
    toggleCategory,
    forceReinitializeModule,
    switchAppLanguage,
    getCurrentAppLanguage,
    saveAppLanguage,
    updateMenuTranslations,
    updatePageTitles
});
