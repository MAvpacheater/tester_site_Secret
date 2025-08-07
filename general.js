// General JavaScript functions

// Page titles mapping
const pageTitles = {
    'calculator': 'Pet Calculator',
    'arm': 'Arm Calculator',
    'boosts': 'Boosts',
    'shiny': 'Shiny Stats'
};

// Toggle hamburger menu
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    
    menu.classList.toggle('active');
    hamburgerBtn.classList.toggle('active');
}

// Switch page from menu and close menu
function switchPageFromMenu(page) {
    switchPage(page);
    toggleMenu(); // Close menu after selection
}

// Page switching functionality
function switchPage(page) {
    // Switch page content
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    document.getElementById(page + 'Page').classList.add('active');
    
    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
    const menuItems = document.querySelectorAll('.menu-item');
    let activeIndex = 0;
    if (page === 'arm') activeIndex = 1;
    else if (page === 'boosts') activeIndex = 2;
    else if (page === 'shiny') activeIndex = 3;
    
    if (menuItems[activeIndex]) {
        menuItems[activeIndex].classList.add('active');
    }
    
    // Update page title
    const titleElement = document.getElementById('currentPageTitle');
    if (titleElement && pageTitles[page]) {
        titleElement.textContent = pageTitles[page];
    }
}

// Initialize functions when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Click outside menu to close
    document.addEventListener('click', e => {
        const menu = document.getElementById('navMenu');
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        
        if (menu && hamburgerBtn) {
            if (!menu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                menu.classList.remove('active');
                hamburgerBtn.classList.remove('active');
            }
        }

        // Settings panel close functionality
        const settingsPanel = document.getElementById('settingsPanel');
        const settingsBtn = document.querySelector('.settings-btn');
        if (settingsPanel && settingsBtn) {
            if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
                settingsPanel.classList.remove('show');
            }
        }
    });

    // Initialize calculator functions
    if (typeof initializeCalculator === 'function') {
        initializeCalculator();
    }

    // Initialize arm calculator
    if (typeof initializeArm === 'function') {
        initializeArm();
    }

    // Initialize boosts
    if (typeof initializeBoosts === 'function') {
        initializeBoosts();
    }

    // Initialize shiny stats
    if (typeof initializeShiny === 'function') {
        initializeShiny();
    }
});

// Compatibility timeout for initialization
setTimeout(() => {
    // Initialize calculator functions
    if (typeof initializeCalculator === 'function') {
        initializeCalculator();
    }

    // Initialize arm calculator
    if (typeof initializeArm === 'function') {
        initializeArm();
    }

    // Initialize boosts
    if (typeof initializeBoosts === 'function') {
        initializeBoosts();
    }

    // Initialize shiny stats
    if (typeof initializeShiny === 'function') {
        initializeShiny();
    }
}, 100);
