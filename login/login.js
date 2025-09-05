// Login/Registration JavaScript

// Authentication system object
const AuthSystem = {
    currentUser: null,
    registrationType: 'email', // 'email' or 'phone'
    
    // Initialize
    init() {
        this.checkExistingLogin();
        this.bindEvents();
    },
    
    // Bind events
    bindEvents() {
        // Auto-hide messages after 5 seconds
        setTimeout(() => {
            const message = document.getElementById('authMessage');
            if (message && message.style.display === 'block') {
                message.style.display = 'none';
            }
        }, 5000);
        
        // Setup form validation
        this.setupFormValidation();
    },
    
    // Setup form validation
    setupFormValidation() {
        // Email validation
        const emailInputs = document.querySelectorAll('#loginIdentifier, #registerEmailOrPhone');
        emailInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateEmailOrPhone(input));
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
    
    // Validate email or phone
    validateEmailOrPhone(input) {
        const value = input.value.trim();
        if (!value) {
            input.classList.remove('error', 'success');
            return true;
        }
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        
        if (emailRegex.test(value) || phoneRegex.test(value)) {
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
    
    // Check existing login
    checkExistingLogin() {
        const savedUser = localStorage.getItem('armHelper_currentUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.showUserProfile();
                // Automatically go to calculator if user is logged in
                setTimeout(() => {
                    if (typeof switchPage === 'function') {
                        switchPage('calculator');
                    }
                    // Dispatch login event for sidebar update
                    document.dispatchEvent(new CustomEvent('userLoggedIn', { 
                        detail: this.currentUser 
                    }));
                }, 500);
            } catch (e) {
                console.warn('Invalid saved user data');
                localStorage.removeItem('armHelper_currentUser');
            }
        }
    },
    
    // Show user profile
    showUserProfile() {
        const loginPage = document.getElementById('loginPage');
        const userProfile = document.getElementById('userProfile');
        const userNickname = document.getElementById('userNickname');
        
        if (loginPage) loginPage.style.display = 'none';
        if (userProfile && this.currentUser) {
            userProfile.style.display = 'block';
            if (userNickname) {
                userNickname.textContent = this.currentUser.nickname || 'User';
            }
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
                messageEl.style.display = 'none';
            }, 5000);
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
    },
    
    // Switch registration type
    switchRegistrationType(type) {
        this.registrationType = type;
        const emailBtn = document.querySelector('.reg-type-btn[data-type="email"]');
        const phoneBtn = document.querySelector('.reg-type-btn[data-type="phone"]');
        const input = document.getElementById('registerEmailOrPhone');
        const label = document.querySelector('label[for="registerEmailOrPhone"]');
        
        if (emailBtn) emailBtn.classList.toggle('active', type === 'email');
        if (phoneBtn) phoneBtn.classList.toggle('active', type === 'phone');
        
        if (input && label) {
            if (type === 'email') {
                input.type = 'email';
                input.placeholder = 'Enter your email';
                label.textContent = 'Email';
            } else {
                input.type = 'tel';
                input.placeholder = '+380501234567';
                label.textContent = 'Phone number';
            }
            input.value = '';
            input.classList.remove('error', 'success');
        }
    },
    
    // Simulate registration (should be server request)
    async simulateRegister(userData) {
        // Simulate server delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Basic validation
        if (userData.password !== userData.confirmPassword) {
            throw new Error('Passwords do not match');
        }
        
        if (userData.password.length < 6) {
            throw new Error('Password must contain at least 6 characters');
        }
        
        if (userData.nickname.length < 3) {
            throw new Error('Nickname must contain at least 3 characters');
        }
        
        // Email or phone validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        
        if (!emailRegex.test(userData.emailOrPhone) && !phoneRegex.test(userData.emailOrPhone)) {
            throw new Error('Invalid email or phone number format');
        }
        
        // Check if user already exists (locally)
        const existingUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
        const isEmail = emailRegex.test(userData.emailOrPhone);
        
        const userExists = existingUsers.some(user => {
            if (isEmail) {
                return user.email && user.email.toLowerCase() === userData.emailOrPhone.toLowerCase();
            } else {
                return user.phone === userData.emailOrPhone;
            }
        });
        
        const nicknameExists = existingUsers.some(user => 
            user.nickname.toLowerCase() === userData.nickname.toLowerCase()
        );
        
        if (userExists) {
            throw new Error(isEmail ? 
                'User with this email already exists' : 
                'User with this phone number already exists'
            );
        }
        if (nicknameExists) throw new Error('User with this nickname already exists');
        
        // "Register" user
        const newUser = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            email: isEmail ? userData.emailOrPhone.toLowerCase() : null,
            phone: !isEmail ? userData.emailOrPhone : null,
            nickname: userData.nickname,
            registrationDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            preferences: {
                theme: 'default',
                language: 'en',
                notifications: true
            }
        };
        
        existingUsers.push(newUser);
        localStorage.setItem('armHelper_users', JSON.stringify(existingUsers));
        
        return newUser;
    },
    
    // Simulate login
    async simulateLogin(identifier, password) {
        // Simulate server delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const existingUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
        const user = existingUsers.find(user => {
            const lowerIdentifier = identifier.toLowerCase();
            return (
                (user.email && user.email.toLowerCase() === lowerIdentifier) ||
                (user.phone === identifier) ||
                (user.nickname.toLowerCase() === lowerIdentifier)
            );
        });
        
        if (!user) {
            throw new Error('User not found');
        }
        
        // In real app, password hash verification would be here
        // For demo, just check that password is not empty and has minimum length
        if (!password || password.length < 6) {
            throw new Error('Invalid password');
        }
        
        // Update last login time
        user.lastLogin = new Date().toISOString();
        const userIndex = existingUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            existingUsers[userIndex] = user;
            localStorage.setItem('armHelper_users', JSON.stringify(existingUsers));
        }
        
        return user;
    }
};

