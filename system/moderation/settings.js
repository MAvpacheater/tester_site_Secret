// Settings з підтримкою кольорів та мов
let settingsInitialized = false;
let settingsTranslations = null;
let categoriesState = { background: false, menu: false, colors: false, language: false };

// ========== BASE PATH ==========
function getSettingsBasePath() {
    const { protocol, host, pathname } = window.location;
    
    if (host === 'mavpacheater.github.io') {
        return `${protocol}//${host}/tester_site_Secret/`;
    }
    
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
        const pathParts = pathname.split('/').filter(Boolean);
        if (pathParts.length > 0 && pathParts[0] !== 'AWS') {
            return `${protocol}//${host}/${pathParts[0]}/`;
        }
        return `${protocol}//${host}/`;
    }
    
    return '/';
}

const SETTINGS_BASE_PATH = getSettingsBasePath();

// ========== GITHUB CONFIG ==========
const GITHUB_CONFIG = {
    user: 'MAvpacheater',
    repo: 'tester_site_Secret',
    branch: 'main',
    imagePath: 'image/bg/'
};

// ========== BACKGROUND OPTIONS ==========
const backgroundOptions = {
    dodep: { icon: '🕸️', filename: 'h1.png' },
    game: { icon: '🎃', filename: 'h2.png' },
    code: { icon: '👻', filename: 'h3.png' },
    prison: { icon: '🦇', filename: 'h4.png' },
    forest: { icon: '🌲', filename: 'h5.png' },
    space: { icon: '🌌', filename: 'h6.png' },
    ocean: { icon: '🌊', filename: 'h7.png' },
    desert: { icon: '🏜️', filename: 'h8.png' },
    castle: { icon: '🏰', filename: 'h9.png' }
};

// Генеруємо URL для всіх фонів (як в content_loader.js)
Object.keys(backgroundOptions).forEach(key => {
    const bg = backgroundOptions[key];
    // Використовуємо той самий формат що і для megadep.png
    bg.url = `AWS/image/bg/${bg.filename}`;
});

const menuPositions = {
    left: { icon: '⬅️' },
    right: { icon: '➡️' },
    up: { icon: '⬆️' },
    down: { icon: '⬇️' }
};

const menuItems = [
    { page: 'calculator', icon: '🐾' },
    { page: 'arm', icon: '💪' },
    { page: 'grind', icon: '🏋️‍♂️' },
    { page: 'roulette', icon: '🎰' },
    { page: 'boss', icon: '👹' },
    { page: 'boosts', icon: '🚀' },
    { page: 'shiny', icon: '✨' },
    { page: 'secret', icon: '🔮' },
    { page: 'codes', icon: '🎁' },
    { page: 'aura', icon: '🌟' },
    { page: 'trainer', icon: '🏆' },
    { page: 'charms', icon: '🔮' },
    { page: 'potions', icon: '🧪' },
    { page: 'worlds', icon: '🌍' },
    { page: 'trader', icon: '🛒' },
    { page: 'help', icon: '🆘' },
    { page: 'peoples', icon: '🙏' },
    { page: 'clans', icon: '🏰' },
    { page: 'profile', icon: '👤' }
];

const languageOptions = {
    en: { icon: '🇺🇸', name: { en: 'English', uk: 'Англійська', ru: 'Английский' } },
    uk: { icon: '🇺🇦', name: { en: 'Ukrainian', uk: 'Українська', ru: 'Украинский' } },
    ru: { icon: '🇷🇺', name: { en: 'Russian', uk: 'Російська', ru: 'Русский' } }
};

// ========== IMAGE PRELOADER ==========
function preloadBackgroundImage(background) {
    return new Promise((resolve) => {
        const config = backgroundOptions[background];
        if (!config) {
            resolve(false);
            return;
        }
        
        const img = new Image();
        
        img.onload = () => {
            console.log(`✅ Background loaded: ${background}`);
            resolve(config.url);
        };
        
        img.onerror = () => {
            console.error(`❌ Failed to load background: ${background}`);
            resolve(false);
        };
        
        img.src = config.url;
    });
}

// ========== MENU BUTTON ==========
function createMenuButton() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    if (!menuToggle) return;
    
    menuToggle.innerHTML = '';
    const positions = [-4, 0, 4];
    
    positions.forEach((pos) => {
        const line = document.createElement('div');
        line.className = 'menu-line';
        line.style.transform = `translate(-50%, -50%) translateY(${pos}px)`;
        menuToggle.appendChild(line);
    });
}

function updateMenuButtonVisibility() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (!menuToggle || !sidebar) return;
    
    menuToggle.classList.toggle('menu-open', sidebar.classList.contains('open'));
}

