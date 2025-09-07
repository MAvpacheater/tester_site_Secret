// Enhanced General JavaScript functions with auth integration and profile support

// Page switching functionality - enhanced with profile support
function switchPage(page) {
    console.log(`Switching to page: ${page}`);
    
    // Remove active class from all pages and nav buttons
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    // Add active class to selected page
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        console.log(`Page ${page}Page activated`);
    } else {
        console.error(`Page ${page}Page not found`);
    }
    
    // Update active nav button
    const pageMap = {
        'login': -1,        // Special case - no nav button
        'profile': -1,      // Special case - no nav button (opened via nickname click)
        'calculator': 0,
        'arm': 1,
        'grind': 2,
        'boosts': 3,
        'shiny': 4,
        'codes': 5,
        'aura': 6,
        'trainer': 7,
        'charms': 8,
        'worlds': 9
    };
    
    const navButtons = document.querySelectorAll('.nav-btn');
    const buttonIndex = pageMap[page];
    
    if (buttonIndex !== undefined && buttonIndex >= 0 && navButtons[buttonIndex]) {
        navButtons[buttonIndex].classList.add('active');
        console.log(`Nav button ${buttonIndex} activated for ${page}`);
    }
    
    // Close sidebar after selection
    closeSidebar();
    
    // Trigger page-specific initialization if needed
    initializePageContent(page);
    
    // Load user settings for calculators if user is authenticated
    loadUserSettingsForPage(page);
}

// Load user settings for specific page
async function loadUserSettingsForPage(page) {
    if (!window.authManager || !window.authManager.currentUser) {
        return; // No user authenticated
    }
    
    const calculatorPages = ['calculator', 'arm', 'grind'];
    if (!calculatorPages.includes(page)) {
        return; // Not a calculator page
    }
    
    try {
        const settings = await window.authManager.loadCalculatorSettings(page);
        if (settings) {
            console.log(`✅ Loaded settings for ${page}:`, settings);
            applySettingsToPage(page, settings);
        }
    } catch (error) {
        console.error(`❌ Error loading settings for ${page}:`, error);
    }
}

// Apply settings to page
function applySettingsToPage(page, settings) {
    switch(page) {
        case 'calculator':
            if (typeof applyCalculatorSettings === 'function') {
                applyCalculatorSettings(settings);
            }
            break;
        case 'arm':
            if (typeof applyArmSettings === 'function') {
                applyArmSettings(settings);
            }
            break;
        case 'grind':
            if (typeof applyGrindSettings === 'function') {
                applyGrindSettings(settings);
            }
            break;
    }
}

// Save user settings for page
async function saveUserSettingsForPage(page, settings) {
    if (!window.authManager || !window.authManager.currentUser) {
        // Fallback to localStorage if not authenticated
        localStorage.setItem(`armHelper_${page}_settings`, JSON.stringify(settings));
        return;
    }
    
    try {
        await window.authManager.saveCalculatorSettings(page, settings);
        console.log(`✅ Settings saved for ${page}`);
    } catch (error) {
        console.error(`❌ Error saving settings for ${page}:`, error);
        // Fallback to localStorage
        localStorage.setItem(`armHelper_${page}_settings`, JSON.stringify(settings));
    }
}

// Initialize specific page content when switching - WITH PROFILE SUPPORT
function initializePageContent(page) {
    switch(page) {
        case 'login':
            if (typeof initializeAuth === 'function') {
                initializeAuth();
            }
            break;
        case 'profile':
            if (typeof initializeProfile === 'function') {
                initializeProfile();
            }
            break;
        case 'calculator':
            if (typeof initializeCalculator === 'function') {
                initializeCalculator();
            }
            break;
        case 'arm':
            if (typeof initializeArm === 'function') {
                initializeArm();
            }
            break;
        case 'grind':
            if (typeof initializeGrind === 'function') {
                initializeGrind();
            }
            break;
        case 'shiny':
            if (typeof initializeShiny === 'function') {
                initializeShiny();
            }
            break;
        case 'boosts':
            if (typeof initializeBoosts === 'function') {
                initializeBoosts();
            }
            break;
        case 'trainer':
            if (typeof initializeTrainer === 'function') {
                initializeTrainer();
            }
            break;
        case 'aura':
            if (typeof initializeAura === 'function') {
                initializeAura();
            }
            break;
        case 'codes':
            if (typeof initializeCodes === 'function') {
                initializeCodes();
            }
            break;
        case 'charms':
            if (typeof initializeCharms === 'function') {
                initializeCharms();
            }
            break;
        case 'worlds':
            if (typeof initializeWorlds === 'function') {
                initializeWorlds();
            }
            break;
    }
}

