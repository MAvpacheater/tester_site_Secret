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

    const loadData = async () => {
        if (allData) return allData;
        try {
            const res = await fetch(`${basePath}info/potions.json`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            allData = await res.json();
        } catch (err) {
            console.error('❌ Failed to load potions data:', err);
            allData = { items: { potions: {}, food: {} }, translations: { en: { title: "Potions & Food" } } };
        }
        return allData;
    };

    const getTranslation = (key, fallback = '') => {
        if (!allData?.translations?.[currentLanguage]) return fallback || key;
        const t = allData.translations[currentLanguage];
        const keys = key.split('.');
        let val = t;
        for (const k of keys) {
            if (val && typeof val === 'object' && k in val) {
                val = val[k];
            } else {
                return fallback || key;
            }
        }
        return val || fallback || key;
    };

    const getItemsArray = type => {
        if (!allData?.items?.[type]) return [];
        const items = allData.items[type];
        return Object.keys(items).map(id => ({
            id,
            rarity: items[id].rarity,
            time: items[id].time,
            image: items[id].image
        }));
    };

    const getRarities = () => {
        const potions = getItemsArray('potions');
        const food = getItemsArray('food');
        const rarities = [...new Set([...potions, ...food].map(i => i.rarity))];
        return rarities.sort();
    };

    const createFilters = () => {
        const rarities = getRarities();
        let html = `
            <button class="rarity-filter-btn all" 
                    data-rarity="all" 
                    onclick="setRarityFilter('all')">
                ${getTranslation('filterAll', 'All')}
            </button>
        `;
        html += rarities.map(r => {
            const key = `filter${r.charAt(0).toUpperCase() + r.slice(1)}`;
            const label = getTranslation(key, r);
            return `
                <button class="rarity-filter-btn ${r}" 
                        data-rarity="${r}" 
                        onclick="setRarityFilter('${r}')">
                    ${label}
                </button>
            `;
        }).join('');
        return html;
    };

    const createImage = item => {
        const url = item.image || 'https://via.placeholder.com/150x112/667eea/ffffff?text=No+Image';
        return `
            <img src="${url}" 
                 alt="${item.id}" 
                 class="potion-image loading"
                 loading="lazy"
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/150x112/667eea/ffffff?text=No+Image'; this.classList.add('error'); this.classList.remove('loading');"
                 onload="this.classList.remove('loading');">
        `;
    };

    const getTranslatedItem = (item, type) => {
        const name = getTranslation(`${type}.${item.id}.name`, item.id);
        const boost = getTranslation(`${type}.${item.id}.boost`, '');
        return { ...item, displayName: name, displayBoost: boost };
    };

    const loadContent = async () => {
        await new Promise(r => setTimeout(r, 50));
        const container = document.getElementById('potionsContainer');
        if (!container) throw new Error('Container not found');

        const potionsArray = getItemsArray('potions');
        const foodArray = getItemsArray('food');

        const potionsHTML = potionsArray.map((p, i) => {
            const t = getTranslatedItem(p, 'potions');
            const rarityLabel = getTranslation(`filter${p.rarity.charAt(0).toUpperCase() + p.rarity.slice(1)}`, p.rarity.toUpperCase());
            return `
                <div class="potion-item" data-rarity="${p.rarity}" style="animation-delay: ${i * 50}ms;">
                    ${createImage(p)}
                    <div class="potion-main-content">
                        <div class="potion-name">${t.displayName}</div>
                        <div class="potion-boost">${t.displayBoost}</div>
                    </div>
                    <div class="potion-meta">
                        <div class="potion-rarity ${p.rarity}">${rarityLabel}</div>
                        <div class="potion-time">${p.time}</div>
                    </div>
                </div>
            `;
        }).join('');

        const foodHTML = foodArray.map((f, i) => {
            const t = getTranslatedItem(f, 'food');
            const rarityLabel = getTranslation(`filter${f.rarity.charAt(0).toUpperCase() + f.rarity.slice(1)}`, f.rarity.toUpperCase());
            return `
                <div class="potion-item" data-rarity="${f.rarity}" style="animation-delay: ${i * 50}ms;">
                    ${createImage(f)}
                    <div class="potion-main-content">
                        <div class="potion-name">${t.displayName}</div>
                        <div class="potion-boost">${t.displayBoost}</div>
                    </div>
                    <div class="potion-meta">
                        <div class="potion-rarity ${f.rarity}">${rarityLabel}</div>
                        <div class="potion-time">${f.time}</div>
                    </div>
                </div>
            `;
        }).join('');

        const fullHTML = `
            <div class="potions-switcher">
                <button class="potions-switch-btn active" data-potions-type="potions" onclick="switchPotionsType('potions')">
                    ${getTranslation('switcherPotions', '🧪 Potions')}
                </button>
                <button class="potions-switch-btn" data-potions-type="food" onclick="switchPotionsType('food')">
                    ${getTranslation('switcherFood', '🍖 Food')}
                </button>
            </div>
            <div class="rarity-filter-controls">
                ${createFilters()}
            </div>
            <div class="potions-section active" id="potionsSection">
                ${potionsHTML}
            </div>
            <div class="potions-section" id="foodSection">
                ${foodHTML}
            </div>
        `;

        container.innerHTML = fullHTML;
        currentType = 'potions';
        currentFilter = 'all';
    };

    const switchPotionsType = type => {
        if (!type || (type !== 'potions' && type !== 'food')) return;
        currentType = type;
        document.querySelectorAll('.potions-switch-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-potions-type') === type) {
                btn.classList.add('active');
            }
        });
        document.querySelectorAll('.potions-section').forEach(s => s.classList.remove('active'));
        const section = document.getElementById(`${type}Section`);
        if (section) {
            section.classList.add('active');
            currentFilter = 'all';
            updateFilterButtons();
            filterByRarity();
        }
    };

    const setRarityFilter = rarity => {
        if (rarity === currentFilter && rarity !== 'all') {
            currentFilter = 'all';
        } else {
            currentFilter = rarity;
        }
        updateFilterButtons();
        filterByRarity();
    };

    const updateFilterButtons = () => {
        document.querySelectorAll('.rarity-filter-btn').forEach(btn => {
            const r = btn.getAttribute('data-rarity');
            btn.classList.toggle('active', r === currentFilter);
        });
    };

    const filterByRarity = () => {
        const section = document.querySelector('.potions-section.active');
        if (!section) return;
        const items = section.querySelectorAll('.potion-item');
        let visible = 0;
        items.forEach(item => {
            const r = item.getAttribute('data-rarity');
            const show = currentFilter === 'all' || r === currentFilter;
            if (show) {
                item.classList.remove('hidden');
                item.style.animationDelay = `${visible * 50}ms`;
                visible++;
            } else {
                item.classList.add('hidden');
            }
        });
        const rarityLabel = currentFilter === 'all' 
            ? getTranslation('notificationShowingAll', 'Showing all')
            : getTranslation(`filter${currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)}`, currentFilter.toUpperCase());
        let msg = currentFilter === 'all' 
            ? `${rarityLabel} ${visible} ${currentType}`
            : `${getTranslation('notificationShowing', 'Showing')} ${visible} ${rarityLabel} ${currentType}`;
        showNotification(`🔍 ${msg}`, 'info');
    };

    const showNotification = (msg, type = 'info') => {
        document.querySelectorAll('.potions-notification').forEach(n => n.remove());
        const notif = document.createElement('div');
        notif.className = `potions-notification ${type}`;
        notif.textContent = msg;
        const page = document.getElementById('potionsPage');
        if (page) {
            page.appendChild(notif);
            setTimeout(() => notif.classList.add('show'), 10);
            setTimeout(() => {
                notif.classList.remove('show');
                setTimeout(() => notif.remove(), 300);
            }, 3000);
        }
    };

    const updateLanguage = lang => {
        if (lang === currentLanguage) return;
        currentLanguage = lang;
        if (initialized) {
            setTimeout(init, 100);
        }
    };

    const init = async () => {
        initialized = false;
        currentLanguage = getLanguage();
        await loadData();
        const page = document.getElementById('potionsPage');
        if (!page) return false;
        try {
            page.innerHTML = `
                <h1 class="title">${getTranslation('title', 'Potions & Food')}</h1>
                <div id="potionsContainer"></div>
            `;
            await loadContent();
            initialized = true;
            window.potionsInitialized = true;
            return true;
        } catch (err) {
            console.error('Error initializing potions:', err);
            initialized = false;
            return false;
        }
    };

    document.addEventListener('languageChanged', e => {
        if (e.detail?.language) updateLanguage(e.detail.language);
    });

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const page = document.getElementById('potionsPage');
            if (page && !initialized) init();
        }, 500);
    });

    document.addEventListener('click', e => {
        if (e.target?.getAttribute('data-page') === 'potions') {
            setTimeout(() => {
                if (!initialized || !document.getElementById('potionsSection')) init();
            }, 300);
        }
    });

    Object.assign(window, {
        initializePotions: init,
        switchPotionsType,
        setRarityFilter,
        updatePotionsLanguage: updateLanguage,
        potionsInitialized: initialized
    });
})();
