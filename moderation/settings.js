// Moderation Settings - Background Management and Menu Position with Collapsible Categories
let settingsInitialized = false;
let settingsTranslations = null;
let categoriesState = {
    background: false, // false = collapsed, true = expanded
    menu: false
};

// Background configurations
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

// Menu position configurations
const menuPositions = {
    left: {
        icon: '⬅️',
        description: 'Hamburger Menu Left'
    },
    right: {
        icon: '➡️',
        description: 'Hamburger Menu Right'
    },
    up: {
        icon: '⬆️',
        description: 'Icon Menu Top'
    },
    down: {
        icon: '⬇️',
        description: 'Icon Menu Bottom'
    }
};

// Menu items configuration with icons
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

// Toggle category visibility
function toggleCategory(categoryName) {
    if (!categoriesState.hasOwnProperty(categoryName)) return;
    
    categoriesState[categoryName] = !categoriesState[categoryName];
    
    const header = document.querySelector(`[data-category="${categoryName}"] .category-header`);
    const options = document.querySelector(`.${categoryName}-options`);
    
    if (!header || !options) return;
    
    if (categoriesState[categoryName]) {
        // Expand
        header.classList.remove('collapsed');
        options.classList.remove('collapsed');
    } else {
        // Collapse
        header.classList.add('collapsed');
        options.classList.add('collapsed');
    }
    
    // Save state
    localStorage.setItem('armHelper_categoriesState', JSON.stringify(categoriesState));
    console.log(`Category ${categoryName} ${categoriesState[categoryName] ? 'expanded' : 'collapsed'}`);
}

// Load categories state
function loadCategoriesState() {
    const saved = localStorage.getItem('armHelper_categoriesState');
    if (saved) {
        try {
            categoriesState = { ...categoriesState, ...JSON.parse(saved) };
        } catch (e) {
            console.warn('Failed to load categories state, using defaults');
        }
    }
}

// Apply categories state to UI
function applyCategoriesState() {
    Object.keys(categoriesState).forEach(category => {
        const header = document.querySelector(`[data-category="${category}"] .category-header`);
        const options = document.querySelector(`.${category}-options`);
        
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

// Get current menu position setting
function getCurrentMenuPosition() {
    const saved = localStorage.getItem('armHelper_menuPosition');
    return saved || 'left';
}

// Save menu position setting
function saveMenuPosition(position) {
    localStorage.setItem('armHelper_menuPosition', position);
    console.log(`Menu position saved: ${position}`);
}

// Apply menu position
function applyMenuPosition(position) {
    if (!menuPositions[position]) {
        console.error(`Menu position ${position} not found`);
        return;
    }
    
    const body = document.body;
    
    // Remove all menu position classes
    Object.keys(menuPositions).forEach(pos => {
        body.classList.remove(`menu-${pos}`);
    });
    
    // Add new menu position class
    body.classList.add(`menu-${position}`);
    
    // Handle static menu rendering
    if (position === 'up' || position === 'down') {
        createStaticMenu(position);
    } else {
        removeStaticMenu();
    }
    
    console.log(`Menu position applied: ${position}`);
}

// Create static menu for top/bottom positions with icons only
function createStaticMenu(position) {
    // Remove existing static menu
    removeStaticMenu();
    
    const menuClass = position === 'up' ? 'menu-top' : 'menu-bottom';
    const staticMenu = document.createElement('div');
    staticMenu.className = `static-menu ${menuClass}`;
    staticMenu.id = 'staticMenu';
    
    // Create navigation buttons container
    const navButtons = document.createElement('div');
    navButtons.className = 'nav-buttons';
    
    // Create buttons for all menu items with icons only
    menuItems.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'nav-btn';
        btn.dataset.page = item.page;
        btn.title = item.title; // Tooltip shows full name
        btn.textContent = item.icon; // Only show icon
        
        btn.onclick = () => {
            if (typeof switchPage === 'function') {
                switchPage(item.page);
            }
            updateStaticMenuActiveState(item.page);
        };
        
        navButtons.appendChild(btn);
    });
    
    staticMenu.appendChild(navButtons);
    document.body.appendChild(staticMenu);
    
    // Update active state for current page
    const currentPage = typeof getCurrentPage === 'function' ? getCurrentPage() : 'calculator';
    updateStaticMenuActiveState(currentPage);
    
    console.log(`Static ${position} menu created with ${menuItems.length} items`);
}

// Remove static menu
function removeStaticMenu() {
    const existingMenu = document.getElementById('staticMenu');
    if (existingMenu) {
        existingMenu.remove();
        console.log('Static menu removed');
    }
}

// Update static menu active state
function updateStaticMenuActiveState(activePage) {
    const staticMenu = document.getElementById('staticMenu');
    if (!staticMenu) return;
    
    staticMenu.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === activePage) {
            btn.classList.add('active');
        }
    });
    
    console.log(`Static menu active state updated: ${activePage}`);
}

// Change menu position
function changeMenuPosition(position) {
    if (!menuPositions[position]) {
        console.error(`Invalid menu position: ${position}`);
        return;
    }
    
    // Save setting
    saveMenuPosition(position);
    
    // Apply menu position
    applyMenuPosition(position);
    
    // Update UI
    updateMenuPositionUI();
    
    console.log(`Menu position changed to: ${position}`);
}

