// Potions & Food Module
let potionsInitialized = false;
let currentPotionsType = 'potions';

// Potions data
const potionsData = [
    { 
        name: "Health Potion", 
        rarity: "common", 
        boost: "Restores 50% HP instantly", 
        time: "Instant" 
    },
    { 
        name: "Mana Elixir", 
        rarity: "uncommon", 
        boost: "Restores 100% MP + 25% MP regen for 5 minutes", 
        time: "5 min" 
    },
    { 
        name: "Strength Brew", 
        rarity: "rare", 
        boost: "Physical damage +150% for 10 minutes", 
        time: "10 min" 
    },
    { 
        name: "Mystic Draught", 
        rarity: "epic", 
        boost: "Magic damage +200% + Spell crit +50%", 
        time: "15 min" 
    },
    { 
        name: "Dragon's Blood", 
        rarity: "legendary", 
        boost: "All stats +300% + Fire immunity", 
        time: "30 min" 
    },
    { 
        name: "Elixir of Gods", 
        rarity: "mythic", 
        boost: "All damage +500% + Invincibility for 10 seconds", 
        time: "1 hour" 
    }
];

// Food data
const foodData = [
    { 
        name: "Bread Roll", 
        rarity: "common", 
        boost: "Hunger restoration +20%", 
        time: "Instant" 
    },
    { 
        name: "Roasted Meat", 
        rarity: "uncommon", 
        boost: "HP regen +15% for 20 minutes", 
        time: "20 min" 
    },
    { 
        name: "Golden Apple", 
        rarity: "rare", 
        boost: "All resistances +50% for 30 minutes", 
        time: "30 min" 
    },
    { 
        name: "Dragon Steak", 
        rarity: "epic", 
        boost: "Strength +250% + Fire resistance +100%", 
        time: "45 min" 
    },
    { 
        name: "Ambrosia", 
        rarity: "legendary", 
        boost: "Experience gain +400% + Luck +200%", 
        time: "2 hours" 
    },
    { 
        name: "Nectar of Life", 
        rarity: "mythic", 
        boost: "Immortality + All stats +1000%", 
        time: "24 hours" 
    }
];

function initializePotions() {
    if (potionsInitialized) {
        console.log('⚠️ Potions module already initialized');
        return;
    }

    console.log('🧪 Initializing Potions & Food...');
    
    try {
        loadPotionsContent();
        potionsInitialized = true;
        console.log('✅ Potions & Food initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing Potions & Food:', error);
    }
}

