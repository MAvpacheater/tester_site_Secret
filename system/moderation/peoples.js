// Peoples page functionality - Fixed Paths
let peoplesInitialized = false;
let currentFilter = 'all';
let peoplesTranslations = null;
let currentPeoplesLanguage = 'en';

// Get Base Path for Module
function getPeoplesBasePath() {
    const baseTag = document.querySelector('base');
    if (baseTag && baseTag.href) {
        const baseUrl = new URL(baseTag.href);
        return baseUrl.pathname;
    }

    const { protocol, host, pathname } = window.location;
    
    if (host === 'mavpacheater.github.io') {
        return `${protocol}//${host}/tester_site_Secret/`;
    }
    
    if (host.includes('localhost') || host.includes('127.0.0.1')) {
        const pathParts = pathname.split('/').filter(Boolean);
        if (pathParts.length > 0) {
            return `${protocol}//${host}/${pathParts[0]}/`;
        }
        return `${protocol}//${host}/`;
    }
    
    return '/';
}

const PEOPLES_BASE_PATH = getPeoplesBasePath();

// Load peoples translations
async function loadPeoplesTranslations() {
    if (peoplesTranslations) return peoplesTranslations;
    
    try {
        const jsonPath = `${PEOPLES_BASE_PATH}system/moderation/peoples.json`;
        console.log('📥 Loading peoples translations from:', jsonPath);
        
        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        peoplesTranslations = await response.json();
        console.log('✅ Peoples translations loaded successfully');
        return peoplesTranslations;
    } catch (error) {
        console.error('❌ Error loading peoples translations:', error);
        peoplesTranslations = null;
        return null;
    }
}

// Contributors data
const contributors = [
    {
        name: 'Xlestay',
        contribution: 'Gave information/Helped with logic',
        role: 'Helper',
        telegram: '@xlEsTaY',
        discord: null
    },
    {
        name: 'Cs_428',
        contribution: 'Gave information',
        role: 'Helper',
        telegram: '@Cs_428alt',
        discord: null
    },
    {
        name: 'Pupirka',
        contribution: 'Develop RCU Pages info',
        role: 'Admin',
        telegram: '@Tynka235',
        discord: null
    },
    {
        name: 'Komodo',
        contribution: 'Gave information',
        role: 'Helper',
        telegram: '@Tumbochka1466XD',
        discord: null,
    },
    {
        name: 'Йорик',
        contribution: 'Gave information',
        role: 'Helper',
        telegram: '@bebekam228',
        discord: null,
    },
    {
        name: 'Mr dep Dodep',
        contribution: 'Project Creator & Developer',
        role: 'Admin',
        telegram: '@privatefanat_dep',
        discord: 'trader_aws'
    }
];

// Generate peoples page HTML content
function generatePeoplesHTML(translations) {
    if (!translations) {
        return '<div style="padding: 40px; text-align: center; color: #666;">Loading peoples page...</div>';
    }

    const stats = getContributorStats();

    return `
        <div class="peoples-header">
            <h1 class="peoples-title">${translations.title || '🙏 Peoples & Developer'}</h1>
            <div class="peoples-subtitle">${translations.subtitle || 'Special thanks to everyone who contributed!'}</div>
            <div class="peoples-description">${translations.description || 'This project wouldn\'t exist without the amazing community support and contributions from these wonderful people.'}</div>
        </div>
        
        <div class="peoples-stats" id="peoplesStats">
            ${generateStatsHTML(translations, stats)}
        </div>
        
        <div class="filter-controls" id="filterControls">
            ${generateFilterControlsHTML(translations)}
        </div>
        
        <div class="contributors-list" id="contributorsList">
            ${generateContributorsHTML(translations)}
        </div>
    `;
}

function generateStatsHTML(translations, stats) {
    const totalLabel = (translations && translations.stats?.total) || "Total Contributors";
    const adminsLabel = (translations && translations.stats?.admins) || "Project Admins";
    const helpersLabel = (translations && translations.stats?.helpers) || "Community Helpers";
    const telegramLabel = (translations && translations.stats?.withTelegram) || "On Telegram";
    const discordLabel = (translations && translations.stats?.withDiscord) || "On Discord";

    return `
        <div class="stat-item">
            <div class="stat-number">${stats.total}</div>
            <div class="stat-label">${totalLabel}</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${stats.admins}</div>
            <div class="stat-label">${adminsLabel}</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${stats.helpers}</div>
            <div class="stat-label">${helpersLabel}</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${stats.withTelegram}</div>
            <div class="stat-label">${telegramLabel}</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${stats.withDiscord}</div>
            <div class="stat-label">${discordLabel}</div>
        </div>
    `;
}

