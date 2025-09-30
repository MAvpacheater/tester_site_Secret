// General JavaScript functions - Optimized version

let currentAppLanguage = 'en';
let menuTranslations = null;
let appInitialized = false;

// Storage helpers
const storage = {
    save: (key, value) => {
        const fullKey = `armHelper_${key}`;
        const data = typeof value === 'object' ? JSON.stringify(value) : value;
        sessionStorage.setItem(fullKey, data);
        console.log(`Saved: ${key}`);
    },
    load: (key, parse = false) => {
        const data = sessionStorage.getItem(`armHelper_${key}`);
        return parse && data ? JSON.parse(data) : data;
    }
};

const saveCurrentPage = (page) => storage.save('currentPage', page);
const getCurrentPage = () => storage.load('currentPage') || 'calculator';
const getCurrentAppLanguage = () => storage.load('language') || 'en';
const saveAppLanguage = (lang) => storage.save('language', lang);
const getCurrentMenuPosition = () => storage.load('menuPosition') || 'left';
const saveSettingsToStorage = (key, settings) => storage.save(`${key}_settings`, settings);
const loadSettingsFromStorage = (key) => storage.load(`${key}_settings`, true);

// Menu translations
async function loadMenuTranslations() {
    if (menuTranslations) return menuTranslations;
    
    try {
        console.log('📥 Loading translations...');
        const response = await fetch('languages/menu.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        menuTranslations = await response.json();
        console.log('✅ Translations loaded');
        return menuTranslations;
    } catch (error) {
        console.error('❌ Translation error:', error);
        menuTranslations = getDefaultTranslations();
        return menuTranslations;
    }
}

function getDefaultTranslations() {
    const pages = {
        calculator: "🐾 Pet Calculator", arm: "💪 Arm Calculator", grind: "🏋️‍♂️ Grind Calculator",
        roulette: "🎰 Roulette Calculator", boss: "👹 Boss Calculator", boosts: "🚀 Boosts",
        shiny: "✨ Shiny Stats", secret: "🔮 Secret Pets", codes: "🎁 Codes", aura: "🌟 Aura",
        trainer: "🏆 Trainer", charms: "🔮 Charms", potions: "🧪 Potions & Food", worlds: "🌍 Worlds",
        settings: "⚙️ Settings", help: "🆘 Help", peoples: "🙏 Peoples"
    };
    
    return {
        en: { menu: "Menu", calculator: "Calculator", info: "Info", others: "Others", pages, auth: { login: "Login (Soon...)" }},
        uk: { menu: "Меню", calculator: "Калькулятори", info: "Інформація", others: "Інше", 
              pages: { ...pages, calculator: "🐾 Калькулятор Петів", boss: "👹 Калькулятор Босів" }, 
              auth: { login: "Вхід (Скоро...)" }},
        ru: { menu: "Меню", calculator: "Калькуляторы", info: "Информация", others: "Другое", 
              pages: { ...pages, calculator: "🐾 Калькулятор Петов", boss: "👹 Калькулятор Боссов" }, 
              auth: { login: "Вход (Скоро...)" }}
    };
}

function updateMenuTranslations() {
    if (!menuTranslations?.[currentAppLanguage]) return;
    
    const t = menuTranslations[currentAppLanguage];
    
    const updateText = (selector, text) => {
        const el = document.querySelector(selector);
        if (el) el.textContent = text;
    };
    
    updateText('.sidebar-header h3', t.menu);
    
    const categories = { calculatorButtons: 'calculator', infoButtons: 'info', othersButtons: 'others' };
    Object.entries(categories).forEach(([id, key]) => 
        updateText(`[data-category="${id}"] .category-title span:last-child`, t[key])
    );
    
    Object.entries(t.pages).forEach(([page, text]) => updateText(`[data-page="${page}"]`, text));
    updateText('#authButton', t.auth.login);
    
    console.log(`✅ Menu updated: ${currentAppLanguage}`);
}

function updatePageTitles() {
    if (!menuTranslations?.[currentAppLanguage]?.pages) return;
    
    const pages = menuTranslations[currentAppLanguage].pages;
    const pageMap = {
        calculatorPage: 'calculator', armPage: 'arm', grindPage: 'grind', roulettePage: 'roulette',
        bossPage: 'boss', boostsPage: 'boosts', shinyPage: 'shiny', secretPage: 'secret',
        codesPage: 'codes', auraPage: 'aura', trainerPage: 'trainer', charmsPage: 'charms',
        potionsPage: 'potions', worldsPage: 'worlds', settingsPage: 'settings', helpPage: 'help',
        peoplesPage: 'peoples'
    };
    
    Object.entries(pageMap).forEach(([id, key]) => {
        const page = document.getElementById(id);
        if (page && pages[key]) {
            const title = page.querySelector('h1, .title, .header-controls h1');
            if (title) title.textContent = pages[key];
        }
    });
    
    console.log(`✅ Titles updated: ${currentAppLanguage}`);
}

async function switchAppLanguage(lang) {
    if (!menuTranslations) await loadMenuTranslations();
    if (!menuTranslations[lang]) lang = 'en';
    
    const prevLang = currentAppLanguage;
    currentAppLanguage = lang;
    saveAppLanguage(lang);
    
    document.querySelectorAll('.lang-flag-btn').forEach(btn => 
        btn.classList.toggle('active', btn.dataset.lang === lang)
    );
    
    updateMenuTranslations();
    updatePageTitles();
    
    console.log(`🌍 Language: ${prevLang} → ${lang}`);
    
    document.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: lang, previousLanguage: prevLang }
    }));
    
    const modules = ['roulette', 'boss', 'worlds', 'potions', 'secret', 'peoples', 'help', 'settings'];
    modules.forEach(name => {
        const func = `update${name.charAt(0).toUpperCase() + name.slice(1)}Language`;
        if (typeof window[func] === 'function') {
            try {
                window[func](lang);
                console.log(`✅ ${name} updated`);
            } catch (e) {
                console.error(`❌ ${name} error:`, e);
            }
        }
    });
}

