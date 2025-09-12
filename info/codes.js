// Codes functionality з мультимовною підтримкою

// Мовні змінні
let codesCurrentLanguage = 'en';
let codesTranslations = null;
let codesInitialized = false;

// Отримання поточної мови
function getCurrentLanguage() {
    const saved = localStorage.getItem('armHelper_language');
    return saved || 'en';
}

// Завантаження перекладів
async function loadCodesTranslations() {
    if (codesTranslations) return codesTranslations;
    
    try {
        console.log('📥 Loading codes translations...');
        const response = await fetch('languages/codes.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        codesTranslations = await response.json();
        console.log('✅ Codes translations loaded successfully');
        return codesTranslations;
    } catch (error) {
        console.error('❌ Error loading codes translations:', error);
        // Fallback до англійської
        codesTranslations = {
            en: {
                title: "Codes Collection",
                loading: "Loading codes...",
                error: "Error loading codes data",
                retry: "Retry",
                stats: {
                    total: "Total Codes",
                    used: "Used",
                    available: "Available",
                    progress: "Progress"
                },
                codes: []
            }
        };
        return codesTranslations;
    }
}

// Оновлення мови
function updateCodesLanguage(newLanguage) {
    console.log(`🌍 Codes received language change: ${codesCurrentLanguage} → ${newLanguage}`);
    
    if (newLanguage === codesCurrentLanguage) {
        console.log('🔄 Same language, skipping update');
        return;
    }
    
    codesCurrentLanguage = newLanguage;
    
    // Оновлення заголовку
    const titleElement = document.querySelector('.codes-page .title');
    if (titleElement && codesTranslations && codesTranslations[newLanguage]) {
        titleElement.textContent = codesTranslations[newLanguage].title;
    }
    
    // Регенерація контенту якщо вже ініціалізовано
    if (codesInitialized) {
        setTimeout(() => {
            generateCodesContent();
        }, 100);
    }
}

// Збереження/завантаження стану кодів
function loadCodeStates() {
    const savedStates = sessionStorage.getItem('codeStates');
    if (savedStates) {
        return JSON.parse(savedStates);
    }
    return {};
}

function saveCodeStates(states) {
    sessionStorage.setItem('codeStates', JSON.stringify(states));
}

// Генерація опису коду
function generateCodeDescription(code, language) {
    const langData = codesTranslations[language];
    if (!langData) return '';
    
    let description = '';
    
    // Базовий опис з 3x boost
    if (code.hours > 0) {
        if (language === 'uk') {
            description = `3x підсилення на ${code.hours} годин`;
        } else if (language === 'ru') {
            description = `3x усиление на ${code.hours} часов`;
        } else {
            description = `3x stat boost for ${code.hours} hours`;
        }
    }
    
    // Додаткові бонуси
    if (code.extras) {
        if (description) {
            if (language === 'uk') {
                description += ` + ${code.extras}`;
            } else if (language === 'ru') {
                description += ` + ${code.extras}`;
            } else {
                description += ` + ${code.extras}`;
            }
        } else {
            description = code.extras;
        }
    }
    
    return description;
}

// Розрахунок статистики
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

// Копіювання коду
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
        // Fallback для старих браузерів
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyMessage(`Code "${code}" copied!`);
    }
}

// Зміна статусу коду
function toggleCodeStatus(codeIndex, toggleElement) {
    const currentLangData = codesTranslations[codesCurrentLanguage];
    const code = currentLangData.codes[codeIndex];
    const codeStates = loadCodeStates();
    
    codeStates[code.code] = !codeStates[code.code];
    
    // Оновлення UI
    const codeItem = toggleElement.closest('.code-item');
    
    if (codeStates[code.code]) {
        toggleElement.classList.add('used');
        codeItem.classList.add('used');
    } else {
        toggleElement.classList.remove('used');
        codeItem.classList.remove('used');
    }
    
    // Збереження стану та оновлення статистики
    saveCodeStates(codeStates);
    updateCodesStats();
}

// Оновлення статистики
function updateCodesStats() {
    if (!codesTranslations || !codesTranslations[codesCurrentLanguage]) return;
    
    const currentLangData = codesTranslations[codesCurrentLanguage];
    const codeStates = loadCodeStates();
    const stats = calculateCodeStats(currentLangData.codes, codeStates);
    
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

// Показ повідомлення про копіювання
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
    setTimeout(() => messageEl.classList.remove('show'), 2000);
}