// Switch between potions types (potions/food)
function switchPotionsType(type) {
    currentPotionsType = type;
    
    // Update button states
    document.querySelectorAll('.potions-switch-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-potions-type="${type}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Update sections
    document.querySelectorAll('.potions-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const activeSection = document.getElementById(`${type}Section`);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    console.log(`Switched to potions type: ${type}`);
}

function loadPotionsContent() {
    const container = document.getElementById('potionsContainer');
    if (!container) {
        console.error('❌ Potions container not found');
        return;
    }

    // Generate potions list
    const potionsHTML = potionsData.map(potion => `
        <div class="potion-item">
            <div class="potion-main-content">
                <div class="potion-name">${potion.name}</div>
                <div class="potion-boost">${potion.boost}</div>
            </div>
            <div class="potion-meta">
                <div class="potion-rarity ${potion.rarity}">${potion.rarity}</div>
                <div class="potion-time">${potion.time}</div>
            </div>
        </div>
    `).join('');

    // Generate food list
    const foodHTML = foodData.map(food => `
        <div class="potion-item">
            <div class="potion-main-content">
                <div class="potion-name">${food.name}</div>
                <div class="potion-boost">${food.boost}</div>
            </div>
            <div class="potion-meta">
                <div class="potion-rarity ${food.rarity}">${food.rarity}</div>
                <div class="potion-time">${food.time}</div>
            </div>
        </div>
    `).join('');

    // Create the complete potions content with switcher
    const potionsHTML = `
        <!-- Potions Type Switcher -->
        <div class="potions-switcher">
            <button class="potions-switch-btn active" data-potions-type="potions" onclick="switchPotionsType('potions')">Potions</button>
            <button class="potions-switch-btn" data-potions-type="food" onclick="switchPotionsType('food')">Food</button>
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

    container.innerHTML = potionsHTML;
    console.log('✅ Potions & Food content loaded with switcher');
}

// Utility functions for managing potions and food data
function addPotion(name, rarity, boost, time) {
    potionsData.push({ name, rarity, boost, time });
    loadPotionsContent();
    console.log(`✅ Added new potion: ${name}`);
}

function addFood(name, rarity, boost, time) {
    foodData.push({ name, rarity, boost, time });
    loadPotionsContent();
    console.log(`✅ Added new food: ${name}`);
}

function updatePotionData(index, newData) {
    if (index >= 0 && index < potionsData.length) {
        potionsData[index] = { ...potionsData[index], ...newData };
        loadPotionsContent();
        console.log(`✅ Updated potion at index ${index}`);
    } else {
        console.error(`❌ Invalid potion index: ${index}`);
    }
}

function updateFoodData(index, newData) {
    if (index >= 0 && index < foodData.length) {
        foodData[index] = { ...foodData[index], ...newData };
        loadPotionsContent();
        console.log(`✅ Updated food at index ${index}`);
    } else {
        console.error(`❌ Invalid food index: ${index}`);
    }
}

function getPotionsData() {
    return [...potionsData]; // Return a copy to prevent external modifications
}

function getFoodData() {
    return [...foodData]; // Return a copy to prevent external modifications
}

function filterByRarity(rarity, type = 'potions') {
    const data = type === 'potions' ? potionsData : foodData;
    return data.filter(item => item.rarity === rarity);
}

function searchItems(searchTerm, type = 'both') {
    const results = [];
    
    if (type === 'potions' || type === 'both') {
        const potionResults = potionsData.filter(potion => 
            potion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            potion.boost.toLowerCase().includes(searchTerm.toLowerCase())
        );
        results.push(...potionResults.map(item => ({ ...item, type: 'potion' })));
    }
    
    if (type === 'food' || type === 'both') {
        const foodResults = foodData.filter(food => 
            food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            food.boost.toLowerCase().includes(searchTerm.toLowerCase())
        );
        results.push(...foodResults.map(item => ({ ...item, type: 'food' })));
    }
    
    return results;
}

// Animation helper for smooth transitions
function animatePotionItems() {
    const items = document.querySelectorAll('.potion-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Enhanced initialization with animations
function initializePotionsWithAnimations() {
    initializePotions();
    setTimeout(animatePotionItems, 200);
}

// Rarity statistics
function getRarityStats(type = 'both') {
    const stats = {
        common: 0,
        uncommon: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
        mythic: 0
    };
    
    let data = [];
    if (type === 'potions') {
        data = potionsData;
    } else if (type === 'food') {
        data = foodData;
    } else {
        data = [...potionsData, ...foodData];
    }
    
    data.forEach(item => {
        if (stats.hasOwnProperty(item.rarity)) {
            stats[item.rarity]++;
        }
    });
    
    return stats;
}

// Make sure DOM is ready before running
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializePotions, 100);
    });
} else {
    setTimeout(initializePotions, 100);
}

// Make functions globally available
window.initializePotions = initializePotions;
window.initializePotionsWithAnimations = initializePotionsWithAnimations;
window.switchPotionsType = switchPotionsType;
window.addPotion = addPotion;
window.addFood = addFood;
window.updatePotionData = updatePotionData;
window.updateFoodData = updateFoodData;
window.getPotionsData = getPotionsData;
window.getFoodData = getFoodData;
window.filterByRarity = filterByRarity;
window.searchItems = searchItems;
window.getRarityStats = getRarityStats;

console.log('✅ potions.js loaded successfully with switcher functionality');
