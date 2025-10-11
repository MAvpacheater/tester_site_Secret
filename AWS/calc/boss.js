// BOSS CALCULATOR - Optimized
(() => {
    let initialized = false;
    let currentLanguage = 'en';

    const translations = {
        en: {
            title: "👹 Boss Calculator",
            totalNeeded: "Total Needed to Collect:",
            rewardPerWin: "Reward per Victory:",
            vipAutoclicker: "VIP + Autoclicker",
            vipDescription: "(2.5s vs 4.5s)",
            calculateBtn: "Calculate Time",
            resultTitle: "Total Time Needed:",
            totalNeededPlaceholder: "Enter total amount needed...",
            rewardPerWinPlaceholder: "Enter reward per win...",
            errors: {
                invalidInput: "Please enter valid positive numbers",
                missingFields: "Please fill in both fields"
            }
        },
        uk: {
            title: "👹 Калькулятор Боса",
            totalNeeded: "Всього Потрібно Зібрати:",
            rewardPerWin: "Нагорода за Перемогу:",
            vipAutoclicker: "VIP + Автоклікер",
            vipDescription: "(2.5с проти 4.5с)",
            calculateBtn: "Розрахувати Час",
            resultTitle: "Загальний Час:",
            totalNeededPlaceholder: "Введіть загальну кількість...",
            rewardPerWinPlaceholder: "Введіть нагороду за перемогу...",
            errors: {
                invalidInput: "Будь ласка, введіть дійсні позитивні числа",
                missingFields: "Будь ласка, заповніть обидва поля"
            }
        },
        ru: {
            title: "👹 Калькулятор Босса",
            totalNeeded: "Всего Нужно Собрать:",
            rewardPerWin: "Награда за Победу:",
            vipAutoclicker: "VIP + Автокликер",
            vipDescription: "(2.5с против 4.5с)",
            calculateBtn: "Рассчитать Время",
            resultTitle: "Общее Время:",
            totalNeededPlaceholder: "Введите общее количество...",
            rewardPerWinPlaceholder: "Введите награду за победу...",
            errors: {
                invalidInput: "Пожалуйста, введите действительные положительные числа",
                missingFields: "Пожалуйста, заполните оба поля"
            }
        }
    };

    const getAppLanguage = () => 
        typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : localStorage.getItem('selectedLanguage') || 'en';

    const createHTML = () => {
        const page = document.getElementById('bossPage');
        if (!page) return;

        const t = translations[currentLanguage] || translations.en;

        page.innerHTML = `
            <div class="header-controls">
                <h1>${t.title}</h1>
            </div>
            <div class="input-section">
                <label class="input-label" for="totalNeededInput">${t.totalNeeded}</label>
                <input type="number" class="number-input" id="totalNeededInput" placeholder="${t.totalNeededPlaceholder}" step="1" min="1">
                <label class="input-label" for="rewardPerWinInput">${t.rewardPerWin}</label>
                <input type="number" class="number-input" id="rewardPerWinInput" placeholder="${t.rewardPerWinPlaceholder}" step="1" min="1">
                <div class="simple-toggle">
                    <div class="toggle-info">
                        <div class="toggle-label">${t.vipAutoclicker}</div>
                        <div class="toggle-multiplier">${t.vipDescription}</div>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="vipAutoclicker">
                        <span class="slider"></span>
                    </label>
                </div>
                <button class="calculate-btn" onclick="calculateBossTime()">${t.calculateBtn}</button>
                <div class="error" id="bossErrorMessage"></div>
            </div>
            <div class="result-section" id="bossResultSection">
                <div class="stats-label">${t.resultTitle}</div>
                <div class="result-value" id="bossResultValue">0</div>
            </div>
        `;
    };

    const addEventListeners = () => {
        document.addEventListener('languageChanged', e => updateLanguage(e.detail.language));
        
        setTimeout(() => {
            ['totalNeededInput', 'rewardPerWinInput', 'vipAutoclicker'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', calculate);
            });
        }, 100);
    };

    const updateLanguage = lang => {
        currentLanguage = translations[lang] ? lang : 'en';
        createHTML();
        addEventListeners();
    };

    const formatTime = seconds => {
        if (seconds < 60) return `${Math.round(seconds * 10) / 10}s`;
        
        if (seconds < 3600) {
            const m = Math.floor(seconds / 60);
            const s = Math.round(seconds % 60);
            return s === 0 ? `${m}m` : `${m}m ${s}s`;
        }
        
        if (seconds < 86400) {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            return m === 0 ? `${h}h` : `${h}h ${m}m`;
        }
        
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        return h === 0 ? `${d}d` : `${d}d ${h}h`;
    };

    const calculate = () => {
        const totalInput = document.getElementById('totalNeededInput');
        const rewardInput = document.getElementById('rewardPerWinInput');
        const vipInput = document.getElementById('vipAutoclicker');
        const error = document.getElementById('bossErrorMessage');
        const section = document.getElementById('bossResultSection');
        const value = document.getElementById('bossResultValue');
        
        if (!totalInput || !rewardInput || !vipInput || !error || !section || !value) return;
        
        const t = translations[currentLanguage] || translations.en;
        const total = parseFloat(totalInput.value);
        const reward = parseFloat(rewardInput.value);
        const hasVip = vipInput.checked;
        
        error.textContent = '';
        
        if (!totalInput.value || !rewardInput.value) {
            if (t.errors?.missingFields) error.textContent = t.errors.missingFields;
            section.classList.remove('show');
            return;
        }
        
        if (isNaN(total) || total <= 0 || isNaN(reward) || reward <= 0) {
            if (t.errors?.invalidInput) error.textContent = t.errors.invalidInput;
            section.classList.remove('show');
            return;
        }
        
        const victories = Math.ceil(total / reward);
        const timePerVictory = hasVip ? 2.5 : 4.5;
        const totalSeconds = victories * timePerVictory;
        
        value.textContent = formatTime(totalSeconds);
        setTimeout(() => section.classList.add('show'), 100);
    };

    const init = () => {
        if (initialized) return;
        currentLanguage = getAppLanguage();
        createHTML();
        addEventListeners();
        initialized = true;
    };

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.getElementById('bossPage')) init();
        });
    } else if (document.getElementById('bossPage')) {
        init();
    }

    // Global exports
    window.initializeBoss = init;
    window.calculateBossTime = calculate;
    window.updateBossLanguage = updateLanguage;
})();
