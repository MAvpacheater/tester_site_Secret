// Profile Edit Module - Modals and Settings

class ProfileEdit {
    constructor(profileManager) {
        this.pm = profileManager;
        this.currentSocialPlatform = null;
    }

    // ==================== MODALS HTML ====================

    getModalsHTML(user, isGoogle, hasPassword, hasGmail) {
        const modalsContainer = document.createElement('div');
        modalsContainer.innerHTML = `
            ${this.getSettingsModal(hasPassword)}
            ${isGoogle && !hasPassword ? this.getSetPasswordModal() : ''}
            ${!hasGmail && !isGoogle ? this.getSetGmailModal() : ''}
            ${this.getSocialAccountModal()}
        `;
        return modalsContainer.innerHTML;
    }

    getSocialAccountModal() {
        return `
            <div class="settings-modal" id="socialAccountModal">
                <h4 style="color: var(--primary-color); font-size: 18px; margin: 0 0 20px 0;" id="socialModalTitle">
                    🔗 ${this.pm.t('profile.connectAccount')}
                </h4>
                
                <div class="profile-section-content">
                    <p class="profile-info-text" id="socialModalDescription"></p>
                    
                    <div class="profile-form-group">
                        <label class="profile-form-label" id="socialModalLabel"></label>
                        <input type="text" id="socialAccountInput" class="profile-form-input" 
                            placeholder="">
                        <span class="profile-form-hint" id="socialModalHint"></span>
                    </div>
                    
                    <div class="profile-message" id="socialAccountMessage"></div>
                    
                    <div class="profile-actions">
                        <button class="profile-btn primary" data-action="confirmSocialConnect" id="socialConnectBtn">
                            🔗 ${this.pm.t('profile.connect')}
                        </button>
                        <button class="profile-btn secondary" data-action="closeSocial">
                            ❌ ${this.pm.t('profile.cancel')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getSettingsModal(hasPassword) {
        return `
            <div class="settings-modal" id="settingsModal">
                <h4 style="color: var(--primary-color); font-size: 18px; margin: 0 0 20px 0;">
                    ⚙️ ${this.pm.t('profile.accountSettings')}
                </h4>
                
                <div class="profile-section-content">
                    <div class="profile-form-group">
                        <label class="profile-form-label">${this.pm.t('profile.changeUsername')}</label>
                        <input type="text" id="newUsernameInput" class="profile-form-input" 
                            placeholder="${this.pm.t('profile.newUsername')}">
                        <span class="profile-form-hint">${this.pm.t('profile.usernameHint')}</span>
                    </div>
                    
                    ${hasPassword ? this.getPasswordChangeSection() : ''}
                    
                    <div class="profile-message" id="settingsMessage"></div>
                    
                    <div class="profile-actions">
                        <button class="profile-btn primary" data-action="saveChanges">
                            💾 ${this.pm.t('profile.saveChanges')}
                        </button>
                        <button class="profile-btn secondary" data-action="closeSettings">
                            ❌ ${this.pm.t('profile.cancel')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getPasswordChangeSection() {
        return `
            <div class="profile-checkbox-group">
                <input type="checkbox" id="changePasswordCheckbox" class="profile-checkbox">
                <label for="changePasswordCheckbox" class="profile-checkbox-label">
                    ${this.pm.t('profile.changePasswordOption')}
                </label>
            </div>
            
            <div id="passwordFields" style="display: none;">
                ${this.getPasswordInputGroup('currentPasswordInput', this.pm.t('auth.currentPassword'))}
                ${this.getPasswordInputGroup('newPasswordInput', this.pm.t('auth.newPassword'))}
                ${this.getPasswordInputGroup('confirmPasswordInput', this.pm.t('auth.confirmPassword'), this.pm.t('profile.passwordHint'))}
            </div>
        `;
    }

    getPasswordInputGroup(id, label, hint = null) {
        return `
            <div class="profile-form-group">
                <label class="profile-form-label">${label}</label>
                <div style="position: relative;">
                    <input type="password" id="${id}" class="profile-form-input" 
                        placeholder="${label}" style="padding-right: 45px;">
                    <button type="button" class="password-toggle-btn" data-target="${id}" 
                        style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 20px; padding: 5px; opacity: 0.6; transition: opacity 0.2s; z-index: 10;">
                        👁️
                    </button>
                </div>
                ${hint ? `<span class="profile-form-hint">${hint}</span>` : ''}
            </div>
        `;
    }

    getSetPasswordModal() {
        return `
            <div class="settings-modal" id="setPasswordModal">
                <h4 style="color: var(--primary-color); font-size: 18px; margin: 0 0 20px 0;">
                    🔐 ${this.pm.t('profile.setPassword')}
                </h4>
                
                <div class="profile-section-content">
                    <p class="profile-info-text">${this.pm.t('profile.setPasswordDescription')}</p>
                    
                    ${this.getPasswordInputGroup('setupPasswordInput', this.pm.t('auth.password'))}
                    ${this.getPasswordInputGroup('setupPasswordConfirm', this.pm.t('auth.confirmPassword'), this.pm.t('profile.passwordHint'))}
                    
                    <div class="profile-message" id="setupPasswordMessage"></div>
                    
                    <div class="profile-actions">
                        <button class="profile-btn primary" data-action="confirmSetPassword">
                            🔒 ${this.pm.t('profile.setPassword')}
                        </button>
                        <button class="profile-btn secondary" data-action="closeSetPassword">
                            ❌ ${this.pm.t('profile.cancel')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getSetGmailModal() {
        return `
            <div class="settings-modal" id="setGmailModal">
                <h4 style="color: var(--primary-color); font-size: 18px; margin: 0 0 20px 0;">
                    📧 ${this.pm.t('profile.setGmail')}
                </h4>
                
                <div class="profile-section-content">
                    <p class="profile-info-text">${this.pm.t('profile.setGmailDescription')}</p>
                    
                    ${this.getPasswordInputGroup('gmailCurrentPassword', this.pm.t('auth.currentPassword'), this.pm.t('profile.gmailPasswordHint'))}
                    
                    <div class="profile-message" id="setupGmailMessage"></div>
                    
                    <div class="profile-actions">
                        <button class="profile-btn primary" data-action="confirmSetGmail">
                            📧 ${this.pm.t('profile.connectGmail')}
                        </button>
                        <button class="profile-btn secondary" data-action="closeSetGmail">
                            ❌ ${this.pm.t('profile.cancel')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== MODAL ACTIONS ====================

    openModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('show');
            this.pm.modals.set(id, true);
        }
    }

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('show');
            this.pm.modals.delete(id);
            this.clearModalInputs(id);
        }
    }

