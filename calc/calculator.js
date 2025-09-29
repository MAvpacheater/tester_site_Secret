// Pet Stats Calculator - Fixed implementation

// Global variables for pet calculator
let petCalculatorInitialized = false;
let currentPetLanguage = 'en';

// Built-in translations - 3 languages
const petCalculatorTranslations = {
    en: {
        title: "🐾 Pet Calculator",
        settings: "Settings",
        inputLabel: "Enter Pet Stats:",
        inputPlaceholder: "Enter your pet's base stats...",
        resultLabel: "Final Pet Stats:",
        calculateBtn: "Calculate",
        slimes: "Slimes",
        mutation: "Mutation", 
        evolutionSize: "Evolution and Size",
        type: "Type",
        shiny: "Shiny",
        maxlvl: "Max lvl",
        selectSlimeType: "Select Slime Type",
        selectMutation: "Select Mutation",
        selectEvolutionSize: "Select Evolution/Size",
        selectType: "Select Type",
        errors: {
            invalidInput: "Please enter a valid number"
        }
    },
    uk: {
        title: "🐾 Калькулятор Петів",
        settings: "Налаштування",
        inputLabel: "Введіть статистику пета:",
        inputPlaceholder: "Введіть базові характеристики вашого пета...",
        resultLabel: "Фінальні характеристики пета:",
        calculateBtn: "Розрахувати",
        slimes: "Слайми",
        mutation: "Мутація", 
        evolutionSize: "Еволюція та розмір",
        type: "Тип",
        shiny: "Блискучий",
        maxlvl: "Макс. рівень",
        selectSlimeType: "Оберіть тип слайма",
        selectMutation: "Оберіть мутацію",
        selectEvolutionSize: "Оберіть еволюцію/розмір",
        selectType: "Оберіть тип",
        errors: {
            invalidInput: "Будь ласка, введіть дійсне число"
        }
    },
    ru: {
        title: "🐾 Калькулятор Питомцев",
        settings: "Настройки",
        inputLabel: "Введите статистику питомца:",
        inputPlaceholder: "Введите базовые характеристики вашего питомца...",
        resultLabel: "Финальные характеристики питомца:",
        calculateBtn: "Рассчитать",
        slimes: "Слаймы",
        mutation: "Мутация", 
        evolutionSize: "Эволюция и размер",
        type: "Тип",
        shiny: "Блестящий",
        maxlvl: "Макс. уровень",
        selectSlimeType: "Выберите тип слайма",
        selectMutation: "Выберите мутацию",
        selectEvolutionSize: "Выберите эволюцию/размер",
        selectType: "Выберите тип",
        errors: {
            invalidInput: "Пожалуйста, введите действительное число"
        }
    }
};

// Current selected options
let selectedSlime = 'slime_shock';
let selectedMutation = 'mutation_cosmic';
let selectedEvolution = 'evolution_goliath';
let selectedType = 'type_pristine';

// Global callback reference
let currentModalCallback = null;

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

// Get current language from app or default to 'en'
function getCurrentAppLanguage() {
    // Try to get from global app language if available
    if (typeof getCurrentLanguage === 'function') {
        const lang = getCurrentLanguage();
        if (petCalculatorTranslations[lang]) return lang;
    }
    // Try localStorage
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang && petCalculatorTranslations[savedLang]) {
        return savedLang;
    }
    // Default fallback
    return 'en';
}

