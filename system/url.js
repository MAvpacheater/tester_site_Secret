// Fixed URL Routing System with Roulette Support - Proper GitHub Pages handling
class URLRouter {
    constructor() {
        this.baseURL = this.getBaseURL();
        this.routes = new Map();
        this.isInitialized = false;
        
        this.setupRoutes();
        this.setupListeners();
        
        console.log(`🌐 URL Router initialized with base: ${this.baseURL}`);
    }

    getBaseURL() {
        const protocol = window.location.protocol;
        const host = window.location.host;
        const pathname = window.location.pathname;
        
        console.log('🔍 Detecting base URL from:', { protocol, host, pathname });
        
        // For GitHub Pages - always include repository path
        if (host.includes('.github.io') && host === 'mavpacheater.github.io') {
            const baseUrl = `${protocol}//${host}/tester_site_Secret/`;
            console.log('✅ Detected GitHub Pages with repo:', baseUrl);
            return baseUrl;
        }
        
        // For other GitHub Pages or local development
        if (host.includes('.github.io')) {
            const baseUrl = `${protocol}//${host}/`;
            console.log('✅ Detected other GitHub Pages:', baseUrl);
            return baseUrl;
        }
        
        // For other platforms
        const baseUrl = `${protocol}//${host}/`;
        console.log('✅ Detected standard hosting:', baseUrl);
        return baseUrl;
    }

    setupRoutes() {
        // Route mapping - includes roulette
        const routeMapping = {
            'calculator': '',  // Root page
            'arm': 'arm_calculator',
            'grind': 'grind_calculator',
            'roulette': 'roulette_calculator',
            'boosts': 'boosts_info',
            'shiny': 'shiny_list',
            'secret': 'secret_pets',
            'codes': 'codes_list',
            'aura': 'aura_info',
            'trainer': 'trainer_info',
            'charms': 'charms_info',
            'potions': 'potions_food',
            'worlds': 'worlds_info',
            'settings': 'settings',
            'help': 'help_guide',
            'peoples': 'peoples_thanks'
        };

        // Create bidirectional mapping
        Object.entries(routeMapping).forEach(([page, path]) => {
            // Page -> Path
            this.routes.set(page, path);
            
            // Path -> Page (with and without leading slash)
            if (path === '') {
                this.routes.set('/', page);
                this.routes.set('', page);
            } else {
                this.routes.set(path, page);
                this.routes.set('/' + path, page);
                this.routes.set(path + '/', page);
                this.routes.set('/' + path + '/', page);
            }
        });

        console.log('🗺️ Routes configured with roulette:', Array.from(this.routes.entries()));
    }

    setupListeners() {
        window.addEventListener('popstate', (event) => {
            console.log('🔙 Browser navigation detected:', event.state);
            
            const page = this.getPageFromURL();
            this.handleBrowserNavigation(page);
        });
    }

    init() {
        if (this.isInitialized) return;

        // Check for restored path from 404 redirect
        const restoredPath = sessionStorage.getItem('pathToRestore');
        if (restoredPath) {
            console.log(`🔄 Found restored path from 404: ${restoredPath}`);
            sessionStorage.removeItem('pathToRestore');
        }

        const initialPage = this.getPageFromURL();
        console.log(`🎯 Initial page from URL: ${initialPage} (URL: ${window.location.pathname})`);
        
        // Immediately switch to the detected page
        if (initialPage && typeof switchPage === 'function') {
            setTimeout(() => {
                switchPage(initialPage);
                console.log(`✅ Switched to page from URL: ${initialPage}`);
            }, 500); // Reduced delay
        }

        this.isInitialized = true;
        console.log('✅ URL Router initialized with roulette support');
    }

    getPageFromURL() {
        const fullPath = window.location.pathname;
        console.log(`🔍 Full pathname: "${fullPath}"`);
        
        // Extract path relative to base URL
        const baseURL = new URL(this.baseURL);
        const basePath = baseURL.pathname;
        
        let relativePath = fullPath;
        
        // Remove base path if it exists
        if (basePath !== '/' && fullPath.startsWith(basePath)) {
            relativePath = fullPath.substring(basePath.length);
        }
        
        // Clean up the path
        if (relativePath.startsWith('/')) {
            relativePath = relativePath.substring(1);
        }
        if (relativePath.endsWith('/')) {
            relativePath = relativePath.slice(0, -1);
        }
        
        console.log(`🎯 Relative path: "${relativePath}"`);
        console.log(`🔍 Base path: "${basePath}"`);
        
        // Check direct matches
        const matches = [
            relativePath,
            '/' + relativePath,
            relativePath + '/',
            '/' + relativePath + '/',
            fullPath,
            fullPath + '/',
            fullPath.replace(/\/$/, '')
        ];
        
        for (const match of matches) {
            if (this.routes.has(match)) {
                const page = this.routes.get(match);
                console.log(`✅ Found match: "${match}" -> ${page}`);
                return page;
            }
        }
        
        // Special case for empty path (root)
        if (relativePath === '' || relativePath === '/') {
            console.log('✅ Root path detected -> calculator');
            return 'calculator';
        }
        
        console.log(`❓ No match found for "${relativePath}"`);
        console.log('Available routes:', Array.from(this.routes.entries()));
        return 'calculator';
    }

