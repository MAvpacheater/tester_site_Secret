// ========== MENU MANAGER MODULE (FIXED RIGHT MENU) ==========
(function() {
    'use strict';
    
    if (window.menuManagerInitialized) {
        console.log('⚠️ Menu Manager already initialized, reinitializing...');
        delete window.menuManagerInitialized;
    }

    // ========== CONFIG ==========
    const PAGE_ICONS = window.PAGE_ICONS || {
        calculator: '🐾', arm: '💪', grind: '🏋️‍♂️', roulette: '🎰', boss: '👹',
        boosts: '🚀', shiny: '✨', secret: '🔮', codes: '🎁', aura: '🌟',
        trainer: '🏆', charms: '🔮', potions: '🧪', worlds: '🌍',
        trader: '🛒', clans: '🏰', petscalc: '🐾',
        settings: '⚙️', help: '🆘', peoples: '🙏'
    };

    const PAGE_CATEGORIES = {
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
    };

    // ========== STATE ==========
    const state = {
        currentPosition: null,
        activeDropdown: null,
        activeCategory: null,
        translations: null,
        staticMenuInstance: null,
        sidebarInstance: null
    };

    // ========== STATIC MENU CLASS ==========
    class StaticMenuManager {
        constructor() {
            this.clickHandler = this.handleDocumentClick.bind(this);
            this.menuElement = null;
        }

        create(position) {
            console.log('🔨 Creating static menu for position:', position);
            
            this.destroy();
            
            const menu = document.createElement('div');
            menu.className = `static-menu menu-${position === 'up' ? 'top' : 'bottom'}`;
            menu.id = 'staticMenu';
            menu.setAttribute('data-menu-position', position);
            
            const categories = document.createElement('div');
            categories.className = 'menu-categories';
            
            Object.keys(PAGE_CATEGORIES).forEach(key => {
                this.createCategoryBtn(categories, key);
            });
            
            const settingsContainer = document.createElement('div');
            settingsContainer.className = 'settings-container-static';
            
            const settingsBtn = document.createElement('button');
            settingsBtn.className = 'settings-btn-static';
            settingsBtn.innerHTML = '⚙️';
            settingsBtn.onclick = (e) => {
                e.stopPropagation();
                if (typeof window.switchPage === 'function') {
                    window.switchPage('settings');
                }
                this.closeAll();
            };
            
            settingsContainer.appendChild(settingsBtn);
            menu.appendChild(categories);
            menu.appendChild(settingsContainer);
            
            document.body.appendChild(menu);
            this.menuElement = menu;
            
            document.addEventListener('click', this.clickHandler);
            
            const currentPage = typeof window.getCurrentPage === 'function' ? window.getCurrentPage() : 'calculator';
            this.updateActive(currentPage);
            
            setTimeout(() => this.updateTranslations(), 100);
            
            console.log('✅ Static menu created successfully');
        }

        destroy() {
            console.log('🗑️ Destroying static menu');
            
            const oldMenu = document.getElementById('staticMenu');
            if (oldMenu) oldMenu.remove();
            
            document.querySelectorAll('.category-dropdown').forEach(d => d.remove());
            this.closeAll();
            document.removeEventListener('click', this.clickHandler);
            
            this.menuElement = null;
        }

        createCategoryBtn(container, catKey) {
            const category = PAGE_CATEGORIES[catKey];
            if (!category) return;
            
            const div = document.createElement('div');
            div.className = 'menu-category';
            div.dataset.category = catKey;
            
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.innerHTML = `<span>${category.icon}</span><span class="category-name">${catKey.toUpperCase()}</span>`;
            btn.onclick = (e) => {
                e.stopPropagation();
                this.toggle(catKey);
            };
            
            div.appendChild(btn);
            div.appendChild(this.createDropdown(category));
            container.appendChild(div);
        }

        createDropdown(category) {
            const dropdown = document.createElement('div');
            dropdown.className = 'category-dropdown';
            
            if (category.subcategories) {
                Object.entries(category.subcategories).forEach(([subKey, subData]) => {
                    const header = document.createElement('div');
                    header.className = 'dropdown-subcategory-header';
                    header.innerHTML = `<span>${subData.icon}</span><span class="subcategory-name" data-key="${subKey}">${subKey}</span>`;
                    header.dataset.subcategory = subKey;
                    header.onclick = (e) => {
                        e.stopPropagation();
                        this.toggleSubcategory(header);
                    };
                    dropdown.appendChild(header);
                    
                    const items = document.createElement('div');
                    items.className = 'subcategory-items collapsed';
                    items.dataset.subcategory = subKey;
                    
                    subData.pages.forEach(page => {
                        items.appendChild(this.createPageItem(page));
                    });
                    
                    dropdown.appendChild(items);
                });
            } else {
                category.pages.forEach(page => {
                    dropdown.appendChild(this.createPageItem(page));
                });
            }
            
            return dropdown;
        }

        createPageItem(page) {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.dataset.page = page;
            item.innerHTML = `
                <span class="dropdown-item-icon">${PAGE_ICONS[page] || '📄'}</span>
                <span class="dropdown-item-name" data-page="${page}">${page.replace('_', ' ')}</span>
            `;
            item.onclick = (e) => {
                e.stopPropagation();
                this.handleNav(page);
            };
            return item;
        }

        toggleSubcategory(header) {
            const dropdown = header.closest('.category-dropdown');
            const targetSubcat = header.dataset.subcategory;
            const targetItems = dropdown.querySelector(`.subcategory-items[data-subcategory="${targetSubcat}"]`);
            
            if (!targetItems) return;
            
            const wasOpen = !targetItems.classList.contains('collapsed');
            
            dropdown.querySelectorAll('.subcategory-items').forEach(items => {
                items.classList.add('collapsed');
            });
            dropdown.querySelectorAll('.dropdown-subcategory-header').forEach(h => {
                h.classList.remove('active');
            });
            
            if (!wasOpen) {
                targetItems.classList.remove('collapsed');
                header.classList.add('active');
            }
        }

        toggle(catKey) {
            const catDiv = document.querySelector(`.menu-category[data-category="${catKey}"]`);
            if (!catDiv) return;
            
            const dropdown = catDiv.querySelector('.category-dropdown');
            const btn = catDiv.querySelector('.category-btn');
            const isOpen = dropdown.classList.contains('show');
            
            this.closeAll();
            
            if (!isOpen) {
                dropdown.classList.add('show');
                btn.classList.add('active');
                state.activeDropdown = dropdown;
                state.activeCategory = catKey;
                this.updateDropdownActive();
            }
        }

        closeAll() {
            document.querySelectorAll('.category-dropdown').forEach(d => {
                d.classList.remove('show');
                d.querySelectorAll('.subcategory-items').forEach(items => {
                    items.classList.add('collapsed');
                });
                d.querySelectorAll('.dropdown-subcategory-header').forEach(h => {
                    h.classList.remove('active');
                });
            });
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            state.activeDropdown = null;
            state.activeCategory = null;
        }

        handleDocumentClick(e) {
            if (!e.target.closest('.menu-category') && !e.target.closest('.settings-btn-static')) {
                this.closeAll();
            }
        }

        updateDropdownActive() {
            const currentPage = typeof window.getCurrentPage === 'function' ? window.getCurrentPage() : 'calculator';
            document.querySelectorAll('.dropdown-item').forEach(item => {
                item.classList.toggle('active', item.dataset.page === currentPage);
            });
            
            const settingsBtn = document.querySelector('.settings-btn-static');
            if (settingsBtn) {
                settingsBtn.classList.toggle('active', currentPage === 'settings');
            }
        }

        handleNav(page) {
            if (typeof window.switchPage === 'function') {
                window.switchPage(page);
            }
            this.updateActive(page);
            this.closeAll();
        }

        updateActive(page) {
            this.updateDropdownActive();
        }

        updateTranslations() {
            const lang = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
            if (!state.translations?.[lang]?.menu) return;
            
            const t = state.translations[lang].menu;
            const menu = document.getElementById('staticMenu');
            if (!menu) return;
            
            const catNames = { 
                aws: t.awsCategory || 'AWS', 
                rcu: t.rcuCategory || 'RCU', 
                system: t.systemCategory || 'System' 
            };
            
            Object.entries(catNames).forEach(([key, name]) => {
                const el = menu.querySelector(`.menu-category[data-category="${key}"] .category-name`);
                if (el) el.textContent = name;
            });
            
            menu.querySelectorAll('.subcategory-name[data-key]').forEach(nameEl => {
                const subKey = nameEl.dataset.key;
                if (subKey && t[subKey]) {
                    nameEl.textContent = t[subKey];
                }
            });
            
            if (t.pages) {
                menu.querySelectorAll('.dropdown-item-name[data-page]').forEach(nameEl => {
                    const page = nameEl.dataset.page;
                    if (page && t.pages[page]) {
                        nameEl.textContent = t.pages[page];
                    }
                });
            }
        }
    }

    // ========== SIDEBAR MENU CLASS (FIXED) ==========
    class SidebarMenuManager {
        constructor() {
            this.closeHandler = this.handleClose.bind(this);
            this.currentPosition = null;
        }

        init(position) {
            console.log('🔨 Initializing sidebar for position:', position);
            
            this.currentPosition = position;
            this.updateSidebarPosition(position);
            this.attachHandlers();
            this.createMenuButton(position);
            
            console.log('✅ Sidebar initialized for:', position);
        }

        destroy() {
            console.log('🗑️ Destroying sidebar handlers');
            this.removeHandlers();
            this.currentPosition = null;
        }

        updateSidebarPosition(position) {
            const sidebar = document.getElementById('sidebar');
            const toggle = document.querySelector('.mobile-menu-toggle');
            
            if (!sidebar) return;
            
            // Скидаємо всі позиційні класи та стилі
            sidebar.style.left = '';
            sidebar.style.right = '';
            sidebar.style.transform = '';
            sidebar.style.borderLeft = '';
            sidebar.style.borderRight = '';
            sidebar.style.borderRadius = '';
            sidebar.style.boxShadow = '';
            
            if (position === 'right') {
                // Праве меню
                sidebar.style.right = '-320px';
                sidebar.style.left = 'auto';
                sidebar.style.borderLeft = '3px solid #8B00FF';
                sidebar.style.borderRight = 'none';
                sidebar.style.borderRadius = '15px 0 0 15px';
                sidebar.style.boxShadow = '-2px 0 40px rgba(138,43,226,0.6)';
                
                if (toggle) {
                    toggle.style.right = '15px';
                    toggle.style.left = 'auto';
                }
            } else {
                // Ліве меню
                sidebar.style.left = '-320px';
                sidebar.style.right = 'auto';
                sidebar.style.borderRight = '3px solid #8B00FF';
                sidebar.style.borderLeft = 'none';
                sidebar.style.borderRadius = '0 15px 15px 0';
                sidebar.style.boxShadow = '2px 0 40px rgba(138,43,226,0.6)';
                
                if (toggle) {
                    toggle.style.left = '15px';
                    toggle.style.right = 'auto';
                }
            }
            
            console.log('✅ Sidebar position updated:', position);
        }

        attachHandlers() {
            const overlay = document.getElementById('sidebarOverlay');
            const closeBtn = document.querySelector('.close-sidebar');
            
            if (overlay) {
                overlay.removeEventListener('click', this.closeHandler);
                overlay.addEventListener('click', this.closeHandler);
            }
            
            if (closeBtn) {
                closeBtn.removeEventListener('click', this.closeHandler);
                closeBtn.addEventListener('click', this.closeHandler);
            }
        }

        removeHandlers() {
            const overlay = document.getElementById('sidebarOverlay');
            const closeBtn = document.querySelector('.close-sidebar');
            
            if (overlay) overlay.removeEventListener('click', this.closeHandler);
            if (closeBtn) closeBtn.removeEventListener('click', this.closeHandler);
        }

        handleClose(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Sidebar close triggered');
            this.close();
        }

        close() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            const toggle = document.querySelector('.mobile-menu-toggle');
            
            if (sidebar) {
                sidebar.classList.remove('open');
                // Повертаємо початкову позицію
                if (this.currentPosition === 'right') {
                    sidebar.style.right = '-320px';
                } else {
                    sidebar.style.left = '-320px';
                }
            }
            
            if (overlay) overlay.classList.remove('show');
            if (toggle) toggle.classList.remove('menu-open');
            
            console.log('✅ Sidebar closed');
        }

        toggle() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            const toggle = document.querySelector('.mobile-menu-toggle');
            
            if (!sidebar || !overlay) return;
            
            const isOpen = sidebar.classList.contains('open');
            
            if (isOpen) {
                this.close();
            } else {
                sidebar.classList.add('open');
                
                // Відкриваємо меню в потрібний бік
                if (this.currentPosition === 'right') {
                    sidebar.style.right = '0';
                } else {
                    sidebar.style.left = '0';
                }
                
                overlay.classList.add('show');
                if (toggle) toggle.classList.add('menu-open');
            }
        }

        createMenuButton(position) {
            const toggle = document.querySelector('.mobile-menu-toggle');
            if (!toggle) return;
            
            toggle.innerHTML = '';
            [-4, 0, 4].forEach(pos => {
                const line = document.createElement('div');
                line.className = 'menu-line';
                line.style.transform = `translate(-50%, -50%) translateY(${pos}px)`;
                toggle.appendChild(line);
            });
            
            // Оновлюємо позицію кнопки
            if (position === 'right') {
                toggle.style.right = '15px';
                toggle.style.left = 'auto';
            } else {
                toggle.style.left = '15px';
                toggle.style.right = 'auto';
            }
        }
    }

    // ========== MAIN MENU MANAGER ==========
    class MenuPositionManager {
        apply(position) {
            console.log('🎯 MenuPositionManager.apply() called with:', position);
            
            state.currentPosition = position;
            
            // Remove all position classes
            ['left', 'right', 'up', 'down'].forEach(pos => {
                document.body.classList.remove(`menu-${pos}`);
            });
            
            // Add new position class
            document.body.classList.add(`menu-${position}`);
            
            if (position === 'up' || position === 'down') {
                // Static menu
                if (state.sidebarInstance) {
                    state.sidebarInstance.destroy();
                    state.sidebarInstance = null;
                }
                
                if (!state.staticMenuInstance) {
                    state.staticMenuInstance = new StaticMenuManager();
                }
                state.staticMenuInstance.create(position);
                
                // Close sidebar
                const sidebar = document.getElementById('sidebar');
                const overlay = document.getElementById('sidebarOverlay');
                if (sidebar) sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('show');
                
            } else {
                // Sidebar menu
                if (state.staticMenuInstance) {
                    state.staticMenuInstance.destroy();
                    state.staticMenuInstance = null;
                }
                
                if (!state.sidebarInstance) {
                    state.sidebarInstance = new SidebarMenuManager();
                }
                state.sidebarInstance.init(position);
                
                // Close sidebar on position change
                state.sidebarInstance.close();
            }
            
            console.log('✅ Menu position fully applied:', position);
        }

        updateActive(page) {
            if ((state.currentPosition === 'up' || state.currentPosition === 'down') && state.staticMenuInstance) {
                state.staticMenuInstance.updateActive(page);
            }
        }

        updateTranslations() {
            if ((state.currentPosition === 'up' || state.currentPosition === 'down') && state.staticMenuInstance) {
                state.staticMenuInstance.updateTranslations();
            }
        }
    }

    const menuPositionManager = new MenuPositionManager();

    // ========== TRANSLATIONS LOADER ==========
    async function loadTranslations() {
        if (state.translations) return state.translations;
        
        try {
            const baseTag = document.querySelector('base');
            const basePath = baseTag ? new URL(baseTag.href).pathname : '';
            const url = basePath ? `${basePath}system/moderation/menu.json` : 'system/moderation/menu.json';
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            state.translations = await response.json();
            return state.translations;
        } catch (error) {
            console.error('❌ Menu translations error:', error);
            return null;
        }
    }

    // ========== GLOBAL FUNCTIONS ==========
    function toggleMobileMenu() {
        if (state.sidebarInstance) {
            state.sidebarInstance.toggle();
        }
    }

    function closeSidebar() {
        if (state.sidebarInstance) {
            state.sidebarInstance.close();
        }
    }

    // ========== INITIALIZATION ==========
    async function init() {
        console.log('🚀 Menu Manager init() started');
        
        await loadTranslations();
        
        const savedPosition = localStorage.getItem('armHelper_menuPosition') || 'left';
        console.log('📂 Loaded saved position from localStorage:', savedPosition);
        
        menuPositionManager.apply(savedPosition);
        
        console.log('✅ Menu Manager init() completed');
    }

    // ========== EVENT LISTENERS ==========
    document.addEventListener('languageChanged', () => {
        console.log('🌍 Language changed, updating translations');
        menuPositionManager.updateTranslations();
    });

    document.addEventListener('pageChanged', (e) => {
        if (e.detail?.page) {
            menuPositionManager.updateActive(e.detail.page);
        }
    });

    document.addEventListener('contentLoaded', () => {
        const pos = localStorage.getItem('armHelper_menuPosition') || 'left';
        console.log('📦 Content loaded event, reapplying position:', pos);
        setTimeout(() => {
            menuPositionManager.apply(pos);
        }, 100);
    });

    // ========== GLOBAL EXPORTS ==========
    Object.assign(window, {
        menuPositionManager,
        toggleMobileMenu,
        closeSidebar
    });

    // ========== AUTO INIT ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.menuManagerInitialized = true;
    console.log('✅ Menu Manager fully initialized');

})();