// Sidebar functionality
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    }
}

// Enhanced auth action handler
function handleAuthAction() {
    const authButton = document.getElementById('authButton');
    
    if (authButton && authButton.classList.contains('logout-btn')) {
        // User is logged in, handle logout
        if (window.authManager) {
            window.authManager.signOut();
        } else if (typeof logout === 'function') {
            logout();
        }
    } else {
        // User is not logged in, go to login page
        switchPage('login');
    }
}

// Update sidebar user info - enhanced for Supabase integration
function updateSidebarUserInfo(user = null) {
    const userInfo = document.getElementById('userInfo');
    const authButton = document.getElementById('authButton');
    const sidebarUserNickname = document.getElementById('sidebarUserNickname');
    
    if (userInfo && authButton) {
        if (user) {
            // User is logged in
            userInfo.style.display = 'block';
            authButton.textContent = 'Sign Out';
            authButton.classList.add('logout-btn');
            
            if (sidebarUserNickname) {
                sidebarUserNickname.textContent = user.nickname || 
                                                 user.email?.split('@')[0] || 
                                                 'User';
                // Ensure profile click handler is set
                sidebarUserNickname.onclick = () => {
                    if (typeof openProfile === 'function') {
                        openProfile();
                    } else {
                        console.error('openProfile function not found');
                    }
                };
            }
            
            console.log('✅ Sidebar updated with user info (profile clickable)');
        } else {
            // User is not logged in
            userInfo.style.display = 'none';
            authButton.textContent = 'Login';
            authButton.classList.remove('logout-btn');
            
            console.log('✅ Sidebar updated for guest user');
        }
    }
}

// Check and update user status - enhanced
function checkUserStatus() {
    // Check if Supabase auth manager is available
    if (window.authManager && window.authManager.currentUser) {
        const profile = window.authManager.userProfile;
        const user = profile || {
            nickname: window.authManager.currentUser.email?.split('@')[0] || 'User',
            email: window.authManager.currentUser.email
        };
        updateSidebarUserInfo(user);
    } else {
        // Fallback to localStorage
        const savedUser = localStorage.getItem('armHelper_currentUser');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                updateSidebarUserInfo(user);
            } catch (e) {
                console.warn('Invalid saved user data');
                localStorage.removeItem('armHelper_currentUser');
                updateSidebarUserInfo(null);
            }
        } else {
            updateSidebarUserInfo(null);
        }
    }
}

// Settings persistence helpers
function saveSettingsToStorage(key, settings) {
    if (window.authManager && window.authManager.currentUser) {
        // Save to Supabase if authenticated
        saveUserSettingsForPage(key, settings);
    } else {
        // Fallback to localStorage
        localStorage.setItem(`armHelper_${key}_settings`, JSON.stringify(settings));
    }
}

function loadSettingsFromStorage(key) {
    // Try localStorage first for immediate response
    const localSettings = localStorage.getItem(`armHelper_${key}_settings`);
    if (localSettings) {
        try {
            return JSON.parse(localSettings);
        } catch (e) {
            console.warn('Invalid local settings data');
        }
    }
    
    // If authenticated, settings will be loaded asynchronously via loadUserSettingsForPage
    return null;
}

// Прапорець для запобігання повторної ініціалізації
let appInitialized = false;

// Головна функція ініціалізації - WITH PROFILE SUPPORT
function initializeApp() {
    if (typeof appInitialized !== 'undefined' && appInitialized) {
        console.log('⚠️ Додаток вже ініціалізовано');
        return;
    }
    
    console.log('🚀 Початок ініціалізації додатка...');
    
    // Перевіряємо чи контент завантажився
    const appContent = document.getElementById('app-content');
    if (!appContent || !appContent.innerHTML.trim()) {
        console.error('❌ Контент не завантажено');
        return;
    }
    
    // Initialize auth system first
    if (typeof initializeAuth === 'function') {
        initializeAuth();
    }
    
    // Check user status and update sidebar
    setTimeout(() => {
        checkUserStatus();
    }, 200);
    
    // Determine starting page based on auth status
    let startingPage = 'calculator'; // Default to calculator
    
    // Check if we should show login page
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('page') === 'login') {
        startingPage = 'login';
    }
    
    // Make sure starting page is active
    switchPage(startingPage);
    
    // Enhanced click outside settings panel handler
    document.addEventListener('click', e => {
        // Закриваємо панелі налаштувань при кліку поза ними
        const settingsPanels = [
            { panel: document.getElementById('settingsPanel'), btn: document.querySelector('#calculatorPage .settings-btn') },
            { panel: document.getElementById('settingsPanelArm'), btn: document.querySelector('#armPage .settings-btn') },
            { panel: document.getElementById('settingsPanelGrind'), btn: document.querySelector('#grindPage .settings-btn') }
        ];
        
        settingsPanels.forEach(({ panel, btn }) => {
            if (panel && btn) {
                const isClickInsidePanel = panel.contains(e.target);
                const isClickOnSettingsBtn = btn.contains(e.target);
                const isClickOnCategoryButton = e.target.closest('.category-button');
                const isClickOnBackButton = e.target.closest('.back-btn');
                const isClickOnCategorySwitch = e.target.closest('.category-switch');
                const isClickOnSimpleModifier = e.target.closest('.simple-modifier');
                
                if (!isClickInsidePanel && !isClickOnSettingsBtn && 
                    !isClickOnCategoryButton && !isClickOnBackButton && 
                    !isClickOnCategorySwitch && !isClickOnSimpleModifier) {
                    panel.classList.remove('show');
                }
            }
        });
    });

    // Initialize all modules
    initializeAllModules();
    
    // Set up auth event listeners
    setupAuthEventListeners();
    
    // Set the flag AFTER initialization
    if (typeof window !== 'undefined') {
        window.appInitialized = true;
    }
    appInitialized = true;
    console.log('✅ Ініціалізація додатка завершена');
}

