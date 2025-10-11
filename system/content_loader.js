// ========== CONTENT LOADER (AWS + RCU + System Separate) ==========

async function loadContent() {
    try {
        const baseTag = document.querySelector('base');
        const basePath = baseTag ? new URL(baseTag.href).pathname : '';
        
        // Load AWS content
        const awsContentURL = basePath ? `${basePath}AWS/system/content.html` : 'AWS/system/content.html';
        console.log('📦 Loading AWS content from:', awsContentURL);
        
        const awsResponse = await fetch(awsContentURL);
        if (!awsResponse.ok) throw new Error(`HTTP ${awsResponse.status}`);
        const awsHTML = await awsResponse.text();
        
        // Load RCU content
        const rcuContentURL = basePath ? `${basePath}RCU/system/RCU_content.html` : 'RCU/system/content.html';
        console.log('📦 Loading RCU content from:', rcuContentURL);
        
        const rcuResponse = await fetch(rcuContentURL);
        if (!rcuResponse.ok) throw new Error(`HTTP ${rcuResponse.status}`);
        const rcuHTML = await rcuResponse.text();
        
        // Load System content
        const systemContentURL = basePath ? `${basePath}system/system_content/system_content.html` : 'system/system_content/system_content.html';
        console.log('📦 Loading System content from:', systemContentURL);
        
        const systemResponse = await fetch(systemContentURL);
        if (!systemResponse.ok) throw new Error(`HTTP ${systemResponse.status}`);
        const systemHTML = await systemResponse.text();
        
        // Combine content (AWS + RCU + System)
        const combinedContent = awsHTML + '\n' + rcuHTML + '\n' + systemHTML;
        
        const appContent = document.getElementById('app-content');
        if (!appContent) {
            console.error('❌ app-content not found');
            return;
        }

        appContent.innerHTML = createAppStructure(combinedContent);
        console.log('✅ Content structure created (AWS + RCU + System)');

        ensureMobileMenuButton();

        setTimeout(() => {
            if (typeof window.initializeApp === 'function') {
                window.initializeApp();
            } else if (typeof window.updateMenuTranslations === 'function') {
                window.updateMenuTranslations();
                window.updatePageTitles?.();
            }
        }, 0);
        
        initializeSignatureEasterEgg();
        document.dispatchEvent(new CustomEvent('contentLoaded'));
        waitForAuthUI();
        
        console.log('✅ Content loaded (AWS + RCU + System)');
        
    } catch (error) {
        console.error('❌ Error loading content:', error);
        document.dispatchEvent(new CustomEvent('contentLoadError', { detail: error }));
    }
}

function createAppStructure(contentHTML) {
    return `
        <div class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <h3></h3>
                <button class="close-sidebar" onclick="closeSidebar()">×</button>
            </div>
            <div class="nav-buttons">
                ${createMainCategory('awsCategory', '📦', [
                    { id: 'calculatorButtons', icon: '🧮', pages: ['calculator', 'arm', 'grind', 'roulette', 'boss'] },
                    { id: 'infoButtons', icon: '📋', pages: ['boosts', 'shiny', 'secret', 'codes', 'aura', 'trainer', 'charms', 'potions', 'worlds'] },
                    { id: 'othersAWSButtons', icon: '🔧', pages: ['trader', 'clans'] }
                ])}

                ${createMainCategory('rcuCategory', '🎮', [
                    { id: 'rcuCalculatorButtons', icon: '🧮', pages: ['petscalc'] }
                ])}

                ${createMainCategoryDirect('systemCategory', '⚙️', ['settings', 'profile', 'help', 'peoples'])}
            </div>
            
            <div class="sidebar-user" id="sidebarUser">
                <button class="settings-btn-sidebar" onclick="switchPage('settings')" title="Settings">⚙️</button>
                <button class="auth-btn-sidebar" id="authButton">⏳ Loading...</button>
            </div>
        </div>

        <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
           
        <div class="container">${contentHTML}</div>
    `;
}

function ensureMobileMenuButton() {
    const oldButton = document.querySelector('.mobile-menu-toggle');
    if (oldButton) oldButton.remove();

    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-toggle';
    menuButton.onclick = toggleMobileMenu;
    menuButton.textContent = '☰';

    const appContent = document.getElementById('app-content');
    const header = document.querySelector('header');
    
    if (header) {
        header.after(menuButton);
    } else {
        appContent.before(menuButton);
    }

    console.log('✅ Mobile menu button ensured');
}

