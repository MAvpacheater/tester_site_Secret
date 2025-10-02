// PET CALCULATOR - Optimized Version
// calc/calculator/calculator.js

let petCalculatorInitialized = false;
let currentPetLanguage = 'en';
let petMultiplier = 1;
let currentModalCallback = null;

// Translations
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
        errors: { invalidInput: "Please enter a valid number" }
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
        errors: { invalidInput: "Будь ласка, введіть дійсне число" }
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
        errors: { invalidInput: "Пожалуйста, введите действительное число" }
    }
};

// Current selections
let selectedSlime = 'slime_shock';
let selectedMutation = 'mutation_cosmic';
let selectedEvolution = 'evolution_goliath';
let selectedType = 'type_pristine';

// Modifiers
const petModifiers = {
    slime_shock: 3.15, slime_neowave: 3.0, slime_christmas: 2.85, slime_orange: 2.7,
    slime_green: 2.55, slime_black: 2.4, slime_red: 2.25, slime_purple: 1.65,
    slime_blue: 1.4, slime_yellow: 1.2,
    mutation_cosmic: 2.5, mutation_ghost: 2.0, mutation_rainbow: 1.35, mutation_glowing: 1.2,
    evolution_goliath: 2.5, evolution_huge: 2.0, evolution_big: 1.5,
    type_pristine: 2.17, type_void: 2.0, type_golden: 1.5,
    shiny: 1.15, maxlvl: 2.2388
};

// Options (sorted worst to best)
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

function getCurrentAppLanguage() {
    if (typeof getCurrentLanguage === 'function') {
        const lang = getCurrentLanguage();
        if (petCalculatorTranslations[lang]) return lang;
    }
    const savedLang = localStorage.getItem('selectedLanguage');
    return (savedLang && petCalculatorTranslations[savedLang]) ? savedLang : 'en';
}

function createPetCalculatorHTML() {
    const calculatorPage = document.getElementById('calculatorPage');
    if (!calculatorPage) return false;

    const t = petCalculatorTranslations[currentPetLanguage] || petCalculatorTranslations.en;

    calculatorPage.innerHTML = `
        <div class="header-controls">
            <h1>${t.title}</h1>
            <button class="settings-btn" onclick="toggleSettings()">⚙️</button>
        </div>

        <div class="settings-panel" id="settingsPanel">
            <div class="settings-title">${t.settings}</div>
            
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

        <div class="input-section">
            <label class="input-label" for="numberInput">${t.inputLabel}</label>
            <input type="number" class="number-input" id="numberInput" placeholder="${t.inputPlaceholder}" step="any" oninput="calculateStats()">
            <button class="calculate-btn" onclick="calculateStats()">${t.calculateBtn}</button>
            <div class="error" id="errorMessage"></div>
        </div>

        <div class="result-section" id="resultSection">
            <div class="stats-label">${t.resultLabel}</div>
            <div class="result-value" id="resultValue">0</div>
        </div>
    `;
    return true;
}

function initializePetCalculator(forceInit = false) {
    if (petCalculatorInitialized && !forceInit) return true;

    const calculatorPage = document.getElementById('calculatorPage');
    if (!calculatorPage) return false;

    currentPetLanguage = getCurrentAppLanguage();
    
    if (!createPetCalculatorHTML()) return false;
    
    setTimeout(() => {
        addPetCalculatorEventListeners();
        setDefaultPetCalculatorValues();
        updateCategoryDisplays();
        updatePetMultiplier();
        petCalculatorInitialized = true;
        document.dispatchEvent(new CustomEvent('petCalculatorInitialized'));
    }, 100);
    
    return true;
}

