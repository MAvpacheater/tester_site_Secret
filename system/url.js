// Fixed URL Routing System with Enhanced Path Detection - system/url.js
class URLRouter {
    constructor() {
        this.baseURL = this.getBaseURL();
        this.routes = new Map();
        this.isInitialized = false;
        this.debugMode = true;
        
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
        // Enhanced route mapping with exact path matching
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

        // Clear existing routes
        this.routes.clear();

        // Create enhanced bidirectional mapping
        Object.entries(routeMapping).forEach(([page, path]) => {
            // Page -> Path mapping
            this.routes.set(page, path);
            
            // Path -> Page mapping with all possible variations
            if (path === '') {
                // Root path variations
                this.routes.set('/', page);
                this.routes.set('', page);
                this.routes.set('/tester_site_Secret/', page);
                this.routes.set('/tester_site_Secret', page);
            } else {
                // Standard path variations
                const variations = [
                    path,
                    '/' + path,
                    path + '/',
                    '/' + path + '/',
                    '/tester_site_Secret/' + path,
                    '/tester_site_Secret/' + path + '/',
                    'tester_site_Secret/' + path,
                    'tester_site_Secret/' + path + '/'
                ];
                
                variations.forEach(variant => {
                    this.routes.set(variant, page);
                });
            }
        });

        if (this.debugMode) {
            console.log('🗺️ Enhanced routes configured:', Array.from(this.routes.entries()).slice(0, 20));
        }
    }

    setupListeners() {
        window.addEventListener('popstate', (event) => {
            console.log('🔙 Browser navigation detected:', event.state);
            
            const page = this.getPageFromURL();
            this.handleBrowserNavigation(page);
        });

        // Enhanced listener for hash changes
        window.addEventListener('hashchange', () => {
            console.log('🔗 Hash change detected');
            const page = this.getPageFromURL();
            this.handleBrowserNavigation(page);
        });
    }

    init() {
        if (this.isInitialized) {
            console.log('⚠️ URL Router already initialized');
            return;
        }

        console.log('🚀 Initializing URL Router...');
        
        // Check for restored path from 404 redirect
        const restoredPath = sessionStorage.getItem('pathToRestore');
        if (restoredPath) {
            console.log(`🔄 Found restored path from 404: ${restoredPath}`);
            
            // Parse the restored path to get the correct page
            const pageFromRestored = this.parsePathToPage(restoredPath);
            if (pageFromRestored) {
                console.log(`✅ Parsed page from restored path: ${pageFromRestored}`);
                sessionStorage.removeItem('pathToRestore');
                
                setTimeout(() => {
                    if (typeof switchPage === 'function') {
                        switchPage(pageFromRestored);
                        console.log(`🎯 Switched to restored page: ${pageFromRestored}`);
                    }
                }, 100);
                
                this.isInitialized = true;
                return;
            }
            
            sessionStorage.removeItem('pathToRestore');
        }

        // Get initial page from current URL
        const initialPage = this.getPageFromURL();
        console.log(`🎯 Initial page from URL: ${initialPage}`);
        console.log(`🔍 Current pathname: ${window.location.pathname}`);
        
        // Force page switch if we detected a specific page
        if (initialPage && initialPage !== 'calculator' && typeof switchPage === 'function') {
            console.log(`🔄 Forcing switch to detected page: ${initialPage}`);
            setTimeout(() => {
                switchPage(initialPage);
                console.log(`✅ Successfully switched to: ${initialPage}`);
            }, 200);
        } else if (initialPage === 'calculator') {
            // Even for calculator, ensure it's properly loaded
            setTimeout(() => {
                if (typeof switchPage === 'function') {
                    switchPage('calculator');
                    console.log(`✅ Loaded default calculator page`);
                }
            }, 200);
        }

        this.isInitialized = true;
        console.log('✅ URL Router initialization completed');
    }

    parsePathToPage(path) {
        // Clean the path
        let cleanPath = path;
        if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
        if (cleanPath.endsWith('/')) cleanPath = cleanPath.slice(0, -1);
        
        // Remove tester_site_Secret prefix if present
        if (cleanPath.startsWith('tester_site_Secret/')) {
            cleanPath = cleanPath.substring('tester_site_Secret/'.length);
        }
        
        // Check for direct matches
        const possiblePaths = [
            cleanPath,
            '/' + cleanPath,
            cleanPath + '/',
            '/' + cleanPath + '/'
        ];
        
        for (const testPath of possiblePaths) {
            if (this.routes.has(testPath)) {
                return this.routes.get(testPath);
            }
        }
        
        return null;
    }

