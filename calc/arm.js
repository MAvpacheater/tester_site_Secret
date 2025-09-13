// Arm Stats Calculator functionality with multilingual support

// Global variables for translations
let armCalcTranslations = null;
let currentArmLanguage = 'en';

// Load calculator translations (reuse from calculator)
async function loadArmTranslations() {
    if (armCalcTranslations) return armCalcTranslations;
    
    try {
        console.log('📥 Loading arm calculator translations...');
        const response = await fetch('languages/calc.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        armCalcTranslations = await response.json();
        console.log('✅ Arm calculator translations loaded successfully');
        return armCalcTranslations;
    } catch (error) {
        console.error('❌ Error loading arm calculator translations:', error);
        // Fallback to English
        armCalcTranslations = {
            en: {
                common: { calculate: "Calculate", settings: "Settings" },
                arm: {
                    inputLabel: "If arm base",
                    inputPlaceholder: "Enter number...",
                    resultLabel: "Max stats",
                    errorInvalidNumber: "Please enter a valid number"
                }
            }
        };
        return armCalcTranslations;
    }
}

// Update arm calculator language
async function updateArmLanguage(lang) {
    if (!armCalcTranslations) {
        await loadArmTranslations();
    }
    
    currentArmLanguage = lang;
    
    if (!armCalcTranslations[lang]) {
        console.error(`❌ Arm calculator language ${lang} not found, defaulting to English`);
        currentArmLanguage = 'en';
    }
    
    const translations = armCalcTranslations[currentArmLanguage];
    if (!translations || !translations.arm) return;
    
    // Update arm calculator input elements
    const inputLabel = document.querySelector('#armPage .input-label');
    const inputField = document.getElementById('armNumberInput');
    const calculateBtn = document.querySelector('#armPage .calculate-btn');
    const resultLabel = document.querySelector('#armPage .stats-label');
    const settingsTitle = document.querySelector('#settingsPanelArm .settings-title');
    
    if (inputLabel && translations.arm.inputLabel) {
        inputLabel.textContent = translations.arm.inputLabel;
    }
    
    if (inputField && translations.arm.inputPlaceholder) {
        inputField.placeholder = translations.arm.inputPlaceholder;
    }
    
    if (calculateBtn && translations.common.calculate) {
        calculateBtn.textContent = translations.common.calculate;
    }
    
    if (resultLabel && translations.arm.resultLabel) {
        resultLabel.textContent = translations.arm.resultLabel;
    }
    
    if (settingsTitle && translations.common.settings) {
        settingsTitle.textContent = translations.common.settings;
    }
    
    console.log(`✅ Arm calculator language updated to: ${currentArmLanguage}`);
}

// Множники для golden рівнів (чисті значення)
const goldenModifiers = {
    golden1: 1.5,      // 1/5 golden
    golden2: 1.65,     // 2/5 golden 
    golden3: 1.8,      // 3/5 golden 
    golden4: 1.95,     // 4/5 golden 
    golden5: 2.1       // 5/5 golden
};

let armMultiplier = 2.1; // За замовчуванням 5/5 golden

// Показ/приховування налаштувань для калькулятора рук
function toggleArmSettings() {
    const panel = document.getElementById('settingsPanelArm');
    if (panel) {
        panel.classList.toggle('show');
    }
}

// Обробка вибору golden рівнів (тільки один може бути активним)
function handleGoldenSelection(selectedId) {
    const goldenIds = ['golden1', 'golden2', 'golden3', 'golden4', 'golden5'];
    
    // Вимикаємо всі інші golden рівні
    goldenIds.forEach(id => {
        if (id !== selectedId) {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = false;
            }
        }
    });
    
    updateArmMultiplier();
}

// Оновлення множника для калькулятора рук
function updateArmMultiplier() {
    armMultiplier = 1; // Базове значення без golden
    
    // Перевіряємо який golden рівень активний
    for (const id in goldenModifiers) {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked) {
            armMultiplier = goldenModifiers[id];
            break; // Тільки один golden може бути активним
        }
    }
    
    console.log('Arm multiplier updated to:', armMultiplier); // Для відладки
    
    // Автоматично перерахувати результат після оновлення множника
    calculateArmStats();
}

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
            // Use translated error message
            const translations = armCalcTranslations && armCalcTranslations[currentArmLanguage];
            const errorText = (translations && translations.arm && translations.arm.errorInvalidNumber) 
                || 'Please enter a valid number';
            errorMessage.textContent = errorText;
        }
        resultSection.classList.remove('show');
        return;
    }

    // Просто множимо введене значення на поточний armMultiplier
    const finalValue = baseValue * armMultiplier;
    
    console.log(`Calculating: ${baseValue} * ${armMultiplier} = ${finalValue}`); // Для відладки

    resultValue.textContent = finalValue.toLocaleString('uk-UA', {
        minimumFractionDigits: finalValue % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 8
    });

    resultSection.classList.add('show');
}

// Ініціалізація калькулятора рук при завантаженні сторінки
async function initializeArm() {
    console.log('🚀 Initializing arm calculator with multilingual support...');
    
    // Load translations
    await loadArmTranslations();
    
    // Get current app language
    const currentAppLanguage = (typeof getCurrentAppLanguage === 'function') 
        ? getCurrentAppLanguage() 
        : 'en';
    
    // Update arm calculator language
    await updateArmLanguage(currentAppLanguage);
    
    // Встановлюємо 5/5 golden за замовчуванням
    const golden5Checkbox = document.getElementById('golden5');
    if (golden5Checkbox) {
        golden5Checkbox.checked = true;
        console.log('Golden5 checkbox set to checked'); // Для відладки
    }
    
    updateArmMultiplier();
    
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
        });
    }
    
    console.log('✅ Arm calculator initialized with multilingual support');
}

// Listen for language change events
document.addEventListener('languageChanged', async (event) => {
    const newLanguage = event.detail.language;
    console.log('🌍 Arm calculator received language change:', newLanguage);
    await updateArmLanguage(newLanguage);
});

// Make functions globally available
window.updateArmLanguage = updateArmLanguage;
window.loadArmTranslations = loadArmTranslations;
