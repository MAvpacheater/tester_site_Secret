// Profile Settings Management - profile-settings.js
const ProfileSettings = {
    // Form validation setup
    setupFormValidation() {
        const currentPassword = document.getElementById('currentPassword');
        const newPassword = document.getElementById('newPassword');
        const confirmNewPassword = document.getElementById('confirmNewPassword');
        const newNickname = document.getElementById('newNickname');

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

        if (newNickname) {
            newNickname.addEventListener('input', () => {
                this.validateNickname(newNickname);
            });
        }
    },

    // Validation methods
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

    validateNickname(input) {
        const value = input.value.trim();
        
        if (value.length === 0) {
            input.classList.remove('error', 'success');
            return true;
        }

        if (value.length >= 3 && value.length <= 20 && /^[a-zA-Z0-9_]+$/.test(value)) {
            input.classList.add('success');
            input.classList.remove('error');
            return true;
        } else {
            input.classList.add('error');
            input.classList.remove('success');
            return false;
        }
    },

    // Settings toggles setup
    setupSettingsToggles() {
        const autoSaveToggle = document.getElementById('autoSaveToggle');
        const historyToggle = document.getElementById('historyToggle');

        if (autoSaveToggle) {
            const autoSave = localStorage.getItem('armHelper_autoSave') !== 'false';
            autoSaveToggle.checked = autoSave;

            autoSaveToggle.addEventListener('change', (e) => {
                localStorage.setItem('armHelper_autoSave', e.target.checked);
                ProfileSystem.showMessage('Auto-save preference updated', 'success');
            });
        }

        if (historyToggle) {
            const showHistory = localStorage.getItem('armHelper_showHistory') !== 'false';
            historyToggle.checked = showHistory;

            historyToggle.addEventListener('change', (e) => {
                localStorage.setItem('armHelper_showHistory', e.target.checked);
                ProfileSystem.showMessage('History preference updated', 'success');
            });
        }
    }
};

// Menu Management Functions
function toggleSettingsMenu() {
    const settingsMenu = document.getElementById('settingsMenu');
    if (settingsMenu) {
        settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
    }
}

function closeSettingsMenu() {
    const settingsMenu = document.getElementById('settingsMenu');
    const settingsForms = document.querySelectorAll('.settings-form');
    
    if (settingsMenu) {
        settingsMenu.style.display = 'none';
    }
    
    settingsForms.forEach(form => {
        form.style.display = 'none';
    });
}

function backToSettingsMenu() {
    const settingsForms = document.querySelectorAll('.settings-form');
    const settingsMenu = document.getElementById('settingsMenu');
    
    settingsForms.forEach(form => {
        form.style.display = 'none';
    });
    
    if (settingsMenu) {
        settingsMenu.style.display = 'block';
    }
}

function showChangePassword() {
    const settingsMenu = document.getElementById('settingsMenu');
    const changePasswordForm = document.getElementById('changePasswordForm');
    
    if (settingsMenu) settingsMenu.style.display = 'none';
    if (changePasswordForm) changePasswordForm.style.display = 'block';
}

function showChangeNickname() {
    const settingsMenu = document.getElementById('settingsMenu');
    const changeNicknameForm = document.getElementById('changeNicknameForm');
    
    if (settingsMenu) settingsMenu.style.display = 'none';
    if (changeNicknameForm) changeNicknameForm.style.display = 'block';
}

function showPreferences() {
    const settingsMenu = document.getElementById('settingsMenu');
    const preferencesForm = document.getElementById('preferencesForm');
    
    if (settingsMenu) settingsMenu.style.display = 'none';
    if (preferencesForm) preferencesForm.style.display = 'block';
}

function toggleStatsView() {
    const statsView = document.getElementById('statsView');
    if (statsView) {
        statsView.style.display = statsView.style.display === 'none' ? 'block' : 'none';
    }
}

function closeStatsView() {
    const statsView = document.getElementById('statsView');
    if (statsView) {
        statsView.style.display = 'none';
    }
}

