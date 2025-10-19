(() => {
    let currentAppLanguage = null;
    let menuTranslations = null;
    let appInitialized = false;

    // Storage helpers
    const storage = {
        save: (key, value) => {
            const fullKey = `armHelper_${key}`;
            const data = typeof value === 'object' ? JSON.stringify(value) : value;
            localStorage.setItem(fullKey, data);
            console.log(`💾 Storage.save: ${fullKey}`);
        },
        load: (key, parse = false) => {
            const data = localStorage.getItem(`armHelper_${key}`);
            if (!data) return null;
            return parse ? JSON.parse(data) : data;
        }
    };

    // Page management
    const saveCurrentPage = page => localStorage.setItem('armHelper_currentPage', page);
    const getCurrentPage = () => localStorage.getItem('armHelper_currentPage') || 'calculator';

    // Language management
    const getCurrentAppLanguage = () => {
        if (currentAppLanguage) return currentAppLanguage;
        const saved = localStorage.getItem('armHelper_language');
        currentAppLanguage = saved || 'en';
        console.log('📖 getCurrentAppLanguage:', currentAppLanguage);
        return currentAppLanguage;
    };

    const loadMenuTranslations = async () => {
        if (menuTranslations) {
            console.log('✅ Menu translations already loaded');
            return menuTranslations;
        }
        
        try {
            console.log('📥 Loading menu translations...');
            const res = await fetch('system/moderation/menu.json');
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            menuTranslations = await res.json();
            console.log('✅ Menu translations loaded:', Object.keys(menuTranslations));
            return menuTranslations;
        } catch (err) {
            console.error('❌ Error loading menu translations:', err);
            menuTranslations = {
                en: {
                    menu: {
                        awsCategory: "AWS",
                        rcuCategory: "RCU",
                        systemCategory: "System",
                        calculator: "Calculators",
                        rcuCalc: "Calculators",
                        info: "Info",
                        others: "Others",
                        pages: {
                            calculator: "Pet Calculator",
                            arm: "Arm Calculator",
                            grind: "Grind Calculator",
                            roulette: "Roulette Calculator",
                            boss: "Boss Calculator",
                            boosts: "Boosts",
                            shiny: "Shiny Stats",
                            secret: "Secret Pets",
                            codes: "Codes",
                            aura: "Aura",
                            trainer: "Trainer",
                            charms: "Charms",
                            potions: "Potions & Food",
                            worlds: "Worlds",
                            clans: "Clans",
                            petscalc: "Pets Calculator",
                            settings: "Settings",
                            help: "Help",
                            peoples: "Peoples",
                            trader: "Trader"
                        }
                    }
                }
            };
            return menuTranslations;
        }
    };

    const updateMenuTranslations = () => {
        console.log('🔄 updateMenuTranslations for:', currentAppLanguage);
        
        if (!menuTranslations || !currentAppLanguage) {
            console.warn('⚠️ No translations or language');
            return;
        }
        
        const t = menuTranslations[currentAppLanguage];
        if (!t || !t.menu) {
            console.warn('⚠️ No translations for language:', currentAppLanguage);
            return;
        }
        
        const sidebarHeader = document.querySelector('.sidebar-header h3');
        if (sidebarHeader) sidebarHeader.textContent = 'Menu';
        
        // Update main category titles
        const mainCategoryMappings = {
            'awsCategory': 'awsCategory',
            'rcuCategory': 'rcuCategory',
            'systemCategory': 'systemCategory'
        };
        
        Object.entries(mainCategoryMappings).forEach(([categoryId, key]) => {
            const header = document.querySelector(`[data-main-category="${categoryId}"] .main-category-text`);
            if (header && t.menu[key]) {
                header.textContent = t.menu[key];
            }
        });
        
        // Update subcategory titles
        const categoryMappings = {
            'calculatorButtons': 'calculator',
            'infoButtons': 'info',
            'othersAWSButtons': 'others',
            'rcuCalculatorButtons': 'rcuCalc'
        };
        
        Object.entries(categoryMappings).forEach(([categoryId, key]) => {
            const header = document.querySelector(`[data-category="${categoryId}"] .category-text`);
            if (header && t.menu[key]) header.textContent = t.menu[key];
        });
        
        // Update page buttons
        if (t.menu.pages) {
            Object.entries(t.menu.pages).forEach(([page, translation]) => {
                const btn = document.querySelector(`[data-page="${page}"] .nav-btn-text`);
                if (btn) btn.textContent = translation;
            });
        }
        
        console.log('✅ Menu translations updated');
    };

    const updatePageTitles = () => {
        if (!menuTranslations || !currentAppLanguage) return;
        
        const t = menuTranslations[currentAppLanguage];
        if (!t || !t.menu || !t.menu.pages) return;
        
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
            'petsCalcPage': 'petscalc',
            'settingsPage': 'settings',
            'helpPage': 'help',
            'peoplesPage': 'peoples',
            'traderPage': 'trader',
            'clansPage': 'clans'
        };
        
        Object.entries(pageTitleMappings).forEach(([pageId, key]) => {
            const page = document.getElementById(pageId);
            if (page && t.menu.pages[key]) {
                const titleEl = page.querySelector('h1, .title, .peoples-title, .help-title, .settings-title, .trader-title, .clans-title');
                if (titleEl) titleEl.textContent = t.menu.pages[key];
                
                const headerTitle = page.querySelector('.header-controls h1');
                if (headerTitle) headerTitle.textContent = t.menu.pages[key];
            }
        });
    };

    const switchAppLanguage = async lang => {
        console.log('🌍 ========== switchAppLanguage START ==========');
        console.log('🎯 Target language:', lang);
        console.log('📍 Current language:', currentAppLanguage);
        
        if (currentAppLanguage === lang) {
            console.log('⚠️ Already on this language, skipping');
            return;
        }
        
        if (!menuTranslations) {
            console.log('📥 Loading translations first...');
            await loadMenuTranslations();
        }
        
        if (!menuTranslations[lang]) {
            console.error(`❌ Language ${lang} not found, defaulting to English`);
            lang = 'en';
        }
        
        const previousLanguage = currentAppLanguage;
        
        localStorage.setItem('armHelper_language', lang);
        console.log('💾 Saved to localStorage:', lang);
        
        currentAppLanguage = lang;
        console.log('✅ Updated currentAppLanguage to:', currentAppLanguage);
        
        document.querySelectorAll('.lang-flag-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        updateMenuTranslations();
        updatePageTitles();
        
        const languageChangeEvent = new CustomEvent('languageChanged', {
            detail: { language: lang, previousLanguage }
        });
        document.dispatchEvent(languageChangeEvent);
        
        const awsModuleUpdaters = [
            'updateRouletteLanguage',
            'updateBossLanguage',
            'updateWorldsLanguage',
            'updatePotionsLanguage',
            'updateSecretLanguage',
            'updatePeoplesLanguage',
            'updateHelpLanguage',
            'updateTraderLanguage',
            'updateClansLanguage',
            'updatePetsCalcLanguage'
        ];
        
        awsModuleUpdaters.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                try {
                    console.log(`📢 Notifying module: ${funcName}`);
                    window[funcName](lang);
                } catch (err) {
                    console.error(`❌ Error updating ${funcName}:`, err);
                }
            }
        });
        
        if (typeof updateSettingsLanguage === 'function') updateSettingsLanguage(lang);
        
        console.log('✅ ========== switchAppLanguage END ==========');
    };

    // Page switching
    const switchPage = page => {
        console.log('📄 Switching to page:', page);
        
        saveCurrentPage(page);
        
        const systemPages = ['settings', 'help', 'peoples'];
        const rcuPages = ['petscalc'];
        
        document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
        
        const isSystemPage = systemPages.includes(page);
        const isRCUPage = rcuPages.includes(page);
        
        if (isSystemPage) {
            console.log('🔧 Routing to system page:', page);
            const targetPage = document.getElementById(page + 'Page');
            if (targetPage) {
                targetPage.classList.add('active');
                initializeSystemPage(page);
            }
        } else if (isRCUPage) {
            console.log('🎮 Routing to RCU page:', page);
            if (window.rcuLoader) {
                window.rcuLoader.loadModule(page).then(() => {
                    const targetPage = document.getElementById(page + 'Page');
                    if (targetPage) {
                        targetPage.classList.add('active');
                        initializeRCUPage(page);
                    }
                });
            }
        } else if (window.awsRouter) {
            console.log('📦 Routing to AWS page:', page);
            window.awsRouter.switchToPage(page);
        }
        
        document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
        const targetButton = document.querySelector(`[data-page="${page}"]`);
        if (targetButton) targetButton.classList.add('active');
        
        if (typeof window.menuManager !== 'undefined' && window.menuManager.updateActiveState) {
            window.menuManager.updateActiveState(page);
        }
        
        // Close sidebar via Menu Manager
        if (typeof window.closeSidebar === 'function') {
            window.closeSidebar();
        }
        
        const pageChangeEvent = new CustomEvent('pageChanged', {
            detail: { page, previousPage: getCurrentPage() }
        });
        document.dispatchEvent(pageChangeEvent);
    };

    const initializeSystemPage = page => {
        console.log(`🔧 Initializing system page: ${page}`);
        
        if (window.systemContentLoader) {
            window.systemContentLoader.loadModule(page).then(loaded => {
                if (loaded) {
                    const initFunctions = {
                        settings: 'initializeSettings',
                        help: 'initializeHelp',
                        peoples: 'initializePeoples'
                    };
                    
                    const initFunc = initFunctions[page];
                    if (initFunc && typeof window[initFunc] === 'function') {
                        console.log(`📦 Calling ${initFunc}`);
                        
                        const needsDelay = ['help', 'peoples'];
                        if (needsDelay.includes(page)) {
                            setTimeout(() => window[initFunc](), 100);
                        } else {
                            window[initFunc]();
                        }
                    }
                }
            });
        } else {
            const initFunctions = {
                settings: 'initializeSettings',
                help: 'initializeHelp',
                peoples: 'initializePeoples'
            };
            
            const initFunc = initFunctions[page];
            if (initFunc && typeof window[initFunc] === 'function') {
                console.log(`📦 Direct call ${initFunc}`);
                window[initFunc]();
            }
        }
    };

    const initializeRCUPage = page => {
        console.log(`🎮 Initializing RCU page: ${page}`);
        
        const initFunctions = {
            petscalc: 'initializePetsCalc'
        };
        
        const initFunc = initFunctions[page];
        if (initFunc && typeof window[initFunc] === 'function') {
            console.log(`📦 Calling ${initFunc}`);
            setTimeout(() => window[initFunc](), 100);
        }
    };

    // App initialization
    const initializeApp = async () => {
        if (appInitialized) {
            console.log('⚠️ App already initialized, skipping');
            return;
        }
        
        console.log('🚀 ========== initializeApp START ==========');
        
        const appContent = document.getElementById('app-content');
        if (!appContent || !appContent.innerHTML.trim()) {
            console.error('❌ App content not ready');
            setTimeout(initializeApp, 100);
            return;
        }
        
        if (currentAppLanguage === null) {
            currentAppLanguage = getCurrentAppLanguage();
            console.log('🌍 Initial language loaded from storage:', currentAppLanguage);
        }
        
        await loadMenuTranslations();
        
        document.querySelectorAll('.lang-flag-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentAppLanguage);
        });
        
        updateMenuTranslations();
        updatePageTitles();
        
        // Initialize system modules (critical ones)
        ['Settings'].forEach(name => {
            const funcName = `initialize${name}`;
            if (typeof window[funcName] === 'function') {
                console.log(`🔧 Init system module: ${name}`);
                window[funcName]();
            }
        });
        
        setTimeout(() => {
            const lastPage = getCurrentPage();
            setTimeout(() => switchPage(lastPage), 200);
        }, 300);
        
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
        console.log('✅ App initialized with language:', currentAppLanguage);
        console.log('✅ ========== initializeApp END ==========');
    };

    // Utilities
    const saveSettingsToStorage = (key, settings) => localStorage.setItem(`armHelper_${key}_settings`, JSON.stringify(settings));
    
    const loadSettingsFromStorage = key => {
        const localSettings = localStorage.getItem(`armHelper_${key}_settings`);
        if (localSettings) {
            try {
                return JSON.parse(localSettings);
            } catch (e) {
                return null;
            }
        }
        return null;
    };

    const debugPageStates = () => {
        console.log('=== PAGE STATES ===');
        document.querySelectorAll('.page').forEach(page => {
            console.log(`${page.id}: ${page.classList.contains('active') ? 'ACTIVE' : 'INACTIVE'}`);
        });
        console.log(`Current saved page: ${getCurrentPage()}`);
    };

    const forceReinitializeModule = moduleName => {
        if (window.awsUtils) {
            window.awsUtils.resetModuleState(moduleName);
        }
        
        const initFunctionName = `initialize${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;
        
        if (typeof window[initFunctionName] === 'function') {
            setTimeout(() => window[initFunctionName](), 100);
        }
    };

    // Global exports
    Object.assign(window, {
        switchPage,
        initializeApp,
        debugPageStates,
        saveSettingsToStorage,
        loadSettingsFromStorage,
        forceReinitializeModule,
        switchAppLanguage,
        getCurrentAppLanguage,
        updateMenuTranslations,
        updatePageTitles,
        saveCurrentPage,
        getCurrentPage
    });

    // Early language initialization
    (() => {
        const savedLang = localStorage.getItem('armHelper_language') || 'en';
        currentAppLanguage = savedLang;
        console.log('🌍 Early language initialization:', currentAppLanguage);
        
        loadMenuTranslations().then(() => {
            console.log('✅ Menu translations pre-loaded');
            if (document.getElementById('app-content')?.innerHTML.trim()) {
                updateMenuTranslations();
            }
        });
    })();

    console.log('✅ General.js loaded (CLEANED - No Menu Logic)');
    console.log('📍 Initial localStorage language:', localStorage.getItem('armHelper_language'));
})();
