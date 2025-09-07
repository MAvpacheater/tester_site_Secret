// supabase/config.js - ВИПРАВЛЕНА ВЕРСІЯ З ПІДТРИМКОЮ КОРИСТУВАЦЬКИХ ДАНИХ

// Ваші правильні дані Supabase
const SUPABASE_URL = 'https://aws-info-post.supabase.co'; // Замініть на ваш URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmcGh2d3RsZmZ5bHZpd3hiZmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNDUxNDksImV4cCI6MjA3MjcyMTE0OX0.9VF-YQK6JTvlfkfuj7X9fJHuANcXHBN_vNi2DAjdSI4'; // Замініть на ваш ключ

// Налагодження - встановіть в true для детальних логів
const DEBUG_MODE = true;
const USE_SUPABASE = true;

let supabase;

function initializeSupabase() {
    if (!USE_SUPABASE) {
        console.warn('⚠️ Supabase відключено');
        return null;
    }

    try {
        if (typeof window.supabase === 'undefined') {
            console.error('❌ Supabase library not loaded');
            return null;
        }

        // Перевіряємо формат URL
        if (!SUPABASE_URL.includes('supabase.co')) {
            console.error('❌ Invalid Supabase URL format:', SUPABASE_URL);
            return null;
        }

        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase client created');
        
        // Тестуємо з'єднання
        testSupabaseConnection();
        
        document.dispatchEvent(new CustomEvent('supabaseConnected'));
        return supabase;
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
        document.dispatchEvent(new CustomEvent('supabaseError', { detail: error.message }));
        return null;
    }
}

