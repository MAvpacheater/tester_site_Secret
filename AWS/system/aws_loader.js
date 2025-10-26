// ========== AWS MODULE LOADER (Optimized with Shared Styles) ==========

class AWSModuleLoader {
    constructor() {
        this.loadedModules = new Set();
        this.loadingModules = new Map();
        this.sharedStylesLoaded = false;
        this.moduleConfigs = {
            // Калькулятори
            calculator: { path: 'calc/calculator.js', css: 'calc/calculator-unique.css' },
            arm: { path: 'calc/arm.js' }, // Немає CSS - все в shared
            grind: { path: 'calc/grind.js', css: 'calc/grind-unique.css' },
            roulette: { path: 'calc/roulette.js' }, // Немає CSS - все в shared
            boss: { path: 'calc/boss.js', css: 'calc/boss-unique.css' },
            
            // Інформація
            boosts: { path: 'info/boosts.js', css: 'info/boosts.css' },
            shiny: { path: 'info/shiny.js', css: 'info/shiny.css' },
            secret: { path: 'info/secret.js', css: 'info/secret.css' },
            codes: { path: 'info/codes.js', css: 'info/codes.css' },
            aura: { path: 'info/aura.js', css: 'info/aura.css' },
            trainer: { path: 'info/trainer.js', css: 'info/trainer.css' },
            charms: { path: 'info/charms.js', css: 'info/charms.css' },
            potions: { path: 'info/potions.js', css: 'info/potions.css' },
            worlds: { path: 'info/worlds.js', css: 'info/worlds.css' },
            
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
        
        console.log('🎨 Loading shared AWS styles...');
        await this.loadCSS(this.basePath + 'system/shared-styles.css');
        this.sharedStylesLoaded = true;
        console.log('✅ Shared AWS styles loaded');
        return true;
    }

    async loadModule(moduleName) {
        // Завантажити спільні стилі першими
        await this.loadSharedStyles();

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
        
        // 1. Спочатку завантажити спільні стилі
        await this.loadSharedStyles();
        
        // 2. Потім критичні модулі
        const critical = ['calculator', 'arm', 'grind'];
        
        await Promise.all(
            critical.map(name => {
                const config = this.moduleConfigs[name];
                // Завантажити тільки унікальний CSS якщо є
                return config?.css ? this.loadCSS(this.basePath + config.css) : Promise.resolve();
            })
        );
        
        console.log('✅ Critical AWS resources preloaded');
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

console.log('✅ AWS Module Loader initialized (Optimized with shared styles)');
console.log('📍 Base path:', awsLoader.basePath);
