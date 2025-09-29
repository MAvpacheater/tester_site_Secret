// General JavaScript functions - Enhanced with Boss support and updated folder structure

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
                    peoples: "🙏 Peoples"
                },
                auth: {
                    login: "Login (Soon...)"
                }
            },
            uk: {
                menu: "Меню",
                calculator: "Калькулятори", 
                info: "Інформація",
                others: "Інше",
                pages: {
                    calculator: "🐾 Калькулятор Петів",
                    arm: "💪 Калькулятор Рук",
                    grind: "🏋️‍♂️ Калькулятор Гринду",
                    roulette: "🎰 Калькулятор Рулетки",
                    boss: "👹 Калькулятор Босів",
                    boosts: "🚀 Бусти",
                    shiny: "✨ Шайні Статистика",
                    secret: "🔮 Секретні Пети",
                    codes: "🎁 Коди",
                    aura: "🌟 Аура",
                    trainer: "🏆 Тренер",
                    charms: "🔮 Чарівники",
                    potions: "🧪 Зілля та Їжа",
                    worlds: "🌍 Світи",
                    settings: "⚙️ Налаштування",
                    help: "🆘 Допомога",
                    peoples: "🙏 Люди"
                },
                auth: {
                    login: "Вхід (Скоро...)"
                }
            },
            ru: {
                menu: "Меню",
                calculator: "Калькуляторы", 
                info: "Информация",
                others: "Другое",
                pages: {
                    calculator: "🐾 Калькулятор Петов",
                    arm: "💪 Калькулятор Рук",
                    grind: "🏋️‍♂️ Калькулятор Гринда",
                    roulette: "🎰 Калькулятор Рулетки",
                    boss: "👹 Калькулятор Боссов",
                    boosts: "🚀 Бусты",
                    shiny: "✨ Шайни Статистика",
                    secret: "🔮 Секретные Петы",
                    codes: "🎁 Коды",
                    aura: "🌟 Аура",
                    trainer: "🏆 Тренер",
                    charms: "🔮 Чармы",
                    potions: "🧪 Зелья и Еда",
                    worlds: "🌍 Миры",
                    settings: "⚙️ Настройки",
                    help: "🆘 Помощь",
                    peoples: "🙏 Люди"
                },
                auth: {
                    login: "Вход (Скоро...)"
                }
            }
        };
        return menuTranslations;
    }
}

// Switch app language with enhanced boss support
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
    
    // Directly notify specific modules if their functions exist
    const moduleNotifications = [
        { name: 'roulette', func: 'updateRouletteLanguage' },
        { name: 'boss', func: 'updateBossLanguage' },
        { name: 'worlds', func: 'updateWorldsLanguage' },
        { name: 'potions', func: 'updatePotionsLanguage' },
        { name: 'secret', func: 'updateSecretLanguage' },
        { name: 'peoples', func: 'updatePeoplesLanguage' },
        { name: 'help', func: 'updateHelpLanguage' },
        { name: 'settings', func: 'updateSettingsLanguage' }
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
    
    // Update page buttons in sidebar
    Object.entries(translations.pages).forEach(([page, translation]) => {
        const pageButton = document.querySelector(`[data-page="${page}"]`);
        if (pageButton) {
            pageButton.textContent = translation;
        }
    });
    
    // Update auth button
    const authButton = document.getElementById('authButton');
    if (authButton && translations.auth.login) {
        authButton.textContent = translations.auth.login;
    }
    
    console.log(`✅ Menu translations updated for ${currentAppLanguage}`);
}