function generateFilterControlsHTML(translations) {
    const allText = (translations && translations.filters?.all) || '👥 Show All';
    const adminsText = (translations && translations.filters?.admins) || '👑 Admins';
    const helpersText = (translations && translations.filters?.helpers) || '🤝 Helpers';
    
    return `
        <button class="filter-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all" onclick="setFilter('all')">
            ${allText}
        </button>
        <button class="filter-btn ${currentFilter === 'admin' ? 'active' : ''}" data-filter="admin" onclick="setFilter('admin')">
            ${adminsText}
        </button>
        <button class="filter-btn ${currentFilter === 'helper' ? 'active' : ''}" data-filter="helper" onclick="setFilter('helper')">
            ${helpersText}
        </button>
    `;
}

function generateContributorsHTML(translations) {
    return contributors.map((contributor, index) => {
        return generateContributorCardHTML(contributor, index, translations);
    }).join('');
}

function generateContributorCardHTML(contributor, index, translations) {
    const roleClass = contributor.role === 'Admin' ? 'role-admin' : 'role-helper';
    const roleText = translations && translations.roles 
        ? (contributor.role === 'Admin' ? translations.roles.admin : translations.roles.helper)
        : contributor.role;

    let socialButtons = '';
    if (contributor.telegram) {
        const telegramText = (translations && translations.social?.telegram) || '📱 Telegram Profile';
        socialButtons += `
            <button class="social-btn telegram-social" onclick="openTelegramProfile('${contributor.telegram}')">
                ${telegramText}
            </button>
        `;
    }
    if (contributor.discord) {
        const discordText = (translations && translations.social?.discord) || '🎮 Discord Profile';
        socialButtons += `
            <button class="social-btn discord-social" onclick="openDiscordProfile('${contributor.discord}')">
                ${discordText}
            </button>
        `;
    }

    return `
        <div class="contributor-card" data-index="${index}" data-role="${contributor.role.toLowerCase()}">
            <div class="contributor-main">
                <div class="contributor-info">
                    <div class="contributor-name">${escapeHtml(contributor.name)}</div>
                    <div class="contributor-contribution">${escapeHtml(contributor.contribution)}</div>
                </div>
                <div class="contributor-actions">
                    <div class="role-badge ${roleClass}">${roleText}</div>
                </div>
            </div>
            ${socialButtons ? `
                <div class="contributor-social">
                    ${socialButtons}
                </div>
            ` : ''}
        </div>
    `;
}

// Update peoples page language
async function updatePeoplesLanguage(lang) {
    console.log('🌍 Updating peoples language to:', lang);
    
    if (!peoplesTranslations) {
        await loadPeoplesTranslations();
    }
    
    if (!peoplesTranslations) {
        console.error('❌ Peoples translations not available');
        return;
    }
    
    currentPeoplesLanguage = lang;
    
    if (!peoplesTranslations[lang]) {
        console.warn(`⚠️ Language ${lang} not found, using English`);
        currentPeoplesLanguage = 'en';
    }
    
    // Regenerate content with new language
    const peoplesPage = document.getElementById('peoplesPage');
    if (peoplesPage) {
        const translations = peoplesTranslations[currentPeoplesLanguage];
        peoplesPage.innerHTML = generatePeoplesHTML(translations);
        
        // Apply current filter after regenerating
        setTimeout(() => {
            filterContributors();
        }, 100);
        
        console.log('✅ Peoples page language updated');
    }
}

async function initializePeoples() {
    if (peoplesInitialized) {
        console.log('⚠️ Peoples already initialized');
        return;
    }

    console.log('🙏 Initializing Peoples page...');

    const peoplesPage = document.getElementById('peoplesPage');
    if (!peoplesPage) {
        console.error('❌ Peoples page element not found');
        return;
    }

    // Load translations
    await loadPeoplesTranslations();
    
    // Get current app language
    const currentAppLanguage = (typeof getCurrentAppLanguage === 'function') 
        ? getCurrentAppLanguage() 
        : 'en';
    
    console.log('📖 Current app language:', currentAppLanguage);
    
    // Generate and insert content
    if (peoplesTranslations) {
        const translations = peoplesTranslations[currentAppLanguage] || peoplesTranslations['en'];
        peoplesPage.innerHTML = generatePeoplesHTML(translations);
        currentPeoplesLanguage = currentAppLanguage;
    } else {
        peoplesPage.innerHTML = generatePeoplesHTML(null);
    }

    // Apply initial filter after content is generated
    setTimeout(() => {
        filterContributors();
    }, 100);

    peoplesInitialized = true;
    console.log('✅ Peoples page initialized successfully');
}