function switchPage(page) {
    console.log(`Switching to: ${page}`);
    saveCurrentPage(page);
    
    document.querySelectorAll('.page, .nav-btn').forEach(el => el.classList.remove('active'));
    
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) targetPage.classList.add('active');
    
    const targetBtn = document.querySelector(`[data-page="${page}"]`);
    if (targetBtn) targetBtn.classList.add('active');
    
    if (window.menuManager?.updateStaticMenuActiveState) {
        window.menuManager.updateStaticMenuActiveState(page);
    }
    
    const menuType = getCurrentMenuPosition();
    if (menuType === 'left' || menuType === 'right') closeSidebar();
    
    document.dispatchEvent(new CustomEvent('pageChanged', { detail: { page }}));
    setTimeout(() => initializePageContent(page), 100);
}

function initializePageContent(page) {
    console.log(`🔄 Initializing: ${page}`);
    
    const modules = {
        calculator: 'initializeCalculator', arm: 'initializeArm', grind: 'initializeGrind',
        roulette: 'initializeRoulette', boss: 'initializeBoss', shiny: 'initializeShiny',
        boosts: 'initializeBoosts', trainer: 'initializeTrainer', aura: 'initializeAura',
        codes: 'initializeCodes', charms: 'initializeCharms', secret: 'initializeSecret',
        potions: 'initializePotions', worlds: 'initializeWorlds', settings: 'initializeSettings',
        help: 'initializeHelp', peoples: 'initializePeoples'
    };
    
    const initFunc = modules[page];
    if (initFunc && typeof window[initFunc] === 'function') {
        const needsReset = ['grind', 'roulette', 'boss', 'secret', 'potions', 'help', 'peoples'];
        if (needsReset.includes(page)) {
            window[`${page}Initialized`] = false;
        }
        window[initFunc]();
        console.log(`✅ ${page} initialized`);
    }
}

function initializeAllModules() {
    console.log('🔧 Initializing modules...');
    
    const modules = [
        'Calculator', 'Arm', 'Grind', 'Roulette', 'Boss', 'Boosts', 'Shiny', 'Secret',
        'Potions', 'Aura', 'Trainer', 'Charms', 'Codes', 'Worlds', 'Settings', 'Help', 'Peoples'
    ];
    
    modules.forEach(name => {
        const funcName = `initialize${name}`;
        if (typeof window[funcName] === 'function') {
            const needsDelay = ['Secret', 'Potions', 'Grind', 'Peoples', 'Worlds', 'Help', 'Settings', 'Roulette', 'Boss'];
            
            if (needsDelay.includes(name)) {
                setTimeout(() => {
                    const flagName = `${name.toLowerCase()}Initialized`;
                    if (window[flagName] !== undefined) window[flagName] = false;
                    window[funcName]();
                    console.log(`✅ ${name} initialized (delayed)`);
                }, 300);
            } else {
                window[funcName]();
                console.log(`✅ ${name} initialized`);
            }
        }
    });
}

