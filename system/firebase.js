// ========== FIREBASE MANAGER (ОПТИМІЗОВАНИЙ) ==========

class FirebaseManager {
    constructor() {
        this.app = null;
        this.auth = null;
        this.db = null;
        this.currentUser = null;
        this.isInitialized = false;
        this.listeners = new Map();
        
        this.config = {
            apiKey: "AIzaSyCBorDocx60fpPb-0mYTlUQ1Ehkj-QISaY",
            authDomain: "arm-helper-test.firebaseapp.com",
            projectId: "arm-helper-test",
            storageBucket: "arm-helper-test.firebasestorage.app",
            messagingSenderId: "585262647515",
            appId: "1:585262647515:web:0c468ed8d79a6dc3eae4fe",
            measurementId: "G-EL5GR5CVVK"
        };
    }

    async initialize() {
        if (this.isInitialized) return true;

        try {
            if (typeof firebase === 'undefined') {
                throw new Error('Firebase SDK not loaded');
            }

            this.app = firebase.initializeApp(this.config);
            this.auth = firebase.auth();
            this.db = firebase.firestore();

            try {
                await this.db.enablePersistence({ synchronizeTabs: true });
                console.log('✅ Firestore persistence enabled');
            } catch (err) {
                if (err.code !== 'failed-precondition') {
                    console.warn('⚠️ Persistence:', err.code);
                }
            }

            this.setupAuthListener();
            this.isInitialized = true;
            console.log('✅ Firebase initialized');

            return true;
        } catch (error) {
            console.error('❌ Firebase init failed:', error);
            return false;
        }
    }

    setupAuthListener() {
        this.auth.onAuthStateChanged(async (user) => {
            if (user) {
                const profile = await this.getUserProfile(user.uid);
                
                const hasGoogle = user.providerData.some(p => p.providerId === 'google.com');
                const hasPassword = user.providerData.some(p => p.providerId === 'password');
                
                let provider = 'username';
                if (profile?.provider) {
                    provider = profile.provider;
                } else if (hasGoogle && !user.email?.endsWith('@armhelper.local')) {
                    provider = 'google';
                }
                
                this.currentUser = {
                    uid: user.uid,
                    email: user.email,
                    displayName: profile?.username || user.displayName || 'User',
                    username: profile?.username || null,
                    photoURL: user.photoURL,
                    provider: provider,
                    hasPassword: hasPassword,
                    hasGoogleLinked: hasGoogle,
                    createdAt: user.metadata.creationTime
                };

                this.updateAuthUI(true);
                this.notifyListeners('authChanged', this.currentUser);
            } else {
                this.currentUser = null;
                this.updateAuthUI(false);
                this.notifyListeners('authChanged', null);
            }
        });
    }

    // ========== USERNAME AUTHENTICATION ==========

