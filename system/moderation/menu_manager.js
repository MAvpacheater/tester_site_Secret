// ========== MENU MANAGER (COMPLETE WITH POSITION LOGIC) ==========
(function() {
    'use strict';
    
    if (window.menuManagerInitialized) return;

    // ========== STATE ==========
    const state = {
        currentPosition: null,
        mobileMenuOpen: false,
        activeDropdown: null,
        translations: null
    };

    // ========== CONFIG ==========
    const PAGE_ICONS = {
        calculator: '🐾', arm: '💪', grind: '🏋️‍♂️', roulette: '🎰', boss: '👹',
        boosts: '🚀', shiny: '✨', secret: '🔮', codes: '🎁', aura: '🌟',
        trainer: '🏆', charms: '🔮', potions: '🧪', worlds: '🌍',
        trader: '🛒', clans: '🏰', petscalc: '🐾',
        settings: '⚙️', help: '🆘', peoples: '🙏'
    };

    const MENU_STRUCTURE = {
        aws: {
            id: 'awsCategory',
            icon: '📦',
            subcategories: {
                calculator: { id: 'calculatorButtons', icon: '🧮', pages: ['calculator', 'arm', 'grind', 'roulette', 'boss'] },
                info: { id: 'infoButtons', icon: '📋', pages: ['boosts', 'shiny', 'secret', 'codes', 'aura', 'trainer', 'charms', 'potions', 'worlds'] },
                others: { id: 'othersAWSButtons', icon: '🔧', pages: ['trader', 'clans'] }
            }
        },
        rcu: {
            id: 'rcuCategory',
            icon: '🎮',
            subcategories: {
                calculator: { id: 'rcuCalculatorButtons', icon: '🧮', pages: ['petscalc'] }
            }
        },
        system: {
            id: 'systemCategory',
            icon: '⚙️',
            pages: ['settings', 'help', 'peoples']
        }
    };

    // ========== STORAGE ==========
    const storage = {
        get: (key, def) => localStorage.getItem(`armHelper_${key}`) || def,
        set: (key, val) => localStorage.setItem(`armHelper_${key}`, val)
    };

    // ========== TRANSLATIONS ==========
    async function loadTranslations() {
        if (state.translations) return state.translations;
        
        try {
            const response = await fetch('system/moderation/menu.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            state.translations = await response.json();
            return state.translations;
        } catch (error) {
            console.error('❌ Menu translation error:', error);
            return null;
        }
    }

    function getTranslation(key) {
        const lang = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
        if (!state.translations?.[lang]?.menu) return key;
        
        const parts = key.split('.');
        let value = state.translations[lang].menu;
        
        for (const part of parts) {
            value = value?.[part];
            if (!value) return key;
        }
        
        return value;
    }

    // ========== MOBILE MENU (LEFT/RIGHT) ==========
    const mobileMenu = {
        init() {
            this.setupToggleButton();
            this.setupSidebar();
            this.setupOverlay();
            this.attachEvents();
        },

        setupToggleButton() {
            const toggle = document.querySelector('.mobile-menu-toggle');
            if (!toggle) return;

            toggle.innerHTML = `
                <div class="menu-line" style="top: calc(50% - 8px); transform: translateX(-50%)"></div>
                <div class="menu-line" style="top: 50%; transform: translateX(-50%)"></div>
                <div class="menu-line" style="top: calc(50% + 8px); transform: translateX(-50%)"></div>
            `;
        },

        setupSidebar() {
            const sidebar = document.getElementById('sidebar');
            if (!sidebar) return;

            sidebar.style.display = 'flex';
        },

        setupOverlay() {
            const overlay = document.getElementById('sidebarOverlay');
            if (overlay) {
                overlay.style.display = 'block';
            }
        },

        attachEvents() {
            const toggle = document.querySelector('.mobile-menu-toggle');
            const overlay = document.getElementById('sidebarOverlay');

            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggle();
                });
            }

            if (overlay) {
                overlay.addEventListener('click', () => this.close());
            }
        },

        toggle() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            const toggle = document.querySelector('.mobile-menu-toggle');

            if (!sidebar) return;

            const isOpen = sidebar.classList.contains('open');

            if (isOpen) {
                this.close();
            } else {
                sidebar.classList.add('open');
                overlay?.classList.add('show');
                toggle?.classList.add('menu-open');
                state.mobileMenuOpen = true;
            }
        },

        close() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            const toggle = document.querySelector('.mobile-menu-toggle');

            sidebar?.classList.remove('open');
            overlay?.classList.remove('show');
            toggle?.classList.remove('menu-open');
            state.mobileMenuOpen = false;
        },

        cleanup() {
            this.close();
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            const toggle = document.querySelector('.mobile-menu-toggle');

            if (sidebar) sidebar.style.display = 'none';
            if (overlay) overlay.style.display = 'none';
            if (toggle) toggle.style.display = 'none';
        }
    };

    // ========== STATIC MENU (TOP/BOTTOM) ==========
    const staticMenu = {
        create(position) {
            const isTop = position === 'up';
            const menuId = isTop ? 'staticMenuTop' : 'staticMenuBottom';

            // Remove existing
            document.querySelectorAll('.static-menu').forEach(m => m.remove());

            const menu = document.createElement('div');
            menu.id = menuId;
            menu.className = `static-menu menu-${isTop ? 'top' : 'bottom'}`;

            menu.innerHTML = `
                <div class="menu-categories">
                    ${this.createCategories()}
                </div>
                <div class="settings-container-static">
                    <button class="settings-btn-static" onclick="switchPage('settings')" title="Settings">⚙️</button>
                </div>
            `;

            document.body.appendChild(menu);
            this.attachEvents(menuId);
            this.updateTranslations();
        },

        createCategories() {
            let html = '';

            // AWS
            html += this.createCategory('aws', MENU_STRUCTURE.aws);

            // RCU
            html += this.createCategory('rcu', MENU_STRUCTURE.rcu);

            // System
            html += this.createCategoryDirect('system', MENU_STRUCTURE.system);

            return html;
        },

        createCategory(key, config) {
            const subcatsHTML = Object.entries(config.subcategories).map(([subKey, subConfig]) => {
                const pagesHTML = subConfig.pages.map(page => 
                    `<div class="dropdown-item" data-page="${page}" onclick="switchPage('${page}')">
                        <span class="dropdown-item-icon">${PAGE_ICONS[page] || '📄'}</span>
                        <span class="dropdown-item-text" data-translate="pages.${page}"></span>
                    </div>`
                ).join('');

                return `
                    <div class="dropdown-subcategory-header" data-translate="${subKey}">
                        <span>${subConfig.icon}</span>
                        <span></span>
                    </div>
                    <div class="subcategory-items">${pagesHTML}</div>
                `;
            }).join('');

            return `
                <div class="menu-category" data-category="${config.id}">
                    <button class="category-btn" data-translate="${config.id}">
                        <span>${config.icon}</span>
                        <span></span>
                    </button>
                    <div class="category-dropdown">${subcatsHTML}</div>
                </div>
            `;
        },

        createCategoryDirect(key, config) {
            const pagesHTML = config.pages.map(page => 
                `<div class="dropdown-item" data-page="${page}" onclick="switchPage('${page}')">
                    <span class="dropdown-item-icon">${PAGE_ICONS[page] || '📄'}</span>
                    <span class="dropdown-item-text" data-translate="pages.${page}"></span>
                </div>`
            ).join('');

            return `
                <div class="menu-category" data-category="${config.id}">
                    <button class="category-btn" data-translate="${config.id}">
                        <span>${config.icon}</span>
                        <span></span>
                    </button>
                    <div class="category-dropdown">${pagesHTML}</div>
                </div>
            `;
        },

        attachEvents(menuId) {
            const menu = document.getElementById(menuId);
            if (!menu) return;

            menu.querySelectorAll('.category-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const category = btn.closest('.menu-category');
                    const dropdown = category.querySelector('.category-dropdown');
                    
                    // Close others
                    menu.querySelectorAll('.category-dropdown').forEach(d => {
                        if (d !== dropdown) d.classList.remove('show');
                    });
                    menu.querySelectorAll('.category-btn').forEach(b => {
                        if (b !== btn) b.classList.remove('active');
                    });

                    // Toggle current
                    dropdown.classList.toggle('show');
                    btn.classList.toggle('active');
                });
            });

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.static-menu')) {
                    menu.querySelectorAll('.category-dropdown').forEach(d => d.classList.remove('show'));
                    menu.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                }
            });

            // Update active page
            this.updateActiveState();
        },

        updateTranslations() {
            if (!state.translations) return;

            document.querySelectorAll('[data-translate]').forEach(el => {
                const key = el.getAttribute('data-translate');
                const text = getTranslation(key);
                
                const textSpan = el.querySelector('span:last-child');
                if (textSpan) {
                    textSpan.textContent = text;
                }
            });
        },

        updateActiveState(page) {
            const currentPage = page || (typeof getCurrentPage === 'function' ? getCurrentPage() : null);
            if (!currentPage) return;

            document.querySelectorAll('.static-menu .dropdown-item').forEach(item => {
                item.classList.toggle('active', item.dataset.page === currentPage);
            });
        },

        cleanup() {
            document.querySelectorAll('.static-menu').forEach(m => m.remove());
            document.body.style.paddingTop = '';
            document.body.style.paddingBottom = '';
        }
    };

    // ========== POSITION MANAGER ==========
    const menuPositionManager = {
        apply(position) {
            console.log('📍 Menu Position Manager: Applying position:', position);

            // Cleanup first
            mobileMenu.cleanup();
            staticMenu.cleanup();
            document.body.classList.remove('menu-left', 'menu-right', 'menu-up', 'menu-down');

            state.currentPosition = position;

            switch(position) {
                case 'left':
                case 'right':
                    document.body.classList.add(`menu-${position}`);
                    mobileMenu.init();
                    break;
                
                case 'up':
                case 'down':
                    document.body.classList.add(`menu-${position}`);
                    staticMenu.create(position);
                    break;
            }

            console.log('✅ Menu position applied:', position);
        },

        init() {
            const savedPosition = storage.get('menuPosition', 'left');
            this.apply(savedPosition);
        },

        updateActiveState(page) {
            const position = state.currentPosition;
            
            if (position === 'left' || position === 'right') {
                // Update sidebar buttons
                document.querySelectorAll('.sidebar .nav-btn').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.page === page);
                });
            } else {
                // Update static menu
                staticMenu.updateActiveState(page);
            }
        }
    };

    // ========== GLOBAL FUNCTIONS ==========
    window.toggleMobileMenu = function() {
        mobileMenu.toggle();
    };

    window.closeSidebar = function() {
        mobileMenu.close();
    };

    // ========== INITIALIZATION ==========
    async function init() {
        console.log('🎯 Menu Manager: Initializing...');

        await loadTranslations();
        menuPositionManager.init();

        // Listen for language changes
        document.addEventListener('languageChanged', () => {
            staticMenu.updateTranslations();
        });

        // Listen for page changes
        document.addEventListener('pageChanged', (e) => {
            if (e.detail?.page) {
                menuPositionManager.updateActiveState(e.detail.page);
                mobileMenu.close();
            }
        });

        console.log('✅ Menu Manager: Initialized');
    }

    // ========== EXPORTS ==========
    Object.assign(window, {
        menuPositionManager,
        toggleMobileMenu: window.toggleMobileMenu,
        closeSidebar: window.closeSidebar
    });

    // ========== AUTO INIT ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }

    window.menuManagerInitialized = true;
    console.log('✅ Menu Manager loaded');
})();
