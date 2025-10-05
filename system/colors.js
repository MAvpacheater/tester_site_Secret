// Color Theme Manager - система управління кольоровими темами
let colorsInitialized = false;

const colorThemes = {
    blackOrange: {
        name: { en: 'Black & Orange', uk: 'Чорний з Оранжевим', ru: 'Черный с Оранжевым' },
        primary: '#D97000',
        secondary: '#000000',
        gradient: 'linear-gradient(135deg, rgba(10, 10, 10, 0.98) 0%, rgba(30, 20, 0, 0.99) 50%, rgba(5, 5, 5, 1) 100%)',
        border: '#D97000',
        text: '#D98D33',
        textSecondary: '#E0B366',
        buttonBg: 'rgba(30, 20, 0, 0.5)',
        buttonBorder: 'rgba(217, 112, 0, 0.4)',
        icon: '🟠'
    },
    navyGray: {
        name: { en: 'Navy & Gray', uk: 'Темно-синій з Сірим', ru: 'Темно-синий с Серым' },
        primary: '#5B7C99',
        secondary: '#2C3E50',
        gradient: 'linear-gradient(135deg, rgba(20, 30, 40, 0.98) 0%, rgba(35, 45, 55, 0.99) 50%, rgba(15, 25, 35, 1) 100%)',
        border: '#5B7C99',
        text: '#9DB4C8',
        textSecondary: '#B8C5D6',
        buttonBg: 'rgba(35, 45, 55, 0.5)',
        buttonBorder: 'rgba(91, 124, 153, 0.4)',
        icon: '🔷'
    },
    mintGray: {
        name: { en: 'Mint & Gray', uk: "М'ятний з Сірим", ru: 'Мятный с Серым' },
        primary: '#6B9B8E',
        secondary: '#34495E',
        gradient: 'linear-gradient(135deg, rgba(25, 35, 40, 0.98) 0%, rgba(40, 50, 55, 0.99) 50%, rgba(20, 30, 35, 1) 100%)',
        border: '#6B9B8E',
        text: '#8FB3A6',
        textSecondary: '#A8C7BC',
        buttonBg: 'rgba(40, 50, 55, 0.5)',
        buttonBorder: 'rgba(107, 155, 142, 0.4)',
        icon: '💚'
    },
    burgundyBeige: {
        name: { en: 'Burgundy & Beige', uk: 'Бордовий з Бежевим', ru: 'Бордовый с Бежевым' },
        primary: '#9B5C5C',
        secondary: '#3D2626',
        gradient: 'linear-gradient(135deg, rgba(30, 20, 20, 0.98) 0%, rgba(45, 30, 30, 0.99) 50%, rgba(25, 15, 15, 1) 100%)',
        border: '#9B5C5C',
        text: '#B88080',
        textSecondary: '#CCA3A3',
        buttonBg: 'rgba(45, 30, 30, 0.5)',
        buttonBorder: 'rgba(155, 92, 92, 0.4)',
        icon: '🍷'
    },
    forestBrown: {
        name: { en: 'Forest & Brown', uk: 'Лісовий з Коричневим', ru: 'Лесной с Коричневым' },
        primary: '#7A9B6C',
        secondary: '#2D3A26',
        gradient: 'linear-gradient(135deg, rgba(20, 25, 15, 0.98) 0%, rgba(35, 45, 30, 0.99) 50%, rgba(15, 20, 10, 1) 100%)',
        border: '#7A9B6C',
        text: '#95B087',
        textSecondary: '#B0C5A3',
        buttonBg: 'rgba(35, 45, 30, 0.5)',
        buttonBorder: 'rgba(122, 155, 108, 0.4)',
        icon: '🌲'
    },
    slateBlue: {
        name: { en: 'Slate & Blue', uk: 'Сірий з Блакитним', ru: 'Серый с Голубым' },
        primary: '#6B8FA3',
        secondary: '#2F3D4A',
        gradient: 'linear-gradient(135deg, rgba(25, 30, 35, 0.98) 0%, rgba(40, 50, 60, 0.99) 50%, rgba(20, 25, 30, 1) 100%)',
        border: '#6B8FA3',
        text: '#8AA8BA',
        textSecondary: '#A8BFD1',
        buttonBg: 'rgba(40, 50, 60, 0.5)',
        buttonBorder: 'rgba(107, 143, 163, 0.4)',
        icon: '🌊'
    },
    plumGray: {
        name: { en: 'Plum & Gray', uk: 'Сливовий з Сірим', ru: 'Сливовый с Серым' },
        primary: '#8B7A9B',
        secondary: '#3A3147',
        gradient: 'linear-gradient(135deg, rgba(30, 25, 35, 0.98) 0%, rgba(45, 40, 55, 0.99) 50%, rgba(25, 20, 30, 1) 100%)',
        border: '#8B7A9B',
        text: '#A695B3',
        textSecondary: '#C2B3CC',
        buttonBg: 'rgba(45, 40, 55, 0.5)',
        buttonBorder: 'rgba(139, 122, 155, 0.4)',
        icon: '🟣'
    },
    chocolateCream: {
        name: { en: 'Chocolate & Cream', uk: 'Шоколадний з Кремовим', ru: 'Шоколадный с Кремовым' },
        primary: '#9B8066',
        secondary: '#2E2419',
        gradient: 'linear-gradient(135deg, rgba(25, 20, 15, 0.98) 0%, rgba(40, 32, 24, 0.99) 50%, rgba(20, 15, 10, 1) 100%)',
        border: '#9B8066',
        text: '#B39980',
        textSecondary: '#CCB399',
        buttonBg: 'rgba(40, 32, 24, 0.5)',
        buttonBorder: 'rgba(155, 128, 102, 0.4)',
        icon: '🍫'
    },
    midnightGold: {
        name: { en: 'Midnight & Gold', uk: 'Темно-синій з Золотим', ru: 'Темно-синий с Золотым' },
        primary: '#B8A369',
        secondary: '#1A2332',
        gradient: 'linear-gradient(135deg, rgba(15, 20, 30, 0.98) 0%, rgba(25, 35, 50, 0.99) 50%, rgba(10, 15, 25, 1) 100%)',
        border: '#B8A369',
        text: '#CCB880',
        textSecondary: '#E0CC99',
        buttonBg: 'rgba(25, 35, 50, 0.5)',
        buttonBorder: 'rgba(184, 163, 105, 0.4)',
        icon: '⭐'
    }
};

