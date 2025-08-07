// General JavaScript functions

// Page switching functionality
function switchPage(page) {
    document.querySelectorAll('.page, .nav-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(page + 'Page').classList.add('active');
    
    // Update active nav button
    const navButtons = document.querySelectorAll('.nav-btn');
    if (page === 'calculator') {
        navButtons[0].classList.add('active');
    } else if (page === 'arm') {
        navButtons[1].classList.add('active');
    } else if (page === 'boosts') {
        navButtons[2].classList.add('active');
    } else if (page === 'shiny') {
        navButtons[3].classList.add('active');
    }
}

// Initialize functions when page loads
document.addEventListener('DOMContentLoaded', () => {
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
