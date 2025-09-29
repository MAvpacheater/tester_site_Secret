// Arm Stats Calculator - Full implementation with HTML structure creation

// Global variables for arm calculator
let armInitialized = false;
let currentArmLanguage = 'en';

// Translations stored directly in JS
const armTranslations = {
    en: {
        title: "💪 Arm Stats Calculator",
        settings: "Settings",
        inputLabel: "If arm base",
        inputPlaceholder: "Enter number...",
        resultLabel: "Max stats",
        calculateBtn: "Calculate",
        golden1: "1/5 golden",
        golden2: "2/5 golden", 
        golden3: "3/5 golden",
        golden4: "4/5 golden",
        golden5: "5/5 golden",
        errors: {
            invalidInput: "Please enter a valid number"
        }
    },
    uk: {
        title: "💪 Калькулятор Статів Руки",
        settings: "Налаштування",
        inputLabel: "Якщо база руки",
        inputPlaceholder: "Введіть число...",
        resultLabel: "Максимальні стати",
        calculateBtn: "Розрахувати",
        golden1: "1/5 золота",
        golden2: "2/5 золота", 
        golden3: "3/5 золота",
        golden4: "4/5 золота",
        golden5: "5/5 золота",
        errors: {
            invalidInput: "Будь ласка, введіть дійсне число"
        }
    },
    ru: {
        title: "💪 Калькулятор Статов Руки",
        settings: "Настройки",
        inputLabel: "Если база руки",
        inputPlaceholder: "Введите число...",
        resultLabel: "Максимальные статы",
        calculateBtn: "Рассчитать",
        golden1: "1/5 золотая",
        golden2: "2/5 золотая", 
        golden3: "3/5 золотая",
        golden4: "4/5 золотая",
        golden5: "5/5 золотая",
        errors: {
            invalidInput: "Пожалуйста, введите действительное число"
        }
    }
};

// FIXED: Множники для golden рівнів (правильні значення як в HTML)
const goldenModifiers = {
    golden1: 1.5,      // 1/5 golden (x1.5)
    golden2: 1.65,     // 2/5 golden (x1.65) 
    golden3: 1.8,      // 3/5 golden (x1.8)
    golden4: 1.95,     // 4/5 golden (x1.95)
    golden5: 2.1       // 5/5 golden (x2.1)
};

let armMultiplier = 2.1; // За замовчуванням 5/5 golden (x2.1)

// Create HTML structure for arm calculator
function createArmHTML() {
    const armPage = document.getElementById('armPage');
    if (!armPage) {
        console.error('❌ Arm page container not found');
        return;
    }

    const t = armTranslations[currentArmLanguage] || armTranslations['en'];
    console.log('Using arm translations:', t); // Debug log

    armPage.innerHTML = `
        <div class="header-controls">
            <h1>${t.title}</h1>
            <button class="settings-btn" onclick="toggleArmSettings()">⚙️</button>
        </div>

        <div class="settings-panel" id="settingsPanelArm">
            <div class="settings-title">${t.settings}</div>
            
            <div class="simple-toggle">
                <div class="toggle-info">
                    <div class="toggle-label">${t.golden1}</div>
                    <div class="toggle-multiplier">(x1.5)</div>
                </div>
                <label class="switch">
                    <input type="checkbox" id="golden1" onchange="handleGoldenSelection('golden1')">
                    <span class="slider"></span>
                </label>
            </div>

            <div class="simple-toggle">
                <div class="toggle-info">
                    <div class="toggle-label">${t.golden2}</div>
                    <div class="toggle-multiplier">(x1.65)</div>
                </div>
                <label class="switch">
                    <input type="checkbox" id="golden2" onchange="handleGoldenSelection('golden2')">
                    <span class="slider"></span>
                </label>
            </div>

            <div class="simple-toggle">
                <div class="toggle-info">
                    <div class="toggle-label">${t.golden3}</div>
                    <div class="toggle-multiplier">(x1.8)</div>
                </div>
                <label class="switch">
                    <input type="checkbox" id="golden3" onchange="handleGoldenSelection('golden3')">
                    <span class="slider"></span>
                </label>
            </div>

            <div class="simple-toggle">
                <div class="toggle-info">
                    <div class="toggle-label">${t.golden4}</div>
                    <div class="toggle-multiplier">(x1.95)</div>
                </div>
                <label class="switch">
                    <input type="checkbox" id="golden4" onchange="handleGoldenSelection('golden4')">
                    <span class="slider"></span>
                </label>
            </div>

            <div class="simple-toggle">
                <div class="toggle-info">
                    <div class="toggle-label">${t.golden5}</div>
                    <div class="toggle-multiplier">(x2.1)</div>
                </div>
                <label class="switch">
                    <input type="checkbox" id="golden5" checked onchange="handleGoldenSelection('golden5')">
                    <span class="slider"></span>
                </label>
            </div>
        </div>
        
        <div class="input-section">
            <label class="input-label" for="armNumberInput">${t.inputLabel}</label>
            <input type="number" class="number-input" id="armNumberInput" placeholder="${t.inputPlaceholder}" step="any" oninput="calculateArmStats()">
            <button class="calculate-btn" onclick="calculateArmStats()">${t.calculateBtn}</button>
            <div class="error" id="armErrorMessage"></div>
        </div>

        <div class="result-section" id="armResultSection">
            <div class="stats-label">${t.resultLabel}</div>
            <div class="result-value" id="armResultValue">0</div>
        </div>
    `;

    console.log('✅ Arm HTML structure created');
}

