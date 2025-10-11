// ========== AWS ROUTER (System Pages Removed) ==========

class AWSRouter {
    constructor() {
        this.currentPage = null;
        this.pageContainers = new Map();
        this.initFunctions = new Map();
        this.basePath = this.getBasePath();
        this.initializePageMapping();
        console.log('📁 AWS Router Base Path:', this.basePath);
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

    initializePageMapping() {
        // ONLY AWS pages (removed help, peoples)
        const pages = [
            'calculator', 'arm', 'grind', 'roulette', 'boss',
            'boosts', 'shiny', 'secret', 'codes', 'aura', 'trainer', 'charms', 'potions', 'worlds',
            'trader', 'clans'
        ];

        pages.forEach(page => this.pageContainers.set(page, `${page}Page`));

        const initMap = {
            calculator: 'initializePetCalculator',
            arm: 'initializeArm',
            grind: 'initializeGrind',
            roulette: 'initializeRoulette',
            boss: 'initializeBoss',
            boosts: 'initializeBoosts',
            shiny: 'initializeShiny',
            secret: 'initializeSecret',
            codes: 'initializeCodes',
            aura: 'initializeAura',
            trainer: 'initializeTrainer',
            charms: 'initializeCharms',
            potions: 'initializePotions',
            worlds: 'initializeWorlds',
            trader: 'initializeTrader',
            clans: 'initializeClans'
        };

        Object.entries(initMap).forEach(([page, func]) => {
            this.initFunctions.set(page, func);
        });

        console.log('✅ AWS Router: Page mapping initialized (System pages removed)');
    }

    async switchToPage(pageName) {
        console.log(`🔄 AWS Router switching to: ${pageName}`);

        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        const containerId = this.pageContainers.get(pageName);
        if (!containerId) {
            console.warn(`⚠️ Unknown AWS page: ${pageName}`);
            return false;
        }

        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`⚠️ AWS Container not found: ${containerId}`);
            return false;
        }

        container.classList.add('active');
        this.currentPage = pageName;

        if (window.awsLoader) {
            await window.awsLoader.loadModule(pageName);
        }
        
        this.initializePageContent(pageName);
        
        console.log(`✅ AWS Router switched to: ${pageName}`);
        return true;
    }

    initializePageContent(pageName) {
        const containerId = this.pageContainers.get(pageName);
        const container = containerId ? document.getElementById(containerId) : null;
        const initFunc = this.initFunctions.get(pageName);

        if (!container || !initFunc) return;

        const needsReset = ['grind', 'roulette', 'boss', 'secret', 'potions', 'trader', 'clans'];
        if (needsReset.includes(pageName)) {
            window[`${pageName}Initialized`] = false;
        }

        const attemptInit = () => {
            if (typeof window[initFunc] === 'function') {
                console.log(`📦 AWS Router initializing: ${pageName}`);
                
                const needsDelay = ['secret', 'potions', 'grind', 'worlds', 'roulette', 'boss', 'trader', 'clans'];
                
                if (needsDelay.includes(pageName)) {
                    setTimeout(() => window[initFunc](), 100);
                } else {
                    window[initFunc]();
                }
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
                    console.warn(`⚠️ AWS Router init timeout for: ${pageName}`);
                }
            }
        }, 200);
    }

    getCurrentPage() {
        return this.currentPage;
    }

    isAWSPage(pageName) {
        return this.pageContainers.has(pageName);
    }

    getAllPages() {
        return Array.from(this.pageContainers.keys());
    }
}

// ========== GLOBAL INSTANCE ==========
const awsRouter = new AWSRouter();

// ========== EXPORTS ==========
Object.assign(window, {
    AWSRouter,
    awsRouter,
    switchToAWSPage: (page) => awsRouter.switchToPage(page),
    isAWSPage: (page) => awsRouter.isAWSPage(page),
    getCurrentAWSPage: () => awsRouter.getCurrentPage()
});

console.log('✅ AWS Router initialized (System pages removed)');
console.log('📍 Base path:', awsRouter.basePath);