// Form handling functions
function switchToRegister() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm && registerForm) {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        
        // Clear messages
        const message = document.getElementById('authMessage');
        if (message) {
            message.style.display = 'none';
        }
    }
}

function switchToLogin() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    if (registerForm && loginForm) {
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
        
        // Clear messages
        const message = document.getElementById('authMessage');
        if (message) {
            message.style.display = 'none';
        }
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('.auth-btn');
    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validation
    if (!identifier || !password) {
        AuthSystem.showMessage('All fields are required', 'error');
        return;
    }
    
    try {
        AuthSystem.showLoading(submitBtn, true);
        const user = await AuthSystem.simulateLogin(identifier, password);
        
        AuthSystem.currentUser = user;
        localStorage.setItem('armHelper_currentUser', JSON.stringify(user));
        
        AuthSystem.showMessage('Login successful!', 'success');
        
        // Dispatch login event for sidebar update
        document.dispatchEvent(new CustomEvent('userLoggedIn', { 
            detail: user 
        }));
        
        setTimeout(() => {
            AuthSystem.showUserProfile();
            if (typeof switchPage === 'function') {
                switchPage('calculator');
            }
        }, 1500);
    } catch (error) {
        AuthSystem.showMessage(error.message, 'error');
    } finally {
        AuthSystem.showLoading(submitBtn, false);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('.auth-btn');
    const userData = {
        emailOrPhone: document.getElementById('registerEmailOrPhone').value.trim(),
        nickname: document.getElementById('registerNickname').value.trim(),
        password: document.getElementById('registerPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };
    
    // Check required fields
    if (!userData.emailOrPhone || !userData.nickname || 
        !userData.password || !userData.confirmPassword) {
        AuthSystem.showMessage('All fields are required', 'error');
        return;
    }
    
    try {
        AuthSystem.showLoading(submitBtn, true);
        const user = await AuthSystem.simulateRegister(userData);
        
        AuthSystem.currentUser = user;
        localStorage.setItem('armHelper_currentUser', JSON.stringify(user));
        
        AuthSystem.showMessage('Registration successful!', 'success');
        
        // Dispatch login event for sidebar update
        document.dispatchEvent(new CustomEvent('userLoggedIn', { 
            detail: user 
        }));
        
        setTimeout(() => {
            AuthSystem.showUserProfile();
            if (typeof switchPage === 'function') {
                switchPage('calculator');
            }
        }, 1500);
    } catch (error) {
        AuthSystem.showMessage(error.message, 'error');
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

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        AuthSystem.currentUser = null;
        localStorage.removeItem('armHelper_currentUser');
        
        const userProfile = document.getElementById('userProfile');
        
        if (userProfile) userProfile.style.display = 'none';
        
        // Go to login page
        if (typeof switchPage === 'function') {
            switchPage('login');
        } else {
            // Fallback - show login page
            const loginPage = document.getElementById('loginPage');
            if (loginPage) {
                loginPage.style.display = 'block';
            }
        }
        
        AuthSystem.showMessage('You have successfully logged out', 'success');
    }
}

// Initialize authentication system
function initializeAuth() {
    console.log('🔐 Initializing authentication system...');
    
    // Check if required elements exist
    const loginPage = document.getElementById('loginPage');
    if (!loginPage) {
        console.warn('⚠️ Login page not found');
        return;
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
