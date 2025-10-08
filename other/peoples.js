// Peoples page functionality with multilingual support and dynamic content generation
let peoplesInitialized = false;
let currentFilter = 'all'; // 'all', 'admin', 'helper'
let peoplesTranslations = null;
let currentPeoplesLanguage = 'en';

// Load peoples translations
async function loadPeoplesTranslations() {
    if (peoplesTranslations) return peoplesTranslations;
    
    try {
        console.log('📥 Loading peoples translations...');
        const response = await fetch('other/peoples.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        peoplesTranslations = await response.json();
        console.log('✅ Peoples translations loaded successfully');
        return peoplesTranslations;
    } catch (error) {
        console.error('❌ Error loading peoples translations:', error);
        // Fallback to English
        peoplesTranslations = {
            en: {
                title: "🙏 Peoples & Developer",
                subtitle: "Special thanks to everyone who contributed!",
                description: "This project wouldn't exist without the amazing community support and contributions from these wonderful people.",
                filters: { 
                    all: "👥 Show All",
                    admins: "👑 Admins", 
                    helpers: "🤝 Helpers" 
                },
                roles: { admin: "Admin", helper: "Helper" },
                social: { 
                    telegram: "📱 Telegram Profile", 
                    discord: "🎮 Discord Profile" 
                },
                stats: {
                    total: "Total Contributors",
                    admins: "Project Admins",
                    helpers: "Community Helpers",
                    withTelegram: "On Telegram",
                    withDiscord: "On Discord"
                },
                filterResults: {
                    showingAll: "Showing all {count} contributor{s}",
                    showingAdmins: "Showing {count} admin{s}",
                    showingHelpers: "Showing {count} helper{s}"
                },
                notifications: {
                    telegramNotAvailable: "❌ Telegram profile not available",
                    telegramOpening: "📱 Opening Telegram profile...",
                    telegramFailed: "❌ Failed to open Telegram profile",
                    discordNotAvailable: "❌ Discord profile not available",
                    discordOpening: "🎮 Opening Discord... Tag: {tag}",
                    discordCopied: "📋 Discord tag copied: {tag}",
                    discordFailed: "❌ Failed to open Discord profile"
                }
            }
        };
        return peoplesTranslations;
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
        contribution: 'Develop RCU ',
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

// Generate peoples page HTML content (like help.js)
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
    // Role badge styling and text
    const roleClass = contributor.role === 'Admin' ? 'role-admin' : 'role-helper';
    const roleText = translations && translations.roles 
        ? (contributor.role === 'Admin' ? translations.roles.admin : translations.roles.helper)
        : contributor.role;

    // Generate social buttons only if they exist
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
    if (!peoplesTranslations) {
        await loadPeoplesTranslations();
    }
    
    if (!peoplesTranslations) {
        console.error('❌ Peoples translations not available');
        return;
    }
    
    currentPeoplesLanguage = lang;
    
    if (!peoplesTranslations[lang]) {
        console.error(`❌ Peoples language ${lang} not found, defaulting to English`);
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
    }
    
    console.log(`✅ Peoples page language updated to: ${currentPeoplesLanguage}`);
}

async function initializePeoples() {
    if (peoplesInitialized) {
        console.log('⚠️ Peoples already initialized');
        return;
    }

    console.log('🙏 Initializing Peoples page with dynamic content generation...');

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
            // Add animation delay for filtered results
            card.style.animationDelay = `${(index * 0.1)}s`;
        } else {
            card.classList.add('hidden');
        }
    });

    // Show count of filtered results
    const visibleCount = document.querySelectorAll('.contributor-card:not(.hidden)').length;
    const translations = peoplesTranslations && peoplesTranslations[currentPeoplesLanguage];
    let filterMessage = '';
    
    if (translations && translations.filterResults) {
        const plural = visibleCount !== 1 ? 's' : '';
        switch (currentFilter) {
            case 'admin':
                filterMessage = translations.filterResults.showingAdmins
                    .replace('{count}', visibleCount)
                    .replace('{s}', plural);
                break;
            case 'helper':
                filterMessage = translations.filterResults.showingHelpers
                    .replace('{count}', visibleCount)
                    .replace('{s}', plural);
                break;
            default:
                filterMessage = translations.filterResults.showingAll
                    .replace('{count}', visibleCount)
                    .replace('{s}', plural);
        }
    } else {
        // Fallback to English
        switch (currentFilter) {
            case 'admin':
                filterMessage = `Showing ${visibleCount} Admin${visibleCount !== 1 ? 's' : ''}`;
                break;
            case 'helper':
                filterMessage = `Showing ${visibleCount} Helper${visibleCount !== 1 ? 's' : ''}`;
                break;
            default:
                filterMessage = `Showing all ${visibleCount} contributor${visibleCount !== 1 ? 's' : ''}`;
        }
    }
    
    console.log(`📊 ${filterMessage}`);
    
    // Optional: Show notification about filter
    if (currentFilter !== 'all') {
        showNotification(`🔍 ${filterMessage}`, 'info');
    }
}

