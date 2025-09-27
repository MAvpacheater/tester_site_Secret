// URL Routing System - Simplified and fixed

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
        
        // For GitHub Pages
        if (host.includes('.github.io')) {
            const pathParts = pathname.split('/').filter(part => part.length > 0);
            if (pathParts.length > 0) {
                const repoName = pathParts[0];
                return `${protocol}//${host}/${repoName}/`;
            }
        }
        
        return `${protocol}//${host}/`;
    }

    setupRoutes() {
        const routeMapping = {
            'calculator': '/',
            'arm': '/arm_calculator/',
            'grind': '/grind_calculator/',
            'boosts': '/boosts_info/',
            'shiny': '/shiny_list/',
            'secret': '/secret_pets/',
            'codes': '/codes_list/',
            'aura': '/aura_info/',
            'trainer': '/trainer_info/',
            'charms': '/charms_info/',
            'potions': '/potions_food/',
            'worlds': '/worlds_info/',
            'settings': '/settings/',
            'help': '/help_guide/',
            'peoples': '/peoples_thanks/'
        };

        Object.entries(routeMapping).forEach(([page, path]) => {
            this.routes.set(page, path);
            this.routes.set(path, page);
        });
    }

    setupListeners() {
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.page) {
                this.handleBrowserNavigation(event.state.page);
            } else {
                const page = this.getPageFromURL();
                this.handleBrowserNavigation(page);
            }
        });
    }

    init() {
        if (this.isInitialized) return;

        const initialPage = this.getPageFromURL();
        
        if (initialPage && initialPage !== 'calculator') {
            setTimeout(() => {
                if (typeof switchPage === 'function') {
                    switchPage(initialPage);
                }
            }, 1000);
        } else {
            this.updateURL('calculator', false);
        }

        this.isInitialized = true;
        console.log('✅ URL Router initialized');
    }

    getPageFromURL() {
        const currentPath = window.location.pathname;
        const basePath = new URL(this.baseURL).pathname;
        let relativePath = currentPath.replace(basePath.slice(0, -1), '');
        
        if (!relativePath.startsWith('/')) {
            relativePath = '/' + relativePath;
        }
        
        if (relativePath.endsWith('/') && relativePath.length > 1) {
            relativePath = relativePath.slice(0, -1);
        }
        
        for (const [path, page] of this.routes.entries()) {
            if (typeof path === 'string' && path.startsWith('/')) {
                const normalizedPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
                if (normalizedPath === relativePath) {
                    return page;
                }
            }
        }
        
        return 'calculator';
    }

    updateURL(page, pushState = true) {
        const path = this.routes.get(page);
        if (!path) return;

        const newURL = this.baseURL.slice(0, -1) + path;
        const currentURL = window.location.href;

        if (newURL !== currentURL) {
            const stateData = { page: page, timestamp: Date.now() };

            if (pushState) {
                window.history.pushState(stateData, '', newURL);
            } else {
                window.history.replaceState(stateData, '', newURL);
            }

            this.updateMetaTags(page);
        }
    }

    handleBrowserNavigation(page) {
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

        return pageData[page] || { title: 'Arm Helper', description: 'Ultimate helper tool' };
    }
}

// Global instance
let urlRouter = null;

// Initialize function
function initURLRouting() {
    if (urlRouter) return urlRouter;

    urlRouter = new URLRouter();
    
    setTimeout(() => {
        urlRouter.init();
    }, 1000);

    // Enhance switchPage function
    const originalSwitchPage = window.switchPage;
    if (typeof originalSwitchPage === 'function') {
        window.switchPage = function(page) {
            const result = originalSwitchPage.call(this, page);
            if (urlRouter) {
                urlRouter.updateURL(page, true);
            }
            return result;
        };
    }

    return urlRouter;
}

// Export functions
window.initURLRouting = initURLRouting;

console.log('🌐 URL Routing system loaded');
