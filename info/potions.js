// Potions & Food Module - All data from JSON
console.log('🧪 Loading potions.js with JSON-based data...');

// Global variables
let potionsInitialized = false;
let currentPotionsType = 'potions';
let currentRarityFilter = 'all';
let currentLanguage = 'en';
let potionsData = null;
let allPotionsData = null;

// Get language from localStorage or default to English
function getCurrentLanguage() {
    const saved = localStorage.getItem('armHelper_language');
    return saved || 'en';
}

// Load all data from JSON file
async function loadPotionsData() {
    if (allPotionsData) return allPotionsData;
    
    try {
        console.log('📥 Loading potions data from JSON...');
        const response = await fetch('info/potions/potions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allPotionsData = await response.json();
        console.log('✅ Potions data loaded successfully');
        return allPotionsData;
    } catch (error) {
        console.error('❌ Error loading potions data:', error);
        // Fallback to empty data
        allPotionsData = {
            items: { potions: {}, food: {} },
            translations: { en: { title: "Potions & Food" } }
        };
        return allPotionsData;
    }
}

// Get translated text
function getTranslation(key, fallback = '') {
    if (!allPotionsData || !allPotionsData.translations || !allPotionsData.translations[currentLanguage]) {
        return fallback || key;
    }
    
    const translation = allPotionsData.translations[currentLanguage];
    
    // Handle nested keys like 'potions.Luck Potion [1].name'
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

// Convert JSON items to array format
function getItemsArray(type) {
    if (!allPotionsData || !allPotionsData.items || !allPotionsData.items[type]) {
        return [];
    }
    
    const items = allPotionsData.items[type];
    return Object.keys(items).map(name => ({
        name: name,
        rarity: items[name].rarity,
        time: items[name].time,
        image: items[name].image
    }));
}

// Get unique rarities from both datasets
function getAvailableRarities() {
    const potions = getItemsArray('potions');
    const food = getItemsArray('food');
    const allItems = [...potions, ...food];
    const rarities = [...new Set(allItems.map(item => item.rarity))];
    return rarities.sort();
}

// Main initialization function
async function initializePotions() {
    console.log('🧪 Initializing Potions & Food from JSON...');
    
    potionsInitialized = false;
    
    // Get current language
    currentLanguage = getCurrentLanguage();
    
    // Load data from JSON
    await loadPotionsData();
    
    const potionsPage = document.getElementById('potionsPage');
    if (!potionsPage) {
        console.error('❌ Potions page not found in DOM');
        return false;
    }
    
    try {
        // Create full page structure
        potionsPage.innerHTML = `
            <h1 class="title">${getTranslation('title', 'Potions & Food')}</h1>
            <div id="potionsContainer"></div>
        `;
        
        await loadPotionsContent();
        potionsInitialized = true;
        window.potionsInitialized = true;
        
        const potionsCount = getItemsArray('potions').length;
        const foodCount = getItemsArray('food').length;
        
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
        <button class="rarity-filter-btn all" 
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

// Get translated item data
function getTranslatedItemData(item, itemType) {
    const translatedName = getTranslation(`${itemType}.${item.name}.name`, item.name);
    const translatedBoost = getTranslation(`${itemType}.${item.name}.boost`, item.name);
    
    return {
        ...item,
        displayName: translatedName,
        displayBoost: translatedBoost
    };
}

// Load potions content into the container
async function loadPotionsContent() {
    // Wait a bit for DOM to update
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const container = document.getElementById('potionsContainer');
    if (!container) {
        console.error('❌ Potions container not found');
        throw new Error('Container not found');
    }

    console.log('📝 Loading potions content from JSON...');

    // Get items from JSON
    const potionsArray = getItemsArray('potions');
    const foodArray = getItemsArray('food');

    // Generate potions HTML with translations
    const potionsHTML = potionsArray.map((potion, index) => {
        const translatedPotion = getTranslatedItemData(potion, 'potions');
        return `
            <div class="potion-item" data-rarity="${potion.rarity}" style="animation-delay: ${index * 50}ms;">
                ${createPotionImage(potion)}
                <div class="potion-main-content">
                    <div class="potion-name">${translatedPotion.displayName}</div>
                    <div class="potion-boost">${translatedPotion.displayBoost}</div>
                </div>
                <div class="potion-meta">
                    <div class="potion-rarity ${potion.rarity}">${getTranslation(`filter${potion.rarity.charAt(0).toUpperCase() + potion.rarity.slice(1)}`, potion.rarity.toUpperCase())}</div>
                    <div class="potion-time">${potion.time}</div>
                </div>
            </div>
        `;
    }).join('');

    // Generate food HTML with translations
    const foodHTML = foodArray.map((food, index) => {
        const translatedFood = getTranslatedItemData(food, 'food');
        return `
            <div class="potion-item" data-rarity="${food.rarity}" style="animation-delay: ${index * 50}ms;">
                ${createPotionImage(food)}
                <div class="potion-main-content">
                    <div class="potion-name">${translatedFood.displayName}</div>
                    <div class="potion-boost">${translatedFood.displayBoost}</div>
                </div>
                <div class="potion-meta">
                    <div class="potion-rarity ${food.rarity}">${getTranslation(`filter${food.rarity.charAt(0).toUpperCase() + food.rarity.slice(1)}`, food.rarity.toUpperCase())}</div>
                    <div class="potion-time">${food.time}</div>
                </div>
            </div>
        `;
    }).join('');

    // Create the complete content with translations
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
        // Reinitialize with new language
        setTimeout(() => {
            initializePotions();
        }, 100);
    } else {
        console.log('🧪 Potions not initialized yet, language will be applied on next init');
    }
}

// Show notification
function showPotionsNotification(message, type = 'info') {
    // Remove existing notifications
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
    const currentData = currentPotionsType === 'potions' ? getItemsArray('potions') : getItemsArray('food');
    
    if (currentRarityFilter === 'all') {
        return currentData;
    }
    
    return currentData.filter(item => item.rarity === currentRarityFilter);
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
    console.log('Data loaded:', !!allPotionsData);
    console.log('====================');
}

// Get statistics
function getPotionsStats() {
    const potionsArray = getItemsArray('potions');
    const foodArray = getItemsArray('food');
    
    const potionsStats = {};
    const foodStats = {};
    
    // Count potions by rarity
    potionsArray.forEach(potion => {
        potionsStats[potion.rarity] = (potionsStats[potion.rarity] || 0) + 1;
    });
    
    // Count food by rarity
    foodArray.forEach(food => {
        foodStats[food.rarity] = (foodStats[food.rarity] || 0) + 1;
    });
    
    return {
        potions: {
            total: potionsArray.length,
            byRarity: potionsStats
        },
        food: {
            total: foodArray.length,
            byRarity: foodStats
        },
        rarities: getAvailableRarities(),
        initialized: potionsInitialized,
        currentType: currentPotionsType,
        currentFilter: currentRarityFilter,
        currentLanguage: currentLanguage,
        dataLoaded: !!allPotionsData
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
        const page = document.getElementById('potionsPage');
        if (page && !potionsInitialized) {
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

console.log('✅ potions.js with JSON-based data loaded successfully');
