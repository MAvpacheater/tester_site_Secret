// ========== MENU MANAGER MODULE ==========
(function() {
    'use strict';
    
    if (window.menuManagerInitialized) return;

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
        translations: null
    };

    // ========== STATIC MENU CLASS ==========
    class StaticMenuManager {
        constructor() {
            this.clickHandler = this.handleDocumentClick.bind(this);
        }

        create(position) {
            this.remove();
            
            const menu = document.createElement('div');
            menu.className = `static-menu menu-${position === 'up' ? 'top' : 'bottom'}`;
            menu.id = 'staticMenu';
            
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
            
            document.addEventListener('click', this.clickHandler);
            
            const currentPage = typeof window.getCurrentPage === 'function' ? window.getCurrentPage() : 'calculator';
            this.updateActive(currentPage);
            
            setTimeout(() => this.updateTranslations(), 50);
            
            console.log('✅ Static menu created:', position);
        }

        remove() {
            const menu = document.getElementById('staticMenu');
            if (menu) {
                console.log('🗑️ Removing static menu');
                menu.remove();
            }
            document.querySelectorAll('.category-dropdown').forEach(d => d.remove());
            this.closeAll();
            document.removeEventListener('click', this.clickHandler);
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

    const staticMenuManager = new StaticMenuManager();

    // ========== MOBILE MENU BUTTON ==========
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

    function toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar && overlay) {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('show');
            document.querySelector('.mobile-menu-toggle')?.classList.toggle('menu-open', sidebar.classList.contains('open'));
        }
    }

    function closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar && overlay) {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
            document.querySelector('.mobile-menu-toggle')?.classList.remove('menu-open');
        }
    }

    // ========== MAIN MENU MANAGER ==========
    class MenuPositionManager {
        apply(position) {
            console.log('🎯 Applying menu position:', position);
            state.currentPosition = position;
            
            ['left', 'right', 'up', 'down'].forEach(pos => {
                document.body.classList.remove(`menu-${pos}`);
            });
            
            document.body.classList.add(`menu-${position}`);
            
            if (position === 'up' || position === 'down') {
                console.log('📋 Creating static menu for:', position);
                staticMenuManager.create(position);
            } else {
                console.log('📱 Using sidebar menu for:', position);
                staticMenuManager.remove();
                
                const toggle = document.querySelector('.mobile-menu-toggle');
                if (toggle) {
                    setTimeout(() => createMenuButton(), 10);
                }
            }
            
            console.log('✅ Menu position applied:', position);
        }

        updateActive(page) {
            if (state.currentPosition === 'up' || state.currentPosition === 'down') {
                staticMenuManager.updateActive(page);
            }
        }

        updateTranslations() {
            if (state.currentPosition === 'up' || state.currentPosition === 'down') {
                staticMenuManager.updateTranslations();
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

    // ========== INITIALIZATION ==========
    async function init() {
        await loadTranslations();
        
        const savedPosition = localStorage.getItem('armHelper_menuPosition') || 'left';
        console.log('🔄 Initializing with saved position:', savedPosition);
        menuPositionManager.apply(savedPosition);
    }

    // ========== EVENT LISTENERS ==========
    document.addEventListener('languageChanged', () => {
        menuPositionManager.updateTranslations();
    });

    document.addEventListener('pageChanged', (e) => {
        if (e.detail?.page) {
            menuPositionManager.updateActive(e.detail.page);
        }
    });

    document.addEventListener('contentLoaded', () => {
        const pos = localStorage.getItem('armHelper_menuPosition') || 'left';
        console.log('📦 Content loaded, reapplying menu position:', pos);
        menuPositionManager.apply(pos);
    });

    // ========== GLOBAL EXPORTS ==========
    Object.assign(window, {
        menuPositionManager,
        staticMenuManager,
        toggleMobileMenu,
        closeSidebar,
        createMenuButton
    });

    // ========== AUTO INIT ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.menuManagerInitialized = true;
    console.log('✅ Menu Manager initialized');

})();
