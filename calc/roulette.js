// ROULETTE CALCULATOR - Optimized Version
// calc/roulette/roulette.js

let rouletteInitialized = false;
let currentRouletteLanguage = 'en';

const rouletteTranslations = {
    en: {
        title: "🎰 Roulette Calculator",
        totalSpins: "Total Spins Needed:",
        spinsPerTurn: "Spins per Turn:",
        calculateBtn: "Calculate Time",
        resultTitle: "Total Time Needed:",
        totalSpinsPlaceholder: "Enter total spins needed...",
        spinsPerTurnPlaceholder: "Enter spins per turn...",
        second: "s",
        seconds: "s", 
        minute: "m",
        minutes: "m",
        hour: "h",
        hours: "h",
        day: "d",
        days: "d",
        errors: {
            invalidInput: "Please enter valid positive numbers",
            missingFields: "Please enter both values",
            zeroSpins: "Spins per turn cannot be zero"
        }
    },
    uk: {
        title: "🎰 Калькулятор Рулетки",
        totalSpins: "Загальна Кількість Спінів:",
        spinsPerTurn: "Спінів за Хід:",
        calculateBtn: "Розрахувати Час",
        resultTitle: "Загальний Час:",
        totalSpinsPlaceholder: "Введіть загальну кількість спінів...",
        spinsPerTurnPlaceholder: "Введіть спінів за хід...",
        second: "с",
        seconds: "с", 
        minute: "хв",
        minutes: "хв",
        hour: "г",
        hours: "г",
        day: "д",
        days: "д",
        errors: {
            invalidInput: "Будь ласка, введіть дійсні позитивні числа",
            missingFields: "Будь ласка, введіть обидва значення",
            zeroSpins: "Спінів за хід не може бути нуль"
        }
    },
    ru: {
        title: "🎰 Калькулятор Рулетки",
        totalSpins: "Общее Количество Спинов:",
        spinsPerTurn: "Спинов за Ход:",
        calculateBtn: "Рассчитать Время",
        resultTitle: "Общее Время:",
        totalSpinsPlaceholder: "Введите общее количество спинов...",
        spinsPerTurnPlaceholder: "Введите спинов за ход...",
        second: "с",
        seconds: "с", 
        minute: "м",
        minutes: "м",
        hour: "ч",
        hours: "ч",
        day: "д",
        days: "д",
        errors: {
            invalidInput: "Пожалуйста, введите действительные положительные числа",
            missingFields: "Пожалуйста, введите оба значения",
            zeroSpins: "Спинов за ход не может быть ноль"
        }
    }
};

function createRouletteHTML() {
    const roulettePage = document.getElementById('roulettePage');
    if (!roulettePage) return;

    const t = rouletteTranslations[currentRouletteLanguage] || rouletteTranslations.en;

    roulettePage.innerHTML = `
        <div class="header-controls">
            <h1>${t.title}</h1>
        </div>

        <div class="input-section">
            <div class="input-group">
                <label class="input-label" for="totalSpinsInput">${t.totalSpins}</label>
                <input type="number" class="number-input" id="totalSpinsInput" placeholder="${t.totalSpinsPlaceholder}" step="1" min="1" oninput="calculateRouletteTime()">
            </div>
            
            <div class="input-group">
                <label class="input-label" for="spinsPerTurnInput">${t.spinsPerTurn}</label>
                <input type="number" class="number-input" id="spinsPerTurnInput" placeholder="${t.spinsPerTurnPlaceholder}" step="1" min="1" oninput="calculateRouletteTime()">
            </div>
            
            <button class="calculate-btn" onclick="calculateRouletteTime()">${t.calculateBtn}</button>
            <div class="error" id="rouletteErrorMessage"></div>
        </div>

        <div class="result-section" id="rouletteResultSection">
            <div class="stats-label">${t.resultTitle}</div>
            <div class="result-value" id="rouletteResultValue">0</div>
            <div class="result-details" id="rouletteResultDetails"></div>
        </div>
    `;
}

function getCurrentAppLanguage() {
    return typeof getCurrentLanguage === 'function' 
        ? getCurrentLanguage() 
        : localStorage.getItem('selectedLanguage') || 'en';
}

function initializeRoulette() {
    console.log('🚀 Initializing Roulette Calculator...');
    rouletteInitialized = false;
    currentRouletteLanguage = getCurrentAppLanguage();
    createRouletteHTML();
    addRouletteEventListeners();
    rouletteInitialized = true;
    console.log('✅ Roulette Calculator initialized');
}

function addRouletteEventListeners() {
    document.addEventListener('languageChanged', (e) => {
        updateRouletteLanguage(e.detail.language);
    });
    
    setTimeout(() => {
        const totalSpinsInput = document.getElementById('totalSpinsInput');
        const spinsPerTurnInput = document.getElementById('spinsPerTurnInput');
        
        if (totalSpinsInput) {
            totalSpinsInput.addEventListener('input', calculateRouletteTime);
            totalSpinsInput.addEventListener('keypress', handleEnterKey);
        }
        
        if (spinsPerTurnInput) {
            spinsPerTurnInput.addEventListener('input', calculateRouletteTime);
            spinsPerTurnInput.addEventListener('keypress', handleEnterKey);
        }
    }, 100);
}

