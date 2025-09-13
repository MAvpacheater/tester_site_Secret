// Updates Page JavaScript - Mining Theme (Languages folder version)
let updatesInitialized = false;
let updatesTranslations = null;
let currentUpdateType = 'game';

// Initialize updates page
function initializeUpdates() {
    if (updatesInitialized) return;
    
    console.log('🔄 Initializing Updates page...');
    
    try {
        // Load translations
        loadUpdatesTranslations().then(() => {
            updateUpdatesLanguage(getCurrentAppLanguage());
            updatesInitialized = true;
            console.log('✅ Updates page initialized successfully');
        });
        
        // Set initial state
        currentUpdateType = 'game';
        
        // Add event listeners
        document.addEventListener('languageChanged', (e) => {
            updateUpdatesLanguage(e.detail.language);
        });
        
    } catch (error) {
        console.error('❌ Error initializing Updates page:', error);
        updatesInitialized = true; // Prevent infinite retry
    }
}

// Load updates translations from languages folder
async function loadUpdatesTranslations() {
    if (updatesTranslations) return updatesTranslations;
    
    try {
        const response = await fetch('languages/updates.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        updatesTranslations = await response.json();
        console.log('📄 Updates translations loaded successfully from languages folder');
        return updatesTranslations;
    } catch (error) {
        console.error('❌ Error loading updates translations:', error);
        
        // Fallback translations
        updatesTranslations = {
            en: {
                title: "📝 Updates & Changelog",
                subtitle: "Stay updated with the latest changes!",
                gameUpdates: "🎮 Game Updates",
                siteUpdates: "🌐 Site Updates",
                gameContent: {
                    version: "Game Update v1.2.3",
                    date: "December 15, 2024",
                    newFeatures: "🎮 New Features",
                    improvements: "⚡ Improvements", 
                    bugFixes: "🐛 Bug Fixes",
                    features: [
                        "Loading game updates...",
                        "Please wait...",
                        "Content will appear soon..."
                    ],
                    improvementsList: [
                        "Loading improvements...",
                        "Please wait...",
                        "Content will appear soon..."
                    ],
                    bugFixesList: [
                        "Loading bug fixes...",
                        "Please wait...",
                        "Content will appear soon..."
                    ]
                },
                siteContent: {
                    version: "Site Update v2.1.0",
                    date: "December 10, 2024",
                    newFeatures: "🌟 New Features",
                    improvements: "🔧 Improvements",
                    bugFixes: "🐛 Bug Fixes",
                    features: [
                        "Loading site updates...",
                        "Please wait...",
                        "Content will appear soon..."
                    ],
                    improvementsList: [
                        "Loading improvements...",
                        "Please wait...",
                        "Content will appear soon..."
                    ],
                    bugFixesList: [
                        "Loading bug fixes...",
                        "Please wait...",
                        "Content will appear soon..."
                    ]
                }
            }
        };
        return updatesTranslations;
    }
}

// Switch update type (game/site)
function switchUpdateType(type) {
    if (type === currentUpdateType) return;
    
    console.log(`🔄 Switching to ${type} updates`);
    currentUpdateType = type;
    
    // Update toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === type);
    });
    
    // Show/hide update sections
    document.querySelectorAll('.update-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(type + 'Updates');
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Update updates language
function updateUpdatesLanguage(language) {
    if (!updatesTranslations || !updatesTranslations[language]) {
        language = 'en'; // Fallback to English
    }
    
    if (!updatesTranslations[language]) return;
    
    const t = updatesTranslations[language];
    
    try {
        // Update page title and subtitle
        const title = document.querySelector('.updates-title');
        const subtitle = document.querySelector('.updates-subtitle');
        
        if (title && t.title) title.textContent = t.title;
        if (subtitle && t.subtitle) subtitle.textContent = t.subtitle;
        
        // Update toggle buttons
        const gameBtn = document.querySelector('[data-type="game"]');
        const siteBtn = document.querySelector('[data-type="site"]');
        
        if (gameBtn && t.gameUpdates) gameBtn.textContent = t.gameUpdates;
        if (siteBtn && t.siteUpdates) siteBtn.textContent = t.siteUpdates;
        
        // Update game content
        if (t.gameContent) {
            updateGameContent(t.gameContent);
        }
        
        // Update site content
        if (t.siteContent) {
            updateSiteContent(t.siteContent);
        }
        
        console.log(`✅ Updates language updated to: ${language}`);
    } catch (error) {
        console.error('❌ Error updating updates language:', error);
    }
}

// Update game content
function updateGameContent(content) {
    const gameSection = document.getElementById('gameUpdates');
    if (!gameSection) return;
    
    // Update version and date
    const version = gameSection.querySelector('.update-version');
    const date = gameSection.querySelector('.update-date');
    
    if (version && content.version) version.textContent = content.version;
    if (date && content.date) date.textContent = content.date;
    
    // Update categories
    const categories = gameSection.querySelectorAll('.update-category');
    if (categories.length >= 3) {
        if (content.newFeatures) categories[0].textContent = content.newFeatures;
        if (content.improvements) categories[1].textContent = content.improvements;
        if (content.bugFixes) categories[2].textContent = content.bugFixes;
    }
    
    // Update lists
    const lists = gameSection.querySelectorAll('.update-list');
    if (lists.length >= 3) {
        if (content.features) updateListContent(lists[0], content.features);
        if (content.improvementsList) updateListContent(lists[1], content.improvementsList);
        if (content.bugFixesList) updateListContent(lists[2], content.bugFixesList);
    }
}

// Update site content
function updateSiteContent(content) {
    const siteSection = document.getElementById('siteUpdates');
    if (!siteSection) return;
    
    // Update version and date
    const version = siteSection.querySelector('.update-version');
    const date = siteSection.querySelector('.update-date');
    
    if (version && content.version) version.textContent = content.version;
    if (date && content.date) date.textContent = content.date;
    
    // Update categories
    const categories = siteSection.querySelectorAll('.update-category');
    if (categories.length >= 3) {
        if (content.newFeatures) categories[0].textContent = content.newFeatures;
        if (content.improvements) categories[1].textContent = content.improvements;
        if (content.bugFixes) categories[2].textContent = content.bugFixes;
    }
    
    // Update lists
    const lists = siteSection.querySelectorAll('.update-list');
    if (lists.length >= 3) {
        if (content.features) updateListContent(lists[0], content.features);
        if (content.improvementsList) updateListContent(lists[1], content.improvementsList);
        if (content.bugFixesList) updateListContent(lists[2], content.bugFixesList);
    }
}

// Update list content - enhanced to handle dynamic list creation
function updateListContent(listElement, items) {
    if (!listElement || !Array.isArray(items)) return;
    
    // Clear existing content
    listElement.innerHTML = '';
    
    // Add new items
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        listElement.appendChild(li);
    });
}

// Export functions to global scope
Object.assign(window, {
    initializeUpdates,
    updateUpdatesLanguage,
    switchUpdateType
});

console.log('✅ Updates page JavaScript loaded (languages folder version)');
