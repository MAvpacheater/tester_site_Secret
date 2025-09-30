// ARM CALCULATOR - Optimized Version
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
    if (!armPage) return;

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
            <input type="number" class="number-input" id="armNumberInput" placeholder="${t.inputPlaceholder}" step="any" oninput="calculateArmStats()">
            <button class="calculate-btn" onclick="calculateArmStats()">${t.calculateBtn}</button>
            <div class="error" id="armErrorMessage"></div>
        </div>

        <div class="result-section" id="armResultSection">
            <div class="stats-label">${t.resultLabel}</div>
            <div class="result-value" id="armResultValue">0</div>
        </div>
    `;
}

function getCurrentAppLanguage() {
    return typeof getCurrentLanguage === 'function' 
        ? getCurrentLanguage() 
        : localStorage.getItem('selectedLanguage') || 'en';
}

function initializeArm() {
    console.log('🚀 Initializing Arm Calculator...');
    armInitialized = false;
    currentArmLanguage = getCurrentAppLanguage();
    createArmHTML();
    addArmEventListeners();
    updateArmMultiplier();
    armInitialized = true;
    console.log('✅ Arm Calculator initialized');
}

function addArmEventListeners() {
    document.addEventListener('languageChanged', (e) => {
        updateArmLanguage(e.detail.language);
    });
    
    setTimeout(() => {
        const input = document.getElementById('armNumberInput');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') calculateArmStats();
            });
            input.addEventListener('input', () => {
                const error = document.getElementById('armErrorMessage');
                if (error) error.textContent = '';
            });
        }
    }, 100);
}

function updateArmLanguage(language) {
    currentArmLanguage = armTranslations[language] ? language : 'en';
    createArmHTML();
    setTimeout(() => {
        const input = document.getElementById('armNumberInput');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') calculateArmStats();
            });
            input.addEventListener('input', () => {
                const error = document.getElementById('armErrorMessage');
                if (error) error.textContent = '';
            });
        }
    }, 100);
    updateArmMultiplier();
    console.log(`✅ Arm Calculator language updated to ${language}`);
}

function toggleArmSettings() {
    const panel = document.getElementById('settingsPanelArm');
    if (panel) panel.classList.toggle('show');
}

function handleGoldenSelection(selectedId) {
    Object.keys(goldenModifiers).forEach(id => {
        if (id !== selectedId) {
            const checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = false;
        }
    });
    updateArmMultiplier();
}

function updateArmMultiplier() {
    armMultiplier = 1;
    for (const id in goldenModifiers) {
        const checkbox = document.getElementById(id);
        if (checkbox?.checked) {
            armMultiplier = goldenModifiers[id];
            break;
        }
    }
    calculateArmStats();
}

function calculateArmStats() {
    const input = document.getElementById('armNumberInput');
    const resultSection = document.getElementById('armResultSection');
    const resultValue = document.getElementById('armResultValue');
    const errorMessage = document.getElementById('armErrorMessage');

    if (!input || !resultSection || !resultValue || !errorMessage) return;

    const t = armTranslations[currentArmLanguage] || armTranslations.en;
    errorMessage.textContent = '';

    const baseValue = parseFloat(input.value);

    if (isNaN(baseValue) || input.value.trim() === '') {
        if (input.value.trim() !== '') {
            errorMessage.textContent = t.errors?.invalidInput || 'Please enter a valid number';
        }
        resultSection.classList.remove('show');
        return;
    }

    const finalValue = baseValue * armMultiplier;

    resultValue.textContent = finalValue.toLocaleString('uk-UA', {
        minimumFractionDigits: finalValue % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 8
    });

    setTimeout(() => resultSection.classList.add('show'), 100);
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('armPage')) initializeArm();
});

// Global exports
window.initializeArm = initializeArm;
window.calculateArmStats = calculateArmStats;
window.updateArmLanguage = updateArmLanguage;
window.toggleArmSettings = toggleArmSettings;
window.handleGoldenSelection = handleGoldenSelection;
window.updateArmMultiplier = updateArmMultiplier;

console.log('✅ Arm Calculator module loaded');
