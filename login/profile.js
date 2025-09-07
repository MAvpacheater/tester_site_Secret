// Enhanced Profile System with Persistent Authentication - profile.js
const ProfileSystem = {
    currentUser: null,
    authManager: null,

    // Initialize profile system
    init() {
        console.log('👤 Initializing Enhanced Profile System with persistence...');
        this.authManager = window.authManager;
        this.bindEvents();
        
        // Setup form validation and settings toggles
        if (typeof ProfileSettings !== 'undefined') {
            ProfileSettings.setupFormValidation();
            ProfileSettings.setupSettingsToggles();
        }
        
        // Load user data immediately if available
        this.loadCurrentUserData();
    },

    // Enhanced user data loading with persistent auth support
    loadCurrentUserData() {
        console.log('🔄 Loading current user data...');

        // Priority 1: Check authenticated user via auth manager
        if (this.authManager && this.authManager.currentUser && this.authManager.userProfile) {
            console.log('✅ Found user via auth manager:', this.authManager.userProfile.nickname);
            this.handleUserAuthenticated({
                user: this.authManager.currentUser,
                profile: this.authManager.userProfile
            });
            return;
        }

        // Priority 2: Check persistent localStorage auth
        const savedUser = localStorage.getItem('armHelper_currentUser');
        const persistentAuth = localStorage.getItem('armHelper_persistentAuth');
        
        if (savedUser && persistentAuth === 'true') {
            try {
                const user = JSON.parse(savedUser);
                console.log('✅ Found persistent user in localStorage:', user.nickname);
                
                // Create user object that matches the expected structure
                const userObj = {
                    id: user.id || 'local-user',
                    email: user.email || `${user.nickname}@local.test`,
                    nickname: user.nickname
                };
                
                this.handleUserAuthenticated({
                    user: userObj,
                    profile: user
                });

                // Update auth manager if it exists but doesn't have user
                if (this.authManager && !this.authManager.currentUser) {
                    this.authManager.currentUser = userObj;
                    this.authManager.userProfile = user;
                }
                
                return;
            } catch (e) {
                console.warn('⚠️ Error parsing saved user data:', e);
                localStorage.removeItem('armHelper_currentUser');
                localStorage.removeItem('armHelper_persistentAuth');
            }
        }

        // Priority 3: No authentication found
        console.log('ℹ️ No user authentication found');
        this.setNicknameLoading();
    },

    // Set loading state for nickname
    setNicknameLoading() {
        const profileNickname = document.getElementById('profileNickname');
        if (profileNickname) {
            profileNickname.textContent = nickname;
            profileNickname.classList.remove('loading');
        }

        if (profileAvatar) {
            // Generate avatar with first letter of nickname and dynamic colors
            const firstLetter = nickname.charAt(0).toUpperCase();
            const colors = [
                '667eea', '764ba2', '667292', 'f093fb', 
                'f5576c', '4facfe', '43e97b', 'fa709a',
                'fee140', 'a8edea', 'fed6e3', 'ffecd2'
            ];
            const color = colors[nickname.length % colors.length];
            
            profileAvatar.src = `https://via.placeholder.com/100x100/${color}/ffffff?text=${firstLetter}`;
            profileAvatar.alt = `${nickname}'s avatar`;
        }

        if (currentNicknameInput) {
            currentNicknameInput.value = nickname;
        }

        // Update stats
        this.updateProfileStats();
    },

    // Enhanced profile stats update
    async updateProfileStats() {
        try {
            console.log('📊 Updating profile stats...');

            // Count saved calculations
            let calculationsCount = 0;
            const calculatorTypes = ['calculator', 'arm', 'grind'];
            
            for (const type of calculatorTypes) {
                const settings = await this.loadCalculatorSettings(type);
                if (settings && Object.keys(settings).length > 0) {
                    calculationsCount++;
                }
            }

            const calculationsEl = document.getElementById('calculationsCount');
            if (calculationsEl) {
                calculationsEl.textContent = calculationsCount;
            }

            // Update login count with persistence support
            const loginCountEl = document.getElementById('loginCount');
            if (loginCountEl) {
                let loginCount = parseInt(localStorage.getItem('armHelper_loginCount') || '1');
                
                // If we have persistent auth but no login count, set it to 1
                const persistentAuth = localStorage.getItem('armHelper_persistentAuth');
                if (persistentAuth === 'true' && !localStorage.getItem('armHelper_loginCount')) {
                    loginCount = 1;
                    localStorage.setItem('armHelper_loginCount', '1');
                }
                
                loginCountEl.textContent = loginCount;
            }

            // Update last login with better formatting
            const lastLoginEl = document.getElementById('lastLoginDate');
            if (lastLoginEl) {
                const lastLogin = localStorage.getItem('armHelper_lastLogin');
                if (lastLogin) {
                    const date = new Date(lastLogin);
                    const today = new Date();
                    
                    if (date.toDateString() === today.toDateString()) {
                        lastLoginEl.textContent = 'Today';
                    } else {
                        const diffTime = Math.abs(today - date);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        
                        if (diffDays === 1) {
                            lastLoginEl.textContent = 'Yesterday';
                        } else if (diffDays < 7) {
                            lastLoginEl.textContent = `${diffDays} days ago`;
                        } else if (diffDays < 30) {
                            lastLoginEl.textContent = `${Math.floor(diffDays / 7)} weeks ago`;
                        } else {
                            lastLoginEl.textContent = date.toLocaleDateString();
                        }
                    }
                } else {
                    // If no last login but we have persistent auth, assume today
                    const persistentAuth = localStorage.getItem('armHelper_persistentAuth');
                    if (persistentAuth === 'true') {
                        lastLoginEl.textContent = 'Today';
                        localStorage.setItem('armHelper_lastLogin', new Date().toISOString());
                    } else {
                        lastLoginEl.textContent = 'Unknown';
                    }
                }
            }

            console.log('✅ Profile stats updated');

        } catch (error) {
            console.error('❌ Error updating profile stats:', error);
        }
    },

    // Load calculator settings with enhanced error handling
    async loadCalculatorSettings(type) {
        try {
            if (this.authManager && typeof this.authManager.loadCalculatorSettings === 'function') {
                return await this.authManager.loadCalculatorSettings(type);
            } else {
                const settings = localStorage.getItem(`armHelper_${type}_settings`);
                return settings ? JSON.parse(settings) : null;
            }
        } catch (error) {
            console.warn(`⚠️ Error loading ${type} settings:`, error);
            return null;
        }
    },

    // Enhanced message display
    showMessage(text, type = 'success') {
        const messageEl = document.getElementById('profileMessage');
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.className = `profile-message ${type}`;
            messageEl.style.display = 'block';

            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 4000);
        }

        // Also log for debugging
        console.log(`📝 Profile message (${type}):`, text);
    },

    // Loading state management
    showLoading(button, show = true) {
        if (show) {
            button.classList.add('loading');
            button.disabled = true;
            button.style.opacity = '0.6';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            button.style.opacity = '1';
        }
    },

    // Get current user data
    getCurrentUserData() {
        return this.currentUser;
    },

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    },

    // Reload profile data
    reloadProfileData() {
        console.log('🔄 Reloading profile data...');
        this.loadCurrentUserData();
        if (this.currentUser) {
            this.updateProfileDisplay();
        }
    },

    // Clear profile data on logout
    clearProfileData() {
        console.log('🧹 Clearing profile data...');
        this.currentUser = null;
        this.setNicknameLoading();
        
        // Clear UI elements
        const profileAvatar = document.getElementById('profileAvatar');
        if (profileAvatar) {
            profileAvatar.src = "https://i.postimg.cc/gjmcXwV9/file-000000008fd461f4826bd65e36dbc3d2.png/80x80/667eea/ffffff?text=👤";
            profileAvatar.alt = "Avatar";
        }
        
        const currentNicknameInput = document.getElementById('currentNickname');
        if (currentNicknameInput) {
            currentNicknameInput.value = '';
        }
        
        // Reset stats
        const calculationsEl = document.getElementById('calculationsCount');
        const loginCountEl = document.getElementById('loginCount');
        const lastLoginEl = document.getElementById('lastLoginDate');
        
        if (calculationsEl) calculationsEl.textContent = '0';
        if (loginCountEl) loginCountEl.textContent = '0';
        if (lastLoginEl) lastLoginEl.textContent = 'Unknown';
    }
};

