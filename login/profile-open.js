// profile-open.js - ПОВНІСТЮ ВИПРАВЛЕНА ВЕРСІЯ БЕЗ БЛОКУВАНЬ
console.log('👤 Loading profile-open.js...');

// Open profile page
function openProfile() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        showProfileMessage('Please login to view your profile', 'error');
        return;
    }

    if (typeof switchPage === 'function') {
        switchPage('profile');
        
        // Small delay to ensure page is loaded, then update display
        setTimeout(() => {
            updateProfileDisplay();
        }, 100);
    }
}

// Go back from profile
function goBackFromProfile() {
    if (typeof switchPage === 'function') {
        switchPage('calculator');
    }
}

// Get current user from various sources
function getCurrentUser() {
    // Check auth manager first
    if (window.authManager && window.authManager.currentUser) {
        return {
            user: window.authManager.currentUser,
            profile: window.authManager.userProfile
        };
    }
    
    // Check localStorage fallback
    const savedUser = localStorage.getItem('armHelper_currentUser');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            return { user, profile: user };
        } catch (e) {
            console.warn('Invalid saved user data');
            localStorage.removeItem('armHelper_currentUser');
            return null;
        }
    }
    
    return null;
}

// Update profile display
function updateProfileDisplay() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const { user, profile } = currentUser;
    const nickname = profile?.nickname || user?.email?.split('@')[0] || 'User';

    // Update profile info
    const profileNickname = document.getElementById('profileNickname');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileJoinDate = document.getElementById('profileJoinDate');
    const currentNicknameInput = document.getElementById('currentNickname');

    if (profileNickname) {
        profileNickname.textContent = nickname;
    }

    // НЕ ЗМІНЮЄМО АВАТАРКУ - вона захищена
    if (profileAvatar && !profileAvatar.hasAttribute('data-protected')) {
        profileAvatar.alt = `${nickname}'s avatar`;
    }

    if (currentNicknameInput) {
        currentNicknameInput.value = nickname;
    }

    if (profileJoinDate) {
        const joinDate = formatJoinDate(profile?.created_at || user?.created_at);
        profileJoinDate.textContent = joinDate;
    }

    // Update stats
    updateProfileStats();
}

// Format join date
function formatJoinDate(dateString) {
    if (!dateString) return 'Recently';
    
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) return 'Today';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        
        return date.toLocaleDateString();
    } catch (e) {
        return 'Recently';
    }
}

// Update profile stats
async function updateProfileStats() {
    try {
        // Update login count
        const loginCountEl = document.getElementById('loginCount');
        if (loginCountEl) {
            const loginCount = parseInt(localStorage.getItem('armHelper_loginCount') || '1');
            loginCountEl.textContent = loginCount;
        }

        // Update last login
        const lastLoginEl = document.getElementById('lastLoginDate');
        if (lastLoginEl) {
            const lastLogin = localStorage.getItem('armHelper_lastLogin');
            if (lastLogin) {
                const date = new Date(lastLogin);
                const today = new Date();
                
                if (date.toDateString() === today.toDateString()) {
                    lastLoginEl.textContent = 'Today';
                } else {
                    lastLoginEl.textContent = date.toLocaleDateString();
                }
            } else {
                lastLoginEl.textContent = 'Today';
            }
        }

    } catch (error) {
        console.error('Error updating profile stats:', error);
    }
}

// Update login stats
function updateLoginStats() {
    // Increment login count
    const currentCount = parseInt(localStorage.getItem('armHelper_loginCount') || '0');
    localStorage.setItem('armHelper_loginCount', (currentCount + 1).toString());
    
    // Update last login time
    localStorage.setItem('armHelper_lastLogin', new Date().toISOString());
}

// Show profile message
function showProfileMessage(text, type = 'success') {
    const messageEl = document.getElementById('profileMessage');
    if (messageEl) {
        messageEl.textContent = text;
        messageEl.className = `profile-message ${type}`;
        messageEl.style.display = 'block';

        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 4000);
    }
}

// Menu toggle functions
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

// Export functions for global use
if (typeof window !== 'undefined') {
    window.openProfile = openProfile;
    window.goBackFromProfile = goBackFromProfile;
    window.getCurrentUser = getCurrentUser;
    window.updateProfileDisplay = updateProfileDisplay;
    window.formatJoinDate = formatJoinDate;
    window.updateProfileStats = updateProfileStats;
    window.updateLoginStats = updateLoginStats;
    window.showProfileMessage = showProfileMessage;
    window.toggleStatsView = toggleStatsView;
    window.closeStatsView = closeStatsView;
}

console.log('✅ profile-open.js loaded - NO FUNCTIONALITY BLOCKS');
