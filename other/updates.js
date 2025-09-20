// Complete Updates Page JavaScript - Fixed version with proper language loading
let updatesInitialized = false;
let updatesTranslations = null;
let currentUpdateType = 'game';

// Initialize updates page
function initializeUpdates() {
    if (updatesInitialized) return;
    
    console.log('🔄 Initializing Updates page...');
    
    try {
        // First initialize the page structure
        initializeUpdatesStructure();
        
        // Load translations and initialize
        loadUpdatesTranslations().then(() => {
            // Get current language from the global function
            const currentLang = getCurrentAppLanguage() || 'en';
            console.log(`🌍 Current language: ${currentLang}`);
            
            updateUpdatesLanguage(currentLang);
            
            // Set initial state
            currentUpdateType = 'game';
            
            // Add page initialized class
            const updatesPage = document.getElementById('updatesPage');
            if (updatesPage) {
                updatesPage.classList.add('initialized');
            }
            
            // Ensure proper initial display
            setTimeout(() => {
                switchUpdateType('game');
            }, 100);
            
            updatesInitialized = true;
            console.log('✅ Updates page initialized successfully');
        }).catch(error => {
            console.error('❌ Error loading translations:', error);
            
            // Fallback initialization with hardcoded content
            initializeFallbackContent();
            
            const updatesPage = document.getElementById('updatesPage');
            if (updatesPage) {
                updatesPage.classList.add('initialized');
            }
            switchUpdateType('game');
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
        
        // Ensure basic functionality even with errors
        initializeFallbackContent();
        const updatesPage = document.getElementById('updatesPage');
        if (updatesPage) {
            updatesPage.classList.add('initialized');
        }
        switchUpdateType('game');
        updatesInitialized = true;
    }
}

// Initialize basic page structure
function initializeUpdatesStructure() {
    console.log('🔧 Initializing updates structure...');
    
    // Set fallback text content immediately
    const title = document.querySelector('#updatesPage .updates-title');
    const subtitle = document.querySelector('#updatesPage .updates-subtitle');
    const gameBtn = document.querySelector('#updatesPage .toggle-btn[data-type="game"]');
    const siteBtn = document.querySelector('#updatesPage .toggle-btn[data-type="site"]');
    
    if (title && !title.textContent.trim()) {
        title.textContent = "📝 Updates & Changelog";
    }
    if (subtitle && !subtitle.textContent.trim()) {
        subtitle.textContent = "Stay updated with the latest changes!";
    }
    if (gameBtn && !gameBtn.textContent.trim()) {
        gameBtn.textContent = "🎮 Game Updates";
    }
    if (siteBtn && !siteBtn.textContent.trim()) {
        siteBtn.textContent = "🌐 Site Updates";
    }
    
    console.log('✅ Basic structure initialized');
}

// Initialize fallback content when translations fail
function initializeFallbackContent() {
    console.log('🔄 Initializing fallback content...');
    
    const fallbackContent = {
        gameContent: {
            version: "Game Update Soon..",
            date: "Soon..",
            newFeatures: "🎮 New Features",
            improvements: "⚡ Improvements", 
            bugFixes: "🐛 Bug Fixes",
            features: ["Coming soon.."],
            improvementsList: ["Coming soon.."],
            bugFixesList: ["Coming soon.."]
        },
        siteContent: {
            version: "Site Update v2.2.0",
            date: "September 13, 2025",
            newFeatures: "🌟 New Features",
            improvements: "🔧 Improvements",
            bugFixes: "🐛 Bug Fixes",
            features: [
                "Added 3 new pages",
                "Added 1 new category", 
                "Implemented language switcher",
                "Introduced new site theme"
            ],
            improvementsList: [
                "Improved overall site code",
                "Enhanced structure and design"
            ],
            bugFixesList: [
                "Fixed lag issues",
                "Fixed image loading problems"
            ]
        }
    };
    
    updateGameContent(fallbackContent.gameContent);
    updateSiteContent(fallbackContent.siteContent);
    
    console.log('✅ Fallback content initialized');
}

// Load updates translations from languages folder with enhanced error handling
async function loadUpdatesTranslations() {
    if (updatesTranslations) return updatesTranslations;
    
    try {
        console.log('📄 Loading updates translations...');
        const response = await fetch('languages/updates.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        updatesTranslations = await response.json();
        
        // Validate translations structure
        if (!updatesTranslations.en || !updatesTranslations.en.title) {
            throw new Error('Invalid translations structure');
        }
        
        console.log('✅ Updates translations loaded successfully');
        return updatesTranslations;
        
    } catch (error) {
        console.error('❌ Error loading updates translations:', error);
        
        // Create comprehensive fallback translations
        updatesTranslations = {
            en: {
                title: "📝 Updates & Changelog",
                subtitle: "Stay updated with the latest changes!",
                gameUpdates: "🎮 Game Updates",
                siteUpdates: "🌐 Site Updates",
                gameContent: {
                    version: "Game Update Soon..",
                    date: "Soon..",
                    newFeatures: "🎮 New Features",
                    improvements: "⚡ Improvements",
                    bugFixes: "🐛 Bug Fixes",
                    features: ["Coming soon.."],
                    improvementsList: ["Coming soon.."],
                    bugFixesList: ["Coming soon.."]
                },
                siteContent: {
                    version: "Site Update v2.2.0",
                    date: "September 13, 2025",
                    newFeatures: "🌟 New Features",
                    improvements: "🔧 Improvements",
                    bugFixes: "🐛 Bug Fixes",
                    features: [
                        "Added 3 new pages",
                        "Added 1 new category",
                        "Implemented language switcher",
                        "Introduced new site theme"
                    ],
                    improvementsList: [
                        "Improved overall site code",
                        "Enhanced structure and design"
                    ],
                    bugFixesList: [
                        "Fixed lag issues",
                        "Fixed image loading problems"
                    ]
                }
            },
            uk: {
                title: "📝 Оновлення та Зміни",
                subtitle: "Залишайтеся в курсі останніх змін!",
                gameUpdates: "🎮 Оновлення Гри",
                siteUpdates: "🌐 Оновлення Сайту",
                gameContent: {
                    version: "Оновлення Гри Скоро..",
                    date: "Скоро..",
                    newFeatures: "🎮 Нові Функції",
                    improvements: "⚡ Покращення",
                    bugFixes: "🐛 Виправлення Помилок",
                    features: ["Скоро.."],
                    improvementsList: ["Скоро.."],
                    bugFixesList: ["Скоро.."]
                },
                siteContent: {
                    version: "Оновлення Сайту v2.2.0",
                    date: "13 вересня 2025",
                    newFeatures: "🌟 Нові Функції",
                    improvements: "🔧 Покращення",
                    bugFixes: "🐛 Виправлення Помилок",
                    features: [
                        "Додано 3 нові сторінки",
                        "Додано 1 нову категорію",
                        "Додано зміну мови",
                        "Нова тематика сайту"
                    ],
                    improvementsList: [
                        "Виправлено деякий код",
                        "Оновлено структуру та дизайн"
                    ],
                    bugFixesList: [
                        "Виправлено проблеми з лагами",
                        "Виправлено проблеми із завантаженням зображень"
                    ]
                }
            },
            ru: {
                title: "📝 Обновления и Изменения",
                subtitle: "Оставайтесь в курсе последних изменений!",
                gameUpdates: "🎮 Обновления Игры",
                siteUpdates: "🌐 Обновления Сайта",
                gameContent: {
                    version: "Обновление Игры Скоро..",
                    date: "Скоро..",
                    newFeatures: "🎮 Новые Функции",
                    improvements: "⚡ Улучшения",
                    bugFixes: "🐛 Исправления Ошибок",
                    features: ["Скоро.."],
                    improvementsList: ["Скоро.."],
                    bugFixesList: ["Скоро.."]
                },
                siteContent: {
                    version: "Обновление Сайта v2.2.0",
                    date: "13 сентября 2025",
                    newFeatures: "🌟 Новые Функции",
                    improvements: "🔧 Улучшения",
                    bugFixes: "🐛 Исправления Ошибок",
                    features: [
                        "Добавлены 3 новые страницы",
                        "Добавлена 1 новая категория",
                        "Реализована смена языка",
                        "Новая тематика сайта"
                    ],
                    improvementsList: [
                        "Исправлен некоторый код",
                        "Обновлена структура и дизайн"
                    ],
                    bugFixesList: [
                        "Исправлены лаги",
                        "Исправлены проблемы с загрузкой изображений"
                    ]
                }
            }
        };
        
        return updatesTranslations;
    }
}

// Switch update type (game/site)
function switchUpdateType(type) {
    if (!type) return;
    
    console.log(`🔄 Switching to ${type} updates`);
    currentUpdateType = type;
    
    try {
        // Update toggle buttons
        const toggleButtons = document.querySelectorAll('.toggle-btn');
        toggleButtons.forEach(btn => {
            if (btn && btn.dataset && btn.dataset.type) {
                btn.classList.toggle('active', btn.dataset.type === type);
            }
        });
        
        // Show/hide update sections with animation
        const sections = document.querySelectorAll('.update-section');
        sections.forEach(section => {
            if (section) {
                section.classList.remove('active');
                section.offsetHeight; // Force reflow
            }
        });
        
        // Show target section
        const targetSection = document.getElementById(type + 'Updates');
        if (targetSection) {
            setTimeout(() => {
                targetSection.classList.add('active');
            }, 50);
            console.log(`✅ Switched to ${type} updates section`);
        } else {
            console.error(`❌ Target section ${type}Updates not found`);
        }
        
    } catch (error) {
        console.error('❌ Error switching update type:', error);
    }
}

// Update updates language with immediate text setting
function updateUpdatesLanguage(language) {
    if (!language) {
        language = 'en';
    }
    
    console.log(`🌍 Updating updates language to: ${language}`);
    
    // Set immediate fallback text
    initializeUpdatesStructure();
    
    // Wait for translations to load if not available
    if (!updatesTranslations) {
        console.log('⏳ Loading translations for language update...');
        loadUpdatesTranslations().then(() => {
            updateUpdatesLanguage(language);
        });
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
        const title = document.querySelector('#updatesPage .updates-title');
        const subtitle = document.querySelector('#updatesPage .updates-subtitle');
        
        if (title && t.title) {
            title.textContent = t.title;
        }
        if (subtitle && t.subtitle) {
            subtitle.textContent = t.subtitle;
        }
        
        // Update toggle buttons
        const gameBtn = document.querySelector('#updatesPage .toggle-btn[data-type="game"]');
        const siteBtn = document.querySelector('#updatesPage .toggle-btn[data-type="site"]');
        
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

// Update game content with proper error handling
function updateGameContent(content) {
    const gameSection = document.getElementById('gameUpdates');
    if (!gameSection) {
        console.warn('⚠️ Game section not found');
        return;
    }
    
    if (!content) {
        console.warn('⚠️ No game content provided');
        return;
    }
    
    try {
        console.log('🎮 Updating game content:', content);
        
        // Update version and date
        const version = gameSection.querySelector('.update-version');
        const date = gameSection.querySelector('.update-date');
        
        if (version && content.version) {
            version.textContent = content.version;
            console.log('✅ Game version updated:', content.version);
        }
        if (date && content.date) {
            date.textContent = content.date;
            console.log('✅ Game date updated:', content.date);
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
        
        console.log('✅ Game content updated successfully');
    } catch (error) {
        console.error('❌ Error updating game content:', error);
    }
}

// Update site content with proper error handling
function updateSiteContent(content) {
    const siteSection = document.getElementById('siteUpdates');
    if (!siteSection) {
        console.warn('⚠️ Site section not found');
        return;
    }
    
    if (!content) {
        console.warn('⚠️ No site content provided');
        return;
    }
    
    try {
        console.log('🌐 Updating site content:', content);
        
        // Update version and date
        const version = siteSection.querySelector('.update-version');
        const date = siteSection.querySelector('.update-date');
        
        if (version && content.version) {
            version.textContent = content.version;
            console.log('✅ Site version updated:', content.version);
        }
        if (date && content.date) {
            date.textContent = content.date;
            console.log('✅ Site date updated:', content.date);
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
        
        console.log('✅ Site content updated successfully');
    } catch (error) {
        console.error('❌ Error updating site content:', error);
    }
}

// Update list content with proper error handling and animation
function updateListContent(listElement, items) {
    if (!listElement) {
        console.warn('⚠️ List element not provided');
        return;
    }
    
    if (!Array.isArray(items)) {
        console.warn('⚠️ Items is not an array:', items);
        items = [items || 'No items available'];
    }
    
    try {
        console.log(`📝 Updating list with ${items.length} items:`, items);
        
        // Clear existing content with fade out
        listElement.style.opacity = '0.5';
        
        setTimeout(() => {
            listElement.innerHTML = '';
            
            // Add new items with animation
            items.forEach((item, index) => {
                if (item && typeof item === 'string') {
                    const li = document.createElement('li');
                    li.textContent = item;
                    li.style.opacity = '0';
                    li.style.transform = 'translateY(10px)';
                    li.style.animationDelay = `${index * 0.1}s`;
                    listElement.appendChild(li);
                    
                    // Animate in
                    setTimeout(() => {
                        li.style.transition = 'all 0.3s ease';
                        li.style.opacity = '1';
                        li.style.transform = 'translateY(0)';
                    }, index * 50);
                }
            });
            
            listElement.style.opacity = '1';
        }, 150);
        
        console.log(`✅ Updated list with ${items.length} items`);
    } catch (error) {
        console.error('❌ Error updating list content:', error);
        
        // Fallback
        listElement.innerHTML = '<li>Error loading content</li>';
        listElement.style.opacity = '1';
    }
}

// Reset initialization flag for development
function resetUpdatesInitialization() {
    updatesInitialized = false;
    updatesTranslations = null;
    currentUpdateType = 'game';
    
    // Remove initialized class
    const updatesPage = document.getElementById('updatesPage');
    if (updatesPage) {
        updatesPage.classList.remove('initialized');
    }
    
    console.log('🔄 Updates initialization reset');
}

// Export functions to global scope
Object.assign(window, {
    initializeUpdates,
    updateUpdatesLanguage,
    switchUpdateType,
    loadUpdatesTranslations,
    resetUpdatesInitialization
});

console.log('✅ Fixed Updates page JavaScript loaded with proper language support');
