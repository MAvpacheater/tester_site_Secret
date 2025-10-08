function createScript(src) {
    return new Promise(resolve => {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        script.onload = () => resolve(src);
        script.onerror = () => resolve(src);
        document.head.appendChild(script);
    });
}

async function loadScriptsDeferred() {
    // Updated script paths - removed subdirectories
    const scripts = [
        'calc/calculator.js', 
        'calc/arm.js', 
        'calc/grind.js',
        'calc/roulette.js', 
        'calc/boss.js', 
        'info/boosts.js',
        'info/shiny.js', 
        'info/secret.js', 
        'info/codes.js',
        'info/aura.js', 
        'info/trainer.js', 
        'info/charms.js',
        'info/potions.js', 
        'info/worlds.js', 
        'moderation/settings.js',
        'other/peoples.js', 
        'other/help.js',
        'other/sell.js'
    ];
    
    updateLoadingText('Loading modules...');
    
    try {
        await Promise.all(scripts.map(createScript));
        await createScript('index/content_loader.js');
        updateLoadingText('Ready!');
        setTimeout(initializeSystems, 500);
    } catch (error) {
        console.error('Error loading scripts:', error);
        updateLoadingText('Loading completed with warnings');
        setTimeout(initializeSystems, 1000);
    }
}

function initializeSystems() {
    try {
        if (typeof initURLRouting === 'function') {
            const router = initURLRouting();
            if (router?.forceRouteCheck) {
                setTimeout(() => router.forceRouteCheck(), 100);
            }
        }
        
        if (typeof initGitHubAutoReload === 'function') {
            initGitHubAutoReload({
                githubUser: 'MAvpacheater',
                githubRepo: 'roblox_info_post',
                branch: 'main',
                checkInterval: 30000
            });
        }
        
        setTimeout(handleEnhancedRouting, 300);
    } catch (error) {
        console.error('Error initializing systems:', error);
        setTimeout(handleEnhancedRouting, 1000);
    }
}

function handleEnhancedRouting() {
    const restoredPath = sessionStorage.getItem('pathToRestore');
    if (restoredPath) {
        const targetPage = parsePathToPage(restoredPath);
        if (targetPage) {
            setTimeout(() => {
                if (typeof switchPage === 'function') switchPage(targetPage);
            }, 200);
            sessionStorage.removeItem('pathToRestore');
            return;
        }
    }
    
    const pathMappings = {
        '/roblox_info_post/boosts_info': 'boosts', '/boosts_info': 'boosts', 'boosts_info': 'boosts',
        '/roblox_info_post/secret_pets': 'secret', '/secret_pets': 'secret', 'secret_pets': 'secret',
        '/roblox_info_post/potions_food': 'potions', '/potions_food': 'potions', 'potions_food': 'potions',
        '/roblox_info_post/worlds_info': 'worlds', '/worlds_info': 'worlds', 'worlds_info': 'worlds',
        '/roblox_info_post/help_guide': 'help', '/help_guide': 'help', 'help_guide': 'help',
        '/roblox_info_post/peoples_thanks': 'peoples', '/peoples_thanks': 'peoples', 'peoples_thanks': 'peoples',
        '/roblox_info_post/arm_calculator': 'arm', '/arm_calculator': 'arm', 'arm_calculator': 'arm',
        '/roblox_info_post/grind_calculator': 'grind', '/grind_calculator': 'grind', 'grind_calculator': 'grind',
        '/roblox_info_post/roulette_calculator': 'roulette', '/roulette_calculator': 'roulette', 'roulette_calculator': 'roulette',
        '/roblox_info_post/boss_calculator': 'boss', '/boss_calculator': 'boss', 'boss_calculator': 'boss',
        '/roblox_info_post/shiny_list': 'shiny', '/shiny_list': 'shiny', 'shiny_list': 'shiny',
        '/roblox_info_post/codes_list': 'codes', '/codes_list': 'codes', 'codes_list': 'codes',
        '/roblox_info_post/aura_info': 'aura', '/aura_info': 'aura', 'aura_info': 'aura',
        '/roblox_info_post/trainer_info': 'trainer', '/trainer_info': 'trainer', 'trainer_info': 'trainer',
        '/roblox_info_post/charms_info': 'charms', '/charms_info': 'charms', 'charms_info': 'charms',
        '/roblox_info_post/settings': 'settings', '/settings': 'settings', 'settings': 'settings',
        '/roblox_info_post/trader_store': 'trader', '/trader_store': 'trader', 'trader_store': 'trader'
    };
    
    const currentPath = window.location.pathname;
    let targetPage = pathMappings[currentPath] || 'calculator';
    
    if (!pathMappings[currentPath]) {
        for (const [path, page] of Object.entries(pathMappings)) {
            if (currentPath.includes(path.replace('/roblox_info_post', '')) && 
                path.replace('/м', '')) {
                targetPage = page;
                break;
            }
        }
    }
    
    if (typeof switchPage === 'function') {
        setTimeout(() => switchPage(targetPage), 300);
    }
}

function parsePathToPage(path) {
    let cleanPath = path.split('?')[0].split('#')[0];
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
    if (cleanPath.endsWith('/')) cleanPath = cleanPath.slice(0, -1);
    if (cleanPath.startsWith('armwrestlerinfopost/')) {
        cleanPath = cleanPath.substring('roblox_info_post/'.length);
    }
    
    const pathMap = {
        'boosts_info': 'boosts', 'secret_pets': 'secret', 'potions_food': 'potions',
        'worlds_info': 'worlds', 'help_guide': 'help', 'peoples_thanks': 'peoples',
        'arm_calculator': 'arm', 'grind_calculator': 'grind', 'roulette_calculator': 'roulette',
        'boss_calculator': 'boss', 'shiny_list': 'shiny', 'codes_list': 'codes',
        'aura_info': 'aura', 'trainer_info': 'trainer', 'charms_info': 'charms',
        'settings': 'settings', 'trader_store': 'trader', '': 'calculator'
    };
    
    return pathMap[cleanPath] || 'calculator';
}

function updateLoadingText(text) {
    const subtitle = document.querySelector('.loading-subtitle');
    if (subtitle) subtitle.textContent = text;
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.remove(), 300);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let attempts = 0;
    const maxAttempts = 50;
    
    function waitForCriticalScripts() {
        if (typeof initializeApp === 'function' || attempts >= maxAttempts) {
            loadScriptsDeferred();
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

Object.assign(window, {
    debugURL: () => {
        console.log('=== URL DEBUG ===');
        console.log('href:', window.location.href);
        console.log('pathname:', window.location.pathname);
        console.log('pathToRestore:', sessionStorage.getItem('pathToRestore'));
        if (typeof urlRouter === 'function' && urlRouter()) urlRouter().debug();
    },
    forceRouteCheck: () => {
        if (typeof urlRouter === 'function' && urlRouter()?.forceRouteCheck) {
            return urlRouter().forceRouteCheck();
        }
        const targetPage = parsePathToPage(window.location.pathname);
        if (typeof switchPage === 'function') switchPage(targetPage);
        return targetPage;
    },
    checkLoadedModules: () => {
        console.log('=== LOADED MODULES ===');
        ['initializeApp', 'switchPage', 'initURLRouting', 'initGitHubAutoReload', 'initializeBoss', 'initializeTrader']
            .forEach(fn => console.log(`${fn}:`, typeof window[fn]));
        console.log('App content:', document.getElementById('app-content') ? 'Found' : 'Missing');
        console.log('Current page:', typeof getCurrentPage === 'function' ? getCurrentPage() : 'Unknown');
    }
});
