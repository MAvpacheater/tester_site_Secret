// Enhanced content loader script - ПОВНА ВЕРСІЯ БЕЗ БЛОКУВАНЬ
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
                            <div class="user-nickname clickable-nickname" id="sidebarUserNickname" onclick="handleProfileClick()" title="Click to view profile"></div>
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
                        position: relative;
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

                    /* Profile form styles */
                    .submit-btn.loading {
                        position: relative;
                        color: transparent !important;
                    }

                    .submit-btn.loading::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 20px;
                        height: 20px;
                        margin: -10px 0 0 -10px;
                        border: 2px solid transparent;
                        border-top: 2px solid white;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
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

// Handle profile click with enhanced error handling
function handleProfileClick() {
    console.log('🖱️ Profile click detected');
    
    // Check if user is authenticated first
    const isAuthenticated = checkUserAuthentication();
    if (!isAuthenticated) {
        console.warn('⚠️ User not authenticated, redirecting to login');
        if (typeof switchPage === 'function') {
            switchPage('login');
        }
        return;
    }
    
    // Try to use the openProfile function if available
    if (typeof window.openProfile === 'function') {
        window.openProfile();
        return;
    }
    
    // Fallback: try to switch to profile page directly
    if (typeof switchPage === 'function') {
        console.log('📄 Using switchPage fallback');
        switchPage('profile');
        
        // Try to update profile display after a delay
        setTimeout(() => {
            if (typeof window.updateProfileDisplay === 'function') {
                window.updateProfileDisplay();
            } else {
                console.log('📋 Manually updating profile display');
                manualProfileUpdate();
            }
        }, 200);
    } else {
        console.error('❌ No profile opening method available');
        alert('Profile functionality not available. Please refresh the page.');
    }
}

// Check user authentication
function checkUserAuthentication() {
    // Check auth manager first
    if (window.authManager && window.authManager.currentUser) {
        return true;
    }
    
    // Check localStorage fallback
    const savedUser = localStorage.getItem('armHelper_currentUser');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            return user && user.nickname;
        } catch (e) {
            console.warn('Invalid saved user data');
            localStorage.removeItem('armHelper_currentUser');
            return false;
        }
    }
    
    return false;
}

// Manual profile update as fallback
function manualProfileUpdate() {
    // Get current user
    let currentUser = null;
    
    // Check auth manager first
    if (window.authManager && window.authManager.currentUser) {
        currentUser = {
            user: window.authManager.currentUser,
            profile: window.authManager.userProfile
        };
    } else {
        // Check localStorage fallback
        const savedUser = localStorage.getItem('armHelper_currentUser');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                currentUser = { user, profile: user };
            } catch (e) {
                console.warn('Invalid saved user data');
            }
        }
    }
    
    if (!currentUser) {
        console.warn('No user data available for profile');
        return;
    }
    
    const { user, profile } = currentUser;
    const nickname = profile?.nickname || user?.email?.split('@')[0] || 'User';
    
    // Update profile elements
    const profileNickname = document.getElementById('profileNickname');
    const profileAvatar = document.getElementById('profileAvatar');
    const currentNicknameInput = document.getElementById('currentNickname');
    
    if (profileNickname) {
        profileNickname.textContent = nickname;
    }
    
    if (profileAvatar) {
        // НЕ ЗМІНЮЄМО SRC - аватарка захищена
        profileAvatar.alt = `${nickname}'s avatar`;
    }
    
    if (currentNicknameInput) {
        currentNicknameInput.value = nickname;
    }
    
    console.log('✅ Manual profile update completed');
}

// Enhanced initialization with auth integration
function enhanceInitialization() {
    console.log('🔧 Enhancing initialization...');
    
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
    
    // Initialize profile settings when content is loaded
    document.addEventListener('contentLoaded', () => {
        setTimeout(() => {
            initializeProfileFunctionality();
        }, 300);
    });
}

// Initialize profile functionality
function initializeProfileFunctionality() {
    console.log('👤 Initializing profile functionality...');
    
    // Initialize profile settings if available
    if (typeof initializeProfileSettings === 'function') {
        initializeProfileSettings();
        console.log('✅ Profile settings initialized');
    } else {
        console.warn('⚠️ Profile settings function not found');
    }
    
    // Setup form event listeners
    setupProfileFormListeners();
    
    // Protect profile avatar
    setTimeout(() => {
        protectProfileAvatar();
    }, 100);
}

