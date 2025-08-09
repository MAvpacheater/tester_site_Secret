// Boosts functionality

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
        { name: "Goliath", multiplier: "1.25x" },
        { name: "", multiplier: "", separator: true },
        { name: "Golden", multiplier: "1.5x" },
        { name: "Void", multiplier: "2x" },
        { name: "Pristine", multiplier: "1.08x" }
    ]
};

// Generate boosts content
function generateBoostsContent() {
    const container = document.getElementById('boostsContainer');
    if (!container) {
        console.error('Element with ID "boostsContainer" not found');
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
    
    console.log('Boosts content generated successfully');
}

// Initialize boosts
function initializeBoosts() {
    console.log('Initializing boosts...');
    generateBoostsContent();
}

// Make sure content is generated when boosts page becomes active
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const boostsPage = document.getElementById('boostsPage');
                if (boostsPage && boostsPage.classList.contains('active')) {
                    console.log('Boosts page became active, generating content...');
                    generateBoostsContent();
                }
            }
        });
    });
    
    // Observe changes to pages
    document.querySelectorAll('.page').forEach(page => {
        observer.observe(page, { attributes: true });
    });
});

// Global function for window object (fallback)
window.generateBoostsContent = generateBoostsContent;