// Enhanced profile initialization
function initializeProfile() {
    console.log('👤 Initializing Enhanced Profile system with persistence...');
    
    const profilePage = document.getElementById('profilePage');
    if (!profilePage) {
        console.warn('⚠️ Profile page not found');
        return;
    }

    ProfileSystem.init();
    console.log('✅ Enhanced Profile system initialized with persistence support');
}

// Enhanced profile display refresh
function refreshProfileDisplay() {
    console.log('🔄 Refreshing profile display with persistent auth...');
    if (ProfileSystem) {
        ProfileSystem.loadCurrentUserData();
        ProfileSystem.updateProfileDisplay();
    }
}

// Export functions for global use
if (typeof window !== 'undefined') {
    window.ProfileSystem = ProfileSystem;
    window.initializeProfile = initializeProfile;
    window.refreshProfileDisplay = refreshProfileDisplay;
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof initializeProfile === 'function') {
            initializeProfile();
        }
    }, 100);
});

// Listen for page switches to refresh profile data
document.addEventListener('pageChanged', (event) => {
    if (event.detail?.page === 'profile') {
        setTimeout(() => {
            refreshProfileDisplay();
        }, 50);
    }
});.textContent = 'Not logged in';
            profileNickname.classList.add('loading');
        }
    },

    // Bind events
    bindEvents() {
        // Listen for user authentication events
        document.addEventListener('userAuthenticated', (event) => {
            console.log('👤 Profile System: Received userAuthenticated event');
            this.handleUserAuthenticated(event.detail);
        });

        document.addEventListener('userSignedOut', () => {
            console.log('👤 Profile System: Received userSignedOut event');
            this.handleUserSignedOut();
        });

        // Listen for auth manager ready event
        document.addEventListener('authManagerReady', () => {
            console.log('👤 Profile System: Auth manager ready, reloading data');
            setTimeout(() => {
                this.loadCurrentUserData();
            }, 100);
        });
    },

    // Handle user authenticated with enhanced logging
    handleUserAuthenticated(detail) {
        console.log('👤 Profile System: Handling user authentication', detail);
        const { user, profile } = detail;
        this.currentUser = { user, profile };
        this.updateProfileDisplay();
    },

    // Handle user signed out
    handleUserSignedOut() {
        console.log('👤 Profile System: Handling user sign out');
        this.currentUser = null;
        this.setNicknameLoading();
    },

    // Enhanced profile display update
    updateProfileDisplay() {
        if (!this.currentUser) {
            console.log('⚠️ No current user for profile display');
            this.setNicknameLoading();
            return;
        }

        const { user, profile } = this.currentUser;
        
        // Determine the nickname to display (priority order)
        let nickname = 'User'; // fallback
        
        if (profile?.nickname) {
            nickname = profile.nickname;
        } else if (user?.nickname) {
            nickname = user.nickname;
        } else if (user?.email) {
            nickname = user.email.split('@')[0];
        }

        console.log('👤 Updating profile display for:', nickname);

        // Update profile info elements
        const profileNickname = document.getElementById('profileNickname');
        const profileAvatar = document.getElementById('profileAvatar');
        const currentNicknameInput = document.getElementById('currentNickname');

        if (profileNickname) {
            profileNickname
