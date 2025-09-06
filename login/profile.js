// Complete Enhanced Profile System - profile.js
const ProfileSystem = {
    currentUser: null,
    authManager: null,

    // Initialize profile system
    init() {
        console.log('👤 Initializing Enhanced Profile System...');
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
        console.log('✅ User authenticated in ProfileSystem:', user?.email || profile?.nickname);
    },

    // Handle user signed out
    handleUserSignedOut() {
        console.log('🔄 User signed out in ProfileSystem');
        this.currentUser = null;
    },

    // Enhanced update profile display
    updateProfileDisplay() {
        // Get current user from multiple sources
        let currentUser = this.currentUser;
        
        if (!currentUser) {
            // Try from auth manager
            if (window.authManager && window.authManager.currentUser) {
                currentUser = {
                    user: window.authManager.currentUser,
                    profile: window.authManager.userProfile || window.authManager.currentUser
                };
                this.currentUser = currentUser;
            } else {
                // Try from localStorage
                const savedUser = localStorage.getItem('armHelper_currentUser');
                if (savedUser) {
                    try {
                        const user = JSON.parse(savedUser);
                        currentUser = { user, profile: user };
                        this.currentUser = currentUser;
                    } catch (e) {
                        console.warn('Invalid saved user data');
                        return;
                    }
                }
            }
        }
        
        if (!currentUser) {
            console.warn('No user data available for profile display');
            return;
        }

        const { user, profile } = currentUser;
        
        // Get nickname from multiple sources with better fallback
        const nickname = profile?.nickname || 
                        user?.nickname || 
                        user?.user_metadata?.nickname ||
                        user?.user_metadata?.full_name ||
                        user?.email?.split('@')[0] || 
                        'User';

        console.log('🔄 Updating profile display for:', nickname);

        // Update profile info
        const profileNickname = document.getElementById('profileNickname');
        const profileAvatar = document.getElementById('profileAvatar');
        const profileJoinDate = document.getElementById('profileJoinDate');
        const currentNicknameInput = document.getElementById('currentNickname');

        if (profileNickname) {
            profileNickname.textContent = nickname;
        }

        if (profileAvatar) {
            // Generate avatar with first letter of nickname
            const firstLetter = nickname.charAt(0).toUpperCase();
            profileAvatar.src = `https://via.placeholder.com/100x100/667eea/ffffff?text=${firstLetter}`;
            profileAvatar.alt = `${nickname}'s avatar`;
        }

        if (currentNicknameInput) {
            currentNicknameInput.value = nickname;
        }

        if (profileJoinDate) {
            const joinDate = this.formatJoinDate(profile?.created_at || user?.created_at);
            profileJoinDate.textContent = joinDate;
        }

        // Update stats
        this.updateProfileStats();
        
        console.log('✅ Profile display updated successfully');
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

            // Update login count
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

    // Validate nickname
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

// Enhanced Profile Logout Function
function handleProfileLogout() {
    const isConfirmed = confirm('Are you sure you want to log out?');
    
    if (isConfirmed) {
        try {
            console.log('🔄 Logging out from profile...');
            
            // Use the auth manager if available
            if (window.authManager && typeof window.authManager.signOut === 'function') {
                window.authManager.signOut();
            } else if (typeof logout === 'function') {
                logout();
            } else {
                // Fallback logout for localStorage
                performFallbackLogout();
            }
            
            // Show logout message
            if (ProfileSystem && typeof ProfileSystem.showMessage === 'function') {
                ProfileSystem.showMessage('Successfully logged out!', 'success');
            }
            
            // Small delay before redirect to show message
            setTimeout(() => {
                if (typeof switchPage === 'function') {
                    switchPage('login');
                }
            }, 1500);
            
        } catch (error) {
            console.error('❌ Logout error:', error);
            
            // If main logout fails, try fallback
            performFallbackLogout();
            
            if (ProfileSystem && typeof ProfileSystem.showMessage === 'function') {
                ProfileSystem.showMessage('Logged out (with errors)', 'error');
            }
            
            setTimeout(() => {
                if (typeof switchPage === 'function') {
                    switchPage('login');
                }
            }, 1500);
        }
    }
}

// Fallback logout function
function performFallbackLogout() {
    try {
        console.log('🔄 Performing fallback logout...');
        
        // Clear user data
        localStorage.removeItem('armHelper_currentUser');
        localStorage.removeItem('armHelper_userSession');
        localStorage.removeItem('armHelper_authToken');
        
        // Clear profile system current user
        if (window.ProfileSystem) {
            window.ProfileSystem.currentUser = null;
        }
        
        // Update sidebar UI
        if (typeof updateSidebarForSignedOutUser === 'function') {
            updateSidebarForSignedOutUser();
        }
        
        // Dispatch sign out event
        document.dispatchEvent(new CustomEvent('userSignedOut'));
        
        console.log('✅ Fallback logout completed');
        
    } catch (error) {
        console.error('❌ Fallback logout error:', error);
    }
}

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
                document.querySelectorAll('.form-input').forEach(input => {
                    input.classList.remove('error', 'success');
                });
                setTimeout(() => closeSettingsMenu(), 2000);
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

// Enhanced Open Profile Function
function openProfile() {
    // Check if user is authenticated from multiple sources
    let isAuthenticated = false;
    let currentUser = null;
    
    if (window.ProfileSystem && window.ProfileSystem.currentUser) {
        isAuthenticated = true;
        currentUser = window.ProfileSystem.currentUser;
    } else if (window.authManager && window.authManager.currentUser) {
        isAuthenticated = true;
        currentUser = {
            user: window.authManager.currentUser,
            profile: window.authManager.userProfile || window.authManager.currentUser
        };
        if (window.ProfileSystem) {
            window.ProfileSystem.currentUser = currentUser;
        }
    } else if (localStorage.getItem('armHelper_currentUser')) {
        isAuthenticated = true;
        try {
            const savedUser = JSON.parse(localStorage.getItem('armHelper_currentUser'));
            currentUser = { user: savedUser, profile: savedUser };
            if (window.ProfileSystem) {
                window.ProfileSystem.currentUser = currentUser;
            }
        } catch (e) {
            console.warn('Invalid saved user data');
            localStorage.removeItem('armHelper_currentUser');
            isAuthenticated = false;
        }
    }
    
    if (!isAuthenticated) {
        if (window.ProfileSystem && typeof window.ProfileSystem.showMessage === 'function') {
            window.ProfileSystem.showMessage('Please login to view your profile', 'error');
        } else {
            alert('Please login to view your profile');
        }
        return;
    }

    const userIdentifier = currentUser?.user?.email || 
                          currentUser?.profile?.nickname || 
                          currentUser?.user?.nickname || 
                          'Unknown';
    console.log('🔄 Opening profile for user:', userIdentifier);

    if (typeof switchPage === 'function') {
        switchPage('profile');
        
        // Small delay to ensure page is loaded, then update display
        setTimeout(() => {
            if (window.ProfileSystem && typeof window.ProfileSystem.updateProfileDisplay === 'function') {
                window.ProfileSystem.updateProfileDisplay();
            }
        }, 150);
    }
}

// Update login stats
function updateLoginStats() {
    // Increment login count
    const currentCount = parseInt(localStorage.getItem('armHelper_loginCount') || '0');
    localStorage.setItem('armHelper_loginCount', (currentCount + 1).toString());
    
    // Update last login time
    localStorage.setItem('armHelper_lastLogin', new Date().toISOString());
    
    console.log('✅ Login stats updated:', { count: currentCount + 1 });
}

// Initialize profile system
function initializeProfile() {
    console.log('👤 Initializing Enhanced Profile system...');
    
    const profilePage = document.getElementById('profilePage');
    if (!profilePage) {
        console.warn('⚠️ Profile page not found');
        return;
    }

    ProfileSystem.init();
    
    // Check if user is already authenticated and update display
    setTimeout(() => {
        if (window.ProfileSystem && typeof window.ProfileSystem.updateProfileDisplay === 'function') {
            window.ProfileSystem.updateProfileDisplay();
        }
    }, 500);
    
    console.log('✅ Enhanced Profile system initialized');
}

// Close any open menus when clicking outside
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
            closeStatsView();
        }
    }
});

