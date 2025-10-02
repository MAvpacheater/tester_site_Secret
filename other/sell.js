// Trader Store JavaScript with Editing
let traderInitialized = false;
let isEditMode = false;

const traderData = {
    en: {
        title: "TRADER STORE",
        subtitle: "Tokens/Offers",
        items: [
            {
                tier: "VI",
                tierClass: "tier-vi",
                icon: "🔮",
                multiplier: "x4.7k",
                name: "3each",
                price: "5k",
                limit: "Only 100k per trade"
            },
            {
                tier: "II",
                tierClass: "tier-ii",
                icon: "🧪",
                multiplier: "x333",
                name: "1each",
                price: "5k",
                limit: "Only 50k per trade"
            },
            {
                tier: "II",
                tierClass: "tier-iii",
                icon: "🎯",
                multiplier: "x286",
                name: "50each",
                price: "5k",
                limit: "Only 10k per trade"
            },
            {
                tier: "III",
                tierClass: "tier-iii",
                icon: "💎",
                multiplier: "x169",
                name: "50each",
                price: "5k",
                limit: "Only 10k per trade"
            },
            {
                tier: "",
                tierClass: "",
                icon: "⚡",
                multiplier: "x1",
                name: "Dark Matter",
                price: "495",
                limit: "1/30m"
            }
        ],
        priceLabel: "Price:",
        editButton: "Edit Store",
        saveButton: "Save Changes",
        cancelButton: "Cancel"
    },
    uk: {
        title: "МАГАЗИН ТРЕЙДЕРА",
        subtitle: "Токени/Пропозиції",
        items: [
            {
                tier: "VI",
                tierClass: "tier-vi",
                icon: "🔮",
                multiplier: "x4.7k",
                name: "3each",
                price: "5k",
                limit: "Тільки 100k за трейд"
            },
            {
                tier: "II",
                tierClass: "tier-ii",
                icon: "🧪",
                multiplier: "x333",
                name: "1each",
                price: "5k",
                limit: "Тільки 50k за трейд"
            },
            {
                tier: "II",
                tierClass: "tier-iii",
                icon: "🎯",
                multiplier: "x286",
                name: "50each",
                price: "5k",
                limit: "Тільки 10k за трейд"
            },
            {
                tier: "III",
                tierClass: "tier-iii",
                icon: "💎",
                multiplier: "x169",
                name: "50each",
                price: "5k",
                limit: "Тільки 10k за трейд"
            },
            {
                tier: "",
                tierClass: "",
                icon: "⚡",
                multiplier: "x1",
                name: "Dark Matter",
                price: "495",
                limit: "1/30хв"
            }
        ],
        priceLabel: "Ціна:",
        editButton: "Редагувати",
        saveButton: "Зберегти",
        cancelButton: "Скасувати"
    },
    ru: {
        title: "МАГАЗИН ТРЕЙДЕРА",
        subtitle: "Токены/Предложения",
        items: [
            {
                tier: "VI",
                tierClass: "tier-vi",
                icon: "🔮",
                multiplier: "x4.7k",
                name: "3each",
                price: "5k",
                limit: "Только 100k за трейд"
            },
            {
                tier: "II",
                tierClass: "tier-ii",
                icon: "🧪",
                multiplier: "x333",
                name: "1each",
                price: "5k",
                limit: "Только 50k за трейд"
            },
            {
                tier: "II",
                tierClass: "tier-iii",
                icon: "🎯",
                multiplier: "x286",
                name: "50each",
                price: "5k",
                limit: "Только 10k за трейд"
            },
            {
                tier: "III",
                tierClass: "tier-iii",
                icon: "💎",
                multiplier: "x169",
                name: "50each",
                price: "5k",
                limit: "Только 10k за трейд"
            },
            {
                tier: "",
                tierClass: "",
                icon: "⚡",
                multiplier: "x1",
                name: "Dark Matter",
                price: "495",
                limit: "1/30мин"
            }
        ],
        priceLabel: "Цена:",
        editButton: "Редактировать",
        saveButton: "Сохранить",
        cancelButton: "Отменить"
    }
};

function initializeTrader() {
    if (traderInitialized) {
        console.log('⚠️ Trader already initialized');
        return;
    }

    const traderPage = document.getElementById('traderPage');
    if (!traderPage) {
        console.error('❌ Trader page element not found');
        return;
    }

    const currentLang = getCurrentAppLanguage() || 'en';
    loadTraderData();
    renderTraderStore(currentLang);
    
    traderInitialized = true;
    console.log('✅ Trader store initialized');
}

function loadTraderData() {
    const savedData = localStorage.getItem('traderStoreData');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            Object.keys(traderData).forEach(lang => {
                if (parsed[lang]) {
                    traderData[lang] = { ...traderData[lang], ...parsed[lang] };
                }
            });
        } catch (e) {
            console.error('Error loading trader data:', e);
        }
    }
}

function saveTraderData() {
    localStorage.setItem('traderStoreData', JSON.stringify(traderData));
}

