// system/url.js - URL Routing System for SPA (Single Page Application)

class URLRoutingSystem {
    constructor() {
        this.baseURL = this.getBaseURL();
        this.routes = new Map();
        this.currentRoute = '/';
        this.isInitialized = false;
        
        console.log(`🌐 URL Routing System initialized with base: ${this.baseURL}`);
        
        // Налаштувати маршрути для всіх сторінок
        this.setupRoutes();
        
        // Слухач для подій навігації браузера (назад/вперед)
        this.setupNavigationListeners();
    }

    // Автоматично визначити базовий URL
    getBaseURL() {
        const protocol = window.location.protocol;
        const host = window.location.host;
        const pathname = window.location.pathname;
        
        // Для GitHub Pages та інших хостингів
        if (pathname.includes('/')) {
            // Якщо це підкаталог (як GitHub Pages), взяти базовий шлях
            const pathParts = pathname.split('/').filter(part => part.length > 0);
            if (pathParts.length > 0) {
                return `${protocol}//${host}/${pathParts[0]}/`;
            }
        }
        
        return `${protocol}//${host}/`;
    }

    // Налаштувати всі маршрути
    setupRoutes() {
        // Маппінг сторінок на URL шляхи
        const routeMapping = {
            'calculator': '/',                    // Головна сторінка
            'arm': '/arm_calculator/',
            'grind': '/grind_calculator/',
            'boosts': '/boosts_info/',
            'shiny': '/shiny_list/',
            'secret': '/secret_pets/',
            'codes': '/codes_list/',
            'aura': '/aura_info/',
            'trainer': '/trainer_info/',
            'charms': '/charms_info/',
            'potions': '/potions_food/',
            'worlds': '/worlds_info/',
            'settings': '/app_settings/',
            'help': '/help_guide/',
            'peoples': '/peoples_thanks/'
        };

        // Створити маршрути в обох напрямках
        Object.entries(routeMapping).forEach(([page, path]) => {
            this.routes.set(page, path);
            this.routes.set(path, page);
        });

        console.log('🗺️ Routes configured:', Object.fromEntries(
            Object.entries(routeMapping)
        ));
    }

    // Налаштувати слухачі навігації
    setupNavigationListeners() {
        // Слухати зміни в історії браузера (кнопки назад/вперед)
        window.addEventListener('popstate', (event) => {
            console.log('🔙 Browser navigation detected:', event.state);
            
            if (event.state && event.state.page) {
                this.handleBrowserNavigation(event.state.page);
            } else {
                // Якщо немає стану, спробувати визначити з URL
                const page = this.getPageFromCurrentURL();
                this.handleBrowserNavigation(page);
            }
        });

        // Слухати зміни сторінок в додатку
        document.addEventListener('pageChanged', (event) => {
            if (event.detail && event.detail.page) {
                this.updateURL(event.detail.page, event.detail.pushState !== false);
            }
        });

        console.log('👂 Navigation listeners configured');
    }

    // Ініціалізувати систему
    init() {
        if (this.isInitialized) {
            console.log('⚠️ URL Routing already initialized');
            return;
        }

        // Перевірити поточний URL і встановити відповідну сторінку
        const initialPage = this.getPageFromCurrentURL();
        
        if (initialPage && initialPage !== 'calculator') {
            console.log(`🎯 Initial page from URL: ${initialPage}`);
            
            // Затримка для того щоб додаток встиг завантажитися
            setTimeout(() => {
                if (typeof switchPage === 'function') {
                    switchPage(initialPage);
                    console.log(`✅ Switched to page from URL: ${initialPage}`);
                }
            }, 500);
        } else {
            // Встановити URL для головної сторінки
            this.updateURL('calculator', false); // false = не додавати в історію
        }

        this.isInitialized = true;
        console.log('✅ URL Routing System initialized');
    }

    // Визначити сторінку з поточного URL
    getPageFromCurrentURL() {
        const currentPath = window.location.pathname;
        const relativePath = currentPath.replace(this.baseURL.replace(window.location.origin, ''), '');
        
        // Додати слеш на початок якщо немає
        const normalizedPath = relativePath.startsWith('/') ? relativePath : '/' + relativePath;
        
        console.log(`🔍 Analyzing URL path: "${normalizedPath}"`);
        
        // Знайти відповідну сторінку
        for (const [path, page] of this.routes.entries()) {
            if (typeof path === 'string' && path.startsWith('/') && path === normalizedPath) {
                console.log(`✅ Found page for path "${normalizedPath}": ${page}`);
                return page;
            }
        }
        
        // Якщо шлях не знайдено, повернути головну сторінку
        console.log(`❓ No page found for path "${normalizedPath}", using calculator`);
        return 'calculator';
    }

