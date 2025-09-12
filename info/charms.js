// Fixed Charms functionality with enhanced multilingual support

// Language management
let charmsCurrentLanguage = 'en';  // Changed variable name for consistency
let charmsTranslations = null;
let charmsInitialized = false;

// Get language from localStorage or default to English
function getCurrentLanguage() {
    const saved = localStorage.getItem('armHelper_language');
    return saved || 'en';
}

// Load translations from JSON file
async function loadCharmsTranslations() {
    if (charmsTranslations) return charmsTranslations;
    
    try {
        console.log('📥 Loading charms translations...');
        const response = await fetch('languages/charms.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        charmsTranslations = await response.json();
        console.log('✅ Charms translations loaded successfully');
        return charmsTranslations;
    } catch (error) {
        console.error('❌ Error loading charms translations:', error);
        // Fallback to English if translations fail to load
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

// Update language when it changes globally - FIXED
function updateCharmsLanguage(newLanguage) {
    console.log(`🔮 Charms received language change request: ${charmsCurrentLanguage} → ${newLanguage}`);
    
    if (newLanguage === charmsCurrentLanguage) {
        console.log('🔄 Same language, skipping update');
        return;
    }
    
    charmsCurrentLanguage = newLanguage;
    
    console.log(`🔮 Updating charms language to: ${newLanguage}`);
    
    // Update page title immediately if page is loaded
    const titleElement = document.querySelector('.charms-page .title');
    if (titleElement && charmsTranslations && charmsTranslations[newLanguage]) {
        titleElement.textContent = charmsTranslations[newLanguage].title;
    }
    
    // Regenerate content if charms are already initialized
    if (charmsInitialized) {
        setTimeout(() => {
            generateCharmsContent();
        }, 100);
    }
}

// Generate charms content - FIXED
async function generateCharmsContent() {
    const container = document.getElementById('charmsContainer');
    if (!container) {
        console.error('❌ Charms container not found');
        return;
    }
    
    // Get current language
    charmsCurrentLanguage = getCurrentLanguage();
    
    // Load translations if not already loaded
    if (!charmsTranslations) {
        await loadCharmsTranslations();
    }
    
    // Show loading state
    const loadingText = charmsTranslations[charmsCurrentLanguage]?.loading || 'Loading charms...';
    container.innerHTML = `<div class="charms-loading">${loadingText}</div>`;
    
    try {
        // Small delay to show loading animation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const currentLangData = charmsTranslations[charmsCurrentLanguage];
        if (!currentLangData) {
            throw new Error(`Language data for ${charmsCurrentLanguage} not found`);
        }
        
        // Clear container
        container.innerHTML = '';
        
        // Generate charm items with animation delay
        currentLangData.charms.forEach((charm, index) => {
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
        
        console.log(`✅ Generated ${currentLangData.charms.length} charms in ${charmsCurrentLanguage}`);
        
    } catch (error) {
        console.error('❌ Error generating charms content:', error);
        
        // Show error state
        const errorText = charmsTranslations[charmsCurrentLanguage]?.error || 'Error loading charms data';
        const retryText = charmsTranslations[charmsCurrentLanguage]?.retry || 'Retry';
        
        container.innerHTML = `
            <div class="charms-error">
                ⚠️ ${errorText}
                <br>
                <button class="retry-btn" onclick="generateCharmsContent()">${retryText}</button>
            </div>
        `;
    }
}

// Initialize charms page - ENHANCED
async function initializeCharms() {
    console.log('🔮 Initializing charms page...');
    
    // Check if already initialized and content exists
    const container = document.getElementById('charmsContainer');
    if (charmsInitialized && container && container.querySelector('.charm-item')) {
        console.log('🔮 Charms already initialized with content');
        return;
    }
    
    // Get saved language
    charmsCurrentLanguage = getCurrentLanguage();
    
    const charmsPage = document.getElementById('charmsPage');
    if (!charmsPage) {
        console.error('❌ Charms page not found');
        return;
    }
    
    // Load translations and generate content
    await loadCharmsTranslations();
    
    // Update page title
    if (charmsTranslations && charmsTranslations[charmsCurrentLanguage]) {
        const titleElement = charmsPage.querySelector('.title');
        if (titleElement) {
            titleElement.textContent = charmsTranslations[charmsCurrentLanguage].title;
        }
    }
    
    // Generate content
    await generateCharmsContent();
    
    charmsInitialized = true;
    window.charmsInitialized = true;
    
    console.log('✅ Charms page initialized successfully');
}

// Force reinitialize charms
function forceReinitializeCharms() {
    console.log('🔄 Force reinitializing charms...');
    charmsInitialized = false;
    window.charmsInitialized = false;
    initializeCharms();
}

// Debug function - FIXED
function debugCharms() {
    console.log('=== CHARMS DEBUG ===');
    console.log('Initialized:', charmsInitialized);
    console.log('Current language:', charmsCurrentLanguage);
    console.log('Container exists:', !!document.getElementById('charmsContainer'));
    console.log('Page exists:', !!document.getElementById('charmsPage'));
    console.log('Page is active:', document.getElementById('charmsPage')?.classList.contains('active'));
    console.log('Translations loaded:', !!charmsTranslations);
    if (charmsTranslations) {
        console.log('Available languages:', Object.keys(charmsTranslations));
        if (charmsTranslations[charmsCurrentLanguage]) {
            console.log(`Charms count for ${charmsCurrentLanguage}:`, charmsTranslations[charmsCurrentLanguage].charms?.length);
        }
    }
    const container = document.getElementById('charmsContainer');
    if (container) {
        console.log('Container innerHTML length:', container.innerHTML.length);
        console.log('Has charm items:', !!container.querySelector('.charm-item'));
    }
    console.log('====================');
}

// Listen for global language changes - ENHANCED
document.addEventListener('languageChanged', function(e) {
    console.log('🔮 Charms received languageChanged event:', e.detail);
    if (e.detail && e.detail.language) {
        updateCharmsLanguage(e.detail.language);
    }
});

// Enhanced DOM ready handler
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔮 DOM loaded, setting up charms...');
    
    // Initialize immediately if charms page is already active
    setTimeout(() => {
        const charmsPage = document.getElementById('charmsPage');
        if (charmsPage && charmsPage.classList.contains('active')) {
            console.log('🔮 Charms page is active, initializing...');
            initializeCharms();
        }
    }, 100);
});

// Enhanced click handler for charms page switching
document.addEventListener('click', function(e) {
    if (e.target && e.target.getAttribute && e.target.getAttribute('data-page') === 'charms') {
        console.log('🔮 Charms page clicked, will initialize...');
        setTimeout(() => {
            const container = document.getElementById('charmsContainer');
            if (!charmsInitialized || !container || !container.querySelector('.charm-item')) {
                console.log('🔮 Page switched to charms, initializing...');
                initializeCharms();
            } else {
                console.log('🔮 Charms already has content, skipping initialization');
            }
        }, 300);
    }
});

// Alternative legacy function name support
window.switchCharmsLanguage = updateCharmsLanguage;

// Make functions globally available
window.initializeCharms = initializeCharms;
window.updateCharmsLanguage = updateCharmsLanguage;
window.generateCharmsContent = generateCharmsContent;
window.debugCharms = debugCharms;
window.forceReinitializeCharms = forceReinitializeCharms;
window.charmsInitialized = charmsInitialized;

console.log('✅ Fixed charms.js loaded with enhanced multilingual support');
