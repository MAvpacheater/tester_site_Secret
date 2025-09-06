// Enhanced content loader script - БЕЗ ВЕРХНЬОГО ПРОФІЛЮ
console.log('🔄 Loading content...');

// Function to load content
async function loadContent() {
    try {
        // Load content files (including login page)
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
            // Create the main structure with navigation and combine all content - БЕЗ ВЕРХНЬОГО ПРОФІЛЮ
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
                        <button class="nav-btn active" onclick="switchPage('calculator')">🐾 Pet Calculator</button>
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
                    
                    <!-- User Section in Sidebar - ТІЛЬКИ ТУТ ІНФОРМАЦІЯ ПРО КОРИСТУВАЧА -->
                    <div class="sidebar-user" id="sidebarUser">
                        <div class="user-info" id="userInfo" style="display: none;">
                            <div class="user-nickname" id="sidebarUserNickname"></div>
                            <div class="user-status">Logged in</div>
                        </div>
                        <button class="auth-btn-sidebar" id="authButton" onclick="handleAuthAction()">Login</button>
                    </div>
                </div>

                <!-- Sidebar Overlay -->
                <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
                   
                <div class="container">
                    ${loginContent}
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
                    
                    /* Enhanced login page integration */
                    .login-page {
                        background: none;
                        min-height: auto;
                        padding: 0;
                    }
                    
                    .login-page .container {
                        background: none;
                        box-shadow: none;
                        backdrop-filter: none;
                        border: none;
                        padding: 0;
                    }

                    /* ВИДАЛЕНО: Усі стилі для верхнього user-profile */
                    /* Тепер інформація про користувача тільки в сайдбарі */
                </style>
            `;

            appContent.innerHTML = fullContent;
            console.log('✅ Content loaded successfully (without top profile)');
            
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

// Enhanced initialization with better auth integration - БЕЗ ВЕРХНЬОГО ПРОФІЛЮ
function enhanceInitialization() {
    // Listen for authentication events to update ONLY sidebar
    document.addEventListener('userAuthenticated', (event) => {
        const { user, profile } = event.detail;
        updateSidebarForAuthenticatedUser(user, profile);
    });
    
    document.addEventListener('userSignedOut', () => {
        updateSidebarForSignedOutUser();
    });
}

// Update ONLY sidebar for authenticated user - БЕЗ ВЕРХНЬОГО ПРОФІЛЮ
function updateSidebarForAuthenticatedUser(user, profile) {
    const userInfo = document.getElementById('userInfo');
    const authButton = document.getElementById('authButton');
    const sidebarUserNickname = document.getElementById('sidebarUserNickname');

    if (userInfo && authButton) {
        userInfo.style.display = 'block';
        authButton.textContent = 'Sign Out';
        authButton.classList.add('logout-btn');
        authButton.onclick = () => {
            if (window.authManager) {
                window.authManager.signOut();
            } else {
                logout();
            }
        };

        if (sidebarUserNickname) {
            sidebarUserNickname.textContent = (profile?.nickname) || 
                                            user.nickname || 
                                            'User';
        }
    }
    
    console.log('✅ Sidebar updated for authenticated user (no top profile)');
}

// Update ONLY sidebar for signed out user - БЕЗ ВЕРХНЬОГО ПРОФІЛЮ
function updateSidebarForSignedOutUser() {
    const userInfo = document.getElementById('userInfo');
    const authButton = document.getElementById('authButton');

    if (userInfo && authButton) {
        userInfo.style.display = 'none';
        authButton.textContent = 'Login';
        authButton.classList.remove('logout-btn');
        authButton.onclick = handleAuthAction;
    }
    
    console.log('✅ Sidebar updated for signed out user (no top profile)');
}

// Enhanced auth action handler
function handleAuthAction() {
    const authButton = document.getElementById('authButton');
    
    if (authButton && authButton.classList.contains('logout-btn')) {
        // User is logged in, handle logout
        if (window.authManager) {
            window.authManager.signOut();
        } else if (typeof logout === 'function') {
            logout();
        }
    } else {
        // User is not logged in, go to login page
        if (typeof switchPage === 'function') {
            switchPage('login');
        }
    }
}

// Check if user is already authenticated - БЕЗ ПОКАЗУ ВЕРХНЬОГО ПРОФІЛЮ
function checkInitialAuthState() {
    // Wait for auth manager to be ready
    setTimeout(() => {
        if (window.authManager && window.authManager.currentUser) {
            updateSidebarForAuthenticatedUser(
                window.authManager.currentUser, 
                window.authManager.userProfile
            );
        } else {
            // Check localStorage fallback
            const savedUser = localStorage.getItem('armHelper_currentUser');
            if (savedUser) {
                try {
                    const user = JSON.parse(savedUser);
                    updateSidebarForAuthenticatedUser(user, user);
                } catch (e) {
                    console.warn('Invalid saved user data');
                    localStorage.removeItem('armHelper_currentUser');
                }
            }
        }
    }, 500);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadContent();
        enhanceInitialization();
    });
} else {
    loadContent();
    enhanceInitialization();
}

// Check auth state after everything is loaded
document.addEventListener('contentLoaded', () => {
    checkInitialAuthState();
});

// Make functions globally available
window.handleAuthAction = handleAuthAction;
window.updateSidebarForAuthenticatedUser = updateSidebarForAuthenticatedUser;
window.updateSidebarForSignedOutUser = updateSidebarForSignedOutUser;