function addPetCalculatorEventListeners() {
    document.addEventListener('languageChanged', (e) => {
        updatePetCalculatorLanguage(e.detail.language);
    });
    
    const numberInput = document.getElementById('numberInput');
    if (numberInput) {
        numberInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') calculateStats();
        });
        numberInput.addEventListener('input', () => {
            const error = document.getElementById('errorMessage');
            if (error) error.textContent = '';
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function updatePetCalculatorLanguage(language) {
    currentPetLanguage = petCalculatorTranslations[language] ? language : 'en';
    
    if (createPetCalculatorHTML()) {
        setTimeout(() => {
            addPetCalculatorEventListeners();
            setDefaultPetCalculatorValues();
            updateCategoryDisplays();
            updatePetMultiplier();
        }, 100);
    }
}

function setDefaultPetCalculatorValues() {
    selectedSlime = 'slime_shock';
    selectedMutation = 'mutation_cosmic';
    selectedEvolution = 'evolution_goliath';
    selectedType = 'type_pristine';
    
    setTimeout(() => {
        const shiny = document.getElementById('shiny');
        const maxlvl = document.getElementById('maxlvl');
        if (shiny) shiny.checked = true;
        if (maxlvl) maxlvl.checked = true;
    }, 50);
}

function updateCategoryDisplays() {
    const displays = {
        selectedSlimeDisplay: slimeOptions[selectedSlime]?.name,
        selectedMutationDisplay: mutationOptions[selectedMutation]?.name,
        selectedEvolutionDisplay: evolutionOptions[selectedEvolution]?.name,
        selectedTypeDisplay: typeOptions[selectedType]?.name
    };
    
    Object.entries(displays).forEach(([id, text]) => {
        const el = document.getElementById(id);
        if (el && text) el.textContent = text;
    });
}

function toggleSettings() {
    const panel = document.getElementById('settingsPanel');
    if (panel) panel.classList.toggle('show');
}

function createModal(title, options, currentSelected, onSelect) {
    const existingModal = document.getElementById('categoryModal');
    if (existingModal) existingModal.remove();

    currentModalCallback = onSelect;

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
    
    const calculatorPage = document.getElementById('calculatorPage');
    calculatorPage.appendChild(modalOverlay);
    
    setTimeout(() => modalOverlay.classList.add('show'), 10);
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
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
    if (currentModalCallback) currentModalCallback(optionId, optionName);
    closeModal();
}

function openSlimeSettings() {
    const t = petCalculatorTranslations[currentPetLanguage] || petCalculatorTranslations.en;
    createModal(t.selectSlimeType, slimeOptions, selectedSlime, selectSlime);
}

function openMutationSettings() {
    const t = petCalculatorTranslations[currentPetLanguage] || petCalculatorTranslations.en;
    createModal(t.selectMutation, mutationOptions, selectedMutation, selectMutation);
}

function openEvolutionSettings() {
    const t = petCalculatorTranslations[currentPetLanguage] || petCalculatorTranslations.en;
    createModal(t.selectEvolutionSize, evolutionOptions, selectedEvolution, selectEvolution);
}

function openTypeSettings() {
    const t = petCalculatorTranslations[currentPetLanguage] || petCalculatorTranslations.en;
    createModal(t.selectType, typeOptions, selectedType, selectType);
}

function selectSlime(slimeId) {
    selectedSlime = slimeId;
    const display = document.getElementById('selectedSlimeDisplay');
    if (display) display.textContent = slimeOptions[slimeId].name;
    updatePetMultiplier();
}

function selectMutation(mutationId) {
    selectedMutation = mutationId;
    const display = document.getElementById('selectedMutationDisplay');
    if (display) display.textContent = mutationOptions[mutationId].name;
    updatePetMultiplier();
}

function selectEvolution(evolutionId) {
    selectedEvolution = evolutionId;
    const display = document.getElementById('selectedEvolutionDisplay');
    if (display) display.textContent = evolutionOptions[evolutionId].name;
    updatePetMultiplier();
}

function selectType(typeId) {
    selectedType = typeId;
    const display = document.getElementById('selectedTypeDisplay');
    if (display) display.textContent = typeOptions[typeId].name;
    updatePetMultiplier();
}

function updatePetMultiplier() {
    petMultiplier = 1;
    
    [selectedSlime, selectedMutation, selectedEvolution, selectedType].forEach(sel => {
        if (petModifiers[sel]) petMultiplier *= petModifiers[sel];
    });
    
    const shiny = document.getElementById('shiny');
    const maxlvl = document.getElementById('maxlvl');
    
    if (shiny?.checked) petMultiplier *= petModifiers.shiny;
    if (maxlvl?.checked) petMultiplier *= petModifiers.maxlvl;
    
    calculateStats();
}

function calculateStats() {
    const input = document.getElementById('numberInput');
    const resultSection = document.getElementById('resultSection');
    const resultValue = document.getElementById('resultValue');
    const errorMessage = document.getElementById('errorMessage');

    if (!input || !resultSection || !resultValue || !errorMessage) return;

    const t = petCalculatorTranslations[currentPetLanguage] || petCalculatorTranslations.en;
    errorMessage.textContent = '';

    const baseValue = parseFloat(input.value);

    if (isNaN(baseValue) || !input.value.trim()) {
        if (input.value.trim()) {
            errorMessage.textContent = t.errors?.invalidInput || 'Please enter a valid number';
        }
        resultSection.classList.remove('show');
        return;
    }

    const finalValue = baseValue * petMultiplier;

    resultValue.textContent = finalValue.toLocaleString(undefined, {
        minimumFractionDigits: finalValue % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 8
    });

    setTimeout(() => resultSection.classList.add('show'), 100);
}

// Auto-initialization
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.getElementById('calculatorPage')) initializePetCalculator();
    }, 100);
});

document.addEventListener('contentLoaded', () => {
    setTimeout(() => initializePetCalculator(), 200);
});

document.addEventListener('pageChanged', (e) => {
    if (e.detail?.pageId === 'calculatorPage') {
        setTimeout(() => initializePetCalculator(true), 100);
    }
});

// Global exports
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

console.log('✅ Pet Calculator module loaded');
