// ========== THEME SWITCHER (DARK/LIGHT/WINTER) ==========
(function() {
    'use strict';
    
    if (window.themeSwitcherInitialized) return;

    // ========== THEME DEFINITIONS ==========
    const THEMES = {
        dark: {
            name: { en: 'Dark Theme', uk: 'Темна Тема', ru: 'Темная Тема' },
            icon: '🌙',
            colors: {
                primary: '#60a5fa',
                background: '#0a0a0a',
                container: 'rgba(18, 18, 18, 0.95)',
                text: '#b0b0b0',
                textSecondary: '#e0e0e0',
                border: 'rgba(255, 255, 255, 0.08)',
                buttonBg: 'rgba(255, 255, 255, 0.03)',
                buttonBorder: 'rgba(255, 255, 255, 0.08)',
                sidebarBg: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)'
            }
        },
        light: {
            name: { en: 'Light Theme', uk: 'Світла Тема', ru: 'Светлая Тема' },
            icon: '☀️',
            colors: {
                primary: '#2563eb',
                background: '#f5f5f5',
                container: 'rgba(255, 255, 255, 0.95)',
                text: '#404040',
                textSecondary: '#1a1a1a',
                border: 'rgba(0, 0, 0, 0.1)',
                buttonBg: 'rgba(0, 0, 0, 0.03)',
                buttonBorder: 'rgba(0, 0, 0, 0.08)',
                sidebarBg: 'linear-gradient(180deg, #e5e5e5 0%, #d0d0d0 100%)'
            }
        },
        winter: {
            name: { en: 'Winter Theme', uk: 'Зимова Тема', ru: 'Зимняя Тема' },
            icon: '❄️',
            colors: {
                primary: '#60a5fa',
                background: '#0a0a0a',
                container: 'rgba(18, 18, 18, 0.95)',
                text: '#b0b0b0',
                textSecondary: '#e0e0e0',
                border: 'rgba(96, 165, 250, 0.2)',
                buttonBg: 'rgba(96, 165, 250, 0.05)',
                buttonBorder: 'rgba(96, 165, 250, 0.15)',
                sidebarBg: 'linear-gradient(180deg, rgba(96, 165, 250, 0.1) 0%, rgba(30, 58, 138, 0.15) 100%)'
            }
        }
    };

    const THEME_ORDER = ['dark', 'light', 'winter'];

    // ========== STORAGE ==========
    const storage = {
        get: () => localStorage.getItem('armHelper_theme') || 'dark',
        set: (theme) => localStorage.setItem('armHelper_theme', theme)
    };

    // ========== THEME APPLICATION ==========
    function applyTheme(themeName) {
        const theme = THEMES[themeName];
        if (!theme) return;

        console.log('🎨 Applying theme:', themeName);

        const root = document.documentElement;
        const colors = theme.colors;

        // Apply CSS variables
        root.style.setProperty('--primary-color', colors.primary);
        root.style.setProperty('--text-color', colors.text);
        root.style.setProperty('--text-secondary-color', colors.textSecondary);
        root.style.setProperty('--border-color', colors.border);
        root.style.setProperty('--button-bg', colors.buttonBg);
        root.style.setProperty('--button-border', colors.buttonBorder);

        // Update body background
        document.body.style.backgroundColor = colors.background;

        // Update container backgrounds
        document.querySelectorAll('.container').forEach(el => {
            el.style.backgroundColor = colors.container;
            el.style.borderColor = colors.border;
        });

        // Update sidebar
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.style.background = colors.sidebarBg;
            sidebar.style.borderColor = colors.border;
        }

        // Update static menu
        document.querySelectorAll('.static-menu').forEach(menu => {
            menu.style.background = colors.sidebarBg;
            menu.style.borderColor = colors.border;
        });

        // Update mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.style.background = colors.sidebarBg;
            mobileToggle.style.borderColor = colors.border;
            mobileToggle.style.color = colors.primary;
        }

        // Update menu lines
        document.querySelectorAll('.menu-line').forEach(line => {
            line.style.background = colors.primary;
        });

        // Update buttons and navigation
        updateNavigationColors(colors);
        updateButtonColors(colors);

        // Update signature
        const signature = document.querySelector('.signature');
        if (signature) {
            signature.style.background = colors.container;
            signature.style.borderColor = colors.border;
            signature.style.color = colors.primary;
        }

        // Dispatch theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName, colors }
        }));

        console.log('✅ Theme applied:', themeName);
    }

    function updateNavigationColors(colors) {
        // Sidebar header
        const sidebarHeader = document.querySelector('.sidebar-header h3');
        if (sidebarHeader) {
            sidebarHeader.style.color = colors.primary;
        }

        // Category headers
        document.querySelectorAll('.category-header, .main-category-header').forEach(header => {
            header.style.background = colors.buttonBg;
            header.style.borderColor = colors.buttonBorder;
            header.style.color = colors.primary;
        });

        // Nav buttons
        document.querySelectorAll('.nav-btn, .category-btn, .dropdown-item').forEach(btn => {
            if (!btn.classList.contains('active')) {
                btn.style.background = colors.buttonBg;
                btn.style.borderColor = colors.buttonBorder;
                btn.style.color = colors.text;
            } else {
                btn.style.background = colors.primary;
                btn.style.borderColor = colors.primary;
                btn.style.color = colors.background;
            }
        });
    }

    function updateButtonColors(colors) {
        // Settings buttons
        document.querySelectorAll('.settings-btn-sidebar, .settings-btn-static').forEach(btn => {
            btn.style.background = colors.buttonBg;
            btn.style.borderColor = colors.buttonBorder;
            btn.style.color = colors.text;
        });

        // Theme button
        const themeBtn = document.querySelector('.theme-btn-sidebar, .theme-btn-static');
        if (themeBtn) {
            themeBtn.style.background = colors.buttonBg;
            themeBtn.style.borderColor = colors.buttonBorder;
            themeBtn.style.color = colors.text;
        }

        // Close button
        const closeBtn = document.querySelector('.close-sidebar');
        if (closeBtn) {
            closeBtn.style.background = colors.buttonBg;
            closeBtn.style.borderColor = colors.buttonBorder;
            closeBtn.style.color = colors.textSecondary;
        }
    }

    // ========== THEME SWITCHING ==========
    function switchToNextTheme() {
        const currentTheme = storage.get();
        const currentIndex = THEME_ORDER.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
        const nextTheme = THEME_ORDER[nextIndex];

        storage.set(nextTheme);
        applyTheme(nextTheme);
        updateThemeButton();

        // Show notification
        showThemeNotification(nextTheme);

        return nextTheme;
    }

    function updateThemeButton() {
        const currentTheme = storage.get();
        const theme = THEMES[currentTheme];
        if (!theme) return;

        const buttons = document.querySelectorAll('.theme-btn-sidebar, .theme-btn-static');
        buttons.forEach(btn => {
            btn.textContent = theme.icon;
            btn.title = theme.name.en;
        });
    }

    function showThemeNotification(themeName) {
        const theme = THEMES[themeName];
        if (!theme) return;

        const lang = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
        const themeName_localized = theme.name[lang] || theme.name.en;

        // Remove existing notification
        const existing = document.querySelector('.theme-notification');
        if (existing) existing.remove();

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.innerHTML = `
            <span style="font-size: 1.4em; margin-right: 8px;">${theme.icon}</span>
            <span>${themeName_localized}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${theme.colors.container};
            border: 1px solid ${theme.colors.border};
            border-radius: 12px;
            padding: 12px 24px;
            color: ${theme.colors.primary};
            font-size: 14px;
            font-weight: 600;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        // Animate out
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // ========== BUTTON CREATION ==========
    function createThemeButton(isSidebar = true) {
        const currentTheme = storage.get();
        const theme = THEMES[currentTheme];
        
        const button = document.createElement('button');
        button.className = isSidebar ? 'theme-btn-sidebar' : 'theme-btn-static';
        button.textContent = theme.icon;
        button.title = theme.name.en;
        button.onclick = () => switchToNextTheme();

        return button;
    }

    function injectThemeButtons() {
        // Sidebar controls (left/right menu)
        const sidebarControls = document.querySelector('.sidebar-controls');
        if (sidebarControls && !sidebarControls.querySelector('.theme-btn-sidebar')) {
            const themeBtn = createThemeButton(true);
            const settingsBtn = sidebarControls.querySelector('.settings-btn-sidebar');
            if (settingsBtn) {
                sidebarControls.insertBefore(themeBtn, settingsBtn);
            } else {
                sidebarControls.appendChild(themeBtn);
            }
        }

        // Static menu controls (top/bottom menu)
        const settingsContainers = document.querySelectorAll('.settings-container-static');
        settingsContainers.forEach(container => {
            if (!container.querySelector('.theme-btn-static')) {
                const themeBtn = createThemeButton(false);
                const settingsBtn = container.querySelector('.settings-btn-static');
                if (settingsBtn) {
                    container.insertBefore(themeBtn, settingsBtn);
                } else {
                    container.appendChild(themeBtn);
                }
            }
        });
    }

    // ========== INITIALIZATION ==========
    function init() {
        console.log('🎨 Initializing Theme Switcher...');

        const currentTheme = storage.get();
        applyTheme(currentTheme);
        
        // Wait for menu to be ready
        setTimeout(() => {
            injectThemeButtons();
            updateThemeButton();
        }, 500);

        // Listen for page changes to re-inject buttons if needed
        document.addEventListener('pageChanged', () => {
            setTimeout(() => {
                injectThemeButtons();
                updateThemeButton();
            }, 100);
        });

        // Listen for menu position changes
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                injectThemeButtons();
                updateThemeButton();
            }, 1000);
        });

        console.log('✅ Theme Switcher initialized with theme:', currentTheme);
    }

    // ========== GLOBAL EXPORTS ==========
    Object.assign(window, {
        switchToNextTheme,
        applyTheme,
        getCurrentTheme: () => storage.get(),
        THEMES
    });

    // ========== AUTO INIT ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.themeSwitcherInitialized = true;

})();
