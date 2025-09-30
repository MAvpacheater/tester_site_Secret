// Оптимізований Settings
let settingsInitialized = false;
let settingsTranslations = null;
let categoriesState = { background: false, menu: false };

const GITHUB_CONFIG = {
    user: 'MAvpacheater',
    repo: 'armwrestlerinfopost',
    branch: 'main',
    imagePath: 'image/bg/'
};

const backgroundOptions = {
    penguin: { icon: '🐧', filename: 'penguin.png' },
    game: { icon: '🎮', filename: 'game.png' },
    code: { icon: '💻', filename: 'code.png' },
    dodep: { icon: '🎰', filename: 'dodep.png' },
    prison: { icon: '👮‍♂️', filename: 'prison.png' },
    forest: { icon: '🌲', filename: 'forest.jpg' },
    space: { icon: '💰', filename: 'bank.png' },
    ocean: { icon: '🌊', filename: 'sea.jpeg' },
    desert: { icon: '🔭', filename: 'earth.jpg' }
};

Object.keys(backgroundOptions).forEach(key => {
    backgroundOptions[key].url = `https://raw.githubusercontent.com/${GITHUB_CONFIG.user}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.imagePath}${backgroundOptions[key].filename}`;
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
    { page: 'help', icon: '🆘' },
    { page: 'peoples', icon: '🙏' }
];

// MENU BUTTON
function createMenuButton() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    if (!menuToggle) return;
    
    menuToggle.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.className = 'menu-line';
        line.style.transform = i === 0 ? 'translate(-50%, -50%) translateY(-6px)' :
                               i === 1 ? 'translate(-50%, -50%)' :
                               'translate(-50%, -50%) translateY(6px)';
        menuToggle.appendChild(line);
    }
}

function updateMenuButtonVisibility() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (!menuToggle || !sidebar) return;
    
    menuToggle.classList.toggle('menu-open', sidebar.classList.contains('open'));
}

// MENU MANAGER
class MenuManager {
    constructor() {
        this.currentMenuType = null;
    }

    clearAllMenus() {
        document.querySelectorAll('.static-menu, #staticMenu').forEach(menu => menu.remove());
        
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        
        updateMenuButtonVisibility();
        Object.keys(menuPositions).forEach(pos => document.body.classList.remove(`menu-${pos}`));
        document.body.style.paddingTop = '';
        document.body.style.paddingBottom = '';
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
            setTimeout(createMenuButton, 100);
        }
    }

    createStaticMenu(position) {
        const menuClass = position === 'up' ? 'menu-top' : 'menu-bottom';
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
            btn.onclick = () => {
                if (typeof window.switchPage === 'function') window.switchPage(item.page);
                this.updateActiveState(item.page);
            };
            navButtons.appendChild(btn);
        });
        
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'nav-btn settings-btn-static';
        settingsBtn.textContent = '⚙️';
        settingsBtn.onclick = () => {
            if (typeof window.switchPage === 'function') window.switchPage('settings');
            this.updateActiveState('settings');
        };
        
        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'settings-container-static';
        settingsContainer.appendChild(settingsBtn);
        
        staticMenu.appendChild(navButtons);
        staticMenu.appendChild(settingsContainer);
        document.body.appendChild(staticMenu);
        
        document.body.style[position === 'up' ? 'paddingTop' : 'paddingBottom'] = '80px';
        
        const currentPage = typeof window.getCurrentPage === 'function' ? window.getCurrentPage() : 'calculator';
        this.updateActiveState(currentPage);
    }

    updateActiveState(activePage) {
        const staticMenu = document.getElementById('staticMenu');
        if (!staticMenu) return;
        
        staticMenu.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', 
                btn.dataset.page === activePage || 
                (activePage === 'settings' && btn.classList.contains('settings-btn-static'))
            );
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

