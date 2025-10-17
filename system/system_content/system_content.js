// ========== SYSTEM CONTENT LOADER (NO AUTH) ==========

class SystemContentLoader {
    constructor() {
        this.basePath = this.getBasePath();
        this.moduleConfigs = {
            settings: { path: 'system/moderation/settings.js', css: 'system/moderation/settings.css' },
            help: { path: 'system/moderation/help.js', css: 'system/moderation/help.css' },
            peoples: { path: 'system/moderation/peoples.js', css: 'system/moderation/peoples.css' }
        };
        this.loadedModules = new Set();
        this.loadingModules = new Map();
        console.log('📁 System Content Loader Base Path:', this.basePath);
    }

    getBasePath() {
        const baseTag = document.querySelector('base');
        if (baseTag && baseTag.href) {
            const baseUrl = new URL(baseTag.href);
            return baseUrl.pathname;
        }

        const { protocol, host, pathname } = window.location;
        
        if (host === 'mavpacheater.github.io') {
            return `${protocol}//${host}/tester_site_Secret/`;
        }
        
        if (host.includes('localhost') || host.includes('127.0.0.1')) {
            const pathParts = pathname.split('/').filter(Boolean);
            if (pathParts.length > 0) {
                return `${protocol}//${host}/${pathParts[0]}/`;
            }
            return `${protocol}//${host}/`;
        }
        
        return '/';
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
            console.error(`❌ Unknown system module: ${moduleName}`);
            return false;
        }

        const loadPromise = this._loadModuleFiles(moduleName, config);
        this.loadingModules.set(moduleName, loadPromise);

        try {
            await loadPromise;
            this.loadedModules.add(moduleName);
            this.loadingModules.delete(moduleName);
            console.log(`✅ System module loaded: ${moduleName}`);
            return true;
        } catch (error) {
            this.loadingModules.delete(moduleName);
            console.error(`❌ Failed to load ${moduleName}:`, error);
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
const systemContentLoader = new SystemContentLoader();

// ========== EXPORTS ==========
Object.assign(window, {
    SystemContentLoader,
    systemContentLoader,
    loadSystemModule: (name) => systemContentLoader.loadModule(name),
    isSystemModuleLoaded: (name) => systemContentLoader.isModuleLoaded(name),
    getLoadedSystemModules: () => systemContentLoader.getLoadedModules()
});

console.log('✅ System Content Loader initialized (NO AUTH)');
