// BOSS CALCULATOR - Optimized Version
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
    if (!bossPage) return;

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
}

function getCurrentAppLanguage() {
    return typeof getCurrentLanguage === 'function' 
        ? getCurrentLanguage() 
        : localStorage.getItem('selectedLanguage') || 'en';
}

function initializeBoss() {
    console.log('🚀 Initializing Boss Calculator...');
    bossInitialized = false;
    currentBossLanguage = getCurrentAppLanguage();
    createBossHTML();
    addBossEventListeners();
    bossInitialized = true;
    console.log('✅ Boss Calculator initialized');
}

function addBossEventListeners() {
    document.addEventListener('languageChanged', (e) => {
        updateBossLanguage(e.detail.language);
    });
    
    setTimeout(() => {
        ['totalNeededInput', 'rewardPerWinInput', 'vipAutoclicker'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', calculateBossTime);
            }
        });
    }, 100);
}

function updateBossLanguage(language) {
    currentBossLanguage = bossTranslations[language] ? language : 'en';
    createBossHTML();
    setTimeout(() => {
        ['totalNeededInput', 'rewardPerWinInput', 'vipAutoclicker'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', calculateBossTime);
            }
        });
    }, 100);
    console.log(`✅ Boss Calculator language updated to ${language}`);
}

function formatTime(seconds) {
    if (seconds < 60) {
        return `${Math.round(seconds * 10) / 10}s`;
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return remainingSeconds === 0 ? `${minutes}m` : `${minutes}m ${remainingSeconds}s`;
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        const remainingMinutes = Math.floor((seconds % 3600) / 60);
        return remainingMinutes === 0 ? `${hours}h` : `${hours}h ${remainingMinutes}m`;
    } else {
        const days = Math.floor(seconds / 86400);
        const remainingHours = Math.floor((seconds % 86400) / 3600);
        return remainingHours === 0 ? `${days}d` : `${days}d ${remainingHours}h`;
    }
}

function calculateBossTime() {
    const totalNeededInput = document.getElementById('totalNeededInput');
    const rewardPerWinInput = document.getElementById('rewardPerWinInput');
    const vipAutoclickerInput = document.getElementById('vipAutoclicker');
    const errorMessage = document.getElementById('bossErrorMessage');
    const resultSection = document.getElementById('bossResultSection');
    const resultValue = document.getElementById('bossResultValue');
    
    if (!totalNeededInput || !rewardPerWinInput || !vipAutoclickerInput || 
        !errorMessage || !resultSection || !resultValue) return;
    
    const t = bossTranslations[currentBossLanguage] || bossTranslations.en;
    const totalNeeded = parseFloat(totalNeededInput.value);
    const rewardPerWin = parseFloat(rewardPerWinInput.value);
    const hasVipAutoclicker = vipAutoclickerInput.checked;
    
    errorMessage.textContent = '';
    
    if (!totalNeededInput.value || !rewardPerWinInput.value) {
        if (t.errors?.missingFields) {
            errorMessage.textContent = t.errors.missingFields;
        }
        resultSection.classList.remove('show');
        return;
    }
    
    if (isNaN(totalNeeded) || totalNeeded <= 0 || isNaN(rewardPerWin) || rewardPerWin <= 0) {
        if (t.errors?.invalidInput) {
            errorMessage.textContent = t.errors.invalidInput;
        }
        resultSection.classList.remove('show');
        return;
    }
    
    const victoriesNeeded = Math.ceil(totalNeeded / rewardPerWin);
    const timePerVictory = hasVipAutoclicker ? 2.5 : 4.5;
    const totalTimeSeconds = victoriesNeeded * timePerVictory;
    const formattedTime = formatTime(totalTimeSeconds);
    
    resultValue.textContent = formattedTime;
    setTimeout(() => resultSection.classList.add('show'), 100);
    
    console.log(`✅ Boss calculation: ${victoriesNeeded} victories, ${formattedTime}`);
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('bossPage')) initializeBoss();
});

// Global exports
window.initializeBoss = initializeBoss;
window.calculateBossTime = calculateBossTime;
window.updateBossLanguage = updateBossLanguage;

console.log('✅ Boss Calculator module loaded');
