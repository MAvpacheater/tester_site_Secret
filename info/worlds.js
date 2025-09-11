// Worlds functionality with enhanced multilingual support

// Language management
let currentLanguage = 'en';
let worldsTranslations = null;
let worldsInitialized = false;

// Get language from localStorage or default to English
function getCurrentLanguage() {
    const saved = localStorage.getItem('armHelper_language');
    return saved || 'en';
}

// Load translations from JSON file
async function loadWorldsTranslations() {
    if (worldsTranslations) return worldsTranslations;
    
    try {
        console.log('📥 Loading worlds translations...');
        const response = await fetch('languages/worlds.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        worldsTranslations = await response.json();
        console.log('✅ Worlds translations loaded successfully');
        return worldsTranslations;
    } catch (error) {
        console.error('❌ Error loading worlds translations:', error);
        // Fallback to English if translations fail to load
        worldsTranslations = {
            en: {
                title: "Worlds Info",
                loading: "Loading worlds...",
                error: "Error loading worlds data",
                retry: "Retry",
                worlds: [
                    {
                        title: "World 0: Garden",
                        icon: "🌳",
                        description: "Weekly leaderboard | Mail | Token store | Garden",
                        details: "To get here you need to open 3 worlds"
                    },
                    {
                        title: "World 1: Spawn",
                        icon: "🏠",
                        description: "The starting world where your adventure begins",
                        details: "Default spawn location for all new players"
                    },
                    {
                        title: "World 2: Fantasy",
                        icon: "🏰",
                        description: "A magical realm full of mythical creatures and enchanted forests",
                        details: "Unlock requirement: Complete World 1"
                    },
                    {
                        title: "World 3: Tech",
                        icon: "🤖",
                        description: "Futuristic world with advanced technology and cyber pets",
                        details: "Unlock requirement: Complete World 2"
                    },
                    {
                        title: "World 4: Axolotl Ocean",
                        icon: "🌊",
                        description: "Underwater paradise filled with axolotls and marine life",
                        details: "Unlock requirement: Complete World 3"
                    }
                ]
            }
        };
        return worldsTranslations;
    }
}

// Update language when it changes globally - ENHANCED
function updateWorldsLanguage(newLanguage) {
    console.log(`🌍 Worlds received language change request: ${currentLanguage} → ${newLanguage}`);
    
    if (newLanguage === currentLanguage) {
        console.log('🔄 Same language, skipping update');
        return;
    }
    
    currentLanguage = newLanguage;
    
    console.log(`🌍 Updating worlds language to: ${newLanguage}`);
    
    // Update page title immediately if page is loaded
    const titleElement = document.querySelector('.worlds-page .title');
    if (titleElement && worldsTranslations && worldsTranslations[newLanguage]) {
        titleElement.textContent = worldsTranslations[newLanguage].title;
    }
    
    // Regenerate content if worlds are already initialized
    if (worldsInitialized) {
        setTimeout(() => {
            generateWorldsContent();
        }, 100);
    }
}

// Generate worlds content
async function generateWorldsContent() {
    const container = document.getElementById('worldsContainer');
    if (!container) {
        console.error('❌ Worlds container not found');
        return;
    }
    
    // Get current language
    currentLanguage = getCurrentLanguage();
    
    // Load translations if not already loaded
    if (!worldsTranslations) {
        await loadWorldsTranslations();
    }
    
    // Show loading state
    const loadingText = worldsTranslations[currentLanguage]?.loading || 'Loading worlds...';
    container.innerHTML = `<div class="worlds-loading">${loadingText}</div>`;
    
    try {
        const currentLangData = worldsTranslations[currentLanguage];
        if (!currentLangData) {
            throw new Error(`Language data for ${currentLanguage} not found`);
        }
        
        // Clear container
        container.innerHTML = '';
        
        // Generate world items with animation delay
        currentLangData.worlds.forEach((world, index) => {
            const worldItem = document.createElement('div');
            worldItem.className = 'world-item';
            worldItem.style.animationDelay = `${0.1 + (index * 0.05)}s`;
            worldItem.innerHTML = `
                <div class="world-title">
                    <span class="world-icon">${world.icon}</span>
                    <span>${world.title}</span>
                </div>
                <div class="world-description">${world.description}</div>
                <div class="world-details">${world.details}</div>
            `;
            container.appendChild(worldItem);
        });
        
        console.log(`✅ Generated ${currentLangData.worlds.length} worlds in ${currentLanguage}`);
        
    } catch (error) {
        console.error('❌ Error generating worlds content:', error);
        
        // Show error state
        const errorText = worldsTranslations[currentLanguage]?.error || 'Error loading worlds data';
        const retryText = worldsTranslations[currentLanguage]?.retry || 'Retry';
        
        container.innerHTML = `
            <div class="worlds-error">
                ⚠️ ${errorText}
                <br>
                <button class="retry-btn" onclick="generateWorldsContent()">${retryText}</button>
            </div>
        `;
    }
}

// Initialize worlds page
async function initializeWorlds() {
    console.log('🌍 Initializing worlds page...');
    
    // Get saved language
    currentLanguage = getCurrentLanguage();
    
    const worldsPage = document.getElementById('worldsPage');
    if (!worldsPage) {
        console.error('❌ Worlds page not found');
        return;
    }
    
    // Load translations and generate content
    await loadWorldsTranslations();
    
    // Update page title
    if (worldsTranslations && worldsTranslations[currentLanguage]) {
        const titleElement = worldsPage.querySelector('.title');
        if (titleElement) {
            titleElement.textContent = worldsTranslations[currentLanguage].title;
        }
    }
    
    // Generate content
    await generateWorldsContent();
    
    worldsInitialized = true;
    window.worldsInitialized = true;
    
    console.log('✅ Worlds page initialized');
}

// Track when user switches to worlds page
function observeWorldsPageActivation() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const worldsPage = document.getElementById('worldsPage');
                if (worldsPage && worldsPage.classList.contains('active')) {
                    // Page became active, reinitialize if needed
                    setTimeout(() => {
                        if (!worldsInitialized) {
                            initializeWorlds();
                        }
                    }, 100);
                }
            }
        });
    });
    
    const worldsPage = document.getElementById('worldsPage');
    if (worldsPage) {
        observer.observe(worldsPage, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
    }
}