// Setup profile form listeners
function setupProfileFormListeners() {
    console.log('📝 Setting up profile form listeners...');
    
    // Password change form
    const passwordForm = document.querySelector('#changePasswordForm form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handleChangePassword);
        console.log('✅ Password form listener added');
    }
    
    // Nickname change form
    const nicknameForm = document.querySelector('#changeNicknameForm form');
    if (nicknameForm) {
        nicknameForm.addEventListener('submit', handleChangeNickname);
        console.log('✅ Nickname form listener added');
    }
}

// Protect profile avatar
function protectProfileAvatar() {
    const profileAvatar = document.getElementById('profileAvatar');
    
    if (profileAvatar && !profileAvatar.hasAttribute('data-protected')) {
        const originalSrc = 'https://i.postimg.cc/gjmcXwV9/file-000000008fd461f4826bd65e36dbc3d2.png';
        profileAvatar.src = originalSrc;
        profileAvatar.setAttribute('data-protected', 'true');
        
        // Error handler
        profileAvatar.onerror = function() {
            this.src = 'https://via.placeholder.com/100x100/667eea/ffffff?text=👤';
        };
        
        console.log('🛡️ Profile avatar protected');
    }
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
            
            // Set onclick handler using the safe function
            sidebarUserNickname.onclick = handleProfileClick;
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

// Profile settings functions - Enhanced versions
function toggleSettingsMenu() {
    console.log('⚙️ Toggle settings menu');
    const settingsMenu = document.getElementById('settingsMenu');
    if (settingsMenu) {
        const isVisible = settingsMenu.style.display !== 'none';
        settingsMenu.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            // Update current nickname when opening settings
            updateCurrentNicknameField();
        }
    } else {
        console.warn('⚠️ Settings menu not found');
    }
}

function updateCurrentNicknameField() {
    const currentNicknameInput = document.getElementById('currentNickname');
    if (currentNicknameInput) {
        if (window.authManager && window.authManager.userProfile) {
            currentNicknameInput.value = window.authManager.userProfile.nickname || 'User';
        } else {
            const savedUser = localStorage.getItem('armHelper_currentUser');
            if (savedUser) {
                try {
                    const user = JSON.parse(savedUser);
                    currentNicknameInput.value = user.nickname || 'User';
                } catch (e) {
                    currentNicknameInput.value = 'User';
                }
            }
        }
    }
}

function closeSettingsMenu() {
    console.log('⚙️ Close settings menu');
    const settingsMenu = document.getElementById('settingsMenu');
    const settingsForms = document.querySelectorAll('.settings-form');
    
    if (settingsMenu) {
        settingsMenu.style.display = 'none';
    }
    
    settingsForms.forEach(form => {
        form.style.display = 'none';
    });
}

function toggleStatsView() {
    console.log('📊 Toggle stats view');
    const statsView = document.getElementById('statsView');
    if (statsView) {
        statsView.style.display = statsView.style.display === 'none' ? 'block' : 'none';
        
        // Update stats when showing
        if (statsView.style.display === 'block') {
            updateStatsView();
        }
    } else {
        console.warn('⚠️ Stats view not found');
    }
}

function closeStatsView() {
    console.log('📊 Close stats view');
    const statsView = document.getElementById('statsView');
    if (statsView) {
        statsView.style.display = 'none';
    }
}

function goBackFromProfile() {
    console.log('← Going back from profile');
    if (typeof switchPage === 'function') {
        switchPage('calculator');
    } else {
        console.warn('⚠️ switchPage function not available');
    }
}