function getCurrentColorTheme() {
    const saved = localStorage.getItem('armHelper_colorTheme');
    // Якщо збережена стара тема (halloween), замінюємо на blackOrange
    if (saved === 'halloween') {
        localStorage.setItem('armHelper_colorTheme', 'blackOrange');
        return 'blackOrange';
    }
    return saved || 'blackOrange';
}

function saveColorTheme(theme) {
    localStorage.setItem('armHelper_colorTheme', theme);
}

function applyColorTheme(themeName) {
    const theme = colorThemes[themeName];
    if (!theme) {
        console.error('Theme not found:', themeName);
        return;
    }
    
    const root = document.documentElement;
    
    // Встановлюємо CSS змінні
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--border-color', theme.border);
    root.style.setProperty('--text-color', theme.text);
    root.style.setProperty('--text-secondary-color', theme.textSecondary);
    root.style.setProperty('--button-bg', theme.buttonBg);
    root.style.setProperty('--button-border', theme.buttonBorder);
    
    // Оновлюємо фон для sidebar та інших елементів
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.style.background = theme.gradient;
    }
    
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.style.background = theme.gradient;
        mobileToggle.style.borderColor = theme.border;
        mobileToggle.style.color = theme.primary;
    }
    
    // Оновлюємо menu lines
    document.querySelectorAll('.menu-line').forEach(line => {
        line.style.background = `linear-gradient(90deg, ${theme.primary}, ${theme.border})`;
        line.style.boxShadow = `0 0 8px ${theme.primary}80`;
    });
    
    // Оновлюємо всі елементи меню
    updateMenuColors(theme);
    updateButtonColors(theme);
    updateContainerColors(theme);
    updateSettingsPageColors(theme);
    
    console.log('✅ Applied color theme:', themeName);
}

