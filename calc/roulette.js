// Roulette Calculator Module - Mining Style with Short Time Units
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
        // Set empty fallback - will use default browser text
        rouletteTexts = {};
    }
}

// Update language with improved element selection
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
    
    // Update page title with improved selector
    const titleSelectors = [
        '#roulettePage .header-controls h1',
        '#roulettePage h1',
        '.roulette-page .header-controls h1',
        '.roulette-page h1'
    ];
    
    for (const selector of titleSelectors) {
        const title = document.querySelector(selector);
        if (title) {
            title.textContent = texts.title;
            console.log(`✅ Updated roulette title: ${texts.title}`);
            break;
        }
    }
    
    // Update input labels with multiple selector attempts
    const totalSpinsLabelSelectors = [
        '#roulettePage .input-group:first-child .input-label',
        '#roulettePage .input-section .input-group:first-child label',
        '.roulette-page .input-group:first-child .input-label'
    ];
    
    for (const selector of totalSpinsLabelSelectors) {
        const label = document.querySelector(selector);
        if (label) {
            label.textContent = texts.totalSpins;
            console.log('✅ Updated total spins label');
            break;
        }
    }
    
    const spinsPerTurnLabelSelectors = [
        '#roulettePage .input-group:last-of-type .input-label',
        '#roulettePage .input-section .input-group:last-of-type label',
        '.roulette-page .input-group:last-of-type .input-label'
    ];
    
    for (const selector of spinsPerTurnLabelSelectors) {
        const label = document.querySelector(selector);
        if (label) {
            label.textContent = texts.spinsPerTurn;
            console.log('✅ Updated spins per turn label');
            break;
        }
    }
    
    // Update input placeholders
    const totalSpinsInput = document.getElementById('totalSpinsInput');
    if (totalSpinsInput) {
        totalSpinsInput.placeholder = texts.placeholderTotal;
        console.log('✅ Updated total spins placeholder');
    }
    
    const spinsPerTurnInput = document.getElementById('spinsPerTurnInput');
    if (spinsPerTurnInput) {
        spinsPerTurnInput.placeholder = texts.placeholderPerTurn;
        console.log('✅ Updated spins per turn placeholder');
    }
    
    // Update calculate button
    const calculateBtnSelectors = [
        '#roulettePage .calculate-btn',
        '.roulette-page .calculate-btn'
    ];
    
    for (const selector of calculateBtnSelectors) {
        const btn = document.querySelector(selector);
        if (btn) {
            btn.textContent = texts.calculate;
            console.log('✅ Updated calculate button');
            break;
        }
    }
    
    // Update result label
    const resultLabelSelectors = [
        '#roulettePage .stats-label',
        '.roulette-page .stats-label'
    ];
    
    for (const selector of resultLabelSelectors) {
        const label = document.querySelector(selector);
        if (label) {
            label.textContent = texts.result;
            console.log('✅ Updated result label');
            break;
        }
    }
    
    console.log(`✅ Roulette language updated to: ${lang}`);
}

// Enhanced time formatting with short units and language support
function formatTime(seconds) {
    const lang = getCurrentAppLanguage();
    const texts = rouletteTexts[lang] || rouletteTexts['en'] || {};
    
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
    const lang = getCurrentAppLanguage();
    const texts = rouletteTexts[lang] || rouletteTexts['en'] || {};
    
    const totalSpinsInput = document.getElementById('totalSpinsInput');
    const spinsPerTurnInput = document.getElementById('spinsPerTurnInput');
    const resultValue = document.getElementById('rouletteResultValue');
    const resultDetails = document.getElementById('rouletteResultDetails');
    const errorMessage = document.getElementById('rouletteErrorMessage');
    const resultSection = document.getElementById('rouletteResultSection');
    
    // Clear previous messages
    if (errorMessage) {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    }
    if (resultValue) resultValue.textContent = '0';
    if (resultDetails) resultDetails.textContent = '';
    
    // Get input values
    const totalSpins = parseFloat(totalSpinsInput?.value || 0);
    const spinsPerTurn = parseFloat(spinsPerTurnInput?.value || 0);
    
    // Enhanced validation
    if (!totalSpinsInput?.value?.trim() || !spinsPerTurnInput?.value?.trim()) {
        if (errorMessage) {
            errorMessage.textContent = texts.errorEmpty || 'Please enter both values';
            errorMessage.style.display = 'block';
        }
        return;
    }
    
    if (totalSpins <= 0 || spinsPerTurn <= 0 || isNaN(totalSpins) || isNaN(spinsPerTurn)) {
        if (errorMessage) {
            errorMessage.textContent = texts.errorInvalid || 'Please enter valid positive numbers';
            errorMessage.style.display = 'block';
        }
        return;
    }
    
    if (spinsPerTurn === 0) {
        if (errorMessage) {
            errorMessage.textContent = texts.errorZero || 'Spins per turn cannot be zero';
            errorMessage.style.display = 'block';
        }
        return;
    }
    
    // Calculate time: (total spins / spins per turn) * 6 seconds
    const totalTurns = totalSpins / spinsPerTurn;
    const totalSeconds = totalTurns * 6;
    
    // Format and display result
    const formattedTime = formatTime(totalSeconds);
    
    if (resultValue) {
        resultValue.textContent = formattedTime;
        
        // Add animation class with improved timing
        if (resultSection) {
            resultSection.classList.remove('show-result');
            // Use requestAnimationFrame for smoother animation
            requestAnimationFrame(() => {
                setTimeout(() => {
                    resultSection.classList.add('show-result');
                }, 50);
            });
        }
    }
    
    // Clear result details - show only the time result
    if (resultDetails) {
        resultDetails.textContent = '';
    }
    
    console.log(`🎰 Calculated: ${totalSpins} spins ÷ ${spinsPerTurn} per turn = ${totalTurns} turns = ${totalSeconds}s = ${formattedTime}`);
}

