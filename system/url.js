// ========== URL ROUTER CLASS (NO AUTH) ==========
class URLRouter {
    constructor() {
        this.baseURL = this.getBaseURL();
        this.routes = new Map();
        this.pageToPath = new Map();
        this.isInitialized = false;
        this.debugMode = false;
        this.setupRoutes();
        this.setupListeners();
    }

    getBaseURL() {
        const { protocol, host } = window.location;
        
        if (host === 'mavpacheater.github.io') {
            return `${protocol}//${host}/tester_site_Secret/`;
        }
        return `${protocol}//${host}/`;
    }

    setupRoutes() {
        const awsRoutes = {
            calculator: 'pets_calc',
            arm: 'arm_calculator',
            grind: 'grind_calculator',
            roulette: 'roulette_calculator',
            boss: 'boss_calculator',
            boosts: 'boosts_info',
            shiny: 'shiny_list',
            secret: 'secret_pets',
            codes: 'codes_list',
            aura: 'aura_info',
            trainer: 'trainer_info',
            charms: 'charms_info',
            potions: 'potions_food',
            worlds: 'worlds_info',
            help: 'help_guide',
            peoples: 'peoples_thanks',
            trader: 'trader_store',
            clans: 'clans'
        };

        const rcuRoutes = {
            petscalc: 'pets_calculator'
        };

        const systemRoutes = {
            settings: 'settings'
        };

        this.routes.clear();
        this.pageToPath.clear();

        // Реєстрація AWS маршрутів
        Object.entries(awsRoutes).forEach(([page, path]) => {
            const full = `AWS/${path}`;
            this.pageToPath.set(page, full);
            
            const pathVariants = [
                full, `/${full}`, `${full}/`, `/${full}/`,
                `/tester_site_Secret/${full}`, `/tester_site_Secret/${full}/`,
                `tester_site_Secret/${full}`, `tester_site_Secret/${full}/`,
                `${full}/menu`, `/${full}/menu`, `${full}/menu/`, `/${full}/menu/`,
                `/tester_site_Secret/${full}/menu`, `/tester_site_Secret/${full}/menu/`,
                `tester_site_Secret/${full}/menu`, `tester_site_Secret/${full}/menu/`,
                path, `/${path}`, `${path}/`, `/${path}/`,
                `/tester_site_Secret/${path}`, `/tester_site_Secret/${path}/`,
                `tester_site_Secret/${path}`, `tester_site_Secret/${path}/`,
                `${path}/menu`, `/${path}/menu`, `${path}/menu/`, `/${path}/menu/`,
                `/tester_site_Secret/${path}/menu`, `/tester_site_Secret/${path}/menu/`,
                `tester_site_Secret/${path}/menu`, `tester_site_Secret/${path}/menu/`
            ];
            
            pathVariants.forEach(v => this.routes.set(v, page));
        });

        // Реєстрація RCU маршрутів
        Object.entries(rcuRoutes).forEach(([page, path]) => {
            const full = `RCU/${path}`;
            this.pageToPath.set(page, full);
            
            const pathVariants = [
                full, `/${full}`, `${full}/`, `/${full}/`,
                `/tester_site_Secret/${full}`, `/tester_site_Secret/${full}/`,
                `tester_site_Secret/${full}`, `tester_site_Secret/${full}/`,
                `${full}/menu`, `/${full}/menu`, `${full}/menu/`, `/${full}/menu/`,
                `/tester_site_Secret/${full}/menu`, `/tester_site_Secret/${full}/menu/`,
                `tester_site_Secret/${full}/menu`, `tester_site_Secret/${full}/menu/`,
                path, `/${path}`, `${path}/`, `/${path}/`,
                `/tester_site_Secret/${path}`, `/tester_site_Secret/${path}/`,
                `tester_site_Secret/${path}`, `tester_site_Secret/${path}/`,
                `${path}/menu`, `/${path}/menu`, `${path}/menu/`, `/${path}/menu/`,
                `/tester_site_Secret/${path}/menu`, `/tester_site_Secret/${path}/menu/`,
                `tester_site_Secret/${path}/menu`, `tester_site_Secret/${path}/menu/`
            ];
            
            pathVariants.forEach(v => this.routes.set(v, page));
        });

        // Реєстрація системних маршрутів
        Object.entries(systemRoutes).forEach(([page, path]) => {
            this.pageToPath.set(page, path);
            
            [
                path, `/${path}`, `${path}/`, `/${path}/`,
                `/tester_site_Secret/${path}`, `/tester_site_Secret/${path}/`,
                `tester_site_Secret/${path}`, `tester_site_Secret/${path}/`
            ].forEach(v => this.routes.set(v, page));
        });

        // Головна сторінка - за замовчуванням calculator
        ['/', '', '/tester_site_Secret/', '/tester_site_Secret'].forEach(v => this.routes.set(v, 'calculator'));
        this.pageToPath.set('calculator', 'AWS/pets_calc');
    }

