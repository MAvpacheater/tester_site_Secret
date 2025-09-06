// Updated login/login.js with nickname-based authentication

// Authentication system object - updated for nickname-based auth
const AuthSystem = {
    authManager: null,
    
    // Initialize
    init() {
        console.log('🔐 Initializing AuthSystem...');
        
        // Initialize Supabase auth manager
        if (typeof initializeSupabaseAuth === 'function') {
            this.authManager = initializeSupabaseAuth();
            window.authManager = this.authManager; // Make globally available
        } else {
            console.error('❌ Supabase auth not available, falling back to local storage');
            this.initializeFallback();
            return;
        }
        
        this.bindEvents();
        this.setupFormValidation();
    },
    
    // Fallback initialization for local development
    initializeFallback() {
        console.warn('⚠️ Using fallback authentication');
        this.checkExistingLoginFallback();
    },
    
    // Bind events
    bindEvents() {
        // Listen for authentication events
        document.addEventListener('userAuthenticated', (event) => {
            console.log('✅ User authenticated:', event.detail);
            this.handleUserAuthenticated(event.detail);
        });
        
        document.addEventListener('userSignedOut', () => {
            console.log('👋 User signed out');
            this.handleUserSignedOut();
        });
        
        // Auto-hide messages after 5 seconds
        setTimeout(() => {
            this.hideMessage();
        }, 5000);
    },
    
    // Handle user authenticated
    handleUserAuthenticated(detail) {
        const { user, profile } = detail;
        
        // Update UI
        this.showUserProfile(profile || { nickname: user.nickname || 'User' });
        
        // Switch to calculator page
        setTimeout(() => {
            if (typeof switchPage === 'function') {
                switchPage('calculator');
            }
        }, 500);
        
        // Show success message
        this.showMessage('Successfully logged in!', 'success');
    },
    
    // Handle user signed out
    handleUserSignedOut() {
        this.hideUserProfile();
    },
    
    // Setup form validation
    setupFormValidation() {
        // Nickname validation
        const nicknameInputs = document.querySelectorAll('#loginNickname, #registerNickname');
        nicknameInputs.forEach(input => {
            if (input) {
                input.addEventListener('blur', () => this.validateNickname(input));
            }
        });
        
        // Password confirmation
        const confirmPassword = document.getElementById('confirmPassword');
        const registerPassword = document.getElementById('registerPassword');
        if (confirmPassword && registerPassword) {
            confirmPassword.addEventListener('input', () => {
                this.validatePasswordMatch(registerPassword, confirmPassword);
            });
        }
    },
    
    // Validate nickname
    validateNickname(input) {
        const value = input.value.trim();
        if (!value) {
            input.classList.remove('error', 'success');
            return true;
        }
        
        // Nickname must be 3-20 characters, alphanumeric and underscores only
        const nicknameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        
        if (nicknameRegex.test(value)) {
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
        if (confirmInput.value && passwordInput.value !== confirmInput.value) {
            confirmInput.classList.add('error');
            confirmInput.classList.remove('success');
            return false;
        } else if (confirmInput.value) {
            confirmInput.classList.add('success');
            confirmInput.classList.remove('error');
            return true;
        }
        
        confirmInput.classList.remove('error', 'success');
        return true;
    },
    
    // Fallback: Check existing login from localStorage
    checkExistingLoginFallback() {
        const savedUser = localStorage.getItem('armHelper_currentUser');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                this.showUserProfile(user);
                
                setTimeout(() => {
                    if (typeof switchPage === 'function') {
                        switchPage('calculator');
                    }
                }, 500);
            } catch (e) {
                console.warn('Invalid saved user data');
                localStorage.removeItem('armHelper_currentUser');
            }
        }
    },
    
    // Show user profile
    showUserProfile(user) {
        const loginPage = document.getElementById('loginPage');
        const userProfile = document.getElementById('userProfile');
        const userNickname = document.getElementById('userNickname');
        
        if (loginPage) loginPage.style.display = 'none';
        if (userProfile && user) {
            userProfile.style.display = 'block';
            if (userNickname) {
                userNickname.textContent = user.nickname || 'User';
            }
        }
        
        // Update sidebar
        if (typeof updateSidebarUserInfo === 'function') {
            updateSidebarUserInfo(user);
        }
    },
    
    // Hide user profile
    hideUserProfile() {
        const userProfile = document.getElementById('userProfile');
        if (userProfile) {
            userProfile.style.display = 'none';
        }
        
        // Update sidebar
        if (typeof updateSidebarUserInfo === 'function') {
            updateSidebarUserInfo(null);
        }
    },
    
    // Show message
    showMessage(text, type = 'error') {
        const messageEl = document.getElementById('authMessage');
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.className = `auth-message ${type}`;
            messageEl.style.display = 'block';
            
            // Hide after 5 seconds
            setTimeout(() => {
                this.hideMessage();
            }, 5000);
        }
    },
    
    // Hide message
    hideMessage() {
        const messageEl = document.getElementById('authMessage');
        if (messageEl) {
            messageEl.style.display = 'none';
        }
    },
    
    // Show loading state
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

