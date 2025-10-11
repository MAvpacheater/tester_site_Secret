// Trader Module - Fixed Version with Proper Path Handling
let traderInitialized = false;
let isEditMode = false;
let traderData = null;
let itemImages = {};
let pageBackground = null;
let currentLang = 'en';
let isTraderVisible = false;

// Get Base Path for Module
function getTraderBasePath() {
    const { protocol, host, pathname } = window.location;
    
    // GitHub Pages
    if (host === 'mavpacheater.github.io') {
        return `${protocol}//${host}/tester_site_Secret/AWS/`;
    }
    
    // Localhost
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
        const pathParts = pathname.split('/').filter(Boolean);
        if (pathParts.length > 0 && pathParts[0] !== 'AWS') {
            return `${protocol}//${host}/${pathParts[0]}/AWS/`;
        }
        return `${protocol}//${host}/AWS/`;
    }
    
    // Default
    return '/AWS/';
}

const TRADER_BASE_PATH = getTraderBasePath();
console.log('📁 Trader Base Path:', TRADER_BASE_PATH);

// Кешування DOM елементів
const traderCache = {
    page: null,
    lastRender: 0,
    renderDelay: 100
};

async function loadTraderJSON() {
    if (traderData) return traderData;
    
    try {
        const jsonPath = `${TRADER_BASE_PATH}other/sell.json`;
        
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        traderData = await response.json();
        return traderData;
    } catch (error) {
        return null;
    }
}

async function initializeTrader() {
    if (traderInitialized) {
        console.log('⚠️ Trader already initialized, re-rendering...');
        currentLang = getCurrentAppLanguage?.() || 'en';
        renderTraderStore(currentLang);
        return;
    }

    traderCache.page = document.getElementById('traderPage');
    if (!traderCache.page) {
        console.error('❌ Trader page not found');
        return;
    }

    console.log('🚀 Initializing Trader...');
    await loadTraderJSON();
    
    currentLang = getCurrentAppLanguage?.() || 'en';
    
    const isVisible = traderCache.page.offsetParent !== null;
    console.log('👁️ Trader page visible:', isVisible);
    
    if (isVisible) {
        renderTraderStore(currentLang);
        isTraderVisible = true;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isTraderVisible = entry.isIntersecting;
            console.log('🔄 Trader visibility changed:', isTraderVisible);
            
            if (isTraderVisible && !traderCache.page.innerHTML) {
                renderTraderStore(currentLang);
            }
        });
    });
    
    observer.observe(traderCache.page);
    
    traderInitialized = true;
}

function handleBackgroundUpload(event) {
    const file = event.target.files[0];
    if (!file || file.size > 10000000) {
        if (file?.size > 10000000) {
            alert('Image too large! Max 10MB');
        }
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        pageBackground = e.target.result;
        applyPageBackground();
    };
    reader.readAsDataURL(file);
}

function applyPageBackground() {
    if (!traderCache.page) return;
    
    if (pageBackground) {
        const style = traderCache.page.querySelector('style') || document.createElement('style');
        style.textContent = `
            #traderPage::before {
                background-image: url('${pageBackground}'), 
                    radial-gradient(circle at 20% 50%, rgba(255,100,0,0.08) 0%, transparent 50%),
                    radial-gradient(circle at 80% 50%, rgba(138,43,226,0.08) 0%, transparent 50%) !important;
                background-blend-mode: overlay, normal, normal;
            }
        `;
        if (!traderCache.page.querySelector('style')) {
            traderCache.page.appendChild(style);
        }
        traderCache.page.classList.add('has-custom-bg');
    } else {
        const style = traderCache.page.querySelector('style');
        if (style) style.remove();
        traderCache.page.classList.remove('has-custom-bg');
    }
}

function removePageBackground() {
    pageBackground = null;
    applyPageBackground();
}

function handleImageUpload(event, index, lang) {
    const file = event.target.files[0];
    if (!file || file.size > 5000000) {
        if (file?.size > 5000000) {
            alert('Image too large! Max 5MB');
        }
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        itemImages[`${lang}-${index}`] = e.target.result;
        
        const imgContainer = document.querySelector(`[data-img-id="${lang}-${index}"]`);
        if (imgContainer) {
            imgContainer.innerHTML = `<img src="${e.target.result}" alt="Item ${index}">`;
        }
    };
    reader.readAsDataURL(file);
}