    setupListeners() {
        window.addEventListener('popstate', (e) => {
            this.handleBrowserNavigation(this.getPageFromURL());
        });
    }

    init() {
        if (this.isInitialized) return;

        const restored = sessionStorage.getItem('pathToRestore');
        if (restored) {
            const page = this.parsePathToPage(restored);
            if (page) {
                sessionStorage.removeItem('pathToRestore');
                setTimeout(() => {
                    if (typeof switchPage === 'function') {
                        switchPage(page);
                    }
                    this.openCategoryForCurrentPage(page);
                }, 100);
                this.isInitialized = true;
                return;
            }
            sessionStorage.removeItem('pathToRestore');
        }

        const pathname = window.location.pathname;
        const isDirectLink = this.isDirectPageLink(pathname);
        const targetPage = this.getPageFromURL();
        
        console.log('🔗 URL Router Init:', {
            pathname,
            isDirectLink,
            targetPage
        });

        if (isDirectLink) {
            console.log('📍 Direct link → opening page:', targetPage);
            
            if (typeof switchPage === 'function') {
                setTimeout(() => {
                    switchPage(targetPage);
                    this.openCategoryForCurrentPage(targetPage);
                }, 200);
            }
        } else {
            console.log('🏠 Root page → opening calculator');
            
            if (typeof switchPage === 'function') {
                setTimeout(() => {
                    switchPage('calculator');
                    this.openCategoryForCurrentPage('calculator');
                }, 200);
            }
        }

        this.isInitialized = true;

        if (!isDirectLink) {
            setTimeout(() => this.applyStateFromURL(), 300);
        }
    }

    openCategoryForCurrentPage(page) {
        console.log('📂 Auto-opening category for page:', page);
        
        setTimeout(() => {
            if (typeof window.openCategoryForPage === 'function') {
                window.openCategoryForPage(page);
            } else {
                console.warn('⚠️ openCategoryForPage function not available');
            }
        }, 150);
    }

