// Boss Calculator JavaScript - calc/boss.js

// Global variables for boss calculator
let bossInitialized = false;
let currentBossLanguage = 'en';

// Boss translations
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
        },
        resultDetails: {
            victories: "victories needed",
            withVip: "with VIP + Autoclicker",
            withoutVip: "without VIP + Autoclicker"
        }
    },
    uk: {
        title: "👹 Калькулятор Босів",
        totalNeeded: "Загальна кількість для збору:",
        rewardPerWin: "Нагорода за перемогу:",
        vipAutoclicker: "VIP + Автоклікер",
        vipDescription: "(2.5с проти 4.5с)",
        calculateBtn: "Розрахувати Час",
        resultTitle: "Загальний необхідний час:",
        totalNeededPlaceholder: "Введіть загальну кількість...",
        rewardPerWinPlaceholder: "Введіть нагороду за перемогу...",
        errors: {
            invalidInput: "Будь ласка, введіть коректні додатні числа",
            missingFields: "Будь ласка, заповніть обидва поля"
        },
        resultDetails: {
            victories: "перемог потрібно",
            withVip: "з VIP + Автоклікер",
            withoutVip: "без VIP + Автоклікер"
        }
    },
    ru: {
        title: "👹 Калькулятор Боссов",
        totalNeeded: "Общее количество для сбора:",
        rewardPerWin: "Награда за победу:",
        vipAutoclicker: "VIP + Автокликер",
        vipDescription: "(2.5с против 4.5с)",
        calculateBtn: "Рассчитать Время",
        resultTitle: "Общее необходимое время:",
        totalNeededPlaceholder: "Введите общее количество...",
        rewardPerWinPlaceholder: "Введите награду за победу...",
        errors: {
            invalidInput: "Пожалуйста, введите корректные положительные числа",
            missingFields: "Пожалуйста, заполните оба поля"
        },
        resultDetails: {
            victories: "побед нужно",
            withVip: "с VIP + Автокликер",
            withoutVip: "без VIP + Автокликер"
        }
    }
};

// Initialize Boss Calculator
function initializeBoss() {
    if (bossInitialized) {
        console.log('⚠️ Boss calculator already initialized');
        return;
    }

    console.log('🚀 Initializing Boss Calculator...');
    
    // Set current language
    currentBossLanguage = getCurrentAppLanguage();
    
    // Update language
    updateBossLanguage(currentBossLanguage);
    
    // Add event listeners
    addBossEventListeners();
    
    bossInitialized = true;
    console.log('✅ Boss Calculator initialized');
}

// Add event listeners for boss calculator
function addBossEventListeners() {
    // Listen for language changes
    document.addEventListener('languageChanged', function(event) {
        const newLanguage = event.detail.language;
        console.log(`🌍 Boss Calculator: Language changed to ${newLanguage}`);
        updateBossLanguage(newLanguage);
    });
    
    // Input validation
    const totalNeededInput = document.getElementById('totalNeededInput');
    const rewardPerWinInput = document.getElementById('rewardPerWinInput');
    
    if (totalNeededInput) {
        totalNeededInput.addEventListener('input', validateBossInputs);
    }
    
    if (rewardPerWinInput) {
        rewardPerWinInput.addEventListener('input', validateBossInputs);
    }
    
    console.log('✅ Boss Calculator event listeners added');
}

// Update boss calculator language
function updateBossLanguage(language) {
    if (!bossTranslations[language]) {
        console.warn(`❌ Language ${language} not found for boss calculator, using English`);
        language = 'en';
    }
    
    currentBossLanguage = language;
    const t = bossTranslations[language];
    
    // Update page title
    const title = document.querySelector('#bossPage .header-controls h1');
    if (title) title.textContent = t.title;
    
    // Update labels
    const labels = {
        'totalNeededInput': t.totalNeeded,
        'rewardPerWinInput': t.rewardPerWin
    };
    
    Object.entries(labels).forEach(([inputId, labelText]) => {
        const label = document.querySelector(`label[for="${inputId}"]`);
        if (label) label.textContent = labelText;
    });
    
    // Update placeholders
    const totalNeededInput = document.getElementById('totalNeededInput');
    const rewardPerWinInput = document.getElementById('rewardPerWinInput');
    
    if (totalNeededInput) totalNeededInput.placeholder = t.totalNeededPlaceholder;
    if (rewardPerWinInput) rewardPerWinInput.placeholder = t.rewardPerWinPlaceholder;
    
    // Update toggle labels
    const vipToggleLabel = document.querySelector('#bossPage .toggle-label');
    const vipToggleMultiplier = document.querySelector('#bossPage .toggle-multiplier');
    
    if (vipToggleLabel) vipToggleLabel.textContent = t.vipAutoclicker;
    if (vipToggleMultiplier) vipToggleMultiplier.textContent = t.vipDescription;
    
    // Update button
    const calculateBtn = document.querySelector('#bossPage .calculate-btn');
    if (calculateBtn) calculateBtn.textContent = t.calculateBtn;
    
    // Update result title
    const resultTitle = document.querySelector('#bossPage .stats-label');
    if (resultTitle) resultTitle.textContent = t.resultTitle;
    
    console.log(`✅ Boss Calculator language updated to ${language}`);
}