// Enhanced change password with persistent auth support
async function handleChangePassword(event) {
    event.preventDefault();
    console.log('🔒 Handling password change...');

    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    
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
            console.log('🔄 Using Supabase auth manager for password change...');
            const result = await ProfileSystem.authManager.changePassword(currentPassword, newPassword);
            
            if (result.success) {
                ProfileSystem.showMessage('Password updated successfully!', 'success');
                form.reset();
                document.querySelectorAll('.form-input').forEach(input => {
                    input.classList.remove('error', 'success');
                });
                setTimeout(() => closeSettingsMenu(), 2000);
            }
        } else {
            console.log('🔄 Using localStorage fallback for password change...');
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

            // Update current user
            currentUser.password = newPassword;
            currentUser.updatedAt = new Date().toISOString();

            localStorage.setItem('armHelper_users', JSON.stringify(savedUsers));
            localStorage.setItem('armHelper_currentUser', JSON.stringify(currentUser));
            
            ProfileSystem.showMessage('Password updated successfully!', 'success');
            form.reset();
            document.querySelectorAll('.form-input').forEach(input => {
                input.classList.remove('error', 'success');
            });
            setTimeout(() => closeSettingsMenu(), 2000);
        }

    } catch (error) {
        console.error('❌ Change password error:', error);
        ProfileSystem.showMessage(error.message || 'Failed to update password', 'error');
    } finally {
        ProfileSystem.showLoading(submitBtn, false);
    }
}

// Enhanced change nickname with persistent auth and UI updates
async function handleChangeNickname(event) {
    event.preventDefault();
    console.log('✏️ Handling nickname change...');

    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    
    const currentNickname = document.getElementById('currentNickname')?.value;
    const newNickname = document.getElementById('newNickname')?.value.trim();

    // Validation
    if (!newNickname) {
        ProfileSystem.showMessage('New nickname is required', 'error');
        return;
    }

    if (newNickname.length < 3 || newNickname.length > 20) {
        ProfileSystem.showMessage('Nickname must be between 3 and 20 characters', 'error');
        return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(newNickname)) {
        ProfileSystem.showMessage('Nickname can only contain letters, numbers, and underscores', 'error');
        return;
    }

    if (currentNickname === newNickname) {
        ProfileSystem.showMessage('New nickname must be different from current nickname', 'error');
        return;
    }

    try {
        ProfileSystem.showLoading(submitBtn, true);

        if (ProfileSystem.authManager && typeof ProfileSystem.authManager.updateProfile === 'function') {
            console.log('🔄 Using Supabase for nickname change...');
            const result = await ProfileSystem.authManager.updateProfile({ nickname: newNickname });
            
            if (result.success) {
                ProfileSystem.showMessage('Nickname updated successfully!', 'success');
                
                // Refresh profile display
                setTimeout(() => {
                    ProfileSystem.loadCurrentUserData();
                }, 500);
                
                form.reset();
                setTimeout(() => closeSettingsMenu(), 2000);
            }
        } else {
            console.log('🔄 Using localStorage fallback for nickname change...');
            // Fallback for localStorage
            const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
            const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
            
            // Check if nickname already exists
            const existingUser = savedUsers.find(u => u.nickname === newNickname && u.nickname !== currentUser.nickname);
            if (existingUser) {
                throw new Error('This nickname is already taken');
            }
            
            const userIndex = savedUsers.findIndex(u => u.nickname === currentUser.nickname);
            
            if (userIndex === -1) {
                throw new Error('User not found');
            }

            // Update nickname
            savedUsers[userIndex].nickname = newNickname;
            savedUsers[userIndex].updatedAt = new Date().toISOString();
            
            // Update current user
            currentUser.nickname = newNickname;
            currentUser.updatedAt = new Date().toISOString();
            
            // Update email to match new nickname if needed
            if (!currentUser.email || currentUser.email.includes('@local.test')) {
                currentUser.email = `${newNickname}@local.test`;
            }

            localStorage.setItem('armHelper_users', JSON.stringify(savedUsers));
            localStorage.setItem('armHelper_currentUser', JSON.stringify(currentUser));
            
            // Update auth manager if it exists
            if (ProfileSystem.authManager) {
                ProfileSystem.authManager.userProfile = currentUser;
                if (ProfileSystem.authManager.currentUser) {
                    ProfileSystem.authManager.currentUser.nickname = newNickname;
                }
            }
            
            ProfileSystem.showMessage('Nickname updated successfully!', 'success');
            
            // Refresh profile and sidebar display
            setTimeout(() => {
                ProfileSystem.loadCurrentUserData();
                
                // Update sidebar if function exists
                if (typeof updateSidebarForAuthenticatedUser === 'function') {
                    const userObj = {
                        id: currentUser.id,
                        email: currentUser.email,
                        nickname: newNickname
                    };
                    updateSidebarForAuthenticatedUser(userObj, currentUser);
                }
            }, 500);
            
            form.reset();
            setTimeout(() => closeSettingsMenu(), 2000);
        }

    } catch (error) {
        console.error('❌ Change nickname error:', error);
        ProfileSystem.showMessage(error.message || 'Failed to update nickname', 'error');
    } finally {
        ProfileSystem.showLoading(submitBtn, false);
    }
}

