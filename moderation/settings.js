// Налаштування - Керування фоном і позицією меню з гарантованим одним меню + анімація кнопки
let settingsInitialized = false;
let settingsTranslations = null;
let categoriesState = {
    background: false, // false = згорнуто, true = розгорнуто
    menu: false
};

// GitHub конфігурація для зображень
const GITHUB_CONFIG = {
    user: 'MAvpacheater',
    repo: 'tester_site_Secret',
    branch: 'main',
    imagePath: 'image/bg/'
};

// Функція для створення GitHub URL зображення
function getGitHubImageURL(filename) {
    return `https://raw.githubusercontent.com/${GITHUB_CONFIG.user}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.imagePath}${filename}`;
}

// Конфігурації фонів з GitHub зображеннями
const backgroundOptions = {
    penguin: {
        icon: '🐧',
        filename: 'penguin.png',
        get url() { return getGitHubImageURL(this.filename); }
    },
    game: {
        icon: '🎮',
        filename: 'game.png',
        get url() { return getGitHubImageURL(this.filename); }
    },
    code: {
        icon: '💻',
        filename: 'code.png',
        get url() { return getGitHubImageURL(this.filename); }
    },
    dodep: {
        icon: '🎰', 
        filename: 'dodep.png',
        get url() { return getGitHubImageURL(this.filename); }
    },
    prison: {
        icon: '👮‍♂️', 
        filename: 'prison.png',
        get url() { return getGitHubImageURL(this.filename); }
    },
    forest: {
        icon: '🌲',
        filename: 'forest.jpg',
        get url() { return getGitHubImageURL(this.filename); }
    }
};

// Конфігурації позицій меню
const menuPositions = {
    left: {
        icon: '⬅️',
        description: 'Гамбургер меню ліворуч'
    },
    right: {
        icon: '➡️',
        description: 'Гамбургер меню праворуч'
    },
    up: {
        icon: '⬆️',
        description: 'Іконки меню зверху'
    },
    down: {
        icon: '⬇️',
        description: 'Іконки меню знизу'
    }
};

// Конфігурація елементів меню з іконками
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
    { page: 'updates', icon: '📝', title: 'Updates' },
    { page: 'help', icon: '🆘', title: 'Help' },
    { page: 'peoples', icon: '🙏', title: 'Peoples' }
];

// АНІМАЦІЯ КНОПКИ МЕНЮ - НОВА ФУНКЦІЯ
function animateMenuButton(isMenuOpen) {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    if (!menuToggle) return;
    
    const lines = menuToggle.querySelectorAll('.menu-line');
    if (lines.length !== 3) {
        // Якщо лінії ще не створені, створюємо їх
        createMenuButtonLines(menuToggle);
        return animateMenuButton(isMenuOpen);
    }
    
    if (isMenuOpen) {
        // Коли меню відкрито - риски зникають
        lines[0].style.opacity = '0';
        lines[0].style.transform = 'translate(-50%, -50%) scale(0) rotate(45deg) translateY(-6px)';
        
        lines[1].style.opacity = '0';
        lines[1].style.transform = 'translate(-50%, -50%) scale(0)';
        
        lines[2].style.opacity = '0';
        lines[2].style.transform = 'translate(-50%, -50%) scale(0) rotate(-45deg) translateY(6px)';
    } else {
        // Коли меню закрито - риски з'являються
        setTimeout(() => {
            if (lines[0]) {
                lines[0].style.opacity = '1';
                lines[0].style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg) translateY(-6px)';
            }
        }, 50);
        
        setTimeout(() => {
            if (lines[1]) {
                lines[1].style.opacity = '1';
                lines[1].style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
            }
        }, 100);
        
        setTimeout(() => {
            if (lines[2]) {
                lines[2].style.opacity = '1';
                lines[2].style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg) translateY(6px)';
            }
        }, 150);
    }
}

