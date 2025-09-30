// ARM CALCULATOR - Refactored with CalcLogic
// calc/arm/arm.js

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

    const t = armTranslations[currentArmLanguage];
    const goldens = ['golden1', 'golden2', 'golden3', 'golden4', 'golden5'];
    const mods = [1.5, 1.65, 1.8, 1.95, 2.1];

    armPage.innerHTML = `
        <div class="header-controls">
            <h1>${t.title}</h1>
            <button class="settings-btn" onclick="CalcLogic.togglePanel('settingsPanelArm')">⚙️</button>
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
    currentArmLanguage = CalcLogic.getCurrentAppLanguage();
    if (!createArmHTML()) return;
    
    CalcLogic.setupLanguageListener((lang) => {
        currentArmLanguage = armTranslations[lang] ? lang : 'en';
        createArmHTML();
        setTimeout(() => {
            CalcLogic.addEnterKeyListener('armNumberInput', calculateArmStats);
            CalcLogic.addErrorClearListener('armNumberInput', 'armErrorMessage');
        }, 50);
    });
    
    setTimeout(() => {
        CalcLogic.addEnterKeyListener('armNumberInput', calculateArmStats);
        CalcLogic.addErrorClearListener('armNumberInput', 'armErrorMessage');
    }, 50);
}

function handleGoldenSelection(selectedId) {
    CalcLogic.handleExclusiveCheckbox(selectedId, Object.keys(goldenModifiers), () => {
        const checked = CalcLogic.getCheckedCheckbox(Object.keys(goldenModifiers));
        armMultiplier = checked ? goldenModifiers[checked] : 1;
        calculateArmStats();
    });
}

function calculateArmStats() {
    const input = document.getElementById('armNumberInput');
    if (!input) return;

    CalcLogic.clearError('armErrorMessage');
    const result = CalcLogic.parseNumericInput(input.value, { allowEmpty: true });

    if (!result.valid && input.value.trim()) {
        CalcLogic.showError('armErrorMessage', armTranslations[currentArmLanguage].errors.invalidInput);
        CalcLogic.hideResultSection('armResultSection');
        return;
    }

    if (result.value === null) {
        CalcLogic.hideResultSection('armResultSection');
        return;
    }

    const finalValue = result.value * armMultiplier;
    CalcLogic.updateElementText('armResultValue', CalcLogic.formatNumber(finalValue, { locale: 'uk-UA', maxDecimals: 8 }));
    CalcLogic.showResultSection('armResultSection');
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('armPage')) initializeArm();
});

// Global exports
window.initializeArm = initializeArm;
window.calculateArmStats = calculateArmStats;
window.handleGoldenSelection = handleGoldenSelection;

console.log('✅ Arm Calculator module loaded');