    updateURL(page, pushState = true) {
        const pathSegment = this.routes.get(page);
        if (pathSegment === undefined) {
            console.warn(`⚠️ No route found for page: ${page}`);
            return;
        }

        // Build the complete URL
        let newURL = this.baseURL;
        if (pathSegment !== '') {
            // Remove trailing slash from base and add path
            if (newURL.endsWith('/')) {
                newURL = newURL.slice(0, -1);
            }
            newURL += '/' + pathSegment;
        } else {
            // For root page, ensure proper trailing slash
            if (!newURL.endsWith('/')) {
                newURL += '/';
            }
        }
        
        console.log(`🔗 Building URL: page="${page}", segment="${pathSegment}", result="${newURL}"`);
        
        const currentURL = window.location.href;

        if (newURL !== currentURL) {
            const stateData = { page: page, timestamp: Date.now() };

            if (pushState) {
                window.history.pushState(stateData, '', newURL);
                console.log(`📍 URL updated (push): ${newURL}`);
            } else {
                window.history.replaceState(stateData, '', newURL);
                console.log(`🔄 URL updated (replace): ${newURL}`);
            }

            this.updateMetaTags(page);
        }
    }

    handleBrowserNavigation(page) {
        console.log(`🔙 Handling browser navigation to: ${page}`);
        
        if (typeof switchPage === 'function') {
            switchPage(page);
        }
    }

    updateMetaTags(page) {
        const pageInfo = this.getPageInfo(page);
        document.title = `${pageInfo.title} - Arm Helper`;
        
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = pageInfo.description;
    }

    getPageInfo(page) {
        const pageData = {
            'calculator': { title: '🐾 Pet Calculator', description: 'Calculate pet upgrades and evolution costs' },
            'arm': { title: '💪 Arm Calculator', description: 'Calculate arm strength upgrades and costs' },
            'grind': { title: '🏋️‍♂️ Grind Calculator', description: 'Calculate grinding efficiency and rewards' },
            'roulette': { title: '🎰 Roulette Calculator', description: 'Calculate time needed for roulette spins and rewards' },
            'boosts': { title: '🚀 Boosts Information', description: 'Complete guide to all boosts and their effects' },
            'shiny': { title: '✨ Shiny Pet Statistics', description: 'Complete list of shiny pets and their stats' },
            'secret': { title: '🔮 Secret Pets Guide', description: 'Discover all secret pets and how to get them' },
            'codes': { title: '🎁 Active Codes', description: 'Latest working codes for rewards' },
            'aura': { title: '🌟 Aura Information', description: 'Complete guide to auras and their effects' },
            'trainer': { title: '🏆 Trainer Guide', description: 'Pet training tips and strategies' },
            'charms': { title: '🔮 Charms Guide', description: 'All charms and their magical effects' },
            'potions': { title: '🧪 Potions & Food Guide', description: 'Complete guide to potions and food effects' },
            'worlds': { title: '🌍 Worlds Guide', description: 'Explore all worlds and their unique features' },
            'settings': { title: '⚙️ Settings', description: 'Customize your Arm Helper experience' },
            'help': { title: '🆘 Help Guide', description: 'Get help and learn how to use Arm Helper' },
            'peoples': { title: '🙏 Thanks & Credits', description: 'Special thanks to our community' }
        };

        return pageData[page] || { title: 'Arm Helper', description: 'Ultimate helper tool with roulette calculator' };
    }

    debug() {
        console.log('=== URL ROUTER DEBUG ===');
        console.log('Current URL:', window.location.href);
        console.log('Pathname:', window.location.pathname);
        console.log('Base URL:', this.baseURL);
        console.log('Detected page:', this.getPageFromURL());
        console.log('Routes (includes roulette):', Array.from(this.routes.entries()));
        console.log('========================');
    }
}
