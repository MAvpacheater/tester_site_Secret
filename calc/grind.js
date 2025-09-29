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

// Ініціалізація Grind при завантаженні сторінки
async function initializeGrind() {
    console.log('🔄 Initializing Grind Calculator with multilingual support...');
    
    // Create HTML structure first
    createGrindHTML();
    
    // Load translations
    await loadGrindTranslations();
    
    // Get current app language
    const currentAppLanguage = (typeof getCurrentAppLanguage === 'function') 
        ? getCurrentAppLanguage() 
        : 'en';
    
    // Update grind calculator language
    await updateGrindLanguage(currentAppLanguage);
    
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
    
    console.log('✅ Grind Calculator initialized with multilingual support and collapsible categories');
}