    parsePathToPage(path) {
        let clean = path.replace(/^\/|\/$/g, '').replace(/^tester_site_Secret\//, '');
        
        for (const test of [clean, `/${clean}`, `${clean}/`, `/${clean}/`]) {
            if (this.routes.has(test)) return this.routes.get(test);
        }
        return null;
    }

    getPageFromURL() {
        const { pathname } = window.location;
        
        const direct = this.routes.get(pathname);
        if (direct) return direct;

        let relative = pathname.includes('/tester_site_Secret/') 
            ? pathname.split('/tester_site_Secret/')[1] || ''
            : pathname;
        
        relative = relative.replace(/^\/|\/$/g, '');
        
        const tests = [
            relative, `/${relative}`, `${relative}/`, `/${relative}/`,
            pathname, `${pathname}/`, pathname.replace(/\/$/, ''),
            `/tester_site_Secret/${relative}`, `/tester_site_Secret/${relative}/`
        ];
        
        const unique = [...new Set(tests)].filter(Boolean);
        
        for (const test of unique) {
            if (this.routes.has(test)) {
                return this.routes.get(test);
            }
        }
        
        if (!relative || pathname === '/' || pathname === '/tester_site_Secret' || pathname === '/tester_site_Secret/') {
            return 'calculator';
        }
        
        return 'calculator';
    }

    updateURL(page, pushState = true) {
        const segment = this.pageToPath.get(page);
        if (segment === undefined) return;

        let url = this.baseURL.replace(/\/$/, '');
        
        const sidebar = document.getElementById('sidebar');
        const isMenuOpen = sidebar && sidebar.classList.contains('open');
        const suffix = isMenuOpen ? '/menu' : '';
        
        if (segment) {
            url += `/${segment}${suffix}`;
        } else {
            url += '/';
        }
        
        const current = new URL(window.location.href);
        if (current.search) url += current.search;
        if (current.hash) url += current.hash;
        
        if (url !== window.location.href) {
            try {
                const state = { page, timestamp: Date.now() };
                window.history[pushState ? 'pushState' : 'replaceState'](state, '', url);
            } catch (e) {
                console.error('URL update error:', e);
            }
        }
    }

    getQueryParam(key) {
        const params = new URLSearchParams(window.location.search);
        return params.get(key);
    }

    setQueryParams(partial, pushState = true) {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        Object.entries(partial).forEach(([k, v]) => {
            if (v === undefined || v === null || v === '' || v === false) params.delete(k);
            else params.set(k, v);
        });
        url.search = params.toString();
        try {
            const state = { ...history.state, timestamp: Date.now() };
            window.history[pushState ? 'pushState' : 'replaceState'](state, '', url.toString());
        } catch (e) {
            console.error('URL query update error:', e);
        }
    }

    applyStateFromURL() {
        const pathname = window.location.pathname;
        
        console.log('🔗 Apply state from URL:', {
            pathname,
            hasMenu: pathname.includes('/menu')
        });

        // Меню через /menu в шляху
        const hasMenuInPath = pathname.includes('/menu');
        if (hasMenuInPath && typeof window.toggleMobileMenu === 'function') {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && !sidebar.classList.contains('open')) {
                setTimeout(() => window.toggleMobileMenu(), 100);
            }
        }

        // Меню через query параметр (застарілий спосіб)
        const menu = this.getQueryParam('menu');
        if (menu === 'open' && typeof window.toggleMobileMenu === 'function') {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && !sidebar.classList.contains('open')) window.toggleMobileMenu();
        }
    }

    isDirectPageLink(pathname) {
        const normalized = pathname.replace(/^\/|\/$/g, '');
        
        // Головна сторінка БЕЗ додаткових параметрів
        if (!normalized || 
            normalized === 'tester_site_Secret' || 
            pathname === '/' || 
            pathname === '/tester_site_Secret' || 
            pathname === '/tester_site_Secret/') {
            console.log('🏠 Root path detected (no direct link)');
            return false;
        }

        // Отримуємо сторінку з URL
        const page = this.getPageFromURL();
        
        // Якщо визначили конкретну сторінку
        if (page && page !== 'calculator') {
            console.log('📍 Direct page link detected:', page);
            return true;
        }

        console.log('🏠 No direct link');
        return false;
    }

    handleBrowserNavigation(page) {
        if (typeof switchPage === 'function') {
            setTimeout(() => {
                switchPage(page);
                this.openCategoryForCurrentPage(page);
            }, 50);
        }
    }

    debug() {
        console.log('=== ROUTER DEBUG ===');
        console.log('URL:', window.location.href);
        console.log('Path:', window.location.pathname);
        console.log('Base:', this.baseURL);
        console.log('Page:', this.getPageFromURL());
        console.log('Is Direct Link:', this.isDirectPageLink(window.location.pathname));
        console.log('PageToPath map:', this.pageToPath);
        console.log('===================');
    }

    forceRouteCheck() {
        const page = this.getPageFromURL();
        if (typeof switchPage === 'function') {
            switchPage(page);
            this.openCategoryForCurrentPage(page);
        }
        return page;
    }
}

// ========== GLOBAL VARIABLES ==========
let urlRouter = null;

// ========== INITIALIZATION FUNCTION ==========
function initURLRouting() {
    if (urlRouter) {
        console.log('ℹ️ URL Router already initialized');
        return urlRouter;
    }
    
    console.log('🌐 Initializing URL Router...');
    urlRouter = new URLRouter();
    
    setTimeout(() => urlRouter.init(), 100);

    const originalSwitchPage = window.switchPage;
    if (typeof originalSwitchPage === 'function') {
        window.switchPage = function(page) {
            const result = originalSwitchPage.call(this, page);
            if (urlRouter) urlRouter.updateURL(page, true);
            return result;
        };
    }
    
    console.log('✅ URL Router initialized');
    return urlRouter;
}

// ========== GLOBAL EXPORTS ==========
Object.assign(window, {
    URLRouter,
    urlRouter: () => urlRouter,
    initURLRouting
});

console.log('✅ URL.js loaded (NO AUTH)');
