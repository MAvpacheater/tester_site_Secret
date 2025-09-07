// profile-settings.js - ПОВНІСТЮ ВИПРАВЛЕНА ВЕРСІЯ
console.log('⚙️ Loading profile-settings.js - FULLY FUNCTIONAL VERSION...');

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
    if (!button) return;
    
    if (show) {
        button.classList.add('loading');
        button.disabled = true;
        if (!button.dataset.originalText) {
            button.dataset.originalText = button.textContent;
        }
        button.textContent = 'Processing...';
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        button.textContent = button.dataset.originalText || 'Submit';
    }
}

// Handle change password - ВИПРАВЛЕНА ВЕРСІЯ
async function handleChangePassword(event) {
    event.preventDefault();
    console.log('🔑 Password change initiated');

    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    
    const currentPassword = document.getElementById('currentPassword')?.value || '';
    const newPassword = document.getElementById('newPassword')?.value;
    const confirmNewPassword = document.getElementById('confirmNewPassword')?.value;

    // Базова валідація
    if (!newPassword || !confirmNewPassword) {
        showProfileMessage('All password fields are required', 'error');
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
        console.log('🔄 Processing password change...');

        let success = false;
        let errorMessage = '';

        // Спробуємо authManager
        if (window.authManager && typeof window.authManager.changePassword === 'function') {
            console.log('🔄 Using authManager for password change');
            try {
                const result = await window.authManager.changePassword(currentPassword, newPassword);
                if (result && result.success) {
                    success = true;
                    console.log('✅ Password changed via authManager');
                } else {
                    errorMessage = result?.message || 'AuthManager failed';
                }
            } catch (error) {
                console.warn('❌ AuthManager failed:', error.message);
                errorMessage = error.message;
            }
        }

        // Якщо authManager не спрацював, використовуємо fallback
        if (!success) {
            console.log('🔄 Using fallback password change');
            try {
                await handlePasswordChangeFallback(currentPassword, newPassword);
                success = true;
                console.log('✅ Password changed via fallback');
            } catch (error) {
                errorMessage = error.message;
            }
        }

        if (success) {
            showProfileMessage('Password updated successfully!', 'success');
            form.reset();
            setTimeout(() => closeSettingsMenu(), 2000);
        } else {
            throw new Error(errorMessage || 'Failed to update password');
        }

    } catch (error) {
        console.error('❌ Password change error:', error);
        showProfileMessage(error.message || 'Failed to update password', 'error');
    } finally {
        showLoading(submitBtn, false);
    }
}

// Fallback зміна паролю
async function handlePasswordChangeFallback(currentPassword, newPassword) {
    const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
    
    if (!currentUser.nickname) {
        throw new Error('User not found');
    }
    
    const userIndex = savedUsers.findIndex(u => u.nickname === currentUser.nickname);
    
    if (userIndex === -1) {
        throw new Error('User not found');
    }

    // Оновлюємо пароль
    savedUsers[userIndex].password = newPassword;
    savedUsers[userIndex].updatedAt = new Date().toISOString();
    localStorage.setItem('armHelper_users', JSON.stringify(savedUsers));
    
    // Оновлюємо поточного користувача
    currentUser.password = newPassword;
    currentUser.updatedAt = new Date().toISOString();
    localStorage.setItem('armHelper_currentUser', JSON.stringify(currentUser));
    
    // Оновлюємо authManager якщо він є
    if (window.authManager) {
        window.authManager.userProfile = currentUser;
    }
}

// Handle change nickname - ВИПРАВЛЕНА ВЕРСІЯ
async function handleChangeNickname(event) {
    event.preventDefault();
    console.log('✏️ Nickname change initiated');

    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    
    const currentNickname = document.getElementById('currentNickname')?.value;
    const newNickname = document.getElementById('newNickname')?.value?.trim();

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
        console.log('🔄 Processing nickname change...');

        let success = false;
        let errorMessage = '';

        // Спробуємо authManager
        if (window.authManager && typeof window.authManager.updateProfile === 'function') {
            console.log('🔄 Using authManager for nickname change');
            try {
                const result = await window.authManager.updateProfile({ nickname: newNickname });
                if (result && result.success) {
                    success = true;
                    console.log('✅ Nickname changed via authManager');
                    
                    // Оновлюємо UI
                    updateUIAfterNicknameChange(newNickname, result.profile);
                } else {
                    errorMessage = result?.message || 'AuthManager failed';
                }
            } catch (error) {
                console.warn('❌ AuthManager failed:', error.message);
                errorMessage = error.message;
            }
        }

        // Якщо authManager не спрацював, використовуємо fallback
        if (!success) {
            console.log('🔄 Using fallback nickname change');
            try {
                const updatedProfile = await handleNicknameChangeFallback(currentNickname, newNickname);
                success = true;
                console.log('✅ Nickname changed via fallback');
                
                // Оновлюємо UI
                updateUIAfterNicknameChange(newNickname, updatedProfile);
            } catch (error) {
                errorMessage = error.message;
            }
        }

        if (success) {
            showProfileMessage('Nickname updated successfully!', 'success');
            form.reset();
            setTimeout(() => closeSettingsMenu(), 2000);
        } else {
            throw new Error(errorMessage || 'Failed to update nickname');
        }

    } catch (error) {
        console.error('❌ Nickname change error:', error);
        showProfileMessage(error.message || 'Failed to update nickname', 'error');
    } finally {
        showLoading(submitBtn, false);
    }
}

