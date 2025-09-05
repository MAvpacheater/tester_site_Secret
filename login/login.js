// Login/Registration JavaScript

// Об'єкт для роботи з аутентифікацією
const AuthSystem = {
    currentUser: null,
    
    // Ініціалізація
    init() {
        this.checkExistingLogin();
        this.bindEvents();
    },
    
    // Прив'язка подій
    bindEvents() {
        // Автоматичне приховування повідомлень
        setTimeout(() => {
            const message = document.getElementById('authMessage');
            if (message && message.style.display === 'block') {
                message.style.display = 'none';
            }
        }, 5000);
        
        // Валідація форм в реальному часі
        this.setupFormValidation();
    },
    
    // Налаштування валідації форм
    setupFormValidation() {
        // Email валідація
        const emailInputs = document.querySelectorAll('#loginEmail, #registerEmail');
        emailInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateEmail(input));
        });
        
        // Телефон валідація
        const phoneInput = document.getElementById('registerPhone');
        if (phoneInput) {
            phoneInput.addEventListener('blur', () => this.validatePhone(phoneInput));
        }
        
        // Підтвердження пароля
        const confirmPassword = document.getElementById('confirmPassword');
        const registerPassword = document.getElementById('registerPassword');
        if (confirmPassword && registerPassword) {
            confirmPassword.addEventListener('input', () => {
                this.validatePasswordMatch(registerPassword, confirmPassword);
            });
        }
    },
    
    // Валідація email
    validateEmail(input) {
        const email = input.value;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (email && !emailRegex.test(email)) {
            input.classList.add('error');
            input.classList.remove('success');
            return false;
        } else if (email) {
            input.classList.add('success');
            input.classList.remove('error');
            return true;
        }
        
        input.classList.remove('error', 'success');
        return true;
    },
    
    // Валідація телефону
    validatePhone(input) {
        const phone = input.value;
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        
        if (phone && !phoneRegex.test(phone)) {
            input.classList.add('error');
            input.classList.remove('success');
            return false;
        } else if (phone) {
            input.classList.add('success');
            input.classList.remove('error');
            return true;
        }
        
        input.classList.remove('error', 'success');
        return true;
    },
    
    // Валідація підтвердження пароля
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
    
    // Перевірка існуючого входу
    checkExistingLogin() {
        const savedUser = localStorage.getItem('armHelper_currentUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.showUserProfile();
                // Автоматично перейти до калькулятора якщо користувач увійшов
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
    
    // Показ профілю користувача
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
    
    // Показ повідомлення
    showMessage(text, type = 'error') {
        const messageEl = document.getElementById('authMessage');
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.className = `auth-message ${type}`;
            messageEl.style.display = 'block';
            
            // Приховати через 5 секунд
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 5000);
        }
    },
    
    // Показ стану завантаження
    showLoading(button, show = true) {
        if (show) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    },
    
    // Симуляція реєстрації (тут має бути запит до сервера)
    async simulateRegister(userData) {
        // Імітація затримки сервера
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Базова валідація
        if (userData.password !== userData.confirmPassword) {
            throw new Error('Паролі не співпадають');
        }
        
        if (userData.password.length < 6) {
            throw new Error('Пароль повинен містити мінімум 6 символів');
        }
        
        if (userData.nickname.length < 3) {
            throw new Error('Нікнейм повинен містити мінімум 3 символи');
        }
        
        // Email валідація
        if (!this.validateEmail({value: userData.email})) {
            throw new Error('Невірний формат email адреси');
        }
        
        // Перевірка чи користувач вже існує (локально)
        const existingUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
        const emailExists = existingUsers.some(user => 
            user.email.toLowerCase() === userData.email.toLowerCase()
        );
        const phoneExists = existingUsers.some(user => user.phone === userData.phone);
        const nicknameExists = existingUsers.some(user => 
            user.nickname.toLowerCase() === userData.nickname.toLowerCase()
        );
        
        if (emailExists) throw new Error('Користувач з таким email вже існує');
        if (phoneExists) throw new Error('Користувач з таким номером телефону вже існує');
        if (nicknameExists) throw new Error('Користувач з таким нікнеймом вже існує');
        
        // "Реєстрація" користувача
        const newUser = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            email: userData.email.toLowerCase(),
            phone: userData.phone,
            nickname: userData.nickname,
            registrationDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            preferences: {
                theme: 'default',
                language: 'uk',
                notifications: true
            }
        };
        
        existingUsers.push(newUser);
        localStorage.setItem('armHelper_users', JSON.stringify(existingUsers));
        
        return newUser;
    },
    
    // Симуляція входу
    async simulateLogin(login, password) {
        // Імітація затримки сервера
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const existingUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
        const user = existingUsers.find(user => 
            user.email.toLowerCase() === login.toLowerCase() || user.phone === login
        );
        
        if (!user) {
            throw new Error('Користувача не знайдено');
        }
        
        // В реальному додатку тут була б перевірка хешу пароля
        // Для демо просто перевіряємо що пароль не порожній
        if (!password || password.length < 6) {
            throw new Error('Невірний пароль');
        }
        
        // Оновлюємо час останнього входу
        user.lastLogin = new Date().toISOString();
        const userIndex = existingUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            existingUsers[userIndex] = user;
            localStorage.setItem('armHelper_users', JSON.stringify(existingUsers));
        }
        
        return user;
    }
};

