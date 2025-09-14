// Settings functionality - With language support
console.log('⚙️ Loading Settings module...');

let settingsTranslations = null;
let settingsInitialized = false;

// Background configurations
const BACKGROUND_CONFIGS = {
    penguin: {
        key: 'penguin',
        gradient: 'linear-gradient(135deg, rgba(139, 69, 19, 0.4), rgba(101, 67, 33, 0.6))'
    },
    game: {
        key: 'game', 
        gradient: 'linear-gradient(135deg, rgba(25, 118, 210, 0.4), rgba(13, 71, 161, 0.8))'
    },
    code: {
        key: 'code',
        gradient: 'linear-gradient(135deg, rgba(46, 125, 50, 0.4), rgba(1, 87, 155, 0.8))'
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
        // Fallback translations
        settingsTranslations = {
            en: {
                title: "⚙️ Settings",
                background: {
                    title: "🎨 Background",
                    description: "Customize your app's visual theme",
                    options: {
                        penguin: { name: "Penguin Theme", description: "Default mining theme" },
                        game: { name: "Gaming Theme", description: "Blue gradient theme" },
                        code: { name: "Code Theme", description: "Green matrix theme" }
                    }
                },
                menu: {
                    title: "🧭 Menu",
                    description: "Configure navigation preferences",
                    comingSoon: "Coming Soon!",
                    placeholder: "Menu options will be available here"
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
function saveSettings(settings) {
    const currentSettings = {
        ...loadSettings(),
        ...settings,
        timestamp: Date.now()
    };
    
    localStorage.setItem('armHelper_settings', JSON.stringify(currentSettings));
    console.log('✅ Settings saved:', currentSettings);
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

// Apply background theme
function applyBackgroundTheme(theme) {
    const config = BACKGROUND_CONFIGS[theme];
    if (!config) {
        console.error(`❌ Unknown background theme: ${theme}`);
        return;
    }
    
    console.log(`🎨 Applying background theme: ${theme}`);
    document.body.style.background = config.gradient;
    
    updateBackgroundSelection(theme);
    saveSettings({ background: theme });
    
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

// Create settings content
function createSettingsContent() {
    const lang = getCurrentLanguage();
    const translations = settingsTranslations[lang] || settingsTranslations.en;
    const currentBg = loadSettings().background || 'penguin';
    
    return `
        <div class="settings-header">
            <h1 class="settings-title">${translations.title}</h1>
        </div>
        
        <div class="settings-groups">
            <!-- Background Settings -->
            <div class="settings-group" data-group="background">
                <h2 class="settings-group-title">
                    ${translations.background.title}
                </h2>
                <p class="settings-group-description">${translations.background.description}</p>
                
                <div class="background-options">
                    ${Object.entries(BACKGROUND_CONFIGS).map(([key, config]) => `
                        <div class="background-option bg-${key} ${currentBg === key ? 'active' : ''}" 
                             data-background="${key}" 
                             onclick="selectBackground('${key}')">
                            <div class="background-preview"></div>
                            <div class="background-name">${translations.background.options[key]?.name || key}</div>
                            <div class="background-description">${translations.background.options[key]?.description || ''}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Menu Settings -->
            <div class="settings-group" data-group="menu">
                <h2 class="settings-group-title">
                    ${translations.menu.title}
                </h2>
                <p class="settings-group-description">${translations.menu.description}</p>
                
                <div class="coming-soon">
                    <div class="coming-soon-icon">🔄</div>
                    <div class="coming-soon-text">${translations.menu.comingSoon}</div>
                    <div class="coming-soon-description">${translations.menu.placeholder}</div>
                </div>
            </div>
        </div>
    `;
}

// Update settings language
function updateSettingsLanguage(lang = null) {
    if (!settingsTranslations || !settingsInitialized) return;
    
    const language = lang || getCurrentLanguage();
    console.log(`🌍 Updating settings for language: ${language}`);
    
    const settingsPage = document.getElementById('settingsPage');
    if (settingsPage) {
        settingsPage.innerHTML = createSettingsContent();
        console.log('✅ Settings language updated');
    }
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
        
        // Apply saved background theme
        const savedSettings = loadSettings();
        if (savedSettings.background) {
            applyBackgroundTheme(savedSettings.background);
        }
        
        // Listen for language changes
        document.addEventListener('languageChanged', (event) => {
            updateSettingsLanguage(event.detail.language);
        });
        
        settingsInitialized = true;
        console.log('✅ Settings initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing settings:', error);
        settingsInitialized = true;
    }
}

// Make functions globally available
window.initializeSettings = initializeSettings;
window.selectBackground = selectBackground;
window.updateSettingsLanguage = updateSettingsLanguage;
window.applyBackgroundTheme = applyBackgroundTheme;

console.log('✅ Settings module loaded successfully');
