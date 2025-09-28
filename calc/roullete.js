// Roulette Calculator Module
let rouletteTexts = {};
let rouletteInitialized = false;

// Load language translations
async function loadRouletteLanguage() {
    try {
        const response = await fetch('languages/roulette.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        rouletteTexts = await response.json();
        console.log('✅ Roulette language data loaded');
    } catch (error) {
        console.warn('⚠️ Could not load roulette language data:', error);
        // Set empty fallback - will be handled by checking
        rouletteTexts = {};
    }
}

// Update language
function updateRouletteLanguage(lang = null) {
    if (!lang) lang = getCurrentAppLanguage();
    
    if (!rouletteTexts[lang]) {
        console.warn(`❌ Roulette language ${lang} not found, using English`);
        lang = 'en';
    }
    
    const texts = rouletteTexts[lang];
    if (!texts) {
        console.warn('⚠️ No texts available for roulette');
        return;
    }
    
    // Update page title
    const title = document.querySelector('#roulettePage .header-controls h1');
    if (title) title.textContent = texts.title;
    
    // Update labels
    const totalSpinsLabel = document.querySelector('#roulettePage .input-group:first-child .input-label');
    if (totalSpinsLabel) totalSpinsLabel.textContent = texts.totalSpins;
    
    const spinsPerTurnLabel = document.querySelector('#roulettePage .input-group:last-child .input-label');
    if (spinsPerTurnLabel) spinsPerTurnLabel.textContent = texts.spinsPerTurn;
    
    // Update placeholders
    const totalSpinsInput = document.getElementById('totalSpinsInput');
    if (totalSpinsInput) totalSpinsInput.placeholder = texts.placeholderTotal;
    
    const spinsPerTurnInput = document.getElementById('spinsPerTurnInput');
    if (spinsPerTurnInput) spinsPerTurnInput.placeholder = texts.placeholderPerTurn;
    
    // Update button
    const calculateBtn = document.querySelector('#roulettePage .calculate-btn');
    if (calculateBtn) calculateBtn.textContent = texts.calculate;
    
    // Update result label
    const resultLabel = document.querySelector('#roulettePage .stats-label');
    if (resultLabel) resultLabel.textContent = texts.result;
    
    console.log(`✅ Roulette language updated to: ${lang}`);
}

// Format time duration
function formatTime(seconds) {
    const lang = getCurrentAppLanguage();
    const texts = rouletteTexts[lang] || rouletteTexts['en'] || {};
    
    if (seconds < 60) {
        // Less than a minute
        const sec = Math.ceil(seconds);
        return `${sec} ${sec === 1 ? 'second' : 'seconds'}`;
    } else if (seconds < 3600) {
        // Less than an hour
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.ceil(seconds % 60);
        
        if (remainingSeconds === 0) {
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
        } else {
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ${remainingSeconds} ${remainingSeconds === 1 ? 'second' : 'seconds'}`;
        }
    } else if (seconds < 86400) {
        // Less than a day
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.ceil(seconds % 60);
        
        let result = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
        
        if (minutes > 0) {
            result += ` ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
        }
        
        if (remainingSeconds > 0 && minutes === 0) {
            result += ` ${remainingSeconds} ${remainingSeconds === 1 ? 'second' : 'seconds'}`;
        }
        
        return result;
    } else {
        // Days
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        let result = `${days} ${days === 1 ? 'day' : 'days'}`;
        
        if (hours > 0) {
            result += ` ${hours} ${hours === 1 ? 'hour' : 'hours'}`;
        }
        
        if (minutes > 0 && hours === 0) {
            result += ` ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
        }
        
        return result;
    }
}

// Calculate roulette time
function calculateRouletteTime() {
    const lang = getCurrentAppLanguage();
    const texts = rouletteTexts[lang] || rouletteTexts['en'] || {};
    
    const totalSpinsInput = document.getElementById('totalSpinsInput');
    const spinsPerTurnInput = document.getElementById('spinsPerTurnInput');
    const resultValue = document.getElementById('rouletteResultValue');
    const resultDetails = document.getElementById('rouletteResultDetails');
    const errorMessage = document.getElementById('rouletteErrorMessage');
    const resultSection = document.getElementById('rouletteResultSection');
    
    // Clear previous messages
    if (errorMessage) errorMessage.textContent = '';
    if (resultValue) resultValue.textContent = '0';
    if (resultDetails) resultDetails.textContent = '';
    
    // Get input values
    const totalSpins = parseFloat(totalSpinsInput?.value || 0);
    const spinsPerTurn = parseFloat(spinsPerTurnInput?.value || 0);
    
    // Validation
    if (!totalSpins || !spinsPerTurn) {
        if (errorMessage) errorMessage.textContent = texts.errorEmpty || 'Please enter both values';
        return;
    }
    
    if (totalSpins <= 0 || spinsPerTurn <= 0 || isNaN(totalSpins) || isNaN(spinsPerTurn)) {
        if (errorMessage) errorMessage.textContent = texts.errorInvalid || 'Please enter valid positive numbers';
        return;
    }
    
    if (spinsPerTurn === 0) {
        if (errorMessage) errorMessage.textContent = texts.errorZero || 'Spins per turn cannot be zero';
        return;
    }
    
    // Calculate time: (total spins / spins per turn) * 6 seconds
    const totalTurns = totalSpins / spinsPerTurn;
    const totalSeconds = totalTurns * 6;
    
    // Format and display result
    const formattedTime = formatTime(totalSeconds);
    
    if (resultValue) {
        resultValue.textContent = formattedTime;
        
        // Add animation class
        if (resultSection) {
            resultSection.classList.remove('show-result');
            setTimeout(() => {
                resultSection.classList.add('show-result');
            }, 50);
        }
    }
    
    if (resultDetails) {
        const turns = Math.ceil(totalTurns);
        resultDetails.textContent = `${totalSpins.toLocaleString()} ${texts.totalSpinsText || 'total spins'} ÷ ${spinsPerTurn.toLocaleString()} ${texts.spinsPerTurnText || 'per turn'} = ${turns.toLocaleString()} turns × 6s`;
    }
    
    console.log(`🎰 Calculated: ${totalSpins} spins ÷ ${spinsPerTurn} per turn = ${totalTurns} turns = ${totalSeconds}s = ${formattedTime}`);
}

// Initialize Roulette calculator
function initializeRoulette() {
    if (rouletteInitialized) {
        console.log('⚠️ Roulette already initialized');
        return;
    }
    
    console.log('🎰 Initializing Roulette Calculator...');
    
    // Load language data first
    loadRouletteLanguage().then(() => {
        // Update language for current setting
        updateRouletteLanguage();
        
        // Add event listeners
        const totalSpinsInput = document.getElementById('totalSpinsInput');
        const spinsPerTurnInput = document.getElementById('spinsPerTurnInput');
        const calculateBtn = document.querySelector('#roulettePage .calculate-btn');
        
        if (totalSpinsInput) {
            totalSpinsInput.addEventListener('input', calculateRouletteTime);
            totalSpinsInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') calculateRouletteTime();
            });
        }
        
        if (spinsPerTurnInput) {
            spinsPerTurnInput.addEventListener('input', calculateRouletteTime);
            spinsPerTurnInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') calculateRouletteTime();
            });
        }
        
        if (calculateBtn) {
            calculateBtn.addEventListener('click', calculateRouletteTime);
        }
        
        // Listen for language changes
        document.addEventListener('languageChanged', (event) => {
            updateRouletteLanguage(event.detail.language);
        });
        
        rouletteInitialized = true;
        console.log('✅ Roulette Calculator initialized');
    });
}

// Global functions
window.initializeRoulette = initializeRoulette;
window.calculateRouletteTime = calculateRouletteTime;
window.updateRouletteLanguage = updateRouletteLanguage;
