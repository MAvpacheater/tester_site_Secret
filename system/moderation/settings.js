// ========== SETTINGS MODULE (ВИПРАВЛЕНО ПІДСВІЧУВАННЯ) ==========
(function() {
    'use strict';
    
    if (window.settingsInitialized) return;

    // ========== STATE ==========
    const state = {
        initialized: false,
        translations: null,
        categories: { background: false, menu: false, colors: false, language: false }
    };

    // ========== CONFIG ==========
    const getBasePath = () => {
        const { protocol, host, pathname } = window.location;
        if (host === 'mavpacheater.github.io') return `${protocol}//${host}/tester_site_Secret/`;
        if (host.includes('localhost') || host.includes('127.0.0.1')) {
            const parts = pathname.split('/').filter(Boolean);
            if (parts.length && parts[0] !== 'AWS') return `${protocol}//${host}/${parts[0]}/`;
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
        }
    };

    Object.keys(CONFIG.backgrounds).forEach(key => {
        CONFIG.backgrounds[key].url = `AWS/image/bg/${CONFIG.backgrounds[key].filename}`;
    });

    // ========== STORAGE ==========
    const storage = {
        get: (key, def) => localStorage.getItem(`armHelper_${key}`) || def,
        set: (key, val) => localStorage.setItem(`armHelper_${key}`, val),
        getJSON: (key, def) => {
            try {
                const data = localStorage.getItem(`armHelper_${key}`);
                return data ? JSON.parse(data) : def;
            } catch { return def; }
        },
        setJSON: (key, val) => localStorage.setItem(`armHelper_${key}`, JSON.stringify(val))
    };

    // ========== BACKGROUND MANAGER ==========
    const backgroundManager = {
        cache: new Map(),
        
        async preload(bg) {
            if (this.cache.has(bg)) return this.cache.get(bg);
            
            const config = CONFIG.backgrounds[bg];
            if (!config) return null;
            
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    this.cache.set(bg, config.url);
                    resolve(config.url);
                };
                img.onerror = () => resolve(null);
                img.src = config.url;
            });
        },

        async apply(bg) {
            const imageUrl = await this.preload(bg);
            const body = document.body;
            
            body.style.background = imageUrl 
                ? `linear-gradient(135deg, rgba(41,39,35,0.4) 0%, rgba(28,26,23,0.6) 50%, rgba(20,19,17,0.8) 100%), url('${imageUrl}') center center / cover no-repeat`
                : `linear-gradient(135deg, rgba(41,39,35,0.9) 0%, rgba(28,26,23,0.95) 50%, rgba(20,19,17,1) 100%)`;
            body.style.backgroundAttachment = 'scroll';
        },

        async preloadAll() {
            const promises = Object.keys(CONFIG.backgrounds).map(bg => this.preload(bg));
            await Promise.allSettled(promises);
        }
    };

    // ========== TRANSLATIONS ==========
    async function loadTranslations() {
        if (state.translations) return state.translations;
        
        try {
            const response = await fetch(`${SETTINGS_BASE_PATH}system/moderation/menu.json`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            state.translations = await response.json();
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
                { sel: '.settings-title', txt: t.title },
                { sel: '[data-category="language"] .category-title span:last-child', txt: t.language },
                { sel: '[data-category="colors"] .category-title span:last-child', txt: t.colors },
                { sel: '[data-category="background"] .category-title span:last-child', txt: t.background },
                { sel: '[data-category="menu"] .category-title span:last-child', txt: t.menu }
            ];
            
            requestAnimationFrame(() => {
                updates.forEach(({ sel, txt }) => {
                    const el = page.querySelector(sel);
                    if (el) el.textContent = txt;
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
            });
        },

        updateLanguageNames() {
            const lang = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
            Object.keys(CONFIG.languages).forEach(key => {
                const el = document.querySelector(`[data-language="${key}"] .language-option-name`);
                if (el && CONFIG.languages[key].name[lang]) {
                    el.textContent = CONFIG.languages[key].name[lang];
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
            console.log('🖼️ Updating background UI, current:', current);
            document.querySelectorAll('.background-option').forEach(opt => {
                const isActive = opt.dataset.background === current;
                opt.classList.toggle('active', isActive);
            });
        },

        updateMenuPosition() {
            const current = storage.get('menuPosition', 'left');
            console.log('📍 Updating menu position UI, current:', current);
            document.querySelectorAll('.menu-option').forEach(opt => {
                const isActive = opt.dataset.position === current;
                opt.classList.toggle('active', isActive);
            });
        },

        updateLanguage() {
            const current = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
            console.log('🌍 Updating language UI, current:', current);
            document.querySelectorAll('.language-option').forEach(opt => {
                const isActive = opt.dataset.language === current;
                opt.classList.toggle('active', isActive);
            });
        },

        updateAllUI() {
            this.updateBackground();
            this.updateMenuPosition();
            this.updateLanguage();
            if (typeof updateColorThemeUI === 'function') {
                updateColorThemeUI();
            }
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
                requestAnimationFrame(() => {
                    header.classList.toggle('collapsed', !isOpen);
                    options.classList.toggle('collapsed', !isOpen);
                });
            }
        },

        load() {
            const saved = storage.getJSON('categoriesState', {});
            const openCount = Object.values(saved).filter(Boolean).length;
            
            if (openCount > 1) {
                Object.keys(state.categories).forEach(key => state.categories[key] = false);
            } else {
                state.categories = { ...state.categories, ...saved };
            }
        },

        apply() {
            Object.keys(state.categories).forEach(cat => this.updateUI(cat, state.categories[cat]));
        }
    };

    // ========== CHANGE FUNCTIONS ==========
    async function changeBackground(bg) {
        if (!CONFIG.backgrounds[bg]) return;
        console.log('🖼️ Changing background to:', bg);
        storage.set('background', bg);
        await backgroundManager.apply(bg);
        ui.updateBackground();
    }

    function changeMenuPosition(pos) {
        if (!CONFIG.menuPositions[pos]) return;
        console.log('📍 Changing menu position to:', pos);
        
        // 1. Зберігаємо в storage
        storage.set('menuPosition', pos);
        
        // 2. Оновлюємо UI негайно
        ui.updateMenuPosition();
        
        // 3. Застосовуємо позицію меню
        if (window.menuPositionManager?.apply) {
            window.menuPositionManager.apply(pos);
        }
    }

    function changeLanguage(lang) {
        if (!CONFIG.languages[lang]) return;
        console.log('🌍 Changing language to:', lang);
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
        if (state.initialized) return;
        
        const page = document.getElementById('settingsPage');
        if (!page) return;
        
        console.log('⚙️ Initializing Settings...');
        
        categories.load();
        page.innerHTML = createSettingsHTML();
        
        await loadTranslations();
        
        requestAnimationFrame(() => {
            ui.updateSettings();
            ui.updateColorThemeNames();
            ui.updateLanguageNames();
            ui.updateAllUI();
            categories.apply();
        });
        
        const bg = storage.get('background', 'dodep');
        await backgroundManager.apply(bg);
        
        state.initialized = true;
        console.log('✅ Settings initialized');
    }

    async function initOnStart() {
        const bg = storage.get('background', 'dodep');
        await backgroundManager.apply(bg);
        await loadTranslations();
    }

    // ========== EVENT LISTENERS ==========
    let languageChangeTimeout = null;
    document.addEventListener('languageChanged', (e) => {
        if (!state.initialized || !e.detail?.language) return;
        
        clearTimeout(languageChangeTimeout);
        languageChangeTimeout = setTimeout(() => {
            requestAnimationFrame(() => {
                ui.updateSettings(e.detail.language);
                ui.updateColorThemeNames();
                ui.updateLanguageNames();
            });
        }, 100);
    });

    // Слухаємо зміни сторінки - оновлюємо UI при поверненні на settings
    document.addEventListener('pageChanged', (e) => {
        if (e.detail?.page === 'settings' && state.initialized) {
            console.log('📄 Returned to settings, updating UI...');
            setTimeout(() => {
                ui.updateAllUI();
            }, 100);
        }
    });

    // ========== GLOBAL EXPORTS ==========
    Object.assign(window, {
        initializeSettings: initSettings,
        changeBackground,
        changeMenuPosition,
        changeLanguage,
        toggleSettingsCategory: (name) => categories.toggle(name),
        updateSettingsLanguage: (lang) => ui.updateSettings(lang),
        SETTINGS_BASE_PATH
    });

    // ========== AUTO INIT ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initOnStart();
            setTimeout(() => backgroundManager.preloadAll(), 2000);
        });
    } else {
        initOnStart();
        setTimeout(() => backgroundManager.preloadAll(), 2000);
    }

    window.settingsInitialized = true;

})();
