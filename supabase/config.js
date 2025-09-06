// supabase/config.js
// Fixed Supabase configuration - nickname only, no email/phone storage

// Supabase URL and Anon Key (replace with your actual values)
const SUPABASE_URL = 'https://aws-info-post-app.vercel.app/'; // replace with your URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmcGh2d3RsZmZ5bHZpd3hiZmNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNDUxNDksImV4cCI6MjA3MjcyMTE0OX0.9VF-YQK6JTvlfkfuj7X9fJHuANcXHBN_vNi2DAjdSI4'; // replace with your key

// Initialize Supabase client
let supabase;

// Function to initialize Supabase
function initializeSupabase() {
    try {
        // Load Supabase from CDN
        if (typeof window.supabase === 'undefined') {
            console.error('❌ Supabase library not loaded');
            return null;
        }

        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase initialized successfully');
        
        // Dispatch connection event
        document.dispatchEvent(new CustomEvent('supabaseConnected'));
        return supabase;
    } catch (error) {
        console.error('❌ Failed to initialize Supabase:', error);
        document.dispatchEvent(new CustomEvent('supabaseError', { detail: error.message }));
        return null;
    }
}

// Enhanced Supabase Authentication Manager - NICKNAME ONLY
class SupabaseAuthManager {
    constructor() {
        this.supabase = initializeSupabase();
        this.currentUser = null;
        this.userProfile = null;
        
        if (this.supabase) {
            this.initializeAuthListener();
            this.checkCurrentUser();
        }
    }