// Setup authentication event listeners
function setupAuthEventListeners() {
    // Listen for authentication events
    document.addEventListener('userAuthenticated', (event) => {
        console.log('🔐 User authenticated event received');
        const { user, profile } = event.detail;
        updateSidebarUserInfo(profile || user);
        
        // Load settings for current page
        const activePage = document.querySelector('.page.active');
        if (activePage) {
            const pageId = activePage.id.replace('Page', '');
            loadUserSettingsForPage(pageId);
        }
    });
    
    document.addEventListener('userSignedOut', () => {
        console.log('👋 User signed out event received');
        updateSidebarUserInfo(null);
    });
}

// Ініціалізація всіх модулів - WITH PROFILE SUPPORT
function initializeAllModules() {
    const modules = [
        'initializeAuth',
        'initializeProfile',  // Add profile initialization
        'initializeCalculator',
        'initializeArm', 
        'initializeGrind',
        'initializeBoosts',
        'initializeShiny',
        'initializeAura',
        'initializeTrainer',
        'initializeCharms',
        'initializeWorlds'
    ];

    modules.forEach(moduleName => {
        if (typeof window[moduleName] === 'function') {
            try {
                window[moduleName]();
                console.log(`✅ ${moduleName} ініціалізовано`);
            } catch (error) {
                console.error(`❌ Помилка ініціалізації ${moduleName}:`, error);
            }
        } else {
            console.warn(`⚠️ Функція ${moduleName} не знайдена`);
        }
    });
}

// Debug function to check page states
function debugPageStates() {
    console.log('=== DEBUG PAGE STATES ===');
    document.querySelectorAll('.page').forEach(page => {
        console.log(`${page.id}: ${page.classList.contains('active') ? 'ACTIVE' : 'INACTIVE'}`);
    });
    console.log('========================');
}

// Enhanced logout function
function logout() {
    if (window.authManager) {
        window.authManager.signOut();
    } else {
        // Fallback for localStorage
        localStorage.removeItem('armHelper_currentUser');
        updateSidebarUserInfo(null);
        console.log('✅ Logged out (localStorage cleared)');
    }
}

// Utility function to get current user
function getCurrentUser() {
    if (window.authManager && window.authManager.currentUser) {
        return {
            auth: window.authManager.currentUser,
            profile: window.authManager.userProfile
        };
    }
    
    // Fallback to localStorage
    const savedUser = localStorage.getItem('armHelper_currentUser');
    if (savedUser) {
        try {
            return { profile: JSON.parse(savedUser) };
        } catch (e) {
            return null;
        }
    }
    
    return null;
}

// Make functions globally available
window.switchPage = switchPage;
window.toggleMobileMenu = toggleMobileMenu;
window.closeSidebar = closeSidebar;
window.handleAuthAction = handleAuthAction;
window.updateSidebarUserInfo = updateSidebarUserInfo;
window.checkUserStatus = checkUserStatus;
window.initializeApp = initializeApp;
window.logout = logout;
window.debugPageStates = debugPageStates;
window.saveSettingsToStorage = saveSettingsToStorage;
window.loadSettingsFromStorage = loadSettingsFromStorage;
window.getCurrentUser = getCurrentUser;
window.saveUserSettingsForPage = saveUserSettingsForPage;
window.loadUserSettingsForPage = loadUserSettingsForPage;
