// Fixed Content loader script
console.log('🔄 Loading content...');

async function loadContent() {
    try {
        const [calcResponse, infoResponse, moderationResponse, otherResponse] = await Promise.all([
            fetch('index/content_calc.html'),
            fetch('index/content_info.html'),
            fetch('index/content_moderation.html'),
            fetch('index/content_other.html')
        ]);

        if (!calcResponse.ok || !infoResponse.ok || !moderationResponse.ok || !otherResponse.ok) {
            throw new Error('Failed to fetch content files');
        }
        
        const [calcContent, infoContent, moderationContent, otherContent] = await Promise.all([
            calcResponse.text(),
            infoResponse.text(),
            moderationResponse.text(),
            otherResponse.text()
        ]);

        const appContent = document.getElementById('app-content');
        if (!appContent) throw new Error('app-content element not found');
        
        const fullContent = `
            <!-- Mobile Menu Toggle -->
            <button class="mobile-menu-toggle" onclick="window.toggleMobileMenu && window.toggleMobileMenu()">☰</button>

            <!-- Settings Gear Button -->
            <button class="settings-gear-btn" onclick="window.switchPage && window.switchPage('settings')" title="Settings">⚙️</button>

            <!-- Sidebar Navigation -->
            <div class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <h3>Menu</h3>
                    <button class="close-sidebar" onclick="window.closeSidebar && window.closeSidebar()">×</button>
                </div>
                <div class="nav-buttons">
                    <!-- Calculator Category -->
                    <div class="nav-category">
                        <div class="category-header" data-category="calculatorButtons" onclick="window.toggleCategory && window.toggleCategory('calculatorButtons')">
                            <div class="category-title">
                                <span class="category-icon">🧮</span>
                                <span>Calculator</span>
                            </div>
                            <span class="category-toggle">▼</span>
                        </div>
                        <div class="category-buttons" id="calculatorButtons">
                            <button class="nav-btn active" data-page="calculator" onclick="window.switchPage && window.switchPage('calculator')">
                                🐾 Pet Calculator
                            </button>
                            <button class="nav-btn" data-page="grind" onclick="window.switchPage && window.switchPage('grind')">
                                🏋️‍♂️ Grind Calculator
                            </button>
                        </div>
                    </div>
                    
                    <!-- Info Category -->
                    <div class="nav-category">
                        <div class="category-header" data-category="infoButtons" onclick="window.toggleCategory && window.toggleCategory('infoButtons')">
                            <div class="category-title">
                                <span class="category-icon">📋</span>
                                <span>Info</span>
                            </div>
                            <span class="category-toggle">▼</span>
                        </div>
                        <div class="category-buttons" id="infoButtons">
                            <button class="nav-btn" data-page="boosts" onclick="window.switchPage && window.switchPage('boosts')">🚀 Boosts</button>
                            <button class="nav-btn" data-page="shiny" onclick="window.switchPage && window.switchPage('shiny')">✨ Shiny Stats</button>
                            <button class="nav-btn" data-page="secret" onclick="window.switchPage && window.switchPage('secret')">🔮 Secret Pets</button>
                            <button class="nav-btn" data-page="codes" onclick="window.switchPage && window.switchPage('codes')">🎁 Codes</button>
                            <button class="nav-btn" data-page="aura" onclick="window.switchPage && window.switchPage('aura')">🌟 Aura</button>
                            <button class="nav-btn" data-page="trainer" onclick="window.switchPage && window.switchPage('trainer')">🏆 Trainer</button>
                            <button class="nav-btn" data-page="charms" onclick="window.switchPage && window.switchPage('charms')">🔮 Charms</button>
                            <button class="nav-btn" data-page="potions" onclick="window.switchPage && window.switchPage('potions')">🧪 Potions & Food</button>
                            <button class="nav-btn" data-page="worlds" onclick="window.switchPage && window.switchPage('worlds')">🌍 Worlds</button>
                        </div>
                    </div>

                    <!-- Others Category -->
                    <div class="nav-category">
                        <div class="category-header" data-category="othersButtons" onclick="window.toggleCategory && window.toggleCategory('othersButtons')">
                            <div class="category-title">
                                <span class="category-icon">🔧</span>
                                <span>Others</span>
                            </div>
                            <span class="category-toggle">▼</span>
                        </div>
                        <div class="category-buttons" id="othersButtons">
                            <button class="nav-btn" data-page="updates" onclick="window.switchPage && window.switchPage('updates')">📝 Updates</button>
                            <button class="nav-btn" data-page="help" onclick="window.switchPage && window.switchPage('help')">🆘 Help</button>
                            <button class="nav-btn" data-page="peoples" onclick="window.switchPage && window.switchPage('peoples')">🙏 Peoples</button>
                        </div>
                    </div>
                </div>
                
                <!-- User Section -->
                <div class="sidebar-user" id="sidebarUser">
                    <button class="auth-btn-sidebar disabled" id="authButton" title="Coming Soon!" onclick="window.handleAuthAction && window.handleAuthAction()">
                        Login (Soon...)
                    </button>
                </div>
                
                <!-- Language Controls -->
                <div class="sidebar-controls">
                    <div class="language-flags">
                        <button class="lang-flag-btn active" data-lang="en" onclick="window.switchAppLanguage && window.switchAppLanguage('en')" title="English">🇺🇸</button>
                        <button class="lang-flag-btn" data-lang="uk" onclick="window.switchAppLanguage && window.switchAppLanguage('uk')" title="Українська">🇺🇦</button>
                        <button class="lang-flag-btn" data-lang="ru" onclick="window.switchAppLanguage && window.switchAppLanguage('ru')" title="Русский">🇷🇺</button>
                    </div>
                </div>
            </div>

            <!-- Sidebar Overlay -->
            <div class="sidebar-overlay" id="sidebarOverlay"></div>
               
            <div class="container">
                ${calcContent}
                ${infoContent}
                ${moderationContent}
                ${otherContent}
            </div>
        `;

        appContent.innerHTML = fullContent;
        setupSidebarEvents();
        
        document.dispatchEvent(new CustomEvent('contentLoaded'));
        
        setTimeout(() => {
            if (typeof window.initializeApp === 'function') {
                window.initializeApp();
            }
        }, 200);
        
    } catch (error) {
        console.error('❌ Error loading content:', error);
        showContentLoadError(error);
        
        setTimeout(() => {
            if (typeof window.initializeApp === 'function') {
                window.initializeApp();
            }
        }, 1000);
    }
}

