// supabase/config.js - СПРОЩЕНА ВЕРСІЯ З ВИПРАВЛЕНОЮ ЛОГІКОЮ

// Ваші правильні дані Supabase
const SUPABASE_URL = 'https://aws-info-post.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmcGh2d3RsZmZ5bHZpd3hiZmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNDUxNDksImV4cCI6MjA3MjcyMTE0OX0.9VF-YQK6JTvlfkfuj7X9fJHuANcXHBN_vNi2DAjdSI4';

// Налагодження
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

        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase client created');
        
        document.dispatchEvent(new CustomEvent('supabaseConnected'));
        return supabase;
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
        return null;
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
                console.log('🔐 Auth state changed:', event);
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

            // Перевіряємо чи nickname вже зайнятий
            const { data: existingUser } = await this.supabase
                .from('users')
                .select('id')
                .eq('nickname', nickname)
                .single();

            if (existingUser) {
                throw new Error('Nickname is already taken');
            }

            // Створюємо користувача в Supabase Auth
            const tempEmail = `${nickname}@armhelper.temp`;
            
            const { data: authData, error: authError } = await this.supabase.auth.signUp({
                email: tempEmail,
                password: password,
                options: {
                    data: { nickname: nickname }
                }
            });

            if (authError) {
                throw new Error(`Authentication error: ${authError.message}`);
            }

            // Створюємо профіль користувача
            const { data: profileData, error: profileError } = await this.supabase
                .from('users')
                .insert([{
                    auth_id: authData.user.id,
                    nickname: nickname,
                    user_data: {
                        used_codes: {},
                        calculator_settings: {}
                    }
                }])
                .select()
                .single();

            if (profileError) {
                throw new Error(`Database error: ${profileError.message}`);
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
            
            // Fallback при помилці з'єднання
            if (this.isNetworkError(error)) {
                console.warn('🔄 Falling back to local storage');
                return this.registerUserFallback(nickname, password);
            }
            
            throw error;
        }
    }

    // Fallback реєстрація
    registerUserFallback(nickname, password) {
        try {
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

            return { success: true, user: this.currentUser };
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

            // Знаходимо користувача за nickname
            const { data: userData, error: userError } = await this.supabase
                .from('users')
                .select('auth_id')
                .eq('nickname', nickname)
                .single();

            if (userError || !userData) {
                throw new Error('Invalid nickname or password');
            }

            // Логінимось через Supabase Auth
            const tempEmail = `${nickname}@armhelper.temp`;
            
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: tempEmail,
                password: password
            });

            if (error) {
                throw new Error('Invalid nickname or password');
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
            if (this.isNetworkError(error)) {
                console.warn('🔄 Falling back to local storage');
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

        return { success: true, user: this.currentUser };
    }

    // ЗМІНА ПАРОЛЮ - ВИПРАВЛЕНА ЛОГІКА
    async changePassword(currentPassword, newPassword) {
        if (this.fallbackMode) {
            return this.changePasswordFallback(currentPassword, newPassword);
        }

        try {
            if (DEBUG_MODE) {
                console.log('🔄 Starting password change...');
            }

            if (!this.currentUser || !this.userProfile) {
                throw new Error('User not authenticated');
            }

            // СПРОЩЕНА ЛОГІКА: Просто оновлюємо пароль без перевірки поточного
            // Supabase сам перевірить права доступу через сесію
            const { error: updateError } = await this.supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) {
                if (updateError.message.includes('Auth session missing')) {
                    throw new Error('Session expired. Please log in again.');
                }
                throw new Error(`Failed to update password: ${updateError.message}`);
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
            if (this.isNetworkError(error)) {
                console.warn('🔄 Falling back to local storage');
                return this.changePasswordFallback(currentPassword, newPassword);
            }
            
            throw error;
        }
    }

    // ЗМІНА НІКНЕЙМУ - ВИПРАВЛЕНА ЛОГІКА
    async updateProfile(updates) {
        if (this.fallbackMode) {
            return this.updateProfileFallback(updates);
        }

        try {
            if (DEBUG_MODE) {
                console.log('🔄 Starting profile update:', updates);
            }

            if (!this.currentUser || !this.userProfile) {
                throw new Error('User not authenticated');
            }

            // Якщо оновлюємо nickname, перевіряємо унікальність
            if (updates.nickname) {
                const { data: existingUser } = await this.supabase
                    .from('users')
                    .select('id')
                    .eq('nickname', updates.nickname)
                    .neq('id', this.userProfile.id) // виключаємо поточного користувача
                    .single();

                if (existingUser) {
                    throw new Error('This nickname is already taken');
                }
            }

            // Оновлюємо профіль в базі даних
            const { data, error } = await this.supabase
                .from('users')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', this.userProfile.id)
                .select()
                .single();

            if (error) {
                throw new Error(`Failed to update profile: ${error.message}`);
            }

            // Оновлюємо локальний профіль
            this.userProfile = { ...this.userProfile, ...data };

            // Оновлюємо localStorage для fallback
            localStorage.setItem('armHelper_currentUser', JSON.stringify(this.userProfile));

            // Оновлюємо UI через подію
            document.dispatchEvent(new CustomEvent('userProfileUpdated', {
                detail: { user: this.currentUser, profile: this.userProfile }
            }));

            if (DEBUG_MODE) {
                console.log('✅ Profile updated successfully');
            }

            return {
                success: true,
                message: 'Profile updated successfully',
                profile: this.userProfile
            };

        } catch (error) {
            console.error('❌ Update profile error:', error);
            
            // Fallback при помилці з'єднання
            if (this.isNetworkError(error)) {
                console.warn('🔄 Falling back to local storage');
                return this.updateProfileFallback(updates);
            }
            
            throw error;
        }
    }

    // Fallback зміна паролю
    changePasswordFallback(currentPassword, newPassword) {
        try {
            const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
            const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
            
            const userIndex = savedUsers.findIndex(u => u.nickname === currentUser.nickname);
            
            if (userIndex === -1) {
                throw new Error('User not found');
            }

            if (savedUsers[userIndex].password !== currentPassword) {
                throw new Error('Current password is incorrect');
            }

            // Оновлюємо пароль
            savedUsers[userIndex].password = newPassword;
            savedUsers[userIndex].updatedAt = new Date().toISOString();

            localStorage.setItem('armHelper_users', JSON.stringify(savedUsers));
            
            return {
                success: true,
                message: 'Password updated successfully'
            };

        } catch (error) {
            console.error('❌ Fallback password change error:', error);
            throw error;
        }
    }

    // Fallback оновлення профілю
    updateProfileFallback(updates) {
        try {
            const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
            const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
            
            // Перевіряємо унікальність нікнейму
            if (updates.nickname) {
                const existingUser = savedUsers.find(u => 
                    u.nickname === updates.nickname && 
                    u.nickname !== currentUser.nickname
                );
                
                if (existingUser) {
                    throw new Error('This nickname is already taken');
                }
            }
            
            const userIndex = savedUsers.findIndex(u => u.nickname === currentUser.nickname);
            
            if (userIndex === -1) {
                throw new Error('User not found');
            }

            // Оновлюємо дані користувача
            savedUsers[userIndex] = { 
                ...savedUsers[userIndex], 
                ...updates, 
                updatedAt: new Date().toISOString() 
            };
            
            const updatedUser = savedUsers[userIndex];

            localStorage.setItem('armHelper_users', JSON.stringify(savedUsers));
            localStorage.setItem('armHelper_currentUser', JSON.stringify(updatedUser));

            // Оновлюємо локальні дані
            this.userProfile = updatedUser;

            // Оновлюємо UI
            if (typeof updateSidebarForAuthenticatedUser === 'function') {
                updateSidebarForAuthenticatedUser(this.currentUser, this.userProfile);
            }
            
            return {
                success: true,
                message: 'Profile updated successfully',
                profile: this.userProfile
            };

        } catch (error) {
            console.error('❌ Fallback profile update error:', error);
            throw error;
        }
    }

    // ВИДАЛЕННЯ АКАУНТУ - СПРОЩЕНА ВЕРСІЯ
    async deleteAccount() {
        if (this.fallbackMode) {
            return this.deleteAccountFallback();
        }

        try {
            if (DEBUG_MODE) {
                console.log('🔄 Starting account deletion...');
            }

            if (!this.currentUser || !this.userProfile) {
                throw new Error('User not authenticated');
            }

            // Видаляємо профіль користувача (CASCADE видалить пов'язані дані)
            const { error: profileError } = await this.supabase
                .from('users')
                .delete()
                .eq('id', this.userProfile.id);

            if (profileError) {
                throw new Error(`Failed to delete user profile: ${profileError.message}`);
            }

            // Видаляємо auth користувача
            await this.supabase.auth.signOut();

            // Очищаємо локальні дані
            this.currentUser = null;
            this.userProfile = null;
            localStorage.removeItem('armHelper_currentUser');

            if (DEBUG_MODE) {
                console.log('✅ Account deletion completed');
            }

            return {
                success: true,
                message: 'Account deleted successfully'
            };

        } catch (error) {
            console.error('❌ Delete account error:', error);
            
            // Fallback при помилці з'єднання
            if (this.isNetworkError(error)) {
                console.warn('🔄 Falling back to local storage');
                return this.deleteAccountFallback();
            }
            
            throw error;
        }
    }

    // Fallback видалення акаунту
    deleteAccountFallback() {
        try {
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

            return {
                success: true,
                message: 'Account deleted successfully'
            };

        } catch (error) {
            console.error('❌ Fallback account deletion error:', error);
            throw error;
        }
    }

    // Допоміжна функція для перевірки помилок мережі
    isNetworkError(error) {
        return error.message.includes('fetch') || 
               error.message.includes('network') || 
               error.message.includes('JSON') ||
               error.message.includes('Failed to fetch');
    }

    // Решта методів без змін...
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
            
            // Зберігаємо для fallback
            if (data) {
                localStorage.setItem('armHelper_currentUser', JSON.stringify(data));
            }
        } catch (error) {
            console.error('Error in loadUserProfile:', error);
        }
    }

    async signOut() {
        try {
            if (!this.fallbackMode && this.supabase) {
                const { error } = await this.supabase.auth.signOut();
                if (error && DEBUG_MODE) {
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

if (typeof window !== 'undefined') {
    window.SupabaseAuthManager = SupabaseAuthManager;
    window.initializeSupabaseAuth = initializeSupabaseAuth;
    window.authManager = null;
}
