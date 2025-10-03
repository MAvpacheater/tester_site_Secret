// Content loader script - Optimized to load single content.html file
console.log('🔄 Loading content...');

// Function to load content
async function loadContent() {
    try {
        // Load single unified content file
        const contentResponse = await fetch('index/content.html');

        if (!contentResponse.ok) {
            throw new Error(`HTTP error! status: ${contentResponse.status}`);
        }
        
        const contentHTML = await contentResponse.text();

        const appContent = document.getElementById('app-content');
        
        if (appContent) {
            // Create the main structure WITHOUT hardcoded text - will be filled by language system
            const fullContent = `
                <!-- Mobile Menu Toggle -->
                <button class="mobile-menu-toggle" onclick="toggleMobileMenu()">☰</button>

                <!-- Sidebar Navigation -->
                <div class="sidebar" id="sidebar">
                    <div class="sidebar-header">
                        <h3></h3>
                        <button class="close-sidebar" onclick="closeSidebar()">×</button>
                    </div>
                    <div class="nav-buttons">
                        <!-- Calculator Category -->
                        <div class="nav-category">
                            <div class="category-header" data-category="calculatorButtons" onclick="toggleCategory('calculatorButtons')">
                                <div class="category-title">
                                    <span class="category-icon">🧮</span>
                                    <span></span>
                                </div>
                                <span class="category-toggle">▼</span>
                            </div>
                            <div class="category-buttons" id="calculatorButtons">
                                <button class="nav-btn active" data-page="calculator" onclick="switchPage('calculator')"></button>
                                <button class="nav-btn" data-page="arm" onclick="switchPage('arm')"></button>
                                <button class="nav-btn" data-page="grind" onclick="switchPage('grind')"></button>
                                <button class="nav-btn" data-page="roulette" onclick="switchPage('roulette')"></button>
                                <button class="nav-btn" data-page="boss" onclick="switchPage('boss')"></button>
                            </div>
                        </div>
                        
                        <!-- Info Category -->
                        <div class="nav-category">
                            <div class="category-header" data-category="infoButtons" onclick="toggleCategory('infoButtons')">
                                <div class="category-title">
                                    <span class="category-icon">📋</span>
                                    <span></span>
                                </div>
                                <span class="category-toggle">▼</span>
                            </div>
                            <div class="category-buttons" id="infoButtons">
                                <button class="nav-btn" data-page="boosts" onclick="switchPage('boosts')"></button>
                                <button class="nav-btn" data-page="shiny" onclick="switchPage('shiny')"></button>
                                <button class="nav-btn" data-page="secret" onclick="switchPage('secret')"></button>
                                <button class="nav-btn" data-page="codes" onclick="switchPage('codes')"></button>
                                <button class="nav-btn" data-page="aura" onclick="switchPage('aura')"></button>
                                <button class="nav-btn" data-page="trainer" onclick="switchPage('trainer')"></button>
                                <button class="nav-btn" data-page="charms" onclick="switchPage('charms')"></button>
                                <button class="nav-btn" data-page="potions" onclick="switchPage('potions')"></button>
                                <button class="nav-btn" data-page="worlds" onclick="switchPage('worlds')"></button>
                            </div>
                        </div>

                        <!-- Others Category -->
                        <div class="nav-category">
                            <div class="category-header" data-category="othersButtons" onclick="toggleCategory('othersButtons')">
                                <div class="category-title">
                                    <span class="category-icon">🔧</span>
                                    <span></span>
                                </div>
                                <span class="category-toggle">▼</span>
                            </div>
                            <div class="category-buttons" id="othersButtons">
                                <button class="nav-btn" data-page="help" onclick="switchPage('help')"></button>
                                <button class="nav-btn" data-page="peoples" onclick="switchPage('peoples')"></button>
                                <button class="nav-btn" data-page="trader" onclick="switchPage('trader')"></button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- User Section -->
                    <div class="sidebar-user" id="sidebarUser">
                        <button class="auth-btn-sidebar disabled" id="authButton" title="Coming Soon!" onclick="handleAuthAction()"></button>
                    </div>
                    
                    <!-- Settings and Language Controls -->
                    <div class="sidebar-controls">
                        <div class="control-buttons">
                            <!-- Settings Button -->
                            <button class="settings-btn-sidebar" onclick="switchPage('settings')" title="Settings">⚙️</button>
                            
                            <!-- Language Flags - NO inline onclick, handled by setupLanguageButtons() -->
                            <div class="language-flags">
                                <button class="lang-flag-btn active" data-lang="en" title="English">🇺🇸</button>
                                <button class="lang-flag-btn" data-lang="uk" title="Українська">🇺🇦</button>
                                <button class="lang-flag-btn" data-lang="ru" title="Русский">🇷🇺</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar Overlay -->
                <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
                   
                <div class="container">
                    ${contentHTML}
                </div>
            `;

            appContent.innerHTML = fullContent;
            console.log('✅ Content loaded successfully');
            
            // Dispatch event that content is loaded
            document.dispatchEvent(new CustomEvent('contentLoaded'));
            
            // Wait a bit for DOM to be ready, then initialize
            setTimeout(() => {
                if (typeof initializeApp === 'function') {
                    console.log('🚀 Calling initializeApp...');
                    initializeApp();
                    
                    // Setup language buttons after a short delay to ensure DOM is ready
                    setTimeout(() => {
                        if (typeof setupLanguageButtons === 'function') {
                            console.log('🔧 Setting up language buttons from content_loader...');
                            setupLanguageButtons();
                        } else {
                            console.warn('⚠️ setupLanguageButtons not found');
                        }
                    }, 200);
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
