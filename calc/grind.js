// Grind Calculator functionality with category toggles and multilingual support

// Global variables for translations
let grindCalcTranslations = null;
let currentGrindLanguage = 'en';

// Load calculator translations (reuse from calculator)
async function loadGrindTranslations() {
    if (grindCalcTranslations) return grindCalcTranslations;
    
    try {
        console.log('📥 Loading grind calculator translations...');
        const response = await fetch('languages/calc.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        grindCalcTranslations = await response.json();
        console.log('✅ Grind calculator translations loaded successfully');
        return grindCalcTranslations;
    } catch (error) {
        console.error('❌ Error loading grind calculator translations:', error);
        // Fallback to English
        grindCalcTranslations = {
            en: {
                common: { calculate: "Calculate", settings: "Settings" },
                grind: {
                    inputLabel: "Enter Base Value:",
                    inputPlaceholder: "Enter your base grind value...",
                    resultLabel: "Final Grind Value:",
                    errorInvalidNumber: "Please enter a valid number"
                }
            }
        };
        return grindCalcTranslations;
    }
}

// Update grind calculator language
async function updateGrindLanguage(lang) {
    if (!grindCalcTranslations) {
        await loadGrindTranslations();
    }
    
    currentGrindLanguage = lang;
    
    if (!grindCalcTranslations[lang]) {
        console.error(`❌ Grind calculator language ${lang} not found, defaulting to English`);
        currentGrindLanguage = 'en';
    }
    
    const translations = grindCalcTranslations[currentGrindLanguage];
    if (!translations || !translations.grind) return;
    
    // Update grind calculator input elements
    const inputLabel = document.querySelector('#grindPage .input-label');
    const inputField = document.getElementById('numberInputGrind');
    const calculateBtn = document.querySelector('#grindPage .calculate-btn');
    const resultLabel = document.querySelector('#grindPage .stats-label');
    const settingsTitle = document.querySelector('#settingsPanelGrind .settings-title');
    
    if (inputLabel && translations.grind.inputLabel) {
        inputLabel.textContent = translations.grind.inputLabel;
    }
    
    if (inputField && translations.grind.inputPlaceholder) {
        inputField.placeholder = translations.grind.inputPlaceholder;
    }
    
    if (calculateBtn && translations.common.calculate) {
        calculateBtn.textContent = translations.common.calculate;
    }
    
    if (resultLabel && translations.grind.resultLabel) {
        resultLabel.textContent = translations.grind.resultLabel;
    }
    
    if (settingsTitle && translations.common.settings) {
        settingsTitle.textContent = translations.common.settings;
    }
    
    console.log(`✅ Grind calculator language updated to: ${currentGrindLanguage}`);
}

// FIXED: Множники для grind (правильні значення як в HTML)
const grindModifiers = {
    // TP Category
    tp1: 1.30,           // +30%
    tp2: 1.60,           // +60%
    tp3: 1.90,           // +90%
    
    // Food Category
    chocolate_donut_1: 1.05,    // +5%
    chocolate_donut_2: 1.10,    // +10%
    chocolate_donut_3: 1.15,    // +15%
    ench_cookie_1: 1.03,        // +3%
    ench_cookie_2: 1.05,        // +5%
    ench_cookie_3: 1.07,        // +7%
    
    // Other Category
    time: 2.7,              // +170% = x2.7
    member: 2.0,            // 2x
    premium: 1.20,          // +20%
    strength_star: 1.50,    // +50%
    sandstorm_event: 1.3    // 1.3x (FIXED: was 2.0 but HTML shows 2x which is wrong, keeping consistent with HTML display)
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
    
    console.log('Grind multiplier updated to:', grindMultiplier); // Для відладки
    
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
            // Use translated error message
            const translations = grindCalcTranslations && grindCalcTranslations[currentGrindLanguage];
            const errorText = (translations && translations.grind && translations.grind.errorInvalidNumber) 
                || 'Please enter a valid number';
            errorMessage.textContent = errorText;
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

    console.log(`Calculating: ${baseValue} * ${grindMultiplier} * friend_boost = ${finalValue}`); // Для відладки

    resultValue.textContent = finalValue.toLocaleString('uk-UA', {
        minimumFractionDigits: finalValue % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 8
    });

    resultSection.classList.add('show');
}

// Ініціалізація Grind при завантаженні сторінки
async function initializeGrind() {
    console.log('🔄 Initializing Grind Calculator with multilingual support...');
    
    // Load translations
    await loadGrindTranslations();
    
    // Get current app language
    const currentAppLanguage = (typeof getCurrentAppLanguage === 'function') 
        ? getCurrentAppLanguage() 
        : 'en';
    
    // Update grind calculator language
    await updateGrindLanguage(currentAppLanguage);
    
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
    
    console.log('✅ Grind Calculator initialized with multilingual support and collapsible categories');
}

// Listen for language change events
document.addEventListener('languageChanged', async (event) => {
    const newLanguage = event.detail.language;
    console.log('🌍 Grind calculator received language change:', newLanguage);
    await updateGrindLanguage(newLanguage);
});

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
window.updateGrindLanguage = updateGrindLanguage;
window.loadGrindTranslations = loadGrindTranslations;