function updateMenuColors(theme) {
    // Оновлюємо sidebar header
    const sidebarHeader = document.querySelector('.sidebar-header');
    if (sidebarHeader) {
        sidebarHeader.style.background = theme.buttonBg;
        sidebarHeader.style.borderBottomColor = theme.buttonBorder;
    }
    
    const sidebarHeaderTitle = document.querySelector('.sidebar-header h3');
    if (sidebarHeaderTitle) {
        sidebarHeaderTitle.style.color = theme.primary;
    }
    
    // Оновлюємо категорії
    document.querySelectorAll('.category-header').forEach(header => {
        header.style.background = theme.buttonBg;
        header.style.borderColor = theme.buttonBorder;
        header.style.color = theme.primary;
    });
    
    // Оновлюємо кнопки навігації
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (!btn.classList.contains('active')) {
            btn.style.background = theme.buttonBg;
            btn.style.borderColor = theme.buttonBorder;
            btn.style.color = theme.textSecondary;
        } else {
            btn.style.background = theme.primary;
            btn.style.borderColor = theme.border;
            btn.style.color = '#000';
            btn.style.boxShadow = `0 4px 15px ${theme.primary}66`;
        }
    });
    
    // Оновлюємо sidebar controls
    const sidebarControls = document.querySelector('.sidebar-controls');
    if (sidebarControls) {
        sidebarControls.style.background = theme.buttonBg;
        sidebarControls.style.borderTopColor = theme.buttonBorder;
    }
    
    // Оновлюємо sidebar user
    const sidebarUser = document.querySelector('.sidebar-user');
    if (sidebarUser) {
        sidebarUser.style.background = theme.buttonBg;
        sidebarUser.style.borderTopColor = theme.buttonBorder;
    }
    
    // Оновлюємо auth button
    const authBtn = document.querySelector('.auth-btn-sidebar');
    if (authBtn) {
        authBtn.style.background = `${theme.border}80`;
        authBtn.style.borderColor = theme.border;
        authBtn.style.color = theme.primary;
    }
    
    // Оновлюємо кнопки мов
    document.querySelectorAll('.lang-flag-btn').forEach(btn => {
        if (!btn.classList.contains('active')) {
            btn.style.background = theme.buttonBg;
            btn.style.borderColor = theme.buttonBorder;
            btn.style.color = theme.textSecondary;
        } else {
            btn.style.background = theme.primary;
            btn.style.borderColor = theme.border;
            btn.style.color = '#000';
            btn.style.boxShadow = `0 4px 15px ${theme.primary}66`;
        }
    });
}

function updateButtonColors(theme) {
    // Оновлюємо всі кнопки настройок
    document.querySelectorAll('.settings-btn-sidebar').forEach(btn => {
        btn.style.background = theme.buttonBg;
        btn.style.borderColor = theme.buttonBorder;
        btn.style.color = theme.textSecondary;
    });
    
    // Оновлюємо close sidebar кнопку
    const closeBtn = document.querySelector('.close-sidebar');
    if (closeBtn) {
        closeBtn.style.background = theme.buttonBg;
        closeBtn.style.borderColor = theme.buttonBorder;
        closeBtn.style.color = theme.primary;
    }
    
    // Оновлюємо static menu buttons
    document.querySelectorAll('.static-menu .nav-btn').forEach(btn => {
        if (!btn.classList.contains('active')) {
            btn.style.background = `linear-gradient(135deg, ${theme.buttonBg}, ${theme.secondary}33)`;
            btn.style.borderColor = theme.buttonBorder;
            btn.style.color = theme.text;
        } else {
            btn.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.border})`;
            btn.style.borderColor = theme.text;
            btn.style.color = '#FFF';
            btn.style.boxShadow = `0 4px 20px ${theme.primary}80`;
        }
    });
    
    // Оновлюємо settings button в static menu
    const settingsBtnStatic = document.querySelector('.settings-btn-static');
    if (settingsBtnStatic) {
        if (!settingsBtnStatic.classList.contains('active')) {
            settingsBtnStatic.style.background = `linear-gradient(135deg, ${theme.buttonBg}, ${theme.secondary}33)`;
            settingsBtnStatic.style.borderColor = theme.buttonBorder;
            settingsBtnStatic.style.color = theme.text;
        } else {
            settingsBtnStatic.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.border})`;
            settingsBtnStatic.style.borderColor = theme.text;
            settingsBtnStatic.style.color = '#FFF';
            settingsBtnStatic.style.boxShadow = `0 4px 20px ${theme.primary}80`;
        }
    }
    
    // Оновлюємо static menu
    const staticMenu = document.querySelector('.static-menu');
    if (staticMenu) {
        staticMenu.style.background = theme.gradient;
        if (staticMenu.classList.contains('menu-top')) {
            staticMenu.style.borderBottomColor = theme.border;
        } else if (staticMenu.classList.contains('menu-bottom')) {
            staticMenu.style.borderTopColor = theme.border;
        }
        staticMenu.style.boxShadow = `
            0 2px 25px ${theme.border}99,
            0 0 30px ${theme.primary}4D
        `;
        
        // Додаємо стилі для scrollbar через CSS змінні
        staticMenu.style.setProperty('--scrollbar-track', `${theme.buttonBg}`);
        staticMenu.style.setProperty('--scrollbar-thumb', `linear-gradient(90deg, ${theme.primary}, ${theme.border})`);
        staticMenu.style.setProperty('--scrollbar-thumb-hover', `linear-gradient(90deg, ${theme.primary}E6, ${theme.border}E6)`);
    }
}

