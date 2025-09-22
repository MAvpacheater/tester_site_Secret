// Pet Stats Calculator functionality - FIXED SETTINGS PANEL

// Global variables for translations
let calcTranslations = null;
let currentCalcLanguage = 'en';

// Load calculator translations
async function loadCalcTranslations() {
    if (calcTranslations) return calcTranslations;
    
    try {
        console.log('📥 Loading calculator translations...');
        const response = await fetch('languages/calc.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        calcTranslations = await response.json();
        console.log('✅ Calculator translations loaded successfully');
        return calcTranslations;
    } catch (error) {
        console.error('❌ Error loading calculator translations:', error);
        // Fallback to English
        calcTranslations = {
            en: {
                common: { calculate: "Calculate", settings: "Settings", back: "← Back" },
                calculator: {
                    inputLabel: "Enter Pet Stats:",
                    inputPlaceholder: "Enter your pet's base stats...",
                    resultLabel: "Final Pet Stats:",
                    errorInvalidNumber: "Please enter a valid number",
                    categories: {
                        slimes: "Slimes",
                        mutation: "Mutation", 
                        evolution: "Evolution and Size",
                        type: "Type"
                    },
                    modifiers: {
                        shiny: "Shiny",
                        maxlvl: "Max lvl"
                    }
                }
            }
        };
        return calcTranslations;
    }
}

// Update calculator language
async function updateCalculatorLanguage(lang) {
    if (!calcTranslations) {
        await loadCalcTranslations();
    }
    
    currentCalcLanguage = lang;
    
    if (!calcTranslations[lang]) {
        console.error(`❌ Calculator language ${lang} not found, defaulting to English`);
        currentCalcLanguage = 'en';
    }
    
    const translations = calcTranslations[currentCalcLanguage];
    if (!translations) return;
    
    // Update calculator input elements
    const inputLabel = document.querySelector('#calculatorPage .input-label');
    const inputField = document.getElementById('numberInput');
    const calculateBtn = document.querySelector('#calculatorPage .calculate-btn');
    const resultLabel = document.querySelector('#calculatorPage .stats-label');
    const settingsTitle = document.querySelector('#settingsPanel .settings-title');
    
    if (inputLabel && translations.calculator.inputLabel) {
        inputLabel.textContent = translations.calculator.inputLabel;
    }
    
    if (inputField && translations.calculator.inputPlaceholder) {
        inputField.placeholder = translations.calculator.inputPlaceholder;
    }
    
    if (calculateBtn && translations.common.calculate) {
        calculateBtn.textContent = translations.common.calculate;
    }
    
    if (resultLabel && translations.calculator.resultLabel) {
        resultLabel.textContent = translations.calculator.resultLabel;
    }
    
    if (settingsTitle && translations.common.settings) {
        settingsTitle.textContent = translations.common.settings;
    }
    
    // Update settings panel HTML with translations
    createSettingsHTML();
    
    console.log(`✅ Calculator language updated to: ${currentCalcLanguage}`);
}

// Pet modifiers data
const petModifiers = {
    // Slimes (тільки один активний)
    slime_shock: 3.15,
    slime_neowave: 3.0,
    slime_christmas: 2.85,
    slime_orange: 2.7,
    slime_green: 2.55,
    slime_black: 2.4,
    slime_red: 2.25,
    slime_purple: 1.65,
    slime_blue: 1.4,
    slime_yellow: 1.2,
    
    // Mutations (тільки один активний)
    mutation_cosmic: 2.5,
    mutation_ghost: 2.0,
    mutation_rainbow: 1.35,
    mutation_glowing: 1.2,
    
    // Evolution/Size (тільки один активний)
    evolution_goliath: 2.5,
    evolution_huge: 2.0,
    evolution_big: 1.5,
    
    // Type (тільки один активний)
    type_pristine: 2.17,
    type_void: 2.0,
    type_golden: 1.5,
    
    // Simple modifiers (незалежні)
    shiny: 1.15,
    maxlvl: 2.2388
};

let petMultiplier = 1;
let currentSettingsView = 'main'; // 'main', 'slimes', 'mutation', 'evolution', 'type'

// Create dynamic settings HTML
function createSettingsHTML() {
    const translations = calcTranslations && calcTranslations[currentCalcLanguage];
    if (!translations) return;
    
    const panel = document.getElementById('settingsPanel');
    if (!panel) return;
    
    let html = '';
    
    if (currentSettingsView === 'main') {
        // Main settings view
        html = `
            <div class="settings-title">${translations.common.settings}</div>
            
            <!-- Category Buttons -->
            <button class="category-button" onclick="showSettingsCategory('slimes')">
                <div class="category-button-content">
                    <div class="category-name">${translations.calculator.categories.slimes}</div>
                    <div class="category-selected" id="slimesSelected">Shock Slime (x3.15)</div>
                </div>
                <div class="category-arrow">></div>
            </button>
            
            <button class="category-button" onclick="showSettingsCategory('mutation')">
                <div class="category-button-content">
                    <div class="category-name">${translations.calculator.categories.mutation}</div>
                    <div class="category-selected" id="mutationSelected">Cosmic (x2.5)</div>
                </div>
                <div class="category-arrow">></div>
            </button>
            
            <button class="category-button" onclick="showSettingsCategory('evolution')">
                <div class="category-button-content">
                    <div class="category-name">${translations.calculator.categories.evolution}</div>
                    <div class="category-selected" id="evolutionSelected">Goliath (x2.5)</div>
                </div>
                <div class="category-arrow">></div>
            </button>
            
            <button class="category-button" onclick="showSettingsCategory('type')">
                <div class="category-button-content">
                    <div class="category-name">${translations.calculator.categories.type}</div>
                    <div class="category-selected" id="typeSelected">Pristine (x2.17)</div>
                </div>
                <div class="category-arrow">></div>
            </button>
            
            <!-- Simple Modifiers -->
            <div class="simple-modifier">
                <div class="simple-modifier-label">
                    <span>${translations.calculator.modifiers.shiny}</span>
                    <span class="modifier-multiplier">(x1.15)</span>
                </div>
                <label class="switch">
                    <input type="checkbox" id="shiny" checked onchange="updatePetMultiplier()">
                    <span class="slider"></span>
                </label>
            </div>
            
            <div class="simple-modifier">
                <div class="simple-modifier-label">
                    <span>${translations.calculator.modifiers.maxlvl}</span>
                    <span class="modifier-multiplier">(x2.24)</span>
                </div>
                <label class="switch">
                    <input type="checkbox" id="maxlvl" checked onchange="updatePetMultiplier()">
                    <span class="slider"></span>
                </label>
            </div>
        `;
    } else {
        // Category-specific view
        const categoryData = getCategoryData(currentSettingsView);
        html = `
            <div class="settings-header">
                <button class="back-btn" onclick="showSettingsCategory('main')">${translations.common.back}</button>
                <div class="settings-title">${categoryData.title}</div>
            </div>
        `;
        
        categoryData.items.forEach(item => {
            const isChecked = getModifierState(item.id);
            html += `
                <div class="modifier-item">
                    <div class="modifier-label">
                        <span>${item.name}</span>
                        <span class="modifier-multiplier">(x${item.multiplier})</span>
                    </div>
                    <label class="category-switch">
                        <input type="checkbox" id="${item.id}" ${isChecked ? 'checked' : ''} onchange="${item.handler}">
                        <span class="category-slider"></span>
                    </label>
                </div>
            `;
        });
    }
    
    panel.innerHTML = html;
}

// Get category data for settings
function getCategoryData(category) {
    const translations = calcTranslations && calcTranslations[currentCalcLanguage];
    
    switch(category) {
        case 'slimes':
            return {
                title: translations?.calculator.categories.slimes || 'Slimes',
                items: [
                    { id: 'slime_shock', name: 'Shock Slime', multiplier: '3.15', handler: 'handleSlimeSelection("slime_shock")' },
                    { id: 'slime_neowave', name: 'Neowave Slime', multiplier: '3.0', handler: 'handleSlimeSelection("slime_neowave")' },
                    { id: 'slime_christmas', name: 'Christmas Slime', multiplier: '2.85', handler: 'handleSlimeSelection("slime_christmas")' },
                    { id: 'slime_orange', name: 'Orange Slime', multiplier: '2.7', handler: 'handleSlimeSelection("slime_orange")' },
                    { id: 'slime_green', name: 'Green Slime', multiplier: '2.55', handler: 'handleSlimeSelection("slime_green")' },
                    { id: 'slime_black', name: 'Black Slime', multiplier: '2.4', handler: 'handleSlimeSelection("slime_black")' },
                    { id: 'slime_red', name: 'Red Slime', multiplier: '2.25', handler: 'handleSlimeSelection("slime_red")' },
                    { id: 'slime_purple', name: 'Purple Slime', multiplier: '1.65', handler: 'handleSlimeSelection("slime_purple")' },
                    { id: 'slime_blue', name: 'Blue Slime', multiplier: '1.4', handler: 'handleSlimeSelection("slime_blue")' },
                    { id: 'slime_yellow', name: 'Yellow Slime', multiplier: '1.2', handler: 'handleSlimeSelection("slime_yellow")' }
                ]
            };
        case 'mutation':
            return {
                title: translations?.calculator.categories.mutation || 'Mutation',
                items: [
                    { id: 'mutation_cosmic', name: 'Cosmic', multiplier: '2.5', handler: 'handleMutationSelection("mutation_cosmic")' },
                    { id: 'mutation_ghost', name: 'Ghost', multiplier: '2.0', handler: 'handleMutationSelection("mutation_ghost")' },
                    { id: 'mutation_rainbow', name: 'Rainbow', multiplier: '1.35', handler: 'handleMutationSelection("mutation_rainbow")' },
                    { id: 'mutation_glowing', name: 'Glowing', multiplier: '1.2', handler: 'handleMutationSelection("mutation_glowing")' }
                ]
            };
        case 'evolution':
            return {
                title: translations?.calculator.categories.evolution || 'Evolution and Size',
                items: [
                    { id: 'evolution_goliath', name: 'Goliath', multiplier: '2.5', handler: 'handleEvolutionSelection("evolution_goliath")' },
                    { id: 'evolution_huge', name: 'Huge', multiplier: '2.0', handler: 'handleEvolutionSelection("evolution_huge")' },
                    { id: 'evolution_big', name: 'Big', multiplier: '1.5', handler: 'handleEvolutionSelection("evolution_big")' }
                ]
            };
        case 'type':
            return {
                title: translations?.calculator.categories.type || 'Type',
                items: [
                    { id: 'type_pristine', name: 'Pristine', multiplier: '2.17', handler: 'handleTypeSelection("type_pristine")' },
                    { id: 'type_void', name: 'Void', multiplier: '2.0', handler: 'handleTypeSelection("type_void")' },
                    { id: 'type_golden', name: 'Golden', multiplier: '1.5', handler: 'handleTypeSelection("type_golden")' }
                ]
            };
        default:
            return { title: 'Unknown', items: [] };
    }
}

// Show settings category
function showSettingsCategory(category) {
    currentSettingsView = category;
    createSettingsHTML();
    updateSelectedLabels();
}

// Get modifier state
function getModifierState(id) {
    // Default selections
    const defaultSelections = {
        'slime_shock': true,
        'mutation_cosmic': true,
        'evolution_goliath': true,
        'type_pristine': true,
        'shiny': true,
        'maxlvl': true
    };
    
    const element = document.getElementById(id);
    return element ? element.checked : (defaultSelections[id] || false);
}

// Update selected labels in main view
function updateSelectedLabels() {
    // Find selected slime
    const slimeIds = ['slime_shock', 'slime_neowave', 'slime_christmas', 'slime_orange', 'slime_green', 'slime_black', 'slime_red', 'slime_purple', 'slime_blue', 'slime_yellow'];
    const selectedSlime = slimeIds.find(id => getModifierState(id));
    const slimeLabel = document.getElementById('slimesSelected');
    if (slimeLabel && selectedSlime) {
        const slimeName = selectedSlime.replace('slime_', '').replace('_', ' ');
        slimeLabel.textContent = `${slimeName.charAt(0).toUpperCase() + slimeName.slice(1)} (x${petModifiers[selectedSlime]})`;
    }
    
    // Find selected mutation
    const mutationIds = ['mutation_cosmic', 'mutation_ghost', 'mutation_rainbow', 'mutation_glowing'];
    const selectedMutation = mutationIds.find(id => getModifierState(id));
    const mutationLabel = document.getElementById('mutationSelected');
    if (mutationLabel && selectedMutation) {
        const mutationName = selectedMutation.replace('mutation_', '');
        mutationLabel.textContent = `${mutationName.charAt(0).toUpperCase() + mutationName.slice(1)} (x${petModifiers[selectedMutation]})`;
    }
    
    // Find selected evolution
    const evolutionIds = ['evolution_goliath', 'evolution_huge', 'evolution_big'];
    const selectedEvolution = evolutionIds.find(id => getModifierState(id));
    const evolutionLabel = document.getElementById('evolutionSelected');
    if (evolutionLabel && selectedEvolution) {
        const evolutionName = selectedEvolution.replace('evolution_', '');
        evolutionLabel.textContent = `${evolutionName.charAt(0).toUpperCase() + evolutionName.slice(1)} (x${petModifiers[selectedEvolution]})`;
    }
    
    // Find selected type
    const typeIds = ['type_pristine', 'type_void', 'type_golden'];
    const selectedType = typeIds.find(id => getModifierState(id));
    const typeLabel = document.getElementById('typeSelected');
    if (typeLabel && selectedType) {
        const typeName = selectedType.replace('type_', '');
        typeLabel.textContent = `${typeName.charAt(0).toUpperCase() + typeName.slice(1)} (x${petModifiers[selectedType]})`;
    }
}

// ВИПРАВЛЕНА функція показу/приховування налаштувань
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    if (!panel) {
        console.error('❌ Settings panel not found');
        return;
    }
    
    console.log('🔧 Toggling settings panel...');
    
    // Force show/hide with maximum specificity
    if (panel.classList.contains('show')) {
        panel.classList.remove('show');
        panel.style.display = 'none';
        console.log('🔒 Settings panel closed');
    } else {
        // Make sure we have the HTML content
        if (!panel.innerHTML.trim()) {
            createSettingsHTML();
        }
        
        panel.classList.add('show');
        panel.style.display = 'block';
        panel.style.visibility = 'visible';
        panel.style.opacity = '1';
        
        // Prevent closing from general.js for a short time
        panel.dataset.justOpened = 'true';
        setTimeout(() => {
            delete panel.dataset.justOpened;
        }, 100);
        
        console.log('✅ Settings panel opened');
    }
    
    // Update selected labels if showing main view
    if (currentSettingsView === 'main') {
        setTimeout(() => {
            updateSelectedLabels();
        }, 50);
    }
}

