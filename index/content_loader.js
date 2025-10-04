// Content loader script - Full debug version
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
            // Create the main structure with onclick handlers
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
                            
                            <!-- Language Flags with detailed debugging -->
                            <div class="language-flags" id="languageFlags">
                                <button class="lang-flag-btn" data-lang="en" onclick="event.preventDefault(); event.stopPropagation(); console.log('🇺🇸 EN button clicked'); window.switchAppLanguage('en');" title="English">🇺🇸</button>
                                <button class="lang-flag-btn" data-lang="uk" onclick="event.preventDefault(); event.stopPropagation(); console.log('🇺🇦 UK button clicked'); window.switchAppLanguage('uk');" title="Українська">🇺🇦</button>
                                <button class="lang-flag-btn" data-lang="ru" onclick="event.preventDefault(); event.stopPropagation(); console.log('🇷🇺 RU button clicked'); window.switchAppLanguage('ru');" title="Русский">🇷🇺</button>
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
            
            // Check current saved language
            const savedLang = localStorage.getItem('armHelper_language');
            console.log('🔍 Saved language in localStorage:', savedLang);
            
            // Set active button based on saved language
            setTimeout(() => {
                const langButtons = document.querySelectorAll('.lang-flag-btn');
                console.log(`🔍 Found ${langButtons.length} language buttons`);
                
                langButtons.forEach((btn, index) => {
                    const lang = btn.getAttribute('data-lang');
                    const isActive = lang === savedLang;
                    
                    if (isActive) {
                        btn.classList.add('active');
                        console.log(`✅ Button ${lang} set to ACTIVE (matches saved: ${savedLang})`);
                    } else {
                        btn.classList.remove('active');
                    }
                    
                    // Add additional event listener as backup
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const targetLang = this.getAttribute('data-lang');
                        console.log(`🖱️ addEventListener: Click on ${targetLang} button`);
                        console.log(`📍 Before switch - localStorage:`, localStorage.getItem('armHelper_language'));
                        
                        if (typeof window.switchAppLanguage === 'function') {
                            console.log(`✅ Calling switchAppLanguage('${targetLang}')`);
                            window.switchAppLanguage(targetLang);
                            
                            // Verify after switch
                            setTimeout(() => {
                                const newSavedLang = localStorage.getItem('armHelper_language');
                                console.log(`📍 After switch - localStorage:`, newSavedLang);
                                if (newSavedLang !== targetLang) {
                                    console.error(`❌ PROBLEM: Tried to switch to ${targetLang} but localStorage shows ${newSavedLang}`);
                                } else {
                                    console.log(`✅ SUCCESS: Language correctly saved as ${targetLang}`);
                                }
                            }, 100);
                        } else {
                            console.error('❌ switchAppLanguage function not found on window!');
                        }
                    }, true);
                    
                    console.log(`✅ Listeners added for ${lang}`);
                });
            }, 200);
            
            // Dispatch event that content is loaded
            document.dispatchEvent(new CustomEvent('contentLoaded'));
            
            // Wait for DOM to be ready, then initialize
            setTimeout(() => {
                if (typeof initializeApp === 'function') {
                    console.log('🚀 Calling initializeApp...');
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
console.log('🔍 Checking switchAppLanguage:', typeof window.switchAppLanguage);
console.log('🔍 Current localStorage language:', localStorage.getItem('armHelper_language'));
