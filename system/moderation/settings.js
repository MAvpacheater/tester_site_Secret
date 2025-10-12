// Optimized Settings with Fixed Category Menu
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
        menuCategories: {
            aws: {
                icon: '📦',
                pages: [
                    { page: 'calculator', icon: '🐾' },
                    { page: 'arm', icon: '💪' },
                    { page: 'grind', icon: '🏋️‍♂️' },
                    { page: 'roulette', icon: '🎰' },
                    { page: 'boss', icon: '👹' },
                    { page: 'boosts', icon: '🚀' },
                    { page: 'shiny', icon: '✨' },
                    { page: 'secret', icon: '🔮' },
                    { page: 'codes', icon: '🎁' },
                    { page: 'aura', icon: '🌟' },
                    { page: 'trainer', icon: '🏆' },
                    { page: 'charms', icon: '🔮' },
                    { page: 'potions', icon: '🧪' },
                    { page: 'worlds', icon: '🌍' },
                    { page: 'trader', icon: '🛒' },
                    { page: 'clans', icon: '🏰' }
                ]
            },
            rcu: {
                icon: '🎮',
                pages: [{ page: 'petscalc', icon: '🐾' }]
            },
            system: {
                icon: '⚙️',
                pages: [
                    { page: 'help', icon: '🆘' },
                    { page: 'peoples', icon: '🙏' },
                    { page: 'profile', icon: '👤' }
                ]
            }
        },
        
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

    // Add URLs to backgrounds
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
            this.dropdownPositioner = null;
        }

        clearAll() {
            // Remove static menu
            document.getElementById('staticMenu')?.remove();
            
            // Remove all dropdowns from body
            document.querySelectorAll('.category-dropdown').forEach(dropdown => {
                dropdown.remove();
            });
            
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            
            sidebar?.classList.remove('open');
            overlay?.classList.remove('show');
            
            ['left', 'right', 'up', 'down'].forEach(pos => {
                document.body.classList.remove(`menu-${pos}`);
            });
            
            this.closeDropdown();
            this.stopPositioner();
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
            
            const lang = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
            const t = state.translations?.[lang] || state.translations?.en || {};
            
            // Categories container
            const categoriesDiv = document.createElement('div');
            categoriesDiv.className = 'menu-categories';
            
            // Create categories
            Object.entries(CONFIG.menuCategories).forEach(([key, category]) => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'menu-category';
                categoryDiv.dataset.category = key;
                
                // Category button
                const btn = document.createElement('button');
                btn.className = 'category-btn';
                btn.dataset.categoryKey = key;
                btn.innerHTML = `${category.icon} <span class="category-name">${t[`${key}Category`] || key.toUpperCase()}</span>`;
                
                // Add click handler
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('===== CATEGORY CLICKED =====');
                    console.log('🖱️ Category:', key);
                    this.toggleDropdown(key, btn);
                });
                
                categoryDiv.appendChild(btn);
                categoriesDiv.appendChild(categoryDiv);
            });
            
            menu.appendChild(categoriesDiv);
            
            // Settings button
            const settingsContainer = document.createElement('div');
            settingsContainer.className = 'settings-container-static';
            const settingsBtn = document.createElement('button');
            settingsBtn.className = 'nav-btn settings-btn-static';
            settingsBtn.textContent = '⚙️';
            settingsBtn.onclick = () => this.handleNav('settings');
            settingsContainer.appendChild(settingsBtn);
            menu.appendChild(settingsContainer);
            
            document.body.appendChild(menu);
            
            // Create dropdowns AFTER menu, directly in body
            Object.entries(CONFIG.menuCategories).forEach(([key, category]) => {
                const dropdown = document.createElement('div');
                dropdown.className = 'category-dropdown';
                dropdown.dataset.dropdown = key;
                
                // Initially hide
                dropdown.style.cssText = `
                    display: none;
                    visibility: hidden;
                    opacity: 0;
                    position: fixed;
                    z-index: 9999;
                    pointer-events: none;
                `;
                
                // Add custom scrollbar styles
                const style = document.createElement('style');
                style.textContent = `
                    .category-dropdown::-webkit-scrollbar {
                        width: 8px;
                    }
                    .category-dropdown::-webkit-scrollbar-track {
                        background: rgba(25, 5, 45, 0.5);
                        border-radius: 4px;
                    }
                    .category-dropdown::-webkit-scrollbar-thumb {
                        background: linear-gradient(180deg, #FF6B00, #8B00FF);
                        border-radius: 4px;
                    }
                    .category-dropdown::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(180deg, #FF8C00, #9B30FF);
                    }
                `;
                if (!document.getElementById('dropdown-scrollbar-styles')) {
                    style.id = 'dropdown-scrollbar-styles';
                    document.head.appendChild(style);
                }
                
                category.pages.forEach(item => {
                    const dropdownItem = document.createElement('button');
                    dropdownItem.className = 'dropdown-item';
                    dropdownItem.dataset.page = item.page;
                    dropdownItem.innerHTML = `${item.icon} ${t.pages?.[item.page] || item.page}`;
                    
                    // Add inline styles for better appearance
                    dropdownItem.style.cssText = `
                        padding: 12px 16px;
                        font-size: 1.05em;
                        font-weight: 600;
                        color: #FFB84D;
                        background: linear-gradient(135deg, rgba(25, 5, 45, 0.6) 0%, rgba(50, 10, 70, 0.5) 100%);
                        border: 2px solid rgba(138, 43, 226, 0.5);
                        border-radius: 10px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        text-align: left;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
                        white-space: nowrap;
                        will-change: transform, background-color, border-color;
                    `;
                    
                    // Hover effect
                    dropdownItem.addEventListener('mouseenter', () => {
                        dropdownItem.style.background = 'linear-gradient(135deg, rgba(255, 107, 0, 0.4) 0%, rgba(138, 43, 226, 0.5) 100%)';
                        dropdownItem.style.borderColor = '#FF6B00';
                        dropdownItem.style.color = '#FF6B00';
                        dropdownItem.style.transform = 'translateX(5px) scale(1.02)';
                        dropdownItem.style.boxShadow = '0 4px 15px rgba(255, 107, 0, 0.4)';
                    });
                    
                    dropdownItem.addEventListener('mouseleave', () => {
                        if (!dropdownItem.classList.contains('active')) {
                            dropdownItem.style.background = 'linear-gradient(135deg, rgba(25, 5, 45, 0.6) 0%, rgba(50, 10, 70, 0.5) 100%)';
                            dropdownItem.style.borderColor = 'rgba(138, 43, 226, 0.5)';
                            dropdownItem.style.color = '#FFB84D';
                            dropdownItem.style.transform = 'translateX(0) scale(1)';
                            dropdownItem.style.boxShadow = 'none';
                        }
                    });
                    
                    dropdownItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.handleNav(item.page);
                    });
                    
                    dropdown.appendChild(dropdownItem);
                });
                
                document.body.appendChild(dropdown);
                console.log(`✅ Dropdown created: ${key} (${category.pages.length} items)`);
            });
            
            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.menu-category') && 
                    !e.target.closest('.category-dropdown')) {
                    this.closeDropdown();
                }
            });
            
            const currentPage = typeof window.getCurrentPage === 'function' ? 
                window.getCurrentPage() : 'calculator';
            this.updateActive(currentPage);
            
            console.log('✅ Static menu created');
        }

        toggleDropdown(catKey, btnElement) {
            console.log('===== TOGGLE DROPDOWN =====');
            
            const dropdown = document.querySelector(`[data-dropdown="${catKey}"]`);
            
            if (!dropdown) {
                console.error('❌ Dropdown not found:', catKey);
                return;
            }
            
            // If already open, close
            if (state.activeDropdown === catKey) {
                console.log('🔒 Closing');
                this.closeDropdown();
                return;
            }
            
            // Close previous
            this.closeDropdown();
            
            // Get menu position
            const menu = document.getElementById('staticMenu');
            const isTop = menu?.classList.contains('menu-top');
            
            // Show dropdown
            dropdown.style.cssText = `
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
                pointer-events: auto !important;
                position: fixed !important;
                z-index: 99999 !important;
                flex-direction: column !important;
                min-width: 250px;
                max-width: 350px;
                background: linear-gradient(135deg, rgba(25, 5, 45, 0.98) 0%, rgba(50, 10, 70, 0.99) 100%) !important;
                border: 3px solid #8B00FF !important;
                border-radius: 15px !important;
                padding: 10px !important;
                gap: 8px !important;
                box-shadow: 0 10px 40px rgba(138, 43, 226, 0.7), 0 0 50px rgba(255, 107, 0, 0.4) !important;
                backdrop-filter: blur(20px) !important;
                max-height: 70vh !important;
                overflow-y: auto !important;
                transition: opacity 0.2s ease, transform 0.2s ease !important;
                transform: translateY(0) !important;
            `;
            
            dropdown.classList.add('show');
            btnElement.classList.add('expanded');
            state.activeDropdown = catKey;
            
            // Initial animation state
            dropdown.style.opacity = '0';
            dropdown.style.transform = isTop ? 'translateY(-10px)' : 'translateY(10px)';
            
            // Position
            this.positionDropdown(dropdown, btnElement, isTop);
            
            // Trigger animation
            requestAnimationFrame(() => {
                dropdown.style.opacity = '1';
                dropdown.style.transform = 'translateY(0)';
            });
            
            // Log position
            const rect = dropdown.getBoundingClientRect();
            console.log('📐 Dropdown positioned:', {
                left: dropdown.style.left,
                top: dropdown.style.top,
                bottom: dropdown.style.bottom,
                visible: rect.width > 0 && rect.height > 0
            });
            
            // Start updater
            this.startPositioner(dropdown, btnElement, isTop);
            
            console.log('✅ Opened:', catKey);
        }

        positionDropdown(dropdown, btn, isTop) {
            const btnRect = btn.getBoundingClientRect();
            
            dropdown.style.position = 'fixed';
            dropdown.style.left = `${btnRect.left}px`;
            dropdown.style.zIndex = '99999';
            
            if (isTop) {
                dropdown.style.top = `${btnRect.bottom + 10}px`;
                dropdown.style.bottom = 'auto';
            } else {
                dropdown.style.bottom = `${window.innerHeight - btnRect.top + 10}px`;
                dropdown.style.top = 'auto';
            }
        }

        startPositioner(dropdown, btn, isTop) {
            this.stopPositioner();
            
            let rafId = null;
            let lastPosition = { left: 0, top: 0, bottom: 0 };
            
            const reposition = () => {
                if (!state.activeDropdown || !dropdown.classList.contains('show')) {
                    this.stopPositioner();
                    return;
                }
                
                const btnRect = btn.getBoundingClientRect();
                const newLeft = btnRect.left;
                const newTop = isTop ? btnRect.bottom + 10 : null;
                const newBottom = !isTop ? window.innerHeight - btnRect.top + 10 : null;
                
                // Only update if position changed (optimization)
                if (newLeft !== lastPosition.left || 
                    newTop !== lastPosition.top || 
                    newBottom !== lastPosition.bottom) {
                    
                    dropdown.style.left = `${newLeft}px`;
                    
                    if (isTop) {
                        dropdown.style.top = `${newTop}px`;
                        dropdown.style.bottom = 'auto';
                    } else {
                        dropdown.style.bottom = `${newBottom}px`;
                        dropdown.style.top = 'auto';
                    }
                    
                    lastPosition = { left: newLeft, top: newTop, bottom: newBottom };
                }
                
                rafId = requestAnimationFrame(reposition);
            };
            
            // Start repositioning with requestAnimationFrame
            rafId = requestAnimationFrame(reposition);
            
            // Save RAF ID for cleanup
            this.dropdownPositioner = { rafId, type: 'raf' };
        }

        stopPositioner() {
            if (this.dropdownPositioner) {
                if (this.dropdownPositioner.type === 'raf' && this.dropdownPositioner.rafId) {
                    cancelAnimationFrame(this.dropdownPositioner.rafId);
                } else if (typeof this.dropdownPositioner === 'number') {
                    clearInterval(this.dropdownPositioner);
                }
                this.dropdownPositioner = null;
            }
        }

        closeDropdown() {
            if (!state.activeDropdown) return;
            
            const dropdown = document.querySelector(`[data-dropdown="${state.activeDropdown}"]`);
            const btn = document.querySelector(`[data-category-key="${state.activeDropdown}"]`);
            
            if (dropdown) {
                // Animate out
                const menu = document.getElementById('staticMenu');
                const isTop = menu?.classList.contains('menu-top');
                
                dropdown.style.opacity = '0';
                dropdown.style.transform = isTop ? 'translateY(-10px)' : 'translateY(10px)';
                
                // Wait for animation then hide
                setTimeout(() => {
                    dropdown.classList.remove('show');
                    dropdown.style.display = 'none';
                }, 200);
            }
            
            if (btn) btn.classList.remove('expanded');
            
            state.activeDropdown = null;
            this.stopPositioner();
        }

        handleNav(page) {
            if (typeof window.switchPage === 'function') {
                window.switchPage(page);
            }
            this.updateActive(page);
            this.closeDropdown();
        }

        updateActive(activePage) {
            const menu = document.getElementById('staticMenu');
            if (!menu) return;
            
            // Update dropdown items
            document.querySelectorAll('.dropdown-item').forEach(item => {
                const isActive = item.dataset.page === activePage;
                item.classList.toggle('active', isActive);
                
                if (isActive) {
                    item.style.background = 'linear-gradient(135deg, #FF6B00, #8B00FF)';
                    item.style.borderColor = '#FFB84D';
                    item.style.color = '#FFF';
                    item.style.boxShadow = '0 4px 20px rgba(255, 107, 0, 0.6)';
                    item.style.transform = 'translateX(5px)';
                } else {
                    item.style.background = 'linear-gradient(135deg, rgba(25, 5, 45, 0.6) 0%, rgba(50, 10, 70, 0.5) 100%)';
                    item.style.borderColor = 'rgba(138, 43, 226, 0.5)';
                    item.style.color = '#FFB84D';
                    item.style.boxShadow = 'none';
                    item.style.transform = 'translateX(0)';
                }
            });
            
            // Update settings button
            menu.querySelector('.settings-btn-static')?.classList
                .toggle('active', activePage === 'settings');
            
            // Update category buttons
            Object.entries(CONFIG.menuCategories).forEach(([key, category]) => {
                const btn = menu.querySelector(`[data-category="${key}"] .category-btn`);
                if (btn) {
                    const isActive = category.pages.some(item => item.page === activePage);
                    btn.classList.toggle('active', isActive);
                }
            });
        }

        updateTranslations() {
            const menu = document.getElementById('staticMenu');
            if (!menu) return;
            
            const lang = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
            const t = state.translations?.[lang] || state.translations?.en || {};
            
            Object.keys(CONFIG.menuCategories).forEach(key => {
                const nameEl = menu.querySelector(`[data-category="${key}"] .category-name`);
                if (nameEl && t[`${key}Category`]) {
                    nameEl.textContent = t[`${key}Category`];
                }
            });
            
            document.querySelectorAll('.dropdown-item').forEach(item => {
                const page = item.dataset.page;
                if (t.pages?.[page]) {
                    const category = Object.values(CONFIG.menuCategories)
                        .find(cat => cat.pages.some(p => p.page === page));
                    const icon = category?.pages.find(p => p.page === page)?.icon || '';
                    item.innerHTML = `${icon} ${t.pages[page]}`;
                }
            });
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
            const currentLang = lang || (typeof getCurrentAppLanguage === 'function' ? 
                getCurrentAppLanguage() : 'en');
            
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
            const current = typeof getCurrentAppLanguage === 'function' ? 
                getCurrentAppLanguage() : 'en';
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
                <div class="color-option-icon">${theme.icon}</div>
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
                <h1 class="settings-title">⚙️ Settings</h1>
                
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

    console.log('✅ Settings module loaded');
    console.log('📍 Base path:', SETTINGS_BASE_PATH);

    window.settingsInitialized = true;

})();