// Створити лінії для кнопки меню
function createMenuButtonLines(menuToggle) {
    // Очистити існуючий контент
    menuToggle.innerHTML = '';
    
    // Створити три лінії
    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.className = 'menu-line';
        line.style.cssText = `
            width: 24px;
            height: 3px;
            background: #F5DEB3;
            border-radius: 2px;
            position: absolute;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 4px rgba(255, 215, 0, 0.6);
            left: 50%;
            top: 50%;
            transform-origin: center;
        `;
        
        // Встановити початкові позиції
        if (i === 0) {
            line.style.transform = 'translate(-50%, -50%) translateY(-6px)';
        } else if (i === 1) {
            line.style.transform = 'translate(-50%, -50%)';
        } else {
            line.style.transform = 'translate(-50%, -50%) translateY(6px)';
        }
        
        menuToggle.appendChild(line);
    }
    console.log('✅ Лінії кнопки меню створено');
}

// НОВА СИСТЕМА УПРАВЛІННЯ МЕНЮ - ГАРАНТУЄ ЛИШЕ ОДНЕ МЕНЮ + АНІМАЦІЯ
class MenuManager {
    constructor() {
        this.currentMenuType = null;
        this.initialized = false;
    }

    // Повністю очистити ВСІ меню з DOM
    clearAllMenus() {
        console.log('🧹 MenuManager: Очищення ВСІХ меню...');
        
        // Видалити всі статичні меню
        const staticMenus = document.querySelectorAll('.static-menu, #staticMenu');
        staticMenus.forEach(menu => {
            menu.remove();
            console.log(`🗑️ Видалено статичне меню:`, menu.className || menu.id);
        });

        // Закрити та сховати сайдбар
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar) {
            sidebar.classList.remove('open');
            console.log('🔒 Сайдбар закрито');
        }
        
        if (overlay) {
            overlay.classList.remove('show');
            console.log('🔒 Overlay сховано');
        }
        
        // Скинути анімацію кнопки при очищенні
        animateMenuButton(false);

        // Очистити всі класи позицій меню з body
        const body = document.body;
        Object.keys(menuPositions).forEach(pos => {
            body.classList.remove(`menu-${pos}`);
        });
        
        // Очистити padding
        body.style.paddingTop = '';
        body.style.paddingBottom = '';
        
