// Potions & Food Module - WITH RARITY FILTERS
console.log('🧪 Loading potions.js with rarity filters...');

// Global variables
let potionsInitialized = false;
let currentPotionsType = 'potions';
let currentRarityFilter = 'all';

// Potions data - Complete with images
const potionsData = [
    { 
        name: "Luck Potion [1]", 
        rarity: "common", 
        boost: "Doubles your Egg Luck", 
        time: "30 min",
        image: "https://i.postimg.cc/DyWfhBk8/2025-09-09-16-36-40.png"
    },
    { 
        name: "Luck Potion [2]", 
        rarity: "uncommon", 
        boost: "+150% Egg Luck", 
        time: "30 min",
        image: "https://i.postimg.cc/GhXZqY8R/luck-potion-2.png"
    },
    { 
        name: "Wins Potion [1]", 
        rarity: "common", 
        boost: "Doubles your Player wins", 
        time: "30 min",
        image: "https://i.postimg.cc/VNMzJZYN/wins-potion-1.png"
    },
    { 
        name: "Wins Potion [2]", 
        rarity: "uncommon", 
        boost: "+150% Wins Boost", 
        time: "30 min",
        image: "https://i.postimg.cc/GmKRpXzK/wins-potion-2.png"
    },
    { 
        name: "Golden Potion", 
        rarity: "common", 
        boost: "Gives a chance of hatching Golden Pets", 
        time: "30 min",
        image: "https://i.postimg.cc/QCLvH9nR/golden-potion.png"
    },
    { 
        name: "Void Potion", 
        rarity: "common", 
        boost: "Gives a chance of hatching Void Pets", 
        time: "30 min",
        image: "https://i.postimg.cc/Y2mHQ7gQ/void-potion.png"
    },
    { 
        name: "Training Potion [1]", 
        rarity: "common", 
        boost: "Increases your training power by 30%", 
        time: "30 min",
        image: "https://i.postimg.cc/MGr0hJkR/training-potion-1.png"
    },
    { 
        name: "Training Potion [2]", 
        rarity: "uncommon", 
        boost: "Increases your training power by 60%", 
        time: "30 min",
        image: "https://i.postimg.cc/SxPbh5Lz/training-potion-2.png"
    },
    { 
        name: "Training Potion [3]", 
        rarity: "rare", 
        boost: "Increases your training power by 90%", 
        time: "30 min",
        image: "https://i.postimg.cc/8zbYXdBH/training-potion-3.png"
    },
    { 
        name: "Pet Xp Potion", 
        rarity: "mythic", 
        boost: "Increases Pet Xp gained from bosses by 50%", 
        time: "30 min",
        image: "https://i.postimg.cc/QdYnJvKG/pet-xp-potion.png"
    },
    { 
        name: "Scavenger Potion", 
        rarity: "mythic", 
        boost: "Increases your chance of getting random loot from bosses by 30%", 
        time: "30 min",
        image: "https://i.postimg.cc/vHpLn6cV/scavenger-potion.png"
    },
    { 
        name: "Ticket Potion", 
        rarity: "mythic", 
        boost: "Doubles your ticket payout from bosses", 
        time: "10 min",
        image: "https://i.postimg.cc/TPLqxGDX/ticket-potion.png"
    },
    { 
        name: "Rift Potions [1]", 
        rarity: "mythic", 
        boost: "+30% On Your Rift Stars", 
        time: "30 min",
        image: "https://i.postimg.cc/XJHyKzWF/rift-potion.png"
    },
    { 
        name: "Event Training Potion", 
        rarity: "limited", 
        boost: "Doubles your event training power", 
        time: "30 min",
        image: "https://i.postimg.cc/nL5DgCpq/event-training-potion.png"
    }
];

