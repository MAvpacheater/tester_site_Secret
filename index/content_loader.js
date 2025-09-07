// Enhanced content loader script - З ПОСТІЙНОЮ АУТЕНТИФІКАЦІЄЮ
console.log('🔄 Loading content with persistent authentication...');

// Function to load content
async function loadContent() {
    try {
        // Load content files
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
            // Create the main structure with navigation
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
                    
                    <!-- Enhanced User Section with persistent state -->
                    <div class="sidebar-user" id="sidebarUser">
                        <div class="user-info" id="userInfo" style="display: none;">
                            <div class="user-avatar">
                                <div class="avatar-circle" id="sidebarUserAvatar">👤</div>
                            </div>
                            <div class="user-details">
                                <div class="user-nickname clickable-nickname loading" id="sidebarUserNickname" onclick="safeOpenProfile()" title="Click to view profile">Restoring...</div>
                                <div class="user-status">Logged in</div>
                            </div>
                        </div>
                        <button class="auth-btn-sidebar" id="authButton" onclick="handleAuthAction()">Loading...</button>
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
                    
                    .auth-btn-sidebar.loading {
                        opacity: 0.7;
                        cursor: wait;
                        background: rgba(255, 255, 255, 0.05);
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
                        transition: all 0.3s ease;
                    }

                    .user-info.restoring {
                        opacity: 0.8;
                        background: rgba(255, 255, 255, 0.05);
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
                        transition: all 0.3s ease;
                    }

                    .avatar-circle.loading {
                        animation: pulse 1.5s ease-in-out infinite;
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
                        transition: all 0.3s ease;
                    }

                    .user-nickname.loading {
                        opacity: 0.6;
                        animation: pulse 1.5s ease-in-out infinite;
                        color: #cccccc;
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
                    
                    .clickable-nickname:hover:not(.loading) {
                        background: rgba(255, 255, 255, 0.15);
                        transform: scale(1.02);
                        color: #ffffff;
                    }
                    
                    .clickable-nickname:active:not(.loading) {
                        transform: scale(0.98);
                    }

                    .clickable-nickname.loading:hover {
                        cursor: wait;
                        transform: none;
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

                    /* Loading and pulse animations */
                    @keyframes pulse {
                        0% { opacity: 0.6; }
                        50% { opacity: 1; }
                        100% { opacity: 0.6; }
                    }

                    /* Auth restoration state */
                    .auth-restoring {
                        pointer-events: none;
                        opacity: 0.7;
                    }

                    .auth-restoring .auth-btn-sidebar {
                        background: rgba(255, 255, 255, 0.05);
                        cursor: wait;
                    }
                </style>
            `;

            appContent.innerHTML = fullContent;
            console.log('✅ Content loaded successfully with persistent authentication support');
            
            // Set initial auth restoration state
            setAuthRestorationState(true);
            
            // Dispatch event that content is loaded
            document.dispatchEvent(new CustomEvent('contentLoaded'));
            
            // Wait for DOM and then initialize
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

// БЕЗПЕЧНА функція для відкриття профілю з перевірками
function safeOpenProfile() {
    console.log('🔄 Safe profile open called...');
    
    // Перевіряємо чи функція існує в різних місцях
    if (typeof window.openProfile === 'function') {
        console.log('✅ Found window.openProfile, calling...');
        window.openProfile();
        return;
    }
    
    if (typeof openProfile === 'function') {
        console.log('✅ Found global openProfile, calling...');
        openProfile();
        return;
    }
    
    if (window.ProfileOpen && typeof window.ProfileOpen.openProfile === 'function') {
        console.log('✅ Found ProfileOpen.openProfile, calling...');
        window.ProfileOpen.openProfile();
        return;
    }
    
    // Якщо нічого не знайшли, пробуємо почекати та спробувати ще раз
    console.log('⚠️ openProfile not found, waiting and retrying...');
    setTimeout(() => {
        if (typeof window.openProfile === 'function') {
            console.log('✅ Found window.openProfile after wait, calling...');
            window.openProfile();
        } else if (typeof openProfile === 'function') {
            console.log('✅ Found global openProfile after wait, calling...');
            openProfile();
        } else {
            console.error('❌ openProfile function still not found after wait');
            // Fallback - просто переходимо на сторінку профілю
            if (typeof switchPage === 'function') {
                switchPage('profile');
            }
        }
    }, 500);
}

// Set authentication restoration state
function setAuthRestorationState(isRestoring) {
    const sidebarUser = document.getElementById('sidebarUser');
    const userInfo = document.getElementById('userInfo');
    const authButton = document.getElementById('authButton');
    const sidebarUserNickname = document.getElementById('sidebarUserNickname');
    const sidebarUserAvatar = document.getElementById('sidebarUserAvatar');

    if (isRestoring) {
        console.log('🔄 Setting auth restoration state...');
        
        if (sidebarUser) {
            sidebarUser.classList.add('auth-restoring');
        }
        
        if (userInfo) {
            userInfo.classList.add('restoring');
        }
        
        if (authButton) {
            authButton.textContent = 'Loading...';
            authButton.classList.add('loading');
            authButton.disabled = true;
        }
        
        if (sidebarUserNickname) {
            sidebarUserNickname.textContent = 'Restoring...';
            sidebarUserNickname.classList.add('loading');
        }
        
        if (sidebarUserAvatar) {
            sidebarUserAvatar.classList.add('loading');
        }
    } else {
        console.log('✅ Clearing auth restoration state...');
        
        if (sidebarUser) {
            sidebarUser.classList.remove('auth-restoring');
        }
        
        if (userInfo) {
            userInfo.classList.remove('restoring');
        }
        
        if (authButton) {
            authButton.classList.remove('loading');
            authButton.disabled = false;
        }
