// System Loader - Module loading and initialization
console.log('📦 System Loader starting...');

// Script loader utility
function createScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        script.onload = () => {
            console.log(`✅ Script loaded: ${src}`);
            resolve(src);
        };
        script.onerror = () => {
            console.warn(`⚠️ Failed to load script: ${src}`);
            resolve(src); // Resolve anyway to not block
        };
        document.head.appendChild(script);
    });
}

// Load all application scripts
async function loadScriptsDeferred() {
    const scripts = [
        // Calculator modules
        'calc/calculator/calculator.js',
        'calc/arm/arm.js', 
        'calc/grind/grind.js',
        'calc/roulette/roulette.js',
        'calc/boss/boss.js',

        // Info modules
        'info/boosts/boosts.js',
        'info/shiny/shiny.js',
        'info/secret/secret.js',
        'info/codes/codes.js',
        'info/aura/aura.js',
        'info/trainer/trainer.js',
        'info/charms/charms.js',
        'info/potions/potions.js',
        'info/worlds/worlds.js',
        
        // Moderation modules
        'moderation/settings/settings.js',
        
        // Other modules
        'other/peoples/peoples.js',
        'other/help/help.js'
    ];
    
    console.log('🔄 Loading application modules...');
    updateLoadingText('Loading modules...');
    
    try {
        // Load all scripts in parallel
        await Promise.all(scripts.map(createScript));
        console.log('✅ All modules loaded');
        
        // Load unified content loader
        await createScript('index/content_loader.js');
        console.log('✅ Content loader ready');
        
        updateLoadingText('Ready!');
        
        // Initialize systems
        setTimeout(() => {
            console.log('🚀 Initializing systems...');
            initializeSystems();
        }, 500);
        
    } catch (error) {
        console.error('❌ Error loading scripts:', error);
        updateLoadingText('Loading completed with warnings');
        setTimeout(() => initializeSystems(), 1000);
    }
}

// Initialize core systems
function initializeSystems() {
    try {
        // Initialize URL routing FIRST
        if (typeof initURLRouting === 'function') {
            const router = initURLRouting();
            console.log('✅ URL routing initialized');
            
            // Force early route detection
            if (router && typeof router.forceRouteCheck === 'function') {
                setTimeout(() => {
                    const detectedPage = router.forceRouteCheck();
                    console.log(`🎯 Early route detection: ${detectedPage}`);
                }, 100);
            }
        } else {
            console.error('❌ initURLRouting function not found');
        }
        
        // Initialize GitHub auto-reload
        if (typeof initGitHubAutoReload === 'function') {
            const githubConfig = {
                githubUser: 'MAvpacheater',
                githubRepo: 'tester_site_Secret',
                branch: 'main',
                checkInterval: 30000
            };
            initGitHubAutoReload(githubConfig);
            console.log('✅ GitHub auto-reload initialized');
        }
        
        // Enhanced URL routing
        setTimeout(() => {
            handleEnhancedRouting();
        }, 300);
        
    } catch (error) {
        console.error('❌ Error initializing systems:', error);
        setTimeout(() => {
            handleEnhancedRouting();
        }, 1000);
    }
}

