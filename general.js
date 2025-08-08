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
    } else if (page === 'boosts' && navButtons[2]) {
        navButtons[2].classList.add('active');
    } else if (page === 'shiny' && navButtons[3]) {
        navButtons[3].classList.add('active');
    } else if (page === 'codes' && navButtons[4]) {
        navButtons[4].classList.add('active');
    }
    
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

// Initialize functions when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Make sure calculator page is active by default
    switchPage('calculator');
    
    // Click outside settings panel to close
    document.addEventListener('click', e => {
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
    // Make sure calculator page is active by default
    if (!document.querySelector('.page.active')) {
        switchPage('calculator');
    }
    
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
