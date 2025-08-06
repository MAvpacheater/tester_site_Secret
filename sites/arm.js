// Arm Calculator functionality

const ARM_MULTIPLIER = 2.1;

// Calculate arm stats function
function calculateArmStats() {
    const input = document.getElementById('armNumberInput');
    const resultSection = document.getElementById('armResultSection');
    const resultValue = document.getElementById('armResultValue');
    const errorMessage = document.getElementById('armErrorMessage');
    
    errorMessage.textContent = '';
    const inputValue = parseFloat(input.value);
    
    if (isNaN(inputValue) || input.value.trim() === '') {
        errorMessage.textContent = 'Please enter a valid number';
        resultSection.classList.remove('show');
        return;
    }
    
    const result = inputValue * ARM_MULTIPLIER;
    resultValue.textContent = result.toLocaleString('uk-UA', { 
        minimumFractionDigits: result % 1 === 0 ? 0 : 2, 
        maximumFractionDigits: 8 
    });
    resultSection.classList.add('show');
}

// Initialize arm calculator
function initializeArm() {
    // Add event listeners for arm calculator inputs
    const armNumberInput = document.getElementById('armNumberInput');
    if (armNumberInput) {
        armNumberInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') calculateArmStats();
        });
        
        armNumberInput.addEventListener('input', () => {
            const errorMessage = document.getElementById('armErrorMessage');
            if (errorMessage) {
                errorMessage.textContent = '';
            }
        });
    }
}
