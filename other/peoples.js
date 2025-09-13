// Peoples page functionality with multilingual support
let peoplesInitialized = false;
let currentFilter = 'all'; // 'all', 'admin', 'helper'
let peoplesTranslations = null;
let currentPeoplesLanguage = 'en';

// Load peoples translations
async function loadPeoplesTranslations() {
    if (peoplesTranslations) return peoplesTranslations;
    
    try {
        console.log('📥 Loading peoples translations...');
        const response = await fetch('languages/peoples.json');
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
                filters: { admins: "👑 Admins", helpers: "🤝 Helpers" },
                roles: { admin: "Admin", helper: "Helper" },
                social: { telegram: "📱 Telegram Profile", discord: "🎮 Discord Profile" }
            }
        };
        return peoplesTranslations;
    }
}

// Update peoples page language
async function updatePeoplesLanguage(lang) {
    if (!peoplesTranslations) {
        await loadPeoplesTranslations();
    }
    
    currentPeoplesLanguage = lang;
    
    if (!peoplesTranslations[lang]) {
        console.error(`❌ Peoples language ${lang} not found, defaulting to English`);
        currentPeoplesLanguage = 'en';
    }
    
    const translations = peoplesTranslations[currentPeoplesLanguage];
    if (!translations) return;
    
    // Update page title and description
    const pageTitle = document.querySelector('#peoplesPage .peoples-title');
    const pageSubtitle = document.querySelector('#peoplesPage .peoples-subtitle');
    const pageDescription = document.querySelector('#peoplesPage .peoples-description');
    
    if (pageTitle && translations.title) {
        pageTitle.textContent = translations.title;
    }
    
    if (pageSubtitle && translations.subtitle) {
        pageSubtitle.textContent = translations.subtitle;
    }
    
    if (pageDescription && translations.description) {
        pageDescription.textContent = translations.description;
    }
    
    // Update filter buttons
    updateFilterButtonsText();
    
    // Re-render contributors with new language
    if (peoplesInitialized) {
        renderContributors();
    }
    
    console.log(`✅ Peoples page language updated to: ${currentPeoplesLanguage}`);
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
        name: 'Typka123',
        contribution: 'Gave information',
        role: 'Helper',
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

async function initializePeoples() {
    if (peoplesInitialized) {
        console.log('⚠️ Peoples already initialized');
        return;
    }

    console.log('🙏 Initializing Peoples page with multilingual support...');

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
    
    // Update peoples page language
    await updatePeoplesLanguage(currentAppLanguage);

    createFilterControls();
    renderContributors();
    peoplesInitialized = true;
    console.log('✅ Peoples page initialized successfully with multilingual support');
}

function createFilterControls() {
    const peoplesPage = document.getElementById('peoplesPage');
    const peoplesHeader = peoplesPage.querySelector('.peoples-header');
    
    // Check if filter controls already exist
    if (peoplesPage.querySelector('.filter-controls')) {
        return;
    }

    const filterControls = document.createElement('div');
    filterControls.className = 'filter-controls';
    
    const translations = peoplesTranslations && peoplesTranslations[currentPeoplesLanguage];
    const adminsText = (translations && translations.filters.admins) || '👑 Admins';
    const helpersText = (translations && translations.filters.helpers) || '🤝 Helpers';
    
    filterControls.innerHTML = `
        <button class="filter-btn" data-filter="admin" onclick="setFilter('admin')">
            ${adminsText}
        </button>
        <button class="filter-btn" data-filter="helper" onclick="setFilter('helper')">
            ${helpersText}
        </button>
    `;

    // Insert filter controls after header
    peoplesHeader.insertAdjacentElement('afterend', filterControls);
    
    console.log('✅ Filter controls created with translations');
}

function updateFilterButtonsText() {
    const translations = peoplesTranslations && peoplesTranslations[currentPeoplesLanguage];
    if (!translations) return;
    
    const adminBtn = document.querySelector('[data-filter="admin"]');
    const helperBtn = document.querySelector('[data-filter="helper"]');
    
    if (adminBtn && translations.filters.admins) {
        adminBtn.textContent = translations.filters.admins;
    }
    
    if (helperBtn && translations.filters.helpers) {
        helperBtn.textContent = translations.filters.helpers;
    }
}

function setFilter(filter) {
    if (filter === currentFilter && filter !== 'all') {
        // If clicking the same filter, show all
        currentFilter = 'all';
    } else {
        currentFilter = filter;
    }

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

    // Show count of filtered results with translations
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

function renderContributors() {
    const contributorsContainer = document.querySelector('#peoplesPage .contributors-list');
    if (!contributorsContainer) {
        console.error('❌ Contributors container not found');
        return;
    }

    contributorsContainer.innerHTML = '';

    contributors.forEach((contributor, index) => {
        const contributorCard = createContributorCard(contributor, index);
        contributorsContainer.appendChild(contributorCard);
    });

    // Apply current filter
    filterContributors();
    
    console.log(`✅ Rendered ${contributors.length} contributors with translations`);
}

function createContributorCard(contributor, index) {
    const card = document.createElement('div');
    card.className = 'contributor-card';
    card.setAttribute('data-index', index);
    card.setAttribute('data-role', contributor.role.toLowerCase());

    // Get translations
    const translations = peoplesTranslations && peoplesTranslations[currentPeoplesLanguage];
    
    // Role badge styling and text
    const roleClass = contributor.role === 'Admin' ? 'role-admin' : 'role-helper';
    const roleText = translations && translations.roles 
        ? (contributor.role === 'Admin' ? translations.roles.admin : translations.roles.helper)
        : contributor.role;

    // Generate social buttons only if they exist
    let socialButtons = '';
    if (contributor.telegram) {
        const telegramText = (translations && translations.social.telegram) || '📱 Telegram Profile';
        socialButtons += `
            <button class="social-btn telegram-social" onclick="openTelegramProfile('${contributor.telegram}')">
                ${telegramText}
            </button>
        `;
    }
    if (contributor.discord) {
        const discordText = (translations && translations.social.discord) || '🎮 Discord Profile';
        socialButtons += `
            <button class="social-btn discord-social" onclick="openDiscordProfile('${contributor.discord}')">
                ${discordText}
            </button>
        `;
    }

    card.innerHTML = `
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
    `;

    return card;
}

function openTelegramProfile(telegramHandle) {
    if (!telegramHandle) {
        const translations = peoplesTranslations && peoplesTranslations[currentPeoplesLanguage];
        const errorMsg = (translations && translations.notifications.telegramNotAvailable) 
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
        const successMsg = (translations && translations.notifications.telegramOpening) 
            || '📱 Opening Telegram profile...';
        showNotification(successMsg, 'success');
    } catch (error) {
        console.error('❌ Error opening Telegram profile:', error);
        
        const translations = peoplesTranslations && peoplesTranslations[currentPeoplesLanguage];
        const errorMsg = (translations && translations.notifications.telegramFailed) 
            || '❌ Failed to open Telegram profile';
        showNotification(errorMsg, 'error');
    }
}

function openDiscordProfile(discordTag) {
    if (!discordTag) {
        const translations = peoplesTranslations && peoplesTranslations[currentPeoplesLanguage];
        const errorMsg = (translations && translations.notifications.discordNotAvailable) 
            || '❌ Discord profile not available';
        showNotification(errorMsg, 'error');
        return;
    }

    // Try to open Discord profile URL (works if Discord is installed)
    const discordUrl = `discord://users/${discordTag}`;
    
    try {
        // First try to open Discord app
        window.location.href = discordUrl;
        
        // Show notification that Discord tag is copied as backup
        const translations = peoplesTranslations && peoplesTranslations[currentPeoplesLanguage];
        const openingMsg = translations && translations.notifications.discordOpening 
            ? translations.notifications.discordOpening.replace('{tag}', discordTag)
            : `🎮 Opening Discord... Tag: ${discordTag}`;
        showNotification(openingMsg, 'info');
        
        // Copy Discord tag to clipboard as fallback
        navigator.clipboard.writeText(discordTag).then(() => {
            console.log(`🎮 Discord tag copied to clipboard: ${discordTag}`);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = discordTag;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        });
        
        // If Discord app doesn't open, show fallback message after delay
        setTimeout(() => {
            const copiedMsg = translations && translations.notifications.discordCopied 
                ? translations.notifications.discordCopied.replace('{tag}', discordTag)
                : `📋 Discord tag copied: ${discordTag}`;
            showNotification(copiedMsg, 'success');
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error opening Discord profile:', error);
        
        const translations = peoplesTranslations && peoplesTranslations[currentPeoplesLanguage];
        const fallbackMsg = translations && translations.notifications.discordCopied 
            ? translations.notifications.discordCopied.replace('{tag}', discordTag)
            : `📋 Discord: ${discordTag} (copied to clipboard)`;
        showNotification(fallbackMsg, 'info');
        
        // Copy to clipboard as fallback
        try {
            navigator.clipboard.writeText(discordTag);
        } catch (clipboardError) {
            console.error('❌ Error copying to clipboard:', clipboardError);
        }
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add contributor functionality (for future admin features)
function addContributor(contributorData) {
    contributors.push(contributorData);
    if (peoplesInitialized) {
        renderContributors();
    }
    console.log('✅ Contributor added:', contributorData.name);
}

// Remove contributor functionality (for future admin features)
function removeContributor(index) {
    if (index >= 0 && index < contributors.length) {
        const removed = contributors.splice(index, 1)[0];
        if (peoplesInitialized) {
            renderContributors();
        }
        console.log('✅ Contributor removed:', removed.name);
        return removed;
    }
    return null;
}

// Statistics
function getContributorStats() {
    const stats = {
        total: contributors.length,
        admins: contributors.filter(c => c.role === 'Admin').length,
        helpers: contributors.filter(c => c.role === 'Helper').length,
        withTelegram: contributors.filter(c => c.telegram).length,
        withDiscord: contributors.filter(c => c.discord).length
    };

    console.log('📊 Contributor Stats:', stats);
    return stats;
}

// Listen for language change events
document.addEventListener('languageChanged', async (event) => {
    const newLanguage = event.detail.language;
    console.log('🌍 Peoples page received language change:', newLanguage);
    await updatePeoplesLanguage(newLanguage);
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

console.log('✅ peoples.js loaded successfully with multilingual support');
