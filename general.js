// General JavaScript functions

// Page switching functionality
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
    
    // Update active nav button - використовуємо масив для правильного індексування
    const pageMap = {
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
    
    if (buttonIndex !== undefined && navButtons[buttonIndex]) {
        navButtons[buttonIndex].classList.add('active');
        console.log(`Nav button ${buttonIndex} activated for ${page}`);
    }
    
    // Close sidebar after selection
    closeSidebar();
    
    // Trigger page-specific initialization if needed
    initializePageContent(page);
}

// Initialize specific page content when switching
function initializePageContent(page) {
    switch(page) {
        case 'login':
            if (typeof initializeAuth === 'function') {
                initializeAuth();
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

// Auth action handler for sidebar button
function handleAuthAction() {
    const currentUser = AuthSystem?.currentUser;
    
    if (currentUser) {
        // User is logged in - logout
        logout();
    } else {
        // User is not logged in - go to login page
        switchPage('login');
    }
}

// Update sidebar user info
function updateSidebarUserInfo(user = null) {
    const userInfo = document.getElementById('userInfo');
    const authButton = document.getElementById('authButton');
    const sidebarUserNickname = document.getElementById('sidebarUserNickname');
    
    if (user && userInfo && authButton && sidebarUserNickname) {
        // Show user info
        userInfo.style.display = 'block';
        sidebarUserNickname.textContent = user.nickname || 'User';
        
        // Change button to logout
        authButton.textContent = 'Вийти';
        authButton.classList.add('logout-btn');
        
        console.log('✅ Sidebar user info updated for logged in user');
    } else if (userInfo && authButton) {
        // Hide user info
        userInfo.style.display = 'none';
        
        // Change button to login
        authButton.textContent = 'Увійти';
        authButton.classList.remove('logout-btn');
        
        console.log('✅ Sidebar user info updated for logged out user');
    }
}

// Check and update user status
function checkUserStatus() {
    if (typeof AuthSystem !== 'undefined' && AuthSystem.currentUser) {
        updateSidebarUserInfo(AuthSystem.currentUser);
    } else {
        updateSidebarUserInfo(null);
    }
}

// Прапорець для запобігання повторної ініціалізації
let appInitialized = false;

// Головна функція ініціалізації (викликається після завантаження контенту)
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
    
    // Check if user is already logged in and update sidebar
    setTimeout(() => {
        checkUserStatus();
    }, 200);
    
    // Determine starting page based on login status
    let startingPage = 'login';
    if (typeof AuthSystem !== 'undefined' && AuthSystem.currentUser) {
        startingPage = 'calculator';
    } else {
        // Check if there's a saved user
        const savedUser = localStorage.getItem('armHelper_currentUser');
        if (savedUser) {
            startingPage = 'calculator';
        }
    }
    
    // Make sure starting page is active
    switchPage(startingPage);
    
    // Click outside settings panel to close - ВИПРАВЛЕНА ВЕРСІЯ
    document.addEventListener('click', e => {
        // Закриваємо панелі налаштувань при кліку поза ними
        const settingsPanels = [
            { panel: document.getElementById('settingsPanel'), btn: document.querySelector('#calculatorPage .settings-btn') },
            { panel: document.getElementById('settingsPanelArm'), btn: document.querySelector('#armPage .settings-btn') },
            { panel: document.getElementById('settingsPanelGrind'), btn: document.querySelector('#grindPage .settings-btn') }
        ];
        
        settingsPanels.forEach(({ panel, btn }) => {
            if (panel && btn) {
                // Перевіряємо чи клік був НЕ всередині панелі і НЕ на кнопці налаштувань
                // Також перевіряємо чи це не клік на category-button або back-btn
                const isClickInsidePanel = panel.contains(e.target);
                const isClickOnSettingsBtn = btn.contains(e.target);
                const isClickOnCategoryButton = e.target.closest('.category-button');
                const isClickOnBackButton = e.target.closest('.back-btn');
                const isClickOnCategorySwitch = e.target.closest('.category-switch');
                const isClickOnSimpleModifier = e.target.closest('.simple-modifier');
                
                // Закриваємо панель тільки якщо клік був поза всіма інтерактивними елементами
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
    
    // Set the flag AFTER initialization
    if (typeof window !== 'undefined') {
        window.appInitialized = true;
    }
    appInitialized = true;
    console.log('✅ Ініціалізація додатка завершена');
}

// Ініціалізація всіх модулів
function initializeAllModules() {
    const modules = [
        'initializeAuth',
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

// Override logout function to update sidebar
const originalLogout = typeof logout !== 'undefined' ? logout : function() {};
function logout() {
    if (confirm('Ви впевнені, що хочете вийти?')) {
        // Call original logout logic
        if (typeof AuthSystem !== 'undefined') {
            AuthSystem.currentUser = null;
            localStorage.removeItem('armHelper_currentUser');
        }
        
        // Update sidebar
        updateSidebarUserInfo(null);
        
        // Go to login page
        switchPage('login');
        
        // Show message if AuthSystem is available
        if (typeof AuthSystem !== 'undefined' && typeof AuthSystem.showMessage === 'function') {
            AuthSystem.showMessage('Ви успішно вийшли з системи', 'success');
        }
        
        console.log('✅ Користувач вийшов з системи');
    }
}

// Listen for login events to update sidebar
document.addEventListener('userLoggedIn', function(event) {
    const user = event.detail;
    updateSidebarUserInfo(user);
    console.log('✅ User logged in event received, sidebar updated');
});

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
