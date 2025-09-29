// Fixed Worlds functionality with enhanced multilingual support

// Language management
let worldsCurrentLanguage = 'en';  // Changed variable name for consistency
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
            },
            uk: {
                title: "Інформація про світи",
                loading: "Завантаження світів...",
                error: "Помилка завантаження даних світів",
                retry: "Спробувати знову",
                worlds: [
                    {
                        title: "Світ 0: Сад",
                        icon: "🌳",
                        description: "Щотижневий рейтинг | Пошта | Магазин жетонів | Сад",
                        details: "Щоб потрапити сюди, потрібно відкрити 3 світи"
                    },
                    {
                        title: "Світ 1: Початок",
                        icon: "🏠",
                        description: "Стартовий світ, де починається ваша пригода",
                        details: "Базове місце появи для всіх нових гравців"
                    },
                    {
                        title: "Світ 2: Фантазія",
                        icon: "🏰",
                        description: "Магічне царство, повне міфічних створінь і зачарованих лісів",
                        details: "Вимога розблокування: Завершити Світ 1"
                    },
                    {
                        title: "Світ 3: Технології",
                        icon: "🤖",
                        description: "Футуристичний світ з передовими технологіями і кібер-питомцями",
                        details: "Вимога розблокування: Завершити Світ 2"
                    },
                    {
                        title: "Світ 4: Океан Аксолотлів",
                        icon: "🌊",
                        description: "Підводний рай, наповнений аксолотлями і морським життям",
                        details: "Вимога розблокування: Завершити Світ 3"
                    }
                ]
            },
            ru: {
                title: "Информация о мирах",
                loading: "Загрузка миров...",
                error: "Ошибка загрузки данных миров",
                retry: "Повторить",
                worlds: [
                    {
                        title: "Мир 0: Сад",
                        icon: "🌳",
                        description: "Еженедельный рейтинг | Почта | Магазин токенов | Сад",
                        details: "Чтобы попасть сюда, нужно открыть 3 мира"
                    },
                    {
                        title: "Мир 1: Спавн",
                        icon: "🏠",
                        description: "Стартовый мир, где начинается ваше приключение",
                        details: "Базовое место появления для всех новых игроков"
                    },
                    {
                        title: "Мир 2: Фантазия",
                        icon: "🏰",
                        description: "Магическое царство, полное мифических существ и зачарованных лесов",
                        details: "Требование разблокировки: Завершить Мир 1"
                    },
                    {
                        title: "Мир 3: Технологии",
                        icon: "🤖",
                        description: "Футуристический мир с передовыми технологиями и кибер-питомцами",
                        details: "Требование разблокировки: Завершить Мир 2"
                    },
                    {
                        title: "Мир 4: Океан Аксолотлей",
                        icon: "🌊",
                        description: "Подводный рай, наполненный аксолотлями и морской жизнью",
                        details: "Требование разблокировки: Завершить Мир 3"
                    }
                ]
            }
        };
        return worldsTranslations;
    }
}

// Update language when it changes globally - FIXED
function updateWorldsLanguage(newLanguage) {
    console.log(`🌍 Worlds received language change request: ${worldsCurrentLanguage} → ${newLanguage}`);
    
    if (newLanguage === worldsCurrentLanguage) {
        console.log('🔄 Same language, skipping update');
        return;
    }
    
    worldsCurrentLanguage = newLanguage;
    console.log(`🌍 Updating worlds language to: ${newLanguage}`);
    
    // Reinitialize if already initialized
    if (worldsInitialized) {
        worldsInitialized = false;
        setTimeout(initializeWorlds, 100);
    }
}

