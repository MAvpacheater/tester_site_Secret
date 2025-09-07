// Enhanced Profile System with Persistent Authentication - profile.js
const ProfileSystem = {
    currentUser: null,
    authManager: null,

    // Initialize profile system
    init() {
        console.log('👤 Initializing Enhanced Profile System with persistence...');
        this.authManager = window.authManager;
        this.bindEvents();
        this.setupFormValidation();
        
        // Load user data immediately if available
        this.loadCurrentUserData();
    },

    // Enhanced user data loading with persistent auth support
    loadCurrentUserData() {
        console.log('🔄 Loading current user data...');

        // Priority 1: Check authenticated user via auth manager
        if (this.authManager && this.authManager.currentUser && this.authManager.userProfile) {
            console.log('✅ Found user via auth manager:', this.authManager.userProfile.nickname);
            this.handleUserAuthenticated({
                user: this.authManager.currentUser,
                profile: this.authManager.userProfile
            });
            return;
        }

        // Priority 2: Check persistent localStorage auth
        const savedUser = localStorage.getItem('armHelper_currentUser');
        const persistentAuth = localStorage.getItem('armHelper_persistentAuth');
        
        if (savedUser && persistentAuth === 'true') {
            try {
                const user = JSON.parse(savedUser);
                console.log('✅ Found persistent user in localStorage:', user.nickname);
                
                // Create user object that matches the expected structure
                const userObj = {
                    id: user.id || 'local-user',
                    email: user.email || `${user.nickname}@local.test`,
                    nickname: user.nickname
                };
                
                this.handleUserAuthenticated({
                    user: userObj,
                    profile: user
                });

                // Update auth manager if it exists but doesn't have user
                if (this.authManager && !this.authManager.currentUser) {
                    this.authManager.currentUser = userObj;
                    this.authManager.userProfile = user;
                }
                
                return;
            } catch (e) {
                console.warn('⚠️ Error parsing saved user data:', e);
                localStorage.removeItem('armHelper_currentUser');
                localStorage.removeItem('armHelper_persistentAuth');
            }
        }

        // Priority 3: No authentication found
        console.log('ℹ️ No user authentication found');
        this.setNicknameLoading();
    },

    // Set loading state for nickname
    setNicknameLoading() {
        const profileNickname = document.getElementById('profileNickname');
        if (profileNickname) {
            profileNickname.textContent = 'Not logged in';
            profileNickname.classList.add('loading');
        }
    },

    // Bind events
    bindEvents() {
        // Listen for user authentication events
        document.addEventListener('userAuthenticated', (event) => {
            console.log('👤 Profile System: Received userAuthenticated event');
            this.handleUserAuthenticated(event.detail);
        });

        document.addEventListener('userSignedOut', () => {
            console.log('👤 Profile System: Received userSignedOut event');
            this.handleUserSignedOut();
        });

        // Listen for auth manager ready event
        document.addEventListener('authManagerReady', () => {
            console.log('👤 Profile System: Auth manager ready, reloading data');
            setTimeout(() => {
                this.loadCurrentUserData();
            }, 100);
        });

        // Settings toggles
        this.setupSettingsToggles();
    },

    // Handle user authenticated with enhanced logging
    handleUserAuthenticated(detail) {
        console.log('👤 Profile System: Handling user authentication', detail);
        const { user, profile } = detail;
        this.currentUser = { user, profile };
        this.updateProfileDisplay();
    },

    // Handle user signed out
    handleUserSignedOut() {
        console.log('👤 Profile System: Handling user sign out');
        this.currentUser = null;
        this.setNicknameLoading();
    },

    // Enhanced profile display update
    updateProfileDisplay() {
        if (!this.currentUser) {
            console.log('⚠️ No current user for profile display');
            this.setNicknameLoading();
            return;
        }

        const { user, profile } = this.currentUser;
        
        // Determine the nickname to display (priority order)
        let nickname = 'User'; // fallback
        
        if (profile?.nickname) {
            nickname = profile.nickname;
        } else if (user?.nickname) {
            nickname = user.nickname;
        } else if (user?.email) {
            nickname = user.email.split('@')[0];
        }

        console.log('👤 Updating profile display for:', nickname);

        // Update profile info elements
        const profileNickname = document.getElementById('profileNickname');
        const profileAvatar = document.getElementById('profileAvatar');
        const currentNicknameInput = document.getElementById('currentNickname');

        if (profileNickname) {
            profileNickname.textContent = nickname;
            profileNickname.classList.remove('loading');
        }

        if (profileAvatar) {
            // Generate avatar with first letter of nickname and dynamic colors
            const firstLetter = nickname.charAt(0).toUpperCase();
            const colors = [
                '667eea', '764ba2', '667292', 'f093fb', 
                'f5576c', '4facfe', '43e97b', 'fa709a',
                'fee140', 'a8edea', 'fed6e3', 'ffecd2'
            ];
            const color = colors[nickname.length % colors.length];
            
            profileAvatar.src = `https://via.placeholder.com/100x100/${color}/ffffff?text=${firstLetter}`;
            profileAvatar.alt = `${nickname}'s avatar`;
        }

        if (currentNicknameInput) {
            currentNicknameInput.value = nickname;
        }

        // Update stats
        this.updateProfileStats();
    },

    // Enhanced profile stats update
    async updateProfileStats() {
        try {
            console.log('📊 Updating profile stats...');

            // Count saved calculations
            let calculationsCount = 0;
            const calculatorTypes = ['calculator', 'arm', 'grind'];
            
            for (const type of calculatorTypes) {
                const settings = await this.loadCalculatorSettings(type);
                if (settings && Object.keys(settings).length > 0) {
                    calculationsCount++;
                }
            }

            const calculationsEl = document.getElementById('calculationsCount');
            if (calculationsEl) {
                calculationsEl.textContent = calculationsCount;
            }

            // Update login count with persistence support
            const loginCountEl = document.getElementById('loginCount');
            if (loginCountEl) {
                let loginCount = parseInt(localStorage.getItem('armHelper_loginCount') || '1');
                
                // If we have persistent auth but no login count, set it to 1
                const persistentAuth = localStorage.getItem('armHelper_persistentAuth');
                if (persistentAuth === 'true' && !localStorage.getItem('armHelper_loginCount')) {
                    loginCount = 1;
                    localStorage.setItem('armHelper_loginCount', '1');
                }
                
                loginCountEl.textContent = loginCount;
            }

            // Update last login with better formatting
            const lastLoginEl = document.getElementById('lastLoginDate');
            if (lastLoginEl) {
                const lastLogin = localStorage.getItem('armHelper_lastLogin');
                if (lastLogin) {
                    const date = new Date(lastLogin);
                    const today = new Date();
                    
                    if (date.toDateString() === today.toDateString()) {
                        lastLoginEl.textContent = 'Today';
                    } else {
                        const diffTime = Math.abs(today - date);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        
                        if (diffDays === 1) {
                            lastLoginEl.textContent = 'Yesterday';
                        } else if (diffDays < 7) {
                            lastLoginEl.textContent = `${diffDays} days ago`;
                        } else if (diffDays < 30) {
                            lastLoginEl.textContent = `${Math.floor(diffDays / 7)} weeks ago`;
                        } else {
                            lastLoginEl.textContent = date.toLocaleDateString();
                        }
                    }
                } else {
                    // If no last login but we have persistent auth, assume today
                    const persistentAuth = localStorage.getItem('armHelper_persistentAuth');
                    if (persistentAuth === 'true') {
                        lastLoginEl.textContent = 'Today';
                        localStorage.setItem('armHelper_lastLogin', new Date().toISOString());
                    } else {
                        lastLoginEl.textContent = 'Unknown';
                    }
                }
            }

            console.log('✅ Profile stats updated');

        } catch (error) {
            console.error('❌ Error updating profile stats:', error);
        }
    },

    // Load calculator settings with enhanced error handling
    async loadCalculatorSettings(type) {
        try {
            if (this.authManager && typeof this.authManager.loadCalculatorSettings === 'function closeSettingsMenu() {
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
            // Use Supabase
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

// Enhanced profile navigation
function goBackFromProfile() {
    console.log('🔙 Going back from profile...');
    if (typeof switchPage === 'function') {
        switchPage('calculator');
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
            // Use Supabase
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

// Enhanced profile opening with auth checking
function openProfile() {
    console.log('👤 Opening profile page...');
    
    // Check multiple sources for authentication
    const hasAuthUser = window.authManager && window.authManager.currentUser;
    const hasLocalUser = localStorage.getItem('armHelper_currentUser');
    const hasPersistentAuth = localStorage.getItem('armHelper_persistentAuth') === 'true';
    
    if (!hasAuthUser && (!hasLocalUser || !hasPersistentAuth)) {
        console.log('⚠️ No authentication found, redirecting to login...');
        ProfileSystem.showMessage('Please login to view your profile', 'error');
        if (typeof switchPage === 'function') {
            switchPage('login');
        }
        return;
    }

    if (typeof switchPage === 'function') {
        switchPage('profile');
        
        // Small delay to ensure page is loaded, then update display
        setTimeout(() => {
            ProfileSystem.loadCurrentUserData();
            ProfileSystem.updateProfileDisplay();
        }, 100);
    }
}

// Enhanced login stats update with persistence
function updateLoginStats() {
    console.log('📊 Updating login stats...');
    
    // Increment login count
    const currentCount = parseInt(localStorage.getItem('armHelper_loginCount') || '0');
    const newCount = currentCount + 1;
    localStorage.setItem('armHelper_loginCount', newCount.toString());
    
    // Update last login time
    const now = new Date().toISOString();
    localStorage.setItem('armHelper_lastLogin', now);
    
    console.log('✅ Login stats updated:', { 
        count: newCount, 
        lastLogin: now 
    });
}

// Enhanced profile initialization
function initializeProfile() {
    console.log('👤 Initializing Enhanced Profile system with persistence...');
    
    const profilePage = document.getElementById('profilePage');
    if (!profilePage) {
        console.warn('⚠️ Profile page not found');
        return;
    }

    ProfileSystem.init();
    console.log('✅ Enhanced Profile system initialized with persistence support');
}

// Enhanced profile display refresh
function refreshProfileDisplay() {
    console.log('🔄 Refreshing profile display with persistent auth...');
    if (ProfileSystem) {
        ProfileSystem.loadCurrentUserData();
        ProfileSystem.updateProfileDisplay();
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
    window.ProfileSystem = ProfileSystem;
    window.initializeProfile = initializeProfile;
    window.refreshProfileDisplay = refreshProfileDisplay;
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
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof initializeProfile === 'function') {
            initializeProfile();
        }
    }, 100);
});

// Listen for page switches to refresh profile data
document.addEventListener('pageChanged', (event) => {
    if (event.detail?.page === 'profile') {
        setTimeout(() => {
            refreshProfileDisplay();
        }, 50);
    }
});') {
                return await this.authManager.loadCalculatorSettings(type);
            } else {
                const settings = localStorage.getItem(`armHelper_${type}_settings`);
                return settings ? JSON.parse(settings) : null;
            }
        } catch (error) {
            console.warn(`⚠️ Error loading ${type} settings:`, error);
            return null;
        }
    },

    // Enhanced form validation setup
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

    // Validation methods (unchanged)
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

    // Enhanced settings toggles
    setupSettingsToggles() {
        const autoSaveToggle = document.getElementById('autoSaveToggle');
        const historyToggle = document.getElementById('historyToggle');

        if (autoSaveToggle) {
            const autoSave = localStorage.getItem('armHelper_autoSave') !== 'false';
            autoSaveToggle.checked = autoSave;

            autoSaveToggle.addEventListener('change', (e) => {
                localStorage.setItem('armHelper_autoSave', e.target.checked);
                this.showMessage('Auto-save preference updated', 'success');
            });
        }

        if (historyToggle) {
            const showHistory = localStorage.getItem('armHelper_showHistory') !== 'false';
            historyToggle.checked = showHistory;

            historyToggle.addEventListener('change', (e) => {
                localStorage.setItem('armHelper_showHistory', e.target.checked);
                this.showMessage('History preference updated', 'success');
            });
        }
    },

    // Enhanced message display
    showMessage(text, type = 'success') {
        const messageEl = document.getElementById('profileMessage');
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.className = `profile-message ${type}`;
            messageEl.style.display = 'block';

            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 4000);
        }

        // Also log for debugging
        console.log(`📝 Profile message (${type}):`, text);
    },

    // Loading state management
    showLoading(button, show = true) {
        if (show) {
            button.classList.add('loading');
            button.disabled = true;
            button.style.opacity = '0.6';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            button.style.opacity = '1';
        }
    }
};

// Menu Management Functions (unchanged)
function toggleSettingsMenu() {
    const settingsMenu = document.getElementById('settingsMenu');
    if (settingsMenu) {
        settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
    }
}

function
