let currentAppLanguage = 'en';
let menuTranslations = null;
let appInitialized = false;

const storage = {
    save: (key, val) => localStorage.setItem(`armHelper_${key}`, typeof val === 'object' ? JSON.stringify(val) : val),
    load: (key) => {
        const val = localStorage.getItem(`armHelper_${key}`);
        try { return JSON.parse(val); } catch { return val; }
    }
};

const getCurrentPage = () => storage.load('currentPage') || 'calculator';
const saveCurrentPage = (page) => storage.save('currentPage', page);
const getCurrentAppLanguage = () => storage.load('language') || 'en';
const saveAppLanguage = (lang) => storage.save('language', lang);
const getCurrentMenuPosition = () => storage.load('menuPosition') || 'left';

async function loadMenuTranslations() {
    if (menuTranslations) return menuTranslations;
    try {
        const response = await fetch('languages/menu.json');
        menuTranslations = response.ok ? await response.json() : getFallbackTranslations();
        return menuTranslations;
    } catch (error) {
        console.error('Error loading menu translations:', error);
        menuTranslations = getFallbackTranslations();
        return menuTranslations;
    }
}

function getFallbackTranslations() {
    return {
        en: { menu: "Menu", calculator: "Calculator", info: "Info", others: "Others",
            pages: { calculator: "🐾 Pet Calculator", arm: "💪 Arm Calculator", grind: "🏋️‍♂️ Grind Calculator",
                roulette: "🎰 Roulette Calculator", boss: "👹 Boss Calculator", boosts: "🚀 Boosts",
                shiny: "✨ Shiny Stats", secret: "🔮 Secret Pets", codes: "🎁 Codes", aura: "🌟 Aura",
                trainer: "🏆 Trainer", charms: "🔮 Charms", potions: "🧪 Potions & Food", worlds: "🌍 Worlds",
                settings: "⚙️ Settings", help: "🆘 Help", peoples: "🙏 Peoples" },
            auth: { login: "Login (Soon...)" }},
        uk: { menu: "Меню", calculator: "Калькулятори", info: "Інформація", others: "Інше",
            pages: { calculator: "🐾 Калькулятор Петів", arm: "💪 Калькулятор Рук", grind: "🏋️‍♂️ Калькулятор Гринду",
                roulette: "🎰 Калькулятор Рулетки", boss: "👹 Калькулятор Босів", boosts: "🚀 Бусти",
                shiny: "✨ Шайні Статистика", secret: "🔮 Секретні Пети", codes: "🎁 Коди", aura: "🌟 Аура",
                trainer: "🏆 Тренер", charms: "🔮 Чарівники", potions: "🧪 Зілля та Їжа", worlds: "🌍 Світи",
                settings: "⚙️ Налаштування", help: "🆘 Допомога", peoples: "🙏 Люди" },
            auth: { login: "Вхід (Скоро...)" }},
        ru: { menu: "Меню", calculator: "Калькуляторы", info: "Информация", others: "Другое",
            pages: { calculator: "🐾 Калькулятор Петов", arm: "💪 Калькулятор Рук", grind: "🏋️‍♂️ Калькулятор Гринда",
                roulette: "🎰 Калькулятор Рулетки", boss: "👹 Калькулятор Боссов", boosts: "🚀 Бусты",
                shiny: "✨ Шайни Статистика", secret: "🔮 Секретные Петы", codes: "🎁 Коды", aura: "🌟 Аура",
                trainer: "🏆 Тренер", charms: "🔮 Чармы", potions: "🧪 Зелья и Еда", worlds: "🌍 Миры",
                settings: "⚙️ Настройки", help: "🆘 Помощь", peoples: "🙏 Люди" },
            auth: { login: "Вход (Скоро...)" }}
    };
}

async function switchAppLanguage(lang) {
    if (!menuTranslations) await loadMenuTranslations();
    if (!menuTranslations[lang]) lang = 'en';
    
    const previousLanguage = currentAppLanguage;
    currentAppLanguage = lang;
    saveAppLanguage(lang);
    
    document.querySelectorAll('.lang-flag-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    updateMenuTranslations();
    updatePageTitles();
    
    document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: lang, previousLanguage }
    }));
    
    ['updateRouletteLanguage', 'updateBossLanguage', 'updateWorldsLanguage', 'updatePotionsLanguage',
     'updateSecretLanguage', 'updatePeoplesLanguage', 'updateHelpLanguage', 'updateSettingsLanguage']
    .forEach(func => {
        if (typeof window[func] === 'function') {
            try { window[func](lang); } catch (e) { console.error(`Error updating ${func}:`, e); }
        }
    });
}