function renderTraderStore(lang = 'en') {
    const traderPage = document.getElementById('traderPage');
    if (!traderPage) return;

    const data = traderData[lang] || traderData.en;
    
    const html = `
        <div class="trader-header">
            ${isEditMode ? `
                <input type="text" 
                    class="edit-title" 
                    value="${data.title}"
                    data-lang="${lang}"
                    data-field="title"
                    style="background: rgba(139,69,19,0.3); border: 2px solid #FFD700; color: #FFD700; 
                           font-size: 2.5em; text-align: center; padding: 10px; border-radius: 10px; 
                           width: 100%; max-width: 600px; margin: 0 auto; display: block;">
                <input type="text" 
                    class="edit-subtitle" 
                    value="${data.subtitle}"
                    data-lang="${lang}"
                    data-field="subtitle"
                    style="background: rgba(139,69,19,0.3); border: 2px solid #8B4513; color: #F5DEB3; 
                           font-size: 1.2em; text-align: center; padding: 8px; border-radius: 8px; 
                           width: 100%; max-width: 400px; margin: 15px auto 0; display: block;">
            ` : `
                <h1 class="trader-title">${data.title}</h1>
                <div class="trader-subtitle">${data.subtitle}</div>
            `}
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
            ${isEditMode ? `
                <button onclick="saveTraderChanges('${lang}')" 
                    style="background: linear-gradient(135deg, #2ECC71, #27AE60); color: white; 
                           border: none; padding: 12px 30px; border-radius: 8px; font-size: 1.1em; 
                           font-weight: 700; cursor: pointer; margin: 0 10px; box-shadow: 0 4px 15px rgba(46,204,113,0.4);">
                    ${data.saveButton || 'Save Changes'}
                </button>
                <button onclick="cancelTraderEdit('${lang}')" 
                    style="background: linear-gradient(135deg, #E74C3C, #C0392B); color: white; 
                           border: none; padding: 12px 30px; border-radius: 8px; font-size: 1.1em; 
                           font-weight: 700; cursor: pointer; margin: 0 10px; box-shadow: 0 4px 15px rgba(231,76,60,0.4);">
                    ${data.cancelButton || 'Cancel'}
                </button>
            ` : `
                <button onclick="toggleTraderEdit('${lang}')" 
                    style="background: linear-gradient(135deg, #3498DB, #2980B9); color: white; 
                           border: none; padding: 12px 30px; border-radius: 8px; font-size: 1.1em; 
                           font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(52,152,219,0.4);">
                    ${data.editButton || 'Edit Store'}
                </button>
            `}
        </div>
        
        <div class="trader-container">
            ${data.items.map((item, index) => `
                <div class="trader-card ${index >= 4 ? 'trader-empty' : ''}">
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
                                style="background: rgba(139,69,19,0.3); border: 2px solid #FFD700; color: #FFD700; 
                                       font-size: 1.4em; font-weight: 700; text-align: center; padding: 8px; 
                                       border-radius: 8px; width: 100%; margin-bottom: 10px;">
                            <input type="text" 
                                class="edit-name" 
                                value="${item.name}"
                                data-lang="${lang}"
                                data-index="${index}"
                                data-field="name"
                                style="background: rgba(139,69,19,0.3); border: 2px solid #8B4513; color: #F5DEB3; 
                                       font-size: 0.95em; text-align: center; padding: 8px; 
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
                                    style="background: rgba(139,69,19,0.4); border: 2px solid #FFD700; color: #FFD700; 
                                           font-size: 1.2em; font-weight: 700; text-align: center; padding: 6px; 
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
                                style="background: rgba(255,215,0,0.1); border: 2px solid #8B4513; color: #F5DEB3; 
                                       font-size: 0.85em; text-align: center; padding: 8px; 
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
    
    inputs.forEach(input => {
        const field = input.dataset.field;
        const index = input.dataset.index;
        const value = input.value.trim();
        
        if (index !== undefined) {
            traderData[lang].items[index][field] = value;
        } else {
            traderData[lang][field] = value;
        }
    });
    
    saveTraderData();
    isEditMode = false;
    renderTraderStore(lang);
    
    console.log('✅ Trader store data saved');
}

function cancelTraderEdit(lang) {
    isEditMode = false;
    loadTraderData();
    renderTraderStore(lang);
}

function updateTraderLanguage(lang) {
    if (!traderInitialized) return;
    renderTraderStore(lang);
}

// Global exports
window.initializeTrader = initializeTrader;
window.updateTraderLanguage = updateTraderLanguage;
window.toggleTraderEdit = toggleTraderEdit;
window.saveTraderChanges = saveTraderChanges;
window.cancelTraderEdit = cancelTraderEdit;

// Auto-initialize if page is active
document.addEventListener('DOMContentLoaded', () => {
    const traderPage = document.getElementById('traderPage');
    if (traderPage && traderPage.classList.contains('active')) {
        initializeTrader();
    }
});

// Listen for language changes
document.addEventListener('languageChanged', (e) => {
    updateTraderLanguage(e.detail.language);
});

console.log('✅ Trader store module loaded');
