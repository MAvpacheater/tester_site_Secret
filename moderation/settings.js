// Settings functionality - Mining theme
console.log('⚙️ Loading Settings module...');

let settingsTranslations = null;
let settingsInitialized = false;

// Background configurations
const BACKGROUND_CONFIGS = {
    penguin: {
        key: 'penguin',
        gradient: `linear-gradient(135deg, 
            rgba(41, 39, 35, 0.4) 0%, 
            rgba(28, 26, 23, 0.6) 50%, 
            rgba(20, 19, 17, 0.8) 100%)`,
        image: 'url("https://i.postimg.cc/43yVBkY8/Generated-image-1.png") center center / cover no-repeat',
        pattern: `radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.03) 0%, transparent 40%),
                  radial-gradient(circle at 75% 75%, rgba(255, 165, 0, 0.03) 0%, transparent 40%)`
    },
    game: {
        key: 'game',
        gradient: `linear-gradient(135deg, 
            rgba(25, 118, 210, 0.4) 0%, 
            rgba(21, 101, 192, 0.6) 50%, 
            rgba(13, 71, 161, 0.8) 100%)`,
        image: '',
        pattern: `radial-gradient(circle at 30% 30%, rgba(100, 181, 246, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 70% 70%, rgba(63, 81, 181, 0.1) 0%, transparent 50%)`
    },
    code: {
        key: 'code',
        gradient: `linear-gradient(135deg, 
            rgba(46, 125, 50, 0.4) 0%, 
            rgba(27, 94, 32, 0.6) 50%, 
            rgba(1, 87, 155, 0.8) 100%)`,
        image: '',
        pattern: `radial-gradient(circle at 20% 80%, rgba(129, 199, 132, 0.1) 0%, transparent 40%),
                  radial-gradient(circle at 80% 20%, rgba(67, 160, 71, 0.1) 0%, transparent 40%)`
    }
};

// Load settings translations
async function loadSettingsTranslations() {
    if (settingsTranslations) return settingsTranslations;
    
    try {
        console.log('📥 Loading settings translations...');
        const response = await fetch('languages/settings.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        settingsTranslations = await response.json();
        console.log('✅ Settings translations loaded successfully');
        return settingsTranslations;
    } catch (error) {
        console.error('❌ Error loading settings translations:', error);
        // Fallback to English
        settingsTranslations = {
            en: {
                title: "⚙️ Settings",
                appearance: {
                    title: "🎨 Appearance",
                    background: {
                        title: "Background Theme",
                        penguin: {
                            name: "Penguin",
                            description: "Default mining theme with penguin character"
                        },
                        game: {
                            name: "Game",
                            description: "Gaming-inspired blue gradient theme"
                        },
                        code: {
                            name: "Code",
                            description: "Developer-friendly green matrix theme"
                        }
                    }
                },
                navigation: {
                    title: "🧭 Navigation",
                    comingSoon: "Coming Soon!"
                }
            },
            uk: {
                title: "⚙️ Налаштування",
                appearance: {
                    title: "🎨 Зовнішній вигляд",
                    background: {
                        title: "Тема фону",
                        penguin: {
                            name: "Пінгвін",
                            description: "Стандартна тема з персонажем пінгвіном"
                        },
                        game: {
                            name: "Гра",
                            description: "Ігрова тема з синім градієнтом"
                        },
                        code: {
                            name: "Код",
                            description: "Зелена тема для розробників"
                        }
                    }
                },
                navigation: {
                    title: "🧭 Навігація",
                    comingSoon: "Незабаром!"
                }
            },
            ru: {
                title: "⚙️ Настройки",
                appearance: {
                    title: "🎨 Внешний вид",
                    background: {
                        title: "Тема фона",
                        penguin: {
                            name: "Пингвин",
                            description: "Стандартная тема с персонажем пингвином"
                        },
                        game: {
                            name: "Игра",
                            description: "Игровая тема с синим градиентом"
                        },
                        code: {
                            name: "Код",
                            description: "Зеленая тема для разработчиков"
                        }
                    }
                },
                navigation: {
                    title: "🧭 Навигация",
                    comingSoon: "Скоро!"
                }
            }
        };
        return settingsTranslations;
    }
}

// Get current app language
function getCurrentLanguage() {
    return localStorage.getItem('armHelper_language') || 'en';
}

// Save settings to localStorage
function saveSettings() {
    const settings = {
        background: getCurrentBackground(),
        language: getCurrentLanguage(),
        timestamp: Date.now()
    };
    
    localStorage.setItem('armHelper_settings', JSON.stringify(settings));
    console.log('✅ Settings saved:', settings);
}

// Load settings from localStorage
function loadSettings() {
    try {
        const settings = localStorage.getItem('armHelper_settings');
        if (settings) {
            const parsed = JSON.parse(settings);
            console.log('📥 Settings loaded:', parsed);
            return parsed;
        }
    } catch (error) {
        console.error('❌ Error loading settings:', error);
    }
    
    return {
        background: 'penguin',
        language: 'en'
    };
}

// Get current background
function getCurrentBackground() {
    const settings = loadSettings();
    return settings.background || 'penguin';
}

// Apply background theme
function applyBackgroundTheme(theme) {
    const config = BACKGROUND_CONFIGS[theme];
    if (!config) {
        console.error(`❌ Unknown background theme: ${theme}`);
        return;
    }
    
    console.log(`🎨 Applying background theme: ${theme}`);
    
    const body = document.body;
    
    // Build background styles
    const backgroundStyles = [];
    
    if (config.gradient) {
        backgroundStyles.push(config.gradient);
    }
    
    if (config.image) {
        backgroundStyles.push(config.image);
    }
    
    // Apply main background
    body.style.background = backgroundStyles.join(', ');
    
    // Apply pattern to ::before pseudo element
    const existingStyle = document.getElementById('settings-dynamic-bg');
    if (existingStyle) {
        existingStyle.remove();
    }
    
    const style = document.createElement('style');
    style.id = 'settings-dynamic-bg';
    style.textContent = `
        body::before {
            background: ${config.pattern};
            background-size: 200px 200px, 150px 150px;
        }
    `;
    document.head.appendChild(style);
    
    // Update background option UI
    updateBackgroundSelection(theme);
    
    // Save settings
    saveSettings();
    
    console.log(`✅ Background theme applied: ${theme}`);
}

// Update background selection UI
function updateBackgroundSelection(selectedTheme) {
    document.querySelectorAll('.background-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.background === selectedTheme) {
            option.classList.add('active');
        }
    });
}

