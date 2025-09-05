// Content loader script
console.log('🔄 Завантаження контенту...');

// Function to load content
async function loadContent() {
    try {
        // Load content files (removed login, added soon)
        const [calcResponse, infoResponse] = await Promise.all([
            fetch('index/content_calc.html'),
            fetch('index/content_info.html')
        ]);

        if (!calcResponse.ok || !infoResponse.ok) {
            throw new Error(`HTTP error! calc: ${calcResponse.status}, info: ${infoResponse.status}`);
        }
        
        const [calcContent, infoContent] = await Promise.all([
            calcResponse.text(),
            infoResponse.text()
        ]);

        const appContent = document.getElementById('app-content');
        
        if (appContent) {
            // Create the main structure with navigation and combine content + Soon page
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
                        <button class="nav-btn active" onclick="switchPage('calculator')">🐾 Pets Calculator</button>
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
                        <button class="auth-btn-sidebar" id="authButton" onclick="handleAuthAction()">Soon..</button>
                    </div>
                </div>

                <!-- Sidebar Overlay -->
                <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
                   
                <div class="container">
                    ${calcContent}
                    ${infoContent}
                </div>

                <style>
                    .auth-btn-sidebar.disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                        background: rgba(255, 255, 255, 0.1);
                        color: rgba(255, 255, 255, 0.7);
                        pointer-events: none;
                    }
                </style>
            `;

            appContent.innerHTML = fullContent;
            console.log('✅ Контент завантажено успішно (calc + info + soon)');
            
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
