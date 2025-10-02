// Grind Calculator functionality with category toggles

// Translations stored directly in JS
const grindCalcTranslations = {
    en: {
        common: { 
            calculate: "Calculate", 
            settings: "Settings" 
        },
        grind: {
            title: "💪 Grind Calculator",
            inputLabel: "Enter Base Value:",
            inputPlaceholder: "Enter your base grind value...",
            resultLabel: "Final Grind Value:",
            errorInvalidNumber: "Please enter a valid number",
            settingsTitle: "Grind Modifiers",
            categoryTP: "🚀 TP Boosts",
            categoryFood: "🍪 Food Boosts",
            categoryOther: "⚡ Other Boosts",
            timeBoost: "Time Boost",
            member: "Member",
            premium: "Premium",
            strengthStar: "Strength Star",
            sandstormEvent: "Sandstorm Event",
            friendBoost: "Friend Boost",
            pinkDonut: "Pink Donut L1",
            vanillaDonut: "Vanila Donut L2",
            chocolateDonut: "Chocolate Donut L3",
            cookie: "Cookie",
            tastyCookie: "Tasty Cookie",
            enchantedCookie: "Enchanted Cookie"
        }
    },
    uk: {
        common: { 
            calculate: "Розрахувати", 
            settings: "Налаштування" 
        },
        grind: {
            title: "💪 Калькулятор Фарму",
            inputLabel: "Введіть Базове Значення:",
            inputPlaceholder: "Введіть ваше базове значення фарму...",
            resultLabel: "Фінальне Значення Фарму:",
            errorInvalidNumber: "Будь ласка, введіть дійсне число",
            settingsTitle: "Модифікатори Фарму",
            categoryTP: "🚀 TP Бусти",
            categoryFood: "🍪 Їжа Бусти",
            categoryOther: "⚡ Інші Бусти",
            timeBoost: "Тайм Буст",
            member: "Мембер",
            premium: "Преміум",
            strengthStar: "Зірка Сили",
            sandstormEvent: "Подія Піщаної Бурі",
            friendBoost: "Буст Друзів",
            pinkDonut: "Рожевий Пончик L1",
            vanillaDonut: "Ванільний Пончик L2",
            chocolateDonut: "Шоколадний Пончик L3",
            cookie: "Печиво",
            tastyCookie: "Смачне Печиво",
            enchantedCookie: "Зачароване Печиво"
        }
    },
    ru: {
        common: { 
            calculate: "Рассчитать", 
            settings: "Настройки" 
        },
        grind: {
            title: "💪 Калькулятор Фарма",
            inputLabel: "Введите Базовое Значение:",
            inputPlaceholder: "Введите ваше базовое значение фарма...",
            resultLabel: "Финальное Значение Фарма:",
            errorInvalidNumber: "Пожалуйста, введите действительное число",
            settingsTitle: "Модификаторы Фарма",
            categoryTP: "🚀 TP Бусты",
            categoryFood: "🍪 Еда Бусты",
            categoryOther: "⚡ Другие Бусты",
            timeBoost: "Тайм Буст",
            member: "Мембер",
            premium: "Премиум",
            strengthStar: "Звезда Силы",
            sandstormEvent: "Событие Песчаной Бури",
            friendBoost: "Буст Друзей",
            pinkDonut: "Розовый Пончик L1",
            vanillaDonut: "Ванильный Пончик L2",
            chocolateDonut: "Шоколадный Пончик L3",
            cookie: "Печенье",
            tastyCookie: "Вкусное Печенье",
            enchantedCookie: "Зачарованное Печенье"
        }
    }
};

let currentGrindLanguage = 'en';

