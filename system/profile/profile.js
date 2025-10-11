// Profile Page System - Main Manager

class ProfileManager {
    constructor() {
        this.translations = null;
        this.currentUser = null;
        this.modals = new Map();
        this.eventListeners = new Map();
        this.socialAccounts = null;
        
        // Initialize modules
        this.info = new ProfileInfo(this);
        this.edit = new ProfileEdit(this);
    }

    async loadTranslations() {
        if (this.translations) return this.translations;
        
        try {
            const response = await fetch('system/profile/profile.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            this.translations = await response.json();
            console.log('✅ Profile translations loaded');
            return this.translations;
        } catch (error) {
            console.error('❌ Error loading translations:', error);
            return null;
        }
    }

    getLang() {
        return (typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : null) || 'en';
    }

    t(path) {
        if (!this.translations) return path;
        
        const keys = path.split('.');
        let value = this.translations[this.getLang()];
        
        for (const key of keys) {
            value = value?.[key];
            if (!value) return path;
        }
        
        return value;
    }

    async initialize() {
        console.log('👤 Initializing Profile...');
        
        await this.loadTranslations();
        
        this.currentUser = window.firebaseManager?.getCurrentUser();
        
        if (!this.currentUser) {
            console.log('⚠️ No user logged in, showing login modal...');
            // Показуємо модальне вікно логіну замість перенаправлення
            if (window.authUI && typeof window.authUI.openModal === 'function') {
                window.authUI.openModal('signin');
            } else {
                // Fallback - чекаємо на Auth UI
                setTimeout(() => {
                    if (window.authUI && typeof window.authUI.openModal === 'function') {
                        window.authUI.openModal('signin');
                    }
                }, 1000);
            }
            // Не повертаємося, а продовжуємо рендерити профіль з логіном
        }
        
        await this.loadSocialAccounts();
        
        this.render();
        this.attachEvents();
        
        console.log('✅ Profile initialized');
    }

    async loadSocialAccounts() {
        try {
            const profile = await window.firebaseManager?.getUserProfile(this.currentUser.uid);
            this.socialAccounts = profile?.socialAccounts || {
                telegram: null,
                discord: null,
                roblox: null
            };
        } catch (error) {
            console.error('❌ Error loading social accounts:', error);
            this.socialAccounts = {
                telegram: null,
                discord: null,
                roblox: null
            };
        }
    }

    render() {
        this.info.render();
        
        // Add modals after main content
        const profilePage = document.getElementById('profilePage');
        if (!profilePage) return;
        
        const user = this.currentUser;
        const isGoogleAccount = user.provider === 'google';
        const hasPassword = user.provider === 'username' || user.hasPassword;
        const hasGmail = user.email && user.provider === 'google';
        
        const modalsHTML = this.edit.getModalsHTML(user, isGoogleAccount, hasPassword, hasGmail);
        
        // Insert modals into the page
        const contentDiv = profilePage.querySelector('.profile-content');
        if (contentDiv) {
            const modalsContainer = document.createElement('div');
            modalsContainer.innerHTML = modalsHTML;
            contentDiv.appendChild(modalsContainer);
        }
    }

    attachEvents() {
        const page = document.getElementById('profilePage');
        if (!page) return;

        const handleClick = (e) => {
            // Handle password toggle FIRST with highest priority
            const toggleBtn = e.target.closest('.password-toggle-btn');
            if (toggleBtn) {
                e.preventDefault();
                e.stopPropagation();
                const targetId = toggleBtn.dataset.target;
                console.log('👁️ Toggle button clicked for:', targetId);
                this.edit.togglePasswordVisibility(targetId);
                return;
            }

            // Then handle other actions
            const btn = e.target.closest('[data-action]');
            if (btn) {
                e.preventDefault();
                const action = btn.dataset.action;
                const platform = btn.dataset.platform;
                const username = btn.dataset.username;
                this.handleAction(action, platform, username);
                return;
            }
        };

        page.addEventListener('click', handleClick, true); // Use capture phase
        this.eventListeners.set('click', handleClick);

        // Attach edit module events
        this.edit.attachEvents();
    }

    handleAction(action, platform, username) {
        const actions = {
            // Login actions
            googleSignIn: () => this.handleGoogleSignIn(),
            openLogin: () => this.openLoginModal(),
            openSignup: () => this.openSignupModal(),
            
            // Settings
            openSettings: () => this.edit.openModal('settingsModal'),
            closeSettings: () => this.edit.closeModal('settingsModal'),
            saveChanges: () => this.edit.saveChanges(),
            
            // Quick actions
            quickSync: () => this.info.syncData(),
            
            // Password setup
            openSetPassword: () => this.edit.openModal('setPasswordModal'),
            closeSetPassword: () => this.edit.closeModal('setPasswordModal'),
            confirmSetPassword: () => this.edit.setupPassword(),
            
            // Gmail setup
            openSetGmail: () => this.edit.openModal('setGmailModal'),
            closeSetGmail: () => this.edit.closeModal('setGmailModal'),
            confirmSetGmail: () => this.edit.setupGmail(),
            
            // Social accounts
            openSocial: () => this.edit.openSocialModal(platform),
            openSocialLink: () => this.info.openSocialLink(platform, username),
            closeSocial: () => this.edit.closeModal('socialAccountModal'),
            confirmSocialConnect: () => this.edit.connectSocialAccount(),
            
            // Danger zone
            deleteAccount: () => this.info.showDeleteConfirm(),
            confirmDelete: () => this.info.deleteAccount(),
            cancelDelete: () => this.info.hideDeleteConfirm(),
            signOut: () => this.info.signOut()
        };

        actions[action]?.();
    }

    getValue(id) {
        return document.getElementById(id)?.value.trim() || '';
    }

    showMsg(id, message, type = 'info') {
        const el = document.getElementById(id);
        if (!el) return;

        el.textContent = message;
        el.className = `profile-message ${type} show`;

        if (type === 'success') {
            setTimeout(() => el.classList.remove('show'), 3000);
        }
    }

    async handleGoogleSignIn() {
        console.log('🔍 Handling Google sign in...');
        if (window.authUI && typeof window.authUI.handleGoogleSignIn === 'function') {
            await window.authUI.handleGoogleSignIn();
        } else if (window.firebaseManager && typeof window.firebaseManager.signInWithGoogle === 'function') {
            const result = await window.firebaseManager.signInWithGoogle();
            if (result?.success) {
                // Перезавантажуємо профіль після успішного логіну
                setTimeout(() => this.initialize(), 1000);
            }
        }
    }

    openLoginModal() {
        console.log('👤 Opening login modal...');
        if (window.authUI && typeof window.authUI.openModal === 'function') {
            window.authUI.openModal('login');
        }
    }

    openSignupModal() {
        console.log('📝 Opening signup modal...');
        if (window.authUI && typeof window.authUI.openModal === 'function') {
            window.authUI.openModal('signup');
        }
    }

    destroy() {
        const page = document.getElementById('profilePage');
        if (!page) return;

        this.eventListeners.forEach((handler, key) => {
            if (key === 'click') {
                page.removeEventListener('click', handler);
            } else if (key === 'passwordCheckbox') {
                const checkbox = document.getElementById('changePasswordCheckbox');
                checkbox?.removeEventListener('change', handler);
            }
        });

        this.eventListeners.clear();
        this.modals.clear();
    }
}

let profileManager = null;

async function initializeProfile() {
    if (profileManager) {
        profileManager.destroy();
    }

    profileManager = new ProfileManager();
    await profileManager.initialize();
}

function updateProfileLanguage() {
    if (profileManager && document.getElementById('profilePage')?.classList.contains('active')) {
        initializeProfile();
    }
}

document.addEventListener('languageChanged', updateProfileLanguage);

window.initializeProfile = initializeProfile;
window.updateProfileLanguage = updateProfileLanguage;

console.log('✅ Profile Manager loaded (Modular version)');
