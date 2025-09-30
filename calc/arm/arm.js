// ARM CALCULATOR - Refactored with CalcLogic
// calc/arm/arm.js

let armInitialized = false;
let currentArmLanguage = 'en';
let armMultiplier = 2.1;

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
        errors: { invalidInput: "Please enter a valid number" }
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
        errors: { invalidInput: "Будь ласка, введіть дійсне число" }
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
        errors: { invalidInput: "Пожалуйста, введите действительное число" }
    }
};

const goldenModifiers = {
    golden1: 1.5,
    golden2: 1.65,
    golden3: 1.8,
    golden4: 1.95,
    golden5: 2.1
};

function createArmHTML() {
    const armPage = document.getElementById('armPage');
    if (!armPage) return false;

    const t = armTranslations[currentArmLanguage] || armTranslations.en;
    const goldens = ['golden1', 'golden2', 'golden3', 'golden4', 'golden5'];
    const mods = [1.5, 1.65, 1.8, 1.95, 2.1];

    armPage.innerHTML = `
        <div class="header-controls">
            <h1>${t.title}</h1>
            <button class="settings-btn" onclick="toggleArmSettings()">⚙️</button>
        </div>

        <div class="settings-panel" id="settingsPanelArm">
            <div class="settings-title">${t.settings}</div>
            ${goldens.map((id, i) => `
                <div class="simple-toggle">
                    <div class="toggle-info">
                        <div class="toggle-label">${t[id]}</div>
                        <div class="toggle-multiplier">(x${mods[i]})</div>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="${id}" ${i === 4 ? 'checked' : ''} onchange="handleGoldenSelection('${id}')">
                        <span class="slider"></span>
                    </label>
                </div>
            `).join('')}
        </div>
        
        <div class="input-section">
            <label class="input-label" for="armNumberInput">${t.inputLabel}</label>
            <input type="number" class="number-input" id="armNumberInput" placeholder="${t.inputPlaceholder}" step="any">
            <button class="calculate-btn" onclick="calculateArmStats()">${t.calculateBtn}</button>
            <div class="error" id="armErrorMessage"></div>
        </div>

        <div class="result-section" id="armResultSection">
            <div class="stats-label">${t.resultLabel}</div>
            <div class="result-value" id="armResultValue">0</div>
        </div>
    `;
    
    return true;
}

function initializeArm() {
    console.log('🚀 Initializing Arm Calculator...');
    
    const success = CalcLogic.initializeCalculator({
        pageId: 'armPage',
        initFlag: armInitialized,
        createHTML: createArmHTML,
        addListeners: addArmEventListeners,
        afterInit: () => {
            updateArmMultiplier();
            armInitialized = true;
        }
    });
    
    if (success) {
        console.log('✅ Arm Calculator initialized');
    }
    
    return success;
}

function addArmEventListeners() {
    // Language change listener
    CalcLogic.setupLanguageListener(updateArmLanguage);
    
    // Input listeners with delay
    CalcLogic.setupDelayedListeners([
        {
            id: 'armNumberInput',
            event: 'keypress',
            handler: (e) => {
                if (e.key === 'Enter') calculateArmStats();
            }
        }
    ], 100);
    
    // Clear error on input
    setTimeout(() => {
        CalcLogic.addErrorClearListener('armNumberInput', 'armErrorMessage');
    }, 100);
}

function updateArmLanguage(language) {
    currentArmLanguage = armTranslations[language] ? language : 'en';
    
    if (createArmHTML()) {
        setTimeout(() => {
            addArmEventListeners();
            updateArmMultiplier();
        }, 100);
    }
    
    console.log(`✅ Arm Calculator language updated to ${language}`);
}

function toggleArmSettings() {
    CalcLogic.togglePanel('settingsPanelArm');
}

function handleGoldenSelection(selectedId) {
    const allGoldenIds = Object.keys(goldenModifiers);
    CalcLogic.handleExclusiveCheckbox(selectedId, allGoldenIds, updateArmMultiplier);
}

function updateArmMultiplier() {
    // Find which golden modifier is checked
    const checkedGolden = CalcLogic.getCheckedCheckbox(Object.keys(goldenModifiers));
    
    if (checkedGolden && goldenModifiers[checkedGolden]) {
        armMultiplier = goldenModifiers[checkedGolden];
    } else {
        armMultiplier = 1;
    }
    
    calculateArmStats();
}

function calculateArmStats() {
    const input = document.getElementById('armNumberInput');
    if (!input) return;

    const t = armTranslations[currentArmLanguage] || armTranslations.en;
    
    // Clear error
    CalcLogic.clearError('armErrorMessage');

    // Parse and validate input
    const result = CalcLogic.parseNumericInput(input.value, {
        allowEmpty: true,
        min: null
    });

    if (!result.valid) {
        if (input.value.trim() !== '') {
            CalcLogic.showError('armErrorMessage', t.errors?.invalidInput || 'Please enter a valid number');
        }
        CalcLogic.hideResultSection('armResultSection');
        return;
    }

    if (result.value === null) {
        CalcLogic.hideResultSection('armResultSection');
        return;
    }

    // Calculate final value
    const finalValue = result.value * armMultiplier;

    // Format and display result
    const formattedValue = CalcLogic.formatNumber(finalValue, {
        locale: 'uk-UA',
        autoDecimals: true,
        maxDecimals: 8
    });

    CalcLogic.updateElementText('armResultValue', formattedValue);
    CalcLogic.showResultSection('armResultSection', 100);
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('armPage')) {
        currentArmLanguage = CalcLogic.getCurrentAppLanguage();
        initializeArm();
    }
});

// Global exports
window.initializeArm = initializeArm;
window.calculateArmStats = calculateArmStats;
window.updateArmLanguage = updateArmLanguage;
window.toggleArmSettings = toggleArmSettings;
window.handleGoldenSelection = handleGoldenSelection;
window.updateArmMultiplier = updateArmMultiplier;

console.log('✅ Arm Calculator module loaded');
