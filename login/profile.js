// profile.js - Основна логіка профілю БЕЗ ЗМІНИ АВАТАРКИ
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
        
        // Захищаємо аватарку при ініціалізації
        setTimeout(() => {
            this.protectProfileAvatar();
        }, 200);
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
        
        // Захищаємо аватарку при зміні сторінки
        document.addEventListener('pageChanged', (event) => {
            if (event.detail && event.detail.page === 'profile') {
                setTimeout(() => {
                    this.protectProfileAvatar();
                }, 100);
            }
        });
    },

    // Захист аватарки профілю
    protectProfileAvatar() {
        const profileAvatar = document.getElementById('profileAvatar');
        
        if (profileAvatar && !profileAvatar.hasAttribute('data-protected')) {
            // Встановлюємо захищену аватарку
            const originalSrc = 'https://i.postimg.cc/gjmcXwV9/file-000000008fd461f4826bd65e36dbc3d2.png';
            profileAvatar.src = originalSrc;
            profileAvatar.setAttribute('data-protected', 'true');
            profileAvatar.setAttribute('data-initialized', 'true');
            
            // Обробник помилки завантаження
            profileAvatar.onerror = function() {
                this.src = 'https://via.placeholder.com/80x80/667eea/ffffff?text=👤';
            };
            
            // MutationObserver для захисту від змін
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                        const currentSrc = profileAvatar.src;
                        
                        // Якщо хтось намагається змінити аватарку, повертаємо оригінальну
                        if (!currentSrc.includes('postimg.cc') && !currentSrc.includes('placeholder')) {
                            console.log('🛡️ Avatar protection: restoring original image');
                            profileAvatar.src = originalSrc;
                        }
                    }
                });
            });
            
            observer.observe(profileAvatar, {
                attributes: true,
                attributeFilter: ['src']
            });
            
            console.log('🛡️ Profile avatar protected');
        }
    },

    // Handle user authenticated
    handleUserAuthenticated(detail) {
        const { user, profile } = detail;
        this.currentUser = { user, profile };
        console.log('✅ User authenticated in profile system:', user);
        
        // Оновлюємо профіль БЕЗ зміни аватарки
        this.updateProfileSafely();
    },

    // Handle user signed out
    handleUserSignedOut() {
        this.currentUser = null;
        console.log('✅ User signed out from profile system');
    },

    // Безпечне оновлення профілю без зміни аватарки
    updateProfileSafely() {
        if (!this.currentUser) return;
        
        const { user, profile } = this.currentUser;
        const nickname = profile?.nickname || user?.email?.split('@')[0] || 'User';
        
        // Оновлюємо тільки текстові поля
        const profileNickname = document.getElementById('profileNickname');
        const profileStatus = document.querySelector('.profile-status');
        const currentNicknameInput = document.getElementById('currentNickname');
        
        if (profileNickname) {
            profileNickname.textContent = nickname;
        }
        
        if (profileStatus) {
            const joinDate = profile?.joinDate || user?.joinDate || 'Recently';
            profileStatus.innerHTML = `Lvl: 0 <span id="profileJoinDate">(${joinDate})</span>`;
        }
        
        if (currentNicknameInput) {
            currentNicknameInput.value = nickname;
        }
        
        // НЕ ТОРКАЄМОСЯ АВАТАРКИ!
        console.log('✅ Profile updated safely without touching avatar');
    },

    // Check initial auth state
    checkInitialAuthState() {
        setTimeout(() => {
            if (window.authManager && window.authManager.currentUser) {
                this.currentUser = {
                    user: window.authManager.currentUser,
                    profile: window.authManager.userProfile
                };
                this.updateProfileSafely();
            } else {
                const savedUser = localStorage.getItem('armHelper_currentUser');
                if (savedUser) {
                    try {
                        const user = JSON.parse(savedUser);
                        this.currentUser = { user, profile: user };
                        this.updateProfileSafely();
                    } catch (e) {
                        console.warn('Invalid saved user data');
                        localStorage.removeItem('armHelper_currentUser');
                    }
                }
            }
        }, 100);
    }
};

// Глобальна функція оновлення профілю БЕЗ зміни аватарки
function updateProfileDisplay() {
    console.log('🔄 Global profile display update (safe)...');
    
    if (ProfileSystem.currentUser) {
        ProfileSystem.updateProfileSafely();
    } else {
        // Fallback до безпечного оновлення
        if (typeof updateProfileDisplaySafe === 'function') {
            updateProfileDisplaySafe();
        }
    }
}

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

// Функція для відкриття профілю
function openProfile() {
    console.log('🚪 Opening profile...');
    
    if (typeof switchPage === 'function') {
        switchPage('profile');
        
        // Оновлюємо профіль безпечно
        setTimeout(() => {
            ProfileSystem.updateProfileSafely();
            ProfileSystem.protectProfileAvatar();
        }, 100);
    }
}

// Export for global use
if (typeof window !== 'undefined') {
    window.ProfileSystem = ProfileSystem;
    window.initializeProfile = initializeProfile;
    window.updateProfileDisplay = updateProfileDisplay;
    window.openProfile = openProfile;
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof initializeProfile === 'function') {
            initializeProfile();
        }
    }, 100);
});

// Ініціалізація при завантаженні контенту
document.addEventListener('contentLoaded', () => {
    setTimeout(() => {
        ProfileSystem.protectProfileAvatar();
    }, 200);
});

console.log('✅ profile.js loaded with avatar protection');
