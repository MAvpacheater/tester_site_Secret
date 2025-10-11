// ROULETTE CALCULATOR - Optimized
(() => {
    let initialized = false;
    let currentLanguage = 'en';

    const translations = {
        en: {
            title: "🎰 Roulette Calculator",
            totalSpins: "Total Spins Needed:",
            spinsPerTurn: "Spins per Turn:",
            calculateBtn: "Calculate Time",
            resultTitle: "Total Time Needed:",
            totalSpinsPlaceholder: "Enter total spins needed...",
            spinsPerTurnPlaceholder: "Enter spins per turn...",
            second: "s", minute: "m", hour: "h", day: "d",
            errors: {
                invalidInput: "Please enter valid positive numbers",
                missingFields: "Please enter both values",
                zeroSpins: "Spins per turn cannot be zero"
            }
        },
        uk: {
            title: "🎰 Калькулятор Рулетки",
            totalSpins: "Загальна Кількість Спінів:",
            spinsPerTurn: "Спінів за Хід:",
            calculateBtn: "Розрахувати Час",
            resultTitle: "Загальний Час:",
            totalSpinsPlaceholder: "Введіть загальну кількість спінів...",
            spinsPerTurnPlaceholder: "Введіть спінів за хід...",
            second: "с", minute: "хв", hour: "г", day: "д",
            errors: {
                invalidInput: "Будь ласка, введіть дійсні позитивні числа",
                missingFields: "Будь ласка, введіть обидва значення",
                zeroSpins: "Спінів за хід не може бути нуль"
            }
        },
        ru: {
            title: "🎰 Калькулятор Рулетки",
            totalSpins: "Общее Количество Спинов:",
            spinsPerTurn: "Спинов за Ход:",
            calculateBtn: "Рассчитать Время",
            resultTitle: "Общее Время:",
            totalSpinsPlaceholder: "Введите общее количество спинов...",
            spinsPerTurnPlaceholder: "Введите спинов за ход...",
            second: "с", minute: "м", hour: "ч", day: "д",
            errors: {
                invalidInput: "Пожалуйста, введите действительные положительные числа",
                missingFields: "Пожалуйста, введите оба значения",
                zeroSpins: "Спинов за ход не может быть ноль"
            }
        }
    };

    const getAppLanguage = () => 
        typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : localStorage.getItem('selectedLanguage') || 'en';

    const createHTML = () => {
        const page = document.getElementById('roulettePage');
        if (!page) return;

        const t = translations[currentLanguage] || translations.en;

        page.innerHTML = `
            <div class="header-controls">
                <h1>${t.title}</h1>
            </div>
            <div class="input-section">
                <div class="input-group">
                    <label class="input-label" for="totalSpinsInput">${t.totalSpins}</label>
                    <input type="number" class="number-input" id="totalSpinsInput" placeholder="${t.totalSpinsPlaceholder}" step="1" min="1" oninput="calculateRouletteTime()">
                </div>
                <div class="input-group">
                    <label class="input-label" for="spinsPerTurnInput">${t.spinsPerTurn}</label>
                    <input type="number" class="number-input" id="spinsPerTurnInput" placeholder="${t.spinsPerTurnPlaceholder}" step="1" min="1" oninput="calculateRouletteTime()">
                </div>
                <button class="calculate-btn" onclick="calculateRouletteTime()">${t.calculateBtn}</button>
                <div class="error" id="rouletteErrorMessage"></div>
            </div>
            <div class="result-section" id="rouletteResultSection">
                <div class="stats-label">${t.resultTitle}</div>
                <div class="result-value" id="rouletteResultValue">0</div>
            </div>
        `;
    };

    const addEventListeners = () => {
        document.addEventListener('languageChanged', e => updateLanguage(e.detail.language));
        
        setTimeout(() => {
            ['totalSpinsInput', 'spinsPerTurnInput'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener('input', calculate);
                    el.addEventListener('keypress', e => e.key === 'Enter' && (e.preventDefault(), calculate()));
                }
            });
        }, 100);
    };

    const updateLanguage = lang => {
        currentLanguage = translations[lang] ? lang : 'en';
        createHTML();
        addEventListeners();
    };

    const formatTime = seconds => {
        const t = translations[currentLanguage] || translations.en;
        const u = { s: t.second, m: t.minute, h: t.hour, d: t.day };
        
        if (seconds < 60) return `${Math.ceil(seconds)}${u.s}`;
        
        if (seconds < 3600) {
            const m = Math.floor(seconds / 60);
            const s = Math.ceil(seconds % 60);
            return s === 0 ? `${m}${u.m}` : `${m}${u.m} ${s}${u.s}`;
        }
        
        if (seconds < 86400) {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.ceil(seconds % 60);
            let result = `${h}${u.h}`;
            if (m > 0) result += ` ${m}${u.m}`;
            else if (s > 0) result += ` ${s}${u.s}`;
            return result;
        }
        
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        let result = `${d}${u.d}`;
        if (h > 0) result += ` ${h}${u.h}`;
        else if (m > 0) result += ` ${m}${u.m}`;
        return result;
    };

    const calculate = () => {
        const totalInput = document.getElementById('totalSpinsInput');
        const spinsInput = document.getElementById('spinsPerTurnInput');
        const value = document.getElementById('rouletteResultValue');
        const error = document.getElementById('rouletteErrorMessage');
        const section = document.getElementById('rouletteResultSection');
        
        if (!totalInput || !spinsInput || !value || !error || !section) return;
        
        const t = translations[currentLanguage] || translations.en;
        
        error.textContent = '';
        error.style.display = 'none';
        value.textContent = '0';
        
        const total = parseFloat(totalInput.value || 0);
        const spins = parseFloat(spinsInput.value || 0);
        
        if (!totalInput.value.trim() || !spinsInput.value.trim()) {
            if (t.errors?.missingFields) {
                error.textContent = t.errors.missingFields;
                error.style.display = 'block';
            }
            section.classList.remove('show-result');
            return;
        }
        
        if (total <= 0 || spins <= 0 || isNaN(total) || isNaN(spins)) {
            if (t.errors?.invalidInput) {
                error.textContent = t.errors.invalidInput;
                error.style.display = 'block';
            }
            section.classList.remove('show-result');
            return;
        }
        
        if (spins === 0) {
            if (t.errors?.zeroSpins) {
                error.textContent = t.errors.zeroSpins;
                error.style.display = 'block';
            }
            section.classList.remove('show-result');
            return;
        }
        
        const totalTurns = total / spins;
        const totalSeconds = totalTurns * 6;
        
        value.textContent = formatTime(totalSeconds);
        setTimeout(() => section.classList.add('show-result'), 100);
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
            if (document.getElementById('roulettePage')) init();
        });
    } else if (document.getElementById('roulettePage')) {
        init();
    }

    document.addEventListener('pageChanged', e => {
        if (e.detail.pageId === 'roulettePage' && !initialized) init();
    });

    // Global exports
    window.initializeRoulette = init;
    window.calculateRouletteTime = calculate;
    window.updateRouletteLanguage = updateLanguage;
})();
