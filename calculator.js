// Calculator functionality

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

// Toggle settings panel
function toggleSettings() {
    document.getElementById('settingsPanel').classList.toggle('show');
}

// Update multiplier based on selected checkboxes
function updateMultiplier() {
    currentMultiplier = 1;
    for (const mod in modifiers) {
        if (document.getElementById(mod).checked) {
            currentMultiplier *= modifiers[mod];
        }
    }
}

// Calculate stats function
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

// Initialize calculator
function initializeCalculator() {
    updateMultiplier();
    
    // Add event listeners for calculator inputs
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
}
