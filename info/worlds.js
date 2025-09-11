// Worlds functionality with multilingual support

// Language management
let currentLanguage = 'en';
let worldsTranslations = null;

// Get language from localStorage or default to English
function getCurrentLanguage() {
    const saved = localStorage.getItem('armHelper_language');
    return saved || 'en';
}

// Save language to localStorage
function saveLanguage(lang) {
    localStorage.setItem('armHelper_language', lang);
    console.log(`Language saved: ${lang}`);
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

// Switch language
async function switchWorldsLanguage(lang) {
    if (!worldsTranslations) {
        await loadWorldsTranslations();
    }
    
    if (!worldsTranslations[lang]) {
        console.error(`❌ Language ${lang} not found, defaulting to English`);
        lang = 'en';
    }
    
    currentLanguage = lang;
    saveLanguage(lang);
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Update page title
    const titleElement = document.querySelector('.worlds-page .title');
    if (titleElement) {
        titleElement.textContent = worldsTranslations[lang].title;
    }
    
    // Regenerate content
    generateWorldsContent();
}

// Create language switcher
function createLanguageSwitcher() {
    const languages = [
        { code: 'en', name: 'EN', flag: '🇺🇸' },
        { code: 'uk', name: 'UK', flag: '🇺🇦' },
        { code: 'ru', name: 'RU', flag: '🇷🇺' }
    ];
    
    const switcher = document.createElement('div');
    switcher.className = 'language-switcher';
    
    languages.forEach(({ code, name, flag }) => {
        const btn = document.createElement('button');
        btn.className = `lang-btn ${currentLanguage === code ? 'active' : ''}`;
        btn.dataset.lang = code;
        btn.innerHTML = `${flag} ${name}`;
        btn.onclick = () => switchWorldsLanguage(code);
        switcher.appendChild(btn);
    });
    
    return switcher;
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
    
    // Check if language switcher already exists
    let existingSwitcher = worldsPage.querySelector('.language-switcher');
    if (!existingSwitcher) {
        // Create and insert language switcher after title
        const title = worldsPage.querySelector('.title');
        if (title) {
            const switcher = createLanguageSwitcher();
            title.parentNode.insertBefore(switcher, title.nextSibling);
        }
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
window.switchWorldsLanguage = switchWorldsLanguage;
window.generateWorldsContent = generateWorldsContent;

console.log('✅ worlds.js loaded with multilingual support');
