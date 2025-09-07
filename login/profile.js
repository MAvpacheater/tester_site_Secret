// profile.js - Основна логіка профілю
console.log('👤 Loading profile.js...');

// Profile System Object
const ProfileSystem = {
    currentUser: null,
    authManager: null,

    // Initialize profile system
    init() {
        console.log('👤 Initializing Profile System...');
        this.authManager = window.authManager;
        this.bindEvents();
        this.checkInitialAuthState();
    },

    // Bind events
    bindEvents() {
        // Listen for user authentication events
        document.addEventListener('userAuthenticated', (event) => {
            this.handleUserAuthenticated(event.detail);
        });

        document.addEventListener('userSignedOut', () => {
            this.handleUserSignedOut();
        });
    },

    // Handle user authenticated
    handleUserAuthenticated(detail) {
        const { user, profile } = detail;
        this.currentUser = { user, profile };
        console.log('✅ User authenticated in profile system:', user);
    },

    // Handle user signed out
    handleUserSignedOut() {
        this.currentUser = null;
        console.log('✅ User signed out from profile system');
    },

    // Check initial auth state
    checkInitialAuthState() {
        setTimeout(() => {
            if (window.authManager && window.authManager.currentUser) {
                this.currentUser = {
                    user: window.authManager.currentUser,
                    profile: window.authManager.userProfile
                };
            } else {
                const savedUser = localStorage.getItem('armHelper_currentUser');
                if (savedUser) {
                    try {
                        const user = JSON.parse(savedUser);
                        this.currentUser = { user, profile: user };
                    } catch (e) {
                        console.warn('Invalid saved user data');
                        localStorage.removeItem('armHelper_currentUser');
                    }
                }
            }
        }, 100);
    }
};

// Initialize profile system
function initializeProfile() {
    console.log('👤 Initializing Profile system...');
    
    const profilePage = document.getElementById('profilePage');
    if (!profilePage) {
        console.warn('⚠️ Profile page not found');
        return;
    }

    ProfileSystem.init();
    
    // Initialize settings if available
    if (typeof initializeProfileSettings === 'function') {
        initializeProfileSettings();
    }
    
    console.log('✅ Profile system initialized');
}

// Export for global use
if (typeof window !== 'undefined') {
    window.ProfileSystem = ProfileSystem;
    window.initializeProfile = initializeProfile;
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof initializeProfile === 'function') {
            initializeProfile();
        }
    }, 100);
});

console.log('✅ profile.js loaded');
