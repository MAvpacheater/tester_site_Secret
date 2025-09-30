// BOSS CALCULATOR - Refactored with CalcLogic
// calc/boss/boss.js

let currentBossLanguage = 'en';

const bossTranslations = {
    en: {
        title: "👹 Boss Calculator",
        totalNeeded: "Total Needed to Collect:",
        rewardPerWin: "Reward per Victory:",
        vipAutoclicker: "VIP + Autoclicker",
        vipDescription: "(2.5s vs 4.5s)",
        calculateBtn: "Calculate Time",
        resultTitle: "Total Time Needed:",
        totalNeededPlaceholder: "Enter total amount needed...",
        rewardPerWinPlaceholder: "Enter reward per win...",
        errors: {
            invalidInput: "Please enter valid positive numbers",
            missingFields: "Please fill in both fields"
        }
    },
    uk: {
        title: "👹 Калькулятор Боса",
        totalNeeded: "Всього Потрібно Зібрати:",
        rewardPerWin: "Нагорода за Перемогу:",
        vipAutoclicker: "VIP + Автоклікер",
        vipDescription: "(2.5с проти 4.5с)",
        calculateBtn: "Розрахувати Час",
        resultTitle: "Загальний Час:",
        totalNeededPlaceholder: "Введіть загальну кількість...",
        rewardPerWinPlaceholder: "Введіть нагороду за перемогу...",
        errors: {
            invalidInput: "Будь ласка, введіть дійсні позитивні числа",
            missingFields: "Будь ласка, заповніть обидва поля"
        }
    },
    ru: {
        title: "👹 Калькулятор Босса",
        totalNeeded: "Всего Нужно Собрать:",
        rewardPerWin: "Награда за Победу:",
        vipAutoclicker: "VIP + Автокликер",
        vipDescription: "(2.5с против 4.5с)",
        calculateBtn: "Рассчитать Время",
        resultTitle: "Общее Время:",
        totalNeededPlaceholder: "Введите общее количество...",
        rewardPerWinPlaceholder: "Введите награду за победу...",
        errors: {
            invalidInput: "Пожалуйста, введите действительные положительные числа",
            missingFields: "Пожалуйста, заполните оба поля"
        }
    }
};

function createBossHTML() {
    const bossPage = document.getElementById('bossPage');
    if (!bossPage) return false;

    const t = bossTranslations[currentBossLanguage];

    bossPage.innerHTML = `
        <div class="header-controls">
            <h1>${t.title}</h1>
        </div>
        
        <div class="input-section">
            <label class="input-label" for="totalNeededInput">${t.totalNeeded}</label>
            <input type="number" class="number-input" id="totalNeededInput" placeholder="${t.totalNeededPlaceholder}" step="1" min="1">
            
            <label class="input-label" for="rewardPerWinInput">${t.rewardPerWin}</label>
            <input type="number" class="number-input" id="rewardPerWinInput" placeholder="${t.rewardPerWinPlaceholder}" step="1" min="1">
            
            <div class="simple-toggle">
                <div class="toggle-info">
                    <div class="toggle-label">${t.vipAutoclicker}</div>
                    <div class="toggle-multiplier">${t.vipDescription}</div>
                </div>
                <label class="switch">
                    <input type="checkbox" id="vipAutoclicker">
                    <span class="slider"></span>
                </label>
            </div>
            
            <button class="calculate-btn" onclick="calculateBossTime()">${t.calculateBtn}</button>
            <div class="error" id="bossErrorMessage"></div>
        </div>

        <div class="result-section" id="bossResultSection">
            <div class="stats-label">${t.resultTitle}</div>
            <div class="result-value" id="bossResultValue">0</div>
        </div>
    `;
    return true;
}

function initializeBoss() {
    currentBossLanguage = CalcLogic.getCurrentAppLanguage();
    if (!createBossHTML()) return;
    
    CalcLogic.setupLanguageListener((lang) => {
        currentBossLanguage = bossTranslations[lang] ? lang : 'en';
        createBossHTML();
        setTimeout(() => setupBossInputs(), 50);
    });
    
    setTimeout(() => setupBossInputs(), 50);
}

function setupBossInputs() {
    ['totalNeededInput', 'rewardPerWinInput'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculateBossTime);
    });
    
    const vip = document.getElementById('vipAutoclicker');
    if (vip) vip.addEventListener('change', calculateBossTime);
}

function calculateBossTime() {
    const totalInput = document.getElementById('totalNeededInput');
    const rewardInput = document.getElementById('rewardPerWinInput');
    const vipInput = document.getElementById('vipAutoclicker');
    
    if (!totalInput || !rewardInput || !vipInput) return;
    
    const t = bossTranslations[currentBossLanguage];
    CalcLogic.clearError('bossErrorMessage');
    
    if (!totalInput.value || !rewardInput.value) {
        CalcLogic.showError('bossErrorMessage', t.errors.missingFields);
        CalcLogic.hideResultSection('bossResultSection');
        return;
    }
    
    const total = CalcLogic.parseNumericInput(totalInput.value, { min: 0.001 });
    const reward = CalcLogic.parseNumericInput(rewardInput.value, { min: 0.001 });
    
    if (!total.valid || !reward.valid) {
        CalcLogic.showError('bossErrorMessage', t.errors.invalidInput);
        CalcLogic.hideResultSection('bossResultSection');
        return;
    }
    
    const victories = Math.ceil(total.value / reward.value);
    const seconds = victories * (vipInput.checked ? 2.5 : 4.5);
    
    CalcLogic.updateElementText('bossResultValue', CalcLogic.formatTimeDuration(seconds));
    CalcLogic.showResultSection('bossResultSection');
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('bossPage')) initializeBoss();
});

// Global exports
window.initializeBoss = initializeBoss;
window.calculateBossTime = calculateBossTime;

console.log('✅ Boss Calculator module loaded');
