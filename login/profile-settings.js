// profile-settings.js - Логіка налаштувань з виправленою логікою
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
    
    // Заповнюємо поточний нікнейм
    const currentNicknameInput = document.getElementById('currentNickname');
    if (currentNicknameInput && window.authManager && window.authManager.userProfile) {
        currentNicknameInput.value = window.authManager.userProfile.nickname || 'User';
    }
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

// Handle change password - СПРОЩЕНА ЛОГІКА
async function handleChangePassword(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    
    const currentPassword = document.getElementById('currentPassword')?.value;
    const newPassword = document.getElementById('newPassword')?.value;
    const confirmNewPassword = document.getElementById('confirmNewPassword')?.value;

    // Базова валідація
    if (!newPassword || !confirmNewPassword) {
        showProfileMessage('All fields are required', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showProfileMessage('New password must be at least 6 characters long', 'error');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        showProfileMessage('New passwords do not match', 'error');
        return;
    }

    // Для fallback режиму потрібен поточний пароль
    if (!window.authManager?.supabase && !currentPassword) {
        showProfileMessage('Current password is required', 'error');
        return;
    }

    try {
        showLoading(submitBtn, true);

        if (window.authManager && typeof window.authManager.changePassword === 'function') {
            const result = await window.authManager.changePassword(currentPassword, newPassword);
            
            if (result.success) {
                showProfileMessage('Password updated successfully!', 'success');
                form.reset();
                document.querySelectorAll('.form-input').forEach(input => {
                    input.classList.remove('error', 'success');
                });
                setTimeout(() => closeSettingsMenu(), 2000);
            }
        } else {
            showProfileMessage('Authentication manager not available', 'error');
        }

    } catch (error) {
        console.error('Change password error:', error);
        showProfileMessage(error.message || 'Failed to update password', 'error');
    } finally {
        showLoading(submitBtn, false);
    }
}

// Handle change nickname - СПРОЩЕНА ЛОГІКА
async function handleChangeNickname(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    
    const currentNickname = document.getElementById('currentNickname')?.value;
    const newNickname = document.getElementById('newNickname')?.value.trim();

    // Базова валідація
    if (!newNickname) {
        showProfileMessage('New nickname is required', 'error');
        return;
    }

    if (newNickname.length < 3 || newNickname.length > 20) {
        showProfileMessage('Nickname must be between 3 and 20 characters', 'error');
        return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(newNickname)) {
        showProfileMessage('Nickname can only contain letters, numbers, and underscores', 'error');
        return;
    }

    if (currentNickname === newNickname) {
        showProfileMessage('New nickname must be different from current nickname', 'error');
        return;
    }

    try {
        showLoading(submitBtn, true);

        if (window.authManager && typeof window.authManager.updateProfile === 'function') {
            const result = await window.authManager.updateProfile({ nickname: newNickname });
            
            if (result.success) {
                showProfileMessage('Nickname updated successfully!', 'success');
                
                // Оновлюємо відображення профілю
                if (typeof updateProfileDisplay === 'function') {
                    updateProfileDisplay();
                }
                
                // Оновлюємо сайдбар
                if (typeof updateSidebarForAuthenticatedUser === 'function') {
                    updateSidebarForAuthenticatedUser(window.authManager.currentUser, result.profile);
                }
                
                form.reset();
                setTimeout(() => closeSettingsMenu(), 2000);
            }
        } else {
            showProfileMessage('Authentication manager not available', 'error');
        }

    } catch (error) {
        console.error('Change nickname error:', error);
        showProfileMessage(error.message || 'Failed to update nickname', 'error');
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
        'Click OK to continue with deletion.'
    );

    if (isConfirmed) {
        const confirmation = prompt('Please type "DELETE" to confirm account deletion:');
        
        if (confirmation === 'DELETE') {
            deleteUserAccount();
        } else if (confirmation !== null) {
            showProfileMessage('Account deletion cancelled - confirmation text did not match', 'error');
        }
    }
}

// Delete user account - СПРОЩЕНА ЛОГІКА
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
            showProfileMessage('Authentication manager not available', 'error');
        }

    } catch (error) {
        console.error('Delete account error:', error);
        showProfileMessage('Failed to delete account. Please try again.', 'error');
    }
}

// Show profile message helper
function showProfileMessage(text, type = 'success') {
    const messageEl = document.getElementById('profileMessage');
    if (messageEl) {
        messageEl.textContent = text;
        messageEl.className = `profile-message ${type}`;
        messageEl.style.display = 'block';

        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 4000);
    } else {
        // Fallback до alert якщо немає елемента повідомлення
        if (type === 'error') {
            alert('Error: ' + text);
        } else {
            alert(text);
        }
    }
}

// Event listeners for clicking outside to close menus
function setupOutsideClickListeners() {
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
    setupOutsideClickListeners();
    
    // Слухаємо оновлення профілю
    document.addEventListener('userProfileUpdated', (event) => {
        const { profile } = event.detail;
        
        // Оновлюємо відображення в формах
        const currentNicknameInput = document.getElementById('currentNickname');
        if (currentNicknameInput && profile) {
            currentNicknameInput.value = profile.nickname || 'User';
        }
        
        console.log('✅ Profile settings updated after profile change');
    });
}

// Export functions for global use
if (typeof window !== 'undefined') {
    window.toggleSettingsMenu = toggleSettingsMenu;
    window.closeSettingsMenu = closeSettingsMenu;
    window.backToSettingsMenu = backToSettingsMenu;
    window.showChangePassword = showChangePassword;
    window.showChangeNickname = showChangeNickname;
    window.validatePasswordStrength = validatePasswordStrength;
    window.validatePasswordMatch = validatePasswordMatch;
    window.validateNickname = validateNickname;
    window.setupFormValidation = setupFormValidation;
    window.showLoading = showLoading;
    window.handleChangePassword = handleChangePassword;
    window.handleChangeNickname = handleChangeNickname;
    window.confirmDeleteAccount = confirmDeleteAccount;
    window.deleteUserAccount = deleteUserAccount;
    window.initializeProfileSettings = initializeProfileSettings;
    window.showProfileMessage = showProfileMessage;
}

console.log('✅ profile-settings.js loaded with simplified logic');
