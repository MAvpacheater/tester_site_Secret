(() => {
    let initialized = false;
    let currentLanguage = 'en';
    let translations = null;

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
    const getLanguage = () => localStorage.getItem('armHelper_language') || 'en';

    const fallbackData = {
        en: {
            title: "Charms Boosts",
            loading: "Loading charms...",
            error: "Error loading charms data",
            retry: "Retry",
            names: {},
            descriptions: {}
        },
        common: {
            charms: []
        }
    };

    const loadTranslations = async () => {
        if (translations) return translations;
        try {
            const res = await fetch(`${basePath}info/charms.json`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            translations = await res.json();
        } catch (err) {
            console.error('❌ Failed to load charms translations:', err);
            translations = fallbackData;
        }
        return translations;
    };

    const createStructure = () => {
        const page = document.getElementById('charmsPage');
        if (!page) return;
        currentLanguage = getLanguage();
        const t = translations?.[currentLanguage] || fallbackData.en;
        page.innerHTML = `
            <h1 class="title">${t.title}</h1>
            <div class="charms-container" id="charmsContainer"></div>
        `;
    };

    const updateLanguage = lang => {
        if (lang === currentLanguage) return;
        currentLanguage = lang;
        const title = document.querySelector('.charms-page .title');
        if (title && translations?.[lang]) {
            title.textContent = translations[lang].title;
        }
        if (initialized) requestAnimationFrame(generateContent);
    };

    const generateContent = async () => {
        const container = document.getElementById('charmsContainer');
        if (!container) return;
        currentLanguage = getLanguage();
        try {
            if (!translations) await loadTranslations();
            const data = translations[currentLanguage];
            const commonData = translations.common;
            if (!data || !commonData) throw new Error(`No charms data for language: ${currentLanguage}`);
            
            container.innerHTML = `<div class="charms-loading">${data.loading}</div>`;
            await new Promise(r => setTimeout(r, 500));
            container.innerHTML = '';
            
            commonData.charms.forEach((charm, i) => {
                const item = document.createElement('div');
                item.className = 'charm-item';
                item.style.animationDelay = `${0.1 + (i * 0.05)}s`;
                
                const title = data.names[charm.id] || charm.id;
                const description = data.descriptions[charm.id] || charm.description;
                const maxStockLabel = data.maxStockLabel || 'Max stock:';
                const useOnlyLabel = data.useOnlyLabel || 'use only';
                const details = charm.maxStock === 1 
                    ? `1 ${useOnlyLabel}` 
                    : `${maxStockLabel} ${charm.maxStock}`;
                const category = data.category || charm.category;
                
                item.innerHTML = `
                    <div class="charm-image-container">
                        <img src="${charm.imageUrl}" alt="${title}" class="charm-image" loading="lazy">
                    </div>
                    <div class="charm-content">
                        <div class="charm-title">${title}</div>
                        <div class="charm-description">${description}</div>
                        <div class="charm-details">${details}</div>
                        <div class="charm-category ${charm.category}">${category}</div>
                    </div>
                `;
                container.appendChild(item);
            });
        } catch (err) {
            console.error('Error generating charms content:', err);
            const data = translations[currentLanguage] || fallbackData.en;
            container.innerHTML = `
                <div class="charms-error">
                    ⚠️ ${data.error}<br>
                    <button class="retry-btn" onclick="generateCharmsContent()">${data.retry}</button>
                </div>
            `;
        }
    };

    const init = async () => {
        if (initialized) return;
        currentLanguage = getLanguage();
        try {
            await loadTranslations();
            createStructure();
            await generateContent();
            initialized = true;
            window.charmsInitialized = true;
        } catch (err) {
            console.error('Error initializing charms:', err);
            const page = document.getElementById('charmsPage');
            if (page) {
                page.innerHTML = `
                    <h1 class="title">Charms Boosts</h1>
                    <div class="charms-container">
                        <div class="charms-error">
                            ⚠️ Failed to load charms data<br>
                            <button class="retry-btn" onclick="initializeCharms()">Retry</button>
                        </div>
                    </div>
                `;
            }
        }
    };

    const checkInit = () => {
        const page = document.getElementById('charmsPage');
        if (page?.classList.contains('active') && !initialized) init();
    };

    document.addEventListener('languageChanged', e => e.detail?.language && updateLanguage(e.detail.language));
    document.addEventListener('DOMContentLoaded', () => setTimeout(checkInit, 100));
    document.addEventListener('click', e => {
        if (e.target?.getAttribute('data-page') === 'charms') {
            setTimeout(checkInit, 300);
        }
    });

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mut => {
            if (mut.type === 'attributes' && mut.attributeName === 'class') {
                checkInit();
            }
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        const page = document.getElementById('charmsPage');
        if (page) observer.observe(page, { attributes: true });
    });

    Object.assign(window, {
        initializeCharms: init,
        updateCharmsLanguage: updateLanguage,
        switchCharmsLanguage: updateLanguage,
        generateCharmsContent: generateContent,
        charmsInitialized: initialized
    });
})();
