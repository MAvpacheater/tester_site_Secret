// Profile Opening Logic - profile-open.js
const ProfileOpen = {
    // Enhanced profile opening with auth checking
    openProfile() {
        console.log('👤 Opening profile page...');
        
        // Check multiple sources for authentication
        const hasAuthUser = window.authManager && window.authManager.currentUser;
        const hasLocalUser = localStorage.getItem('armHelper_currentUser');
        const hasPersistentAuth = localStorage.getItem('armHelper_persistentAuth') === 'true';
        
        if (!hasAuthUser && (!hasLocalUser || !hasPersistentAuth)) {
            console.log('⚠️ No authentication found, redirecting to login...');
            if (typeof ProfileSystem !== 'undefined' && ProfileSystem.showMessage) {
                ProfileSystem.showMessage('Please login to view your profile', 'error');
            }
            if (typeof switchPage === 'function') {
                switchPage('login');
            }
            return;
        }

        if (typeof switchPage === 'function') {
            switchPage('profile');
            
            // Small delay to ensure page is loaded, then update display
            setTimeout(() => {
                if (typeof ProfileSystem !== 'undefined') {
                    ProfileSystem.loadCurrentUserData();
                    ProfileSystem.updateProfileDisplay();
                }
            }, 100);
        }
    },

    // Enhanced profile navigation
    goBackFromProfile() {
        console.log('🔙 Going back from profile...');
        if (typeof switchPage === 'function') {
            switchPage('calculator');
        }
    },

    // Enhanced login stats update with persistence
    updateLoginStats() {
        console.log('📊 Updating login stats...');
        
        // Increment login count
        const currentCount = parseInt(localStorage.getItem('armHelper_loginCount') || '0');
        const newCount = currentCount + 1;
        localStorage.setItem('armHelper_loginCount', newCount.toString());
        
        // Update last login time
        const now = new Date().toISOString();
        localStorage.setItem('armHelper_lastLogin', now);
        
        console.log('✅ Login stats updated:', { 
            count: newCount, 
            lastLogin: now 
        });
    },

    // Check if user is authenticated
    isAuthenticated() {
        const hasAuthUser = window.authManager && window.authManager.currentUser;
        const hasLocalUser = localStorage.getItem('armHelper_currentUser');
        const hasPersistentAuth = localStorage.getItem('armHelper_persistentAuth') === 'true';
        
        return hasAuthUser || (hasLocalUser && hasPersistentAuth);
    },

    // Get current user info
    getCurrentUser() {
        // Priority 1: Check authenticated user via auth manager
        if (window.authManager && window.authManager.currentUser && window.authManager.userProfile) {
            return {
                user: window.authManager.currentUser,
                profile: window.authManager.userProfile
            };
        }

        // Priority 2: Check persistent localStorage auth
        const savedUser = localStorage.getItem('armHelper_currentUser');
        const persistentAuth = localStorage.getItem('armHelper_persistentAuth');
        
        if (savedUser && persistentAuth === 'true') {
            try {
                const user = JSON.parse(savedUser);
                const userObj = {
                    id: user.id || 'local-user',
                    email: user.email || `${user.nickname}@local.test`,
                    nickname: user.nickname
                };
                
                return {
                    user: userObj,
                    profile: user
                };
            } catch (e) {
                console.warn('⚠️ Error parsing saved user data:', e);
                localStorage.removeItem('armHelper_currentUser');
                localStorage.removeItem('armHelper_persistentAuth');
            }
        }

        return null;
    },

    // Enhanced profile initialization
    initializeProfile() {
        console.log('👤 Initializing profile opening system...');
        
        const profilePage = document.getElementById('profilePage');
        if (!profilePage) {
            console.warn('⚠️ Profile page not found');
            return;
        }

        // Set up event listeners for profile opening
        this.setupEventListeners();
        
        console.log('✅ Profile opening system initialized');
    },

    // Set up event listeners
    setupEventListeners() {
        // Listen for profile button clicks (if they exist in sidebar/navbar)
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="open-profile"]') || 
                e.target.matches('.profile-btn') ||
                e.target.closest('.profile-btn')) {
                e.preventDefault();
                this.openProfile();
            }
        });

        // Listen for back button clicks in profile
        document.addEventListener('click', (e) => {
            if (e.target.matches('[onclick="goBackFromProfile()"]') ||
                e.target.closest('[onclick="goBackFromProfile()"]')) {
                e.preventDefault();
                this.goBackFromProfile();
            }
        });

        // Listen for page changes to handle profile-specific logic
        document.addEventListener('pageChanged', (event) => {
            if (event.detail?.page === 'profile') {
                setTimeout(() => {
                    if (typeof ProfileSystem !== 'undefined') {
                        ProfileSystem.loadCurrentUserData();
                        ProfileSystem.updateProfileDisplay();
                    }
                }, 50);
            }
        });
    },

    // Refresh profile display
    refreshProfileDisplay() {
        console.log('🔄 Refreshing profile display...');
        if (typeof ProfileSystem !== 'undefined') {
            ProfileSystem.loadCurrentUserData();
            ProfileSystem.updateProfileDisplay();
        }
    }
};

// КРИТИЧНО ВАЖЛИВО: Визначаємо глобальні функції ОДРАЗУ
function openProfile() {
    console.log('🔄 Global openProfile called');
    ProfileOpen.openProfile();
}

function goBackFromProfile() {
    console.log('🔄 Global goBackFromProfile called');
    ProfileOpen.goBackFromProfile();
}

function updateLoginStats() {
    console.log('🔄 Global updateLoginStats called');
    ProfileOpen.updateLoginStats();
}

function initializeProfileOpen() {
    console.log('🔄 Global initializeProfileOpen called');
    ProfileOpen.initializeProfile();
}

function refreshProfileDisplay() {
    console.log('🔄 Global refreshProfileDisplay called');
    ProfileOpen.refreshProfileDisplay();
}

// НЕГАЙНО експортуємо в window (не чекаємо на DOM)
window.ProfileOpen = ProfileOpen;
window.openProfile = openProfile;
window.goBackFromProfile = goBackFromProfile;
window.updateLoginStats = updateLoginStats;
window.initializeProfileOpen = initializeProfileOpen;
window.refreshProfileDisplay = refreshProfileDisplay;

// Ініціалізуємо як тільки DOM готовий
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🔄 DOM loaded, initializing profile open...');
        ProfileOpen.initializeProfile();
    });
} else {
    // DOM вже готовий
    console.log('🔄 DOM already ready, initializing profile open immediately...');
    ProfileOpen.initializeProfile();
}
