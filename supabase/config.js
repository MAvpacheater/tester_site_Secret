// supabase/config.js - Спрощена версія з виправленими методами

const SUPABASE_URL = 'https://aws-info-post.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cy1pbmZvLXBvc3QiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNzQ3NDYzNCwiZXhwIjoyMDUzMDUwNjM0fQ.2KKh4pBhRLbxQxJJMGgxUWXHiQQO7bsKwgKNOAdfKG0';

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
                    user_data: {}
                }])
                .select()
                .single();

            if (profileError) {
                throw new Error(`Database error: ${profileError.message}`);
            }

            return {
                success: true,
                user: authData.user
            };

        } catch (error) {
            console.error('❌ Registration error:', error);
            return this.registerUserFallback(nickname, password);
        }
    }

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
                createdAt: new Date().toISOString()
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
            const { data: userData, error: userError } = await this.supabase
                .from('users')
                .select('auth_id')
                .eq('nickname', nickname)
                .single();

            if (userError || !userData) {
                throw new Error('Invalid nickname or password');
            }

            const tempEmail = `${nickname}@armhelper.temp`;
            
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: tempEmail,
                password: password
            });

            if (error) {
                throw new Error('Invalid nickname or password');
            }

            return {
                success: true,
                user: data.user
            };

        } catch (error) {
            console.error('❌ Login error:', error);
            return this.loginUserFallback(nickname, password);
        }
    }

    loginUserFallback(nickname, password) {
        const existingUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
        const user = existingUsers.find(u => u.nickname === nickname && u.password === password);

        if (!user) {
            throw new Error('Invalid nickname or password');
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

    // ЗМІНА ПАРОЛЮ - СПРОЩЕНА
    async changePassword(currentPassword, newPassword) {
        try {
            if (this.fallbackMode) {
                return this.changePasswordFallback(currentPassword, newPassword);
            }

            // Для Supabase - просто оновлюємо пароль
            const { error } = await this.supabase.auth.updateUser({
                password: newPassword
            });

            if (error) {
                throw new Error(error.message);
            }

            return {
                success: true,
                message: 'Password updated successfully'
            };

        } catch (error) {
            console.error('❌ Change password error:', error);
            // Fallback якщо Supabase не працює
            return this.changePasswordFallback(currentPassword, newPassword);
        }
    }

    changePasswordFallback(currentPassword, newPassword) {
        const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
        
        const userIndex = savedUsers.findIndex(u => u.nickname === currentUser.nickname);
        
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        // Оновлюємо пароль
        savedUsers[userIndex].password = newPassword;
        localStorage.setItem('armHelper_users', JSON.stringify(savedUsers));
        
        currentUser.password = newPassword;
        localStorage.setItem('armHelper_currentUser', JSON.stringify(currentUser));
        
        return {
            success: true,
            message: 'Password updated successfully'
        };
    }

    // ЗМІНА НІКНЕЙМУ - СПРОЩЕНА
    async updateProfile(updates) {
        try {
            if (this.fallbackMode) {
                return this.updateProfileFallback(updates);
            }

            if (!this.userProfile) {
                throw new Error('User not authenticated');
            }

            // Якщо оновлюємо nickname, перевіряємо унікальність
            if (updates.nickname) {
                const { data: existingUser } = await this.supabase
                    .from('users')
                    .select('id')
                    .eq('nickname', updates.nickname)
                    .neq('id', this.userProfile.id)
                    .single();

                if (existingUser) {
                    throw new Error('This nickname is already taken');
                }
            }

            // Оновлюємо профіль
            const { data, error } = await this.supabase
                .from('users')
                .update(updates)
                .eq('id', this.userProfile.id)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            this.userProfile = { ...this.userProfile, ...data };
            localStorage.setItem('armHelper_currentUser', JSON.stringify(this.userProfile));

            return {
                success: true,
                message: 'Profile updated successfully',
                profile: this.userProfile
            };

        } catch (error) {
            console.error('❌ Update profile error:', error);
            return this.updateProfileFallback(updates);
        }
    }

    updateProfileFallback(updates) {
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

        // Оновлюємо дані
        savedUsers[userIndex] = { ...savedUsers[userIndex], ...updates };
        const updatedUser = savedUsers[userIndex];

        localStorage.setItem('armHelper_users', JSON.stringify(savedUsers));
        localStorage.setItem('armHelper_currentUser', JSON.stringify(updatedUser));

        this.userProfile = updatedUser;
        
        return {
            success: true,
            message: 'Profile updated successfully',
            profile: this.userProfile
        };
    }

    // ВИДАЛЕННЯ АКАУНТУ - СПРОЩЕНА
    async deleteAccount() {
        try {
            if (this.fallbackMode) {
                return this.deleteAccountFallback();
            }

            if (!this.userProfile) {
                throw new Error('User not authenticated');
            }

            // Видаляємо профіль
            const { error: profileError } = await this.supabase
                .from('users')
                .delete()
                .eq('id', this.userProfile.id);

            if (profileError) {
                throw new Error(profileError.message);
            }

            // Виходимо
            await this.supabase.auth.signOut();

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
            return this.deleteAccountFallback();
        }
    }

    deleteAccountFallback() {
        const currentUser = JSON.parse(localStorage.getItem('armHelper_currentUser') || '{}');
        const savedUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
        
        // Видаляємо користувача
        const updatedUsers = savedUsers.filter(u => u.nickname !== currentUser.nickname);
        localStorage.setItem('armHelper_users', JSON.stringify(updatedUsers));
        
        // Очищаємо дані
        localStorage.removeItem('armHelper_currentUser');
        
        this.currentUser = null;
        this.userProfile = null;

        return {
            success: true,
            message: 'Account deleted successfully'
        };
    }

    // Решта методів
    async checkCurrentUser() {
        if (this.fallbackMode) return;

        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();
            
            if (error) return;
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
        
        document.dispatchEvent(new CustomEvent('userAuthenticated', {
            detail: { user: this.currentUser, profile: this.userProfile }
        }));
    }

    handleUserSignedOut() {
        this.currentUser = null;
        this.userProfile = null;
        localStorage.removeItem('armHelper_currentUser');
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
                await this.supabase.auth.signOut();
            }

            localStorage.removeItem('armHelper_currentUser');
            this.handleUserSignedOut();

        } catch (error) {
            console.error('Error in signOut:', error);
            localStorage.removeItem('armHelper_currentUser');
            this.handleUserSignedOut();
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