    // Оновити URL для сторінки
    updateURL(page, pushState = true) {
        const path = this.routes.get(page);
        if (!path) {
            console.warn(`⚠️ No route found for page: ${page}`);
            return;
        }

        const newURL = this.baseURL.slice(0, -1) + path; // Прибрати останній слеш з baseURL
        const currentURL = window.location.href;

        if (newURL !== currentURL) {
            const stateData = {
                page: page,
                timestamp: Date.now()
            };

            if (pushState) {
                // Додати новий запис в історію
                window.history.pushState(stateData, '', newURL);
                console.log(`📍 URL updated (push): ${newURL}`);
            } else {
                // Замінити поточний запис в історії
                window.history.replaceState(stateData, '', newURL);
                console.log(`🔄 URL updated (replace): ${newURL}`);
            }

            this.currentRoute = path;

            // Оновити мета-теги для SEO
            this.updateMetaTags(page);
        }
    }

    // Обробити навігацію браузера
    handleBrowserNavigation(page) {
        console.log(`🔙 Handling browser navigation to: ${page}`);
        
        if (typeof switchPage === 'function') {
            // Переключити сторінку БЕЗ оновлення URL (щоб уникнути циклу)
            switchPage(page);
            
            // Оновити внутрішній стан
            const path = this.routes.get(page);
            if (path) {
                this.currentRoute = path;
            }
        }
    }

    // Оновити мета-теги для SEO
    updateMetaTags(page) {
        const pageInfo = this.getPageInfo(page);
        
        // Оновити title
        document.title = `${pageInfo.title} - Arm Helper`;
        
        // Оновити meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = pageInfo.description;

        // Оновити Open Graph теги
        this.updateOpenGraphTags(pageInfo);
        
        console.log(`🏷️ Meta tags updated for: ${page}`);
    }

    // Отримати інформацію про сторінку
    getPageInfo(page) {
        const pageData = {
            'calculator': {
                title: '🐾 Pet Calculator',
                description: 'Calculate pet upgrades and evolution costs in Pet Simulator 99'
            },
            'arm': {
                title: '💪 Arm Calculator', 
                description: 'Calculate arm strength upgrades and costs'
            },
            'grind': {
                title: '🏋️‍♂️ Grind Calculator',
                description: 'Calculate grinding efficiency and rewards'
            },
            'boosts': {
                title: '🚀 Boosts Information',
                description: 'Complete guide to all boosts and their effects'
            },
            'shiny': {
                title: '✨ Shiny Pet Statistics',
                description: 'Complete list of shiny pets and their stats'
            },
            'secret': {
                title: '🔮 Secret Pets Guide',
                description: 'Discover all secret pets and how to get them'
            },
            'codes': {
                title: '🎁 Active Codes',
                description: 'Latest working codes for Pet Simulator 99 rewards'
            },
            'aura': {
                title: '🌟 Aura Information',
                description: 'Complete guide to auras and their effects'
            },
            'trainer': {
                title: '🏆 Trainer Guide',
                description: 'Pet training tips and strategies'
            },
            'charms': {
                title: '🔮 Charms Guide',
                description: 'All charms and their magical effects'
            },
            'potions': {
                title: '🧪 Potions & Food Guide',
                description: 'Complete guide to potions and food effects'
            },
            'worlds': {
                title: '🌍 Worlds Guide',
                description: 'Explore all worlds and their unique features'
            },
            'settings': {
                title: '⚙️ Settings',
                description: 'Customize your Arm Helper experience'
            },
            'help': {
                title: '🆘 Help Guide',
                description: 'Get help and learn how to use Arm Helper'
            },
            'peoples': {
                title: '🙏 Thanks & Credits',
                description: 'Special thanks to our community and contributors'
            }
        };

        return pageData[page] || {
            title: 'Arm Helper',
            description: 'Ultimate helper tool for Pet Simulator 99'
        };
    }

