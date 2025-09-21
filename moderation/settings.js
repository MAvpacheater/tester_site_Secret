// Налаштування - Керування фоном і позицією меню з правильним приховуванням
let settingsInitialized = false;
let settingsTranslations = null;
let categoriesState = {
    background: false, // false = згорнуто, true = розгорнуто
    menu: false
};

// Конфігурації фонів
const backgroundOptions = {
    penguin: {
        icon: '🐧',
        url: 'https://i.postimg.cc/rmW86W6S/Gemini-Generated-Image-fh66csfh66csfh66.png'
    },
    game: {
        icon: '🎮', 
        url: 'https://i.postimg.cc/43yVBkY8/Generated-image-1.png'
    },
    code: {
        icon: '💻',
        url: 'https://i.postimg.cc/nrvZbvKw/image.png'
    },
    dodep: {
        icon: '🎮', 
        url: 'https://i.postimg.cc/nV4dxr1X/2025-09-16-22-26-42.png'
    },
    prison: {
        icon: '🎮', 
        url: 'https://i.postimg.cc/ZR75v48p/2025-09-16-22-26-34.png'
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

// Конфігурація елементів меню з іконками (включаючи налаштування)
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
    { page: 'peoples', icon: '🙏', title: 'Peoples' },
    { page: 'settings', icon: '⚙️', title: 'Settings' }
];

// Перемикання видимості категорії в настройках (не конфліктує з головним меню)
function toggleSettingsCategory(categoryName) {
    if (!categoriesState.hasOwnProperty(categoryName)) return;
    
    categoriesState[categoryName] = !categoriesState[categoryName];
    
    const header = document.querySelector(`#settingsPage [data-category="${categoryName}"] .category-header`);
    const options = document.querySelector(`#settingsPage .${categoryName}-options`);
    
    if (!header || !options) return;
    
    if (categoriesState[categoryName]) {
        // Розгорнути
        header.classList.remove('collapsed');
        options.classList.remove('collapsed');
    } else {
        // Згорнути
        header.classList.add('collapsed');
        options.classList.add('collapsed');
    }
    
    // Зберегти стан
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
function applyBackground(background) {
    const config = backgroundOptions[background];
    if (!config) {
        console.error(`Фон ${background} не знайдено`);
        return;
    }
    
    const body = document.body;
    const backgroundStyle = `linear-gradient(135deg, rgba(41, 39, 35, 0.4) 0%, rgba(28, 26, 23, 0.6) 50%, rgba(20, 19, 17, 0.8) 100%), url('${config.url}') center center / cover no-repeat`;
    
    body.style.background = backgroundStyle;
    body.style.backgroundAttachment = window.innerWidth > 768 ? 'fixed' : 'scroll';
    
    console.log(`Фон застосовано: ${background}`);
}

// Змінити фон
function changeBackground(background) {
    if (!backgroundOptions[background]) {
        console.error(`Недійсний фон: ${background}`);
        return;
    }
    
    // Зберегти налаштування
    saveBackground(background);
    
    // Застосувати фон
    applyBackground(background);
    
    // Оновити UI
    updateBackgroundUI();
    
    console.log(`Фон змінено на: ${background}`);
}

// Оновити UI фону
function updateBackgroundUI() {
    const currentBg = getCurrentBackground();
    
    // Оновити активні стани
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

// Повністю видалити всі статичні меню
function removeAllStaticMenus() {
    const existingMenus = document.querySelectorAll('.static-menu, .menu-top, .menu-bottom');
    existingMenus.forEach(menu => {
        menu.remove();
        console.log('Статичне меню видалено:', menu.className);
    });
}

// Застосувати позицію меню з правильним приховуванням/показом елементів
function applyMenuPosition(position) {
    if (!menuPositions[position]) {
        console.error(`Позицію меню ${position} не знайдено`);
        return;
    }
    
    const body = document.body;
    
    console.log(`🔄 Застосування позиції меню: ${position}`);
    
    // Видалити всі класи позицій меню
    Object.keys(menuPositions).forEach(pos => {
        body.classList.remove(`menu-${pos}`);
    });
    
    // Видалити всі існуючі статичні меню
    removeAllStaticMenus();
    
    // Додати новий клас позиції меню
    body.classList.add(`menu-${position}`);
    
    // Принудово закрити сайдбар
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    
    // Створити статичне меню для верхніх/нижніх позицій
    if (position === 'up' || position === 'down') {
        // Затримка для забезпечення правильного застосування CSS
        setTimeout(() => {
            createStaticMenu(position);
        }, 100);
    }
    
    console.log(`✅ Позицію меню застосовано: ${position}`);
}

// Створити статичне меню для верхніх/нижніх позицій тільки з іконками
function createStaticMenu(position) {
    console.log(`🔨 Створення статичного меню для позиції: ${position}`);
    
    // Переконатися, що всі старі меню видалені
    removeAllStaticMenus();
    
    const menuClass = position === 'up' ? 'menu-top' : 'menu-bottom';
    const staticMenu = document.createElement('div');
    staticMenu.className = `static-menu ${menuClass}`;
    staticMenu.id = 'staticMenu';
    
    // Створити контейнер навігаційних кнопок
    const navButtons = document.createElement('div');
    navButtons.className = 'nav-buttons';
    
    // Створити кнопки для всіх елементів меню тільки з іконками
    menuItems.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'nav-btn';
        btn.dataset.page = item.page;
        btn.title = item.title; // Підказка показує повну назву
        btn.textContent = item.icon; // Показувати тільки іконку
        
        btn.onclick = () => {
            // Використовувати глобальну функцію switchPage
            if (typeof window.switchPage === 'function') {
                window.switchPage(item.page);
            }
            updateStaticMenuActiveState(item.page);
        };
        
        navButtons.appendChild(btn);
    });
    
    staticMenu.appendChild(navButtons);
    document.body.appendChild(staticMenu);
    
    // Оновити активний стан для поточної сторінки
    const currentPage = typeof window.getCurrentPage === 'function' ? window.getCurrentPage() : 'calculator';
    updateStaticMenuActiveState(currentPage);
    
    console.log(`✅ Статичне ${position} меню створено з ${menuItems.length} елементами`);
}

// Видалити статичне меню
function removeStaticMenu() {
    removeAllStaticMenus();
}

// Оновити активний стан статичного меню
function updateStaticMenuActiveState(activePage) {
    const staticMenu = document.getElementById('staticMenu');
    if (!staticMenu) return;
    
    staticMenu.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === activePage) {
            btn.classList.add('active');
        }
    });
    
    console.log(`Активний стан статичного меню оновлено: ${activePage}`);
}

