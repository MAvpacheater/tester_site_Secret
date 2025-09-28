// Boss Calculator JavaScript - Full implementation with HTML structure creation

// Global variables for boss calculator
let bossInitialized = false;
let currentBossLanguage = 'en';
let bossTranslations = {};

// Default translations - fallback
const defaultTranslations = {
    en: {
        title: "👹 Boss Calculator",
        totalNeeded: "Total Needed to Collect:",
        rewardPerWin: "Reward per Victory:",
        calculateBtn: "Calculate",
        vipToggle: "VIP + Autoclicker",
        vipDescription: "(2.5s vs 4.5s)",
        resultTitle: "Total Time Needed:",
        errors: {
            invalidInput: "Please enter valid positive numbers",
            missingFields: "Please fill in both fields"
        }
    }
};

// Create HTML structure for boss calculator
function createBossHTML() {
    const bossPage = document.getElementById('bossPage');
    if (!bossPage) {
        console.error('❌ Boss page container not found');
        return;
    }

    const t = bossTranslations[currentBossLanguage] || defaultTranslations['en'];

    bossPage.innerHTML = `
        <div class="header-controls">
            <h1>${t.title}</h1>
        </div>
        
        <div class="input-section">
            <label class="input-label" for="totalNeededInput">${t.totalNeeded}</label>
            <input type="number" class="number-input" id="totalNeededInput" placeholder="Enter total amount needed..." step="1" min="1">
            
            <label class="input-label" for="rewardPerWinInput">${t.rewardPerWin}</label>
            <input type="number" class="number-input" id="rewardPerWinInput" placeholder="Enter reward per win..." step="1" min="1">
            
            <!-- VIP + Autoclicker Toggle -->
            <div class="simple-toggle">
                <div class="toggle-info">
                    <div class="toggle-label">${t.vipToggle}</div>
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

    console.log('✅ Boss HTML structure created');
}

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
        // Use default translations as fallback
        bossTranslations = defaultTranslations;
        return false;
    }
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
    
    // Create HTML structure
    createBossHTML();
    
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
    
    // Add real-time calculation listeners
    setTimeout(() => {
        const inputs = ['totalNeededInput', 'rewardPerWinInput', 'vipAutoclicker'];
        inputs.forEach(inputId => {
            const element = document.getElementById(inputId);
            if (element) {
                if (element.type === 'checkbox') {
                    element.addEventListener('change', calculateBossTime);
                } else {
                    element.addEventListener('input', calculateBossTime);
                }
            }
        });
    }, 100);
    
    console.log('✅ Boss Calculator event listeners added');
}

// Update boss calculator language
function updateBossLanguage(language) {
    if (!bossTranslations[language]) {
        console.warn(`❌ Language ${language} not found for boss calculator, using English`);
        language = 'en';
    }
    
    currentBossLanguage = language;
    
    // Recreate HTML with new language
    createBossHTML();
    
    // Re-add event listeners
    setTimeout(() => {
        const inputs = ['totalNeededInput', 'rewardPerWinInput', 'vipAutoclicker'];
        inputs.forEach(inputId => {
            const element = document.getElementById(inputId);
            if (element) {
                if (element.type === 'checkbox') {
                    element.addEventListener('change', calculateBossTime);
                } else {
                    element.addEventListener('input', calculateBossTime);
                }
            }
        });
    }, 100);
    
    console.log(`✅ Boss Calculator language updated to ${language}`);
}

// Calculate boss time - Main function
function calculateBossTime() {
    console.log('👹 Calculating boss time...');
    
    const totalNeededInput = document.getElementById('totalNeededInput');
    const rewardPerWinInput = document.getElementById('rewardPerWinInput');
    const vipAutoclickerInput = document.getElementById('vipAutoclicker');
    const errorMessage = document.getElementById('bossErrorMessage');
    const resultSection = document.getElementById('bossResultSection');
    const resultValue = document.getElementById('bossResultValue');
    
    if (!totalNeededInput || !rewardPerWinInput || !vipAutoclickerInput || 
        !errorMessage || !resultSection || !resultValue) {
        console.error('❌ Boss calculator elements not found');
        return;
    }
    
    const t = bossTranslations[currentBossLanguage] || defaultTranslations['en'];
    
    // Get input values
    const totalNeeded = parseFloat(totalNeededInput.value);
    const rewardPerWin = parseFloat(rewardPerWinInput.value);
    const hasVipAutoclicker = vipAutoclickerInput.checked;
    
    // Clear previous errors
    errorMessage.textContent = '';
    
    // Validate inputs
    if (!totalNeededInput.value || !rewardPerWinInput.value) {
        if (t.errors && t.errors.missingFields) {
            errorMessage.textContent = t.errors.missingFields;
        }
        resultSection.classList.remove('show');
        return;
    }
    
    if (isNaN(totalNeeded) || totalNeeded <= 0 || isNaN(rewardPerWin) || rewardPerWin <= 0) {
        if (t.errors && t.errors.invalidInput) {
            errorMessage.textContent = t.errors.invalidInput;
        }
        resultSection.classList.remove('show');
        return;
    }
    
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

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if boss page exists
    if (document.getElementById('bossPage')) {
        initializeBoss();
    }
});

// Make functions globally available
window.initializeBoss = initializeBoss;
window.calculateBossTime = calculateBossTime;
window.updateBossLanguage = updateBossLanguage;

console.log('✅ Boss Calculator module loaded');
