// Profile Info Module - Display and Social Accounts

class ProfileInfo {
    constructor(profileManager) {
        this.pm = profileManager;
    }

    render() {
        const profilePage = document.getElementById('profilePage');
        if (!profilePage) return;
        
        const user = this.pm.currentUser;
        
        if (!user) {
            // Показуємо логін для неавторизованих користувачів
            profilePage.innerHTML = this.getLoginHTML();
            return;
        }
        
        const createdDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : this.pm.t('profile.never');
        const isGoogleAccount = user.provider === 'google';
        const hasPassword = user.provider === 'username' || user.hasPassword;
        const hasGmail = user.email && user.email.includes('@');
        
        profilePage.innerHTML = this.getProfileHTML(user, createdDate, isGoogleAccount, hasPassword, hasGmail);
    }

    getLoginHTML() {
        return `
            <div class="profile-page">
                <div class="login-container">
                    <div class="login-card">
                        <div class="login-header">
                            <div class="login-icon">🔐</div>
                            <h1>${this.pm.t('auth.signin')}</h1>
                            <p>${this.pm.t('auth.signinDescription')}</p>
                        </div>
                        
                        <div class="login-buttons">
                            <button class="login-btn google" data-action="googleSignIn">
                                <span class="google-icon">🔍</span> ${this.pm.t('auth.signInWithGoogle')}
                            </button>
                            
                            <button class="login-btn username" data-action="openLogin">
                                👤 ${this.pm.t('auth.signInWithUsername')}
                            </button>
                            
                            <button class="login-btn register" data-action="openSignup">
                                📝 ${this.pm.t('auth.signup')}
                            </button>
                        </div>
                        
                        <div class="login-features">
                            <h3>${this.pm.t('auth.features')}</h3>
                            <ul>
                                <li>✅ ${this.pm.t('auth.feature1')}</li>
                                <li>✅ ${this.pm.t('auth.feature2')}</li>
                                <li>✅ ${this.pm.t('auth.feature3')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getProfileHTML(user, createdDate, isGoogle, hasPassword, hasGmail) {
        return `
            <div class="profile-page">
                <h1>${this.pm.t('profile.title')}</h1>
                
                <div class="profile-container">
                    ${this.getProfileCard(user, createdDate, isGoogle, hasPassword)}
                    ${this.getQuickActionsSection(isGoogle, hasPassword, hasGmail)}
                </div>
            </div>
        `;
    }

    getProfileCard(user, createdDate, isGoogle, hasPassword) {
        return `
            <div class="profile-card">
                <div class="profile-header">
                    <div class="profile-avatar-large">
                        ${user.photoURL ? `<img src="${user.photoURL}" alt="Avatar">` : '👤'}
                    </div>
                    
                    <h2 class="profile-username">${user.displayName}</h2>
                    ${user.email && isGoogle ? `<p class="profile-email">${user.email}</p>` : ''}
                    
                    <div class="profile-badges">
                        <span class="profile-badge ${isGoogle ? 'google' : 'username'}">
                            ✅ ${this.pm.t(isGoogle ? 'profile.googleAccount' : 'profile.usernameAccount')}
                        </span>
                        <span class="profile-badge ${hasPassword ? 'verified' : 'not-verified'}">
                            ${hasPassword ? '🔒' : '⚠️'} ${this.pm.t(hasPassword ? 'profile.passwordSet' : 'profile.noPassword')}
                        </span>
                    </div>
                </div>
                
                <div class="profile-stats">
                    <div class="profile-stat">
                        <span class="profile-stat-label">${this.pm.t('profile.memberSince')}</span>
                        <span class="profile-stat-value">${createdDate}</span>
                    </div>
                    <div class="profile-stat">
                        <span class="profile-stat-label">${this.pm.t('profile.lastSync')}</span>
                        <span class="profile-stat-value" id="lastSyncTime">${this.pm.t('profile.never')}</span>
                    </div>
                </div>
                
                ${this.getSocialAccountsSection()}
            </div>
        `;
    }

    getSocialAccountsSection() {
        return `
            <div class="profile-social-section">
                <h3 class="profile-social-title">🔗 ${this.pm.t('profile.socialAccounts')}</h3>
                
                <div class="profile-social-accounts">
                    ${this.getSocialAccountButton('telegram', '📱', '#0088cc', this.pm.socialAccounts?.telegram)}
                    ${this.getSocialAccountButton('discord', '💬', '#5865F2', this.pm.socialAccounts?.discord)}
                    ${this.getSocialAccountButton('roblox', '🎮', '#0066CC', this.pm.socialAccounts?.roblox)}
                </div>
            </div>
        `;
    }

    getSocialAccountButton(platform, icon, color, connected) {
        const isConnected = !!connected;
        const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
        
        return `
            <button class="social-account-btn ${isConnected ? 'connected' : ''}" 
                data-action="${isConnected ? 'openSocialLink' : 'openSocial'}" 
                data-platform="${platform}"
                ${isConnected ? `data-username="${connected}"` : ''}
                style="border-color: ${color}; ${isConnected ? `background: ${color}22;` : ''}">
                <span class="social-icon">${icon}</span>
                <div class="social-info">
                    <span class="social-name">${platformName}</span>
                    <span class="social-status">
                        ${isConnected ? `✓ ${connected}` : this.pm.t('profile.connect')}
                    </span>
                </div>
                ${isConnected ? '<span class="social-disconnect">🔗</span>' : ''}
            </button>
        `;
    }

    getQuickActionsSection(isGoogle, hasPassword, hasGmail) {
        return `
            <div class="profile-content">
                <div class="profile-section">
                    <h3 class="profile-section-title">⚡ ${this.pm.t('profile.quickActions')}</h3>
                    
                    <div class="profile-quick-actions">
                        <button class="quick-action-btn" data-action="openSettings">
                            <span class="icon">⚙️</span>
                            <span class="label">${this.pm.t('profile.accountSettings')}</span>
                        </button>
                        
                        <button class="quick-action-btn" data-action="quickSync">
                            <span class="icon">🔄</span>
                            <span class="label">${this.pm.t('profile.syncData')}</span>
                        </button>
                        
                        ${isGoogle && !hasPassword ? this.getSetPasswordButton() : ''}
                        ${!hasGmail ? this.getSetGmailButton() : ''}
                    </div>
                </div>
                
                ${this.getDangerZoneHTML(hasPassword)}
            </div>
        `;
    }

    getSetPasswordButton() {
        return `
            <button class="quick-action-btn" data-action="openSetPassword" 
                style="border-color: #ff6b7a; background: rgba(220, 53, 69, 0.1);">
                <span class="icon">🔐</span>
                <span class="label">${this.pm.t('profile.setPassword')}</span>
            </button>
        `;
    }

    getSetGmailButton() {
        return `
            <button class="quick-action-btn" data-action="openSetGmail" 
                style="border-color: #4285f4; background: rgba(66, 133, 244, 0.1);">
                <span class="icon">📧</span>
                <span class="label">${this.pm.t('profile.setGmail')}</span>
            </button>
        `;
    }

    getDangerZoneHTML(hasPassword) {
        return `
            <div class="profile-section">
                <h3 class="profile-section-title">⚠️ ${this.pm.t('profile.dangerZone')}</h3>
                
                <div class="profile-section-content">
                    <p class="profile-info-text">${this.pm.t('profile.confirmDelete')}</p>
                    
                    <div class="profile-delete-confirm" id="deleteConfirmBox">
                        <p class="profile-delete-text">
                            ${hasPassword ? this.pm.t('profile.enterCurrentPassword') : this.pm.t('profile.confirmDeleteGoogle')}
                        </p>
                        ${hasPassword ? `
                        <div class="profile-delete-input">
                            <div style="position: relative;">
                                <input type="password" id="deletePasswordInput" class="profile-form-input" 
                                    placeholder="${this.pm.t('auth.currentPassword')}" style="padding-right: 45px;">
                                <button type="button" class="password-toggle-btn" data-target="deletePasswordInput" 
                                    style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 20px; padding: 5px; opacity: 0.6; transition: opacity 0.2s;">
                                    👁️
                                </button>
                            </div>
                        </div>
                        ` : ''}
                        <div class="profile-message" id="deleteMessage"></div>
                        <div class="profile-delete-actions">
                            <button class="profile-btn danger" data-action="confirmDelete">
                                ${this.pm.t('profile.yes')}
                            </button>
                            <button class="profile-btn secondary" data-action="cancelDelete">
                                ${this.pm.t('profile.no')}
                            </button>
                        </div>
                    </div>
                    
                    <div class="profile-actions">
                        <button class="profile-btn danger" data-action="deleteAccount">
                            🗑️ ${this.pm.t('profile.deleteAccount')}
                        </button>
                        <button class="profile-btn secondary" data-action="signOut">
                            🚪 ${this.pm.t('auth.signout')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    openSocialLink(platform, username) {
        if (!username) return;
        
        let url = '';
        
        switch(platform) {
            case 'telegram':
                const cleanTelegramUsername = username.startsWith('@') ? username.slice(1) : username;
                url = `https://t.me/${cleanTelegramUsername}`;
                break;
            case 'discord':
                const discordUsername = username.startsWith('@') ? username.slice(1) : username;
                
                const discordProtocol = `discord://-/users/@me`;
                window.location.href = discordProtocol;
                
                setTimeout(() => {
                    window.open('https://discord.com/app', '_blank', 'noopener,noreferrer');
                }, 500);
                
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(username).then(() => {
                        const lang = this.pm.getLang();
                        const message = lang === 'uk' ? `Нікнейм скопійовано: ${username}\nШукайте користувача в Discord!` : 
                                       lang === 'ru' ? `Никнейм скопирован: ${username}\nИщите пользователя в Discord!` : 
                                       `Username copied: ${username}\nSearch for user in Discord!`;
                        
                        this.pm.showMsg('settingsMessage', message, 'success');
                        console.log(`✅ Discord username copied: ${username}`);
                    });
                }
                return;
            case 'roblox':
                if (/^\d+$/.test(username)) {
                    url = `https://www.roblox.com/users/${username}/profile`;
                } else {
                    url = `https://www.roblox.com/search/users?keyword=${encodeURIComponent(username)}`;
                }
                break;
        }
        
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }

    async syncData() {
        this.pm.showMsg('settingsMessage', this.pm.t('profile.success.syncingData'), 'info');

        try {
            const settings = {
                language: localStorage.getItem('armHelper_language') || 'en',
                theme: localStorage.getItem('armHelper_colorTheme') || 'blackOrange',
                menuPosition: localStorage.getItem('armHelper_menuPosition') || 'left'
            };

            await window.firebaseManager?.updateUserProfile({ settings });

            const now = new Date().toLocaleString();
            const syncEl = document.getElementById('lastSyncTime');
            if (syncEl) syncEl.textContent = now;

            this.pm.showMsg('settingsMessage', this.pm.t('profile.datasynced'), 'success');
        } catch (error) {
            console.error('Sync error:', error);
            this.pm.showMsg('settingsMessage', this.pm.t('profile.error.generic'), 'error');
        }
    }

    showDeleteConfirm() {
        const box = document.getElementById('deleteConfirmBox');
        if (box) box.classList.add('show');
    }

    hideDeleteConfirm() {
        const box = document.getElementById('deleteConfirmBox');
        if (box) box.classList.remove('show');
        
        const input = document.getElementById('deletePasswordInput');
        if (input) {
            input.value = '';
            input.type = 'password';
        }
        
        const btn = document.querySelector('[data-target="deletePasswordInput"]');
        if (btn) {
            btn.textContent = '👁️';
            btn.style.opacity = '0.6';
        }
    }

    async deleteAccount() {
        const hasPassword = this.pm.currentUser.provider === 'username' || this.pm.currentUser.hasPassword;
        const password = hasPassword ? this.pm.getValue('deletePasswordInput') : null;

        if (hasPassword && !password) {
            this.pm.showMsg('deleteMessage', this.pm.t('profile.error.fillAllFields'), 'error');
            return;
        }

        this.pm.showMsg('deleteMessage', this.pm.t('profile.success.deletingAccount'), 'info');

        const result = await window.firebaseManager?.deleteAccount(password);

        if (result?.success) {
            this.pm.showMsg('deleteMessage', this.pm.t('profile.accountDeleted'), 'success');
            setTimeout(() => typeof switchPage === 'function' && switchPage('calculator'), 1500);
        } else {
            this.pm.showMsg('deleteMessage', result?.error || this.pm.t('profile.error.generic'), 'error');
        }
    }

    async signOut() {
        const result = await window.firebaseManager?.signOut();
        if (result?.success && typeof switchPage === 'function') {
            switchPage('calculator');
        }
    }
}

console.log('✅ Profile Info module loaded');
