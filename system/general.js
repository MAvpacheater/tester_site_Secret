// General JavaScript functions - Fixed and optimized

// Global state
let currentAppLanguage = 'en';
let menuTranslations = null;
let appInitialized = false;

// Language management
function getCurrentAppLanguage() {
    const saved = localStorage.getItem('armHelper_language');
    return saved || 'en';
}

function saveAppLanguage(lang) {
    localStorage.setItem('armHelper_language', lang);
    console.log(`App language saved: ${lang}`);
}

// Page state management
function saveCurrentPage(page) {
    localStorage.setItem('armHelper_currentPage', page);
}

function getCurrentPage() {
    return localStorage.getItem('armHelper_currentPage') || 'calculator';
}

// Load menu translations
async function loadMenuTranslations() {
    if (menuTranslations) return menuTranslations;
    
    try {
        const response = await fetch('languages/menu.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        menuTranslations = await response.json();
        console.log('✅ Menu translations loaded');
        return menuTranslations;
    } catch (error) {
        console.error('❌ Error loading menu translations:', error);
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
                    settings: "⚙️ Settings",
                    help: "🆘 Help",
                    peoples: "🙏 Peoples"
                },
                auth: { login: "Login (Soon...)" }
            }
        };
        return menuTranslations;
    }
}

// Switch app language
async function switchAppLanguage(lang) {
    if (!menuTranslations) await loadMenuTranslations();
    
    if (!menuTranslations[lang]) {
        console.error(`❌ Language ${lang} not found, defaulting to English`);
        lang = 'en';
    }
    
    currentAppLanguage = lang;
    saveAppLanguage(lang);
    
    // Update UI
    document.querySelectorAll('.lang-flag-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    updateMenuTranslations();
    updatePageTitles();
    
    // Notify modules about language change
    const languageChangeEvent = new CustomEvent('languageChanged', {
        detail: { language: lang }
    });
    document.dispatchEvent(languageChangeEvent);
    
    console.log(`🌍 App language switched to: ${lang}`);
}

// Update menu text with translations
function updateMenuTranslations() {
    if (!menuTranslations || !currentAppLanguage) return;
    
    const translations = menuTranslations[currentAppLanguage];
    if (!translations) return;
    
    // Update sidebar header
    const sidebarHeader = document.querySelector('.sidebar-header h3');
    if (sidebarHeader) sidebarHeader.textContent = translations.menu;
    
    // Update page buttons
    Object.entries(translations.pages).forEach(([page, translation]) => {
        const pageButton = document.querySelector(`[data-page="${page}"]`);
        if (pageButton) pageButton.textContent = translation;
    });
    
    // Update auth button
    const authButton = document.getElementById('authButton');
    if (authButton && translations.auth.login) {
        authButton.textContent = translations.auth.login;
    }
}

// Update page titles
function updatePageTitles() {
    if (!menuTranslations || !currentAppLanguage) return;
    
    const translations = menuTranslations[currentAppLanguage];
    if (!translations || !translations.pages) return;
    
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
        'helpPage': 'help',
        'peoplesPage': 'peoples'
    };
    
    Object.entries(pageTitleMappings).forEach(([pageId, translationKey]) => {
        const page = document.getElementById(pageId);
        if (page && translations.pages[translationKey]) {
            const titleElement = page.querySelector('h1, .title, .peoples-title, .help-title, .settings-title');
            if (titleElement) {
                titleElement.textContent = translations.pages[translationKey];
            }
        }
    });
}

// Page switching
function switchPage(page) {
    console.log(`Switching to page: ${page}`);
    
    saveCurrentPage(page);
    
    // Remove active class from all pages and nav buttons
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    // Add active class to selected page
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
    } else {
        console.error(`Page ${page}Page not found`);
    }
    
    // Update active nav button
    const targetButton = document.querySelector(`[data-page="${page}"]`);
    if (targetButton) targetButton.classList.add('active');
    
    closeSidebar();
    
    // Initialize page content
    setTimeout(() => initializePageContent(page), 100);
}

// Initialize specific page content
function initializePageContent(page) {
    const pageContainer = document.getElementById(page + 'Page');
    if (!pageContainer) {
        console.error(`❌ Page container ${page}Page not found`);
        return;
    }
    
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
        'help': 'initializeHelp',
        'peoples': 'initializePeoples'
    };
    
    const initFunction = initFunctions[page];
    if (typeof window[initFunction] === 'function') {
        window[initFunction]();
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

// Settings storage helpers
function saveSettingsToStorage(key, settings) {
    localStorage.setItem(`armHelper_${key}_settings`, JSON.stringify(settings));
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

// App initialization
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
    
    // Update active state of language flags
    document.querySelectorAll('.lang-flag-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentAppLanguage);
    });
    
    // Update menu translations and page titles
    updateMenuTranslations();
    updatePageTitles();
    
    // Load all modules
    await loadAllModules();
    
    // Restore last page or default to calculator
    const lastPage = getCurrentPage();
    setTimeout(() => {
        switchPage(lastPage);
        console.log(`✅ Page restored to: ${lastPage}`);
    }, 200);
    
    appInitialized = true;
    console.log('✅ App initialization completed');
}

// Load all modules
async function loadAllModules() {
    const modules = [
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
        'other/peoples.js',
        'other/help.js'
    ];
    
    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                console.log(`✅ Loaded: ${src}`);
                resolve();
            };
            script.onerror = () => {
                console.warn(`⚠️ Failed to load: ${src}`);
                resolve();
            };
            document.head.appendChild(script);
        });
    };
    
    try {
        // Load all modules in parallel
        await Promise.all(modules.map(loadScript));
        console.log('✅ All modules loaded');
    } catch (error) {
        console.error('❌ Error loading modules:', error);
    }
}

// Global functions
window.switchPage = switchPage;
window.toggleMobileMenu = toggleMobileMenu;
window.closeSidebar = closeSidebar;
window.initializeApp = initializeApp;
window.switchAppLanguage = switchAppLanguage;
window.getCurrentAppLanguage = getCurrentAppLanguage;
window.saveCurrentPage = saveCurrentPage;
window.getCurrentPage = getCurrentPage;
window.toggleCategory = toggleCategory;
window.saveSettingsToStorage = saveSettingsToStorage;
window.loadSettingsFromStorage = loadSettingsFromStorage;
