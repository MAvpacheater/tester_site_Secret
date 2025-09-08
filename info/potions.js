// Potions & Food Module - FIXED
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
    console.log('🧪 Initializing Potions & Food...');
    
    // Check if already initialized and force reinit
    if (potionsInitialized) {
        console.log('⚠️ Potions already initialized, forcing reload...');
        potionsInitialized = false;
    }

    // Check if container exists
    const container = document.getElementById('potionsContainer');
    if (!container) {
        console.error('❌ Potions container not found');
        return;
    }
    
    try {
        loadPotionsContent();
        potionsInitialized = true;
        window.potionsInitialized = true;
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
    const fullHTML = `
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

    container.innerHTML = fullHTML;
    console.log('✅ Potions & Food content loaded with switcher');
    
    // Add small delay for animations
    setTimeout(() => {
        console.log(`📊 Potions loaded: ${potionsData.length} potions, ${foodData.length} foods`);
    }, 100);
}

// Make functions globally available
window.initializePotions = initializePotions;
window.switchPotionsType = switchPotionsType;
window.potionsInitialized = potionsInitialized;

console.log('✅ potions.js FIXED loaded successfully');
