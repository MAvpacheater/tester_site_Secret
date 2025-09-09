// Potions & Food Module - COMPLETE VERSION WITH IMAGES
console.log('🧪 Loading potions.js module with image support...');

// Global variables
let potionsInitialized = false;
let currentPotionsType = 'potions';

// Potions data - Enhanced with images
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

// Food data - Enhanced with images
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

// Main initialization function
function initializePotions() {
    console.log('🧪 Initializing Potions & Food module with images...');
    
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
        
        console.log('✅ Potions & Food module initialized successfully with images');
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

    console.log('📝 Loading potions content with images...');

    // Generate potions HTML with images
    const potionsHTML = potionsData.map((potion, index) => `
        <div class="potion-item" style="animation-delay: ${index * 50}ms;">
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

    // Generate food HTML with images
    const foodHTML = foodData.map((food, index) => `
        <div class="potion-item" style="animation-delay: ${index * 50}ms;">
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
    
    console.log('✅ Potions & Food content loaded successfully with images');
    
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

// Add image to existing data function
function updatePotionImage(type, name, imageUrl) {
    const data = type === 'potions' ? potionsData : foodData;
    const item = data.find(item => item.name === name);
    if (item) {
        item.image = imageUrl;
        console.log(`✅ Updated image for ${name}: ${imageUrl}`);
        // Refresh content if initialized
        if (potionsInitialized) {
            loadPotionsContent();
        }
        return true;
    } else {
        console.warn(`❌ Item ${name} not found in ${type} data`);
        return false;
    }
}

// Batch update images function
function batchUpdateImages(updates) {
    console.log('🔄 Batch updating images...');
    updates.forEach(update => {
        updatePotionImage(update.type, update.name, update.image);
    });
    console.log(`✅ Batch updated ${updates.length} images`);
}

// Expose functions globally with error handling
try {
    window.initializePotions = initializePotions;
    window.switchPotionsType = switchPotionsType;
    window.forceReinitializePotions = forceReinitializePotions;
    window.debugPotions = debugPotions;
    window.getPotionsData = getPotionsData;
    window.updatePotionImage = updatePotionImage;
    window.batchUpdateImages = batchUpdateImages;
    window.potionsInitialized = potionsInitialized;
    
    console.log('✅ Potions module functions exposed globally with image support');
} catch (error) {
    console.error('❌ Error exposing potions functions:', error);
}

// Auto-initialize if DOM is ready and container exists
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 DOM ready, checking for potions container...');
    
    setTimeout(() => {
        const container = document.getElementById('potionsContainer');
        if (container && !potionsInitialized) {
            console.log('🧪 Auto-initializing potions with images...');
            initializePotions();
        }
    }, 500);
});

// Also try to initialize when content is loaded
document.addEventListener('contentLoaded', function() {
    console.log('🔄 Content loaded, initializing potions with images...');
    
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
                console.log('🧪 Page switched to potions, reinitializing with images...');
                initializePotions();
            }
        }, 300);
    }
});

console.log('✅ potions.js module loaded successfully with image support and enhanced functionality');
