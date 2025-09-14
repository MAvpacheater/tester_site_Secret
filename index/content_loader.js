// Content loader script - Cleaned version
console.log('🔄 Loading content...');

// Function to load content
async function loadContent() {
    try {
        // Load calculator, info, and other content
        const [calcResponse, infoResponse, otherResponse] = await Promise.all([
            fetch('index/content_calc.html'),
            fetch('index/content_info.html'),
            fetch('index/content_other.html')
        ]);

        if (!calcResponse.ok || !infoResponse.ok || !otherResponse.ok) {
            throw new Error(`HTTP error! calc: ${calcResponse.status}, info: ${infoResponse.status}, other: ${otherResponse.status}`);
        }
        
        const [calcContent, infoContent, otherContent] = await Promise.all([
            calcResponse.text(),
            infoResponse.text(),
            otherResponse.text()
        ]);

        const appContent = document.getElementById('app-content');
        
        if (appContent) {
            // Create the main structure
            const fullContent = `
                <!-- Mobile Menu Toggle -->
                <button class="mobile-menu-toggle" onclick="toggleMobileMenu()">☰</button>

                <!-- Sidebar Navigation -->
                <div class="sidebar" id="sidebar">
                    <div class="sidebar-header">
                        <h3>Menu</h3>
                        <button class="close-sidebar" onclick="closeSidebar()">×</button>
                    </div>
                    <div class="nav-buttons">
                        <!-- Calculator Category -->
                        <div class="nav-category">
                            <div class="category-header" data-category="calculatorButtons" onclick="toggleCategory('calculatorButtons')">
                                <div class="category-title">
                                    <span class="category-icon">🧮</span>
                                    <span>Calculator</span>
                                </div>
                                <span class="category-toggle">▼</span>
                            </div>
                            <div class="category-buttons" id="calculatorButtons">
                                <button class="nav-btn active" data-page="calculator" onclick="switchPage('calculator')">
                                    🐾 Pet Calculator
                                </button>
                                <button class="nav-btn" data-page="arm" onclick="switchPage('arm')">
                                    💪 Arm Calculator
                                </button>
                                <button class="nav-btn" data-page="grind" onclick="switchPage('grind')">
                                    🏋️‍♂️ Grind Calculator
                                </button>
                            </div>
                        </div>
                        
                        <!-- Info Category -->
                        <div class="nav-category">
                            <div class="category-header" data-category="infoButtons" onclick="toggleCategory('infoButtons')">
                                <div class="category-title">
                                    <span class="category-icon">📋</span>
                                    <span>Info</span>
                                </div>
                                <span class="category-toggle">▼</span>
                            </div>
                            <div class="category-buttons" id="infoButtons">
                                <button class="nav-btn" data-page="boosts" onclick="switchPage('boosts')">
                                    🚀 Boosts
                                </button>
                                <button class="nav-btn" data-page="shiny" onclick="switchPage('shiny')">
                                    ✨ Shiny Stats
                                </button>
                                <button class="nav-btn" data-page="secret" onclick="switchPage('secret')">
                                    🔮 Secret Pets
                                </button>
                                <button class="nav-btn" data-page="codes" onclick="switchPage('codes')">
                                    🎁 Codes
                                </button>
                                <button class="nav-btn" data-page="aura" onclick="switchPage('aura')">
                                    🌟 Aura
                                </button>
                                <button class="nav-btn" data-page="trainer" onclick="switchPage('trainer')">
                                    🏆 Trainer
                                </button>
                                <button class="nav-btn" data-page="charms" onclick="switchPage('charms')">
                                    🔮 Charms
                                </button>
                                <button class="nav-btn" data-page="potions" onclick="switchPage('potions')">
                                    🧪 Potions & Food
                                </button>
                                <button class="nav-btn" data-page="worlds" onclick="switchPage('worlds')">
                                    🌍 Worlds
                                </button>
                            </div>
                        </div>

                        <!-- Others Category -->
                        <div class="nav-category">
                            <div class="category-header" data-category="othersButtons" onclick="toggleCategory('othersButtons')">
                                <div class="category-title">
                                    <span class="category-icon">🔧</span>
                                    <span>Others</span>
                                </div>
                                <span class="category-toggle">▼</span>
                            </div>
                            <div class="category-buttons" id="othersButtons">
                                <button class="nav-btn" data-page="updates" onclick="switchPage('updates')">
                                    📝 Updates
                                </button>
                                <button class="nav-btn" data-page="help" onclick="switchPage('help')">
                                    🆘 Help
                                </button>
                                <button class="nav-btn" data-page="peoples" onclick="switchPage('peoples')">
                                    🙏 Peoples
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- User Section -->
                    <div class="sidebar-user" id="sidebarUser">
                        <button class="auth-btn-sidebar disabled" id="authButton" title="Coming Soon!" onclick="handleAuthAction()">
                            Login (Soon...)
                        </button>
                    </div>
                    
                    <!-- Language Flags -->
                    <div class="sidebar-controls">
                        <div class="language-flags">
                            <button class="lang-flag-btn active" data-lang="en" onclick="switchAppLanguage('en')" title="English">🇺🇸</button>
                            <button class="lang-flag-btn" data-lang="uk" onclick="switchAppLanguage('uk')" title="Українська">🇺🇦</button>
                            <button class="lang-flag-btn" data-lang="ru" onclick="switchAppLanguage('ru')" title="Русский">🇷🇺</button>
                        </div>
                    </div>
                </div>

                <!-- Sidebar Overlay -->
                <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
                   
                <div class="container">
                    ${calcContent}
                    ${infoContent}
                    ${otherContent}
                </div>
            `;

            appContent.innerHTML = fullContent;
            console.log('✅ Content loaded successfully');
            
            // Dispatch event that content is loaded
            document.dispatchEvent(new CustomEvent('contentLoaded'));
            
            // Wait a bit for DOM to be ready, then initialize
            setTimeout(() => {
                if (typeof initializeApp === 'function') {
                    initializeApp();
                } else {
                    console.error('❌ initializeApp function not found');
                }
            }, 100);
        } else {
            console.error('❌ app-content element not found');
        }
    } catch (error) {
        console.error('❌ Error loading content:', error);
        
        // Dispatch error event
        document.dispatchEvent(new CustomEvent('contentLoadError', { 
            detail: error 
        }));
        
        // Fallback - try to initialize anyway
        setTimeout(() => {
            if (typeof initializeApp === 'function') {
                initializeApp();
            }
        }, 500);
    }
}

// Auth action handler
function handleAuthAction() {
    console.log('⚠️ Login feature is disabled - coming soon');
    const authBtn = document.getElementById('authButton');
    if (authBtn) {
        const originalText = authBtn.textContent;
        authBtn.textContent = '🔒 Coming Soon!';
        authBtn.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            authBtn.textContent = originalText;
            authBtn.style.transform = 'scale(1)';
        }, 1000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadContent();
    });
} else {
    loadContent();
}

// Make functions globally available
window.handleAuthAction = handleAuthAction;

console.log('✅ Content loader ready');