// Filter functionality
function setFilter(filter) {
    currentFilter = filter;
    updateFilterButtons();
    filterContributors();
    
    console.log(`🔍 Filter set to: ${currentFilter}`);
}

function updateFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        const btnFilter = btn.getAttribute('data-filter');
        if (btnFilter === currentFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function filterContributors() {
    const contributorCards = document.querySelectorAll('.contributor-card');
    
    contributorCards.forEach((card, index) => {
        const contributor = contributors[index];
        if (!contributor) return;

        const shouldShow = currentFilter === 'all' || 
                          (currentFilter === 'admin' && contributor.role === 'Admin') ||
                          (currentFilter === 'helper' && contributor.role === 'Helper');

        if (shouldShow) {
            card.classList.remove('hidden');
            card.style.animationDelay = `${(index * 0.1)}s`;
        } else {
            card.classList.add('hidden');
        }
    });

    const visibleCount = document.querySelectorAll('.contributor-card:not(.hidden)').length;
    console.log(`📊 Showing ${visibleCount} contributor(s) with filter: ${currentFilter}`);
}

// Social profile functions
function openTelegramProfile(telegramHandle) {
    if (!telegramHandle) {
        showNotification('❌ Telegram profile not available', 'error');
        return;
    }

    const cleanHandle = telegramHandle.replace('@', '');
    const url = `https://t.me/${cleanHandle}`;
    
    try {
        window.open(url, '_blank', 'noopener,noreferrer');
        console.log(`📱 Opening Telegram profile: ${url}`);
        showNotification('📱 Opening Telegram profile...', 'success');
    } catch (error) {
        console.error('❌ Error opening Telegram profile:', error);
        showNotification('❌ Failed to open Telegram profile', 'error');
    }
}

function openDiscordProfile(discordTag) {
    if (!discordTag) {
        showNotification('❌ Discord profile not available', 'error');
        return;
    }

    try {
        navigator.clipboard.writeText(discordTag).then(() => {
            console.log(`🎮 Discord tag copied to clipboard: ${discordTag}`);
            showNotification(`📋 Discord tag copied: ${discordTag}`, 'success');
        }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = discordTag;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification(`📋 Discord tag copied: ${discordTag}`, 'success');
        });
        
    } catch (error) {
        console.error('❌ Error copying Discord tag:', error);
        showNotification('❌ Failed to copy Discord tag', 'error');
    }
}

function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.peoples-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `peoples-notification peoples-notification-${type}`;
    notification.textContent = message;

    const peoplesPage = document.getElementById('peoplesPage');
    if (peoplesPage) {
        peoplesPage.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getContributorStats() {
    const stats = {
        total: contributors.length,
        admins: contributors.filter(c => c.role === 'Admin').length,
        helpers: contributors.filter(c => c.role === 'Helper').length,
        withTelegram: contributors.filter(c => c.telegram).length,
        withDiscord: contributors.filter(c => c.discord).length
    };

    return stats;
}

// Listen for language change events
document.addEventListener('languageChanged', async (event) => {
    const newLanguage = event.detail.language;
    console.log('🌍 Peoples page received language change:', newLanguage);
    if (peoplesInitialized && peoplesTranslations) {
        await updatePeoplesLanguage(newLanguage);
    }
});

// Listen for page changes
document.addEventListener('pageChanged', (event) => {
    if (event.detail && event.detail.page === 'peoples') {
        if (!peoplesInitialized) {
            setTimeout(() => initializePeoples(), 100);
        }
    }
});

// Make functions globally available
window.initializePeoples = initializePeoples;
window.updatePeoplesLanguage = updatePeoplesLanguage;
window.loadPeoplesTranslations = loadPeoplesTranslations;
window.setFilter = setFilter;
window.openTelegramProfile = openTelegramProfile;
window.openDiscordProfile = openDiscordProfile;
window.getContributorStats = getContributorStats;
window.showNotification = showNotification;

console.log('✅ peoples.js loaded successfully (Fixed Paths)');
console.log('📍 Base path:', PEOPLES_BASE_PATH);
