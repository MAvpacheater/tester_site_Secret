// Complete Updates Page JavaScript - Clean version, all text from JSON
let updatesInitialized = false;
let updatesTranslations = null;
let currentUpdateType = 'game';

// Initialize updates page
function initializeUpdates() {
    if (updatesInitialized) return;
    
    console.log('🔄 Initializing Updates page...');
    
    try {
        // Load translations and initialize
        loadUpdatesTranslations().then(() => {
            // Get current language from the global function
            const currentLang = getCurrentAppLanguage();
            updateUpdatesLanguage(currentLang);
            
            // Set initial state
            currentUpdateType = 'game';
            
            // Ensure proper initial display
            setTimeout(() => {
                switchUpdateType('game');
            }, 100);
            
            updatesInitialized = true;
            console.log('✅ Updates page initialized successfully');
        }).catch(error => {
            console.error('❌ Error loading translations:', error);
            updatesInitialized = true;
        });
        
        // Add event listener for language changes
        document.addEventListener('languageChanged', (e) => {
            if (e.detail && e.detail.language) {
                updateUpdatesLanguage(e.detail.language);
            }
        });
        
    } catch (error) {
        console.error('❌ Error initializing Updates page:', error);
        updatesInitialized = true;
    }
}

// Load updates translations from languages folder
async function loadUpdatesTranslations() {
    if (updatesTranslations) return updatesTranslations;
    
    try {
        console.log('📄 Loading updates translations...');
        const response = await fetch('languages/updates.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        updatesTranslations = await response.json();
        console.log('✅ Updates translations loaded successfully');
        return updatesTranslations;
    } catch (error) {
        console.error('❌ Error loading updates translations:', error);
        
        // Minimal fallback - no text content, will be handled by JSON
        updatesTranslations = {
            en: {},
            uk: {},
            ru: {}
        };
        return updatesTranslations;
    }
}

// Switch update type (game/site)
function switchUpdateType(type) {
    if (!type || type === currentUpdateType) return;
    
    console.log(`🔄 Switching to ${type} updates`);
    currentUpdateType = type;
    
    try {
        // Update toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            if (btn && btn.dataset && btn.dataset.type) {
                btn.classList.toggle('active', btn.dataset.type === type);
            }
        });
        
        // Show/hide update sections
        document.querySelectorAll('.update-section').forEach(section => {
            if (section) {
                section.classList.remove('active');
            }
        });
        
        const targetSection = document.getElementById(type + 'Updates');
        if (targetSection) {
            targetSection.classList.add('active');
            console.log(`✅ Switched to ${type} updates section`);
        } else {
            console.error(`❌ Target section ${type}Updates not found`);
        }
        
    } catch (error) {
        console.error('❌ Error switching update type:', error);
    }
}

