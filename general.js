// Optimized General JavaScript - Fixed version
let currentAppLanguage = 'en';
let menuTranslations = null;
let appInitialized = false;

// Memory-based storage
const appStorage = {
    currentPage: 'calculator',
    language: 'en',
    settings: {}
};

// Storage functions
function saveCurrentPage(page) {
    appStorage.currentPage = page;
    try {
        localStorage.setItem('armHelper_currentPage', page);
    } catch (e) {
        console.warn('LocalStorage not available');
    }
}

function getCurrentPage() {
    try {
        return localStorage.getItem('armHelper_currentPage') || appStorage.currentPage;
    } catch (e) {
        return appStorage.currentPage;
    }
}

function saveAppLanguage(lang) {
    appStorage.language = lang;
    try {
        localStorage.setItem('armHelper_language', lang);
    } catch (e) {
        console.warn('LocalStorage not available');
    }
}

function getCurrentAppLanguage() {
    try {
        return localStorage.getItem('armHelper_language') || appStorage.language;
    } catch (e) {
        return appStorage.language;
    }
}

function saveSettingsToStorage(key, settings) {
    if (!appStorage.settings) appStorage.settings = {};
    appStorage.settings[key] = settings;
    try {
        localStorage.setItem('armHelper_' + key, JSON.stringify(settings));
    } catch (e) {
        console.warn('LocalStorage not available');
    }
}

function loadSettingsFromStorage(key) {
    try {
        const stored = localStorage.getItem('armHelper_' + key);
        return stored ? JSON.parse(stored) : (appStorage.settings?.[key] || null);
    } catch (e) {
        return appStorage.settings?.[key] || null;
    }
}

// Language functions
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
    
    // Update category headers
    const categoryMappings = {
        calculatorButtons: 'calculator',
        infoButtons: 'info', 
        othersButtons: 'others'
    };
    
    Object.entries(categoryMappings).forEach(([categoryId, key]) => {
        const header = document.querySelector(`[data-category="${categoryId}"] .category-title span:last-child`);
        if (header && translations[key]) header.textContent = translations[key];
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

// Page switching
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
        console.log(`Page ${page} shown`);
    } else {
        console.error(`Page ${page}Page not found`);
    }
    
    // Update active nav button
    const targetBtn = document.querySelector(`[data-page="${page}"]`);
    if (targetBtn) targetBtn.classList.add('active');
    
    closeSidebar();
    setTimeout(() => initializePageContent(page), 100);
}

function initializePageContent(page) {
    const pageContainer = document.getElementById(page + 'Page');
    if (!pageContainer) return;
    
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
            // Reset initialization flags for specific modules
            const resetFlags = ['secret', 'potions', 'grind', 'peoples', 'help', 'updates', 'settings'];
            if (resetFlags.includes(page)) {
                const flagName = page + 'Initialized';
                if (typeof window[flagName] !== 'undefined') window[flagName] = false;
            }
            
            window[initFunc]();
        } catch (error) {
            console.error(`Error initializing ${page}:`, error);
        }
    }
}

// Category functions
function toggleCategory(categoryId) {
    console.log(`Toggling category: ${categoryId}`);
    const categoryButtons = document.getElementById(categoryId);
    const toggleIcon = document.querySelector(`[data-category="${categoryId}"] .category-toggle`);
    
    if (categoryButtons && toggleIcon) {
        const isExpanded = categoryButtons.classList.contains('expanded');
        
        // Close all categories first
        document.querySelectorAll('.category-buttons').forEach(el => el.classList.remove('expanded'));
        document.querySelectorAll('.category-toggle').forEach(el => el.classList.remove('expanded'));
        
        // Toggle current category
        if (!isExpanded) {
            categoryButtons.classList.add('expanded');
            toggleIcon.classList.add('expanded');
        }
    }
}

// Sidebar functions
function toggleMobileMenu() {
    console.log('Toggling mobile menu');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        const isOpen = sidebar.classList.contains('open');
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
        console.log(`Mobile menu ${!isOpen ? 'opened' : 'closed'}`);
    }
}

function closeSidebar() {
    console.log('Closing sidebar');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    }
}

function handleAuthAction() {
    const authBtn = document.getElementById('authButton');
    if (authBtn) {
        const originalText = authBtn.textContent;
        authBtn.textContent = '🔒 Coming Soon!';
        authBtn.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            authBtn.textContent = originalText;
            authBtn.style.transform = 'scale(1)';
        }, 1500);
    }
}

// App initialization
async function initializeApp() {
    if (appInitialized) return;
    
    console.log('Initializing app...');
    
    // Wait for content to be loaded
    const appContent = document.getElementById('app-content');
    if (!appContent?.innerHTML.trim()) {
        console.log('App content not ready, retrying...');
        setTimeout(initializeApp, 200);
        return;
    }
    
    // Load saved state
    currentAppLanguage = getCurrentAppLanguage();
    await loadMenuTranslations();
    
    // Update language flags
    document.querySelectorAll('.lang-flag-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentAppLanguage);
    });
    
    updateMenuTranslations();
    updatePageTitles();
    setupEventListeners();
    
    // Initialize modules
    await initializeAllModules();
    
    // Switch to saved page or default
    const lastPage = getCurrentPage();
    setTimeout(() => switchPage(lastPage), 300);
    
    appInitialized = true;
    console.log('App initialized successfully');
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Settings panels click outside handler
    document.addEventListener('click', e => {
        const panels = [
            { panel: document.getElementById('settingsPanel'), btn: document.querySelector('#calculatorPage .settings-btn') },
            { panel: document.getElementById('settingsPanelGrind'), btn: document.querySelector('#grindPage .settings-btn') }
        ];
        
        panels.forEach(({ panel, btn }) => {
            if (panel && btn) {
                const isInsidePanel = panel.contains(e.target);
                const isSettingsBtn = btn.contains(e.target);
                const isUI = e.target.closest('.category-button, .back-btn, .category-switch, .simple-modifier, .category-header, .lang-flag-btn');
                
                if (!isInsidePanel && !isSettingsBtn && !isUI) {
                    panel.classList.remove('show');
                }
            }
        });
    });
    
    // Mobile menu and sidebar events
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMobileMenu();
        });
    }
    
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }
    
    const settingsGear = document.querySelector('.settings-gear-btn');
    if (settingsGear) {
        settingsGear.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage('settings');
        });
    }
}

async function initializeAllModules() {
    console.log('Initializing all modules...');
    
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
                    }, 500);
                } else {
                    window[moduleName]();
                }
            } catch (error) {
                console.error(`Error initializing ${moduleName}:`, error);
            }
        }
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

// Global exports
Object.assign(window, {
    switchPage, toggleMobileMenu, closeSidebar, handleAuthAction, initializeApp,
    saveSettingsToStorage, loadSettingsFromStorage, toggleCategory,
    switchAppLanguage, getCurrentAppLanguage, saveAppLanguage, updateMenuTranslations,
    updatePageTitles, saveCurrentPage, getCurrentPage
});

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initializeApp, 100));
} else {
    setTimeout(initializeApp, 100);
}