// Update grind calculator language
function updateGrindLanguage(lang) {
    currentGrindLanguage = lang;
    
    if (!grindCalcTranslations[lang]) {
        console.error(`❌ Grind calculator language ${lang} not found, defaulting to English`);
        currentGrindLanguage = 'en';
    }
    
    const translations = grindCalcTranslations[currentGrindLanguage];
    if (!translations || !translations.grind) return;
    
    // Update grind calculator elements
    const title = document.querySelector('#grindPage h1');
    const inputLabel = document.querySelector('#grindPage .input-label');
    const inputField = document.getElementById('numberInputGrind');
    const calculateBtn = document.querySelector('#grindPage .calculate-btn');
    const resultLabel = document.querySelector('#grindPage .stats-label');
    const settingsTitle = document.querySelector('#settingsPanelGrind .settings-title');
    
    if (title && translations.grind.title) {
        title.textContent = translations.grind.title;
    }
    
    if (inputLabel && translations.grind.inputLabel) {
        inputLabel.textContent = translations.grind.inputLabel;
    }
    
    if (inputField && translations.grind.inputPlaceholder) {
        inputField.placeholder = translations.grind.inputPlaceholder;
    }
    
    if (calculateBtn && translations.common.calculate) {
        calculateBtn.textContent = translations.common.calculate;
    }
    
    if (resultLabel && translations.grind.resultLabel) {
        resultLabel.textContent = translations.grind.resultLabel;
    }
    
    if (settingsTitle && translations.grind.settingsTitle) {
        settingsTitle.textContent = translations.grind.settingsTitle;
    }
    
    console.log(`✅ Grind calculator language updated to: ${currentGrindLanguage}`);
}

// FIXED: Множники для grind (правильні значення як в HTML)
const grindModifiers = {
    // TP Category
    tp1: 1.30,           // +30%
    tp2: 1.60,           // +60%
    tp3: 1.90,           // +90%
    
    // Food Category
    chocolate_donut_1: 1.05,    // +5%
    chocolate_donut_2: 1.10,    // +10%
    chocolate_donut_3: 1.15,    // +15%
    ench_cookie_1: 1.03,        // +3%
    ench_cookie_2: 1.05,        // +5%
    ench_cookie_3: 1.07,        // +7%
    
    // Other Category
    time: 2.7,              // +170% = x2.7
    member: 2.0,            // 2x
    premium: 1.20,          // +20%
    strength_star: 1.50,    // +50%
    sandstorm_event: 1.3    // 1.3x (FIXED: was 2.0 but HTML shows 2x which is wrong, keeping consistent with HTML display)
};

let grindMultiplier = 1;
let friendBoostCount = 8; // За замовчуванням 8 (максимум 8 x 15% = 120%)