function updateRouletteLanguage(language) {
    currentRouletteLanguage = rouletteTranslations[language] ? language : 'en';
    createRouletteHTML();
    setTimeout(() => addRouletteEventListeners(), 100);
    console.log(`✅ Roulette Calculator language updated to ${language}`);
}

function formatTime(seconds) {
    const t = rouletteTranslations[currentRouletteLanguage] || rouletteTranslations.en;
    const u = {
        s: t.second || 's',
        m: t.minute || 'm',
        h: t.hour || 'h',
        d: t.day || 'd'
    };
    
    if (seconds < 60) {
        const sec = Math.ceil(seconds);
        return `${sec}${u.s}`;
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.ceil(seconds % 60);
        
        return remainingSeconds === 0 
            ? `${minutes}${u.m}` 
            : `${minutes}${u.m} ${remainingSeconds}${u.s}`;
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.ceil(seconds % 60);
        
        let result = `${hours}${u.h}`;
        
        if (minutes > 0) {
            result += ` ${minutes}${u.m}`;
        }
        
        if (remainingSeconds > 0 && minutes === 0) {
            result += ` ${remainingSeconds}${u.s}`;
        }
        
        return result;
    } else {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        let result = `${days}${u.d}`;
        
        if (hours > 0) {
            result += ` ${hours}${u.h}`;
        }
        
        if (minutes > 0 && hours === 0) {
            result += ` ${minutes}${u.m}`;
        }
        
        return result;
    }
}

function calculateRouletteTime() {
    const totalSpinsInput = document.getElementById('totalSpinsInput');
    const spinsPerTurnInput = document.getElementById('spinsPerTurnInput');
    const resultValue = document.getElementById('rouletteResultValue');
    const resultDetails = document.getElementById('rouletteResultDetails');
    const errorMessage = document.getElementById('rouletteErrorMessage');
    const resultSection = document.getElementById('rouletteResultSection');
    
    if (!totalSpinsInput || !spinsPerTurnInput || !resultValue || !errorMessage || !resultSection) return;
    
    const t = rouletteTranslations[currentRouletteLanguage] || rouletteTranslations.en;
    
    if (errorMessage) {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    }
    if (resultValue) resultValue.textContent = '0';
    if (resultDetails) resultDetails.textContent = '';
    
    const totalSpins = parseFloat(totalSpinsInput.value || 0);
    const spinsPerTurn = parseFloat(spinsPerTurnInput.value || 0);
    
    if (!totalSpinsInput.value.trim() || !spinsPerTurnInput.value.trim()) {
        if (errorMessage && t.errors?.missingFields) {
            errorMessage.textContent = t.errors.missingFields;
            errorMessage.style.display = 'block';
        }
        resultSection.classList.remove('show-result');
        return;
    }
    
    if (totalSpins <= 0 || spinsPerTurn <= 0 || isNaN(totalSpins) || isNaN(spinsPerTurn)) {
        if (errorMessage && t.errors?.invalidInput) {
            errorMessage.textContent = t.errors.invalidInput;
            errorMessage.style.display = 'block';
        }
        resultSection.classList.remove('show-result');
        return;
    }
    
    if (spinsPerTurn === 0) {
        if (errorMessage && t.errors?.zeroSpins) {
            errorMessage.textContent = t.errors.zeroSpins;
            errorMessage.style.display = 'block';
        }
        resultSection.classList.remove('show-result');
        return;
    }
    
    const totalTurns = totalSpins / spinsPerTurn;
    const totalSeconds = totalTurns * 6;
    const formattedTime = formatTime(totalSeconds);
    
    if (resultValue) {
        resultValue.textContent = formattedTime;
        setTimeout(() => resultSection.classList.add('show-result'), 100);
    }
    
    if (resultDetails) {
        resultDetails.textContent = '';
    }
    
    console.log(`🎰 Calculated: ${totalSpins} spins ÷ ${spinsPerTurn} per turn = ${totalTurns} turns = ${totalSeconds}s = ${formattedTime}`);
}

function handleEnterKey(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        calculateRouletteTime();
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('roulettePage')) initializeRoulette();
});

document.addEventListener('pageChanged', (e) => {
    if (e.detail.pageId === 'roulettePage' && !rouletteInitialized) {
        initializeRoulette();
    }
});

// Global exports
window.initializeRoulette = initializeRoulette;
window.calculateRouletteTime = calculateRouletteTime;
window.updateRouletteLanguage = updateRouletteLanguage;
window.debugInitializeRoulette = () => {
    rouletteInitialized = false;
    initializeRoulette();
};

console.log('✅ Roulette Calculator module loaded');
