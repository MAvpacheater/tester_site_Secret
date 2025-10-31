// Professional Color Theme Manager
let colorsInitialized = false;

const colorThemes = {
    defaultBlue: {
        name: { en: 'Default Blue', uk: 'Стандартний Синій', ru: 'Стандартный Синий' },
        primary: '#60a5fa',
        secondary: '#1a1a1a',
        gradient: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
        border: '#60a5fa',
        text: '#b0b0b0',
        textSecondary: '#e0e0e0',
        buttonBg: 'rgba(255, 255, 255, 0.03)',
        buttonBorder: 'rgba(255, 255, 255, 0.08)',
        icon: '💙'
    },
    emerald: {
        name: { en: 'Emerald', uk: 'Смарагдовий', ru: 'Изумрудный' },
        primary: '#10b981',
        secondary: '#1a1a1a',
        gradient: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
        border: '#10b981',
        text: '#b0b0b0',
        textSecondary: '#e0e0e0',
        buttonBg: 'rgba(255, 255, 255, 0.03)',
        buttonBorder: 'rgba(255, 255, 255, 0.08)',
        icon: '💚'
    },
    violet: {
        name: { en: 'Violet', uk: 'Фіолетовий', ru: 'Фиолетовый' },
        primary: '#a78bfa',
        secondary: '#1a1a1a',
        gradient: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
        border: '#a78bfa',
        text: '#b0b0b0',
        textSecondary: '#e0e0e0',
        buttonBg: 'rgba(255, 255, 255, 0.03)',
        buttonBorder: 'rgba(255, 255, 255, 0.08)',
        icon: '💜'
    },
    amber: {
        name: { en: 'Amber', uk: 'Бурштиновий', ru: 'Янтарный' },
        primary: '#f59e0b',
        secondary: '#1a1a1a',
        gradient: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
        border: '#f59e0b',
        text: '#b0b0b0',
        textSecondary: '#e0e0e0',
        buttonBg: 'rgba(255, 255, 255, 0.03)',
        buttonBorder: 'rgba(255, 255, 255, 0.08)',
        icon: '🧡'
    },
    rose: {
        name: { en: 'Rose', uk: 'Рожевий', ru: 'Розовый' },
        primary: '#f43f5e',
        secondary: '#1a1a1a',
        gradient: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
        border: '#f43f5e',
        text: '#b0b0b0',
        textSecondary: '#e0e0e0',
        buttonBg: 'rgba(255, 255, 255, 0.03)',
        buttonBorder: 'rgba(255, 255, 255, 0.08)',
        icon: '🌹'
    },
    cyan: {
        name: { en: 'Cyan', uk: 'Бірюзовий', ru: 'Бирюзовый' },
        primary: '#06b6d4',
        secondary: '#1a1a1a',
        gradient: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
        border: '#06b6d4',
        text: '#b0b0b0',
        textSecondary: '#e0e0e0',
        buttonBg: 'rgba(255, 255, 255, 0.03)',
        buttonBorder: 'rgba(255, 255, 255, 0.08)',
        icon: '🩵'
    },
    lime: {
        name: { en: 'Lime', uk: 'Лаймовий', ru: 'Лаймовый' },
        primary: '#84cc16',
        secondary: '#1a1a1a',
        gradient: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
        border: '#84cc16',
        text: '#b0b0b0',
        textSecondary: '#e0e0e0',
        buttonBg: 'rgba(255, 255, 255, 0.03)',
        buttonBorder: 'rgba(255, 255, 255, 0.08)',
        icon: '💛'
    },
    slate: {
        name: { en: 'Slate', uk: 'Сірий', ru: 'Серый' },
        primary: '#64748b',
        secondary: '#1a1a1a',
        gradient: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
        border: '#64748b',
        text: '#b0b0b0',
        textSecondary: '#e0e0e0',
        buttonBg: 'rgba(255, 255, 255, 0.03)',
        buttonBorder: 'rgba(255, 255, 255, 0.08)',
        icon: '🩶'
    },
    crimson: {
        name: { en: 'Crimson', uk: 'Багряний', ru: 'Багровый' },
        primary: '#dc2626',
        secondary: '#1a1a1a',
        gradient: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
        border: '#dc2626',
        text: '#b0b0b0',
        textSecondary: '#e0e0e0',
        buttonBg: 'rgba(255, 255, 255, 0.03)',
        buttonBorder: 'rgba(255, 255, 255, 0.08)',
        icon: '❤️'
    }
};

function getCurrentColorTheme() {
    const saved = localStorage.getItem('armHelper_colorTheme');
    // Migrate old Halloween theme to default
    if (saved === 'halloween' || saved === 'blackOrange') {
        localStorage.setItem('armHelper_colorTheme', 'defaultBlue');
        return 'defaultBlue';
    }
    return saved || 'defaultBlue';
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
    
    // Set CSS variables
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--border-color', theme.border);
    root.style.setProperty('--text-color', theme.text);
    root.style.setProperty('--text-secondary-color', theme.textSecondary);
    root.style.setProperty('--button-bg', theme.buttonBg);
    root.style.setProperty('--button-border', theme.buttonBorder);
    
    // Update sidebar background
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.style.background = theme.gradient;
    }
    
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.style.background = theme.gradient;
        mobileToggle.style.borderColor = `rgba(255, 255, 255, 0.1)`;
        mobileToggle.style.color = theme.primary;
    }
    
    // Update menu lines
    document.querySelectorAll('.menu-line').forEach(line => {
        line.style.background = theme.primary;
    });
    
    updateMenuColors(theme);
    updateButtonColors(theme);
    updateContainerColors(theme);
    updateSettingsPageColors(theme);
    
    console.log('✅ Applied color theme:', themeName);
}