        console.log('✅ MenuManager: ВСІ меню очищено');
    }

    // Показати тільки вказаний тип меню
    showOnlyMenu(menuType) {
        console.log(`🎯 MenuManager: Показ ЛИШЕ меню типу: ${menuType}`);
        
        // Спочатку очистити все
        this.clearAllMenus();
        
        // Встановити клас body для нового типу меню
        document.body.classList.add(`menu-${menuType}`);
        
        // Показати відповідні елементи в залежності від типу
        switch(menuType) {
            case 'left':
            case 'right':
                this.showSidebarMenu(menuType);
                break;
            case 'up':
            case 'down':
                this.showStaticMenu(menuType);
                break;
            default:
                console.error(`❌ Невідомий тип меню: ${menuType}`);
                return;
        }
        
        this.currentMenuType = menuType;
        console.log(`✅ MenuManager: Активний тип меню встановлено: ${menuType}`);
    }

    // Показати сайдбар меню (left/right)
    showSidebarMenu(position) {
        console.log(`📱 MenuManager: Показ сайдбар меню: ${position}`);
        
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        
        if (sidebar) {
            // Встановити позицію сайдбара
            if (position === 'right') {
                sidebar.style.left = 'auto';
                sidebar.style.right = '-320px';
            } else {
                sidebar.style.left = '-320px';
                sidebar.style.right = 'auto';
            }
            
            console.log(`✅ Сайдбар налаштовано для позиції: ${position}`);
        }
        
        if (mobileToggle) {
            // Встановити позицію toggle кнопки
            if (position === 'right') {
                mobileToggle.style.left = 'auto';
                mobileToggle.style.right = '20px';
            } else {
                mobileToggle.style.left = '20px';
                mobileToggle.style.right = 'auto';
            }
            
            // Ініціалізувати лінії кнопки при показі меню
            setTimeout(() => {
                createMenuButtonLines(mobileToggle);
            }, 100);
        }
    }

    // Показати статичне меню (up/down)
    showStaticMenu(position) {
        console.log(`📊 MenuManager: Показ статичного меню: ${position}`);
        
        // Створити статичне меню
        this.createStaticMenu(position);
        
        // Встановити правильний padding для body
        if (position === 'up') {
            document.body.style.paddingTop = '80px';
            document.body.style.paddingBottom = '';
        } else if (position === 'down') {
            document.body.style.paddingBottom = '80px';
            document.body.style.paddingTop = '';
        }
    }

    // Створити статичне меню
    createStaticMenu(position) {
        console.log(`🔨 MenuManager: Створення статичного меню для: ${position}`);
        
        const menuClass = position === 'up' ? 'menu-top' : 'menu-bottom';
        const staticMenu = document.createElement('div');
        staticMenu.className = `static-menu ${menuClass}`;
        staticMenu.id = 'staticMenu';
        
        // Створити контейнер навігаційних кнопок
        const navButtons = document.createElement('div');
        navButtons.className = 'nav-buttons';
        
        // Створити кнопки для всіх елементів меню
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
                this.updateStaticMenuActiveState(item.page);
            };
            
            navButtons.appendChild(btn);
        });
        
        // Створити кнопку налаштувань
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'nav-btn settings-btn-static';
        settingsBtn.title = 'Settings';
        settingsBtn.textContent = '⚙️';
        settingsBtn.onclick = () => {
            if (typeof window.switchPage === 'function') {
                window.switchPage('settings');
            }
            this.updateStaticMenuActiveState('settings');
        };
        
        // Додати кнопки до контейнера
        staticMenu.appendChild(navButtons);
        
        // Створити окремий контейнер для кнопки налаштувань (праворуч)
        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'settings-container-static';
        settingsContainer.appendChild(settingsBtn);
        staticMenu.appendChild(settingsContainer);
        
        document.body.appendChild(staticMenu);
        
        // Оновити активний стан для поточної сторінки
        const currentPage = typeof window.getCurrentPage === 'function' ? window.getCurrentPage() : 'calculator';
        this.updateStaticMenuActiveState(currentPage);
        
        console.log(`✅ Статичне ${position} меню створено з ${menuItems.length} елементами + налаштування`);
    }

    // Оновити активний стан статичного меню
    updateStaticMenuActiveState(activePage) {
        const staticMenu = document.getElementById('staticMenu');
        if (!staticMenu) return;
        
        staticMenu.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.page === activePage || 
                (activePage === 'settings' && btn.classList.contains('settings-btn-static'))) {
                btn.classList.add('active');
            }
        });
        
        console.log(`MenuManager: Активний стан статичного меню оновлено: ${activePage}`);
    }

    // Отримати поточний тип меню
    getCurrentMenuType() {
        return this.currentMenuType;
    }
}

// Глобальний екземпляр менеджера меню
const menuManager = new MenuManager();

// Модифіковані функції з анімацією кнопки меню
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        const isOpening = !sidebar.classList.contains('open');
        
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
        
        // Анімувати кнопку меню
        animateMenuButton(isOpening);
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        
        // Анімувати кнопку меню (закриття)
        animateMenuButton(false);
    }
}

// Перевірити доступність зображення
async function checkImageAvailability(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.warn(`❌ Зображення недоступне: ${url}`);
        return false;
    }
}

