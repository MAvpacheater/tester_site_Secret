// Potions & Food Module - FIXED VERSION (No localStorage)
console.log('🧪 Loading potions.js with new JSON structure...');

// Global variables
let potionsInitialized = false;
let currentPotionsType = 'potions';
let currentRarityFilter = 'all';
let currentLanguage = 'en';
let potionsData = null;

// Get language from memory or default to English
function getCurrentLanguage() {
    return currentLanguage || 'en';
}

// Load data from JSON file
async function loadPotionsData() {
    if (potionsData) return potionsData;
    
    try {
        console.log('📥 Loading potions data...');
        const response = await fetch('languages/potions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        potionsData = await response.json();
        console.log('✅ Potions data loaded successfully');
        return potionsData;
    } catch (error) {
        console.error('❌ Error loading potions data:', error);
        // Fallback minimal structure
        potionsData = {
            items: { potions: {}, food: {} },
            translations: {
                en: {
                    title: "Potions & Food",
                    switcherPotions: "🧪 Potions",
                    switcherFood: "🍖 Food"
                }
            }
        };
        return potionsData;
    }
}

// Get translated text
function getTranslation(key, fallback = '') {
    if (!potionsData || !potionsData.translations || !potionsData.translations[currentLanguage]) {
        return fallback || key;
    }
    
    const translation = potionsData.translations[currentLanguage];
    const keys = key.split('.');
    let value = translation;
    
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return fallback || key;
        }
    }
    
    return value || fallback || key;
}

// Get available rarities from items
function getAvailableRarities() {
    if (!potionsData || !potionsData.items) return [];
    
    const rarities = new Set();
    
    // Collect rarities from potions
    Object.values(potionsData.items.potions).forEach(item => {
        if (item.rarity) rarities.add(item.rarity);
    });
    
    // Collect rarities from food
    Object.values(potionsData.items.food).forEach(item => {
        if (item.rarity) rarities.add(item.rarity);
    });
    
    return Array.from(rarities).sort();
}

// Main initialization function
async function initializePotions() {
    console.log('🧪 Initializing Potions & Food with new structure...');
    
    potionsInitialized = false;
    
    // Get current language
    currentLanguage = getCurrentLanguage();
    
    // Load data
    await loadPotionsData();
    
    const potionsPage = document.getElementById('potionsPage');
    if (!potionsPage) {
        console.error('❌ Potions page not found in DOM');
        return false;
    }
    
    const container = document.getElementById('potionsContainer');
    if (!container) {
        console.error('❌ Potions container not found in DOM');
        return false;
    }
    
    try {
        // Update page title
        const titleElement = potionsPage.querySelector('.title');
        if (titleElement) {
            titleElement.textContent = getTranslation('title', 'Potions & Food');
        }
        
        await loadPotionsContent();
        potionsInitialized = true;
        window.potionsInitialized = true;
        
        const potionsCount = Object.keys(potionsData.items.potions).length;
        const foodCount = Object.keys(potionsData.items.food).length;
        
        console.log('✅ Potions & Food initialized successfully');
        console.log(`📊 Loaded: ${potionsCount} potions, ${foodCount} foods in ${currentLanguage}`);
        return true;
    } catch (error) {
        console.error('❌ Error initializing Potions & Food:', error);
        potionsInitialized = false;
        return false;
    }
}

// Switch between potions types (potions/food)
function switchPotionsType(type) {
    console.log(`🔄 Switching potions type to: ${type}`);
    
    if (!type || (type !== 'potions' && type !== 'food')) {
        console.error('❌ Invalid potions type:', type);
        return;
    }
    
    currentPotionsType = type;
    
    // Update button states
    const buttons = document.querySelectorAll('.potions-switch-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-potions-type') === type) {
            btn.classList.add('active');
        }
    });
    
    // Update sections
    const sections = document.querySelectorAll('.potions-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const activeSection = document.getElementById(`${type}Section`);
    if (activeSection) {
        activeSection.classList.add('active');
        // Reset rarity filter when switching types
        currentRarityFilter = 'all';
        updateRarityFilterButtons();
        filterByRarity();
        console.log(`✅ Switched to section: ${type}Section`);
    } else {
        console.error(`❌ Section ${type}Section not found`);
    }
}

// Set rarity filter
function setRarityFilter(rarity) {
    console.log(`🔍 Setting rarity filter to: ${rarity}`);
    
    if (rarity === currentRarityFilter && rarity !== 'all') {
        // If clicking the same filter, show all
        currentRarityFilter = 'all';
    } else {
        currentRarityFilter = rarity;
    }
    
    updateRarityFilterButtons();
    filterByRarity();
}

