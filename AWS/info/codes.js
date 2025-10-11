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
    const loadCodeStates = () => {
        const saved = sessionStorage.getItem('codeStates');
        return saved ? JSON.parse(saved) : {};
    };
    const saveCodeStates = states => sessionStorage.setItem('codeStates', JSON.stringify(states));

    const loadTranslations = async () => {
        if (translations) return translations;
        try {
            const res = await fetch(`${basePath}info/codes.json`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            translations = await res.json();
        } catch (err) {
            console.error('❌ Failed to load codes translations:', err);
            throw err;
        }
        return translations;
    };

    const calculateStats = (codes, states) => {
        const total = codes.length;
        const used = codes.filter(c => states[c.code]).length;
        return {
            total,
            used,
            available: total - used,
            progress: Math.round((used / total) * 100)
        };
    };

    const copyCode = async (code, button) => {
        try {
            await navigator.clipboard.writeText(code);
            const original = button.innerHTML;
            button.innerHTML = '<span class="copy-icon">✓</span> Copied!';
            button.classList.add('copied');
            setTimeout(() => {
                button.innerHTML = original;
                button.classList.remove('copied');
            }, 1500);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const toggleCodeStatus = (codeIndex, toggleEl) => {
        const commonData = translations.common;
        const code = commonData.codes[codeIndex];
        const states = loadCodeStates();
        states[code.code] = !states[code.code];
        const item = toggleEl.closest('.code-item');
        if (states[code.code]) {
            toggleEl.classList.add('used');
            item.classList.add('used');
        } else {
            toggleEl.classList.remove('used');
            item.classList.remove('used');
        }
        saveCodeStates(states);
        updateStats();
    };

    const updateStats = () => {
        if (!translations?.common || !translations?.[currentLanguage]) return;
        const commonData = translations.common;
        const states = loadCodeStates();
        const stats = calculateStats(commonData.codes, states);
        const els = {
            total: document.querySelector('.stat-number.total'),
            used: document.querySelector('.stat-number.used'),
            available: document.querySelector('.stat-number.available'),
            progress: document.querySelector('.stat-number.progress'),
            bar: document.querySelector('.progress-fill')
        };
        if (els.total) els.total.textContent = stats.total;
        if (els.used) els.used.textContent = stats.used;
        if (els.available) els.available.textContent = stats.available;
        if (els.progress) els.progress.textContent = `${stats.progress}%`;
        if (els.bar) els.bar.style.height = `${stats.progress}%`;
    };

    const generateContent = async () => {
        const page = document.getElementById('codesPage');
        if (!page) return;
        currentLanguage = getLanguage();
        try {
            if (!translations) await loadTranslations();
            const data = translations[currentLanguage];
            const commonData = translations.common;
            if (!data || !commonData) throw new Error(`No codes data for language: ${currentLanguage}`);
            
            page.innerHTML = `
                <h1 class="title">${data.title}</h1>
                <div class="codes-container" id="codesContainer">
                    <div class="codes-loading">${data.loading}</div>
                </div>
            `;
            await new Promise(r => setTimeout(r, 300));
            
            const states = loadCodeStates();
            const stats = calculateStats(commonData.codes, states);
            
            let content = `
                <div class="codes-header">
                    <div class="codes-stats">
                        <div class="stat-item">
                            <div class="stat-number total">${stats.total}</div>
                            <div class="stat-label">${data.stats.total}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number used">${stats.used}</div>
                            <div class="stat-label">${data.stats.used}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number available">${stats.available}</div>
                            <div class="stat-label">${data.stats.available}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number progress">${stats.progress}%</div>
                            <div class="stat-label">${data.stats.progress}</div>
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="height: ${stats.progress}%"></div>
                    </div>
                </div>
                <div class="codes-list">
            `;
            
            commonData.codes.forEach((code, i) => {
                const isUsed = states[code.code] || false;
                const extras = data.extras?.[code.id];
                const desc = extras || (code.hours > 0 ? data.descTemplate.replace('%hours%', code.hours) : '');
                
                content += `
                    <div class="code-item ${isUsed ? 'used' : ''}" style="animation-delay: ${i * 0.05}s">
                        <div class="code-content">
                            <div class="code-name">${code.code}</div>
                            ${desc ? `<div class="code-description">${desc}</div>` : ''}
                        </div>
                        <div class="code-actions">
                            <button class="code-toggle ${isUsed ? 'used' : ''}" 
                                    onclick="toggleCodeStatus(${i}, this)">
                            </button>
                            <button class="copy-btn" onclick="copyCode('${code.code}', this)">
                                <span class="copy-icon">📋</span>
                                Copy
                            </button>
                        </div>
                    </div>
                `;
            });
            content += '</div>';
            
            const container = document.getElementById('codesContainer');
            if (container) container.innerHTML = content;
        } catch (err) {
            console.error('Error generating codes content:', err);
            page.innerHTML = `
                <h1 class="title">Codes Collection</h1>
                <div class="codes-container">
                    <div class="codes-error">
                        ⚠️ Error loading codes data<br>
                        <button class="retry-btn" onclick="initializeCodes()">Retry</button>
                    </div>
                </div>
            `;
        }
    };

    const updateLanguage = lang => {
        if (lang === currentLanguage) return;
        currentLanguage = lang;
        const title = document.querySelector('#codesPage .title');
        if (title && translations?.[lang]) {
            title.textContent = translations[lang].title;
        }
        if (initialized) requestAnimationFrame(generateContent);
    };

    const init = async () => {
        if (initialized) return;
        currentLanguage = getLanguage();
        try {
            await loadTranslations();
            await generateContent();
            initialized = true;
            window.codesInitialized = true;
        } catch (err) {
            console.error('Error initializing codes:', err);
            const page = document.getElementById('codesPage');
            if (page) {
                page.innerHTML = `
                    <h1 class="title">Codes Collection</h1>
                    <div class="codes-container">
                        <div class="codes-error">
                            ⚠️ Failed to load codes data<br>
                            <button class="retry-btn" onclick="initializeCodes()">Retry</button>
                        </div>
                    </div>
                `;
            }
        }
    };

    const checkInit = () => {
        const page = document.getElementById('codesPage');
        if (page?.classList.contains('active') && !initialized) init();
    };

    document.addEventListener('languageChanged', e => e.detail?.language && updateLanguage(e.detail.language));
    document.addEventListener('DOMContentLoaded', () => setTimeout(checkInit, 100));
    document.addEventListener('click', e => {
        if (e.target?.getAttribute('data-page') === 'codes') {
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
        const page = document.getElementById('codesPage');
        if (page) observer.observe(page, { attributes: true });
    });

    Object.assign(window, {
        initializeCodes: init,
        updateCodesLanguage: updateLanguage,
        generateCodesContent: generateContent,
        copyCode,
        toggleCodeStatus,
        updateCodesStats: updateStats,
        codesInitialized: initialized
    });
})();
