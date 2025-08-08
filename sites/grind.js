// Grind Calculator functionality

// Множники для grind
const grindModifiers = {
    tp1: 1.30,
    tp2: 1.60,
    tp3: 1.90,
    chocolate_donut: 1.15,
    ench_cookie: 1.07,
    time: 2.7,      // +170% = x2.7
    member: 2.0,    // 2x
    premium: 1.20   // 1.20x
};

let grindMultiplier = 1;

// Показ/приховування налаштувань
function toggleGrindSettings() {
    const panel = document.getElementById('settingsPanelGrind');
    if (panel) {
        panel.classList.toggle('show');
    }
}

// Функція для обробки TP вибору (лише один з трьох)
function handleTpSelection(selectedTp) {
    const selectedCheckbox = document.getElementById(selectedTp);
    
    // Якщо чекбокс вимикається, просто оновлюємо множники
    if (!selectedCheckbox || !selectedCheckbox.checked) {
        updateGrindMultiplier();
        calculateGrindStats();
        return;
    }
    
    // Якщо чекбокс вмикається, вимикаємо всі інші TP
    const tpCheckboxes = ['tp1', 'tp2', 'tp3'];
    tpCheckboxes.forEach(tp => {
        if (tp !== selectedTp) {
            const checkbox = document.getElementById(tp);
            if (checkbox) {
                checkbox.checked = false;
            }
        }
    });
    
    updateGrindMultiplier();
    calculateGrindStats();
}

// Оновлення множника при зміні чекбоксів
function updateGrindMultiplier() {
    grindMultiplier = 1;
    for (const id in grindModifiers) {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked) {
            grindMultiplier *= grindModifiers[id];
        }
    }
    // Автоматично перерахувати результат після оновлення множника
    calculateGrindStats();
}

// Функція для розрахунку Friend bonus (8 разів по +15%)
function calculateFriendBonus(baseValue) {
    let result = baseValue;
    for (let i = 0; i < 8; i++) {
        result = result * 1.15; // +15% кожен раз
    }
    return result;
}

// Розрахунок результату
function calculateGrindStats() {
    const input = document.getElementById('numberInputGrind');
    const resultSection = document.getElementById('resultSectionGrind');
    const resultValue = document.getElementById('resultValueGrind');
    const errorMessage = document.getElementById('errorMessageGrind');

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

    // Спочатку застосовуємо всі звичайні множники
    let finalValue = baseValue * grindMultiplier;
    
    // Потім застосовуємо Friend bonus окремо, якщо він увімкнений
    const friendCheckbox = document.getElementById('friend');
    if (friendCheckbox && friendCheckbox.checked) {
        finalValue = calculateFriendBonus(finalValue);
    }

    resultValue.textContent = finalValue.toLocaleString('uk-UA', {
        minimumFractionDigits: finalValue % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 8
    });

    resultSection.classList.add('show');
}

// Ініціалізація Grind при завантаженні сторінки
function initializeGrind() {
    updateGrindMultiplier();

    const numberInput = document.getElementById('numberInputGrind');
    if (numberInput) {
        numberInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                calculateGrindStats();
            }
        });

        numberInput.addEventListener('input', () => {
            const errorMessage = document.getElementById('errorMessageGrind');
            if (errorMessage) errorMessage.textContent = '';
        });
    }
}
