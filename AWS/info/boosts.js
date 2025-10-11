// BOOSTS - Optimized
(() => {
    let initialized = false;

    const data = {
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
            { separator: true },
            { name: "Golden", multiplier: "1.5x" },
            { name: "Void", multiplier: "2x" },
            { name: "Pristine", multiplier: "2.17x" }
        ]
    };

    const createStructure = () => {
        const page = document.getElementById('boostsPage');
        if (!page) return console.error('❌ Boosts page not found');
        
        page.innerHTML = `
            <h1 class="title">Boosts Information</h1>
            <div class="boosts-container" id="boostsContainer"></div>
        `;
        
        console.log('✅ Boosts structure created');
    };

    const generateContent = () => {
        const container = document.getElementById('boostsContainer');
        if (!container) return console.error('❌ Boosts container not found');
        
        container.innerHTML = '';
        
        Object.entries(data).forEach(([category, items]) => {
            const section = document.createElement('div');
            section.className = 'boost-section';
            
            const title = document.createElement('h2');
            title.className = 'section-title';
            title.textContent = category;
            section.appendChild(title);
            
            const grid = document.createElement('div');
            grid.className = 'boost-grid';
            
            items.forEach(item => {
                if (item.separator) {
                    const sep = document.createElement('div');
                    sep.className = 'boost-separator';
                    grid.appendChild(sep);
                } else if (item.name && item.multiplier) {
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
        
        console.log(`✅ Generated ${Object.keys(data).length} boost categories`);
    };

    const init = () => {
        if (initialized) {
            console.log('🔄 Boosts already initialized');
            return;
        }
        
        console.log('🚀 Initializing boosts...');
        
        createStructure();
        generateContent();
        
        initialized = true;
        window.boostsInitialized = true;
        
        console.log('✅ Boosts initialized successfully');
    };

    const checkInit = () => {
        const page = document.getElementById('boostsPage');
        if (page?.classList.contains('active') && !initialized) {
            console.log('📊 Boosts page activated, initializing...');
            init();
        }
    };

    document.addEventListener('DOMContentLoaded', () => setTimeout(checkInit, 100));
    
    document.addEventListener('click', e => {
        if (e.target?.getAttribute('data-page') === 'boosts') {
            setTimeout(checkInit, 300);
        }
    });

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mut => {
            if (mut.type === 'attributes' && mut.attributeName === 'class') {
                checkInit();
            }
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        const page = document.getElementById('boostsPage');
        if (page) observer.observe(page, { attributes: true });
    });

    Object.assign(window, {
        initializeBoosts: init,
        generateBoostsContent: generateContent,
        boostsInitialized: initialized
    });

    console.log('✅ Boosts.js loaded');
})();
