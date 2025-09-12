// Fixed and optimized Charms functionality

// State management - using let instead of const for reassignable variables
let charmsCurrentLanguage = 'en';
let charmsTranslations = null;
let charmsInitialized = false;

// Utility functions
const getCurrentLanguage = () => localStorage.getItem('armHelper_language') || 'en';

// Load translations with fallback
async function loadCharmsTranslations() {
    if (charmsTranslations) return charmsTranslations;
    
    try {
        console.log('📥 Loading charms translations...');
        const response = await fetch('languages/charms.json');
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        charmsTranslations = await response.json();
        console.log('✅ Charms translations loaded');
        return charmsTranslations;
    } catch (error) {
        console.error('❌ Error loading charms translations:', error);
        
        // Fallback data
        charmsTranslations = {
            en: {
                title: "Charms Boosts",
                loading: "Loading charms...",
                error: "Error loading charms data",
                retry: "Retry",
                charms: [
                    {
                        title: "Infinite charm",
                        imageUrl: "https://i.postimg.cc/W4TNJQmF/2025-09-07-09-40-22.png",
                        description: "Gives 20% to training rep",
                        details: "Max stock: 5",
                        category: "charm"
                    },
                    {
                        title: "Leadboard charm",
                        imageUrl: "https://i.postimg.cc/vHwZsg1t/image.png",
                        description: "Gives 18% to training rep",
                        details: "Max stock: 7",
                        category: "charm"
                    },
                    {
                        title: "Endless charm",
                        imageUrl: "https://i.postimg.cc/76TqvwwR/2025-09-07-10-00-26.png",
                        description: "Gives 15% to training rep",
                        details: "Max stock: 10",
                        category: "charm"
                    },
                    {
                        title: "Luck charm",
                        imageUrl: "https://i.postimg.cc/wB1pJgyB/2025-09-07-10-01-45.png",
                        description: "Adds 5% to luck",
                        details: "Max stock: 16",
                        category: "charm"
                    },
                    {
                        title: "Training charms",
                        imageUrl: "https://i.postimg.cc/FRZLQ0bY/telegram-cloud-photo-size-2-5190785500309485773-m.jpg",
                        description: "Gives 5% to training rep",
                        details: "Max stock: 16",
                        category: "charm"
                    },
                    {
                        title: "Loot charm",
                        imageUrl: "https://i.postimg.cc/7LtL8K75/2025-09-07-09-55-01.png",
                        description: "Gives 5% to find loot from boss",
                        details: "Max stock: 16",
                        category: "charm"
                    },
                    {
                        title: "Winner charm",
                        imageUrl: "https://i.postimg.cc/XY8JxjYc/2025-09-07-09-55-06.png",
                        description: "Gives 5% more winns from boss",
                        details: "Max stock: 16",
                        category: "charm"
                    },
                    {
                        title: "Coal charm",
                        imageUrl: "https://i.postimg.cc/B68nq2cM/2025-09-07-09-54-40.png",
                        description: "You can remove charm from pet",
                        details: "1 useful",
                        category: "charm"
                    }
                ]
            }
        };
        return charmsTranslations;
    }
}

// Update language
function updateCharmsLanguage(newLanguage) {
    if (newLanguage === charmsCurrentLanguage) return;
    
    console.log(`🔮 Updating charms language: ${charmsCurrentLanguage} → ${newLanguage}`);
    charmsCurrentLanguage = newLanguage;
    
    // Update title if page exists
    const titleElement = document.querySelector('.charms-page .title');
    if (titleElement && charmsTranslations?.[newLanguage]) {
        titleElement.textContent = charmsTranslations[newLanguage].title;
    }
    
    // Regenerate content if initialized
    if (charmsInitialized) {
        setTimeout(generateCharmsContent, 100);
    }
}

// Generate content
async function generateCharmsContent() {
    const container = document.getElementById('charmsContainer');
    if (!container) {
        console.error('❌ Charms container not found');
        return;
    }
    
    charmsCurrentLanguage = getCurrentLanguage();
    
    if (!charmsTranslations) {
        await loadCharmsTranslations();
    }
    
    const langData = charmsTranslations[charmsCurrentLanguage] || charmsTranslations['en'];
    
    // Show loading
    container.innerHTML = `<div class="charms-loading">${langData.loading}</div>`;
    
    try {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        container.innerHTML = '';
        
        // Generate items
        langData.charms.forEach((charm, index) => {
            const item = document.createElement('div');
            item.className = 'charm-item';
            item.style.animationDelay = `${0.1 + (index * 0.05)}s`;
            item.innerHTML = `
                <div class="charm-image-container">
                    <img src="${charm.imageUrl}" alt="${charm.title}" class="charm-image" loading="lazy">
                </div>
                <div class="charm-content">
                    <div class="charm-title">${charm.title}</div>
                    <div class="charm-description">${charm.description}</div>
                    <div class="charm-details">${charm.details}</div>
                    <div class="charm-category ${charm.category}">${charm.category}</div>
                </div>
            `;
            container.appendChild(item);
        });
        
        console.log(`✅ Generated ${langData.charms.length} charms`);
        
    } catch (error) {
        console.error('❌ Error generating charms:', error);
        container.innerHTML = `
            <div class="charms-error">
                ⚠️ ${langData.error}
                <br>
                <button class="retry-btn" onclick="generateCharmsContent()">${langData.retry}</button>
            </div>
        `;
    }
}

// Initialize with better error handling
async function initializeCharms() {
    console.log('🔮 Initializing charms...');
    
    const charmsPage = document.getElementById('charmsPage');
    const container = document.getElementById('charmsContainer');
    
    if (!charmsPage) {
        console.error('❌ Charms page not found');
        return;
    }
    
    if (!container) {
        console.error('❌ Charms container not found');
        return;
    }
    
    // Prevent double initialization
    if (charmsInitialized) {
        console.log('🔮 Charms already initialized');
        return;
    }
    
    try {
        charmsCurrentLanguage = getCurrentLanguage();
        
        await loadCharmsTranslations();
        
        // Update title
        const titleElement = charmsPage.querySelector('.title');
        if (titleElement && charmsTranslations[charmsCurrentLanguage]) {
            titleElement.textContent = charmsTranslations[charmsCurrentLanguage].title;
        }
        
        await generateCharmsContent();
        
        charmsInitialized = true;
        window.charmsInitialized = true;
        
        console.log('✅ Charms initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing charms:', error);
        
        // Show error in container
        if (container) {
            container.innerHTML = `
                <div class="charms-error">
                    ⚠️ Failed to load charms
                    <br>
                    <button class="retry-btn" onclick="window.initializeCharms()">Try Again</button>
                </div>
            `;
        }
    }
}

// Event listeners
document.addEventListener('languageChanged', (e) => {
    if (e.detail?.language) {
        updateCharmsLanguage(e.detail.language);
    }
});

document.addEventListener('click', (e) => {
    if (e.target?.getAttribute?.('data-page') === 'charms') {
        setTimeout(() => {
            if (!charmsInitialized) {
                initializeCharms();
            }
        }, 300);
    }
});

// Global exports
Object.assign(window, {
    initializeCharms,
    updateCharmsLanguage,
    generateCharmsContent,
    charmsInitialized: () => charmsInitialized
});

console.log('✅ Optimized charms.js loaded');
