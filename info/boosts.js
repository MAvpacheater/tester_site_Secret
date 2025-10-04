// Boosts functionality - Creates full page structure

// Boosts data structure
const boostsData = {
    "Mutation": [
        { name: "Gloving", multiplier: "1.2x" },
        { name: "Rainbow", multiplier: "1.35x" },
        { name: "Ghost", multiplier: "2x" },
        { name: "Cosmic", multiplier: "2.5x" }
    ],
    "Slimes": [
        { name: "Yellow", multiplier: "1.2x" },
        { name: "Blue", multiplier: "1.4x" },
        { name: "Purple", multiplier: "1.65x" },
        { name: "Red", multiplier: "2.25x" },
        { name: "Black", multiplier: "2.4x" },
        { name: "Green", multiplier: "2.55x" },
        { name: "Orange", multiplier: "2.7x" },
        { name: "Christmas (Xmas)", multiplier: "2.85x" },
        { name: "Neowave", multiplier: "3x" },
        { name: "Shock", multiplier: "3.15x" }
    ],
    "Evolution and Size": [
        { name: "Baby", multiplier: "1x" },
        { name: "Big", multiplier: "1.5x" },
        { name: "Huge", multiplier: "2x" },
        { name: "Goliath", multiplier: "2.5x" },
        { name: "", multiplier: "", separator: true },
        { name: "Golden", multiplier: "1.5x" },
        { name: "Void", multiplier: "2x" },
        { name: "Pristine", multiplier: "2.17x" }
    ]
};

let boostsInitialized = false;

// Create page structure
function createBoostsStructure() {
    const page = document.getElementById('boostsPage');
    if (!page) return console.error('❌ Boosts page not found');
    
    // Create title
    const title = document.createElement('h1');
    title.className = 'title';
    title.textContent = 'Boosts Information';
    
    // Create container
    const container = document.createElement('div');
    container.className = 'boosts-container';
    container.id = 'boostsContainer';
    
    // Clear page and add elements
    page.innerHTML = '';
    page.appendChild(title);
    page.appendChild(container);
    
    console.log('✅ Boosts structure created');
}

// Generate boosts content
function generateBoostsContent() {
    const container = document.getElementById('boostsContainer');
    if (!container) {
        console.error('❌ Boosts container not found');
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Generate sections for each category
    Object.entries(boostsData).forEach(([category, items]) => {
        // Create section
        const section = document.createElement('div');
        section.className = 'boost-section';
        
        // Create section title
        const title = document.createElement('h2');
        title.className = 'section-title';
        title.textContent = category;
        section.appendChild(title);
        
        // Create items grid
        const grid = document.createElement('div');
        grid.className = 'boost-grid';
        
        items.forEach(item => {
            if (item.separator) {
                // Add separator
                const separator = document.createElement('div');
                separator.className = 'boost-separator';
                grid.appendChild(separator);
            } else if (item.name && item.multiplier) {
                // Create boost item
                const boostItem = document.createElement('div');
                boostItem.className = 'boost-item';
                boostItem.innerHTML = `
                    <span class="boost-name">${item.name}</span>
                    <span class="boost-multiplier">${item.multiplier}</span>
                `;
                grid.appendChild(boostItem);
            }
        });
        
        section.appendChild(grid);
        container.appendChild(section);
    });
    
    console.log(`✅ Generated ${Object.keys(boostsData).length} boost categories`);
}

// Initialize boosts
function initializeBoosts() {
    if (boostsInitialized) {
        console.log('🔄 Boosts already initialized');
        return;
    }
    
    console.log('🚀 Initializing boosts...');
    
    createBoostsStructure();
    generateBoostsContent();
    
    boostsInitialized = true;
    window.boostsInitialized = true;
    
    console.log('✅ Boosts initialized successfully');
}

// Auto-initialize when page becomes active
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const page = document.getElementById('boostsPage');
        if (page?.classList.contains('active')) {
            initializeBoosts();
        }
    }, 100);
});

// Listen for page activation
document.addEventListener('click', (e) => {
    if (e.target?.getAttribute('data-page') === 'boosts') {
        setTimeout(() => {
            if (!boostsInitialized) {
                initializeBoosts();
            }
        }, 300);
    }
});

// Observer for page activation
const boostsObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const boostsPage = document.getElementById('boostsPage');
            if (boostsPage?.classList.contains('active') && !boostsInitialized) {
                console.log('📊 Boosts page activated, initializing...');
                initializeBoosts();
            }
        }
    });
});

// Start observing
document.addEventListener('DOMContentLoaded', () => {
    const boostsPage = document.getElementById('boostsPage');
    if (boostsPage) {
        boostsObserver.observe(boostsPage, { attributes: true });
    }
});

// Global exports
window.initializeBoosts = initializeBoosts;
window.generateBoostsContent = generateBoostsContent;
window.boostsInitialized = boostsInitialized;

console.log('✅ Boosts.js loaded');