function renderTraderStore(lang = 'en') {
    const now = Date.now();
    if (now - traderCache.lastRender < traderCache.renderDelay) {
        return;
    }
    traderCache.lastRender = now;

    if (!traderCache.page) {
        return;
    }
    
    if (!traderData?.[lang]) {
        return;
    }

    const data = traderData[lang];
    const items = data.items || [];
    
    const fragment = document.createDocumentFragment();
    const container = document.createElement('div');
    
    container.innerHTML = `
        ${!isEditMode ? `
            <button class="trader-settings-btn" onclick="toggleTraderEdit('${lang}')" title="${data.editButton}">⚙️</button>
        ` : `
            <label for="trader-bg-upload" class="trader-bg-btn" title="Upload Background">🖼️</label>
            <input type="file" id="trader-bg-upload" class="trader-bg-input" accept="image/*" onchange="handleBackgroundUpload(event)">
        `}
        
        <div class="trader-header">
            ${isEditMode ? `
                <input type="text" class="edit-title" value="${data.title}" data-lang="${lang}" data-field="title">
                <input type="text" class="edit-subtitle" value="${data.subtitle}" data-lang="${lang}" data-field="subtitle">
            ` : `
                <h1 class="trader-title">${data.title}</h1>
                <div class="trader-subtitle">${data.subtitle}</div>
            `}
        </div>
        
        ${isEditMode ? `
            <div style="text-align: center; margin: 20px 0;">
                <button onclick="saveTraderChanges('${lang}')" class="trader-btn trader-btn-save">${data.saveButton}</button>
                <button onclick="cancelTraderEdit('${lang}')" class="trader-btn trader-btn-cancel">${data.cancelButton}</button>
                ${pageBackground ? `<button onclick="removePageBackground()" class="trader-btn" style="background: linear-gradient(135deg, #666, #444); border-color: #666;">🗑️ Remove Background</button>` : ''}
            </div>
        ` : ''}
        
        <div class="trader-container">
            ${items.map((item, index) => createItemCard(item, index, lang, data, isEditMode)).join('')}
        </div>
    `;
    
    fragment.appendChild(container);
    
    traderCache.page.innerHTML = '';
    traderCache.page.appendChild(fragment.firstChild);
    
    applyPageBackground();
}

function createItemCard(item, index, lang, data, editMode) {
    const imageKey = `${lang}-${index}`;
    const hasImage = itemImages[imageKey];
    
    return `
        <div class="trader-card">
            <div class="trader-image-container" data-img-id="${imageKey}">
                ${editMode ? `
                    <label class="trader-upload-area" for="file-${imageKey}">
                        ${hasImage ? `<img src="${itemImages[imageKey]}" alt="${item.name}">` : `
                            <div class="upload-icon">📸</div>
                            <div class="upload-text">Click</div>
                        `}
                    </label>
                    <input type="file" id="file-${imageKey}" class="trader-file-input" accept="image/*" onchange="handleImageUpload(event, ${index}, '${lang}')">
                ` : hasImage ? `
                    <img src="${itemImages[imageKey]}" alt="${item.name}">
                ` : `
                    <div class="trader-image-placeholder">${item.icon || '🎃'}</div>
                `}
            </div>
            
            <div class="trader-card-body">
                ${editMode ? `
                    <input type="text" class="edit-name" value="${item.name || ''}" data-lang="${lang}" data-index="${index}" data-field="name">
                ` : `
                    <div class="trader-name">${item.name || ''}</div>
                `}
                
                <div class="trader-price">
                    <span class="price-label">${data.priceLabel}</span>
                    ${editMode ? `
                        <input type="text" class="edit-price" value="${item.price || ''}" data-lang="${lang}" data-index="${index}" data-field="price">
                    ` : `
                        <span class="price-value">${item.price || ''}</span>
                    `}
                </div>
                
                ${editMode ? `
                    <input type="text" class="edit-quantity" value="${item.quantity || ''}" data-lang="${lang}" data-index="${index}" data-field="quantity">
                ` : `
                    <div class="trader-quantity">${item.quantity || ''}</div>
                `}
            </div>
        </div>
    `;
}

function toggleTraderEdit(lang) {
    isEditMode = !isEditMode;
    renderTraderStore(lang);
}

function saveTraderChanges(lang) {
    const inputs = document.querySelectorAll('[data-lang]');
    
    const updates = {};
    
    inputs.forEach(input => {
        const field = input.dataset.field;
        const index = input.dataset.index;
        const value = input.value.trim();
        
        if (index !== undefined) {
            const idx = parseInt(index);
            if (!updates[idx]) updates[idx] = {};
            updates[idx][field] = value;
        } else {
            if (!updates.global) updates.global = {};
            updates.global[field] = value;
        }
    });
    
    Object.keys(updates).forEach(key => {
        if (key === 'global') {
            Object.assign(traderData[lang], updates.global);
        } else {
            const idx = parseInt(key);
            if (!traderData[lang].items[idx]) {
                traderData[lang].items[idx] = {};
            }
            Object.assign(traderData[lang].items[idx], updates[key]);
        }
    });
    
    isEditMode = false;
    renderTraderStore(lang);
}

function cancelTraderEdit(lang) {
    isEditMode = false;
    renderTraderStore(lang);
}

function updateTraderLanguage(lang) {
    currentLang = lang;
    
    const traderPage = document.getElementById('traderPage');
    const isActive = traderPage?.classList.contains('active');
    
    if (isActive || isTraderVisible) {
        renderTraderStore(lang);
    }
}

// Експорт функцій
window.initializeTrader = initializeTrader;
window.updateTraderLanguage = updateTraderLanguage;
window.toggleTraderEdit = toggleTraderEdit;
window.saveTraderChanges = saveTraderChanges;
window.cancelTraderEdit = cancelTraderEdit;
window.handleImageUpload = handleImageUpload;
window.handleBackgroundUpload = handleBackgroundUpload;
window.removePageBackground = removePageBackground;

// Слухач зміни мови з debounce
let langChangeTimeout;
document.addEventListener('languageChanged', (e) => {
    clearTimeout(langChangeTimeout);
    langChangeTimeout = setTimeout(() => {
        updateTraderLanguage(e.detail.language);
    }, 150);
});