// Тестування з'єднання з Supabase
async function testSupabaseConnection() {
    try {
        console.log('🔄 Testing Supabase connection...');
        
        // Простий запит для перевірки з'єднання
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .limit(1);
            
        if (error) {
            console.error('❌ Database connection test failed:', error);
            if (DEBUG_MODE) {
                console.error('Error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
            }
        } else {
            console.log('✅ Database connection test successful');
        }
    } catch (error) {
        console.error('❌ Connection test error:', error);
    }
}

class SupabaseAuthManager {
    constructor() {
        this.supabase = initializeSupabase();
        this.currentUser = null;
        this.userProfile = null;
        this.fallbackMode = !this.supabase;
        
        if (this.supabase) {
            this.initializeAuthListener();
            this.checkCurrentUser();
        } else {
            console.warn('🔄 Працюємо в fallback режимі');
            this.initializeFallbackMode();
        }
    }

    initializeFallbackMode() {
        const savedUser = localStorage.getItem('armHelper_currentUser');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                this.currentUser = { id: 'local-user', email: `${user.nickname}@local.test` };
                this.userProfile = user;
                
                setTimeout(() => {
                    document.dispatchEvent(new CustomEvent('userAuthenticated', {
                        detail: { user: this.currentUser, profile: this.userProfile }
                    }));
                }, 100);
            } catch (e) {
                localStorage.removeItem('armHelper_currentUser');
            }
        }
    }

    initializeAuthListener() {
        if (!this.supabase) return;
        
        this.supabase.auth.onAuthStateChange(async (event, session) => {
            if (DEBUG_MODE) {
                console.log('🔐 Auth state changed:', event, session?.user?.id);
            }
            
            if (event === 'SIGNED_IN' && session) {
                await this.handleUserSignedIn(session.user);
            } else if (event === 'SIGNED_OUT') {
                this.handleUserSignedOut();
            }
        });
    }

    // РЕЄСТРАЦІЯ
    async registerUser(nickname, password) {
        if (this.fallbackMode) {
            return this.registerUserFallback(nickname, password);
        }

        try {
            if (DEBUG_MODE) {
                console.log('🔄 Starting registration for:', nickname);
            }

            // Крок 1: Перевіряємо чи nickname вже зайнятий
            if (DEBUG_MODE) console.log('Step 1: Checking nickname availability...');
            
            const { data: existingUser, error: checkError } = await this.supabase
                .from('users')
                .select('id')
                .eq('nickname', nickname)
                .single();

            if (checkError && checkError.code !== 'PGRST116') {
                console.error('❌ Error checking nickname:', checkError);
                throw new Error(`Database error checking nickname: ${checkError.message}`);
            }

            if (existingUser) {
                throw new Error('Nickname is already taken');
            }

            if (DEBUG_MODE) console.log('✅ Nickname is available');

            // Крок 2: Створюємо користувача в Supabase Auth
            if (DEBUG_MODE) console.log('Step 2: Creating auth user...');
            
            const tempEmail = `${nickname}@armhelper.temp`;
            
            const { data: authData, error: authError } = await this.supabase.auth.signUp({
                email: tempEmail,
                password: password,
                options: {
                    data: {
                        nickname: nickname
                    }
                }
            });

            if (authError) {
                console.error('❌ Supabase auth error:', authError);
                throw new Error(`Authentication error: ${authError.message}`);
            }

            if (!authData.user) {
                throw new Error('Registration failed - no user data returned');
            }

            if (DEBUG_MODE) {
                console.log('✅ Auth user created:', authData.user.id);
            }

            // Крок 3: Створюємо профіль користувача
            if (DEBUG_MODE) console.log('Step 3: Creating user profile...');
            
            const profile = await this.createUserProfile(authData.user, nickname);
            
            if (!profile) {
                console.error('❌ Failed to create user profile, but auth user was created');
                throw new Error('Database error saving new user');
            }

            if (DEBUG_MODE) {
                console.log('✅ Registration completed successfully');
            }

            return {
                success: true,
                user: authData.user
            };

        } catch (error) {
            console.error('❌ Registration error:', error);
            
            if (DEBUG_MODE) {
                console.error('Registration error details:', {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                });
            }
            
            // Якщо це помилка з'єднання, падаємо на fallback
            if (error.message.includes('fetch') || 
                error.message.includes('network') || 
                error.message.includes('JSON')) {
                console.warn('🔄 Falling back to local storage due to connection error');
                return this.registerUserFallback(nickname, password);
            }
            
            throw error;
        }
    }

    // СТВОРЕННЯ ПРОФІЛЮ
    async createUserProfile(user, nickname) {
        if (this.fallbackMode || !this.supabase) {
            if (DEBUG_MODE) console.log('⚠️ Fallback mode - skipping profile creation');
            return null;
        }

        try {
            if (DEBUG_MODE) {
                console.log('🔄 Creating profile for user:', {
                    authId: user.id,
                    nickname: nickname
                });
            }

            const profileData = {
                auth_id: user.id,
                nickname: nickname,
                preferences: {
                    theme: 'default',
                    language: 'en',
                    notifications: true
                },
                user_data: {
                    used_codes: {},
                    calculator_settings: {}
                }
            };

            if (DEBUG_MODE) {
                console.log('Profile data to insert:', profileData);
            }

            const { data, error } = await this.supabase
                .from('users')
                .insert([profileData])
                .select()
                .single();

            if (error) {
                console.error('❌ Error creating user profile:', error);
                
                if (DEBUG_MODE) {
                    console.error('Profile creation error details:', {
                        message: error.message,
                        details: error.details,
                        hint: error.hint,
                        code: error.code
                    });
                }

                if (error.code === '42P01') {
                    throw new Error('Database table "users" does not exist. Please create the required tables.');
                }

                if (error.code === '42501') {
                    throw new Error('Database permission denied. Please check RLS policies.');
                }

                throw new Error(`Database error saving new user: ${error.message}`);
            }

            if (DEBUG_MODE) {
                console.log('✅ User profile created successfully:', data);
            }

            this.userProfile = data;
            return data;

        } catch (error) {
            console.error('❌ Error in createUserProfile:', error);
            
            if (DEBUG_MODE) {
                console.error('createUserProfile error details:', {
                    message: error.message,
                    stack: error.stack
                });
            }
            
            throw error;
        }
    }

    // Fallback реєстрація
    registerUserFallback(nickname, password) {
        try {
            if (DEBUG_MODE) {
                console.log('🔄 Using fallback registration for:', nickname);
            }

            const existingUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
            if (existingUsers.find(u => u.nickname === nickname)) {
                throw new Error('Nickname is already taken');
            }

            const newUser = {
                id: Date.now().toString(),
                nickname: nickname,
                password: password,
                createdAt: new Date().toISOString(),
                user_data: {
                    used_codes: {},
                    calculator_settings: {}
                }
            };

            existingUsers.push(newUser);
            localStorage.setItem('armHelper_users', JSON.stringify(existingUsers));
            localStorage.setItem('armHelper_currentUser', JSON.stringify(newUser));

            this.currentUser = { id: newUser.id, email: `${nickname}@local.test` };
            this.userProfile = newUser;

            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('userAuthenticated', {
                    detail: { user: this.currentUser, profile: this.userProfile }
                }));
            }, 100);

            if (DEBUG_MODE) {
                console.log('✅ Fallback registration successful');
            }

            return {
                success: true,
                user: this.currentUser
            };

        } catch (error) {
            console.error('❌ Fallback registration error:', error);
            throw error;
        }
    }

    // ЛОГІН
    async loginUser(nickname, password) {
        if (this.fallbackMode) {
            return this.loginUserFallback(nickname, password);
        }

        try {
            if (DEBUG_MODE) {
                console.log('🔄 Starting login for:', nickname);
            }

            // Крок 1: Знаходимо користувача за nickname
            const { data: userData, error: userError } = await this.supabase
                .from('users')
                .select('auth_id, id, nickname')
                .eq('nickname', nickname)
                .single();

            if (userError) {
                if (DEBUG_MODE) {
                    console.error('User lookup error:', userError);
                }
                
                if (userError.code === 'PGRST116') {
                    throw new Error('Invalid nickname or password');
                }
                
                throw new Error(`Database error: ${userError.message}`);
            }

            if (!userData) {
                throw new Error('Invalid nickname or password');
            }

            if (DEBUG_MODE) {
                console.log('✅ User found:', userData.id);
            }

            // Крок 2: Логінимось через Supabase Auth
            const tempEmail = `${nickname}@armhelper.temp`;
            
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: tempEmail,
                password: password
            });

            if (error) {
                if (DEBUG_MODE) {
                    console.error('Auth login error:', error);
                }
                
                if (error.message.includes('Invalid login credentials')) {
                    throw new Error('Invalid nickname or password');
                }
                throw new Error(`Authentication error: ${error.message}`);
            }

            if (DEBUG_MODE) {
                console.log('✅ Login successful');
            }

            return {
                success: true,
                user: data.user,
                session: data.session
            };

        } catch (error) {
            console.error('❌ Login error:', error);
            
            // Fallback при помилці з'єднання
            if (error.message.includes('fetch') || 
                error.message.includes('network') || 
                error.message.includes('JSON')) {
                console.warn('🔄 Falling back to local storage due to connection error');
                return this.loginUserFallback(nickname, password);
            }
            
            throw error;
        }
    }

    // Fallback логін
    loginUserFallback(nickname, password) {
        const existingUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
        const user = existingUsers.find(u => u.nickname === nickname && u.password === password);

        if (!user) {
            throw new Error('Invalid nickname or password');
        }

        // Додаємо user_data якщо його немає
        if (!user.user_data) {
            user.user_data = {
                used_codes: {},
                calculator_settings: {}
            };
        }

        this.currentUser = { id: user.id, email: `${nickname}@local.test` };
        this.userProfile = user;

        localStorage.setItem('armHelper_currentUser', JSON.stringify(user));

        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('userAuthenticated', {
                detail: { user: this.currentUser, profile: this.userProfile }
            }));
        }, 100);

        return {
            success: true,
            user: this.currentUser
        };
    }

    // НОВИЙ МЕТОД: Збереження користувацьких даних
    async saveUserData(dataType, data) {
        if (this.fallbackMode || !this.currentUser) {
            return this.saveUserDataFallback(dataType, data);
        }

        try {
            if (DEBUG_MODE) {
                console.log(`🔄 Saving user data - ${dataType}:`, Object.keys(data).length + ' items');
            }

            if (!this.userProfile?.id) {
                throw new Error('User profile not found');
            }

            // Оновлюємо user_data в базі даних
            const currentUserData = this.userProfile.user_data || {};
            currentUserData[dataType] = data;

            const { error } = await this.supabase
                .from('users')
                .update({ 
                    user_data: currentUserData,
                    updated_at: new Date().toISOString()
                })
                .eq('id', this.userProfile.id);

            if (error) {
                console.error('❌ Error saving user data:', error);
                throw new Error(`Failed to save ${dataType}: ${error.message}`);
            }

            // Оновлюємо локальний профіль
            this.userProfile.user_data = currentUserData;

            if (DEBUG_MODE) {
                console.log(`✅ User data saved - ${dataType}`);
            }

            return { success: true };

        } catch (error) {
            console.error(`❌ Error saving user data - ${dataType}:`, error);
            
            // Fallback при помилці з'єднання
            if (error.message.includes('fetch') || 
                error.message.includes('network') || 
                error.message.includes('JSON')) {
                console.warn('🔄 Falling back to local storage due to connection error');
                return this.saveUserDataFallback(dataType, data);
            }
            
            throw error;
        }
    }

    // НОВИЙ МЕТОД: Завантаження користувацьких даних
    async loadUserData(dataType) {
        if (this.fallbackMode || !this.currentUser) {
            return this.loadUserDataFallback(dataType);
        }

        try {
            if (DEBUG_MODE) {
                console.log(`🔄 Loading user data - ${dataType}`);
            }

            if (!this.userProfile?.id) {
                throw new Error('User profile not found');
            }

            const { data, error } = await this.supabase
                .from('users')
                .select('user_data')
                .eq('id', this.userProfile.id)
                .single();

            if (error) {
                console.error('❌ Error loading user data:', error);
                throw new Error(`Failed to load ${dataType}: ${error.message}`);
            }

            const userData = data?.user_data?.[dataType] || {};

            if (DEBUG_MODE) {
                console.log(`✅ User data loaded - ${dataType}:`, Object.keys(userData).length + ' items');
            }

            return userData;

        } catch (error) {
            console.error(`❌ Error loading user data - ${dataType}:`, error);
            
            // Fallback при помилці з'єднання
            if (error.message.includes('fetch') || 
                error.message.includes('network') || 
                error.message.includes('JSON')) {
                console.warn('🔄 Falling back to local storage due to connection error');
                return this.loadUserDataFallback(dataType);
            }
            
            return {};
        }
    }

    // Fallback збереження користувацьких даних
    saveUserDataFallback(dataType, data) {
        try {
            if (DEBUG_MODE) {
                console.log(`🔄 Using fallback to save user data - ${dataType}`);
            }

            // Оновлюємо поточного користувача
            const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
            if (!currentUser.user_data) {
                currentUser.user_data = {};
            }
            currentUser.user_data[dataType] = data;
            localStorage.setItem('armHelper_currentUser', JSON.stringify(currentUser));

            // Оновлюємо в списку всіх користувачів
            const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
            const userIndex = savedUsers.findIndex(u => u.nickname === currentUser.nickname);
            if (userIndex !== -1) {
                savedUsers[userIndex] = currentUser;
                localStorage.setItem('armHelper_users', JSON.stringify(savedUsers));
            }

            // Оновлюємо локальний профіль
            this.userProfile = currentUser;

            if (DEBUG_MODE) {
                console.log(`✅ Fallback user data saved - ${dataType}`);
            }

            return { success: true };

        } catch (error) {
            console.error(`❌ Fallback save error - ${dataType}:`, error);
            throw error;
        }
    }

    // Fallback завантаження користувацьких даних
    loadUserDataFallback(dataType) {
        try {
            if (DEBUG_MODE) {
                console.log(`🔄 Using fallback to load user data - ${dataType}`);
            }

            const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
            const userData = currentUser.user_data?.[dataType] || {};

            if (DEBUG_MODE) {
                console.log(`✅ Fallback user data loaded - ${dataType}:`, Object.keys(userData).length + ' items');
            }

            return userData;

        } catch (error) {
            console.error(`❌ Fallback load error - ${dataType}:`, error);
            return {};
        }
    }

