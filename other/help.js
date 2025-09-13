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
    
    currentHelpLanguage = lang;
    
    if (!helpTranslations[lang]) {
        console.error(`❌ Help language ${lang} not found, defaulting to English`);
        currentHelpLanguage = 'en';
    }
    
    const translations = helpTranslations[currentHelpLanguage];
    if (!translations) return;
    
    // Update page title and subtitle
    const pageTitle = document.querySelector('#helpPage .help-title');
    const pageSubtitle = document.querySelector('#helpPage .help-subtitle');
    
    if (pageTitle && translations.title) {
        pageTitle.textContent = translations.title;
    }
    
    if (pageSubtitle && translations.subtitle) {
        pageSubtitle.textContent = translations.subtitle;
    }
    
    // Update admin section
    updateAdminSection(translations);
    
    // Update info request section
    updateInfoRequestSection(translations);
    
    // Update recruitment section
    updateRecruitmentSection(translations);
    
    // Update quick actions
    updateQuickActions(translations);
    
    console.log(`✅ Help page language updated to: ${currentHelpLanguage}`);
}

function updateAdminSection(translations) {
    if (!translations.admin) return;
    
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
    
    const infoTitle = document.querySelector('.info-request-header h3');
    const infoSubtitle = document.querySelector('.info-request-subtitle');
    
    if (infoTitle && translations.infoRequest.title) {
        infoTitle.textContent = translations.infoRequest.title;
    }
    
    if (infoSubtitle && translations.infoRequest.subtitle) {
        infoSubtitle.textContent = translations.infoRequest.subtitle;
    }
    
    // Update info items
    if (translations.infoRequest.items) {
        const infoItems = document.querySelectorAll('.info-text');
        translations.infoRequest.items.forEach((item, index) => {
            if (infoItems[index]) {
                // Extract emoji and text
                const parts = item.split(' ');
                const emoji = parts[0];
                const text = parts.slice(1).join(' ');
                
                // Update icon and text separately
                const infoItem = infoItems[index].closest('.info-item');
                const infoIcon = infoItem.querySelector('.info-icon');
                
                if (infoIcon) infoIcon.textContent = emoji;
                infoItems[index].textContent = text;
            }
        });
    }
}

function updateRecruitmentSection(translations) {
    if (!translations.recruitment) return;
    
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
    
    if (requirementsTitle && translations.recruitment.requirements.title) {
        requirementsTitle.textContent = translations.recruitment.requirements.title;
    }
    
    if (recruitmentNote && translations.recruitment.note) {
        recruitmentNote.textContent = translations.recruitment.note;
    }
    
    // Update requirements list
    if (translations.recruitment.requirements.items) {
        const requirementItems = document.querySelectorAll('.requirements-list li');
        translations.recruitment.requirements.items.forEach((item, index) => {
            if (requirementItems[index]) {
                requirementItems[index].textContent = item;
            }
        });
    }
}

function updateQuickActions(translations) {
    if (!translations.quickActions) return;
    
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    
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
    
    // Update help page language
    await updateHelpLanguage(currentAppLanguage);

    helpInitialized = true;
    console.log('✅ Help page initialized successfully with multilingual support');
}

// Admin contact functions
function openAdminTelegram() {
    const telegramHandle = 'privatefanat_dep';
    const url = `https://t.me/${telegramHandle}`;
    
    try {
        window.open(url, '_blank', 'noopener,noreferrer');
        console.log(`📱 Opening admin Telegram: ${url}`);
        
        const translations = helpTranslations && helpTranslations[currentHelpLanguage];
        const successMsg = (translations && translations.notifications.telegramOpening) 
            || '📱 Opening Telegram...';
        showHelpNotification(successMsg, 'success');
    } catch (error) {
        console.error('❌ Error opening Telegram:', error);
        
        const translations = helpTranslations && helpTranslations[currentHelpLanguage];
        const errorMsg = (translations && translations.notifications.telegramFailed) 
            || '❌ Failed to open Telegram';
        showHelpNotification(errorMsg, 'error');
    }
}

