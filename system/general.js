// General JavaScript functions - Fixed language button handling

let currentAppLanguage = 'en';
let menuTranslations = null;
let appInitialized = false;

const storage = {
    save: (key, value) => {
        const fullKey = `armHelper_${key}`;
        const data = typeof value === 'object' ? JSON.stringify(value) : value;
        localStorage.setItem(fullKey, data);
    },
    load: (key, parse = false) => {
        const data = localStorage.getItem(`armHelper_${key}`);
        if (!data) return null;
        return parse ? JSON.parse(data) : data;
    }
};

function saveCurrentPage(page) {
    localStorage.setItem('armHelper_currentPage', page);
}

function getCurrentPage() {
    return localStorage.getItem('armHelper_currentPage') || 'calculator';
}

function getCurrentAppLanguage() {
    return localStorage.getItem('armHelper_language') || 'en';
}

function saveAppLanguage(lang) {
    localStorage.setItem('armHelper_language', lang);
    console.log(`💾 Language saved to localStorage: ${lang}`);
}

function getCurrentMenuPosition() {
    return localStorage.getItem('armHelper_menuPosition') || 'left';
}

function saveSettingsToStorage(key, settings) {
    localStorage.setItem(`armHelper_${key}_settings`, JSON.stringify(settings));
}

function loadSettingsFromStorage(key) {
    const localSettings = localStorage.getItem(`armHelper_${key}_settings`);
    if (localSettings) {
        try {
            return JSON.parse(localSettings);
        } catch (e) {
            return null;
        }
    }
    return null;
}

// Menu translations
async function loadMenuTranslations() {
    if (menuTranslations) return menuTranslations;
    
    try {
        const response = await fetch('moderation/menu.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        menuTranslations = await response.json();
        console.log('✅ Menu translations loaded');
        return menuTranslations;
    } catch (error) {
        console.error('❌ Error loading menu translations:', error);
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
                    roulette: "🎰 Roulette Calculator",
                    boss: "👹 Boss Calculator",
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
                    peoples: "🙏 Peoples",
                    trader: "🛒 Trader Store"
                },
                auth: { login: "Login (Soon...)" }
            }
        };
        return menuTranslations;
    }
}

function updateMenuTranslations() {
    if (!menuTranslations || !currentAppLanguage) return;
    
    const translations = menuTranslations[currentAppLanguage];
    if (!translations) return;
    
    const sidebarHeader = document.querySelector('.sidebar-header h3');
    if (sidebarHeader) sidebarHeader.textContent = translations.menu;
    
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
    
    Object.entries(translations.pages).forEach(([page, translation]) => {
        const pageButton = document.querySelector(`[data-page="${page}"]`);
        if (pageButton) pageButton.textContent = translation;
    });
    
    const authButton = document.getElementById('authButton');
    if (authButton && translations.auth.login) {
        authButton.textContent = translations.auth.login;
    }
}

function updatePageTitles() {
    if (!menuTranslations || !currentAppLanguage) return;
    
    const translations = menuTranslations[currentAppLanguage];
    if (!translations || !translations.pages) return;
    
    const pageTitleMappings = {
        'calculatorPage': 'calculator',
        'armPage': 'arm',
        'grindPage': 'grind',
        'roulettePage': 'roulette',
        'bossPage': 'boss',
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
        'peoplesPage': 'peoples',
        'traderPage': 'trader'
    };
    
    Object.entries(pageTitleMappings).forEach(([pageId, translationKey]) => {
        const page = document.getElementById(pageId);
        if (page && translations.pages[translationKey]) {
            const titleElement = page.querySelector('h1, .title, .peoples-title, .help-title, .settings-title, .trader-title');
            if (titleElement) titleElement.textContent = translations.pages[translationKey];
            
            const headerControlsTitle = page.querySelector('.header-controls h1');
            if (headerControlsTitle) headerControlsTitle.textContent = translations.pages[translationKey];
        }
    });
}

async function switchAppLanguage(lang) {
    console.log('=== LANGUAGE SWITCH START ===');
    console.log('🌐 Switching from', currentAppLanguage, 'to', lang);
    
    if (!menuTranslations) {
        console.log('📥 Loading translations...');
        await loadMenuTranslations();
    }
    
    if (!menuTranslations[lang]) {
        console.error(`❌ Language ${lang} not found, defaulting to English`);
        lang = 'en';
    }
    
    const previousLanguage = currentAppLanguage;
    currentAppLanguage = lang;
    saveAppLanguage(lang);
    
    console.log(`✅ Language changed: ${previousLanguage} → ${lang}`);
    
    // Update button states
    updateLanguageButtonStates();
    
    // Update UI
    updateMenuTranslations();
    updatePageTitles();
    
    // Dispatch event for modules
    const languageChangeEvent = new CustomEvent('languageChanged', {
        detail: { language: lang, previousLanguage: previousLanguage }
    });
    document.dispatchEvent(languageChangeEvent);
    
    // Notify specific modules
    const moduleNotifications = [
        { name: 'roulette', func: 'updateRouletteLanguage' },
        { name: 'boss', func: 'updateBossLanguage' },
        { name: 'worlds', func: 'updateWorldsLanguage' },
        { name: 'potions', func: 'updatePotionsLanguage' },
        { name: 'secret', func: 'updateSecretLanguage' },
        { name: 'peoples', func: 'updatePeoplesLanguage' },
        { name: 'help', func: 'updateHelpLanguage' },
        { name: 'settings', func: 'updateSettingsLanguage' },
        { name: 'trader', func: 'updateTraderLanguage' }
    ];
    
    moduleNotifications.forEach(({ name, func }) => {
        if (typeof window[func] === 'function') {
            try {
                window[func](lang);
                console.log(`✅ Updated ${name} module`);
            } catch (error) {
                console.error(`❌ Error updating ${name}:`, error);
            }
        }
    });
    
    console.log('=== LANGUAGE SWITCH END ===');
}

