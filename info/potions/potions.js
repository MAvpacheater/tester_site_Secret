// Potions functionality with multilingual support

let potionsCurrentLanguage = 'en';
let potionsTranslations = null;
let potionsInitialized = false;
let currentPotionsType = 'potions';
let currentRarityFilter = 'all';

// Get language from localStorage
function getCurrentLanguage() {
    return localStorage.getItem('armHelper_language') || 'en';
}

// Load translations from external file (same folder)
async function loadPotionsTranslations() {
    if (potionsTranslations) return potionsTranslations;
    
    try {
        console.log('📥 Loading potions translations...');
        const response = await fetch('info/potions/potions.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        potionsTranslations = await response.json();
        console.log('✅ Potions translations loaded');
    } catch (error) {
        console.error('❌ Failed to load potions translations:', error);
        throw error;
    }
    return potionsTranslations;
}

// Update language
function updatePotionsLanguage(newLanguage) {
    console.log(`🧪 Potions language: ${potionsCurrentLanguage} → ${newLanguage}`);
    
    if (newLanguage === potionsCurrentLanguage) return;
    potionsCurrentLanguage = newLanguage;
    
    // Update title if exists
    const potionsPage = document.getElementById('potionsPage');
    if (potionsPage) {
        const titleElement = potionsPage.querySelector('.title');
        if (titleElement && potionsTranslations?.[newLanguage]) {
            titleElement.textContent = potionsTranslations[newLanguage].title;
        }
    }
    
    // Regenerate content
    if (potionsInitialized) {
        setTimeout(generatePotionsContent, 100);
    }
}

// Get unique rarities from data
function getAvailableRarities(data) {
    const potions = data.potions || [];
    const food = data.food || [];
    const allItems = [...potions, ...food];
    const rarities = [...new Set(allItems.map(item => item.rarity))];
    return rarities.sort();
}

// Create image element with error handling
function createPotionImage(item) {
    const imageUrl = item.image || 'https://via.placeholder.com/150x112/667eea/ffffff?text=No+Image';
    
    return `
        <img src="${imageUrl}" 
             alt="${item.name}" 
             class="potion-image loading"
             loading="lazy"
             onerror="this.onerror=null; this.src='https://via.placeholder.com/150x112/667eea/ffffff?text=No+Image'; this.classList.add('error'); this.classList.remove('loading');"
             onload="this.classList.remove('loading');">
    `;
}

// Create rarity filter buttons
function createRarityFilters(data) {
    const rarities = getAvailableRarities(data);
    
    let filtersHTML = `
        <button class="rarity-filter-btn all active" 
                data-rarity="all" 
                onclick="setRarityFilter('all')">
            ${data.filterAll || 'All'}
        </button>
    `;
    
    rarities.forEach(rarity => {
        const rarityKey = `filter${rarity.charAt(0).toUpperCase() + rarity.slice(1)}`;
        const rarityLabel = data[rarityKey] || rarity.toUpperCase();
        
        filtersHTML += `
            <button class="rarity-filter-btn ${rarity}" 
                    data-rarity="${rarity}" 
                    onclick="setRarityFilter('${rarity}')">
                ${rarityLabel}
            </button>
        `;
    });
    
    return filtersHTML;
}

// Switch between potions/food
function switchPotionsType(type) {
    console.log(`🔄 Switching to: ${type}`);
    
    if (type !== 'potions' && type !== 'food') return;
    currentPotionsType = type;
    
    // Update buttons
    document.querySelectorAll('.potions-switch-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-potions-type') === type);
    });
    
    // Update sections
    document.querySelectorAll('.potions-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const activeSection = document.getElementById(`${type}Section`);
    if (activeSection) {
        activeSection.classList.add('active');
        currentRarityFilter = 'all';
        updateRarityFilterButtons();
        filterByRarity();
    }
}

// Set rarity filter
function setRarityFilter(rarity) {
    console.log(`🔍 Filter: ${rarity}`);
    
    currentRarityFilter = (rarity === currentRarityFilter && rarity !== 'all') ? 'all' : rarity;
    updateRarityFilterButtons();
    filterByRarity();
}

// Update filter buttons
function updateRarityFilterButtons() {
    document.querySelectorAll('.rarity-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-rarity') === currentRarityFilter);
    });
}

// Filter items by rarity
function filterByRarity() {
    const activeSection = document.querySelector('.potions-section.active');
    if (!activeSection) return;
    
    const items = activeSection.querySelectorAll('.potion-item');
    let visibleCount = 0;
    
    items.forEach(item => {
        const itemRarity = item.getAttribute('data-rarity');
        const shouldShow = currentRarityFilter === 'all' || itemRarity === currentRarityFilter;
        
        if (shouldShow) {
            item.classList.remove('hidden');
            item.style.animationDelay = `${visibleCount * 50}ms`;
            visibleCount++;
        } else {
            item.classList.add('hidden');
        }
    });
}