    clearModalInputs(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.querySelectorAll('input').forEach(input => {
            input.value = '';
            if (input.type === 'text') input.type = 'password';
        });
        
        modal.querySelectorAll('.password-toggle-btn').forEach(btn => {
            btn.textContent = '👁️';
            btn.style.opacity = '0.6';
        });
        
        const checkbox = document.getElementById('changePasswordCheckbox');
        if (checkbox) {
            checkbox.checked = false;
            this.togglePasswordFields();
        }
        
        modal.querySelectorAll('.profile-message').forEach(msg => {
            msg.classList.remove('show');
        });
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

    togglePasswordFields() {
        const checkbox = document.getElementById('changePasswordCheckbox');
        const fields = document.getElementById('passwordFields');
        
        if (checkbox && fields) {
            fields.style.display = checkbox.checked ? 'block' : 'none';
            
            if (!checkbox.checked) {
                ['currentPasswordInput', 'newPasswordInput', 'confirmPasswordInput'].forEach(id => {
                    const input = document.getElementById(id);
                    if (input) {
                        input.value = '';
                        input.type = 'password';
                    }
                });
                
                fields.querySelectorAll('.password-toggle-btn').forEach(btn => {
                    btn.textContent = '👁️';
                    btn.style.opacity = '0.6';
                });
            }
        }
    }

    // ==================== SOCIAL ACCOUNTS ====================

    openSocialModal(platform) {
        this.currentSocialPlatform = platform;
        
        const icons = { telegram: '📱', discord: '💬', roblox: '🎮' };
        const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
        
        const title = document.getElementById('socialModalTitle');
        const description = document.getElementById('socialModalDescription');
        const label = document.getElementById('socialModalLabel');
        const input = document.getElementById('socialAccountInput');
        const hint = document.getElementById('socialModalHint');
        
        if (title) title.textContent = `${icons[platform]} ${platformName}`;
        if (description) description.textContent = this.pm.t(`profile.${platform}Description`);
        if (label) label.textContent = this.pm.t(`profile.${platform}Label`);
        if (hint) hint.textContent = this.pm.t(`profile.${platform}Hint`);
        
        if (input) {
            input.value = '';
            input.placeholder = this.pm.t(`profile.${platform}Placeholder`);
        }
        
        this.openModal('socialAccountModal');
    }

    normalizeSocialUsername(platform, input) {
        input = input.trim();
        
        switch(platform) {
            case 'telegram':
                return input.startsWith('@') ? input : `@${input}`;
            case 'discord':
                if (input.includes('#')) input = input.split('#')[0];
                return input.startsWith('@') ? input.slice(1) : input;
            case 'roblox':
                return input;
            default:
                return input;
        }
    }

    async connectSocialAccount() {
        const platform = this.currentSocialPlatform;
        const input = this.pm.getValue('socialAccountInput');
        
        if (!input) {
            this.pm.showMsg('socialAccountMessage', this.pm.t('profile.error.fillAllFields'), 'error');
            return;
        }
        
        const normalizedUsername = this.normalizeSocialUsername(platform, input);
        
        this.pm.showMsg('socialAccountMessage', this.pm.t('profile.success.connectingSocial'), 'info');
        
        const result = await window.firebaseManager?.connectSocialAccount(platform, normalizedUsername);
        
        if (result?.success) {
            this.pm.showMsg('socialAccountMessage', this.pm.t('profile.socialConnected'), 'success');
            this.pm.socialAccounts[platform] = normalizedUsername;
            
            setTimeout(() => {
                this.closeModal('socialAccountModal');
                this.pm.initialize();
            }, 1500);
        } else {
            this.pm.showMsg('socialAccountMessage', result?.error || this.pm.t('profile.error.generic'), 'error');
        }
    }

    // ==================== PASSWORD & SETTINGS ====================

    async setupPassword() {
        const password = this.pm.getValue('setupPasswordInput');
        const confirm = this.pm.getValue('setupPasswordConfirm');

        if (!this.validatePasswords(password, confirm, 'setupPasswordMessage')) return;

        this.pm.showMsg('setupPasswordMessage', this.pm.t('profile.success.settingPassword'), 'info');

        const result = await window.firebaseManager?.setPasswordForGoogleAccount(password);

        if (result?.success) {
            this.pm.showMsg('setupPasswordMessage', this.pm.t('profile.passwordSet'), 'success');
            setTimeout(() => {
                this.closeModal('setPasswordModal');
                this.pm.initialize();
            }, 1500);
        } else {
            this.pm.showMsg('setupPasswordMessage', result?.error || this.pm.t('profile.error.generic'), 'error');
        }
    }

    async setupGmail() {
        const password = this.pm.getValue('gmailCurrentPassword');

        if (!password) {
            this.pm.showMsg('setupGmailMessage', this.pm.t('profile.error.fillAllFields'), 'error');
            return;
        }

        this.pm.showMsg('setupGmailMessage', this.pm.t('profile.success.connectingGmail'), 'info');

        const result = await window.firebaseManager?.linkGoogleAccount(password);

        if (result?.success) {
            this.pm.showMsg('setupGmailMessage', this.pm.t('profile.gmailConnected'), 'success');
            setTimeout(() => {
                this.closeModal('setGmailModal');
                this.pm.initialize();
            }, 1500);
        } else {
            this.pm.showMsg('setupGmailMessage', result?.error || this.pm.t('profile.error.generic'), 'error');
        }
    }

    async saveChanges() {
        const newUsername = this.pm.getValue('newUsernameInput');
        const changePassword = document.getElementById('changePasswordCheckbox')?.checked;
        const currentPassword = this.pm.getValue('currentPasswordInput');
        const newPassword = this.pm.getValue('newPasswordInput');
        const confirmPassword = this.pm.getValue('confirmPasswordInput');

        if (!newUsername && !changePassword) {
            this.pm.showMsg('settingsMessage', this.pm.t('profile.error.noChanges'), 'error');
            return;
        }

        if (newUsername && newUsername.length < 3) {
            this.pm.showMsg('settingsMessage', this.pm.t('profile.error.usernameTooShort'), 'error');
            return;
        }

        if (changePassword && !this.validatePasswords(newPassword, confirmPassword, 'settingsMessage', currentPassword)) {
            return;
        }

        if (newUsername) {
            this.pm.showMsg('settingsMessage', this.pm.t('profile.success.updatingUsername'), 'info');
            
            const result = await window.firebaseManager?.updateUsername(newUsername, changePassword ? currentPassword : null);
            
            if (!result?.success) {
                this.pm.showMsg('settingsMessage', result?.error || this.pm.t('profile.error.generic'), 'error');
                return;
            }
            
            this.pm.showMsg('settingsMessage', this.pm.t('profile.usernameUpdated'), 'success');
            
            if (!changePassword) {
                setTimeout(() => {
                    this.closeModal('settingsModal');
                    this.pm.initialize();
                }, 1500);
                return;
            }
        }

        if (changePassword) {
            this.pm.showMsg('settingsMessage', this.pm.t('profile.success.updatingPassword'), 'info');
            
            const result = await window.firebaseManager?.updatePassword(currentPassword, newPassword);
            
            if (!result?.success) {
                this.pm.showMsg('settingsMessage', result?.error || this.pm.t('profile.error.generic'), 'error');
                return;
            }
            
            this.pm.showMsg('settingsMessage', this.pm.t('profile.passwordUpdated'), 'success');
        }

        setTimeout(() => {
            this.closeModal('settingsModal');
            if (newUsername) this.pm.initialize();
        }, 1500);
    }

    // ==================== VALIDATION ====================

    validatePasswords(password, confirm, msgId, currentPassword = null) {
        if (currentPassword !== null && !currentPassword) {
            this.pm.showMsg(msgId, this.pm.t('profile.error.fillAllPasswordFields'), 'error');
            return false;
        }

        if (!password || !confirm) {
            this.pm.showMsg(msgId, this.pm.t('profile.error.fillAllFields'), 'error');
            return false;
        }

        if (password !== confirm) {
            this.pm.showMsg(msgId, this.pm.t('profile.error.passwordMismatch'), 'error');
            return false;
        }

        if (password.length < 6) {
            this.pm.showMsg(msgId, this.pm.t('profile.error.passwordTooShort'), 'error');
            return false;
        }

        return true;
    }

    // ==================== EVENT LISTENERS ====================

    attachEvents() {
        const checkbox = document.getElementById('changePasswordCheckbox');
        if (checkbox) {
            const handleChange = () => this.togglePasswordFields();
            checkbox.addEventListener('change', handleChange);
            this.pm.eventListeners.set('passwordCheckbox', handleChange);
        }
    }
}

console.log('✅ Profile Edit module loaded');
