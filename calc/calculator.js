// Pet Stats Calculator functionality - FIXED VERSION with Working Modal Selection

// Global variables for translations
let calcTranslations = null;
let currentCalcLanguage = 'en';

// Current selected options
let selectedSlime = 'slime_shock';
let selectedMutation = 'mutation_cosmic';
let selectedEvolution = 'evolution_goliath';
let selectedType = 'type_pristine';

// Global callback reference
let currentModalCallback = null;

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
                common: { calculate: "Calculate", settings: "Settings" },
                calculator: {
                    inputLabel: "Enter Pet Stats:",
                    inputPlaceholder: "Enter your pet's base stats...",
                    resultLabel: "Final Pet Stats:",
                    errorInvalidNumber: "Please enter a valid number"
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
    if (!translations || !translations.calculator) return;
    
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
    
    console.log(`✅ Calculator language updated to: ${currentCalcLanguage}`);
}

// Pet modifiers
const petModifiers = {
    // Slimes
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
    
    // Mutations
    mutation_cosmic: 2.5,
    mutation_ghost: 2.0,
    mutation_rainbow: 1.35,
    mutation_glowing: 1.2,
    
    // Evolution/Size
    evolution_goliath: 2.5,
    evolution_huge: 2.0,
    evolution_big: 1.5,
    
    // Type
    type_pristine: 2.17,
    type_void: 2.0,
    type_golden: 1.5,
    
    // Simple modifiers
    shiny: 1.15,
    maxlvl: 2.2388
};

// Options with display names - sorted from worst to best multipliers
const slimeOptions = {
    slime_yellow: { name: "Yellow", multiplier: "1.2x" },
    slime_blue: { name: "Blue", multiplier: "1.4x" },
    slime_purple: { name: "Purple", multiplier: "1.65x" },
    slime_red: { name: "Red", multiplier: "2.25x" },
    slime_black: { name: "Black", multiplier: "2.4x" },
    slime_green: { name: "Green", multiplier: "2.55x" },
    slime_orange: { name: "Orange", multiplier: "2.7x" },
    slime_christmas: { name: "Christmas", multiplier: "2.85x" },
    slime_neowave: { name: "Neowave", multiplier: "3.0x" },
    slime_shock: { name: "Shock", multiplier: "3.15x" }
};

const mutationOptions = {
    mutation_glowing: { name: "Glowing", multiplier: "1.2x" },
    mutation_rainbow: { name: "Rainbow", multiplier: "1.35x" },
    mutation_ghost: { name: "Ghost", multiplier: "2.0x" },
    mutation_cosmic: { name: "Cosmic", multiplier: "2.5x" }
};

const evolutionOptions = {
    evolution_big: { name: "Big", multiplier: "1.5x" },
    evolution_huge: { name: "Huge", multiplier: "2.0x" },
    evolution_goliath: { name: "Goliath", multiplier: "2.5x" }
};

const typeOptions = {
    type_golden: { name: "Golden", multiplier: "1.5x" },
    type_void: { name: "Void", multiplier: "2.0x" },
    type_pristine: { name: "Pristine", multiplier: "2.17x" }
};

let petMultiplier = 1;

// Show/hide settings
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    if (panel) {
        panel.classList.toggle('show');
    }
}

