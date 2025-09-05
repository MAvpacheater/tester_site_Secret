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
                        <button class="auth-btn-sidebar" id="authButton" onclick="handleAuthAction()">Soon..</button>
                    </div>
                </div>

                <!-- Sidebar Overlay -->
                <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
                   
                <div class="container">
                    <!-- Soon Page -->
                    <div class="page" id="soonPage">
                        <div class="soon-container">
                            <div class="soon-content">
                                <div class="soon-icon">🚀</div>
                                <h1 class="soon-title">Coming Soon</h1>
                                <p class="soon-description">
                                    Ця функція зараз в розробці і буде доступна незабаром.
                                </p>
                                <div class="soon-features">
                                    <div class="feature-item">
                                        <span class="feature-icon">🔐</span>
                                        <span class="feature-text">Система авторизації</span>
                                    </div>
                                    <div class="feature-item">
                                        <span class="feature-icon">💾</span>
                                        <span class="feature-text">Збереження налаштувань</span>
                                    </div>
                                    <div class="feature-item">
                                        <span class="feature-icon">📊</span>
                                        <span class="feature-text">Персональна статистика</span>
                                    </div>
                                    <div class="feature-item">
                                        <span class="feature-icon">🌟</span>
                                        <span class="feature-text">І багато іншого...</span>
                                    </div>
                                </div>
                                <button class="back-to-calc-btn" onclick="switchPage('calculator')">
                                    ← Повернутися до калькулятора
                                </button>
                            </div>
                        </div>
                    </div>

                    ${calcContent}
                    ${infoContent}
                </div>

                <style>
                    .soon-container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 80vh;
                        padding: 20px;
                    }

                    .soon-content {
                        text-align: center;
                        max-width: 500px;
                        background: rgba(255, 255, 255, 0.1);
                        backdrop-filter: blur(10px);
                        border-radius: 20px;
                        padding: 40px 30px;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                    }

                    .soon-icon {
                        font-size: 4rem;
                        margin-bottom: 20px;
                        display: block;
                    }

                    .soon-title {
                        font-family: 'Orbitron', monospace;
                        font-size: 2.5rem;
                        font-weight: 700;
                        color: #fff;
                        margin-bottom: 15px;
                        text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
                    }

                    .soon-description {
                        color: rgba(255, 255, 255, 0.8);
                        font-size: 1.1rem;
                        line-height: 1.6;
                        margin-bottom: 30px;
                    }

                    .soon-features {
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                        margin-bottom: 30px;
                    }

                    .feature-item {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                        padding: 12px 20px;
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 12px;
                        border: 1px solid rgba(255, 255, 255, 0.1);
                    }

                    .feature-icon {
                        font-size: 1.2rem;
                    }

                    .feature-text {
                        color: rgba(255, 255, 255, 0.9);
                        font-weight: 500;
                    }

                    .back-to-calc-btn {
                        background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 25px;
                        font-size: 1rem;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                    }

                    .back-to-calc-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                    }

                    .back-to-calc-btn:active {
                        transform: translateY(0);
                    }

                    @media (max-width: 768px) {
                        .soon-content {
                            padding: 30px 20px;
                        }
                        
                        .soon-title {
                            font-size: 2rem;
                        }
                        
                        .soon-description {
                            font-size: 1rem;
                        }
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
