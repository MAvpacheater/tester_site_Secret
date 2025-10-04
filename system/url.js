// URL Routing System - Optimized for tester_site_Secret
class URLRouter {
    constructor() {
        this.baseURL = this.getBaseURL();
        this.routes = new Map();
        this.isInitialized = false;
        this.debugMode = true;
        this.setupRoutes();
        this.setupListeners();
        console.log(`🌐 Router initialized: ${this.baseURL}`);
    }

    getBaseURL() {
        const { protocol, host, pathname } = window.location;
        console.log('🔍 Detecting base:', { protocol, host, pathname });
        
        if (host === 'mavpacheater.github.io') {
            const base = `${protocol}//${host}/armwrestlerinfopost/`;
            console.log('✅ GitHub Pages:', base);
            return base;
        }
        
        const base = `${protocol}//${host}/`;
        console.log('✅ Standard hosting:', base);
        return base;
    }

    setupRoutes() {
        const routes = {
            calculator: '', arm: 'arm_calculator', grind: 'grind_calculator', 
            roulette: 'roulette_calculator', boss: 'boss_calculator', boosts: 'boosts_info',
            shiny: 'shiny_list', secret: 'secret_pets', codes: 'codes_list', aura: 'aura_info',
            trainer: 'trainer_info', charms: 'charms_info', potions: 'potions_food',
            worlds: 'worlds_info', settings: 'settings', help: 'help_guide', 
            peoples: 'peoples_thanks', trader: 'trader_store'
        };

        this.routes.clear();

        Object.entries(routes).forEach(([page, path]) => {
            this.routes.set(page, path);
            
            if (path === '') {
                ['/', '', '/armwrestlerinfopost/', '/armwrestlerinfopost'].forEach(v => 
                    this.routes.set(v, page)
                );
            } else {
                [
                    path, `/${path}`, `${path}/`, `/${path}/`,
                    `/armwrestlerinfopost/${path}`, `/armwrestlerinfopost/${path}/`,
                    `armwrestlerinfopost/${path}`, `armwrestlerinfopost/${path}/`
                ].forEach(v => this.routes.set(v, page));
            }
        });

        if (this.debugMode) {
            console.log('🗺️ Routes configured:', Array.from(this.routes.entries()).slice(0, 10));
        }
    }

    setupListeners() {
        window.addEventListener('popstate', (e) => {
            console.log('🔙 Navigation:', e.state);
            this.handleBrowserNavigation(this.getPageFromURL());
        });

        window.addEventListener('hashchange', () => {
            console.log('🔗 Hash change');
            this.handleBrowserNavigation(this.getPageFromURL());
        });
    }

    init() {
        if (this.isInitialized) return console.log('⚠️ Already initialized');

        console.log('🚀 Initializing router...');
        
        const restored = sessionStorage.getItem('pathToRestore');
        if (restored) {
            console.log(`🔄 Restored path: ${restored}`);
            const page = this.parsePathToPage(restored);
            if (page) {
                sessionStorage.removeItem('pathToRestore');
                setTimeout(() => {
                    if (typeof switchPage === 'function') {
                        switchPage(page);
                        console.log(`🎯 Switched to: ${page}`);
                    }
                }, 100);
                this.isInitialized = true;
                return;
            }
            sessionStorage.removeItem('pathToRestore');
        }

        const initial = this.getPageFromURL();
        console.log(`🎯 Initial page: ${initial}`);
        
        if (typeof switchPage === 'function') {
            setTimeout(() => {
                switchPage(initial);
                console.log(`✅ Loaded: ${initial}`);
            }, 200);
        }

        this.isInitialized = true;
        console.log('✅ Router ready');
    }