// Update updates language
function updateUpdatesLanguage(language) {
    if (!language) {
        language = 'en';
    }
    
    console.log(`🌍 Updating updates language to: ${language}`);
    
    if (!updatesTranslations) {
        console.warn('⚠️ Updates translations not loaded yet');
        return;
    }
    
    if (!updatesTranslations[language]) {
        console.warn(`⚠️ Language ${language} not found, using English`);
        language = 'en';
    }
    
    const t = updatesTranslations[language];
    if (!t) {
        console.error('❌ No translation data available');
        return;
    }
    
    try {
        // Update page title and subtitle
        const title = document.querySelector('.updates-title');
        const subtitle = document.querySelector('.updates-subtitle');
        
        if (title && t.title) {
            title.textContent = t.title;
        }
        if (subtitle && t.subtitle) {
            subtitle.textContent = t.subtitle;
        }
        
        // Update toggle buttons
        const gameBtn = document.querySelector('.toggle-btn[data-type="game"]');
        const siteBtn = document.querySelector('.toggle-btn[data-type="site"]');
        
        if (gameBtn && t.gameUpdates) {
            gameBtn.textContent = t.gameUpdates;
        }
        if (siteBtn && t.siteUpdates) {
            siteBtn.textContent = t.siteUpdates;
        }
        
        // Update content sections
        if (t.gameContent) {
            updateGameContent(t.gameContent);
        }
        
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
    if (!gameSection || !content) {
        console.warn('⚠️ Game section or content not found');
        return;
    }
    
    try {
        // Update version and date
        const version = gameSection.querySelector('.update-version');
        const date = gameSection.querySelector('.update-date');
        
        if (version && content.version) {
            version.textContent = content.version;
        }
        if (date && content.date) {
            date.textContent = content.date;
        }
        
        // Update categories
        const categories = gameSection.querySelectorAll('.update-category');
        if (categories.length >= 3) {
            if (content.newFeatures && categories[0]) {
                categories[0].textContent = content.newFeatures;
            }
            if (content.improvements && categories[1]) {
                categories[1].textContent = content.improvements;
            }
            if (content.bugFixes && categories[2]) {
                categories[2].textContent = content.bugFixes;
            }
        }
        
        // Update lists
        const lists = gameSection.querySelectorAll('.update-list');
        if (lists.length >= 3) {
            if (content.features && lists[0]) {
                updateListContent(lists[0], content.features);
            }
            if (content.improvementsList && lists[1]) {
                updateListContent(lists[1], content.improvementsList);
            }
            if (content.bugFixesList && lists[2]) {
                updateListContent(lists[2], content.bugFixesList);
            }
        }
        
        console.log('✅ Game content updated');
    } catch (error) {
        console.error('❌ Error updating game content:', error);
    }
}

// Update site content
function updateSiteContent(content) {
    const siteSection = document.getElementById('siteUpdates');
    if (!siteSection || !content) {
        console.warn('⚠️ Site section or content not found');
        return;
    }
    
    try {
        // Update version and date
        const version = siteSection.querySelector('.update-version');
        const date = siteSection.querySelector('.update-date');
        
        if (version && content.version) {
            version.textContent = content.version;
        }
        if (date && content.date) {
            date.textContent = content.date;
        }
        
        // Update categories
        const categories = siteSection.querySelectorAll('.update-category');
        if (categories.length >= 3) {
            if (content.newFeatures && categories[0]) {
                categories[0].textContent = content.newFeatures;
            }
            if (content.improvements && categories[1]) {
                categories[1].textContent = content.improvements;
            }
            if (content.bugFixes && categories[2]) {
                categories[2].textContent = content.bugFixes;
            }
        }
        
        // Update lists
        const lists = siteSection.querySelectorAll('.update-list');
        if (lists.length >= 3) {
            if (content.features && lists[0]) {
                updateListContent(lists[0], content.features);
            }
            if (content.improvementsList && lists[1]) {
                updateListContent(lists[1], content.improvementsList);
            }
            if (content.bugFixesList && lists[2]) {
                updateListContent(lists[2], content.bugFixesList);
            }
        }
        
        console.log('✅ Site content updated');
    } catch (error) {
        console.error('❌ Error updating site content:', error);
    }
}

// Update list content
function updateListContent(listElement, items) {
    if (!listElement) {
        console.warn('⚠️ List element not provided');
        return;
    }
    
    if (!Array.isArray(items)) {
        console.warn('⚠️ Items is not an array:', items);
        return;
    }
    
    try {
        // Clear existing content
        listElement.innerHTML = '';
        
        // Add new items
        items.forEach((item, index) => {
            if (item && typeof item === 'string') {
                const li = document.createElement('li');
                li.textContent = item;
                li.style.animationDelay = `${index * 0.1}s`;
                listElement.appendChild(li);
            }
        });
        
        console.log(`✅ Updated list with ${items.length} items`);
    } catch (error) {
        console.error('❌ Error updating list content:', error);
    }
}

// Export functions to global scope
Object.assign(window, {
    initializeUpdates,
    updateUpdatesLanguage,
    switchUpdateType,
    loadUpdatesTranslations
});

// Also make the function available for external calls
window.updateUpdatesLanguage = updateUpdatesLanguage;

console.log('✅ Complete clean Updates page JavaScript loaded (no hardcoded text)');
