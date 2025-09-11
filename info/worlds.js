// Worlds functionality with multilingual support (without language switcher)

// Language management
let currentLanguage = 'en';
let worldsTranslations = null;

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
                worlds: [
                    {
                        title: "World 0: Garden",
                        icon: "🌳",
                        description: "Weekly leadboard | Mail | Token store | Garden",
                        details: "To get here you need to open 3 worlds"
                    }
                    // Add more fallback worlds if needed...
                ]
            }
        };
        return worldsTranslations;
    }
}

// Update language when it changes globally
function updateWorldsLanguage(newLanguage) {
    if (newLanguage === currentLanguage) return;
    
    currentLanguage = newLanguage;
    
    console.log(`🌍 Updating worlds language to: ${newLanguage}`);
    
    // Update page title
    const titleElement = document.querySelector('.worlds-page .title');
    if (titleElement && worldsTranslations && worldsTranslations[newLanguage]) {
        titleElement.textContent = worldsTranslations[newLanguage].title;
    }
    
    // Regenerate content
    generateWorldsContent();
}

// Generate worlds content
async function generateWorldsContent() {
    const container = document.getElementById('worldsContainer');
    if (!container) {
        console.error('❌ Worlds container not found');
        return;
    }
    
    // Show loading state
    container.innerHTML = '<div class="worlds-loading">Loading worlds...</div>';
    
    try {
        // Load translations if not already loaded
        if (!worldsTranslations) {
            await loadWorldsTranslations();
        }
        
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
        container.innerHTML = `
            <div class="worlds-error">
                ⚠️ Error loading worlds data
                <br>
                <button class="retry-btn" onclick="generateWorldsContent()">Retry</button>
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
                        initializeWorlds();
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

// Listen for global language changes
document.addEventListener('languageChanged', function(e) {
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

// Make functions globally available
window.initializeWorlds = initializeWorlds;
window.updateWorldsLanguage = updateWorldsLanguage;
window.generateWorldsContent = generateWorldsContent;

console.log('✅ worlds.js loaded with multilingual support (no language switcher)');