function createMainCategory(id, icon, subcategories) {
    return `
        <div class="main-category">
            <div class="main-category-header" data-main-category="${id}" onclick="toggleMainCategory('${id}')">
                <div class="main-category-title">
                    <span class="main-category-icon">${icon}</span>
                    <span></span>
                </div>
                <span class="main-category-toggle">▼</span>
            </div>
            <div class="main-category-content" id="${id}">
                ${subcategories.map(sub => createNavCategory(sub.id, sub.icon, sub.pages)).join('')}
            </div>
        </div>
    `;
}

function createMainCategoryDirect(id, icon, pages) {
    return `
        <div class="main-category">
            <div class="main-category-header" data-main-category="${id}" onclick="toggleMainCategory('${id}')">
                <div class="main-category-title">
                    <span class="main-category-icon">${icon}</span>
                    <span></span>
                </div>
                <span class="main-category-toggle">▼</span>
            </div>
            <div class="main-category-content main-category-direct" id="${id}">
                ${pages.map(page => 
                    `<button class="nav-btn" data-page="${page}" onclick="switchPage('${page}')"></button>`
                ).join('')}
            </div>
        </div>
    `;
}

function createNavCategory(id, icon, pages) {
    return `
        <div class="nav-category">
            <div class="category-header" data-category="${id}" onclick="toggleCategory('${id}')">
                <div class="category-title">
                    <span class="category-icon">${icon}</span>
                    <span></span>
                </div>
                <span class="category-toggle">▼</span>
            </div>
            <div class="category-buttons" id="${id}">
                ${pages.map(page => 
                    `<button class="nav-btn" data-page="${page}" onclick="switchPage('${page}')"></button>`
                ).join('')}
            </div>
        </div>
    `;
}

// ========== CATEGORY MANAGEMENT ==========

function toggleMainCategory(mainCategoryId) {
    const mainContent = document.getElementById(mainCategoryId);
    const toggleIcon = document.querySelector(`[data-main-category="${mainCategoryId}"] .main-category-toggle`);
    
    if (mainContent && toggleIcon) {
        const isExpanded = mainContent.classList.contains('expanded');
        
        if (!isExpanded) {
            document.querySelectorAll('.main-category-content').forEach(el => {
                if (el !== mainContent) el.classList.remove('expanded');
            });
            document.querySelectorAll('.main-category-toggle').forEach(el => {
                if (el !== toggleIcon) el.classList.remove('expanded');
            });
            
            mainContent.classList.add('expanded');
            toggleIcon.classList.add('expanded');
            
            if (!mainContent.classList.contains('main-category-direct')) {
                const firstSubcategory = mainContent.querySelector('.category-buttons');
                const firstToggle = mainContent.querySelector('.category-toggle');
                if (firstSubcategory && firstToggle) {
                    firstSubcategory.classList.add('expanded');
                    firstToggle.classList.add('expanded');
                }
            }
        } else {
            mainContent.classList.remove('expanded');
            toggleIcon.classList.remove('expanded');
        }
    }
}

function toggleCategory(categoryId) {
    const categoryButtons = document.getElementById(categoryId);
    const toggleIcon = document.querySelector(`[data-category="${categoryId}"] .category-toggle`);
    
    if (categoryButtons && toggleIcon) {
        const isExpanded = categoryButtons.classList.contains('expanded');
        
        if (!isExpanded) {
            const parentMainCategory = categoryButtons.closest('.main-category-content');
            if (parentMainCategory) {
                parentMainCategory.querySelectorAll('.category-buttons').forEach(el => {
                    if (el !== categoryButtons) el.classList.remove('expanded');
                });
                parentMainCategory.querySelectorAll('.category-toggle').forEach(el => {
                    if (el !== toggleIcon) el.classList.remove('expanded');
                });
            }
            
            categoryButtons.classList.add('expanded');
            toggleIcon.classList.add('expanded');
        } else {
            categoryButtons.classList.remove('expanded');
            toggleIcon.classList.remove('expanded');
        }
    }
}

// ========== AUTO-OPEN CATEGORIES BY PAGE ==========

