// Trader Store JavaScript
let traderInitialized = false;

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
                limit: "Only 100k per trade"
            },
            {
                tier: "II",
                tierClass: "tier-ii",
                icon: "🧪",
                multiplier: "x333",
                name: "1each",
                limit: "Only 50k per trade"
            },
            {
                tier: "II",
                tierClass: "tier-iii",
                icon: "🎯",
                multiplier: "x286",
                name: "50each",
                limit: "Only 10k per trade"
            },
            {
                tier: "III",
                tierClass: "tier-iii",
                icon: "💎",
                multiplier: "x169",
                name: "50each",
                limit: "Only 10k per trade"
            },
            {
                tier: "",
                tierClass: "",
                icon: "⚡",
                multiplier: "x1",
                name: "Dark Matter",
                limit: "1/30m"
            }
        ],
        priceLabel: "Price:",
        priceValue: "5k",
        priceValueDM: "495"
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
                limit: "Тільки 100k за трейд"
            },
            {
                tier: "II",
                tierClass: "tier-ii",
                icon: "🧪",
                multiplier: "x333",
                name: "1each",
                limit: "Тільки 50k за трейд"
            },
            {
                tier: "II",
                tierClass: "tier-iii",
                icon: "🎯",
                multiplier: "x286",
                name: "50each",
                limit: "Тільки 10k за трейд"
            },
            {
                tier: "III",
                tierClass: "tier-iii",
                icon: "💎",
                multiplier: "x169",
                name: "50each",
                limit: "Тільки 10k за трейд"
            },
            {
                tier: "",
                tierClass: "",
                icon: "⚡",
                multiplier: "x1",
                name: "Dark Matter",
                limit: "1/30хв"
            }
        ],
        priceLabel: "Ціна:",
        priceValue: "5k",
        priceValueDM: "495"
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
                limit: "Только 100k за трейд"
            },
            {
                tier: "II",
                tierClass: "tier-ii",
                icon: "🧪",
                multiplier: "x333",
                name: "1each",
                limit: "Только 50k за трейд"
            },
            {
                tier: "II",
                tierClass: "tier-iii",
                icon: "🎯",
                multiplier: "x286",
                name: "50each",
                limit: "Только 10k за трейд"
            },
            {
                tier: "III",
                tierClass: "tier-iii",
                icon: "💎",
                multiplier: "x169",
                name: "50each",
                limit: "Только 10k за трейд"
            },
            {
                tier: "",
                tierClass: "",
                icon: "⚡",
                multiplier: "x1",
                name: "Dark Matter",
                limit: "1/30мин"
            }
        ],
        priceLabel: "Цена:",
        priceValue: "5k",
        priceValueDM: "495"
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
    renderTraderStore(currentLang);
    
    traderInitialized = true;
    console.log('✅ Trader store initialized');
}

function renderTraderStore(lang = 'en') {
    const traderPage = document.getElementById('traderPage');
    if (!traderPage) return;

    const data = traderData[lang] || traderData.en;
    
    const html = `
        <div class="trader-header">
            <h1 class="trader-title">${data.title}</h1>
            <div class="trader-subtitle">${data.subtitle}</div>
        </div>
        
        <div class="trader-container">
            ${data.items.map((item, index) => `
                <div class="trader-card ${index >= 4 ? 'trader-empty' : ''}">
                    <div class="trader-card-header">
                        <div class="trader-icon">${item.icon}</div>
                        ${item.tier ? `<div class="trader-tier ${item.tierClass}">${item.tier}</div>` : ''}
                    </div>
                    
                    <div class="trader-card-body">
                        <div class="trader-name">${item.multiplier}</div>
                        <div class="trader-info">${item.name}</div>
                        
                        <div class="trader-price">
                            <span class="price-label">${data.priceLabel}</span>
                            <span class="price-value">${index === 4 ? data.priceValueDM : data.priceValue}</span>
                        </div>
                        
                        <div class="trader-limit">${item.limit}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    traderPage.innerHTML = html;
}

function updateTraderLanguage(lang) {
    if (!traderInitialized) return;
    renderTraderStore(lang);
}

// Global exports
window.initializeTrader = initializeTrader;
window.updateTraderLanguage = updateTraderLanguage;

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
