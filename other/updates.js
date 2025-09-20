// Complete Updates Page JavaScript - Fixed list content version
let updatesInitialized = false;
let updatesTranslations = null;
let currentUpdateType = 'game';

// Initialize updates page
function initializeUpdates() {
    if (updatesInitialized) return;
    
    console.log('🔄 Initializing Updates page...');
    
    try {
        // First initialize the page structure with immediate content
        initializeUpdatesStructure();
        
        // Immediately set default content
        initializeDefaultContent();
        
        // Load translations and update
        loadUpdatesTranslations().then(() => {
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
            
            // Even if translations fail, we have default content
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
        initializeDefaultContent();
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

// Initialize default content immediately
function initializeDefaultContent() {
    console.log('🔄 Initializing default content immediately...');
    
    const defaultContent = {
        gameContent: {
            version: "Game Update Soon..",
            date: "Soon..",
            newFeatures: "🎮 New Features",
            improvements: "⚡ Improvements", 
            bugFixes: "🐛 Bug Fixes",
            features: ["New game mechanics coming soon", "Enhanced gameplay features", "More exciting content"],
            improvementsList: ["Performance optimizations", "Better user experience", "Smoother animations"],
            bugFixesList: ["General bug fixes", "Stability improvements", "Minor issue resolutions"]
        },
        siteContent: {
            version: "Site Update v2.2.0",
            date: "September 13, 2025",
            newFeatures: "🌟 New Features",
            improvements: "🔧 Improvements",
            bugFixes: "🐛 Bug Fixes",
            features: [
                "Added 3 new pages (Updates, Help, Peoples)",
                "Added 1 new category (Others)",
                "Implemented multilingual support",
                "Introduced new mining theme design"
            ],
            improvementsList: [
                "Completely rewritten site architecture",
                "Enhanced responsive design",
                "Improved page loading performance",
                "Better mobile compatibility"
            ],
            bugFixesList: [
                "Fixed lag issues during navigation",
                "Fixed image loading problems",
                "Resolved language switching bugs",
                "Fixed mobile menu display issues"
            ]
        }
    };
    
    // Immediately populate content
    updateGameContent(defaultContent.gameContent);
    updateSiteContent(defaultContent.siteContent);
    
    console.log('✅ Default content initialized');
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
        
        // Create comprehensive fallback translations with proper lists
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
                    features: ["New game mechanics coming soon", "Enhanced gameplay features", "More exciting content"],
                    improvementsList: ["Performance optimizations", "Better user experience", "Smoother animations"],
                    bugFixesList: ["General bug fixes", "Stability improvements", "Minor issue resolutions"]
                },
                siteContent: {
                    version: "Site Update v2.2.0",
                    date: "September 13, 2025",
                    newFeatures: "🌟 New Features",
                    improvements: "🔧 Improvements",
                    bugFixes: "🐛 Bug Fixes",
                    features: [
                        "Added 3 new pages (Updates, Help, Peoples)",
                        "Added 1 new category (Others)",
                        "Implemented multilingual support",
                        "Introduced new mining theme design"
                    ],
                    improvementsList: [
                        "Completely rewritten site architecture",
                        "Enhanced responsive design",
                        "Improved page loading performance",
                        "Better mobile compatibility"
                    ],
                    bugFixesList: [
                        "Fixed lag issues during navigation",
                        "Fixed image loading problems",
                        "Resolved language switching bugs",
                        "Fixed mobile menu display issues"
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
                    features: ["Нові ігрові механіки скоро", "Покращені ігрові функції", "Більше цікавого контенту"],
                    improvementsList: ["Оптимізація продуктивності", "Кращий користувацький досвід", "Плавніші анімації"],
                    bugFixesList: ["Загальні виправлення помилок", "Покращення стабільності", "Усунення дрібних проблем"]
                },
                siteContent: {
                    version: "Оновлення Сайту v2.2.0",
                    date: "13 вересня 2025",
                    newFeatures: "🌟 Нові Функції",
                    improvements: "🔧 Покращення",
                    bugFixes: "🐛 Виправлення Помилок",
                    features: [
                        "Додано 3 нові сторінки (Оновлення, Допомога, Люди)",
                        "Додано 1 нову категорію (Інше)",
                        "Реалізовано багатомовну підтримку",
                        "Представлено новий гірничий дизайн"
                    ],
                    improvementsList: [
                        "Повністю переписана архітектура сайту",
                        "Покращений адаптивний дизайн",
                        "Покращена швидкість завантаження",
                        "Краща мобільна сумісність"
                    ],
                    bugFixesList: [
                        "Виправлено проблеми з лагами при навігації",
                        "Виправлено проблеми завантаження зображень",
                        "Усунуто помилки перемикання мови",
                        "Виправлено проблеми відображення мобільного меню"
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
                    features: ["Новые игровые механики скоро", "Улучшенные игровые функции", "Больше интересного контента"],
                    improvementsList: ["Оптимизация производительности", "Лучший пользовательский опыт", "Плавные анимации"],
                    bugFixesList: ["Общие исправления ошибок", "Улучшение стабильности", "Устранение мелких проблем"]
                },
                siteContent: {
                    version: "Обновление Сайта v2.2.0",
                    date: "13 сентября 2025",
                    newFeatures: "🌟 Новые Функции",
                    improvements: "🔧 Улучшения",
                    bugFixes: "🐛 Исправления Ошибок",
                    features: [
                        "Добавлены 3 новые страницы (Обновления, Помощь, Люди)",
                        "Добавлена 1 новая категория (Другое)",
                        "Реализована многоязычная поддержка",
                        "Представлен новый шахтерский дизайн"
                    ],
                    improvementsList: [
                        "Полностью переписана архитектура сайта",
                        "Улучшен адаптивный дизайн",
                        "Улучшена скорость загрузки страниц",
                        "Лучшая мобильная совместимость"
                    ],
                    bugFixesList: [
                        "Исправлены лаги при навигации",
                        "Исправлены проблемы загрузки изображений",
                        "Устранены ошибки переключения языка",
                        "Исправлены проблемы отображения мобильного меню"
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
        
        // Update lists - FIXED: proper list updating
        const lists = gameSection.querySelectorAll('.update-list');
        if (lists.length >= 3) {
            if (content.features && Array.isArray(content.features) && lists[0]) {
                updateListContentImmediate(lists[0], content.features);
            }
            if (content.improvementsList && Array.isArray(content.improvementsList) && lists[1]) {
                updateListContentImmediate(lists[1], content.improvementsList);
            }
            if (content.bugFixesList && Array.isArray(content.bugFixesList) && lists[2]) {
                updateListContentImmediate(lists[2], content.bugFixesList);
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
        
        // Update lists - FIXED: proper list updating
        const lists = siteSection.querySelectorAll('.update-list');
        if (lists.length >= 3) {
            if (content.features && Array.isArray(content.features) && lists[0]) {
                updateListContentImmediate(lists[0], content.features);
            }
            if (content.improvementsList && Array.isArray(content.improvementsList) && lists[1]) {
                updateListContentImmediate(lists[1], content.improvementsList);
            }
            if (content.bugFixesList && Array.isArray(content.bugFixesList) && lists[2]) {
                updateListContentImmediate(lists[2], content.bugFixesList);
            }
        }
        
        console.log('✅ Site content updated successfully');
    } catch (error) {
        console.error('❌ Error updating site content:', error);
    }
}

// FIXED: Immediate list content update without animations that might fail
function updateListContentImmediate(listElement, items) {
    if (!listElement) {
        console.warn('⚠️ List element not provided');
        return;
    }
    
    if (!Array.isArray(items)) {
        console.warn('⚠️ Items is not an array:', items);
        items = [items || 'No items available'];
    }
    
    try {
        console.log(`📝 Updating list immediately with ${items.length} items:`, items);
        
        // Clear existing content
        listElement.innerHTML = '';
        
        // Add new items immediately without complex animations
        items.forEach((item, index) => {
            if (item && typeof item === 'string') {
                const li = document.createElement('li');
                li.textContent = item;
                listElement.appendChild(li);
            }
        });
        
        console.log(`✅ Updated list with ${items.length} items`);
    } catch (error) {
        console.error('❌ Error updating list content:', error);
        
        // Fallback
        listElement.innerHTML = '<li>Error loading content</li>';
    }
}

// Legacy function for backward compatibility with animations
function updateListContent(listElement, items) {
    updateListContentImmediate(listElement, items);
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

console.log('✅ Fixed Updates page JavaScript loaded with immediate list content');