function updateContainerColors(theme) {
    // Body залишається з background зображенням - НЕ ЧІПАЄМО!
    
    // Оновлюємо container (де весь контент)
    const container = document.querySelector('.container');
    if (container) {
        // Змінюємо тільки background-color, а не весь background
        container.style.backgroundColor = `${theme.secondary}F5`; // Майже непрозорий
        container.style.borderColor = theme.border;
        container.style.boxShadow = `
            0 10px 30px ${theme.secondary}B3,
            0 0 50px ${theme.border}66,
            inset 0 0 50px ${theme.primary}1A
        `;
    }
    
    // Оновлюємо signature
    const signature = document.querySelector('.signature');
    if (signature) {
        signature.style.background = theme.buttonBg;
        signature.style.borderColor = theme.buttonBorder;
        signature.style.color = theme.primary;
    }
    
    // Оновлюємо loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.background = theme.border;
        loadingScreen.style.color = theme.primary;
    }
    
    // Оновлюємо auto-reload indicator
    const autoReload = document.querySelector('.auto-reload-indicator');
    if (autoReload) {
        autoReload.style.background = `${theme.secondary}E6`;
        autoReload.style.color = theme.primary;
        autoReload.style.borderColor = `${theme.primary}80`;
    }
    
    // Оновлюємо sidebar overlay
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.style.background = `${theme.secondary}CC`;
    }
}

