// Оптимізований Settings - Керування фоном і позицією меню
let settingsInitialized = false;
let settingsTranslations = null;
let categoriesState = { background: false, menu: false };

// GitHub конфігурація для зображень
const GITHUB_CONFIG = {
    user: 'MAvpacheater',
    repo: 'tester_site_Secret',
    branch: 'main',
    imagePath: 'image/bg/'
};

// Конфігурації фонів з GitHub зображеннями
const backgroundOptions = {
    penguin: { icon: '🐧', filename: 'penguin.png' },
    game: { icon: '🎮', filename: 'game.png' },
    code: { icon: '💻', filename: 'code.png' },
    dodep: { icon: '🎰', filename: 'dodep.png' },
    prison: { icon: '👮‍♂️', filename: 'prison.png' },
    forest: { icon: '🌲', filename: 'forest.jpg' }
};

// Додаємо URL до кожної опції
Object.keys(backgroundOptions).forEach(key => {
    backgroundOptions[key].url = `https://raw.githubusercontent.com/${GITHUB_CONFIG.user}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.imagePath}${backgroundOptions[key].filename}`;
});

// Конфігурації позицій меню
const menuPositions = {
    left: { icon: '⬅️', description: 'Гамбургер меню ліворуч' },
    right: { icon: '➡️', description: 'Гамбургер меню праворуч' },
    up: { icon: '⬆️', description: 'Іконки меню зверху' },
    down: { icon: '⬇️', description: 'Іконки меню знизу' }
};

// Конфігурація елементів меню
const menuItems = [
    { page: 'calculator', icon: '🐾', title: 'Pet Calculator' },
    { page: 'arm', icon: '💪', title: 'Arm Calculator' },
    { page: 'grind', icon: '🏋️‍♂️', title: 'Grind Calculator' },
    { page: 'boosts', icon: '🚀', title: 'Boosts' },
    { page: 'shiny', icon: '✨', title: 'Shiny Stats' },
    { page: 'secret', icon: '🔮', title: 'Secret Pets' },
    { page: 'codes', icon: '🎁', title: 'Codes' },
    { page: 'aura', icon: '🌟', title: 'Aura' },
    { page: 'trainer', icon: '🏆', title: 'Trainer' },
    { page: 'charms', icon: '🔮', title: 'Charms' },
    { page: 'potions', icon: '🧪', title: 'Potions & Food' },
    { page: 'worlds', icon: '🌍', title: 'Worlds' },
    { page: 'help', icon: '🆘', title: 'Help' },
    { page: 'peoples', icon: '🙏', title: 'Peoples' }
];

// УПРАВЛІННЯ КНОПКОЮ МЕНЮ - ПОКРАЩЕНО
function createMenuButton() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    if (!menuToggle) return;
    
    menuToggle.innerHTML = '';
    
    // Створити три лінії для більшої кнопки
    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.className = 'menu-line';
        
        // Позиції для більшої кнопки (60x60px)
        if (i === 0) {
            line.style.transform = 'translate(-50%, -50%) translateY(-6px)';
        } else if (i === 1) {
            line.style.transform = 'translate(-50%, -50%)';
        } else {
            line.style.transform = 'translate(-50%, -50%) translateY(6px)';
        }
        
        menuToggle.appendChild(line);
    }
}

// Показати/сховати кнопку меню залежно від стану сайдбара
function updateMenuButtonVisibility() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (!menuToggle || !sidebar) return;
    
    const isMenuOpen = sidebar.classList.contains('open');
    
    if (isMenuOpen) {
        menuToggle.classList.add('menu-open');
        console.log('🔒 Кнопка меню сховано (меню відкрито)');
    } else {
        menuToggle.classList.remove('menu-open');
        console.log('👁️ Кнопка меню показано (меню закрито)');
    }
}

// СИСТЕМА УПРАВЛІННЯ МЕНЮ - СПРОЩЕНО
class MenuManager {
    constructor() {
        this.currentMenuType = null;
    }

    clearAllMenus() {
        console.log('🧹 Очищення всіх меню...');
        
        // Видалити статичні меню
        document.querySelectorAll('.static-menu, #staticMenu').forEach(menu => menu.remove());

        // Закрити сайдбар
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
        
        // Оновити видимість кнопки меню
        updateMenuButtonVisibility();

        // Очистити класи позицій з body
        Object.keys(menuPositions).forEach(pos => {
            document.body.classList.remove(`menu-${pos}`);
        });
        
        // Очистити padding
        document.body.style.paddingTop = '';
        document.body.style.paddingBottom = '';
    }

