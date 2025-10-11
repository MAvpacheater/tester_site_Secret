// ========== RCU ROUTER ==========

class RCURouter {
    constructor() {
        this.currentPage = null;
        this.pageContainers = new Map();
        this.initFunctions = new Map();
        this.basePath = this.getBasePath();
        this.initializePageMapping();
        console.log('📁 RCU Router Base Path:', this.basePath);
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

    initializePageMapping() {
        const pages = ['petscalc'];

        pages.forEach(page => this.pageContainers.set(page, `${page}Page`));

        const initMap = {
            petscalc: 'initializePetsCalc'
        };

        Object.entries(initMap).forEach(([page, func]) => {
            this.initFunctions.set(page, func);
        });

        console.log('✅ RCU Router: Page mapping initialized');
    }

    async switchToPage(pageName) {
        console.log(`🔄 RCU Router switching to: ${pageName}`);

        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        const containerId = this.pageContainers.get(pageName);
        if (!containerId) {
            console.warn(`⚠️ Unknown RCU page: ${pageName}`);
            return false;
        }

        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`⚠️ RCU Container not found: ${containerId}`);
            return false;
        }

        container.classList.add('active');
        this.currentPage = pageName;

        if (window.rcuLoader) {
            await window.rcuLoader.loadModule(pageName);
        }
        
        this.initializePageContent(pageName);
        
        console.log(`✅ RCU Router switched to: ${pageName}`);
        return true;
    }

    initializePageContent(pageName) {
        const containerId = this.pageContainers.get(pageName);
        const container = containerId ? document.getElementById(containerId) : null;
        const initFunc = this.initFunctions.get(pageName);

        if (!container || !initFunc) return;

        const attemptInit = () => {
            if (typeof window[initFunc] === 'function') {
                console.log(`📦 RCU Router initializing: ${pageName}`);
                setTimeout(() => window[initFunc](), 100);
                return true;
            }
            return false;
        };

        if (attemptInit()) return;

        let attempts = 0;
        const maxAttempts = 30;
        const interval = setInterval(() => {
            if (attemptInit() || ++attempts >= maxAttempts) {
                clearInterval(interval);
                if (attempts >= maxAttempts) {
                    console.warn(`⚠️ RCU Router init timeout for: ${pageName}`);
                }
            }
        }, 200);
    }

    getCurrentPage() {
        return this.currentPage;
    }

    isRCUPage(pageName) {
        return this.pageContainers.has(pageName);
    }

    getAllPages() {
        return Array.from(this.pageContainers.keys());
    }
}

// ========== GLOBAL INSTANCE ==========
const rcuRouter = new RCURouter();

// ========== EXPORTS ==========
Object.assign(window, {
    RCURouter,
    rcuRouter,
    switchToRCUPage: (page) => rcuRouter.switchToPage(page),
    isRCUPage: (page) => rcuRouter.isRCUPage(page),
    getCurrentRCUPage: () => rcuRouter.getCurrentPage()
});

console.log('✅ RCU Router initialized');
console.log('📍 Base path:', rcuRouter.basePath);
