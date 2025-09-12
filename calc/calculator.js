// Pet Stats Calculator functionality with multilingual support

// Global variables
let calcTranslations = null;
let currentCalcLanguage = 'en';

// Load calculator translations
async function loadCalcTranslations() {
    if (calcTranslations) return calcTranslations;
    
    try {
        console.log('📥 Loading calculator translations...');
        const response = await fetch('languages/calc.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        calcTranslations = await response.json();
        console.log('✅ Calculator translations loaded successfully');
        return calcTranslations;
    } catch (error) {
        console.error('❌ Error loading calculator translations:', error);
        // Fallback to English
        calcTranslations = {
            en: {
                common: { calculate: "Calculate", settings: "Settings", back: "← Back" },
                calculator: {
                    inputLabel: "Enter Pet Stats:",
                    inputPlaceholder: "Enter your pet's base stats...",
                    resultLabel: "Final Pet Stats:",
                    errorInvalidNumber: "Please enter a valid number"
                }
            }
        };
        return calcTranslations;
    }
}

// Update calculator language
async function updateCalculatorLanguage(lang) {
    if (!calcTranslations) {
        await loadCalcTranslations();
    }
    
    currentCalcLanguage = lang;
    
    if (!calcTranslations[lang]) {
        console.error(`❌ Calculator language ${lang} not found, defaulting to English`);
        currentCalcLanguage = 'en';
    }
    
    const translations = calcTranslations[currentCalcLanguage];
    if (!translations) return;
    
    // Update calculator input elements
    const inputLabel = document.querySelector('#calculatorPage .input-label');
    const inputField = document.getElementById('numberInput');
    const calculateBtn = document.querySelector('#calculatorPage .calculate-btn');
    const resultLabel = document.querySelector('#calculatorPage .stats-label');
    const settingsTitle = document.querySelector('#settingsPanel .settings-title');
    
    if (inputLabel && translations.calculator.inputLabel) {
        inputLabel.textContent = translations.calculator.inputLabel;
    }
    
    if (inputField && translations.calculator.inputPlaceholder) {
        inputField.placeholder = translations.calculator.inputPlaceholder;
    }
    
    if (calculateBtn && translations.common.calculate) {
        calculateBtn.textContent = translations.common.calculate;
    }
    
    if (resultLabel && translations.calculator.resultLabel) {
        resultLabel.textContent = translations.calculator.resultLabel;
    }
    
    if (settingsTitle && translations.common.settings) {
        settingsTitle.textContent = translations.common.settings;
    }
    
    console.log(`✅ Calculator language updated to: ${currentCalcLanguage}`);
}

// Категорії модифікаторів
const modifierCategories = {
    slimes: {
        title: "Slimes",
        options: [
            { id: "slime_normal", name: "Normal", multiplier: 1 },
            { id: "slime_yellow", name: "Yellow", multiplier: 1.2 },
            { id: "slime_blue", name: "Blue", multiplier: 1.4 },
            { id: "slime_purple", name: "Purple", multiplier: 1.65 },
            { id: "slime_red", name: "Red", multiplier: 2.25 },
            { id: "slime_black", name: "Black", multiplier: 2.4 },
            { id: "slime_green", name: "Green", multiplier: 2.55 },
            { id: "slime_orange", name: "Orange", multiplier: 2.7 },
            { id: "slime_christmas", name: "Christmas (Xmas)", multiplier: 2.85 },
            { id: "slime_neowave", name: "Neowave", multiplier: 3 },
            { id: "slime_shock", name: "Shock", multiplier: 3.15 }
        ],
        default: "slime_shock"
    },
    mutation: {
        title: "Mutation",
        options: [
            { id: "mutation_normal", name: "Normal", multiplier: 1 },
            { id: "mutation_glowing", name: "Glowing", multiplier: 1.2 },
            { id: "mutation_rainbow", name: "Rainbow", multiplier: 1.35 },
            { id: "mutation_ghost", name: "Ghost", multiplier: 2 },
            { id: "mutation_cosmic", name: "Cosmic", multiplier: 2.5 }
        ],
        default: "mutation_cosmic"
    },
    evolution: {
        title: "Evolution and Size",
        options: [
            { id: "evolution_baby", name: "Baby", multiplier: 1 },
            { id: "evolution_big", name: "Big", multiplier: 1.5 },
            { id: "evolution_huge", name: "Huge", multiplier: 2 },
            { id: "evolution_goliath", name: "Goliath", multiplier: 2.5 }
        ],
        default: "evolution_goliath"
    },
    type: {
        title: "Type",
        options: [
            { id: "type_normal", name: "Normal", multiplier: 1 },
            { id: "type_golden", name: "Golden", multiplier: 1.5 },
            { id: "type_void", name: "Void", multiplier: 2 },
            { id: "type_pristine", name: "Pristine", multiplier: 2.17 }
        ],
        default: "type_pristine"
    }
};

// Прості модифікатори
const simpleModifiers = {
    shiny: { name: "Shiny", multiplier: 1.15 },
    maxlvl: { name: "Max lvl", multiplier: 2.2388 }
};

let currentSelections = {};

// Ініціалізація за замовчуванням
function initializeDefaults() {
    console.log('🔧 Ініціалізація дефолтних значень...');
    
    // Встановлюємо найкращі варіанти для кожної категорії
    for (const [categoryKey, category] of Object.entries(modifierCategories)) {
        currentSelections[categoryKey] = category.default;
        console.log(`✅ ${categoryKey}: ${category.default}`);
    }
    
    // Включаємо прості модифікатори за замовчуванням
    currentSelections.shiny = true;
    currentSelections.maxlvl = true;
    
    console.log('📊 Поточні вибори:', currentSelections);
}

let isInCategoryView = false;
let currentCategoryView = null;

// Показ/приховування налаштувань
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    if (panel) {
        panel.classList.toggle('show');
        
        // При відкритті налаштувань повертаємося до основного вигляду
        if (panel.classList.contains('show')) {
            isInCategoryView = false;
            currentCategoryView = null;
            createSettingsHTML();
        }
    }
}

