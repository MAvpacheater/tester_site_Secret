// General JavaScript functions

// Page switching functionality
function switchPage(page) {
    // Remove active class from all pages and nav buttons
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    // Add active class to selected page
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update active nav button
    const navButtons = document.querySelectorAll('.nav-btn');
    if (page === 'calculator' && navButtons[0]) {
        navButtons[0].classList.add('active');
    } else if (page === 'arm' && navButtons[1]) {
        navButtons[1].classList.add('active');
    } else if (page === 'grind' && navButtons[2]) {
        navButtons[2].classList.add('active');
    } else if (page === 'boosts' && navButtons[3]) {
        navButtons[3].classList.add('active');
    } else if (page === 'shiny' && navButtons[4]) {
        navButtons[4].classList.add('active');
    } else if (page === 'codes' && navButtons[5]) {
        navButtons[5].classList.add('active');
    } else if (page === 'aura' && navButtons[6]) {
        navButtons[6].classList.add('active');
    } else if (page === 'trainer' && navButtons[7]) {
        navButtons[7].classList.add('active');
    } else if (page === 'info' && navButtons[8]) {
        navButtons[8].classList.add('active');
    }
    
    // Initialize page-specific content when switching
    setTimeout(() => {
        if (page === 'boosts' && typeof generateBoostsContent === 'function') {
            generateBoostsContent();
        } else if (page === 'shiny' && typeof generateShinyStats === 'function') {
            generateShinyStats();
        } else if (page === 'codes' && typeof generateCodesContent === 'function') {
            generateCodesContent();
        } else if (page === 'aura' && typeof generateAuraContent === 'function') {
            generateAuraContent();
        } else if (page === 'trainer' && typeof generateAllTrainerContent === 'function') {
            generateAllTrainerContent();
        } else if (page === 'info' && typeof generateInfoContent === 'function') {
            generateInfoContent();
        }
    }, 50);
    
    // Close sidebar after selection
    closeSidebar();
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

// Safe initialization function
function safeInitialize(funcName, name) {
    try {
        if (typeof window[funcName] === 'function') {
            window[funcName]();
            console.log(`✅ ${name} initialized successfully`);
        } else {
            console.log(`⚠️ ${funcName} function not found, skipping ${name}`);
        }
    } catch (error) {
        console.error(`❌ Error initializing ${name}:`, error);
    }
}

// Initialize all functions
function initializeAll() {
    console.log('🚀 Starting application initialization...');
    
    // Initialize calculators
    safeInitialize('initializeCalculator', 'Pet Calculator');
    safeInitialize('initializeArm', 'Arm Calculator');
    safeInitialize('initializeGrind', 'Grind Calculator');
    
    // Initialize info pages
    safeInitialize('initializeBoosts', 'Boosts');
    safeInitialize('initializeShiny', 'Shiny Stats');
    safeInitialize('initializeAura', 'Aura');
    safeInitialize('initializeTrainer', 'Trainer');
    safeInitialize('initializeInfo', 'Info');
    
    // Generate content for info pages
    safeInitialize('generateCodesContent', 'Codes Content');
    
    console.log('✅ Application initialization completed');
}

// Initialize functions when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Content Loaded');
    
    // Make sure calculator page is active by default
    setTimeout(() => {
        switchPage('calculator');
        initializeAll();
    }, 100);
    
    // Click outside settings panel to close
    document.addEventListener('click', e => {
        // Закриваємо панелі налаштувань при кліку поза ними
        const settingsPanels = [
            { panel: document.getElementById('settingsPanel'), btn: document.querySelector('#calculatorPage .settings-btn') },
            { panel: document.getElementById('settingsPanelArm'), btn: document.querySelector('#armPage .settings-btn') },
            { panel: document.getElementById('settingsPanelGrind'), btn: document.querySelector('#grindPage .settings-btn') }
        ];
        
        settingsPanels.forEach(({ panel, btn }) => {
            if (panel && btn) {
                if (!panel.contains(e.target) && !btn.contains(e.target)) {
                    panel.classList.remove('show');
                }
            }
        });
    });
});

// Compatibility timeout for initialization
setTimeout(() => {
    // Make sure calculator page is active by default
    if (!document.querySelector('.page.active')) {
        console.log('🔄 Fallback initialization triggered');
        switchPage('calculator');
        initializeAll();
    }
}, 500);

// Make functions available globally
window.switchPage = switchPage;
window.toggleMobileMenu = toggleMobileMenu;
window.closeSidebar = closeSidebar;