// Food data - Complete with images
const foodData = [
    { 
        name: "Cookie", 
        rarity: "common", 
        boost: "Treat your pets! Pets give 3% more strength", 
        time: "5 min",
        image: "https://i.postimg.cc/ZqMx8gKt/cookie.png"
    },
    { 
        name: "Tasty Cookie", 
        rarity: "uncommon", 
        boost: "Treat your pets! Pets give 5% more strength", 
        time: "5 min",
        image: "https://i.postimg.cc/vTK0PbfM/tasty-cookie.png"
    },
    { 
        name: "Enchanted Cookie", 
        rarity: "rare", 
        boost: "Treat your pets! Pets give 7% more strength", 
        time: "5 min",
        image: "https://i.postimg.cc/Y0QSJKdG/enchanted-cookie.png"
    },
    { 
        name: "Pink Donut", 
        rarity: "uncommon", 
        boost: "Treat your pets! Pets give 5% more strength", 
        time: "5 min",
        image: "https://i.postimg.cc/TwDjP6qG/pink-donut.png"
    },
    { 
        name: "Vanila Donut", 
        rarity: "rare", 
        boost: "Treat your pets! Pets give 10% more strength", 
        time: "5 min",
        image: "https://i.postimg.cc/ZnC7Q4qP/vanilla-donut.png"
    },
    { 
        name: "Chocolate Donut", 
        rarity: "epic", 
        boost: "Treat your pets! Pets give 15% more strength", 
        time: "5 min",
        image: "https://i.postimg.cc/jSRbdCzP/chocolate-donut.png"
    },
    { 
        name: "Rotten Dragon Fruit", 
        rarity: "rare", 
        boost: "Gives You +10% Training Speed", 
        time: "5 min",
        image: "https://i.postimg.cc/s2tWZpyd/rotten-dragon-fruit.png"
    },
    { 
        name: "Fine Dragon Fruit", 
        rarity: "epic", 
        boost: "Gives You +15% Training Speed", 
        time: "10 min",
        image: "https://i.postimg.cc/9FR4y0dN/fine-dragon-fruit.png"
    },
    { 
        name: "Fresh Dragon Fruit", 
        rarity: "legendary", 
        boost: "Gives You +25% Training Speed", 
        time: "20 min",
        image: "https://i.postimg.cc/J4pn5g1w/fresh-dragon-fruit.png"
    },
    { 
        name: "Rotten Banana", 
        rarity: "common", 
        boost: "Gives You +10% Player Speed", 
        time: "5 min",
        image: "https://i.postimg.cc/3JMySGM7/rotten-banana.png"
    },
    { 
        name: "Fresh Banana", 
        rarity: "uncommon", 
        boost: "Gives You +20% Player Speed", 
        time: "10 min",
        image: "https://i.postimg.cc/SQJCVrMD/fresh-banana.png"
    },
    { 
        name: "Rotten Starfruit", 
        rarity: "rare", 
        boost: "Gives You +10% Fighting Strength", 
        time: "10 min",
        image: "https://i.postimg.cc/3JKHg8MZ/rotten-starfruit.png"
    },
    { 
        name: "Normall Starfruit", 
        rarity: "epic", 
        boost: "Gives You +25% Fighting Strength", 
        time: "25 min",
        image: "https://i.postimg.cc/RCMnG7Jn/normal-starfruit.png"
    },
    { 
        name: "Fresh Starfruit", 
        rarity: "legendary", 
        boost: "Gives You +50% Fighting Strength", 
        time: "1 hour",
        image: "https://i.postimg.cc/FzHFKpnh/fresh-starfruit.png"
    },
    { 
        name: "Rapberry", 
        rarity: "rare", 
        boost: "Snack for your equipped Pets! Award your pets with 40xp!", 
        time: "∞",
        image: "https://i.postimg.cc/fWZQrjfL/raspberry.png"
    },
    { 
        name: "Enchanted Rapberry", 
        rarity: "epic", 
        boost: "Snack for your equipped Pets! Award your pets with 130xp!", 
        time: "∞",
        image: "https://i.postimg.cc/05NxMnQQ/enchanted-raspberry.png"
    },
    { 
        name: "Enchanted Pineapple", 
        rarity: "epic", 
        boost: "Snack for your equipped Pets! Award your pets with 250xp!", 
        time: "∞",
        image: "https://i.postimg.cc/W3DzHdTV/enchanted-pineapple.png"
    },
    { 
        name: "Pet Lvl Token", 
        rarity: "exclusive", 
        boost: "Instantly +1 level on all of your equipped pets!", 
        time: "∞",
        image: "https://i.postimg.cc/bN8fzXZM/pet-lvl-token.png"
    },
    { 
        name: "Phoenix Fruit", 
        rarity: "mythic", 
        boost: "Instantly evolve a pet of your choice!", 
        time: "∞",
        image: "https://i.postimg.cc/1tR6pBdK/phoenix-fruit.png"
    }
];

// Get unique rarities from both datasets
function getAvailableRarities() {
    const allItems = [...potionsData, ...foodData];
    const rarities = [...new Set(allItems.map(item => item.rarity))];
    return rarities.sort();
}

// Main initialization function
function initializePotions() {
    console.log('🧪 Initializing Potions & Food with rarity filters...');
    
    potionsInitialized = false;
    
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
        loadPotionsContent();
        potionsInitialized = true;
        window.potionsInitialized = true;
        
        console.log('✅ Potions & Food with rarity filters initialized successfully');
        console.log(`📊 Loaded: ${potionsData.length} potions, ${foodData.length} foods`);
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
        filterMessage = `Showing all ${visibleCount} ${currentPotionsType}`;
    } else {
        filterMessage = `Showing ${visibleCount} ${currentRarityFilter.toUpperCase()} ${currentPotionsType}`;
    }
    
    console.log(`📊 ${filterMessage}`);
    showPotionsNotification(`🔍 ${filterMessage}`, 'info');
}