// Enhanced account deletion with persistent auth clearing
function confirmDeleteAccount() {
    console.log('⚠️ Account deletion requested...');
    closeSettingsMenu();
    
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

// Enhanced account deletion
async function deleteUserAccount() {
    try {
        console.log('🗑️ Deleting user account...');
        
        if (ProfileSystem.authManager && typeof ProfileSystem.authManager.deleteAccount === 'function') {
            console.log('🔄 Using Supabase for account deletion...');
            const result = await ProfileSystem.authManager.deleteAccount();
            
            if (result.success) {
                alert('Your account has been successfully deleted.');
                
                // Clear persistent auth
                localStorage.removeItem('armHelper_persistentAuth');
                
                // Redirect to login
                setTimeout(() => {
                    if (typeof switchPage === 'function') {
                        switchPage('login');
                    }
                }, 1000);
            }
        } else {
            console.log('🔄 Using localStorage fallback for account deletion...');
            // Fallback for localStorage
            const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
            const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
            
            // Remove user from saved users
            const updatedUsers = savedUsers.filter(u => u.nickname !== currentUser.nickname);
            localStorage.setItem('armHelper_users', JSON.stringify(updatedUsers));
            
            // Clear current user data and persistent auth
            localStorage.removeItem('armHelper_currentUser');
            localStorage.removeItem('armHelper_persistentAuth');
            localStorage.removeItem('armHelper_loginCount');
            localStorage.removeItem('armHelper_lastLogin');
            
            // Clear all user settings
            const settingsKeys = ['calculator', 'arm', 'grind'];
            settingsKeys.forEach(key => {
                localStorage.removeItem(`armHelper_${key}_settings`);
            });
            
            alert('Your account has been successfully deleted.');
            
            setTimeout(() => {
                if (typeof switchPage === 'function') {
                    switchPage('login');
                }
            }, 1000);
        }

    } catch (error) {
        console.error('❌ Delete account error:', error);
        ProfileSystem.showMessage('Failed to delete account. Please try again.', 'error');
    }
}

// Close menus when clicking outside
document.addEventListener('click', (e) => {
    const settingsMenu = document.getElementById('settingsMenu');
    const statsView = document.getElementById('statsView');
    
    if (settingsMenu && settingsMenu.style.display === 'block') {
        if (!settingsMenu.contains(e.target) && !e.target.classList.contains('settings-btn')) {
            closeSettingsMenu();
        }
    }
    
    if (statsView && statsView.style.display === 'block') {
        if (!statsView.contains(e.target) && !e.target.classList.contains('stats-btn')) {
            closeStatsView();
        }
    }
});

// Export functions for global use
if (typeof window !== 'undefined') {
    window.ProfileSettings = ProfileSettings;
    window.toggleSettingsMenu = toggleSettingsMenu;
    window.closeSettingsMenu = closeSettingsMenu;
    window.backToSettingsMenu = backToSettingsMenu;
    window.showChangePassword = showChangePassword;
    window.showChangeNickname = showChangeNickname;
    window.showPreferences = showPreferences;
    window.toggleStatsView = toggleStatsView;
    window.closeStatsView = closeStatsView;
    window.handleChangePassword = handleChangePassword;
    window.handleChangeNickname = handleChangeNickname;
    window.confirmDeleteAccount = confirmDeleteAccount;
    window.deleteUserAccount = deleteUserAccount;
}
