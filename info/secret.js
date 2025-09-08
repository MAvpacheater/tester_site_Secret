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
    { name: "Arcane Hydra", boosts: "Percentage 150% | Power 40m", world: "World 4" },
    { name: "Hatched Phoenix", boosts: "Percentage 160% | Power 50m", world: "World 5" },
    { name: "Voidwalker", boosts: "Percentage 170% | Power 78,5m", world: "World 6" },
    { name: "Stardust Dragon", boosts: "Percentage 180% | Power 115m", world: "World 7" },
    { name: "Nebula Fantom", boosts: "Percentage 190% | Power 160m", world: "World 8" },
    { name: "Flaming Beast", boosts: "Percentage 200% | Power 215m", world: "World 9" },
    { name: "Magic Dominus", boosts: "Percentage 210% | Power 240m", world: "World 10" },
    { name: "Sparkly Peanguin", boosts: "Percentage 215% | Power 275m", world: "World 11" },
    { name: "Totem Dominus", boosts: "Percentage 220% | Power 300m", world: "World 12" },
    { name: "KingdomHydra", boosts: "Percentage 225% | Power 340m", world: "World 13" },
    { name: "Saphire Cat", boosts: "Percentage 230% | Power 385m", world: "World 14" },
    { name: "Heavenly Secret", boosts: "Percentage 240% | Power 425m", world: "World 15" },
    { name: "???", boosts: "Percentage ??? | Power ???", world: "World 21" },
    { name: "Hallowen Secret", boosts: "Percentage 240% | Power 435m" "world: "Hallowen" },
    { name: "Mega American Serpent", boosts: "Percentage 315% | Power 1.3b" world: "Usa" }
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