// Update rarity filter buttons
function updateRarityFilterButtons() {
    const filterButtons = document.querySelectorAll('.rarity-filter-btn');
    
    filterButtons.forEach(btn => {
        const btnRarity = btn.getAttribute('data-rarity');
        if (btnRarity === currentRarityFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Filter items by rarity
function filterByRarity() {
    const activeSection = document.querySelector('.potions-section.active');
    if (!activeSection) return;
    
    const items = activeSection.querySelectorAll('.potion-item');
    let visibleCount = 0;
    
    items.forEach((item, index) => {
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
    
    // Show notification
    let filterMessage = '';
    if (currentRarityFilter === 'all') {
        filterMessage = `${getTranslation('notificationShowingAll', 'Showing all')} ${visibleCount} ${currentPotionsType}`;
    } else {
        const rarityTranslation = getTranslation(`filter${currentRarityFilter.charAt(0).toUpperCase() + currentRarityFilter.slice(1)}`, currentRarityFilter.toUpperCase());
        filterMessage = `${getTranslation('notificationShowing', 'Showing')} ${visibleCount} ${rarityTranslation} ${currentPotionsType}`;
    }
    
    console.log(`📊 ${filterMessage}`);
    showPotionsNotification(`🔍 ${filterMessage}`, 'info');
}

// Create rarity filter buttons
function createRarityFilters() {
    const rarities = getAvailableRarities();
    
    // Add "all" button first
    let filtersHTML = `
        <button class="rarity-filter-btn all active" 
                data-rarity="all" 
                onclick="setRarityFilter('all')">
            ${getTranslation('filterAll', 'All')}
        </button>
    `;
    
    // Add rarity buttons
    filtersHTML += rarities.map(rarity => {
        const rarityKey = `filter${rarity.charAt(0).toUpperCase() + rarity.slice(1)}`;
        const rarityLabel = getTranslation(rarityKey, rarity);
        
        return `
            <button class="rarity-filter-btn ${rarity}" 
                    data-rarity="${rarity}" 
                    onclick="setRarityFilter('${rarity}')">
                ${rarityLabel}
            </button>
        `;
    }).join('');
    
    return filtersHTML;
}

// Create image element with error handling
function createPotionImage(imageUrl, itemName) {
    const finalUrl = imageUrl || 'https://via.placeholder.com/150x112/667eea/ffffff?text=No+Image';
    
    return `
        <img src="${finalUrl}" 
             alt="${itemName}" 
             class="potion-image loading"
             loading="lazy"
             onerror="this.onerror=null; this.src='https://via.placeholder.com/150x112/667eea/ffffff?text=No+Image'; this.classList.add('error'); this.classList.remove('loading');"
             onload="this.classList.remove('loading');">
    `;
}

// Get item data with translations
function getItemWithTranslations(itemKey, itemData, itemType) {
    const translatedName = getTranslation(`${itemType}.${itemKey}.name`, itemKey);
    const translatedBoost = getTranslation(`${itemType}.${itemKey}.boost`, '');
    
    return {
        name: itemKey,
        displayName: translatedName,
        displayBoost: translatedBoost,
        rarity: itemData.rarity,
        time: itemData.time,
        image: itemData.image
    };
}

// Load potions content into the container
async function loadPotionsContent() {
    const container = document.getElementById('potionsContainer');
    if (!container) {
        console.error('❌ Potions container not found');
        throw new Error('Container not found');
    }

    console.log('📝 Loading potions content with translations...');

    // Generate potions HTML
    const potionsHTML = Object.entries(potionsData.items.potions).map(([key, data], index) => {
        const item = getItemWithTranslations(key, data, 'potions');
        return `
            <div class="potion-item" data-rarity="${item.rarity}" style="animation-delay: ${index * 50}ms;">
                ${createPotionImage(item.image, item.displayName)}
                <div class="potion-main-content">
                    <div class="potion-name">${item.displayName}</div>
                    <div class="potion-boost">${item.displayBoost}</div>
                </div>
                <div class="potion-meta">
                    <div class="potion-rarity ${item.rarity}">${getTranslation(`filter${item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}`, item.rarity.toUpperCase())}</div>
                    <div class="potion-time">${item.time}</div>
                </div>
            </div>
        `;
    }).join('');

    // Generate food HTML
    const foodHTML = Object.entries(potionsData.items.food).map(([key, data], index) => {
        const item = getItemWithTranslations(key, data, 'food');
        return `
            <div class="potion-item" data-rarity="${item.rarity}" style="animation-delay: ${index * 50}ms;">
                ${createPotionImage(item.image, item.displayName)}
                <div class="potion-main-content">
                    <div class="potion-name">${item.displayName}</div>
                    <div class="potion-boost">${item.displayBoost}</div>
                </div>
                <div class="potion-meta">
                    <div class="potion-rarity ${item.rarity}">${getTranslation(`filter${item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}`, item.rarity.toUpperCase())}</div>
                    <div class="potion-time">${item.time}</div>
                </div>
            </div>
        `;
    }).join('');

    // Create the complete content
    const fullHTML = `
        <!-- Type Switcher -->
        <div class="potions-switcher">
            <button class="potions-switch-btn active" data-potions-type="potions" onclick="switchPotionsType('potions')">
                ${getTranslation('switcherPotions', '🧪 Potions')}
            </button>
            <button class="potions-switch-btn" data-potions-type="food" onclick="switchPotionsType('food')">
                ${getTranslation('switcherFood', '🍖 Food')}
            </button>
        </div>
        
        <!-- Rarity Filter Controls -->
        <div class="rarity-filter-controls">
            ${createRarityFilters()}
        </div>
        
        <!-- Potions Section -->
        <div class="potions-section active" id="potionsSection">
            ${potionsHTML}
        </div>
        
        <!-- Food Section -->
        <div class="potions-section" id="foodSection">
            ${foodHTML}
        </div>
    `;

    container.innerHTML = fullHTML;
    
    // Reset filters
    currentPotionsType = 'potions';
    currentRarityFilter = 'all';
    
    console.log(`✅ Potions & Food content loaded successfully in ${currentLanguage}`);
}

// Update language when it changes globally
function updatePotionsLanguage(newLanguage) {
    console.log(`🌍 Potions received language change request: ${currentLanguage} → ${newLanguage}`);
    
    if (newLanguage === currentLanguage) {
        console.log('🔄 Same language, skipping update');
        return;
    }
    
    currentLanguage = newLanguage;
    
    if (potionsInitialized) {
        console.log(`🧪 Updating potions language to: ${newLanguage}`);
        setTimeout(() => {
            initializePotions();
        }, 100);
    } else {
        console.log('🧪 Potions not initialized yet, language will be applied on next init');
    }
}

// Show notification
function showPotionsNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.potions-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `potions-notification ${type}`;
    notification.textContent = message;

    const potionsPage = document.getElementById('potionsPage');
    if (potionsPage) {
        potionsPage.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Get filtered data
function getFilteredData() {
    if (!potionsData || !potionsData.items) return [];
    
    const currentItems = currentPotionsType === 'potions' 
        ? potionsData.items.potions 
        : potionsData.items.food;
    
    if (currentRarityFilter === 'all') {
        return Object.entries(currentItems).map(([key, data]) => ({
            name: key,
            ...data
        }));
    }
    
    return Object.entries(currentItems)
        .filter(([key, data]) => data.rarity === currentRarityFilter)
        .map(([key, data]) => ({
            name: key,
            ...data
        }));
}

// Debug function
function debugPotions() {
    console.log('=== POTIONS DEBUG ===');
    console.log('Initialized:', potionsInitialized);
    console.log('Current type:', currentPotionsType);
    console.log('Current rarity filter:', currentRarityFilter);
    console.log('Current language:', currentLanguage);
    console.log('Container exists:', !!document.getElementById('potionsContainer'));
    console.log('Page exists:', !!document.getElementById('potionsPage'));
    console.log('Available rarities:', getAvailableRarities());
    console.log('Filtered data count:', getFilteredData().length);
    console.log('Data loaded:', !!potionsData);
    console.log('====================');
}

// Get statistics
function getPotionsStats() {
    if (!potionsData || !potionsData.items) {
        return { error: 'Data not loaded' };
    }
    
    const potionsStats = {};
    const foodStats = {};
    
    // Count potions by rarity
    Object.values(potionsData.items.potions).forEach(item => {
        potionsStats[item.rarity] = (potionsStats[item.rarity] || 0) + 1;
    });
    
    // Count food by rarity
    Object.values(potionsData.items.food).forEach(item => {
        foodStats[item.rarity] = (foodStats[item.rarity] || 0) + 1;
    });
    
    return {
        potions: {
            total: Object.keys(potionsData.items.potions).length,
            byRarity: potionsStats
        },
        food: {
            total: Object.keys(potionsData.items.food).length,
            byRarity: foodStats
        },
        rarities: getAvailableRarities(),
        initialized: potionsInitialized,
        currentType: currentPotionsType,
        currentFilter: currentRarityFilter,
        currentLanguage: currentLanguage,
        dataLoaded: !!potionsData
    };
}

// Expose functions globally
window.initializePotions = initializePotions;
window.switchPotionsType = switchPotionsType;
window.setRarityFilter = setRarityFilter;
window.updatePotionsLanguage = updatePotionsLanguage;
window.debugPotions = debugPotions;
window.getPotionsStats = getPotionsStats;
window.getFilteredData = getFilteredData;
window.potionsInitialized = potionsInitialized;

// Listen for global language changes
document.addEventListener('languageChanged', function(e) {
    console.log('🧪 Potions received languageChanged event:', e.detail);
    if (e.detail && e.detail.language) {
        updatePotionsLanguage(e.detail.language);
    }
});

// Auto-initialization
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const container = document.getElementById('potionsContainer');
        if (container && !potionsInitialized) {
            console.log('🧪 Auto-initializing potions...');
            initializePotions();
        }
    }, 500);
});

// Initialize when potions page becomes active
document.addEventListener('click', function(e) {
    if (e.target && e.target.getAttribute && e.target.getAttribute('data-page') === 'potions') {
        setTimeout(() => {
            if (!potionsInitialized || !document.getElementById('potionsSection')) {
                console.log('🧪 Page switched to potions, reinitializing...');
                initializePotions();
            }
        }, 300);
    }
});

console.log('✅ potions.js with new structure loaded successfully');
