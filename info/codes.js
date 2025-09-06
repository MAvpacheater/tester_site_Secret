// Codes functionality with user-specific toggle states

// Codes data
const codesData = [
    { code: "pyramids", description: "Use for 3x stat boost for 72 hours (NEW)" },
    { code: "egyptian", description: "Use for 3x stat boost for 72 hours (NEW)" },
    { code: "21iscoming", description: "Use for 3x stat boost for 48 hours" },
    { code: "brainrot", description: "Use for 3x stat boost for 48 hours" },
    { code: "removal", description: "Use for 3x stat boost for 48 hours" },
    { code: "octogames", description: "Use for 3x stat boost for 48 hours" },
    { code: "glassbridge", description: "Use for 3x stat boost for 48 hours" },
    { code: "celebration", description: "Use for 3x stat boost for 48 hours" },
    { code: "banker", description: "Use for 3x stat boost for 24 hours" },
    { code: "sorryoops", description: "Use for 3x strength boost for 24 hours" },
    { code: "timetravel", description: "Use for 48 hours of 3x strength and +5% boost on all stats" },
    { code: "world19", description: "Use for 5% on all strengths and 3x stat boost for 48 hours" },
    { code: "bulk", description: "Use for 3x stat boost for 48 hours" },
    { code: "superhero", description: "Use for 3x stat boost for 48 hours" },
    { code: "tokenstore", description: "Use for 3x stat boost for 48 hours" },
    { code: "captain", description: "Use for 3x stat boost for 48 hours" },
    { code: "skullbeard", description: "Use for 3x stat boost for 48 hours" },
    { code: "pirate", description: "Use for 5% on all strengths and 1,000 Gold Coins" },
    { code: "athlete", description: "Use for 3x stat boost for 48 hours" },
    { code: "tradingback", description: "5% boost on all strengths" },
    { code: "blossom", description: "Use for 3x stat boost for 48 hours and 1500 Prison Coins" },
    { code: "ninja", description: "Use for 3x stat boost for 48 hours and 1500 Prison Coins" },
    { code: "snowops", description: "Use for 3x stat boost for 48 hours" },
    { code: "hideout", description: "Use for 3x stat boost for 48 hours and 2500 Prison Coins" },
    { code: "cosmic", description: "Use for 3x stat boost for 24 hours" },
    { code: "stocking", description: "Use for 3x stat boost for 72 hours and Christmas Title" },
    { code: "frostlands", description: "Use for 3x stat boost for 24 hours and 150 Ice Cubes" },
    { code: "polar", description: "Use for 3x stat boost for 24 hours" },
    { code: "shiny", description: "Use for 3x stat boost for 24 hours" },
    { code: "Christmas", description: "Use for 3x stat boost for 72 hours" },
    { code: "hacker", description: "Use for 3x stat boost for 24 hours" },
    { code: "classic", description: "Use for 3x stat boost for 24 hours" },
    { code: "clans", description: "Use for 3x stat boost for 24 hours" },
    { code: "rifted", description: "Use for 3x stat boost for 24 hours" },
    { code: "hauntedmanor", description: "Use for 3x stat boost for 24 hours and free candy" },
    { code: "trainers", description: "Use for 3x stat boost for 24 hours" },
    { code: "ghosthunting", description: "Use for 3x stat boost for 24 hours and 1 Halloween card" },
    { code: "spooky", description: "Use for 3x stat boost for 24 hours and 3,500 candy" },
    { code: "soon", description: "Use for 3x stat boost for 24 hours" },
    { code: "hatching", description: "Use for 3x stat boost for 24 hours" },
    { code: "billion", description: "Use for 3x stat boost for 24 hours" },
    { code: "Heavenly", description: "Use for 3x stat boost for 24 hours" },
    { code: "rework", description: "Use for 3x stat boost for 24 hours" },
    { code: "paradise", description: "Use for 3x stat boost for 24 hours + 1 gold" },
    { code: "wasteland", description: "Use for 3x stat boost for 24 hours" },
    { code: "apocalypse", description: "Use for 3x boost for 24 hours" },
    { code: "energy", description: "Use for 3x boost for 24 hours" },
    { code: "royalty", description: "Use for 3x boost for 24 hours" },
    { code: "performance", description: "Use for 3x boost for 24 hours" },
    { code: "charms", description: "Use for 3x boost for 24 hours of 3x multiplier" },
    { code: "wizard", description: "Use for 3x boost for 24 hours of 3x multiplier & 25 Miner Crystal" },
    { code: "atlantis", description: "Use for 8 hours of the 3x boost" },
    { code: "800mvisits", description: "Use for 3x stat boost for eight hours" },
    { code: "icecold", description: "Use for 3x boost for 24 hours of 3x multiplier" },
    { code: "forging", description: "Use for 3x boost for 24 hours of 3x multiplier" },
    { code: "axel", description: "Use for 50 Wins" }
];

