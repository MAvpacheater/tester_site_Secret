// ========== RCU MODULE LOADER (Single Module) ==========

class RCUModuleLoader {
    constructor() {
        this.loadedModules = new Set();
        this.loadingModules = new Map();
        this.moduleConfigs = {
            // Калькулятори
            petscalc: { path: 'calc/pets_calc.js', css: 'calc/pets_calc.css' }
        };
        
        this.basePath = this.getBasePath();
        console.log('📁 RCU Loader Base Path:', this.basePath);
    }

    getBasePath() {
        const baseTag = document.querySelector('base');
        if (baseTag && baseTag.href) {
            const baseUrl = new URL(baseTag.href);
            return baseUrl.pathname + 'RCU/';
        }

        const { protocol, host, pathname } = window.location;
        
        if (host === 'mavpacheater.github.io') {
            return `${protocol}//${host}/tester_site_Secret/RCU/`;
        }
        
        if (host.includes('localhost') || host.includes('127.0.0.1')) {
            const pathParts = pathname.split('/').filter(Boolean);
            if (pathParts.length > 0 && pathParts[0] !== 'RCU') {
                return `${protocol}//${host}/${pathParts[0]}/RCU/`;
            }
            return `${protocol}//${host}/RCU/`;
        }
        
        return '/RCU/';
    }

    async loadModule(moduleName) {
        if (this.loadedModules.has(moduleName)) {
            return true;
        }

        if (this.loadingModules.has(moduleName)) {
            return this.loadingModules.get(moduleName);
        }

        const config = this.moduleConfigs[moduleName];
        if (!config) {
            console.error(`❌ Unknown RCU module: ${moduleName}`);
            return false;
        }

        const loadPromise = this._loadModuleFiles(moduleName, config);
        this.loadingModules.set(moduleName, loadPromise);

        try {
            await loadPromise;
            this.loadedModules.add(moduleName);
            this.loadingModules.delete(moduleName);
            console.log(`✅ RCU module loaded: ${moduleName}`);
            return true;
        } catch (error) {
            this.loadingModules.delete(moduleName);
            console.error(`❌ Failed to load RCU module ${moduleName}:`, error);
            return false;
        }
    }

    async _loadModuleFiles(moduleName, config) {
        const promises = [];

        if (config.css) {
            promises.push(this.loadCSS(this.basePath + config.css));
        }

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
        console.log('📦 Preloading critical RCU CSS...');
        const critical = ['petscalc'];
        
        await Promise.all(
            critical.map(name => {
                const config = this.moduleConfigs[name];
                return config?.css ? this.loadCSS(this.basePath + config.css) : Promise.resolve();
            })
        );
        
        console.log('✅ Critical RCU CSS preloaded');
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
}

// ========== GLOBAL INSTANCE ==========
const rcuLoader = new RCUModuleLoader();

// ========== EXPORTS ==========
Object.assign(window, {
    RCUModuleLoader,
    rcuLoader,
    loadRCUModule: (name) => rcuLoader.loadModule(name),
    loadAllRCUModules: () => rcuLoader.preloadCriticalModules(),
    isRCUModuleLoaded: (name) => rcuLoader.isModuleLoaded(name),
    getLoadedRCUModules: () => rcuLoader.getLoadedModules(),
    getAllRCUModules: () => rcuLoader.getAllModuleNames()
});

console.log('✅ RCU Module Loader initialized');
console.log('📍 Base path:', rcuLoader.basePath);
