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

    const loadTranslations = async () => {
        if (translations) return translations;
        try {
            const res = await fetch(`${basePath}info/aura.json`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            translations = await res.json();
            return translations;
        } catch (err) {
            console.error('❌ Failed to load aura translations:', err);
            throw err;
        }
    };

    const createStructure = () => {
        const page = document.getElementById('auraPage');
        if (!page) return;
        currentLanguage = getLanguage();
        const t = translations?.[currentLanguage] || translations?.en;
        page.innerHTML = `
            <h1 class="title">${t?.title || 'Aura Boosts'}</h1>
            <div class="aura-container" id="auraContainer"></div>
        `;
    };

    const generateContent = async () => {
        const container = document.getElementById('auraContainer');
        if (!container) return;
        currentLanguage = getLanguage();
        try {
            if (!translations) await loadTranslations();
            const data = translations[currentLanguage];
            const commonData = translations.common;
            if (!data || !commonData) throw new Error(`No data for: ${currentLanguage}`);
            
            container.innerHTML = `<div class="aura-loading">${data.loading}</div>`;
            await new Promise(r => setTimeout(r, 300));
            container.innerHTML = '';
            
            commonData.auras.forEach((aura, i) => {
                const item = document.createElement('div');
                item.className = 'aura-item';
                item.style.animationDelay = `${i * 0.05}s`;
                
                const name = data.names[aura.id] || aura.id;
                const desc = data.description
                    .replace('%strength%', aura.strength)
                    .replace('%luck%', aura.luck)
                    .replace('%speed%', aura.speed);
                
                const photo = aura.image 
                    ? `<img src="${aura.image}" alt="${name}" onerror="this.parentElement.innerHTML='<div class=\\'aura-photo-placeholder\\'>No Image</div>'">`
                    : '<div class="aura-photo-placeholder">No Image</div>';
                
                item.innerHTML = `
                    <div class="aura-photo">${photo}</div>
                    <div class="aura-content">
                        <div class="aura-name">${name}</div>
                        <div class="aura-description">${desc}</div>
                    </div>
                    <div class="aura-rarity ${aura.rarity}">${aura.rarity.toUpperCase()}</div>
                `;
                container.appendChild(item);
            });
        } catch (err) {
            console.error('Error generating aura content:', err);
            container.innerHTML = `
                <div class="aura-error">
                    ⚠️ Error loading aura data<br>
                    <button class="retry-btn" onclick="generateAuraContent()">Retry</button>
                </div>
            `;
        }
    };

    const updateLanguage = lang => {
        if (lang === currentLanguage) return;
        currentLanguage = lang;
        const title = document.querySelector('.aura-page .title');
        if (title && translations?.[lang]) {
            title.textContent = translations[lang].title;
        }
        if (initialized) setTimeout(generateContent, 100);
    };

    const init = async () => {
        if (initialized) return;
        currentLanguage = getLanguage();
        try {
            await loadTranslations();
            createStructure();
            await generateContent();
            initialized = true;
            window.auraInitialized = true;
        } catch (err) {
            console.error('Error initializing aura:', err);
            const page = document.getElementById('auraPage');
            if (page) {
                page.innerHTML = `
                    <h1 class="title">Aura Boosts</h1>
                    <div class="aura-container">
                        <div class="aura-error">
                            ⚠️ Failed to load aura data<br>
                            <button class="retry-btn" onclick="initializeAura()">Retry</button>
                        </div>
                    </div>
                `;
            }
        }
    };

    document.addEventListener('languageChanged', e => {
        if (e.detail?.language) updateLanguage(e.detail.language);
    });

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const page = document.getElementById('auraPage');
            if (page?.classList.contains('active')) init();
        }, 100);
    });

    document.addEventListener('click', e => {
        if (e.target?.getAttribute('data-page') === 'aura') {
            setTimeout(() => !initialized && init(), 300);
        }
    });

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mut => {
            if (mut.type === 'attributes' && mut.attributeName === 'class') {
                const page = document.getElementById('auraPage');
                if (page?.classList.contains('active') && !initialized) init();
            }
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
        const page = document.getElementById('auraPage');
        if (page) observer.observe(page, { attributes: true });
    });

    Object.assign(window, {
        initializeAura: init,
        updateAuraLanguage: updateLanguage,
        generateAuraContent: generateContent,
        auraInitialized: initialized
    });
})();