function setupLanguageButtons() {
    console.log('🔧 Setting up language buttons...');
    
    const langButtons = document.querySelectorAll('.lang-flag-btn');
    console.log(`📍 Found ${langButtons.length} language buttons`);
    
    langButtons.forEach((btn, index) => {
        const lang = btn.getAttribute('data-lang');
        console.log(`🔘 Button ${index}: lang="${lang}"`);
        
        // Remove all existing event listeners by cloning
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Add new click handler
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetLang = this.getAttribute('data-lang');
            console.log('🖱️ Language button clicked:', targetLang);
            
            if (targetLang && targetLang !== currentAppLanguage) {
                console.log(`🔄 Switching language: ${currentAppLanguage} → ${targetLang}`);
                switchAppLanguage(targetLang);
            } else {
                console.log('⏭️ Same language or invalid, skipping');
            }
        });
        
        // Add visual feedback
        newBtn.style.cursor = 'pointer';
        newBtn.style.userSelect = 'none';
        
        console.log(`✅ Button "${lang}" setup complete`);
    });
    
    // Set initial active state
    updateLanguageButtonStates();
    console.log('✅ Language buttons setup complete');
}

function updateLanguageButtonStates() {
    const buttons = document.querySelectorAll('.lang-flag-btn');
    console.log(`🔄 Updating ${buttons.length} button states (current: ${currentAppLanguage})`);
    
    buttons.forEach(btn => {
        const btnLang = btn.getAttribute('data-lang');
        const isActive = btnLang === currentAppLanguage;
        
        if (isActive) {
            btn.classList.add('active');
            console.log(`✅ ${btnLang}: ACTIVE`);
        } else {
            btn.classList.remove('active');
            console.log(`⚪ ${btnLang}: inactive`);
        }
    });
}

function switchPage(page) {
    saveCurrentPage(page);
    
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    const targetButton = document.querySelector(`[data-page="${page}"]`);
    if (targetButton) targetButton.classList.add('active');
    
    if (typeof window.menuManager !== 'undefined' && window.menuManager.updateActiveState) {
        window.menuManager.updateActiveState(page);
    }
    
    const currentMenuType = getCurrentMenuPosition();
    if (currentMenuType === 'left' || currentMenuType === 'right') {
        closeSidebar();
    }
    
    const pageChangeEvent = new CustomEvent('pageChanged', {
        detail: { page: page, previousPage: getCurrentPage() }
    });
    document.dispatchEvent(pageChangeEvent);
    
    setTimeout(() => initializePageContent(page), 100);
}

function initializePageContent(page) {
    const pageContainer = document.getElementById(page + 'Page');
    if (!pageContainer) return;
    
    const modules = {
        calculator: 'initializeCalculator',
        arm: 'initializeArm',
        grind: 'initializeGrind',
        roulette: 'initializeRoulette',
        boss: 'initializeBoss',
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
        help: 'initializeHelp',
        peoples: 'initializePeoples',
        trader: 'initializeTrader'
    };
    
    const initFunc = modules[page];
    if (initFunc && typeof window[initFunc] === 'function') {
        const needsReset = ['grind', 'roulette', 'boss', 'secret', 'potions', 'help', 'peoples', 'settings', 'trader'];
        if (needsReset.includes(page) && window[`${page}Initialized`] !== undefined) {
            window[`${page}Initialized`] = false;
        }
        window[initFunc]();
    }
}

function initializeAllModules() {
    const modules = [
        'Calculator', 'Arm', 'Grind', 'Roulette', 'Boss', 'Boosts', 'Shiny', 'Secret',
        'Potions', 'Aura', 'Trainer', 'Charms', 'Codes', 'Worlds', 'Settings', 'Help', 'Peoples', 'Trader'
    ];
    
    modules.forEach(name => {
        const funcName = `initialize${name}`;
        if (typeof window[funcName] === 'function') {
            const needsDelay = ['Secret', 'Potions', 'Grind', 'Peoples', 'Worlds', 'Help', 'Settings', 'Roulette', 'Boss', 'Trader'];
            
            if (needsDelay.includes(name)) {
                setTimeout(() => {
                    const flagName = `${name.toLowerCase()}Initialized`;
                    if (window[flagName] !== undefined) window[flagName] = false;
                    window[funcName]();
                }, 300);
            } else {
                window[funcName]();
            }
        }
    });
}

