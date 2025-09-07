// login/profile-settings.js - ПОВНІСТЮ ОНОВЛЕНА ВЕРСІЯ З РОБОЧОЮ ЗМІНОЮ ПАРОЛЯ
console.log('⚙️ Loading profile-settings.js...');

// УПРАВЛІННЯ МЕНЮ
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
    
    // Оновлюємо поточний nickname в полі
    const currentNicknameInput = document.getElementById('currentNickname');
    if (currentNicknameInput && window.authManager?.userProfile) {
        currentNicknameInput.value = window.authManager.userProfile.nickname || '';
    }
    
    if (settingsMenu) settingsMenu.style.display = 'none';
    if (changeNicknameForm) changeNicknameForm.style.display = 'block';
}

function showPreferences() {
    const settingsMenu = document.getElementById('settingsMenu');
    const preferencesForm = document.getElementById('preferencesForm');
    
    if (settingsMenu) settingsMenu.style.display = 'none';
    if (preferencesForm) preferencesForm.style.display = 'block';
}

// ВАЛІДАЦІЯ ФОРМ
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

// НАЛАШТУВАННЯ ВАЛІДАЦІЇ ФОРМ
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

// НАЛАШТУВАННЯ ПЕРЕМИКАЧІВ
function setupSettingsToggles() {
    const autoSaveToggle = document.getElementById('autoSaveToggle');
    const historyToggle = document.getElementById('historyToggle');

    if (autoSaveToggle) {
        const autoSave = localStorage.getItem('armHelper_autoSave') !== 'false';
        autoSaveToggle.checked = autoSave;

        autoSaveToggle.addEventListener('change', (e) => {
            localStorage.setItem('armHelper_autoSave', e.target.checked);
            showProfileMessage('Auto-save preference updated', 'success');
        });
    }

    if (historyToggle) {
        const showHistory = localStorage.getItem('armHelper_showHistory') !== 'false';
        historyToggle.checked = showHistory;

        historyToggle.addEventListener('change', (e) => {
            localStorage.setItem('armHelper_showHistory', e.target.checked);
            showProfileMessage('History preference updated', 'success');
        });
    }
}

// ПОКАЗ СТАНУ ЗАВАНТАЖЕННЯ НА КНОПЦІ
function showLoading(button, show = true) {
    if (!button) return;
    
    if (show) {
        button.classList.add('loading');
        button.disabled = true;
        button.setAttribute('data-original-text', button.textContent);
        button.textContent = 'Loading...';
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.textContent = originalText;
            button.removeAttribute('data-original-text');
        }
    }
}

// ПОКАЗ ПОВІДОМЛЕНЬ ПРОФІЛЮ
function showProfileMessage(message, type = 'info') {
    let messageElement = document.getElementById('profileMessage');
    
    if (!messageElement) {
        // Створюємо елемент повідомлення якщо його немає
        messageElement = document.createElement('div');
        messageElement.id = 'profileMessage';
        messageElement.className = 'profile-message';
        
        const profileContainer = document.querySelector('.profile-container');
        if (profileContainer) {
            profileContainer.appendChild(messageElement);
        } else {
            console.warn('Profile container not found, cannot show message');
            return;
        }
    }

    messageElement.textContent = message;
    messageElement.className = `profile-message ${type}`;
    messageElement.style.display = 'block';

    // Автоматично приховуємо через 5 секунд
    setTimeout(() => {
        if (messageElement) {
            messageElement.style.display = 'none';
        }
    }, 5000);
}

