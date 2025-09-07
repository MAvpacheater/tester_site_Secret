// Enhanced content loader script - Clean version
console.log('🔄 Loading content...');

// Function to load content
async function loadContent() {
    try {
        // Load content files (including login and profile pages)
        const [calcResponse, infoResponse, loginResponse, profileResponse] = await Promise.all([
            fetch('index/content_calc.html'),
            fetch('index/content_info.html'),
            fetch('index/content_login.html'),
            fetch('index/content_profile.html')
        ]);

        if (!calcResponse.ok || !infoResponse.ok || !loginResponse.ok || !profileResponse.ok) {
            throw new Error(`HTTP error! calc: ${calcResponse.status}, info: ${infoResponse.status}, login: ${loginResponse.status}, profile: ${profileResponse.status}`);
        }
        
        const [calcContent, infoContent, loginContent, profileContent] = await Promise.all([
            calcResponse.text(),
            infoResponse.text(),
            loginResponse.text(),
            profileResponse.text()
        ]);

        const appContent = document.getElementById('app-content');
        
        if (appContent) {
            // Create the main structure with navigation and combine all content
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
                    
                    <!-- User Section in Sidebar -->
                    <div class="sidebar-user" id="sidebarUser">
                        <div class="user-info" id="userInfo" style="display: none;">
                            <div class="user-nickname clickable-nickname" id="sidebarUserNickname" onclick="openProfile()" title="Click to view profile"></div>
                            <div class="user-status">Logged in</div>
                        </div>
                        <button class="auth-btn-sidebar" id="authButton" onclick="handleAuthAction()">Login</button>
                    </div>
                </div>

                <!-- Sidebar Overlay -->
                <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
                   
                <div class="container">
                    ${loginContent}
                    ${profileContent}
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

                    /* Profile page integration */
                    .profile-page {
                        background: none;
                        min-height: auto;
                        padding: 0;
                    }
                    
                    .profile-page .container {
                        background: none;
                        box-shadow: none;
                        backdrop-filter: none;
                        border: none;
                        padding: 0;
                    }

                    /* Clickable nickname styling */
                    .clickable-nickname {
                        cursor: pointer;
                        transition: all 0.2s ease;
                        border-radius: 8px;
                        padding: 4px 8px;
                        margin: -4px -8px;
                    }
                    
                    .clickable-nickname:hover {
                        background: rgba(255, 255, 255, 0.1);
                        transform: scale(1.02);
                        color: #ffffff;
                    }
                    
                    .clickable-nickname:active {
                        transform: scale(0.98);
                    }

                    /* Tooltip for nickname */
                    .clickable-nickname::after {
                        content: '👤 Click to view profile';
                        position: absolute;
                        top: -35px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: rgba(0, 0, 0, 0.8);
                        color: white;
                        padding: 6px 10px;
                        border-radius: 6px;
                        font-size: 12px;
                        white-space: nowrap;
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.2s ease;
                        z-index: 1000;
                    }
                    
                    .clickable-nickname:hover::after {
                        opacity: 1;
                    }
                    
                    .user-info {
                        position: relative;
                    }
                </style>
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

// Enhanced initialization with auth integration
function enhanceInitialization() {
    // Listen for authentication events to update ONLY sidebar
    document.addEventListener('userAuthenticated', (event) => {
        const { user, profile } = event.detail;
        updateSidebarForAuthenticatedUser(user, profile);
        // Update login stats
        if (typeof updateLoginStats === 'function') {
            updateLoginStats();
        }
    });
    
    document.addEventListener('userSignedOut', () => {
        updateSidebarForSignedOutUser();
    });
}

// Update ONLY sidebar for authenticated user
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
                                            user.email?.split('@')[0] || 
                                            'User';
            // Ensure click handler is set
            sidebarUserNickname.onclick = () => {
                if (typeof openProfile === 'function') {
                    openProfile();
                } else {
                    console.error('openProfile function not found');
                }
            };
        }
    }
    
    console.log('✅ Sidebar updated for authenticated user');
}

// Update ONLY sidebar for signed out user
function updateSidebarForSignedOutUser() {
    const userInfo = document.getElementById('userInfo');
    const authButton = document.getElementById('authButton');

    if (userInfo && authButton) {
        userInfo.style.display = 'none';
        authButton.textContent = 'Login';
        authButton.classList.remove('logout-btn');
        authButton.onclick = handleAuthAction;
    }
    
    console.log('✅ Sidebar updated for signed out user');
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

// Check if user is already authenticated
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
