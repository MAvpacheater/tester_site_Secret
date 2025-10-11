// PET CALCULATOR - Optimized
(() => {
    let initialized = false;
    let currentLanguage = 'en';
    let multiplier = 1;
    let modalCallback = null;

    const translations = {
        en: {
            title: "🐾 Pet Calculator", settings: "Settings", inputLabel: "Enter Pet Stats:",
            inputPlaceholder: "Enter your pet's base stats...", resultLabel: "Final Pet Stats:",
            calculateBtn: "Calculate", slimes: "Slimes", mutation: "Mutation",
            evolutionSize: "Evolution and Size", type: "Type", shiny: "Shiny", maxlvl: "Max lvl",
            selectSlimeType: "Select Slime Type", selectMutation: "Select Mutation",
            selectEvolutionSize: "Select Evolution/Size", selectType: "Select Type",
            errors: { invalidInput: "Please enter a valid number" }
        },
        uk: {
            title: "🐾 Калькулятор Петів", settings: "Налаштування", inputLabel: "Введіть статистику пета:",
            inputPlaceholder: "Введіть базові характеристики вашого пета...", resultLabel: "Фінальні характеристики пета:",
            calculateBtn: "Розрахувати", slimes: "Слайми", mutation: "Мутація",
            evolutionSize: "Еволюція та розмір", type: "Тип", shiny: "Блискучий", maxlvl: "Макс. рівень",
            selectSlimeType: "Оберіть тип слайма", selectMutation: "Оберіть мутацію",
            selectEvolutionSize: "Оберіть еволюцію/розмір", selectType: "Оберіть тип",
            errors: { invalidInput: "Будь ласка, введіть дійсне число" }
        },
        ru: {
            title: "🐾 Калькулятор Питомцев", settings: "Настройки", inputLabel: "Введите статистику питомца:",
            inputPlaceholder: "Введите базовые характеристики вашего питомца...", resultLabel: "Финальные характеристики питомца:",
            calculateBtn: "Рассчитать", slimes: "Слаймы", mutation: "Мутация",
            evolutionSize: "Эволюция и размер", type: "Тип", shiny: "Блестящий", maxlvl: "Макс. уровень",
            selectSlimeType: "Выберите тип слайма", selectMutation: "Выберите мутацию",
            selectEvolutionSize: "Выберите эволюцию/размер", selectType: "Выберите тип",
            errors: { invalidInput: "Пожалуйста, введите действительное число" }
        }
    };

    let selected = { slime: 'slime_shock', mutation: 'mutation_cosmic', evolution: 'evolution_goliath', type: 'type_pristine' };

    const modifiers = {
        slime_shock: 3.15, slime_neowave: 3.0, slime_christmas: 2.85, slime_orange: 2.7,
        slime_green: 2.55, slime_black: 2.4, slime_red: 2.25, slime_purple: 1.65,
        slime_blue: 1.4, slime_yellow: 1.2,
        mutation_cosmic: 2.5, mutation_ghost: 2.0, mutation_rainbow: 1.35, mutation_glowing: 1.2,
        evolution_goliath: 2.5, evolution_huge: 2.0, evolution_big: 1.5,
        type_pristine: 2.17, type_void: 2.0, type_golden: 1.5,
        shiny: 1.15, maxlvl: 2.2388
    };

    const options = {
        slime: {
            slime_yellow: { name: "Yellow", multiplier: "1.2x" }, slime_blue: { name: "Blue", multiplier: "1.4x" },
            slime_purple: { name: "Purple", multiplier: "1.65x" }, slime_red: { name: "Red", multiplier: "2.25x" },
            slime_black: { name: "Black", multiplier: "2.4x" }, slime_green: { name: "Green", multiplier: "2.55x" },
            slime_orange: { name: "Orange", multiplier: "2.7x" }, slime_christmas: { name: "Christmas", multiplier: "2.85x" },
            slime_neowave: { name: "Neowave", multiplier: "3.0x" }, slime_shock: { name: "Shock", multiplier: "3.15x" }
        },
        mutation: {
            mutation_glowing: { name: "Glowing", multiplier: "1.2x" }, mutation_rainbow: { name: "Rainbow", multiplier: "1.35x" },
            mutation_ghost: { name: "Ghost", multiplier: "2.0x" }, mutation_cosmic: { name: "Cosmic", multiplier: "2.5x" }
        },
        evolution: {
            evolution_big: { name: "Big", multiplier: "1.5x" }, evolution_huge: { name: "Huge", multiplier: "2.0x" },
            evolution_goliath: { name: "Goliath", multiplier: "2.5x" }
        },
        type: {
            type_golden: { name: "Golden", multiplier: "1.5x" }, type_void: { name: "Void", multiplier: "2.0x" },
            type_pristine: { name: "Pristine", multiplier: "2.17x" }
        }
    };

    const getAppLanguage = () => 
        typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : localStorage.getItem('selectedLanguage') || 'en';

    const createHTML = () => {
        const page = document.getElementById('calculatorPage');
        if (!page) return false;

        const t = translations[currentLanguage] || translations.en;

        page.innerHTML = `
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
    };

    const addEventListeners = () => {
        document.addEventListener('languageChanged', e => updateLanguage(e.detail.language));
        
        const input = document.getElementById('numberInput');
        if (input) {
            input.addEventListener('keypress', e => e.key === 'Enter' && calculate());
            input.addEventListener('input', () => {
                const err = document.getElementById('errorMessage');
                if (err) err.textContent = '';
            });
        }

        document.addEventListener('keydown', e => e.key === 'Escape' && closeModal());
    };

    const updateLanguage = lang => {
        currentLanguage = translations[lang] ? lang : 'en';
        if (createHTML()) {
            setTimeout(() => {
                addEventListeners();
                setDefaults();
                updateDisplays();
                updateMultiplier();
            }, 100);
        }
    };

    const setDefaults = () => {
        selected = { slime: 'slime_shock', mutation: 'mutation_cosmic', evolution: 'evolution_goliath', type: 'type_pristine' };
        setTimeout(() => {
            ['shiny', 'maxlvl'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.checked = true;
            });
        }, 50);
    };

    const updateDisplays = () => {
        const displays = {
            selectedSlimeDisplay: options.slime[selected.slime]?.name,
            selectedMutationDisplay: options.mutation[selected.mutation]?.name,
            selectedEvolutionDisplay: options.evolution[selected.evolution]?.name,
            selectedTypeDisplay: options.type[selected.type]?.name
        };
        
        Object.entries(displays).forEach(([id, text]) => {
            const el = document.getElementById(id);
            if (el && text) el.textContent = text;
        });
    };

    const toggleSettings = () => {
        const panel = document.getElementById('settingsPanel');
        if (panel) panel.classList.toggle('show');
    };

    const createModal = (title, opts, current, onSelect) => {
        const existing = document.getElementById('categoryModal');
        if (existing) existing.remove();

        modalCallback = onSelect;

        const overlay = document.createElement('div');
        overlay.id = 'categoryModal';
        overlay.className = 'modal-overlay';
        
        overlay.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    ${Object.entries(opts).map(([id, data]) => `
                        <div class="option-item ${current === id ? 'selected' : ''}" 
                             onclick="selectOption('${id}', '${data.name}')">
                            <span class="option-name">${data.name}</span>
                            <span class="option-multiplier">${data.multiplier}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.getElementById('calculatorPage').appendChild(overlay);
        setTimeout(() => overlay.classList.add('show'), 10);
        overlay.addEventListener('click', e => e.target === overlay && closeModal());
    };

    const closeModal = () => {
        const modal = document.getElementById('categoryModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
        modalCallback = null;
    };

    const selectOption = (id, name) => {
        if (modalCallback) modalCallback(id, name);
        closeModal();
    };

    const openSlimeSettings = () => {
        const t = translations[currentLanguage] || translations.en;
        createModal(t.selectSlimeType, options.slime, selected.slime, selectSlime);
    };

    const openMutationSettings = () => {
        const t = translations[currentLanguage] || translations.en;
        createModal(t.selectMutation, options.mutation, selected.mutation, selectMutation);
    };

    const openEvolutionSettings = () => {
        const t = translations[currentLanguage] || translations.en;
        createModal(t.selectEvolutionSize, options.evolution, selected.evolution, selectEvolution);
    };

    const openTypeSettings = () => {
        const t = translations[currentLanguage] || translations.en;
        createModal(t.selectType, options.type, selected.type, selectType);
    };

    const selectSlime = id => {
        selected.slime = id;
        const el = document.getElementById('selectedSlimeDisplay');
        if (el) el.textContent = options.slime[id].name;
        updateMultiplier();
    };

    const selectMutation = id => {
        selected.mutation = id;
        const el = document.getElementById('selectedMutationDisplay');
        if (el) el.textContent = options.mutation[id].name;
        updateMultiplier();
    };

    const selectEvolution = id => {
        selected.evolution = id;
        const el = document.getElementById('selectedEvolutionDisplay');
        if (el) el.textContent = options.evolution[id].name;
        updateMultiplier();
    };

    const selectType = id => {
        selected.type = id;
        const el = document.getElementById('selectedTypeDisplay');
        if (el) el.textContent = options.type[id].name;
        updateMultiplier();
    };

    const updateMultiplier = () => {
        multiplier = 1;
        
        [selected.slime, selected.mutation, selected.evolution, selected.type].forEach(sel => {
            if (modifiers[sel]) multiplier *= modifiers[sel];
        });
        
        ['shiny', 'maxlvl'].forEach(id => {
            const el = document.getElementById(id);
            if (el?.checked) multiplier *= modifiers[id];
        });
        
        calculate();
    };

    const calculate = () => {
        const input = document.getElementById('numberInput');
        const section = document.getElementById('resultSection');
        const value = document.getElementById('resultValue');
        const error = document.getElementById('errorMessage');

        if (!input || !section || !value || !error) return;

        const t = translations[currentLanguage] || translations.en;
        error.textContent = '';

        const base = parseFloat(input.value);

        if (isNaN(base) || !input.value.trim()) {
            if (input.value.trim()) error.textContent = t.errors?.invalidInput || 'Please enter a valid number';
            section.classList.remove('show');
            return;
        }

        const final = base * multiplier;
        value.textContent = final.toLocaleString(undefined, {
            minimumFractionDigits: final % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 8
        });

        setTimeout(() => section.classList.add('show'), 100);
    };

    const init = (force = false) => {
        if (initialized && !force) return true;
        const page = document.getElementById('calculatorPage');
        if (!page) return false;

        currentLanguage = getAppLanguage();
        if (!createHTML()) return false;
        
        setTimeout(() => {
            addEventListeners();
            setDefaults();
            updateDisplays();
            updateMultiplier();
            initialized = true;
            document.dispatchEvent(new CustomEvent('petCalculatorInitialized'));
        }, 100);
        
        return true;
    };

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(() => init(), 100));
    } else {
        setTimeout(() => init(), 100);
    }

    document.addEventListener('contentLoaded', () => setTimeout(() => init(), 200));
    document.addEventListener('pageChanged', e => {
        if (e.detail?.page === 'calculator' || e.detail?.pageId === 'calculatorPage') {
            setTimeout(() => init(true), 100);
        }
    });

    // Global exports
    window.initializePetCalculator = init;
    window.calculateStats = calculate;
    window.updatePetCalculatorLanguage = updateLanguage;
    window.toggleSettings = toggleSettings;
    window.openSlimeSettings = openSlimeSettings;
    window.openMutationSettings = openMutationSettings;
    window.openEvolutionSettings = openEvolutionSettings;
    window.openTypeSettings = openTypeSettings;
    window.selectSlime = selectSlime;
    window.selectMutation = selectMutation;
    window.selectEvolution = selectEvolution;
    window.selectType = selectType;
    window.updatePetMultiplier = updateMultiplier;
    window.closeModal = closeModal;
    window.selectOption = selectOption;
})();
