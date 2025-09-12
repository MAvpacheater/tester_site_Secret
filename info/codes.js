// Codes functionality - Updated to match design with stats and toggles

// Codes data with status tracking
const codesData = [
    { code: "pyramids", description: "Use for 3x stat boost for 72 hours (NEW)", isNew: true, isActive: true },
    { code: "egyptian", description: "Use for 3x stat boost for 72 hours (NEW)", isNew: true, isActive: true },
    { code: "21iscoming", description: "Use for 3x stat boost for 48 hours", isActive: true },
    { code: "brainrot", description: "Use for 3x stat boost for 48 hours", isActive: false },
    { code: "removal", description: "Use for 3x stat boost for 48 hours", isActive: true },
    { code: "octogames", description: "Use for 3x stat boost for 48 hours", isActive: true },
    { code: "glassbridge", description: "Use for 3x stat boost for 48 hours", isActive: true },
    { code: "celebration", description: "Use for 3x stat boost for 48 hours", isActive: true },
    { code: "banker", description: "Use for 3x stat boost for 24 hours", isActive: true },
    { code: "sorryoops", description: "Use for 3x strength boost for 24 hours", isActive: false },
    { code: "timetravel", description: "Use for 48 hours of 3x strength and +5% boost on all stats", isActive: true },
    { code: "world19", description: "Use for 5% on all strengths and 3x stat boost for 48 hours", isActive: true },
    { code: "bulk", description: "Use for 3x stat boost for 48 hours", isActive: true },
    { code: "superhero", description: "Use for 3x stat boost for 48 hours", isActive: true },
    { code: "tokenstore", description: "Use for 3x stat boost for 48 hours", isActive: true },
    { code: "captain", description: "Use for 3x stat boost for 48 hours", isActive: true },
    { code: "skullbeard", description: "Use for 3x stat boost for 48 hours", isActive: true },
    { code: "pirate", description: "Use for 5% on all strengths and 1,000 Gold Coins", isActive: true },
    { code: "athlete", description: "Use for 3x stat boost for 48 hours", isActive: true },
    { code: "tradingback", description: "5% boost on all strengths", isActive: false },
    { code: "blossom", description: "Use for 3x stat boost for 48 hours and 1500 Prison Coins", isActive: true },
    { code: "ninja", description: "Use for 3x stat boost for 48 hours and 1500 Prison Coins", isActive: true },
    { code: "snowops", description: "Use for 3x stat boost for 48 hours", isActive: false },
    { code: "hideout", description: "Use for 3x stat boost for 48 hours and 2500 Prison Coins", isActive: true },
    { code: "cosmic", description: "Use for 3x stat boost for 24 hours", isActive: true },
    { code: "stocking", description: "Use for 3x stat boost for 72 hours and Christmas Title", isActive: false },
    { code: "frostlands", description: "Use for 3x stat boost for 24 hours and 150 Ice Cubes", isActive: false },
    { code: "polar", description: "Use for 3x stat boost for 24 hours", isActive: false },
    { code: "shiny", description: "Use for 3x stat boost for 24 hours", isActive: true },
    { code: "Christmas", description: "Use for 3x stat boost for 72 hours", isActive: false },
    { code: "hacker", description: "Use for 3x stat boost for 24 hours", isActive: true },
    { code: "classic", description: "Use for 3x stat boost for 24 hours", isActive: true },
    { code: "clans", description: "Use for 3x stat boost for 24 hours", isActive: true },
    { code: "rifted", description: "Use for 3x stat boost for 24 hours", isActive: true },
    { code: "hauntedmanor", description: "Use for 3x stat boost for 24 hours and free candy", isActive: false },
    { code: "trainers", description: "Use for 3x stat boost for 24 hours", isActive: true },
    { code: "ghosthunting", description: "Use for 3x stat boost for 24 hours and 1 Halloween card", isActive: false },
    { code: "spooky", description: "Use for 3x stat boost for 24 hours and 3,500 candy", isActive: false },
    { code: "soon", description: "Use for 3x stat boost for 24 hours", isActive: true },
    { code: "hatching", description: "Use for 3x stat boost for 24 hours", isActive: true },
    { code: "billion", description: "Use for 3x stat boost for 24 hours", isActive: true },
    { code: "Heavenly", description: "Use for 3x stat boost for 24 hours", isActive: true },
    { code: "rework", description: "Use for 3x stat boost for 24 hours", isActive: true },
    { code: "paradise", description: "Use for 3x stat boost for 24 hours + 1 gold", isActive: true },
    { code: "wasteland", description: "Use for 3x stat boost for 24 hours", isActive: true },
    { code: "apocalypse", description: "Use for 3x boost for 24 hours", isActive: true },
    { code: "energy", description: "Use for 3x boost for 24 hours", isActive: true },
    { code: "royalty", description: "Use for 3x boost for 24 hours", isActive: true },
    { code: "performance", description: "Use for 3x boost for 24 hours", isActive: true },
    { code: "charms", description: "Use for 3x boost for 24 hours of 3x multiplier", isActive: true },
    { code: "wizard", description: "Use for 3x boost for 24 hours of 3x multiplier & 25 Miner Crystal", isActive: true },
    { code: "atlantis", description: "Use for 8 hours of the 3x boost", isActive: true },
    { code: "800mvisits", description: "Use for 3x stat boost for eight hours", isActive: true },
    { code: "icecold", description: "Use for 3x boost for 24 hours of 3x multiplier", isActive: true },
    { code: "forging", description: "Use for 3x boost for 24 hours of 3x multiplier", isActive: true },
    { code: "axel", description: "Use for 50 Wins", isActive: true }
];