// Enhanced initialization with better error handling
function initializeRoulette() {
    if (rouletteInitialized) {
        console.log('⚠️ Roulette already initialized');
        return;
    }
    
    console.log('🎰 Initializing Roulette Calculator...');
    
    // Check if roulette page exists
    const roulettePage = document.getElementById('roulettePage') || document.querySelector('.roulette-page');
    if (!roulettePage) {
        console.warn('⚠️ Roulette page not found in DOM');
        // Retry after a delay
        setTimeout(() => {
            if (!rouletteInitialized) {
                initializeRoulette();
            }
        }, 1000);
        return;
    }
    
    // Load language data first
    loadRouletteLanguage().then(() => {
        // Update language for current setting
        updateRouletteLanguage();
        
        // Add event listeners with improved error handling
        const totalSpinsInput = document.getElementById('totalSpinsInput');
        const spinsPerTurnInput = document.getElementById('spinsPerTurnInput');
        const calculateBtn = document.querySelector('#roulettePage .calculate-btn') || 
                            document.querySelector('.roulette-page .calculate-btn');
        
        if (totalSpinsInput) {
            // Remove existing listeners to prevent duplicates
            totalSpinsInput.removeEventListener('input', calculateRouletteTime);
            totalSpinsInput.removeEventListener('keypress', handleEnterKey);
            
            totalSpinsInput.addEventListener('input', calculateRouletteTime);
            totalSpinsInput.addEventListener('keypress', handleEnterKey);
            console.log('✅ Total spins input events bound');
        } else {
            console.warn('⚠️ Total spins input not found');
        }
        
        if (spinsPerTurnInput) {
            // Remove existing listeners to prevent duplicates
            spinsPerTurnInput.removeEventListener('input', calculateRouletteTime);
            spinsPerTurnInput.removeEventListener('keypress', handleEnterKey);
            
            spinsPerTurnInput.addEventListener('input', calculateRouletteTime);
            spinsPerTurnInput.addEventListener('keypress', handleEnterKey);
            console.log('✅ Spins per turn input events bound');
        } else {
            console.warn('⚠️ Spins per turn input not found');
        }
        
        if (calculateBtn) {
            // Remove existing listener to prevent duplicates
            calculateBtn.removeEventListener('click', calculateRouletteTime);
            calculateBtn.addEventListener('click', calculateRouletteTime);
            console.log('✅ Calculate button events bound');
        } else {
            console.warn('⚠️ Calculate button not found');
        }
        
        // Listen for language changes with improved handling
        document.removeEventListener('languageChanged', handleLanguageChange);
        document.addEventListener('languageChanged', handleLanguageChange);
        
        rouletteInitialized = true;
        console.log('✅ Roulette Calculator initialized successfully');
    }).catch(error => {
        console.error('❌ Failed to initialize roulette:', error);
        rouletteInitialized = false;
    });
}

// Helper function for Enter key handling
function handleEnterKey(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        calculateRouletteTime();
    }
}

// Helper function for language change handling
function handleLanguageChange(event) {
    console.log('🌍 Roulette received language change:', event.detail.language);
    updateRouletteLanguage(event.detail.language);
}

// Force reinitialization function
function forceReinitializeRoulette() {
    console.log('🔄 Force reinitializing Roulette...');
    rouletteInitialized = false;
    setTimeout(() => {
        initializeRoulette();
    }, 100);
}

// Global functions - Enhanced with better error handling
window.initializeRoulette = initializeRoulette;
window.calculateRouletteTime = calculateRouletteTime;
window.updateRouletteLanguage = updateRouletteLanguage;
window.forceReinitializeRoulette = forceReinitializeRoulette;

// Debug function
window.debugRoulette = function() {
    console.log('=== ROULETTE DEBUG INFO ===');
    console.log('Initialized:', rouletteInitialized);
    console.log('Page exists:', !!document.getElementById('roulettePage'));
    console.log('Current language:', getCurrentAppLanguage());
    console.log('Texts loaded:', Object.keys(rouletteTexts));
    console.log('Total spins input:', !!document.getElementById('totalSpinsInput'));
    console.log('Spins per turn input:', !!document.getElementById('spinsPerTurnInput'));
    console.log('Calculate button:', !!document.querySelector('.calculate-btn'));
    console.log('============================');
};

console.log('✅ Enhanced Roulette Calculator module loaded with mining theme')