// BACKGROUNDS
async function checkImageAvailability(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

async function applyBackground(background) {
    const config = backgroundOptions[background];
    if (!config) return;
    
    const body = document.body;
    body.classList.add('loading-background');
    
    try {
        const isAvailable = await checkImageAvailability(config.url);
        if (isAvailable) {
            body.style.background = `linear-gradient(135deg, rgba(41, 39, 35, 0.4) 0%, rgba(28, 26, 23, 0.6) 50%, rgba(20, 19, 17, 0.8) 100%), url('${config.url}') center center / cover no-repeat`;
            body.style.backgroundAttachment = window.innerWidth > 768 ? 'fixed' : 'scroll';
        }
    } catch (error) {
        console.error('Background error:', error);
    } finally {
        body.classList.remove('loading-background');
    }
}

// SETTINGS MANAGEMENT
function toggleSettingsCategory(categoryName) {
    if (!categoriesState.hasOwnProperty(categoryName)) return;
    
    categoriesState[categoryName] = !categoriesState[categoryName];
    
    const header = document.querySelector(`#settingsPage [data-category="${categoryName}"] .category-header`);
    const options = document.querySelector(`#settingsPage .${categoryName}-options`);
    
    if (header && options) {
        header.classList.toggle('collapsed', !categoriesState[categoryName]);
        options.classList.toggle('collapsed', !categoriesState[categoryName]);
        localStorage.setItem('armHelper_categoriesState', JSON.stringify(categoriesState));
    }
}

function loadCategoriesState() {
    const saved = localStorage.getItem('armHelper_categoriesState');
    if (saved) {
        try {
            categoriesState = { ...categoriesState, ...JSON.parse(saved) };
        } catch (e) {}
    }
}

function applyCategoriesState() {
    Object.keys(categoriesState).forEach(category => {
        const header = document.querySelector(`#settingsPage [data-category="${category}"] .category-header`);
        const options = document.querySelector(`#settingsPage .${category}-options`);
        
        if (header && options) {
            header.classList.toggle('collapsed', !categoriesState[category]);
            options.classList.toggle('collapsed', !categoriesState[category]);
        }
    });
}

// STORAGE
function getCurrentBackground() {
    return localStorage.getItem('armHelper_background') || 'penguin';
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

// CHANGE FUNCTIONS
async function changeBackground(background) {
    if (!backgroundOptions[background]) return;
    
    const button = document.querySelector(`[data-background="${background}"]`);
    if (button) button.classList.add('loading');
    
    try {
        saveBackground(background);
        await applyBackground(background);
        updateBackgroundUI();
    } finally {
        if (button) button.classList.remove('loading');
    }
}

function changeMenuPosition(position) {
    if (!menuPositions[position]) return;
    
    saveMenuPosition(position);
    menuManager.showOnlyMenu(position);
    updateMenuPositionUI();
}

function updateBackgroundUI() {
    const currentBg = getCurrentBackground();
    document.querySelectorAll('#settingsPage .background-option').forEach(option => {
        option.classList.toggle('active', option.dataset.background === currentBg);
    });
}

function updateMenuPositionUI() {
    const currentPos = getCurrentMenuPosition();
    document.querySelectorAll('#settingsPage .menu-option').forEach(option => {
        option.classList.toggle('active', option.dataset.position === currentPos);
    });
}

// TRANSLATIONS
async function loadSettingsTranslations() {
    if (settingsTranslations) return settingsTranslations;
    
    try {
        const response = await fetch('moderation/menu.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        settingsTranslations = await response.json();
        return settingsTranslations;
    } catch (error) {
        console.error('Translation load error:', error);
        return null;
    }
}

async function updateSettingsLanguage(lang = null) {
    const currentLang = lang || (typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en');
    
    await loadSettingsTranslations();
    
    if (!settingsTranslations || !settingsTranslations[currentLang]) return;
    
    const t = settingsTranslations[currentLang].settings;
    
    const updates = {
        '.settings-title': t.title,
        '[data-category="background"] .category-title span:last-child': t.background,
        '[data-category="menu"] .category-title span:last-child': t.menu
    };
    
    Object.entries(updates).forEach(([selector, text]) => {
        const el = document.querySelector(`#settingsPage ${selector}`);
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
}

// HTML GENERATION
function createSettingsHTML() {
    const backgroundOptionsHTML = Object.keys(backgroundOptions).map(bg => `
        <div class="background-option" data-background="${bg}" onclick="changeBackground('${bg}')">
            <div class="option-icon">${backgroundOptions[bg].icon}</div>
            <div class="option-name"></div>
            <div class="background-preview" style="background-image: url('${backgroundOptions[bg].url}')"></div>
        </div>
    `).join('');

    const menuOptionsHTML = Object.keys(menuPositions).map(pos => `
        <div class="menu-option" data-position="${pos}" onclick="changeMenuPosition('${pos}')">
            <div class="menu-option-icon">${menuPositions[pos].icon}</div>
            <div class="menu-option-name"></div>
        </div>
    `).join('');

    return `
        <div class="settings-container">
            <h1 class="settings-title"></h1>
            
            <div class="settings-section" data-category="background">
                <div class="category-header collapsed" onclick="toggleSettingsCategory('background')">
                    <div class="category-title">
                        <span class="section-icon">🎨</span>
                        <span></span>
                    </div>
                    <span class="category-toggle">▼</span>
                </div>
                <div class="background-options collapsed">${backgroundOptionsHTML}</div>
            </div>
            
            <div class="settings-section" data-category="menu">
                <div class="category-header collapsed" onclick="toggleSettingsCategory('menu')">
                    <div class="category-title">
                        <span class="section-icon">📱</span>
                        <span></span>
                    </div>
                    <span class="category-toggle">▼</span>
                </div>
                <div class="menu-options collapsed">${menuOptionsHTML}</div>
            </div>
        </div>
    `;
}

// INITIALIZATION
async function initializeSettings() {
    if (settingsInitialized) return;
    
    const settingsPage = document.getElementById('settingsPage');
    if (!settingsPage) return;
    
    loadCategoriesState();
    await loadSettingsTranslations();
    
    settingsPage.innerHTML = createSettingsHTML();
    
    setTimeout(async () => {
        await updateSettingsLanguage();
    }, 100);
    
    const currentBg = getCurrentBackground();
    await applyBackground(currentBg);
    updateBackgroundUI();
    
    const currentMenuPos = getCurrentMenuPosition();
    menuManager.showOnlyMenu(currentMenuPos);
    updateMenuPositionUI();
    
    applyCategoriesState();
    
    settingsInitialized = true;
}

async function initializeSettingsOnStart() {
    const currentBg = getCurrentBackground();
    await applyBackground(currentBg);
    
    const currentMenuPos = getCurrentMenuPosition();
    setTimeout(() => menuManager.showOnlyMenu(currentMenuPos), 100);
}

// EVENT LISTENERS
document.addEventListener('languageChanged', (e) => {
    if (settingsInitialized) updateSettingsLanguage(e.detail.language);
});

document.addEventListener('pageChanged', (e) => {
    if (e.detail && e.detail.page) menuManager.updateActiveState(e.detail.page);
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSettingsOnStart);
} else {
    initializeSettingsOnStart();
}

// GLOBAL EXPORTS
window.initializeSettings = initializeSettings;
window.changeBackground = changeBackground;
window.changeMenuPosition = changeMenuPosition;
window.toggleSettingsCategory = toggleSettingsCategory;
window.updateSettingsLanguage = updateSettingsLanguage;
window.menuManager = menuManager;
window.toggleMobileMenu = toggleMobileMenu;
window.closeSidebar = closeSidebar;
window.updateMenuButtonVisibility = updateMenuButtonVisibility;
window.createMenuButton = createMenuButton;