// Form handling functions
function switchToRegister() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm && registerForm) {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        AuthSystem.hideMessage();
    }
}

function switchToLogin() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    if (registerForm && loginForm) {
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
        AuthSystem.hideMessage();
    }
}

// Handle login with nickname
async function handleLogin(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('.auth-btn');
    const nickname = document.getElementById('loginNickname')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    
    // Validation
    if (!nickname || !password) {
        AuthSystem.showMessage('All fields are required', 'error');
        return;
    }
    
    if (!AuthSystem.validateNickname(document.getElementById('loginNickname'))) {
        AuthSystem.showMessage('Please enter a valid nickname (3-20 characters, letters, numbers, underscores only)', 'error');
        return;
    }
    
    try {
        AuthSystem.showLoading(submitBtn, true);
        
        if (AuthSystem.authManager) {
            // Use Supabase
            const result = await AuthSystem.authManager.loginUser(nickname, password);
            if (result.success) {
                AuthSystem.showMessage('Login successful!', 'success');
                // AuthManager will handle UI updates via events
            }
        } else {
            // Fallback to local storage (for development)
            console.warn('Using fallback authentication');
            AuthSystem.showMessage('Login successful! (Development mode)', 'success');
            const mockUser = { nickname: nickname };
            localStorage.setItem('armHelper_currentUser', JSON.stringify(mockUser));
            AuthSystem.showUserProfile(mockUser);
            
            setTimeout(() => {
                if (typeof switchPage === 'function') {
                    switchPage('calculator');
                }
            }, 1000);
        }
        
    } catch (error) {
        console.error('Login error:', error);
        AuthSystem.showMessage(error.message || 'Login failed', 'error');
    } finally {
        AuthSystem.showLoading(submitBtn, false);
    }
}

// Handle registration with nickname
async function handleRegister(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('.auth-btn');
    const nickname = document.getElementById('registerNickname')?.value.trim();
    const password = document.getElementById('registerPassword')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    
    // Validation
    if (!nickname || !password || !confirmPassword) {
        AuthSystem.showMessage('All fields are required', 'error');
        return;
    }
    
    if (!AuthSystem.validateNickname(document.getElementById('registerNickname'))) {
        AuthSystem.showMessage('Nickname must be 3-20 characters, letters, numbers, and underscores only', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        AuthSystem.showMessage('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        AuthSystem.showMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    try {
        AuthSystem.showLoading(submitBtn, true);
        
        if (AuthSystem.authManager) {
            // Use Supabase
            const result = await AuthSystem.authManager.registerUser(nickname, password);
            
            if (result.success) {
                AuthSystem.showMessage('Registration successful!', 'success');
                // AuthManager will handle UI updates via events
            }
        } else {
            // Fallback for development
            console.warn('Using fallback authentication');
            AuthSystem.showMessage('Registration successful! (Development mode)', 'success');
            const mockUser = { nickname: nickname };
            localStorage.setItem('armHelper_currentUser', JSON.stringify(mockUser));
            AuthSystem.showUserProfile(mockUser);
            
            setTimeout(() => {
                if (typeof switchPage === 'function') {
                    switchPage('calculator');
                }
            }, 1000);
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        AuthSystem.showMessage(error.message || 'Registration failed', 'error');
    } finally {
        AuthSystem.showLoading(submitBtn, false);
    }
}

function skipLogin() {
    const loginPage = document.getElementById('loginPage');
    if (loginPage) {
        loginPage.style.display = 'none';
    }
    
    if (typeof switchPage === 'function') {
        switchPage('calculator');
    }
}

// Handle logout
async function logout() {
    if (!confirm('Are you sure you want to logout?')) {
        return;
    }
    
    try {
        if (AuthSystem.authManager) {
            // Use Supabase
            await AuthSystem.authManager.signOut();
        } else {
            // Fallback
            localStorage.removeItem('armHelper_currentUser');
            AuthSystem.hideUserProfile();
        }
        
        AuthSystem.showMessage('Successfully logged out', 'success');
        
    } catch (error) {
        console.error('Logout error:', error);
        AuthSystem.showMessage('Logout failed', 'error');
    }
}

// Initialize authentication system
function initializeAuth() {
    console.log('🔐 Initializing authentication system...');
    
    // Check if required elements exist
    const loginPage = document.getElementById('loginPage');
    if (!loginPage) {
        console.warn('⚠️ Login page not found, auth system will work without login UI');
    }
    
    AuthSystem.init();
    console.log('✅ Authentication system initialized');
}

// Export for global use
if (typeof window !== 'undefined') {
    window.AuthSystem = AuthSystem;
    window.initializeAuth = initializeAuth;
    window.switchToRegister = switchToRegister;
    window.switchToLogin = switchToLogin;
    window.handleLogin = handleLogin;
    window.handleRegister = handleRegister;
    window.skipLogin = skipLogin;
    window.logout = logout;
}

// Auto-initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Small delay for all elements to load
    setTimeout(() => {
        if (typeof initializeAuth === 'function') {
            initializeAuth();
        }
    }, 100);
});
