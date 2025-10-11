// Help page functionality - Fixed Paths
let helpInitialized = false;
let helpTranslations = null;
let currentHelpLanguage = 'en';

// Get Base Path for Module
function getHelpBasePath() {
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

const HELP_BASE_PATH = getHelpBasePath();

// Load help translations
async function loadHelpTranslations() {
    if (helpTranslations) return helpTranslations;
    
    try {
        const jsonPath = `${HELP_BASE_PATH}system/moderation/help.json`;
        console.log('📥 Loading help translations from:', jsonPath);
        
        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        helpTranslations = await response.json();
        console.log('✅ Help translations loaded successfully');
        return helpTranslations;
    } catch (error) {
        console.error('❌ Error loading help translations:', error);
        helpTranslations = null;
        return null;
    }
}

// Generate help page HTML content
function generateHelpHTML(translations) {
    if (!translations) {
        return '<div style="padding: 40px; text-align: center; color: #666;">Loading help page...</div>';
    }

    return `
        <div class="help-header">
            <h1 class="help-title">${translations.title || '🆘 Help & Support'}</h1>
            <p class="help-subtitle">${translations.subtitle || 'Need assistance? Contact our team!'}</p>
        </div>

        <!-- Admin Contact Section -->
        <div class="admin-contact-section">
            <div class="admin-card">
                <div class="admin-info">
                    <div class="admin-avatar">👨‍💻</div>
                    <div class="admin-details">
                        <div class="admin-name">${translations.admin?.name || 'Mr dep Dodep'}</div>
                        <div class="admin-role">${translations.admin?.role || 'Project Creator & Developer'}</div>
                        <div class="admin-status">${translations.admin?.status || '🟢 Active'}</div>
                    </div>
                </div>
                <div class="admin-contact">
                    <button class="contact-btn telegram-btn" onclick="openAdminTelegram()">
                        ${translations.admin?.telegram || '📱 Contact on Telegram'}
                    </button>
                    <button class="contact-btn discord-btn" onclick="openAdminDiscord()">
                        ${translations.admin?.discord || '🎮 Contact on Discord'}
                    </button>
                </div>
            </div>
        </div>

        <!-- Information Request Section -->
        <div class="info-request-section">
            <div class="info-request-card">
                <div class="info-request-header">
                    <h3>${translations.infoRequest?.title || '📋 Information Needed'}</h3>
                    <p class="info-request-subtitle">${translations.infoRequest?.subtitle || 'Write to me if you have this information:'}</p>
                </div>
                <div class="info-request-list">
                    ${generateInfoRequestItems(translations.infoRequest?.items)}
                </div>
            </div>
        </div>

        <!-- Recruitment Section -->
        <div class="recruitment-section">
            <div class="recruitment-card">
                <div class="recruitment-header">
                    <h3>${translations.recruitment?.title || '👥 Developer & Tester Recruitment'}</h3>
                    <div class="recruitment-status open">
                        <span class="status-indicator">🟢</span>
                        <span class="status-text">${translations.recruitment?.status?.replace('🔒 ', '🟢 ').replace('Currently Closed', 'Currently Open') || '🟢 Currently Open'}</span>
                    </div>
                </div>
                <div class="recruitment-content">
                    <p class="recruitment-description">
                        ${translations.recruitment?.description?.replace('Currently, recruitment is closed', 'Currently, recruitment is open').replace('when new positions become available', 'for new team members') || 'We are actively looking for talented developers and dedicated testers to join our team. Currently, recruitment is open for new team members.'}
                    </p>
                    <div class="recruitment-requirements">
                        <h4>${translations.recruitment?.requirements?.title || 'What we\'re looking for:'}</h4>
                        <ul class="requirements-list">
                            ${generateRequirementsList(translations.recruitment?.requirements?.items)}
                        </ul>
                    </div>
                    <div class="recruitment-note">
                        <p>${translations.recruitment?.note?.replace('for recruitment announcements', 'to apply for positions') || 'Contact admin to apply for available positions!'}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
            <button class="quick-action-btn" onclick="scrollToAdminContact()">
                ${translations.quickActions?.feedback || '💭 Send Feedback'}
            </button>
            <button class="quick-action-btn" onclick="scrollToAdminContact()">
                ${translations.quickActions?.bug || '🐛 Report Bug'}
            </button>
            <button class="quick-action-btn" onclick="scrollToAdminContact()">
                ${translations.quickActions?.feature || '⭐ Request Feature'}
            </button>
        </div>
    `;
}

function generateInfoRequestItems(items) {
    const defaultItems = [
        '🚀 New boost information',
        '🔮 Secret pets data', 
        '🎁 New codes and promotions',
        '🧪 Potion effects and recipes',
        '💎 Game mechanics and formulas'
    ];
    
    const itemsToUse = items || defaultItems;
    
    return itemsToUse.map(item => {
        const parts = item.split(' ');
        const emoji = parts[0];
        const text = parts.slice(1).join(' ');
        
        return `
            <div class="info-item">
                <span class="info-icon">${emoji}</span>
                <span class="info-text">${text}</span>
            </div>
        `;
    }).join('');
}

function generateRequirementsList(items) {
    const defaultItems = [
        '🔧 CSS developers',
        '🎮 Game testers and QA specialists',
        '🎨 UI/UX designers'
    ];
    
    const itemsToUse = items || defaultItems;
    
    return itemsToUse.map(item => `<li>${item}</li>`).join('');
}

// Update help page language
async function updateHelpLanguage(lang) {
    console.log('🌍 Updating help language to:', lang);
    
    if (!helpTranslations) {
        await loadHelpTranslations();
    }
    
    if (!helpTranslations) {
        console.error('❌ Help translations not available');
        return;
    }
    
    currentHelpLanguage = lang;
    
    if (!helpTranslations[lang]) {
        console.warn(`⚠️ Language ${lang} not found, using English`);
        currentHelpLanguage = 'en';
    }
    
    // Regenerate content with new language
    const helpPage = document.getElementById('helpPage');
    if (helpPage) {
        const translations = helpTranslations[currentHelpLanguage];
        helpPage.innerHTML = generateHelpHTML(translations);
        console.log('✅ Help page language updated');
    }
}

async function initializeHelp() {
    if (helpInitialized) {
        console.log('⚠️ Help already initialized');
        return;
    }

    console.log('🆘 Initializing Help page...');

    const helpPage = document.getElementById('helpPage');
    if (!helpPage) {
        console.error('❌ Help page element not found');
        return;
    }

    // Load translations
    await loadHelpTranslations();
    
    // Get current app language
    const currentAppLanguage = (typeof getCurrentAppLanguage === 'function') 
        ? getCurrentAppLanguage() 
        : 'en';
    
    console.log('📖 Current app language:', currentAppLanguage);
    
    // Generate and insert content
    if (helpTranslations) {
        const translations = helpTranslations[currentAppLanguage] || helpTranslations['en'];
        helpPage.innerHTML = generateHelpHTML(translations);
        currentHelpLanguage = currentAppLanguage;
    } else {
        helpPage.innerHTML = generateHelpHTML(null);
    }

    helpInitialized = true;
    console.log('✅ Help page initialized successfully');
}

// Admin contact functions
function openAdminTelegram() {
    const telegramHandle = 'privatefanat_dep';
    const url = `https://t.me/${telegramHandle}`;
    
    try {
        window.open(url, '_blank', 'noopener,noreferrer');
        console.log(`📱 Opening admin Telegram: ${url}`);
        showHelpNotification('📱 Opening Telegram...', 'success');
    } catch (error) {
        console.error('❌ Error opening Telegram:', error);
        showHelpNotification('❌ Failed to open Telegram', 'error');
    }
}

function openAdminDiscord() {
    const discordTag = 'trader_aws';
    
    try {
        navigator.clipboard.writeText(discordTag).then(() => {
            console.log(`🎮 Discord tag copied to clipboard: ${discordTag}`);
            showHelpNotification(`📋 Discord tag copied: ${discordTag}`, 'success');
        }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = discordTag;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showHelpNotification(`📋 Discord tag copied: ${discordTag}`, 'success');
        });
        
    } catch (error) {
        console.error('❌ Error copying Discord tag:', error);
        showHelpNotification('❌ Failed to copy Discord tag', 'error');
    }
}