// ЗМІНА ПАРОЛЮ - ВИПРАВЛЕНА ВЕРСІЯ
async changePassword(currentPassword, newPassword) {
    if (this.fallbackMode) {
        return this.changePasswordFallback(currentPassword, newPassword);
    }

    try {
        if (DEBUG_MODE) {
            console.log('🔄 Starting password change...');
        }

        if (!this.currentUser) {
            throw new Error('User not authenticated');
        }

        const nickname = this.userProfile?.nickname;
        if (!nickname) {
            throw new Error('User profile not found');
        }

        // Для Supabase Auth просто змінюємо пароль без перевірки поточного
        // оскільки користувач вже автентифікований
        const { error: updateError } = await this.supabase.auth.updateUser({
            password: newPassword
        });

        if (updateError) {
            if (DEBUG_MODE) {
                console.error('Password update error:', updateError);
            }
            
            // Якщо помилка пов'язана з автентифікацією, перевіряємо поточний пароль
            if (updateError.message.includes('authentication') || 
                updateError.message.includes('session')) {
                
                // Створюємо тимчасового клієнта для перевірки пароля
                const tempClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                const tempEmail = `${nickname}@armhelper.temp`;
                
                const { error: verifyError } = await tempClient.auth.signInWithPassword({
                    email: tempEmail,
                    password: currentPassword
                });

                if (verifyError) {
                    if (DEBUG_MODE) {
                        console.error('Current password verification failed:', verifyError);
                    }
                    throw new Error('Current password is incorrect');
                }

                // Якщо пароль правильний, повторюємо спробу зміни
                const { error: retryError } = await this.supabase.auth.updateUser({
                    password: newPassword
                });

                if (retryError) {
                    throw new Error(`Failed to update password: ${retryError.message}`);
                }
            } else {
                throw new Error(`Failed to update password: ${updateError.message}`);
            }
        }

        if (DEBUG_MODE) {
            console.log('✅ Password updated successfully');
        }

        return {
            success: true,
            message: 'Password updated successfully'
        };

    } catch (error) {
        console.error('❌ Change password error:', error);
        
        // Fallback при помилці з'єднання
        if (error.message.includes('fetch') || 
            error.message.includes('network') || 
            error.message.includes('JSON')) {
            console.warn('🔄 Falling back to local storage due to connection error');
            return this.changePasswordFallback(currentPassword, newPassword);
        }
        
        throw error;
    }
}

