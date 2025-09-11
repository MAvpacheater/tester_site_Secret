// Thanks page functionality
let thanksInitialized = false;
let currentFilter = 'all'; // 'all', 'admin', 'helper'

// Contributors data
const contributors = [
    {
        name: 'Xlestay',
        contribution: 'Gave information/Helped with logic, Top 2 trader',
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

function initializeThanks() {
    if (thanksInitialized) {
        console.log('⚠️ Thanks already initialized');
        return;
    }

    console.log('🙏 Initializing Thanks page...');

    const thanksPage = document.getElementById('thanksPage');
    if (!thanksPage) {
        console.error('❌ Thanks page element not found');
        return;
    }

    createFilterControls();
    renderContributors();
    thanksInitialized = true;
    console.log('✅ Thanks page initialized successfully');
}

function createFilterControls() {
    const thanksPage = document.getElementById('thanksPage');
    const thanksHeader = thanksPage.querySelector('.thanks-header');
    
    // Check if filter controls already exist
    if (thanksPage.querySelector('.filter-controls')) {
        return;
    }

    const filterControls = document.createElement('div');
    filterControls.className = 'filter-controls';
    filterControls.innerHTML = `
        <button class="filter-btn" data-filter="admin" onclick="setFilter('admin')">
            👑 Admins
        </button>
        <button class="filter-btn" data-filter="helper" onclick="setFilter('helper')">
            🤝 Helpers
        </button>
    `;

    // Insert filter controls after header
    thanksHeader.insertAdjacentElement('afterend', filterControls);
    
    console.log('✅ Filter controls created');
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

    // Show count of filtered results
    const visibleCount = document.querySelectorAll('.contributor-card:not(.hidden)').length;
    let filterMessage = '';
    
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
    
    console.log(`📊 ${filterMessage}`);
    
    // Optional: Show notification about filter
    if (currentFilter !== 'all') {
        showNotification(`🔍 ${filterMessage}`, 'info');
    }
}

function renderContributors() {
    const contributorsContainer = document.querySelector('#thanksPage .contributors-list');
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
    
    console.log(`✅ Rendered ${contributors.length} contributors`);
}

function createContributorCard(contributor, index) {
    const card = document.createElement('div');
    card.className = 'contributor-card';
    card.setAttribute('data-index', index);
    card.setAttribute('data-role', contributor.role.toLowerCase());

    // Role badge styling
    const roleClass = contributor.role === 'Admin' ? 'role-admin' : 'role-helper';

    // Generate social buttons only if they exist
    let socialButtons = '';
    if (contributor.telegram) {
        socialButtons += `
            <button class="social-btn telegram-social" onclick="openTelegramProfile('${contributor.telegram}')">
                📱 Telegram Profile
            </button>
        `;
    }
    if (contributor.discord) {
        socialButtons += `
            <button class="social-btn discord-social" onclick="openDiscordProfile('${contributor.discord}')">
                🎮 Discord Profile
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
                <div class="role-badge ${roleClass}">${contributor.role}</div>
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

    // Try to open Discord profile URL (works if Discord is installed)
    const discordUrl = `discord://users/${discordTag}`;
    
    try {
        // First try to open Discord app
        window.location.href = discordUrl;
        
        // Show notification that Discord tag is copied as backup
        showNotification(`🎮 Opening Discord... Tag: ${discordTag}`, 'info');
        
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
            showNotification(`📋 Discord tag copied: ${discordTag}`, 'success');
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error opening Discord profile:', error);
        showNotification(`📋 Discord: ${discordTag} (copied to clipboard)`, 'info');
        
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
    const existingNotifications = document.querySelectorAll('.thanks-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `thanks-notification thanks-notification-${type}`;
    notification.textContent = message;

    const thanksPage = document.getElementById('thanksPage');
    if (thanksPage) {
        thanksPage.appendChild(notification);

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
    if (thanksInitialized) {
        renderContributors();
    }
    console.log('✅ Contributor added:', contributorData.name);
}

// Remove contributor functionality (for future admin features)
function removeContributor(index) {
    if (index >= 0 && index < contributors.length) {
        const removed = contributors.splice(index, 1)[0];
        if (thanksInitialized) {
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

// Make functions globally available
window.initializeThanks = initializeThanks;
window.setFilter = setFilter;
window.openTelegramProfile = openTelegramProfile;
window.openDiscordProfile = openDiscordProfile;
window.addContributor = addContributor;
window.removeContributor = removeContributor;
window.getContributorStats = getContributorStats;

console.log('✅ thanks.js loaded successfully');