function updateMenuTranslations() {
    if (!menuTranslations?.[currentAppLanguage]) return;
    const t = menuTranslations[currentAppLanguage];
    
    const el = (sel) => document.querySelector(sel);
    const sidebarHeader = el('.sidebar-header h3');
    if (sidebarHeader) sidebarHeader.textContent = t.menu;
    
    const catMap = { calculatorButtons: 'calculator', infoButtons: 'info', othersButtons: 'others' };
    Object.entries(catMap).forEach(([id, key]) => {
        const header = el(`[data-category="${id}"] .category-title span:last-child`);
        if (header && t[key]) header.textContent = t[key];
    });
    
    Object.entries(t.pages).forEach(([page, trans]) => {
        const btn = el(`[data-page="${page}"]`);
        if (btn) btn.textContent = trans;
    });
    
    const authBtn = el('#authButton');
    if (authBtn && t.auth.login) authBtn.textContent = t.auth.login;
}

function updatePageTitles() {
    if (!menuTranslations?.[currentAppLanguage]?.pages) return;
    const pages = menuTranslations[currentAppLanguage].pages;
    
    const pageMap = { calculatorPage: 'calculator', armPage: 'arm', grindPage: 'grind', roulettePage: 'roulette',
        bossPage: 'boss', boostsPage: 'boosts', shinyPage: 'shiny', secretPage: 'secret', codesPage: 'codes',
        auraPage: 'aura', trainerPage: 'trainer', charmsPage: 'charms', potionsPage: 'potions',
        worldsPage: 'worlds', settingsPage: 'settings', helpPage: 'help', peoplesPage: 'peoples' };
    
    Object.entries(pageMap).forEach(([pageId, key]) => {
        const page = document.getElementById(pageId);
        if (page && pages[key]) {
            const title = page.querySelector('h1, .title, .peoples-title, .help-title, .settings-title, .header-controls h1');
            if (title) title.textContent = pages[key];
        }
    });
}

function switchPage(page) {
    saveCurrentPage(page);
    document.querySelectorAll('.page, .nav-btn').forEach(el => el.classList.remove('active'));
    
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) targetPage.classList.add('active');
    
    const pageMap = { calculator: 'calculator', arm: 'arm', grind: 'grind', roulette: 'roulette', boss: 'boss',
        boosts: 'boosts', shiny: 'shiny', codes: 'codes', aura: 'aura', trainer: 'trainer', charms: 'charms',
        secret: 'secret', potions: 'potions', worlds: 'worlds', settings: 'settings', help: 'help', peoples: 'peoples' };
    
    const btn = document.querySelector(`[data-page="${pageMap[page]}"]`);
    if (btn) btn.classList.add('active');
    
    if (window.menuManager?.updateStaticMenuActiveState) {
        window.menuManager.updateStaticMenuActiveState(page);
    }
    
    const menuType = getCurrentMenuPosition();
    if (menuType === 'left' || menuType === 'right') closeSidebar();
    
    document.dispatchEvent(new CustomEvent('pageChanged', {
        detail: { page, previousPage: getCurrentPage() }
    }));
    
    setTimeout(() => initializePageContent(page), 100);
}

function initializePageContent(page) {
    const modules = {
        calculator: 'initializeCalculator', arm: 'initializeArm', grind: 'initializeGrind',
        roulette: 'initializeRoulette', boss: 'initializeBoss', shiny: 'initializeShiny',
        boosts: 'initializeBoosts', trainer: 'initializeTrainer', aura: 'initializeAura',
        codes: 'initializeCodes', charms: 'initializeCharms', secret: 'initializeSecret',
        potions: 'initializePotions', worlds: 'initializeWorlds', settings: 'initializeSettings',
        help: 'initializeHelp', peoples: 'initializePeoples'
    };
    
    const pageContainer = document.getElementById(page + 'Page');
    if (!pageContainer) return;
    
    const initFunc = modules[page];
    if (initFunc && typeof window[initFunc] === 'function') {
        const flags = ['grindInitialized', 'rouletteInitialized', 'bossInitialized', 'secretInitialized',
            'potionsInitialized', 'peoplesInitialized', 'helpInitialized', 'settingsInitialized'];
        flags.forEach(flag => { if (window[flag] !== undefined) window[flag] = false; });
        window[initFunc]();
    }
}