// ========== MENU MANAGER ==========
class MenuManager {
    constructor() {
        this.currentMenuType = null;
    }

    clearAllMenus() {
        const existingMenu = document.getElementById('staticMenu');
        if (existingMenu) existingMenu.remove();
        
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        
        updateMenuButtonVisibility();
        
        ['left', 'right', 'up', 'down'].forEach(pos => {
            document.body.classList.remove(`menu-${pos}`);
        });
    }

    showOnlyMenu(menuType) {
        this.clearAllMenus();
        document.body.classList.add(`menu-${menuType}`);
        
        if (menuType === 'left' || menuType === 'right') {
            this.setupSidebarMenu(menuType);
        } else {
            this.createStaticMenu(menuType);
        }
        
        this.currentMenuType = menuType;
    }

    setupSidebarMenu(position) {
        const sidebar = document.getElementById('sidebar');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (sidebar) {
            sidebar.style.left = position === 'right' ? 'auto' : '-320px';
            sidebar.style.right = position === 'right' ? '-320px' : 'auto';
        }
        
        if (mobileToggle) {
            mobileToggle.style.left = position === 'right' ? 'auto' : '20px';
            mobileToggle.style.right = position === 'right' ? '20px' : 'auto';
            setTimeout(createMenuButton, 10);
        }
    }

    createStaticMenu(position) {
        const menuClass = position === 'up' ? 'menu-top' : 'menu-bottom';
        const fragment = document.createDocumentFragment();
        
        const staticMenu = document.createElement('div');
        staticMenu.className = `static-menu ${menuClass}`;
        staticMenu.id = 'staticMenu';
        
        const navButtons = document.createElement('div');
        navButtons.className = 'nav-buttons';
        
        menuItems.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'nav-btn';
            btn.dataset.page = item.page;
            btn.textContent = item.icon;
            btn.onclick = () => this.handleNavClick(item.page);
            navButtons.appendChild(btn);
        });
        
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'nav-btn settings-btn-static';
        settingsBtn.textContent = '⚙️';
        settingsBtn.onclick = () => this.handleNavClick('settings');
        
        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'settings-container-static';
        settingsContainer.appendChild(settingsBtn);
        
        staticMenu.appendChild(navButtons);
        staticMenu.appendChild(settingsContainer);
        fragment.appendChild(staticMenu);
        document.body.appendChild(fragment);
        
        const currentPage = typeof window.getCurrentPage === 'function' ? window.getCurrentPage() : 'calculator';
        this.updateActiveState(currentPage);
    }

    handleNavClick(page) {
        if (typeof window.switchPage === 'function') {
            window.switchPage(page);
        }
        this.updateActiveState(page);
    }

    updateActiveState(activePage) {
        const staticMenu = document.getElementById('staticMenu');
        if (!staticMenu) return;
        
        const buttons = staticMenu.querySelectorAll('.nav-btn');
        buttons.forEach(btn => {
            const isActive = btn.dataset.page === activePage || 
                           (activePage === 'settings' && btn.classList.contains('settings-btn-static'));
            btn.classList.toggle('active', isActive);
        });
    }
}

const menuManager = new MenuManager();

function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
        updateMenuButtonVisibility();
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        updateMenuButtonVisibility();
    }
}

// ========== BACKGROUNDS ==========
async function applyBackground(background) {
    const config = backgroundOptions[background];
    if (!config) {
        console.warn(`⚠️ Unknown background: ${background}`);
        return;
    }
    
    // Передзавантажуємо зображення
    const imageUrl = await preloadBackgroundImage(background);
    
    if (imageUrl) {
        const body = document.body;
        body.style.background = `linear-gradient(135deg, rgba(41, 39, 35, 0.4) 0%, rgba(28, 26, 23, 0.6) 50%, rgba(20, 19, 17, 0.8) 100%), url('${imageUrl}') center center / cover no-repeat`;
        body.style.backgroundAttachment = 'scroll';
        console.log(`🎃 Background applied: ${background}`);
    } else {
        console.error(`❌ Failed to apply background: ${background}`);
        // Застосуємо градієнт без зображення
        const body = document.body;
        body.style.background = `linear-gradient(135deg, rgba(41, 39, 35, 0.9) 0%, rgba(28, 26, 23, 0.95) 50%, rgba(20, 19, 17, 1) 100%)`;
    }
}

