// Updated content loader script - With flag-only language selector, peoples naming, and Help page
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
            // Create the main structure with categorized navigation and flag-only language selector
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
                                <button class="nav-btn" data-page="help" onclick="switchPage('help')">
                                    🆘 Help
                                </button>
                                <button class="nav-btn" data-page="peoples" onclick="switchPage('peoples')">
                                    🙏 Peoples
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Language flags will be added here by JavaScript -->
                    
                    <!-- Simplified User Section -->
                    <div class="sidebar-user" id="sidebarUser">
                        <button class="auth-btn-sidebar disabled" id="authButton" title="Coming Soon!">Login (Soon...)</button>
                    </div>
                </div>

                <!-- Sidebar Overlay -->
                <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
                   
                <div class="container">
                    ${calcContent}
                    ${infoContent}
                    ${otherContent}
                </div>

                <style>
                    .auth-btn-sidebar.disabled {
                        opacity: 0.6;
                        cursor: not-allowed !important;
                        background: rgba(255, 255, 255, 0.1);
                        color: rgba(255, 255, 255, 0.7);
                        pointer-events: none;
                    }
                    
                    .auth-btn-sidebar.disabled:hover {
                        background: rgba(255, 255, 255, 0.1) !important;
                        border-color: rgba(102, 126, 234, 0.4) !important;
                        transform: none !important;
                        box-shadow: none !important;
                    }
                </style>
            `;

            appContent.innerHTML = fullContent;
            console.log('✅ Content loaded successfully with flag-only language selector, peoples naming, and Help page');
            
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

// Enhanced auth action handler - DISABLED
function handleAuthAction() {
    console.log('⚠️ Login feature is disabled - coming soon');
    // Не робить нічого - кнопка заблокована
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

console.log('✅ content_loader.js loaded with flag-only language selector, peoples naming, and Help page ready');
