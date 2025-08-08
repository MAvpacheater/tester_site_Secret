// Arm Stats Calculator functionality

// Константа для множника рук
const armMultiplier = 136.11;

// Розрахунок результату для рук
function calculateArmStats() {
    const input = document.getElementById('armNumberInput');
    const resultSection = document.getElementById('armResultSection');
    const resultValue = document.getElementById('armResultValue');
    const errorMessage = document.getElementById('armErrorMessage');

    if (!input || !resultSection || !resultValue || !errorMessage) return;

    errorMessage.textContent = '';

    const baseValue = parseFloat(input.value);

    if (isNaN(baseValue) || input.value.trim() === '') {
        if (input.value.trim() !== '') {
            errorMessage.textContent = 'Please enter a valid number';
        }
        resultSection.classList.remove('show');
        return;
    }

    const finalValue = baseValue * armMultiplier;

    resultValue.textContent = finalValue.toLocaleString('uk-UA', {
        minimumFractionDigits: finalValue % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 8
    });

    resultSection.classList.add('show');
}

// Ініціалізація калькулятора рук при завантаженні сторінки
function initializeArm() {
    const armNumberInput = document.getElementById('armNumberInput');
    if (armNumberInput) {
        armNumberInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                calculateArmStats();
            }
        });

        armNumberInput.addEventListener('input', () => {
            const errorMessage = document.getElementById('armErrorMessage');
            if (errorMessage) errorMessage.textContent = '';
            // Автоматично перерахувати при введенні
            calculateArmStats();
        });
    }
}