// ОБРОБКА ЗМІНИ ПАРОЛЯ - ВИПРАВЛЕНА ВЕРСІЯ
async function handleChangePassword(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    
    const currentPassword = document.getElementById('currentPassword')?.value;
    const newPassword = document.getElementById('newPassword')?.value;
    const confirmNewPassword = document.getElementById('confirmNewPassword')?.value;

    // Валідація
    if (!currentPassword || !newPassword || !confirmNewPassword) {
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

    if (currentPassword === newPassword) {
        showProfileMessage('New password must be different from current password', 'error');
        return;
    }

    try {
        showLoading(submitBtn, true);

        if (window.authManager) {
            // Викликаємо метод зміни пароля
            const result = await window.authManager.changePassword(currentPassword, newPassword);
            
            if (result.success) {
                showProfileMessage('Password updated successfully!', 'success');
                form.reset();
                
                // Очищаємо класи валідації
                document.querySelectorAll('.form-input').forEach(input => {
                    input.classList.remove('error', 'success');
                });
                
                setTimeout(() => closeSettingsMenu(), 2000);
            } else {
                throw new Error(result.message || 'Failed to update password');
            }
        } else {
            // Fallback для localStorage
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

            // Також оновлюємо поточного користувача
            currentUser.password = newPassword;
            currentUser.updatedAt = new Date().toISOString();

            localStorage.setItem('armHelper_users', JSON.stringify(savedUsers));
            localStorage.setItem('armHelper_currentUser', JSON.stringify(currentUser));
            
            showProfileMessage('Password updated successfully!', 'success');
            form.reset();
            
            // Очищаємо класи валідації
            document.querySelectorAll('.form-input').forEach(input => {
                input.classList.remove('error', 'success');
            });
            
            setTimeout(() => closeSettingsMenu(), 2000);
        }

    } catch (error) {
        console.error('Change password error:', error);
        showProfileMessage(error.message || 'Failed to update password', 'error');
    } finally {
        showLoading(submitBtn, false);
    }
}

// ОБРОБКА ЗМІНИ НІКНЕЙМУ
async function handleChangeNickname(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    
    const currentNickname = document.getElementById('currentNickname')?.value;
    const newNickname = document.getElementById('newNickname')?.value.trim();

    // Валідація
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

        if (window.authManager && typeof window.authManager.deleteAccount === 'function') {
            const result = await window.authManager.deleteAccount();
            
            if (result.success) {
                alert('Your account has been successfully deleted.');
                
                setTimeout(() => {
                    if (typeof switchPage === 'function') {
                        switchPage('login');
                    }
                }, 1000);
            } else {
                throw new Error(result.message || 'Failed to delete account');
            }
        } else {
            // Fallback для localStorage
            const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
            const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
            
            const updatedUsers = savedUsers.filter(u => u.nickname !== currentUser.nickname);
            localStorage.setItem('armHelper_users', JSON.stringify(updatedUsers));
            
            localStorage.removeItem('armHelper_currentUser');
            
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
        console.error('Delete account error:', error);
        showProfileMessage('Failed to delete account. Please try again.', 'error');
    }
}

// НАЛАШТУВАННЯ СЛУХАЧІВ КЛІКІВ ПОЗА МЕНЮ
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

    // Закриття меню при натисканні ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const settingsMenu = document.getElementById('settingsMenu');
            const statsView = document.getElementById('statsView');
            const settingsForms = document.querySelectorAll('.settings-form');
            
            if (settingsMenu && settingsMenu.style.display === 'block') {
                closeSettingsMenu();
            }
            
            if (statsView && statsView.style.display === 'block' && typeof closeStatsView === 'function') {
                closeStatsView();
            }
        }
    });
}

// УПРАВЛІННЯ СТАТИСТИКОЮ
function toggleStatsView() {
    const statsView = document.getElementById('statsView');
    if (statsView) {
        statsView.style.display = statsView.style.display === 'none' ? 'block' : 'none';
        
        // Оновлюємо статистику при показі
        if (statsView.style.display === 'block') {
            updateStatsView();
        }
    }
}

function closeStatsView() {
    const statsView = document.getElementById('statsView');
    if (statsView) {
        statsView.style.display = 'none';
    }
}

function updateStatsView() {
    try {
        // Рахуємо збережені розрахунки
        let calculationsCount = 0;
        const calculatorTypes = ['calculator', 'arm', 'grind'];
        
        for (const type of calculatorTypes) {
            const settings = localStorage.getItem(`armHelper_${type}_settings`);
            if (settings) calculationsCount++;
        }

        const calculationsEl = document.getElementById('calculationsCount');
        if (calculationsEl) {
            calculationsEl.textContent = calculationsCount;
        }

        // Оновлюємо кількість логінів
        const loginCountEl = document.getElementById('loginCount');
        if (loginCountEl) {
            const loginCount = parseInt(localStorage.getItem('armHelper_loginCount') || '1');
            loginCountEl.textContent = loginCount;
        }

        // Оновлюємо останній логін
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
        console.error('Error updating stats:', error);
    }
}

// ПОВЕРНЕННЯ З ПРОФІЛЮ
function goBackFromProfile() {
    if (typeof switchPage === 'function') {
        switchPage('calculator');
    }
}

// ОНОВЛЕННЯ СТАТИСТИК ЛОГІНУ
function updateLoginStats() {
    try {
        // Збільшуємо лічильник логінів
        const currentCount = parseInt(localStorage.getItem('armHelper_loginCount') || '0');
        localStorage.setItem('armHelper_loginCount', (currentCount + 1).toString());
        
        // Зберігаємо час останнього логіну
        localStorage.setItem('armHelper_lastLogin', new Date().toISOString());
        
        console.log('📊 Login stats updated');
    } catch (error) {
        console.error('Error updating login stats:', error);
    }
}

// ІНІЦІАЛІЗАЦІЯ НАЛАШТУВАНЬ ПРОФІЛЮ
function initializeProfileSettings() {
    console.log('🔧 Initializing profile settings...');
    
    setupFormValidation();
    setupSettingsToggles();
    setupOutsideClickListeners();
    
    // Оновлюємо статистику при завантаженні
    setTimeout(() => {
        updateStatsView();
    }, 100);
    
    console.log('✅ Profile settings initialized');
}