// ========== CATEGORIES STATE ==========
function toggleSettingsCategory(categoryName) {
    if (!categoriesState.hasOwnProperty(categoryName)) return;
    
    const wasOpen = categoriesState[categoryName];
    
    // Закриваємо всі категорії
    Object.keys(categoriesState).forEach(cat => {
        categoriesState[cat] = false;
        
        const header = document.querySelector(`#settingsPage [data-category="${cat}"] .category-header`);
        const optionsClass = cat === 'colors' ? 'color-options' : 
                             cat === 'background' ? 'background-options' : 
                             cat === 'language' ? 'language-options' :
                             'menu-options';
        const options = document.querySelector(`#settingsPage .${optionsClass}`);
        
        if (header && options) {
            header.classList.add('collapsed');
            options.classList.add('collapsed');
        }
    });
    
    // Відкриваємо вибрану категорію, якщо вона була закрита
    if (!wasOpen) {
        categoriesState[categoryName] = true;
        
        const header = document.querySelector(`#settingsPage [data-category="${categoryName}"] .category-header`);
        const optionsClass = categoryName === 'colors' ? 'color-options' : 
                             categoryName === 'background' ? 'background-options' : 
                             categoryName === 'language' ? 'language-options' :
                             'menu-options';
        const options = document.querySelector(`#settingsPage .${optionsClass}`);
        
        if (header && options) {
            header.classList.remove('collapsed');
            options.classList.remove('collapsed');
        }
    }
    
    localStorage.setItem('armHelper_categoriesState', JSON.stringify(categoriesState));
}

function loadCategoriesState() {
    const saved = localStorage.getItem('armHelper_categoriesState');
    if (saved) {
        try {
            const savedState = JSON.parse(saved);
            const openCategories = Object.keys(savedState).filter(key => savedState[key]);
            if (openCategories.length > 1) {
                Object.keys(categoriesState).forEach(key => {
                    categoriesState[key] = false;
                });
            } else {
                categoriesState = { ...categoriesState, ...savedState };
            }
        } catch (e) {
            console.error('❌ Error loading categories state:', e);
        }
    }
}

function applyCategoriesState() {
    Object.keys(categoriesState).forEach(category => {
        const header = document.querySelector(`#settingsPage [data-category="${category}"] .category-header`);
        const optionsClass = category === 'colors' ? 'color-options' : 
                            category === 'background' ? 'background-options' : 
                            category === 'language' ? 'language-options' :
                            'menu-options';
        const options = document.querySelector(`#settingsPage .${optionsClass}`);
        
        if (header && options) {
            header.classList.toggle('collapsed', !categoriesState[category]);
            options.classList.toggle('collapsed', !categoriesState[category]);
        }
    });
}

// ========== STORAGE ==========
function getCurrentBackground() {
    return localStorage.getItem('armHelper_background') || 'dodep';
}

function saveBackground(background) {
    localStorage.setItem('armHelper_background', background);
}

function getCurrentMenuPosition() {
    return localStorage.getItem('armHelper_menuPosition') || 'left';
}

function saveMenuPosition(position) {
    localStorage.setItem('armHelper_menuPosition', position);
}

// ========== CHANGE FUNCTIONS ==========
async function changeBackground(background) {
    if (!backgroundOptions[background]) {
        console.warn(`⚠️ Unknown background: ${background}`);
        return;
    }
    
    saveBackground(background);
    await applyBackground(background);
    updateBackgroundUI();
}

function changeMenuPosition(position) {
    if (!menuPositions[position]) {
        console.warn(`⚠️ Unknown menu position: ${position}`);
        return;
    }
    
    saveMenuPosition(position);
    menuManager.showOnlyMenu(position);
    updateMenuPositionUI();
}

function changeLanguage(lang) {
    if (!languageOptions[lang]) {
        console.warn(`⚠️ Unknown language: ${lang}`);
        return;
    }
    
    if (typeof window.switchAppLanguage === 'function') {
        window.switchAppLanguage(lang);
    }
    
    updateLanguageUI();
}

function updateBackgroundUI() {
    const currentBg = getCurrentBackground();
    const options = document.querySelectorAll('#settingsPage .background-option');
    
    options.forEach(option => {
        option.classList.toggle('active', option.dataset.background === currentBg);
    });
}

function updateMenuPositionUI() {
    const currentPos = getCurrentMenuPosition();
    const options = document.querySelectorAll('#settingsPage .menu-option');
    
    options.forEach(option => {
        option.classList.toggle('active', option.dataset.position === currentPos);
    });
}

function updateLanguageUI() {
    const currentLang = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
    const options = document.querySelectorAll('#settingsPage .language-option');
    
    options.forEach(option => {
        option.classList.toggle('active', option.dataset.language === currentLang);
    });
}