// Create HTML structure for pet calculator
function createPetCalculatorHTML() {
    const calculatorPage = document.getElementById('calculatorPage');
    if (!calculatorPage) {
        console.error('❌ Pet calculator page container not found');
        return;
    }

    const t = petCalculatorTranslations[currentPetLanguage] || petCalculatorTranslations['en'];
    console.log('Using pet calculator translations for language:', currentPetLanguage);

    calculatorPage.innerHTML = `
        <div class="header-controls">
            <h1>${t.title}</h1>
            <button class="settings-btn" onclick="toggleSettings()">⚙️</button>
        </div>

        <!-- Settings Panel -->
        <div class="settings-panel" id="settingsPanel">
            <div class="settings-title">${t.settings}</div>
            
            <!-- Category buttons with modal opening -->
            <div class="category-button" onclick="openSlimeSettings()">
                <div class="category-info">
                    <div class="category-label">${t.slimes}</div>
                    <div class="category-selected" id="selectedSlimeDisplay">Shock</div>
                </div>
                <div class="category-arrow">→</div>
            </div>

            <div class="category-button" onclick="openMutationSettings()">
                <div class="category-info">
                    <div class="category-label">${t.mutation}</div>
                    <div class="category-selected" id="selectedMutationDisplay">Cosmic</div>
                </div>
                <div class="category-arrow">→</div>
            </div>

            <div class="category-button" onclick="openEvolutionSettings()">
                <div class="category-info">
                    <div class="category-label">${t.evolutionSize}</div>
                    <div class="category-selected" id="selectedEvolutionDisplay">Goliath</div>
                </div>
                <div class="category-arrow">→</div>
            </div>

            <div class="category-button" onclick="openTypeSettings()">
                <div class="category-info">
                    <div class="category-label">${t.type}</div>
                    <div class="category-selected" id="selectedTypeDisplay">Pristine</div>
                </div>
                <div class="category-arrow">→</div>
            </div>

            <!-- Simple toggles -->
            <div class="simple-toggle">
                <div class="toggle-info">
                    <div class="toggle-label">${t.shiny}</div>
                    <div class="toggle-multiplier">(x1.15)</div>
                </div>
                <label class="switch">
                    <input type="checkbox" id="shiny" checked onchange="updatePetMultiplier()">
                    <span class="slider"></span>
                </label>
            </div>

            <div class="simple-toggle">
                <div class="toggle-info">
                    <div class="toggle-label">${t.maxlvl}</div>
                    <div class="toggle-multiplier">(x2.2388)</div>
                </div>
                <label class="switch">
                    <input type="checkbox" id="maxlvl" checked onchange="updatePetMultiplier()">
                    <span class="slider"></span>
                </label>
            </div>
        </div>

        <!-- Input Section -->
        <div class="input-section">
            <label class="input-label" for="numberInput">${t.inputLabel}</label>
            <input type="number" class="number-input" id="numberInput" placeholder="${t.inputPlaceholder}" step="any" oninput="calculateStats()">
            <button class="calculate-btn" onclick="calculateStats()">${t.calculateBtn}</button>
            <div class="error" id="errorMessage"></div>
        </div>

        <!-- Result Section -->
        <div class="result-section" id="resultSection">
            <div class="stats-label">${t.resultLabel}</div>
            <div class="result-value" id="resultValue">0</div>
        </div>
    `;

    console.log('✅ Pet Calculator HTML structure created');
}

// Initialize Pet Calculator
function initializePetCalculator() {
    console.log('🚀 Initializing Pet Calculator...');
    
    // Set current language
    currentPetLanguage = getCurrentAppLanguage();
    console.log('Current pet calculator language:', currentPetLanguage);
    
    // Create HTML structure
    createPetCalculatorHTML();
    
    // Add event listeners
    addPetCalculatorEventListeners();
    
    // Set default values and update multiplier
    setDefaultPetCalculatorValues();
    
    petCalculatorInitialized = true;
    console.log('✅ Pet Calculator initialized successfully');
}

// Add event listeners for pet calculator
function addPetCalculatorEventListeners() {
    // Listen for language changes
    document.addEventListener('languageChanged', function(event) {
        const newLanguage = event.detail.language;
        console.log(`🌍 Pet Calculator: Language changed to ${newLanguage}`);
        updatePetCalculatorLanguage(newLanguage);
    });
    
    // Add input event listeners after a short delay to ensure elements exist
    setTimeout(() => {
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

        // Keyboard support for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('categoryModal');
                if (modal && modal.classList.contains('show')) {
                    closeModal();
                }
            }
        });
    }, 100);
    
    console.log('✅ Pet Calculator event listeners added');
}