// Показ підменю категорії
function showCategoryPanel(categoryKey, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    isInCategoryView = true;
    currentCategoryView = categoryKey;
    createSettingsHTML();
}

// Повернення до основних налаштувань
function backToMainSettings(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    isInCategoryView = false;
    currentCategoryView = null;
    createSettingsHTML();
}

// Обробка переключення в категорії (нова функція)
function handleCategoryToggle(categoryKey, optionId, checkbox) {
    // Якщо checkbox зняли, не робимо нічого (не дозволяємо зняти вибір)
    if (!checkbox.checked) {
        checkbox.checked = true;
        return;
    }
    
    // Знімаємо всі інші чекбокси в цій категорії
    const categoryInputs = document.querySelectorAll(`input[name="${categoryKey}"]`);
    categoryInputs.forEach(input => {
        if (input.id !== optionId) {
            input.checked = false;
        }
    });
    
    // Встановлюємо новий вибір
    currentSelections[categoryKey] = optionId;
    
    // Перераховуємо статистики
    calculateStats();
}

// Обробка toggle для простих модифікаторів
function toggleSimpleModifier(modifierKey) {
    currentSelections[modifierKey] = !currentSelections[modifierKey];
    calculateStats();
}

// Розрахунок загального множника
function calculateTotalMultiplier() {
    let multiplier = 1;
    
    // Множники з категорій
    for (const [categoryKey, category] of Object.entries(modifierCategories)) {
        const selectedId = currentSelections[categoryKey];
        if (selectedId) {
            const option = category.options.find(opt => opt.id === selectedId);
            if (option) {
                multiplier *= option.multiplier;
            }
        }
    }
    
    // Прості множники
    for (const [key, modifier] of Object.entries(simpleModifiers)) {
        if (currentSelections[key]) {
            multiplier *= modifier.multiplier;
        }
    }
    
    return multiplier;
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
            // Use translated error message
            const translations = calcTranslations && calcTranslations[currentCalcLanguage];
            const errorText = (translations && translations.calculator.errorInvalidNumber) 
                || 'Please enter a valid number';
            errorMessage.textContent = errorText;
        }
        resultSection.classList.remove('show');
        return;
    }

    const multiplier = calculateTotalMultiplier();
    const finalValue = baseValue * multiplier;

    resultValue.textContent = finalValue.toLocaleString('uk-UA', {
        minimumFractionDigits: finalValue % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 8
    });

    resultSection.classList.add('show');
}

