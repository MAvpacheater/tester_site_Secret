(() => {
    let initialized = false;
    let currentLanguage = 'en';
    let currentType = 'free';
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
            const res = await fetch(`${basePath}info/trainers.json`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            translations = await res.json();
        } catch (err) {
            throw err;
        }
        return translations;
    };

    const updateLanguage = lang => {
        if (lang === currentLanguage) return;
        currentLanguage = lang;
        if (initialized) {
            initialized = false;
            setTimeout(init, 100);
        }
    };

    const switchTrainerType = type => {
        currentType = type;
        document.querySelectorAll('.trainer-switch-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-type="${type}"]`);
        if (activeBtn) activeBtn.classList.add('active');
        document.querySelectorAll('.trainer-section').forEach(s => s.classList.remove('active'));
        const section = document.getElementById(`${type}Trainers`);
        if (section) section.classList.add('active');
    };

    const generateContent = (type, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        if (!translations?.[currentLanguage]) return;
        const data = translations[currentLanguage];
        container.innerHTML = '';
        const trainers = data.trainers[type];
        if (!trainers) return;
        trainers.forEach((trainer, i) => {
            const item = document.createElement('div');
            item.className = 'trainer-item';
            item.style.animationDelay = `${i * 0.05}s`;
            const desc = data.description_template
                .replace('{strength}', trainer.strength)
                .replace('{strengthBoost}', trainer.strengthBoost)
                .replace('{luck}', trainer.luck)
                .replace('{luckBoost}', trainer.luckBoost)
                .replace('{wins}', trainer.wins)
                .replace('{winsBoost}', trainer.winsBoost);
            const label = type === 'free' ? data.free_label : data.donate_label;
            item.innerHTML = `
                <div class="trainer-content">
                    <div class="trainer-name">${trainer.name}</div>
                    <div class="trainer-description">${desc}</div>
                </div>
                <div class="trainer-type ${type}">${label}</div>
            `;
            container.appendChild(item);
        });
    };

    const generateAllContent = async () => {
        currentLanguage = getLanguage();
        try {
            if (!translations) await loadTranslations();
            generateContent('free', 'freeTrainers');
            generateContent('donate', 'donateTrainers');
        } catch (err) {
            console.error('❌ Error generating trainer content:', err);
        }
    };

    const init = async () => {
        const page = document.getElementById('trainerPage');
        if (!page) return;
        if (initialized && page.querySelector('.trainer-item')) return;
        currentLanguage = getLanguage();
        try {
            await loadTranslations();
            const data = translations[currentLanguage];
            if (!data) throw new Error('Translation data not found');
            page.innerHTML = `
                <h1 class="title">${data.title}</h1>
                <div class="trainer-switcher">
                    <button class="trainer-switch-btn active" data-type="free" onclick="switchTrainerType('free')">
                        ${data.free_button}
                    </button>
                    <button class="trainer-switch-btn" data-type="donate" onclick="switchTrainerType('donate')">
                        ${data.donate_button}
                    </button>
                </div>
                <div class="trainer-container">
                    <div class="trainer-section active" id="freeTrainers"></div>
                    <div class="trainer-section" id="donateTrainers"></div>
                </div>
            `;
            await generateAllContent();
            switchTrainerType('free');
            initialized = true;
            window.trainerInitialized = true;
        } catch (err) {
            page.innerHTML = `
                <h1 class="title">Trainers</h1>
                <div class="trainer-error">
                    ⚠️ Failed to load trainer data<br>
                    <button class="retry-btn" onclick="initializeTrainer()">Retry</button>
                </div>
            `;
        }
    };

    const checkInit = () => {
        const page = document.getElementById('trainerPage');
        if (page?.classList.contains('active') && (!initialized || !page.querySelector('.trainer-item'))) init();
    };

    document.addEventListener('languageChanged', e => e.detail?.language && updateLanguage(e.detail.language));
    document.addEventListener('DOMContentLoaded', () => setTimeout(checkInit, 100));
    document.addEventListener('click', e => {
        if (e.target?.getAttribute('data-page') === 'trainer') {
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
        const page = document.getElementById('trainerPage');
        if (page) observer.observe(page, { attributes: true });
    });

    Object.assign(window, {
        switchTrainerType,
        initializeTrainer: init,
        updateTrainerLanguage: updateLanguage,
        generateAllTrainerContent: generateAllContent,
        trainerInitialized: initialized
    });
})();