// Завантажити зображення з резервним варіантом
async function loadBackgroundImage(background) {
    const config = backgroundOptions[background];
    if (!config) {
        console.error(`Фон ${background} не знайдено`);
        return null;
    }
    
    const primaryUrl = config.url;
    console.log(`🔍 Перевіряємо доступність зображення: ${primaryUrl}`);
    
    const isAvailable = await checkImageAvailability(primaryUrl);
    
    if (isAvailable) {
        console.log(`✅ Зображення доступне: ${primaryUrl}`);
        return primaryUrl;
    } else {
        console.warn(`⚠️ Зображення недоступне, використовуємо резервний варіант`);
        
        const fallbackUrls = {
            penguin: 'https://i.postimg.cc/rmW86W6S/Gemini-Generated-Image-fh66csfh66csfh66.png',
            game: 'https://i.postimg.cc/43yVBkY8/Generated-image-1.png',
            code: 'https://i.postimg.cc/nrvZbvKw/image.png',
            dodep: 'https://i.postimg.cc/nV4dxr1X/2025-09-16-22-26-42.png',
            prison: 'https://i.postimg.cc/ZR75v48p/2025-09-16-22-26-34.png',
            forest: 'https://i.postimg.cc/sample/forest-background.png'
        };
        
        return fallbackUrls[background] || primaryUrl;
    }
}

// Перемикання видимості категорії в настройках
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
    console.log(`Категорію настройок ${categoryName} ${categoriesState[categoryName] ? 'розгорнуто' : 'згорнуто'}`);
}

// Завантажити стан категорій
function loadCategoriesState() {
    const saved = localStorage.getItem('armHelper_categoriesState');
    if (saved) {
        try {
            categoriesState = { ...categoriesState, ...JSON.parse(saved) };
        } catch (e) {
            console.warn('Не вдалося завантажити стан категорій, використовуємо за замовчуванням');
        }
    }
}

// Застосувати стан категорій до UI
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

// Отримати поточне налаштування фону
function getCurrentBackground() {
    const saved = localStorage.getItem('armHelper_background');
    return saved || 'penguin';
}

// Зберегти налаштування фону
function saveBackground(background) {
    localStorage.setItem('armHelper_background', background);
    console.log(`Фон збережено: ${background}`);
}

// Застосувати фон до body
async function applyBackground(background) {
    const config = backgroundOptions[background];
    if (!config) {
        console.error(`Фон ${background} не знайдено`);
        return;
    }
    
    console.log(`🎨 Застосування фону: ${background}`);
    
    const body = document.body;
    body.classList.add('loading-background');
    
    try {
        const imageUrl = await loadBackgroundImage(background);
        
        const backgroundStyle = `linear-gradient(135deg, rgba(41, 39, 35, 0.4) 0%, rgba(28, 26, 23, 0.6) 50%, rgba(20, 19, 17, 0.8) 100%), url('${imageUrl}') center center / cover no-repeat`;
        
        body.style.background = backgroundStyle;
        body.style.backgroundAttachment = window.innerWidth > 768 ? 'fixed' : 'scroll';
        
        console.log(`✅ Фон застосовано: ${background} (${imageUrl})`);
    } catch (error) {
        console.error(`❌ Помилка застосування фону ${background}:`, error);
    } finally {
        body.classList.remove('loading-background');
    }
}

// Змінити фон
async function changeBackground(background) {
    if (!backgroundOptions[background]) {
        console.error(`Недійсний фон: ${background}`);
        return;
    }
    
    const button = document.querySelector(`[data-background="${background}"]`);
    if (button) {
        button.classList.add('loading');
    }
    
    try {
        saveBackground(background);
        await applyBackground(background);
        updateBackgroundUI();
        console.log(`Фон змінено на: ${background}`);
    } catch (error) {
        console.error(`❌ Помилка зміни фону:`, error);
    } finally {
        if (button) {
            button.classList.remove('loading');
        }
    }
}

// Оновити UI фону
function updateBackgroundUI() {
    const currentBg = getCurrentBackground();
    
    document.querySelectorAll('#settingsPage .background-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.background === currentBg) {
            option.classList.add('active');
        }
    });
}

// Отримати поточне налаштування позиції меню
function getCurrentMenuPosition() {
    const saved = localStorage.getItem('armHelper_menuPosition');
    return saved || 'left';
}

