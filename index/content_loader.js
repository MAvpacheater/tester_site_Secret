// Enhanced content loader script - З ПОКРАЩЕНОЮ ПРОФІЛЬНОЮ СИСТЕМОЮ
console.log('🔄 Loading content with enhanced profile support...');

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
                    
                    <!-- Enhanced User Section in Sidebar -->
                    <div class="sidebar-user" id="sidebarUser">
                        <div class="user-info" id="userInfo" style="display: none;">
                            <div class="user-avatar">
                                <div class="avatar-circle" id="sidebarUserAvatar">👤</div>
                            </div>
                            <div class="user-details">
                                <div class="user-nickname clickable-nickname" id="sidebarUserNickname" onclick="openProfile()" title="Click to view profile">Loading...</div>
                                <div class="user-status">Logged in</div>
                            </div>
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

                    /* Enhanced sidebar user section */
                    .user-info {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 12px;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 12px;
                        margin-bottom: 10px;
                    }

                    .user-avatar {
                        position: relative;
                    }

                    .avatar-circle {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background: linear-gradient(45deg, #667eea, #764ba2);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 18px;
                        color: white;
                        font-weight: bold;
                        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                        border: 2px solid rgba(255, 255, 255, 0.2);
                    }

                    .user-details {
                        flex: 1;
                        min-width: 0;
                    }

                    .user-nickname {
                        font-weight: 600;
                        font-size: 14px;
                        color: #ffffff;
                        margin-bottom: 2px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .user-status {
                        font-size: 11px;
                        color: rgba(255, 255, 255, 0.7);
                    }

                    /* Clickable nickname styling */
                    .clickable-nickname {
                        cursor: pointer;
                        transition: all 0.2s ease;
                        border-radius: 6px;
                        padding: 2px 6px;
                        margin: -2px -6px;
                        position: relative;
                    }
                    
                    .clickable-nickname:hover {
                        background: rgba(255, 255, 255, 0.15);
                        transform: scale(1.02);
                        color: #ffffff;
                    }
                    
                    .clickable-nickname:active {
                        transform: scale(0.98);
                    }

                    /* Responsive adjustments */
                    @media (max-width: 768px) {
                        .user-info {
                            gap: 8px;
                            padding: 8px;
                        }

                        .avatar-circle {
                            width: 35px;
                            height: 35px;
                            font-size: 16px;
                        }

                        .user-nickname {
                            font-size: 13px;
                        }

                        .user-status {
                            font-size: 10px;
                        }
                    }

                    /* Loading animation for nickname */
                    .user-nickname.loading {
                        opacity: 0.6;
                        animation: pulse 1.5s ease-in-out infinite;
                    }

                    @keyframes pulse {
                        0% { opacity: 0.6; }
                        50% { opacity: 1; }
                        100% { opacity: 0.6; }
                    }
                </style>
            `;

            appContent.innerHTML = fullContent;
            console.log('✅ Content loaded successfully (with enhanced profile system)');
            
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

// Enhanced initialization with better auth integration
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

// Update ONLY sidebar for authenticated user with enhanced display
function updateSidebarForAuthenticatedUser(user, profile) {
    console.log('🔄 Updating sidebar for authenticated user:', { user, profile });
    
    const userInfo = document.getElementById('userInfo');
    const authButton = document.getElementById('authButton');
    const sidebarUserNickname = document.getElementById('sidebarUserNickname');
    const sidebarUserAvatar = document.getElementById('sidebarUserAvatar');

    if (userInfo && authButton) {
        userInfo.style.display = 'flex';
        authButton.textContent = 'Sign Out';
        authButton.classList.add('logout-btn');
        authButton.onclick = () => {
            if (window.authManager) {
                window.authManager.signOut();
            } else {
                logout();
            }
        };

        // Determine nickname with priority order
        let nickname = 'User'; // fallback
        if (profile?.nickname) {
            nickname = profile.nickname;
        } else if (user?.nickname) {
            nickname = user.nickname;
        } else if (user?.email) {
            nickname = user.email.split('@')[0];
        }

        if (sidebarUserNickname) {
            sidebarUserNickname.textContent = nickname;
            sidebarUserNickname.classList.remove('loading');
            
            // Ensure click handler is set
            sidebarUserNickname.onclick = () => {
                if (typeof openProfile === 'function') {
                    openProfile();
                } else {
                    console.error('openProfile function not found');
                }
            };
        }

        // Update avatar with first letter
        if (sidebarUserAvatar) {
            const firstLetter = nickname.charAt(0).toUpperCase();
            sidebarUserAvatar.textContent = firstLetter;
            
            // Generate color based on nickname
            const colors = ['#667eea', '#764ba2', '#667292', '#f093fb', '#f5576c', '#4facfe', '#43e97b'];
            const color = colors[nickname.length % colors.length];
            const secondaryColor = colors[(nickname.length + 1) % colors.length];
            
            sidebarUserAvatar.style.background = `linear-gradient(45deg, ${color}, ${secondaryColor})`;
        }
    }
    
    console.log('✅ Sidebar updated for authenticated user:', nickname);
}

// Update ONLY sidebar for signed out user
function updateSidebarForSignedOutUser() {
    const userInfo = document.getElementById('userInfo');
    const authButton = document.getElementById('authButton');
    const sidebarUserNickname = document.getElementById('sidebarUserNickname');

    if (userInfo && authButton) {
        userInfo.style.display = 'none';
        authButton.textContent = 'Login';
        authButton.classList.remove('logout-btn');
        authButton.onclick = handleAuthAction;
    }
    
    if (sidebarUserNickname) {
        sidebarUserNickname.textContent = 'Loading...';
        sidebarUserNickname.classList.add('loading');
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
                    // Create proper user object
                    const userObj = {
                        id: user.id || 'local-user',
                        email: user.email || `${user.nickname}@local.test`,
                        nickname: user.nickname
                    };
                    updateSidebarForAuthenticatedUser(userObj, user);
                } catch (e) {
                    console.warn('Invalid saved user data');
                    localStorage.removeItem('armHelper_currentUser');
                    updateSidebarForSignedOutUser();
                }
            } else {
                updateSidebarForSignedOutUser();
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
window.checkInitialAuthState = checkInitialAuthState;