// Current user's used codes state
let userUsedCodes = {};

// Copy code to clipboard
async function copyCode(code, button) {
    try {
        await navigator.clipboard.writeText(code);
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="copy-icon">✓</span> Copied!';
        button.classList.add('copied');
        showCopyMessage(`Code "${code}" copied!`);
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 1000);
    } catch (err) {
        console.error('Failed to copy code:', err);
    }
}

// Toggle code used state
async function toggleCodeUsed(code, checkbox) {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        // Show message that login is required
        showLoginRequiredMessage();
        checkbox.checked = !checkbox.checked; // Revert the change
        return;
    }

    const isUsed = checkbox.checked;
    userUsedCodes[code] = isUsed;
    
    // Update visual state of the code item
    const codeItem = checkbox.closest('.code-item');
    if (codeItem) {
        if (isUsed) {
            codeItem.classList.add('used');
        } else {
            codeItem.classList.remove('used');
        }
    }
    
    // Save to storage
    await saveUsedCodesState();
    
    // Update statistics
    updateCodesStatistics();
    
    console.log(`Code "${code}" marked as ${isUsed ? 'used' : 'unused'}`);
}

// Save used codes state for current user
async function saveUsedCodesState() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) return;
    
    try {
        if (window.authManager && window.authManager.currentUser) {
            // Save to Supabase
            await window.authManager.saveUserData('used_codes', userUsedCodes);
            console.log('✅ Used codes state saved to database');
        } else {
            // Fallback to localStorage
            localStorage.setItem('armHelper_used_codes', JSON.stringify(userUsedCodes));
            console.log('✅ Used codes state saved to localStorage');
        }
    } catch (error) {
        console.error('❌ Error saving used codes state:', error);
        // Fallback to localStorage
        localStorage.setItem('armHelper_used_codes', JSON.stringify(userUsedCodes));
    }
}

// Load used codes state for current user
async function loadUsedCodesState() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        userUsedCodes = {};
        return;
    }
    
    try {
        if (window.authManager && window.authManager.currentUser) {
            // Load from Supabase
            const data = await window.authManager.loadUserData('used_codes');
            userUsedCodes = data || {};
            console.log('✅ Used codes state loaded from database:', Object.keys(userUsedCodes).length + ' codes');
        } else {
            // Fallback to localStorage
            const saved = localStorage.getItem('armHelper_used_codes');
            userUsedCodes = saved ? JSON.parse(saved) : {};
            console.log('✅ Used codes state loaded from localStorage');
        }
    } catch (error) {
        console.error('❌ Error loading used codes state:', error);
        userUsedCodes = {};
    }
}

// Show message that login is required for code tracking
function showLoginRequiredMessage() {
    showCopyMessage('Login required to track used codes');
}

// Show copy success message
function showCopyMessage(message) {
    let messageEl = document.getElementById('copySuccessMessage');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'copySuccessMessage';
        messageEl.className = 'copy-success-message';
        document.body.appendChild(messageEl);
    }
    messageEl.textContent = message;
    messageEl.classList.add('show');
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 2000);
}