// Зберегти налаштування позиції меню
function saveMenuPosition(position) {
    localStorage.setItem('armHelper_menuPosition', position);
    console.log(`Позицію меню збережено: ${position}`);
}

// Застосувати позицію меню використовуючи MenuManager
function applyMenuPosition(position) {
    if (!menuPositions[position]) {
        console.error(`Позицію меню ${position} не знайдено`);
        return;
    }
    
    console.log(`🔄 ЗАСТОСУВАННЯ ПОЗИЦІЇ МЕНЮ ЧЕРЕЗ MenuManager: ${position}`);
    
    // Використати MenuManager для показу лише одного типу меню
    menuManager.showOnlyMenu(position);
    
    console.log(`✅ ПОЗИЦІЮ МЕНЮ ЗАСТОСОВАНО: ${position}`);
}

// Примусово очистити всі меню (спрощена версія)
async function forceCleanAllMenus() {
    console.log('🧹 Примусове очищення всіх меню...');
    menuManager.clearAllMenus();
    console.log('✅ Всі меню очищено');
}

// Змінити позицію меню
function changeMenuPosition(position) {
    if (!menuPositions[position]) {
        console.error(`Недійсна позиція меню: ${position}`);
        return;
    }
    
    saveMenuPosition(position);
    applyMenuPosition(position);
    updateMenuPositionUI();
    
    console.log(`Позицію меню змінено на: ${position}`);
}

// Оновити UI позиції меню
function updateMenuPositionUI() {
    const currentPos = getCurrentMenuPosition();
    
    document.querySelectorAll('#settingsPage .menu-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.position === currentPos) {
            option.classList.add('active');
        }
    });
}

// Оновити активний стан статичного меню (глобальна функція)
function updateStaticMenuActiveState(activePage) {
    menuManager.updateStaticMenuActiveState(activePage);
}

// Завантажити переклади налаштувань
async function loadSettingsTranslations() {
    if (settingsTranslations) return settingsTranslations;
    
    try {
        console.log('📥 Завантаження перекладів налаштувань...');
        const response = await fetch('languages/settings.json');
        if (!response.ok) {
            throw new Error(`HTTP помилка! статус: ${response.status}`);
        }
        settingsTranslations = await response.json();
        console.log('✅ Переклади налаштувань завантажено');
        return settingsTranslations;
    } catch (error) {
        console.error('❌ Помилка завантаження перекладів налаштувань:', error);
        settingsTranslations = {
            en: {
                title: "⚙️ Settings",
                background: "Background",
                menu: "Menu Position",
                penguin: "Penguin",
                game: "Game",
                code: "Code",
                dodep: "Dodep",
                prison: "Prison",
                forest: "Forest",
                up: "Top",
                down: "Bottom",
                left: "Left", 
                right: "Right"
            },
            uk: {
                title: "⚙️ Налаштування", 
                background: "Фон",
                menu: "Позиція меню",
                penguin: "Пінгвін",
                game: "Гра",
                code: "Код",
                dodep: "Додеп",
                prison: "В'язниця",
                forest: "Ліс",
                up: "Верх",
                down: "Низ", 
                left: "Ліворуч",
                right: "Праворуч"
            },
            ru: {
                title: "⚙️ Настройки",
                background: "Фон",
                menu: "Позиция меню", 
                penguin: "Пингвин",
                game: "Игра",
                code: "Код",
                dodep: "Додеп",
                prison: "Тюрьма",
                forest: "Лес",
                up: "Верх",
                down: "Низ",
                left: "Слева", 
                right: "Справа"
            }
        };
        return settingsTranslations;
    }
}

// Отримати переклад
function getTranslation(key, fallback) {
    const currentLang = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
    
    if (settingsTranslations && settingsTranslations[currentLang] && settingsTranslations[currentLang][key]) {
        return settingsTranslations[currentLang][key];
    }
    
    return fallback || key;
}