// Debug function
function debugWorlds() {
    console.log('=== WORLDS DEBUG ===');
    console.log('Initialized:', worldsInitialized);
    console.log('Current language:', currentLanguage);
    console.log('Container exists:', !!document.getElementById('worldsContainer'));
    console.log('Page exists:', !!document.getElementById('worldsPage'));
    console.log('Translations loaded:', !!worldsTranslations);
    if (worldsTranslations) {
        console.log('Available languages:', Object.keys(worldsTranslations));
        if (worldsTranslations[currentLanguage]) {
            console.log(`Worlds count for ${currentLanguage}:`, worldsTranslations[currentLanguage].worlds?.length);
        }
    }
    console.log('====================');
}

// Listen for global language changes - ENHANCED
document.addEventListener('languageChanged', function(e) {
    console.log('🌍 Worlds received languageChanged event:', e.detail);
    if (e.detail && e.detail.language) {
        updateWorldsLanguage(e.detail.language);
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set up observer for page activation
    observeWorldsPageActivation();
    
    // Initialize immediately if worlds page is already active
    const worldsPage = document.getElementById('worldsPage');
    if (worldsPage && worldsPage.classList.contains('active')) {
        initializeWorlds();
    }
});

// Initialize when worlds page becomes active via click
document.addEventListener('click', function(e) {
    if (e.target && e.target.getAttribute && e.target.getAttribute('data-page') === 'worlds') {
        setTimeout(() => {
            if (!worldsInitialized || !document.getElementById('worldsContainer').innerHTML.includes('world-item')) {
                console.log('🌍 Page switched to worlds, reinitializing...');
                initializeWorlds();
            }
        }, 300);
    }
});

// Make functions globally available
window.initializeWorlds = initializeWorlds;
window.updateWorldsLanguage = updateWorldsLanguage;
window.generateWorldsContent = generateWorldsContent;
window.debugWorlds = debugWorlds;
window.worldsInitialized = worldsInitialized;

console.log('✅ worlds.js loaded with enhanced multilingual support');