function updateMenuColors(theme) {
    // Sidebar header
    const sidebarHeader = document.querySelector('.sidebar-header');
    if (sidebarHeader) {
        sidebarHeader.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
    }
    
    const sidebarHeaderTitle = document.querySelector('.sidebar-header h3');
    if (sidebarHeaderTitle) {
        sidebarHeaderTitle.style.color = theme.primary;
    }
    
    // Categories
    document.querySelectorAll('.category-header').forEach(header => {
        header.style.background = `rgba(${hexToRgb(theme.primary)}, 0.08)`;
        header.style.borderColor = `rgba(${hexToRgb(theme.primary)}, 0.2)`;
        header.style.color = theme.primary;
    });
    
    // Nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (!btn.classList.contains('active')) {
            btn.style.background = theme.buttonBg;
            btn.style.borderColor = theme.buttonBorder;
            btn.style.color = theme.text;
        } else {
            btn.style.background = theme.primary;
            btn.style.borderColor = theme.border;
            btn.style.color = '#000';
        }
    });
    
    // Sidebar controls
    const sidebarControls = document.querySelector('.sidebar-controls');
    if (sidebarControls) {
        sidebarControls.style.borderTopColor = 'rgba(255, 255, 255, 0.08)';
    }
    
    // Auth button
    const authBtn = document.querySelector('.auth-btn-sidebar');
    if (authBtn) {
        authBtn.style.background = `rgba(${hexToRgb(theme.border)}, 0.1)`;
        authBtn.style.borderColor = theme.border;
        authBtn.style.color = theme.primary;
    }
    
    // Language buttons
    document.querySelectorAll('.lang-flag-btn').forEach(btn => {
        if (!btn.classList.contains('active')) {
            btn.style.background = theme.buttonBg;
            btn.style.borderColor = theme.buttonBorder;
            btn.style.color = theme.text;
        } else {
            btn.style.background = theme.primary;
            btn.style.borderColor = theme.border;
            btn.style.color = '#000';
        }
    });
}

function updateButtonColors(theme) {
    // Settings button
    document.querySelectorAll('.settings-btn-sidebar').forEach(btn => {
        btn.style.background = theme.buttonBg;
        btn.style.borderColor = theme.buttonBorder;
        btn.style.color = theme.text;
    });
    
    // Close button
    const closeBtn = document.querySelector('.close-sidebar');
    if (closeBtn) {
        closeBtn.style.background = theme.buttonBg;
        closeBtn.style.borderColor = theme.buttonBorder;
        closeBtn.style.color = theme.textSecondary;
    }
    
    // Static menu buttons
    document.querySelectorAll('.static-menu .nav-btn').forEach(btn => {
        if (!btn.classList.contains('active')) {
            btn.style.background = theme.buttonBg;
            btn.style.borderColor = theme.buttonBorder;
            btn.style.color = theme.text;
        } else {
            btn.style.background = theme.primary;
            btn.style.borderColor = theme.primary;
            btn.style.color = '#000';
        }
    });
    
    // Static menu
    const staticMenu = document.querySelector('.static-menu');
    if (staticMenu) {
        staticMenu.style.background = theme.gradient;
        staticMenu.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    }
}

function updateContainerColors(theme) {
    // Container
    const container = document.querySelector('.container');
    if (container) {
        container.style.backgroundColor = `rgba(18, 18, 18, 0.95)`;
        container.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    }
    
    // Signature
    const signature = document.querySelector('.signature');
    if (signature) {
        signature.style.background = 'rgba(18, 18, 18, 0.9)';
        signature.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        signature.style.color = theme.primary;
    }
    
    // Loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.background = '#0a0a0a';
        loadingScreen.style.color = theme.primary;
    }
    
    // Auto-reload indicator
    const autoReload = document.querySelector('.auto-reload-indicator');
    if (autoReload) {
        autoReload.style.background = 'rgba(18, 18, 18, 0.95)';
        autoReload.style.color = theme.primary;
        autoReload.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    }
    
    // Sidebar overlay
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.style.background = 'rgba(0, 0, 0, 0.6)';
    }
}

function updateSettingsPageColors(theme) {
    const settingsPage = document.getElementById('settingsPage');
    if (!settingsPage) return;
    
    // Settings title
    const settingsTitle = settingsPage.querySelector('.settings-title');
    if (settingsTitle) {
        settingsTitle.style.color = theme.primary;
    }
    
    // Settings sections
    settingsPage.querySelectorAll('.settings-section').forEach(section => {
        section.style.background = 'rgba(18, 18, 18, 0.8)';
        section.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    });
    
    // Category headers
    settingsPage.querySelectorAll('.category-header').forEach(header => {
        header.style.color = theme.primary;
    });
    
    // Options
    const allOptions = [
        ...settingsPage.querySelectorAll('.background-option'),
        ...settingsPage.querySelectorAll('.menu-option'),
        ...settingsPage.querySelectorAll('.color-option')
    ];
    
    allOptions.forEach(option => {
        if (!option.classList.contains('active')) {
            option.style.background = theme.buttonBg;
            option.style.borderColor = theme.buttonBorder;
        } else {
            option.style.background = `rgba(${hexToRgb(theme.primary)}, 0.2)`;
            option.style.borderColor = theme.primary;
        }
    });
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '96, 165, 250';
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

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeColorsOnStart);
} else {
    initializeColorsOnStart();
}

// Listen for page changes
document.addEventListener('pageChanged', (e) => {
    const currentTheme = getCurrentColorTheme();
    setTimeout(() => {
        applyColorTheme(currentTheme);
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