    parsePathToPage(path) {
        let clean = path.replace(/^\/|\/$/g, '').replace(/^armwrestlerinfopost\//, '');
        
        for (const test of [clean, `/${clean}`, `${clean}/`, `/${clean}/`]) {
            if (this.routes.has(test)) return this.routes.get(test);
        }
        return null;
    }

    getPageFromURL() {
        const { pathname } = window.location;
        
        if (this.debugMode) console.log(`🔍 Analyzing: ${pathname}`);
        
        const direct = this.routes.get(pathname);
        if (direct) {
            console.log(`✅ Direct match: ${pathname} → ${direct}`);
            return direct;
        }

        let relative = pathname.includes('/tester_site_Sarmwrestlerinfopostecret/') 
            ? pathname.split('/armwrestlerinfopost/')[1] || ''
            : pathname;
        
        relative = relative.replace(/^\/|\/$/g, '');
        
        if (this.debugMode) console.log(`🎯 Relative: "${relative}"`);
        
        const tests = [
            relative, `/${relative}`, `${relative}/`, `/${relative}/`,
            pathname, `${pathname}/`, pathname.replace(/\/$/, ''),
            `/armwrestlerinfopost/${relative}`, `/armwrestlerinfopost/${relative}/`
        ];
        
        const unique = [...new Set(tests)].filter(Boolean);
        
        for (const test of unique) {
            if (this.routes.has(test)) {
                const page = this.routes.get(test);
                console.log(`✅ Match: "${test}" → ${page}`);
                return page;
            }
        }
        
        if (!relative || pathname === '/' || pathname.includes('/armwrestlerinfopost')) {
            console.log('✅ Root → calculator');
            return 'calculator';
        }
        
        console.log(`❓ No match: "${pathname}"`);
        return 'calculator';
    }

    updateURL(page, pushState = true) {
        const segment = this.routes.get(page);
        if (segment === undefined) return console.warn(`⚠️ No route: ${page}`);

        let url = this.baseURL.replace(/\/$/, '');
        if (segment) url += `/${segment}`;
        else url += '/';
        
        const current = new URL(window.location.href);
        if (current.search) url += current.search;
        if (current.hash) url += current.hash;
        
        console.log(`🔗 URL: ${page} → ${url}`);
        
        if (url !== window.location.href) {
            try {
                const state = { page, timestamp: Date.now() };
                window.history[pushState ? 'pushState' : 'replaceState'](state, '', url);
                console.log(`📍 URL ${pushState ? 'pushed' : 'replaced'}`);
                this.updateMetaTags(page);
            } catch (e) {
                console.error('❌ URL error:', e);
            }
        }
    }

    handleBrowserNavigation(page) {
        console.log(`🔙 Navigating to: ${page}`);
        if (typeof switchPage === 'function') {
            setTimeout(() => switchPage(page), 50);
        }
    }

    updateMetaTags(page) {
        const info = this.getPageInfo(page);
        document.title = `${info.title} - Arm Helper`;
        
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'description';
            document.head.appendChild(meta);
        }
        meta.content = info.description;
    }

    getPageInfo(page) {
        const data = {
            calculator: { title: '🐾 Pet Calculator', description: 'Calculate pet upgrades' },
            arm: { title: '💪 Arm Calculator', description: 'Calculate arm strength' },
            grind: { title: '🏋️‍♂️ Grind Calculator', description: 'Calculate grinding efficiency' },
            roulette: { title: '🎰 Roulette Calculator', description: 'Calculate roulette time' },
            boss: { title: '👹 Boss Calculator', description: 'Calculate boss battle time' },
            boosts: { title: '🚀 Boosts', description: 'Complete guide to boosts' },
            shiny: { title: '✨ Shiny Stats', description: 'Shiny pets list' },
            secret: { title: '🔮 Secret Pets', description: 'Secret pets guide' },
            codes: { title: '🎁 Codes', description: 'Latest working codes' },
            aura: { title: '🌟 Aura', description: 'Aura guide' },
            trainer: { title: '🏆 Trainer', description: 'Training guide' },
            charms: { title: '🔮 Charms', description: 'Charms guide' },
            potions: { title: '🧪 Potions & Food', description: 'Potions guide' },
            worlds: { title: '🌍 Worlds', description: 'Worlds guide' },
            settings: { title: '⚙️ Settings', description: 'Customize app' },
            help: { title: '🆘 Help', description: 'Help guide' },
            peoples: { title: '🙏 Thanks', description: 'Community credits' },
            trader: { title: '🛒 Trader Store', description: 'Browse trader items' }
        };
        return data[page] || { title: 'Arm Helper', description: 'Ultimate helper tool' };
    }

    debug() {
        console.log('=== ROUTER DEBUG ===');
        console.log('URL:', window.location.href);
        console.log('Path:', window.location.pathname);
        console.log('Base:', this.baseURL);
        console.log('Page:', this.getPageFromURL());
        console.log('Routes:', this.routes.size);
        console.log('Sample:', Array.from(this.routes.entries()).slice(0, 10));
        console.log('===================');
    }

    forceRouteCheck() {
        console.log('🔄 Force route check...');
        const page = this.getPageFromURL();
        console.log(`🎯 Detected: ${page}`);
        if (typeof switchPage === 'function') switchPage(page);
        return page;
    }
}
