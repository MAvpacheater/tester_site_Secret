// Help page functionality with multilingual support
let helpInitialized = false;
let helpTranslations = null;
let currentHelpLanguage = 'en';

// Load help translations
async function loadHelpTranslations() {
    if (helpTranslations) return helpTranslations;
    
    try {
        console.log('📥 Loading help translations...');
        const response = await fetch('languages/help.json');
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

// Update help page language
async function updateHelpLanguage(lang) {
    if (!helpTranslations) {
        await loadHelpTranslations();
    }
    
    if (!helpTranslations) {
        console.error('❌ Help translations not available');
        return;
    }
    
    currentHelpLanguage = lang;
    
    if (!helpTranslations[lang]) {
        console.error(`❌ Help language ${lang} not found, defaulting to English`);
        currentHelpLanguage = 'en';
    }
    
    const translations = helpTranslations[currentHelpLanguage];
    if (!translations) return;
    
    // Update ONLY existing elements, don't create new ones or add text where it shouldn't be
    const pageTitle = document.querySelector('#helpPage .help-title');
    const pageSubtitle = document.querySelector('#helpPage .help-subtitle');
    
    if (pageTitle && translations.title) {
        pageTitle.textContent = translations.title;
    }
    
    if (pageSubtitle && translations.subtitle) {
        pageSubtitle.textContent = translations.subtitle;
    }
    
    // Only update sections that actually exist in the HTML
    updateAdminSection(translations);
    updateInfoRequestSection(translations);
    updateRecruitmentSection(translations);
    updateQuickActions(translations);
    
    console.log(`✅ Help page language updated to: ${currentHelpLanguage}`);
}

function updateAdminSection(translations) {
    if (!translations.admin) return;
    
    // Only update elements that exist in the DOM
    const adminName = document.querySelector('.admin-name');
    const adminRole = document.querySelector('.admin-role');
    const adminStatus = document.querySelector('.admin-status');
    const telegramBtn = document.querySelector('.admin-contact .telegram-btn');
    const discordBtn = document.querySelector('.admin-contact .discord-btn');
    
    if (adminName && translations.admin.name) {
        adminName.textContent = translations.admin.name;
    }
    
    if (adminRole && translations.admin.role) {
        adminRole.textContent = translations.admin.role;
    }
    
    if (adminStatus && translations.admin.status) {
        adminStatus.textContent = translations.admin.status;
    }
    
    if (telegramBtn && translations.admin.telegram) {
        telegramBtn.textContent = translations.admin.telegram;
    }
    
    if (discordBtn && translations.admin.discord) {
        discordBtn.textContent = translations.admin.discord;
    }
}

function updateInfoRequestSection(translations) {
    if (!translations.infoRequest) return;
    
    // Only update if these elements exist in the current HTML structure
    const infoTitle = document.querySelector('.info-request-header h3');
    const infoSubtitle = document.querySelector('.info-request-subtitle');
    
    if (infoTitle && translations.infoRequest.title) {
        infoTitle.textContent = translations.infoRequest.title;
    }
    
    if (infoSubtitle && translations.infoRequest.subtitle) {
        infoSubtitle.textContent = translations.infoRequest.subtitle;
    }
    
    // Update info items ONLY if they exist in the DOM
    if (translations.infoRequest.items) {
        const infoItems = document.querySelectorAll('.info-text');
        if (infoItems.length > 0) {
            translations.infoRequest.items.forEach((item, index) => {
                if (infoItems[index]) {
                    // Extract emoji and text
                    const parts = item.split(' ');
                    const emoji = parts[0];
                    const text = parts.slice(1).join(' ');
                    
                    // Update icon and text separately
                    const infoItem = infoItems[index].closest('.info-item');
                    if (infoItem) {
                        const infoIcon = infoItem.querySelector('.info-icon');
                        
                        if (infoIcon) infoIcon.textContent = emoji;
                        infoItems[index].textContent = text;
                    }
                }
            });
        }
    }
}

function updateRecruitmentSection(translations) {
    if (!translations.recruitment) return;
    
    // Only update elements that actually exist
    const recruitmentTitle = document.querySelector('.recruitment-header h3');
    const recruitmentStatus = document.querySelector('.status-text');
    const recruitmentDescription = document.querySelector('.recruitment-description');
    const requirementsTitle = document.querySelector('.recruitment-requirements h4');
    const recruitmentNote = document.querySelector('.recruitment-note p');
    
    if (recruitmentTitle && translations.recruitment.title) {
        recruitmentTitle.textContent = translations.recruitment.title;
    }
    
    if (recruitmentStatus && translations.recruitment.status) {
        recruitmentStatus.textContent = translations.recruitment.status.replace('🔒 ', '');
    }
    
    if (recruitmentDescription && translations.recruitment.description) {
        recruitmentDescription.textContent = translations.recruitment.description;
    }
    
    if (requirementsTitle && translations.recruitment.requirements && translations.recruitment.requirements.title) {
        requirementsTitle.textContent = translations.recruitment.requirements.title;
    }
    
    if (recruitmentNote && translations.recruitment.note) {
        recruitmentNote.textContent = translations.recruitment.note;
    }
    
    // Update requirements list ONLY if it exists
    const requirementsList = document.querySelector('.requirements-list');
    if (requirementsList && translations.recruitment.requirements && translations.recruitment.requirements.items) {
        requirementsList.innerHTML = '';
        
        // Create new items from translations
        translations.recruitment.requirements.items.forEach((item) => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            requirementsList.appendChild(listItem);
        });
    }
}

function updateQuickActions(translations) {
    if (!translations.quickActions) return;
    
    // Only update if quick action buttons exist
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    
    if (quickActionBtns.length > 0) {
        if (quickActionBtns[0] && translations.quickActions.feedback) {
            quickActionBtns[0].textContent = translations.quickActions.feedback;
        }
        
        if (quickActionBtns[1] && translations.quickActions.bug) {
            quickActionBtns[1].textContent = translations.quickActions.bug;
        }
        
        if (quickActionBtns[2] && translations.quickActions.feature) {
            quickActionBtns[2].textContent = translations.quickActions.feature;
        }
    }
}

async function initializeHelp() {
    if (helpInitialized) {
        console.log('⚠️ Help already initialized');
        return;
    }

    console.log('🆘 Initializing Help page with multilingual support...');

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
    
    // Update help page language ONLY if translations loaded successfully
    if (helpTranslations) {
        await updateHelpLanguage(currentAppLanguage);
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
        // Copy Discord tag to clipboard
        navigator.clipboard.writeText(discordTag).then(() => {
            console.log(`🎮 Discord tag copied to clipboard: ${discordTag}`);
            showHelpNotification(`📋 Discord tag copied: ${discordTag}`, 'success');
        }).catch(() => {
            // Fallback for older browsers
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
        
        // Add highlight animation
        const adminCard = adminSection.querySelector('.admin-card');
        if (adminCard) {
            adminCard.style.animation = 'highlightPulse 2s ease-in-out';
            setTimeout(() => {
                adminCard.style.animation = '';
            }, 2000);
        }
    }
}

// Quick action functions
function showFeedbackForm() {
    // Scroll to admin contact instead of showing modal
    scrollToAdminContact();
    showHelpNotification('💭 Contact admin via Telegram or Discord', 'info');
}

function showBugReport() {
    scrollToAdminContact();
    showHelpNotification('🐛 Contact admin to report bugs', 'info');
}

function showFeatureRequest() {
    scrollToAdminContact();
    showHelpNotification('⭐ Contact admin to request features', 'info');
}

function showHelpNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.help-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `help-notification help-notification-${type}`;
    notification.textContent = message;

    const helpPage = document.getElementById('helpPage');
    if (helpPage) {
        helpPage.appendChild(notification);

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

// Listen for language change events
document.addEventListener('languageChanged', async (event) => {
    const newLanguage = event.detail.language;
    console.log('🌍 Help page received language change:', newLanguage);
    if (helpTranslations) {
        await updateHelpLanguage(newLanguage);
    }
});

// Make functions globally available
window.initializeHelp = initializeHelp;
window.updateHelpLanguage = updateHelpLanguage;
window.loadHelpTranslations = loadHelpTranslations;
window.openAdminTelegram = openAdminTelegram;
window.openAdminDiscord = openAdminDiscord;
window.scrollToAdminContact = scrollToAdminContact;
window.showFeedbackForm = showFeedbackForm;
window.showBugReport = showBugReport;
window.showFeatureRequest = showFeatureRequest;
window.showHelpNotification = showHelpNotification;

console.log('✅ help.js loaded successfully with multilingual support');