// Update page titles with boss support
function updatePageTitles() {
    if (!menuTranslations || !currentAppLanguage) return;
    
    const translations = menuTranslations[currentAppLanguage];
    if (!translations || !translations.pages) return;
    
    // Page title mappings - includes boss
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
        'peoplesPage': 'peoples'
    };
    
    // Update each page title
    Object.entries(pageTitleMappings).forEach(([pageId, translationKey]) => {
        const page = document.getElementById(pageId);
        if (page && translations.pages[translationKey]) {
            const titleElement = page.querySelector('h1, .title, .peoples-title, .help-title, .settings-title');
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

// Enhanced page switching with boss support
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
    
    // Update active nav button in sidebar - includes boss
    const pageMap = {
        'calculator': 'calculator',
        'arm': 'arm',
        'grind': 'grind',
        'roulette': 'roulette',
        'boss': 'boss',
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
        'help': 'help',
        'peoples': 'peoples'
    };
    
    const targetButton = document.querySelector(`[data-page="${pageMap[page]}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
        console.log(`Nav button activated for ${page}`);
    }
    
    // Update static menu active state via MenuManager if available
    if (typeof window.menuManager !== 'undefined' && window.menuManager.updateStaticMenuActiveState) {
        window.menuManager.updateStaticMenuActiveState(page);
    } else if (typeof window.updateStaticMenuActiveState === 'function') {
        window.updateStaticMenuActiveState(page);
    }
    
    // Close sidebar after selection (only for sidebar menus)
    const currentMenuType = getCurrentMenuPosition();
    if (currentMenuType === 'left' || currentMenuType === 'right') {
        closeSidebar();
    }
    
    // Dispatch page change event
    const pageChangeEvent = new CustomEvent('pageChanged', {
        detail: {
            page: page,
            previousPage: getCurrentPage()
        }
    });
    document.dispatchEvent(pageChangeEvent);
    
    // Force re-initialize specific page content when switching
    setTimeout(() => {
        initializePageContent(page);
    }, 100);
}

// Get current menu position (for MenuManager compatibility)
function getCurrentMenuPosition() {
    const saved = localStorage.getItem('armHelper_menuPosition');
    return saved || 'left';
}

// Initialize specific page content when switching - includes boss - UPDATED FOR NEW FOLDER STRUCTURE
function initializePageContent(page) {
    console.log(`🔄 Initializing content for page: ${page} (new folder structure)`);
    
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
                console.log('✅ Calculator module initialized from calc/calculator/');
            }
            break;
        case 'arm':
            if (typeof initializeArm === 'function') {
                initializeArm();
                console.log('✅ Arm module initialized from calc/arm/');
            }
            break;
        case 'grind':
            if (typeof initializeGrind === 'function') {
                if (typeof window !== 'undefined' && window.grindInitialized !== undefined) {
                    window.grindInitialized = false;
                }
                initializeGrind();
                console.log('✅ Grind module initialized from calc/grind/');
            }
            break;
        case 'roulette':
            console.log('🎰 Initializing Roulette Calculator page from calc/roulette/...');
            if (typeof initializeRoulette === 'function') {
                if (typeof window !== 'undefined' && window.rouletteInitialized !== undefined) {
                    window.rouletteInitialized = false;
                }
                initializeRoulette();
                console.log('✅ Roulette module initialized from calc/roulette/');
            } else {
                console.error('❌ initializeRoulette function not found in calc/roulette/');
            }
            break;
        case 'boss':
            console.log('👹 Initializing Boss Calculator page from calc/boss/...');
            if (typeof initializeBoss === 'function') {
                if (typeof window !== 'undefined' && window.bossInitialized !== undefined) {
                    window.bossInitialized = false;
                }
                initializeBoss();
                console.log('✅ Boss module initialized from calc/boss/');
            } else {
                console.error('❌ initializeBoss function not found in calc/boss/');
            }
            break;
        case 'shiny':
            if (typeof initializeShiny === 'function') {
                initializeShiny();
                console.log('✅ Shiny module initialized from info/shiny/');
            }
            break;
        case 'boosts':
            if (typeof initializeBoosts === 'function') {
                initializeBoosts();
                console.log('✅ Boosts module initialized from info/boosts/');
            }
            break;
        case 'trainer':
            if (typeof initializeTrainer === 'function') {
                initializeTrainer();
                console.log('✅ Trainer module initialized from info/trainer/');
            }
            break;
        case 'aura':
            if (typeof initializeAura === 'function') {
                initializeAura();
                console.log('✅ Aura module initialized from info/aura/');
            }
            break;
        case 'codes':
            if (typeof initializeCodes === 'function') {
                initializeCodes();
                console.log('✅ Codes module initialized from info/codes/');
            }
            break;
        case 'charms':
            if (typeof initializeCharms === 'function') {
                initializeCharms();
                console.log('✅ Charms module initialized from info/charms/');
            }
            break;
        case 'secret':
            console.log('🔮 Initializing Secret Pets page from info/secret/...');
            if (typeof initializeSecret === 'function') {
                if (typeof window !== 'undefined' && window.secretInitialized !== undefined) {
                    window.secretInitialized = false;
                }
                initializeSecret();
                console.log('✅ Secret module initialized from info/secret/');
            } else {
                console.error('❌ initializeSecret function not found in info/secret/');
            }
            break;
        case 'potions':
            console.log('🧪 Initializing Potions & Food page from info/potions/...');
            if (typeof initializePotions === 'function') {
                if (typeof window !== 'undefined' && window.potionsInitialized !== undefined) {
                    window.potionsInitialized = false;
                }
                initializePotions();
                console.log('✅ Potions module initialized from info/potions/');
            } else {
                console.error('❌ initializePotions function not found in info/potions/');
            }
            break;
        case 'worlds':
            console.log('🌍 Initializing Worlds page from info/worlds/...');
            if (typeof initializeWorlds === 'function') {
                initializeWorlds();
                console.log('✅ Worlds module initialized from info/worlds/');
            } else {
                console.error('❌ initializeWorlds function not found in info/worlds/');
            }
            break;
        case 'settings':
            console.log('⚙️ Initializing Settings page from moderation/settings/...');
            if (typeof initializeSettings === 'function') {
                initializeSettings();
                console.log('✅ Settings module initialized from moderation/settings/');
            } else {
                console.error('❌ initializeSettings function not found in moderation/settings/');
            }
            break;
        case 'help':
            console.log('🆘 Initializing Help page from other/help/...');
            if (typeof initializeHelp === 'function') {
                if (typeof window !== 'undefined' && window.helpInitialized !== undefined) {
                    window.helpInitialized = false;
                }
                initializeHelp();
                console.log('✅ Help module initialized from other/help/');
            } else {
                console.error('❌ initializeHelp function not found in other/help/');
            }
            break;
        case 'peoples':
            console.log('🙏 Initializing Peoples page from other/peoples/...');
            if (typeof initializePeoples === 'function') {
                if (typeof window !== 'undefined' && window.peoplesInitialized !== undefined) {
                    window.peoplesInitialized = false;
                }
                initializePeoples();
                console.log('✅ Peoples module initialized from other/peoples/');
            } else {
                console.error('❌ initializePeoples function not found in other/peoples/');
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
    console.log('✅ Categories initialized - all closed by default (new folder structure)');
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

// Settings persistence helpers
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

// Enhanced app initialization with boss support and new folder structure
async function initializeApp() {
    if (appInitialized) {
        console.log('⚠️ App already initialized');
        return;
    }
    
    console.log('🚀 Starting app initialization with boss support and new folder structure...');
    
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
    
    // Initialize all modules first (including boss) with new folder structure
    initializeAllModules();
    
    // Wait for MenuManager to be available
    setTimeout(() => {
        // Apply menu position via MenuManager if available
        if (typeof window.menuManager !== 'undefined') {
            console.log('🎯 Using MenuManager for menu initialization...');
            const currentMenuPos = getCurrentMenuPosition();
            if (typeof window.applyMenuPosition === 'function') {
                window.applyMenuPosition(currentMenuPos);
            }
        } else {
            console.warn('⚠️ MenuManager not available, falling back to legacy menu system');
        }
        
        // Restore last page or default to calculator
        const lastPage = getCurrentPage();
        console.log(`🔄 Restoring last page: ${lastPage}`);
        
        setTimeout(() => {
            switchPage(lastPage);
            console.log(`✅ Page restored to: ${lastPage}`);
        }, 200);
    }, 300);
    
    // Enhanced click outside settings panel handler
    document.addEventListener('click', e => {
        const settingsPanels = [
            { panel: document.getElementById('settingsPanel'), btn: document.querySelector('#calculatorPage .settings-btn'), name: 'calculator' },
            { panel: document.getElementById('settingsPanelArm'), btn: document.querySelector('#armPage .settings-btn'), name: 'arm' },
            { panel: document.getElementById('settingsPanelGrind'), btn: document.querySelector('#grindPage .settings-btn'), name: 'grind' }
        ];
        
        settingsPanels.forEach(({ panel, btn, name }) => {
            if (panel && btn) {
                // Check if panel just opened
                if (panel.dataset.justOpened === 'true') {
                    console.log(`⏸️ Skipping close for ${name} panel - just opened`);
                    return;
                }
                
                const isClickInsidePanel = panel.contains(e.target);
                const isClickOnSettingsBtn = btn.contains(e.target);
                const isClickOnCategoryButton = e.target.closest('.category-button');
                const isClickOnBackButton = e.target.closest('.back-btn');
                const isClickOnCategorySwitch = e.target.closest('.category-switch');
                const isClickOnSimpleModifier = e.target.closest('.simple-modifier');
                const isClickOnCategoryHeader = e.target.closest('.category-header');
                const isClickOnGrindCategoryHeader = e.target.closest('.category-header-modifier');
                const isClickOnLanguageFlag = e.target.closest('.lang-flag-btn');
                
                const shouldKeepOpen = isClickInsidePanel || isClickOnSettingsBtn || 
                    isClickOnCategoryButton || isClickOnBackButton || 
                    isClickOnCategorySwitch || isClickOnSimpleModifier ||
                    isClickOnCategoryHeader || isClickOnGrindCategoryHeader ||
                    isClickOnLanguageFlag;
                
                if (!shouldKeepOpen && panel.classList.contains('show')) {
                    console.log(`🔒 Closing ${name} settings panel`);
                    panel.classList.remove('show');
                } else if (shouldKeepOpen) {
                    console.log(`✋ Keeping ${name} settings panel open`);
                }
            }
        });
    });

    appInitialized = true;
    console.log('✅ App initialization completed with boss support and new folder structure');
}

// Initialize all modules with proper DOM readiness checks - includes boss - UPDATED FOR NEW FOLDER STRUCTURE
function initializeAllModules() {
    console.log('🔧 Initializing all modules with new folder structure...');
    
    const modules = [
        { name: 'initializeCalculator', path: 'calc/calculator/' },
        { name: 'initializeArm', path: 'calc/arm/' }, 
        { name: 'initializeGrind', path: 'calc/grind/' },
        { name: 'initializeRoulette', path: 'calc/roulette/' },
        { name: 'initializeBoss', path: 'calc/boss/' },
        { name: 'initializeBoosts', path: 'info/boosts/' },
        { name: 'initializeShiny', path: 'info/shiny/' },
        { name: 'initializeSecret', path: 'info/secret/' },
        { name: 'initializePotions', path: 'info/potions/' },
        { name: 'initializeAura', path: 'info/aura/' },
        { name: 'initializeTrainer', path: 'info/trainer/' },
        { name: 'initializeCharms', path: 'info/charms/' },
        { name: 'initializeCodes', path: 'info/codes/' },
        { name: 'initializeWorlds', path: 'info/worlds/' },
        { name: 'initializeSettings', path: 'moderation/settings/' },
        { name: 'initializeHelp', path: 'other/help/' },
        { name: 'initializePeoples', path: 'other/peoples/' }
    ];

    modules.forEach(({ name: moduleName, path }) => {
        try {
            if (typeof window[moduleName] === 'function') {
                // Add delay for DOM-dependent modules
                if (moduleName === 'initializeSecret' || moduleName === 'initializePotions' || 
                    moduleName === 'initializeGrind' || moduleName === 'initializePeoples' ||
                    moduleName === 'initializeWorlds' || moduleName === 'initializeHelp' ||
                    moduleName === 'initializeSettings' || moduleName === 'initializeRoulette' ||
                    moduleName === 'initializeBoss') {
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
                            if (moduleName === 'initializeSettings' && window.settingsInitialized) {
                                window.settingsInitialized = false;
                            }
                            if (moduleName === 'initializeRoulette' && window.rouletteInitialized) {
                                window.rouletteInitialized = false;
                            }
                            if (moduleName === 'initializeBoss' && window.bossInitialized) {
                                window.bossInitialized = false;
                            }
                            
                            window[moduleName]();
                            console.log(`✅ ${moduleName} initialized (delayed) from ${path}`);
                        } catch (error) {
                            console.error(`❌ Error initializing ${moduleName} from ${path}:`, error);
                        }
                    }, 300);
                } else {
                    window[moduleName]();
                    console.log(`✅ ${moduleName} initialized from ${path}`);
                }
            } else {
                console.warn(`⚠️ Function ${moduleName} not found (expected from ${path})`);
            }
        } catch (error) {
            console.error(`❌ Error initializing ${moduleName} from ${path}:`, error);
        }
    });
}

// Debug function to check page states
function debugPageStates() {
    console.log('=== DEBUG PAGE STATES (New Folder Structure) ===');
    document.querySelectorAll('.page').forEach(page => {
        console.log(`${page.id}: ${page.classList.contains('active') ? 'ACTIVE' : 'INACTIVE'}`);
    });
    console.log(`Current saved page: ${getCurrentPage()}`);
    console.log('===============================================');
}

// Force reinitialization for specific modules - includes boss - UPDATED FOR NEW FOLDER STRUCTURE
function forceReinitializeModule(moduleName) {
    console.log(`🔄 Force reinitializing ${moduleName} with new folder structure...`);
    
    // Module path mapping for better debugging
    const modulePaths = {
        'secret': 'info/secret/',
        'potions': 'info/potions/',
        'grind': 'calc/grind/',
        'peoples': 'other/peoples/',
        'help': 'other/help/',
        'settings': 'moderation/settings/',
        'roulette': 'calc/roulette/',
        'boss': 'calc/boss/',
        'calculator': 'calc/calculator/',
        'arm': 'calc/arm/',
        'boosts': 'info/boosts/',
        'shiny': 'info/shiny/',
        'codes': 'info/codes/',
        'aura': 'info/aura/',
        'trainer': 'info/trainer/',
        'charms': 'info/charms/',
        'worlds': 'info/worlds/'
    };
    
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
    if (moduleName === 'settings' && typeof window !== 'undefined') {
        window.settingsInitialized = false;
    }
    if (moduleName === 'roulette' && typeof window !== 'undefined') {
        window.rouletteInitialized = false;
    }
    if (moduleName === 'boss' && typeof window !== 'undefined') {
        window.bossInitialized = false;
    }
    
    // Call initialization
    const initFunctionName = `initialize${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;
    const modulePath = modulePaths[moduleName] || 'unknown/';
    
    if (typeof window[initFunctionName] === 'function') {
        setTimeout(() => {
            window[initFunctionName]();
            console.log(`✅ ${initFunctionName} force reinitialized from ${modulePath}`);
        }, 100);
    } else {
        console.error(`❌ ${initFunctionName} function not found (expected from ${modulePath})`);
    }
}

// Make functions globally available with boss support and new folder structure
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
