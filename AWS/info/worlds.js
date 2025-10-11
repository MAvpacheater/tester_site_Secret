// WORLDS - Optimized & Fixed
(() => {
    let initialized = false;
    let currentLanguage = 'en';
    let translations = null;

    // Визначення базового шляху (як в aws_utils.js)
    const getBasePath = () => {
        const { protocol, host, pathname } = window.location;
        
        if (host === 'mavpacheater.github.io') {
            return `${protocol}//${host}/tester_site_Secret/AWS/`;
        }
        
        if (host.includes('localhost') || host.includes('127.0.0.1')) {
            const pathParts = pathname.split('/').filter(Boolean);
            if (pathParts.length > 0 && pathParts[0] !== 'AWS') {
                return `${protocol}//${host}/${pathParts[0]}/AWS/`;
            }
            return `${protocol}//${host}/AWS/`;
        }
        
        return '/AWS/';
    };

    const basePath = getBasePath();
    console.log('🌍 Worlds basePath:', basePath);

    const getLanguage = () => {
        // Спробуємо отримати мову з різних джерел
        if (typeof window.getCurrentAppLanguage === 'function') {
            return window.getCurrentAppLanguage();
        }
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem('armHelper_language') || 'en';
        }
        return 'en';
    };

    const loadTranslations = async () => {
        if (translations) return translations;
        
        try {
            // ✅ ВИПРАВЛЕНО: Використовуємо basePath
            const jsonUrl = `${basePath}info/worlds.json`;
            console.log('📥 Loading worlds translations from:', jsonUrl);
            
            const res = await fetch(jsonUrl);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
            translations = await res.json();
            console.log('✅ Worlds translations loaded successfully');
            console.log('📋 Available languages:', Object.keys(translations));
        } catch (err) {
            console.error('❌ Error loading worlds translations:', err);
            console.error('❌ Attempted URL:', `${basePath}info/worlds.json`);
            
            // Fallback дані
            translations = {
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
                        }
                    ]
                }
            };
        }
        return translations;
    };

    const updateLanguage = lang => {
        console.log(`🌍 Worlds language: ${currentLanguage} → ${lang}`);
        
        if (lang === currentLanguage) {
            console.log('🔄 Same language, skipping update');
            return;
        }
        
        currentLanguage = lang;
        console.log(`🌍 Updating worlds language to: ${lang}`);
        
        if (initialized) {
            initialized = false;
            setTimeout(init, 100);
        }
    };

    const generateContent = async () => {
        const container = document.getElementById('worldsContainer');
        if (!container) return console.error('❌ Worlds container not found');
        
        currentLanguage = getLanguage();
        console.log('🌍 Current language:', currentLanguage);
        
        if (!translations) await loadTranslations();
        
        const loadingText = translations[currentLanguage]?.loading || translations['en']?.loading || 'Loading worlds...';
        container.innerHTML = `<div class="worlds-loading">${loadingText}</div>`;
        
        try {
            await new Promise(r => setTimeout(r, 500));
            
            // Спробуємо отримати дані для поточної мови
            let data = translations[currentLanguage];
            
            // Якщо немає - спробуємо англійську
            if (!data) {
                console.warn(`⚠️ Language data for ${currentLanguage} not found, using English`);
                data = translations['en'];
            }
            
            if (!data) throw new Error(`No translation data available`);
            
            container.innerHTML = '';
            
            // Перевірка чи є worlds
            if (!data.worlds || !Array.isArray(data.worlds)) {
                throw new Error('No worlds data in translations');
            }
            
            data.worlds.forEach((world, i) => {
                const item = document.createElement('div');
                item.className = 'world-item';
                item.style.animationDelay = `${0.1 + (i * 0.05)}s`;
                item.innerHTML = `
                    <div class="world-title">
                        <span class="world-icon">${world.icon}</span>
                        <span>${world.title}</span>
                    </div>
                    <div class="world-description">${world.description}</div>
                    <div class="world-details">${world.details}</div>
                `;
                container.appendChild(item);
            });
            
            console.log(`✅ Generated ${data.worlds.length} worlds in ${currentLanguage}`);
            
        } catch (err) {
            console.error('❌ Error generating worlds content:', err);
            
            const errorText = translations[currentLanguage]?.error || translations['en']?.error || 'Error loading worlds data';
            const retryText = translations[currentLanguage]?.retry || translations['en']?.retry || 'Retry';
            
            container.innerHTML = `
                <div class="worlds-error">
                    ⚠️ ${errorText}
                    <br><br>
                    <small style="color: var(--text-secondary);">${err.message}</small>
                    <br>
                    <button class="retry-btn" onclick="window.generateWorldsContent ? window.generateWorldsContent() : console.error('Function not found')">${retryText}</button>
                </div>
            `;
        }
    };

    const init = async () => {
        console.log('🌍 Initializing worlds page...');
        
        const page = document.getElementById('worldsPage');
        if (!page) return console.error('❌ Worlds page not found');
        
        if (initialized && page.querySelector('.world-item')) {
            console.log('🌍 Worlds already initialized with content');
            return;
        }
        
        currentLanguage = getLanguage();
        
        await loadTranslations();
        
        const data = translations[currentLanguage] || translations['en'];
        if (!data) {
            console.error('❌ Translation data not found');
            return;
        }
        
        page.innerHTML = `
            <h1 class="title">${data.title}</h1>
            <div class="worlds-container" id="worldsContainer"></div>
        `;
        
        await generateContent();
        
        initialized = true;
        window.worldsInitialized = true;
        
        console.log('✅ Worlds page initialized successfully');
    };

    const checkInit = () => {
        const page = document.getElementById('worldsPage');
        if (page?.classList.contains('active') && (!initialized || !page.querySelector('.world-item'))) {
            console.log('🌍 Page switched to worlds, initializing...');
            init();
        }
    };

    // Event listeners
    document.addEventListener('languageChanged', e => {
        console.log('🌍 Worlds received languageChanged event:', e.detail);
        if (e.detail?.language) updateLanguage(e.detail.language);
    });

    document.addEventListener('DOMContentLoaded', () => setTimeout(checkInit, 100));

    document.addEventListener('click', e => {
        if (e.target?.getAttribute('data-page') === 'worlds') {
            console.log('🌍 Worlds page clicked, will initialize...');
            setTimeout(checkInit, 300);
        }
    });

    // Global exports
    Object.assign(window, {
        initializeWorlds: init,
        updateWorldsLanguage: updateLanguage,
        switchWorldsLanguage: updateLanguage,
        generateWorldsContent: generateContent,
        worldsInitialized: initialized
    });

    console.log('✅ Fixed worlds.js loaded with enhanced multilingual support');
    console.log('🌍 Base path:', basePath);
})();