function openCategoryForPage(page) {
    console.log('📂 Opening category for page:', page);
    
    const categoryMap = {
        'calculator': ['awsCategory', 'calculatorButtons'],
        'arm': ['awsCategory', 'calculatorButtons'],
        'grind': ['awsCategory', 'calculatorButtons'],
        'roulette': ['awsCategory', 'calculatorButtons'],
        'boss': ['awsCategory', 'calculatorButtons'],
        'boosts': ['awsCategory', 'infoButtons'],
        'shiny': ['awsCategory', 'infoButtons'],
        'secret': ['awsCategory', 'infoButtons'],
        'codes': ['awsCategory', 'infoButtons'],
        'aura': ['awsCategory', 'infoButtons'],
        'trainer': ['awsCategory', 'infoButtons'],
        'charms': ['awsCategory', 'infoButtons'],
        'potions': ['awsCategory', 'infoButtons'],
        'worlds': ['awsCategory', 'infoButtons'],
        'trader': ['awsCategory', 'othersAWSButtons'],
        'clans': ['awsCategory', 'othersAWSButtons'],
        'petscalc': ['rcuCategory', 'rcuCalculatorButtons'],
        'settings': ['systemCategory', null],
        'profile': ['systemCategory', null],
        'help': ['systemCategory', null],
        'peoples': ['systemCategory', null]
    };
    
    const categories = categoryMap[page];
    if (!categories) {
        console.warn('⚠️ No category mapping for page:', page);
        return;
    }
    
    const [mainCategoryId, subCategoryId] = categories;
    
    document.querySelectorAll('.main-category-content').forEach(el => {
        el.classList.remove('expanded');
    });
    document.querySelectorAll('.main-category-toggle').forEach(el => {
        el.classList.remove('expanded');
    });
    document.querySelectorAll('.category-buttons').forEach(el => {
        el.classList.remove('expanded');
    });
    document.querySelectorAll('.category-toggle').forEach(el => {
        el.classList.remove('expanded');
    });
    
    const mainContent = document.getElementById(mainCategoryId);
    const mainToggle = document.querySelector(`[data-main-category="${mainCategoryId}"] .main-category-toggle`);
    
    if (mainContent && mainToggle) {
        mainContent.classList.add('expanded');
        mainToggle.classList.add('expanded');
        console.log('✅ Opened main category:', mainCategoryId);
    }
    
    if (subCategoryId) {
        const subContent = document.getElementById(subCategoryId);
        const subToggle = document.querySelector(`[data-category="${subCategoryId}"] .category-toggle`);
        
        if (subContent && subToggle) {
            subContent.classList.add('expanded');
            subToggle.classList.add('expanded');
            console.log('✅ Opened subcategory:', subCategoryId);
        }
    }
}

// ========== AUTH BUTTON ==========

function waitForAuthUI() {
    let attempts = 0;
    const maxAttempts = 50;
    
    const interval = setInterval(() => {
        attempts++;
        
        if (window.authUI?.openModal) {
            console.log('✅ Auth UI ready');
            clearInterval(interval);
            setupAuthButton();
            return;
        }
        
        if (window.firebaseManager?.isInitialized && typeof initializeAuthUI === 'function') {
            console.log('🔐 Initializing Auth UI');
            initializeAuthUI();
        }
        
        if (attempts >= maxAttempts) {
            console.warn('⚠️ Auth UI timeout');
            clearInterval(interval);
            setupAuthButtonFallback();
        }
    }, 100);
}

function setupAuthButton() {
    const authButton = document.getElementById('authButton');
    if (!authButton) {
        console.error('❌ Auth button not found');
        return;
    }
    
    const newButton = authButton.cloneNode(true);
    authButton.parentNode.replaceChild(newButton, authButton);
    
    newButton.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        if (!window.firebaseManager?.isInitialized) {
            alert('Система авторизації ініціалізується.\nЗачекайте і спробуйте знову.');
            return;
        }
        
        const user = window.firebaseManager.getCurrentUser();
        
        if (user) {
            typeof switchPage === 'function' && switchPage('profile');
        } else {
            if (window.urlRouter) {
                const r = window.urlRouter();
                r?.setQueryParams?.({ auth: 'signin' }, true);
            }

            if (window.authUI?.openModal) {
                window.authUI.openModal('signin');
            } else {
                alert('UI авторизації не завантажений.\nОновіть сторінку.');
            }
        }
    });
    
    updateAuthButtonText();
    console.log('✅ Auth button configured');
}

function setupAuthButtonFallback() {
    const authButton = document.getElementById('authButton');
    if (!authButton) return;
    
    authButton.textContent = '🔐 Login';
    authButton.classList.remove('disabled');
    
    authButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        alert('Система авторизації не завантажена.\n\nОновіть сторінку.');
    });
}

