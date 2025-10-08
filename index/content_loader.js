// Content loader script - Fixed version with Profile and Clans support
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
                                <button class="nav-btn" data-page="trader" onclick="switchPage('trader')"></button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- User Section with Settings -->
                    <div class="sidebar-user" id="sidebarUser">
                        <button class="settings-btn-sidebar" onclick="switchPage('settings')" title="Settings">⚙️</button>
                        <button class="auth-btn-sidebar" id="authButton">⏳ Soon...</button>
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
            
            // Auth button will be set up by auth.js
            console.log('ℹ️ Auth button will be configured by auth.js');
            
            // Initialize signature easter egg
            initializeSignatureEasterEgg();
            
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
        
        document.dispatchEvent(new CustomEvent('contentLoadError', { 
            detail: error 
        }));
        
        setTimeout(() => {
            if (typeof initializeApp === 'function') {
                initializeApp();
            }
        }, 500);
    }
}

// Easter egg for signature double-click
function initializeSignatureEasterEgg() {
    const signature = document.querySelector('.signature');
    if (!signature) {
        console.log('⚠️ Signature element not found, retrying...');
        setTimeout(initializeSignatureEasterEgg, 500);
        return;
    }
    
    let clickCount = 0;
    let clickTimer = null;
    
    signature.addEventListener('click', function() {
        clickCount++;
        
        if (clickCount === 1) {
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 300);
        } else if (clickCount === 2) {
            clearTimeout(clickTimer);
            clickCount = 0;
            
            // Toggle megadep background
            if (document.body.style.backgroundImage.includes('megadep.png')) {
                document.body.style.backgroundImage = '';
                document.body.style.backgroundSize = '';
                document.body.style.backgroundPosition = '';
                document.body.style.backgroundRepeat = '';
                document.body.style.backgroundAttachment = '';
                console.log('🎨 Easter egg: Background removed');
            } else {
                document.body.style.backgroundImage = 'url(image/bg/megadep.png)';
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundRepeat = 'no-repeat';
                document.body.style.backgroundAttachment = 'fixed';
                console.log('🎨 Easter egg: Megadep background activated! 🎉');
            }
        }
    });
    
    signature.style.cursor = 'pointer';
    signature.title = 'Double click me! 😉';
    
    console.log('✅ Signature easter egg initialized');
}

// Listen for language changes
document.addEventListener('languageChanged', (e) => {
    console.log('🌍 Language changed in content_loader');
    
    const authButton = document.getElementById('authButton');
    if (!authButton) return;

    // Only update if auth hasn't taken over yet
    if (!window.firebaseManager?.isInitialized) {
        const currentLang = (typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : null) || 'en';
        const translations = {
            en: '⏳ Loading...',
            uk: '⏳ Завантаження...',
            ru: '⏳ Загрузка...'
        };
        
        authButton.textContent = translations[currentLang] || '⏳ Loading...';
    }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadContent();
    });
} else {
    loadContent();
}

console.log('✅ Content loader ready (WITH PROFILE + CLANS SUPPORT + EASTER EGG)');
console.log('🔍 Checking switchAppLanguage:', typeof window.switchAppLanguage);
console.log('🔍 Current localStorage language:', localStorage.getItem('armHelper_language'));