// Social profile functions
function openTelegramProfile(telegramHandle) {
    if (!telegramHandle) {
        const translations = peoplesTranslations && peoplesTranslations[currentPeoplesLanguage];
        const errorMsg = (translations && translations.notifications?.telegramNotAvailable) 
            || '❌ Telegram profile not available';
        showNotification(errorMsg, 'error');
        return;
    }

    const cleanHandle = telegramHandle.replace('@', '');
    const url = `https://t.me/${cleanHandle}`;
    
    try {
        window.open(url, '_blank', 'noopener,noreferrer');
        console.log(`📱 Opening Telegram profile: ${url}`);
        
        const translations = peoplesTranslations && peoplesTranslations[currentPeoplesLanguage];
        const successMsg = (translations && translations.notifications?.telegramOpening) 
            || '📱 Opening Telegram profile...';
        showNotification(successMsg, 'success');
    } catch (error) {
        console.error('❌ Error opening Telegram profile:', error);
        
        const translations = peoplesTranslations && peoplesTranslations[currentPeoplesLanguage];
        const errorMsg = (translations && translations.notifications?.telegramFailed) 
            || '❌ Failed to open Telegram profile';
        showNotification(errorMsg, 'error');
    }
}

function openDiscordProfile(discordTag) {
    if (!discordTag) {
        const translations = peoplesTranslations && peoplesTranslations[currentPeoplesLanguage];
        const errorMsg = (translations && translations.notifications?.discordNotAvailable) 
            || '❌ Discord profile not available';
        showNotification(errorMsg, 'error');
        return;
    }

    try {
        // Copy Discord tag to clipboard
        navigator.clipboard.writeText(discordTag).then(() => {
            console.log(`🎮 Discord tag copied to clipboard: ${discordTag}`);
            const translations = peoplesTranslations && peoplesTranslations[currentPeoplesLanguage];
            const copiedMsg = translations && translations.notifications?.discordCopied 
                ? translations.notifications.discordCopied.replace('{tag}', discordTag)
                : `📋 Discord tag copied: ${discordTag}`;
            showNotification(copiedMsg, 'success');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = discordTag;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            const translations = peoplesTranslations && peoplesTranslations[currentPeoplesLanguage];
            const copiedMsg = translations && translations.notifications?.discordCopied 
                ? translations.notifications.discordCopied.replace('{tag}', discordTag)
                : `📋 Discord tag copied: ${discordTag}`;
            showNotification(copiedMsg, 'success');
        });
        
    } catch (error) {
        console.error('❌ Error copying Discord tag:', error);
        
        const translations = peoplesTranslations && peoplesTranslations[currentPeoplesLanguage];
        const errorMsg = (translations && translations.notifications?.discordFailed) 
            || '❌ Failed to copy Discord tag';
        showNotification(errorMsg, 'error');
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.peoples-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `peoples-notification peoples-notification-${type}`;
    notification.textContent = message;

    const peoplesPage = document.getElementById('peoplesPage');
    if (peoplesPage) {
        peoplesPage.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Hide notification after 3 seconds
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

// Add/Remove contributor functionality (for future admin features)
function addContributor(contributorData) {
    contributors.push(contributorData);
    if (peoplesInitialized) {
        // Regenerate the entire page to update stats and contributors
        const translations = peoplesTranslations[currentPeoplesLanguage];
        const peoplesPage = document.getElementById('peoplesPage');
        if (peoplesPage && translations) {
            peoplesPage.innerHTML = generatePeoplesHTML(translations);
            setTimeout(() => {
                filterContributors();
            }, 100);
        }
    }
    console.log('✅ Contributor added:', contributorData.name);
}

function removeContributor(index) {
    if (index >= 0 && index < contributors.length) {
        const removed = contributors.splice(index, 1)[0];
        if (peoplesInitialized) {
            // Regenerate the entire page to update stats and contributors
            const translations = peoplesTranslations[currentPeoplesLanguage];
            const peoplesPage = document.getElementById('peoplesPage');
            if (peoplesPage && translations) {
                peoplesPage.innerHTML = generatePeoplesHTML(translations);
                setTimeout(() => {
                    filterContributors();
                }, 100);
            }
        }
        console.log('✅ Contributor removed:', removed.name);
        return removed;
    }
    return null;
}

// Listen for language change events
document.addEventListener('languageChanged', async (event) => {
    const newLanguage = event.detail.language;
    console.log('🌍 Peoples page received language change:', newLanguage);
    if (peoplesInitialized && peoplesTranslations) {
        await updatePeoplesLanguage(newLanguage);
    }
});

// Auto-initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Only initialize if peoples page is visible
        const peoplesPage = document.getElementById('peoplesPage');
        if (peoplesPage && peoplesPage.classList.contains('active')) {
            initializePeoples();
        }
    });
} else {
    // Page already loaded
    const peoplesPage = document.getElementById('peoplesPage');
    if (peoplesPage && peoplesPage.classList.contains('active')) {
        initializePeoples();
    }
}

// Listen for page changes to initialize when peoples page becomes active
document.addEventListener('pageChanged', (event) => {
    if (event.detail && event.detail.page === 'peoples') {
        if (!peoplesInitialized) {
            initializePeoples();
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
window.addContributor = addContributor;
window.removeContributor = removeContributor;
window.getContributorStats = getContributorStats;
window.showNotification = showNotification;

console.log('✅ peoples.js loaded successfully with dynamic content generation (like help.js)');