// Генерація контенту кодів
async function generateCodesContent() {
    const container = document.getElementById('codesContainer');
    if (!container) {
        console.error('❌ Codes container not found');
        return;
    }
    
    // Отримання поточної мови
    codesCurrentLanguage = getCurrentLanguage();
    
    // Завантаження перекладів якщо ще не завантажено
    if (!codesTranslations) {
        await loadCodesTranslations();
    }
    
    // Показ стану завантаження
    const currentLangData = codesTranslations[codesCurrentLanguage];
    if (!currentLangData) {
        console.error(`❌ Language data for ${codesCurrentLanguage} not found`);
        return;
    }
    
    const loadingText = currentLangData.loading || 'Loading codes...';
    container.innerHTML = `<div class="codes-loading">${loadingText}</div>`;
    
    try {
        // Невелика затримка для анімації завантаження
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Завантаження збережених станів
        const codeStates = loadCodeStates();
        const stats = calculateCodeStats(currentLangData.codes, codeStates);
        
        let content = `
            <div class="codes-header">
                <div class="codes-stats">
                    <div class="stat-item">
                        <div class="stat-number total">${stats.total}</div>
                        <div class="stat-label">${currentLangData.stats.total}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number used">${stats.used}</div>
                        <div class="stat-label">${currentLangData.stats.used}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number available">${stats.available}</div>
                        <div class="stat-label">${currentLangData.stats.available}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number progress">${stats.progress}%</div>
                        <div class="stat-label">${currentLangData.stats.progress}</div>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="height: ${stats.progress}%"></div>
                </div>
            </div>
            <div class="codes-list">
        `;
        
        currentLangData.codes.forEach((code, index) => {
            const isUsed = codeStates[code.code] || false;
            const description = generateCodeDescription(code, codesCurrentLanguage);
            
            content += `
                <div class="code-item ${isUsed ? 'used' : ''}">
                    <div class="code-content">
                        <div class="code-name">${code.code}${code.isNew ? ` (${code.extras})` : ''}</div>
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
        container.innerHTML = content;
        
        console.log(`✅ Generated ${currentLangData.codes.length} codes in ${codesCurrentLanguage}`);
        
    } catch (error) {
        console.error('❌ Error generating codes content:', error);
        
        // Показ стану помилки
        const errorText = currentLangData.error || 'Error loading codes data';
        const retryText = currentLangData.retry || 'Retry';
        
        container.innerHTML = `
            <div class="codes-error">
                ⚠️ ${errorText}
                <br>
                <button class="retry-btn" onclick="generateCodesContent()">${retryText}</button>
            </div>
        `;
    }
}

// Ініціалізація сторінки кодів
async function initializeCodes() {
    console.log('🔑 Initializing codes page...');
    
    // Перевірка чи вже ініціалізовано
    const container = document.getElementById('codesContainer');
    if (codesInitialized && container && container.querySelector('.code-item')) {
        console.log('🔑 Codes already initialized with content');
        return;
    }
    
    // Отримання збереженої мови
    codesCurrentLanguage = getCurrentLanguage();
    
    const codesPage = document.getElementById('codesPage');
    if (!codesPage) {
        console.error('❌ Codes page not found');
        return;
    }
    
    // Завантаження перекладів та генерація контенту
    await loadCodesTranslations();
    
    // Оновлення заголовку сторінки
    if (codesTranslations && codesTranslations[codesCurrentLanguage]) {
        const titleElement = codesPage.querySelector('.title');
        if (titleElement) {
            titleElement.textContent = codesTranslations[codesCurrentLanguage].title;
        }
    }
    
    // Генерація контенту
    await generateCodesContent();
    
    codesInitialized = true;
    window.codesInitialized = true;
    
    console.log('✅ Codes page initialized successfully');
}

// Примусова реініціалізація
function forceReinitializeCodes() {
    console.log('🔄 Force reinitializing codes...');
    codesInitialized = false;
    window.codesInitialized = false;
    initializeCodes();
}

// Функція для налагодження
function debugCodes() {
    console.log('=== CODES DEBUG ===');
    console.log('Initialized:', codesInitialized);
    console.log('Current language:', codesCurrentLanguage);
    console.log('Container exists:', !!document.getElementById('codesContainer'));
    console.log('Page exists:', !!document.getElementById('codesPage'));
    console.log('Page is active:', document.getElementById('codesPage')?.classList.contains('active'));
    console.log('Translations loaded:', !!codesTranslations);
    if (codesTranslations) {
        console.log('Available languages:', Object.keys(codesTranslations));
        if (codesTranslations[codesCurrentLanguage]) {
            console.log(`Codes count for ${codesCurrentLanguage}:`, codesTranslations[codesCurrentLanguage].codes?.length);
        }
    }
    const container = document.getElementById('codesContainer');
    if (container) {
        console.log('Container innerHTML length:', container.innerHTML.length);
        console.log('Has code items:', !!container.querySelector('.code-item'));
    }
    console.log('Code states:', loadCodeStates());
    console.log('====================');
}

// Слухач зміни мови
document.addEventListener('languageChanged', function(e) {
    console.log('🔑 Codes received languageChanged event:', e.detail);
    if (e.detail && e.detail.language) {
        updateCodesLanguage(e.detail.language);
    }
});

// Обробник DOM готовності
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔑 DOM loaded, setting up codes...');
    
    // Ініціалізація якщо сторінка кодів вже активна
    setTimeout(() => {
        const codesPage = document.getElementById('codesPage');
        if (codesPage && codesPage.classList.contains('active')) {
            console.log('🔑 Codes page is active, initializing...');
            initializeCodes();
        }
    }, 100);
});

// Обробник кліку для перемикання сторінок
document.addEventListener('click', function(e) {
    if (e.target && e.target.getAttribute && e.target.getAttribute('data-page') === 'codes') {
        console.log('🔑 Codes page clicked, will initialize...');
        setTimeout(() => {
            const container = document.getElementById('codesContainer');
            if (!codesInitialized || !container || !container.querySelector('.code-item')) {
                console.log('🔑 Page switched to codes, initializing...');
                initializeCodes();
            } else {
                console.log('🔑 Codes already has content, skipping initialization');
            }
        }, 300);
    }
});

// Глобальні функції
window.copyCode = copyCode;
window.toggleCodeStatus = toggleCodeStatus;
window.updateCodesStats = updateCodesStats;
window.initializeCodes = initializeCodes;
window.updateCodesLanguage = updateCodesLanguage;
window.generateCodesContent = generateCodesContent;
window.debugCodes = debugCodes;
window.forceReinitializeCodes = forceReinitializeCodes;
window.codesInitialized = codesInitialized;

// Підтримка застарілих назв функцій
window.switchCodesLanguage = updateCodesLanguage;

console.log('✅ Codes.js loaded with multilingual support');
