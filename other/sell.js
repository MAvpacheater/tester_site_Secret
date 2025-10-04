let traderInitialized = false;
let isEditMode = false;
let traderData = {};
let itemImages = {};

async function loadTraderJSON() {
    try {
        const response = await fetch('other/sell.json');
        traderData = await response.json();
        return traderData;
    } catch (error) {
        console.error('Error loading trader data:', error);
        return null;
    }
}

async function initializeTrader() {
    if (traderInitialized) return;

    const traderPage = document.getElementById('traderPage');
    if (!traderPage) return;

    await loadTraderJSON();
    
    const currentLang = getCurrentAppLanguage() || 'en';
    renderTraderStore(currentLang);
    
    traderInitialized = true;
    console.log('✅ Trader initialized');
}

function handleImageUpload(event, index, lang) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        itemImages[`${lang}-${index}`] = e.target.result;
        renderTraderStore(lang);
    };
    reader.readAsDataURL(file);
}

function renderTraderStore(lang = 'en') {
    const traderPage = document.getElementById('traderPage');
    if (!traderPage || !traderData[lang]) return;

    const data = traderData[lang];
    const items = data.items || [];
    
    const html = `
        ${!isEditMode ? `
            <button class="trader-settings-btn" onclick="toggleTraderEdit('${lang}')" title="${data.editButton}">⚙️</button>
        ` : ''}
        
        <div class="trader-header">
            ${isEditMode ? `
                <input type="text" class="edit-title" value="${data.title}" data-lang="${lang}" data-field="title" style="font-size: 2.5em;">
                <input type="text" class="edit-subtitle" value="${data.subtitle}" data-lang="${lang}" data-field="subtitle" style="font-size: 1.2em; margin-top: 15px;">
            ` : `
                <h1 class="trader-title">${data.title}</h1>
                <div class="trader-subtitle">${data.subtitle}</div>
            `}
        </div>
        
        ${isEditMode ? `
            <div style="text-align: center; margin: 30px 0;">
                <button onclick="saveTraderChanges('${lang}')" class="trader-btn trader-btn-save">${data.saveButton}</button>
                <button onclick="cancelTraderEdit('${lang}')" class="trader-btn trader-btn-cancel">${data.cancelButton}</button>
            </div>
        ` : ''}
        
        <div class="trader-container">
            ${items.map((item, index) => {
                const imageKey = `${lang}-${index}`;
                const hasImage = itemImages[imageKey];
                
                return `
                <div class="trader-card">
                    <div class="trader-image-container">
                        ${isEditMode ? `
                            <label class="trader-upload-area" for="file-${lang}-${index}">
                                ${hasImage ? `<img src="${itemImages[imageKey]}" alt="${item.name}">` : `
                                    <div class="upload-icon">📸</div>
                                    <div class="upload-text">Click to upload</div>
                                `}
                            </label>
                            <input type="file" id="file-${lang}-${index}" class="trader-file-input" accept="image/*" onchange="handleImageUpload(event, ${index}, '${lang}')">
                        ` : hasImage ? `
                            <img src="${itemImages[imageKey]}" alt="${item.name}">
                        ` : `
                            <div class="trader-image-placeholder">${item.icon || '🎃'}</div>
                        `}
                    </div>
                    
                    <div class="trader-card-body">
                        ${isEditMode ? `
                            <input type="text" class="edit-name" value="${item.name || ''}" data-lang="${lang}" data-index="${index}" data-field="name" placeholder="Item Name">
                        ` : `
                            <div class="trader-name">${item.name || ''}</div>
                        `}
                        
                        <div class="trader-price">
                            <span class="price-label">${data.priceLabel}</span>
                            ${isEditMode ? `
                                <input type="text" class="edit-price" value="${item.price || ''}" data-lang="${lang}" data-index="${index}" data-field="price" placeholder="Price" style="width: 100px; font-size: 1.2em;">
                            ` : `
                                <span class="price-value">${item.price || ''}</span>
                            `}
                        </div>
                        
                        ${isEditMode ? `
                            <input type="text" class="edit-quantity" value="${item.quantity || ''}" data-lang="${lang}" data-index="${index}" data-field="quantity" placeholder="Quantity">
                        ` : `
                            <div class="trader-quantity">${item.quantity || ''}</div>
                        `}
                    </div>
                </div>
            `}).join('')}
        </div>
    `;
    
    traderPage.innerHTML = html;
}

function toggleTraderEdit(lang) {
    isEditMode = !isEditMode;
    renderTraderStore(lang);
}

function saveTraderChanges(lang) {
    const inputs = document.querySelectorAll('[data-lang]');
    
    inputs.forEach(input => {
        const field = input.dataset.field;
        const index = input.dataset.index;
        const value = input.value.trim();
        
        if (index !== undefined) {
            const idx = parseInt(index);
            if (!traderData[lang].items[idx]) {
                traderData[lang].items[idx] = {};
            }
            traderData[lang].items[idx][field] = value;
        } else {
            traderData[lang][field] = value;
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
    if (!traderInitialized) return;
    renderTraderStore(lang);
}

window.initializeTrader = initializeTrader;
window.updateTraderLanguage = updateTraderLanguage;
window.toggleTraderEdit = toggleTraderEdit;
window.saveTraderChanges = saveTraderChanges;
window.cancelTraderEdit = cancelTraderEdit;
window.handleImageUpload = handleImageUpload;

document.addEventListener('languageChanged', (e) => {
    updateTraderLanguage(e.detail.language);
});

console.log('✅ Trader module loaded');
