// Secret Pets Module
let secretInitialized = false;
let currentSecretType = 'rewards';

// Hatch rewards data
const hatchRewards = [
    { hatch: 1, reward: "+1 egg hatch" },
    { hatch: 3, reward: "+1 equip" },
    { hatch: 5, reward: "+1 egg hatch" },
    { hatch: 9, reward: "+1 equip" },
    { hatch: 12, reward: "+1 egg hatch" }
];

// Secret pets data (15 entries)
const secretPetsData = [
    { name: "Shadow Phoenix", boosts: "Dark Magic +300% | Fire Resistance +150%", world: "World 4" },
    { name: "Crystal Dragon", boosts: "Ice Damage +250% | Crystal Shield +200%", world: "World 5" },
    { name: "Void Reaper", boosts: "Death Magic +400% | Soul Drain +180%", world: "World 7" },
    { name: "Celestial Unicorn", boosts: "Holy Power +320% | Healing +220%", world: "World 8" },
    { name: "Inferno Wolf", boosts: "Fire Damage +280% | Speed Boost +160%", world: "World 9" },
    { name: "Storm Eagle", boosts: "Lightning Strike +350% | Flight Speed +190%", world: "World 10" },
    { name: "Mystic Serpent", boosts: "Poison Cloud +300% | Stealth +170%", world: "World 11" },
    { name: "Arcane Bear", boosts: "Magic Resistance +250% | Strength +200%", world: "World 12" },
    { name: "Phantom Tiger", boosts: "Shadow Strike +380% | Invisibility +210%", world: "World 13" },
    { name: "Radiant Pegasus", boosts: "Light Beam +340% | Flying Speed +180%", world: "World 14" },
    { name: "Cursed Raven", boosts: "Dark Curse +290% | Mind Control +160%", world: "World 15" },
    { name: "Golden Sphinx", boosts: "Ancient Wisdom +400% | Riddle Power +250%", world: "World 21" },
    { name: "Demonic Bat", boosts: "Blood Drain +310% | Night Vision +170%", world: "World 21" },
    { name: "Divine Lion", boosts: "Sacred Roar +360% | Divine Protection +200%", world: "World 21" },
    { name: "Cosmic Owl", boosts: "Starlight +420% | Time Manipulation +280%", world: "World 21" }
];

function initializeSecret() {
    if (secretInitialized) {
        console.log('⚠️ Secret module already initialized');
        return;
    }

    console.log('🔮 Initializing Secret Pets...');
    
    try {
        loadSecretContent();
        secretInitialized = true;
        console.log('✅ Secret Pets initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing Secret Pets:', error);
    }
}

