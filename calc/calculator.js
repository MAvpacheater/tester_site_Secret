// Pet Stats Calculator functionality - SIMPLIFIED VERSION (like arm.js and grind.js)

// Global variables for translations
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
                common: { calculate: "Calculate", settings: "Settings" },
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

// Множники для pet stats - як в arm.js та grind.js
const petModifiers = {
    // Slimes (тільки один активний)
    slime_shock: 3.15,
    slime_neowave: 3.0,
    slime_christmas: 2.85,
    slime_orange: 2.7,
    slime_green: 2.55,
    slime_black: 2.4,
    slime_red: 2.25,
    slime_purple: 1.65,
    slime_blue: 1.4,
    slime_yellow: 1.2,
    
    // Mutations (тільки один активний)
    mutation_cosmic: 2.5,
    mutation_ghost: 2.0,
    mutation_rainbow: 1.35,
    mutation_glowing: 1.2,
    
    // Evolution/Size (тільки один активний)
    evolution_goliath: 2.5,
    evolution_huge: 2.0,
    evolution_big: 1.5,
    
    // Type (тільки один активний)
    type_pristine: 2.17,
    type_void: 2.0,
    type_golden: 1.5,
    
    // Simple modifiers (незалежні)
    shiny: 1.15,
    maxlvl: 2.2388
};

let petMultiplier = 1;

// Показ/приховування налаштувань
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    if (panel) {
        panel.classList.toggle('show');
        
        // Prevent closing from general.js for a short time
        if (panel.classList.contains('show')) {
            panel.dataset.justOpened = 'true';
            setTimeout(() => {
                delete panel.dataset.justOpened;
            }, 100);
        }
    }
}

// Обробка вибору Slimes (тільки один активний) - як в arm.js handleGoldenSelection
function handleSlimeSelection(selectedId) {
    const slimeIds = ['slime_shock', 'slime_neowave', 'slime_christmas', 'slime_orange', 'slime_green', 'slime_black', 'slime_red', 'slime_purple', 'slime_blue', 'slime_yellow'];
    
    // Вимикаємо всі інші slimes
    slimeIds.forEach(id => {
        if (id !== selectedId) {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = false;
            }
        }
    });
    
    updatePetMultiplier();
}

// Обробка вибору Mutations (тільки один активний)
function handleMutationSelection(selectedId) {
    const mutationIds = ['mutation_cosmic', 'mutation_ghost', 'mutation_rainbow', 'mutation_glowing'];
    
    // Вимикаємо всі інші mutations
    mutationIds.forEach(id => {
        if (id !== selectedId) {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = false;
            }
        }
    });
    
    updatePetMultiplier();
}

// Обробка вибору Evolution/Size (тільки один активний)
function handleEvolutionSelection(selectedId) {
    const evolutionIds = ['evolution_goliath', 'evolution_huge', 'evolution_big'];
    
    // Вимикаємо всі інші evolutions
    evolutionIds.forEach(id => {
        if (id !== selectedId) {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = false;
            }
        }
    });
    
    updatePetMultiplier();
}

// Обробка вибору Type (тільки один активний)
function handleTypeSelection(selectedId) {
    const typeIds = ['type_pristine', 'type_void', 'type_golden'];
    
    // Вимикаємо всі інші types
    typeIds.forEach(id => {
        if (id !== selectedId) {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = false;
            }
        }
    });
    
    updatePetMultiplier();
}

// Оновлення множника - як в arm.js та grind.js
function updatePetMultiplier() {
    petMultiplier = 1;
    
    // Перевіряємо всі модифікатори
    for (const id in petModifiers) {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked) {
            petMultiplier *= petModifiers[id];
        }
    }
    
    console.log('Pet multiplier updated to:', petMultiplier);
    
    // Автоматично перерахувати результат після оновлення множника
    calculateStats();
}

// Розрахунок результату - як в arm.js та grind.js
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

    // Просто множимо введене значення на поточний petMultiplier - як в arm.js
    const finalValue = baseValue * petMultiplier;
    
    console.log(`Calculating: ${baseValue} * ${petMultiplier} = ${finalValue}`);

    resultValue.textContent = finalValue.toLocaleString('uk-UA', {
        minimumFractionDigits: finalValue % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 8
    });

    resultSection.classList.add('show');
}

// Ініціалізація калькулятора - як в arm.js та grind.js
async function initializeCalculator() {
    console.log('🚀 Initializing pet calculator with multilingual support...');
    
    // Check if calculator page exists
    const calculatorPage = document.getElementById('calculatorPage');
    if (!calculatorPage) {
        console.error('❌ Calculator page not found');
        return;
    }
    
    // Load translations
    await loadCalcTranslations();
    
    // Get current app language
    const currentAppLanguage = (typeof getCurrentAppLanguage === 'function') 
        ? getCurrentAppLanguage() 
        : 'en';
    
    // Update calculator language
    await updateCalculatorLanguage(currentAppLanguage);
    
    // Встановлюємо найкращі варіанти за замовчуванням - як в arm.js з golden5
    const shockCheckbox = document.getElementById('slime_shock');
    if (shockCheckbox) {
        shockCheckbox.checked = true;
    }
    
    const cosmicCheckbox = document.getElementById('mutation_cosmic');
    if (cosmicCheckbox) {
        cosmicCheckbox.checked = true;
    }
    
    const goliathCheckbox = document.getElementById('evolution_goliath');
    if (goliathCheckbox) {
        goliathCheckbox.checked = true;
    }
    
    const pristineCheckbox = document.getElementById('type_pristine');
    if (pristineCheckbox) {
        pristineCheckbox.checked = true;
    }
    
    const shinyCheckbox = document.getElementById('shiny');
    if (shinyCheckbox) {
        shinyCheckbox.checked = true;
    }
    
    const maxlvlCheckbox = document.getElementById('maxlvl');
    if (maxlvlCheckbox) {
        maxlvlCheckbox.checked = true;
    }
    
    updatePetMultiplier();

    // Додаємо обробники подій - як в arm.js та grind.js
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
    
    console.log('✅ Pet calculator initialized with multilingual support');
}

// Listen for language change events
document.addEventListener('languageChanged', async (event) => {
    const newLanguage = event.detail.language;
    console.log('🌍 Calculator received language change:', newLanguage);
    await updateCalculatorLanguage(newLanguage);
});

// Make functions globally available - як в arm.js та grind.js
window.updateCalculatorLanguage = updateCalculatorLanguage;
window.loadCalcTranslations = loadCalcTranslations;
window.toggleSettings = toggleSettings;
window.handleSlimeSelection = handleSlimeSelection;
window.handleMutationSelection = handleMutationSelection;
window.handleEvolutionSelection = handleEvolutionSelection;
window.handleTypeSelection = handleTypeSelection;
window.updatePetMultiplier = updatePetMultiplier;
window.calculateStats = calculateStats;
window.initializeCalculator = initializeCalculator;