// Змінити позицію меню
function changeMenuPosition(position) {
    if (!menuPositions[position]) {
        console.error(`Недійсна позиція меню: ${position}`);
        return;
    }
    
    console.log(`🔄 Зміна позиції меню на: ${position}`);
    
    // Зберегти налаштування
    saveMenuPosition(position);
    
    // Застосувати позицію меню
    applyMenuPosition(position);
    
    // Оновити UI
    updateMenuPositionUI();
    
    console.log(`✅ Позицію меню змінено на: ${position}`);
}

// Оновити UI позиції меню
function updateMenuPositionUI() {
    const currentPos = getCurrentMenuPosition();
    
    // Оновити активні стани
    document.querySelectorAll('#settingsPage .menu-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.position === currentPos) {
            option.classList.add('active');
        }
    });
}

// Скинути налаштування до за замовчуванням
function resetSettings() {
    if (confirm(getTranslation('confirmReset', 'Ви впевнені, що хочете скинути всі налаштування?'))) {
        localStorage.removeItem('armHelper_background');
        localStorage.removeItem('armHelper_menuPosition');
        localStorage.removeItem('armHelper_categoriesState');
        
        // Скинути стан
        categoriesState = { background: false, menu: false };
        
        changeBackground('penguin');
        changeMenuPosition('left');
        applyCategoriesState();
        
        console.log('Налаштування скинуто до за замовчуванням');
    }
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
        // Резервний варіант
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
                up: "Top",
                down: "Bottom",
                left: "Left", 
                right: "Right",
                reset: "Reset Settings",
                confirmReset: "Are you sure you want to reset all settings?"
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
    if (!settingsInitialized) return;
    
    const currentLang = lang || (typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en');
    
    await loadSettingsTranslations();
    
    if (!settingsTranslations[currentLang]) {
        console.warn(`Мова налаштувань ${currentLang} не знайдена, використовуємо англійську`);
        return;
    }
    
    const translations = settingsTranslations[currentLang];
    
    // Оновити заголовок
    const titleElement = document.querySelector('#settingsPage .settings-title');
    if (titleElement) {
        titleElement.textContent = translations.title;
    }
    
    // Оновити заголовок секції фону
    const backgroundSectionTitle = document.querySelector('#settingsPage [data-category="background"] .category-title span:last-child');
    if (backgroundSectionTitle) {
        backgroundSectionTitle.textContent = translations.background;
    }
    
    // Оновити заголовок секції меню
    const menuSectionTitle = document.querySelector('#settingsPage [data-category="menu"] .category-title span:last-child');
    if (menuSectionTitle) {
        menuSectionTitle.textContent = translations.menu;
    }
    
    // Оновити назви опцій фону
    Object.keys(backgroundOptions).forEach(bg => {
        const option = document.querySelector(`#settingsPage [data-background="${bg}"] .option-name`);
        if (option && translations[bg]) {
            option.textContent = translations[bg];
        }
    });
    
    // Оновити назви опцій позиції меню
    Object.keys(menuPositions).forEach(pos => {
        const option = document.querySelector(`#settingsPage [data-position="${pos}"] .menu-option-name`);
        if (option && translations[pos]) {
            option.textContent = translations[pos];
        }
    });
    
    // Оновити кнопку скидання
    const resetBtn = document.querySelector('#settingsPage .reset-btn');
    if (resetBtn && translations.reset) {
        resetBtn.textContent = translations.reset;
    }
    
    console.log(`✅ Мову налаштувань оновлено до ${currentLang}`);
}

// Створити HTML налаштувань без тексту (буде заповнено системою мови)
function createSettingsHTML() {
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
                
                <div class="background-options collapsed">
                    <div class="background-option" data-background="penguin" onclick="changeBackground('penguin')">
                        <div class="option-icon">🐧</div>
                        <div class="option-name"></div>
                        <div class="background-preview" style="background-image: url('${backgroundOptions.penguin.url}')"></div>
                    </div>
                    
                    <div class="background-option" data-background="game" onclick="changeBackground('game')">
                        <div class="option-icon">🎮</div>
                        <div class="option-name"></div>
                        <div class="background-preview" style="background-image: url('${backgroundOptions.game.url}')"></div>
                    </div>
                    
                    <div class="background-option" data-background="code" onclick="changeBackground('code')">
                        <div class="option-icon">💻</div>
                        <div class="option-name"></div>
                        <div class="background-preview" style="background-image: url('${backgroundOptions.code.url}')"></div>
                    </div>
                    
                    <div class="background-option" data-background="dodep" onclick="changeBackground('dodep')">
                        <div class="option-icon">🎮</div>
                        <div class="option-name"></div>
                        <div class="background-preview" style="background-image: url('${backgroundOptions.dodep.url}')"></div>
                    </div>
                    
                    <div class="background-option" data-background="prison" onclick="changeBackground('prison')">
                        <div class="option-icon">🎮</div>
                        <div class="option-name"></div>
                        <div class="background-preview" style="background-image: url('${backgroundOptions.prison.url}')"></div>
                    </div>
                </div>
            </div>
            
            <div class="settings-section" data-category="menu">
                <div class="category-header collapsed" onclick="toggleSettingsCategory('menu')">
                    <div class="category-title">
                        <span class="section-icon">📱</span>
                        <span></span>
                    </div>
                    <span class="category-toggle">▼</span>
                </div>
                
                <div class="menu-options collapsed">
                    <div class="menu-option" data-position="up" onclick="changeMenuPosition('up')">
                        <div class="menu-option-icon">⬆️</div>
                        <div class="menu-option-name"></div>
                    </div>
                    
                    <div class="menu-option" data-position="left" onclick="changeMenuPosition('left')">
                        <div class="menu-option-icon">⬅️</div>
                        <div class="menu-option-name"></div>
                    </div>
                    
                    <div class="menu-option" data-position="right" onclick="changeMenuPosition('right')">
                        <div class="menu-option-icon">➡️</div>
                        <div class="menu-option-name"></div>
                    </div>
                    
                    <div class="menu-option" data-position="down" onclick="changeMenuPosition('down')">
                        <div class="menu-option-icon">⬇️</div>
                        <div class="menu-option-name"></div>
                    </div>
                </div>
            </div>
            
            <div class="reset-section">
                <button class="reset-btn" onclick="resetSettings()"></button>
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
    
    console.log('⚙️ Ініціалізація налаштувань...');
    
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
    
    // Застосувати поточний фон
    const currentBg = getCurrentBackground();
    applyBackground(currentBg);
    updateBackgroundUI();
    
    // Застосувати поточну позицію меню
    const currentMenuPos = getCurrentMenuPosition();
    applyMenuPosition(currentMenuPos);
    updateMenuPositionUI();
    
    // Застосувати стан категорій
    applyCategoriesState();
    
    // Оновити мову
    await updateSettingsLanguage();
    
    settingsInitialized = true;
    console.log('✅ Налаштування ініціалізовано');
}

// Застосувати фон і позицію меню при запуску додатка
function initializeSettingsOnStart() {
    const currentBg = getCurrentBackground();
    applyBackground(currentBg);
    console.log(`Початковий фон застосовано: ${currentBg}`);
    
    const currentMenuPos = getCurrentMenuPosition();
    
    // Додати клас для поточної позиції меню до body
    const body = document.body;
    Object.keys(menuPositions).forEach(pos => {
        body.classList.remove(`menu-${pos}`);
    });
    body.classList.add(`menu-${currentMenuPos}`);
    
    applyMenuPosition(currentMenuPos);
    console.log(`Початкову позицію меню застосовано: ${currentMenuPos}`);
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

// Застосувати налаштування негайно при завантаженні скрипта
document.addEventListener('DOMContentLoaded', () => {
    initializeSettingsOnStart();
});

// Якщо DOM вже завантажено, застосувати негайно
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSettingsOnStart);
} else {
    initializeSettingsOnStart();
}

// Глобальні функції
window.initializeSettings = initializeSettings;
window.changeBackground = changeBackground;
window.changeMenuPosition = changeMenuPosition;
window.resetSettings = resetSettings;
window.toggleSettingsCategory = toggleSettingsCategory;
window.updateSettingsLanguage = updateSettingsLanguage;
window.updateStaticMenuActiveState = updateStaticMenuActiveState;
