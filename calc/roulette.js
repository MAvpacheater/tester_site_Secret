// Roulette Calculator - Full implementation with HTML structure creation

// Global variables for roulette calculator
let rouletteInitialized = false;
let currentRouletteLanguage = 'en';
let rouletteTranslations = {};

// Default translations - fallback
const defaultRouletteTranslations = {
    en: {
        title: "🎰 Roulette Calculator",
        totalSpins: "Total Spins Needed:",
        spinsPerTurn: "Spins per Turn:",
        calculateBtn: "Calculate Time",
        resultTitle: "Total Time Needed:",
        totalSpinsPlaceholder: "Enter total spins needed...",
        spinsPerTurnPlaceholder: "Enter spins per turn...",
        // Short time units
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
    }
};

// Create HTML structure for roulette calculator
function createRouletteHTML() {
    const roulettePage = document.getElementById('roulettePage');
    if (!roulettePage) {
        console.error('❌ Roulette page container not found');
        return;
    }

    const t = rouletteTranslations[currentRouletteLanguage] || defaultRouletteTranslations['en'];
    console.log('Using roulette translations:', t); // Debug log

    roulettePage.innerHTML = `
        <div class="header-controls">
            <h1>${t.title}</h1>
        </div>

        <!-- Input Section -->
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

        <!-- Result Section -->
        <div class="result-section" id="rouletteResultSection">
            <div class="stats-label">${t.resultTitle}</div>
            <div class="result-value" id="rouletteResultValue">0</div>
            <div class="result-details" id="rouletteResultDetails"></div>
        </div>
    `;

    console.log('✅ Roulette HTML structure created');
}

