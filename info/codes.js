// Codes functionality - виправлена версія з збереженням стану

// Codes data
const codesData = [
    { code: "pyramids", description: "Use for 3x stat boost for 72 hours (NEW)", isNew: true },
    { code: "egyptian", description: "Use for 3x stat boost for 72 hours (NEW)", isNew: true },
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

// Загрузка стану з sessionStorage
function loadCodeStates() {
    const savedStates = sessionStorage.getItem('codeStates');
    if (savedStates) {
        const states = JSON.parse(savedStates);
        codesData.forEach((code, index) => {
            if (states[code.code] !== undefined) {
                code.isUsed = states[code.code];
            }
        });
    }
}

// Збереження стану в sessionStorage  
function saveCodeStates() {
    const states = {};
    codesData.forEach(code => {
        states[code.code] = code.isUsed || false;
    });
    sessionStorage.setItem('codeStates', JSON.stringify(states));
}

// Розрахунок статистики
function calculateCodeStats() {
    const totalCodes = codesData.length;
    const usedCodes = codesData.filter(code => code.isUsed).length;
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
    const code = codesData[codeIndex];
    code.isUsed = !code.isUsed;
    
    // Оновлення UI
    const codeItem = toggleElement.closest('.code-item');
    
    if (code.isUsed) {
        toggleElement.classList.add('used');
        codeItem.classList.add('used');
    } else {
        toggleElement.classList.remove('used');
        codeItem.classList.remove('used');
    }
    
    // Збереження стану та оновлення статистики
    saveCodeStates();
    updateCodesStats();
}

// Оновлення статистики
function updateCodesStats() {
    const stats = calculateCodeStats();
    
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

// Генерація контенту
function generateCodesContent() {
    const container = document.getElementById('codesContainer');
    if (!container) return;

    // Завантаження збережених станів
    loadCodeStates();
    const stats = calculateCodeStats();
    
    let content = `
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
        <div class="codes-list">
    `;
    
    codesData.forEach((item, index) => {
        content += `
            <div class="code-item ${item.isUsed ? 'used' : ''}">
                <div class="code-content">
                    <div class="code-name">${item.code}${item.isNew ? ' (NEW)' : ''}</div>
                    <div class="code-description">${item.description}</div>
                </div>
                <div class="code-actions">
                    <button class="code-toggle ${item.isUsed ? 'used' : ''}" 
                            onclick="toggleCodeStatus(${index}, this)">
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
}

// Ініціалізація
function initializeCodes() {
    const codesPage = document.getElementById('codesPage');
    if (!codesPage) return;
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.id === 'codesPage' && target.classList.contains('active')) {
                    setTimeout(generateCodesContent, 100);
                }
            }
        });
    });
    
    observer.observe(codesPage, { attributes: true });
    
    if (codesPage.classList.contains('active')) {
        setTimeout(generateCodesContent, 100);
    }
}

// Глобальні функції
window.copyCode = copyCode;
window.toggleCodeStatus = toggleCodeStatus;
window.updateCodesStats = updateCodesStats;
window.initializeCodes = initializeCodes;

// Автоініціалізація
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initializeCodes, 100));
} else {
    setTimeout(initializeCodes, 100);
}
