// Optimized content loader - Performance Enhanced

// Content loader with caching
let contentCache = {};

async function loadContent() {
    try {
        // Check cache first
        if (contentCache.full) {
            document.getElementById('app-content').innerHTML = contentCache.full;
            initializeAfterLoad();
            return;
        }

        // Load content files in parallel
        const [calcResponse, infoResponse, otherResponse] = await Promise.all([
            fetch('index/content_calc.html'),
            fetch('index/content_info.html'),
            fetch('index/content_other.html')
        ]);

        if (!calcResponse.ok || !infoResponse.ok || !otherResponse.ok) {
            throw new Error('Failed to load content files');
        }
        
        const [calcContent, infoContent, otherContent] = await Promise.all([
            calcResponse.text(),
            infoResponse.text(),
            otherResponse.text()
        ]);

        const appContent = document.getElementById('app-content');
        
        if (appContent) {
            // Create optimized structure with fixed sidebar footer
            const fullContent = `
                <button class="mobile-menu-toggle" onclick="toggleMobileMenu()">☰</button>

                <div class="sidebar" id="sidebar">
                    <div class="sidebar-header">
                        <h3>Menu</h3>
                        <button class="close-sidebar" onclick="closeSidebar()">×</button>
                    </div>
                    <div class="nav-buttons">
                        <div class="nav-category">
                            <div class="category-header" data-category="calculatorButtons" onclick="toggleCategory('calculatorButtons')">
                                <div class="category-title">
                                    <span class="category-icon">🧮</span>
                                    <span>Calculator</span>
                                </div>
                                <span class="category-toggle">▼</span>
                            </div>
                            <div class="category-buttons" id="calculatorButtons">
                                <button class="nav-btn active" data-page="calculator" onclick="switchPage('calculator')">🐾 Pet Calculator</button>
                                <button class="nav-btn" data-page="arm" onclick="switchPage('arm')">💪 Arm Calculator</button>
                                <button class="nav-btn" data-page="grind" onclick="switchPage('grind')">🏋️‍♂️ Grind Calculator</button>
                            </div>
                        </div>
                        
                        <div class="nav-category">
                            <div class="category-header" data-category="infoButtons" onclick="toggleCategory('infoButtons')">
                                <div class="category-title">
                                    <span class="category-icon">📋</span>
                                    <span>Info</span>
                                </div>
                                <span class="category-toggle">▼</span>
                            </div>
                            <div class="category-buttons" id="infoButtons">
                                <button class="nav-btn" data-page="boosts" onclick="switchPage('boosts')">🚀 Boosts</button>
                                <button class="nav-btn" data-page="shiny" onclick="switchPage('shiny')">✨ Shiny Stats</button>
                                <button class="nav-btn" data-page="secret" onclick="switchPage('secret')">🔮 Secret Pets</button>
                                <button class="nav-btn" data-page="codes" onclick="switchPage('codes')">🎁 Codes</button>
                                <button class="nav-btn" data-page="aura" onclick="switchPage('aura')">🌟 Aura</button>
                                <button class="nav-btn" data-page="trainer" onclick="switchPage('trainer')">🏆 Trainer</button>
                                <button class="nav-btn" data-page="charms" onclick="switchPage('charms')">🔮 Charms</button>
                                <button class="nav-btn" data-page="potions" onclick="switchPage('potions')">🧪 Potions & Food</button>
                                <button class="nav-btn" data-page="worlds" onclick="switchPage('worlds')">🌍 Worlds</button>
                            </div>
                        </div>

                        <div class="nav-category">
                            <div class="category-header" data-category="othersButtons" onclick="toggleCategory('othersButtons')">
                                <div class="category-title">
                                    <span class="category-icon">🔧</span>
                                    <span>Others</span>
                                </div>
                                <span class="category-toggle">▼</span>
                            </div>
                            <div class="category-buttons" id="othersButtons">
                                <button class="nav-btn" data-page="worlds" onclick="switchPage('worlds')">🌍 Worlds</button>
                                <button class="nav-btn" data-page="help" onclick="switchPage('help')">🆘 Help</button>
                                <button class="nav-btn" data-page="peoples" onclick="switchPage('peoples')">🙏 Peoples</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="language-flags">
                        <button class="lang-flag-btn active" data-lang="en" onclick="switchAppLanguage('en')" title="EN">🇺🇸</button>
                        <button class="lang-flag-btn" data-lang="uk" onclick="switchAppLanguage('uk')" title="UK">🇺🇦</button>
                        <button class="lang-flag-btn" data-lang="ru" onclick="switchAppLanguage('ru')" title="RU">🇷🇺</button>
                    </div>
                    <div class="sidebar-user" id="sidebarUser">
                        <button class="auth-btn-sidebar disabled" id="authButton" title="Coming Soon!">Login (Soon...)</button>
                    </div>
                </div>

                <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
                   
                <div class="container">
                    ${calcContent}
                    ${infoContent}
                    ${otherContent}
                </div>
            `;

            // Cache the content
            contentCache.full = fullContent;
            
            appContent.innerHTML = fullContent;
            
            initializeAfterLoad();
        }
    } catch (error) {
        console.error('Error loading content:', error);
        handleLoadError();
    }
}

function initializeAfterLoad() {
    // Dispatch content loaded event
    document.dispatchEvent(new CustomEvent('contentLoaded'));
    
    // Initialize app with small delay for DOM
    setTimeout(() => {
        if (typeof initializeApp === 'function') {
            initializeApp();
        }
    }, 50);
}

function handleLoadError() {
    document.dispatchEvent(new CustomEvent('contentLoadError'));
    
    // Try to initialize anyway
    setTimeout(() => {
        if (typeof initializeApp === 'function') {
            initializeApp();
        }
    }, 200);
}

// Disabled auth handler
function handleAuthAction() {
    console.log('Login feature disabled');
}

// Initialize based on DOM state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadContent);
} else {
    loadContent();
}

// Export
window.handleAuthAction = handleAuthAction;