// Generate content
async function generatePotionsContent() {
    const potionsPage = document.getElementById('potionsPage');
    if (!potionsPage) return console.error('❌ Potions page not found');
    
    potionsCurrentLanguage = getCurrentLanguage();
    
    try {
        if (!potionsTranslations) await loadPotionsTranslations();
        
        const data = potionsTranslations[potionsCurrentLanguage];
        if (!data) throw new Error(`No potions data for language: ${potionsCurrentLanguage}`);
        
        // Show loading
        potionsPage.innerHTML = `
            <h1 class="title">${data.title}</h1>
            <div class="potions-container" id="potionsContainer">
                <div class="potions-loading">${data.loading || 'Loading...'}</div>
            </div>
        `;
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Generate potions HTML (without time field)
        const potionsHTML = (data.potions || []).map((item, index) => `
            <div class="potion-item" data-rarity="${item.rarity}" style="animation-delay: ${index * 50}ms;">
                ${createPotionImage(item)}
                <div class="potion-main-content">
                    <div class="potion-name">${item.name}</div>
                    <div class="potion-boost">${item.boost}</div>
                </div>
                <div class="potion-meta">
                    <div class="potion-rarity ${item.rarity}">${item.rarity.toUpperCase()}</div>
                </div>
            </div>
        `).join('');
        
        // Generate food HTML (without time field)
        const foodHTML = (data.food || []).map((item, index) => `
            <div class="potion-item" data-rarity="${item.rarity}" style="animation-delay: ${index * 50}ms;">
                ${createPotionImage(item)}
                <div class="potion-main-content">
                    <div class="potion-name">${item.name}</div>
                    <div class="potion-boost">${item.boost}</div>
                </div>
                <div class="potion-meta">
                    <div class="potion-rarity ${item.rarity}">${item.rarity.toUpperCase()}</div>
                </div>
            </div>
        `).join('');
        
        // Build full HTML
        const fullHTML = `
            <div class="potions-switcher">
                <button class="potions-switch-btn active" data-potions-type="potions" onclick="switchPotionsType('potions')">
                    ${data.switcherPotions || '🧪 Potions'}
                </button>
                <button class="potions-switch-btn" data-potions-type="food" onclick="switchPotionsType('food')">
                    ${data.switcherFood || '🍖 Food'}
                </button>
            </div>
            
            <div class="rarity-filter-controls">
                ${createRarityFilters(data)}
            </div>
            
            <div class="potions-section active" id="potionsSection">
                ${potionsHTML}
            </div>
            
            <div class="potions-section" id="foodSection">
                ${foodHTML}
            </div>
        `;
        
        const container = document.getElementById('potionsContainer');
        if (container) {
            container.innerHTML = fullHTML;
        }
        
        // Reset state
        currentPotionsType = 'potions';
        currentRarityFilter = 'all';
        
        console.log(`✅ Generated ${data.potions?.length || 0} potions and ${data.food?.length || 0} foods in ${potionsCurrentLanguage}`);
    } catch (error) {
        console.error('❌ Error generating potions:', error);
        potionsPage.innerHTML = `
            <h1 class="title">Potions & Food</h1>
            <div class="potions-container">
                <div class="potions-error" style="text-align: center; padding: 40px; color: #FFD700;">
                    ⚠️ Error loading potions data<br><br>
                    <button class="retry-btn" onclick="initializePotions()" style="background: linear-gradient(135deg, #FFD700, #FFA500); color: #2F1B14; border: none; padding: 12px 24px; border-radius: 12px; cursor: pointer; font-weight: 700; margin-top: 10px;">RETRY</button>
                </div>
            </div>
        `;
    }
}

// Initialize potions
async function initializePotions() {
    if (potionsInitialized) {
        console.log('🔄 Potions already initialized');
        return;
    }
    
    console.log('🧪 Initializing potions...');
    
    potionsCurrentLanguage = getCurrentLanguage();
    
    try {
        await loadPotionsTranslations();
        await generatePotionsContent();
        
        potionsInitialized = true;
        window.potionsInitialized = true;
        console.log('✅ Potions initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize potions:', error);
        const page = document.getElementById('potionsPage');
        if (page) {
            page.innerHTML = `
                <h1 class="title">Potions & Food</h1>
                <div class="potions-container">
                    <div class="potions-error" style="text-align: center; padding: 40px; color: #FFD700;">
                        ⚠️ Failed to load potions data<br><br>
                        <button class="retry-btn" onclick="initializePotions()" style="background: linear-gradient(135deg, #FFD700, #FFA500); color: #2F1B14; border: none; padding: 12px 24px; border-radius: 12px; cursor: pointer; font-weight: 700; margin-top: 10px;">RETRY</button>
                    </div>
                </div>
            `;
        }
    }
}

// Event listeners
document.addEventListener('languageChanged', (e) => {
    if (e.detail?.language) updatePotionsLanguage(e.detail.language);
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const page = document.getElementById('potionsPage');
        if (page?.classList.contains('active')) initializePotions();
    }, 100);
});

document.addEventListener('click', (e) => {
    if (e.target?.getAttribute('data-page') === 'potions') {
        setTimeout(() => {
            if (!potionsInitialized) {
                initializePotions();
            }
        }, 300);
    }
});

// Observer for page activation
const potionsObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const potionsPage = document.getElementById('potionsPage');
            if (potionsPage?.classList.contains('active') && !potionsInitialized) {
                console.log('🧪 Potions page activated, initializing...');
                initializePotions();
            }
        }
    });
});

// Start observing
document.addEventListener('DOMContentLoaded', () => {
    const potionsPage = document.getElementById('potionsPage');
    if (potionsPage) {
        potionsObserver.observe(potionsPage, { attributes: true });
    }
});

// Global exports
window.initializePotions = initializePotions;
window.updatePotionsLanguage = updatePotionsLanguage;
window.generatePotionsContent = generatePotionsContent;
window.switchPotionsType = switchPotionsType;
window.setRarityFilter = setRarityFilter;
window.potionsInitialized = potionsInitialized;

console.log('✅ Potions.js loaded');