// НОВА ФУНКЦІЯ для Settings Page
function updateSettingsPageColors(theme) {
    const settingsPage = document.getElementById('settingsPage');
    if (!settingsPage) return;
    
    // Оновлюємо заголовок Settings
    const settingsTitle = settingsPage.querySelector('.settings-title');
    if (settingsTitle) {
        settingsTitle.style.color = theme.primary;
        settingsTitle.style.textShadow = `
            3px 3px 6px rgba(0, 0, 0, 0.9),
            0 0 20px ${theme.primary}99,
            0 0 40px ${theme.border}66
        `;
    }
    
    // Оновлюємо всі settings-section
    settingsPage.querySelectorAll('.settings-section').forEach(section => {
        section.style.background = theme.gradient;
        section.style.borderColor = theme.border;
        section.style.boxShadow = `
            0 10px 40px ${theme.border}66,
            inset 0 2px 10px ${theme.primary}33,
            0 0 30px ${theme.border}4D
        `;
        
        // Оновлюємо ::before через додавання inline style
        const beforeGradient = `linear-gradient(90deg, transparent 0%, ${theme.primary}B3 50%, transparent 100%)`;
        section.style.setProperty('--before-gradient', beforeGradient);
    });
    
    // Оновлюємо category headers
    settingsPage.querySelectorAll('.category-header').forEach(header => {
        header.style.color = theme.primary;
        header.style.textShadow = `
            2px 2px 4px rgba(0, 0, 0, 0.9),
            0 0 15px ${theme.primary}80
        `;
    });
    
    // Оновлюємо category toggle
    settingsPage.querySelectorAll('.category-toggle').forEach(toggle => {
        toggle.style.color = theme.border;
    });
    
    // Оновлюємо всі опції (background, menu, color)
    const allOptions = [
        ...settingsPage.querySelectorAll('.background-option'),
        ...settingsPage.querySelectorAll('.menu-option'),
        ...settingsPage.querySelectorAll('.color-option')
    ];
    
    allOptions.forEach(option => {
        if (!option.classList.contains('active')) {
            option.style.background = `linear-gradient(135deg, ${theme.buttonBg}, ${theme.secondary}33)`;
            option.style.borderColor = theme.buttonBorder;
        } else {
            option.style.background = `linear-gradient(135deg, ${theme.primary}66, ${theme.border}4D)`;
            option.style.borderColor = theme.primary;
            option.style.boxShadow = `0 8px 35px ${theme.primary}80`;
        }
    });
    
    // Оновлюємо текст в опціях
    settingsPage.querySelectorAll('.option-name, .menu-option-name, .color-option-name').forEach(name => {
        name.style.color = theme.text;
        name.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.9)';
    });
    
    // Оновлюємо іконки
    settingsPage.querySelectorAll('.option-icon, .menu-option-icon, .color-option-icon, .section-icon').forEach(icon => {
        icon.style.filter = `drop-shadow(0 0 8px ${theme.primary}99)`;
    });
    
    // Оновлюємо preview borders
    settingsPage.querySelectorAll('.background-preview, .color-preview').forEach(preview => {
        preview.style.borderColor = theme.buttonBorder;
    });
    
    // Оновлюємо checkmarks для active items
    settingsPage.querySelectorAll('.background-option.active::after, .menu-option.active::after, .color-option.active::after').forEach(item => {
        item.style.color = theme.primary;
    });
}

function changeColorTheme(themeName) {
    if (!colorThemes[themeName]) {
        console.error('Invalid theme:', themeName);
        return;
    }
    
    saveColorTheme(themeName);
    applyColorTheme(themeName);
    
    if (typeof updateColorThemeUI === 'function') {
        updateColorThemeUI();
    }
    
    // Надсилаємо подію про зміну теми
    const event = new CustomEvent('colorThemeChanged', {
        detail: { theme: themeName }
    });
    document.dispatchEvent(event);
    
    console.log('✅ Color theme changed to:', themeName);
}

function updateColorThemeUI() {
    const currentTheme = getCurrentColorTheme();
    const options = document.querySelectorAll('#settingsPage .color-option');
    
    options.forEach(option => {
        option.classList.toggle('active', option.dataset.theme === currentTheme);
    });
}

function initializeColors() {
    if (colorsInitialized) return;
    
    const currentTheme = getCurrentColorTheme();
    applyColorTheme(currentTheme);
    
    colorsInitialized = true;
    console.log('✅ Colors initialized with theme:', currentTheme);
}

function initializeColorsOnStart() {
    const currentTheme = getCurrentColorTheme();
    applyColorTheme(currentTheme);
}

// Ініціалізація при завантаженні
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeColorsOnStart);
} else {
    initializeColorsOnStart();
}

// Слухаємо зміну сторінки для оновлення кольорів
document.addEventListener('pageChanged', (e) => {
    const currentTheme = getCurrentColorTheme();
    setTimeout(() => {
        applyColorTheme(currentTheme);
        // Якщо перейшли на Settings, оновлюємо UI
        if (e.detail && e.detail.page === 'settings') {
            setTimeout(() => {
                if (typeof updateColorThemeUI === 'function') {
                    updateColorThemeUI();
                }
            }, 100);
        }
    }, 100);
});

// Global exports
window.colorThemes = colorThemes;
window.getCurrentColorTheme = getCurrentColorTheme;
window.saveColorTheme = saveColorTheme;
window.applyColorTheme = applyColorTheme;
window.changeColorTheme = changeColorTheme;
window.updateColorThemeUI = updateColorThemeUI;
window.initializeColors = initializeColors;

console.log('✅ Colors.js loaded with', Object.keys(colorThemes).length, 'themes');