// Create Grind Calculator HTML structure
function createGrindHTML() {
    const grindPage = document.getElementById('grindPage');
    if (!grindPage) return;
    
    grindPage.innerHTML = `
        <div class="header-controls">
            <h1>💪 Grind Calculator</h1>
            <button class="settings-btn" onclick="toggleGrindSettings()">⚙️</button>
        </div>

        <!-- Settings Panel -->
        <div class="settings-panel" id="settingsPanelGrind">
            <h3 class="settings-title">Grind Modifiers</h3>

            <!-- TP Category -->
            <div class="modifier-category">
                <div class="category-header-modifier collapsed" onclick="toggleGrindCategory('tpContent')">
                    <div class="category-title-modifier">
                        <span>🚀 TP Boosts</span>
                    </div>
                    <span class="category-toggle-modifier">▼</span>
                </div>
                <div class="category-content" id="tpContent">
                    <div class="simple-toggle">
                        <div class="toggle-info">
                            <div class="toggle-label">TP1</div>
                            <div class="toggle-multiplier">(+30%)</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="tp1" onchange="handleTpSelection('tp1')">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="simple-toggle">
                        <div class="toggle-info">
                            <div class="toggle-label">TP2</div>
                            <div class="toggle-multiplier">(+60%)</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="tp2" onchange="handleTpSelection('tp2')">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="simple-toggle">
                        <div class="toggle-info">
                            <div class="toggle-label">TP3</div>
                            <div class="toggle-multiplier">(+90%)</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="tp3" onchange="handleTpSelection('tp3')">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Food Category -->
            <div class="modifier-category">
                <div class="category-header-modifier collapsed" onclick="toggleGrindCategory('foodContent')">
                    <div class="category-title-modifier">
                        <span>🍪 Food Boosts</span>
                    </div>
                    <span class="category-toggle-modifier">▼</span>
                </div>
                <div class="category-content" id="foodContent">
                    <div class="simple-toggle">
                        <div class="toggle-info">
                            <div class="toggle-label">Pink Donut L1</div>
                            <div class="toggle-multiplier">(+5%)</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="chocolate_donut_1" onchange="handleFoodSelection('chocolate_donut_1', 'donut')">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="simple-toggle">
                        <div class="toggle-info">
                            <div class="toggle-label">Vanila Donut L2</div>
                            <div class="toggle-multiplier">(+10%)</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="chocolate_donut_2" onchange="handleFoodSelection('chocolate_donut_2', 'donut')">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="simple-toggle">
                        <div class="toggle-info">
                            <div class="toggle-label">Chocolate Donut L3</div>
                            <div class="toggle-multiplier">(+15%)</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="chocolate_donut_3" onchange="handleFoodSelection('chocolate_donut_3', 'donut')">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="simple-toggle">
                        <div class="toggle-info">
                            <div class="toggle-label">Cookie</div>
                            <div class="toggle-multiplier">(+3%)</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="ench_cookie_1" onchange="handleFoodSelection('ench_cookie_1', 'cookie')">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="simple-toggle">
                        <div class="toggle-info">
                            <div class="toggle-label">Tasty Cookie</div>
                            <div class="toggle-multiplier">(+5%)</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="ench_cookie_2" onchange="handleFoodSelection('ench_cookie_2', 'cookie')">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="simple-toggle">
                        <div class="toggle-info">
                            <div class="toggle-label">Enchanted Cookie</div>
                            <div class="toggle-multiplier">(+7%)</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="ench_cookie_3" onchange="handleFoodSelection('ench_cookie_3', 'cookie')">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Other Category -->
            <div class="modifier-category">
                <div class="category-header-modifier collapsed" onclick="toggleGrindCategory('otherContent')">
                    <div class="category-title-modifier">
                        <span>⚡ Other Boosts</span>
                    </div>
                    <span class="category-toggle-modifier">▼</span>
                </div>
                <div class="category-content" id="otherContent">
                    <div class="simple-toggle">
                        <div class="toggle-info">
                            <div class="toggle-label">Time Boost</div>
                            <div class="toggle-multiplier">(+170%)</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="time" onchange="updateGrindMultiplier()">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="simple-toggle">
                        <div class="toggle-info">
                            <div class="toggle-label">Member</div>
                            <div class="toggle-multiplier">(2x)</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="member" onchange="updateGrindMultiplier()">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="simple-toggle">
                        <div class="toggle-info">
                            <div class="toggle-label">Premium</div>
                            <div class="toggle-multiplier">(+20%)</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="premium" onchange="updateGrindMultiplier()">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="simple-toggle">
                        <div class="toggle-info">
                            <div class="toggle-label">Strength Star</div>
                            <div class="toggle-multiplier">(+50%)</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="strength_star" onchange="updateGrindMultiplier()">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="simple-toggle">
                        <div class="toggle-info">
                            <div class="toggle-label">Sandstorm Event</div>
                            <div class="toggle-multiplier">(2x)</div>
                        </div>
                        <label class="switch">
                            <input type="checkbox" id="sandstorm_event" onchange="updateGrindMultiplier()">
                            <span class="slider"></span>
                        </label>
                    </div>
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
                    </div>
                </div>
            </div>
        </div>

        <!-- Input Section -->
        <div class="input-section">
            <label class="input-label" for="numberInputGrind">Enter Base Value:</label>
            <input type="number" class="number-input" id="numberInputGrind" placeholder="Enter your base grind value..." step="any" oninput="calculateGrindStats()">
            <button class="calculate-btn" onclick="calculateGrindStats()">Calculate</button>
        </div>

        <!-- Result Section -->
        <div class="result-section" id="resultSectionGrind">
            <p class="stats-label">Final Grind Value:</p>
            <p class="result-value" id="resultValueGrind">0</p>
            <p class="error" id="errorMessageGrind"></p>
        </div>
    `;
}

