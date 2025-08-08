// Pet Stats Calculator functionality

// Множники для петів
const modifiers = {
    shiny: 1.15,
    pristine: 1.085,
    void: 2,
    cosmic: 2.5,
    slime: 3.15,
    maxlvl: 2.2388,
    goliath: 2.5
};

let multiplier = 1;

// Показ/приховування налаштувань
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    if (panel) {
        panel.classList.toggle('show');
    }
}

// Оновлення множника при зміні чекбоксів
function updateMultiplier() {
    multiplier = 1;
    for (const id in modifiers) {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked) {
            multiplier *= modifiers[id];
        }
    }
    // Автоматично перерахувати результат після оновлення множника
    calculateStats();
}

// Розрахунок результату
function calculateStats() {
    const input = document.getElementById('numberInput');
    const resultSection = document.getElementById('resultSection');
    const resultValue = document.getElementById('resultValue');
    const errorMessage = document.getElementById('errorMessage');

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

    const finalValue = baseValue * multiplier;

    resultValue.textContent = finalValue.toLocaleString('uk-UA', {
        minimumFractionDigits: finalValue % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 8
    });

    resultSection.classList.add('show');
}

// Ініціалізація калькулятора при завантаженні сторінки
function initializeCalculator() {
    updateMultiplier();

    const numberInput = document.getElementById('numberInput');
    if (numberInput) {
        numberInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                calculateStats();
            }
        });

        numberInput.addEventListener('input', () => {
            const errorMessage = document.getElementById('errorMessage');
            if (errorMessage) errorMessage.textContent = '';
        });
    }
}