// Fixed Modal functions
function createModal(title, options, currentSelected, onSelect) {
    // Remove existing modal if any
    const existingModal = document.getElementById('categoryModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Store callback globally
    currentModalCallback = onSelect;

    // Create modal
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'categoryModal';
    modalOverlay.className = 'modal-overlay';
    
    modalOverlay.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                ${Object.entries(options).map(([id, data]) => `
                    <div class="option-item ${currentSelected === id ? 'selected' : ''}" 
                         onclick="selectOption('${id}', '${data.name}')">
                        <span class="option-name">${data.name}</span>
                        <span class="option-multiplier">${data.multiplier}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Add to page
    const calculatorPage = document.getElementById('calculatorPage');
    calculatorPage.appendChild(modalOverlay);
    
    // Show modal
    setTimeout(() => modalOverlay.classList.add('show'), 10);
    
    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('categoryModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
    currentModalCallback = null;
}

// Fixed selectOption function
function selectOption(optionId, optionName) {
    if (currentModalCallback) {
        currentModalCallback(optionId, optionName);
    }
    closeModal();
}

// Category opening functions with modals
function openSlimeSettings() {
    createModal('Select Slime Type', slimeOptions, selectedSlime, (slimeId, slimeName) => {
        selectSlime(slimeId);
    });
}

function openMutationSettings() {
    createModal('Select Mutation', mutationOptions, selectedMutation, (mutationId, mutationName) => {
        selectMutation(mutationId);
    });
}

function openEvolutionSettings() {
    createModal('Select Evolution/Size', evolutionOptions, selectedEvolution, (evolutionId, evolutionName) => {
        selectEvolution(evolutionId);
    });
}

function openTypeSettings() {
    createModal('Select Type', typeOptions, selectedType, (typeId, typeName) => {
        selectType(typeId);
    });
}

// Selection functions
function selectSlime(slimeId) {
    selectedSlime = slimeId;
    updateCategoryDisplay('slime', slimeOptions[slimeId].name);
    updatePetMultiplier();
    console.log('Selected slime:', slimeId, slimeOptions[slimeId].name);
}

function selectMutation(mutationId) {
    selectedMutation = mutationId;
    updateCategoryDisplay('mutation', mutationOptions[mutationId].name);
    updatePetMultiplier();
    console.log('Selected mutation:', mutationId, mutationOptions[mutationId].name);
}

function selectEvolution(evolutionId) {
    selectedEvolution = evolutionId;
    updateCategoryDisplay('evolution', evolutionOptions[evolutionId].name);
    updatePetMultiplier();
    console.log('Selected evolution:', evolutionId, evolutionOptions[evolutionId].name);
}

function selectType(typeId) {
    selectedType = typeId;
    updateCategoryDisplay('type', typeOptions[typeId].name);
    updatePetMultiplier();
    console.log('Selected type:', typeId, typeOptions[typeId].name);
}

// Update category display
function updateCategoryDisplay(category, selectedName) {
    const categoryButtons = document.querySelectorAll('.category-button');
    categoryButtons.forEach(button => {
        const label = button.querySelector('.category-label');
        if (!label) return;
        
        const labelText = label.textContent.toLowerCase();
        
        let shouldUpdate = false;
        if (category === 'slime' && labelText.includes('slime')) {
            shouldUpdate = true;
        } else if (category === 'mutation' && labelText.includes('mutation')) {
            shouldUpdate = true;
        } else if (category === 'evolution' && labelText.includes('evolution')) {
            shouldUpdate = true;
        } else if (category === 'type' && labelText.includes('type')) {
            shouldUpdate = true;
        }
        
        if (shouldUpdate) {
            const selectedElement = button.querySelector('.category-selected');
            if (selectedElement) {
                selectedElement.textContent = selectedName;
                console.log(`Updated ${category} display to: ${selectedName}`);
            }
        }
    });
}

// Update pet multiplier
function updatePetMultiplier() {
    petMultiplier = 1;
    
    // Add selected category modifiers
    if (selectedSlime && petModifiers[selectedSlime]) {
        petMultiplier *= petModifiers[selectedSlime];
    }
    if (selectedMutation && petModifiers[selectedMutation]) {
        petMultiplier *= petModifiers[selectedMutation];
    }
    if (selectedEvolution && petModifiers[selectedEvolution]) {
        petMultiplier *= petModifiers[selectedEvolution];
    }
    if (selectedType && petModifiers[selectedType]) {
        petMultiplier *= petModifiers[selectedType];
    }
    
    // Add simple toggle modifiers
    const shinyCheckbox = document.getElementById('shiny');
    if (shinyCheckbox && shinyCheckbox.checked) {
        petMultiplier *= petModifiers.shiny;
    }
    
    const maxlvlCheckbox = document.getElementById('maxlvl');
    if (maxlvlCheckbox && maxlvlCheckbox.checked) {
        petMultiplier *= petModifiers.maxlvl;
    }
    
    console.log('Pet multiplier updated to:', petMultiplier);
    
    // Auto-calculate if input has value
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
            const errorText = (translations && translations.calculator && translations.calculator.errorInvalidNumber) 
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
    console.log('🚀 Initializing pet calculator with working modal selection...');
    
    // Load translations
    await loadCalcTranslations();
    
    // Get current app language
    const currentAppLanguage = (typeof getCurrentAppLanguage === 'function') 
        ? getCurrentAppLanguage() 
        : 'en';
    
    // Update calculator language
    await updateCalculatorLanguage(currentAppLanguage);
    
    // Set default values
    selectedSlime = 'slime_shock';
    selectedMutation = 'mutation_cosmic';
    selectedEvolution = 'evolution_goliath';
    selectedType = 'type_pristine';
    
    // Set default checkboxes
    const shinyCheckbox = document.getElementById('shiny');
    if (shinyCheckbox) {
        shinyCheckbox.checked = true;
    }
    
    const maxlvlCheckbox = document.getElementById('maxlvl');
    if (maxlvlCheckbox) {
        maxlvlCheckbox.checked = true;
    }
    
    // Update display
    updateCategoryDisplay('slime', slimeOptions[selectedSlime].name);
    updateCategoryDisplay('mutation', mutationOptions[selectedMutation].name);
    updateCategoryDisplay('evolution', evolutionOptions[selectedEvolution].name);
    updateCategoryDisplay('type', typeOptions[selectedType].name);
    
    updatePetMultiplier();
    
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
    
    console.log('✅ Pet calculator initialized with working modal selection');
}

// Listen for language change events
document.addEventListener('languageChanged', async (event) => {
    const newLanguage = event.detail.language;
    console.log('🌍 Calculator received language change:', newLanguage);
    await updateCalculatorLanguage(newLanguage);
});

// Keyboard support for modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('categoryModal');
        if (modal && modal.classList.contains('show')) {
            closeModal();
        }
    }
});

// Make functions globally available
window.updateCalculatorLanguage = updateCalculatorLanguage;
window.loadCalcTranslations = loadCalcTranslations;
window.toggleSettings = toggleSettings;
window.openSlimeSettings = openSlimeSettings;
window.openMutationSettings = openMutationSettings;
window.openEvolutionSettings = openEvolutionSettings;
window.openTypeSettings = openTypeSettings;
window.selectSlime = selectSlime;
window.selectMutation = selectMutation;
window.selectEvolution = selectEvolution;
window.selectType = selectType;
window.updatePetMultiplier = updatePetMultiplier;
window.calculateStats = calculateStats;
window.initializeCalculator = initializeCalculator;
window.closeModal = closeModal;
window.selectOption = selectOption;
