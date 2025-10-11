// ARM CALCULATOR - Optimized
(() => {
    let initialized = false;
    let currentLanguage = 'en';
    let multiplier = 2.1;

    const translations = {
        en: {
            title: "💪 Arm Stats Calculator",
            settings: "Settings",
            inputLabel: "If arm base",
            inputPlaceholder: "Enter number...",
            resultLabel: "Max stats",
            calculateBtn: "Calculate",
            golden1: "1/5 golden",
            golden2: "2/5 golden",
            golden3: "3/5 golden",
            golden4: "4/5 golden",
            golden5: "5/5 golden",
            errors: { invalidInput: "Please enter a valid number" }
        },
        uk: {
            title: "💪 Калькулятор Статів Руки",
            settings: "Налаштування",
            inputLabel: "Якщо рука без бафів",
            inputPlaceholder: "Введіть число...",
            resultLabel: "Максимальні стати",
            calculateBtn: "Розрахувати",
            golden1: "1/5 золота",
            golden2: "2/5 золота",
            golden3: "3/5 золота",
            golden4: "4/5 золота",
            golden5: "5/5 золота",
            errors: { invalidInput: "Будь ласка, введіть дійсне число" }
        },
        ru: {
            title: "💪 Калькулятор Статов Руки",
            settings: "Настройки",
            inputLabel: "Если рука без бафов",
            inputPlaceholder: "Введите число...",
            resultLabel: "Максимальные статы",
            calculateBtn: "Рассчитать",
            golden1: "1/5 золотая",
            golden2: "2/5 золотая",
            golden3: "3/5 золотая",
            golden4: "4/5 золотая",
            golden5: "5/5 золотая",
            errors: { invalidInput: "Пожалуйста, введите действительное число" }
        }
    };

    const goldenModifiers = { golden1: 1.5, golden2: 1.65, golden3: 1.8, golden4: 1.95, golden5: 2.1 };

    const getAppLanguage = () => 
        typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : localStorage.getItem('selectedLanguage') || 'en';

    const createHTML = () => {
        const page = document.getElementById('armPage');
        if (!page) return;

        const t = translations[currentLanguage] || translations.en;
        const goldens = ['golden1', 'golden2', 'golden3', 'golden4', 'golden5'];
        const mods = [1.5, 1.65, 1.8, 1.95, 2.1];

        page.innerHTML = `
            <div class="header-controls">
                <h1>${t.title}</h1>
                <button class="settings-btn" onclick="toggleArmSettings()">⚙️</button>
            </div>
            <div class="settings-panel" id="settingsPanelArm">
                <div class="settings-title">${t.settings}</div>
                ${goldens.map((id, i) => `
                    <div class="simple-toggle">
                        <div class="toggle-info">
                            <div class="toggle-label">${t[id]}</div>
                            <div class="toggle-multiplier">(x${mods[i]})</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="${id}" ${i === 4 ? 'checked' : ''} onchange="handleGoldenSelection('${id}')">
                            <span class="slider"></span>
                        </label>
                    </div>
                `).join('')}
            </div>
            <div class="input-section">
                <label class="input-label" for="armNumberInput">${t.inputLabel}</label>
                <input type="number" class="number-input" id="armNumberInput" placeholder="${t.inputPlaceholder}" step="any" oninput="calculateArmStats()">
                <button class="calculate-btn" onclick="calculateArmStats()">${t.calculateBtn}</button>
                <div class="error" id="armErrorMessage"></div>
            </div>
            <div class="result-section" id="armResultSection">
                <div class="stats-label">${t.resultLabel}</div>
                <div class="result-value" id="armResultValue">0</div>
            </div>
        `;
    };

    const addEventListeners = () => {
        document.addEventListener('languageChanged', e => updateLanguage(e.detail.language));
        
        setTimeout(() => {
            const input = document.getElementById('armNumberInput');
            if (input) {
                input.addEventListener('keypress', e => e.key === 'Enter' && calculate());
                input.addEventListener('input', () => {
                    const err = document.getElementById('armErrorMessage');
                    if (err) err.textContent = '';
                });
            }
        }, 100);
    };

    const updateLanguage = lang => {
        currentLanguage = translations[lang] ? lang : 'en';
        createHTML();
        addEventListeners();
        updateMultiplier();
    };

    const toggleSettings = () => {
        const panel = document.getElementById('settingsPanelArm');
        if (panel) panel.classList.toggle('show');
    };

    const handleSelection = selectedId => {
        Object.keys(goldenModifiers).forEach(id => {
            if (id !== selectedId) {
                const cb = document.getElementById(id);
                if (cb) cb.checked = false;
            }
        });
        updateMultiplier();
    };

    const updateMultiplier = () => {
        multiplier = 1;
        for (const id in goldenModifiers) {
            const cb = document.getElementById(id);
            if (cb?.checked) {
                multiplier = goldenModifiers[id];
                break;
            }
        }
        calculate();
    };

    const calculate = () => {
        const input = document.getElementById('armNumberInput');
        const section = document.getElementById('armResultSection');
        const value = document.getElementById('armResultValue');
        const error = document.getElementById('armErrorMessage');

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
        value.textContent = final.toLocaleString('uk-UA', {
            minimumFractionDigits: final % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 8
        });

        setTimeout(() => section.classList.add('show'), 100);
    };

    const init = () => {
        if (initialized) return;
        currentLanguage = getAppLanguage();
        createHTML();
        addEventListeners();
        updateMultiplier();
        initialized = true;
    };

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.getElementById('armPage')) init();
        });
    } else if (document.getElementById('armPage')) {
        init();
    }

    // Global exports
    window.initializeArm = init;
    window.calculateArmStats = calculate;
    window.updateArmLanguage = updateLanguage;
    window.toggleArmSettings = toggleSettings;
    window.handleGoldenSelection = handleSelection;
    window.updateArmMultiplier = updateMultiplier;
})();
