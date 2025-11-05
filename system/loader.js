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
    updateLoadingText('Loading...');
    
    try {
        // PARALLEL LOADING - All scripts load at once!
        console.log('📦 Loading ALL scripts in parallel...');
        
        await Promise.all([
            // System scripts
            createScript('system/moderation/settings.js'),
            createScript('system/moderation/help.js'),
            createScript('system/moderation/peoples.js'),
            createScript('system/moderation/menu_manager.js'),
            
            // AWS system
            createScript('AWS/system/aws_utils.js'),
            createScript('AWS/system/aws_router.js'),
            createScript('AWS/system/aws_loader.js'),
            
            // RCU system
            createScript('RCU/system/RCU_loader.js'),
            
            // System Content Loader
            createScript('system/system_content/system_content.js'),
            
            // Content loader
            createScript('system/content_loader.js')
        ]);
        
        console.log('✅ All scripts loaded');
        
        // Immediate initialization without delay
        initializeSystems();
        
    } catch (error) {
        console.error('❌ Critical error:', error);
        updateLoadingText('Loading failed!');
        setTimeout(initializeSystems, 1000);
    }
}

async function initializeSystems() {
    try {
        console.log('🚀 ========== INITIALIZING ==========');
        
        updateLoadingText('Starting...');
        
        // PARALLEL: Load critical CSS for AWS & RCU
        const criticalLoading = [];
        
        if (typeof loadAllAWSModules === 'function') {
            criticalLoading.push(loadAllAWSModules());
        }
        
        if (typeof loadAllRCUModules === 'function') {
            criticalLoading.push(loadAllRCUModules());
        }
        
        // Wait for critical CSS to load in parallel
        await Promise.all(criticalLoading);
        console.log('✅ Critical modules loaded');
        
        // Initialize URL Routing immediately
        if (typeof initURLRouting === 'function') {
            initURLRouting();
            console.log('✅ URL routing initialized');
        }
        
        // Initialize Auto-Reload (non-blocking)
        if (typeof initGitHubAutoReload === 'function') {
            setTimeout(() => {
                initGitHubAutoReload({
                    githubUser: 'MAvpacheater',
                    githubRepo: 'tester_site_Secret',
                    branch: 'main',
                    checkInterval: 60000
                });
            }, 5000); // Delayed to not block initial load
            console.log('✅ Auto-reload scheduled');
        }
        
        initDebugUtilities();
        
        console.log('✅ ========== SYSTEMS READY ==========');
        
        // Hide loading screen immediately
        updateLoadingText('Ready!');
        setTimeout(hideLoadingScreen, 200);
        
    } catch (error) {
        console.error('❌ Critical error:', error);
        updateLoadingText('Initialization error!');
        setTimeout(hideLoadingScreen, 1000);
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
    const maxAttempts = 30; // Reduced from 50
    
    function waitForCriticalScripts() {
        const criticalFunctions = [
            'initializeApp', 
            'switchPage', 
            'getCurrentAppLanguage'
        ];
        const allLoaded = criticalFunctions.every(fn => typeof window[fn] === 'function');
        
        if (allLoaded) {
            console.log('✅ Critical scripts loaded');
            loadSystemScripts(); // Start loading immediately
        } else if (attempts >= maxAttempts) {
            console.error('❌ Critical scripts timeout');
            console.error('Missing:', criticalFunctions.filter(fn => typeof window[fn] !== 'function'));
            updateLoadingText('Critical error - please refresh');
            setTimeout(() => alert('Critical scripts failed to load. Please refresh.'), 1000);
        } else {
            attempts++;
            setTimeout(waitForCriticalScripts, 50); // Reduced from 100ms
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
}

console.log('✅ System Loader ready (OPTIMIZED - Parallel Loading)');
