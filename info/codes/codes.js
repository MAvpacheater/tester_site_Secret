// Codes functionality with multilingual support

let codesCurrentLanguage = 'en';
let codesTranslations = null;
let codesInitialized = false;

// Get language from localStorage
function getCurrentLanguage() {
    return localStorage.getItem('armHelper_language') || 'en';
}

// Load translations from external file (same folder)
async function loadCodesTranslations() {
    if (codesTranslations) return codesTranslations;
    
    try {
        console.log('📥 Loading codes translations...');
        const response = await fetch('info/codes/codes.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        codesTranslations = await response.json();
        console.log('✅ Codes translations loaded');
    } catch (error) {
        console.error('❌ Failed to load codes translations:', error);
        throw error;
    }
    return codesTranslations;
}

// Update language
function updateCodesLanguage(newLanguage) {
    console.log(`🔑 Codes language: ${codesCurrentLanguage} → ${newLanguage}`);
    
    if (newLanguage === codesCurrentLanguage) return;
    codesCurrentLanguage = newLanguage;
    
    // Update title if exists
    const codesPage = document.getElementById('codesPage');
    if (codesPage) {
        const titleElement = codesPage.querySelector('.title');
        if (titleElement && codesTranslations?.[newLanguage]) {
            titleElement.textContent = codesTranslations[newLanguage].title;
        }
    }
    
    // Regenerate content
    if (codesInitialized) {
        setTimeout(generateCodesContent, 100);
    }
}

// Load/save code states
function loadCodeStates() {
    const saved = sessionStorage.getItem('codeStates');
    return saved ? JSON.parse(saved) : {};
}

function saveCodeStates(states) {
    sessionStorage.setItem('codeStates', JSON.stringify(states));
}

// Calculate statistics
function calculateCodeStats(codes, codeStates) {
    const totalCodes = codes.length;
    const usedCodes = codes.filter(code => codeStates[code.code]).length;
    const availableCodes = totalCodes - usedCodes;
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
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 1500);
    } catch (err) {
        console.error('Copy failed:', err);
    }
}

// Toggle code status
function toggleCodeStatus(codeIndex, toggleElement) {
    const data = codesTranslations[codesCurrentLanguage];
    const code = data.codes[codeIndex];
    const codeStates = loadCodeStates();
    
    codeStates[code.code] = !codeStates[code.code];
    
    const codeItem = toggleElement.closest('.code-item');
    if (codeStates[code.code]) {
        toggleElement.classList.add('used');
        codeItem.classList.add('used');
    } else {
        toggleElement.classList.remove('used');
        codeItem.classList.remove('used');
    }
    
    saveCodeStates(codeStates);
    updateCodesStats();
}

// Update statistics display
function updateCodesStats() {
    if (!codesTranslations?.[codesCurrentLanguage]) return;
    
    const data = codesTranslations[codesCurrentLanguage];
    const codeStates = loadCodeStates();
    const stats = calculateCodeStats(data.codes, codeStates);
    
    const elements = {
        total: document.querySelector('.stat-number.total'),
        used: document.querySelector('.stat-number.used'),
        available: document.querySelector('.stat-number.available'),
        progress: document.querySelector('.stat-number.progress'),
        progressBar: document.querySelector('.progress-fill')
    };
    
    if (elements.total) elements.total.textContent = stats.total;
    if (elements.used) elements.used.textContent = stats.used;
    if (elements.available) elements.available.textContent = stats.available;
    if (elements.progress) elements.progress.textContent = `${stats.progress}%`;
    if (elements.progressBar) elements.progressBar.style.height = `${stats.progress}%`;
}