    showOnlyMenu(menuType) {
        console.log(`🎯 Показ меню типу: ${menuType}`);
        
        this.clearAllMenus();
        document.body.classList.add(`menu-${menuType}`);
        
        if (menuType === 'left' || menuType === 'right') {
            this.setupSidebarMenu(menuType);
        } else if (menuType === 'up' || menuType === 'down') {
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
        
        // Навігаційні кнопки
        const navButtons = document.createElement('div');
        navButtons.className = 'nav-buttons';
        
        menuItems.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'nav-btn';
            btn.dataset.page = item.page;
            btn.title = item.title;
            btn.textContent = item.icon;
            btn.onclick = () => {
                if (typeof window.switchPage === 'function') {
                    window.switchPage(item.page);
                }
                this.updateActiveState(item.page);
            };
            navButtons.appendChild(btn);
        });
        
        // Кнопка налаштувань
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'nav-btn settings-btn-static';
        settingsBtn.title = 'Settings';
        settingsBtn.textContent = '⚙️';
        settingsBtn.onclick = () => {
            if (typeof window.switchPage === 'function') {
                window.switchPage('settings');
            }
            this.updateActiveState('settings');
        };
        
        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'settings-container-static';
        settingsContainer.appendChild(settingsBtn);
        
        staticMenu.appendChild(navButtons);
        staticMenu.appendChild(settingsContainer);
        document.body.appendChild(staticMenu);
        
        // Встановити padding для body
        if (position === 'up') {
            document.body.style.paddingTop = '80px';
        } else {
            document.body.style.paddingBottom = '80px';
        }
        
        // Оновити активний стан
        const currentPage = typeof window.getCurrentPage === 'function' ? window.getCurrentPage() : 'calculator';
        this.updateActiveState(currentPage);
    }

    updateActiveState(activePage) {
        const staticMenu = document.getElementById('staticMenu');
        if (!staticMenu) return;
        
        staticMenu.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.page === activePage || 
                (activePage === 'settings' && btn.classList.contains('settings-btn-static'))) {
                btn.classList.add('active');
            }
        });
    }
}

// Глобальний екземпляр менеджера меню
const menuManager = new MenuManager();

// ФУНКЦІЇ УПРАВЛІННЯ МЕНЮ - ПОКРАЩЕНО
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
        
        // Оновити видимість кнопки меню
        updateMenuButtonVisibility();
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        
        // Оновити видимість кнопки меню
        updateMenuButtonVisibility();
    }
}

