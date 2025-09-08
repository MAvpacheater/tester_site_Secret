// Secret Pets Module
let secretInitialized = false;

// Hatch rewards data
const hatchRewards = [
    { hatch: 1, reward: "+1 egg hatch" },
    { hatch: 2, reward: "+1 egg hatch" },
    { hatch: 3, reward: "+1 equip" },
    { hatch: 4, reward: "+1 egg hatch" },
    { hatch: 5, reward: "+1 egg hatch" },
    { hatch: 6, reward: "+1 equip" },
    { hatch: 7, reward: "+1 egg hatch" },
    { hatch: 8, reward: "+1 egg hatch" },
    { hatch: 9, reward: "+1 equip" },
    { hatch: 10, reward: "+1 egg hatch" },
    { hatch: 11, reward: "+1 egg hatch" },
    { hatch: 12, reward: "+1 equip" }
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

function loadSecretContent() {
    const container = document.getElementById('secretContainer');
    if (!container) {
        console.error('❌ Secret container not found');
        return;
    }

    // Generate hatch rewards grid
    const hatchRewardsHTML = hatchRewards.map(item => `
        <div class="hatch-reward-card">
            <div class="hatch-number">Hatch ${item.hatch}</div>
            <div class="hatch-reward">${item.reward}</div>
        </div>
    `).join('');

    // Create the complete secret pets content
    const secretHTML = `
        <div class="hatch-rewards-grid">
            ${hatchRewardsHTML}
        </div>
        
        <div class="secret-image-container">
            <img src="https://via.placeholder.com/500x317/667eea/ffffff?text=Secret+Pets" 
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
                Each secret pet requires specific world conditions to hatch
            </div>
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
            this.src = 'https://via.placeholder.com/500x317/e74c3c/ffffff?text=Image+Not+Found';
            this.alt = 'Image not available';
        });
    }

    console.log('✅ Secret pets content loaded');
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

function getHatchRewards() {
    return [...hatchRewards]; // Return a copy to prevent external modifications
}

// Animation helper for smooth transitions
function animateSecretCards() {
    const cards = document.querySelectorAll('.hatch-reward-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize cards with hidden state for animation
function setupSecretAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        .hatch-reward-card {
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

// Make functions globally available
window.initializeSecret = initializeSecret;
window.initializeSecretWithAnimations = initializeSecretWithAnimations;
window.updateSecretImage = updateSecretImage;
window.updateHatchReward = updateHatchReward;
window.getHatchRewards = getHatchRewards;

console.log('✅ secret.js loaded successfully');
