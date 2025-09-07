// profile-settings.js - Логіка налаштувань
console.log('⚙️ Loading profile-settings.js...');

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

// Form Validation
function validatePasswordStrength(input) {
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
}

function validatePasswordMatch(passwordInput, confirmInput) {
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
}

function validateNickname(input) {
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
}

// Setup form validation
function setupFormValidation() {
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmNewPassword = document.getElementById('confirmNewPassword');
    const newNickname = document.getElementById('newNickname');

    if (newPassword && confirmNewPassword) {
        confirmNewPassword.addEventListener('input', () => {
            validatePasswordMatch(newPassword, confirmNewPassword);
        });

        newPassword.addEventListener('input', () => {
            validatePasswordStrength(newPassword);
            if (confirmNewPassword.value) {
                validatePasswordMatch(newPassword, confirmNewPassword);
            }
        });
    }

    if (newNickname) {
        newNickname.addEventListener('input', () => {
            validateNickname(newNickname);
        });
    }
}

// Setup settings toggles
function setupSettingsToggles() {
    const autoSaveToggle = document.getElementById('autoSaveToggle');
    const historyToggle = document.getElementById('historyToggle');

    if (autoSaveToggle) {
        const autoSave = localStorage.getItem('armHelper_autoSave') !== 'false';
        autoSaveToggle.checked = autoSave;

        autoSaveToggle.addEventListener('change', (e) => {
            localStorage.setItem('armHelper_autoSave', e.target.checked);
            if (typeof showProfileMessage === 'function') {
                showProfileMessage('Auto-save preference updated', 'success');
            }
        });
    }

    if (historyToggle) {
        const showHistory = localStorage.getItem('armHelper_showHistory') !== 'false';
        historyToggle.checked = showHistory;

        historyToggle.addEventListener('change', (e) => {
            localStorage.setItem('armHelper_showHistory', e.target.checked);
            if (typeof showProfileMessage === 'function') {
                showProfileMessage('History preference updated', 'success');
            }
        });
    }
}

// Show loading state on button
function showLoading(button, show = true) {
    if (show) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Handle change password
async function handleChangePassword(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    
    const currentPassword = document.getElementById('currentPassword')?.value;
    const newPassword = document.getElementById('newPassword')?.value;
    const confirmNewPassword = document.getElementById('confirmNewPassword')?.value;

    // Validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        if (typeof showProfileMessage === 'function') {
            showProfileMessage('All fields are required', 'error');
        }
        return;
    }

    if (newPassword.length < 6) {
        if (typeof showProfileMessage === 'function') {
            showProfileMessage('New password must be at least 6 characters long', 'error');
        }
        return;
    }

    if (newPassword !== confirmNewPassword) {
        if (typeof showProfileMessage === 'function') {
            showProfileMessage('New passwords do not match', 'error');
        }
        return;
    }

    if (currentPassword === newPassword) {
        if (typeof showProfileMessage === 'function') {
            showProfileMessage('New password must be different from current password', 'error');
        }
        return;
    }

    try {
        showLoading(submitBtn, true);

        if (window.authManager && typeof window.authManager.changePassword === 'function') {
            const result = await window.authManager.changePassword(currentPassword, newPassword);
            
            if (result.success) {
                if (typeof showProfileMessage === 'function') {
                    showProfileMessage('Password updated successfully!', 'success');
                }
                form.reset();
                document.querySelectorAll('.form-input').forEach(input => {
                    input.classList.remove('error', 'success');
                });
                setTimeout(() => closeSettingsMenu(), 2000);
            }
        } else {
            // Fallback for localStorage
            const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
            const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
            
            const userIndex = savedUsers.findIndex(u => u.nickname === currentUser.nickname);
            
            if (userIndex === -1) {
                throw new Error('User not found');
            }

            if (savedUsers[userIndex].password !== currentPassword) {
                throw new Error('Current password is incorrect');
            }

            savedUsers[userIndex].password = newPassword;
            savedUsers[userIndex].updatedAt = new Date().toISOString();

            localStorage.setItem('armHelper_users', JSON.stringify(savedUsers));
            
            if (typeof showProfileMessage === 'function') {
                showProfileMessage('Password updated successfully! (Development mode)', 'success');
            }
            form.reset();
            document.querySelectorAll('.form-input').forEach(input => {
                input.classList.remove('error', 'success');
            });
            setTimeout(() => closeSettingsMenu(), 2000);
        }

    } catch (error) {
        console.error('Change password error:', error);
        if (typeof showProfileMessage === 'function') {
            showProfileMessage(error.message || 'Failed to update password', 'error');
        }
    } finally {
        showLoading(submitBtn, false);
    }
}