    async signUpWithUsername(username, password) {
        try {
            const usernameExists = await this.checkUsernameExists(username);
            if (usernameExists) {
                return { success: false, error: 'Username already taken' };
            }
            
            const fakeEmail = `${username.toLowerCase()}@armhelper.local`;
            
            const result = await this.auth.createUserWithEmailAndPassword(fakeEmail, password);
            
            await result.user.updateProfile({ displayName: username });

            await this.createUserProfile(result.user.uid, {
                username: username,
                provider: 'username',
                hasPassword: true,
                hasGoogleLinked: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                settings: this.getDefaultSettings(),
                socialAccounts: { telegram: null, discord: null, roblox: null }
            });

            console.log('✅ User created:', username);
            return { success: true, user: result.user };
        } catch (error) {
            console.error('❌ Sign up error:', error.code);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    async signInWithUsername(username, password) {
        try {
            const fakeEmail = `${username.toLowerCase()}@armhelper.local`;
            const result = await this.auth.signInWithEmailAndPassword(fakeEmail, password);
            console.log('✅ Signed in:', username);
            return { success: true, user: result.user };
        } catch (error) {
            console.error('❌ Sign in error:', error.code);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    async checkUsernameExists(username) {
        try {
            const snapshot = await this.db.collection('users')
                .where('username', '==', username)
                .limit(1)
                .get();
            return !snapshot.empty;
        } catch (error) {
            console.error('❌ Check username error:', error);
            return false;
        }
    }

    // ========== GOOGLE AUTHENTICATION ==========

    async signInWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
            
            const result = await this.auth.signInWithPopup(provider);

            const profileExists = await this.getUserProfile(result.user.uid);
            
            if (!profileExists) {
                await this.createUserProfile(result.user.uid, {
                    username: result.user.displayName || result.user.email.split('@')[0],
                    email: result.user.email,
                    photoURL: result.user.photoURL,
                    provider: 'google',
                    hasPassword: false,
                    hasGoogleLinked: true,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    settings: this.getDefaultSettings(),
                    socialAccounts: { telegram: null, discord: null, roblox: null }
                });
            }

            const profile = await this.getUserProfile(result.user.uid);
            const needsPassword = !profile.hasPassword;
            
            console.log('✅ Google sign in successful');
            return { success: true, user: result.user, needsPassword: needsPassword };
        } catch (error) {
            console.error('❌ Google sign in error:', error.code);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    // ========== PASSWORD MANAGEMENT ==========

    async setPasswordForGoogleAccount(password) {
        if (!this.currentUser || this.currentUser.provider !== 'google') {
            return { success: false, error: 'Only for Google accounts' };
        }

        if (this.currentUser.hasPassword) {
            return { success: false, error: 'Password already set' };
        }

        try {
            const credential = firebase.auth.EmailAuthProvider.credential(
                this.currentUser.email,
                password
            );
            
            await this.auth.currentUser.linkWithCredential(credential);
            
            await this.updateUserProfile({ hasPassword: true });
            
            this.currentUser.hasPassword = true;
            this.notifyListeners('authChanged', this.currentUser);
            
            console.log('✅ Password set');
            return { success: true };
        } catch (error) {
            console.error('❌ Set password error:', error.code);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    async linkGoogleAccount(currentPassword) {
        if (!this.currentUser || this.currentUser.provider !== 'username') {
            return { success: false, error: 'Only for username accounts' };
        }

        if (this.currentUser.hasGoogleLinked) {
            return { success: false, error: 'Google already linked' };
        }

        try {
            const credential = firebase.auth.EmailAuthProvider.credential(
                this.auth.currentUser.email,
                currentPassword
            );
            await this.auth.currentUser.reauthenticateWithCredential(credential);
            
            const provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
            
            const result = await this.auth.currentUser.linkWithPopup(provider);
            
            await this.updateUserProfile({
                email: result.user.email,
                photoURL: result.user.photoURL,
                hasGoogleLinked: true
            });
            
            this.currentUser.email = result.user.email;
            this.currentUser.photoURL = result.user.photoURL;
            this.currentUser.hasGoogleLinked = true;
            this.notifyListeners('authChanged', this.currentUser);
            
            console.log('✅ Gmail linked');
            return { success: true };
        } catch (error) {
            console.error('❌ Link Google error:', error.code);
            
            if (error.code === 'auth/credential-already-in-use') {
                return { success: false, error: 'This Google account is already linked to another user' };
            }
            
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    // ========== PROFILE MANAGEMENT (БЕЗ ДУБЛЮВАННЯ) ==========

    async updateUsername(newUsername, currentPassword = null) {
        if (!this.currentUser) {
            return { success: false, error: 'Not authenticated' };
        }

        try {
            // Перевірка чи username вільний
            const usernameExists = await this.checkUsernameExists(newUsername);
            if (usernameExists) {
                return { success: false, error: 'Username already taken' };
            }
            
            // Для username акаунтів - реаутентифікація і зміна email
            if (this.currentUser.provider === 'username' && currentPassword) {
                const oldEmail = this.auth.currentUser.email;
                const newEmail = `${newUsername.toLowerCase()}@armhelper.local`;
                
                // Реаутентифікація зі старим паролем
                const credential = firebase.auth.EmailAuthProvider.credential(oldEmail, currentPassword);
                await this.auth.currentUser.reauthenticateWithCredential(credential);
                
                // Оновлення email (БЕЗ створення нового акаунту)
                await this.auth.currentUser.updateEmail(newEmail);
                console.log('✅ Email updated');
            }
            
            // Для Google акаунтів з паролем - реаутентифікація
            if (this.currentUser.provider === 'google' && this.currentUser.hasPassword && currentPassword) {
                const credential = firebase.auth.EmailAuthProvider.credential(
                    this.currentUser.email,
                    currentPassword
                );
                await this.auth.currentUser.reauthenticateWithCredential(credential);
            }
            
            // Оновлення displayName в Auth
            await this.auth.currentUser.updateProfile({ displayName: newUsername });
            
            // Оновлення username в Firestore
            await this.updateUserProfile({ username: newUsername });
            
            // Оновлення локальних даних
            this.currentUser.displayName = newUsername;
            this.currentUser.username = newUsername;
            if (this.currentUser.provider === 'username') {
                this.currentUser.email = `${newUsername.toLowerCase()}@armhelper.local`;
            }
            
            this.updateAuthUI(true);
            this.notifyListeners('authChanged', this.currentUser);
            
            console.log('✅ Username updated (same account)');
            return { success: true };
        } catch (error) {
            console.error('❌ Update username error:', error.code);
            
            if (error.code === 'auth/email-already-in-use') {
                return { success: false, error: 'Username already taken in system' };
            }
            
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    async updatePassword(currentPassword, newPassword) {
        if (!this.currentUser || !this.currentUser.hasPassword) {
            return { success: false, error: 'Please set a password first' };
        }

        try {
            const credential = firebase.auth.EmailAuthProvider.credential(
                this.auth.currentUser.email,
                currentPassword
            );
            await this.auth.currentUser.reauthenticateWithCredential(credential);
            await this.auth.currentUser.updatePassword(newPassword);
            
            console.log('✅ Password updated');
            return { success: true };
        } catch (error) {
            console.error('❌ Update password error:', error.code);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    async deleteAccount(currentPassword) {
        if (!this.currentUser) {
            return { success: false, error: 'Not authenticated' };
        }

        try {
            const userId = this.currentUser.uid;
            
            // Реаутентифікація
            if (this.currentUser.hasPassword) {
                const credential = firebase.auth.EmailAuthProvider.credential(
                    this.auth.currentUser.email,
                    currentPassword
                );
                await this.auth.currentUser.reauthenticateWithCredential(credential);
            } else {
                const provider = new firebase.auth.GoogleAuthProvider();
                await this.auth.currentUser.reauthenticateWithPopup(provider);
            }
            
            // Видалення з Auth
            await this.auth.currentUser.delete();
            
            // Видалення з Firestore
            try {
                await this.db.collection('users').doc(userId).delete();
            } catch (err) {
                console.warn('⚠️ Firestore delete warning:', err);
            }
            
            this.clearLocalUserData();
            
            console.log('✅ Account deleted');
            return { success: true };
        } catch (error) {
            console.error('❌ Delete account error:', error.code);
            return { success: false, error: this.getErrorMessage(error.code) };
        }
    }

    async signOut() {
        try {
            await this.auth.signOut();
            this.clearLocalUserData();
            console.log('✅ Signed out');
            return { success: true };
        } catch (error) {
            console.error('❌ Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    // ========== SOCIAL ACCOUNTS ==========

    async connectSocialAccount(platform, username) {
        if (!this.currentUser) {
            return { success: false, error: 'Not authenticated' };
        }

        if (!['telegram', 'discord', 'roblox'].includes(platform)) {
            return { success: false, error: 'Invalid platform' };
        }

        try {
            const trimmed = username.trim();
            
            // Перевірка чи вже прив'язаний до іншого користувача
            const existingLink = await this.db.collection('users')
                .where(`socialAccounts.${platform}`, '==', trimmed)
                .limit(1)
                .get();
            
            if (!existingLink.empty && existingLink.docs[0].id !== this.currentUser.uid) {
                return { success: false, error: 'This account is already linked to another user' };
            }
            
            // Оновлення
            const updateData = {};
            updateData[`socialAccounts.${platform}`] = trimmed;
            updateData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
            
            await this.db.collection('users').doc(this.currentUser.uid).update(updateData);
            
            console.log(`✅ ${platform} connected: ${trimmed}`);
            return { success: true, platform, username: trimmed };
        } catch (error) {
            console.error(`❌ Connect ${platform} error:`, error);
            return { success: false, error: 'Failed to connect account' };
        }
    }

    async disconnectSocialAccount(platform) {
        if (!this.currentUser) {
            return { success: false, error: 'Not authenticated' };
        }

        try {
            const updateData = {};
            updateData[`socialAccounts.${platform}`] = firebase.firestore.FieldValue.delete();
            updateData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
            
            await this.db.collection('users').doc(this.currentUser.uid).update(updateData);
            
            console.log(`✅ ${platform} disconnected`);
            return { success: true, platform };
        } catch (error) {
            console.error(`❌ Disconnect ${platform} error:`, error);
            return { success: false, error: 'Failed to disconnect account' };
        }
    }

    // ========== FIRESTORE OPERATIONS ==========

    async createUserProfile(uid, data) {
        try {
            await this.db.collection('users').doc(uid).set({
                ...data,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            return true;
        } catch (error) {
            console.error('❌ Create profile error:', error);
            return false;
        }
    }

    async getUserProfile(uid) {
        try {
            const doc = await this.db.collection('users').doc(uid).get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error('❌ Get profile error:', error);
            return null;
        }
    }

    async updateUserProfile(updates) {
        if (!this.currentUser) return false;

        try {
            await this.db.collection('users').doc(this.currentUser.uid).update({
                ...updates,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return true;
        } catch (error) {
            console.error('❌ Update profile error:', error);
            return false;
        }
    }

    // ========== HELPERS ==========

    getDefaultSettings() {
        return {
            language: (typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : null) || 'en',
            theme: localStorage.getItem('armHelper_colorTheme') || 'blackOrange',
            menuPosition: localStorage.getItem('armHelper_menuPosition') || 'left',
            notifications: true,
            autoSave: true
        };
    }

    clearLocalUserData() {
        const preserve = ['armHelper_language', 'armHelper_colorTheme', 'armHelper_menuPosition'];
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('armHelper_user_') && !preserve.includes(key)) {
                localStorage.removeItem(key);
            }
        });
    }

    updateAuthUI(isSignedIn) {
        const btn = document.getElementById('authButton');
        if (!btn) return;

        if (isSignedIn && this.currentUser) {
            btn.textContent = `👤 ${this.currentUser.displayName}`;
            btn.title = 'View profile';
        } else {
            const lang = (typeof getCurrentAppLanguage === 'function' ? getCurrentAppLanguage() : null) || 'en';
            const texts = { en: '🔐 Login', uk: '🔐 Увійти', ru: '🔐 Войти' };
            btn.textContent = texts[lang] || '🔐 Login';
            btn.title = 'Sign in to sync your data';
        }
        btn.classList.remove('disabled');
    }

    getErrorMessage(errorCode) {
        const errors = {
            'auth/email-already-in-use': 'Username already taken',
            'auth/invalid-email': 'Invalid username',
            'auth/weak-password': 'Password too weak (min 6 characters)',
            'auth/user-not-found': 'Username not found',
            'auth/wrong-password': 'Wrong password',
            'auth/too-many-requests': 'Too many requests. Try again later',
            'auth/network-request-failed': 'Network error',
            'auth/popup-closed-by-user': 'Sign in popup closed',
            'auth/popup-blocked': 'Popup blocked. Please allow popups',
            'auth/requires-recent-login': 'Please sign in again to continue',
            'auth/invalid-credential': 'Invalid credentials',
            'auth/invalid-login-credentials': 'Invalid username or password',
            'auth/credential-already-in-use': 'This Google account is already linked to another user'
        };
        return errors[errorCode] || `Error: ${errorCode}`;
    }

    // ========== EVENT LISTENERS ==========

    addEventListener(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    removeEventListener(event, callback) {
        if (this.listeners.has(event)) {
            const listeners = this.listeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) listeners.splice(index, 1);
        }
    }

    notifyListeners(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('❌ Listener error:', error);
                }
            });
        }
    }

    // ========== UTILITY ==========

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    getDebugInfo() {
        return {
            isInitialized: this.isInitialized,
            isAuthenticated: this.isAuthenticated(),
            currentUser: this.currentUser ? {
                uid: this.currentUser.uid,
                username: this.currentUser.username,
                provider: this.currentUser.provider,
                hasPassword: this.currentUser.hasPassword,
                hasGoogleLinked: this.currentUser.hasGoogleLinked
            } : null
        };
    }
}

// ========== GLOBAL INITIALIZATION ==========

let firebaseManager = null;

async function initializeFirebase() {
    if (firebaseManager) return firebaseManager;

    firebaseManager = new FirebaseManager();
    window.firebaseManager = firebaseManager;
    
    const success = await firebaseManager.initialize();
    
    if (success) {
        console.log('✅ Firebase ready');
    } else {
        console.error('❌ Firebase init failed');
    }
    
    return firebaseManager;
}

function debugFirebase() {
    if (!firebaseManager) {
        console.log('❌ Firebase not initialized');
        return;
    }
    console.table(firebaseManager.getDebugInfo());
}

// Exports
Object.assign(window, {
    FirebaseManager,
    firebaseManager,
    initializeFirebase,
    debugFirebase
});

console.log('✅ Firebase module loaded (Optimized - No Duplicates)');
