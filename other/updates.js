// Complete Updates Page JavaScript - Fixed version
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
            
            // Fallback initialization without translations
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
        const updatesPage = document.getElementById('updatesPage');
        if (updatesPage) {
            updatesPage.classList.add('initialized');
        }
        switchUpdateType('game');
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
        
        // Fallback with default English content
        updatesTranslations = {
            en: {
                title: "📝 Updates & Changelog",
                subtitle: "Stay updated with the latest changes!",
                gameUpdates: "🎮 Game Updates",
                siteUpdates: "🌐 Site Updates",
                gameContent: {
                    version: "Game Update Soon..",
                    date: "Soon..",
                    newFeatures: "🎮 Soon..",
                    improvements: "⚡ Soon..",
                    bugFixes: "🐛 Soon..",
                    features: ["Soon.."],
                    improvementsList: ["Soon.."],
                    bugFixesList: ["Soon.."]
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
                    newFeatures: "🎮 Скоро..",
                    improvements: "⚡ Скоро..",
                    bugFixes: "🐛 Скоро..",
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
                    newFeatures: "🎮 Скоро..",
                    improvements: "⚡ Скоро..",
                    bugFixes: "🐛 Скоро..",
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
    
    // Don't return early if same type - allow reinitialization
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
                // Force reflow
                section.offsetHeight;
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

// Update updates language
function updateUpdatesLanguage(language) {
    if (!language) {
        language = 'en';
    }
    
    console.log(`🌍 Updating updates language to: ${language}`);
    
    // Wait for translations to load if not available
    if (!updatesTranslations) {
        console.log('⏳ Waiting for translations to load...');
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

console.log('✅ Fixed Updates page JavaScript loaded');