// Selection handlers
function handleSlimeSelection(selectedId) {
    const slimeIds = ['slime_shock', 'slime_neowave', 'slime_christmas', 'slime_orange', 'slime_green', 'slime_black', 'slime_red', 'slime_purple', 'slime_blue', 'slime_yellow'];
    
    slimeIds.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = (id === selectedId);
        }
    });
    
    updatePetMultiplier();
    updateSelectedLabels();
}

function handleMutationSelection(selectedId) {
    const mutationIds = ['mutation_cosmic', 'mutation_ghost', 'mutation_rainbow', 'mutation_glowing'];
    
    mutationIds.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = (id === selectedId);
        }
    });
    
    updatePetMultiplier();
    updateSelectedLabels();
}

function handleEvolutionSelection(selectedId) {
    const evolutionIds = ['evolution_goliath', 'evolution_huge', 'evolution_big'];
    
    evolutionIds.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = (id === selectedId);
        }
    });
    
    updatePetMultiplier();
    updateSelectedLabels();
}

function handleTypeSelection(selectedId) {
    const typeIds = ['type_pristine', 'type_void', 'type_golden'];
    
    typeIds.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = (id === selectedId);
        }
    });
    
    updatePetMultiplier();
    updateSelectedLabels();
}

// Update multiplier
function updatePetMultiplier() {
    petMultiplier = 1;
    
    for (const id in petModifiers) {
        if (getModifierState(id)) {
            petMultiplier *= petModifiers[id];
        }
    }
    
    console.log('Pet multiplier updated to:', petMultiplier);
    calculateStats();
}