async function initializeApp() {
    if (appInitialized) {
        console.log('⚠️ App already initialized');
        return;
    }
    
    const appContent = document.getElementById('app-content');
    if (!appContent || !appContent.innerHTML.trim()) {
        console.log('⏳ Waiting for app content...');
        return;
    }
    
    console.log('🚀 Initializing app...');
    
    // Load saved language
    currentAppLanguage = getCurrentAppLanguage();
    console.log(`📝 Loaded language: ${currentAppLanguage}`);
    
    // Load translations
    await loadMenuTranslations();
    
    // Setup language buttons with delay to ensure DOM is ready
    setTimeout(() => {
        setupLanguageButtons();
        console.log('✅ Language buttons initialized');
    }, 500);
    
    // Update UI with current language
    updateMenuTranslations();
    updatePageTitles();
    
    // Initialize categories
    initializeCategories();
    
    // Initialize all modules
    initializeAllModules();
    
    // Apply menu position and restore page
    setTimeout(() => {
        if (typeof window.menuManager !== 'undefined') {
            const currentMenuPos = getCurrentMenuPosition();
            if (typeof window.applyMenuPosition === 'function') {
                window.applyMenuPosition(currentMenuPos);
            }
        }
        
        const lastPage = getCurrentPage();
        setTimeout(() => switchPage(lastPage), 200);
    }, 300);
    
    // Close panels on outside click
    document.addEventListener('click', e => {
        const settingsPanels = [
            { panel: document.getElementById('settingsPanel'), btn: document.querySelector('#calculatorPage .settings-btn') },
            { panel: document.getElementById('settingsPanelArm'), btn: document.querySelector('#armPage .settings-btn') },
            { panel: document.getElementById('settingsPanelGrind'), btn: document.querySelector('#grindPage .settings-btn') }
        ];
        
        settingsPanels.forEach(({ panel, btn }) => {
            if (panel && btn && panel.dataset.justOpened !== 'true') {
                const shouldKeepOpen = panel.contains(e.target) || btn.contains(e.target) || 
                    e.target.closest('.category-button, .back-btn, .category-switch, .simple-modifier, .category-header, .category-header-modifier, .lang-flag-btn');
                
                if (!shouldKeepOpen && panel.classList.contains('show')) {
                    panel.classList.remove('show');
                }
            }
        });
    });

    appInitialized = true;
    console.log('✅ App initialized successfully');
}

function toggleCategory(categoryId) {
    const categoryButtons = document.getElementById(categoryId);
    const toggleIcon = document.querySelector(`[data-category="${categoryId}"] .category-toggle`);
    
    if (categoryButtons && toggleIcon) {
        const isExpanded = categoryButtons.classList.contains('expanded');
        
        document.querySelectorAll('.category-buttons').forEach(el => el.classList.remove('expanded'));
        document.querySelectorAll('.category-toggle').forEach(el => el.classList.remove('expanded'));
        
        if (!isExpanded) {
            categoryButtons.classList.add('expanded');
            toggleIcon.classList.add('expanded');
        }
    }
}

function initializeCategories() {
    console.log('🔧 Initializing categories...');
    // Setup language buttons will be called after DOM is ready
}

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

function handleAuthAction() {
    console.log('Login feature coming soon...');
}

function debugPageStates() {
    document.querySelectorAll('.page').forEach(page => {
        console.log(`${page.id}: ${page.classList.contains('active') ? 'ACTIVE' : 'INACTIVE'}`);
    });
    console.log(`Current saved page: ${getCurrentPage()}`);
}

function forceReinitializeModule(moduleName) {
    const modules = ['secret', 'potions', 'grind', 'peoples', 'help', 'settings', 'roulette', 'boss', 'trader'];
    
    if (modules.includes(moduleName) && typeof window !== 'undefined') {
        window[`${moduleName}Initialized`] = false;
    }
    
    const initFunctionName = `initialize${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;
    
    if (typeof window[initFunctionName] === 'function') {
        setTimeout(() => window[initFunctionName](), 100);
    }
}

// Global exports
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
window.getCurrentMenuPosition = getCurrentMenuPosition;
window.setupLanguageButtons = setupLanguageButtons;
window.updateLanguageButtonStates = updateLanguageButtonStates;

// Debug helpers
window.debugLanguageButtons = function() {
    console.log('=== LANGUAGE BUTTONS DEBUG ===');
    const buttons = document.querySelectorAll('.lang-flag-btn');
    console.log('Total buttons:', buttons.length);
    buttons.forEach((btn, i) => {
        const lang = btn.getAttribute('data-lang');
        const isActive = btn.classList.contains('active');
        console.log(`Button ${i}: lang="${lang}", active=${isActive}`, btn);
    });
    console.log('Current language:', currentAppLanguage);
    console.log('Saved language:', getCurrentAppLanguage());
    console.log('===========================');
};

window.testLanguageSwitch = function(lang) {
    console.log(`🧪 Testing language switch to: ${lang}`);
    switchAppLanguage(lang);
};