// Calculate stats
function calculateCodeStats() {
    const totalCodes = codesData.length;
    const usedCodes = codesData.filter(code => !code.isActive).length;
    const availableCodes = codesData.filter(code => code.isActive).length;
    const progressPercentage = Math.round((usedCodes / totalCodes) * 100);
    
    return {
        total: totalCodes,
        used: usedCodes,
        available: availableCodes,
        progress: progressPercentage
    };
}

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
        }, 1500);
    } catch (err) {
        console.error('Failed to copy code:', err);
        // Fallback for older browsers
        try {
            const textArea = document.createElement('textarea');
            textArea.value = code;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showCopyMessage(`Code "${code}" copied!`);
        } catch (fallbackErr) {
            console.error('Clipboard fallback failed:', fallbackErr);
        }
    }
}

// Toggle code status (for visual feedback)
function toggleCodeStatus(codeIndex, toggleElement) {
    codesData[codeIndex].isActive = !codesData[codeIndex].isActive;
    
    // Update toggle appearance
    if (codesData[codeIndex].isActive) {
        toggleElement.classList.remove('inactive');
    } else {
        toggleElement.classList.add('inactive');
    }
    
    // Update stats
    updateCodesStats();
    
    console.log(`Code ${codesData[codeIndex].code} status changed to: ${codesData[codeIndex].isActive ? 'active' : 'inactive'}`);
}

// Update codes statistics
function updateCodesStats() {
    const stats = calculateCodeStats();
    
    // Update stat numbers
    const totalEl = document.querySelector('.stat-number.total');
    const usedEl = document.querySelector('.stat-number.used');
    const availableEl = document.querySelector('.stat-number.available');
    const progressEl = document.querySelector('.stat-number.progress');
    const progressBar = document.querySelector('.progress-fill');
    
    if (totalEl) totalEl.textContent = stats.total;
    if (usedEl) usedEl.textContent = stats.used;
    if (availableEl) availableEl.textContent = stats.available;
    if (progressEl) progressEl.textContent = `${stats.progress}%`;
    if (progressBar) progressBar.style.height = `${stats.progress}%`;
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

// Generate codes content with stats header
async function generateCodesContent() {
    const container = document.getElementById('codesContainer');
    if (!container) return;

    const stats = calculateCodeStats();
    
    let content = `
        <!-- Header with Stats -->
        <div class="codes-header">
            <div class="codes-stats">
                <div class="stat-item">
                    <div class="stat-number total">${stats.total}</div>
                    <div class="stat-label">Total Codes</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number used">${stats.used}</div>
                    <div class="stat-label">Used</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number available">${stats.available}</div>
                    <div class="stat-label">Available</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number progress">${stats.progress}%</div>
                    <div class="stat-label">Progress</div>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="height: ${stats.progress}%"></div>
            </div>
        </div>
        
        <!-- Codes List -->
        <div class="codes-list">
    `;
    
    // Generate code items
    codesData.forEach((item, index) => {
        content += `
            <div class="code-item">
                <div class="code-content">
                    <div class="code-name">${item.code}${item.isNew ? ' (NEW)' : ''}</div>
                    <div class="code-description">${item.description}</div>
                </div>
                <div class="code-actions">
                    <button class="code-toggle ${item.isActive ? '' : 'inactive'}" 
                            onclick="toggleCodeStatus(${index}, this)"
                            title="${item.isActive ? 'Mark as used' : 'Mark as available'}">
                    </button>
                    <button class="copy-btn" onclick="copyCode('${item.code}', this)">
                        <span class="copy-icon">📋</span>
                        Copy
                    </button>
                </div>
            </div>
        `;
    });
    
    content += '</div>';
    
    container.innerHTML = content;
    
    console.log('✅ Codes content generated with stats and toggles');
}

// Initialize codes page
function initializeCodes() {
    const codesPage = document.getElementById('codesPage');
    if (!codesPage) {
        console.error('❌ Codes page not found');
        return;
    }
    
    // Listen for page activation
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.id === 'codesPage' && target.classList.contains('active')) {
                    setTimeout(() => {
                        generateCodesContent();
                    }, 100);
                }
            }
        });
    });
    
    observer.observe(codesPage, { attributes: true });
    
    // Generate content if page is already active
    if (codesPage.classList.contains('active')) {
        setTimeout(() => {
            generateCodesContent();
        }, 100);
    }
    
    console.log('✅ Codes page initialized with enhanced features');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeCodes, 100);
    });
} else {
    setTimeout(initializeCodes, 100);
}

// Global functions
window.copyCode = copyCode;
window.toggleCodeStatus = toggleCodeStatus;
window.updateCodesStats = updateCodesStats;
window.initializeCodes = initializeCodes;