// Enhanced routing handler
function handleEnhancedRouting() {
    console.log('🔄 Starting enhanced routing...');
    
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const currentHash = window.location.hash;
    
    console.log('🔍 Current URL components:', { 
        path: currentPath, 
        search: currentSearch, 
        hash: currentHash 
    });
    
    // Check for restored path from sessionStorage
    const restoredPath = sessionStorage.getItem('pathToRestore');
    if (restoredPath) {
        console.log(`🔄 Processing restored path: ${restoredPath}`);
        const targetPage = parsePathToPage(restoredPath);
        if (targetPage) {
            console.log(`✅ Parsed target page: ${targetPage}`);
            setTimeout(() => {
                if (typeof switchPage === 'function') {
                    switchPage(targetPage);
                    console.log(`🎯 Switched to restored page: ${targetPage}`);
                }
            }, 200);
            sessionStorage.removeItem('pathToRestore');
            return;
        }
    }
    
    // Path-to-page mapping
    const pathMappings = {
        '/tester_site_Secret/boosts_info': 'boosts',
        '/boosts_info': 'boosts',
        'boosts_info': 'boosts',
        
        '/tester_site_Secret/secret_pets': 'secret',
        '/secret_pets': 'secret',
        'secret_pets': 'secret',
        
        '/tester_site_Secret/potions_food': 'potions',
        '/potions_food': 'potions',
        'potions_food': 'potions',
        
        '/tester_site_Secret/worlds_info': 'worlds',
        '/worlds_info': 'worlds',
        'worlds_info': 'worlds',
        
        '/tester_site_Secret/help_guide': 'help',
        '/help_guide': 'help',
        'help_guide': 'help',
        
        '/tester_site_Secret/peoples_thanks': 'peoples',
        '/peoples_thanks': 'peoples',
        'peoples_thanks': 'peoples',
        
        '/tester_site_Secret/arm_calculator': 'arm',
        '/arm_calculator': 'arm',
        'arm_calculator': 'arm',
        
        '/tester_site_Secret/grind_calculator': 'grind',
        '/grind_calculator': 'grind',
        'grind_calculator': 'grind',
        
        '/tester_site_Secret/roulette_calculator': 'roulette',
        '/roulette_calculator': 'roulette',
        'roulette_calculator': 'roulette',
        
        '/tester_site_Secret/boss_calculator': 'boss',
        '/boss_calculator': 'boss',
        'boss_calculator': 'boss',
        
        '/tester_site_Secret/shiny_list': 'shiny',
        '/shiny_list': 'shiny',
        'shiny_list': 'shiny',
        
        '/tester_site_Secret/codes_list': 'codes',
        '/codes_list': 'codes',
        'codes_list': 'codes',
        
        '/tester_site_Secret/aura_info': 'aura',
        '/aura_info': 'aura',
        'aura_info': 'aura',
        
        '/tester_site_Secret/trainer_info': 'trainer',
        '/trainer_info': 'trainer',
        'trainer_info': 'trainer',
        
        '/tester_site_Secret/charms_info': 'charms',
        '/charms_info': 'charms',
        'charms_info': 'charms',
        
        '/tester_site_Secret/settings': 'settings',
        '/settings': 'settings',
        'settings': 'settings'
    };
    
    let targetPage = 'calculator'; // Default
    
    // Check for exact matches
    if (pathMappings[currentPath]) {
        targetPage = pathMappings[currentPath];
        console.log(`✅ Exact path match: ${currentPath} -> ${targetPage}`);
    } else {
        // Try partial matches
        for (const [path, page] of Object.entries(pathMappings)) {
            if (currentPath.includes(path.replace('/tester_site_Secret', '')) && 
                path.replace('/tester_site_Secret', '') !== '') {
                targetPage = page;
                console.log(`✅ Partial match: ${currentPath} contains ${path} -> ${targetPage}`);
                break;
            }
        }
    }
    
    console.log(`🎯 Final target page: ${targetPage}`);
    
    // Switch to determined page
    if (typeof switchPage === 'function') {
        setTimeout(() => {
            switchPage(targetPage);
            console.log(`✅ Switched to page: ${targetPage}`);
        }, 300);
    } else {
        console.error('❌ switchPage function not available');
        setTimeout(() => {
            if (typeof switchPage === 'function') {
                switchPage(targetPage);
                console.log(`✅ Delayed switch to page: ${targetPage}`);
            }
        }, 1000);
    }
}