// Create rarity filter buttons
function createRarityFilters() {
    const rarities = getAvailableRarities();
    
    return rarities.map(rarity => `
        <button class="rarity-filter-btn ${rarity}" 
                data-rarity="${rarity}" 
                onclick="setRarityFilter('${rarity}')">
            ${rarity}
        </button>
    `).join('');
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

// Load potions content into the container
function loadPotionsContent() {
    const container = document.getElementById('potionsContainer');
    if (!container) {
        console.error('❌ Potions container not found');
        throw new Error('Container not found');
    }

    console.log('📝 Loading potions content with rarity filters...');

    // Generate potions HTML
    const potionsHTML = potionsData.map((potion, index) => `
        <div class="potion-item" data-rarity="${potion.rarity}" style="animation-delay: ${index * 50}ms;">
            ${createPotionImage(potion)}
            <div class="potion-main-content">
                <div class="potion-name">${potion.name}</div>
                <div class="potion-boost">${potion.boost}</div>
            </div>
            <div class="potion-meta">
                <div class="potion-rarity ${potion.rarity}">${potion.rarity.toUpperCase()}</div>
                <div class="potion-time">${potion.time}</div>
            </div>
        </div>
    `).join('');

    // Generate food HTML
    const foodHTML = foodData.map((food, index) => `
        <div class="potion-item" data-rarity="${food.rarity}" style="animation-delay: ${index * 50}ms;">
            ${createPotionImage(food)}
            <div class="potion-main-content">
                <div class="potion-name">${food.name}</div>
                <div class="potion-boost">${food.boost}</div>
            </div>
            <div class="potion-meta">
                <div class="potion-rarity ${food.rarity}">${food.rarity.toUpperCase()}</div>
                <div class="potion-time">${food.time}</div>
            </div>
        </div>
    `).join('');

    // Create the complete content
    const fullHTML = `
        <!-- Type Switcher -->
        <div class="potions-switcher">
            <button class="potions-switch-btn active" data-potions-type="potions" onclick="switchPotionsType('potions')">
                🧪 Potions
            </button>
            <button class="potions-switch-btn" data-potions-type="food" onclick="switchPotionsType('food')">
                🍖 Food
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
    
    console.log('✅ Potions & Food content with rarity filters loaded successfully');
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
    const currentData = currentPotionsType === 'potions' ? potionsData : foodData;
    
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
    console.log('Container exists:', !!document.getElementById('potionsContainer'));
    console.log('Page exists:', !!document.getElementById('potionsPage'));
    console.log('Available rarities:', getAvailableRarities());
    console.log('Filtered data count:', getFilteredData().length);
    console.log('====================');
}

// Get statistics
function getPotionsStats() {
    const potionsStats = {};
    const foodStats = {};
    
    // Count potions by rarity
    potionsData.forEach(potion => {
        potionsStats[potion.rarity] = (potionsStats[potion.rarity] || 0) + 1;
    });
    
    // Count food by rarity
    foodData.forEach(food => {
        foodStats[food.rarity] = (foodStats[food.rarity] || 0) + 1;
    });
    
    return {
        potions: {
            total: potionsData.length,
            byRarity: potionsStats
        },
        food: {
            total: foodData.length,
            byRarity: foodStats
        },
        rarities: getAvailableRarities(),
        initialized: potionsInitialized,
        currentType: currentPotionsType,
        currentFilter: currentRarityFilter
    };
}

// Expose functions globally
window.initializePotions = initializePotions;
window.switchPotionsType = switchPotionsType;
window.setRarityFilter = setRarityFilter;
window.debugPotions = debugPotions;
window.getPotionsStats = getPotionsStats;
window.getFilteredData = getFilteredData;
window.potionsInitialized = potionsInitialized;

// Auto-initialization
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const container = document.getElementById('potionsContainer');
        if (container && !potionsInitialized) {
            console.log('🧪 Auto-initializing potions with rarity filters...');
            initializePotions();
        }
    }, 500);
});

// Initialize when potions page becomes active
document.addEventListener('click', function(e) {
    if (e.target && e.target.getAttribute && e.target.getAttribute('data-page') === 'potions') {
        setTimeout(() => {
            if (!potionsInitialized || !document.getElementById('potionsSection')) {
                console.log('🧪 Page switched to potions, reinitializing with rarity filters...');
                initializePotions();
            }
        }, 300);
    }
});

console.log('✅ potions.js with rarity filtering system loaded successfully');