// Update pet calculator language
function updatePetCalculatorLanguage(language) {
    if (!petCalculatorTranslations[language]) {
        console.warn(`❌ Language ${language} not found for pet calculator, using English`);
        language = 'en';
    }
    
    currentPetLanguage = language;
    
    // Recreate HTML with new language
    createPetCalculatorHTML();
    
    // Re-add event listeners and restore values
    setTimeout(() => {
        addPetCalculatorEventListeners();
        setDefaultPetCalculatorValues();
        updateCategoryDisplays();
    }, 100);
    
    console.log(`✅ Pet Calculator language updated to ${language}`);
}

// Set default values for pet calculator
function setDefaultPetCalculatorValues() {
    // Set default selections
    selectedSlime = 'slime_shock';
    selectedMutation = 'mutation_cosmic';
    selectedEvolution = 'evolution_goliath';
    selectedType = 'type_pristine';
    
    // Set default checkboxes
    setTimeout(() => {
        const shinyCheckbox = document.getElementById('shiny');
        if (shinyCheckbox) {
            shinyCheckbox.checked = true;
        }
        
        const maxlvlCheckbox = document.getElementById('maxlvl');
        if (maxlvlCheckbox) {
            maxlvlCheckbox.checked = true;
        }
        
        updatePetMultiplier();
        updateCategoryDisplays();
    }, 50);
}

// Update category displays
function updateCategoryDisplays() {
    const slimeDisplay = document.getElementById('selectedSlimeDisplay');
    if (slimeDisplay) slimeDisplay.textContent = slimeOptions[selectedSlime].name;
    
    const mutationDisplay = document.getElementById('selectedMutationDisplay');
    if (mutationDisplay) mutationDisplay.textContent = mutationOptions[selectedMutation].name;
    
    const evolutionDisplay = document.getElementById('selectedEvolutionDisplay');
    if (evolutionDisplay) evolutionDisplay.textContent = evolutionOptions[selectedEvolution].name;
    
    const typeDisplay = document.getElementById('selectedTypeDisplay');
    if (typeDisplay) typeDisplay.textContent = typeOptions[selectedType].name;
}

// Show/hide settings
function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    if (panel) {
        panel.classList.toggle('show');
    }
}

// Modal functions
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

function selectOption(optionId, optionName) {
    if (currentModalCallback) {
        currentModalCallback(optionId, optionName);
    }
    closeModal();
}

// Category opening functions with modals
function openSlimeSettings() {
    const t = petCalculatorTranslations[currentPetLanguage] || petCalculatorTranslations['en'];
    createModal(t.selectSlimeType, slimeOptions, selectedSlime, (slimeId, slimeName) => {
        selectSlime(slimeId);
    });
}

function openMutationSettings() {
    const t = petCalculatorTranslations[currentPetLanguage] || petCalculatorTranslations['en'];
    createModal(t.selectMutation, mutationOptions, selectedMutation, (mutationId, mutationName) => {
        selectMutation(mutationId);
    });
}

function openEvolutionSettings() {
    const t = petCalculatorTranslations[currentPetLanguage] || petCalculatorTranslations['en'];
    createModal(t.selectEvolutionSize, evolutionOptions, selectedEvolution, (evolutionId, evolutionName) => {
        selectEvolution(evolutionId);
    });
}

function openTypeSettings() {
    const t = petCalculatorTranslations[currentPetLanguage] || petCalculatorTranslations['en'];
    createModal(t.selectType, typeOptions, selectedType, (typeId, typeName) => {
        selectType(typeId);
    });
}

