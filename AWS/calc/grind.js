// GRIND CALCULATOR - Optimized
(() => {
    let initialized = false;
    let currentLanguage = 'en';
    let grindMultiplier = 1;
    let friendBoostCount = 8;

    const translations = {
        en: {
            title: "💪 Grind Calculator",
            inputLabel: "Enter Base Value:",
            inputPlaceholder: "Enter your base grind value...",
            resultLabel: "Final Grind Value:",
            errorInvalidNumber: "Please enter a valid number",
            settingsTitle: "Grind Modifiers",
            calculate: "Calculate",
            categoryTP: "🚀 TP Boosts",
            categoryFood: "🍪 Food Boosts",
            categoryOther: "⚡ Other Boosts"
        },
        uk: {
            title: "💪 Калькулятор Фарму",
            inputLabel: "Введіть Базове Значення:",
            inputPlaceholder: "Введіть ваше базове значення фарму...",
            resultLabel: "Фінальне Значення Фарму:",
            errorInvalidNumber: "Будь ласка, введіть дійсне число",
            settingsTitle: "Модифікатори Фарму",
            calculate: "Розрахувати",
            categoryTP: "🚀 TP Бусти",
            categoryFood: "🍪 Їжа Бусти",
            categoryOther: "⚡ Інші Бусти"
        },
        ru: {
            title: "💪 Калькулятор Фарма",
            inputLabel: "Введите Базовое Значение:",
            inputPlaceholder: "Введите ваше базовое значение фарма...",
            resultLabel: "Финальное Значение Фарма:",
            errorInvalidNumber: "Пожалуйста, введите действительное число",
            settingsTitle: "Модификаторы Фарма",
            calculate: "Рассчитать",
            categoryTP: "🚀 TP Бусты",
            categoryFood: "🍪 Еда Бусты",
            categoryOther: "⚡ Другие Бусты"
        }
    };

    const modifiers = {
        tp1: 1.30, tp2: 1.60, tp3: 1.90,
        chocolate_donut_1: 1.05, chocolate_donut_2: 1.10, chocolate_donut_3: 1.15,
        ench_cookie_1: 1.03, ench_cookie_2: 1.05, ench_cookie_3: 1.07,
        time: 2.7, member: 2.0, premium: 1.20, strength_star: 1.50, sandstorm_event: 1.3
    };

    const getAppLanguage = () => 
        typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : localStorage.getItem('selectedLanguage') || 'en';

    const createHTML = () => {
        const page = document.getElementById('grindPage');
        if (!page) return;

        const t = translations[currentLanguage] || translations.en;

        page.innerHTML = `
            <div class="header-controls">
                <h1>${t.title}</h1>
                <button class="settings-btn" onclick="toggleGrindSettings()">⚙️</button>
            </div>
            <div class="settings-panel" id="settingsPanelGrind">
                <h3 class="settings-title">${t.settingsTitle}</h3>
                ${createCategory('tp', t.categoryTP, [
                    { id: 'tp1', label: 'TP1', mult: '+30%' },
                    { id: 'tp2', label: 'TP2', mult: '+60%' },
                    { id: 'tp3', label: 'TP3', mult: '+90%' }
                ], 'handleTpSelection')}
                ${createCategory('food', t.categoryFood, [
                    { id: 'chocolate_donut_1', label: 'Pink Donut L1', mult: '+5%' },
                    { id: 'chocolate_donut_2', label: 'Vanila Donut L2', mult: '+10%' },
                    { id: 'chocolate_donut_3', label: 'Chocolate Donut L3', mult: '+15%' },
                    { id: 'ench_cookie_1', label: 'Cookie', mult: '+3%' },
                    { id: 'ench_cookie_2', label: 'Tasty Cookie', mult: '+5%' },
                    { id: 'ench_cookie_3', label: 'Enchanted Cookie', mult: '+7%' }
                ], 'handleFoodSelection')}
                ${createCategory('other', t.categoryOther, [
                    { id: 'time', label: 'Time Boost', mult: '+170%' },
                    { id: 'member', label: 'Member', mult: '2x' },
                    { id: 'premium', label: 'Premium', mult: '+20%' },
                    { id: 'strength_star', label: 'Strength Star', mult: '+50%' },
                    { id: 'sandstorm_event', label: 'Sandstorm Event', mult: '2x' }
                ], 'updateGrindMultiplier', true)}
            </div>
            <div class="input-section">
                <label class="input-label" for="numberInputGrind">${t.inputLabel}</label>
                <input type="number" class="number-input" id="numberInputGrind" placeholder="${t.inputPlaceholder}" step="any">
                <button class="calculate-btn" onclick="calculateGrindStats()">${t.calculate}</button>
            </div>
            <div class="result-section" id="resultSectionGrind">
                <p class="stats-label">${t.resultLabel}</p>
                <p class="result-value" id="resultValueGrind">0</p>
                <p class="error" id="errorMessageGrind"></p>
            </div>
        `;
    };

    const createCategory = (id, title, items, handler, includeFriendBoost = false) => {
        const content = items.map(item => {
            const onChange = id === 'tp' ? `${handler}('${item.id}')` :
                           id === 'food' ? `${handler}('${item.id}', '${item.id.includes('donut') ? 'donut' : 'cookie'}')` :
                           handler;
            return `
                <div class="simple-toggle">
                    <div class="toggle-info">
                        <div class="toggle-label">${item.label}</div>
                        <div class="toggle-multiplier">(${item.mult})</div>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="${item.id}" onchange="${onChange}()">
                        <span class="slider"></span>
                    </label>
                </div>`;
        }).join('');

        const friendBoost = includeFriendBoost ? `
            <div class="simple-toggle">
                <div class="toggle-info">
                    <div class="toggle-label">Friend Boost</div>
                    <div class="toggle-multiplier">(120%)</div>
                </div>
                <div class="friend-counter">
                    <button class="friend-btn" id="friendDownBtn" onclick="decreaseFriendBoost()">-</button>
                    <div class="friend-display" id="friendDisplay">120%</div>
                    <button class="friend-btn" id="friendUpBtn" onclick="increaseFriendBoost()">+</button>
                </div>
            </div>` : '';

        return `
            <div class="modifier-category">
                <div class="category-header-modifier collapsed" onclick="toggleGrindCategory('${id}Content')">
                    <div class="category-title-modifier"><span>${title}</span></div>
                    <span class="category-toggle-modifier">▼</span>
                </div>
                <div class="category-content" id="${id}Content">${content}${friendBoost}</div>
            </div>`;
    };

    const toggleGrindCategory = id => {
        const content = document.getElementById(id);
        const header = document.querySelector(`[onclick="toggleGrindCategory('${id}')"]`);
        if (!content || !header) return;

        const isExpanded = content.classList.contains('expanded');

        document.querySelectorAll('.modifier-category .category-content').forEach(c => c.classList.remove('expanded'));
        document.querySelectorAll('.category-header-modifier').forEach(h => {
            h.classList.remove('expanded');
            h.classList.add('collapsed');
            h.querySelector('.category-toggle-modifier')?.classList.remove('expanded');
        });

        if (!isExpanded) {
            content.classList.add('expanded');
            header.classList.remove('collapsed');
            header.classList.add('expanded');
            header.querySelector('.category-toggle-modifier')?.classList.add('expanded');
        }
    };

    const toggleGrindSettings = () => document.getElementById('settingsPanelGrind')?.classList.toggle('show');

    const handleTpSelection = selected => {
        const checkbox = document.getElementById(selected);
        if (!checkbox?.checked) {
            updateGrindMultiplier();
            return;
        }
        ['tp1', 'tp2', 'tp3'].forEach(id => {
            if (id !== selected) document.getElementById(id).checked = false;
        });
        updateGrindMultiplier();
    };

    const handleFoodSelection = (selected, category) => {
        const checkbox = document.getElementById(selected);
        if (!checkbox?.checked) {
            updateGrindMultiplier();
            return;
        }
        const group = category === 'donut' 
            ? ['chocolate_donut_1', 'chocolate_donut_2', 'chocolate_donut_3']
            : ['ench_cookie_1', 'ench_cookie_2', 'ench_cookie_3'];
        group.forEach(id => {
            if (id !== selected) document.getElementById(id).checked = false;
        });
        updateGrindMultiplier();
    };

    const updateFriendDisplay = () => {
        const display = document.getElementById('friendDisplay');
        const upBtn = document.getElementById('friendUpBtn');
        const downBtn = document.getElementById('friendDownBtn');
        
        if (display) display.textContent = `${friendBoostCount * 15}%`;
        if (upBtn) upBtn.disabled = friendBoostCount >= 8;
        if (downBtn) downBtn.disabled = friendBoostCount <= 0;
    };

    const increaseFriendBoost = () => {
        if (friendBoostCount < 8) {
            friendBoostCount++;
            updateFriendDisplay();
            calculateGrindStats();
        }
    };

    const decreaseFriendBoost = () => {
        if (friendBoostCount > 0) {
            friendBoostCount--;
            updateFriendDisplay();
            calculateGrindStats();
        }
    };

    const updateGrindMultiplier = () => {
        grindMultiplier = 1;
        for (const id in modifiers) {
            const checkbox = document.getElementById(id);
            if (checkbox?.checked) grindMultiplier *= modifiers[id];
        }
        calculateGrindStats();
    };

    const calculateFriendBonus = base => {
        let result = base;
        for (let i = 0; i < friendBoostCount; i++) result *= 1.15;
        return result;
    };

    const calculateGrindStats = () => {
        const els = {
            input: document.getElementById('numberInputGrind'),
            section: document.getElementById('resultSectionGrind'),
            value: document.getElementById('resultValueGrind'),
            error: document.getElementById('errorMessageGrind')
        };

        if (!els.input || !els.section || !els.value || !els.error) return;

        els.error.textContent = '';
        const base = parseFloat(els.input.value);

        if (isNaN(base) || !els.input.value.trim()) {
            if (els.input.value.trim()) {
                const t = translations[currentLanguage] || translations.en;
                els.error.textContent = t.errorInvalidNumber;
            }
            els.section.classList.remove('show');
            return;
        }

        let final = base * grindMultiplier;
        if (friendBoostCount > 0) final = calculateFriendBonus(final);

        els.value.textContent = final.toLocaleString('uk-UA', {
            minimumFractionDigits: final % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 8
        });

        els.section.classList.add('show');
    };

    const updateLanguage = lang => {
        currentLanguage = translations[lang] ? lang : 'en';
        createHTML();
        addEventListeners();
        updateFriendDisplay();
    };

    const addEventListeners = () => {
        document.addEventListener('languageChanged', e => updateLanguage(e.detail.language));
        
        requestAnimationFrame(() => {
            const input = document.getElementById('numberInputGrind');
            if (input) {
                input.addEventListener('keypress', e => e.key === 'Enter' && calculateGrindStats());
                input.addEventListener('input', () => {
                    document.getElementById('errorMessageGrind').textContent = '';
                });
            }
        });
    };

    const init = () => {
        if (initialized) return;
        currentLanguage = getAppLanguage();
        createHTML();
        addEventListeners();
        updateGrindMultiplier();
        updateFriendDisplay();
        initialized = true;
    };

    const autoInit = () => document.getElementById('grindPage') && init();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        autoInit();
    }

    Object.assign(window, {
        initializeGrind: init,
        updateGrindLanguage: updateLanguage,
        toggleGrindSettings,
        toggleGrindCategory,
        handleTpSelection,
        handleFoodSelection,
        increaseFriendBoost,
        decreaseFriendBoost,
        updateGrindMultiplier,
        calculateGrindStats
    });
})();