// РОБОТА З ФОНАМИ - СПРОЩЕНО
async function checkImageAvailability(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

async function loadBackgroundImage(background) {
    const config = backgroundOptions[background];
    if (!config) return null;
    
    const isAvailable = await checkImageAvailability(config.url);
    
    if (isAvailable) {
        return config.url;
    } else {
        // Резервні URL
        const fallbackUrls = {
            penguin: 'https://i.postimg.cc/rmW86W6S/Gemini-Generated-Image-fh66csfh66csfh66.png',
            game: 'https://i.postimg.cc/43yVBkY8/Generated-image-1.png',
            code: 'https://i.postimg.cc/nrvZbvKw/image.png',
            dodep: 'https://i.postimg.cc/nV4dxr1X/2025-09-16-22-26-42.png',
            prison: 'https://i.postimg.cc/ZR75v48p/2025-09-16-22-26-34.png',
            forest: 'https://i.postimg.cc/sample/forest-background.png'
        };
        return fallbackUrls[background] || config.url;
    }
}

async function applyBackground(background) {
    const config = backgroundOptions[background];
    if (!config) return;
    
    console.log(`🎨 Застосування фону: ${background}`);
    
    const body = document.body;
    body.classList.add('loading-background');
    
    try {
        const imageUrl = await loadBackgroundImage(background);
        const backgroundStyle = `linear-gradient(135deg, rgba(41, 39, 35, 0.4) 0%, rgba(28, 26, 23, 0.6) 50%, rgba(20, 19, 17, 0.8) 100%), url('${imageUrl}') center center / cover no-repeat`;
        
        body.style.background = backgroundStyle;
        body.style.backgroundAttachment = window.innerWidth > 768 ? 'fixed' : 'scroll';
        
        console.log(`✅ Фон застосовано: ${background}`);
    } catch (error) {
        console.error(`❌ Помилка застосування фону:`, error);
    } finally {
        body.classList.remove('loading-background');
    }
}

// УПРАВЛІННЯ НАЛАШТУВАННЯМИ - СПРОЩЕНО
function toggleSettingsCategory(categoryName) {
    if (!categoriesState.hasOwnProperty(categoryName)) return;
    
    categoriesState[categoryName] = !categoriesState[categoryName];
    
    const header = document.querySelector(`#settingsPage [data-category="${categoryName}"] .category-header`);
    const options = document.querySelector(`#settingsPage .${categoryName}-options`);
    
    if (!header || !options) return;
    
    if (categoriesState[categoryName]) {
        header.classList.remove('collapsed');
        options.classList.remove('collapsed');
    } else {
        header.classList.add('collapsed');
        options.classList.add('collapsed');
    }
    
    localStorage.setItem('armHelper_categoriesState', JSON.stringify(categoriesState));
}

function loadCategoriesState() {
    const saved = localStorage.getItem('armHelper_categoriesState');
    if (saved) {
        try {
            categoriesState = { ...categoriesState, ...JSON.parse(saved) };
        } catch (e) {
            console.warn('Не вдалося завантажити стан категорій');
        }
    }
}

function applyCategoriesState() {
    Object.keys(categoriesState).forEach(category => {
        const header = document.querySelector(`#settingsPage [data-category="${category}"] .category-header`);
        const options = document.querySelector(`#settingsPage .${category}-options`);
        
        if (!header || !options) return;
        
        if (categoriesState[category]) {
            header.classList.remove('collapsed');
            options.classList.remove('collapsed');
        } else {
            header.classList.add('collapsed');
            options.classList.add('collapsed');
        }
    });
}

// ФУНКЦІЇ ЗБЕРЕЖЕННЯ/ЗАВАНТАЖЕННЯ
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

// ОСНОВНІ ФУНКЦІЇ ЗМІНИ НАЛАШТУВАНЬ
async function changeBackground(background) {
    if (!backgroundOptions[background]) return;
    
    const button = document.querySelector(`[data-background="${background}"]`);
    if (button) button.classList.add('loading');
    
    try {
        saveBackground(background);
        await applyBackground(background);
        updateBackgroundUI();
    } catch (error) {
        console.error('❌ Помилка зміни фону:', error);
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
        option.classList.remove('active');
        if (option.dataset.background === currentBg) {
            option.classList.add('active');
        }
    });
}

function updateMenuPositionUI() {
    const currentPos = getCurrentMenuPosition();
    document.querySelectorAll('#settingsPage .menu-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.position === currentPos) {
            option.classList.add('active');
        }
    });
}

// РОБОТА З ПЕРЕКЛАДАМИ - СПРОЩЕНО
async function loadSettingsTranslations() {
    if (settingsTranslations) return settingsTranslations;
    
    try {
        const response = await fetch('languages/settings.json');
        if (!response.ok) throw new Error(`HTTP помилка! статус: ${response.status}`);
        settingsTranslations = await response.json();
        return settingsTranslations;
    } catch (error) {
        console.error('❌ Помилка завантаження перекладів:', error);
        // Резервні переклади
        settingsTranslations = {
            en: {
                title: "⚙️ Settings", background: "Background", menu: "Menu Position",
                penguin: "Penguin", game: "Game", code: "Code", dodep: "Dodep", 
                prison: "Prison", forest: "Forest", up: "Top", down: "Bottom", 
                left: "Left", right: "Right"
            },
            uk: {
                title: "⚙️ Налаштування", background: "Фон", menu: "Позиція меню",
                penguin: "Пінгвін", game: "Гра", code: "Код", dodep: "Додеп",
                prison: "В'язниця", forest: "Ліс", up: "Верх", down: "Низ",
                left: "Ліворуч", right: "Праворуч"
            },
            ru: {
                title: "⚙️ Настройки", background: "Фон", menu: "Позиция меню",
                penguin: "Пингвин", game: "Игра", code: "Код", dodep: "Додеп",
                prison: "Тюрьма", forest: "Лес", up: "Верх", down: "Низ",
                left: "Слева", right: "Справа"
            }
        };
        return settingsTranslations;
    }
}

