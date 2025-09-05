// Content loader script
console.log('🔄 Завантаження контенту...');

// Function to load content
async function loadContent() {
    try {
        // Load all content files including login
        const [calcResponse, infoResponse, loginResponse] = await Promise.all([
            fetch('index/content_calc.html'),
            fetch('index/content_info.html'),
            fetch('index/content_login.html')
        ]);

        if (!calcResponse.ok || !infoResponse.ok || !loginResponse.ok) {
            throw new Error(`HTTP error! calc: ${calcResponse.status}, info: ${infoResponse.status}, login: ${loginResponse.status}`);
        }
        
        const [calcContent, infoContent, loginContent] = await Promise.all([
            calcResponse.text(),
            infoResponse.text(),
            loginResponse.text()
        ]);

        const appContent = document.getElementById('app-content');
        
        if (appContent) {
            // Create the main structure with navigation and combine content (БЕЗ кнопки Login в навігації)
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
                        <button class="nav-btn active" onclick="switchPage('calculator')">🐾 Calculator</button>
                        <button class="nav-btn" onclick="switchPage('arm')">💪 Arm Calculator</button>
                        <button class="nav-btn" onclick="switchPage('grind')">🏋️‍♂️ Grind Calculator</button>
                        <button class="nav-btn" onclick="switchPage('boosts')">🚀 Boosts</button>
                        <button class="nav-btn" onclick="switchPage('shiny')">✨ Shiny Stats</button>
                        <button class="nav-btn" onclick="switchPage('codes')">🎁 Codes</button>
                        <button class="nav-btn" onclick="switchPage('aura')">🌟 Aura</button>
                        <button class="nav-btn" onclick="switchPage('trainer')">🏆 Trainer</button>
                        <button class="nav-btn" onclick="switchPage('charms')">🔮 Charms</button>
                        <button class="nav-btn" onclick="switchPage('worlds')">🌍 Worlds</button>
                    </div>
                    
                    <!-- User Section in Sidebar -->
                    <div class="sidebar-user" id="sidebarUser">
                        <div class="user-info" id="userInfo" style="display: none;">
                            <div class="user-nickname" id="sidebarUserNickname"></div>
                            <div class="user-status">Увійшов в систему</div>
                        </div>
                        <button class="auth-btn-sidebar" id="authButton" onclick="handleAuthAction()">Увійти</button>
                    </div>
                </div>

                <!-- Sidebar Overlay -->
                <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
                   
                <div class="container">
                    ${loginContent}
                    ${calcContent}
                    ${infoContent}
                </div>
            `;

            appContent.innerHTML = fullContent;
            console.log('✅ Контент завантажено успішно (login + calc + info)');
            
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
        console.error('❌ Помилка завантаження контенту:', error);
        
        // Fallback - try to initialize anyway
        setTimeout(() => {
            if (typeof initializeApp === 'function') {
                initializeApp();
            }
        }, 500);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadContent);
} else {
    loadContent();
}