// Validate boss calculator inputs
function validateBossInputs() {
    const totalNeeded = document.getElementById('totalNeededInput');
    const rewardPerWin = document.getElementById('rewardPerWinInput');
    const errorMessage = document.getElementById('bossErrorMessage');
    
    if (!totalNeeded || !rewardPerWin || !errorMessage) return;
    
    const totalValue = parseFloat(totalNeeded.value);
    const rewardValue = parseFloat(rewardPerWin.value);
    
    let isValid = true;
    let errorText = '';
    
    if (totalNeeded.value && (isNaN(totalValue) || totalValue <= 0)) {
        isValid = false;
        errorText = bossTranslations[currentBossLanguage].errors.invalidInput;
    }
    
    if (rewardPerWin.value && (isNaN(rewardValue) || rewardValue <= 0)) {
        isValid = false;
        errorText = bossTranslations[currentBossLanguage].errors.invalidInput;
    }
    
    if (errorText) {
        errorMessage.textContent = errorText;
        errorMessage.style.display = 'block';
    } else {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    }
    
    return isValid;
}

// Calculate boss time
function calculateBossTime() {
    console.log('👹 Calculating boss time...');
    
    const totalNeededInput = document.getElementById('totalNeededInput');
    const rewardPerWinInput = document.getElementById('rewardPerWinInput');
    const vipAutoclickerInput = document.getElementById('vipAutoclicker');
    const errorMessage = document.getElementById('bossErrorMessage');
    const resultSection = document.getElementById('bossResultSection');
    const resultValue = document.getElementById('bossResultValue');
    const resultDetails = document.getElementById('bossResultDetails');
    
    if (!totalNeededInput || !rewardPerWinInput || !vipAutoclickerInput || 
        !errorMessage || !resultSection || !resultValue || !resultDetails) {
        console.error('❌ Boss calculator elements not found');
        return;
    }
    
    const t = bossTranslations[currentBossLanguage];
    
    // Get input values
    const totalNeeded = parseFloat(totalNeededInput.value);
    const rewardPerWin = parseFloat(rewardPerWinInput.value);
    const hasVipAutoclicker = vipAutoclickerInput.checked;
    
    // Validate inputs
    if (!totalNeededInput.value || !rewardPerWinInput.value) {
        errorMessage.textContent = t.errors.missingFields;
        errorMessage.style.display = 'block';
        resultSection.classList.remove('show');
        return;
    }
    
    if (isNaN(totalNeeded) || totalNeeded <= 0 || isNaN(rewardPerWin) || rewardPerWin <= 0) {
        errorMessage.textContent = t.errors.invalidInput;
        errorMessage.style.display = 'block';
        resultSection.classList.remove('show');
        return;
    }
    
    // Hide error message
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
    
    // Calculate number of victories needed (round up to next whole number)
    const victoriesNeeded = Math.ceil(totalNeeded / rewardPerWin);
    
    // Calculate time per victory (in seconds)
    const timePerVictory = hasVipAutoclicker ? 2.5 : 4.5;
    
    // Calculate total time in seconds
    const totalTimeSeconds = victoriesNeeded * timePerVictory;
    
    // Format time result
    const formattedTime = formatTime(totalTimeSeconds);
    
    // Update result display
    resultValue.textContent = formattedTime;
    
    // Create details text
    const vipStatus = hasVipAutoclicker ? t.resultDetails.withVip : t.resultDetails.withoutVip;
    resultDetails.innerHTML = `
        ${victoriesNeeded} ${t.resultDetails.victories}<br>
        ${vipStatus}
    `;
    
    // Show result section with animation
    setTimeout(() => {
        resultSection.classList.add('show');
    }, 100);
    
    console.log(`✅ Boss calculation completed: ${victoriesNeeded} victories, ${formattedTime}`);
}

// Format time from seconds to appropriate unit
function formatTime(seconds) {
    if (seconds < 60) {
        return `${Math.round(seconds * 10) / 10}s`;
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        if (remainingSeconds === 0) {
            return `${minutes}m`;
        }
        return `${minutes}m ${remainingSeconds}s`;
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        const remainingMinutes = Math.floor((seconds % 3600) / 60);
        if (remainingMinutes === 0) {
            return `${hours}h`;
        }
        return `${hours}h ${remainingMinutes}m`;
    } else {
        const days = Math.floor(seconds / 86400);
        const remainingHours = Math.floor((seconds % 86400) / 3600);
        if (remainingHours === 0) {
            return `${days}d`;
        }
        return `${days}d ${remainingHours}h`;
    }
}

// Make functions globally available
window.initializeBoss = initializeBoss;
window.calculateBossTime = calculateBossTime;
window.updateBossLanguage = updateBossLanguage;
window.bossInitialized = bossInitialized;

console.log('✅ Boss Calculator module loaded');
