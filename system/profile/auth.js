// ========== AUTHENTICATION UI (FIXED - No Auto-Open) ==========

class AuthUI {
    constructor() {
        this.modal = null;
        this.currentView = 'signin';
        this.translations = null;
        this.eventListeners = new Map();
    }

    async loadTranslations() {
        if (this.translations) return this.translations;
        
        try {
            const response = await fetch('system/profile/profile.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            this.translations = await response.json();
            console.log('✅ Translations loaded');
            return this.translations;
        } catch (error) {
            console.warn('⚠️ Using fallback translations');
            this.translations = this.getFallbackTranslations();
            return this.translations;
        }
    }

    getFallbackTranslations() {
        return {
            en: {
                auth: {
                    login: '🔐 Login', signin: 'Sign In', signup: 'Sign Up',
                    signInWithGoogle: 'Sign in with Google', signInWithUsername: 'Sign in with Username',
                    username: 'Username', password: 'Password', confirmPassword: 'Confirm Password',
                    createAccount: 'Create Account', backToSignIn: '← Back to Sign In',
                    noAccount: 'Don\'t have an account?', haveAccount: 'Already have an account?',
                    signout: 'Sign Out', signInSuccess: 'Signed in successfully!',
                    accountCreated: 'Account created successfully!', googleSignInSuccess: 'Google sign in successful!',
                    openingGoogle: 'Opening Google sign in...', setPasswordTitle: 'Set Password',
                    setPasswordDesc: 'Set a password for your account to enable username/password login.',
                    setPassword: 'Set Password', skipForNow: 'Skip for now',
                    skipPasswordWarning: 'You can set a password later in settings.'
                },
                profile: {
                    title: 'Profile', googleAccount: 'Google Account', usernameAccount: 'Username Account',
                    passwordSet: 'Password Set', noPassword: 'No Password', syncData: 'Sync Data',
                    datasynced: 'Data synced successfully!',
                    error: {
                        fillAllFields: 'Please fill all fields', passwordMismatch: 'Passwords do not match',
                        passwordTooShort: 'Password must be at least 6 characters',
                        usernameTooShort: 'Username must be at least 3 characters', generic: 'An error occurred'
                    },
                    success: {
                        signingIn: 'Signing in...', creatingAccount: 'Creating account...',
                        settingPassword: 'Setting password...', syncingData: 'Syncing data...'
                    }
                }
            },
            uk: {
                auth: {
                    login: '🔐 Увійти', signin: 'Вхід', signup: 'Реєстрація',
                    signInWithGoogle: 'Увійти через Google', signInWithUsername: 'Увійти за іменем',
                    username: 'Ім\'я користувача', password: 'Пароль', confirmPassword: 'Підтвердіть пароль',
                    createAccount: 'Створити акаунт', backToSignIn: '← Назад до входу',
                    noAccount: 'Немає акаунту?', haveAccount: 'Вже є акаунт?',
                    signout: 'Вийти', signInSuccess: 'Успішний вхід!', accountCreated: 'Акаунт створено!',
                    googleSignInSuccess: 'Вхід через Google успішний!', openingGoogle: 'Відкривається Google...',
                    setPasswordTitle: 'Встановити пароль',
                    setPasswordDesc: 'Встановіть пароль для входу за іменем користувача.',
                    setPassword: 'Встановити пароль', skipForNow: 'Пропустити',
                    skipPasswordWarning: 'Ви можете встановити пароль пізніше в налаштуваннях.'
                },
                profile: {
                    title: 'Профіль', googleAccount: 'Google акаунт', usernameAccount: 'Акаунт з іменем',
                    passwordSet: 'Пароль встановлено', noPassword: 'Немає пароля',
                    syncData: 'Синхронізувати', datasynced: 'Дані синхронізовано!',
                    error: {
                        fillAllFields: 'Заповніть всі поля', passwordMismatch: 'Паролі не співпадають',
                        passwordTooShort: 'Пароль має бути не менше 6 символів',
                        usernameTooShort: 'Ім\'я має бути не менше 3 символів', generic: 'Виникла помилка'
                    },
                    success: {
                        signingIn: 'Вхід...', creatingAccount: 'Створення акаунту...',
                        settingPassword: 'Встановлення пароля...', syncingData: 'Синхронізація...'
                    }
                }
            }
        };
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

    createModal() {
        const container = document.getElementById('authModalContainer');
        if (!container) {
            console.error('❌ authModalContainer not found');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.id = 'authModal';
        modal.innerHTML = `
            <div class="auth-modal-overlay"></div>
            <div class="auth-modal-content">
                <button class="auth-modal-close">×</button>
                <div id="authModalBody"></div>
            </div>
        `;

        container.appendChild(modal);
        this.modal = modal;

        modal.querySelector('.auth-modal-overlay').addEventListener('click', () => this.closeModal());
        modal.querySelector('.auth-modal-close').addEventListener('click', () => this.closeModal());
    }

    async openModal(view = 'signin') {
        if (!this.translations) await this.loadTranslations();
        if (!this.modal) this.createModal();
        
        this.currentView = view;
        this.renderView();
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('show');
            document.body.style.overflow = '';
            this.clearEventListeners();
        }
    }

    renderView() {
        const body = document.getElementById('authModalBody');
        if (!body) return;

        const views = {
            signin: () => this.renderSignIn(),
            login: () => this.renderLogin(),
            signup: () => this.renderSignUp(),
            setpassword: () => this.renderSetPassword(),
            profile: () => this.renderProfile()
        };

        body.innerHTML = (views[this.currentView] || views.signin)();
        this.attachEventListeners();
    }

    getPasswordInputGroup(id, label) {
        return `
            <div class="auth-input-group">
                <div style="position: relative;">
                    <input type="password" id="${id}" placeholder="${label}" required style="padding-right: 45px;">
                    <button type="button" class="password-toggle-btn" data-target="${id}" 
                        style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 20px; padding: 5px; opacity: 0.6; transition: opacity 0.2s; z-index: 10;">
                        👁️
                    </button>
                </div>
            </div>
        `;
    }

    renderSignIn() {
        return `
            <div class="auth-form">
                <h2 class="auth-title">🔐 ${this.t('auth.signin')}</h2>
                
                <button class="auth-btn google" data-action="googleSignIn">
                    <span class="google-icon">🔍</span> ${this.t('auth.signInWithGoogle')}
                </button>
                
                <button class="auth-btn username" data-action="openLogin">
                    👤 ${this.t('auth.signInWithUsername')}
                </button>
                
                <button class="auth-btn register" data-action="openSignup">
                    📝 ${this.t('auth.signup')}
                </button>
                
                <div id="authMessage" class="auth-message"></div>
            </div>
        `;
    }

    renderLogin() {
        return `
            <div class="auth-form">
                <h2 class="auth-title">👤 ${this.t('auth.signInWithUsername')}</h2>
                
                <div class="auth-input-group">
                    <input type="text" id="loginUsername" placeholder="${this.t('auth.username')}" required>
                </div>
                
                ${this.getPasswordInputGroup('loginPassword', this.t('auth.password'))}
                
                <button class="auth-btn primary" data-action="usernameLogin">
                    ${this.t('auth.signin')}
                </button>
                
                <div class="auth-links">
                    <a href="#" data-action="openSignin">${this.t('auth.backToSignIn')}</a>
                    <span>•</span>
                    <a href="#" data-action="openSignup">${this.t('auth.noAccount')}</a>
                </div>
                
                <div id="authMessage" class="auth-message"></div>
            </div>
        `;
    }

    renderSignUp() {
        return `
            <div class="auth-form">
                <h2 class="auth-title">📝 ${this.t('auth.signup')}</h2>
                
                <div class="auth-input-group">
                    <input type="text" id="signUpUsername" placeholder="${this.t('auth.username')}" required>
                </div>
                
                ${this.getPasswordInputGroup('signUpPassword', this.t('auth.password'))}
                ${this.getPasswordInputGroup('signUpConfirmPassword', this.t('auth.confirmPassword'))}
                
                <button class="auth-btn primary" data-action="signUp">
                    ${this.t('auth.createAccount')}
                </button>
                
                <div class="auth-links">
                    <a href="#" data-action="openSignin">${this.t('auth.backToSignIn')}</a>
                    <span>•</span>
                    <a href="#" data-action="openLogin">${this.t('auth.haveAccount')}</a>
                </div>
                
                <div id="authMessage" class="auth-message"></div>
            </div>
        `;
    }

    renderSetPassword() {
        return `
            <div class="auth-form">
                <h2 class="auth-title">🔑 ${this.t('auth.setPasswordTitle')}</h2>
                
                <p style="color: var(--text-color); opacity: 0.9; margin-bottom: 20px; line-height: 1.5;">
                    ${this.t('auth.setPasswordDesc')}
                </p>
                
                ${this.getPasswordInputGroup('setPasswordInput', this.t('auth.password'))}
                ${this.getPasswordInputGroup('setPasswordConfirm', this.t('auth.confirmPassword'))}
                
                <button class="auth-btn primary" data-action="setPassword">
                    🔒 ${this.t('auth.setPassword')}
                </button>
                
                <button class="auth-btn secondary" data-action="skipPassword" style="margin-top: 10px;">
                    ⏭️ ${this.t('auth.skipForNow')}
                </button>
                
                <div id="authMessage" class="auth-message"></div>
            </div>
        `;
    }

    renderProfile() {
        const user = window.firebaseManager?.getCurrentUser();
        if (!user) {
            this.openModal('signin');
            return '';
        }

        return `
            <div class="auth-profile">
                <h2 class="auth-title">👤 ${this.t('profile.title')}</h2>
                
                <div class="profile-info">
                    <div class="profile-avatar">
                        ${user.photoURL ? `<img src="${user.photoURL}" alt="Avatar">` : '👤'}
                    </div>
                    
                    <div class="profile-details">
                        <h3>${user.displayName}</h3>
                        ${user.email ? `<p>${user.email}</p>` : ''}
                        
                        <div class="profile-status">
                            ${user.provider === 'google' 
                                ? `<span class="verified">✅ ${this.t('profile.googleAccount')}</span>`
                                : `<span class="verified">✅ ${this.t('profile.usernameAccount')}</span>`
                            }
                            ${user.hasPassword 
                                ? `<span class="verified">🔒 ${this.t('profile.passwordSet')}</span>`
                                : `<span class="not-verified">⚠️ ${this.t('profile.noPassword')}</span>`
                            }
                        </div>
                    </div>
                </div>
                
                <div class="profile-actions">
                    <button class="auth-btn secondary" data-action="syncData">
                        🔄 ${this.t('profile.syncData')}
                    </button>
                    
                    <button class="auth-btn danger" data-action="signOut">
                        🚪 ${this.t('auth.signout')}
                    </button>
                </div>
                
                <div id="authMessage" class="auth-message"></div>
            </div>
        `;
    }

    togglePasswordVisibility(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        const btn = document.querySelector(`[data-target="${inputId}"]`);
        if (btn) {
            btn.textContent = isPassword ? '🙈' : '👁️';
            btn.style.opacity = isPassword ? '1' : '0.6';
        }
    }

    attachEventListeners() {
        const body = document.getElementById('authModalBody');
        if (!body) return;

        const handleClick = (e) => {
            const btn = e.target.closest('[data-action]');
            if (btn) {
                e.preventDefault();
                const actions = {
                    googleSignIn: () => this.handleGoogleSignIn(),
                    openLogin: () => this.openModal('login'),
                    openSignup: () => this.openModal('signup'),
                    openSignin: () => this.openModal('signin'),
                    usernameLogin: () => this.handleUsernameLogin(),
                    signUp: () => this.handleSignUp(),
                    setPassword: () => this.handleSetPassword(),
                    skipPassword: () => this.skipPasswordSetup(),
                    syncData: () => this.syncUserData(),
                    signOut: () => this.handleSignOut()
                };
                actions[btn.dataset.action]?.();
                return;
            }

            const toggleBtn = e.target.closest('.password-toggle-btn');
            if (toggleBtn) {
                e.preventDefault();
                this.togglePasswordVisibility(toggleBtn.dataset.target);
            }
        };

        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                body.querySelector('.auth-btn.primary')?.click();
            }
        };

        body.addEventListener('click', handleClick);
        body.addEventListener('keypress', handleKeyPress);
        this.eventListeners.set('click', handleClick);
        this.eventListeners.set('keypress', handleKeyPress);
    }