    // Initialize auth state listener
    initializeAuthListener() {
        this.supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('🔐 Auth state changed:', event);
            
            if (event === 'SIGNED_IN' && session) {
                await this.handleUserSignedIn(session.user);
            } else if (event === 'SIGNED_OUT') {
                this.handleUserSignedOut();
            }
        });
    }

    // Check current user on page load
    async checkCurrentUser() {
        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();
            
            if (error) {
                console.warn('Auth check error:', error.message);
                return;
            }

            if (user) {
                await this.handleUserSignedIn(user);
            }
        } catch (error) {
            console.error('Error checking current user:', error);
        }
    }

    // Handle user signed in
    async handleUserSignedIn(user) {
        this.currentUser = user;
        
        // Get user profile from our custom table
        await this.loadUserProfile();
        
        // Update UI
        this.updateUIForSignedInUser();
        
        // Dispatch event for other components
        document.dispatchEvent(new CustomEvent('userAuthenticated', {
            detail: { user: this.currentUser, profile: this.userProfile }
        }));
    }

    // Handle user signed out
    handleUserSignedOut() {
        this.currentUser = null;
        this.userProfile = null;
        
        // Update UI
        this.updateUIForSignedOutUser();
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('userSignedOut'));
    }

    // Load user profile from custom table
    async loadUserProfile() {
        if (!this.currentUser) return;

        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('*')
                .eq('auth_id', this.currentUser.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                console.error('Error loading user profile:', error);
                return;
            }

            this.userProfile = data;
        } catch (error) {
            console.error('Error in loadUserProfile:', error);
        }
    }

    // Register new user with nickname ONLY
    async registerUser(nickname, password) {
        try {
            // Check if nickname is already taken
            const { data: existingUser, error: checkError } = await this.supabase
                .from('users')
                .select('id')
                .eq('nickname', nickname)
                .single();

            if (existingUser) {
                throw new Error('Nickname is already taken');
            }

            // Create a temporary email for Supabase auth (required by Supabase)
            const tempEmail = `${nickname}@armhelper.temp`;
            
            // Register with Supabase Auth using temp email
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
                if (authError.message.includes('email')) {
                    throw new Error('Registration failed. Please try again.');
                }
                throw new Error(authError.message);
            }

            if (!authData.user) {
                throw new Error('Registration failed - no user data returned');
            }

            // Create user profile in our custom table (NICKNAME ONLY)
            await this.createUserProfile(authData.user, nickname);

            return {
                success: true,
                user: authData.user
            };

        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    // Login user with nickname
    async loginUser(nickname, password) {
        try {
            // Find user by nickname first
            const { data: userData, error: userError } = await this.supabase
                .from('users')
                .select('auth_id')
                .eq('nickname', nickname)
                .single();

            if (userError || !userData) {
                throw new Error('Invalid nickname or password');
            }

            // Use temp email format for login
            const tempEmail = `${nickname}@armhelper.temp`;

            // Sign in with temp email and password
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: tempEmail,
                password: password
            });

            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    throw new Error('Invalid nickname or password');
                }
                throw new Error(error.message);
            }

            return {
                success: true,
                user: data.user,
                session: data.session
            };

        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Create user profile in custom table (NICKNAME ONLY)
    async createUserProfile(user, nickname) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .insert([
                    {
                        auth_id: user.id,
                        nickname: nickname,
                        // NO EMAIL OR PHONE FIELDS
                        preferences: {
                            theme: 'default',
                            language: 'en',
                            notifications: true
                        }
                    }
                ])
                .select()
                .single();

            if (error) {
                console.error('Error creating user profile:', error);
                return null;
            }

            this.userProfile = data;
            return data;

        } catch (error) {
            console.error('Error in createUserProfile:', error);
            return null;
        }
    }

    // Update user profile (NICKNAME ONLY)
    async updateUserProfile(updates) {
        if (!this.currentUser || !this.userProfile) {
            throw new Error('User not authenticated');
        }

        try {
            // Only allow updating nickname and preferences, no email/phone
            const allowedUpdates = {};
            if (updates.nickname) allowedUpdates.nickname = updates.nickname;
            if (updates.preferences) allowedUpdates.preferences = updates.preferences;
            if (updates.settings) allowedUpdates.settings = updates.settings;

            const { data, error } = await this.supabase
                .from('users')
                .update(allowedUpdates)
                .eq('auth_id', this.currentUser.id)
                .select()
                .single();

            if (error) {
                throw new Error(error.message);
            }

            this.userProfile = data;
            return data;

        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }

    // Save calculator settings
    async saveCalculatorSettings(calculatorType, settings) {
        if (!this.currentUser || !this.userProfile) {
            console.warn('User not authenticated, cannot save settings');
            return;
        }

        try {
            // First, try to update existing record
            const { data: existing } = await this.supabase
                .from('user_calculations')
                .select('id')
                .eq('user_id', this.userProfile.id)
                .eq('calculator_type', calculatorType)
                .single();

            let result;
            if (existing) {
                // Update existing
                result = await this.supabase
                    .from('user_calculations')
                    .update({ settings: settings, updated_at: new Date().toISOString() })
                    .eq('id', existing.id);
            } else {
                // Insert new
                result = await this.supabase
                    .from('user_calculations')
                    .insert([{
                        user_id: this.userProfile.id,
                        calculator_type: calculatorType,
                        settings: settings
                    }]);
            }

            if (result.error) {
                console.error('Error saving calculator settings:', result.error);
                throw new Error('Failed to save settings');
            } else {
                console.log(`✅ ${calculatorType} settings saved successfully`);
            }

        } catch (error) {
            console.error('Error in saveCalculatorSettings:', error);
            throw error;
        }
    }

    // Load calculator settings
    async loadCalculatorSettings(calculatorType) {
        if (!this.currentUser || !this.userProfile) {
            return null;
        }

        try {
            const { data, error } = await this.supabase
                .from('user_calculations')
                .select('settings')
                .eq('user_id', this.userProfile.id)
                .eq('calculator_type', calculatorType)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error loading calculator settings:', error);
                return null;
            }

            return data?.settings || null;

        } catch (error) {
            console.error('Error in loadCalculatorSettings:', error);
            return null;
        }
    }

    // Sign out user
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) {
                console.error('Sign out error:', error);
                throw new Error('Failed to sign out');
            }
        } catch (error) {
            console.error('Error in signOut:', error);
            throw error;
        }
    }

    // Update UI for signed in user
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

        // Hide login page if visible
        const loginPage = document.getElementById('loginPage');
        if (loginPage && loginPage.classList.contains('active')) {
            if (typeof switchPage === 'function') {
                switchPage('calculator');
            }
        }
    }

    // Update UI for signed out user
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

// Global auth manager instance
let authManager;

// Initialize auth manager
function initializeSupabaseAuth() {
    if (!authManager) {
        authManager = new SupabaseAuthManager();
    }
    return authManager;
}

// Export for global use
if (typeof window !== 'undefined') {
    window.SupabaseAuthManager = SupabaseAuthManager;
    window.initializeSupabaseAuth = initializeSupabaseAuth;
    window.authManager = null; // Will be set by initializeSupabaseAuth
}
