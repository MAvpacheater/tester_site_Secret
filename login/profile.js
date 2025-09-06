// Profile System - profile.js
const ProfileSystem = {
    currentUser: null,
    authManager: null,

    // Initialize profile system
    init() {
        console.log('👤 Initializing Profile System...');
        this.authManager = window.authManager;
        this.bindEvents();
        this.setupFormValidation();
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

        // Settings toggles
        this.setupSettingsToggles();
    },

    // Handle user authenticated
    handleUserAuthenticated(detail) {
        const { user, profile } = detail;
        this.currentUser = { user, profile };
        this.updateProfileDisplay();
    },

    // Handle user signed out
    handleUserSignedOut() {
        this.currentUser = null;
    },

    // Update profile display
    updateProfileDisplay() {
        if (!this.currentUser) return;

        const { user, profile } = this.currentUser;
        const nickname = profile?.nickname || user?.email?.split('@')[0] || 'User';

        // Update profile info
        const profileNickname = document.getElementById('profileNickname');
        const avatarText = document.getElementById('avatarText');
        const profileJoinDate = document.getElementById('profileJoinDate');

        if (profileNickname) {
            profileNickname.textContent = nickname;
        }

        if (avatarText) {
            avatarText.textContent = nickname.charAt(0).toUpperCase();
        }

        if (profileJoinDate) {
            const joinDate = this.formatJoinDate(profile?.created_at || user?.created_at);
            profileJoinDate.textContent = joinDate;
        }

        // Update stats
        this.updateProfileStats();
    },

    // Format join date
    formatJoinDate(dateString) {
        if (!dateString) return 'Recently';
        
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now - date);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 1) return 'Today';
            if (diffDays < 7) return `${diffDays} days ago`;
            if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
            if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
            
            return date.toLocaleDateString();
        } catch (e) {
            return 'Recently';
        }
    },

    // Update profile stats
    async updateProfileStats() {
        try {
            // Count saved calculations
            let calculationsCount = 0;
            const calculatorTypes = ['calculator', 'arm', 'grind'];
            
            for (const type of calculatorTypes) {
                const settings = await this.loadCalculatorSettings(type);
                if (settings) calculationsCount++;
            }

            const calculationsEl = document.getElementById('calculationsCount');
            if (calculationsEl) {
                calculationsEl.textContent = calculationsCount;
            }

            // Update login count (mock data for now)
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
            console.error('Error updating profile stats:', error);
        }
    },

    // Load calculator settings
    async loadCalculatorSettings(type) {
        if (this.authManager && typeof this.authManager.loadCalculatorSettings === 'function') {
            return await this.authManager.loadCalculatorSettings(type);
        } else {
            const settings = localStorage.getItem(`armHelper_${type}_settings`);
            return settings ? JSON.parse(settings) : null;
        }
    },

    // Setup form validation
    setupFormValidation() {
        const currentPassword = document.getElementById('currentPassword');
        const newPassword = document.getElementById('newPassword');
        const confirmNewPassword = document.getElementById('confirmNewPassword');

        if (newPassword && confirmNewPassword) {
            confirmNewPassword.addEventListener('input', () => {
                this.validatePasswordMatch(newPassword, confirmNewPassword);
            });

            newPassword.addEventListener('input', () => {
                this.validatePasswordStrength(newPassword);
                if (confirmNewPassword.value) {
                    this.validatePasswordMatch(newPassword, confirmNewPassword);
                }
            });
        }
    },

    // Validate password strength
    validatePasswordStrength(input) {
        const value = input.value;
        
        if (value.length === 0) {
            input.classList.remove('error', 'success');
            return true;
        }

        if (value.length >= 6) {
            input.classList.add('success');
            input.classList.remove('error');
            return true;
        } else {
            input.classList.add('error');
            input.classList.remove('success');
            return false;
        }
    },

    // Validate password match
    validatePasswordMatch(passwordInput, confirmInput) {
        if (confirmInput.value === '') {
            confirmInput.classList.remove('error', 'success');
            return true;
        }

        if (passwordInput.value === confirmInput.value) {
            confirmInput.classList.add('success');
            confirmInput.classList.remove('error');
            return true;
        } else {
            confirmInput.classList.add('error');
            confirmInput.classList.remove('success');
            return false;
        }
    },

    // Setup settings toggles
    setupSettingsToggles() {
        const autoSaveToggle = document.getElementById('autoSaveToggle');
        const historyToggle = document.getElementById('historyToggle');

        if (autoSaveToggle) {
            // Load saved preference
            const autoSave = localStorage.getItem('armHelper_autoSave') !== 'false';
            autoSaveToggle.checked = autoSave;

            autoSaveToggle.addEventListener('change', (e) => {
                localStorage.setItem('armHelper_autoSave', e.target.checked);
                this.showMessage('Auto-save preference updated', 'success');
            });
        }

        if (historyToggle) {
            // Load saved preference
            const showHistory = localStorage.getItem('armHelper_showHistory') !== 'false';
            historyToggle.checked = showHistory;

            historyToggle.addEventListener('change', (e) => {
                localStorage.setItem('armHelper_showHistory', e.target.checked);
                this.showMessage('History preference updated', 'success');
            });
        }
    },

    // Show message
    showMessage(text, type = 'success') {
        const messageEl = document.getElementById('profileMessage');
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.className = `profile-message ${type}`;
            messageEl.style.display = 'block';

            // Hide after 4 seconds
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 4000);
        }
    },

    // Show loading state on button
    showLoading(button, show = true) {
        if (show) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }
};