// ========== TRANSLATIONS ==========
async function loadSettingsTranslations() {
    if (settingsTranslations) return settingsTranslations;
    
    try {
        const url = `${SETTINGS_BASE_PATH}system/moderation/menu.json`;
        console.log(`📥 Loading translations from: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        settingsTranslations = await response.json();
        console.log('✅ Settings translations loaded');
        return settingsTranslations;
    } catch (error) {
        console.error('❌ Translation load error:', error);
        return null;
    }
}

function updateSettingsLanguage(lang = null) {
    const currentLang = lang || (typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en');
    
    if (!settingsTranslations || !settingsTranslations[currentLang]) {
        console.warn(`⚠️ No translations for language: ${currentLang}`);
        return;
    }
    
    const t = settingsTranslations[currentLang].settings;
    
    const updates = [
        { selector: '#settingsPage .settings-title', text: t.title },
        { selector: '#settingsPage [data-category="language"] .category-title span:last-child', text: t.language },
        { selector: '#settingsPage [data-category="colors"] .category-title span:last-child', text: t.colors },
        { selector: '#settingsPage [data-category="background"] .category-title span:last-child', text: t.background },
        { selector: '#settingsPage [data-category="menu"] .category-title span:last-child', text: t.menu }
    ];
    
    updates.forEach(({ selector, text }) => {
        const el = document.querySelector(selector);
        if (el) el.textContent = text;
    });
    
    Object.keys(backgroundOptions).forEach(bg => {
        const el = document.querySelector(`#settingsPage [data-background="${bg}"] .option-name`);
        if (el && t[bg]) el.textContent = t[bg];
    });
    
    Object.keys(menuPositions).forEach(pos => {
        const el = document.querySelector(`#settingsPage [data-position="${pos}"] .menu-option-name`);
        if (el && t[pos]) el.textContent = t[pos];
    });
    
    updateLanguageNames();
}

function updateColorThemeNames() {
    const currentLang = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
    const colorThemes = window.colorThemes || {};
    
    Object.keys(colorThemes).forEach(theme => {
        const el = document.querySelector(`#settingsPage [data-theme="${theme}"] .color-option-name`);
        if (el && colorThemes[theme].name && colorThemes[theme].name[currentLang]) {
            el.textContent = colorThemes[theme].name[currentLang];
        }
    });
}

function updateLanguageNames() {
    const currentLang = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
    
    Object.keys(languageOptions).forEach(lang => {
        const el = document.querySelector(`#settingsPage [data-language="${lang}"] .language-option-name`);
        if (el && languageOptions[lang].name[currentLang]) {
            el.textContent = languageOptions[lang].name[currentLang];
        }
    });
}

// ========== HTML GENERATION ==========
function createSettingsHTML() {
    const backgroundOptionsHTML = Object.keys(backgroundOptions).map(bg => `
        <div class="background-option" data-background="${bg}" onclick="changeBackground('${bg}')">
            <div class="option-icon">${backgroundOptions[bg].icon}</div>
            <div class="option-name">Loading...</div>
            <div class="background-preview" style="background-image: url('${backgroundOptions[bg].url}')"></div>
        </div>
    `).join('');

    const menuOptionsHTML = Object.keys(menuPositions).map(pos => `
        <div class="menu-option" data-position="${pos}" onclick="changeMenuPosition('${pos}')">
            <div class="menu-option-icon">${menuPositions[pos].icon}</div>
            <div class="menu-option-name">Loading...</div>
        </div>
    `).join('');

    const colorThemes = window.colorThemes || {};
    const colorOptionsHTML = Object.keys(colorThemes).map(theme => {
        const themeData = colorThemes[theme];
        return `
            <div class="color-option" data-theme="${theme}" onclick="changeColorTheme('${theme}')">
                <div class="color-option-icon">${themeData.icon}</div>
                <div class="color-preview">
                    <div class="color-preview-split">
                        <div class="color-preview-left" style="background: ${themeData.primary}"></div>
                        <div class="color-preview-right" style="background: ${themeData.secondary}"></div>
                    </div>
                </div>
                <div class="color-option-name">${themeData.name.en}</div>
            </div>
        `;
    }).join('');

    const languageOptionsHTML = Object.keys(languageOptions).map(lang => {
        const langData = languageOptions[lang];
        return `
            <div class="language-option" data-language="${lang}" onclick="changeLanguage('${lang}')">
                <div class="language-option-icon">${langData.icon}</div>
                <div class="language-option-name">${langData.name.en}</div>
            </div>
        `;
    }).join('');

    return `
        <div class="settings-container">
            <h1 class="settings-title">⚙️ Settings</h1>
            
            <div class="settings-section" data-category="language">
                <div class="category-header collapsed" onclick="toggleSettingsCategory('language')">
                    <div class="category-title">
                        <span class="section-icon">🌍</span>
                        <span>Language</span>
                    </div>
                    <span class="category-toggle">▼</span>
                </div>
                <div class="language-options collapsed">${languageOptionsHTML}</div>
            </div>
            
            <div class="settings-section" data-category="colors">
                <div class="category-header collapsed" onclick="toggleSettingsCategory('colors')">
                    <div class="category-title">
                        <span class="section-icon">🎨</span>
                        <span>Color Theme</span>
                    </div>
                    <span class="category-toggle">▼</span>
                </div>
                <div class="color-options collapsed">${colorOptionsHTML}</div>
            </div>
            
            <div class="settings-section" data-category="background">
                <div class="category-header collapsed" onclick="toggleSettingsCategory('background')">
                    <div class="category-title">
                        <span class="section-icon">🎃</span>
                        <span>Background</span>
                    </div>
                    <span class="category-toggle">▼</span>
                </div>
                <div class="background-options collapsed">${backgroundOptionsHTML}</div>
            </div>
            
            <div class="settings-section" data-category="menu">
                <div class="category-header collapsed" onclick="toggleSettingsCategory('menu')">
                    <div class="category-title">
                        <span class="section-icon">👻</span>
                        <span>Menu Position</span>
                    </div>
                    <span class="category-toggle">▼</span>
                </div>
                <div class="menu-options collapsed">${menuOptionsHTML}</div>
            </div>
        </div>
    `;
}