    clearEventListeners() {
        const body = document.getElementById('authModalBody');
        if (!body) return;

        this.eventListeners.forEach((handler, event) => {
            body.removeEventListener(event, handler);
        });
        this.eventListeners.clear();
    }

    showMessage(message, type = 'info') {
        const messageEl = document.getElementById('authMessage');
        if (!messageEl) return;

        messageEl.textContent = message;
        messageEl.className = `auth-message ${type}`;
        messageEl.style.display = 'block';

        if (type === 'success') {
            setTimeout(() => messageEl.style.display = 'none', 3000);
        }
    }

    async handleUsernameLogin() {
        const username = document.getElementById('loginUsername')?.value.trim();
        const password = document.getElementById('loginPassword')?.value;

        if (!username || !password) {
            this.showMessage(this.t('profile.error.fillAllFields'), 'error');
            return;
        }

        this.showMessage(this.t('profile.success.signingIn'), 'info');
        const result = await window.firebaseManager?.signInWithUsername(username, password);

        if (result?.success) {
            this.showMessage(this.t('auth.signInSuccess'), 'success');
            setTimeout(() => this.closeModal(), 1000);
        } else {
            this.showMessage(result?.error || this.t('profile.error.generic'), 'error');
        }
    }

    async handleSignUp() {
        const username = document.getElementById('signUpUsername')?.value.trim();
        const password = document.getElementById('signUpPassword')?.value;
        const confirmPassword = document.getElementById('signUpConfirmPassword')?.value;

        if (!username || !password || !confirmPassword) {
            this.showMessage(this.t('profile.error.fillAllFields'), 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage(this.t('profile.error.passwordMismatch'), 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage(this.t('profile.error.passwordTooShort'), 'error');
            return;
        }

        if (username.length < 3) {
            this.showMessage(this.t('profile.error.usernameTooShort'), 'error');
            return;
        }

        this.showMessage(this.t('profile.success.creatingAccount'), 'info');
        const result = await window.firebaseManager?.signUpWithUsername(username, password);

        if (result?.success) {
            this.showMessage(this.t('auth.accountCreated'), 'success');
            setTimeout(() => this.closeModal(), 1000);
        } else {
            this.showMessage(result?.error || this.t('profile.error.generic'), 'error');
        }
    }

    async handleGoogleSignIn() {
        this.showMessage(this.t('auth.openingGoogle'), 'info');
        const result = await window.firebaseManager?.signInWithGoogle();

        if (result?.success) {
            this.showMessage(this.t('auth.googleSignInSuccess'), 'success');
            
            // REMOVED: Auto-open setpassword modal
            // Користувач може встановити пароль пізніше через профіль
            setTimeout(() => this.closeModal(), 1000);
        } else {
            this.showMessage(result?.error || this.t('profile.error.generic'), 'error');
        }
    }

    async handleSetPassword() {
        const password = document.getElementById('setPasswordInput')?.value;
        const confirmPassword = document.getElementById('setPasswordConfirm')?.value;

        if (!password || !confirmPassword) {
            this.showMessage(this.t('profile.error.fillAllFields'), 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage(this.t('profile.error.passwordMismatch'), 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage(this.t('profile.error.passwordTooShort'), 'error');
            return;
        }

        this.showMessage(this.t('profile.success.settingPassword'), 'info');
        const result = await window.firebaseManager?.setPasswordForGoogleAccount(password);

        if (result?.success) {
            this.showMessage(this.t('profile.passwordSet'), 'success');
            setTimeout(() => this.closeModal(), 1500);
        } else {
            this.showMessage(result?.error || this.t('profile.error.generic'), 'error');
        }
    }

    skipPasswordSetup() {
        this.showMessage(this.t('auth.skipPasswordWarning'), 'info');
        setTimeout(() => this.closeModal(), 2000);
    }

    async handleSignOut() {
        const result = await window.firebaseManager?.signOut();
        if (result?.success && typeof switchPage === 'function') {
            switchPage('calculator');
        } else {
            this.showMessage(result?.error || this.t('profile.error.generic'), 'error');
        }
    }

    async syncUserData() {
        this.showMessage(this.t('profile.success.syncingData'), 'info');

        try {
            const settings = {
                language: localStorage.getItem('armHelper_language') || 'en',
                theme: localStorage.getItem('armHelper_colorTheme') || 'blackOrange',
                menuPosition: localStorage.getItem('armHelper_menuPosition') || 'left'
            };

            await window.firebaseManager?.updateUserProfile({ settings });
            this.showMessage(this.t('profile.datasynced'), 'success');
        } catch (error) {
            console.error('Sync error:', error);
            this.showMessage(this.t('profile.error.generic'), 'error');
        }
    }
}

// ========== ІНІЦІАЛІЗАЦІЯ ==========
window.authUI = new AuthUI();

function handleAuthButtonClick(event) {
    event?.preventDefault();
    event?.stopPropagation();
    
    if (!window.firebaseManager?.isInitialized) {
        alert('Система авторизації ініціалізується.\n\nЗачекайте трохи і спробуйте знову.');
        return;
    }
    
    const user = window.firebaseManager.getCurrentUser();
    if (user) {
        typeof switchPage === 'function' && switchPage('profile');
    } else {
        window.authUI?.openModal('signin');
    }
}

function setupAuthButton() {
    const btn = document.getElementById('authButton');
    if (!btn) return false;
    
    btn.onclick = handleAuthButtonClick;
    btn.classList.remove('disabled');
    updateAuthButtonState(window.firebaseManager?.getCurrentUser());
    return true;
}

async function updateAuthButtonState(user) {
    const btn = document.getElementById('authButton');
    if (!btn) return;

    if (user) {
        btn.textContent = `👤 ${user.displayName}`;
        btn.title = 'View profile';
    } else {
        if (!window.authUI.translations) await window.authUI.loadTranslations();
        const lang = window.authUI.getLang();
        btn.textContent = window.authUI.translations?.[lang]?.auth?.login || '🔐 Login';
        btn.title = 'Sign in to sync your data';
    }
}

async function initializeAuthUI() {
    console.log('🔐 Initializing Auth UI...');
    
    // Чекаємо Firebase
    let attempts = 0;
    while (!window.firebaseManager?.isInitialized && attempts < 100) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    if (!window.firebaseManager?.isInitialized) {
        console.error('❌ Firebase not ready');
        return;
    }
    
    // Завантажуємо переклади
    await window.authUI.loadTranslations();
    
    // Налаштовуємо кнопку
    attempts = 0;
    while (!setupAuthButton() && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    // FIXED: Слухач змін авторизації - БЕЗ авто-відкриття setpassword
    window.firebaseManager.addEventListener('authChanged', (user) => {
        console.log('👤 Auth changed:', user ? user.displayName : 'signed out');
        updateAuthButtonState(user);
        
        // REMOVED: Auto-open setpassword modal for Google users
        // Користувач може встановити пароль вручну через профіль
    });
    
    console.log('✅ Auth UI initialized');
}

// Слухач зміни мови
document.addEventListener('languageChanged', async () => {
    await window.authUI.loadTranslations();
    if (window.authUI.modal?.classList.contains('show')) {
        window.authUI.renderView();
    }
    updateAuthButtonState(window.firebaseManager?.getCurrentUser());
});

// Експорт
Object.assign(window, { AuthUI, initializeAuthUI, handleAuthButtonClick, setupAuthButton });

console.log('✅ Auth UI module loaded (Fixed - No Auto-Open)');