// ДОДАМО ТАКОЖ ОНОВЛЕНУ ФУНКЦІЮ ПЕРЕВІРКИ ПОТОЧНОГО ПАРОЛЯ
async verifyCurrentPassword(currentPassword) {
    if (this.fallbackMode) {
        const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
        
        const user = savedUsers.find(u => u.nickname === currentUser.nickname);
        return user && user.password === currentPassword;
    }

    try {
        const nickname = this.userProfile?.nickname;
        if (!nickname) {
            return false;
        }

        // Створюємо тимчасового клієнта для перевірки
        const tempClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const tempEmail = `${nickname}@armhelper.temp`;
        
        const { error } = await tempClient.auth.signInWithPassword({
            email: tempEmail,
            password: currentPassword
        });

        // Виходимо з тимчасової сесії
        await tempClient.auth.signOut();

        return !error;
    } catch (error) {
        console.error('Password verification error:', error);
        return false;
    }
}

// ОНОВЛЕНА ФУНКЦІЯ В profile-settings.js
// Замініть handleChangePassword в login/profile-settings.js

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

        if (window.authManager) {
            // Спочатку перевіряємо поточний пароль
            if (typeof window.authManager.verifyCurrentPassword === 'function') {
                const isCurrentPasswordValid = await window.authManager.verifyCurrentPassword(currentPassword);
                
                if (!isCurrentPasswordValid) {
                    throw new Error('Current password is incorrect');
                }
            }

            // Змінюємо пароль
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
            
            if (typeof showProfileMessage === 'function') {
                showProfileMessage('Password updated successfully!', 'success');
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

// ДОДАМО ФУНКЦІЮ showProfileMessage ЯКЩО ЇЇ НЕМАЄ
function showProfileMessage(message, type = 'info') {
    const messageElement = document.getElementById('profileMessage');
    if (!messageElement) {
        // Створюємо елемент повідомлення якщо його немає
        const newMessageElement = document.createElement('div');
        newMessageElement.id = 'profileMessage';
        newMessageElement.className = 'profile-message';
        
        const profileContainer = document.querySelector('.profile-container');
        if (profileContainer) {
            profileContainer.appendChild(newMessageElement);
        } else {
            return; // Не можемо показати повідомлення
        }
    }

    const messageEl = document.getElementById('profileMessage');
    messageEl.textContent = message;
    messageEl.className = `profile-message ${type}`;
    messageEl.style.display = 'block';

    // Автоматично приховуємо через 5 секунд
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

    // ВИДАЛЕННЯ АКАУНТУ
    async deleteAccount() {
        if (this.fallbackMode) {
            return this.deleteAccountFallback();
        }

        try {
            if (DEBUG_MODE) {
                console.log('🔄 Starting account deletion...');
            }

            if (!this.currentUser) {
                throw new Error('User not authenticated');
            }

            // Крок 1: Видаляємо профіль користувача з бази даних
            if (this.userProfile?.id) {
                const { error: profileError } = await this.supabase
                    .from('users')
                    .delete()
                    .eq('id', this.userProfile.id);

                if (profileError) {
                    console.error('❌ Error deleting user profile:', profileError);
                    throw new Error(`Failed to delete user profile: ${profileError.message}`);
                }

                if (DEBUG_MODE) {
                    console.log('✅ User profile deleted');
                }
            }

            // Крок 2: Видаляємо всі розрахунки користувача
            if (this.userProfile?.id) {
                const { error: calcError } = await this.supabase
                    .from('user_calculations')
                    .delete()
                    .eq('user_id', this.userProfile.id);

                if (calcError) {
                    console.warn('⚠️ Error deleting user calculations:', calcError);
                }

                if (DEBUG_MODE) {
                    console.log('✅ User calculations deleted');
                }
            }

            // Крок 3: Видаляємо auth користувача
            const { error: authError } = await this.supabase.auth.admin.deleteUser(
                this.currentUser.id
            );

            if (authError) {
                console.error('❌ Error deleting auth user:', authError);
                await this.supabase.auth.signOut();
            }

            if (DEBUG_MODE) {
                console.log('✅ Account deletion completed');
            }

            // Очищаємо локальні дані
            this.currentUser = null;
            this.userProfile = null;
            localStorage.removeItem('armHelper_currentUser');

            return {
                success: true,
                message: 'Account deleted successfully'
            };

        } catch (error) {
            console.error('❌ Delete account error:', error);
            
            // Fallback при помилці з'єднання
            if (error.message.includes('fetch') || 
                error.message.includes('network') || 
                error.message.includes('JSON')) {
                console.warn('🔄 Falling back to local storage due to connection error');
                return this.deleteAccountFallback();
            }
            
            throw error;
        }
    }

    // Fallback видалення акаунту
    deleteAccountFallback() {
        try {
            if (DEBUG_MODE) {
                console.log('🔄 Using fallback account deletion');
            }

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

            this.currentUser = null;
            this.userProfile = null;

            if (DEBUG_MODE) {
                console.log('✅ Fallback account deletion successful');
            }

            return {
                success: true,
                message: 'Account deleted successfully'
            };

        } catch (error) {
            console.error('❌ Fallback account deletion error:', error);
            throw error;
        }
    }

    // Решта методів...
    async checkCurrentUser() {
        if (this.fallbackMode) return;

        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();
            
            if (error) {
                if (DEBUG_MODE) console.warn('Auth check error:', error.message);
                return;
            }

            if (user) {
                await this.handleUserSignedIn(user);
            }
        } catch (error) {
            console.error('Error checking current user:', error);
        }
    }

    async handleUserSignedIn(user) {
        this.currentUser = user;
        await this.loadUserProfile();
        this.updateUIForSignedInUser();
        
        document.dispatchEvent(new CustomEvent('userAuthenticated', {
            detail: { user: this.currentUser, profile: this.userProfile }
        }));
    }

    handleUserSignedOut() {
        this.currentUser = null;
        this.userProfile = null;
        localStorage.removeItem('armHelper_currentUser');
        this.updateUIForSignedOutUser();
        document.dispatchEvent(new CustomEvent('userSignedOut'));
    }

    async loadUserProfile() {
        if (!this.currentUser || this.fallbackMode) return;

        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .eq('auth_id', this.currentUser.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error loading user profile:', error);
                return;
            }

            this.userProfile = data;
        } catch (error) {
            console.error('Error in loadUserProfile:', error);
        }
    }

    async saveCalculatorSettings(calculatorType, settings) {
        if (this.fallbackMode || !this.currentUser) {
            localStorage.setItem(`armHelper_${calculatorType}_settings`, JSON.stringify(settings));
            return;
        }

        try {
            const { data: existing } = await this.supabase
                .from('user_calculations')
                .select('id')
                .eq('user_id', this.userProfile.id)
                .eq('calculator_type', calculatorType)
                .single();

            let result;
            if (existing) {
                result = await this.supabase
                    .from('user_calculations')
                    .update({ settings: settings, updated_at: new Date().toISOString() })
                    .eq('id', existing.id);
            } else {
                result = await this.supabase
                    .from('user_calculations')
                    .insert([{
                        user_id: this.userProfile.id,
                        calculator_type: calculatorType,
                        settings: settings
                    }]);
            }

            if (result.error) {
                throw new Error('Failed to save settings');
            }

        } catch (error) {
            console.error('Error saving to database, falling back to localStorage:', error);
            localStorage.setItem(`armHelper_${calculatorType}_settings`, JSON.stringify(settings));
        }
    }

    async loadCalculatorSettings(calculatorType) {
        if (this.fallbackMode || !this.currentUser) {
            const settings = localStorage.getItem(`armHelper_${calculatorType}_settings`);
            return settings ? JSON.parse(settings) : null;
        }

        try {
            const { data, error } = await this.supabase
                .from('user_calculations')
                .select('settings')
                .eq('user_id', this.userProfile.id)
                .eq('calculator_type', calculatorType)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error loading from database:', error);
                const settings = localStorage.getItem(`armHelper_${calculatorType}_settings`);
                return settings ? JSON.parse(settings) : null;
            }

            return data?.settings || null;

        } catch (error) {
            console.error('Error loading from database:', error);
            const settings = localStorage.getItem(`armHelper_${calculatorType}_settings`);
            return settings ? JSON.parse(settings) : null;
        }
    }

    async signOut() {
        try {
            if (!this.fallbackMode && this.supabase) {
                const { error } = await this.supabase.auth.signOut();
                if (error) {
                    console.error('Supabase sign out error:', error);
                }
            }

            localStorage.removeItem('armHelper_currentUser');
            this.handleUserSignedOut();

        } catch (error) {
            console.error('Error in signOut:', error);
            localStorage.removeItem('armHelper_currentUser');
            this.handleUserSignedOut();
        }
    }

    updateUIForSignedInUser() {
        const userInfo = document.getElementById('userInfo');
        const authButton = document.getElementById('authButton');
        const sidebarUserNickname = document.getElementById('sidebarUserNickname');

        if (userInfo && authButton) {
            userInfo.style.display = 'block';
            authButton.textContent = 'Sign Out';
            authButton.classList.add('logout-btn');

            if (sidebarUserNickname && this.userProfile) {
                sidebarUserNickname.textContent = this.userProfile.nickname || 'User';
            }
        }

        const loginPage = document.getElementById('loginPage');
        if (loginPage && loginPage.classList.contains('active')) {
            if (typeof switchPage === 'function') {
                switchPage('calculator');
            }
        }
    }

    updateUIForSignedOutUser() {
        const userInfo = document.getElementById('userInfo');
        const authButton = document.getElementById('authButton');

        if (userInfo && authButton) {
            userInfo.style.display = 'none';
            authButton.textContent = 'Login';
            authButton.classList.remove('logout-btn');
        }
    }
}