// ДОПОМІЖНІ ФУНКЦІЇ ДЛЯ РОБОТИ З ФОРМАМИ
function clearFormErrors() {
    document.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('error', 'success');
    });
}

function resetAllForms() {
    document.querySelectorAll('.settings-form form').forEach(form => {
        form.reset();
    });
    clearFormErrors();
}

// ЕКСПОРТ ФУНКЦІЙ ДЛЯ ГЛОБАЛЬНОГО ВИКОРИСТАННЯ
if (typeof window !== 'undefined') {
    // Основні функції управління меню
    window.toggleSettingsMenu = toggleSettingsMenu;
    window.closeSettingsMenu = closeSettingsMenu;
    window.backToSettingsMenu = backToSettingsMenu;
    window.showChangePassword = showChangePassword;
    window.showChangeNickname = showChangeNickname;
    window.showPreferences = showPreferences;
    
    // Функції валідації
    window.validatePasswordStrength = validatePasswordStrength;
    window.validatePasswordMatch = validatePasswordMatch;
    window.validateNickname = validateNickname;
    window.setupFormValidation = setupFormValidation;
    window.setupSettingsToggles = setupSettingsToggles;
    
    // Допоміжні функції
    window.showLoading = showLoading;
    window.showProfileMessage = showProfileMessage;
    
    // Обробники форм
    window.handleChangePassword = handleChangePassword;
    window.handleChangeNickname = handleChangeNickname;
    window.confirmDeleteAccount = confirmDeleteAccount;
    window.deleteUserAccount = deleteUserAccount;
    
    // Функції статистики
    window.toggleStatsView = toggleStatsView;
    window.closeStatsView = closeStatsView;
    window.updateStatsView = updateStatsView;
    window.goBackFromProfile = goBackFromProfile;
    window.updateLoginStats = updateLoginStats;
    
    // Ініціалізація
    window.initializeProfileSettings = initializeProfileSettings;
    window.clearFormErrors = clearFormErrors;
    window.resetAllForms = resetAllForms;
}

// Автоматична ініціалізація після завантаження DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProfileSettings);
} else {
    // Якщо DOM вже завантажений, ініціалізуємо відразу
    setTimeout(initializeProfileSettings, 100);
}

// Слухач для повторної ініціалізації при зміні сторінки
document.addEventListener('pageChanged', (event) => {
    if (event.detail && event.detail.page === 'profile') {
        setTimeout(initializeProfileSettings, 50);
    }
});

console.log('✅ profile-settings.js loaded successfully');Manager.updateProfile === 'function') {
            const result = await window.authManager.updateProfile({ nickname: newNickname });
            
            if (result.success) {
                showProfileMessage('Nickname updated successfully!', 'success');
                
                // Оновлюємо відображення профілю
                if (typeof updateProfileDisplay === 'function') {
                    updateProfileDisplay();
                } else if (typeof window.updateProfileDisplaySafe === 'function') {
                    window.updateProfileDisplaySafe();
                }
                
                // Оновлюємо sidebar
                if (typeof updateSidebarUserInfo === 'function') {
                    updateSidebarUserInfo(result.profile);
                } else if (typeof window.updateSidebarForAuthenticatedUser === 'function') {
                    window.updateSidebarForAuthenticatedUser(window.authManager.currentUser, result.profile);
                }
                
                form.reset();
                setTimeout(() => closeSettingsMenu(), 2000);
            } else {
                throw new Error(result.message || 'Failed to update nickname');
            }
        } else {
            // Fallback для localStorage
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
            
            showProfileMessage('Nickname updated successfully!', 'success');
            
            // Оновлюємо відображення профілю
            if (typeof updateProfileDisplay === 'function') {
                updateProfileDisplay();
            } else if (typeof window.updateProfileDisplaySafe === 'function') {
                window.updateProfileDisplaySafe();
            }
            
            // Оновлюємо sidebar
            if (typeof updateSidebarUserInfo === 'function') {
                updateSidebarUserInfo(currentUser);
            } else if (typeof window.updateSidebarForAuthenticatedUser === 'function') {
                window.updateSidebarForAuthenticatedUser(
                    { email: `${newNickname}@local.test` },
                    currentUser
                );
            }
            
            form.reset();
            setTimeout(() => closeSettingsMenu(), 2000);
        }

    } catch (error) {
        console.error('Change nickname error:', error);
        showProfileMessage(error.message || 'Failed to update nickname', 'error');
    } finally {
        showLoading(submitBtn, false);
    }
}

// ПІДТВЕРДЖЕННЯ ВИДАЛЕННЯ АКАУНТУ
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

// ВИДАЛЕННЯ АКАУНТУ КОРИСТУВАЧА
async function deleteUserAccount() {
    try {
        showProfileMessage('Deleting account...', 'info');

        if (window.authManager && typeof window.auth