async function updateSettingsLanguage(lang = null) {
    const currentLang = lang || (typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en');
    
    await loadSettingsTranslations();
    
    if (!settingsTranslations[currentLang]) return;
    
    const translations = settingsTranslations[currentLang];
    
    // Оновити елементи UI
    const updates = [
        { selector: '#settingsPage .settings-title', key: 'title' },
        { selector: '#settingsPage [data-category="background"] .category-title span:last-child', key: 'background' },
        { selector: '#settingsPage [data-category="menu"] .category-title span:last-child', key: 'menu' }
    ];
    
    updates.forEach(({ selector, key }) => {
        const element = document.querySelector(selector);
        if (element && translations[key]) {
            element.textContent = translations[key];
        }
    });
    
    // Оновити опції фону
    Object.keys(backgroundOptions).forEach(bg => {
        const option = document.querySelector(`#settingsPage [data-background="${bg}"] .option-name`);
        if (option && translations[bg]) {
            option.textContent = translations[bg];
        }
    });
    
    // Оновити опції позиції меню
    Object.keys(menuPositions).forEach(pos => {
        const option = document.querySelector(`#settingsPage [data-position="${pos}"] .menu-option-name`);
        if (option && translations[pos]) {
            option.textContent = translations[pos];
        }
    });
}

// HTML ГЕНЕРАЦІЯ - СПРОЩЕНО
function createSettingsHTML() {
    const baseTranslations = {
        title: "⚙️ Settings", background: "Background", menu: "Menu Position",
        penguin: "Penguin", game: "Game", code: "Code", dodep: "Dodep",
        prison: "Prison", forest: "Forest", up: "Top", down: "Bottom",
        left: "Left", right: "Right"
    };
    
    const backgroundOptionsHTML = Object.keys(backgroundOptions).map(bg => {
        const config = backgroundOptions[bg];
        const name = baseTranslations[bg] || bg.charAt(0).toUpperCase() + bg.slice(1);
        return `
            <div class="background-option" data-background="${bg}" onclick="changeBackground('${bg}')">
                <div class="option-icon">${config.icon}</div>
                <div class="option-name">${name}</div>
                <div class="background-preview" style="background-image: url('${config.url}')"></div>
            </div>
        `;
    }).join('');

    const menuOptionsHTML = Object.keys(menuPositions).map(pos => {
        const config = menuPositions[pos];
        const name = baseTranslations[pos] || pos.charAt(0).toUpperCase() + pos.slice(1);
        return `
            <div class="menu-option" data-position="${pos}" onclick="changeMenuPosition('${pos}')">
                <div class="menu-option-icon">${config.icon}</div>
                <div class="menu-option-name">${name}</div>
            </div>
        `;
    }).join('');

    return `
        <div class="settings-container">
            <h1 class="settings-title">${baseTranslations.title}</h1>
            
            <div class="settings-section" data-category="background">
                <div class="category-header collapsed" onclick="toggleSettingsCategory('background')">
                    <div class="category-title">
                        <span class="section-icon">🎨</span>
                        <span>${baseTranslations.background}</span>
                    </div>
                    <span class="category-toggle">▼</span>
                </div>
                <div class="background-options collapsed">${backgroundOptionsHTML}</div>
            </div>
            
            <div class="settings-section" data-category="menu">
                <div class="category-header collapsed" onclick="toggleSettingsCategory('menu')">
                    <div class="category-title">
                        <span class="section-icon">📱</span>
                        <span>${baseTranslations.menu}</span>
                    </div>
                    <span class="category-toggle">▼</span>
                </div>
                <div class="menu-options collapsed">${menuOptionsHTML}</div>
            </div>
        </div>
    `;
}

// ОСНОВНІ ФУНКЦІЇ ІНІЦІАЛІЗАЦІЇ
async function initializeSettings() {
    if (settingsInitialized) return;
    
    console.log('⚙️ Ініціалізація налаштувань...');
    
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
    console.log('✅ Налаштування ініціалізовано');
}

async function initializeSettingsOnStart() {
    console.log('🚀 Ініціалізація при старті...');
    
    const currentBg = getCurrentBackground();
    await applyBackground(currentBg);
    
    const currentMenuPos = getCurrentMenuPosition();
    setTimeout(() => {
        menuManager.showOnlyMenu(currentMenuPos);
    }, 100);
}

// EVENT LISTENERS
document.addEventListener('languageChanged', (event) => {
    if (settingsInitialized) {
        updateSettingsLanguage(event.detail.language);
    }
});

document.addEventListener('pageChanged', (event) => {
    if (event.detail && event.detail.page) {
        menuManager.updateActiveState(event.detail.page);
    }
});

// Ініціалізація при завантаженні
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSettingsOnStart);
} else {
    initializeSettingsOnStart();
}

// ГЛОБАЛЬНІ ФУНКЦІЇ
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
