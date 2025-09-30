// BOSS CALCULATOR - Refactored with CalcLogic
// calc/boss/boss.js

let bossInitialized = false;
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

    const t = bossTranslations[currentBossLanguage] || bossTranslations.en;

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
    console.log('🚀 Initializing Boss Calculator...');
    
    const success = CalcLogic.initializeCalculator({
        pageId: 'bossPage',
        initFlag: bossInitialized,
        createHTML: createBossHTML,
        addListeners: addBossEventListeners,
        afterInit: () => {
            bossInitialized = true;
        }
    });
    
    if (success) {
        console.log('✅ Boss Calculator initialized');
    }
    
    return success;
}

function addBossEventListeners() {
    // Language change listener
    CalcLogic.setupLanguageListener(updateBossLanguage);
    
    // Auto-calculate on input change
    CalcLogic.setupDelayedListeners([
        {
            id: 'totalNeededInput',
            event: 'input',
            handler: calculateBossTime
        },
        {
            id: 'rewardPerWinInput',
            event: 'input',
            handler: calculateBossTime
        },
        {
            id: 'vipAutoclicker',
            event: 'change',
            handler: calculateBossTime
        }
    ], 100);
}

function updateBossLanguage(language) {
    currentBossLanguage = bossTranslations[language] ? language : 'en';
    
    if (createBossHTML()) {
        setTimeout(() => addBossEventListeners(), 100);
    }
    
    console.log(`✅ Boss Calculator language updated to ${language}`);
}

function calculateBossTime() {
    const totalNeededInput = document.getElementById('totalNeededInput');
    const rewardPerWinInput = document.getElementById('rewardPerWinInput');
    const vipAutoclickerInput = document.getElementById('vipAutoclicker');
    
    if (!totalNeededInput || !rewardPerWinInput || !vipAutoclickerInput) return;
    
    const t = bossTranslations[currentBossLanguage] || bossTranslations.en;
    
    // Clear error
    CalcLogic.clearError('bossErrorMessage');
    
    // Check if fields are empty
    if (!totalNeededInput.value || !rewardPerWinInput.value) {
        if (t.errors?.missingFields) {
            CalcLogic.showError('bossErrorMessage', t.errors.missingFields);
        }
        CalcLogic.hideResultSection('bossResultSection');
        return;
    }
    
    // Parse and validate inputs
    const totalResult = CalcLogic.parseNumericInput(totalNeededInput.value, {
        min: 0.001,
        allowEmpty: false
    });
    
    const rewardResult = CalcLogic.parseNumericInput(rewardPerWinInput.value, {
        min: 0.001,
        allowEmpty: false
    });
    
    if (!totalResult.valid || !rewardResult.valid) {
        if (t.errors?.invalidInput) {
            CalcLogic.showError('bossErrorMessage', t.errors.invalidInput);
        }
        CalcLogic.hideResultSection('bossResultSection');
        return;
    }
    
    // Calculate time
    const totalNeeded = totalResult.value;
    const rewardPerWin = rewardResult.value;
    const hasVipAutoclicker = vipAutoclickerInput.checked;
    
    const victoriesNeeded = Math.ceil(totalNeeded / rewardPerWin);
    const timePerVictory = hasVipAutoclicker ? 2.5 : 4.5;
    const totalTimeSeconds = victoriesNeeded * timePerVictory;
    
    // Format and display result
    const formattedTime = CalcLogic.formatTimeDuration(totalTimeSeconds, {
        s: 's',
        m: 'm',
        h: 'h',
        d: 'd'
    });
    
    CalcLogic.updateElementText('bossResultValue', formattedTime);
    CalcLogic.showResultSection('bossResultSection', 100);
    
    console.log(`✅ Boss calculation: ${victoriesNeeded} victories, ${formattedTime}`);
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('bossPage')) {
        currentBossLanguage = CalcLogic.getCurrentAppLanguage();
        initializeBoss();
    }
});

// Global exports
window.initializeBoss = initializeBoss;
window.calculateBossTime = calculateBossTime;
window.updateBossLanguage = updateBossLanguage;

console.log('✅ Boss Calculator module loaded');
