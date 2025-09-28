// Boss Calculator JavaScript - calc/boss.js

// Global variables for boss calculator
let bossInitialized = false;
let currentBossLanguage = 'en';
let bossTranslations = {};

// Load boss translations from JSON file
async function loadBossTranslations() {
    try {
        console.log('📥 Loading boss translations...');
        const response = await fetch('./languages/boss.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        bossTranslations = await response.json();
        console.log('✅ Boss translations loaded successfully');
        return true;
    } catch (error) {
        console.error('❌ Error loading boss translations:', error);
        // Fallback to prevent crashes
        bossTranslations = {
            en: {
                title: "👹 Boss Calculator",
                totalNeeded: "Total Needed to Collect:",
                rewardPerWin: "Reward per Victory:",
                calculateBtn: "Calculate Time",
                errors: {
                    invalidInput: "Please enter valid positive numbers",
                    missingFields: "Please fill in both fields"
                }
            }
        };
        return false;
    }
}

// Initialize Boss Calculator
async function initializeBoss() {
    if (bossInitialized) {
        console.log('⚠️ Boss calculator already initialized');
        return;
    }

    console.log('🚀 Initializing Boss Calculator...');
    
    // Load translations first
    await loadBossTranslations();
    
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
    
    if (!t) {
        console.error('❌ Translation object not found');
        return;
    }
    
    // Update page title
    const title = document.querySelector('#bossPage .header-controls h1');
    if (title && t.title) title.textContent = t.title;
    
    // Update labels
    const labels = {
        'totalNeededInput': t.totalNeeded,
        'rewardPerWinInput': t.rewardPerWin
    };
    
    Object.entries(labels).forEach(([inputId, labelText]) => {
        if (labelText) {
            const label = document.querySelector(`label[for="${inputId}"]`);
            if (label) label.textContent = labelText;
        }
    });
    
    // Update placeholders
    const totalNeededInput = document.getElementById('totalNeededInput');
    const rewardPerWinInput = document.getElementById('rewardPerWinInput');
    
    if (totalNeededInput && t.totalNeededPlaceholder) {
        totalNeededInput.placeholder = t.totalNeededPlaceholder;
    }
    if (rewardPerWinInput && t.rewardPerWinPlaceholder) {
        rewardPerWinInput.placeholder = t.rewardPerWinPlaceholder;
    }
    
    // Update toggle labels
    const vipToggleLabel = document.querySelector('#bossPage .toggle-label');
    const vipToggleMultiplier = document.querySelector('#bossPage .toggle-multiplier');
    
    if (vipToggleLabel && t.vipAutoclicker) {
        vipToggleLabel.textContent = t.vipAutoclicker;
    }
    if (vipToggleMultiplier && t.vipDescription) {
        vipToggleMultiplier.textContent = t.vipDescription;
    }
    
    // Update button
    const calculateBtn = document.querySelector('#bossPage .calculate-btn');
    if (calculateBtn && t.calculateBtn) {
        calculateBtn.textContent = t.calculateBtn;
    }
    
    // Update result title
    const resultTitle = document.querySelector('#bossPage .stats-label');
    if (resultTitle && t.resultTitle) {
        resultTitle.textContent = t.resultTitle;
    }
    
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
    
    const t = bossTranslations[currentBossLanguage];
    if (!t || !t.errors) return;
    
    if (totalNeeded.value && (isNaN(totalValue) || totalValue <= 0)) {
        isValid = false;
        errorText = t.errors.invalidInput;
    }
    
    if (rewardPerWin.value && (isNaN(rewardValue) || rewardValue <= 0)) {
        isValid = false;
        errorText = t.errors.invalidInput;
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
    if (!t) {
        console.error('❌ Translation object not found for current language');
        return;
    }
    
    // Get input values
    const totalNeeded = parseFloat(totalNeededInput.value);
    const rewardPerWin = parseFloat(rewardPerWinInput.value);
    const hasVipAutoclicker = vipAutoclickerInput.checked;
    
    // Validate inputs
    if (!totalNeededInput.value || !rewardPerWinInput.value) {
        if (t.errors && t.errors.missingFields) {
            errorMessage.textContent = t.errors.missingFields;
        }
        errorMessage.style.display = 'block';
        resultSection.classList.remove('show');
        return;
    }
    
    if (isNaN(totalNeeded) || totalNeeded <= 0 || isNaN(rewardPerWin) || rewardPerWin <= 0) {
        if (t.errors && t.errors.invalidInput) {
            errorMessage.textContent = t.errors.invalidInput;
        }
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
    if (t.resultDetails) {
        const vipStatus = hasVipAutoclicker ? t.resultDetails.withVip : t.resultDetails.withoutVip;
        resultDetails.innerHTML = `
            ${victoriesNeeded} ${t.resultDetails.victories}<br>
            ${vipStatus}
        `;
    }
    
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
