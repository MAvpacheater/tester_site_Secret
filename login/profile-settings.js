// profile-settings.js - Виправлена логіка налаштувань
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
    if (currentNicknameInput) {
        if (window.authManager && window.authManager.userProfile) {
            currentNicknameInput.value = window.authManager.userProfile.nickname || 'User';
        } else {
            // Fallback з localStorage
            const savedUser = localStorage.getItem('armHelper_currentUser');
            if (savedUser) {
                try {
                    const user = JSON.parse(savedUser);
                    currentNicknameInput.value = user.nickname || 'User';
                } catch (e) {
                    currentNicknameInput.value = 'User';
                }
            }
        }
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

// Handle change password - ПРАЦЮЮЧА ВЕРСІЯ
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

    try {
        showLoading(submitBtn, true);

        // Перевіряємо наявність authManager
        if (window.authManager && typeof window.authManager.changePassword === 'function') {
            console.log('🔄 Using authManager for password change');
            const result = await window.authManager.changePassword(currentPassword, newPassword);
            
            if (result.success) {
                showProfileMessage('Password updated successfully!', 'success');
                form.reset();
                setTimeout(() => closeSettingsMenu(), 2000);
            } else {
                throw new Error(result.message || 'Failed to update password');
            }
        } else {
            // Fallback до локального сховища
            console.log('🔄 Using fallback password change');
            await handlePasswordChangeFallback(currentPassword, newPassword);
            showProfileMessage('Password updated successfully!', 'success');
            form.reset();
            setTimeout(() => closeSettingsMenu(), 2000);
        }

    } catch (error) {
        console.error('❌ Change password error:', error);
        showProfileMessage(error.message || 'Failed to update password', 'error');
    } finally {
        showLoading(submitBtn, false);
    }
}

// Fallback зміна паролю
async function handlePasswordChangeFallback(currentPassword, newPassword) {
    const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
    
    const userIndex = savedUsers.findIndex(u => u.nickname === currentUser.nickname);
    
    if (userIndex === -1) {
        throw new Error('User not found');
    }

    // Перевіряємо поточний пароль (якщо вказаний)
    if (currentPassword && savedUsers[userIndex].password !== currentPassword) {
        throw new Error('Current password is incorrect');
    }

    // Оновлюємо пароль
    savedUsers[userIndex].password = newPassword;
    savedUsers[userIndex].updatedAt = new Date().toISOString();

    localStorage.setItem('armHelper_users', JSON.stringify(savedUsers));
    
    // Оновлюємо поточного користувача
    currentUser.password = newPassword;
    localStorage.setItem('armHelper_currentUser', JSON.stringify(currentUser));
}

// Handle change nickname - ПРАЦЮЮЧА ВЕРСІЯ
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

        // Перевіряємо наявність authManager
        if (window.authManager && typeof window.authManager.updateProfile === 'function') {
            console.log('🔄 Using authManager for nickname change');
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
            } else {
                throw new Error(result.message || 'Failed to update nickname');
            }
        } else {
            // Fallback до локального сховища
            console.log('🔄 Using fallback nickname change');
            await handleNicknameChangeFallback(currentNickname, newNickname);
            showProfileMessage('Nickname updated successfully!', 'success');
            
            // Оновлюємо UI
            if (typeof updateProfileDisplay === 'function') {
                updateProfileDisplay();
            }
            
            form.reset();
            setTimeout(() => closeSettingsMenu(), 2000);
        }

    } catch (error) {
        console.error('❌ Change nickname error:', error);
        showProfileMessage(error.message || 'Failed to update nickname', 'error');
    } finally {
        showLoading(submitBtn, false);
    }
}

// Fallback зміна нікнейму
async function handleNicknameChangeFallback(currentNickname, newNickname) {
    const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
    
    // Перевіряємо унікальність нікнейму
    const existingUser = savedUsers.find(u => 
        u.nickname === newNickname && 
        u.nickname !== currentNickname
    );
    
    if (existingUser) {
        throw new Error('This nickname is already taken');
    }
    
    const userIndex = savedUsers.findIndex(u => u.nickname === currentNickname);
    
    if (userIndex === -1) {
        throw new Error('User not found');
    }

    // Оновлюємо дані користувача
    savedUsers[userIndex] = { 
        ...savedUsers[userIndex], 
        nickname: newNickname,
        updatedAt: new Date().toISOString() 
    };
    
    const updatedUser = savedUsers[userIndex];

    localStorage.setItem('armHelper_users', JSON.stringify(savedUsers));
    localStorage.setItem('armHelper_currentUser', JSON.stringify(updatedUser));

    // Оновлюємо authManager якщо він є
    if (window.authManager) {
        window.authManager.userProfile = updatedUser;
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

// Delete user account - ПРАЦЮЮЧА ВЕРСІЯ
async function deleteUserAccount() {
    console.log('🗑️ Account deletion initiated');
    
    try {
        // Перевіряємо authManager
        if (window.authManager && typeof window.authManager.deleteAccount === 'function') {
            console.log('🔄 Using authManager for account deletion');
            const result = await window.authManager.deleteAccount();
            
            if (result && result.success) {
                alert('Your account has been successfully deleted.');
                console.log('✅ Account deleted successfully');
                
                setTimeout(() => {
                    if (typeof switchPage === 'function') {
                        switchPage('login');
                    } else {
                        window.location.reload();
                    }
                }, 1000);
            } else {
                throw new Error('Account deletion failed');
            }
        } else {
            // Fallback до локального сховища
            console.log('🔄 Using fallback account deletion');
            await deleteAccountFallback();
            alert('Your account has been successfully deleted.');
            
            setTimeout(() => {
                if (typeof switchPage === 'function') {
                    switchPage('login');
                } else {
                    window.location.reload();
                }
            }, 1000);
        }

    } catch (error) {
        console.error('❌ Delete account error:', error);
        showProfileMessage('Failed to delete account. Please try again.', 'error');
    }
}

// Fallback видалення акаунту
async function deleteAccountFallback() {
    const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
    const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
    
    // Видаляємо користувача зі списку
    const updatedUsers = savedUsers.filter(u => u.nickname !== currentUser.nickname);
    localStorage.setItem('armHelper_users', JSON.stringify(updatedUsers));
    
    // Очищаємо поточні дані користувача
    localStorage.removeItem('armHelper_currentUser');
    
    // Очищаємо всі налаштування користувача
    const settingsKeys = ['calculator', 'arm', 'grind'];
    settingsKeys.forEach(key => {
        localStorage.removeItem(`armHelper_${key}_settings`);
    });

    // Очищаємо authManager
    if (window.authManager) {
        window.authManager.currentUser = null;
        window.authManager.userProfile = null;
    }

    // Відправляємо подію про вихід
    document.dispatchEvent(new CustomEvent('userSignedOut'));
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
    window.showLoading = showLoading;
    window.handleChangePassword = handleChangePassword;
    window.handleChangeNickname = handleChangeNickname;
    window.confirmDeleteAccount = confirmDeleteAccount;
    window.deleteUserAccount = deleteUserAccount;
    window.initializeProfileSettings = initializeProfileSettings;
    window.showProfileMessage = showProfileMessage;
}

console.log('✅ profile-settings.js loaded - Fixed version');