// Switch between secret types (rewards/names)
function switchSecretType(type) {
    currentSecretType = type;
    
    // Update button states
    document.querySelectorAll('.secret-switch-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-secret-type="${type}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Update sections
    document.querySelectorAll('.secret-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const activeSection = document.getElementById(`${type}Section`);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    console.log(`Switched to secret type: ${type}`);
}

function loadSecretContent() {
    const container = document.getElementById('secretContainer');
    if (!container) {
        console.error('❌ Secret container not found');
        return;
    }

    // Generate hatch rewards grid for Rewards section
    const hatchRewardsHTML = hatchRewards.map(item => `
        <div class="hatch-reward-card">
            <div class="hatch-number">Hatch ${item.hatch}</div>
            <div class="hatch-reward">${item.reward}</div>
        </div>
    `).join('');

    // Generate secret pets list for Names section
    const secretPetsHTML = secretPetsData.map(pet => `
        <div class="secret-pet-item">
            <div class="secret-pet-content">
                <div class="secret-pet-name">${pet.name}</div>
                <div class="secret-pet-boosts">${pet.boosts}</div>
            </div>
            <div class="secret-pet-world">${pet.world}</div>
        </div>
    `).join('');

    // Create the complete secret pets content with switcher
    const secretHTML = `
        <!-- Secret Type Switcher -->
        <div class="secret-switcher">
            <button class="secret-switch-btn active" data-secret-type="rewards" onclick="switchSecretType('rewards')">Rewards</button>
            <button class="secret-switch-btn" data-secret-type="names" onclick="switchSecretType('names')">Names</button>
        </div>
        
        <!-- Rewards Section -->
        <div class="secret-section active" id="rewardsSection">
            <div class="hatch-rewards-grid">
                ${hatchRewardsHTML}
            </div>
            
            <div class="secret-image-container">
                <img src="https://i.postimg.cc/MTvCfmFj/2025-09-08-13-11-34.jpg" 
                     alt="Secret Pets" 
                     class="secret-image"
                     loading="lazy">
            </div>
            
            <div class="secret-info">
                <h3>Secret Pets Information</h3>
                <div class="secret-info-text">
                    You can hatch secrets pets on <span class="secret-worlds-highlight">4-15 and 21 worlds</span>
                </div>
                <div class="secret-info-text">
                    Rn on game <span class="secret-count-highlight">15 secret pets</span>
                </div>
                <div class="secret-info-text">
                    Secret pets have unique abilities and special stats bonuses
                </div>
                <div class="secret-info-text">
                    P.S. I spent 1-2 days to knock out 1 secret (I had 5.5m lucky)
                </div>
            </div>
        </div>
        
        <!-- Names Section -->
        <div class="secret-section" id="namesSection">
            ${secretPetsHTML}
        </div>
    `;

    container.innerHTML = secretHTML;
    
    // Add loading effect to image
    const secretImage = container.querySelector('.secret-image');
    if (secretImage) {
        secretImage.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        secretImage.addEventListener('error', function() {
            this.src = 'https://via.placeholder.com/500x317/667eea/ffffff?text=Secret+Pets';
            this.alt = 'Secret Pets Image';
        });
    }

    console.log('✅ Secret pets content loaded with switcher');
}

// Generate secret pets content for names section
function generateSecretPetsContent() {
    const namesSection = document.getElementById('namesSection');
    if (!namesSection) {
        console.log('Names section not found');
        return;
    }
    
    namesSection.innerHTML = '';
    
    secretPetsData.forEach(pet => {
        const petItem = document.createElement('div');
        petItem.className = 'secret-pet-item';
        petItem.innerHTML = `
            <div class="secret-pet-content">
                <div class="secret-pet-name">${pet.name}</div>
                <div class="secret-pet-boosts">${pet.boosts}</div>
            </div>
            <div class="secret-pet-world">${pet.world}</div>
        `;
        namesSection.appendChild(petItem);
    });
    
    console.log(`Generated ${secretPetsData.length} secret pets`);
}

// Utility functions
function updateSecretImage(newImageUrl) {
    const secretImage = document.querySelector('.secret-image');
    if (secretImage && newImageUrl) {
        secretImage.src = newImageUrl;
        console.log('🖼️ Secret image updated');
    }
}

function updateHatchReward(hatchNumber, newReward) {
    const hatchIndex = hatchRewards.findIndex(item => item.hatch === hatchNumber);
    if (hatchIndex !== -1) {
        hatchRewards[hatchIndex].reward = newReward;
        // Reload content to reflect changes
        loadSecretContent();
        console.log(`✅ Hatch ${hatchNumber} reward updated to: ${newReward}`);
    } else {
        console.error(`❌ Hatch ${hatchNumber} not found`);
    }
}

function addSecretPet(name, boosts, world) {
    secretPetsData.push({ name, boosts, world });
    loadSecretContent();
    console.log(`✅ Added new secret pet: ${name}`);
}

function getHatchRewards() {
    return [...hatchRewards]; // Return a copy to prevent external modifications
}

function getSecretPetsData() {
    return [...secretPetsData]; // Return a copy to prevent external modifications
}

// Animation helper for smooth transitions
function animateSecretCards() {
    const cards = document.querySelectorAll('.hatch-reward-card, .secret-pet-item');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// Initialize cards with hidden state for animation
function setupSecretAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        .hatch-reward-card,
        .secret-pet-item {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
    `;
    document.head.appendChild(style);
    
    // Trigger animation after a short delay
    setTimeout(animateSecretCards, 200);
}

// Enhanced initialization with animations
function initializeSecretWithAnimations() {
    initializeSecret();
    setTimeout(setupSecretAnimations, 100);
}

// Make sure DOM is ready before running
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeSecret, 100);
    });
} else {
    setTimeout(initializeSecret, 100);
}

// Make functions globally available
window.initializeSecret = initializeSecret;
window.initializeSecretWithAnimations = initializeSecretWithAnimations;
window.switchSecretType = switchSecretType;
window.updateSecretImage = updateSecretImage;
window.updateHatchReward = updateHatchReward;
window.addSecretPet = addSecretPet;
window.getHatchRewards = getHatchRewards;
window.getSecretPetsData = getSecretPetsData;

console.log('✅ secret.js loaded successfully with switcher functionality');