function updateAuthButtonText() {
    const authButton = document.getElementById('authButton');
    if (!authButton) return;
    
    const lang = (typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : null) || 'en';
    
    if (window.firebaseManager?.isInitialized) {
        const user = window.firebaseManager.getCurrentUser();
        
        if (user) {
            authButton.textContent = `👤 ${user.displayName || 'User'}`;
            authButton.title = lang === 'uk' ? 'Переглянути профіль' : 'View profile';
            authButton.classList.remove('disabled');
        } else {
            const texts = { en: '🔐 Login', uk: '🔐 Увійти', ru: '🔐 Войти' };
            authButton.textContent = texts[lang] || '🔐 Login';
            authButton.title = lang === 'uk' ? 'Увійдіть для синхронізації' : 'Login to sync data';
            authButton.classList.remove('disabled');
        }
    } else {
        const texts = { en: '⏳ Loading...', uk: '⏳ Завантаження...', ru: '⏳ Загрузка...' };
        authButton.textContent = texts[lang] || '⏳ Loading...';
        authButton.classList.add('disabled');
    }
}

// ========== EASTER EGG ==========

function initializeSignatureEasterEgg() {
    const signature = document.querySelector('.signature');
    if (!signature) {
        setTimeout(initializeSignatureEasterEgg, 500);
        return;
    }
    
    let clickCount = 0;
    let clickTimer = null;
    
    signature.addEventListener('click', function() {
        clickCount++;
        
        if (clickCount === 1) {
            clickTimer = setTimeout(() => clickCount = 0, 300);
        } else if (clickCount === 2) {
            clearTimeout(clickTimer);
            clickCount = 0;
            
            const hasBg = document.body.style.backgroundImage.includes('megadep.png');
            
            if (hasBg) {
                document.body.style.backgroundImage = '';
                document.body.style.backgroundSize = '';
                document.body.style.backgroundPosition = '';
                document.body.style.backgroundRepeat = '';
                document.body.style.backgroundAttachment = '';
            } else {
                const baseTag = document.querySelector('base');
                const basePath = baseTag ? new URL(baseTag.href).pathname : '';
                const bgPath = basePath ? `${basePath}AWS/image/bg/megadep.png` : 'AWS/image/bg/megadep.png';
                
                Object.assign(document.body.style, {
                    backgroundImage: `url(${bgPath})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed'
                });
                console.log('🎨 Megadep background activated! 🎉');
            }
        }
    });
    
    signature.style.cursor = 'pointer';
    signature.title = 'Double click me! 😉';
    
    console.log('✅ Easter egg initialized');
}

// ========== EVENT LISTENERS ==========

document.addEventListener('languageChanged', () => {
    console.log('🌍 Language changed');
    updateAuthButtonText();
});

document.addEventListener('DOMContentLoaded', () => {
    let checkCount = 0;
    const interval = setInterval(() => {
        checkCount++;
        
        if (window.firebaseManager?.isInitialized) {
            console.log('✅ Firebase ready');
            clearInterval(interval);
            
            if (window.firebaseManager.addEventListener) {
                window.firebaseManager.addEventListener('authChanged', (user) => {
                    console.log('🔄 Auth changed:', user ? user.displayName : 'signed out');
                    updateAuthButtonText();
                });
            }
            
            updateAuthButtonText();
        } else if (checkCount >= 100) {
            console.warn('⚠️ Firebase timeout');
            clearInterval(interval);
            updateAuthButtonText();
        }
    }, 100);
});

// ========== PAGE CHANGE OBSERVER ==========

document.addEventListener('pageChanged', (e) => {
    if (e.detail && e.detail.page) {
        setTimeout(() => {
            openCategoryForPage(e.detail.page);
        }, 100);
    }
});

// ========== PAGE SWITCH OBSERVER ==========

const observeAppContent = () => {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;

    const observer = new MutationObserver((mutations) => {
        const menuButton = document.querySelector('.mobile-menu-toggle');
        if (!menuButton) {
            console.warn('⚠️ Mobile menu button missing, restoring...');
            ensureMobileMenuButton();
        }
    });

    observer.observe(appContent, {
        childList: true,
        subtree: false
    });

    console.log('✅ App content observer started');
};

// ========== INITIALIZATION ==========

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadContent();
        setTimeout(observeAppContent, 1000);
    });
} else {
    loadContent();
    setTimeout(observeAppContent, 1000);
}

// Exports
Object.assign(window, { 
    updateAuthButtonText, 
    setupAuthButton,
    ensureMobileMenuButton,
    toggleMainCategory,
    toggleCategory,
    openCategoryForPage
});

console.log('✅ Content Loader ready (AWS + RCU + System Separate)');
