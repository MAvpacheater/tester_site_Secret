// Enhanced Supabase Config with Persistent Authentication - ВИПРАВЛЕНА ВЕРСІЯ
const SUPABASE_URL = 'https://aws-info-post.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmcGh2d3RsZmZ5bHZpd3hiZmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNDUxNDksImV4cCI6MjA3MjcyMTE0OX0.9VF-YQK6JTvlfkfuj7X9fJHuANcXHBN_vNi2DAjdSI4';

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

        if (!SUPABASE_URL.includes('supabase.co')) {
            console.error('❌ Invalid Supabase URL format:', SUPABASE_URL);
            return null;
        }

        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: true, // Включаємо збереження сесії
                autoRefreshToken: true,
                detectSessionInUrl: false,
                storage: window.localStorage // Використовуємо localStorage для сесій
            }
        });
        
        console.log('✅ Supabase client created with persistent sessions');
        
        testSupabaseConnection();
        document.dispatchEvent(new CustomEvent('supabaseConnected'));
        return supabase;
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
        document.dispatchEvent(new CustomEvent('supabaseError', { detail: error.message }));
        return null;
    }
}

async function testSupabaseConnection() {
    try {
        console.log('🔄 Testing Supabase connection...');
        
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
        this.isInitialized = false;
        
        if (this.supabase) {
            this.initializeAuthListener();
            // Негайно перевіряємо збережену сесію
            this.restoreSession();
        } else {
            console.warn('🔄 Працюємо в fallback режимі');
            this.initializeFallbackMode();
        }
    }

    // КЛЮЧОВИЙ МЕТОД: Відновлення сесії при завантаженні
    async restoreSession() {
        if (!this.supabase) return;

        try {
            console.log('🔄 Restoring authentication session...');
            
            // Отримуємо поточну сесію
            const { data: { session }, error } = await this.supabase.auth.getSession();
            
            if (error) {
                console.error('❌ Error getting session:', error);
                this.checkFallbackAuth();
                return;
            }

            if (session && session.user) {
                console.log('✅ Session found, restoring user:', session.user.id);
                await this.handleUserSignedIn(session.user);
            } else {
                console.log('ℹ️ No active session found');
                this.checkFallbackAuth();
            }

        } catch (error) {
            console.error('❌ Error restoring session:', error);
            this.checkFallbackAuth();
        }

        this.isInitialized = true;
    }

    // Перевірка fallback аутентифікації
    checkFallbackAuth() {
        const savedUser = localStorage.getItem('armHelper_currentUser');
        const persistentAuth = localStorage.getItem('armHelper_persistentAuth');
        
        if (savedUser && persistentAuth === 'true') {
            try {
                const user = JSON.parse(savedUser);
                console.log('✅ Restoring user from localStorage:', user.nickname);
                
                this.currentUser = { 
                    id: user.id || 'local-user', 
                    email: user.email || `${user.nickname}@local.test` 
                };
                this.userProfile = user;
                
                // Відправляємо подію аутентифікації
                setTimeout(() => {
                    document.dispatchEvent(new CustomEvent('userAuthenticated', {
                        detail: { user: this.currentUser, profile: this.userProfile }
                    }));
                }, 100);
                
            } catch (e) {
                console.warn('⚠️ Invalid saved user data, clearing...');
                localStorage.removeItem('armHelper_currentUser');
                localStorage.removeItem('armHelper_persistentAuth');
            }
        }
    }

    initializeFallbackMode() {
        this.checkFallbackAuth();
        this.isInitialized = true;
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
            } else if (event === 'TOKEN_REFRESHED' && session) {
                console.log('🔄 Token refreshed for user:', session.user.id);
                // Оновлюємо користувача, але не відправляємо повторні події
                this.currentUser = session.user;
            }
        });
    }

    // РЕЄСТРАЦІЯ з збереженням стану
    async registerUser(nickname, password) {
        if (this.fallbackMode) {
            return this.registerUserFallback(nickname, password);
        }

        try {
            if (DEBUG_MODE) {
                console.log('🔄 Starting registration for:', nickname);
            }

            // Перевіряємо nickname
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

            // Створюємо користувача
            const tempEmail = `${nickname}@armhelper.temp`;
            
            const { data: authData, error: authError } = await this.supabase.auth.signUp({
                email: tempEmail,
                password: password,
                options: {
                    data: { nickname: nickname }
                }
            });

            if (authError) {
                console.error('❌ Supabase auth error:', authError);
                throw new Error(`Authentication error: ${authError.message}`);
            }

            if (!authData.user) {
                throw new Error('Registration failed - no user data returned');
            }

            // Створюємо профіль
            const profile = await this.createUserProfile(authData.user, nickname);
            
            if (!profile) {
                throw new Error('Database error saving new user');
            }

            // Зберігаємо стан для persistence
            this.setPersistentAuth(true);

            if (DEBUG_MODE) {
                console.log('✅ Registration completed successfully');
            }

            return {
                success: true,
                user: authData.user
            };

        } catch (error) {
            console.error('❌ Registration error:', error);
            
            if (error.message.includes('fetch') || 
                error.message.includes('network') || 
                error.message.includes('JSON')) {
                console.warn('🔄 Falling back to local storage due to connection error');
                return this.registerUserFallback(nickname, password);
            }
            
            throw error;
        }
    }

    // ЛОГІН з збереженням стану
    async loginUser(nickname, password) {
        if (this.fallbackMode) {
            return this.loginUserFallback(nickname, password);
        }

        try {
            if (DEBUG_MODE) {
                console.log('🔄 Starting login for:', nickname);
            }

            // Знаходимо користувача
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

            // Логінимось
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

            // Зберігаємо стан для persistence
            this.setPersistentAuth(true);

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
            
            if (error.message.includes('fetch') || 
                error.message.includes('network') || 
                error.message.includes('JSON')) {
                console.warn('🔄 Falling back to local storage due to connection error');
                return this.loginUserFallback(nickname, password);
            }
            
            throw error;
        }
    }

    // Fallback реєстрація з persistence
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
                email: `${nickname}@local.test`,
                user_data: {
                    used_codes: {},
                    calculator_settings: {}
                }
            };

            existingUsers.push(newUser);
            localStorage.setItem('armHelper_users', JSON.stringify(existingUsers));
            localStorage.setItem('armHelper_currentUser', JSON.stringify(newUser));
            
            // ВАЖЛИВО: Встановлюємо persistent auth
            this.setPersistentAuth(true);

            this.currentUser = { id: newUser.id, email: newUser.email };
            this.userProfile = newUser;

            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('userAuthenticated', {
                    detail: { user: this.currentUser, profile: this.userProfile }
                }));
            }, 100);

            if (DEBUG_MODE) {
                console.log('✅ Fallback registration successful with persistence');
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

    // Fallback логін з persistence
    loginUserFallback(nickname, password) {
        try {
            const existingUsers = JSON.parse(localStorage.getItem('armHelper_users') || '[]');
            const user = existingUsers.find(u => u.nickname === nickname && u.password === password);

            if (!user) {
                throw new Error('Invalid nickname or password');
            }

            // Додаємо потрібні поля якщо їх немає
            if (!user.email) {
                user.email = `${nickname}@local.test`;
            }

            if (!user.user_data) {
                user.user_data = {
                    used_codes: {},
                    calculator_settings: {}
                };
            }

            // Оновлюємо користувача в масиві
            const userIndex = existingUsers.findIndex(u => u.nickname === nickname);
            if (userIndex !== -1) {
                existingUsers[userIndex] = user;
                localStorage.setItem('armHelper_users', JSON.stringify(existingUsers));
            }

            this.currentUser = { id: user.id, email: user.email };
            this.userProfile = user;

            localStorage.setItem('armHelper_currentUser', JSON.stringify(user));
            
            // ВАЖЛИВО: Встановлюємо persistent auth
            this.setPersistentAuth(true);

            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('userAuthenticated', {
                    detail: { user: this.currentUser, profile: this.userProfile }
                }));
            }, 100);

            if (DEBUG_MODE) {
                console.log('✅ Fallback login successful with persistence');
            }

            return {
                success: true,
                user: this.currentUser
            };

        } catch (error) {
            console.error('❌ Fallback login error:', error);
            throw error;
        }
    }

    // Встановлення persistent authentication
    setPersistentAuth(enabled) {
        localStorage.setItem('armHelper_persistentAuth', enabled.toString());
        console.log(`🔐 Persistent authentication ${enabled ? 'enabled' : 'disabled'}`);
    }

    // Створення профілю (без змін)
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

            const { data, error } = await this.supabase
                .from('users')
                .insert([profileData])
                .select()
                .single();

            if (error) {
                console.error('❌ Error creating user profile:', error);
                throw new Error(`Database error saving new user: ${error.message}`);
            }

            this.userProfile = data;
            return data;

        } catch (error) {
            console.error('❌ Error in createUserProfile:', error);
            throw error;
        }
    }

    // Обробка входу користувача
    async handleUserSignedIn(user) {
        console.log('✅ User signed in:', user.id);
        this.currentUser = user;
        await this.loadUserProfile();
        this.updateUIForSignedInUser();
        
        // Зберігаємо в localStorage для fallback
        if (this.userProfile) {
            localStorage.setItem('armHelper_currentUser', JSON.stringify(this.userProfile));
        }
        
        document.dispatchEvent(new CustomEvent('userAuthenticated', {
            detail: { user: this.currentUser, profile: this.userProfile }
        }));
    }

    // Обробка виходу користувача
    handleUserSignedOut() {
        console.log('👋 User signed out');
        this.currentUser = null;
        this.userProfile = null;
        
        // Очищаємо збережені дані
        localStorage.removeItem('armHelper_currentUser');
        localStorage.removeItem('armHelper_persistentAuth');
        
        this.updateUIForSignedOutUser();
        document.dispatchEvent(new CustomEvent('userSignedOut'));
    }

    // Завантаження профілю користувача
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

    // Вихід з облікового запису
    async signOut() {
        try {
            if (!this.fallbackMode && this.supabase) {
                const { error } = await this.supabase.auth.signOut();
                if (error) {
                    console.error('Supabase sign out error:', error);
                }
            }

            // Очищаємо всі збережені дані
            localStorage.removeItem('armHelper_currentUser');
            localStorage.removeItem('armHelper_persistentAuth');
            
            this.handleUserSignedOut();

        } catch (error) {
            console.error('Error in signOut:', error);
            // Все одно очищаємо локальні дані
            localStorage.removeItem('armHelper_currentUser');
            localStorage.removeItem('armHelper_persistentAuth');
            this.handleUserSignedOut();
        }
    }

    // Оновлення UI для залогіненого користувача
    updateUIForSignedInUser() {
        const userInfo = document.getElementById('userInfo');
        const authButton = document.getElementById('authButton');
        const sidebarUserNickname = document.getElementById('sidebarUserNickname');

        if (userInfo && authButton) {
            userInfo.style.display = 'flex';
            authButton.textContent = 'Sign Out';
            authButton.classList.add('logout-btn');

            if (sidebarUserNickname && this.userProfile) {
                sidebarUserNickname.textContent = this.userProfile.nickname || 'User';
                sidebarUserNickname.classList.remove('loading');
            }
        }

        const loginPage = document.getElementById('loginPage');
        if (loginPage && loginPage.classList.contains('active')) {
            if (typeof switchPage === 'function') {
                switchPage('calculator');
            }
        }
    }

    // Оновлення UI для незалогіненого користувача
    updateUIForSignedOutUser() {
        const userInfo = document.getElementById('userInfo');
        const authButton = document.getElementById('authButton');
        const sidebarUserNickname = document.getElementById('sidebarUserNickname');

        if (userInfo && authButton) {
            userInfo.style.display = 'none';
            authButton.textContent = 'Login';
            authButton.classList.remove('logout-btn');
        }

        if (sidebarUserNickname) {
            sidebarUserNickname.textContent = 'Loading...';
            sidebarUserNickname.classList.add('loading');
        }
    }

    // Решта методів залишаються без змін...
    async saveUserData(dataType, data) {
        if (this.fallbackMode || !this.currentUser) {
            return this.saveUserDataFallback(dataType, data);
        }
        // ... (код без змін)
    }

    async loadUserData(dataType) {
        if (this.fallbackMode || !this.currentUser) {
            return this.loadUserDataFallback(dataType);
        }
        // ... (код без змін)
    }

    async saveCalculatorSettings(calculatorType, settings) {
        if (this.fallbackMode || !this.currentUser) {
            localStorage.setItem(`armHelper_${calculatorType}_settings`, JSON.stringify(settings));
            return;
        }
        // ... (код без змін)
    }

    async loadCalculatorSettings(calculatorType) {
        if (this.fallbackMode || !this.currentUser) {
            const settings = localStorage.getItem(`armHelper_${calculatorType}_settings`);
            return settings ? JSON.parse(settings) : null;
        }
        // ... (код без змін)
    }

    // Методи для user_data operations (скорочено для простоти)
    saveUserDataFallback(dataType, data) {
        // ... існуючий код
    }

    loadUserDataFallback(dataType) {
        // ... існуючий код
    }
}

let authManager;

function initializeSupabaseAuth() {
    if (!authManager) {
        authManager = new SupabaseAuthManager();
    }
    return authManager;
}

// Перевірка готовності системи
function waitForAuthManager(callback, maxWait = 5000) {
    const startTime = Date.now();
    
    function check() {
        if (authManager && authManager.isInitialized) {
            callback();
        } else if (Date.now() - startTime < maxWait) {
            setTimeout(check, 100);
        } else {
            console.warn('⚠️ AuthManager initialization timeout');
            callback(); // Виконуємо все одно
        }
    }
    
    check();
}

// Експорт для глобального використання
if (typeof window !== 'undefined') {
    window.SupabaseAuthManager = SupabaseAuthManager;
    window.initializeSupabaseAuth = initializeSupabaseAuth;
    window.waitForAuthManager = waitForAuthManager;
    window.authManager = null;
}