// Scroll to admin contact section
function scrollToAdminContact() {
    const adminSection = document.querySelector('.admin-contact-section');
    if (adminSection) {
        adminSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        const adminCard = adminSection.querySelector('.admin-card');
        if (adminCard) {
            adminCard.style.animation = 'highlightPulse 2s ease-in-out';
            setTimeout(() => {
                adminCard.style.animation = '';
            }, 2000);
        }
    }
}

function showHelpNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.help-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `help-notification help-notification-${type}`;
    notification.textContent = message;

    const helpPage = document.getElementById('helpPage');
    if (helpPage) {
        helpPage.appendChild(notification);

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

// Listen for language change events
document.addEventListener('languageChanged', async (event) => {
    const newLanguage = event.detail.language;
    console.log('🌍 Help page received language change:', newLanguage);
    if (helpInitialized && helpTranslations) {
        await updateHelpLanguage(newLanguage);
    }
});

// Listen for page changes
document.addEventListener('pageChanged', (event) => {
    if (event.detail && event.detail.page === 'help') {
        if (!helpInitialized) {
            setTimeout(() => initializeHelp(), 100);
        }
    }
});

// Make functions globally available
window.initializeHelp = initializeHelp;
window.updateHelpLanguage = updateHelpLanguage;
window.loadHelpTranslations = loadHelpTranslations;
window.openAdminTelegram = openAdminTelegram;
window.openAdminDiscord = openAdminDiscord;
window.scrollToAdminContact = scrollToAdminContact;
window.showHelpNotification = showHelpNotification;

console.log('✅ help.js loaded successfully (Fixed Paths)');
console.log('📍 Base path:', HELP_BASE_PATH);
