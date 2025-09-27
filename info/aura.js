// Aura functionality with multilingual support

let auraCurrentLanguage = 'en';
let auraTranslations = null;
let auraInitialized = false;

// Get language from localStorage
function getCurrentLanguage() {
    return localStorage.getItem('armHelper_language') || 'en';
}

// Load translations from external file
async function loadAuraTranslations() {
    if (auraTranslations) return auraTranslations;
    
    try {
        const response = await fetch('languages/aura.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        auraTranslations = await response.json();
        console.log('✅ Aura translations loaded');
    } catch (error) {
        console.error('❌ Failed to load aura translations:', error);
        throw error;
    }
    return auraTranslations;
}

// Update language
function updateAuraLanguage(newLanguage) {
    console.log(`🌟 Aura language: ${auraCurrentLanguage} → ${newLanguage}`);
    
    if (newLanguage === auraCurrentLanguage) return;
    auraCurrentLanguage = newLanguage;
    
    // Update title
    const titleElement = document.querySelector('.aura-page .title');
    if (titleElement && auraTranslations?.[newLanguage]) {
        titleElement.textContent = auraTranslations[newLanguage].title;
    }
    
    // Regenerate content
    if (auraInitialized) {
        setTimeout(generateAuraContent, 100);
    }
}

// Generate content
async function generateAuraContent() {
    const container = document.getElementById('auraContainer');
    if (!container) return console.error('❌ Aura container not found');
    
    auraCurrentLanguage = getCurrentLanguage();
    
    try {
        if (!auraTranslations) await loadAuraTranslations();
        
        const data = auraTranslations[auraCurrentLanguage];
        if (!data) {
            throw new Error(`No aura data for language: ${auraCurrentLanguage}`);
        }
        
        // Show loading
        container.innerHTML = `<div class="aura-loading">${data.loading}</div>`;
        
        await new Promise(resolve => setTimeout(resolve, 300));
        container.innerHTML = '';
        
        // Create aura items
        data.auras.forEach((aura, index) => {
            const item = document.createElement('div');
            item.className = 'aura-item';
            item.style.animationDelay = `${index * 0.05}s`;
            
            // Generate description with stats
            const description = data.description
                .replace('%', `${aura.strength}%`)
                .replace('%', `${aura.luck}%`)
                .replace('%', `${aura.speed}%`);
            
            const photoHtml = aura.image 
                ? `<img src="${aura.image}" alt="${aura.name}" onerror="this.parentElement.innerHTML='<div class=\\'aura-photo-placeholder\\'>No Image</div>'">`
                : '<div class="aura-photo-placeholder">No Image</div>';
            
            item.innerHTML = `
                <div class="aura-photo">
                    ${photoHtml}
                </div>
                <div class="aura-content">
                    <div class="aura-name">${aura.name}</div>
                    <div class="aura-description">${description}</div>
                </div>
                <div class="aura-rarity ${aura.rarity}">${aura.rarity}</div>
            `;
            container.appendChild(item);
        });
        
        console.log(`✅ Generated ${data.auras.length} auras in ${auraCurrentLanguage}`);
    } catch (error) {
        console.error('❌ Error generating auras:', error);
        container.innerHTML = `
            <div class="aura-error">
                ⚠️ Error loading aura data<br>
                <button class="retry-btn" onclick="generateAuraContent()">Retry</button>
            </div>
        `;
    }
}

// Initialize aura
async function initializeAura() {
    console.log('🌟 Initializing aura...');
    
    const container = document.getElementById('auraContainer');
    if (auraInitialized && container?.querySelector('.aura-item')) {
        console.log('🌟 Already initialized');
        return;
    }
    
    auraCurrentLanguage = getCurrentLanguage();
    
    try {
        await loadAuraTranslations();
        
        // Update title
        const titleElement = document.querySelector('.aura-page .title');
        if (titleElement && auraTranslations[auraCurrentLanguage]) {
            titleElement.textContent = auraTranslations[auraCurrentLanguage].title;
        }
        
        await generateAuraContent();
        auraInitialized = true;
        window.auraInitialized = true;
        console.log('✅ Aura initialized');
    } catch (error) {
        console.error('❌ Failed to initialize aura:', error);
        const container = document.getElementById('auraContainer');
        if (container) {
            container.innerHTML = `
                <div class="aura-error">
                    ⚠️ Failed to load aura data<br>
                    <button class="retry-btn" onclick="initializeAura()">Retry</button>
                </div>
            `;
        }
    }
}

// Event listeners
document.addEventListener('languageChanged', (e) => {
    if (e.detail?.language) updateAuraLanguage(e.detail.language);
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const page = document.getElementById('auraPage');
        if (page?.classList.contains('active')) initializeAura();
    }, 100);
});

document.addEventListener('click', (e) => {
    if (e.target?.getAttribute('data-page') === 'aura') {
        setTimeout(() => {
            const container = document.getElementById('auraContainer');
            if (!auraInitialized || !container?.querySelector('.aura-item')) {
                initializeAura();
            }
        }, 300);
    }
});

// Global exports
window.initializeAura = initializeAura;
window.updateAuraLanguage = updateAuraLanguage;
window.generateAuraContent = generateAuraContent;
window.auraInitialized = auraInitialized;

console.log('✅ Aura.js loaded and ready');