async function initializeApp() {
    if (appInitialized) return console.log('⚠️ Already initialized');
    
    console.log('🚀 Starting app...');
    
    const appContent = document.getElementById('app-content');
    if (!appContent?.innerHTML.trim()) return console.error('❌ Content not loaded');
    
    currentAppLanguage = getCurrentAppLanguage();
    await loadMenuTranslations();
    
    document.querySelectorAll('.lang-flag-btn').forEach(btn => 
        btn.classList.toggle('active', btn.dataset.lang === currentAppLanguage)
    );
    
    updateMenuTranslations();
    updatePageTitles();
    initializeCategories();
    initializeAllModules();
    
    setTimeout(() => {
        if (window.menuManager && typeof window.applyMenuPosition === 'function') {
            window.applyMenuPosition(getCurrentMenuPosition());
        }
        
        const lastPage = getCurrentPage();
        setTimeout(() => switchPage(lastPage), 200);
    }, 300);
    
    document.addEventListener('click', handleClickOutside);
    
    appInitialized = true;
    console.log('✅ App initialized');
}

function handleClickOutside(e) {
    const panels = [
        { panel: document.getElementById('settingsPanel'), btn: document.querySelector('#calculatorPage .settings-btn')},
        { panel: document.getElementById('settingsPanelArm'), btn: document.querySelector('#armPage .settings-btn')},
        { panel: document.getElementById('settingsPanelGrind'), btn: document.querySelector('#grindPage .settings-btn')}
    ];
    
    panels.forEach(({ panel, btn }) => {
        if (!panel || !btn || panel.dataset.justOpened === 'true') return;
        
        const shouldClose = !panel.contains(e.target) && !btn.contains(e.target) &&
            !e.target.closest('.category-button, .back-btn, .category-switch, .simple-modifier, .category-header, .lang-flag-btn');
        
        if (shouldClose && panel.classList.contains('show')) {
            panel.classList.remove('show');
        }
    });
}

function toggleCategory(categoryId) {
    const buttons = document.getElementById(categoryId);
    const icon = document.querySelector(`[data-category="${categoryId}"] .category-toggle`);
    
    if (buttons && icon) {
        const isExpanded = buttons.classList.contains('expanded');
        
        document.querySelectorAll('.category-buttons, .category-toggle').forEach(el => 
            el.classList.remove('expanded')
        );
        
        if (!isExpanded) {
            buttons.classList.add('expanded');
            icon.classList.add('expanded');
        }
    }
}

const initializeCategories = () => console.log('✅ Categories initialized');
const toggleMobileMenu = () => document.querySelectorAll('#sidebar, #sidebarOverlay').forEach(el => el?.classList.toggle(el.id === 'sidebar' ? 'open' : 'show'));
const closeSidebar = () => document.querySelectorAll('#sidebar, #sidebarOverlay').forEach(el => el?.classList.remove(el.id === 'sidebar' ? 'open' : 'show'));
const handleAuthAction = () => console.log('Login coming soon...');
const debugPageStates = () => {
    console.log('=== PAGE STATES ===');
    document.querySelectorAll('.page').forEach(p => console.log(`${p.id}: ${p.classList.contains('active') ? 'ACTIVE' : 'INACTIVE'}`));
    console.log(`Current: ${getCurrentPage()}`);
};

function forceReinitializeModule(name) {
    console.log(`🔄 Force reinit: ${name}`);
    
    const flagName = `${name}Initialized`;
    if (window[flagName] !== undefined) window[flagName] = false;
    
    const funcName = `initialize${name.charAt(0).toUpperCase() + name.slice(1)}`;
    if (typeof window[funcName] === 'function') {
        setTimeout(() => window[funcName](), 100);
    }
}

// Exports
Object.assign(window, {
    switchPage, toggleMobileMenu, closeSidebar, handleAuthAction, initializeApp, debugPageStates,
    saveSettingsToStorage, loadSettingsFromStorage, toggleCategory, initializeCategories,
    forceReinitializeModule, switchAppLanguage, getCurrentAppLanguage, saveAppLanguage,
    updateMenuTranslations, updatePageTitles, saveCurrentPage, getCurrentPage, getCurrentMenuPosition
});
