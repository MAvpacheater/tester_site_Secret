// ========== AWS MODULE LOADER (OPTIMIZED - Lazy Loading) ==========

class AWSModuleLoader {
    constructor() {
        this.loadedModules = new Set();
        this.loadingModules = new Map();
        this.sharedStylesLoaded = false;
        this.infoSharedStylesLoaded = false;
        this.moduleConfigs = {
            // Калькулятори - БЕЗ власних CSS (все в shared)
            calculator: { path: 'calc/calculator.js', css: 'calc/calculator.css' },
            arm: { path: 'calc/arm.js' },
            grind: { path: 'calc/grind.js', css: 'calc/grind.css' },
            roulette: { path: 'calc/roulette.js' },
            boss: { path: 'calc/boss.js', css: 'calc/boss.css' },
            
            // Інформація - БЕЗ власних CSS (все в shared)
            boosts: { path: 'info/boosts.js' },
            shiny: { path: 'info/shiny.js' },
            secret: { path: 'info/secret.js', css: 'info/secret.css' },
            codes: { path: 'info/codes.js', css: 'info/codes.css' },
            aura: { path: 'info/aura.js' },
            trainer: { path: 'info/trainer.js', css: 'info/trainer.css' },
            charms: { path: 'info/charms.js' },
            potions: { path: 'info/potions.js', css: 'info/potions.css' },
            worlds: { path: 'info/worlds.js' },
            
            // Інше (AWS)
            trader: { path: 'other/sell.js', css: 'other/sell.css' },
            clans: { path: 'other/clans.js', css: 'other/clans.css' }
        };
        
        this.basePath = this.getBasePath();
        console.log('📁 AWS Loader Base Path:', this.basePath);
    }

    getBasePath() {
        const baseTag = document.querySelector('base');
        if (baseTag && baseTag.href) {
            const baseUrl = new URL(baseTag.href);
            return baseUrl.pathname + 'AWS/';
        }

        const { protocol, host, pathname } = window.location;
        
        if (host === 'mavpacheater.github.io') {
            return `${protocol}//${host}/tester_site_Secret/AWS/`;
        }
        
        if (host.includes('localhost') || host.includes('127.0.0.1')) {
            const pathParts = pathname.split('/').filter(Boolean);
            if (pathParts.length > 0 && pathParts[0] !== 'AWS') {
                return `${protocol}//${host}/${pathParts[0]}/AWS/`;
            }
            return `${protocol}//${host}/AWS/`;
        }
        
        return '/AWS/';
    }

    async loadSharedStyles() {
        if (this.sharedStylesLoaded) return true;
        
        console.log('🎨 Loading shared CALC styles...');
        await this.loadCSS(this.basePath + 'calc/shared-styles.css');
        this.sharedStylesLoaded = true;
        console.log('✅ Shared CALC styles loaded');
        return true;
    }

    async loadInfoSharedStyles() {
        if (this.infoSharedStylesLoaded) return true;
        
        console.log('🎨 Loading shared INFO styles...');
        await this.loadCSS(this.basePath + 'info/info-shared-styles.css');
        this.infoSharedStylesLoaded = true;
        console.log('✅ Shared INFO styles loaded');
        return true;
    }

    async loadModule(moduleName) {
        // Завантажити спільні стилі першими
        const calcModules = ['calculator', 'arm', 'grind', 'roulette', 'boss'];
        const infoModules = ['boosts', 'shiny', 'secret', 'codes', 'aura', 'trainer', 'charms', 'potions', 'worlds'];
        
        if (calcModules.includes(moduleName)) {
            await this.loadSharedStyles();
        } else if (infoModules.includes(moduleName)) {
            await this.loadInfoSharedStyles();
        }

        if (this.loadedModules.has(moduleName)) {
            return true;
        }

        if (this.loadingModules.has(moduleName)) {
            return this.loadingModules.get(moduleName);
        }

        const config = this.moduleConfigs[moduleName];
        if (!config) {
            console.error(`❌ Unknown AWS module: ${moduleName}`);
            return false;
        }

        const loadPromise = this._loadModuleFiles(moduleName, config);
        this.loadingModules.set(moduleName, loadPromise);

        try {
            await loadPromise;
            this.loadedModules.add(moduleName);
            this.loadingModules.delete(moduleName);
            console.log(`✅ AWS module loaded: ${moduleName}`);
            return true;
        } catch (error) {
            this.loadingModules.delete(moduleName);
            console.error(`❌ Failed to load AWS module ${moduleName}:`, error);
            return false;
        }
    }

    async _loadModuleFiles(moduleName, config) {
        const promises = [];

        // Завантажити унікальний CSS якщо є
        if (config.css) {
            promises.push(this.loadCSS(this.basePath + config.css));
        }

        // Завантажити JS
        promises.push(this.loadScript(this.basePath + config.path));

        await Promise.all(promises);
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve(src);
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.defer = true;
            script.onload = () => resolve(src);
            script.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.head.appendChild(script);
        });
    }

    loadCSS(href) {
        return new Promise((resolve) => {
            if (document.querySelector(`link[href="${href}"]`)) {
                resolve(href);
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = () => resolve(href);
            link.onerror = () => resolve(href);
            document.head.appendChild(link);
        });
    }

    async preloadCriticalModules() {
        console.log('📦 Preloading critical AWS resources...');
        
        // ONLY load shared CSS - no individual modules
        // Modules will load on-demand when user switches pages
        await Promise.all([
            this.loadSharedStyles(),
            this.loadInfoSharedStyles()
        ]);
        
        console.log('✅ Critical AWS resources preloaded (shared CSS only)');
    }

    isModuleLoaded(moduleName) {
        return this.loadedModules.has(moduleName);
    }

    getLoadedModules() {
        return Array.from(this.loadedModules);
    }

    getAllModuleNames() {
        return Object.keys(this.moduleConfigs);
    }

    getModulesByCategory() {
        return {
            calculators: ['calculator', 'arm', 'grind', 'roulette', 'boss'],
            info: ['boosts', 'shiny', 'secret', 'codes', 'aura', 'trainer', 'charms', 'potions', 'worlds'],
            other: ['trader', 'clans']
        };
    }
}

// ========== GLOBAL INSTANCE ==========
const awsLoader = new AWSModuleLoader();

// ========== EXPORTS ==========
Object.assign(window, {
    AWSModuleLoader,
    awsLoader,
    loadAWSModule: (name) => awsLoader.loadModule(name),
    loadAllAWSModules: () => awsLoader.preloadCriticalModules(),
    isAWSModuleLoaded: (name) => awsLoader.isModuleLoaded(name),
    getLoadedAWSModules: () => awsLoader.getLoadedModules(),
    getAllAWSModules: () => awsLoader.getAllModuleNames(),
    getAWSModulesByCategory: () => awsLoader.getModulesByCategory()
});

console.log('✅ AWS Module Loader initialized (OPTIMIZED - Lazy Loading)');
console.log('📍 Base path:', awsLoader.basePath);
