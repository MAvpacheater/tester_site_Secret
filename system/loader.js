function createScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            console.log(`⚠️ Already loaded: ${src}`);
            resolve(src);
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        script.onload = () => {
            console.log(`✅ Loaded: ${src}`);
            resolve(src);
        };
        script.onerror = (error) => {
            console.error(`❌ Failed: ${src}`);
            reject(new Error(`Failed to load ${src}`));
        };
        
        document.head.appendChild(script);
    });
}

async function loadSystemScripts() {
    updateLoadingText('Loading system modules...');
    
    try {
        // STEP 1: System scripts (Settings, Help, Peoples - NO AUTH)
        console.log('📦 Step 1: System scripts (NO AUTH)...');
        const systemScripts = [
            'system/moderation/settings.js',
            'system/moderation/help.js',
            'system/moderation/peoples.js'
        ];
        
        await Promise.all(systemScripts.map(createScript));
        console.log('✅ System scripts loaded (NO AUTH)');
        
        // STEP 2: Menu Manager (JS ONLY - CSS буде в index.html)
        console.log('📦 Step 2: Menu Manager...');
        await createScript('system/moderation/menu_manager.js');
        console.log('✅ Menu Manager loaded');
        
        // STEP 3: AWS system
        console.log('📦 Step 3: AWS system...');
        await createScript('AWS/system/aws_utils.js');
        await createScript('AWS/system/aws_router.js');
        await createScript('AWS/system/aws_loader.js');
        console.log('✅ AWS system loaded');
        
        // STEP 4: RCU system
        console.log('📦 Step 4: RCU system...');
        await createScript('RCU/system/RCU_loader.js');
        console.log('✅ RCU system loaded');
        
        // STEP 5: System Content Loader
        console.log('📦 Step 5: System Content Loader...');
        await createScript('system/system_content/system_content.js');
        console.log('✅ System Content Loader loaded');
        
        // STEP 6: Content loader (combines AWS + RCU + System)
        console.log('📦 Step 6: Content loader...');
        await createScript('system/content_loader.js');
        console.log('✅ Content loader loaded');
        
        // Initialize
        updateLoadingText('Initializing systems...');
        setTimeout(initializeSystems, 500);
        
    } catch (error) {
        console.error('❌ Critical error:', error);
        updateLoadingText('Loading failed!');
        setTimeout(initializeSystems, 2000);
    }
}

async function initializeSystems() {
    try {
        console.log('🚀 ========== INITIALIZING ==========');
        
        // STEP 1: Menu Manager
        updateLoadingText('Initializing menu manager...');
        console.log('🎯 Menu Manager:', window.menuPositionManager ? '✅' : '⚠️ Not found');
        
        // STEP 2: AWS Router
        updateLoadingText('Initializing AWS router...');
        console.log('📦 AWS Router:', window.awsRouter ? '✅' : '⚠️ Not found');
        
        // STEP 3: RCU Loader
        updateLoadingText('Initializing RCU loader...');
        console.log('🎮 RCU Loader:', window.rcuLoader ? '✅' : '⚠️ Not found');
        
        // STEP 4: System Content Loader
        updateLoadingText('Initializing System modules...');
        console.log('🔧 System Content Loader:', window.systemContentLoader ? '✅' : '⚠️ Not found');
        
        // STEP 5: AWS Modules (critical CSS only)
        updateLoadingText('Loading AWS modules...');
        if (typeof loadAllAWSModules === 'function') {
            await loadAllAWSModules();
            console.log('✅ Critical AWS modules loaded');
        }
        
        // STEP 6: RCU Modules (critical CSS only)
        updateLoadingText('Loading RCU modules...');
        if (typeof loadAllRCUModules === 'function') {
            await loadAllRCUModules();
            console.log('✅ Critical RCU modules loaded');
        }
        
        // STEP 7: URL Routing
        updateLoadingText('Setting up routing...');
        if (typeof initURLRouting === 'function') {
            initURLRouting();
            console.log('✅ URL routing initialized');
        }
        
        // STEP 8: Auto-Reload
        updateLoadingText('Setting up auto-reload...');
        if (typeof initGitHubAutoReload === 'function') {
            initGitHubAutoReload({
                githubUser: 'MAvpacheater',
                githubRepo: 'tester_site_Secret',
                branch: 'main',
                checkInterval: 60000
            });
            console.log('✅ Auto-reload initialized');
        }
        
        // STEP 9: Final setup
        updateLoadingText('Finalizing...');
        await new Promise(resolve => setTimeout(resolve, 300));
        
        initDebugUtilities();
        
        console.log('✅ ========== SYSTEMS READY ==========');
        
        setTimeout(() => {
            updateLoadingText('Ready!');
            setTimeout(hideLoadingScreen, 500);
        }, 1000);
        
    } catch (error) {
        console.error('❌ Critical error:', error);
        updateLoadingText('Initialization error!');
        setTimeout(() => {
            hideLoadingScreen();
        }, 2000);
    }
}

