// Potions & Food Module - COMPLETE FIXED VERSION
console.log('🧪 Loading potions.js module...');

// Global variables
let potionsInitialized = false;
let currentPotionsType = 'potions';

// Potions data - Enhanced with more variety
const potionsData = [
    { name: "Luck [1] Potion", rarity: "common", boost: "Doubles your Egg Luck ", time: "30 min" },
    { name: "Luck [2] Potion", rarity: "common", boost: "+150% Egg Luck ", time: "30 min" },
    { name: "Strength Brew", rarity: "rare", boost: "Physical damage +150% for 10 minutes", time: "10 min" },
    { name: "Speed Potion", rarity: "rare", boost: "Movement speed +200% + Attack speed +100%", time: "8 min" },
    { name: "Mystic Draught", rarity: "epic", boost: "Magic damage +200% + Spell crit +50%", time: "15 min" },
    { name: "Invisibility Potion", rarity: "epic", boost: "Complete invisibility + Stealth damage +300%", time: "12 min" },
    { name: "Dragon's Blood", rarity: "legendary", boost: "All stats +300% + Fire immunity", time: "30 min" },
    { name: "Phoenix Tears", rarity: "legendary", boost: "Auto-revive on death + Burn immunity", time: "45 min" },
    { name: "Elixir of Gods", rarity: "mythic", boost: "All damage +500% + Invincibility for 10 seconds", time: "1 hour" },
    { name: "Time Distortion Brew", rarity: "mythic", boost: "Time stops for enemies + Infinite MP", time: "2 hours" }
];

// Food data - Enhanced with more variety
const foodData = [
    { name: "Bread Roll", rarity: "common", boost: "Hunger restoration +20%", time: "Instant" },
    { name: "Apple", rarity: "common", boost: "HP regen +5% for 10 minutes", time: "10 min" },
    { name: "Roasted Meat", rarity: "uncommon", boost: "HP regen +15% for 20 minutes", time: "20 min" },
    { name: "Fish Steak", rarity: "uncommon", boost: "MP regen +20% + Swimming speed +50%", time: "25 min" },
    { name: "Golden Apple", rarity: "rare", boost: "All resistances +50% for 30 minutes", time: "30 min" },
    { name: "Honey Cake", rarity: "rare", boost: "Sweet tooth satisfaction + Luck +75%", time: "35 min" },
    { name: "Dragon Steak", rarity: "epic", boost: "Strength +250% + Fire resistance +100%", time: "45 min" },
    { name: "Kraken Tentacle", rarity: "epic", boost: "Water breathing + Tentacle attacks", time: "1 hour" },
    { name: "Ambrosia", rarity: "legendary", boost: "Experience gain +400% + Luck +200%", time: "2 hours" },
    { name: "Phoenix Egg", rarity: "legendary", boost: "Rebirth on death + Fire powers", time: "3 hours" },
    { name: "Nectar of Life", rarity: "mythic", boost: "Immortality + All stats +1000%", time: "24 hours" },
    { name: "God's Feast", rarity: "mythic", boost: "Omnipotence + Reality manipulation", time: "∞" }
];

// Main initialization function
function initializePotions() {
    console.log('🧪 Initializing Potions & Food module...');
    
    // Reset initialization flag to allow re-initialization
    potionsInitialized = false;
    
    // Check if the potions page exists
    const potionsPage = document.getElementById('potionsPage');
    if (!potionsPage) {
        console.error('❌ Potions page not found in DOM');
        return false;
    }
    
    // Check if container exists
    const container = document.getElementById('potionsContainer');
    if (!container) {
        console.error('❌ Potions container not found in DOM');
        return false;
    }
    
    try {
        // Load content
        loadPotionsContent();
        
        // Mark as initialized
        potionsInitialized = true;
        window.potionsInitialized = true;
        
        console.log('✅ Potions & Food module initialized successfully');
        console.log(`📊 Loaded: ${potionsData.length} potions, ${foodData.length} foods`);
        return true;
    } catch (error) {
        console.error('❌ Error initializing Potions & Food:', error);
        potionsInitialized = false;
        window.potionsInitialized = false;
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
        console.log(`✅ Switched to section: ${type}Section`);
    } else {
        console.error(`❌ Section ${type}Section not found`);
    }
}

// Load potions content into the container
function loadPotionsContent() {
    const container = document.getElementById('potionsContainer');
    if (!container) {
        console.error('❌ Potions container not found');
        throw new Error('Container not found');
    }

    console.log('📝 Loading potions content...');

    // Generate potions HTML
    const potionsHTML = potionsData.map((potion, index) => `
        <div class="potion-item" style="animation-delay: ${index * 50}ms;">
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
        <div class="potion-item" style="animation-delay: ${index * 50}ms;">
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

    // Create the complete content with switcher
    const fullHTML = `
        <!-- Potions Type Switcher -->
        <div class="potions-switcher">
            <button class="potions-switch-btn active" data-potions-type="potions" onclick="switchPotionsType('potions')">
                🧪 Potions
            </button>
            <button class="potions-switch-btn" data-potions-type="food" onclick="switchPotionsType('food')">
                🍖 Food
            </button>
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

    // Set the content
    container.innerHTML = fullHTML;
    
    console.log('✅ Potions & Food content loaded successfully');
    
    // Reset to potions view
    currentPotionsType = 'potions';
}

// Force re-initialization function
function forceReinitializePotions() {
    console.log('🔄 Force reinitializing Potions & Food...');
    potionsInitialized = false;
    window.potionsInitialized = false;
    
    setTimeout(() => {
        initializePotions();
    }, 100);
}

// Debug function
function debugPotions() {
    console.log('=== POTIONS DEBUG ===');
    console.log('Initialized:', potionsInitialized);
    console.log('Current type:', currentPotionsType);
    console.log('Container exists:', !!document.getElementById('potionsContainer'));
    console.log('Page exists:', !!document.getElementById('potionsPage'));
    console.log('Potions data length:', potionsData.length);
    console.log('Food data length:', foodData.length);
    console.log('Window functions available:');
    console.log('- initializePotions:', typeof window.initializePotions);
    console.log('- switchPotionsType:', typeof window.switchPotionsType);
    console.log('====================');
}

// Get potions data for external use
function getPotionsData() {
    return {
        potions: potionsData,
        food: foodData,
        initialized: potionsInitialized,
        currentType: currentPotionsType
    };
}

// Expose functions globally with error handling
try {
    window.initializePotions = initializePotions;
    window.switchPotionsType = switchPotionsType;
    window.forceReinitializePotions = forceReinitializePotions;
    window.debugPotions = debugPotions;
    window.getPotionsData = getPotionsData;
    window.potionsInitialized = potionsInitialized;
    
    console.log('✅ Potions module functions exposed globally');
} catch (error) {
    console.error('❌ Error exposing potions functions:', error);
}

// Auto-initialize if DOM is ready and container exists
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 DOM ready, checking for potions container...');
    
    setTimeout(() => {
        const container = document.getElementById('potionsContainer');
        if (container && !potionsInitialized) {
            console.log('🧪 Auto-initializing potions...');
            initializePotions();
        }
    }, 500);
});

// Also try to initialize when content is loaded
document.addEventListener('contentLoaded', function() {
    console.log('🔄 Content loaded, initializing potions...');
    
    setTimeout(() => {
        if (!potionsInitialized) {
            initializePotions();
        }
    }, 200);
});

// Initialize when the potions page becomes active
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

console.log('✅ potions.js module loaded successfully with enhanced initialization and debugging');
