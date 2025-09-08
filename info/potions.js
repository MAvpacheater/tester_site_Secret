// Potions & Food Module - FIXED with proper DOM checks
let potionsInitialized = false;
let currentPotionsType = 'potions';

// Potions data
const potionsData = [
    { name: "Health Potion", rarity: "common", boost: "Restores 50% HP instantly", time: "Instant" },
    { name: "Mana Elixir", rarity: "uncommon", boost: "Restores 100% MP + 25% MP regen for 5 minutes", time: "5 min" },
    { name: "Strength Brew", rarity: "rare", boost: "Physical damage +150% for 10 minutes", time: "10 min" },
    { name: "Mystic Draught", rarity: "epic", boost: "Magic damage +200% + Spell crit +50%", time: "15 min" },
    { name: "Dragon's Blood", rarity: "legendary", boost: "All stats +300% + Fire immunity", time: "30 min" },
    { name: "Elixir of Gods", rarity: "mythic", boost: "All damage +500% + Invincibility for 10 seconds", time: "1 hour" }
];

// Food data
const foodData = [
    { name: "Bread Roll", rarity: "common", boost: "Hunger restoration +20%", time: "Instant" },
    { name: "Roasted Meat", rarity: "uncommon", boost: "HP regen +15% for 20 minutes", time: "20 min" },
    { name: "Golden Apple", rarity: "rare", boost: "All resistances +50% for 30 minutes", time: "30 min" },
    { name: "Dragon Steak", rarity: "epic", boost: "Strength +250% + Fire resistance +100%", time: "45 min" },
    { name: "Ambrosia", rarity: "legendary", boost: "Experience gain +400% + Luck +200%", time: "2 hours" },
    { name: "Nectar of Life", rarity: "mythic", boost: "Immortality + All stats +1000%", time: "24 hours" }
];

function initializePotions() {
    console.log('🧪 Potions & Food initialization called...');
    
    // FIXED: Check if container exists
    const container = document.getElementById('potionsContainer');
    if (!container) {
        console.warn('❌ Potions container not found, retrying in 500ms...');
        setTimeout(() => {
            initializePotions();
        }, 500);
        return;
    }

    // FIXED: Allow re-initialization
    if (potionsInitialized) {
        console.log('⚠️ Potions module already initialized, forcing reload...');
        potionsInitialized = false;
    }

    console.log('🧪 Initializing Potions & Food...');
    
    try {
        loadPotionsContent();
        potionsInitialized = true;
        window.potionsInitialized = true; // Make it globally accessible
        console.log('✅ Potions & Food initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing Potions & Food:', error);
        potionsInitialized = false;
    }
}

// Switch between potions types (potions/food)
function switchPotionsType(type) {
    console.log(`🔄 Switching potions type to: ${type}`);
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
        console.log(`✅ Switched to section: ${type}Section`);
    } else {
        console.error(`❌ Section ${type}Section not found`);
    }
}

function loadPotionsContent() {
    const container = document.getElementById('potionsContainer');
    if (!container) {
        console.error('❌ Potions container not found');
        return;
    }

    console.log('📝 Loading potions content...');

    // Generate potions list
    const potionsHTML = potionsData.map((potion, index) => `
        <div class="potion-item" style="animation-delay: ${index * 100}ms;">
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
    const foodHTML = foodData.map((food, index) => `
        <div class="potion-item" style="animation-delay: ${index * 100}ms;">
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
    
    // FIXED: Add small delay for animations
    setTimeout(() => {
        console.log(`📊 Potions loaded: ${potionsData.length} potions, ${foodData.length} foods`);
    }, 100);
}

// Utility functions for managing potions and food data
function addPotion(name, rarity, boost, time) {
    potionsData.push({ name, rarity, boost, time });
    if (potionsInitialized) {
        loadPotionsContent();
    }
    console.log(`✅ Added new potion: ${name}`);
}

function addFood(name, rarity, boost, time) {
    foodData.push({ name, rarity, boost, time });
    if (potionsInitialized) {
        loadPotionsContent();
    }
    console.log(`✅ Added new food: ${name}`);
}

function updatePotionData(index, newData) {
    if (index >= 0 && index < potionsData.length) {
        potionsData[index] = { ...potionsData[index], ...newData };
        if (potionsInitialized) {
            loadPotionsContent();
        }
        console.log(`✅ Updated potion at index ${index}`);
    } else {
        console.error(`❌ Invalid potion index: ${index}`);
    }
}

function updateFoodData(index, newData) {
    if (index >= 0 && index < foodData.length) {
        foodData[index] = { ...foodData[index], ...newData };
        if (potionsInitialized) {
            loadPotionsContent();
        }
        console.log(`✅ Updated food at index ${index}`);
    } else {
        console.error(`❌ Invalid food index: ${index}`);
    }
}

function getPotionsData() {
    return [...potionsData];
}

function getFoodData() {
    return [...foodData];
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

// Rarity statistics
function getRarityStats(type = 'both') {
    const stats = {
        common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0, mythic: 0
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

// FIXED: Enhanced DOM readiness check
function waitForPotionsDOM() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 10;
        
        function checkDOM() {
            const container = document.getElementById('potionsContainer');
            const page = document.getElementById('potionsPage');
            
            if (container && page) {
                console.log('✅ Potions DOM elements found');
                resolve();
            } else if (attempts < maxAttempts) {
                attempts++;
                console.log(`🔄 Waiting for Potions DOM... Attempt ${attempts}/${maxAttempts}`);
                setTimeout(checkDOM, 200);
            } else {
                console.error('❌ Potions DOM elements not found after max attempts');
                reject(new Error('Potions DOM not ready'));
            }
        }
        
        checkDOM();
    });
}

// FIXED: Enhanced initialization with DOM waiting
async function initializePotionsWithWait() {
    try {
        await waitForPotionsDOM();
        initializePotions();
    } catch (error) {
        console.error('❌ Failed to initialize Potions & Food:', error);
    }
}

// FIXED: Proper initialization timing
function setupPotionsInitialization() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializePotionsWithWait, 100);
        });
    } else {
        setTimeout(initializePotionsWithWait, 100);
    }
}

// FIXED: Initialize now if DOM is ready, otherwise wait
if (document.getElementById('potionsContainer')) {
    // DOM is already ready
    initializePotions();
} else {
    // Wait for DOM
    setupPotionsInitialization();
}

// Make functions globally available
window.initializePotions = initializePotions;
window.initializePotionsWithWait = initializePotionsWithWait;
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

// FIXED: Expose initialization status
window.potionsInitialized = potionsInitialized;

console.log('✅ potions.js loaded with enhanced DOM checking - FIXED');