function openAdminDiscord() {
    const discordTag = 'trader_aws';
    const discordUrl = `discord://users/${discordTag}`;
    
    try {
        // Try to open Discord app
        window.location.href = discordUrl;
        
        const translations = helpTranslations && helpTranslations[currentHelpLanguage];
        const openingMsg = translations && translations.notifications.discordOpening 
            ? translations.notifications.discordOpening.replace('{tag}', discordTag)
            : `🎮 Opening Discord... Tag: ${discordTag}`;
        showHelpNotification(openingMsg, 'info');
        
        // Copy Discord tag to clipboard as backup
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
        
        // Show fallback message after delay
        setTimeout(() => {
            const copiedMsg = translations && translations.notifications.discordCopied 
                ? translations.notifications.discordCopied.replace('{tag}', discordTag)
                : `📋 Discord tag copied: ${discordTag}`;
            showHelpNotification(copiedMsg, 'success');
        }, 2000);
        
    } catch (error) {
        console.error('❌ Error opening Discord:', error);
        
        const translations = helpTranslations && helpTranslations[currentHelpLanguage];
        const fallbackMsg = translations && translations.notifications.discordCopied 
            ? translations.notifications.discordCopied.replace('{tag}', discordTag)
            : `📋 Discord: ${discordTag} (copied to clipboard)`;
        showHelpNotification(fallbackMsg, 'info');
        
        // Copy to clipboard as fallback
        try {
            navigator.clipboard.writeText(discordTag);
        } catch (clipboardError) {
            console.error('❌ Error copying to clipboard:', clipboardError);
        }
    }
}

// Scroll to admin contact section - ДОДАНА ВІДСУТНЯ ФУНКЦІЯ
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
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Update modal text with translations
        const translations = helpTranslations && helpTranslations[currentHelpLanguage];
        if (translations && translations.modal && translations.modal.feedback) {
            const modalTitle = modal.querySelector('.feedback-header h3');
            const modalText = modal.querySelector('.feedback-body p');
            const modalTelegramBtn = modal.querySelector('.feedback-actions .telegram-btn');
            const modalDiscordBtn = modal.querySelector('.feedback-actions .discord-btn');
            
            if (modalTitle) modalTitle.textContent = translations.modal.feedback.title;
            if (modalText) modalText.textContent = translations.modal.feedback.text;
            if (modalTelegramBtn) modalTelegramBtn.textContent = translations.modal.feedback.telegram;
            if (modalDiscordBtn) modalDiscordBtn.textContent = translations.modal.feedback.discord;
        }
    } else {
        // Fallback - scroll to admin contact if modal doesn't exist
        scrollToAdminContact();
    }
}

function showBugReport() {
    const translations = helpTranslations && helpTranslations[currentHelpLanguage];
    const bugMsg = (translations && translations.notifications.bugReport) 
        || '🐛 Please contact the admin via Telegram or Discord to report bugs';
    showHelpNotification(bugMsg, 'info');
    setTimeout(() => {
        scrollToAdminContact();
    }, 1000);
}

function showFeatureRequest() {
    const translations = helpTranslations && helpTranslations[currentHelpLanguage];
    const featureMsg = (translations && translations.notifications.featureRequest) 
        || '⭐ Please contact the admin via Telegram or Discord to request features';
    showHelpNotification(featureMsg, 'info');
    setTimeout(() => {
        scrollToAdminContact();
    }, 1000);
}

function closeFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Click outside modal to close
document.addEventListener('click', (e) => {
    const modal = document.getElementById('feedbackModal');
    if (modal && e.target === modal) {
        closeFeedbackModal();
    }
});

// ESC key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeFeedbackModal();
    }
});

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

        // Hide notification after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
}

// Listen for language change events
document.addEventListener('languageChanged', async (event) => {
    const newLanguage = event.detail.language;
    console.log('🌍 Help page received language change:', newLanguage);
    await updateHelpLanguage(newLanguage);
});

// Make functions globally available
window.initializeHelp = initializeHelp;
window.updateHelpLanguage = updateHelpLanguage;
window.loadHelpTranslations = loadHelpTranslations;
window.openAdminTelegram = openAdminTelegram;
window.openAdminDiscord = openAdminDiscord;
window.scrollToAdminContact = scrollToAdminContact; // ВИПРАВЛЕНО: функція тепер існує
window.showFeedbackForm = showFeedbackForm;
window.showBugReport = showBugReport;
window.showFeatureRequest = showFeatureRequest;
window.closeFeedbackModal = closeFeedbackModal;
window.showHelpNotification = showHelpNotification;

console.log('✅ help.js loaded successfully with multilingual support');
