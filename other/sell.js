let traderInitialized = false;
let isEditMode = false;
let traderData = {};
let traderItems = {};

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

function loadLocalTraderData() {
    const savedItems = localStorage.getItem('traderStoreItems');
    if (savedItems) {
        try {
            traderItems = JSON.parse(savedItems);
        } catch (e) {
            console.error('Error loading local trader items:', e);
            traderItems = {};
        }
    }
}

function saveTraderItems() {
    try {
        localStorage.setItem('traderStoreItems', JSON.stringify(traderItems));
    } catch (e) {
        console.error('Error saving trader items:', e);
    }
}

function getItems(lang) {
    if (traderItems[lang] && traderItems[lang].length > 0) {
        return traderItems[lang];
    }
    return traderData[lang]?.items || [];
}

async function initializeTrader() {
    if (traderInitialized) {
        console.log('⚠️ Trader already initialized');
        return;
    }

    const traderPage = document.getElementById('traderPage');
    if (!traderPage) {
        console.error('❌ Trader page element not found');
        return;
    }

    await loadTraderJSON();
    loadLocalTraderData();
    
    const currentLang = getCurrentAppLanguage() || 'en';
    renderTraderStore(currentLang);
    
    traderInitialized = true;
    console.log('✅ Trader store initialized');
}

function renderTraderStore(lang = 'en') {
    const traderPage = document.getElementById('traderPage');
    if (!traderPage || !traderData[lang]) return;

    const data = traderData[lang];
    const items = getItems(lang);
    
    const html = `
        ${!isEditMode ? `
            <button class="trader-settings-btn" onclick="toggleTraderEdit('${lang}')" title="${data.editButton}">
                ⚙️
            </button>
        ` : ''}
        
        <div class="trader-header">
            ${isEditMode ? `
                <input type="text" 
                    class="edit-title" 
                    value="${data.title}"
                    data-lang="${lang}"
                    data-field="title"
                    style="font-size: 2.5em; text-align: center; padding: 10px; border-radius: 10px; 
                           width: 100%; max-width: 600px; margin: 0 auto; display: block;">
                <input type="text" 
                    class="edit-subtitle" 
                    value="${data.subtitle}"
                    data-lang="${lang}"
                    data-field="subtitle"
                    style="font-size: 1.2em; text-align: center; padding: 8px; border-radius: 8px; 
                           width: 100%; max-width: 400px; margin: 15px auto 0; display: block;">
            ` : `
                <h1 class="trader-title">${data.title}</h1>
                <div class="trader-subtitle">${data.subtitle}</div>
            `}
        </div>
        
        ${isEditMode ? `
            <div style="text-align: center; margin: 30px 0;">
                <button onclick="saveTraderChanges('${lang}')" class="trader-btn trader-btn-save">
                    ${data.saveButton}
                </button>
                <button onclick="cancelTraderEdit('${lang}')" class="trader-btn trader-btn-cancel">
                    ${data.cancelButton}
                </button>
            </div>
        ` : ''}
        
        <div class="trader-container">
            ${items.map((item, index) => `
                <div class="trader-card">
                    <div class="trader-card-header">
                        <div class="trader-icon">${item.icon}</div>
                        ${item.tier ? `<div class="trader-tier ${item.tierClass}">${item.tier}</div>` : ''}
                    </div>
                    
                    <div class="trader-card-body">
                        ${isEditMode ? `
                            <input type="text" 
                                class="edit-multiplier" 
                                value="${item.multiplier}"
                                data-lang="${lang}"
                                data-index="${index}"
                                data-field="multiplier"
                                style="font-size: 1.4em; font-weight: 700; text-align: center; padding: 8px; 
                                       border-radius: 8px; width: 100%; margin-bottom: 10px;">
                            <input type="text" 
                                class="edit-name" 
                                value="${item.name}"
                                data-lang="${lang}"
                                data-index="${index}"
                                data-field="name"
                                style="font-size: 0.95em; text-align: center; padding: 8px; 
                                       border-radius: 8px; width: 100%; margin-bottom: 15px;">
                        ` : `
                            <div class="trader-name">${item.multiplier}</div>
                            <div class="trader-info">${item.name}</div>
                        `}
                        
                        <div class="trader-price">
                            <span class="price-label">${data.priceLabel}</span>
                            ${isEditMode ? `
                                <input type="text" 
                                    class="edit-price" 
                                    value="${item.price}"
                                    data-lang="${lang}"
                                    data-index="${index}"
                                    data-field="price"
                                    style="font-size: 1.2em; font-weight: 700; text-align: center; padding: 6px; 
                                           border-radius: 6px; width: 80px;">
                            ` : `
                                <span class="price-value">${item.price}</span>
                            `}
                        </div>
                        
                        ${isEditMode ? `
                            <input type="text" 
                                class="edit-limit" 
                                value="${item.limit}"
                                data-lang="${lang}"
                                data-index="${index}"
                                data-field="limit"
                                style="font-size: 0.85em; text-align: center; padding: 8px; 
                                       border-radius: 8px; width: 100%; margin-top: 12px; font-style: italic;">
                        ` : `
                            <div class="trader-limit">${item.limit}</div>
                        `}
                    </div>
                </div>
            `).join('')}
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
    
    if (!traderItems[lang]) {
        traderItems[lang] = JSON.parse(JSON.stringify(getItems(lang)));
    }
    
    inputs.forEach(input => {
        const field = input.dataset.field;
        const index = input.dataset.index;
        const value = input.value.trim();
        
        if (index !== undefined) {
            if (!traderItems[lang][index]) {
                traderItems[lang][index] = {};
            }
            traderItems[lang][index][field] = value;
        } else {
            traderData[lang][field] = value;
        }
    });
    
    saveTraderItems();
    isEditMode = false;
    renderTraderStore(lang);
    
    console.log('✅ Trader store data saved');
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

document.addEventListener('DOMContentLoaded', () => {
    const traderPage = document.getElementById('traderPage');
    if (traderPage && traderPage.classList.contains('active')) {
        initializeTrader();
    }
});

document.addEventListener('languageChanged', (e) => {
    updateTraderLanguage(e.detail.language);
});

console.log('✅ Trader store module loaded');