let authManager;

function initializeSupabaseAuth() {
    if (!authManager) {
        authManager = new SupabaseAuthManager();
    }
    return authManager;
}

// Функція для діагностики таблиць
async function checkDatabaseTables() {
    if (!supabase) {
        console.log('❌ Supabase not initialized');
        return;
    }

    console.log('🔍 Checking database tables...');

    // Перевіряємо таблицю users
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .limit(1);
            
        if (error) {
            console.error('❌ Users table error:', error.message);
            if (error.code === '42P01') {
                console.log('💡 Create users table with this SQL:');
                console.log(`
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nickname VARCHAR(50) UNIQUE NOT NULL,
    preferences JSONB DEFAULT '{}',
    user_data JSONB DEFAULT '{"used_codes": {}, "calculator_settings": {}}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
                `);
            }
        } else {
            console.log('✅ Users table exists');
        }
    } catch (e) {
        console.error('❌ Error checking users table:', e.message);
    }

    // Перевіряємо таблицю user_calculations
    try {
        const { data, error } = await supabase
            .from('user_calculations')
            .select('id')
            .limit(1);
            
        if (error) {
            console.error('❌ User_calculations table error:', error.message);
            if (error.code === '42P01') {
                console.log('💡 Create user_calculations table with this SQL:');
                console.log(`
CREATE TABLE user_calculations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    calculator_type VARCHAR(50) NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
                `);
            }
        } else {
            console.log('✅ User_calculations table exists');
        }
    } catch (e) {
        console.error('❌ Error checking user_calculations table:', e.message);
    }
}

if (typeof window !== 'undefined') {
    window.SupabaseAuthManager = SupabaseAuthManager;
    window.initializeSupabaseAuth = initializeSupabaseAuth;
    window.checkDatabaseTables = checkDatabaseTables;
    window.authManager = null;
    
    // Автоматична діагностика через 2 секунди після завантаження
    setTimeout(() => {
        if (supabase && DEBUG_MODE) {
            checkDatabaseTables();
        }
    }, 2000);
}