// Get current language from app or default to 'en'
function getCurrentAppLanguage() {
    // Try to get from global app language if available
    if (typeof getCurrentLanguage === 'function') {
        return getCurrentLanguage();
    }
    // Fallback to localStorage or default
    return localStorage.getItem('selectedLanguage') || 'en';
}

// Initialize Arm Calculator
function initializeArm() {
    console.log('🚀 Initializing Arm Calculator...');
    
    // Reset initialization flag
    armInitialized = false;
    
    // Set current language
    currentArmLanguage = getCurrentAppLanguage();
    console.log('Current arm language:', currentArmLanguage);
    
    // Create HTML structure
    createArmHTML();
    
    // Add event listeners
    addArmEventListeners();
    
    // Set default values
    updateArmMultiplier();
    
    armInitialized = true;
    console.log('✅ Arm Calculator initialized');
}

// Add event listeners for arm calculator
function addArmEventListeners() {
    // Listen for language changes
    document.addEventListener('languageChanged', function(event) {
        const newLanguage = event.detail.language;
        console.log(`🌍 Arm Calculator: Language changed to ${newLanguage}`);
        updateArmLanguage(newLanguage);
    });
    
    // Add real-time calculation listeners
    setTimeout(() => {
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
    }, 100);
    
    console.log('✅ Arm Calculator event listeners added');
}

// Update arm calculator language
function updateArmLanguage(language) {
    if (!armTranslations[language]) {
        console.warn(`❌ Language ${language} not found for arm calculator, using English`);
        language = 'en';
    }
    
    currentArmLanguage = language;
    
    // Recreate HTML with new language
    createArmHTML();
    
    // Re-add event listeners
    setTimeout(() => {
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
    }, 100);
    
    // Restore previous settings
    updateArmMultiplier();
    
    console.log(`✅ Arm Calculator language updated to ${language}`);
}

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
    console.log('💪 Calculating arm stats...');
    
    const input = document.getElementById('armNumberInput');
    const resultSection = document.getElementById('armResultSection');
    const resultValue = document.getElementById('armResultValue');
    const errorMessage = document.getElementById('armErrorMessage');

    if (!input || !resultSection || !resultValue || !errorMessage) {
        console.error('❌ Arm calculator elements not found');
        return;
    }

    const t = armTranslations[currentArmLanguage] || armTranslations['en'];
    
    // Clear previous errors
    errorMessage.textContent = '';

    const baseValue = parseFloat(input.value);

    if (isNaN(baseValue) || input.value.trim() === '') {
        if (input.value.trim() !== '') {
            // Use translated error message
            const errorText = (t.errors && t.errors.invalidInput) || 'Please enter a valid number';
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

    // Show result section with animation
    setTimeout(() => {
        resultSection.classList.add('show');
    }, 100);
    
    console.log(`✅ Arm calculation completed: ${baseValue} * ${armMultiplier} = ${finalValue}`);
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if arm page exists
    if (document.getElementById('armPage')) {
        initializeArm();
    }
});

// Make functions globally available
window.initializeArm = initializeArm;
window.calculateArmStats = calculateArmStats;
window.updateArmLanguage = updateArmLanguage;
window.toggleArmSettings = toggleArmSettings;
window.handleGoldenSelection = handleGoldenSelection;
window.updateArmMultiplier = updateArmMultiplier;

console.log('✅ Arm Calculator module loaded');