function updateLoadingText(text) {
    const subtitle = document.querySelector('.loading-subtitle');
    if (subtitle) {
        subtitle.textContent = text;
        console.log('📝', text);
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        console.log('✅ Hiding loading screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.remove(), 300);
    }
}

// ========== MAIN INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ========== DOM READY ==========');
    console.log('📍 URL:', window.location.href);
    console.log('📍 Path:', window.location.pathname);
    
    let attempts = 0;
    const maxAttempts = 50;
    
    function waitForCriticalScripts() {
        const criticalFunctions = [
            'initializeApp', 
            'switchPage', 
            'getCurrentAppLanguage'
        ];
        const allLoaded = criticalFunctions.every(fn => typeof window[fn] === 'function');
        
        if (allLoaded) {
            console.log('✅ Critical scripts loaded');
            console.log('📋 Checking optional: menuPositionManager =', typeof window.menuPositionManager);
            loadSystemScripts();
        } else if (attempts >= maxAttempts) {
            console.error('❌ Critical scripts timeout');
            console.error('Missing:', criticalFunctions.filter(fn => typeof window[fn] !== 'function'));
            updateLoadingText('Critical error - please refresh');
            setTimeout(() => alert('Critical scripts failed to load. Please refresh.'), 1000);
        } else {
            attempts++;
            setTimeout(waitForCriticalScripts, 100);
        }
    }
    
    waitForCriticalScripts();
});

// ========== DEBUG UTILITIES ==========

window.debugSystemReady = false;

function initDebugUtilities() {
    Object.assign(window, {
        debugSystem: () => {
            console.log('=== SYSTEM DEBUG ===');
            console.log('URL:', window.location.href);
            console.log('Path:', window.location.pathname);
            console.log('\n=== FUNCTIONS ===');
            ['initializeApp', 'switchPage', 'getCurrentAppLanguage', 'initURLRouting', 'loadAllAWSModules', 'loadAllRCUModules'].forEach(fn => {
                console.log(`${typeof window[fn] === 'function' ? '✅' : '❌'} ${fn}`);
            });
            console.log('\n=== MENU MANAGER ===');
            console.log('Position Manager:', typeof window.menuPositionManager);
            console.log('Current Position:', localStorage.getItem('armHelper_menuPosition') || 'left');
            console.log('\n=== AWS ===');
            console.log('Loader:', typeof window.awsLoader);
            console.log('Router:', typeof window.awsRouter);
            console.log('Utils:', typeof window.awsUtils);
            if (window.awsLoader) {
                console.log('Loaded:', window.awsLoader.getLoadedModules());
            }
            console.log('\n=== RCU ===');
            console.log('Loader:', typeof window.rcuLoader);
            if (window.rcuLoader) {
                console.log('Loaded:', window.rcuLoader.getLoadedModules());
            }
            console.log('\n=== SYSTEM ===');
            console.log('Content Loader:', typeof window.systemContentLoader);
            if (window.systemContentLoader) {
                console.log('Loaded:', window.systemContentLoader.getLoadedModules());
            }
        },
        
        forceRoute: (page) => {
            console.log('🔄 Force route:', page);
            typeof switchPage === 'function' ? switchPage(page) : console.error('❌ switchPage N/A');
        },
        
        checkModules: () => {
            console.log('=== AWS MODULES ===');
            if (window.awsLoader) {
                console.log('Loaded:', window.awsLoader.getLoadedModules());
                console.log('All:', window.awsLoader.getAllModuleNames());
            } else {
                console.error('❌ AWS Loader N/A');
            }
            
            console.log('\n=== RCU MODULES ===');
            if (window.rcuLoader) {
                console.log('Loaded:', window.rcuLoader.getLoadedModules());
                console.log('All:', window.rcuLoader.getAllModuleNames());
            } else {
                console.error('❌ RCU Loader N/A');
            }
            
            console.log('\n=== SYSTEM MODULES ===');
            if (window.systemContentLoader) {
                console.log('Loaded:', window.systemContentLoader.getLoadedModules());
                console.log('All:', window.systemContentLoader.getAllModuleNames());
            } else {
                console.error('❌ System Content Loader N/A');
            }
        },
        
        testMenuPositions: () => {
            console.log('🎯 Testing menu positions...');
            ['left', 'right', 'up', 'down'].forEach((pos, i) => {
                setTimeout(() => {
                    console.log(`Testing position: ${pos}`);
                    if (window.menuPositionManager) {
                        window.menuPositionManager.apply(pos);
                    }
                }, i * 2000);
            });
        },
        
        quickReload: () => {
            console.log('🔄 Reloading');
            window.location.reload();
        }
    });
    
    window.debugSystemReady = true;
    console.log('✅ Debug utilities ready');
    console.log('📖 Debug commands:');
    console.log('  - window.debugSystem() - Show system status');
    console.log('  - window.checkModules() - Show loaded modules');
    console.log('  - window.testMenuPositions() - Test all menu positions');
    console.log('  - window.forceRoute("page") - Navigate to page');
}

console.log('✅ System Loader ready (FIXED - menu_manager.css removed)');