// Handle change password
async function handleChangePassword(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('.change-password-btn');
    
    const currentPassword = document.getElementById('currentPassword')?.value;
    const newPassword = document.getElementById('newPassword')?.value;
    const confirmNewPassword = document.getElementById('confirmNewPassword')?.value;

    // Validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        ProfileSystem.showMessage('All fields are required', 'error');
        return;
    }

    if (newPassword.length < 6) {
        ProfileSystem.showMessage('New password must be at least 6 characters long', 'error');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        ProfileSystem.showMessage('New passwords do not match', 'error');
        return;
    }

    if (currentPassword === newPassword) {
        ProfileSystem.showMessage('New password must be different from current password', 'error');
        return;
    }

    try {
        ProfileSystem.showLoading(submitBtn, true);

        if (ProfileSystem.authManager && typeof ProfileSystem.authManager.changePassword === 'function') {
            // Use Supabase auth manager
            const result = await ProfileSystem.authManager.changePassword(currentPassword, newPassword);
            
            if (result.success) {
                ProfileSystem.showMessage('Password updated successfully!', 'success');
                form.reset();
                // Clear validation classes
                document.querySelectorAll('.form-input').forEach(input => {
                    input.classList.remove('error', 'success');
                });
            }
        } else {
            // Fallback for localStorage (development mode)
            const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
            const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
            
            const userIndex = savedUsers.findIndex(u => u.nickname === currentUser.nickname);
            
            if (userIndex === -1) {
                throw new Error('User not found');
            }

            if (savedUsers[userIndex].password !== currentPassword) {
                throw new Error('Current password is incorrect');
            }

            // Update password
            savedUsers[userIndex].password = newPassword;
            savedUsers[userIndex].updatedAt = new Date().toISOString();

            localStorage.setItem('armHelper_users', JSON.stringify(savedUsers));
            
            ProfileSystem.showMessage('Password updated successfully! (Development mode)', 'success');
            form.reset();
            document.querySelectorAll('.form-input').forEach(input => {
                input.classList.remove('error', 'success');
            });
        }

    } catch (error) {
        console.error('Change password error:', error);
        ProfileSystem.showMessage(error.message || 'Failed to update password', 'error');
    } finally {
        ProfileSystem.showLoading(submitBtn, false);
    }
}

// Go back from profile
function goBackFromProfile() {
    if (typeof switchPage === 'function') {
        switchPage('calculator');
    }
}

// Confirm delete account
function confirmDeleteAccount() {
    const isConfirmed = confirm(
        'Are you absolutely sure you want to delete your account?\n\n' +
        'This action cannot be undone. All your data will be permanently deleted.\n\n' +
        'Type "DELETE" to confirm:'
    );

    if (isConfirmed) {
        const confirmation = prompt('Please type "DELETE" to confirm account deletion:');
        
        if (confirmation === 'DELETE') {
            deleteUserAccount();
        } else if (confirmation !== null) {
            ProfileSystem.showMessage('Account deletion cancelled - confirmation text did not match', 'error');
        }
    }
}

// Delete user account
async function deleteUserAccount() {
    try {
        if (ProfileSystem.authManager && typeof ProfileSystem.authManager.deleteAccount === 'function') {
            // Use Supabase
            const result = await ProfileSystem.authManager.deleteAccount();
            
            if (result.success) {
                alert('Your account has been successfully deleted.');
                
                // Redirect to login
                setTimeout(() => {
                    if (typeof switchPage === 'function') {
                        switchPage('login');
                    }
                }, 1000);
            }
        } else {
            // Fallback for localStorage
            const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
            const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
            
            // Remove user from saved users
            const updatedUsers = savedUsers.filter(u => u.nickname !== currentUser.nickname);
            localStorage.setItem('armHelper_users', JSON.stringify(updatedUsers));
            
            // Clear current user data
            localStorage.removeItem('armHelper_currentUser');
            
            // Clear all user settings
            const settingsKeys = ['calculator', 'arm', 'grind'];
            settingsKeys.forEach(key => {
                localStorage.removeItem(`armHelper_${key}_settings`);
            });
            
            alert('Your account has been successfully deleted (Development mode).');
            
            setTimeout(() => {
                if (typeof switchPage === 'function') {
                    switchPage('login');
                }
            }, 1000);
        }

    } catch (error) {
        console.error('Delete account error:', error);
        ProfileSystem.showMessage('Failed to delete account. Please try again.', 'error');
    }
}

// Open profile page
function openProfile() {
    if (!ProfileSystem.currentUser && !localStorage.getItem('armHelper_currentUser')) {
        ProfileSystem.showMessage('Please login to view your profile', 'error');
        return;
    }

    if (typeof switchPage === 'function') {
        switchPage('profile');
        
        // Small delay to ensure page is loaded, then update display
        setTimeout(() => {
            ProfileSystem.updateProfileDisplay();
        }, 100);
    }
}

// Update login stats
function updateLoginStats() {
    // Increment login count
    const currentCount = parseInt(localStorage.getItem('armHelper_loginCount') || '0');
    localStorage.setItem('armHelper_loginCount', (currentCount + 1).toString());
    
    // Update last login time
    localStorage.setItem('armHelper_lastLogin', new Date().toISOString());
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
    console.log('✅ Profile system initialized');
}

// Export functions for global use
if (typeof window !== 'undefined') {
    window.ProfileSystem = ProfileSystem;
    window.initializeProfile = initializeProfile;
    window.handleChangePassword = handleChangePassword;
    window.goBackFromProfile = goBackFromProfile;
    window.confirmDeleteAccount = confirmDeleteAccount;
    window.deleteUserAccount = deleteUserAccount;
    window.openProfile = openProfile;
    window.updateLoginStats = updateLoginStats;
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof initializeProfile === 'function') {
            initializeProfile();
        }
    }, 100);
});
