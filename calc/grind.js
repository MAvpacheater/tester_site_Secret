// Grind Calculator functionality with category toggles

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

// Function to toggle grind categories (only one open at a time)
function toggleGrindCategory(categoryId) {
    console.log(`Toggling grind category: ${categoryId}`);
    
    const categoryContent = document.getElementById(categoryId);
    const categoryHeader = document.querySelector(`[onclick="toggleGrindCategory('${categoryId}')"]`);
    
    if (!categoryContent || !categoryHeader) {
        console.error(`Category elements not found for: ${categoryId}`);
        return;
    }
    
    const toggleIcon = categoryHeader.querySelector('.category-toggle-modifier');
    const isCurrentlyExpanded = categoryContent.classList.contains('expanded');
    
    // Close all categories first
    document.querySelectorAll('.modifier-category .category-content').forEach(content => {
        content.classList.remove('expanded');
    });
    
    document.querySelectorAll('.category-header-modifier').forEach(header => {
        header.classList.remove('expanded');
        header.classList.add('collapsed');
        const icon = header.querySelector('.category-toggle-modifier');
        if (icon) {
            icon.classList.remove('expanded');
        }
    });
    
    // If this category wasn't expanded, expand it
    if (!isCurrentlyExpanded) {
        categoryContent.classList.add('expanded');
        categoryHeader.classList.remove('collapsed');
        categoryHeader.classList.add('expanded');
        if (toggleIcon) {
            toggleIcon.classList.add('expanded');
        }
    }
}

// Initialize all categories as closed
function initializeGrindCategories() {
    console.log('Initializing grind categories - all closed by default');
    
    // Close all categories by default
    document.querySelectorAll('.modifier-category .category-content').forEach(content => {
        content.classList.remove('expanded');
    });
    
    document.querySelectorAll('.category-header-modifier').forEach(header => {
        header.classList.add('collapsed');
        header.classList.remove('expanded');
        const icon = header.querySelector('.category-toggle-modifier');
        if (icon) {
            icon.classList.remove('expanded');
        }
    });
}

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
    console.log('🔄 Initializing Grind Calculator...');
    updateGrindMultiplier();
    updateFriendDisplay();
    initializeGrindCategories(); // Initialize categories as closed

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
    
    console.log('✅ Grind Calculator initialized with collapsible categories');
}

// Make functions globally available
window.handleTpSelection = handleTpSelection;
window.handleFoodSelection = handleFoodSelection;
window.increaseFriendBoost = increaseFriendBoost;
window.decreaseFriendBoost = decreaseFriendBoost;
window.updateGrindMultiplier = updateGrindMultiplier;
window.toggleGrindCategory = toggleGrindCategory;
window.initializeGrindCategories = initializeGrindCategories;
window.toggleGrindSettings = toggleGrindSettings;
window.calculateGrindStats = calculateGrindStats;
window.initializeGrind = initializeGrind;
