// Charms functionality - Creates full page structure with multilingual support

let charmsCurrentLanguage = 'en';
let charmsTranslations = null;
let charmsInitialized = false;

// Get language from localStorage
function getCurrentLanguage() {
    return localStorage.getItem('armHelper_language') || 'en';
}

// Load translations with fallback
async function loadCharmsTranslations() {
    if (charmsTranslations) return charmsTranslations;
    
    try {
        console.log('📥 Loading charms translations...');
        const response = await fetch('info/charms/charms.json');
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
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

// Create page structure
function createCharmsStructure() {
    const page = document.getElementById('charmsPage');
    if (!page) return console.error('❌ Charms page not found');
    
    charmsCurrentLanguage = getCurrentLanguage();
    
    // Create title
    const title = document.createElement('h1');
    title.className = 'title';
    title.textContent = charmsTranslations?.[charmsCurrentLanguage]?.title || 'Charms Boosts';
    
    // Create container
    const container = document.createElement('div');
    container.className = 'charms-container';
    container.id = 'charmsContainer';
    
    // Clear page and add elements
    page.innerHTML = '';
    page.appendChild(title);
    page.appendChild(container);
    
    console.log('✅ Charms structure created');
}

// Update language
function updateCharmsLanguage(newLanguage) {
    console.log(`🔮 Charms language: ${charmsCurrentLanguage} → ${newLanguage}`);
    
    if (newLanguage === charmsCurrentLanguage) return;
    charmsCurrentLanguage = newLanguage;
    
    // Update title
    const titleElement = document.querySelector('.charms-page .title');
    if (titleElement && charmsTranslations?.[newLanguage]) {
        titleElement.textContent = charmsTranslations[newLanguage].title;
    }
    
    // Regenerate content
    if (charmsInitialized) {
        setTimeout(generateCharmsContent, 100);
    }
}

// Generate charms content
async function generateCharmsContent() {
    const container = document.getElementById('charmsContainer');
    if (!container) return console.error('❌ Charms container not found');
    
    charmsCurrentLanguage = getCurrentLanguage();
    
    try {
        if (!charmsTranslations) await loadCharmsTranslations();
        
        const data = charmsTranslations[charmsCurrentLanguage];
        if (!data) {
            throw new Error(`No charms data for language: ${charmsCurrentLanguage}`);
        }
        
        // Show loading
        container.innerHTML = `<div class="charms-loading">${data.loading}</div>`;
        
        await new Promise(resolve => setTimeout(resolve, 500));
        container.innerHTML = '';
        
        // Generate charm items
        data.charms.forEach((charm, index) => {
            const charmItem = document.createElement('div');
            charmItem.className = 'charm-item';
            charmItem.style.animationDelay = `${0.1 + (index * 0.05)}s`;
            
            charmItem.innerHTML = `
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
            container.appendChild(charmItem);
        });
        
        console.log(`✅ Generated ${data.charms.length} charms in ${charmsCurrentLanguage}`);
    } catch (error) {
        console.error('❌ Error generating charms:', error);
        const errorText = charmsTranslations[charmsCurrentLanguage]?.error || 'Error loading charms data';
        const retryText = charmsTranslations[charmsCurrentLanguage]?.retry || 'Retry';
        
        container.innerHTML = `
            <div class="charms-error">
                ⚠️ ${errorText}<br>
                <button class="retry-btn" onclick="generateCharmsContent()">${retryText}</button>
            </div>
        `;
    }
}

// Initialize charms
async function initializeCharms() {
    if (charmsInitialized) {
        console.log('🔄 Charms already initialized');
        return;
    }
    
    console.log('🔮 Initializing charms...');
    
    charmsCurrentLanguage = getCurrentLanguage();
    
    try {
        await loadCharmsTranslations();
        createCharmsStructure();
        await generateCharmsContent();
        
        charmsInitialized = true;
        window.charmsInitialized = true;
        console.log('✅ Charms initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize charms:', error);
        const page = document.getElementById('charmsPage');
        if (page) {
            page.innerHTML = `
                <h1 class="title">Charms Boosts</h1>
                <div class="charms-container">
                    <div class="charms-error">
                        ⚠️ Failed to load charms data<br>
                        <button class="retry-btn" onclick="initializeCharms()">Retry</button>
                    </div>
                </div>
            `;
        }
    }
}

// Event listeners
document.addEventListener('languageChanged', (e) => {
    if (e.detail?.language) updateCharmsLanguage(e.detail.language);
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const page = document.getElementById('charmsPage');
        if (page?.classList.contains('active')) initializeCharms();
    }, 100);
});

document.addEventListener('click', (e) => {
    if (e.target?.getAttribute('data-page') === 'charms') {
        setTimeout(() => {
            if (!charmsInitialized) {
                initializeCharms();
            }
        }, 300);
    }
});

// Observer for page activation
const charmsObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const charmsPage = document.getElementById('charmsPage');
            if (charmsPage?.classList.contains('active') && !charmsInitialized) {
                console.log('🔮 Charms page activated, initializing...');
                initializeCharms();
            }
        }
    });
});

// Start observing
document.addEventListener('DOMContentLoaded', () => {
    const charmsPage = document.getElementById('charmsPage');
    if (charmsPage) {
        charmsObserver.observe(charmsPage, { attributes: true });
    }
});

// Global exports
window.initializeCharms = initializeCharms;
window.updateCharmsLanguage = updateCharmsLanguage;
window.switchCharmsLanguage = updateCharmsLanguage;
window.generateCharmsContent = generateCharmsContent;
window.charmsInitialized = charmsInitialized;

console.log('✅ Charms.js loaded');