// Handle background selection
function selectBackground(theme) {
    console.log(`🎯 Background selected: ${theme}`);
    applyBackgroundTheme(theme);
}

// Update settings language
function updateSettingsLanguage(lang = null) {
    if (!settingsTranslations) return;
    
    const language = lang || getCurrentLanguage();
    const translations = settingsTranslations[language];
    
    if (!translations) {
        console.error(`❌ Settings translations not found for language: ${language}`);
        return;
    }
    
    console.log(`🌍 Updating settings translations for: ${language}`);
    
    // Update title
    const title = document.querySelector('.settings-title');
    if (title) {
        title.textContent = translations.title;
    }
    
    // Update appearance section
    const appearanceTitle = document.querySelector('[data-group="appearance"] .settings-group-title span:last-child');
    if (appearanceTitle) {
        appearanceTitle.textContent = translations.appearance.title;
    }
    
    // Update background options
    Object.keys(BACKGROUND_CONFIGS).forEach(bgKey => {
        const option = document.querySelector(`[data-background="${bgKey}"]`);
        if (option && translations.appearance.background[bgKey]) {
            const name = option.querySelector('.background-name');
            const desc = option.querySelector('.background-description');
            
            if (name) name.textContent = translations.appearance.background[bgKey].name;
            if (desc) desc.textContent = translations.appearance.background[bgKey].description;
        }
    });
    
    // Update navigation section
    const navigationTitle = document.querySelector('[data-group="navigation"] .settings-group-title span:last-child');
    if (navigationTitle) {
        navigationTitle.textContent = translations.navigation.title;
    }
    
    const comingSoonText = document.querySelector('.coming-soon p');
    if (comingSoonText) {
        comingSoonText.textContent = translations.navigation.comingSoon;
    }
    
    console.log(`✅ Settings translations updated for: ${language}`);
}

// Create settings content
function createSettingsContent() {
    const currentBg = getCurrentBackground();
    
    const content = `
        <div class="settings-header">
            <h1 class="settings-title">⚙️ Settings</h1>
        </div>
        
        <div class="settings-groups">
            <!-- Appearance Settings -->
            <div class="settings-group" data-group="appearance">
                <h2 class="settings-group-title">
                    <span class="settings-group-icon">🎨</span>
                    <span>Appearance</span>
                </h2>
                
                <div class="background-selector">
                    <h3 style="color: #FFD700; margin-bottom: 15px; font-size: 1.2em;">Background Theme</h3>
                    <div class="background-options">
                        ${Object.entries(BACKGROUND_CONFIGS).map(([key, config]) => `
                            <div class="background-option bg-${key} ${currentBg === key ? 'active' : ''}" 
                                 data-background="${key}" 
                                 onclick="selectBackground('${key}')">
                                <div class="background-preview"></div>
                                <div class="background-name">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
                                <div class="background-description">Theme description</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Navigation Settings (Coming Soon) -->
            <div class="settings-group" data-group="navigation">
                <h2 class="settings-group-title">
                    <span class="settings-group-icon">🧭</span>
                    <span>Navigation</span>
                </h2>
                
                <div class="coming-soon">
                    <div class="coming-soon-icon">🔄</div>
                    <p>Coming Soon!</p>
                </div>
            </div>
        </div>
    `;
    
    return content;
}

// Initialize settings page
async function initializeSettings() {
    if (settingsInitialized) {
        console.log('⚠️ Settings already initialized');
        return;
    }
    
    console.log('🔧 Initializing Settings...');
    
    try {
        // Load translations
        await loadSettingsTranslations();
        
        // Create settings content
        const settingsPage = document.getElementById('settingsPage');
        if (settingsPage) {
            settingsPage.innerHTML = createSettingsContent();
            console.log('✅ Settings content created');
        }
        
        // Load and apply saved settings
        const savedSettings = loadSettings();
        if (savedSettings.background) {
            applyBackgroundTheme(savedSettings.background);
        }
        
        // Update translations
        updateSettingsLanguage();
        
        // Listen for language changes
        document.addEventListener('languageChanged', (event) => {
            updateSettingsLanguage(event.detail.language);
        });
        
        settingsInitialized = true;
        console.log('✅ Settings initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing settings:', error);
        settingsInitialized = true; // Prevent retry loops
    }
}

// Initialize settings on app start
document.addEventListener('contentLoaded', () => {
    // Apply saved background theme immediately
    const savedSettings = loadSettings();
    if (savedSettings.background) {
        applyBackgroundTheme(savedSettings.background);
    }
});

// Make functions globally available
window.initializeSettings = initializeSettings;
window.selectBackground = selectBackground;
window.updateSettingsLanguage = updateSettingsLanguage;
window.applyBackgroundTheme = applyBackgroundTheme;

console.log('✅ Settings module loaded successfully');