    getPageFromURL() {
        const fullPath = window.location.pathname;
        const search = window.location.search;
        const hash = window.location.hash;
        
        if (this.debugMode) {
            console.log(`🔍 Analyzing URL components:`, { fullPath, search, hash });
        }
        
        // Try direct route lookup first
        const directMatch = this.routes.get(fullPath);
        if (directMatch) {
            console.log(`✅ Direct match found: ${fullPath} -> ${directMatch}`);
            return directMatch;
        }

        // Extract relative path from full pathname
        let relativePath = fullPath;
        
        // Remove repository base path if present
        if (fullPath.includes('/tester_site_Secret/')) {
            const parts = fullPath.split('/tester_site_Secret/');
            if (parts.length > 1) {
                relativePath = parts[1];
                if (relativePath.startsWith('/')) {
                    relativePath = relativePath.substring(1);
                }
            }
        }
        
        // Clean up the relative path
        if (relativePath.endsWith('/')) {
            relativePath = relativePath.slice(0, -1);
        }
        
        if (this.debugMode) {
            console.log(`🎯 Processed relative path: "${relativePath}"`);
        }
        
        // Test various path combinations
        const testPaths = [
            relativePath,
            '/' + relativePath,
            relativePath + '/',
            '/' + relativePath + '/',
            fullPath,
            fullPath + '/',
            fullPath.replace(/\/$/, ''),
            '/tester_site_Secret/' + relativePath,
            '/tester_site_Secret/' + relativePath + '/',
            'tester_site_Secret/' + relativePath,
            'tester_site_Secret/' + relativePath + '/'
        ];
        
        // Remove duplicates and empty strings
        const uniquePaths = [...new Set(testPaths)].filter(path => path !== '');
        
        if (this.debugMode) {
            console.log('🔍 Testing paths:', uniquePaths.slice(0, 8));
        }
        
        // Check each possible path
        for (const testPath of uniquePaths) {
            if (this.routes.has(testPath)) {
                const page = this.routes.get(testPath);
                console.log(`✅ Match found: "${testPath}" -> ${page}`);
                return page;
            }
        }
        
        // Handle root paths
        if (relativePath === '' || fullPath === '/' || 
            fullPath === '/tester_site_Secret/' || fullPath === '/tester_site_Secret') {
            console.log('✅ Root path detected -> calculator');
            return 'calculator';
        }
        
        // Log debugging info if no match found
        console.log(`❓ No route match found for: "${fullPath}"`);
        console.log(`📝 Relative path was: "${relativePath}"`);
        console.log('Available routes sample:', Array.from(this.routes.entries()).slice(0, 10));
        
        return 'calculator'; // Default fallback
    }

    updateURL(page, pushState = true) {
        const pathSegment = this.routes.get(page);
        if (pathSegment === undefined) {
            console.warn(`⚠️ No route found for page: ${page}`);
            return;
        }

        // Build the complete URL based on current base
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
        
        // Preserve search params and hash if they exist
        const currentURL = new URL(window.location.href);
        if (currentURL.search) newURL += currentURL.search;
        if (currentURL.hash) newURL += currentURL.hash;
        
        console.log(`🔗 Building URL: page="${page}", segment="${pathSegment}", result="${newURL}"`);
        
        const currentFullURL = window.location.href;

        if (newURL !== currentFullURL) {
            const stateData = { page: page, timestamp: Date.now() };

            try {
                if (pushState) {
                    window.history.pushState(stateData, '', newURL);
                    console.log(`📍 URL updated (push): ${newURL}`);
                } else {
                    window.history.replaceState(stateData, '', newURL);
                    console.log(`🔄 URL updated (replace): ${newURL}`);
                }

                this.updateMetaTags(page);
            } catch (error) {
                console.error('❌ Error updating URL:', error);
            }
        }
    }

    handleBrowserNavigation(page) {
        console.log(`🔙 Handling browser navigation to: ${page}`);
        
        if (typeof switchPage === 'function') {
            // Small delay to ensure page switching works properly
            setTimeout(() => {
                switchPage(page);
            }, 50);
        } else {
            console.error('❌ switchPage function not available');
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

        return pageData[page] || { title: 'Arm Helper', description: 'Ultimate helper tool for arm wrestling' };
    }

    // Enhanced debug function
    debug() {
        console.log('=== URL ROUTER DEBUG ===');
        console.log('Current URL:', window.location.href);
        console.log('Pathname:', window.location.pathname);
        console.log('Base URL:', this.baseURL);
        console.log('Detected page:', this.getPageFromURL());
        console.log('Is initialized:', this.isInitialized);
        console.log('Total routes:', this.routes.size);
        console.log('Sample routes:');
        Array.from(this.routes.entries()).slice(0, 15).forEach(([path, page]) => {
            console.log(`  "${path}" -> ${page}`);
        });
        console.log('========================');
    }

    // Force page detection and switching
    forceRouteCheck() {
        console.log('🔄 Force checking current route...');
        const currentPage = this.getPageFromURL();
        console.log(`🎯 Force detected page: ${currentPage}`);
        
        if (typeof switchPage === 'function') {
            switchPage(currentPage);
            console.log(`✅ Force switched to: ${currentPage}`);
        }
        
        return currentPage;
    }
}