// Оновити мову налаштувань
async function updateSettingsLanguage(lang = null) {
    const currentLang = lang || (typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en');
    
    await loadSettingsTranslations();
    
    if (!settingsTranslations[currentLang]) {
        console.warn(`Мова налаштувань ${currentLang} не знайдена, використовуємо англійську`);
        return;
    }
    
    const translations = settingsTranslations[currentLang];
    
    // Оновити заголовок сторінки
    const titleElement = document.querySelector('#settingsPage .settings-title');
    if (titleElement) {
        titleElement.textContent = translations.title;
        console.log(`✅ Оновлено заголовок: ${translations.title}`);
    }
    
    // Оновити заголовки секцій
    const backgroundSectionTitle = document.querySelector('#settingsPage [data-category="background"] .category-title span:last-child');
    if (backgroundSectionTitle) {
        backgroundSectionTitle.textContent = translations.background;
        console.log(`✅ Оновлено секцію фону: ${translations.background}`);
    }
    
    const menuSectionTitle = document.querySelector('#settingsPage [data-category="menu"] .category-title span:last-child');
    if (menuSectionTitle) {
        menuSectionTitle.textContent = translations.menu;
        console.log(`✅ Оновлено секцію меню: ${translations.menu}`);
    }
    
    // Оновити назви опцій фону
    Object.keys(backgroundOptions).forEach(bg => {
        const option = document.querySelector(`#settingsPage [data-background="${bg}"] .option-name`);
        if (option && translations[bg]) {
            option.textContent = translations[bg];
            console.log(`✅ Оновлено опцію фону ${bg}: ${translations[bg]}`);
        }
    });
    
    // Оновити назви опцій позиції меню
    Object.keys(menuPositions).forEach(pos => {
        const option = document.querySelector(`#settingsPage [data-position="${pos}"] .menu-option-name`);
        if (option && translations[pos]) {
            option.textContent = translations[pos];
            console.log(`✅ Оновлено опцію позиції ${pos}: ${translations[pos]}`);
        }
    });
    
    console.log(`✅ Мову налаштувань оновлено до ${currentLang}`);
}

// Створити HTML налаштувань
function createSettingsHTML() {
    const baseTranslations = {
        title: "⚙️ Settings",
        background: "Background", 
        menu: "Menu Position",
        penguin: "Penguin",
        game: "Game",
        code: "Code", 
        dodep: "Dodep",
        prison: "Prison",
        forest: "Forest",
        up: "Top",
        down: "Bottom", 
        left: "Left",
        right: "Right"
    };
    
    const backgroundOptionsHTML = Object.keys(backgroundOptions).map(bg => {
        const config = backgroundOptions[bg];
        const name = baseTranslations[bg] || bg.charAt(0).toUpperCase() + bg.slice(1);
        return `
            <div class="background-option" data-background="${bg}" onclick="changeBackground('${bg}')">
                <div class="option-icon">${config.icon}</div>
                <div class="option-name">${name}</div>
                <div class="background-preview" style="background-image: url('${config.url}')"></div>
                <div class="loading-indicator" style="display: none;">⏳</div>
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
                
                <div class="background-options collapsed">
                    ${backgroundOptionsHTML}
                </div>
            </div>
            
            <div class="settings-section" data-category="menu">
                <div class="category-header collapsed" onclick="toggleSettingsCategory('menu')">
                    <div class="category-title">
                        <span class="section-icon">📱</span>
                        <span>${baseTranslations.menu}</span>
                    </div>
                    <span class="category-toggle">▼</span>
                </div>
                
                <div class="menu-options collapsed">
                    <div class="menu-option" data-position="up" onclick="changeMenuPosition('up')">
                        <div class="menu-option-icon">⬆️</div>
                        <div class="menu-option-name">${baseTranslations.up}</div>
                    </div>
                    
                    <div class="menu-option" data-position="left" onclick="changeMenuPosition('left')">
                        <div class="menu-option-icon">⬅️</div>
                        <div class="menu-option-name">${baseTranslations.left}</div>
                    </div>
                    
                    <div class="menu-option" data-position="right" onclick="changeMenuPosition('right')">
                        <div class="menu-option-icon">➡️</div>
                        <div class="menu-option-name">${baseTranslations.right}</div>
                    </div>
                    
                    <div class="menu-option" data-position="down" onclick="changeMenuPosition('down')">
                        <div class="menu-option-icon">⬇️</div>
                        <div class="menu-option-name">${baseTranslations.down}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Ініціалізувати сторінку налаштувань
async function initializeSettings() {
    if (settingsInitialized) {
        console.log('⚠️ Налаштування вже ініціалізовано');
        return;
    }
    
    console.log('⚙️ Ініціалізація налаштувань з MenuManager...');
    
    const settingsPage = document.getElementById('settingsPage');
    if (!settingsPage) {
        console.error('❌ Сторінку налаштувань не знайдено');
        return;
    }
    
    // Завантажити стан категорій
    loadCategoriesState();
    
    // Завантажити переклади
    await loadSettingsTranslations();
    
    // Встановити HTML контент
    settingsPage.innerHTML = createSettingsHTML();
    console.log('✅ HTML контент створено');
    
    // Оновити переклади
    setTimeout(async () => {
        await updateSettingsLanguage();
        console.log('✅ Переклади застосовано');
    }, 100);
    
    // Застосувати поточний фон
    const currentBg = getCurrentBackground();
    await applyBackground(currentBg);
    updateBackgroundUI();
    
    // Застосувати поточну позицію меню через MenuManager
    const currentMenuPos = getCurrentMenuPosition();
    applyMenuPosition(currentMenuPos);
    updateMenuPositionUI();
    
    // Застосувати стан категорій
    applyCategoriesState();
    
    settingsInitialized = true;
    console.log('✅ Налаштування повністю ініціалізовано з MenuManager');
}

// Застосувати фон і позицію меню при запуску додатка
async function initializeSettingsOnStart() {
    console.log('🚀 Ініціалізація налаштувань при старті з MenuManager...');
    
    // Застосувати фон
    const currentBg = getCurrentBackground();
    await applyBackground(currentBg);
    console.log(`Початковий фон застосовано: ${currentBg}`);
    
    // Застосувати позицію меню через MenuManager
    const currentMenuPos = getCurrentMenuPosition();
    console.log(`🎯 Застосування початкової позиції меню через MenuManager: ${currentMenuPos}`);
    
    setTimeout(() => {
        applyMenuPosition(currentMenuPos);
        console.log(`✅ Початкову позицію меню застосовано через MenuManager: ${currentMenuPos}`);
    }, 100);
}

// Слухати зміни мови
document.addEventListener('languageChanged', (event) => {
    if (settingsInitialized) {
        updateSettingsLanguage(event.detail.language);
    }
});

// Слухати зміни сторінок для оновлення активного стану статичного меню
document.addEventListener('pageChanged', (event) => {
    if (event.detail && event.detail.page) {
        updateStaticMenuActiveState(event.detail.page);
    }
});

// Застосувати налаштування при завантаженні
document.addEventListener('DOMContentLoaded', () => {
    initializeSettingsOnStart();
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSettingsOnStart);
} else {
    initializeSettingsOnStart();
}

// Глобальні функції з анімацією кнопки меню
window.initializeSettings = initializeSettings;
window.changeBackground = changeBackground;
window.changeMenuPosition = changeMenuPosition;
window.toggleSettingsCategory = toggleSettingsCategory;
window.updateSettingsLanguage = updateSettingsLanguage;
window.updateStaticMenuActiveState = updateStaticMenuActiveState;
window.getGitHubImageURL = getGitHubImageURL;
window.forceCleanAllMenus = forceCleanAllMenus;
window.applyMenuPosition = applyMenuPosition;
window.menuManager = menuManager;
window.toggleMobileMenu = toggleMobileMenu;
window.closeSidebar = closeSidebar;
window.animateMenuButton = animateMenuButton;
window.createMenuButtonLines = createMenuButtonLines;