// ========== INITIALIZATION ==========
async function initializeSettings() {
    if (settingsInitialized) {
        console.log('⚠️ Settings already initialized');
        return;
    }
    
    const settingsPage = document.getElementById('settingsPage');
    if (!settingsPage) {
        console.warn('⚠️ Settings page not found');
        return;
    }
    
    console.log('🔧 Initializing settings...');
    
    loadCategoriesState();
    
    settingsPage.innerHTML = createSettingsHTML();
    
    await loadSettingsTranslations();
    updateSettingsLanguage();
    updateColorThemeNames();
    updateLanguageNames();
    
    const currentBg = getCurrentBackground();
    await applyBackground(currentBg);
    updateBackgroundUI();
    
    const currentMenuPos = getCurrentMenuPosition();
    menuManager.showOnlyMenu(currentMenuPos);
    updateMenuPositionUI();
    
    if (typeof updateColorThemeUI === 'function') {
        updateColorThemeUI();
    }
    
    updateLanguageUI();
    
    applyCategoriesState();
    
    settingsInitialized = true;
    console.log('✅ Settings initialized');
}

async function initializeSettingsOnStart() {
    console.log('🚀 Settings startup initialization...');
    
    const currentBg = getCurrentBackground();
    await applyBackground(currentBg);
    
    const currentMenuPos = getCurrentMenuPosition();
    menuManager.showOnlyMenu(currentMenuPos);
    
    console.log('✅ Settings startup complete');
}

// ========== EVENT LISTENERS ==========
document.addEventListener('languageChanged', (e) => {
    if (settingsInitialized && e.detail && e.detail.language) {
        updateSettingsLanguage(e.detail.language);
        updateColorThemeNames();
        updateLanguageNames();
    }
});

document.addEventListener('pageChanged', (e) => {
    if (e.detail && e.detail.page) {
        menuManager.updateActiveState(e.detail.page);
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSettingsOnStart);
} else {
    initializeSettingsOnStart();
}

// ========== GLOBAL EXPORTS ==========
Object.assign(window, {
    initializeSettings,
    changeBackground,
    changeMenuPosition,
    changeLanguage,
    toggleSettingsCategory,
    updateSettingsLanguage,
    menuManager,
    toggleMobileMenu,
    closeSidebar,
    updateMenuButtonVisibility,
    createMenuButton,
    SETTINGS_BASE_PATH
});

// ========== PRELOAD IMAGES ON INIT ==========
async function preloadAllBackgrounds() {
    console.log('🖼️ Preloading background images...');
    const promises = Object.keys(backgroundOptions).map(bg => preloadBackgroundImage(bg));
    await Promise.allSettled(promises);
    console.log('✅ Background images preloaded');
}

// Викликаємо при завантаженні модуля
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(preloadAllBackgrounds, 1000);
    });
} else {
    setTimeout(preloadAllBackgrounds, 1000);
}

console.log('✅ Settings module loaded');
console.log('📍 Base path:', SETTINGS_BASE_PATH);