// Update menu position UI
function updateMenuPositionUI() {
    const currentPos = getCurrentMenuPosition();
    
    // Update active states
    document.querySelectorAll('.menu-option').forEach(option => {
        option.classList.remove('active');
        if (option.dataset.position === currentPos) {
            option.classList.add('active');
        }
    });
}

// Reset settings to default
function resetSettings() {
    if (confirm(getTranslation('confirmReset', 'Are you sure you want to reset all settings?'))) {
        localStorage.removeItem('armHelper_background');
        localStorage.removeItem('armHelper_menuPosition');
        localStorage.removeItem('armHelper_categoriesState');
        
        // Reset state
        categoriesState = { background: false, menu: false };
        
        changeBackground('penguin');
        changeMenuPosition('left');
        applyCategoriesState();
        
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
                menu: "Menu Position",
                penguin: "Penguin",
                game: "Game",
                code: "Code",
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
    
    // Update background section title
    const backgroundSectionTitle = document.querySelector('[data-category="background"] .category-title span:last-child');
    if (backgroundSectionTitle) {
        backgroundSectionTitle.textContent = translations.background;
    }
    
    // Update menu section title
    const menuSectionTitle = document.querySelector('[data-category="menu"] .category-title span:last-child');
    if (menuSectionTitle) {
        menuSectionTitle.textContent = translations.menu;
    }
    
    // Update background option names
    Object.keys(backgroundOptions).forEach(bg => {
        const option = document.querySelector(`[data-background="${bg}"] .option-name`);
        if (option && translations[bg]) {
            option.textContent = translations[bg];
        }
    });
    
    // Update menu position option names
    Object.keys(menuPositions).forEach(pos => {
        const option = document.querySelector(`[data-position="${pos}"] .menu-option-name`);
        if (option && translations[pos]) {
            option.textContent = translations[pos];
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
            
            <div class="settings-section" data-category="background">
                <div class="category-header collapsed" onclick="toggleCategory('background')">
                    <div class="category-title">
                        <span class="section-icon">🎨</span>
                        <span>Background</span>
                    </div>
                    <span class="category-toggle">▼</span>
                </div>
                
                <div class="background-options collapsed">
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
            
            <div class="settings-section" data-category="menu">
                <div class="category-header collapsed" onclick="toggleCategory('menu')">
                    <div class="category-title">
                        <span class="section-icon">📱</span>
                        <span>Menu Position</span>
                    </div>
                    <span class="category-toggle">▼</span>
                </div>
                
                <div class="menu-options collapsed">
                    <div class="menu-option" data-position="up" onclick="changeMenuPosition('up')">
                        <div class="menu-option-icon">⬆️</div>
                        <div class="menu-option-name">Top</div>
                    </div>
                    
                    <div class="menu-option" data-position="left" onclick="changeMenuPosition('left')">
                        <div class="menu-option-icon">⬅️</div>
                        <div class="menu-option-name">Left</div>
                    </div>
                    
                    <div class="menu-option" data-position="right" onclick="changeMenuPosition('right')">
                        <div class="menu-option-icon">➡️</div>
                        <div class="menu-option-name">Right</div>
                    </div>
                    
                    <div class="menu-option" data-position="down" onclick="changeMenuPosition('down')">
                        <div class="menu-option-icon">⬇️</div>
                        <div class="menu-option-name">Bottom</div>
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
    
    // Load categories state
    loadCategoriesState();
    
    // Load translations
    await loadSettingsTranslations();
    
    // Set HTML content
    settingsPage.innerHTML = createSettingsHTML();
    
    // Apply current background
    const currentBg = getCurrentBackground();
    applyBackground(currentBg);
    updateBackgroundUI();
    
    // Apply current menu position
    const currentMenuPos = getCurrentMenuPosition();
    applyMenuPosition(currentMenuPos);
    updateMenuPositionUI();
    
    // Apply categories state
    applyCategoriesState();
    
    // Update language
    await updateSettingsLanguage();
    
    settingsInitialized = true;
    console.log('✅ Settings initialized');
}

// Apply background and menu position on app start
function initializeSettingsOnStart() {
    const currentBg = getCurrentBackground();
    applyBackground(currentBg);
    console.log(`Initial background applied: ${currentBg}`);
    
    const currentMenuPos = getCurrentMenuPosition();
    applyMenuPosition(currentMenuPos);
    console.log(`Initial menu position applied: ${currentMenuPos}`);
}

// Listen for language changes
document.addEventListener('languageChanged', (event) => {
    if (settingsInitialized) {
        updateSettingsLanguage(event.detail.language);
    }
});

// Listen for page changes to update static menu active state
document.addEventListener('DOMContentLoaded', () => {
    // Override switchPage to update static menu
    const originalSwitchPage = window.switchPage;
    if (originalSwitchPage) {
        window.switchPage = function(page) {
            originalSwitchPage(page);
            updateStaticMenuActiveState(page);
        };
    }
});

// Apply settings immediately when script loads
document.addEventListener('DOMContentLoaded', () => {
    initializeSettingsOnStart();
});

// If DOM already loaded, apply immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSettingsOnStart);
} else {
    initializeSettingsOnStart();
}

// Global functions
window.initializeSettings = initializeSettings;
window.changeBackground = changeBackground;
window.changeMenuPosition = changeMenuPosition;
window.resetSettings = resetSettings;
window.toggleCategory = toggleCategory;
window.updateSettingsLanguage = updateSettingsLanguage;
window.updateStaticMenuActiveState = updateStaticMenuActiveState;