function updateStatsView() {
    console.log('📊 Updating stats view');
    try {
        // Update login count
        const loginCountEl = document.getElementById('loginCount');
        if (loginCountEl) {
            const loginCount = parseInt(localStorage.getItem('armHelper_loginCount') || '1');
            loginCountEl.textContent = loginCount;
        }

        // Update last login
        const lastLoginEl = document.getElementById('lastLoginDate');
        if (lastLoginEl) {
            const lastLogin = localStorage.getItem('armHelper_lastLogin');
            if (lastLogin) {
                const date = new Date(lastLogin);
                const today = new Date();
                
                if (date.toDateString() === today.toDateString()) {
                    lastLoginEl.textContent = 'Today';
                } else {
                    lastLoginEl.textContent = date.toLocaleDateString();
                }
            } else {
                lastLoginEl.textContent = 'Today';
            }
        }
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Enhanced form handlers with better error handling
function handleChangePassword(event) {
    event.preventDefault();
    console.log('🔑 Password change form submitted');
    
    // Use the enhanced handler from profile-settings.js if available
    if (typeof window.handleChangePassword === 'function') {
        return window.handleChangePassword(event);
    } else {
        console.error('❌ Enhanced password change handler not found');
        alert('Password change functionality not available. Please refresh the page.');
    }
}

function handleChangeNickname(event) {
    event.preventDefault();
    console.log('✏️ Nickname change form submitted');
    
    // Use the enhanced handler from profile-settings.js if available
    if (typeof window.handleChangeNickname === 'function') {
        return window.handleChangeNickname(event);
    } else {
        console.error('❌ Enhanced nickname change handler not found');
        alert('Nickname change functionality not available. Please refresh the page.');
    }
}

// Profile settings stub functions for compatibility
function showChangePassword() {
    console.log('🔒 Show change password');
    if (typeof window.showChangePassword === 'function') {
        return window.showChangePassword();
    }
    
    const settingsMenu = document.getElementById('settingsMenu');
    const changePasswordForm = document.getElementById('changePasswordForm');
    
    if (settingsMenu) settingsMenu.style.display = 'none';
    if (changePasswordForm) changePasswordForm.style.display = 'block';
}

function showChangeNickname() {
    console.log('✏️ Show change nickname');
    if (typeof window.showChangeNickname === 'function') {
        return window.showChangeNickname();
    }
    
    const settingsMenu = document.getElementById('settingsMenu');
    const changeNicknameForm = document.getElementById('changeNicknameForm');
    
    if (settingsMenu) settingsMenu.style.display = 'none';
    if (changeNicknameForm) changeNicknameForm.style.display = 'block';
    
    // Update current nickname
    updateCurrentNicknameField();
}

function backToSettingsMenu() {
    console.log('← Back to settings menu');
    if (typeof window.backToSettingsMenu === 'function') {
        return window.backToSettingsMenu();
    }
    
    const settingsForms = document.querySelectorAll('.settings-form');
    const settingsMenu = document.getElementById('settingsMenu');
    
    settingsForms.forEach(form => {
        form.style.display = 'none';
    });
    
    if (settingsMenu) {
        settingsMenu.style.display = 'block';
    }
}

function confirmDeleteAccount() {
    console.log('⚠️ Confirm delete account');
    if (typeof window.confirmDeleteAccount === 'function') {
        return window.confirmDeleteAccount();
    }
    
    closeSettingsMenu();
    
    const isConfirmed = confirm(
        'Are you absolutely sure you want to delete your account?\n\n' +
        'This action cannot be undone. All your data will be permanently deleted.\n\n' +
        'Click OK to continue with deletion.'
    );

    if (isConfirmed) {
        const confirmation = prompt('Please type "DELETE" to confirm account deletion:');
        
        if (confirmation === 'DELETE') {
            deleteUserAccount();
        } else if (confirmation !== null) {
            alert('Account deletion cancelled - confirmation text did not match');
        }
    }
}

function deleteUserAccount() {
    console.log('🗑️ Delete user account');
    if (typeof window.deleteUserAccount === 'function') {
        return window.deleteUserAccount();
    }
    
    // Basic fallback
    try {
        const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
        const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
        
        const updatedUsers = savedUsers.filter(u => u.nickname !== currentUser.nickname);
        localStorage.setItem('armHelper_users', JSON.stringify(updatedUsers));
        
        localStorage.removeItem('armHelper_currentUser');
        
        alert('Your account has been successfully deleted.');
        
        setTimeout(() => {
            if (typeof switchPage === 'function') {
                switchPage('login');
            } else {
                window.location.reload();
            }
        }, 1000);
    } catch (error) {
        console.error('Delete account error:', error);
        alert('Failed to delete account. Please try again.');
    }
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
window.handleProfileClick = handleProfileClick;
window.manualProfileUpdate = manualProfileUpdate;
window.updateSidebarForAuthenticatedUser = updateSidebarForAuthenticatedUser;
window.updateSidebarForSignedOutUser = updateSidebarForSignedOutUser;
window.checkUserAuthentication = checkUserAuthentication;

// Profile functions
window.toggleSettingsMenu = toggleSettingsMenu;
window.closeSettingsMenu = closeSettingsMenu;
window.toggleStatsView = toggleStatsView;
window.closeStatsView = closeStatsView;
window.goBackFromProfile = goBackFromProfile;
window.updateStatsView = updateStatsView;
window.showChangePassword = showChangePassword;
window.showChangeNickname = showChangeNickname;
window.backToSettingsMenu = backToSettingsMenu;
window.confirmDeleteAccount = confirmDeleteAccount;
window.deleteUserAccount = deleteUserAccount;
window.updateCurrentNicknameField = updateCurrentNicknameField;
window.initializeProfileFunctionality = initializeProfileFunctionality;
window.protectProfileAvatar = protectProfileAvatar;

console.log('✅ content_loader.js FULLY loaded with enhanced profile support');
