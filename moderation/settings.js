// Moderation Settings - Background Management
let settingsInitialized = false;
let settingsTranslations = null;

// Background configurations
const backgroundOptions = {
    penguin: {
        icon: '🐧',
        url: 'https://i.postimg.cc/43yVBkY8/Generated-image-1.png'
    },
    game: {
        icon: '🎮', 
        url: 'https://i.postimg.cc/VNpqK2Ht/game-background.jpg'
    },
    code: {
        icon: '💻',
        url: 'https://i.postimg.cc/9FXzrptm/code-background.jpg'
    }
};

// Get current background setting
function getCurrentBackground() {
    const saved = localStorage.getItem('armHelper_background');
    return saved || 'penguin';
}

// Save background setting
function saveBackground(background) {
    localStorage.setItem('armHelper_background', background);
    console.log(`Background saved: ${background}`);
}

// Apply background to body
function applyBackground(background) {
    const config = backgroundOptions[background];
    if (!config) {
        console.error(`Background ${background} not found`);
        return;
    }
    
    const body = document.body;
    const backgroundStyle = `linear-gradient(135deg, rgba(41, 39, 35, 0.4) 0%, rgba(28, 26, 23, 0.6) 50%, rgba(20, 19, 17, 0.8) 100%), url('${config.url}') center center / cover no-repeat`;
    
    body.style.background = backgroundStyle;
    body.style.backgroundAttachment = window.innerWidth > 768 ? 'fixed' : 'scroll';
    
    console.log(`Background applied: ${background}`);
}

// Change background
function changeBackground(background) {
    if (!backgroundOptions[background]) {
        console.error(`Invalid background: ${background}`);
        return;
    }
    
    // Save setting
    saveBackground(background);
    
    // Apply background
    applyBackground(background);
    
    // Update UI
    updateBackgroundUI();
    
    console.log(`Background changed to: ${background}`);
}

// Update background UI
function updateBackgroundUI() {
    const currentBg = getCurrentBackground();
    
    // Update active states
    document.querySelectorAll('.background-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.background === currentBg) {
            option.classList.add('active');
        }
    });
}

// Reset settings to default
function resetSettings() {
    if (confirm(getTranslation('confirmReset', 'Are you sure you want to reset all settings?'))) {
        localStorage.removeItem('armHelper_background');
        changeBackground('penguin');
        console.log('Settings reset to default');
    }
}

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
        console.log('✅ Settings translations loaded');
        return settingsTranslations;
    } catch (error) {
        console.error('❌ Error loading settings translations:', error);
        // Fallback
        settingsTranslations = {
            en: {
                title: "⚙️ Settings",
                background: "Background",
                penguin: "Penguin",
                game: "Game",
                code: "Code",
                reset: "Reset Settings",
                confirmReset: "Are you sure you want to reset all settings?"
            }
        };
        return settingsTranslations;
    }
}

// Get translation
function getTranslation(key, fallback) {
    const currentLang = typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en';
    
    if (settingsTranslations && settingsTranslations[currentLang] && settingsTranslations[currentLang][key]) {
        return settingsTranslations[currentLang][key];
    }
    
    return fallback || key;
}

// Update settings language
async function updateSettingsLanguage(lang = null) {
    if (!settingsInitialized) return;
    
    const currentLang = lang || (typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : 'en');
    
    await loadSettingsTranslations();
    
    if (!settingsTranslations[currentLang]) {
        console.warn(`Settings language ${currentLang} not found, using English`);
        return;
    }
    
    const translations = settingsTranslations[currentLang];
    
    // Update title
    const titleElement = document.querySelector('#settingsPage .settings-title');
    if (titleElement) {
        titleElement.textContent = translations.title;
    }
    
    // Update section title
    const sectionTitle = document.querySelector('#settingsPage .section-title span:last-child');
    if (sectionTitle) {
        sectionTitle.textContent = translations.background;
    }
    
    // Update background option names
    Object.keys(backgroundOptions).forEach(bg => {
        const option = document.querySelector(`[data-background="${bg}"] .option-name`);
        if (option && translations[bg]) {
            option.textContent = translations[bg];
        }
    });
    
    // Update reset button
    const resetBtn = document.querySelector('.reset-btn');
    if (resetBtn && translations.reset) {
        resetBtn.textContent = translations.reset;
    }
    
    console.log(`✅ Settings language updated to ${currentLang}`);
}

// Create settings HTML
function createSettingsHTML() {
    return `
        <div class="settings-container">
            <h1 class="settings-title">⚙️ Settings</h1>
            
            <div class="settings-section">
                <div class="section-title">
                    <span class="section-icon">🎨</span>
                    <span>Background</span>
                </div>
                
                <div class="background-options">
                    <div class="background-option" data-background="penguin" onclick="changeBackground('penguin')">
                        <div class="option-icon">🐧</div>
                        <div class="option-name">Penguin</div>
                        <div class="background-preview" style="background-image: url('${backgroundOptions.penguin.url}')"></div>
                    </div>
                    
                    <div class="background-option" data-background="game" onclick="changeBackground('game')">
                        <div class="option-icon">🎮</div>
                        <div class="option-name">Game</div>
                        <div class="background-preview" style="background-image: url('${backgroundOptions.game.url}')"></div>
                    </div>
                    
                    <div class="background-option" data-background="code" onclick="changeBackground('code')">
                        <div class="option-icon">💻</div>
                        <div class="option-name">Code</div>
                        <div class="background-preview" style="background-image: url('${backgroundOptions.code.url}')"></div>
                    </div>
                </div>
            </div>
            
            <div class="reset-section">
                <button class="reset-btn" onclick="resetSettings()">Reset Settings</button>
            </div>
        </div>
    `;
}

// Initialize settings page
async function initializeSettings() {
    if (settingsInitialized) {
        console.log('⚠️ Settings already initialized');
        return;
    }
    
    console.log('⚙️ Initializing Settings...');
    
    const settingsPage = document.getElementById('settingsPage');
    if (!settingsPage) {
        console.error('❌ Settings page not found');
        return;
    }
    
    // Load translations
    await loadSettingsTranslations();
    
    // Set HTML content
    settingsPage.innerHTML = createSettingsHTML();
    
    // Apply current background
    const currentBg = getCurrentBackground();
    applyBackground(currentBg);
    updateBackgroundUI();
    
    // Update language
    await updateSettingsLanguage();
    
    settingsInitialized = true;
    console.log('✅ Settings initialized');
}

// Apply background on app start
function initializeBackgroundOnStart() {
    const currentBg = getCurrentBackground();
    applyBackground(currentBg);
    console.log(`Initial background applied: ${currentBg}`);
}

// Listen for language changes
document.addEventListener('languageChanged', (event) => {
    if (settingsInitialized) {
        updateSettingsLanguage(event.detail.language);
    }
});

// Apply background immediately when script loads
document.addEventListener('DOMContentLoaded', () => {
    initializeBackgroundOnStart();
});

// If DOM already loaded, apply immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBackgroundOnStart);
} else {
    initializeBackgroundOnStart();
}

// Global functions
window.initializeSettings = initializeSettings;
window.changeBackground = changeBackground;
window.resetSettings = resetSettings;
window.updateSettingsLanguage = updateSettingsLanguage;