function toggleCategory(categoryId) {
    const categoryButtons = document.getElementById(categoryId);
    const toggleIcon = document.querySelector(`[data-category="${categoryId}"] .category-toggle`);
    if (!categoryButtons || !toggleIcon) return;
    
    const isExpanded = categoryButtons.classList.contains('expanded');
    document.querySelectorAll('.category-buttons, .category-toggle').forEach(el => el.classList.remove('expanded'));
    if (!isExpanded) {
        categoryButtons.classList.add('expanded');
        toggleIcon.classList.add('expanded');
    }
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

async function initializeApp() {
    if (appInitialized) return;
    
    const appContent = document.getElementById('app-content');
    if (!appContent?.innerHTML.trim()) return;
    
    currentAppLanguage = getCurrentAppLanguage();
    await loadMenuTranslations();
    
    document.querySelectorAll('.lang-flag-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentAppLanguage);
    });
    
    updateMenuTranslations();
    updatePageTitles();
    initializeAllModules();
    
    setTimeout(() => {
        if (window.menuManager && typeof window.applyMenuPosition === 'function') {
            window.applyMenuPosition(getCurrentMenuPosition());
        }
        setTimeout(() => switchPage(getCurrentPage()), 200);
    }, 300);
    
    document.addEventListener('click', e => {
        const panels = [
            { panel: document.getElementById('settingsPanel'), btn: document.querySelector('#calculatorPage .settings-btn') },
            { panel: document.getElementById('settingsPanelArm'), btn: document.querySelector('#armPage .settings-btn') },
            { panel: document.getElementById('settingsPanelGrind'), btn: document.querySelector('#grindPage .settings-btn') }
        ];
        
        panels.forEach(({ panel, btn }) => {
            if (!panel || !btn || panel.dataset.justOpened === 'true') return;
            
            const clickables = [panel, btn, '.category-button', '.back-btn', '.category-switch', 
                '.simple-modifier', '.category-header', '.category-header-modifier', '.lang-flag-btn'];
            const shouldKeep = clickables.some(sel => typeof sel === 'string' ? e.target.closest(sel) : sel.contains(e.target));
            
            if (!shouldKeep && panel.classList.contains('show')) panel.classList.remove('show');
        });
    });

    appInitialized = true;
}

function initializeAllModules() {
    const modules = [
        'initializeCalculator', 'initializeArm', 'initializeGrind', 'initializeRoulette', 'initializeBoss',
        'initializeBoosts', 'initializeShiny', 'initializeSecret', 'initializePotions', 'initializeAura',
        'initializeTrainer', 'initializeCharms', 'initializeCodes', 'initializeWorlds', 'initializeSettings',
        'initializeHelp', 'initializePeoples'
    ];

    modules.forEach(moduleName => {
        if (typeof window[moduleName] !== 'function') return;
        
        const delayed = ['initializeSecret', 'initializePotions', 'initializeGrind', 'initializePeoples',
            'initializeWorlds', 'initializeHelp', 'initializeSettings', 'initializeRoulette', 'initializeBoss'];
        
        if (delayed.includes(moduleName)) {
            setTimeout(() => {
                const flagMap = {
                    initializeSecret: 'secretInitialized', initializePotions: 'potionsInitialized',
                    initializeGrind: 'grindInitialized', initializePeoples: 'peoplesInitialized',
                    initializeHelp: 'helpInitialized', initializeSettings: 'settingsInitialized',
                    initializeRoulette: 'rouletteInitialized', initializeBoss: 'bossInitialized'
                };
                if (window[flagMap[moduleName]]) window[flagMap[moduleName]] = false;
                window[moduleName]();
            }, 300);
        } else {
            window[moduleName]();
        }
    });
}

Object.assign(window, {
    switchPage, toggleMobileMenu, closeSidebar, initializeApp, toggleCategory,
    switchAppLanguage, getCurrentAppLanguage, saveAppLanguage, updateMenuTranslations,
    updatePageTitles, saveCurrentPage, getCurrentPage, getCurrentMenuPosition,
    handleAuthAction: () => console.log('Login feature coming soon...'),
    saveSettingsToStorage: (key, settings) => storage.save(`${key}_settings`, settings),
    loadSettingsFromStorage: (key) => storage.load(`${key}_settings`),
    forceReinitializeModule: (moduleName) => {
        const flagMap = { secret: 'secretInitialized', potions: 'potionsInitialized', grind: 'grindInitialized',
            peoples: 'peoplesInitialized', help: 'helpInitialized', settings: 'settingsInitialized',
            roulette: 'rouletteInitialized', boss: 'bossInitialized' };
        if (window[flagMap[moduleName]]) window[flagMap[moduleName]] = false;
        
        const initFunc = `initialize${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;
        if (typeof window[initFunc] === 'function') {
            setTimeout(() => window[initFunc](), 100);
        }
    },
    debugPageStates: () => {
        console.log('=== PAGE STATES ===');
        document.querySelectorAll('.page').forEach(page => {
            console.log(`${page.id}: ${page.classList.contains('active') ? 'ACTIVE' : 'INACTIVE'}`);
        });
        console.log(`Current saved: ${getCurrentPage()}`);
    }
});