    // Оновити Open Graph теги
    updateOpenGraphTags(pageInfo) {
        const ogTags = [
            { property: 'og:title', content: `${pageInfo.title} - Arm Helper` },
            { property: 'og:description', content: pageInfo.description },
            { property: 'og:url', content: window.location.href },
            { property: 'og:type', content: 'website' }
        ];

        ogTags.forEach(tag => {
            let element = document.querySelector(`meta[property="${tag.property}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('property', tag.property);
                document.head.appendChild(element);
            }
            element.content = tag.content;
        });
    }

    // Отримати поточний маршрут
    getCurrentRoute() {
        return this.currentRoute;
    }

    // Отримати URL для сторінки
    getURLForPage(page) {
        const path = this.routes.get(page);
        return path ? this.baseURL.slice(0, -1) + path : this.baseURL;
    }

    // Перейти до сторінки програмно
    navigateToPage(page, pushState = true) {
        console.log(`🧭 Programmatic navigation to: ${page}`);
        
        if (typeof switchPage === 'function') {
            switchPage(page);
        }
        
        this.updateURL(page, pushState);
    }

    // Отримати всі доступні маршрути
    getAllRoutes() {
        const routes = {};
        for (const [key, value] of this.routes.entries()) {
            if (typeof key === 'string' && !key.startsWith('/')) {
                routes[key] = this.getURLForPage(key);
            }
        }
        return routes;
    }

    // Перевірити чи URL валідний
    isValidRoute(path) {
        return this.routes.has(path);
    }

    // Отримати статус системи
    getStatus() {
        return {
            initialized: this.isInitialized,
            baseURL: this.baseURL,
            currentRoute: this.currentRoute,
            currentPage: this.routes.get(this.currentRoute) || 'unknown',
            totalRoutes: this.routes.size / 2, // Ділимо на 2 бо кожен маршрут зберігається в обох напрямках
            currentURL: window.location.href
        };
    }
}

// Глобальний екземпляр системи
let urlRoutingSystem = null;

// Ініціалізація URL routing системи
function initURLRouting() {
    if (urlRoutingSystem) {
        console.log('⚠️ URL Routing System already initialized');
        return urlRoutingSystem;
    }

    urlRoutingSystem = new URLRoutingSystem();
    
    // Ініціалізувати після завантаження додатку
    setTimeout(() => {
        urlRoutingSystem.init();
    }, 1000);

    return urlRoutingSystem;
}

// Інтеграція з існуючою системою переключення сторінок
function enhanceSwitchPage() {
    // Зберегти оригінальну функцію
    const originalSwitchPage = window.switchPage;
    
    if (typeof originalSwitchPage === 'function') {
        // Розширити функцію switchPage
        window.switchPage = function(page) {
            console.log(`🔀 Enhanced switchPage called for: ${page}`);
            
            // Викликати оригінальну функцію
            const result = originalSwitchPage.call(this, page);
            
            // Оновити URL
            if (urlRoutingSystem) {
                urlRoutingSystem.updateURL(page, true);
            }
            
            // Відправити подію про зміну сторінки
            document.dispatchEvent(new CustomEvent('pageChanged', {
                detail: { page: page, timestamp: Date.now() }
            }));
            
            return result;
        };
        
        console.log('✅ switchPage function enhanced with URL routing');
    } else {
        console.warn('⚠️ Original switchPage function not found');
    }
}

// Функції для зовнішнього використання
function navigateToPage(page) {
    if (urlRoutingSystem) {
        urlRoutingSystem.navigateToPage(page);
    } else {
        console.warn('⚠️ URL Routing System not initialized');
    }
}

function getCurrentRoute() {
    return urlRoutingSystem ? urlRoutingSystem.getCurrentRoute() : '/';
}

function getCurrentPage() {
    if (urlRoutingSystem) {
        const route = urlRoutingSystem.getCurrentRoute();
        return urlRoutingSystem.routes.get(route) || 'calculator';
    }
    return 'calculator';
}

function getURLForPage(page) {
    return urlRoutingSystem ? urlRoutingSystem.getURLForPage(page) : window.location.origin;
}

function getAllRoutes() {
    return urlRoutingSystem ? urlRoutingSystem.getAllRoutes() : {};
}

function getURLRoutingStatus() {
    return urlRoutingSystem ? urlRoutingSystem.getStatus() : { initialized: false };
}

// Автоініціалізація
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            initURLRouting();
            setTimeout(enhanceSwitchPage, 500);
        }, 1500);
    });
} else {
    setTimeout(() => {
        initURLRouting();
        setTimeout(enhanceSwitchPage, 500);
    }, 1500);
}

// Експорт для глобального доступу
if (typeof window !== 'undefined') {
    window.initURLRouting = initURLRouting;
    window.navigateToPage = navigateToPage;
    window.getCurrentRoute = getCurrentRoute;
    window.getURLForPage = getURLForPage;
    window.getAllRoutes = getAllRoutes;
    window.getURLRoutingStatus = getURLRoutingStatus;
    window.enhanceSwitchPage = enhanceSwitchPage;
    window.urlRoutingSystem = urlRoutingSystem;
}

console.log('🌐 URL Routing System loaded and ready');

// Debug інформація
console.log(`
🔧 URL Routing Commands:

Basic usage:
- getURLRoutingStatus() - check system status
- getAllRoutes() - see all available routes
- navigateToPage('shiny') - go to specific page
- getURLForPage('secret') - get URL for page

Example URLs that will be generated:
- Calculator: ${window.location.origin}/
- Shiny List: ${window.location.origin}/shiny_list/
- Secret Pets: ${window.location.origin}/secret_pets/
- Settings: ${window.location.origin}/app_settings/
`);