// Selection functions
function selectSlime(slimeId) {
    selectedSlime = slimeId;
    const display = document.getElementById('selectedSlimeDisplay');
    if (display) display.textContent = slimeOptions[slimeId].name;
    updatePetMultiplier();
    console.log('Selected slime:', slimeId, slimeOptions[slimeId].name);
}

function selectMutation(mutationId) {
    selectedMutation = mutationId;
    const display = document.getElementById('selectedMutationDisplay');
    if (display) display.textContent = mutationOptions[mutationId].name;
    updatePetMultiplier();
    console.log('Selected mutation:', mutationId, mutationOptions[mutationId].name);
}

function selectEvolution(evolutionId) {
    selectedEvolution = evolutionId;
    const display = document.getElementById('selectedEvolutionDisplay');
    if (display) display.textContent = evolutionOptions[evolutionId].name;
    updatePetMultiplier();
    console.log('Selected evolution:', evolutionId, evolutionOptions[evolutionId].name);
}

function selectType(typeId) {
    selectedType = typeId;
    const display = document.getElementById('selectedTypeDisplay');
    if (display) display.textContent = typeOptions[typeId].name;
    updatePetMultiplier();
    console.log('Selected type:', typeId, typeOptions[typeId].name);
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
    console.log('🐾 Calculating pet stats...');
    
    const input = document.getElementById('numberInput');
    const resultSection = document.getElementById('resultSection');
    const resultValue = document.getElementById('resultValue');
    const errorMessage = document.getElementById('errorMessage');

    if (!input || !resultSection || !resultValue || !errorMessage) {
        console.error('❌ Pet calculator elements not found');
        return;
    }

    const t = petCalculatorTranslations[currentPetLanguage] || petCalculatorTranslations['en'];

    // Clear previous errors
    errorMessage.textContent = '';

    const baseValue = parseFloat(input.value);

    if (isNaN(baseValue) || input.value.trim() === '') {
        if (input.value.trim() !== '') {
            const errorText = (t.errors && t.errors.invalidInput) || 'Please enter a valid number';
            errorMessage.textContent = errorText;
        }
        resultSection.classList.remove('show');
        return;
    }

    const finalValue = baseValue * petMultiplier;
    
    console.log(`Calculating: ${baseValue} * ${petMultiplier} = ${finalValue}`);

    // Format the result
    resultValue.textContent = finalValue.toLocaleString(undefined, {
        minimumFractionDigits: finalValue % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 8
    });

    // Show result section with animation
    setTimeout(() => {
        resultSection.classList.add('show');
    }, 100);
    
    console.log(`✅ Pet calculation completed: ${baseValue} * ${petMultiplier} = ${finalValue}`);
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure the page element exists
    setTimeout(() => {
        if (document.getElementById('calculatorPage')) {
            console.log('🔄 DOM loaded, initializing pet calculator...');
            initializePetCalculator();
        }
    }, 100);
});

// Also initialize when page becomes active (for navigation)
document.addEventListener('pageChanged', function(event) {
    if (event.detail && event.detail.pageId === 'calculatorPage') {
        console.log('🔄 Pet calculator page activated, initializing...');
        if (!petCalculatorInitialized) {
            initializePetCalculator();
        }
    }
});

// Manual initialization for debugging
window.manualInitPetCalculator = function() {
    console.log('🔧 Manual pet calculator initialization');
    petCalculatorInitialized = false;
    initializePetCalculator();
};

// Make functions globally available
window.initializePetCalculator = initializePetCalculator;
window.calculateStats = calculateStats;
window.updatePetCalculatorLanguage = updatePetCalculatorLanguage;
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
window.closeModal = closeModal;
window.selectOption = selectOption;

// Force initialize if calculator page already exists
if (document.getElementById('calculatorPage')) {
    console.log('🔄 Calculator page found, initializing immediately...');
    setTimeout(() => initializePetCalculator(), 100);
}

console.log('✅ Pet Calculator module loaded and ready');