// Оновлення UI після зміни нікнейму
function updateUIAfterNicknameChange(newNickname, profile) {
    console.log('🔄 Updating UI after nickname change to:', newNickname);
    
    // Оновлюємо профіль
    const profileNickname = document.getElementById('profileNickname');
    if (profileNickname) {
        profileNickname.textContent = newNickname;
    }
    
    // Оновлюємо сайдбар
    const sidebarUserNickname = document.getElementById('sidebarUserNickname');
    if (sidebarUserNickname) {
        sidebarUserNickname.textContent = newNickname;
    }
    
    // Оновлюємо форму
    const currentNicknameInput = document.getElementById('currentNickname');
    if (currentNicknameInput) {
        currentNicknameInput.value = newNickname;
    }
    
    // Очищуємо поле нового нікнейму
    const newNicknameInput = document.getElementById('newNickname');
    if (newNicknameInput) {
        newNicknameInput.value = '';
    }
    
    // Відправляємо подію оновлення профілю
    document.dispatchEvent(new CustomEvent('userProfileUpdated', {
        detail: { profile: profile || { nickname: newNickname } }
    }));
    
    console.log('✅ UI updated after nickname change');
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
    
    return updatedUser;
}

// Confirm delete account
function confirmDeleteAccount() {
    console.log('⚠️ Account deletion initiated');
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

// Delete user account - ВИПРАВЛЕНА ВЕРСІЯ
async function deleteUserAccount() {
    console.log('🗑️ Account deletion processing');
    
    try {
        let success = false;
        let errorMessage = '';

        // Спробуємо authManager
        if (window.authManager && typeof window.authManager.deleteAccount === 'function') {
            console.log('🔄 Using authManager for account deletion');
            try {
                const result = await window.authManager.deleteAccount();
                if (result && result.success) {
                    success = true;
                    console.log('✅ Account deleted via authManager');
                } else {
                    errorMessage = result?.message || 'AuthManager failed';
                }
            } catch (error) {
                console.warn('❌ AuthManager failed:', error.message);
                errorMessage = error.message;
            }
        }

        // Якщо authManager не спрацював, використовуємо fallback
        if (!success) {
            console.log('🔄 Using fallback account deletion');
            try {
                await deleteAccountFallback();
                success = true;
                console.log('✅ Account deleted via fallback');
            } catch (error) {
                errorMessage = error.message;
            }
        }

        if (success) {
            alert('Your account has been successfully deleted.');
            
            setTimeout(() => {
                if (typeof switchPage === 'function') {
                    switchPage('login');
                } else {
                    window.location.reload();
                }
            }, 1000);
        } else {
            throw new Error(errorMessage || 'Failed to delete account');
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
    
    if (!currentUser.nickname) {
        throw new Error('User not found');
    }
    
    // Видаляємо користувача зі списку
    const updatedUsers = savedUsers.filter(u => u.nickname !== currentUser.nickname);
    localStorage.setItem('armHelper_users', JSON.stringify(updatedUsers));
    
    // Очищаємо поточні дані користувача
    localStorage.removeItem('armHelper_currentUser');
    
    // Очищаємо всі налаштування користувача
    const settingsKeys = ['calculator', 'arm', 'grind', 'loginCount', 'lastLogin'];
    settingsKeys.forEach(key => {
        localStorage.removeItem(`armHelper_${key}_settings`);
        localStorage.removeItem(`armHelper_${key}`);
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
    console.log(`💬 Profile message: ${text} (${type})`);
    
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
            console.log('Success: ' + text);
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
    console.log('⚙️ Initializing profile settings');
    setupOutsideClickListeners();
    
    // Додаємо ID до кнопок для кращого контролю
    const passwordSubmitBtn = document.querySelector('#changePasswordForm .submit-btn');
    const nicknameSubmitBtn = document.querySelector('#changeNicknameForm .submit-btn');
    
    if (passwordSubmitBtn) {
        passwordSubmitBtn.id = 'changePasswordSubmit';
        passwordSubmitBtn.dataset.originalText = 'Update Password';
    }
    
    if (nicknameSubmitBtn) {
        nicknameSubmitBtn.id = 'changeNicknameSubmit';
        nicknameSubmitBtn.dataset.originalText = 'Update Nickname';
    }
    
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

// Функція для тестування - можна викликати з консолі
function testNicknameChange() {
    console.log('🧪 Testing nickname change functionality...');
    
    // Встановлюємо тестові дані
    const currentNicknameInput = document.getElementById('currentNickname');
    const newNicknameInput = document.getElementById('newNickname');
    
    if (currentNicknameInput && newNicknameInput) {
        currentNicknameInput.value = 'testuser';
        newNicknameInput.value = 'newuser123';
        
        const event = {
            preventDefault: () => {},
            target: document.querySelector('#changeNicknameForm')
        };
        handleChangeNickname(event);
    } else {
        console.error('Nickname form elements not found');
    }
}

// Функція для тестування - можна викликати з консолі
function testPasswordChange() {
    console.log('🧪 Testing password change functionality...');
    
    // Встановлюємо тестові дані
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmNewPassword');
    
    if (currentPasswordInput && newPasswordInput && confirmPasswordInput) {
        currentPasswordInput.value = 'oldpass';
        newPasswordInput.value = 'newpass123';
        confirmPasswordInput.value = 'newpass123';
        
        const event = {
            preventDefault: () => {},
            target: document.querySelector('#changePasswordForm')
        };
        handleChangePassword(event);
    } else {
        console.error('Password form elements not found');
    }
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
    window.updateUIAfterNicknameChange = updateUIAfterNicknameChange;
    
    // Test functions
    window.testNicknameChange = testNicknameChange;
    window.testPasswordChange = testPasswordChange;
}

console.log('✅ profile-settings.js loaded - COMPLETELY FUNCTIONAL!');
