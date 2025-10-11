(() => {
    let initialized = false;
    let currentLanguage = 'en';
    let currentType = 'rewards';
    let translations = null;

    const rewardImages = [
        "https://i.postimg.cc/QM43hkV6/2025-09-09-17-03-52.png",
        "https://i.postimg.cc/GmRrQmZj/2025-09-09-17-05-23.png",
        "https://i.postimg.cc/QM43hkV6/2025-09-09-17-03-52.png",
        "https://i.postimg.cc/GmRrQmZj/2025-09-09-17-05-23.png",
        "https://i.postimg.cc/QM43hkV6/2025-09-09-17-03-52.png"
    ];

    const petImages = [
        "https://i.postimg.cc/CK6WWh6X/2025-09-09-17-06-19.png",
        "https://i.postimg.cc/vZXRtL7Q/2025-09-09-17-06-10.png",
        "https://i.postimg.cc/N003J9bR/2025-09-09-17-06-14.png",
        "https://i.postimg.cc/Jz1BLnVT/2025-09-09-17-06-33.png",
        "https://i.postimg.cc/FRd2vMMR/2025-09-09-17-06-29.png",
        "https://i.postimg.cc/2jBDNWYw/2025-09-09-17-05-57.png",
        "https://i.postimg.cc/nhnbmwDR/2025-09-09-17-06-05.png",
        "https://i.postimg.cc/qqnVsPwY/2025-09-09-17-05-54.png",
        "https://i.postimg.cc/Ghw1Lph1/2025-09-09-17-06-01.png",
        "https://i.postimg.cc/4djRhf6V/2025-09-09-17-05-49.png",
        "https://i.postimg.cc/857V5J6T/2025-09-09-17-05-40.png",
        "https://i.postimg.cc/RFk2ZPmT/2025-09-09-17-06-24.png",
        "", "", ""
    ];

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
            const res = await fetch(`${basePath}info/secret.json`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            translations = await res.json();
        } catch (err) {
            translations = {
                en: {
                    title: "Secret Pets",
                    loading: "Loading secret pets...",
                    error: "Error loading secret pets data",
                    retry: "Retry",
                    switcher: { rewards: "Rewards", names: "Names" },
                    rewards: [],
                    pets: [],
                    info: {
                        title: "Secret Pets Information",
                        worldsText: "You can hatch secrets pets on {worlds} worlds",
                        worldsHighlight: "4-15 and 21",
                        countText: "Rn on game {count} secret pets",
                        count: "15",
                        abilities: "Secret pets have unique abilities and special stats bonuses",
                        note: "P.S. I spent 1-2 days to knock out 1 secret (I had 5.5m lucky)"
                    }
                }
            };
        }
        return translations;
    };

    const handleImageError = img => {
        img.style.cssText = 'display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #e2e8f0, #cbd5e0); color: #64748b; font-size: 0.8em; font-weight: 500;';
        img.innerHTML = 'No Image';
        img.removeAttribute('src');
    };

    const generateContent = async () => {
        const container = document.getElementById('secretContainer');
        if (!container) return;
        currentLanguage = getLanguage();
        try {
            if (!translations) await loadTranslations();
            const data = translations[currentLanguage];
            if (!data) throw new Error(`Language data for ${currentLanguage} not found`);
            container.innerHTML = `<div class="secret-loading">${data.loading}</div>`;
            await new Promise(r => setTimeout(r, 500));
            
            const hatchRewardsHTML = data.rewards.map((item, i) => {
                const img = rewardImages[i] ? 
                    `<img src="${rewardImages[i]}" alt="Hatch ${item.hatch} Reward" class="hatch-reward-image" onerror="handleImageError(this)">` :
                    `<div class="hatch-reward-image" style="background: linear-gradient(135deg, #e2e8f0, #cbd5e0); display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 0.8em; font-weight: 500;">No Image</div>`;
                return `
                    <div class="hatch-reward-card">
                        ${img}
                        <div class="hatch-reward-content">
                            <div class="hatch-number">Hatch ${item.hatch}</div>
                            <div class="hatch-reward">${item.reward}</div>
                        </div>
                    </div>
                `;
            }).join('');

            const secretPetsHTML = data.pets.map((pet, i) => {
                const img = petImages[i] ? 
                    `<img src="${petImages[i]}" alt="${pet.name}" class="secret-pet-image" onerror="handleImageError(this)">` :
                    `<div class="secret-pet-image" style="background: linear-gradient(135deg, #e2e8f0, #cbd5e0); display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 0.8em; font-weight: 500;">No Image</div>`;
                return `
                    <div class="secret-pet-item">
                        ${img}
                        <div class="secret-pet-content">
                            <div class="secret-pet-name">${pet.name}</div>
                            <div class="secret-pet-boosts">${pet.boosts}</div>
                        </div>
                        <div class="secret-pet-world">${pet.world}</div>
                    </div>
                `;
            }).join('');

            const worldsText = data.info.worldsText.replace('{worlds}', `<span class="secret-worlds-highlight">${data.info.worldsHighlight}</span>`);
            const countText = data.info.countText.replace('{count}', `<span class="secret-count-highlight">${data.info.count}</span>`);

            const fullHTML = `
                <div class="secret-switcher">
                    <button class="secret-switch-btn ${currentType === 'rewards' ? 'active' : ''}" data-secret-type="rewards" onclick="switchSecretType('rewards')">${data.switcher.rewards}</button>
                    <button class="secret-switch-btn ${currentType === 'names' ? 'active' : ''}" data-secret-type="names" onclick="switchSecretType('names')">${data.switcher.names}</button>
                </div>
                <div class="secret-section ${currentType === 'rewards' ? 'active' : ''}" id="rewardsSection">
                    <div class="hatch-rewards-grid">
                        ${hatchRewardsHTML}
                    </div>
                    <div class="secret-image-container">
                        <img src="https://i.postimg.cc/MTvCfmFj/2025-09-08-13-11-34.jpg" 
                             alt="Secret Pets" 
                             class="secret-image"
                             loading="lazy">
                    </div>
                    <div class="secret-info">
                        <h3>${data.info.title}</h3>
                        <div class="secret-info-text">${worldsText}</div>
                        <div class="secret-info-text">${countText}</div>
                        <div class="secret-info-text">${data.info.abilities}</div>
                        <div class="secret-info-text">${data.info.note}</div>
                    </div>
                </div>
                <div class="secret-section ${currentType === 'names' ? 'active' : ''}" id="namesSection">
                    ${secretPetsHTML}
                </div>
            `;

            container.innerHTML = fullHTML;
            const secretImage = container.querySelector('.secret-image');
            if (secretImage) {
                secretImage.addEventListener('load', function() {
                    this.style.opacity = '1';
                });
                secretImage.addEventListener('error', function() {
                    this.src = 'https://via.placeholder.com/500x317/667eea/ffffff?text=Secret+Pets';
                    this.alt = 'Secret Pets Image';
                });
            }
        } catch (err) {
            const errorText = translations[currentLanguage]?.error || 'Error loading secret pets data';
            const retryText = translations[currentLanguage]?.retry || 'Retry';
            container.innerHTML = `
                <div class="secret-error">
                    ⚠️ ${errorText}
                    <br>
                    <button class="retry-btn" onclick="generateSecretContent()">${retryText}</button>
                </div>
            `;
        }
    };

    const switchSecretType = type => {
        currentType = type;
        document.querySelectorAll('.secret-switch-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-secret-type="${type}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        document.querySelectorAll('.secret-section').forEach(s => s.classList.remove('active'));
        const section = document.getElementById(`${type}Section`);
        if (section) section.classList.add('active');
    };

    const updateLanguage = lang => {
        if (lang === currentLanguage) return;
        currentLanguage = lang;
        if (initialized) {
            initialized = false;
            setTimeout(init, 100);
        }
    };

    const init = async () => {
        const page = document.getElementById('secretPage');
        if (!page) return;
        if (initialized && page.querySelector('.secret-switcher')) return;
        currentLanguage = getLanguage();
        try {
            await loadTranslations();
            const data = translations[currentLanguage];
            if (!data) throw new Error('Translation data not found');
            page.innerHTML = `
                <h1 class="title">${data.title}</h1>
                <div class="secret-container" id="secretContainer"></div>
            `;
            await generateContent();
            initialized = true;
            window.secretInitialized = true;
        } catch (err) {
            page.innerHTML = `
                <h1 class="title">Secret Pets</h1>
                <div class="secret-error">
                    ⚠️ Failed to load secret pets data<br>
                    <button class="retry-btn" onclick="initializeSecret()">Retry</button>
                </div>
            `;
        }
    };

    const checkInit = () => {
        const page = document.getElementById('secretPage');
        if (page?.classList.contains('active') && (!initialized || !page.querySelector('.secret-switcher'))) init();
    };

    document.addEventListener('languageChanged', e => {
        if (e.detail?.language) updateLanguage(e.detail.language);
    });
    document.addEventListener('DOMContentLoaded', () => setTimeout(checkInit, 100));
    document.addEventListener('click', e => {
        if (e.target?.getAttribute('data-page') === 'secret') {
            setTimeout(checkInit, 300);
        }
    });

    Object.assign(window, {
        initializeSecret: init,
        updateSecretLanguage: updateLanguage,
        switchSecretType,
        handleImageError,
        generateSecretContent: generateContent,
        secretInitialized: initialized
    });
})();
