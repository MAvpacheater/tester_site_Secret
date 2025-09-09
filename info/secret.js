// Secret Pets Module - UPDATED WITH IMAGES
let secretInitialized = false;
let currentSecretType = 'rewards';

// Hatch rewards data with image URLs
const hatchRewards = [
    { 
        hatch: 1, 
        reward: "+1 egg hatch", 
        imageUrl: "" // Add your image URL here
    },
    { 
        hatch: 3, 
        reward: "+1 equip", 
        imageUrl: "" // Add your image URL here
    },
    { 
        hatch: 5, 
        reward: "+1 egg hatch", 
        imageUrl: "" // Add your image URL here
    },
    { 
        hatch: 9, 
        reward: "+1 equip", 
        imageUrl: "" // Add your image URL here
    },
    { 
        hatch: 12, 
        reward: "+1 egg hatch", 
        imageUrl: "" // Add your image URL here
    }
];

// Secret pets data with image URLs (15 entries)
const secretPetsData = [
    { 
        name: "Arcane Hydra", 
        boosts: "Percentage 150% | Power 40m", 
        world: "World 4",
        imageUrl: "" // Add your image URL here
    },
    { 
        name: "Hatched Phoenix", 
        boosts: "Percentage 160% | Power 50m", 
        world: "World 5",
        imageUrl: "" // Add your image URL here
    },
    { 
        name: "Voidwalker", 
        boosts: "Percentage 170% | Power 78,5m", 
        world: "World 6",
        imageUrl: "" // Add your image URL here
    },
    { 
        name: "Stardust Dragon", 
        boosts: "Percentage 180% | Power 115m", 
        world: "World 7",
        imageUrl: "" // Add your image URL here
    },
    { 
        name: "Nebula Fantom", 
        boosts: "Percentage 190% | Power 160m", 
        world: "World 8",
        imageUrl: "" // Add your image URL here
    },
    { 
        name: "Flaming Beast", 
        boosts: "Percentage 200% | Power 215m", 
        world: "World 9",
        imageUrl: "" // Add your image URL here
    },
    { 
        name: "Magic Dominus", 
        boosts: "Percentage 210% | Power 240m", 
        world: "World 10",
        imageUrl: "" // Add your image URL here
    },
    { 
        name: "Sparkly Penguin", 
        boosts: "Percentage 215% | Power 275m", 
        world: "World 11",
        imageUrl: "" // Add your image URL here
    },
    { 
        name: "Totem Dominus", 
        boosts: "Percentage 220% | Power 300m", 
        world: "World 12",
        imageUrl: "" // Add your image URL here
    },
    { 
        name: "Kingdom Hydra", 
        boosts: "Percentage 225% | Power 340m", 
        world: "World 13",
        imageUrl: "" // Add your image URL here
    },
    { 
        name: "Sapphire Cat", 
        boosts: "Percentage 230% | Power 385m", 
        world: "World 14",
        imageUrl: "" // Add your image URL here
    },
    { 
        name: "Heavenly Secret", 
        boosts: "Percentage 240% | Power 425m", 
        world: "World 15",
        imageUrl: "" // Add your image URL here
    },
    { 
        name: "???", 
        boosts: "Percentage ??? | Power ???", 
        world: "World 21",
        imageUrl: "" // Add your image URL here
    },
    { 
        name: "Halloween Secret", 
        boosts: "Percentage 240% | Power 435m", 
        world: "Halloween",
        imageUrl: "" // Add your image URL here
    },
    { 
        name: "Mega American Serpent", 
        boosts: "Percentage 315% | Power 1.3b", 
        world: "USA",
        imageUrl: "" // Add your image URL here
    }
];

function initializeSecret() {
    console.log('🔮 Initializing Secret Pets...');
    
    // Check if already initialized and force reinit
    if (secretInitialized) {
        console.log('⚠️ Secret already initialized, forcing reload...');
        secretInitialized = false;
    }
    
    // Check if container exists
    const container = document.getElementById('secretContainer');
    if (!container) {
        console.error('❌ Secret container not found');
        return;
    }
    
    try {
        loadSecretContent();
        secretInitialized = true;
        window.secretInitialized = true;
        console.log('✅ Secret Pets initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing Secret Pets:', error);
        secretInitialized = false;
    }
}

// Switch between secret types (rewards/names)
function switchSecretType(type) {
    console.log(`🔄 Switching secret type to: ${type}`);
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
        console.log(`✅ Switched to section: ${type}Section`);
    } else {
        console.error(`❌ Section ${type}Section not found`);
    }
}

// Function to handle image loading errors
function handleImageError(img) {
    img.style.display = 'flex';
    img.style.alignItems = 'center';
    img.style.justifyContent = 'center';
    img.style.background = 'linear-gradient(135deg, #e2e8f0, #cbd5e0)';
    img.style.color = '#64748b';
    img.style.fontSize = '0.8em';
    img.style.fontWeight = '500';
    img.innerHTML = 'No Image';
    img.removeAttribute('src');
}

function loadSecretContent() {
    const container = document.getElementById('secretContainer');
    if (!container) {
        console.error('❌ Secret container not found');
        return;
    }

    console.log('📝 Loading secret content...');

    // Generate hatch rewards grid for Rewards section with images
    const hatchRewardsHTML = hatchRewards.map(item => {
        const imageHTML = item.imageUrl ? 
            `<img src="${item.imageUrl}" alt="Hatch ${item.hatch} Reward" class="hatch-reward-image" onerror="handleImageError(this)">` :
            `<div class="hatch-reward-image" style="background: linear-gradient(135deg, #e2e8f0, #cbd5e0); display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 0.8em; font-weight: 500;">No Image</div>`;
        
        return `
            <div class="hatch-reward-card">
                ${imageHTML}
                <div class="hatch-reward-content">
                    <div class="hatch-number">Hatch ${item.hatch}</div>
                    <div class="hatch-reward">${item.reward}</div>
                </div>
            </div>
        `;
    }).join('');

    // Generate secret pets list for Names section with images
    const secretPetsHTML = secretPetsData.map(pet => {
        const imageHTML = pet.imageUrl ? 
            `<img src="${pet.imageUrl}" alt="${pet.name}" class="secret-pet-image" onerror="handleImageError(this)">` :
            `<div class="secret-pet-image" style="background: linear-gradient(135deg, #e2e8f0, #cbd5e0); display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 0.8em; font-weight: 500;">No Image</div>`;
        
        return `
            <div class="secret-pet-item">
                ${imageHTML}
                <div class="secret-pet-content">
                    <div class="secret-pet-name">${pet.name}</div>
                    <div class="secret-pet-boosts">${pet.boosts}</div>
                </div>
                <div class="secret-pet-world">${pet.world}</div>
            </div>
        `;
    }).join('');

    // Create the complete secret pets content with switcher
    const fullHTML = `
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

    container.innerHTML = fullHTML;
    console.log('✅ Secret pets content loaded with switcher and image support');
    
    // Add loading effect to main image
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
}

// Make functions globally available
window.initializeSecret = initializeSecret;
window.switchSecretType = switchSecretType;
window.handleImageError = handleImageError;
window.secretInitialized = secretInitialized;

console.log('✅ secret.js UPDATED with image support loaded successfully');