// Update codes statistics
function updateCodesStatistics() {
    const statsContainer = document.getElementById('codesStats');
    if (!statsContainer) return;
    
    const totalCodes = codesData.length;
    const usedCount = Object.values(userUsedCodes).filter(used => used).length;
    const unusedCount = totalCodes - usedCount;
    const usagePercentage = Math.round((usedCount / totalCodes) * 100);
    
    statsContainer.innerHTML = `
        <div class="stat-item">
            <div class="stat-number">${totalCodes}</div>
            <div class="stat-label">Total Codes</div>
        </div>
        <div class="stat-item">
            <div class="stat-number" style="color: #48bb78;">${usedCount}</div>
            <div class="stat-label">Used</div>
        </div>
        <div class="stat-item">
            <div class="stat-number" style="color: #667eea;">${unusedCount}</div>
            <div class="stat-label">Available</div>
        </div>
        <div class="stat-item">
            <div class="stat-number" style="color: #764ba2;">${usagePercentage}%</div>
            <div class="stat-label">Progress</div>
        </div>
    `;
}

// Generate auth notice for non-authenticated users
function generateAuthNotice() {
    return `
        <div class="codes-auth-notice">
            <h3>🔐 Track Your Used Codes</h3>
            <p>Login to your account to track which codes you've already used and sync your progress across devices!</p>
            <button class="auth-link-btn" onclick="switchPage('login')">Login to Track Codes</button>
        </div>
    `;
}

// Generate codes content
async function generateCodesContent() {
    const container = document.getElementById('codesContainer');
    if (!container) return;

    // Load user's used codes state
    await loadUsedCodesState();
    
    const currentUser = getCurrentUser();
    let content = '';
    
    // Add statistics for authenticated users
    if (currentUser) {
        content += '<div class="codes-stats" id="codesStats"></div>';
    } else {
        // Show auth notice for non-authenticated users
        content += generateAuthNotice();
    }
    
    // Generate code items
    codesData.forEach(item => {
        const isUsed = userUsedCodes[item.code] || false;
        const usedClass = isUsed ? 'used' : '';
        
        content += `
            <div class="code-item ${usedClass}">
                <div class="code-content">
                    <div class="code-name">${item.code}</div>
                    <div class="code-description">${item.description}</div>
                </div>
                <div class="code-actions">
                    ${currentUser ? `
                        <label class="code-toggle" data-tooltip="${isUsed ? 'Mark as unused' : 'Mark as used'}">
                            <input type="checkbox" ${isUsed ? 'checked' : ''} 
                                   onchange="toggleCodeUsed('${item.code}', this)">
                            <span class="toggle-slider"></span>
                        </label>
                    ` : ''}
                    <button class="copy-btn" onclick="copyCode('${item.code}', this)">
                        <span class="copy-icon">📋</span>
                        Copy
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = content;
    
    // Update statistics if user is authenticated
    if (currentUser) {
        updateCodesStatistics();
    }
    
    console.log('✅ Codes content generated with toggle states');
}

// Initialize codes page when it becomes active
function initializeCodes() {
    const codesPage = document.getElementById('codesPage');
    if (!codesPage) return;
    
    // Listen for page activation
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.id === 'codesPage' && target.classList.contains('active')) {
                    generateCodesContent();
                }
            }
        });
    });
    
    observer.observe(codesPage, { attributes: true });
    
    // Generate content if page is already active
    if (codesPage.classList.contains('active')) {
        generateCodesContent();
    }
    
    console.log('✅ Codes page initialized');
}

// Listen for authentication events to update codes page
document.addEventListener('userAuthenticated', (event) => {
    console.log('🔐 User authenticated - updating codes page');
    const codesPage = document.getElementById('codesPage');
    if (codesPage && codesPage.classList.contains('active')) {
        generateCodesContent();
    }
});

document.addEventListener('userSignedOut', () => {
    console.log('👋 User signed out - updating codes page');
    userUsedCodes = {};
    const codesPage = document.getElementById('codesPage');
    if (codesPage && codesPage.classList.contains('active')) {
        generateCodesContent();
    }
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeCodes();
});

// Global functions
window.copyCode = copyCode;
window.toggleCodeUsed = toggleCodeUsed;
window.initializeCodes = initializeCodes;