// Function to toggle grind categories (only one open at a time)
function toggleGrindCategory(categoryId) {
    console.log(`Toggling grind category: ${categoryId}`);
    
    const categoryContent = document.getElementById(categoryId);
    const categoryHeader = document.querySelector(`[onclick="toggleGrindCategory('${categoryId}')"]`);
    
    if (!categoryContent || !categoryHeader) {
        console.error(`Category elements not found for: ${categoryId}`);
        return;
    }
    
    const toggleIcon = categoryHeader.querySelector('.category-toggle-modifier');
    const isCurrentlyExpanded = categoryContent.classList.contains('expanded');
    
    // Close all categories first
    document.querySelectorAll('.modifier-category .category-content').forEach(content => {
        content.classList.remove('expanded');
    });
    
    document.querySelectorAll('.category-header-modifier').forEach(header => {
        header.classList.remove('expanded');
        header.classList.add('collapsed');
        const icon = header.querySelector('.category-toggle-modifier');
        if (icon) {
            icon.classList.remove('expanded');
        }
    });
    
    // If this category wasn't expanded, expand it
    if (!isCurrentlyExpanded) {
        categoryContent.classList.add('expanded');
        categoryHeader.classList.remove('collapsed');
        categoryHeader.classList.add('expanded');
        if (toggleIcon) {
            toggleIcon.classList.add('expanded');
        }
    }
}

// Initialize all categories as closed
function initializeGrindCategories() {
    console.log('Initializing grind categories - all closed by default');
    
    // Close all categories by default
    document.querySelectorAll('.modifier-category .category-content').forEach(content => {
        content.classList.remove('expanded');
    });
    
    document.querySelectorAll('.category-header-modifier').forEach(header => {
        header.classList.add('collapsed');
        header.classList.remove('expanded');
        const icon = header.querySelector('.category-toggle-modifier');
        if (icon) {
            icon.classList.remove('expanded');
        }
    });
}

// Показ/приховування налаштувань
function toggleGrindSettings() {
    const panel = document.getElementById('settingsPanelGrind');
    if (panel) {
        panel.classList.toggle('show');
    }
}

// Функція для обробки TP вибору (лише один з трьох)
function handleTpSelection(selectedTp) {
    const selectedCheckbox = document.getElementById(selectedTp);
    
    // Якщо чекбокс вимикається, просто оновлюємо множники
    if (!selectedCheckbox || !selectedCheckbox.checked) {
        updateGrindMultiplier();
        calculateGrindStats();
        return;
    }
    
    // Якщо чекбокс вмикається, вимикаємо всі інші TP
    const tpCheckboxes = ['tp1', 'tp2', 'tp3'];
    tpCheckboxes.forEach(tp => {
        if (tp !== selectedTp) {
            const checkbox = document.getElementById(tp);
            if (checkbox) {
                checkbox.checked = false;
            }
        }
    });
    
    updateGrindMultiplier();
    calculateGrindStats();
}

// Функція для обробки Food вибору (лише один пончик і одне печення)
function handleFoodSelection(selectedFood, category) {
    const selectedCheckbox = document.getElementById(selectedFood);
    
    // Якщо чекбокс вимикається, просто оновлюємо множники
    if (!selectedCheckbox || !selectedCheckbox.checked) {
        updateGrindMultiplier();
        calculateGrindStats();
        return;
    }
    
    // Визначаємо групи
    let foodGroup = [];
    if (category === 'donut') {
        foodGroup = ['chocolate_donut_1', 'chocolate_donut_2', 'chocolate_donut_3'];
    } else if (category === 'cookie') {
        foodGroup = ['ench_cookie_1', 'ench_cookie_2', 'ench_cookie_3'];
    }
    
    // Якщо чекбокс вмикається, вимикаємо всі інші в групі
    foodGroup.forEach(food => {
        if (food !== selectedFood) {
            const checkbox = document.getElementById(food);
            if (checkbox) {
                checkbox.checked = false;
            }
        }
    });
    
    updateGrindMultiplier();
    calculateGrindStats();
}

// Friend boost functions
function increaseFriendBoost() {
    if (friendBoostCount < 8) {
        friendBoostCount++;
        updateFriendDisplay();
        calculateGrindStats();
    }
}

function decreaseFriendBoost() {
    if (friendBoostCount > 0) {
        friendBoostCount--;
        updateFriendDisplay();
        calculateGrindStats();
    }
}

function updateFriendDisplay() {
    const display = document.getElementById('friendDisplay');
    const upBtn = document.getElementById('friendUpBtn');
    const downBtn = document.getElementById('friendDownBtn');
    
    if (display) {
        const percentage = friendBoostCount * 15;
        display.textContent = `${percentage}%`;
    }
    
    // Enable/disable buttons based on limits
    if (upBtn) {
        upBtn.disabled = friendBoostCount >= 8;
    }
    if (downBtn) {
        downBtn.disabled = friendBoostCount <= 0;
    }
}

