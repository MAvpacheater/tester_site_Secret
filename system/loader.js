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
    const scripts = [
        'calc/calculator/calculator.js', 'calc/arm/arm.js', 'calc/grind/grind.js',
        'calc/roulette/roulette.js', 'calc/boss/boss.js', 'info/boosts/boosts.js',
        'info/shiny/shiny.js', 'info/secret/secret.js', 'info/codes/codes.js',
        'info/aura/aura.js', 'info/trainer/trainer.js', 'info/charms/charms.js',
        'info/potions/potions.js', 'info/worlds/worlds.js', 'moderation/settings/settings.js',
        'other/peoples/peoples.js', 'other/help/help.js'
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
                githubRepo: 'armwrestlerinfopost',
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
        '/armwrestlerinfopost/boosts_info': 'boosts', '/boosts_info': 'boosts', 'boosts_info': 'boosts',
        '/armwrestlerinfopost/secret_pets': 'secret', '/secret_pets': 'secret', 'secret_pets': 'secret',
        '/armwrestlerinfopost/potions_food': 'potions', '/potions_food': 'potions', 'potions_food': 'potions',
        '/armwrestlerinfopost/worlds_info': 'worlds', '/worlds_info': 'worlds', 'worlds_info': 'worlds',
        '/armwrestlerinfopost/help_guide': 'help', '/help_guide': 'help', 'help_guide': 'help',
        '/armwrestlerinfopost/peoples_thanks': 'peoples', '/peoples_thanks': 'peoples', 'peoples_thanks': 'peoples',
        '/armwrestlerinfopost/arm_calculator': 'arm', '/arm_calculator': 'arm', 'arm_calculator': 'arm',
        '/armwrestlerinfopost/grind_calculator': 'grind', '/grind_calculator': 'grind', 'grind_calculator': 'grind',
        '/armwrestlerinfopost/roulette_calculator': 'roulette', '/roulette_calculator': 'roulette', 'roulette_calculator': 'roulette',
        '/armwrestlerinfopost/boss_calculator': 'boss', '/boss_calculator': 'boss', 'boss_calculator': 'boss',
        '/armwrestlerinfopost/shiny_list': 'shiny', '/shiny_list': 'shiny', 'shiny_list': 'shiny',
        '/armwrestlerinfopost/codes_list': 'codes', '/codes_list': 'codes', 'codes_list': 'codes',
        '/armwrestlerinfopost/aura_info': 'aura', '/aura_info': 'aura', 'aura_info': 'aura',
        '/armwrestlerinfopost/trainer_info': 'trainer', '/trainer_info': 'trainer', 'trainer_info': 'trainer',
        '/armwrestlerinfopost/charms_info': 'charms', '/charms_info': 'charms', 'charms_info': 'charms',
        '/armwrestlerinfopost/settings': 'settings', '/settings': 'settings', 'settings': 'settings'
    };
    
    const currentPath = window.location.pathname;
    let targetPage = pathMappings[currentPath] || 'calculator';
    
    if (!pathMappings[currentPath]) {
        for (const [path, page] of Object.entries(pathMappings)) {
            if (currentPath.includes(path.replace('/armwrestlerinfopost', '')) && 
                path.replace('/armwrestlerinfopost', '')) {
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
        cleanPath = cleanPath.substring('armwrestlerinfopost/'.length);
    }
    
    const pathMap = {
        'boosts_info': 'boosts', 'secret_pets': 'secret', 'potions_food': 'potions',
        'worlds_info': 'worlds', 'help_guide': 'help', 'peoples_thanks': 'peoples',
        'arm_calculator': 'arm', 'grind_calculator': 'grind', 'roulette_calculator': 'roulette',
        'boss_calculator': 'boss', 'shiny_list': 'shiny', 'codes_list': 'codes',
        'aura_info': 'aura', 'trainer_info': 'trainer', 'charms_info': 'charms',
        'settings': 'settings', '': 'calculator'
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
        ['initializeApp', 'switchPage', 'initURLRouting', 'initGitHubAutoReload', 'initializeBoss']
            .forEach(fn => console.log(`${fn}:`, typeof window[fn]));
        console.log('App content:', document.getElementById('app-content') ? 'Found' : 'Missing');
        console.log('Current page:', typeof getCurrentPage === 'function' ? getCurrentPage() : 'Unknown');
    }
});
