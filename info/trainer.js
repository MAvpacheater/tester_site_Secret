// Trainer functionality with multilingual support

let trainerCurrentLanguage = 'en';
let trainerTranslations = null;
let trainerInitialized = false;
let currentTrainerType = 'free';

// Get language from localStorage
function getCurrentLanguage() {
    return localStorage.getItem('armHelper_language') || 'en';
}

// Load translations from external file
async function loadTrainerTranslations() {
    if (trainerTranslations) return trainerTranslations;
    
    try {
        const response = await fetch('languages/trainers.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        trainerTranslations = await response.json();
        console.log('✅ Trainer translations loaded');
    } catch (error) {
        console.error('❌ Failed to load trainer translations:', error);
        throw error;
    }
    return trainerTranslations;
}

// Update language
function updateTrainerLanguage(newLanguage) {
    console.log(`👨‍🏫 Trainer language: ${trainerCurrentLanguage} → ${newLanguage}`);
    
    if (newLanguage === trainerCurrentLanguage) return;
    trainerCurrentLanguage = newLanguage;
    
    // Update title and button texts
    if (trainerTranslations?.[newLanguage]) {
        const data = trainerTranslations[newLanguage];
        
        // Update title
        const titleElement = document.querySelector('.trainer-page .title');
        if (titleElement) {
            titleElement.textContent = data.title;
        }
        
        // Update switch buttons
        const freeBtn = document.querySelector('[data-type="free"]');
        const donateBtn = document.querySelector('[data-type="donate"]');
        
        if (freeBtn) freeBtn.textContent = data.free_button;
        if (donateBtn) donateBtn.textContent = data.donate_button;
    }
    
    // Regenerate content
    if (trainerInitialized) {
        setTimeout(generateAllTrainerContent, 100);
    }
}

// Switch between trainer types
function switchTrainerType(type) {
    currentTrainerType = type;
    
    // Update button states
    document.querySelectorAll('.trainer-switch-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-type="${type}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Update sections
    document.querySelectorAll('.trainer-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const activeSection = document.getElementById(`${type}Trainers`);
    if (activeSection) {
        activeSection.classList.add('active');
    }
}

// Generate trainer content for a specific type
function generateTrainerContent(type, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.log(`Container ${containerId} not found`);
        return;
    }
    
    if (!trainerTranslations?.[trainerCurrentLanguage]) {
        console.error('No trainer translations available');
        return;
    }
    
    const data = trainerTranslations[trainerCurrentLanguage];
    container.innerHTML = '';
    
    const trainers = data.trainers[type];
    if (!trainers) {
        console.log(`No trainers found for type: ${type}`);
        return;
    }
    
    trainers.forEach((trainer, index) => {
        const trainerItem = document.createElement('div');
        trainerItem.className = 'trainer-item';
        trainerItem.style.animationDelay = `${index * 0.05}s`;
        
        // Generate description with stats
        const description = data.description_template
            .replace('{strength}', trainer.strength)
            .replace('{strengthBoost}', trainer.strengthBoost)
            .replace('{luck}', trainer.luck)
            .replace('{luckBoost}', trainer.luckBoost)
            .replace('{wins}', trainer.wins)
            .replace('{winsBoost}', trainer.winsBoost);
        
        const typeLabel = type === 'free' ? data.free_label : data.donate_label;
        
        trainerItem.innerHTML = `
            <div class="trainer-content">
                <div class="trainer-name">${trainer.name}</div>
                <div class="trainer-description">${description}</div>
            </div>
            <div class="trainer-type ${type}">${typeLabel}</div>
        `;
        container.appendChild(trainerItem);
    });
    
    console.log(`Generated ${trainers.length} trainers for ${type}`);
}

// Generate all trainer content
async function generateAllTrainerContent() {
    console.log('Generating all trainer content...');
    
    trainerCurrentLanguage = getCurrentLanguage();
    
    try {
        if (!trainerTranslations) await loadTrainerTranslations();
        
        generateTrainerContent('free', 'freeTrainers');
        generateTrainerContent('donate', 'donateTrainers');
        
        console.log(`✅ Generated all trainers in ${trainerCurrentLanguage}`);
    } catch (error) {
        console.error('❌ Error generating trainer content:', error);
    }
}

// Initialize trainer functionality
async function initializeTrainer() {
    console.log('👨‍🏫 Initializing trainer...');
    
    const container = document.getElementById('freeTrainers');
    if (trainerInitialized && container?.querySelector('.trainer-item')) {
        console.log('👨‍🏫 Already initialized');
        return;
    }
    
    trainerCurrentLanguage = getCurrentLanguage();
    
    try {
        await loadTrainerTranslations();
        
        // Update UI texts
        const data = trainerTranslations[trainerCurrentLanguage];
        if (data) {
            // Update title
            const titleElement = document.querySelector('.trainer-page .title');
            if (titleElement) {
                titleElement.textContent = data.title;
            }
            
            // Update switch buttons
            const freeBtn = document.querySelector('[data-type="free"]');
            const donateBtn = document.querySelector('[data-type="donate"]');
            
            if (freeBtn) freeBtn.textContent = data.free_button;
            if (donateBtn) donateBtn.textContent = data.donate_button;
        }
        
        await generateAllTrainerContent();
        switchTrainerType('free');
        trainerInitialized = true;
        window.trainerInitialized = true;
        console.log('✅ Trainer initialized');
    } catch (error) {
        console.error('❌ Failed to initialize trainer:', error);
        const container = document.getElementById('freeTrainers');
        if (container) {
            container.innerHTML = `
                <div class="trainer-error">
                    ⚠️ Failed to load trainer data<br>
                    <button class="retry-btn" onclick="initializeTrainer()">Retry</button>
                </div>
            `;
        }
    }
}

// Event listeners
document.addEventListener('languageChanged', (e) => {
    if (e.detail?.language) updateTrainerLanguage(e.detail.language);
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const page = document.getElementById('trainerPage');
        if (page?.classList.contains('active')) initializeTrainer();
    }, 100);
});

document.addEventListener('click', (e) => {
    if (e.target?.getAttribute('data-page') === 'trainer') {
        setTimeout(() => {
            const container = document.getElementById('freeTrainers');
            if (!trainerInitialized || !container?.querySelector('.trainer-item')) {
                initializeTrainer();
            }
        }, 300);
    }
});

// Also run when trainer page becomes active
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const trainerPage = document.getElementById('trainerPage');
                if (trainerPage && trainerPage.classList.contains('active')) {
                    console.log('Trainer page became active, checking initialization...');
                    const container = document.getElementById('freeTrainers');
                    if (!trainerInitialized || !container?.querySelector('.trainer-item')) {
                        initializeTrainer();
                    }
                }
            }
        });
    });
    
    const trainerPage = document.getElementById('trainerPage');
    if (trainerPage) {
        observer.observe(trainerPage, { attributes: true });
    }
});

// Global exports
window.switchTrainerType = switchTrainerType;
window.initializeTrainer = initializeTrainer;
window.updateTrainerLanguage = updateTrainerLanguage;
window.generateAllTrainerContent = generateAllTrainerContent;
window.trainerInitialized = trainerInitialized;

console.log('✅ Trainer.js loaded and ready');
