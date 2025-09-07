// Enhanced content loader script - Fixed version
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

                    /* Захист аватарки від перезавантаження */
                    .profile-avatar {
                        position: relative;
                    }

                    .avatar-img {
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        object-fit: cover;
                        border: 3px solid rgba(255, 255, 255, 0.2);
                        transition: all 0.3s ease;
                        /* Фіксуємо розміри щоб уникнути "стрибання" при зміні зображення */
                        min-width: 80px;
                        min-height: 80px;
                        max-width: 80px;
                        max-height: 80px;
                    }

                    .avatar-img:hover {
                        transform: scale(1.05);
                        border-color: rgba(255, 255, 255, 0.4);
                    }

                    /* Індикатор завантаження аватарки */
                    .avatar-img:not([data-initialized]) {
                        opacity: 0.7;
                        filter: blur(1px);
                    }

                    .avatar-img[data-initialized] {
                        opacity: 1;
                        filter: none;
                    }

                    /* Резервний стиль якщо зображення не завантажилось */
                    .avatar-img[src*="placeholder"] {
                        background: linear-gradient(135deg, #667eea, #764ba2);
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 24px;
                    }

                    /* Анімація завантаження */
                    @keyframes avatarLoad {
                        0% {
                            opacity: 0;
                            transform: scale(0.8);
                        }
                        100% {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }

                    .avatar-img[data-initialized] {
                        animation: avatarLoad 0.3s ease-out;
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

// Handle profile click with fallback
function handleProfileClick() {
    console.log('🖱️ Profile click detected');
    
    // Try to use the openProfile function if available
    if (typeof window.openProfile === 'function') {
        window.openProfile();
        return;
    }
    
    // Fallback: try to switch to profile page directly
    if (typeof switchPage === 'function') {
        console.log('📄 Using switchPage fallback');
        switchPage('profile');
        
        // Використовуємо безпечне оновлення профілю
        setTimeout(() => {
            if (typeof window.updateProfileDisplay === 'function') {
                window.updateProfileDisplay();
            } else {
                console.log('📋 Using safe profile update');
                updateProfileDisplaySafe(); // Використовуємо нову функцію
            }
        }, 200);
    } else {
        console.error('❌ No profile opening method available');
        alert('Profile functionality not available. Please refresh the page.');
    }
}

// ВИПРАВЛЕНА функція manualProfileUpdate - БЕЗ ЗМІНИ АВАТАРКИ!
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
    const currentNicknameInput = document.getElementById('currentNickname');
    
    if (profileNickname) {
        profileNickname.textContent = nickname;
    }
    
    // НЕ ЗМІНЮЄМО АВАТАРКУ! Залишаємо оригінальне посилання
    // Видалено код що змінював profileAvatar.src
    
    if (currentNicknameInput) {
        currentNicknameInput.value = nickname;
    }
    
    console.log('✅ Manual profile update completed - avatar preserved');
}

// Нова безпечна функція оновлення профілю без зміни аватарки
function updateProfileDisplaySafe() {
    console.log('🔄 Safe profile display update...');
    
    // Get current user
    let currentUser = null;
    
    if (window.authManager && window.authManager.currentUser) {
        currentUser = {
            user: window.authManager.currentUser,
            profile: window.authManager.userProfile
        };
    } else {
        const savedUser = localStorage.getItem('armHelper_currentUser');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                currentUser = { user, profile: user };
            } catch (e) {
                console.warn('Invalid saved user data');
                return;
            }
        }
    }
    
    if (!currentUser) {
        console.warn('No user data for safe update');
        return;
    }
    
    const { user, profile } = currentUser;
    const nickname = profile?.nickname || user?.email?.split('@')[0] || 'User';
    
    // Оновлюємо тільки текстові елементи
    const profileNickname = document.getElementById('profileNickname');
    const profileStatus = document.querySelector('.profile-status');
    const currentNicknameInput = document.getElementById('currentNickname');
    const sidebarUserNickname = document.getElementById('sidebarUserNickname');
    
    if (profileNickname) {
        profileNickname.textContent = nickname;
    }
    
    if (profileStatus) {
        const joinDate = profile?.joinDate || user?.joinDate || new Date().toLocaleDateString();
        profileStatus.innerHTML = `Lvl: 0 <span id="profileJoinDate">(${joinDate})</span>`;
    }
    
    if (currentNicknameInput) {
        currentNicknameInput.value = nickname;
    }
    
    if (sidebarUserNickname) {
        sidebarUserNickname.textContent = nickname;
    }
    
    console.log('✅ Safe profile update completed');
}

// Функція для налаштування аватарки один раз при ініціалізації
function initializeAvatarOnce() {
    const profileAvatar = document.getElementById('profileAvatar');
    
    if (profileAvatar && !profileAvatar.hasAttribute('data-initialized')) {
        // Встановлюємо постійну аватарку
        profileAvatar.src = 'https://i.postimg.cc/gjmcXwV9/file-000000008fd461f4826bd65e36dbc3d2.png';
        profileAvatar.alt = 'User Avatar';
        profileAvatar.setAttribute('data-initialized', 'true');
        
        // Додаємо обробник помилки завантаження
        profileAvatar.onerror = function() {
            this.src = 'https://via.placeholder.com/80x80/667eea/ffffff?text=👤';
        };
        
        console.log('✅ Avatar initialized and protected');
    }
}