// Generate worlds content - FIXED
async function generateWorldsContent() {
    const container = document.getElementById('worldsContainer');
    if (!container) {
        console.error('❌ Worlds container not found');
        return;
    }
    
    // Get current language
    worldsCurrentLanguage = getCurrentLanguage();
    
    // Load translations if not already loaded
    if (!worldsTranslations) {
        await loadWorldsTranslations();
    }
    
    // Show loading state
    const loadingText = worldsTranslations[worldsCurrentLanguage]?.loading || 'Loading worlds...';
    container.innerHTML = `<div class="worlds-loading">${loadingText}</div>`;
    
    try {
        // Small delay to show loading animation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const currentLangData = worldsTranslations[worldsCurrentLanguage];
        if (!currentLangData) {
            throw new Error(`Language data for ${worldsCurrentLanguage} not found`);
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
        
        console.log(`✅ Generated ${currentLangData.worlds.length} worlds in ${worldsCurrentLanguage}`);
        
    } catch (error) {
        console.error('❌ Error generating worlds content:', error);
        
        // Show error state
        const errorText = worldsTranslations[worldsCurrentLanguage]?.error || 'Error loading worlds data';
        const retryText = worldsTranslations[worldsCurrentLanguage]?.retry || 'Retry';
        
        container.innerHTML = `
            <div class="worlds-error">
                ⚠️ ${errorText}
                <br>
                <button class="retry-btn" onclick="generateWorldsContent()">${retryText}</button>
            </div>
        `;
    }
}

// Initialize worlds page - ENHANCED
async function initializeWorlds() {
    console.log('🌍 Initializing worlds page...');
    
    const worldsPage = document.getElementById('worldsPage');
    if (!worldsPage) {
        console.error('❌ Worlds page not found');
        return;
    }
    
    // Check if already initialized and content exists
    if (worldsInitialized && worldsPage.querySelector('.world-item')) {
        console.log('🌍 Worlds already initialized with content');
        return;
    }
    
    // Get saved language
    worldsCurrentLanguage = getCurrentLanguage();
    
    // Load translations
    await loadWorldsTranslations();
    
    const data = worldsTranslations[worldsCurrentLanguage];
    if (!data) {
        console.error('❌ Translation data not found');
        return;
    }
    
    // Create HTML structure
    worldsPage.innerHTML = `
        <h1 class="title">${data.title}</h1>
        <div class="worlds-container" id="worldsContainer"></div>
    `;
    
    // Generate content
    await generateWorldsContent();
    
    worldsInitialized = true;
    window.worldsInitialized = true;
    
    console.log('✅ Worlds page initialized successfully');
}

// Force reinitialize worlds
function forceReinitializeWorlds() {
    console.log('🔄 Force reinitializing worlds...');
    worldsInitialized = false;
    window.worldsInitialized = false;
    initializeWorlds();
}

// Debug function - FIXED
function debugWorlds() {
    console.log('=== WORLDS DEBUG ===');
    console.log('Initialized:', worldsInitialized);
    console.log('Current language:', worldsCurrentLanguage);
    console.log('Container exists:', !!document.getElementById('worldsContainer'));
    console.log('Page exists:', !!document.getElementById('worldsPage'));
    console.log('Page is active:', document.getElementById('worldsPage')?.classList.contains('active'));
    console.log('Translations loaded:', !!worldsTranslations);
    if (worldsTranslations) {
        console.log('Available languages:', Object.keys(worldsTranslations));
        if (worldsTranslations[worldsCurrentLanguage]) {
            console.log(`Worlds count for ${worldsCurrentLanguage}:`, worldsTranslations[worldsCurrentLanguage].worlds?.length);
        }
    }
    const container = document.getElementById('worldsContainer');
    if (container) {
        console.log('Container innerHTML length:', container.innerHTML.length);
        console.log('Has world items:', !!container.querySelector('.world-item'));
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

// Enhanced DOM ready handler
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌍 DOM loaded, setting up worlds...');
    
    // Initialize immediately if worlds page is already active
    setTimeout(() => {
        const worldsPage = document.getElementById('worldsPage');
        if (worldsPage && worldsPage.classList.contains('active')) {
            console.log('🌍 Worlds page is active, initializing...');
            initializeWorlds();
        }
    }, 100);
});

// Enhanced click handler for worlds page switching
document.addEventListener('click', function(e) {
    if (e.target && e.target.getAttribute && e.target.getAttribute('data-page') === 'worlds') {
        console.log('🌍 Worlds page clicked, will initialize...');
        setTimeout(() => {
            const worldsPage = document.getElementById('worldsPage');
            if (!worldsInitialized || !worldsPage || !worldsPage.querySelector('.world-item')) {
                console.log('🌍 Page switched to worlds, initializing...');
                initializeWorlds();
            } else {
                console.log('🌍 Worlds already has content, skipping initialization');
            }
        }, 300);
    }
});

// Alternative legacy function name support
window.switchWorldsLanguage = updateWorldsLanguage;

// Make functions globally available
window.initializeWorlds = initializeWorlds;
window.updateWorldsLanguage = updateWorldsLanguage;
window.generateWorldsContent = generateWorldsContent;
window.debugWorlds = debugWorlds;
window.forceReinitializeWorlds = forceReinitializeWorlds;
window.worldsInitialized = worldsInitialized;

console.log('✅ Fixed worlds.js loaded with enhanced multilingual support');