// Оновлення множника при зміні чекбоксів
function updateGrindMultiplier() {
    grindMultiplier = 1;
    for (const id in grindModifiers) {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked) {
            grindMultiplier *= grindModifiers[id];
        }
    }
    
    console.log('Grind multiplier updated to:', grindMultiplier); // Для відладки
    
    // Автоматично перерахувати результат після оновлення множника
    calculateGrindStats();
}

// Функція для розрахунку Friend bonus (по friendBoostCount разів по +15%)
function calculateFriendBonus(baseValue) {
    let result = baseValue;
    for (let i = 0; i < friendBoostCount; i++) {
        result = result * 1.15; // +15% кожен раз
    }
    return result;
}

// Розрахунок результату
function calculateGrindStats() {
    const input = document.getElementById('numberInputGrind');
    const resultSection = document.getElementById('resultSectionGrind');
    const resultValue = document.getElementById('resultValueGrind');
    const errorMessage = document.getElementById('errorMessageGrind');

    if (!input || !resultSection || !resultValue || !errorMessage) return;

    errorMessage.textContent = '';

    const baseValue = parseFloat(input.value);

    if (isNaN(baseValue) || input.value.trim() === '') {
        if (input.value.trim() !== '') {
            // Use translated error message
            const translations = grindCalcTranslations[currentGrindLanguage];
            const errorText = (translations && translations.grind && translations.grind.errorInvalidNumber) 
                || 'Please enter a valid number';
            errorMessage.textContent = errorText;
        }
        resultSection.classList.remove('show');
        return;
    }

    // Спочатку застосовуємо всі звичайні множники
    let finalValue = baseValue * grindMultiplier;
    
    // Потім застосовуємо Friend bonus окремо
    if (friendBoostCount > 0) {
        finalValue = calculateFriendBonus(finalValue);
    }

    console.log(`Calculating: ${baseValue} * ${grindMultiplier} * friend_boost = ${finalValue}`); // Для відладки

    resultValue.textContent = finalValue.toLocaleString('uk-UA', {
        minimumFractionDigits: finalValue % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 8
    });

    resultSection.classList.add('show');
}

// Ініціалізація Grind при завантаженні сторінки
function initializeGrind() {
    console.log('🔄 Initializing Grind Calculator...');
    
    // Create HTML structure first
    createGrindHTML();
    
    // Get current app language
    const currentAppLanguage = (typeof getCurrentAppLanguage === 'function') 
        ? getCurrentAppLanguage() 
        : 'en';
    
    // Update grind calculator language
    updateGrindLanguage(currentAppLanguage);
    
    updateGrindMultiplier();
    updateFriendDisplay();
    initializeGrindCategories(); // Initialize categories as closed

    const numberInput = document.getElementById('numberInputGrind');
    if (numberInput) {
        numberInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                calculateGrindStats();
            }
        });

        numberInput.addEventListener('input', () => {
            const errorMessage = document.getElementById('errorMessageGrind');
            if (errorMessage) errorMessage.textContent = '';
        });
    }
    
    console.log('✅ Grind Calculator initialized with collapsible categories');
}

// Listen for language change events
document.addEventListener('languageChanged', (event) => {
    const newLanguage = event.detail.language;
    console.log('🌍 Grind calculator received language change:', newLanguage);
    updateGrindLanguage(newLanguage);
});

// Make functions globally available
window.handleTpSelection = handleTpSelection;
window.handleFoodSelection = handleFoodSelection;
window.increaseFriendBoost = increaseFriendBoost;
window.decreaseFriendBoost = decreaseFriendBoost;
window.updateGrindMultiplier = updateGrindMultiplier;
window.toggleGrindCategory = toggleGrindCategory;
window.initializeGrindCategories = initializeGrindCategories;
window.toggleGrindSettings = toggleGrindSettings;
window.calculateGrindStats = calculateGrindStats;
window.initializeGrind = initializeGrind;
window.updateGrindLanguage = updateGrindLanguage;