// Calculate stats
function calculateStats() {
    const input = document.getElementById('numberInput');
    const resultSection = document.getElementById('resultSection');
    const resultValue = document.getElementById('resultValue');
    const errorMessage = document.getElementById('errorMessage');

    if (!input || !resultSection || !resultValue || !errorMessage) return;

    errorMessage.textContent = '';

    const baseValue = parseFloat(input.value);

    if (isNaN(baseValue) || input.value.trim() === '') {
        if (input.value.trim() !== '') {
            const translations = calcTranslations && calcTranslations[currentCalcLanguage];
            const errorText = (translations && translations.calculator.errorInvalidNumber) 
                || 'Please enter a valid number';
            errorMessage.textContent = errorText;
        }
        resultSection.classList.remove('show');
        return;
    }

    const finalValue = baseValue * petMultiplier;
    
    console.log(`Calculating: ${baseValue} * ${petMultiplier} = ${finalValue}`);

    resultValue.textContent = finalValue.toLocaleString('uk-UA', {
        minimumFractionDigits: finalValue % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 8
    });

    resultSection.classList.add('show');
}

// Initialize calculator
async function initializeCalculator() {
    console.log('🚀 Initializing pet calculator with multilingual support...');
    
    const calculatorPage = document.getElementById('calculatorPage');
    if (!calculatorPage) {
        console.error('❌ Calculator page not found');
        return;
    }
    
    // Load translations
    await loadCalcTranslations();
    
    // Get current app language
    const currentAppLanguage = (typeof getCurrentAppLanguage === 'function') 
        ? getCurrentAppLanguage() 
        : 'en';
    
    // Update calculator language
    await updateCalculatorLanguage(currentAppLanguage);
    
    // Initialize with default values
    currentSettingsView = 'main';
    createSettingsHTML();
    
    // Set default selections
    setTimeout(() => {
        ['slime_shock', 'mutation_cosmic', 'evolution_goliath', 'type_pristine', 'shiny', 'maxlvl'].forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        updatePetMultiplier();
        updateSelectedLabels();
    }, 100);
    
    // Add event listeners
    const numberInput = document.getElementById('numberInput');
    if (numberInput) {
        numberInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                calculateStats();
            }
        });

        numberInput.addEventListener('input', () => {
            const errorMessage = document.getElementById('errorMessage');
            if (errorMessage) errorMessage.textContent = '';
        });
    }
    
    console.log('✅ Pet calculator initialized with multilingual support');
}

// Listen for language change events
document.addEventListener('languageChanged', async (event) => {
    const newLanguage = event.detail.language;
    console.log('🌍 Calculator received language change:', newLanguage);
    await updateCalculatorLanguage(newLanguage);
});

// Make functions globally available
window.updateCalculatorLanguage = updateCalculatorLanguage;
window.loadCalcTranslations = loadCalcTranslations;
window.toggleSettings = toggleSettings;
window.showSettingsCategory = showSettingsCategory;
window.handleSlimeSelection = handleSlimeSelection;
window.handleMutationSelection = handleMutationSelection;
window.handleEvolutionSelection = handleEvolutionSelection;
window.handleTypeSelection = handleTypeSelection;
window.updatePetMultiplier = updatePetMultiplier;
window.calculateStats = calculateStats;
window.initializeCalculator = initializeCalculator;