// Отримання назви обраного варіанту в категорії
function getSelectedOptionName(categoryKey) {
    const selectedId = currentSelections[categoryKey];
    if (!selectedId) {
        // Якщо нічого не вибрано, повертаємо дефолтний варіант
        const category = modifierCategories[categoryKey];
        if (category && category.default) {
            currentSelections[categoryKey] = category.default;
            const option = category.options.find(opt => opt.id === category.default);
            return option ? option.name : 'None';
        }
        return 'None';
    }
    
    const category = modifierCategories[categoryKey];
    if (!category) return 'None';
    
    const option = category.options.find(opt => opt.id === selectedId);
    return option ? option.name : 'None';
}

// Створення HTML для налаштувань
function createSettingsHTML() {
    const panel = document.getElementById('settingsPanel');
    if (!panel) return;

    let html = '';
    
    // Get current translations
    const translations = calcTranslations && calcTranslations[currentCalcLanguage];
    const settingsText = (translations && translations.common.settings) || 'Settings';
    const backText = (translations && translations.common.back) || '← Back';
    
    // Якщо ми в режимі перегляду категорії
    if (isInCategoryView && currentCategoryView) {
        const category = modifierCategories[currentCategoryView];
        if (category) {
            html += `
                <div class="settings-header">
                    <div class="settings-title">${category.title}</div>
                    <button type="button" class="back-btn" onclick="backToMainSettings(event)">${backText}</button>
                </div>
            `;
            
            // Варіанти категорії
            for (const option of category.options) {
                const isSelected = currentSelections[currentCategoryView] === option.id;
                html += `
                    <div class="modifier-item">
                        <div class="modifier-label">
                            <span>${option.name}</span>
                            <span class="modifier-multiplier">(${option.multiplier}x)</span>
                        </div>
                        <label class="category-switch">
                            <input type="checkbox" id="${option.id}" name="${currentCategoryView}" 
                                   ${isSelected ? 'checked' : ''}
                                   onchange="handleCategoryToggle('${currentCategoryView}', '${option.id}', this)">
                            <span class="category-slider"></span>
                        </label>
                    </div>
                `;
            }
        }
    } else {
        // Основний вигляд налаштувань
        html += `<div class="settings-title">${settingsText}</div>`;
        
        // Кнопки категорій
        for (const [categoryKey, category] of Object.entries(modifierCategories)) {
            const selectedName = getSelectedOptionName(categoryKey);
            html += `
                <button type="button" class="category-button" onclick="showCategoryPanel('${categoryKey}', event)">
                    <div class="category-button-content">
                        <div class="category-name">${category.title}</div>
                        <div class="category-selected">${selectedName}</div>
                    </div>
                    <span class="category-arrow">→</span>
                </button>
            `;
        }
        
        // Прості модифікатори
        for (const [key, modifier] of Object.entries(simpleModifiers)) {
            html += `
                <div class="simple-modifier">
                    <div class="simple-modifier-label">
                        <span>${modifier.name}</span>
                        <span class="modifier-multiplier">(x${modifier.multiplier})</span>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="${key}" ${currentSelections[key] ? 'checked' : ''} 
                               onchange="toggleSimpleModifier('${key}')">
                        <span class="slider"></span>
                    </label>
                </div>
            `;
        }
    }
    
    panel.innerHTML = html;
}

// Ініціалізація калькулятора при завантаженні сторінки
async function initializeCalculator() {
    console.log('🚀 Ініціалізація калькулятора...');
    
    // Load translations
    await loadCalcTranslations();
    
    // Get current app language
    const currentAppLanguage = (typeof getCurrentAppLanguage === 'function') 
        ? getCurrentAppLanguage() 
        : 'en';
    
    // Update calculator language
    await updateCalculatorLanguage(currentAppLanguage);
    
    // Скидаємо поточні вибори
    currentSelections = {};
    
    // Ініціалізуємо дефолтні значення
    initializeDefaults();
    
    // Створюємо HTML для налаштувань
    createSettingsHTML();
    
    // Розраховуємо початкові статистики
    calculateStats();

    // Додаємо обробники подій
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
    
    console.log('✅ Калькулятор ініціалізовано з підтримкою мов');
}

// Listen for language change events
document.addEventListener('languageChanged', async (event) => {
    const newLanguage = event.detail.language;
    console.log('🌍 Calculator received language change:', newLanguage);
    await updateCalculatorLanguage(newLanguage);
});

// Make functions globally available
window.updateCalculatorLanguage = updateCalculatorLanguage;
window.loadCalcTranslations = loadCalcTranslations;
