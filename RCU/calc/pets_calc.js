// RCU PETS CALCULATOR - Fixed Version
(() => {
    let initialized = false;
    let currentLanguage = 'en';
    let multiplier = 1;

    const translations = {
        en: {
            title: "🐾 RCU Pets Calculator",
            settings: "Settings",
            inputLabel: "Base Pet Stats",
            inputPlaceholder: "Enter base stats...",
            resultLabel: "Final Stats",
            calculateBtn: "Calculate",
            shiny: "✨ Shiny",
            normal: "⚪ Normal",
            golden: "🟡 Golden",
            toxic: "🟢 Toxic",
            galaxy: "🌌 Galaxy",
            errors: { invalidInput: "Please enter a valid number" }
        },
        uk: {
            title: "🐾 RCU Калькулятор Петів",
            settings: "Налаштування",
            inputLabel: "Базові Стати Пета",
            inputPlaceholder: "Введіть базові стати...",
            resultLabel: "Фінальні Стати",
            calculateBtn: "Розрахувати",
            shiny: "✨ Сяючий",
            normal: "⚪ Звичайний",
            golden: "🟡 Золотий",
            toxic: "🟢 Токсичний",
            galaxy: "🌌 Галактичний",
            errors: { invalidInput: "Будь ласка, введіть дійсне число" }
        },
        ru: {
            title: "🐾 RCU Калькулятор Петов",
            settings: "Настройки",
            inputLabel: "Базовые Статы Пета",
            inputPlaceholder: "Введите базовые статы...",
            resultLabel: "Финальные Статы",
            calculateBtn: "Рассчитать",
            shiny: "✨ Сияющий",
            normal: "⚪ Обычный",
            golden: "🟡 Золотой",
            toxic: "🟢 Токсичный",
            galaxy: "🌌 Галактический",
            errors: { invalidInput: "Пожалуйста, введите действительное число" }
        }
    };

    const rarityModifiers = {
        shiny: 1.5,
        normal: 1,
        golden: 2,
        toxic: 4,
        galaxy: 8
    };

    // Групи взаємовиключних рідкостей
    const exclusiveGroups = {
        mainRarity: ['normal', 'golden', 'toxic', 'galaxy'] // Тільки одна з цих рідкостей
    };

    const getAppLanguage = () => 
        typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : localStorage.getItem('selectedLanguage') || 'en';

    const findContainer = () => {
        // Спробуємо знайти контейнер з різними можливими ID
        const possibleIds = ['petscalcPage', 'petsCalcPage', 'petscalc-page'];
        
        for (const id of possibleIds) {
            const container = document.getElementById(id);
            if (container) {
                console.log(`✅ Found container: #${id}`);
                return container;
            }
        }
        
        // Якщо не знайшли по ID, спробуємо по класу
        const containerByClass = document.querySelector('.pets-calc-page');
        if (containerByClass) {
            console.log('✅ Found container by class: .pets-calc-page');
            return containerByClass;
        }
        
        console.error('❌ Container not found! Tried:', possibleIds);
        return null;
    };

    const createHTML = () => {
        const page = findContainer();
        if (!page) {
            console.error('❌ Container not found!');
            return;
        }

        const t = translations[currentLanguage] || translations.en;
        const rarities = ['normal', 'golden', 'toxic', 'galaxy', 'shiny'];
        const mods = [1, 2, 4, 8, 1.5];

        page.innerHTML = `
            <div class="header-controls">
                <h1>${t.title}</h1>
                <button class="settings-btn" onclick="togglePetsCalcSettings()">⚙️</button>
            </div>
            <div class="settings-panel" id="settingsPanelPetsCalc">
                <div class="settings-title">${t.settings}</div>
                ${rarities.slice(0, 4).map((id, i) => `
                    <div class="simple-toggle">
                        <div class="toggle-info">
                            <div class="toggle-label ${id}">${t[id]}</div>
                            <div class="toggle-multiplier">(x${mods[i]})</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="${id}" ${i === 0 ? 'checked' : ''} onchange="handleRaritySelection('${id}')">
                            <span class="slider"></span>
                        </label>
                    </div>
                `).join('')}
                <div style="border-top: 2px solid rgba(0, 217, 255, 0.5); margin: 15px 0; padding-top: 15px;">
                    <div class="simple-toggle">
                        <div class="toggle-info">
                            <div class="toggle-label shiny">${t.shiny}</div>
                            <div class="toggle-multiplier">(x${mods[4]})</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="shiny" onchange="handleRaritySelection('shiny')">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="input-section">
                <label class="input-label" for="petsCalcNumberInput">${t.inputLabel}</label>
                <input type="number" class="number-input" id="petsCalcNumberInput" placeholder="${t.inputPlaceholder}" step="any" oninput="calculatePetsCalcStats()">
                <button class="calculate-btn" onclick="calculatePetsCalcStats()">${t.calculateBtn}</button>
                <div class="error" id="petsCalcErrorMessage"></div>
            </div>
            <div class="result-section" id="petsCalcResultSection">
                <div class="stats-label">${t.resultLabel}</div>
                <div class="result-value" id="petsCalcResultValue">0</div>
            </div>
        `;

        console.log('✅ Pets Calculator HTML created');
    };

    const addEventListeners = () => {
        document.addEventListener('languageChanged', e => {
            if (e.detail && e.detail.language) {
                updateLanguage(e.detail.language);
            }
        });
        
        setTimeout(() => {
            const input = document.getElementById('petsCalcNumberInput');
            if (input) {
                input.addEventListener('keypress', e => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        calculate();
                    }
                });
                
                input.addEventListener('input', () => {
                    const err = document.getElementById('petsCalcErrorMessage');
                    if (err) err.textContent = '';
                });
            }
        }, 100);
    };

    const updateLanguage = lang => {
        console.log('🌍 Updating Pets Calculator language to:', lang);
        currentLanguage = translations[lang] ? lang : 'en';
        createHTML();
        addEventListeners();
        updateMultiplier();
        console.log('✅ Language updated to:', currentLanguage);
    };

    const toggleSettings = () => {
        const panel = document.getElementById('settingsPanelPetsCalc');
        if (panel) {
            panel.classList.toggle('show');
            console.log('⚙️ Settings toggled:', panel.classList.contains('show') ? 'opened' : 'closed');
        } else {
            console.warn('⚠️ Settings panel not found');
        }
    };

    const handleSelection = selectedId => {
        console.log('🔄 Rarity selected:', selectedId);
        
        // Перевіряємо, чи вибрана рідкість належить до основної групи
        const isMainRarity = exclusiveGroups.mainRarity.includes(selectedId);
        
        if (isMainRarity) {
            // Якщо вибрали одну з основних рідкостей (Normal, Golden, Toxic, Galaxy),
            // вимикаємо всі інші з цієї групи
            exclusiveGroups.mainRarity.forEach(id => {
                if (id !== selectedId) {
                    const cb = document.getElementById(id);
                    if (cb && cb.checked) {
                        cb.checked = false;
                        console.log(`❌ Disabled ${id} (exclusive with ${selectedId})`);
                    }
                }
            });
        }
        
        // Shiny може бути включений разом з будь-якою основною рідкістю
        
        updateMultiplier();
    };

    const updateMultiplier = () => {
        multiplier = 1;
        const activeRarities = [];
        
        // Збираємо всі активні рідкості
        for (const id in rarityModifiers) {
            const cb = document.getElementById(id);
            if (cb?.checked) {
                activeRarities.push(id);
            }
        }
        
        // Перевіряємо, чи вибрана хоча б одна основна рідкість
        const activeMainRarities = activeRarities.filter(id => 
            exclusiveGroups.mainRarity.includes(id)
        );
        
        // Перевіряємо, чи немає більше однієї основної рідкості
        if (activeMainRarities.length > 1) {
            console.warn('⚠️ Multiple main rarities detected, keeping only the first one');
            // Вимикаємо всі крім першої
            activeMainRarities.slice(1).forEach(id => {
                const cb = document.getElementById(id);
                if (cb) cb.checked = false;
                activeRarities.splice(activeRarities.indexOf(id), 1);
            });
        }
        
        // Якщо немає жодної основної рідкості, встановлюємо Normal
        if (activeMainRarities.length === 0) {
            const normalCb = document.getElementById('normal');
            if (normalCb) {
                normalCb.checked = true;
                activeRarities.push('normal');
            }
        }
        
        // Множимо всі активні модифікатори
        activeRarities.forEach(id => {
            multiplier *= rarityModifiers[id];
        });
        
        console.log(`📊 Active rarities: [${activeRarities.join(', ')}] → Multiplier: x${multiplier}`);
        
        calculate();
    };

    const calculate = () => {
        const input = document.getElementById('petsCalcNumberInput');
        const section = document.getElementById('petsCalcResultSection');
        const value = document.getElementById('petsCalcResultValue');
        const error = document.getElementById('petsCalcErrorMessage');

        if (!input || !section || !value || !error) {
            console.warn('⚠️ Elements not found for calculation');
            return;
        }

        const t = translations[currentLanguage] || translations.en;
        error.textContent = '';

        const base = parseFloat(input.value);

        if (isNaN(base) || !input.value.trim()) {
            if (input.value.trim()) {
                error.textContent = t.errors?.invalidInput || 'Please enter a valid number';
            }
            section.classList.remove('show');
            return;
        }

        const final = base * multiplier;
        value.textContent = final.toLocaleString('uk-UA', {
            minimumFractionDigits: final % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 8
        });

        console.log(`🧮 Calculation: ${base} x ${multiplier} = ${final}`);
        
        setTimeout(() => section.classList.add('show'), 100);
    };

    const init = () => {
        if (initialized) {
            console.warn('⚠️ Pets Calculator already initialized');
            return;
        }
        
        console.log('🚀 Initializing RCU Pets Calculator...');
        
        const container = findContainer();
        if (!container) {
            console.error('❌ Cannot initialize - container not found');
            return;
        }
        
        currentLanguage = getAppLanguage();
        console.log('🌍 Using language:', currentLanguage);
        
        createHTML();
        addEventListeners();
        updateMultiplier();
        
        initialized = true;
        console.log('✅ RCU Pets Calculator fully initialized');
    };

    // Auto-init when DOM ready
    const tryInit = () => {
        const container = findContainer();
        if (container) {
            init();
        } else {
            console.log('⏳ Container not ready, waiting...');
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('📄 DOM ready, checking for container...');
            setTimeout(tryInit, 100);
        });
    } else {
        console.log('📄 DOM already loaded, checking for container...');
        setTimeout(tryInit, 100);
    }

    // Listen for page changes
    document.addEventListener('pageChanged', (e) => {
        if (e.detail && e.detail.page === 'petscalc' && !initialized) {
            console.log('📄 Page changed to petscalc, attempting init...');
            setTimeout(tryInit, 200);
        }
    });

    // Global exports
    window.initializePetsCalc = init;
    window.calculatePetsCalcStats = calculate;
    window.updatePetsCalcLanguage = updateLanguage;
    window.togglePetsCalcSettings = toggleSettings;
    window.handleRaritySelection = handleSelection;
    window.updatePetsCalcMultiplier = updateMultiplier;

    console.log('✅ RCU Pets Calculator module loaded');
})();
