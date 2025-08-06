const modifiers = { 
    shiny: 1.15, 
    pristine: 1.085, 
    void: 2, 
    cosmic: 2.5, 
    slime: 3.15, 
    maxlvl: 2.238805970129253731, 
    goliath: 2.5 
};
let currentMultiplier = 1;

// Generate shiny stats data
function generateShinyStats() {
    const grid = document.getElementById('statsGrid');
    if (!grid) {
        console.error('Element with ID "statsGrid" not found');
        return;
    }
    
    const statsData = [
        [250, 287.5], [255, 293.25], [260, 299], [265, 304.75], [270, 310.5],
        [275, 316.25], [280, 322], [285, 327.75], [290, 333.5], [295, 339.25],[299,343.85],
        [300, 345], [305, 350.75], [310, 356.5], [315, 362.25], [320, 368],
        [325, 373.75], [330, 379.5], [335, 385.25], [340, 391], [345, 396.75],
        [350, 402.5], [355, 408.25], [360, 414],[362,416.3], [365, 419.75], [370, 425.5],
        [375, 431.25], [380, 437], [385, 442.75], [390, 448.5], [395, 454.25],
        [400, 460], [405, 465.75], [410, 471.5], [415, 477.25], [420, 483],
        [425, 488.75], [430, 494.5], [435, 500.25], [440, 506], [445, 511.75],
        [450, 517.5], [455, 523.25], [460, 529], [465, 534.75], [470, 540.5], [475, 546.25]
    ];
    
    statsData.forEach(([base, shiny]) => {
        const row = document.createElement('div');
        row.className = 'stat-row';
        const shinyStr = shiny % 1 === 0 ? shiny.toString() : shiny.toString().replace('.', ',');
        row.innerHTML = `<span class="left-value">${base}%</span><span class="right-value">≈ ${shinyStr}%</span>`;
        grid.appendChild(row);
    });
}

function switchPage(page) {
    document.querySelectorAll('.page, .nav-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(page + 'Page').classList.add('active');
    document.querySelector(page === 'calculator' ? '.nav-btn:first-child' : '.nav-btn:last-child').classList.add('active');
}

function toggleSettings() {
    document.getElementById('settingsPanel').classList.toggle('show');
}

function updateMultiplier() {
    currentMultiplier = 1;
    for (const mod in modifiers) {
        if (document.getElementById(mod).checked) {
            currentMultiplier *= modifiers[mod];
        }
    }
}

function calculateStats() {
    const input = document.getElementById('numberInput');
    const resultSection = document.getElementById('resultSection');
    const resultValue = document.getElementById('resultValue');
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.textContent = '';
    const inputValue = parseFloat(input.value);
    
    if (isNaN(inputValue) || input.value.trim() === '') {
        errorMessage.textContent = 'Please enter a valid number';
        resultSection.classList.remove('show');
        return;
    }
    
    const result = inputValue * currentMultiplier;
    resultValue.textContent = result.toLocaleString('uk-UA', { 
        minimumFractionDigits: result % 1 === 0 ? 0 : 2, 
        maximumFractionDigits: 8 
    });
    resultSection.classList.add('show');
}

// Initialize multiplier on page load
function initializeMultiplier() {
    updateMultiplier();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Input event listeners
    const numberInput = document.getElementById('numberInput');
    if (numberInput) {
        numberInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') calculateStats();
        });
        
        numberInput.addEventListener('input', () => {
            const errorMessage = document.getElementById('errorMessage');
            if (errorMessage) {
                errorMessage.textContent = '';
            }
        });
    }

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

    // Initialize functions
    generateShinyStats();
    initializeMultiplier();
});

// Also initialize after a short delay for compatibility
setTimeout(() => {
    generateShinyStats();
    initializeMultiplier();
}, 100);