// Parse URL path to page name
function parsePathToPage(path) {
    console.log(`🔍 Parsing path: ${path}`);
    
    // Clean path
    let cleanPath = path.split('?')[0].split('#')[0];
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
    if (cleanPath.endsWith('/')) cleanPath = cleanPath.slice(0, -1);
    
    // Remove base path prefix
    if (cleanPath.startsWith('tester_site_Secret/')) {
        cleanPath = cleanPath.substring('tester_site_Secret/'.length);
    }
    
    console.log(`🧹 Cleaned path: ${cleanPath}`);
    
    // Path to page mapping
    const pathToPageMap = {
        'boosts_info': 'boosts',
        'secret_pets': 'secret',
        'potions_food': 'potions',
        'worlds_info': 'worlds',
        'help_guide': 'help',
        'peoples_thanks': 'peoples',
        'arm_calculator': 'arm',
        'grind_calculator': 'grind',
        'roulette_calculator': 'roulette',
        'boss_calculator': 'boss',
        'shiny_list': 'shiny',
        'codes_list': 'codes',
        'aura_info': 'aura',
        'trainer_info': 'trainer',
        'charms_info': 'charms',
        'settings': 'settings',
        '': 'calculator'
    };
    
    const result = pathToPageMap[cleanPath] || 'calculator';
    console.log(`✅ Parsed result: ${cleanPath} -> ${result}`);
    return result;
}

// Update loading screen text
function updateLoadingText(text) {
    const subtitle = document.querySelector('.loading-subtitle');
    if (subtitle) subtitle.textContent = text;
}

// Hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.remove();
            }
        }, 300);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM Content Loaded');
    console.log('🔍 Initial URL:', window.location.href);
    
    let attempts = 0;
    const maxAttempts = 50;
    
    function waitForCriticalScripts() {
        if (typeof initializeApp === 'function' || attempts >= maxAttempts) {
            console.log('🔄 Starting module loading...');
            loadScriptsDeferred();
            
            // Hide loading screen after delay
            setTimeout(() => {
                updateLoadingText('Ready!');
                setTimeout(hideLoadingScreen, 500);
            }, 3000);
        } else {
            attempts++;
            setTimeout(waitForCriticalScripts, 100);
        }
    }
    
    waitForCriticalScripts();
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('❌ JavaScript Error:', e.error);
});

// Debug utilities
window.debugURL = function() {
    console.log('=== URL DEBUG INFO ===');
    console.log('Current href:', window.location.href);
    console.log('Pathname:', window.location.pathname);
    console.log('Search:', window.location.search);
    console.log('Hash:', window.location.hash);
    console.log('SessionStorage pathToRestore:', sessionStorage.getItem('pathToRestore'));
    
    if (typeof urlRouter === 'function' && urlRouter()) {
        console.log('URL Router available');
        urlRouter().debug();
    } else {
        console.log('URL Router not available');
    }
    console.log('=====================');
};

window.forceRouteCheck = function() {
    console.log('🔄 Force checking route...');
    if (typeof urlRouter === 'function' && urlRouter() && urlRouter().forceRouteCheck) {
        return urlRouter().forceRouteCheck();
    } else {
        console.log('📍 Fallback route check...');
        const currentPath = window.location.pathname;
        const targetPage = parsePathToPage(currentPath);
        if (typeof switchPage === 'function') {
            switchPage(targetPage);
            console.log(`✅ Force switched to: ${targetPage}`);
        }
        return targetPage;
    }
};

window.checkLoadedModules = function() {
    console.log('=== LOADED MODULES CHECK ===');
    console.log('initializeApp:', typeof initializeApp);
    console.log('switchPage:', typeof switchPage);
    console.log('initURLRouting:', typeof initURLRouting);
    console.log('initGitHubAutoReload:', typeof initGitHubAutoReload);
    console.log('urlRouter function:', typeof urlRouter);
    console.log('URL Router instance:', urlRouter ? urlRouter() : 'None');
    console.log('App content element:', document.getElementById('app-content') ? 'Found' : 'Missing');
    console.log('Current page:', typeof getCurrentPage === 'function' ? getCurrentPage() : 'Unknown');
    console.log('Boss Calculator loaded:', typeof initializeBoss === 'function');
    console.log('===========================');
};

console.log('✅ System Loader ready');
