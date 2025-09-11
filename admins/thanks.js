// Thanks page functionality
let thanksInitialized = false;

// Contributors data
const contributors = [
    {
        name: 'privatefanat_dep',
        contribution: 'Project Creator & Main Developer',
        role: 'Admin',
        telegram: '@privatefanat_dep',
        discord: null
    },
    {
        name: 'TestUser1',
        contribution: 'UI/UX Design & Testing',
        role: 'Helper',
        telegram: '@testuser1',
        discord: 'TestUser1#1234'
    },
    {
        name: 'TestUser2',
        contribution: 'Data Collection & Bug Reports',
        role: 'Helper',
        telegram: '@testuser2',
        discord: null
    },
    {
        name: 'TestUser3',
        contribution: 'Translation & Localization',
        role: 'Helper',
        telegram: null,
        discord: 'TestUser3#5678'
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

    renderContributors();
    thanksInitialized = true;
    console.log('✅ Thanks page initialized successfully');
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

    console.log(`✅ Rendered ${contributors.length} contributors`);
}

function createContributorCard(contributor, index) {
    const card = document.createElement('div');
    card.className = 'contributor-card';
    card.setAttribute('data-index', index);

    // Role badge styling
    const roleClass = contributor.role === 'Admin' ? 'role-admin' : 'role-helper';
    const roleColor = contributor.role === 'Admin' ? '#ff6b6b' : '#4ecdc4';

    card.innerHTML = `
        <div class="contributor-main">
            <div class="contributor-info">
                <div class="contributor-name">${escapeHtml(contributor.name)}</div>
                <div class="contributor-contribution">${escapeHtml(contributor.contribution)}</div>
            </div>
            <div class="contributor-actions">
                <div class="role-badge ${roleClass}">${contributor.role}</div>
                <button class="action-btn telegram-btn" onclick="openTelegramProfile('${contributor.telegram || ''}')">
                    📱 View Telegram
                </button>
            </div>
        </div>
        <div class="contributor-social">
            ${contributor.telegram ? `
                <button class="social-btn telegram-social" onclick="openTelegramProfile('${contributor.telegram}')">
                    📱 Telegram Profile
                </button>
            ` : ''}
            ${contributor.discord ? `
                <button class="social-btn discord-social" onclick="openDiscordProfile('${contributor.discord}')">
                    🎮 Discord Profile
                </button>
            ` : ''}
        </div>
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

    // Since Discord doesn't have direct profile URLs, we'll show a notification
    showNotification(`📋 Discord: ${discordTag} (copied to clipboard)`, 'info');
    
    // Copy Discord tag to clipboard
    try {
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
    } catch (error) {
        console.error('❌ Error copying Discord tag:', error);
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
window.openTelegramProfile = openTelegramProfile;
window.openDiscordProfile = openDiscordProfile;
window.addContributor = addContributor;
window.removeContributor = removeContributor;
window.getContributorStats = getContributorStats;

console.log('✅ thanks.js loaded successfully');