// Handle change nickname
async function handleChangeNickname(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    
    const currentNickname = document.getElementById('currentNickname')?.value;
    const newNickname = document.getElementById('newNickname')?.value.trim();

    // Validation
    if (!newNickname) {
        if (typeof showProfileMessage === 'function') {
            showProfileMessage('New nickname is required', 'error');
        }
        return;
    }

    if (newNickname.length < 3 || newNickname.length > 20) {
        if (typeof showProfileMessage === 'function') {
            showProfileMessage('Nickname must be between 3 and 20 characters', 'error');
        }
        return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(newNickname)) {
        if (typeof showProfileMessage === 'function') {
            showProfileMessage('Nickname can only contain letters, numbers, and underscores', 'error');
        }
        return;
    }

    if (currentNickname === newNickname) {
        if (typeof showProfileMessage === 'function') {
            showProfileMessage('New nickname must be different from current nickname', 'error');
        }
        return;
    }

    try {
        showLoading(submitBtn, true);

        if (window.authManager && typeof window.authManager.updateProfile === 'function') {
            const result = await window.authManager.updateProfile({ nickname: newNickname });
            
            if (result.success) {
                if (typeof showProfileMessage === 'function') {
                    showProfileMessage('Nickname updated successfully!', 'success');
                }
                if (typeof updateProfileDisplay === 'function') {
                    updateProfileDisplay();
                }
                form.reset();
                setTimeout(() => closeSettingsMenu(), 2000);
            }
        } else {
            // Fallback for localStorage
            const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
            const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
            
            const existingUser = savedUsers.find(u => u.nickname === newNickname && u.nickname !== currentUser.nickname);
            if (existingUser) {
                throw new Error('This nickname is already taken');
            }
            
            const userIndex = savedUsers.findIndex(u => u.nickname === currentUser.nickname);
            
            if (userIndex === -1) {
                throw new Error('User not found');
            }

            savedUsers[userIndex].nickname = newNickname;
            savedUsers[userIndex].updatedAt = new Date().toISOString();
            
            currentUser.nickname = newNickname;
            currentUser.updatedAt = new Date().toISOString();

            localStorage.setItem('armHelper_users', JSON.stringify(savedUsers));
            localStorage.setItem('armHelper_currentUser', JSON.stringify(currentUser));
            
            if (typeof showProfileMessage === 'function') {
                showProfileMessage('Nickname updated successfully! (Development mode)', 'success');
            }
            if (typeof updateProfileDisplay === 'function') {
                updateProfileDisplay();
            }
            
            if (typeof updateSidebarUserInfo === 'function') {
                updateSidebarUserInfo(currentUser);
            }
            
            form.reset();
            setTimeout(() => closeSettingsMenu(), 2000);
        }

    } catch (error) {
        console.error('Change nickname error:', error);
        if (typeof showProfileMessage === 'function') {
            showProfileMessage(error.message || 'Failed to update nickname', 'error');
        }
    } finally {
        showLoading(submitBtn, false);
    }
}

// Confirm delete account
function confirmDeleteAccount() {
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
            if (typeof showProfileMessage === 'function') {
                showProfileMessage('Account deletion cancelled - confirmation text did not match', 'error');
            }
        }
    }
}

// Delete user account
async function deleteUserAccount() {
    try {
        if (window.authManager && typeof window.authManager.deleteAccount === 'function') {
            const result = await window.authManager.deleteAccount();
            
            if (result.success) {
                alert('Your account has been successfully deleted.');
                
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
            
            const updatedUsers = savedUsers.filter(u => u.nickname !== currentUser.nickname);
            localStorage.setItem('armHelper_users', JSON.stringify(updatedUsers));
            
            localStorage.removeItem('armHelper_currentUser');
            
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
        if (typeof showProfileMessage === 'function') {
            showProfileMessage('Failed to delete account. Please try again.', 'error');
        }
    }
}

// Event listeners for clicking outside to close menus
function setupOutsideClickListeners() {
    document.addEventListener('click', (e) => {
        const settingsMenu = document.getElementById('settingsMenu');
        const statsView = document.getElementById('statsView');
        const settingsForms = document.querySelectorAll('.settings-form');
        
        if (settingsMenu && settingsMenu.style.display === 'block') {
            if (!settingsMenu.contains(e.target) && !e.target.classList.contains('settings-btn')) {
                closeSettingsMenu();
            }
        }
        
        if (statsView && statsView.style.display === 'block') {
            if (!statsView.contains(e.target) && !e.target.classList.contains('stats-btn')) {
                if (typeof closeStatsView === 'function') {
                    closeStatsView();
                }
            }
        }
    });
}

// Initialize settings
function initializeProfileSettings() {
    setupFormValidation();
    setupSettingsToggles();
    setupOutsideClickListeners();
}

// Export functions for global use
if (typeof window !== 'undefined') {
    window.toggleSettingsMenu = toggleSettingsMenu;
    window.closeSettingsMenu = closeSettingsMenu;
    window.backToSettingsMenu = backToSettingsMenu;
    window.showChangePassword = showChangePassword;
    window.showChangeNickname = showChangeNickname;
    window.showPreferences = showPreferences;
    window.validatePasswordStrength = validatePasswordStrength;
    window.validatePasswordMatch = validatePasswordMatch;
    window.validateNickname = validateNickname;
    window.setupFormValidation = setupFormValidation;
    window.setupSettingsToggles = setupSettingsToggles;
    window.showLoading = showLoading;
    window.handleChangePassword = handleChangePassword;
    window.handleChangeNickname = handleChangeNickname;
    window.confirmDeleteAccount = confirmDeleteAccount;
    window.deleteUserAccount = deleteUserAccount;
    window.initializeProfileSettings = initializeProfileSettings;
}

console.log('✅ profile-settings.js loaded');