function setupSidebarEvents() {
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            if (typeof window.closeSidebar === 'function') {
                window.closeSidebar();
            }
        });
    }
    
    // Fallback event handlers
    document.querySelectorAll('.category-header').forEach(header => {
        const categoryId = header.getAttribute('data-category');
        if (categoryId) {
            header.addEventListener('click', () => {
                if (typeof window.toggleCategory === 'function') {
                    window.toggleCategory(categoryId);
                }
            });
        }
    });
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const page = btn.getAttribute('data-page');
        if (page) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof window.switchPage === 'function') {
                    window.switchPage(page);
                }
            });
        }
    });
    
    document.querySelectorAll('.lang-flag-btn').forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof window.switchAppLanguage === 'function') {
                    window.switchAppLanguage(lang);
                }
            });
        }
    });
}

function showContentLoadError(error) {
    const appContent = document.getElementById('app-content');
    if (appContent) {
        appContent.innerHTML = `
            <div class="container" style="text-align: center; padding: 40px;">
                <div style="color: #ff6b6b; font-size: 24px; margin-bottom: 20px;">⚠️</div>
                <h2 style="color: #D4AF37; margin-bottom: 15px;">Content Load Error</h2>
                <p style="color: #ccc; margin-bottom: 20px;">Failed to load application content</p>
                <p style="color: #999; font-size: 14px; margin-bottom: 20px;">${error.message}</p>
                <button onclick="location.reload()" style="
                    background: linear-gradient(135deg, #8B4513, #654321);
                    border: none; color: #D4AF37; padding: 12px 24px;
                    border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;
                ">Refresh Page</button>
            </div>
        `;
    }
}

function handleAuthAction() {
    const authBtn = document.getElementById('authButton');
    if (authBtn) {
        const originalText = authBtn.textContent;
        authBtn.textContent = '🔒 Coming Soon!';
        authBtn.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            authBtn.textContent = originalText;
            authBtn.style.transform = 'scale(1)';
        }, 1500);
    }
}

function initializeContentLoader() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(loadContent, 50));
    } else {
        setTimeout(loadContent, 50);
    }
    
    window.addEventListener('error', (event) => {
        console.error('Error:', event.error);
        if (event.error?.message?.includes('content')) {
            setTimeout(() => {
                if (!document.getElementById('app-content').innerHTML.trim()) {
                    showContentLoadError(event.error);
                }
            }, 2000);
        }
    });
}

// Global exports
Object.assign(window, {
    handleAuthAction,
    loadContent,
    setupSidebarEvents,
    showContentLoadError
});

// Auto-initialize
initializeContentLoader();
