// Grind Calculator functionality

// Множники для grind з новими боостами
const grindModifiers = {
    // TP Category
    tp1: 1.30,
    tp2: 1.60,
    tp3: 1.90,
    
    // Food Category
    chocolate_donut_1: 1.05,    // Level 1
    chocolate_donut_2: 1.10,    // Level 2  
    chocolate_donut_3: 1.15,    // Level 3
    ench_cookie_1: 1.03,        // Level 1
    ench_cookie_2: 1.05,        // Level 2
    ench_cookie_3: 1.07,        // Level 3
    
    // Other Category
    time: 2.7,              // +170% = x2.7
    member: 2.0,            // 2x
    premium: 1.20,          // 1.20x
    strength_star: 1.50,    // 50% boost
    sandstorm_event: 2.0    // 2x boost
};

let grindMultiplier = 1;
let friendBoostCount = 8; // За замовчуванням 8 (максимум 8 x 15% = 120%)
let currentOpenCategory = null; // Відстежуємо поточну відкриту категорію

// Показ/приховування налаштувань
function toggleGrindSettings() {
    const panel = document.getElementById('settingsPanelGrind');
    if (panel) {
        panel.classList.toggle('show');
        
        // Якщо панель відкривається, ініціалізуємо колапсні категорії
        if (panel.classList.contains('show')) {
            initializeCollapsibleCategories();
        }
    }
}

// Ініціалізація колапсних категорій
function initializeCollapsibleCategories() {
    const headers = document.querySelectorAll('.category-header-modifier');
    
    headers.forEach((header, index) => {
        // Додаємо унікальний ідентифікатор кожній категорії
        const categoryId = `category-${index}`;
        const content = header.nextElementSibling;
        
        if (content && content.classList.contains('category-content')) {
            content.setAttribute('data-category-id', categoryId);
            header.setAttribute('data-category-id', categoryId);
            
            // За замовчуванням всі категорії закриті
            content.classList.remove('expanded');
            header.classList.add('collapsed');
            
            // Додаємо обробник подій для кліку
            header.addEventListener('click', () => toggleCategory(categoryId));
        }
    });
}

// Функція для відкриття/закриття категорії
function toggleCategory(categoryId) {
    const header = document.querySelector(`[data-category-id="${categoryId}"].category-header-modifier`);
    const content = document.querySelector(`[data-category-id="${categoryId}"].category-content`);
    
    if (!header || !content) return;
    
    // Якщо клікнули на вже відкриту категорію, закриваємо її
    if (currentOpenCategory === categoryId) {
        content.classList.remove('expanded');
        header.classList.add('collapsed');
        currentOpenCategory = null;
        return;
    }
    
    // Закриваємо поточну відкриту категорію, якщо є
    if (currentOpenCategory) {
        const currentHeader = document.querySelector(`[data-category-id="${currentOpenCategory}"].category-header-modifier`);
        const currentContent = document.querySelector(`[data-category-id="${currentOpenCategory}"].category-content`);
        
        if (currentHeader && currentContent) {
            currentContent.classList.remove('expanded');
            currentHeader.classList.add('collapsed');
        }
    }
    
    // Відкриваємо нову категорію
    content.classList.add('expanded');
    header.classList.remove('collapsed');
    currentOpenCategory = categoryId;
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

// Функція для обробки Food вибору (лише один пончик і одне печення)
function handleFoodSelection(selectedFood, category) {
    const selectedCheckbox = document.getElementById(selectedFood);
    
    // Якщо чекбокс вимикається, просто оновлюємо множники
    if (!selectedCheckbox || !selectedCheckbox.checked) {
        updateGrindMultiplier();
        calculateGrindStats();
        return;
    }
    
    // Визначаємо групи
    let foodGroup = [];
    if (category === 'donut') {
        foodGroup = ['chocolate_donut_1', 'chocolate_donut_2', 'chocolate_donut_3'];
    } else if (category === 'cookie') {
        foodGroup = ['ench_cookie_1', 'ench_cookie_2', 'ench_cookie_3'];
    }
    
    // Якщо чекбокс вмикається, вимикаємо всі інші в групі
    foodGroup.forEach(food => {
        if (food !== selectedFood) {
            const checkbox = document.getElementById(food);
            if (checkbox) {
                checkbox.checked = false;
            }
        }
    });
    
    updateGrindMultiplier();
    calculateGrindStats();
}

// Friend boost functions
function increaseFriendBoost() {
    if (friendBoostCount < 8) {
        friendBoostCount++;
        updateFriendDisplay();
        calculateGrindStats();
    }
}

function decreaseFriendBoost() {
    if (friendBoostCount > 0) {
        friendBoostCount--;
        updateFriendDisplay();
        calculateGrindStats();
    }
}

function updateFriendDisplay() {
    const display = document.getElementById('friendDisplay');
    const upBtn = document.getElementById('friendUpBtn');
    const downBtn = document.getElementById('friendDownBtn');
    
    if (display) {
        const percentage = friendBoostCount * 15;
        display.textContent = `${percentage}%`;
    }
    
    // Enable/disable buttons based on limits
    if (upBtn) {
        upBtn.disabled = friendBoostCount >= 8;
    }
    if (downBtn) {
        downBtn.disabled = friendBoostCount <= 0;
    }
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

// Функція для розрахунку Friend bonus (по friendBoostCount разів по +15%)
function calculateFriendBonus(baseValue) {
    let result = baseValue;
    for (let i = 0; i < friendBoostCount; i++) {
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
    
    // Потім застосовуємо Friend bonus окремо
    if (friendBoostCount > 0) {
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
    updateFriendDisplay();

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

// Make functions globally available
window.handleTpSelection = handleTpSelection;
window.handleFoodSelection = handleFoodSelection;
window.increaseFriendBoost = increaseFriendBoost;
window.decreaseFriendBoost = decreaseFriendBoost;
window.updateGrindMultiplier = updateGrindMultiplier;
window.toggleGrindSettings = toggleGrindSettings;