// Load roulette translations from JSON file
async function loadRouletteTranslations() {
    try {
        console.log('📥 Loading roulette translations...');
        const response = await fetch('./languages/roulette.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        rouletteTranslations = data;
        console.log('✅ Roulette translations loaded successfully');
        console.log('Loaded roulette translations:', rouletteTranslations);
        return true;
    } catch (error) {
        console.error('❌ Error loading roulette translations:', error);
        // Use default translations as fallback
        rouletteTranslations = defaultRouletteTranslations;
        console.log('Using default roulette translations:', rouletteTranslations);
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

// Initialize Roulette Calculator
async function initializeRoulette() {
    console.log('🚀 Initializing Roulette Calculator...');
    
    // Reset initialization flag
    rouletteInitialized = false;
    
    // Load translations first
    const translationsLoaded = await loadRouletteTranslations();
    console.log('Roulette translation load result:', translationsLoaded);
    console.log('Available roulette translations:', Object.keys(rouletteTranslations));
    
    // Set current language
    currentRouletteLanguage = getCurrentAppLanguage();
    console.log('Current roulette language:', currentRouletteLanguage);
    
    // Create HTML structure
    createRouletteHTML();
    
    // Add event listeners
    addRouletteEventListeners();
    
    rouletteInitialized = true;
    console.log('✅ Roulette Calculator initialized');
}

// Add event listeners for roulette calculator
function addRouletteEventListeners() {
    // Listen for language changes
    document.addEventListener('languageChanged', function(event) {
        const newLanguage = event.detail.language;
        console.log(`🌍 Roulette Calculator: Language changed to ${newLanguage}`);
        updateRouletteLanguage(newLanguage);
    });
    
    // Add real-time calculation listeners
    setTimeout(() => {
        const totalSpinsInput = document.getElementById('totalSpinsInput');
        const spinsPerTurnInput = document.getElementById('spinsPerTurnInput');
        
        if (totalSpinsInput) {
            totalSpinsInput.addEventListener('input', calculateRouletteTime);
            totalSpinsInput.addEventListener('keypress', handleEnterKey);
            console.log('✅ Total spins input events bound');
        }
        
        if (spinsPerTurnInput) {
            spinsPerTurnInput.addEventListener('input', calculateRouletteTime);
            spinsPerTurnInput.addEventListener('keypress', handleEnterKey);
            console.log('✅ Spins per turn input events bound');
        }
    }, 100);
    
    console.log('✅ Roulette Calculator event listeners added');
}

// Update roulette calculator language
function updateRouletteLanguage(language) {
    if (!rouletteTranslations[language]) {
        console.warn(`❌ Language ${language} not found for roulette calculator, using English`);
        language = 'en';
    }
    
    currentRouletteLanguage = language;
    
    // Recreate HTML with new language
    createRouletteHTML();
    
    // Re-add event listeners
    setTimeout(() => {
        addRouletteEventListeners();
    }, 100);
    
    console.log(`✅ Roulette Calculator language updated to ${language}`);
}

// Enhanced time formatting with short units and language support
function formatTime(seconds) {
    const lang = currentRouletteLanguage;
    const texts = rouletteTranslations[lang] || defaultRouletteTranslations['en'];
    
    // Short time unit names from language file
    const timeUnits = {
        second: texts.second || 's',
        seconds: texts.seconds || 's',
        minute: texts.minute || 'm', 
        minutes: texts.minutes || 'm',
        hour: texts.hour || 'h',
        hours: texts.hours || 'h',
        day: texts.day || 'd',
        days: texts.days || 'd'
    };
    
    if (seconds < 60) {
        // Less than a minute
        const sec = Math.ceil(seconds);
        return `${sec}${timeUnits.seconds}`;
    } else if (seconds < 3600) {
        // Less than an hour
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.ceil(seconds % 60);
        
        if (remainingSeconds === 0) {
            return `${minutes}${timeUnits.minutes}`;
        } else {
            return `${minutes}${timeUnits.minutes} ${remainingSeconds}${timeUnits.seconds}`;
        }
    } else if (seconds < 86400) {
        // Less than a day
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.ceil(seconds % 60);
        
        let result = `${hours}${timeUnits.hours}`;
        
        if (minutes > 0) {
            result += ` ${minutes}${timeUnits.minutes}`;
        }
        
        if (remainingSeconds > 0 && minutes === 0) {
            result += ` ${remainingSeconds}${timeUnits.seconds}`;
        }
        
        return result;
    } else {
        // Days
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        let result = `${days}${timeUnits.days}`;
        
        if (hours > 0) {
            result += ` ${hours}${timeUnits.hours}`;
        }
        
        if (minutes > 0 && hours === 0) {
            result += ` ${minutes}${timeUnits.minutes}`;
        }
        
        return result;
    }
}

// Enhanced calculation function with clean results - only showing final time
function calculateRouletteTime() {
    console.log('🎰 Calculating roulette time...');
    
    const totalSpinsInput = document.getElementById('totalSpinsInput');
    const spinsPerTurnInput = document.getElementById('spinsPerTurnInput');
    const resultValue = document.getElementById('rouletteResultValue');
    const resultDetails = document.getElementById('rouletteResultDetails');
    const errorMessage = document.getElementById('rouletteErrorMessage');
    const resultSection = document.getElementById('rouletteResultSection');
    
    if (!totalSpinsInput || !spinsPerTurnInput || !resultValue || !errorMessage || !resultSection) {
        console.error('❌ Roulette calculator elements not found');
        return;
    }
    
    const t = rouletteTranslations[currentRouletteLanguage] || defaultRouletteTranslations['en'];
    
    // Clear previous messages
    if (errorMessage) {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    }
    if (resultValue) resultValue.textContent = '0';
    if (resultDetails) resultDetails.textContent = '';
    
    // Get input values
    const totalSpins = parseFloat(totalSpinsInput.value || 0);
    const spinsPerTurn = parseFloat(spinsPerTurnInput.value || 0);
    
    // Enhanced validation
    if (!totalSpinsInput.value.trim() || !spinsPerTurnInput.value.trim()) {
        if (errorMessage && t.errors && t.errors.missingFields) {
            errorMessage.textContent = t.errors.missingFields;
            errorMessage.style.display = 'block';
        }
        resultSection.classList.remove('show-result');
        return;
    }
    
    if (totalSpins <= 0 || spinsPerTurn <= 0 || isNaN(totalSpins) || isNaN(spinsPerTurn)) {
        if (errorMessage && t.errors && t.errors.invalidInput) {
            errorMessage.textContent = t.errors.invalidInput;
            errorMessage.style.display = 'block';
        }
        resultSection.classList.remove('show-result');
        return;
    }
    
    if (spinsPerTurn === 0) {
        if (errorMessage && t.errors && t.errors.zeroSpins) {
            errorMessage.textContent = t.errors.zeroSpins;
            errorMessage.style.display = 'block';
        }
        resultSection.classList.remove('show-result');
        return;
    }
    
    // Calculate time: (total spins / spins per turn) * 6 seconds
    const totalTurns = totalSpins / spinsPerTurn;
    const totalSeconds = totalTurns * 6;
    
    // Format and display result
    const formattedTime = formatTime(totalSeconds);
    
    if (resultValue) {
        resultValue.textContent = formattedTime;
        
        // Show result section with animation
        setTimeout(() => {
            resultSection.classList.add('show-result');
        }, 100);
    }
    
    // Clear result details - show only the time result
    if (resultDetails) {
        resultDetails.textContent = '';
    }
    
    console.log(`🎰 Calculated: ${totalSpins} spins ÷ ${spinsPerTurn} per turn = ${totalTurns} turns = ${totalSeconds}s = ${formattedTime}`);
}

// Helper function for Enter key handling
function handleEnterKey(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        calculateRouletteTime();
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if roulette page exists
    if (document.getElementById('roulettePage')) {
        initializeRoulette();
    }
});

// Also initialize when page becomes active (for navigation)
document.addEventListener('pageChanged', function(event) {
    if (event.detail.pageId === 'roulettePage') {
        console.log('🔄 Roulette calculator page activated, initializing...');
        if (!rouletteInitialized) {
            initializeRoulette();
        }
    }
});

// Force initialization function for debugging
window.debugInitializeRoulette = function() {
    console.log('🔧 Debug: Force initializing roulette calculator');
    rouletteInitialized = false;
    initializeRoulette();
};

// Make functions globally available
window.initializeRoulette = initializeRoulette;
window.calculateRouletteTime = calculateRouletteTime;
window.updateRouletteLanguage = updateRouletteLanguage;

console.log('✅ Roulette Calculator module loaded');
