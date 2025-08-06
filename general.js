// General JavaScript functions

// Page switching functionality
function switchPage(page) {
    document.querySelectorAll('.page, .nav-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(page + 'Page').classList.add('active');
    document.querySelector(page === 'calculator' ? '.nav-btn:first-child' : '.nav-btn:last-child').classList.add('active');
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

    // Initialize shiny stats
    if (typeof initializeShiny === 'function') {
        initializeShiny();
    }
}, 100);
