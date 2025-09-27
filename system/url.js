// URL Routing System - Fixed for GitHub Pages with repository name

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
        
        // For GitHub Pages with repository name
        if (host.includes('.github.io')) {
            // Extract repository name from pathname
            const pathParts = pathname.split('/').filter(part => part);
            
            if (pathParts.length > 0) {
                // If we have path parts, the first one is likely the repository name
                const repoName = pathParts[0];
                return `${protocol}//${host}/${repoName}/`;
            } else {
                // Root repository (username.github.io)
                return `${protocol}//${host}/`;
            }
        }
        
        // For other platforms (Vercel, Netlify, etc.)
        if (host.includes('.vercel.app') || host.includes('.netlify.app')) {
            return `${protocol}//${host}/`;
        }
        
        return `${protocol}//${host}/`;
    }

    setupRoutes() {
        // Updated route mapping for better recognition
        const routeMapping = {
            'calculator': '/',
            'arm': '/arm_calculator',
            'grind': '/grind_calculator',
            'boosts': '/boosts_info',
            'shiny': '/shiny_list',
            'secret': '/secret_pets',
            'codes': '/codes_list',
            'aura': '/aura_info',
            'trainer': '/trainer_info',
            'charms': '/charms_info',
            'potions': '/potions_food',
            'worlds': '/worlds_info',
            'settings': '/settings',
            'help': '/help_guide',
            'peoples': '/peoples_thanks'
        };

        // Create bidirectional mapping
        Object.entries(routeMapping).forEach(([page, path]) => {
            this.routes.set(page, path);
            this.routes.set(path, page);
            // Also map versions with trailing slash
            if (path !== '/') {
                this.routes.set(path + '/', page);
            }
        });

        console.log('🗺️ Routes configured:', routeMapping);
    }

    setupListeners() {
        window.addEventListener('popstate', (event) => {
            console.log('🔙 Browser navigation detected:', event.state);
            
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
        console.log(`🎯 Initial page from URL: ${initialPage} (URL: ${window.location.pathname})`);
        
        if (initialPage && initialPage !== 'calculator') {
            setTimeout(() => {
                if (typeof switchPage === 'function') {
                    switchPage(initialPage);
                    console.log(`✅ Switched to page from URL: ${initialPage}`);
                }
            }, 1000);
        } else {
            this.updateURL('calculator', false);
        }

        this.isInitialized = true;
        console.log('✅ URL Router initialized');
    }

    getPageFromURL() {
        let currentPath = window.location.pathname;
        
        // Remove base path from GitHub Pages URLs
        const baseURL = this.baseURL;
        const basePath = new URL(baseURL).pathname;
        
        if (basePath !== '/' && currentPath.startsWith(basePath)) {
            currentPath = currentPath.substring(basePath.length - 1);
        }
        
        // Remove trailing slash for consistency (except root)
        if (currentPath !== '/' && currentPath.endsWith('/')) {
            currentPath = currentPath.slice(0, -1);
        }
        
        console.log(`🔍 Analyzing URL path: "${currentPath}" (original: ${window.location.pathname})`);
        
        // Direct lookup in routes map
        if (this.routes.has(currentPath)) {
            const page = this.routes.get(currentPath);
            console.log(`✅ Found exact match: "${currentPath}" -> ${page}`);
            return page;
        }
        
        // Check for partial matches (for complex routing scenarios)
        for (const [path, page] of this.routes.entries()) {
            if (typeof path === 'string' && path.startsWith('/') && path !== '/') {
                if (currentPath.includes(path)) {
                    console.log(`✅ Found partial match: "${currentPath}" contains "${path}" -> ${page}`);
                    return page;
                }
            }
        }
        
        console.log(`❓ No match found for "${currentPath}", using calculator`);
        return 'calculator';
    }

    updateURL(page, pushState = true) {
        const path = this.routes.get(page);
        if (!path) {
            console.warn(`⚠️ No route found for page: ${page}`);
            return;
        }

        // Build the complete URL with base path
        let newURL;
        if (path === '/') {
            newURL = this.baseURL;
        } else {
            newURL = this.baseURL + path.substring(1); // Remove leading slash from path
        }
        
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

    // Debug function to check current state
    debug() {
        console.log('=== URL ROUTER DEBUG ===');
        console.log('Current URL:', window.location.href);
        console.log('Pathname:', window.location.pathname);
        console.log('Base URL:', this.baseURL);
        console.log('Detected page:', this.getPageFromURL());
        console.log('Routes:', Array.from(this.routes.entries()));
        console.log('========================');
    }
}

// Global instance
let urlRouter = null;

// Initialize function
function initURLRouting() {
    if (urlRouter) {
        console.log('⚠️ URL Router already initialized');
        return urlRouter;
    }

    urlRouter = new URLRouter();
    
    setTimeout(() => {
        urlRouter.init();
    }, 1000);

    // Enhance switchPage function
    const originalSwitchPage = window.switchPage;
    if (typeof originalSwitchPage === 'function') {
        window.switchPage = function(page) {
            console.log(`🔀 Enhanced switchPage called for: ${page}`);
            
            const result = originalSwitchPage.call(this, page);
            
            if (urlRouter) {
                urlRouter.updateURL(page, true);
            }
            
            return result;
        };
        
        console.log('✅ switchPage function enhanced with URL routing');
    }

    return urlRouter;
}

// Debug function
function debugURLRouter() {
    if (urlRouter) {
        urlRouter.debug();
    } else {
        console.warn('⚠️ URL Router not initialized');
    }
}

// Export functions
window.initURLRouting = initURLRouting;
window.debugURLRouter = debugURLRouter;
window.urlRouter = urlRouter;

console.log('🌐 URL Routing system loaded');
