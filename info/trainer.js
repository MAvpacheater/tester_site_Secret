// Trainer functionality

// Trainer data
const trainerData = {
    free: [
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "free" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "free" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "free" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "free" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "free" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "free" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "free" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "free" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "free" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "free" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "free" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "free" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "free" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "free" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "free" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "free" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "free" },
        { name: "Pirate Peanguin [1/500k]", description: "205%/307.5% Strength -- 65%/97,5% luck -- 69%/103.5% wins", type: "free" },
        { name: "Princes [1/150k]", description: "190%/285% Strength -- 59%/88.5% luck -- 61%/91.5% wins", type: "free" },
        { name: "Sensei [1/100k]", description: "180%/270% Strength -- 56%/84% luck -- 58%/87% wins", type: "free" },
        { name: "Dominus lord [1/75k]", description: "160%/240% Strength -- 53%/79.5% luck -- 55%/82.5% wins", type: "free" },
        { name: "Vampire [1/50k]", description: "145%/217.5% Strength -- 50%/75% luck -- 52%/78% wins", type: "free" }
    ],
    donate: [
        { name: "Manager guard", description: "280%/420% Strength -- 108%/162% luck -- 118%/177% wins", type: "donate" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "donate" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "donate" },
        { name: "Shrine Master", description: "230%/345% Strength -- 77%/115.5% luck -- 85%/127.5% wins", type: "donate" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "donate" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "donate" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "donate" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "donate" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "donate" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "donate" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "donate" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "donate" },
        { name: "1/???", description: "???% Strength -- ???% luck -- ???% wins", type: "donate" }
    ]
};

let currentTrainerType = 'free';

// Switch between trainer types
function switchTrainerType(type) {
    currentTrainerType = type;
    
    // Update button states
    document.querySelectorAll('.trainer-switch-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-type="${type}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Update sections
    document.querySelectorAll('.trainer-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const activeSection = document.getElementById(`${type}Trainers`);
    if (activeSection) {
        activeSection.classList.add('active');
    }
}

// Generate trainer content for a specific type
function generateTrainerContent(type, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.log(`Container ${containerId} not found`);
        return;
    }
    
    container.innerHTML = '';
    
    const trainers = trainerData[type];
    if (!trainers) {
        console.log(`No trainers found for type: ${type}`);
        return;
    }
    
    trainers.forEach(trainer => {
        const trainerItem = document.createElement('div');
        trainerItem.className = 'trainer-item';
        trainerItem.innerHTML = `
            <div class="trainer-content">
                <div class="trainer-name">${trainer.name}</div>
                <div class="trainer-description">${trainer.description}</div>
            </div>
            <div class="trainer-type ${trainer.type}">${trainer.type}</div>
        `;
        container.appendChild(trainerItem);
    });
    
    console.log(`Generated ${trainers.length} trainers for ${type}`);
}

// Generate all trainer content
function generateAllTrainerContent() {
    console.log('Generating all trainer content...');
    generateTrainerContent('free', 'freeTrainers');
    generateTrainerContent('donate', 'donateTrainers');
}

// Initialize trainer functionality
function initializeTrainer() {
    console.log('Initializing trainer...');
    
    // Wait a bit for DOM to be ready
    setTimeout(() => {
        generateAllTrainerContent();
        switchTrainerType('free');
        console.log('Trainer initialization completed');
    }, 100);
}

// Make sure initializeTrainer runs when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTrainer);
} else {
    initializeTrainer();
}

// Also run when trainer page becomes active
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const trainerPage = document.getElementById('trainerPage');
                if (trainerPage && trainerPage.classList.contains('active')) {
                    console.log('Trainer page became active, regenerating content...');
                    generateAllTrainerContent();
                }
            }
        });
    });
    
    const trainerPage = document.getElementById('trainerPage');
    if (trainerPage) {
        observer.observe(trainerPage, { attributes: true });
    }
});

// Global function for window object (fallback)
window.switchTrainerType = switchTrainerType;