// Generate content
async function generateCodesContent() {
    const codesPage = document.getElementById('codesPage');
    if (!codesPage) return console.error('❌ Codes page not found');
    
    codesCurrentLanguage = getCurrentLanguage();
    
    try {
        if (!codesTranslations) await loadCodesTranslations();
        
        const data = codesTranslations[codesCurrentLanguage];
        if (!data) throw new Error(`No codes data for language: ${codesCurrentLanguage}`);
        
        // Show loading
        codesPage.innerHTML = `
            <h1 class="title">${data.title}</h1>
            <div class="codes-container" id="codesContainer">
                <div class="codes-loading">${data.loading}</div>
            </div>
        `;
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Load code states
        const codeStates = loadCodeStates();
        const stats = calculateCodeStats(data.codes, codeStates);
        
        // Build HTML
        let content = `
            <div class="codes-header">
                <div class="codes-stats">
                    <div class="stat-item">
                        <div class="stat-number total">${stats.total}</div>
                        <div class="stat-label">${data.stats.total}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number used">${stats.used}</div>
                        <div class="stat-label">${data.stats.used}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number available">${stats.available}</div>
                        <div class="stat-label">${data.stats.available}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number progress">${stats.progress}%</div>
                        <div class="stat-label">${data.stats.progress}</div>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="height: ${stats.progress}%"></div>
                </div>
            </div>
            <div class="codes-list">
        `;
        
        data.codes.forEach((code, index) => {
            const isUsed = codeStates[code.code] || false;
            const description = code.description || `3x boost for ${code.hours} hours`;
            
            content += `
                <div class="code-item ${isUsed ? 'used' : ''}" style="animation-delay: ${index * 0.05}s">
                    <div class="code-content">
                        <div class="code-name">${code.code}</div>
                        <div class="code-description">${description}</div>
                    </div>
                    <div class="code-actions">
                        <button class="code-toggle ${isUsed ? 'used' : ''}" 
                                onclick="toggleCodeStatus(${index}, this)">
                        </button>
                        <button class="copy-btn" onclick="copyCode('${code.code}', this)">
                            <span class="copy-icon">📋</span>
                            Copy
                        </button>
                    </div>
                </div>
            `;
        });
        
        content += '</div>';
        
        const container = document.getElementById('codesContainer');
        if (container) {
            container.innerHTML = content;
        }
        
        console.log(`✅ Generated ${data.codes.length} codes in ${codesCurrentLanguage}`);
    } catch (error) {
        console.error('❌ Error generating codes:', error);
        codesPage.innerHTML = `
            <h1 class="title">Codes Collection</h1>
            <div class="codes-container">
                <div class="codes-error">
                    ⚠️ Error loading codes data<br>
                    <button class="retry-btn" onclick="initializeCodes()">Retry</button>
                </div>
            </div>
        `;
    }
}

// Initialize codes
async function initializeCodes() {
    if (codesInitialized) {
        console.log('🔄 Codes already initialized');
        return;
    }
    
    console.log('🔑 Initializing codes...');
    
    codesCurrentLanguage = getCurrentLanguage();
    
    try {
        await loadCodesTranslations();
        await generateCodesContent();
        
        codesInitialized = true;
        window.codesInitialized = true;
        console.log('✅ Codes initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize codes:', error);
        const page = document.getElementById('codesPage');
        if (page) {
            page.innerHTML = `
                <h1 class="title">Codes Collection</h1>
                <div class="codes-container">
                    <div class="codes-error">
                        ⚠️ Failed to load codes data<br>
                        <button class="retry-btn" onclick="initializeCodes()">Retry</button>
                    </div>
                </div>
            `;
        }
    }
}

// Event listeners
document.addEventListener('languageChanged', (e) => {
    if (e.detail?.language) updateCodesLanguage(e.detail.language);
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const page = document.getElementById('codesPage');
        if (page?.classList.contains('active')) initializeCodes();
    }, 100);
});

document.addEventListener('click', (e) => {
    if (e.target?.getAttribute('data-page') === 'codes') {
        setTimeout(() => {
            if (!codesInitialized) {
                initializeCodes();
            }
        }, 300);
    }
});

// Observer for page activation
const codesObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const codesPage = document.getElementById('codesPage');
            if (codesPage?.classList.contains('active') && !codesInitialized) {
                console.log('🔑 Codes page activated, initializing...');
                initializeCodes();
            }
        }
    });
});

// Start observing
document.addEventListener('DOMContentLoaded', () => {
    const codesPage = document.getElementById('codesPage');
    if (codesPage) {
        codesObserver.observe(codesPage, { attributes: true });
    }
});

// Global exports
window.initializeCodes = initializeCodes;
window.updateCodesLanguage = updateCodesLanguage;
window.generateCodesContent = generateCodesContent;
window.copyCode = copyCode;
window.toggleCodeStatus = toggleCodeStatus;
window.updateCodesStats = updateCodesStats;
window.codesInitialized = codesInitialized;

console.log('✅ Codes.js loaded');
