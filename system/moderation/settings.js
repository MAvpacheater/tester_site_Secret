// ========== OPTIMIZED SETTINGS MODULE WITH PAGE CATEGORIES ==========
(function() {
    'use strict';
    
    if (window.settingsInitialized) {
        console.log('⚠️ Settings already loaded');
        return;
    }

    // ========== STATE ==========
    const state = {
        initialized: false,
        translations: null,
        categories: { background: false, menu: false, colors: false, language: false },
        activeDropdown: null,
        currentMenuType: null
    };

    // ========== CONFIG ==========
    const getBasePath = () => {
        const { protocol, host, pathname } = window.location;
        
        if (host === 'mavpacheater.github.io') {
            return `${protocol}//${host}/tester_site_Secret/`;
        }
        
        if (host.includes('localhost') || host.includes('127.0.0.1')) {
            const parts = pathname.split('/').filter(Boolean);
            if (parts.length && parts[0] !== 'AWS') {
                return `${protocol}//${host}/${parts[0]}/`;
            }
        }
        
        return '/';
    };

    const SETTINGS_BASE_PATH = getBasePath();

    const CONFIG = {
        backgrounds: {
            dodep: { icon: '🕸️', filename: 'h1.png' },
            game: { icon: '🎃', filename: 'h2.png' },
            code: { icon: '👻', filename: 'h3.png' },
            prison: { icon: '🦇', filename: 'h4.png' },
            forest: { icon: '🌲', filename: 'h5.png' },
            space: { icon: '🌌', filename: 'h6.png' },
            ocean: { icon: '🌊', filename: 'h7.png' },
            desert: { icon: '🏜️', filename: 'h8.png' },
            castle: { icon: '🏰', filename: 'h9.png' }
        },
        
        menuPositions: {
            left: { icon: '⬅️' },
            right: { icon: '➡️' },
            up: { icon: '⬆️' },
            down: { icon: '⬇️' }
        },
        
        languages: {
            en: { icon: '🇺🇸', name: { en: 'English', uk: 'Англійська', ru: 'Английский' } },
            uk: { icon: '🇺🇦', name: { en: 'Ukrainian', uk: 'Українська', ru: 'Украинский' } },
            ru: { icon: '🇷🇺', name: { en: 'Russian', uk: 'Російська', ru: 'Русский' } }
        },
        
        // Категорії сторінок (як у бічному меню)
        pageCategories: {
            aws: { 
                icon: '📦',
                subcategories: {
                    calculator: {
                        icon: '🧮',
                        pages: ['calculator', 'arm', 'grind', 'roulette', 'boss']
                    },
                    info: {
                        icon: '📋',
                        pages: ['boosts', 'shiny', 'secret', 'codes', 'aura', 'trainer', 'charms', 'potions', 'worlds']
                    },
                    others: {
                        icon: '🔧',
                        pages: ['trader', 'clans']
                    }
                }
            },
            rcu: { 
                icon: '🎮',
                subcategories: {
                    rcuCalc: {
                        icon: '🧮',
                        pages: ['petscalc']
                    }
                }
            },
            system: { 
                icon: '⚙️',
                pages: ['settings', 'help', 'peoples']
            }
        }
    };

    Object.keys(CONFIG.backgrounds).forEach(key => {
        CONFIG.backgrounds[key].url = `AWS/image/bg/${CONFIG.backgrounds[key].filename}`;
    });

    // ========== STORAGE ==========
    const storage = {
        get: (key, defaultValue) => localStorage.getItem(`armHelper_${key}`) || defaultValue,
        set: (key, value) => localStorage.setItem(`armHelper_${key}`, value),
        getJSON: (key, defaultValue) => {
            try {
                const data = localStorage.getItem(`armHelper_${key}`);
                return data ? JSON.parse(data) : defaultValue;
            } catch {
                return defaultValue;
            }
        },
        setJSON: (key, value) => localStorage.setItem(`armHelper_${key}`, JSON.stringify(value))
    };

    // ========== BACKGROUND MANAGER ==========
    const backgroundManager = {
        async preload(background) {
            return new Promise((resolve) => {
                const config = CONFIG.backgrounds[background];
                if (!config) {
                    resolve(false);
                    return;
                }
                
                const img = new Image();
                img.onload = () => {
                    console.log(`✅ Background loaded: ${background}`);
                    resolve(config.url);
                };
                img.onerror = () => {
                    console.error(`❌ Failed to load: ${background}`);
                    resolve(false);
                };
                img.src = config.url;
            });
        },

        async apply(background) {
            const config = CONFIG.backgrounds[background];
            if (!config) {
                console.warn(`⚠️ Unknown background: ${background}`);
                return;
            }
            
            const imageUrl = await this.preload(background);
            const body = document.body;
            
            if (imageUrl) {
                body.style.background = `linear-gradient(135deg, rgba(41, 39, 35, 0.4) 0%, rgba(28, 26, 23, 0.6) 50%, rgba(20, 19, 17, 0.8) 100%), url('${imageUrl}') center center / cover no-repeat`;
                body.style.backgroundAttachment = 'scroll';
                console.log(`🎃 Background applied: ${background}`);
            } else {
                body.style.background = `linear-gradient(135deg, rgba(41, 39, 35, 0.9) 0%, rgba(28, 26, 23, 0.95) 50%, rgba(20, 19, 17, 1) 100%)`;
            }
        },

        async preloadAll() {
            console.log('🖼️ Preloading backgrounds...');
            const promises = Object.keys(CONFIG.backgrounds).map(bg => this.preload(bg));
            await Promise.allSettled(promises);
            console.log('✅ Backgrounds preloaded');
        }
    };

    // ========== MENU MANAGER ==========
    class MenuManager {
        constructor() {
            this.activeDropdown = null;
        }

        clearAll() {
            document.getElementById('staticMenu')?.remove();
            document.querySelectorAll('.category-dropdown').forEach(dropdown => dropdown.remove());
            
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            
            sidebar?.classList.remove('open');
            overlay?.classList.remove('show');
            
            ['left', 'right', 'up', 'down'].forEach(pos => {
                document.body.classList.remove(`menu-${pos}`);
            });
            
            this.closeDropdown();
        }

        show(menuType) {
            this.clearAll();
            document.body.classList.add(`menu-${menuType}`);
            
            if (menuType === 'left' || menuType === 'right') {
                this.setupSidebar(menuType);
            } else {
                this.createStatic(menuType);
            }
            
            state.currentMenuType = menuType;
        }

        setupSidebar(position) {
            const sidebar = document.getElementById('sidebar');
            const toggle = document.querySelector('.mobile-menu-toggle');
            
            if (sidebar) {
                sidebar.style.left = position === 'right' ? 'auto' : '-320px';
                sidebar.style.right = position === 'right' ? '-320px' : 'auto';
            }
            
            if (toggle) {
                toggle.style.left = position === 'right' ? 'auto' : '20px';
                toggle.style.right = position === 'right' ? '20px' : 'auto';
                setTimeout(() => createMenuButton(), 10);
            }
        }

        createStatic(position) {
            const isTop = position === 'up';
            const menu = document.createElement('div');
            menu.className = `static-menu menu-${isTop ? 'top' : 'bottom'}`;
            menu.id = 'staticMenu';
            
            // Категорії сторінок
            const categories = document.createElement('div');
            categories.className = 'menu-categories';
            
            // Додаємо кнопки категорій сторінок
            Object.keys(CONFIG.pageCategories).forEach(categoryKey => {
                const category = CONFIG.pageCategories[categoryKey];
                this.createCategoryButton(categories, categoryKey, category.icon);
            });
            
            menu.appendChild(categories);
            
            document.body.appendChild(menu);
            
            // Закриття дропдауну при кліку поза ним
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.menu-category')) {
                    this.closeDropdown();
                }
            });
            
            const currentPage = typeof window.getCurrentPage === 'function' ? window.getCurrentPage() : 'calculator';
            this.updateActive(currentPage);
            
            console.log('✅ Static menu created with page categories');
        }

        createCategoryButton(container, categoryKey, icon) {
            const category = CONFIG.pageCategories[categoryKey];
            if (!category) return;
            
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'menu-category';
            categoryDiv.dataset.category = categoryKey;
            
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.innerHTML = `<span>${icon}</span><span class="category-name">${categoryKey.toUpperCase()}</span>`;
            btn.onclick = (e) => {
                e.stopPropagation();
                this.toggleDropdown(categoryKey);
            };
            
            categoryDiv.appendChild(btn);
            
            // Створюємо dropdown
            let dropdown;
            if (category.subcategories) {
                // Для AWS та RCU - з підкатегоріями
                dropdown = this.createSubcategoriesDropdown(category.subcategories);
            } else {
                // Для System - прямі сторінки
                dropdown = this.createPagesDropdown(category.pages);
            }
            categoryDiv.appendChild(dropdown);
            
            container.appendChild(categoryDiv);
        }

        createSubcategoriesDropdown(subcategories) {
            const dropdown = document.createElement('div');
            dropdown.className = 'category-dropdown';
            
            Object.entries(subcategories).forEach(([subKey, subData]) => {
                // Заголовок підкатегорії
                const subHeader = document.createElement('div');
                subHeader.className = 'dropdown-subcategory-header';
                subHeader.innerHTML = `<span>${subData.icon}</span><span class="subcategory-name">${subKey}</span>`;
                dropdown.appendChild(subHeader);
                
                // Сторінки підкатегорії
                subData.pages.forEach(page => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'dropdown-item';
                    itemDiv.dataset.page = page;
                    
                    const pageInfo = this.getPageInfo(page);
                    itemDiv.innerHTML = `
                        <span class="dropdown-item-icon">${pageInfo.icon}</span>
                        <span class="dropdown-item-name">${pageInfo.name}</span>
                    `;
                    itemDiv.onclick = (e) => {
                        e.stopPropagation();
                        this.handleNav(page);
                    };
                    dropdown.appendChild(itemDiv);
                });
            });
            
            return dropdown;
        }

        createPagesDropdown(pages) {
            const dropdown = document.createElement('div');
            dropdown.className = 'category-dropdown';
            
            pages.forEach(page => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'dropdown-item';
                itemDiv.dataset.page = page;
                
                const pageInfo = this.getPageInfo(page);
                itemDiv.innerHTML = `
                    <span class="dropdown-item-icon">${pageInfo.icon}</span>
                    <span class="dropdown-item-name">${pageInfo.name}</span>
                `;
                itemDiv.onclick = (e) => {
                    e.stopPropagation();
                    this.handleNav(page);
                };
                dropdown.appendChild(itemDiv);
            });
            
            return dropdown;
        }

        getPageInfo(page) {
            const pageIcons = {
                // AWS Calculator
                calculator: '🐾',
                arm: '💪',
                grind: '🏋️‍♂️',
                roulette: '🎰',
                boss: '👹',
                // AWS Info
                boosts: '🚀',
                shiny: '✨',
                secret: '🔮',
                codes: '🎁',
                aura: '🌟',
                trainer: '🏆',
                charms: '🔮',
                potions: '🧪',
                worlds: '🌍',
                // AWS Others
                trader: '🛒',
                clans: '🏰',
                // RCU
                petscalc: '🐾',
                // System
                settings: '⚙️',
                help: '🆘',
                peoples: '🙏'
            };
            
            return {
                icon: pageIcons[page] || '📄',
                name: page.replace('_', ' ')
            };
        }

        toggleDropdown(categoryKey) {
            const categoryDiv = document.querySelector(`.menu-category[data-category="${categoryKey}"]`);
            if (!categoryDiv) return;
            
            const dropdown = categoryDiv.querySelector('.category-dropdown');
            const btn = categoryDiv.querySelector('.category-btn');
            
            // Закриваємо всі інші
            if (this.activeDropdown && this.activeDropdown !== dropdown) {
                this.closeDropdown();
            }
            
            // Перемикаємо поточний
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
                btn.classList.remove('active');
                this.activeDropdown = null;
            } else {
                dropdown.classList.add('show');
                btn.classList.add('active');
                this.activeDropdown = dropdown;
                this.updateDropdownActive();
            }
        }

        closeDropdown() {
            if (this.activeDropdown) {
                this.activeDropdown.classList.remove('show');
                const btn = this.activeDropdown.parentElement.querySelector('.category-btn');
                if (btn) btn.classList.remove('active');
                this.activeDropdown = null;
            }
        }

        updateDropdownActive() {
            const currentPage = typeof window.getCurrentPage === 'function' ? window.getCurrentPage() : 'calculator';
            
            document.querySelectorAll('.category-dropdown .dropdown-item').forEach(item => {
                item.classList.toggle('active', item.dataset.page === currentPage);
            });
        }

        handleNav(page) {
            if (typeof window.switchPage === 'function') {
                window.switchPage(page);
            }
            this.updateActive(page);
            this.closeDropdown();
        }

        updateActive(activePage) {
            // Оновлюємо активну сторінку в dropdown
            this.updateDropdownActive();
        }

        updateTranslations() {
            const lang = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
            if (!state.translations?.[lang]?.menu) return;
            
            const t = state.translations[lang].menu;
            const menu = document.getElementById('staticMenu');
            if (!menu) return;
            
            // Оновлюємо назви головних категорій
            const categoryNames = {
                aws: t.awsCategory || 'AWS',
                rcu: t.rcuCategory || 'RCU',
                system: t.systemCategory || 'System'
            };
            
            Object.entries(categoryNames).forEach(([categoryKey, name]) => {
                const btn = menu.querySelector(`.menu-category[data-category="${categoryKey}"] .category-name`);
                if (btn) btn.textContent = name;
            });
            
            // Оновлюємо назви підкатегорій
            const subcategoryNames = {
                calculator: t.calculator || 'Calculator',
                info: t.info || 'Info',
                others: t.others || 'Others',
                rcuCalc: t.rcuCalc || 'Calculators'
            };
            
            Object.entries(subcategoryNames).forEach(([subKey, name]) => {
                const subHeaders = menu.querySelectorAll(`.dropdown-subcategory-header .subcategory-name`);
                subHeaders.forEach(header => {
                    if (header.textContent === subKey) {
                        header.textContent = name;
                    }
                });
            });
            
            // Оновлюємо назви сторінок
            if (t.pages) {
                document.querySelectorAll('.category-dropdown .dropdown-item').forEach(item => {
                    const page = item.dataset.page;
                    const nameEl = item.querySelector('.dropdown-item-name');
                    if (nameEl && t.pages[page]) {
                        nameEl.textContent = t.pages[page];
                    }
                });
            }
        }
    }

    const menuManager = new MenuManager();

    // ========== MENU BUTTON ==========
    function createMenuButton() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        if (!toggle) return;
        
        toggle.innerHTML = '';
        [-4, 0, 4].forEach(pos => {
            const line = document.createElement('div');
            line.className = 'menu-line';
            line.style.transform = `translate(-50%, -50%) translateY(${pos}px)`;
            toggle.appendChild(line);
        });
    }

    function updateMenuButtonVisibility() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.getElementById('sidebar');
        
        if (toggle && sidebar) {
            toggle.classList.toggle('menu-open', sidebar.classList.contains('open'));
        }
    }

    function toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('show');
            updateMenuButtonVisibility();
        }
    }

    function closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
            updateMenuButtonVisibility();
        }
    }

    // ========== TRANSLATIONS ==========
    async function loadTranslations() {
        if (state.translations) return state.translations;
        
        try {
            const url = `${SETTINGS_BASE_PATH}system/moderation/menu.json`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            state.translations = await response.json();
            console.log('✅ Translations loaded');
            return state.translations;
        } catch (error) {
            console.error('❌ Translation error:', error);
            return null;
        }
    }

    // ========== UI UPDATES ==========
    const ui = {
        updateSettings(lang = null) {
            const currentLang = lang || (typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en');
            
            if (!state.translations?.[currentLang]) return;
            
            const t = state.translations[currentLang].settings;
            const page = document.getElementById('settingsPage');
            if (!page) return;
            
            const updates = [
                { selector: '.settings-title', text: t.title },
                { selector: '[data-category="language"] .category-title span:last-child', text: t.language },
                { selector: '[data-category="colors"] .category-title span:last-child', text: t.colors },
                { selector: '[data-category="background"] .category-title span:last-child', text: t.background },
                { selector: '[data-category="menu"] .category-title span:last-child', text: t.menu }
            ];
            
            updates.forEach(({ selector, text }) => {
                const el = page.querySelector(selector);
                if (el) el.textContent = text;
            });
            
            Object.keys(CONFIG.backgrounds).forEach(bg => {
                const el = page.querySelector(`[data-background="${bg}"] .option-name`);
                if (el && t[bg]) el.textContent = t[bg];
            });
            
            Object.keys(CONFIG.menuPositions).forEach(pos => {
                const el = page.querySelector(`[data-position="${pos}"] .menu-option-name`);
                if (el && t[pos]) el.textContent = t[pos];
            });
            
            this.updateLanguageNames();
            menuManager.updateTranslations();
        },

        updateLanguageNames() {
            const lang = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
            
            Object.keys(CONFIG.languages).forEach(langKey => {
                const el = document.querySelector(`[data-language="${langKey}"] .language-option-name`);
                if (el && CONFIG.languages[langKey].name[lang]) {
                    el.textContent = CONFIG.languages[langKey].name[lang];
                }
            });
        },

        updateColorThemeNames() {
            const lang = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
            const themes = window.colorThemes || {};
            
            Object.keys(themes).forEach(theme => {
                const el = document.querySelector(`[data-theme="${theme}"] .color-option-name`);
                if (el && themes[theme].name?.[lang]) {
                    el.textContent = themes[theme].name[lang];
                }
            });
        },

        updateBackground() {
            const current = storage.get('background', 'dodep');
            document.querySelectorAll('.background-option').forEach(opt => {
                opt.classList.toggle('active', opt.dataset.background === current);
            });
        },

        updateMenuPosition() {
            const current = storage.get('menuPosition', 'left');
            document.querySelectorAll('.menu-option').forEach(opt => {
                opt.classList.toggle('active', opt.dataset.position === current);
            });
        },

        updateLanguage() {
            const current = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
            document.querySelectorAll('.language-option').forEach(opt => {
                opt.classList.toggle('active', opt.dataset.language === current);
            });
        }
    };

    // ========== CATEGORIES ==========
    const categories = {
        toggle(name) {
            if (!state.categories.hasOwnProperty(name)) return;
            
            const wasOpen = state.categories[name];
            
            Object.keys(state.categories).forEach(cat => {
                state.categories[cat] = false;
                this.updateUI(cat, false);
            });
            
            if (!wasOpen) {
                state.categories[name] = true;
                this.updateUI(name, true);
            }
            
            storage.setJSON('categoriesState', state.categories);
        },

        updateUI(name, isOpen) {
            const page = document.getElementById('settingsPage');
            if (!page) return;
            
            const classMap = {
                colors: 'color-options',
                background: 'background-options',
                language: 'language-options',
                menu: 'menu-options'
            };
            
            const header = page.querySelector(`[data-category="${name}"] .category-header`);
            const options = page.querySelector(`.${classMap[name]}`);
            
            if (header && options) {
                header.classList.toggle('collapsed', !isOpen);
                options.classList.toggle('collapsed', !isOpen);
            }
        },

        load() {
            const saved = storage.getJSON('categoriesState', {});
            const openCount = Object.values(saved).filter(Boolean).length;
            
            if (openCount > 1) {
                Object.keys(state.categories).forEach(key => {
                    state.categories[key] = false;
                });
            } else {
                state.categories = { ...state.categories, ...saved };
            }
        },

        apply() {
            Object.keys(state.categories).forEach(cat => {
                this.updateUI(cat, state.categories[cat]);
            });
        }
    };

    // ========== CHANGE FUNCTIONS ==========
    async function changeBackground(bg) {
        if (!CONFIG.backgrounds[bg]) return;
        
        storage.set('background', bg);
        await backgroundManager.apply(bg);
        ui.updateBackground();
    }

    function changeMenuPosition(pos) {
        if (!CONFIG.menuPositions[pos]) return;
        
        storage.set('menuPosition', pos);
        menuManager.show(pos);
        ui.updateMenuPosition();
    }

    function changeLanguage(lang) {
        if (!CONFIG.languages[lang]) return;
        
        if (typeof window.switchAppLanguage === 'function') {
            window.switchAppLanguage(lang);
        }
        
        ui.updateLanguage();
    }

    // ========== HTML GENERATION ==========
    function createSettingsHTML() {
        const bgHTML = Object.entries(CONFIG.backgrounds).map(([key, bg]) => `
            <div class="background-option" data-background="${key}" onclick="changeBackground('${key}')">
                <div class="option-icon">${bg.icon}</div>
                <div class="option-name">Loading...</div>
                <div class="background-preview" style="background-image: url('${bg.url}')"></div>
            </div>
        `).join('');

        const menuHTML = Object.entries(CONFIG.menuPositions).map(([key, pos]) => `
            <div class="menu-option" data-position="${key}" onclick="changeMenuPosition('${key}')">
                <div class="menu-option-icon">${pos.icon}</div>
                <div class="menu-option-name">Loading...</div>
            </div>
        `).join('');

        const themes = window.colorThemes || {};
        const colorHTML = Object.entries(themes).map(([key, theme]) => `
            <div class="color-option" data-theme="${key}" onclick="changeColorTheme('${key}')">
                <div class="color-preview">
                    <div class="color-preview-split">
                        <div class="color-preview-left" style="background: ${theme.primary}"></div>
                        <div class="color-preview-right" style="background: ${theme.secondary}"></div>
                    </div>
                </div>
                <div class="color-option-name">${theme.name.en}</div>
            </div>
        `).join('');

        const langHTML = Object.entries(CONFIG.languages).map(([key, lang]) => `
            <div class="language-option" data-language="${key}" onclick="changeLanguage('${key}')">
                <div class="language-option-icon">${lang.icon}</div>
                <div class="language-option-name">${lang.name.en}</div>
            </div>
        `).join('');

        return `
            <div class="settings-container">
                <h1 class="settings-title">Settings</h1>
                
                <div class="settings-section" data-category="language">
                    <div class="category-header collapsed" onclick="toggleSettingsCategory('language')">
                        <div class="category-title">
                            <span class="section-icon">🌍</span>
                            <span>Language</span>
                        </div>
                        <span class="category-toggle">▼</span>
                    </div>
                    <div class="language-options collapsed">${langHTML}</div>
                </div>
                
                <div class="settings-section" data-category="colors">
                    <div class="category-header collapsed" onclick="toggleSettingsCategory('colors')">
                        <div class="category-title">
                            <span class="section-icon">🎨</span>
                            <span>Color Theme</span>
                        </div>
                        <span class="category-toggle">▼</span>
                    </div>
                    <div class="color-options collapsed">${colorHTML}</div>
                </div>
                
                <div class="settings-section" data-category="background">
                    <div class="category-header collapsed" onclick="toggleSettingsCategory('background')">
                        <div class="category-title">
                            <span class="section-icon">🎃</span>
                            <span>Background</span>
                        </div>
                        <span class="category-toggle">▼</span>
                    </div>
                    <div class="background-options collapsed">${bgHTML}</div>
                </div>
                
                <div class="settings-section" data-category="menu">
                    <div class="category-header collapsed" onclick="toggleSettingsCategory('menu')">
                        <div class="category-title">
                            <span class="section-icon">👻</span>
                            <span>Menu Position</span>
                        </div>
                        <span class="category-toggle">▼</span>
                    </div>
                    <div class="menu-options collapsed">${menuHTML}</div>
                </div>
            </div>
        `;
    }

    // ========== INITIALIZATION ==========
    async function initSettings() {
        if (state.initialized) {
            console.log('⚠️ Already initialized');
            return;
        }
        
        const page = document.getElementById('settingsPage');
        if (!page) {
            console.warn('⚠️ Settings page not found');
            return;
        }
        
        console.log('🔧 Initializing settings...');
        
        categories.load();
        page.innerHTML = createSettingsHTML();
        
        await loadTranslations();
        ui.updateSettings();
        ui.updateColorThemeNames();
        ui.updateLanguageNames();
        
        const bg = storage.get('background', 'dodep');
        await backgroundManager.apply(bg);
        ui.updateBackground();
        
        const menuPos = storage.get('menuPosition', 'left');
        menuManager.show(menuPos);
        ui.updateMenuPosition();
        
        if (typeof updateColorThemeUI === 'function') {
            updateColorThemeUI();
        }
        
        ui.updateLanguage();
        categories.apply();
        
        state.initialized = true;
        console.log('✅ Settings initialized');
    }

    async function initOnStart() {
        console.log('🚀 Startup initialization...');
        
        const bg = storage.get('background', 'dodep');
        await backgroundManager.apply(bg);
        
        await loadTranslations();
        
        const menuPos = storage.get('menuPosition', 'left');
        menuManager.show(menuPos);
        
        setTimeout(() => {
            if (typeof getCurrentAppLanguage === 'function') {
                menuManager.updateTranslations();
            }
        }, 500);
        
        console.log('✅ Startup complete');
    }

    // ========== EVENT LISTENERS ==========
    document.addEventListener('languageChanged', (e) => {
        if (state.initialized && e.detail?.language) {
            ui.updateSettings(e.detail.language);
            ui.updateColorThemeNames();
            ui.updateLanguageNames();
            menuManager.updateTranslations();
        }
    });

    document.addEventListener('pageChanged', (e) => {
        if (e.detail?.page) {
            menuManager.updateActive(e.detail.page);
        }
    });

    document.addEventListener('contentLoaded', () => {
        console.log('📦 Content loaded, re-initializing menu...');
        const pos = storage.get('menuPosition', 'left');
        menuManager.show(pos);
    });

    // ========== GLOBAL EXPORTS ==========
    Object.assign(window, {
        initializeSettings: initSettings,
        changeBackground,
        changeMenuPosition,
        changeLanguage,
        toggleSettingsCategory: (name) => categories.toggle(name),
        updateSettingsLanguage: (lang) => ui.updateSettings(lang),
        menuManager,
        toggleMobileMenu,
        closeSidebar,
        updateMenuButtonVisibility,
        createMenuButton,
        SETTINGS_BASE_PATH
    });

    // ========== AUTO INIT ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initOnStart();
            setTimeout(() => backgroundManager.preloadAll(), 1000);
        });
    } else {
        initOnStart();
        setTimeout(() => backgroundManager.preloadAll(), 1000);
    }

    console.log('✅ Settings module loaded with page categories');
    console.log('📍 Base path:', SETTINGS_BASE_PATH);

    window.settingsInitialized = true;

})();