// Export functions for global use
if (typeof window !== 'undefined') {
    window.ProfileSystem = ProfileSystem;
    window.initializeProfile = initializeProfile;
    window.handleChangePassword = handleChangePassword;
    window.handleChangeNickname = handleChangeNickname;
    window.goBackFromProfile = goBackFromProfile;
    window.confirmDeleteAccount = confirmDeleteAccount;
    window.deleteUserAccount = deleteUserAccount;
    window.openProfile = openProfile;
    window.updateLoginStats = updateLoginStats;
    window.toggleSettingsMenu = toggleSettingsMenu;
    window.closeSettingsMenu = closeSettingsMenu;
    window.backToSettingsMenu = backToSettingsMenu;
    window.showChangePassword = showChangePassword;
    window.showChangeNickname = showChangeNickname;
    window.showPreferences = showPreferences;
    window.toggleStatsView = toggleStatsView;
    window.closeStatsView = closeStatsView;
    window.handleProfileLogout = handleProfileLogout;
    window.performFallbackLogout = performFallbackLogout;
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof initializeProfile === 'function') {
            initializeProfile();
        }
    }, 100);
});

// Listen for authentication events to update profile display
document.addEventListener('userAuthenticated', (event) => {
    console.log('🔄 User authenticated event received in profile system');
    setTimeout(() => {
        if (window.ProfileSystem && typeof window.ProfileSystem.updateProfileDisplay === 'function') {
            window.ProfileSystem.updateProfileDisplay();
        }
    }, 100);
}); (development mode)
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
            setTimeout(() => closeSettingsMenu(), 2000);
        }

    } catch (error) {
        console.error('Change password error:', error);
        ProfileSystem.showMessage(error.message || 'Failed to update password', 'error');
    } finally {
        ProfileSystem.showLoading(submitBtn, false);
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
            // Use Supabase
            const result = await ProfileSystem.authManager.updateProfile({ nickname: newNickname });
            
            if (result.success) {
                ProfileSystem.showMessage('Nickname updated successfully!', 'success');
                ProfileSystem.updateProfileDisplay();
                form.reset();
                setTimeout(() => closeSettingsMenu(), 2000);
            }
        } else {
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

            localStorage.setItem('armHelper_users', JSON.stringify(savedUsers));
            localStorage.setItem('armHelper_currentUser', JSON.stringify(currentUser));
            
            ProfileSystem.showMessage('Nickname updated successfully! (Development mode)', 'success');
            ProfileSystem.updateProfileDisplay();
            
            // Update sidebar
            if (typeof updateSidebarForAuthenticatedUser === 'function') {
                updateSidebarForAuthenticatedUser(currentUser, currentUser);
            }
            
            form.reset();
            setTimeout(() => closeSettingsMenu(), 2000);
        }

    } catch (error) {
        console.error('Change nickname error:', error);
        ProfileSystem.showMessage(error.message || 'Failed to update nickname', 'error');
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