// Захист аватарки за допомогою MutationObserver
function protectAvatar() {
    const profileAvatar = document.getElementById('profileAvatar');
    if (!profileAvatar) return;
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                const currentSrc = profileAvatar.src;
                const expectedSrc = 'https://i.postimg.cc/gjmcXwV9/file-000000008fd461f4826bd65e36dbc3d2.png';
                
                // Якщо зображення змінилось не на те, що ми хочемо, повертаємо назад
                if (!currentSrc.includes('postimg.cc') && !currentSrc.includes('placeholder')) {
                    console.log('🛡️ Protecting avatar from unwanted change');
                    profileAvatar.src = expectedSrc;
                }
            }
        });
    });
    
    observer.observe(profileAvatar, {
        attributes: true,
        attributeFilter: ['src']
    });
    
    console.log('🛡️ Avatar protection observer active');
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
    // Ініціалізуємо захист аватарки
    setTimeout(() => {
        initializeAvatarOnce();
        protectAvatar();
    }, 100);
});

// Також ініціалізуємо при зміні сторінки на профіль
document.addEventListener('pageChanged', (event) => {
    if (event.detail && event.detail.page === 'profile') {
        setTimeout(() => {
            initializeAvatarOnce();
        }, 50);
    }
});

// Profile settings functions - Add fallbacks for missing functions
function toggleSettingsMenu() {
    console.log('⚙️ Toggle settings menu');
    const settingsMenu = document.getElementById('settingsMenu');
    if (settingsMenu) {
        settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
    } else {
        console.warn('⚠️ Settings menu not found');
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
        // Count saved calculations
        let calculationsCount = 0;
        const calculatorTypes = ['calculator', 'arm', 'grind'];
        
        for (const type of calculatorTypes) {
            const settings = localStorage.getItem(`armHelper_${type}_settings`);
            if (settings) calculationsCount++;
        }

        const calculationsEl = document.getElementById('calculationsCount');
        if (calculationsEl) {
            calculationsEl.textContent = calculationsCount;
        }

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

// Profile settings stub functions
function showChangePassword() {
    console.log('🔒 Show change password');
    const settingsMenu = document.getElementById('settingsMenu');
    const changePasswordForm = document.getElementById('changePasswordForm');
    
    if (settingsMenu) settingsMenu.style.display = 'none';
    if (changePasswordForm) changePasswordForm.style.display = 'block';
}

function showChangeNickname() {
    console.log('✏️ Show change nickname');
    const settingsMenu = document.getElementById('settingsMenu');
    const changeNicknameForm = document.getElementById('changeNicknameForm');
    
    if (settingsMenu) settingsMenu.style.display = 'none';
    if (changeNicknameForm) changeNicknameForm.style.display = 'block';
}

function showPreferences() {
    console.log('🎛️ Show preferences');
    const settingsMenu = document.getElementById('settingsMenu');
    const preferencesForm = document.getElementById('preferencesForm');
    
    if (settingsMenu) settingsMenu.style.display = 'none';
    if (preferencesForm) preferencesForm.style.display = 'block';
}

function backToSettingsMenu() {
    console.log('← Back to settings menu');
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
    try {
        // Remove from localStorage
        const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
        const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
        
        const updatedUsers = savedUsers.filter(u => u.nickname !== currentUser.nickname);
        localStorage.setItem('armHelper_users', JSON.stringify(updatedUsers));
        
        localStorage.removeItem('armHelper_currentUser');
        
        // Clear user settings
        const settingsKeys = ['calculator', 'arm', 'grind'];
        settingsKeys.forEach(key => {
            localStorage.removeItem(`armHelper_${key}_settings`);
        });
        
        alert('Your account has been successfully deleted.');
        
        setTimeout(() => {
            if (typeof switchPage === 'function') {
                switchPage('login');
            }
        }, 1000);
    } catch (error) {
        console.error('Delete account error:', error);
        alert('Failed to delete account. Please try again.');
    }
}

// Form handlers
function handleChangePassword(event) {
    event.preventDefault();
    alert('Password change functionality is not fully implemented yet.');
}

function handleChangeNickname(event) {
    event.preventDefault();
    alert('Nickname change functionality is not fully implemented yet.');
}

// Make functions globally available
window.handleAuthAction = handleAuthAction;
window.handleProfileClick = handleProfileClick;
window.manualProfileUpdate = manualProfileUpdate;
window.updateProfileDisplaySafe = updateProfileDisplaySafe;
window.initializeAvatarOnce = initializeAvatarOnce;
window.protectAvatar = protectAvatar;
window.updateSidebarForAuthenticatedUser = updateSidebarForAuthenticatedUser;
window.updateSidebarForSignedOutUser = updateSidebarForSignedOutUser;

// Profile functions
window.toggleSettingsMenu = toggleSettingsMenu;
window.closeSettingsMenu = closeSettingsMenu;
window.toggleStatsView = toggleStatsView;
window.closeStatsView = closeStatsView;
window.goBackFromProfile = goBackFromProfile;
window.updateStatsView = updateStatsView;
window.showChangePassword = showChangePassword;
window.showChangeNickname = showChangeNickname;
window.showPreferences = showPreferences;
window.backToSettingsMenu = backToSettingsMenu;
window.confirmDeleteAccount = confirmDeleteAccount;
window.deleteUserAccount = deleteUserAccount;
window.handleChangePassword = handleChangePassword;
window.handleChangeNickname = handleChangeNickname;