// Функції для роботи з формами
function switchToRegister() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm && registerForm) {
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        
        // Очищуємо повідомлення
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
        
        // Очищуємо повідомлення
        const message = document.getElementById('authMessage');
        if (message) {
            message.style.display = 'none';
        }
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('.auth-btn');
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Валідація
    if (!email || !password) {
        AuthSystem.showMessage('Всі поля обов\'язкові для заповнення', 'error');
        return;
    }
    
    try {
        AuthSystem.showLoading(submitBtn, true);
        const user = await AuthSystem.simulateLogin(email, password);
        
        AuthSystem.currentUser = user;
        localStorage.setItem('armHelper_currentUser', JSON.stringify(user));
        
        AuthSystem.showMessage('Успішний вхід!', 'success');
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
        email: document.getElementById('registerEmail').value.trim(),
        phone: document.getElementById('registerPhone').value.trim(),
        nickname: document.getElementById('registerNickname').value.trim(),
        password: document.getElementById('registerPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };
    
    // Перевірка заповнення полів
    if (!userData.email || !userData.phone || !userData.nickname || 
        !userData.password || !userData.confirmPassword) {
        AuthSystem.showMessage('Всі поля обов\'язкові для заповнення', 'error');
        return;
    }
    
    try {
        AuthSystem.showLoading(submitBtn, true);
        const user = await AuthSystem.simulateRegister(userData);
        
        AuthSystem.currentUser = user;
        localStorage.setItem('armHelper_currentUser', JSON.stringify(user));
        
        AuthSystem.showMessage('Успішна реєстрація!', 'success');
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
    if (confirm('Ви впевнені, що хочете вийти?')) {
        AuthSystem.currentUser = null;
        localStorage.removeItem('armHelper_currentUser');
        
        const userProfile = document.getElementById('userProfile');
        
        if (userProfile) userProfile.style.display = 'none';
        
        // Перехід на сторінку входу
        if (typeof switchPage === 'function') {
            switchPage('login');
        } else {
            // Fallback - показати сторінку входу
            const loginPage = document.getElementById('loginPage');
            if (loginPage) {
                loginPage.style.display = 'block';
            }
        }
        
        AuthSystem.showMessage('Ви успішно вийшли з системи', 'success');
    }
}

// Ініціалізація системи аутентифікації
function initializeAuth() {
    console.log('🔐 Ініціалізація системи аутентифікації...');
    
    // Перевіряємо чи існують необхідні елементи
    const loginPage = document.getElementById('loginPage');
    if (!loginPage) {
        console.warn('⚠️ Сторінка входу не знайдена');
        return;
    }
    
    AuthSystem.init();
    console.log('✅ Система аутентифікації ініціалізована');
}

// Експорт для глобального використання
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

// Автоматична ініціалізація при завантаженні DOM
document.addEventListener('DOMContentLoaded', () => {
    // Невелика затримка для завантаження всіх елементів
    setTimeout(() => {
        if (typeof initializeAuth === 'function') {
            initializeAuth();
        }
    }, 100);
});
